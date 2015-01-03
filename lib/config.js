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

// Paths are relative to the main template directory
exports.defaultConfig = {
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

exports.loadJson = function(filepath) {
    var parsedObject;

    try {
        if (filepath) {
            parsedObject = JSON.parse(stripJsonComments(fs.readFileSync(filepath, 'utf8')));
        }
    } catch (e) {
        logger.fatal('Unable to load the file %s: %s', filepath, e);
    }

    return parsedObject;
};

exports.loadConfig = function(filepath, templatePath) {
    var config = _.defaults(exports.loadJson(filepath) || {}, exports.defaultConfig);

    config.resourceFile = config.resourceFile || path.join(templatePath, config.resourcePath,
        config.locale + '.yaml');
    config.templatePath = templatePath;

    return config;
};
