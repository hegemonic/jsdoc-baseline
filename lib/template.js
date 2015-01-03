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

// ECMA-402 polyfill
if (!global.Intl) {
    global.Intl = require('intl');
}

/** @module lib/template */

var _ = require('underscore-contrib');
var beautify = require('js-beautify').html;
var fs = require('jsdoc/fs');
var handlebars = require('handlebars');
var handlebarsLayouts = require('handlebars-layouts');
var IntlMessageFormat = require('intl-messageformat');
var logger = require('jsdoc/util/logger');
var path = require('jsdoc/path');
var stripJsonComments = require('strip-json-comments');
var yaml = require('js-yaml');

function loadJson(filepath) {
    var parsedObject;

    try {
        if (filepath) {
            parsedObject = JSON.parse(stripJsonComments(fs.readFileSync(filepath, 'utf8')));
        }
    } catch (e) {
        logger.fatal('Unable to load the file %s: %s', filepath, e);
    }

    return parsedObject;
}

function loadYaml(filepath) {
    var parsedObject;

    try {
        if (filepath) {
            parsedObject = yaml.load(fs.readFileSync(filepath, 'utf8'));
        }
    } catch (e) {
        logger.fatal('Unable to load the file %s: %s', filepath, e);
    }

    return parsedObject;
}

function loadConfig(filepath, defaults, templatePath) {
    var config = _.defaults(loadJson(filepath) || {}, defaults);

    config.resourceFile = config.resourceFile || path.join(templatePath, config.resourcePath,
        config.locale + '.yaml');

    return config;
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
    loader: './lib/loader',
    locale: 'en',
    resourcePath: './lang',
    sourceFiles: {
        generate: true,
        singleLink: true
    },
    views: {
        layouts: [
            './views/layouts'
        ],
        partials: [
            './views/atoms',
            './views/partials'
        ],
        precompiled: './views/index.js'
    }
};

var Template = module.exports = function(templatePath, optionsFile) {
    this.config = loadConfig(optionsFile, defaultConfig, templatePath);
    this.cssClasses = loadJson(path.resolve(templatePath, this.config.cssClassMap));
    this.defaultConfig = defaultConfig;
    this.encoding = this.config.encoding;
    this.ids = {};
    this.l10nData = null;
    this.l10nFormatters = {};
    this.loader = null;
    this.path = templatePath;
    // set later by the publish job
    this.urls = {
        global: null,
        index: null
    };
    this.views = {};
};

/**
 * Initialize the template by configuring its dependencies and loading resource files.
 *
 * @returns {this}
 */
Template.prototype.init = function() {
    this._handlebarsInit()
        ._l10nInit();

    logger.debug('Initialized the template in %s with config: %j', this.path, this.config);

    return this;
};

/**
 * Log a message about the template. Maps JSDoc's built-in logger to Handlebars' logger.
 *
 * @param {string} level - The logging level. May contain one of `DEBUG`, `INFO`, `WARN`, `ERROR`,
 * or `FATAL`.
 * @private
 */
Template.prototype._log = function(level, message) {
    var logMethod = level.toLowerCase();

    if (!logger[logMethod]) {
        logMethod = 'info';
    }

    logger[logMethod](message);
};

/**
 * Set up Handlebars to use the appropriate views, helper functions, and translation strings.
 *
 * @private
 * @returns {this}
 */
Template.prototype._handlebarsInit = function() {
    var helpers = this.config.helpers;
    var precompiled;

    function addInternalHelpers(modulePath) {
        var helperModule = require(path.resolve(this.path, modulePath));
        var instance = helperModule(this);

        Object.keys(instance).forEach(function(key) {
            handlebars.registerHelper(key, instance[key]);
        }, this);
    }

    if (!Array.isArray(helpers)) {
        helpers = [helpers];
    }

    // add external helpers
    handlebarsLayouts(handlebars);

    // add Baseline helpers
    // TODO: set list of known helpers in handlebars
    helpers.forEach(addInternalHelpers, this);

    handlebars.log = this._log.bind(this);

    // load the precompiled views, falling back on the uncompiled views if necessary
    precompiled = this._loadPrecompiledViews();
    if (!precompiled) {
        logger.debug('Precompiled Handlebars views are not available. Using the uncompiled views.');
        this._loadUncompiledViews();
    } else {
        logger.debug('Using precompiled Handlebars views.');
        this._registerCompiledViews(precompiled);
    }

    return this;
};

/**
 * Register the precompiled Handlebars views.
 *
 * @param {Object} views - The precompiled Handlebars views.
 * @returns {this}
 */
Template.prototype._registerCompiledViews = function(views) {
    Object.keys(views).forEach(function(key) {
        this.views[key] = views[key];
    }, this);

    handlebars.registerPartial(this.views);

    return this;
};

/**
 * Load the precompiled Handlebars views, including layouts and partials.
 *
 * @returns {?Object} The precompiled views.
 */
Template.prototype._loadPrecompiledViews = function() {
    try {
        return require(path.resolve(this.path, this.config.views.precompiled));
    } catch (e) {
        return null;
    }
};

/**
 * Load, compile, and register the Handlebars views, including layouts and partials.
 *
 * @returns {this}
 */
Template.prototype._loadUncompiledViews = function() {
    var layouts = [];
    var partials = [];

    // load the view loader
    this.loader = require(path.resolve(this.path, this.config.loader));

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
 * Load the string resources used for localization.
 *
 * @private
 * @returns {this}
 */
Template.prototype._l10nInit = function() {
    this.l10nData = loadYaml(path.resolve(this.path, this.config.resourceFile));

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
 * @param {(Array.<string>|Object)} partials - The paths to the partials, or an object containing
 * the partials.
 * @returns {this}
 */
Template.prototype._addPartials = function(partials) {
    var partialsObject;

    if (!Array.isArray(partials)) {
        partialsObject = partials;
    } else {
        partialsObject = {};

        partials.forEach(function(partial) {
            var name = basenameWithoutExtension(partial);

            partialsObject[name] = this._loadAndCompilePartial(name, partial);
        }, this);
    }

    logger.debug('Adding all partials to Handlebars');
    handlebars.registerPartial(partialsObject);
};

// Load and compile the layout. We can't lazily load these, because Handlebars doesn't allow you to
// provide a custom loader.
// TODO: use precompiled templates when possible!
Template.prototype._loadAndCompileLayout = function(layoutName, filepath) {
    var templateString = this.loader.loadSync(filepath, 'utf8');

    this.views[layoutName] = handlebars.compile(templateString);
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
        templateString = this.loader.loadSync(filepath, 'utf8');

        view = this.views[partialName] = handlebars.compile(templateString);
    }

    return view;
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
    rendered = this.views[viewName](data);

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

Template.prototype.translate = function(key, opts) {
    var formatString;
    var options;
    var translation;

    if (typeof opts === 'number') {
        options = {
            items: opts
        };
    } else {
        options = opts || {};
        if (typeof options.items === 'undefined') {
            options.items = 1;
        }
    }

    if (!{}.hasOwnProperty.call(this.l10nFormatters, key)) {
        formatString = _.getPath(this.l10nData, key);

        if (!formatString) {
            logger.warn('Unable to find a localized string for the key %s', key);
            return '';
        }

        this.l10nFormatters[key] = new IntlMessageFormat(formatString, this.locale);
    }
    translation = this.l10nFormatters[key].format(options);

    // the translation normally comes with a trailing newline
    return translation.replace(/\n$/, '');
};
