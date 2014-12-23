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

/**
 * Localizes strings using a translation file.
 * @module lib/translate
 */

// ECMA-402 polyfill
if (!global.Intl) {
    global.Intl = require('intl');
}

var _ = require('underscore');
var config = require('./config');
var fs = require('fs');
var IntlMessageFormat = require('intl-messageformat');
var logger = require('jsdoc/util/logger');
var path = require('path');
var yaml = require('js-yaml');

var l10nData = {};
var l10nFormatters = {};

function l10nLoad(basepath, filepath, locale) {
    filepath = path.resolve(basepath, path.join(filepath, locale + '.yaml'));

    try {
        return yaml.load(fs.readFileSync(filepath, 'utf8'));
    } catch (e) {
        logger.fatal('Unable to load the L10N resource file %s: %s', filepath, e);
        return {};
    }
}

module.exports = function(key, opts) {
    var conf = config();
    var formatString;
    var locale = conf.locale;
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

    if (!{}.hasOwnProperty.call(l10nData, locale)) {
        l10nData[locale] = l10nLoad(conf.path, conf.l10nPath, locale);
        l10nFormatters[locale] = {};
    }

    if (!{}.hasOwnProperty.call(l10nFormatters[locale], key)) {
        formatString = _.getPath(l10nData[locale], key);

        if (!formatString) {
            logger.warn('Unable to find a localized string for the key %s', key);
            return '';
        }

        l10nFormatters[locale][key] = new IntlMessageFormat(formatString, locale);
    }
    translation = l10nFormatters[locale][key].format(options);

    // the translation normally comes with a trailing newline
    return translation.replace(/\n$/, '');
};
