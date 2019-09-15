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
 * Expression helpers for use in Handlebars templates. An expression helper returns text that can be
 * added to a rendered view.
 *
 * @module lib/helpers/expression
 */

const _ = require('lodash');
const catharsis = require('catharsis');
const env = require('jsdoc/env');
const escape = require('escape-string-regexp');
const handlebars = require('handlebars');
const logger = require('jsdoc/util/logger');
const name = require('jsdoc/name');
const path = require('jsdoc/path');
const spdxLicenses = require('spdx-license-list');
const templateHelper = require('jsdoc/util/templateHelper');
const url = require('url');
const util = require('util');

let finders;
const Exception = handlebars.Exception;
const SafeString = handlebars.SafeString;

const _SCOPE_PUNC_VALUES = _.values(templateHelper.scopeToPunc).join('');
// loaded by the file finder
let ENUMS;
const LEADING_SCOPE_PUNC = new RegExp(`^([${escape(_SCOPE_PUNC_VALUES)}])`);
const MIN_HEADING_LEVEL = 1;
const MAX_HEADING_LEVEL = 6;
const NUMBER_OF_GROUPS = 3;
const SOFT_BREAK_AFTER = (() => {
    const values = `${_SCOPE_PUNC_VALUES}/`;

    return new RegExp(`([${escape(values)}])`, 'g');
})();

// Insert a soft break after any of the characters in SOFT_BREAK_AFTER.
function softBreak(text) {
    return text.replace(SOFT_BREAK_AFTER, '$1<wbr>');
}

// TODO: should this filter based on any other criteria?
function filterProperties(props = []) {
    return props.filter(prop => {
        // properties can be null
        if (prop) {
            return prop.ignore !== true;
        }

        return false;
    });
}

function formatParams(params, template) {
    let formatted = '';

    params = params || [];

    params.filter(param => param.name && !param.name.includes('.')).forEach((param, i) => {
        let formattedParam = param.name || '';

        if (param.variable) {
            formattedParam = template.translate('params.repeatable', {
                param: formattedParam
            }).trim();
        }

        formattedParam = template.translate('params.joiner', {
            items: i,
            param: formattedParam
        }).trim();

        if (param.optional) {
            formattedParam = template.translate('params.optional', {
                param: formattedParam
            }).trim();
        }

        formatted += formattedParam;
    });

    formatted = template.translate('params.all', {
        params: formatted
    });

    return formatted;
}

function getAncestors(longname) {
    const ancestors = [];
    let nameInfo = name.shorten(longname);
    let memberof = nameInfo.memberof;
    const originalScope = nameInfo.scope;

    while (memberof) {
        nameInfo = name.shorten(memberof);
        ancestors.push(nameInfo.longname);
        if (nameInfo.scope) {
            ancestors.push(nameInfo.scope);
        }
        memberof = nameInfo.memberof || null;
    }

    if (ancestors.length) {
        ancestors.unshift(originalScope);
    }

    return ancestors.reverse();
}

/* eslint-disable no-unused-vars */
function getCatharsisOptions(template) {
    return {
        // TODO: add codeTag and/or codeClass based on config
        // TODO: use the correct locale
        jsdoc: true,
        links: templateHelper.longnameToUrl
    };
}
/* eslint-enable no-unused-vars */

function jsdocVersion() {
    return env.version.number;
}

function link(item, linkText, linkClass, fragmentId) {
    let htmlLink;
    let regExp;

    if (linkText) {
        linkText = templateHelper.htmlsafe(linkText);
        regExp = new RegExp(util.format('(>(%s)<\\/)', escape(linkText)));
    }

    htmlLink = templateHelper.linkto(item, linkText, linkClass, fragmentId);
    if (regExp) {
        htmlLink = htmlLink.replace(regExp, (match, p1, p2) => p1.replace(p2, softBreak(p2)));
    }

    return htmlLink;
}

function needsSignature({kind, type, meta}) {
    let needsSig = false;

    // function and class definitions always get a signature
    if (kind === 'function' || kind === 'class') {
        needsSig = true;
    }
    // typedefs that contain functions get a signature, too
    else if (kind === 'typedef' && type && type.names &&
        type.names.length) {
        for (let i = 0, l = type.names.length; i < l; i++) {
            if (type.names[i].toLowerCase() === 'function') {
                needsSig = true;
                break;
            }
        }
    }
    // and namespaces that are functions get a signature (but finding them is a
    // bit messy)
    else if (kind === 'namespace' && meta && meta.code &&
        meta.code.type && meta.code.type.match(/[Ff]unction/)) {
        needsSig = true;
    }

    return needsSig;
}

function parseType(template, type) {
    const catharsisOptions = getCatharsisOptions(template);

    return type ?
        catharsis.parse(type, catharsisOptions) :
        // TODO: should this be {} or null?
        '';
}

function typeUnion(types) {
    let typeExpression;

    types = types || [];
    typeExpression = types.join('|');

    if (types.length > 1) {
        typeExpression = `(${typeExpression})`;
    }

    return typeExpression;
}

function init() {
    // set up modules that cannot be preloaded
    if (!ENUMS) {
        finders = {
            // this finder should exist by the time we get here
            modules: require('../../filefinder').get('modules')
        };
        ENUMS = finders.modules.require('./enums');
    }
}

module.exports = template => {
    let currentHeadingLevel = MIN_HEADING_LEVEL;
    const ids = {};

    init();

    return {
        /**
         * Subtract 1 from the current heading level, unless the current heading level is the
         * minimum heading level.
         *
         * @private
         * @return {string} An empty string.
         */
        _decrementHeading() {
            if (currentHeadingLevel > MIN_HEADING_LEVEL) {
                currentHeadingLevel--;
            }

            return '';
        },

        /**
         * Get the current heading level.
         *
         * @private
         * @return {string} The current heading level.
         */
        _headingLevel() {
            return currentHeadingLevel;
        },

        /**
         * Add 1 to the current heading level, unless the current heading level is the maximum
         * heading level.
         *
         * @private
         * @return {string} An empty string.
         */
        _incrementHeading() {
            if (currentHeadingLevel < MAX_HEADING_LEVEL) {
                currentHeadingLevel++;
            }

            return '';
        },

        /**
         * Given a longname, return the longname's ancestors, with an HTML link to each ancestor.
         * The list of ancestors includes trailing scope punctuation. For example, given the
         * longname `foo.bar.Baz`, this method returns a string similar (but not identical) to
         * `<a href="foo.html">foo</a>.<a href="foo_bar.html">bar</a>.`. Note that this string
         * includes a trailing `.`, because `Baz` is a static member of `foo.bar`.
         *
         * @param  {string} longname - The longname whose ancestors will be turned into HTML links.
         * @param  {string?} cssClass - A CSS class added to each link.
         * @return {handlebars.SafeString} The linked version of the longname's ancestors.
         */
        ancestors(longname, cssClass) {
            let links;

            if (typeof cssClass !== 'string') {
                cssClass = null;
            }

            links = getAncestors(longname).map(ancestor => {
                let ancestorName;

                // don't try to link to scope punctuation
                if (ancestor.length === 1 && _SCOPE_PUNC_VALUES.includes(ancestor)) {
                    return softBreak(ancestor);
                }

                ancestorName = name.shorten(ancestor).name;

                return link(ancestor, name.stripNamespace(ancestorName), cssClass);
            });

            return new SafeString(links.join(''));
        },

        /**
         * Given a filepath, return the basename for that filepath, removing the extension if one
         * is provided. For example:
         *
         * + For the path `/foo/bar/baz.html`, returns `baz.html`.
         * + For the path `/foo/bar/baz.html` and the extension `.html`, returns `baz`.
         *
         * @param {string} filepath - The filepath whose basename will be returned.
         * @param {string} extension - The trailing string that will be removed if present. Include
         * the leading period (`.`).
         * @return {handlebars.SafeString} The basename for the filepath.
         */
        basename(filepath, extension) {
            if (typeof extension !== 'string') {
                extension = '';
            }

            return new SafeString(path.basename(String(filepath), extension));
        },

        /**
         * Get the value of the specified key in the Baseline configuration settings.
         *
         * @param {string} key - The key whose value will be retrieved.
         * @return {string} The configuration value.
         */
        config(key) {
            return _.get(template.config, key);
        },

        /**
         * Given one or more CSS class names, return a string that can be used as the `class`
         * attribute of an HTML element.
         *
         * If a class name includes a leading exclamation point (`!`), it will always be included in
         * the `class` attribute, but without the leading `!`. The configuration setting
         * `cssClassPrefix` can override the exclamation point with a different character.
         *
         * All other class names will be omitted unless the user added the class names to a CSS
         * class mapping file. In that case, the CSS class name will be mapped to the user's
         * requested value, and that value will be added to the `class` attribute.
         *
         * @param {...string} cssClass - The name of a CSS class to include.
         * @return {handlebars.SafeString} The formatted `class` attribute, including a leading
         * space (for example, ` class="foo bar"`).
         */
        cssClass(...args) {
            const cssClasses = template.cssClasses;
            const keys = [].slice.call(args, 0, args.length - 1);
            const mappedClasses = [];
            const prefix = template.config.cssClassPrefix;

            keys.forEach(key => {
                // if the name has the appropriate prefix, strip the prefix and unconditionally add
                // the CSS class
                if (key.indexOf(prefix) === 0) {
                    mappedClasses.push(key.substr(1));
                }
                // otherwise, only add the name if the user asked for it
                // (a falsy value doesn't count as "asking for it")
                else if ({}.hasOwnProperty.call(cssClasses, key) && cssClasses[key]) {
                    mappedClasses.push(key);
                }
            });

            if (!mappedClasses.length) {
                return '';
            }

            return new SafeString(util.format(' class="%s"', mappedClasses.join(' ')));
        },

        /**
         * Log a JSON-stringified version of the arguments to the console.
         *
         * @param {...*} value - The value to log to the console.
         * @return {void}
         */
        debug() {
            const args = [].slice.call(arguments, 0, arguments.length - 1);
            const message = args.map(arg => {
                if (typeof arg === 'object') {
                    return JSON.stringify(arg);
                }

                return arg;
            });

            logger.debug(message.join(' '));
        },

        /**
         * Check whether a value is defined (in other words, whether its type is something other
         * than `undefined`).
         *
         * @param {*} value - The value to check.
         * @return {boolean} If the item is defined, `true`; otherwise, `false`.
         */
        defined(value) {
            return typeof value !== 'undefined';
        },

        /**
         * Create a human-readable description of a parsed type expression.
         *
         * If the format is set to `simple`, this helper returns a complete, brief description of
         * the type expression, including modifiers such as whether the value is nullable.
         *
         * If the format is set to `extended`, you can use the `property` parameter to select one of
         * several values to retrieve, each of which can be used as a sentence:
         *
         * + `description` (default): A description of the type expression, without information
         * about the modifiers described below.
         * + `modifiers.functionNew`: Identifies what type of value will be returned if the function
         * is called with the `new` keyword.
         * + `modifiers.functionThis`: Identifies what `this` refers to within the function.
         * + `modifiers.optional`: Indicates whether the value is optional.
         * + `modifiers.nullable`: Indicates whether the value is nullable.
         * + `modifiers.repeatable`: Indicates whether the value is a function parameter that can be
         * repeated.
         *
         * @param {Object} parsedType - A parsed type expression, using the same format as the
         * [Catharsis](https://github.com/hegemonic/catharsis) type-expression parser.
         * @param {string?} [format=simple] - The format to use when creating the description. Set
         * to `simple` or `extended`.
         * @param {string?} [property=description] - The property of the extended description to
         * retrieve. Ignored unless `format` is set to `extended`.
         * @return {handlebars.SafeString} A description of the type expression, or of one of the
         * type expression's modifiers.
         */
        describeType(parsedType, format, property) {
            const catharsisOptions = getCatharsisOptions(template);
            let description;

            if (typeof format !== 'string') {
                format = 'simple';
            } else if (!['extended', 'simple'].includes(format)) {
                throw new Exception('The {{describeType}} helper accepts the options "simple" ' +
                    'and "extended".');
            } else if (format === 'extended' && typeof property !== 'string') {
                property = 'description';
            }

            if (typeof parsedType === 'object') {
                description = catharsis.describe(parsedType, catharsisOptions);
            } else {
                // We don't know the type
                description = catharsis.describe(catharsis.parse('?'), catharsisOptions);
            }

            if (format === 'extended') {
                return new SafeString(_.get(description.extended, property));
            } else {
                return new SafeString(description.simple);
            }
        },

        /**
         * Given the text of an example from a JSDoc doclet, extract a caption, if present, from
         * the text, and return the caption and the code for the example.
         *
         * Text is treated as a caption if it is enclosed in an HTML `<caption>` element.
         *
         * @param {string} example - The text of a single example from a JSDoc doclet.
         * @return {Object} An object with two string properties: `caption`, containing the caption
         * (if any), and `code`, containing the code for the example.
         */
        example(example) {
            let caption;
            let code;

            if (example.match(/^[\f\n\r\s]*<caption>(.+)<\/caption>(?:[\f\n\r\s]*)([\w\W]+)$/im)) {
                caption = RegExp.$1;
                code = RegExp.$2;
            }

            return {
                caption,
                code: code || example
            };
        },

        // Remove properties that the user explicitly said to ignore.
        filterProperties,

        /**
         * Format a list of parameters as a single string that is suitable for display as a method
         * signature.
         *
         * @param {Array.<Object>} params - The `params` attribute from a JSDoc doclet.
         * @return {handlebars.SafeString} The formatted list of parameters.
         */
        formatParams(params) {
            return new SafeString(formatParams(params, template));
        },

        /**
         * Return a string identifying the tool that was used to generate the documentation, as well
         * as the date on which the documentation was generated.
         *
         * @return {handlebars.SafeString} A string with details about how the documentation was
         * generated.
         */
        generatedBy() {
            const formatter = new Intl.DateTimeFormat(template.config.locale, {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            });

            return new SafeString(template.translate('generatedBy', {
                version: jsdocVersion(),
                date: formatter.format(Date.now())
            }));
        },

        /**
         * Group a list of items into the specified number of arrays, distributing items evenly
         * between the arrays.
         *
         * If the number of groups is larger than the number of items, the result will contain one
         * or more empty arrays.
         *
         * @param {Array.<*>} items - The items to group.
         * @param {number?} [groups=3] - The number of groups to create.
         * @return {Array.<Array.<*>>} The grouped items.
         */
        group(items, groups) {
            const grouped = [];
            let perGroup;
            const toGroup = items.slice(0);

            groups = groups || NUMBER_OF_GROUPS;
            perGroup = Math.ceil(items.length / groups);

            while (toGroup.length || grouped.length < groups) {
                if (toGroup.length) {
                    grouped.push(toGroup.splice(0, perGroup));
                }
                else {
                    grouped.push([]);
                }
            }

            return grouped;
        },

        /**
         * Check whether a doclet has any modifiers that the template may need to treat specially.
         * Specifically, this helper returns `true` if the doclet:
         *
         * + Is a nullable or non-nullable value
         * + Is a repeatable method parameter
         * + Has a default value
         * + Is an enumeration
         *
         * @param {jsdoc/doclet.Doclet} doclet - The doclet to check for modifiers.
         * @param {boolean} isEnum - Indicates whether the doclet represents an enumeration.
         * @return {boolean} If the doclet has modifiers, `true`; otherwise, `false`.
         */
        hasModifiers({nullable, variable, defaultvalue}, isEnum) {
            return Boolean(typeof nullable === 'boolean' ||
                variable === true ||
                (typeof defaultvalue !== 'undefined' && !isEnum));
        },

        /**
         * Given a doclet, get an ID that can be used as an `id` attribute for an HTML element.
         *
         * @param {module:jsdoc/doclet.Doclet} doclet - The doclet to use.
         * @return {string} An ID for the doclet.
         */
        id(doclet) {
            let fileUrl;
            let hash;

            doclet = doclet || {};

            if (!{}.hasOwnProperty.call(ids, doclet.longname)) {
                fileUrl = templateHelper.createLink(doclet);
                hash = url.parse(fileUrl).hash;

                if (hash) {
                    // strip the hash character
                    hash = hash.replace(/^#/, '');
                } else {
                    // as a fallback, use the name and variation
                    hash = doclet.name + (doclet.variation || '');
                }

                ids[doclet.longname] = hash;
            }

            return ids[doclet.longname];
        },

        /**
         * Return the version of JSDoc that is being used (for example, `3.4.0`).
         *
         * @return {string} The JSDoc version number.
         */
        jsdocVersion,

        /**
         * Return a JSON-stringified version of an object.
         *
         * @param {*} obj - The object to stringify.
         * @return {handlebars.SafeString} - The stringified version of the object.
         */
        json(obj) {
            return new SafeString(JSON.stringify(obj));
        },

        /**
         * Get a list of keys for an object.
         *
         * @param {Object} obj - The object whose keys will be retrieved.
         * @return {Array.<string>} A list of keys for the object.
         */
        keys(obj) {
            let message;

            if (typeof obj !== 'object') {
                message = util.format('The {{keys}} helper requires an object, but your value\'s ' +
                'type is "%s".', typeof obj);
                throw new Error(message);
            }

            return Object.keys(obj);
        },

        /**
         * Retrieve a sorted list of labels that should be displayed for a symbol.
         *
         * The labels indicate all of the following:
         *
         * + The symbol's kind (only if the symbol gets its own output file)
         * + Whether the symbol is private or protected
         * + Whether the symbol is an asynchronous function
         * + Whether the symbol is a generator function
         * + Whether the symbol is a constant
         * + Whether the symbol is read-only
         * + Whether the symbol is abstract
         *
         * Labels are sorted alphabetically, with the exception of the label for the symbol's kind,
         * which always comes first.
         *
         * @param {jsdoc/doclet.Doclet} doclet - The doclet for the symbol.
         * @return {Array.<Object>} An array of objects with two string properties: `class`, a
         * CSS class for the label, and `text`, the text for the label.
         */
        labels(doclet) {
            let labels = [];

            if (doclet.access) {
                labels.push(doclet.access);
            }

            if (doclet.async) {
                labels.push('async');
            }

            if (doclet.generator) {
                labels.push('generator');
            }

            if (doclet.kind === 'constant') {
                labels.push(doclet.kind);
            }

            if (doclet.readonly) {
                labels.push('readonly');
            }

            if (doclet.scope && doclet.scope !== name.SCOPE.NAMES.INSTANCE &&
                doclet.scope !== name.SCOPE.NAMES.GLOBAL) {
                labels.push(doclet.scope);
            }

            if (doclet.virtual) {
                labels.push('virtual');
            }

            // translate and sort all the labels we've collected so far
            labels = labels.map(text => ({
                // add the `!` prefix so the class isn't dropped
                // TODO: use the prefix specified by the template config
                class: `!label-${text}`,

                text: template.translate(`labels.${text}`)
            })).sort((a, b) => {
                if (a.text > b.text) {
                    return 1;
                }

                if (a.text < b.text) {
                    return -1;
                }

                return 0;
            });

            // prepend the label for the doclet's kind, if applicable
            if (ENUMS.OUTPUT_FILE_KINDS.includes(doclet.kind)) {
                labels.unshift({
                    // TODO: use the prefix specified by the template config
                    class: '!label-kind',
                    text: template.translate(`kinds.${doclet.kind}`)
                });
            }

            return labels;
        },

        /**
         * Get a link to the specified license ID on the [Software Package Data Exchange (SPDX)
         * website](http://spdx.org/). If the license ID is not a valid SPDX identifier, the license
         * ID will be returned as-is.
         *
         * @param {string} licenseId - The SPDX license ID. See the [SPDX license
         * list](http://spdx.org/licenses/) for a list of valid identifiers.
         * @return {string} A link to the specified license, or the license ID if the ID is not
         * recognized.
         */
        licenseLink(licenseId) {
            if ({}.hasOwnProperty.call(spdxLicenses, licenseId)) {
                return link(spdxLicenses[licenseId].name, `http://spdx.org/licenses/${licenseId}`);
            }

            return licenseId;
        },

        /**
         * Generate an HTML link to a specified symbol.
         *
         * In general, the symbol should be specified by its longname. You can also provide an
         * inline link tag (for example, `{@link Foo}`), and the inline link tag will be converted
         * to an HTML link.
         *
         * @param {string} item - The name of the symbol to link to, or an inline link tag.
         * @param {string?} linkText - The text to display for the link. By default, the symbol name
         * will be used as the link text.
         * @param {string?} linkClass - A CSS class to add to the link.
         * @param {string?} fragmentId - A fragment identifier to add to the link (for example, the
         * ID for a specific symbol).
         * @return {handlebars.SafeString} An HTML link to the specified symbol.
         */
        link(item, linkText, linkClass, fragmentId) {
            // don't treat the `options` object as a parameter
            if (typeof fragmentId !== 'string') {
                fragmentId = null;
            }
            if (typeof linkClass !== 'string') {
                linkClass = null;
            }
            if (typeof linkText !== 'string') {
                linkText = null;
            }

            // Handle unusual cases where `item` isn't a string for some reason. (One example: JSDoc
            // sets a doclet's `deprecated` property to `true` when the `@deprecated` tag has no
            // text.)
            if (typeof item !== 'string') {
                item = '';
            }
            item = templateHelper.resolveLinks(item);

            return new SafeString(link(item, linkText, linkClass, fragmentId));
        },

        /**
         * Link to the symbol represented by a doclet, using the symbol's longname and complete
         * signature as the link text. If the symbol's longname includes a namespace or variation,
         * the namespace or variation will not be displayed in the link text.
         *
         * @param {jsdoc/doclet.Doclet} doclet - The doclet that will be linked to.
         * @param {string?} cssClass - A CSS class to add to the link.
         * @return {handlebars.SafeString} A link to the specified symbol.
         */
        linkLongnameWithSignature(doclet, cssClass) {
            let linkText;

            if (typeof cssClass !== 'string') {
                cssClass = null;
            }

            linkText = name.stripNamespace(doclet.longname || '');
            linkText = name.stripVariation(linkText);

            if (needsSignature(doclet)) {
                linkText += formatParams(doclet.params, template);
            }

            return new SafeString(link(doclet.longname, linkText, cssClass));
        },

        /**
         * Link to the line in a pretty-printed source file where the code associated with a doclet
         * is defined. The link will be formatted using the `linkToLine` string in the template's
         * L10N resource file.
         *
         * @param {Object} docletMeta - The `meta` attribute of a doclet.
         * @param {string?} cssClass - A CSS class to add to the link.
         * @return {handlebars.SafeString} A link to the appropriate line in the pretty-printed
         * source file.
         */
        linkToLine({lineno, shortpath}, cssClass) {
            let fragmentId;

            if (typeof cssClass !== 'string') {
                cssClass = null;
            }

            if (lineno > 1) {
                fragmentId = `source-line-${lineno}`;
            }

            return new SafeString(link(shortpath, template.translate('linkToLine', {
                filepath: shortpath,
                lineno: lineno,
                items: lineno
            }), cssClass, fragmentId));
        },

        /**
         * Link to a tutorial.
         * @param {string} text - The name of the tutorial.
         * @return {handlebars.SafeString} A link to the tutorial.
         */
        linkToTutorial(text) {
            return new SafeString(templateHelper.toTutorial(text));
        },

        /**
         * Link to the symbol represented by a doclet, using the symbol's name (_not_ its longname)
         * and its complete signature as the link text.
         *
         * @param {jsdoc/doclet.Doclet} doclet - The doclet that will be linked to.
         * @param {string?} cssClass - A CSS class to add to the link.
         * @return {handlebars.SafeString} A link to the specified symbol.
         */
        linkWithSignature(doclet, cssClass) {
            let linkText;

            if (typeof cssClass !== 'string') {
                cssClass = null;
            }

            linkText = doclet.name;

            if (needsSignature(doclet)) {
                linkText += formatParams(doclet.params, template);
            }

            return new SafeString(link(doclet.longname, linkText, cssClass));
        },

        // TODO: allow the caller to specify which modifiers they're interested in
        /**
         * Get a series of sentences that describe any modifiers for a symbol, including whether
         * the symbol:
         *
         * + Is a nullable or non-nullable value
         * + Is a repeatable method parameter
         * + Has a default value
         * + Is an enumeration
         *
         * The sentences will be formatted using the following strings in the template's L10N
         * resource file:
         *
         * + tables.body.defaultValue
         * + tables.body.defaultValueString
         * + tables.body.nonNullable.long
         * + tables.body.nullable.long
         * + tables.body.repeatable.long
         *
         * @param {jsdoc/doclet.Doclet} doclet - A doclet representing the symbol.
         * @param {boolean} isEnum - If the doclet is part of an enumeration, `true`; otherwise,
         * `false`.
         * @return {handlebars.SafeString} Descriptions of the symbol's modifiers.
         */
        modifierText({nullable, variable, defaultvalue}, isEnum) {
            const descriptions = [];

            if (nullable === true) {
                descriptions.push(template.translate('tables.body.nullable.long'));
            } else if (nullable === false) {
                descriptions.push(template.translate('tables.body.nonNullable.long'));
            }

            if (variable === true) {
                descriptions.push(template.translate('tables.body.repeatable.long'));
            }

            if (typeof defaultvalue !== 'undefined' && !isEnum) {
                descriptions.push(template.translate('tables.body.defaultValue', {
                    valueString: template.translate('tables.body.defaultValueString', {
                        value: String(defaultvalue)
                    })
                }));
            }

            return new SafeString(descriptions.join(' '));
        },

        /**
         * Check whether a symbol needs a function signature.
         *
         * @param {jsdoc/doclet.Doclet} doclet - A doclet representing the symbol.
         * @return {boolean} If the doclet needs a function signature, `true`; otherwise, `false`.
         */
        needsSignature,

        /**
         * Create a link to the generated documentation's `index.html` file. If the package's name
         * and version number are available, they will be used as the link text. Otherwise, a
         * default value will be used.
         *
         * @param {jsdoc/package.Package} packageInfo - Information about the package.
         * @param {string?} cssClass - A CSS class to add to the link.
         * @return {handlebars.SafeString} A link to the documentation's `index.html` file.
         */
        packageLink(packageInfo, cssClass) {
            let linkText;

            if (typeof cssClass !== 'string') {
                cssClass = null;
            }

            packageInfo = packageInfo || {};

            linkText = packageInfo.name || template.translate('brandDefault');

            if (packageInfo.name && packageInfo.version) {
                linkText += ` ${packageInfo.version}`;
            }

            return new SafeString(link('index', linkText, cssClass));
        },

        /**
         * Parse a type expression into an object. The object uses the format returned by the
         * [Catharsis](https://github.com/hegemonic/catharsis) library.
         *
         * @param {string?} type - The type expression to parse.
         * @return {(Object|string)} The parsed object, or an empty string if no type expression
         * was specified.
         */
        parseType(type) {
            return parseType(template, type);
        },

        /**
         * Given an array of objects, extract the value of the specified key from each object.
         *
         * @param {Array.<Object>} items - The objects whose property values will be extracted.
         * @param {string} key - The name of the property whose values will be extracted.
         * @return {Array.<*>} The values associated with the specified key.
         */
        pluck(items, key) {
            return items.reduce(function(accumulator, current) {
                if ({}.hasOwnProperty.call(current, key)) {
                    accumulator.push(current[key]);
                }

                return accumulator;
            }, []);
        },

        /**
         * Retrieve a value passed into JSDoc using the `--query/-q` command-line option.
         *
         * @param {string} key - The name of the query property to retrieve.
         * @return {handlebars.SafeString} The value of the query property.
         */
        query(key) {
            let result = '';

            if (env.opts.query && {}.hasOwnProperty.call(env.opts.query, key)) {
                result = String(env.opts.query[key]);
            }

            return new SafeString(result);
        },

        /**
         * Given a doclet that includes function parameters or properties, reparent the parameters
         * or properties that belong to a parent object. For example, if there are two parameters
         * named `foo` and `foo.bar`, the `foo.bar` parameter will be renamed `bar` and moved to a
         * `children` array on the object describing the parameter `foo`:
         *
         * ```js
         * // Original doclet
         * {
         *   params: [
         *       {
         *           name: 'foo'
         *       },
         *       {
         *           name: 'foo.bar'
         *       }
         *   ]
         * }
         *
         * // Returned array
         * [
         *     {
         *         name: 'foo',
         *         children: [
         *             {
         *                 name: 'bar'
         *             }
         *         ]
         *     }
         * ]
         * ```
         *
         * If the template configuration property `tables.nestedPropertyTables` is set to `false`,
         * the parameters or properties will not be reparented. Instead, they will be returned
         * as-is.
         *
         * This function does not modify the original doclet.
         *
         * @param {jsdoc/doclet.Doclet} doclet - The doclet with parameter or property information.
         * @param {string} key  - Set to `params` for function parameters or `properties` for
         * object properties.
         * @return {Array.<Object>} An array of objects describing the parameters or properties.
         */
        reparentItems(doclet, key) {
            let itemRegExp;
            // remove properties that we don't want to include
            const items = filterProperties(doclet[key]);
            let parentItem = null;
            let parsedType;

            // only reparent items if that's what the user asked for
            if (_.get(template.config, 'tables.nestedPropertyTables')) {
                items.forEach((item, i) => {
                    if (!item) {
                        return;
                    }

                    if (parentItem && parentItem.name && item.name) {
                        try {
                            itemRegExp = new RegExp(`^(?:${parentItem.name}(?:\\[\\])*)\\.(.+)$`);
                        } catch (e) {
                            // there's probably a typo in the JSDoc comment that resulted in a weird
                            // parameter name
                            return;
                        }

                        if (itemRegExp.test(item.name)) {
                            // clone the item (and manually clone a non-enumerable property that we
                            // need to keep)
                            parsedType = item.type ? item.type.parsedType : null;
                            item = _.cloneDeep(item);
                            if (parsedType) {
                                item.type.parsedType = parsedType;
                            }

                            item.name = RegExp.$1;
                            parentItem.children = parentItem.children || [];
                            parentItem.children.push(item);
                            items[i] = null;
                        }
                        else {
                            parentItem = item;
                        }
                    }
                    else {
                        parentItem = item;
                    }
                });
            }

            return _.compact(items);
        },

        /**
         * Given a string, convert text like `Jane Doe <jdoe@example.org>` into an HTML `mailto:`
         * link like `<a href="mailto:jdoe@example.org">Jane Doe</a>`.
         *
         * @param {string} text - The text that will be checked for email addresses.
         * @return {handlebars.SafeString} An updated version of the text, which may include an
         * HTML `mailto:` link.
         */
        resolveAuthorLinks(text) {
            return new SafeString(templateHelper.resolveAuthorLinks(text));
        },

        /**
         * Find inline `{@link}` and `{@tutorial}` tags, and replace them with HTML links. This
         * method also finds and converts variations on these tags that are recognized by JSDoc,
         * including `{@linkplain}` and `{@linkcode}`.
         *
         * @param {string} text - The text that contains inline tags.
         * @return {handlebars.SafeString} An updated version of the text, which may include HTML
         * links in place of inline link tags.
         */
        resolveLinks(text) {
            return new SafeString(templateHelper.resolveLinks(text));
        },

        /**
         * Convert an array of return types into a parsed type expression that represents all of
         * the return types as a single type union. For example, the return types `string` and
         * `number` would be turned into an object representing the type expression
         * `(string|number)`.
         *
         * @param {Object} doclet - A JSDoc doclet.
         * @return {Object} A parsed type expression, using the same format as the
         * [Catharsis](https://github.com/hegemonic/catharsis) type-expression parser.
         */
        returnTypes(doclet) {
            let source = [];
            const typeUnions = [];

            // We used to expect callers to pass in doclet.returns, so if "doclet" is an array, just
            // use it.
            if (Array.isArray(doclet)) {
                source = doclet;
            } else if (doclet) {
                source = doclet.yields || doclet.returns || [];
            }

            source.forEach(({type}) => {
                if (type && type.names && type.names.length) {
                    typeUnions.push(typeUnion(type.names));
                }
            });

            return parseType(template, typeUnion(typeUnions));
        },

        // TODO: document after tests are in place
        see(see, longname) {
            let atoms;
            let combined = see;

            if (LEADING_SCOPE_PUNC.test(see)) {
                atoms = name.shorten(longname);
                atoms.name = see.substr(1);
                combined = name.combine(atoms);
            }

            return combined;
        },

        /**
         * Check whether a default value should get syntax highlighting, based on the value of the
         * doclet's `defaultvaluetype` property.
         *
         * @param {string} typeName - The `defaultvaluetype` property of a doclet.
         * @return {boolean} If the doclet's default value should get syntax highlighting, `true`;
         * otherwise, `false`.
         */
        shouldHighlight(typeName) {
            return ['array', 'object'].includes(typeName);
        },

        /**
         * Retrieve the translation for a given translation key. The translation will be pluralized
         * based on the number of items in the `items` array.
         *
         * If the text for a translation key includes variables, the variables can be specified as
         * `key=value` options in the Handlebars tag. For example, to get the translation for the
         * key `foo.bar`, with the value of `baz` set to `1`, use the following Handlebars tag:
         * `{{translate 'foo.bar' baz=1}}`
         *
         * @param {string} key - The translation key. Must map to a key in the template's L10N
         * resources file.
         * @param {(Array.<*>|*)?} items - An array of items that will be counted to determine how
         * to pluralize the translation. If the value is not an array, this helper assumes that
         * there is one item.
         * @param {Object} options - The Handlebars options object.
         * @return {handlebars.SafeString} The translation for the given translation key.
         */
        translate(key, items, options) {
            let translateOpts;

            if (typeof items === 'object' && items !== null && !Array.isArray(items)) {
                options = items;
            }

            if (options.hash) {
                translateOpts = options.hash;
                translateOpts.items = Array.isArray(items) ? items.length : 1;
            } else {
                translateOpts = Array.isArray(items) ? items.length : 1;
            }

            return new SafeString(template.translate(key, translateOpts));
        },

        /**
         * Retrieve the translation for a given translation key that begins with `headings.`. Omit
         * the `headings.` prefix when you use this helper. For example, to translate the key
         * `headings.foo`, pass in the key `foo`.
         *
         * The translation will be pluralized based on the number of items in the `items` array.
         *
         * @param {string} key - The translation key. Must map to a key in the template's L10N
         * resources file when the prefix `headings.` is added.
         * @param {(Array.<*>|*)?} items - An array of items that will be counted to determine how
         * to pluralize the translation. If the value is not an array, this helper assumes that
         * there is one item.
         * @return {handlebars.SafeString} The translation for the given translation key.
         */
        translateHeading(key, items) {
            return new SafeString(template.translate(`headings.${key}`,
                items ? items.length : null));
        },

        /**
         * Retrieve the translation for the `pageTitle` translation key, using the given prefix,
         * title, and category.
         *
         * @param {string} prefix - A prefix to include in the translated text (for example, `My
         * Project > `).
         * @param {string} title - A page-specific title (for example, `Foo`).
         * @param {string} category - The kind of symbol that is represented on this page. Must
         * map to a key in the template's L10N resources file when the prefix `headings.` is added.
         * @return {handlebars.SafeString} The translation for the `pageTitle` translation key.
         */
        translatePageTitle(prefix, title, category) {
            return new SafeString(template.translate('pageTitle', {
                category: category ? template.translate(`headings.${category}`) : '',
                prefix,
                title
            }));
        },

        /**
         * Convert an array of type names into a parsed type expression that represents all of the
         * types as a single type union. For example, the types `string` and `number` would be
         * turned into an object representing the type expression `(string|number)`.
         *
         * @param {Array.<string>} types - The array of type names.
         * @return {Object} A parsed type expression, using the same format as the
         * [Catharsis](https://github.com/hegemonic/catharsis) type-expression parser.
         */
        typeUnion(types) {
            return parseType(template, typeUnion(types));
        },

        /**
         * Retrieve the URL associated with a longname, or an empty string if the longname is not
         * recognized.
         *
         * @param {string} longname - The longname whose URL will be retrieved.
         * @return {handlebars.SafeString} The URL associated with the longname, or an empty string.
         */
        url(longname) {
            if ({}.hasOwnProperty.call(templateHelper.longnameToUrl, longname)) {
                return new SafeString(templateHelper.longnameToUrl[longname]);
            }

            return new SafeString('');
        },

        /**
         * Given an array of objects, retrieve the objects whose properties match the values
         * specified in the Handlebars tag. For example, to retrieve objects that have a `foo`
         * property equal to `bar`: `{{where items foo='bar'}}`
         *
         * @param {Array.<Object>} items - The objects that will be filtered based on the values
         * specified in the Handlebars tag.
         * @param {Object} options - The Handlebars options object.
         * @return {Array.<Object>} An array of objects whose properties match the specified values.
         */
        where(items, {hash}) {
            return items ? items.filter(_.matches(hash)) : null;
        }
    };
};
