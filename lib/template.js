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
var templateHelper = require('jsdoc/util/templateHelper');
var url = require('url');
var yaml = require('js-yaml');

var JSDOC_MISSING_TRANSLATION = require('./enums').JSDOC_MISSING_TRANSLATION;

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

// TODO: export this (move if necessary)
// Paths are relative to the main template directory
var defaultConfig = {
    beautify: true,
    components: {
        summary: true
    },
    cssClassMap: './styles/classmap.json',
    encoding: 'utf-8', // written to <meta> tag in HTML files
    helpers: {
        internalHelpers: [
            './lib/helpers/block',
            './lib/helpers/expression'
        ]
    },
    loader: './lib/loader',
    locale: 'en',
    outputSourceFiles: true,
    resourcePath: './lang',
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
    this.config = loadConfig(optionsFile, defaultConfig, templatePath);
    this.cssClasses = loadJson(path.resolve(templatePath, this.config.cssClassMap));
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

    this.loadResources();
};

/**
 * Given a doclet, get an ID that is unique to that doclet within the associated file in the
 * generated docs.
 *
 * @param {module:jsdoc/doclet.Doclet} doclet - The doclet to use.
 * @return {string} A unique ID for the doclet.
 */
Template.prototype.getId = function(doclet) {
    var fileUrl;

    if (!{}.hasOwnProperty.call(this.ids, doclet.longname)) {
        fileUrl = templateHelper.createLink(doclet);
        this.ids[doclet.longname] = url.parse(fileUrl).hash;
    }

    return this.ids[doclet.longname];
};

/**
 * Load resources that the template requires, including Swig views, Swig tags, Swig helper
 * functions, and translation strings.
 *
 * @returns {this}
 */
Template.prototype.loadResources = function() {
    var internalHelpers = this.config.helpers.internalHelpers;
    var layouts = [];
    var partials = [];

    function addInternalHelpers(modulePath) {
        var helperModule = require(path.resolve(this.path, modulePath));
        var instance = helperModule(this);

        Object.keys(instance).forEach(function(key) {
            handlebars.registerHelper(key, instance[key]);
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

    // load the string resources
    this.l10nData = loadYaml(path.resolve(this.path, this.config.resourceFile));
    // TODO: override handlebars.log()

    // add external helpers
    handlebarsLayouts(handlebars);

    // load the layouts
    this.config.views.layouts.forEach(function(filepath) {
        layouts = layouts.concat(fs.ls(path.resolve(this.path, filepath), 0));
    }, this);
    this.addViews(layouts);

    // load the partials (handlebars-layouts requires that we also load the layouts as partials)
    this.config.views.partials.forEach(function(filepath) {
        partials = partials.concat(fs.ls(path.resolve(this.path, filepath), 0));
    }, this);
    this.addPartials(partials.concat(layouts));

    logger.debug('Initialized the template in %s with config: %j', this.path, this.config);

    return this;
};

// TODO: change to "addLayouts" for consistency, and update instance/local variables accordingly
/**
 * Add one or more layouts to the template.
 *
 * @param {Array.<string>} layouts - The paths to the layouts.
 * @returns {this}
 */
Template.prototype.addViews = function(layouts) {
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
 * @param {Array.<string>} partials - The paths to the partials.
 * @returns {this}
 */
Template.prototype.addPartials = function(partials) {
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

Template.prototype.translate = function(key, opts) {
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
        this.l10nFormatters[key] = new IntlMessageFormat(_.getPath(this.l10nData, key),
            this.locale);
    }
    translation = this.l10nFormatters[key].format(options);

    if (translation === JSDOC_MISSING_TRANSLATION) {
        logger.warn('Unable to find a localized string for the key %s', key);
    }

    // the translation normally comes with a trailing newline
    return translation.replace(/\n$/, '');
};
