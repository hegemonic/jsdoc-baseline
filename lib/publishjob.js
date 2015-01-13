/*
    Copyright 2014-2015 Google Inc. All rights reserved.

    Licensed under the Apache License, Version 2.0 (the "License");
    you may not use this file except in compliance with the License.
    You may obtain a copy of the License at

        http://www.apache.org/licenses/LICENSE-2.0

    Unless required by applicable law or agreed to in writing, software
    distributed under the License is distributed on an "AS IS" BASIS,
    WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
    See the License for the specific language governing permissions and
    limitations under the License.
*/
'use strict';

/** @module lib/publishjob */

var _ = require('underscore-contrib');
var Filter = require('jsdoc/src/filter').Filter;
var fs = require('jsdoc/fs');
var helper = require('jsdoc/util/templateHelper');
var logger = require('jsdoc/util/logger');
var name = require('jsdoc/name');
var path = require('jsdoc/path');
var Scanner = require('jsdoc/src/scanner').Scanner;

var finders;

// loaded by the file finder
var ENUMS;
var CATEGORIES;
var OUTPUT_FILE_CATEGORIES;

// set up modules that cannot be preloaded
function init() {
    if (!ENUMS) {
        finders = {
            // this finder should exist by the time we get here
            modules: require('./filefinder').get('modules')
        };
        ENUMS = finders.modules.require('./enums');
        CATEGORIES = ENUMS.CATEGORIES;
        OUTPUT_FILE_CATEGORIES = ENUMS.OUTPUT_FILE_CATEGORIES;
    }
}

var PublishJob = module.exports = function(template, options) {
    // directories created by the publish job
    this.outputDirectories = {};
    this.templateConfig = template.config;

    this.options = options;
    this.destination = this.options.destination;
    this.package = null;
    this.template = template.init();
    this.renderOptions = {
        beautify: this.templateConfig.beautify
    };

    init();

    // claim some special filenames in advance
    // TODO: we used to avoid calling `registerLink` on `index`; okay that we do it now?
    // if not, should we stop registering `global`, too?
    this.indexUrl = helper.getUniqueFilename('index');
    helper.registerLink('index', this.indexUrl);
    this.globalUrl = helper.getUniqueFilename('global');
    helper.registerLink('global', this.globalUrl);
};

PublishJob.prototype.setPackage = function(packageDoclet) {
    this.package = packageDoclet;

    return this;
};

PublishJob.prototype.copyStaticFiles = function() {
    var userStaticFilter;
    var userStaticPaths;
    var userStaticScanner;

    var destination = this.destination;
    var RECURSE_DEPTH = 10;
    var self = this;
    // start with the master template's path, then use any child templates' paths
    var templateStaticPaths = this.templateConfig.static.slice(0).reverse();

    function copyStaticFile(filepath, staticPath) {
        var relativePath = staticPath ? path.normalize(filepath.replace(staticPath, '')) : filepath;
        var toDir;

        if (relativePath.indexOf(path.sep) === 0) {
            relativePath = relativePath.substr(1);
        }
        toDir = fs.toDir(path.resolve(destination, relativePath));

        self.createOutputDirectory(path.resolve(destination, toDir));
        logger.debug('Copying static file %s to %s', path.relative(self.template.path, filepath),
            toDir);
        fs.copyFileSync(filepath, toDir);
    }

    // copy the template's static files
    templateStaticPaths.forEach(function(staticPath) {
        fs.ls(staticPath, RECURSE_DEPTH).forEach(function(filepath) {
            copyStaticFile(filepath, staticPath);
        });
    });


    // copy user-specified static files
    if (this.templateConfig.staticFiles) {
        userStaticPaths = this.templateConfig.staticFiles.paths || [];
        userStaticFilter = new Filter(this.templateConfig.staticFiles);
        userStaticScanner = new Scanner();

        userStaticPaths.forEach(function(filepath) {
            var extraFiles = userStaticScanner.scan([filepath], RECURSE_DEPTH, userStaticFilter);

            extraFiles.forEach(copyStaticFile);
        });
    }

    return this;
};

PublishJob.prototype.createOutputDirectory = function(relativePath) {
    var newPath = relativePath ? path.resolve(this.destination, relativePath) : this.destination;

    if (!this.outputDirectories[newPath]) {
        logger.debug('Creating the output directory %s', newPath);
        fs.mkPath(newPath);
        this.outputDirectories[newPath] = true;
    }

    return this;
};

PublishJob.prototype.render = function(viewName, data, options) {
    var opts = _.defaults(options, this.renderOptions);

    return this.template.render(viewName, data, opts);
};

// data: whatever the template expects
PublishJob.prototype.generate = function(viewName, data, url) {
    var encoding = this.template.encoding;
    var options = {};
    var output;
    var outputPath = path.join(this.destination, url);

    data.package = data.package || this.package;

    // don't try to beautify non-HTML files
    if (path.extname(url) !== '.html') {
        options.beautify = false;
    }

    logger.debug('Rendering template output for %s with view %s', url, viewName);
    output = this.render(viewName, data, options);

    try {
        this.createOutputDirectory(path.dirname(url));
        fs.writeFileSync(outputPath, output, encoding);
    }
    catch (e) {
        logger.error('Unable to save the output file %s: %s', outputPath, e.message);
    }

    return this;
};

PublishJob.prototype.generateTocData = function(navTree, options) {
    var targets = [];
    var tocData = [];

    options = options || {};

    function TocItem(item, children) {
        this.label = helper.linkto(item.longname, name.stripNamespace(item.name));
        this.id = item.longname;
        this.children = children || [];
    }

    function addItems(data) {
        Object.keys(data).sort().forEach(function(key) {
            var item = data[key];
            var tocEntry;

            if (item) {
                tocEntry = new TocItem(item);

                if (!targets.length) {
                    tocData.push(tocEntry);
                } else {
                    targets[targets.length - 1].children.push(tocEntry);
                }

                targets.push(tocEntry);
                addItems(item.children);
                targets.pop();
            }
        });
    }

    // If there are globals, force their TOC item to come first
    if (options.hasGlobals) {
        addItems({
            'global': {
                name: 'Globals',
                longname: 'global',
                children: []
            }
        });
    }
    addItems(navTree);

    return this.generate('toc', { tocData: tocData }, 'scripts/jsdoc-toc.js');
};

/**
 * Get a tutorial's children recursively.
 *
 * @private
 * @param {module:jsdoc/tutorial.Tutorial} tutorial - The tutorial to use.
 * @return {Array<module:jsdoc/tutorial.Tutorial} The child tutorials.
 */
 function getTutorialChildren(tutorial) {
    var children = tutorial.children;

    tutorial.children.forEach(function (child) {
        children = children.concat(this.getTutorialChildren(child));
    }, this);

    return children;
}

PublishJob.prototype.generateTutorials = function(tutorials) {
    getTutorialChildren(tutorials).forEach(function(child) {
        var title = name.stripNamespace(child.title);
        var tutorialData = {
            pageCategory: CATEGORIES.TUTORIALS,
            pageTitle: title,
            header: title,
            content: child.parse(),
            children: child.children
        };
        var url = helper.tutorialToUrl(child.name);

        this.generate('tutorial', tutorialData, url);
    }, this);

    return this;
};

PublishJob.prototype.generateSourceFiles = function(pathMap) {
    var encoding = this.options.encoding;
    var self = this;
    var url;

    if (this.templateConfig.sourceFiles.generate !== false) {
        Object.keys(pathMap).forEach(function(file) {
            var data = {
                docs: null,
                pageCategory: CATEGORIES.SOURCES,
                pageTitle: pathMap[file]
            };

            // links are keyed to the shortened path
            url = helper.getUniqueFilename(pathMap[file]);
            helper.registerLink(pathMap[file], url);

            try {
                data.docs = helper.htmlsafe(fs.readFileSync(file, encoding));
            }
            catch (e) {
                logger.error('Unable to generate output for source file %s: %s', file, e.message);
                return;
            }

            self.generate('source', data, url);
        });
    } else {
        logger.debug('Pretty-printed source files are disabled; not generating them');
    }

    return this;
};

PublishJob.prototype.generateGlobals = function(globalSymbols) {
    var data;

    if (globalSymbols && globalSymbols.hasDoclets()) {
        data = {
            members: globalSymbols.get(null, { categorize: true }),
            pageCategory: null,
            pageTitle: this.template.translate('headings.' + CATEGORIES.GLOBALS,
                globalSymbols.get().length)
        };

        this.generate('globals', data, this.globalUrl);
    } else {
        logger.debug('Not generating a globals page because no globals were found');
    }

    return this;
};

// TODO: index contents need to change
PublishJob.prototype.generateIndex = function(packages, readme, sortedDoclets) {
    var category;

    var data = {
        docs: sortedDoclets,
        package: packages && packages[0] || null,
        pageTitle: null,
        readme: readme || null
    };

    if (data.package) {
        category = data.package.name;
        if (data.package.version) {
            category += ' ' + data.package.version;
        }
        data.pageTitle = this.template.translate('pageTitle', {
            category: category,
            title: this.template.translate('brandDefault')
        });
    } else {
        data.pageTitle = this.template.translate('brandDefault');
    }

    this.generate('index', data, this.indexUrl);

    return this;
};

PublishJob.prototype.generateByLongname = function(longname, doclets, members) {
    var self = this;

    doclets = doclets || {};

    Object.keys(doclets).forEach(function(category) {
        var data;
        var url;

        // Don't generate output if:
        // + There are no doclets
        // + The current category is not one that gets its own output page
        // + We have a module with the same longname, and the current category isn't modules
        if (!doclets[category].length || OUTPUT_FILE_CATEGORIES.indexOf(category) === -1 ||
            (category !== CATEGORIES.MODULES && doclets[CATEGORIES.MODULES].length)) {
            return;
        }

        url = helper.longnameToUrl[longname];

        data = {
            docs: doclets[category],
            members: members || {},
            pageCategory: category,
            pageTitle: name.stripNamespace(name.shorten(longname).name)
        };

        self.generate('symbol', data, url);
    });

    return this;
};
