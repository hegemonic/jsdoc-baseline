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

var _ = require('underscore');
var fs = require('fs');
var logger = require('jsdoc/util/logger');
var path = require('path');
var stripJsonComments = require('strip-json-comments');

function Config() {
    this._config = null;
}

// Paths are relative to the main template directory
Config.prototype.defaultConfig = {
    beautify: true,
    components: {
        summary: true
    },
    encoding: 'utf-8', // written to <meta> tag in HTML files
    locale: 'en',
    sourceFiles: {
        generate: true,
        singleLink: true
    },
    tables: {
        nestedPropertyTables: true
    }
};

// Paths that child templates can override by calling `exports.set`, while still using the default
// path as a fallback. All values must be arrays!
Config.prototype.protectedConfig = {
    cssClassMap: [
        path.resolve(__dirname, '../styles')
    ],
    helpers: [
        path.resolve(__dirname, './helpers/block'),
        path.resolve(__dirname, './helpers/expression')
    ],
    l10n: [
        path.resolve(__dirname, '../lang')
    ],
    modules: [
        __dirname
    ],
    static: [
        path.resolve(__dirname, '../static')
    ],
    views: {
        layouts: [
            path.resolve(__dirname, '../views/layouts')
        ],
        partials: [
            path.resolve(__dirname, '../views/atoms'),
            path.resolve(__dirname, '../views/partials')
        ],
        precompiled: [
            path.resolve(__dirname, '../views')
        ]
    }
};

Config.prototype.readJsonSync = function(filepath) {
    var parsedObject;

    try {
        if (filepath) {
            parsedObject = JSON.parse(stripJsonComments(fs.readFileSync(filepath, 'utf8')));
        }
    } catch (e) {
        logger.fatal('Unable to read the JSON file %s: %s', filepath, e);
    }

    return parsedObject;
};

Config.prototype.get = function(key) {
    if (typeof key === 'undefined') {
        return this._config;
    }

    return _.getPath(this._config, key);
};

Config.prototype._isProtected = function(key) {
    return typeof _.getPath(this.protectedConfig, key) !== 'undefined';
};

Config.prototype._mergeProtectedArray = function(key, value) {
    var protectedValue = _.getPath(this.protectedConfig, key).slice(0);

    if (!Array.isArray(value)) {
        value = [value];
    }

    protectedValue = value.concat(protectedValue);

    // _.setPath does not mutate the original object:
    // https://github.com/documentcloud/underscore-contrib/issues/184
    this._config = _.setPath(this._config, protectedValue, key.split('.'), {});
};

Config.prototype.set = function(key, value) {
    this._config = this._config || {};

    if (this._isProtected(key)) {
        this._mergeProtectedArray(key, value);
    } else {
        // _.setPath does not mutate the original object:
        // https://github.com/documentcloud/underscore-contrib/issues/184
        this._config = _.setPath(this._config, value, key.split('.'), {});
    }

    return this;
};

Config.prototype.loadSync = function(configPath, templatePath) {
    if (this._config !== null) {
        return this;
    }

    configPath = configPath || global.env.conf.templates.baseline;
    templatePath = templatePath || global.env.opts.template;

    this._config = _.defaults(this.readJsonSync(configPath) || {}, this.defaultConfig,
        this.protectedConfig);

    this._config.l10nFile = this._config.l10nFile || this._config.locale + '.yaml';
    this._config.templatePath = templatePath;

    return this;
};

Config.prototype.reset = function() {
    this._config = null;
};

module.exports = new Config();
