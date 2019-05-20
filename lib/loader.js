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
const fs = require('fs');
const util = require('util');

const REGEXP_TAG_ATTRIBUTES = '(?:\\s+[^>]+)?';
const REGEXP_HEADING_OPEN = new RegExp(util.format('<h(%s)?>', REGEXP_TAG_ATTRIBUTES), 'g');
const REGEXP_HEADING_CLOSE = new RegExp('<\\/h>', 'g');
const REGEXP_SECTION_OPEN = new RegExp('<section([^>]*)>', 'g');
const REGEXP_SECTION_CLOSE = new RegExp('<\\/section>', 'g');

const preprocessors = {
    // Replace <h></h> with auto-incremented heading levels
    // (also works if the opening tag has attributes)
    headings(str) {
        return str
            .replace(REGEXP_HEADING_OPEN, '<h{{_headingLevel}}$1>')
            .replace(REGEXP_HEADING_CLOSE, '</h{{_headingLevel}}>');
    },
    // Add a helper to <section> elements so we can auto-increment headings
    sections(str) {
        return str
            .replace(REGEXP_SECTION_OPEN, '<section$1>{{_incrementHeading}}')
            .replace(REGEXP_SECTION_CLOSE, '{{_decrementHeading}}</section>');
    }
};

const preprocess = exports.preprocess = str => {
    Object.keys(preprocessors).forEach(preproc => {
        str = preprocessors[preproc](str);
    });

    return str;
};

exports.loadSync = (filepath, encoding) => preprocess(fs.readFileSync(filepath, encoding));
