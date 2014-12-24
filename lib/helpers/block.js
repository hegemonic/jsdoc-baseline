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
 * Block helpers for use in Handlebars templates. A block helper determines how, or whether, its
 * contents will be rendered, based on the values passed to the helper. It can also wrap its contents
 * with additional text.
 *
 * @module lib/helpers/block
 */

var handlebars = require('handlebars');
var markdownParser = require('jsdoc/util/markdown').getParser();
var util = require('util');

var SafeString = handlebars.SafeString;

var MIN_ORPHANS = 2;
var NUMBER_OF_GROUPS = 3;

// Find the right number of items to splice from an array, given information about how many items
// have already been spliced and a maximum number of items that can be spliced.
function findSpliceLength(itemCount, currentLength, maxLength) {
    var spliceLength = maxLength - currentLength;

    // if there are orphans, don't leave too few orphans
    if (spliceLength < itemCount && (spliceLength + MIN_ORPHANS > itemCount)) {
        spliceLength = spliceLength - MIN_ORPHANS;
    }

    return spliceLength;
}

// Given an object containing key/value pairs, return a list of values sorted by key.
function sortedValues(obj) {
    return Object.keys(obj).sort().map(function(key) {
        return obj[key];
    });
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
                spliceLength = findSpliceLength(items[categoryKey], groupLength,
                    opts.itemsPerColumn);
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

module.exports = function(template) {
    return {
        all: function() {
            var args = [].slice.call(arguments, 0);
            var options = args.pop();

            if (!args.every(function(arg) {
                return !!arg;
            })) {
                return options.inverse(this);
            }

            return options.fn(this);
        },
        any: function(items, options) {
            if (!items || !items.length) {
                return options.inverse(this);
            }

            return options.fn(this);
        },
        /**
         * Attempts to balance items into N groups so that each group is roughly the same length.
         *
         * The `items` parameter should look similar to the following:
         *
         * ```js
         * {
         *   categoryName1: {
         *     item1: {
         *       // ...
         *     },
         *     item2: {
         *       // ...
         *     }
         *   },
         *   categoryName2: {
         *     item3: {
         *       // ...
         *     }
         *   },
         *   // ...
         * }
         * ```
         *
         * This method does not account for the differing lengths of each item. It assumes that all
         * individual items are the same length as one another.
         *
         * @param {Object} items - A dictionary of categorized items, using the format shown above.
         * @param {number} [groups=3] - The number of groups to create.
         * @return {Array.<Array.<Object>>} A nested array of objects. The outer array's length will
         * match the number of groups that were requested.
         */
        balancedGroup: function(items, options) {
            var categoryKeys = Object.keys(items).sort();
            var data = handlebars.createFrame(options.data || {});
            var groups = (options.hash && options.hash.groups) || NUMBER_OF_GROUPS;
            var itemsPerColumn;
            var totalCount = 0;

            categoryKeys.forEach(function(category) {
                // increment count by the number of items, plus the category name itself
                totalCount += Object.keys(items[category]).length + 1;
            });

            itemsPerColumn = Math.ceil(totalCount / groups);
            data.groups = balanceItems(items, categoryKeys, {
                numberOfGroups: groups,
                itemsPerColumn: itemsPerColumn
            });

            return options.fn(this, {data: data});
        },
        continuedBlock: function(options) {
            var data = handlebars.createFrame(options.data || {});

            // Counter for generating unique IDs
            data.continuedCounter = 0;
            // All groups of items in the "continued" block
            data.continuedGroups = null;
            // Current group of items in the "continued" block
            data.continuedGroup = null;
            // Base string for unique IDs
            data.continuedIdBase = 'index-continued-';
            // Current section key within the current group of items
            data.currentSection = null;
            // Heading text for current section
            data.headingText = null;
            // Next group of items in the "continued" block
            data.nextContinuedGroup = null;
            // Section key that appears at the top of the next column; used to determine whether the
            // current section key is split across columns
            data.nextSectionAfterColumn = null;
            // Previous section key within the current group of items
            data.previousSection = null;

            return options.fn(this, {data: data});
        },
        eachContinuedGroup: function(options) {
            var data = options.data;

            data.continuedGroups = data.groups;

            data.nextSectionAfterColumn = data.nextContinuedGroup ?
                (Object.keys(data.nextContinuedGroup))[0] :
                null;

            return data.continuedGroups.map(function(group, i) {
                data.continuedGroup = group;
                data.nextContinuedGroup = data.continuedGroups[i + 1];

                return options.fn(this);
            }, this).join('');
        },
        eachContinuedGroupSection: function(options) {
            var data = options.data;

            return Object.keys(data.continuedGroup).map(function(section) {
                var headingBaseText = template.translate('alphaList.' + section);
                var rendered;

                if (data.previousSection === headingBaseText) {
                    data.headingText = new SafeString(template.translate('headings.continued', {
                        text: headingBaseText
                    }));
                } else {
                    data.headingText = new SafeString(headingBaseText);
                }

                // TODO: register this ID so we can ensure that it's unique
                data.continuedId = data.continuedIdBase + data.continuedCounter++;
                data.currentSection = headingBaseText;
                data.sectionDoclets = data.continuedGroup[section];

                rendered = options.fn(this);

                data.previousSection = headingBaseText;

                return rendered;
            }, this).join('');
        },
        // called by Handlebars when a view refers to an unknown block helper
        blockHelperMissing: function() {
            var options = [].slice.call(arguments).pop();
            var message = util.format('The helper "%s" is unknown. Cannot compile template.',
                options.name);

            throw new Error(message);
        },
        first: function(items, options) {
            return options.fn(items[0]);
        },
        is: function(first, second, options) {
            if (first !== second) {
                return options.inverse(this);
            }

            return options.fn(this);
        },
        isnt: function(first, second, options) {
            if (first === second) {
                return options.inverse(this);
            }

            return options.fn(this);
        },
        last: function(items, options) {
            return options.fn(items[items.length - 1]);
        },
        // TODO: allow users to disable Markdown
        markdown: function(options) {
            var text = options.fn(this);

            return new SafeString(markdownParser(text));
        },
        // TODO: allow users to disable Markdown
        markdownLinks: function(options) {
            var text = options.fn(this);

            // don't convert text that does not appear to contain Markdown links
            if (text.indexOf('[') === -1) {
                return text;
            }

            return new SafeString(markdownParser(text));
        },
        translateContinued: function(options) {
            var data = options.data;

            return new SafeString(template.translate('continued', {
                text: data.currentSection
            }));
        },
        withOnly: function(options) {
            var context = handlebars.createFrame(options.hash);

            return options.fn(context);
        }
    };
};
