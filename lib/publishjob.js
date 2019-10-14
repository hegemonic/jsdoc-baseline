/*
    Copyright 2014-2019 Google LLC

    Licensed under the Apache License, Version 2.0 (the "License");
    you may not use this file except in compliance with the License.
    You may obtain a copy of the License at

        https://www.apache.org/licenses/LICENSE-2.0

    Unless required by applicable law or agreed to in writing, software
    distributed under the License is distributed on an "AS IS" BASIS,
    WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
    See the License for the specific language governing permissions and
    limitations under the License.
*/
/** @module lib/publishjob */

const _ = require('lodash');
const Filter = require('jsdoc/src/filter').Filter;
const fs = require('jsdoc/fs');
const helper = require('jsdoc/util/templateHelper');
const logger = require('jsdoc/util/logger');
const name = require('jsdoc/name');
const path = require('jsdoc/path');
const Scanner = require('jsdoc/src/scanner').Scanner;

let finders;

// loaded by the file finder
let ENUMS;
let CATEGORIES;
let OUTPUT_FILE_CATEGORIES;

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

/**
 * Get a tutorial's children recursively.
 *
 * @private
 * @param {module:jsdoc/tutorial.Tutorial} tutorial - The tutorial to use.
 * @return {Array<module:jsdoc/tutorial.Tutorial} The child tutorials.
 */
function getTutorialChildren(tutorial) {
    let children = tutorial.children;

    tutorial.children.forEach(child => {
        children = children.concat(getTutorialChildren(child));
    });

    return children;
}

module.exports = class PublishJob {
    constructor(template, options) {
        // directories created by the publish job
        this.outputDirectories = {};
        this.templateConfig = template.config;

        this.options = options;
        this.destination = this.options.destination;
        this.navTree = null;
        this.package = null;
        this.pageTitlePrefix = '';
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
    }

    setPackage(packageDoclet) {
        this.package = packageDoclet;

        if (this.package && this.package.name) {
            this.pageTitlePrefix = this.template.translate('pageTitlePrefix', {
                name: this.package.name,
                version: this.package.version || ''
            });
        }

        return this;
    }

    setNavTree(navTree) {
        this.navTree = navTree;

        return this;
    }

    setAllLongnamesTree(allLongnamesTree) {
        this.allLongnamesTree = allLongnamesTree;

        return this;
    }

    copyStaticFiles() {
        let userStaticFilter;
        let userStaticPaths;
        let userStaticScanner;

        const destination = this.destination;
        const RECURSE_DEPTH = 10;
        const self = this;
        // start with the master template's path, then use any child templates' paths
        const templateStaticPaths = this.templateConfig.static.slice(0).reverse();

        function copyStaticFile(filepath, staticPath) {
            let relativePath = staticPath ?
                path.normalize(filepath.replace(staticPath, '')) :
                filepath;
            let toDir;

            if (relativePath.indexOf(path.sep) === 0) {
                relativePath = relativePath.substr(1);
            }
            toDir = fs.toDir(path.resolve(destination, relativePath));

            self.createOutputDirectory(path.resolve(destination, toDir));
            logger.debug('Copying static file %s to %s',
                path.relative(self.template.path, filepath),
                toDir);
            fs.copyFileSync(filepath, toDir);
        }

        // copy the template's static files
        templateStaticPaths.forEach(staticPath => {
            fs.ls(staticPath, RECURSE_DEPTH).forEach(filepath => {
                copyStaticFile(filepath, staticPath);
            });
        });


        // copy user-specified static files
        if (this.templateConfig.staticFiles) {
            userStaticPaths = this.templateConfig.staticFiles.paths || [];
            userStaticFilter = new Filter(this.templateConfig.staticFiles);
            userStaticScanner = new Scanner();

            userStaticPaths.forEach(filepath => {
                const extraFiles = userStaticScanner.scan([filepath], RECURSE_DEPTH,
                    userStaticFilter);

                extraFiles.forEach(copyStaticFile);
            });
        }

        return this;
    }

    createOutputDirectory(relativePath) {
        const newPath = relativePath ?
            path.resolve(this.destination, relativePath) :
            this.destination;

        /* istanbul ignore else */
        if (!this.outputDirectories[newPath]) {
            logger.debug('Creating the output directory %s', newPath);
            fs.mkPath(newPath);
            this.outputDirectories[newPath] = true;
        }

        return this;
    }

    render(viewName, data, options) {
        const opts = _.defaults(options, this.renderOptions);

        return this.template.render(viewName, data, opts);
    }

    // `data` is whatever the template expects.
    generate(viewName, data, url) {
        const encoding = this.template.encoding;
        const options = {};
        let output;
        const outputPath = path.join(this.destination, url);

        data.package = data.package || this.package;

        // Don't try to beautify non-HTML files.
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
    }

    generateTocData(options) {
        const navTree = this.navTree;
        const targets = [];
        const tocData = [];

        options = options || {};

        class TocItem {
            constructor(item, children) {
                this.label = helper.linkto(item.longname, name.stripNamespace(item.name));
                this.id = item.longname;
                this.children = children || [];
            }
        }

        function addItems(data) {
            Object.keys(data).sort().forEach(key => {
                const item = data[key];
                let tocEntry;

                if (item) {
                    tocEntry = new TocItem(item);

                    if (!targets.length) {
                        tocData.push(tocEntry);
                    } else {
                        targets[targets.length - 1].children.push(tocEntry);
                    }

                    targets.push(tocEntry);
                    if (item.children) {
                        addItems(item.children);
                    }
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

        return this.generate('toc', { tocData }, 'scripts/jsdoc-toc.js');
    }

    generateTutorials(tutorials) {
        getTutorialChildren(tutorials).forEach(function(child) {
            const title = name.stripNamespace(child.title);
            const tutorialData = {
                pageCategory: CATEGORIES.TUTORIALS,
                pageTitle: title,
                pageTitlePrefix: this.pageTitlePrefix,
                header: title,
                tutorialContent: child.content,
                tutorialChildren: child.children
            };
            const url = helper.tutorialToUrl(child.name);

            this.generate('tutorial', tutorialData, url);
        }, this);

        return this;
    }

    generateSourceFiles(pathMap) {
        const encoding = this.options.encoding;
        const self = this;
        let url;

        if (this.templateConfig.sourceFiles.generate !== false) {
            Object.keys(pathMap).forEach(function(file) {
                const data = {
                    docs: null,
                    pageCategory: CATEGORIES.SOURCES,
                    pageTitle: pathMap[file],
                    pageTitlePrefix: this.pageTitlePrefix
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
            }, this);
        } else {
            logger.debug('Pretty-printed source files are disabled; not generating them');
        }

        return this;
    }

    generateGlobals(globalSymbols) {
        let data;
        const title = this.template.translate(`headings.${CATEGORIES.GLOBALS}`,
            globalSymbols.get().length);

        if (globalSymbols && globalSymbols.hasDoclets()) {
            data = {
                members: globalSymbols.get(null, { categorize: true }),
                pageCategory: null,
                pageHeading: title,
                pageTitle: this.template.translate('pageTitleNoCategory', {
                    prefix: this.pageTitlePrefix,
                    title
                }),
                pageTitlePrefix: this.pageTitlePrefix
            };

            this.generate('globals', data, this.globalUrl);
        } else {
            logger.debug('Not generating a globals page because no globals were found');
        }

        return this;
    }

    // TODO: index contents need to change
    generateIndex(readme) {
        const data = {
            allLongnamesTree: this.allLongnamesTree,
            package: this.package,
            pageTitle: this.template.translate('pageTitleNoCategory', {
                prefix: this.pageTitlePrefix,
                title: this.template.translate('brandDefault')
            }),
            readme: readme || null
        };

        this.generate('index', data, this.indexUrl);

        return this;
    }

    generateByLongname(longname, doclets, members) {
        Object.keys(doclets).forEach(function(category) {
            let data;
            let url;

            doclets = doclets || {};

            // Don't generate output if:
            // + There are no doclets
            // + The current category is not one that gets its own output page
            // + We have a module with the same longname, and the current category isn't modules
            if (!doclets[category].length || !OUTPUT_FILE_CATEGORIES.includes(category) ||
                (category !== CATEGORIES.MODULES && doclets[CATEGORIES.MODULES].length)) {
                return;
            }

            url = helper.longnameToUrl[longname];

            data = {
                docs: doclets[category],
                members: members || {},
                pageCategory: category,
                pageTitle: name.stripNamespace(name.shorten(longname).name),
                pageTitlePrefix: this.pageTitlePrefix
            };

            this.generate('symbol', data, url);
        }, this);

        return this;
    }
};
