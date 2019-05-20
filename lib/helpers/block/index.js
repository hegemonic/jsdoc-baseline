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
/**
 * Block helpers for use in Handlebars templates. A block helper determines how, or whether, its
 * contents will be rendered, based on the values passed to the helper. It can also wrap its
 * contents with additional text.
 *
 * @module lib/helpers/block
 */

const _ = require('lodash');
const handlebars = require('handlebars');
const name = require('jsdoc/name');
const util = require('util');

const SafeString = handlebars.SafeString;

function fakeMarkdown(text) {
    // if the text uses standalone <p> tags to delimit paragraphs, Javadoc-style, fix them up
    if (/<p>/.test(text) && !/<\/p>/.test(text)) {
        text = text.replace(/<p>/g, '</p><p>');
    }

    // if the text isn't already wrapped in a <p> tag, add one
    if (!/^<p>/.test(text)) {
        text = `<p>${text}</p>`;
    }

    return text;
}

module.exports = ({config}) => {
    const markdownParser = config.markdown ?
        require('jsdoc/util/markdown').getParser() :
        fakeMarkdown;

    return {
        all() {
            const args = [].slice.call(arguments, 0);
            const options = args.pop();

            if (!args.length || !args.every(arg => Boolean(arg))) {
                return options.inverse(this);
            }

            return options.fn(this);
        },
        any(items, options) {
            if (!items || !items.length) {
                return options.inverse(this);
            }

            return options.fn(this);
        },
        // called by Handlebars when a view refers to an unknown block helper
        blockHelperMissing(...args) {
            const options = [].slice.call(args).pop();
            const message = util.format('The helper "%s" is unknown. Cannot compile template.',
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
        contains() {
            const args = _.flatten([].slice.call(arguments, 0));
            const options = args.pop();
            const value = options.hash.value;

            if (!value) {
                throw new Error('The "contains" helper requires a "value" option.');
            }

            if (!args.includes(value)) {
                return options.inverse(this);
            }

            return options.fn(this);
        },
        /**
         * Group a tree of doclets into logical sections, then iterate over the sections, providing
         * a `@groupName` private variable as a heading for the section.
         *
         * To identify logical sections, this method looks for the longname of the most recent
         * ancestor that is the parent of multiple doclets, and that is neither an inner member nor
         * an instance member.
         *
         * @param {Object} items - A tree of doclets, in the format returned by JSDoc's
         * {@link module:jsdoc/util/templateHelper.longnamesToTree} method.
         * @return {Object.<string, <Array.<Object>>>} A dictionary containing the grouped doclets.
         */
        eachIndexGroup(items, options) {
            const data = handlebars.createFrame(options.data || {});
            const indexGroups = {};
            // doclet kinds that always get their own section
            const sectionKinds = [
                'class',
                'interface',
                'module',
                'namespace'
            ];

            function findNameKey({doclet, longname}) {
                let previousMemberof;
                const shortened = {
                    previous: null,
                    current: null,
                    next: null
                };

                // Is the current item of a kind that always gets its own section? If so, just use
                // the doclet's longname as the section name key.
                if (doclet && sectionKinds.includes(doclet.kind)) {
                    return longname;
                }

                // Otherwise, find the appropriate ancestor name to use as the section name key.
                do {
                    previousMemberof = shortened.current ? shortened.current.memberof :
                        longname;

                    shortened.previous = shortened.current;
                    shortened.current = name.shorten(previousMemberof);
                    shortened.next = shortened.current.memberof ?
                        name.shorten(shortened.current.memberof) :
                        null;
                } while (
                    // Keep shortening the name if all of the following are true:
                    // - The current item was a memberof something
                    // - The current item's memberof has a scope attached to it
                    // - The next item's longname is not already being used as a name key
                    shortened.next &&
                    shortened.next.scope !== '' &&
                    !{}.hasOwnProperty.call(indexGroups, shortened.next.longname)
                );

                return shortened.current.memberof || shortened.current.name;
            }

            function visit(item) {
                Object.keys(item).forEach(key => {
                    const currentItem = item[key];
                    const nameKey = findNameKey(currentItem);

                    if (currentItem.doclet) {
                        if (!{}.hasOwnProperty.call(indexGroups, nameKey)) {
                            indexGroups[nameKey] = [];
                        }
                        indexGroups[nameKey].push(currentItem.doclet);
                    }
                    // omit members of enums; they don't need to show up on the index page
                    if (currentItem.children &&
                        (!currentItem.doclet || !currentItem.doclet.isEnum)) {
                        visit(currentItem.children);
                    }
                });
            }

            visit(items);

            return Object.keys(indexGroups).sort().map(indexGroup => {
                data.groupName = name.stripNamespace(indexGroup);

                return options.fn(indexGroups[indexGroup], { data });
            }, this).join('');
        },
        first(items, options) {
            return options.fn(items[0]);
        },
        is(first, second, options) {
            if (first !== second) {
                return options.inverse(this);
            }

            return options.fn(this);
        },
        isnt(first, second, options) {
            if (first === second) {
                return options.inverse(this);
            }

            return options.fn(this);
        },
        last(items, options) {
            return options.fn(items[items.length - 1]);
        },
        markdown(options) {
            const text = options.fn(this);

            return new SafeString(markdownParser(text));
        },
        markdownLinks(options) {
            const text = options.fn(this);

            // don't convert text that does not appear to contain Markdown links
            // (but wrap it in a <p> tag for consistency with Markdown-parsed text)
            if (!text.includes('[')) {
                return new SafeString(`<p>${text}</p>`);
            }

            return new SafeString(markdownParser(text));
        },
        withOnly(options) {
            const context = handlebars.createFrame(options.hash);

            return options.fn(context);
        }
    };
};
