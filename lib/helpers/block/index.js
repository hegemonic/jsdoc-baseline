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

/**
 * Block helpers for use in Handlebars templates. A block helper determines how, or whether, its
 * contents will be rendered, based on the values passed to the helper. It can also wrap its
 * contents with additional text.
 *
 * @module lib/helpers/block
 */

var _ = require('underscore-contrib');
var handlebars = require('handlebars');
var name = require('jsdoc/name');
var util = require('util');

var SafeString = handlebars.SafeString;

var SCOPE_PUNC = name.SCOPE.PUNC;

function fakeMarkdown(text) {
    // if the text uses standalone <p> tags to delimit paragraphs, Javadoc-style, fix them up
    if (/<p>/.test(text) && !/<\/p>/.test(text)) {
        text = text.replace(/<p>/g, '</p><p>');
    }

    // if the text isn't already wrapped in a <p> tag, add one
    if (!/^<p>/.test(text)) {
        text = '<p>' + text + '</p>';
    }

    return text;
}

module.exports = function(template) {
    var markdownParser = template.config.markdown ?
        require('jsdoc/util/markdown').getParser() :
        fakeMarkdown;

    return {
        all: function() {
            var args = [].slice.call(arguments, 0);
            var options = args.pop();

            if (!args.length || !args.every(function(arg) {
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
        // called by Handlebars when a view refers to an unknown block helper
        blockHelperMissing: function() {
            var options = [].slice.call(arguments).pop();
            var message = util.format('The helper "%s" is unknown. Cannot compile template.',
                options.name);

            throw new Error(message);
        },
        /**
         * Test whether a single string matches any of a series of additional strings.
         *
         * @example
         * {{#contains data.foo data.bar value='baz'}}
         *     <p>There's a match!</p>
         * {{/contains}}
         * @param {string} value - The value to check for.
         * @param {...(string|Array.<string>)} series - A value in the series of additional values.
         */
        contains: function() {
            var args = _.flatten([].slice.call(arguments, 0));
            var options = args.pop();
            var value = options.hash.value;

            if (!value) {
                throw new Error('The "contains" helper requires a "value" option.');
            }

            if (args.indexOf(value) === -1) {
                return options.inverse(this);
            }

            return options.fn(this);
        },
        /**
         * Group a tree of doclets into logical sections, then iterate over the sections, providing
         * a `@longname` private variable as a heading for the section.
         *
         * To identify logical sections, this method looks for the longname of the most recent
         * ancestor that is the parent of multiple doclets, and that is neither an inner member nor
         * an instance member.
         *
         * @param {Object} items - A tree of doclets, in the format returned by JSDoc's
         * {@link module:jsdoc/util/templateHelper.longnamesToTree} method.
         * @return {Object.<string, <Array.<Object>>>} A dictionary containing the grouped doclets.
         */
        eachIndexGroup: function(items, options) {
            var data = handlebars.createFrame(options.data || {});
            var docletBuffer = [];
            var indexGroups = {};

            function visit(item) {
                Object.keys(item).forEach(function(key) {
                    var currentItem = item[key];
                    var childKeys = currentItem.children ? Object.keys(currentItem.children) :
                        null;
                    var nameKey;
                    var previousMemberof;
                    var shortened = {
                        previous: null,
                        current: null,
                        next: null
                    };
                    var tempBuffer;

                    if (!childKeys) {
                        tempBuffer = docletBuffer.splice(0, docletBuffer.length);
                        tempBuffer.push(currentItem.doclet);

                        do {
                            previousMemberof = shortened.current ? shortened.current.memberof :
                                currentItem.longname;

                            shortened.previous = shortened.current;
                            shortened.current = name.shorten(previousMemberof);
                            shortened.next = shortened.current.memberof ?
                                name.shorten(shortened.current.memberof) :
                                null;
                        } while (
                            shortened.next &&
                            (shortened.next.scope === SCOPE_PUNC.INNER ||
                                shortened.next.scope === SCOPE_PUNC.INSTANCE)
                        );

                        nameKey = shortened.current.memberof || shortened.current.name;
                        indexGroups[nameKey] = (indexGroups[nameKey] || []).concat(tempBuffer);
                    } else {
                        if (currentItem.doclet) {
                            docletBuffer.push(currentItem.doclet);
                        }
                        visit(currentItem.children);
                    }
                });
            }

            visit(items);

            return Object.keys(indexGroups).sort().map(function(indexGroup) {
                var currentGroup = indexGroups[indexGroup];

                data.longname = name.stripNamespace(currentGroup[0].longname);
                return options.fn(indexGroups[indexGroup], { data: data });
            }, this).join('');
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
        markdown: function(options) {
            var text = options.fn(this);

            return new SafeString(markdownParser(text));
        },
        markdownLinks: function(options) {
            var text = options.fn(this);

            // don't convert text that does not appear to contain Markdown links
            // (but wrap it in a <p> tag for consistency with Markdown-parsed text)
            if (text.indexOf('[') === -1) {
                return new SafeString('<p>' + text + '</p>');
            }

            return new SafeString(markdownParser(text));
        },
        withOnly: function(options) {
            var context = handlebars.createFrame(options.hash);

            return options.fn(context);
        }
    };
};
