/*
    Copyright 2014 Google Inc. All rights reserved.

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

var ENUMS = require('./enums');
var CATEGORIES = ENUMS.CATEGORIES;
var OUTPUT_FILE_CATEGORIES = ENUMS.OUTPUT_FILE_CATEGORIES;

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
    var staticFilter;
    var staticPaths;
    var staticScanner;

    var destination = this.destination;
    var RECURSE_DEPTH = 10;
    var self = this;
    var staticPath = path.join(this.template.path, 'static');

    function copyStaticFile(filepath) {
        var relativePath = path.normalize(filepath.replace(staticPath, ''));
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
    fs.ls(staticPath, RECURSE_DEPTH).forEach(copyStaticFile);

    // copy user-specified static files
    if (this.templateConfig.staticFiles) {
        staticPaths = this.templateConfig.staticFiles.paths || [];
        staticFilter = new Filter(this.templateConfig.staticFiles);
        staticScanner = new Scanner();

        staticPaths.forEach(function(filepath) {
            var extraFiles = staticScanner.scan([filepath], RECURSE_DEPTH, staticFilter);

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

// options: resolveLinks, url
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
 * Get Tutorial Children recursively
 * @param tutorial
 */
PublishJob.prototype.getTutorialChildren = function(tutorial) {
    var children = tutorial.children;
    tutorial.children.forEach(function (child) {
        children = children.concat(this.getTutorialChildren(child));
    }, this);
    return children;
};

PublishJob.prototype.generateTutorials = function(tutorials) {
    this.getTutorialChildren(tutorials).forEach(function(child) {
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
            pageCategory: CATEGORIES.GLOBALS,
            pageTitle: null
        };
        // TODO: don't hardcode the plural form here
        data.pageTitle = this.template.translate('headings.' + CATEGORIES.GLOBALS, 2);

        this.generate('globals', data, this.globalUrl);
    } else {
        logger.debug('Not generating a globals page because no globals were found');
    }

    return this;
};

// TODO: index contents need to change
PublishJob.prototype.generateIndex = function(packages, readme, sortedDoclets) {
    var data = {
        docs: sortedDoclets,
        package: packages && packages[0] || null,
        pageTitle: null,
        readme: readme || null
    };

    if (data.package) {
        data.pageTitle = data.package.name;
        if (data.package.version) {
            data.pageTitle += ' ' + data.package.version;
        }
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
