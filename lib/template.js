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
var moment = require('moment');
var path = require('path');
var Polyglot = require('node-polyglot');
var stripJsonComments = require('strip-json-comments');
var Swig = require('swig').Swig;

var ENUMS = require('./enums');
var CATEGORIES = ENUMS.CATEGORIES;
var JSDOC_MISSING_TRANSLATION = ENUMS.JSDOC_MISSING_TRANSLATION;

// TODO: export this (move if necessary)
var defaultConfig = {
    dateFormat: 'LL',
    locale: 'en',
    outputSourceFiles: true,
    resourcePath: './lang'
};
var hasOwnProp = Object.prototype.hasOwnProperty;

function loadJson(filepath) {
    var result;

    try {
        if (filepath) {
            result = JSON.parse(stripJsonComments(fs.readFileSync(filepath, 'utf8')));
        }
    }
    catch (e) {
        logger.fatal('Unable to load the file %s: %s', filepath, e);
    }

    return result;
}

function loadConfig(filepath, templatePath) {
    var config = _.defaults(loadJson(filepath) || {}, defaultConfig);

    config.resourceFile = config.resourceFile || path.join(templatePath, config.resourcePath,
        config.locale + '.json');

    return config;
}

var Template = module.exports = function Template(templatePath, optionsFile) {
    this.config = loadConfig(optionsFile, templatePath);
    this.l10n = new Polyglot({ locale: this.config.locale });
    this.path = templatePath;
    this.swig = null;
    this.views = {};

    this.init();

    logger.debug('Initialized the template in %s with config: %j', this.path, this.config);
};

/**
 * Initialize the template engine with required configuration values.
 *
 * @returns {this}
 */
Template.prototype.init = function init() {
    var self = this;
    // TODO: allow users to add helpers/filters/tags
    var swigHelpers = require(path.join(this.path, 'helpers'));
    var swigFilters = require(path.join(this.path, 'filters'));
    var swigLoader = require(path.join(this.path, 'loader'));
    var swigTags = require(path.join(this.path, 'tags'));
    var locals;

    // load the string resources
    this.l10n.extend(loadJson(this.config.resourceFile));
    // set locale for localized dates
    moment().lang(this.config.locale);
    // TODO: allow user-specified Moment.js config
    moment.lang('en', {
        longDateFormat: {
            LL: 'MMMM D, YYYY'
        }
    });

    // define local functions that templates can use, and create a Swig instance with those locals
    // TODO: move to helpers.js; turn helpers.js into an instantiable class that takes a Template
    locals = {
        CATEGORIES: CATEGORIES,
        config: function config(key) {
            return _.getPath(self.options, key);
        },
        hasOwnProp: function hasOwnProp() {
            var args = Array.prototype.slice.call(arguments, 0);
            var localSelf = args.shift();

            return Object.prototype.hasOwnProperty.apply(localSelf, args);
        },
        localizedDate: function localizedDate(formatString) {
            return moment().format(formatString || self.config.dateFormat);
        },
        log: logger.debug,
        outputSourceFiles: this.config.outputSourceFiles,
        translate: function(key, opts) {
            var options;
            var result;

            if (typeof opts === 'number') {
                options = { smart_count: opts };
            }
            else {
                options = opts || {};
            }

            options = _.defaults(options, {
                _: JSDOC_MISSING_TRANSLATION,
                smart_count: 1
            });
            result = self.l10n.t(key, options);

            if (result === JSDOC_MISSING_TRANSLATION) {
                logger.warn('Unable to find a localized string for the key %s', key);
            }

            return result;
        }
    };

    Object.keys(swigHelpers).forEach(function(helperMethod) {
        locals[helperMethod] = swigHelpers[helperMethod];
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
