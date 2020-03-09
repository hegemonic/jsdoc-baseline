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
const FileInfo = require('./file-info');
const fs = require('fs-extra');
const glob = require('fast-glob');
const { log } = require('@jsdoc/util');
const path = require('path');
const stripJsonComments = require('strip-json-comments');

function findStaticFiles() {
    const parentPath = path.resolve(__dirname, '../static');
    const globbed = glob.sync('**/*', {
        cwd: parentPath,
        fs,
        onlyFiles: true
    });

    return globbed.map(globbedPath => new FileInfo(parentPath, globbedPath));
}

const defaultConfig = {
    beautify: true,
    cssClassMap: path.resolve(__dirname, '..', 'styles', 'classmap.json'),
    cssClassPrefix: '!',
    components: {
        footer: true,
        summary: true
    },
    encoding: 'utf-8', // written to <meta> tag in HTML files
    helpers: [
        path.resolve(__dirname, 'helpers', 'block'),
        path.resolve(__dirname, 'helpers', 'expression')
    ],
    l10n: path.resolve(__dirname, '..', 'lang'),
    locale: 'en',
    markdown: true,
    modules: [
        __dirname
    ],
    sourceFiles: {
        generate: true,
        singleLink: true
    },
    staticFiles: findStaticFiles(),
    tables: {
        nestedPropertyTables: true
    },
    views: {
        layouts: [
            path.resolve(__dirname, '..', 'views', 'layouts')
        ],
        partials: [
            path.resolve(__dirname, '..', 'views', 'atoms'),
            path.resolve(__dirname, '..', 'views', 'partials')
        ]
    }
};

class Config {
    constructor() {
        this._config = null;
        this.defaultConfig = defaultConfig;
    }

    get(key) {
        if (typeof key === 'undefined') {
            return this._config;
        }

        return _.get(this._config, key);
    }

    set(key, value) {
        this._config = this._config || {};

        _.set(this._config, key, value);

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

        this._config = _.defaults(tempConfig || {}, this.defaultConfig);

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
            log.fatal(`Unable to read the JSON file ${filepath}: ${e}`);
        }

        return parsedObject;
    }
    /* eslint-enable class-methods-use-this */

    reset() {
        this._config = null;
    }
}

module.exports = new Config();
