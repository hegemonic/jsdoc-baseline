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

/** @module lib/template */

var _ = require('underscore-contrib');
var beautify = require('js-beautify').html;
var fs = require('jsdoc/fs');
var logger = require('jsdoc/util/logger');
var path = require('jsdoc/path');
var Polyglot = require('node-polyglot');
var stripJsonComments = require('strip-json-comments');
var Swig = require('swig').Swig;

// TODO: export this (move if necessary)
// Paths are relative to the main template directory
var defaultConfig = {
    components: {
        summary: true
    },
    cssClassMap: './styles/classmap.json',
    dateFormat: 'MMMM D, YYYY',
    locale: 'en',
    outputSourceFiles: true,
    resourcePath: './lang'
};
var hasOwnProp = Object.prototype.hasOwnProperty;

function loadJson(filepath) {
    var parsedObject;

    try {
        if (filepath) {
            parsedObject = JSON.parse(stripJsonComments(fs.readFileSync(filepath, 'utf8')));
        }
    }
    catch (e) {
        logger.fatal('Unable to load the file %s: %s', filepath, e);
    }

    return parsedObject;
}

function loadConfig(filepath, templatePath) {
    var config = _.defaults(loadJson(filepath) || {}, defaultConfig);

    config.resourceFile = config.resourceFile || path.join(templatePath, config.resourcePath,
        config.locale + '.json');

    return config;
}

var Template = module.exports = function Template(templatePath, optionsFile) {
    this.config = loadConfig(optionsFile, templatePath);
    this.cssClasses = loadJson(path.resolve(templatePath, this.config.cssClassMap));
    this.l10n = new Polyglot({ locale: this.config.locale });
    this.path = templatePath;
    this.swig = null;
    this.views = {};

    this.loadResources();
};

/**
 * Load resources that the template requires, including Swig views, Swig tags, Swig helper
 * functions, and translation strings.
 *
 * @returns {this}
 */
Template.prototype.loadResources = function loadResources() {
    // TODO: use DI for helper path
    var Helpers = require(path.join(this.path, 'lib/helpers'));
    var locals = {};
    var self = this;
    // TODO: use DI for filter path; maybe make this an instance for consistency
    var swigFilters = require(path.join(this.path, 'lib/filters'));
    var swigHelpers = new Helpers(this);
    // TODO: use DI for loader path; maybe make this an instance for consistency
    var swigLoader = require(path.join(this.path, 'lib/loader'));
    // TODO: use DI for tag path; maybe make this an instance for consistency
    var swigTags = require(path.join(this.path, 'lib/tags'));

    // load the string resources
    this.l10n.extend(loadJson(path.resolve(this.path, this.config.resourceFile)));

    // bind `this` in the helper methods so they work correctly
    Object.keys(Helpers.prototype).forEach(function(key) {
        if (typeof Helpers.prototype[key] === 'function') {
            locals[key] = swigHelpers[key].bind(swigHelpers);
        }
        else {
            locals[key] = swigHelpers[key];
        }
    });

    this.swig = new Swig({
        locals: locals,
        loader: swigLoader()
    });

    // define the filters that templates can use
    Object.keys(swigFilters).forEach(function(filter) {
        self.swig.setFilter(filter, swigFilters[filter]);
    });

    // define the extra tags that templates can use
    Object.keys(swigTags).forEach(function(tag) {
        self.swig.setTag(tag, swigTags[tag].parse, swigTags[tag].compile, swigTags[tag].ends,
            swigTags[tag].blockLevel);
    });

    // load the base views
    this.addViews(fs.ls(path.join(this.path, 'views'), 0));

    logger.debug('Initialized the template in %s with config: %j', this.path, this.config);

    return this;
};

/**
 * Add one or more views to the template.
 *
 * @param {Array.<string>} views - The paths to the views.
 * @returns {this}
 */
Template.prototype.addViews = function addViews(views) {
    var self = this;

    views.forEach(function(view) {
        logger.debug('Loading the view %s', path.relative(self.path, view));
        var basename = path.basename(view);
        var name = basename.replace(path.extname(basename), '');

        self.views[name] = self.swig.compileFile(view);
    });

    return this;
};

Template.prototype.render = function render(viewName, data, options) {
    var beautifyOptions;
    var rendered;

    if (!hasOwnProp.call(this.views, viewName)) {
        logger.fatal('Cannot render output with unknown view %s', viewName);
        return '';
    }

    options = options || {};
    rendered = this.views[viewName](data);

    // TODO: also need to normalize whitespace in tags where that's okay
    if (options.beautify !== false) {
        /*eslint camelcase:0 */
        beautifyOptions = {
            indent_size: 2,
            // js-beautify ignores the value 0 because it's falsy
            max_preserve_newlines: 0.1
        };
        rendered = beautify(rendered, beautifyOptions);
    }

    return rendered;
};
