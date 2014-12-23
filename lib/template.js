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
var config = require('./config');
var fs = require('jsdoc/fs');
var handlebars = require('handlebars').create();
var handlebarsLayouts = require('handlebars-layouts');
var logger = require('jsdoc/util/logger');
var path = require('jsdoc/path');
var stripJsonComments = require('strip-json-comments');

function loadJson(filepath) {
    try {
        if (filepath) {
            return JSON.parse(stripJsonComments(fs.readFileSync(filepath, 'utf8')));
        } else {
            return {};
        }
    } catch (e) {
        logger.fatal('Unable to load the file %s: %s', filepath, e);
        return {};
    }
}

function loadConfig(filepath, defaults) {
    return _.defaults(loadJson(filepath), defaults);
}

function basenameWithoutExtension(filepath) {
    var basename = path.basename(filepath);
    return basename.replace(path.extname(basename), '');
}

// Paths are relative to the main template directory
var defaultConfig = {
    beautify: true,
    components: {
        summary: true
    },
    cssClassMap: './styles/classmap.json',
    encoding: 'utf-8', // written to <meta> tag in HTML files
    helpers: [
        './lib/helpers/block',
        './lib/helpers/expression'
    ],
    l10nPath: './lang',
    loader: './lib/loader',
    locale: 'en',
    outputSourceFiles: true,
    views: {
        layouts: [
            './views/layouts'
        ],
        partials: [
            './views/atoms',
            './views/partials'
        ]
    }
};

var Template = module.exports = function(templatePath, optionsFile) {
    var conf = config();

    this.config = loadConfig(optionsFile, defaultConfig);
    this.cssClasses = this.config.cssClasses = loadJson(path.resolve(templatePath,
        this.config.cssClassMap));
    this.encoding = this.config.encoding;
    this.ids = {};
    this.l10nFormatters = {};
    this.loader = null;
    this.path = this.config.path = templatePath;
    // set later by the publish job
    this.urls = {
        global: null,
        index: null
    };
    this.views = {};

    // set up shared configuration object
    // TODO: this doesn't scale; should we just share the whole thing?
    conf.cssClasses = this.config.cssClasses;
    conf.l10nPath = this.config.l10nPath;
    conf.locale = this.config.locale;
    conf.path = this.config.path;
};

module.exports.defaultConfig = defaultConfig;

/**
 * Initialize the template by configuring its dependencies and loading resource files.
 *
 * @returns {this}
 */
Template.prototype.init = function() {
    this._handlebarsInit()
        ._handlebarsLoad();

    logger.debug('Initialized the template in %s with config: %j', this.path, this.config);

    return this;
};

/**
 * Set up Handlebars to use the appropriate helper functions.
 *
 * @private
 * @returns {this}
 */
Template.prototype._handlebarsInit = function() {
    var internalHelpers = this.config.helpers;

    function addInternalHelpers(modulePath) {
        var helperModule = require(path.resolve(this.path, modulePath));

        Object.keys(helperModule).forEach(function(key) {
            handlebars.registerHelper(key, helperModule[key]);
        }, this);
    }

    if (!Array.isArray(internalHelpers)) {
        internalHelpers = [internalHelpers];
    }

    // add Baseline helpers
    // TODO: set list of known helpers in handlebars
    internalHelpers.forEach(addInternalHelpers, this);

    // load the view loader
    this.loader = require(path.resolve(this.path, this.config.loader));

    // TODO: override handlebars.log()

    // add external helpers
    handlebarsLayouts(handlebars);

    return this;
};

/**
 * Load and compile the Handlebars layouts and partials.
 *
 * @private
 * @returns {this}
 */
Template.prototype._handlebarsLoad = function() {
    var layouts = [];
    var partials = [];

    // load the layouts
    this.config.views.layouts.forEach(function(filepath) {
        layouts = layouts.concat(fs.ls(path.resolve(this.path, filepath), 0));
    }, this);
    this._addLayouts(layouts);

    // load the partials (handlebars-layouts requires that we also load the layouts as partials)
    this.config.views.partials.forEach(function(filepath) {
        partials = partials.concat(fs.ls(path.resolve(this.path, filepath), 0));
    }, this);
    this._addPartials(partials.concat(layouts));

    return this;
};

/**
 * Add layouts to the template.
 *
 * @private
 * @param {Array.<string>} layouts - The paths to the layouts.
 * @returns {this}
 */
Template.prototype._addLayouts = function(layouts) {
    layouts.forEach(function(layout) {
        var name = basenameWithoutExtension(layout);

        logger.debug('Adding the layout "%s"', name);

        this._loadAndCompileLayout(name, layout);
    }, this);

    return this;
};

/**
 * Add partials to the template. Partials are views that can be embedded within other views.
 *
 * @private
 * @param {Array.<string>} partials - The paths to the partials.
 * @returns {this}
 */
Template.prototype._addPartials = function(partials) {
    var partialsObject = {};

    partials.forEach(function(partial) {
        var name = basenameWithoutExtension(partial);

        partialsObject[name] = this._loadAndCompilePartial(name, partial);
    }, this);

    logger.debug('Adding all partials to Handlebars');
    handlebars.registerPartial(partialsObject);
};

// Load and compile the layout. We can't lazily load these, because Handlebars doesn't allow you to
// provide a custom loader.
// TODO: use precompiled templates when possible!
Template.prototype._loadAndCompileLayout = function(layoutName, filepath) {
    var templateString;
    var view = {};

    templateString = this.loader.loadSync(filepath);
    view.template = handlebars.compile(templateString);
    view.filepath = filepath;

    this.views[layoutName] = view;
};

// Load and compile the partial. We can't lazily load these, because Handlebars doesn't allow you to
// provide a custom loader.
// TODO: use precompiled partials when possible!
Template.prototype._loadAndCompilePartial = function(partialName, filepath) {
    var templateString;
    var view;

    // if we've already compiled the view, no need to recompile it
    if ({}.hasOwnProperty.call(this.views, partialName)) {
        view = this.views[partialName];
    } else {
        view = {};

        templateString = this.loader.loadSync(filepath);
        view.template = handlebars.compile(templateString);
        view.filepath = filepath;

        this.views[partialName] = view;
    }

    return view.template;
};

Template.prototype.render = function(viewName, data, options) {
    var beautifyOptions;
    var i18nData = {
        locales: this.config.locale
    };
    var rendered;

    if (!{}.hasOwnProperty.call(this.views, viewName)) {
        logger.fatal('The view "%s" is unknown. Cannot render output.', viewName);
        return '';
    }

    options = options || {};

    data.intl = i18nData;
    rendered = this.views[viewName].template(data);

    // TODO: do we still need the beautifier?
    // TODO: also need to normalize whitespace in tags where that's okay
    if (options.beautify !== false) {
        /*eslint-disable camelcase */
        beautifyOptions = {
            indent_size: 2,
            // js-beautify ignores the value 0 because it's falsy
            max_preserve_newlines: 0.1
        };
        /*eslint-enable camelcase */
        rendered = beautify(rendered, beautifyOptions);
    }

    return rendered;
};

Template.prototype.translate = require('./translate');
