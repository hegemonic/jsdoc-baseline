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

function sortedValues(obj) {
    return Object.keys(obj).sort().map(function(key) {
        return obj[key];
    });
}

function findSpliceLength(itemCount, currentLength, maxLength) {
    var MIN_ORPHANS = 2;

    var spliceLength = maxLength - currentLength;

    if (spliceLength < itemCount && (spliceLength + MIN_ORPHANS > itemCount)) {
        spliceLength = spliceLength - MIN_ORPHANS;
    }

    return spliceLength;
}

function balanceItems(inputItems, categoryKeys, opts) {
    var categoryKey;
    var group;
    var groupLength;
    var groups = [];
    var items = {};
    var spliceLength;
    var values;

    // Flatten each category to a list of values sorted by key
    Object.keys(inputItems).forEach(function(category) {
        items[category] = sortedValues(inputItems[category]);
    });

    for (var i = 0, l = opts.numberOfGroups; i < l; i++) {
        groupLength = 0;
        group = {};
        values = [];

        // add items to the current group until we reach the maximum length (or run out of items)
        do {
            // if the current category is empty, advance to the next category
            categoryKey = (categoryKey && items[categoryKey].length) ?
                categoryKey :
                categoryKeys.shift();

            if (categoryKey) {
                group[categoryKey] = group[categoryKey] || [];

                // add the next set of values
                spliceLength = findSpliceLength(items[categoryKey], groupLength, opts.itemsPerColumn);
                values = items[categoryKey].splice(0, spliceLength);
                group[categoryKey] = group[categoryKey].concat(values);

                // update the total number of items in the current group
                groupLength += values.length;
            }
        } while (groupLength < opts.itemsPerColumn && (categoryKey || categoryKeys.length));

        groups.push(group);
    }

    return groups;
}

// attempts to balance items into groups so that each group is about the same length.
// expects an `items` object like: { categoryName1: { item1: {}, item2: {}... }, ... }.
// assumes that all individual items are the same length as one another.
exports.balancedGroup = function balancedGroup(items, numberOfGroups) {
    var categoryKeys = Object.keys(items).sort();
    var itemsPerColumn;
    // minimum group length to split a group across columns
    var splitThreshold;
    var totalCount = 0;

    categoryKeys.forEach(function(category) {
        totalCount += Object.keys(items[category]).length;
    });

    itemsPerColumn = Math.ceil(totalCount / numberOfGroups);
    splitThreshold = Math.floor(Math.max(10, totalCount * 0.1));

    return balanceItems(items, categoryKeys, {
        numberOfGroups: numberOfGroups,
        itemsPerColumn: itemsPerColumn,
        splitThreshold: splitThreshold
    });
};

exports.group = function group(items, perGroup, numberOfGroups) {
    var grouped = [];
    var toGroup = items.slice(0);

    while (toGroup.length || grouped.length < numberOfGroups) {
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

exports.stripNamespace = function stripNamespace(text) {
    return text.replace(/^[A-Za-z]+:/, '');
};

exports.tutorialLink = function tutorialLink(text) {
    return templateHelper.toTutorial(text);
};
// don't escape HTML
exports.tutorialLink.safe = true;
