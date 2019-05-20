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
const _ = require('lodash');
const env = require('jsdoc/env');
const fs = require('fs');
const logger = require('jsdoc/util/logger');
const path = require('path');
const stripJsonComments = require('strip-json-comments');


class Config {
    constructor() {
        this._config = null;

        this.defaultConfig = {
            beautify: true,
            cssClassPrefix: '!',
            components: {
                footer: true,
                summary: true
            },
            encoding: 'utf-8', // written to <meta> tag in HTML files
            locale: 'en',
            markdown: true,
            sourceFiles: {
                generate: true,
                singleLink: true
            },
            tables: {
                nestedPropertyTables: true
            }
        };

        // Paths that child templates can override by calling `exports.set`, while still using the
        // default path as a fallback. Paths are relative to the current module's directory. All
        // values must be arrays!
        this.protectedConfig = {
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
                ]
            }
        };
    }

    get(key) {
        if (typeof key === 'undefined') {
            return this._config;
        }

        return _.get(this._config, key);
    }

    _isProtectedArray(key) {
        return typeof _.get(this.protectedConfig, key) !== 'undefined';
    }

    _mergeProtectedArray(key, value) {
        let protectedValue = _.get(this.protectedConfig, key).slice(0);

        if (!Array.isArray(value)) {
            value = [value];
        }

        protectedValue = value.concat(protectedValue);

        _.set(this._config, key, protectedValue);
    }

    set(key, value) {
        this._config = this._config || {};

        if (this._isProtectedArray(key)) {
            this._mergeProtectedArray(key, value);
        } else {
            _.set(this._config, key, value);
        }

        return this;
    }

    loadSync(configPath, templatePath) {
        let tempConfig;

        if (this._config !== null) {
            return this;
        }

        configPath = configPath || env.conf.templates.baseline;
        templatePath = templatePath || env.opts.template;

        if (typeof configPath === 'string') {
            tempConfig = this.readJsonSync(configPath);
        } else {
            tempConfig = configPath;
        }

        this._config = _.defaults(tempConfig || {}, this.defaultConfig, this.protectedConfig);

        this._config.l10nFile = this._config.l10nFile || `${this._config.locale}.yaml`;
        this._config.templatePath = templatePath;

        return this;
    }

    /* eslint-disable class-methods-use-this */
    readJsonSync(filepath) {
        let parsedObject;

        try {
            if (filepath) {
                parsedObject = JSON.parse(stripJsonComments(fs.readFileSync(filepath, 'utf8')));
            }
        } catch (e) {
            logger.fatal('Unable to read the JSON file %s: %s', filepath, e);
        }

        return parsedObject;
    }
    /* eslint-enable class-methods-use-this */

    reset() {
        this._config = null;
    }
}

module.exports = new Config();
