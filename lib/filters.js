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

var templateHelper = require('jsdoc/util/templateHelper');

var markdownParser = require('jsdoc/util/markdown').getParser();

exports.group = function group(items, perGroup, minimumGroups) {
    var grouped = [];
    var toGroup = items.slice(0);

    while (toGroup.length || grouped.length < minimumGroups) {
        if (toGroup.length) {
            grouped.push(toGroup.splice(0, perGroup));
        }
        else {
            grouped.push([]);
        }
    }

    return grouped;
};

// TODO: allow users to disable Markdown
exports.markdown = function markdown(text) {
    return markdownParser(text);
};
// don't escape HTML
exports.markdown.safe = true;

// TODO: allow users to disable Markdown links
exports.markdownLinks = function markdownLinks(text) {
    // don't convert text that does not appear to contain Markdown links
    if (text.indexOf('[') === -1) {
        return text;
    }

    return markdownParser(text);
};
// don't escape HTML
exports.markdownLinks.safe = true;

exports.resolveAuthorLinks = function resolveAuthorLinks(text) {
    return templateHelper.resolveAuthorLinks(text);
};
// don't escape HTML
exports.resolveAuthorLinks.safe = true;

exports.resolveLinks = function resolveLinks(text) {
    return templateHelper.resolveLinks(text);
};
// don't escape HTML
exports.resolveLinks.safe = true;

exports.tutorialLink = function tutorialLink(text) {
    return templateHelper.toTutorial(text);
};
// don't escape HTML
exports.tutorialLink.safe = true;
