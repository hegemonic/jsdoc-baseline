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

var fs = require('fs');
var util = require('util');

var REGEXP_TAG_ATTRIBUTES = '(?:\\s+[^>]+)?';
var REGEXP_HEADING_OPEN = new RegExp(util.format('<h(%s)?>', REGEXP_TAG_ATTRIBUTES), 'g');
var REGEXP_HEADING_CLOSE = new RegExp('<\\/h>', 'g');
var REGEXP_SECTION_OPEN = new RegExp('<section([^>]*)>', 'g');
var REGEXP_SECTION_CLOSE = new RegExp('<\\/section>', 'g');

var preprocessors = {
    // Replace <h></h> with auto-incremented heading levels
    // (also works if the opening tag has attributes)
    headings: function(str) {
        return str
            .replace(REGEXP_HEADING_OPEN, '<h{{_headingLevel}}$1>')
            .replace(REGEXP_HEADING_CLOSE, '</h{{_headingLevel}}>');
    },
    // Add a helper to <section> elements so we can auto-increment headings
    sections: function(str) {
        return str
            .replace(REGEXP_SECTION_OPEN, '<section$1>{{_incrementHeading}}')
            .replace(REGEXP_SECTION_CLOSE, '{{_decrementHeading}}</section>');
    }
};

var preprocess = exports.preprocess = function(str) {
    Object.keys(preprocessors).forEach(function(preproc) {
        str = preprocessors[preproc](str);
    });

    return str;
};

exports.loadSync = function(filepath, encoding) {
    return preprocess(fs.readFileSync(filepath, encoding));
};
