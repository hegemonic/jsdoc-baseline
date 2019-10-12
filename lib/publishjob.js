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
const fs = require('jsdoc/fs');
const helper = require('jsdoc/util/templateHelper');
const logger = require('jsdoc/util/logger');
const name = require('jsdoc/name');
const path = require('jsdoc/path');

const ENUMS = require('./enums');
const CATEGORIES = ENUMS.CATEGORIES;
const OUTPUT_FILE_CATEGORIES = ENUMS.OUTPUT_FILE_CATEGORIES;

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
        this.template = template;
        this.renderOptions = {
            beautify: this.templateConfig.beautify
        };
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

    generateByLongname(longname, doclets, members) {
        doclets = doclets || {};

        Object.keys(doclets).forEach(function(category) {
            let data;
            let url;

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
