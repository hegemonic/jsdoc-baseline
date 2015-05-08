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
 * Expression helpers for use in Handlebars templates. An expression helper returns text that can be
 * added to a rendered view.
 *
 * @module lib/helpers/expression
 */

var _ = require('underscore-contrib');
var catharsis = require('catharsis');
var doop = require('jsdoc/util/doop');
var escape = require('escape-string-regexp');
var handlebars = require('handlebars');
var logger = require('jsdoc/util/logger');
var name = require('jsdoc/name');
var spdxLicenses = require('spdx-license-list');
var templateHelper = require('jsdoc/util/templateHelper');
var url = require('url');
var util = require('util');

var finders;
var Exception = handlebars.Exception;
var SafeString = handlebars.SafeString;

var _SCOPE_PUNC_VALUES = _.values(templateHelper.scopeToPunc).join('');
// loaded by the file finder
var ENUMS;
var LEADING_SCOPE_PUNC = new RegExp('^([' + escape(_SCOPE_PUNC_VALUES) + '])');
var MIN_HEADING_LEVEL = 1;
var MAX_HEADING_LEVEL = 6;
var NUMBER_OF_GROUPS = 3;
var SOFT_BREAK_AFTER = (function() {
    var values = _SCOPE_PUNC_VALUES + '/';

    return new RegExp('([' + escape(values) + '])', 'g');
})();

// Insert a soft break after any of the characters in SOFT_BREAK_AFTER.
function softBreak(text) {
    return text.replace(SOFT_BREAK_AFTER, '$1<wbr>');
}


function formatParams(params, template) {
    var formatted = '';

    params = params || [];

    params.filter(function(param) {
        return param.name && param.name.indexOf('.') === -1;
    }).forEach(function (param, i) {
        var formattedParam = param.name || '';

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
    }, this);

    formatted = template.translate('params.all', {
        params: formatted
    });

    return formatted;
}

function getAncestors(longname) {
    var ancestors = [];
    var nameInfo = name.shorten(longname);
    var memberof = nameInfo.memberof;
    var originalScope = nameInfo.scope;

    while (memberof) {
        nameInfo = name.shorten(memberof);
        ancestors.push(nameInfo.name);
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

/*eslint-disable no-unused-vars */
function getCatharsisOptions(template) {
    return {
        // TODO: add codeTag and/or codeClass based on config
        // TODO: use the correct locale
        jsdoc: true,
        links: templateHelper.longnameToUrl
    };
}
/*eslint-enable no-unused-vars */

function jsdocVersion() {
    return global.env.version.number;
}

function link(item, linkText, linkClass, fragmentId) {
    var htmlLink;
    var regExp;

    if (linkText) {
        linkText = templateHelper.htmlsafe(linkText);
        regExp = new RegExp(util.format('(>(%s)<\\\/)', escape(linkText)));
    }

    htmlLink = templateHelper.linkto(item, linkText, linkClass, fragmentId);
    if (regExp) {
        htmlLink = htmlLink.replace(regExp, function(match, p1, p2) {
            return p1.replace(p2, softBreak(p2));
        });
    }

    return htmlLink;
}

function needsSignature(doclet) {
    var needsSig = false;

    // function and class definitions always get a signature
    if (doclet.kind === 'function' || doclet.kind === 'class') {
        needsSig = true;
    }
    // typedefs that contain functions get a signature, too
    else if (doclet.kind === 'typedef' && doclet.type && doclet.type.names &&
        doclet.type.names.length) {
        for (var i = 0, l = doclet.type.names.length; i < l; i++) {
            if (doclet.type.names[i].toLowerCase() === 'function') {
                needsSig = true;
                break;
            }
        }
    }

    return needsSig;
}

function parseType(template, type) {
    var catharsisOptions = getCatharsisOptions(template);

    return type ?
        catharsis.parse(type, catharsisOptions) :
        '';
}

function typeUnion(types) {
    var typeExpression;

    types = types || [];
    typeExpression = types.join('|');

    if (types.length > 1) {
        typeExpression = '(' + typeExpression + ')';
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

module.exports = function(template) {
    var currentHeadingLevel = MIN_HEADING_LEVEL;
    var ids = {};

    init();

    return {
        _decrementHeading: function() {
            if (currentHeadingLevel > MIN_HEADING_LEVEL) {
                currentHeadingLevel--;
            }

            return '';
        },
        _headingLevel: function() {
            return currentHeadingLevel;
        },
        _incrementHeading: function() {
            if (currentHeadingLevel < MAX_HEADING_LEVEL) {
                currentHeadingLevel++;
            }

            return '';
        },
        ancestors: function(longname, cssClass) {
            var links;

            if (typeof cssClass !== 'string') {
                cssClass = null;
            }

            links = getAncestors(longname).map(function(ancestor) {
                // don't try to link to scope punctuation
                if (ancestor.length === 1 && _SCOPE_PUNC_VALUES.indexOf(ancestor) !== -1) {
                    return softBreak(ancestor);
                }

                return link(ancestor, name.stripNamespace(ancestor), cssClass);
            });

            return new SafeString(links.join(''));
        },
        config: function(key) {
            return _.getPath(template.config, key);
        },
        cssClass: function() {
            var cssClasses = template.cssClasses;
            var keys = [].slice.call(arguments, 0, arguments.length - 1);
            var mappedClasses = [];
            var prefix = template.config.cssClassPrefix;

            keys.forEach(function(key) {
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
        debug: function() {
            var args = [].slice.call(arguments, 0, arguments.length - 1);
            var message = args.map(function(arg) {
                if (typeof arg === 'object') {
                    return JSON.stringify(arg);
                }

                return arg;
            });

            logger.debug(message.join(' '));
        },
        describeType: function(parsedType, format, property) {
            var catharsisOptions = getCatharsisOptions(template);
            var description;

            if (typeof format !== 'string') {
                format = 'simple';
            } else if (['extended', 'simple'].indexOf(format) === -1) {
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
                return new SafeString(_.getPath(description.extended, property));
            } else {
                return new SafeString(description.simple);
            }
        },
        example: function(example) {
            var caption;
            var code;

            if (example.match(/^[\f\n\r\s]*<caption>(.+)<\/caption>(?:[\f\n\r\s]*)([\w\W]+)$/im)) {
                caption = RegExp.$1;
                code = RegExp.$2;
            }

            return {
                caption: caption,
                code: code || example
            };
        },
        formatParams: function(params) {
            return new SafeString(formatParams(params, template));
        },
        generatedBy: function() {
            var formatter = new global.Intl.DateTimeFormat(template.config.locale, {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            });

            return new SafeString(template.translate('generatedBy', {
                version: jsdocVersion(),
                date: formatter.format(Date.now())
            }));
        },
        group: function(items, groups, perGroup) {
            var grouped = [];
            var toGroup = items.slice(0);

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
        hasModifiers: function(doclet) {
            return !!(typeof doclet.nullable === 'boolean' ||
                doclet.variable === true ||
                (typeof doclet.defaultvalue !== 'undefined' && !doclet.isEnum));
        },
        /**
         * Given a doclet, get an ID that can be used as an `id` attribute within an HTML file.
         *
         * @param {module:jsdoc/doclet.Doclet} doclet - The doclet to use.
         * @return {string} An ID for the doclet.
         */
        id: function(doclet) {
            var fileUrl;
            var hash;

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
        jsdocVersion: jsdocVersion,
        json: function(obj) {
            return new SafeString(JSON.stringify(obj));
        },
        keys: function(obj) {
            var message;

            if (typeof obj !== 'object') {
                message = util.format('The {{keys}} helper requires an object, but your value\'s ' +
                'type is "%s".',
                    typeof obj);
                throw new Error(message);
            }

            return Object.keys(obj);
        },
        labels: function(doclet) {
            var labels = [];

            if (doclet.access) {
                labels.push(doclet.access);
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
            labels = labels.map(function(text) {
                return {
                    // add the `!` prefix so the class isn't dropped
                    class: '!label-' + text,
                    text: template.translate('labels.' + text)
                };
            }).sort(function(a, b) {
                if (a.text > b.text) {
                    return 1;
                }

                if (a.text < b.text) {
                    return -1;
                }

                return 0;
            });

            // prepend the label for the doclet's kind, if applicable
            if (ENUMS.OUTPUT_FILE_KINDS.indexOf(doclet.kind) !== -1) {
                labels.unshift({
                    class: '!label-kind',
                    text: template.translate('kinds.' + doclet.kind)
                });
            }

            return labels;
        },
        licenseLink: function(licenseId) {
            if ({}.hasOwnProperty.call(spdxLicenses, licenseId)) {
                return link(spdxLicenses[licenseId].name, 'http://spdx.org/licenses/' + licenseId);
            }

            return licenseId;
        },
        link: function(item, linkText, linkClass, fragmentId) {
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
        // Link to a symbol, using its longname and the complete signature for that symbol as the
        // link text.
        linkLongnameWithSignature: function(doclet, cssClass) {
            var linkText;

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
        // Link to the line in a pretty-printed source file where the code associated with a doclet
        // is defined.
        linkToLine: function(docletMeta, linkClass) {
            var fragmentId;

            if (typeof linkClass !== 'string') {
                linkClass = null;
            }

            if (docletMeta.lineno > 1) {
                fragmentId = 'source-line-' + docletMeta.lineno;
            }

            return new SafeString(link(docletMeta.shortpath, template.translate('linkToLine', {
                filepath: docletMeta.shortpath,
                lineno: docletMeta.lineno,
                items: docletMeta.lineno
            }), linkClass, fragmentId));
        },
        linkToTutorial: function(text) {
            return new SafeString(templateHelper.toTutorial(text));
        },
        // Link to a symbol, using its name and the complete signature for that symbol as the link
        // text.
        linkWithSignature: function(doclet, cssClass) {
            var linkText;

            if (typeof cssClass !== 'string') {
                cssClass = null;
            }

            linkText = doclet.name;

            if (needsSignature(doclet)) {
                linkText += formatParams(doclet.params, template);
            }

            return new SafeString(link(doclet.longname, linkText, cssClass));
        },
        // Get a string with descriptions of any modifiers for a symbol (for example, if it's
        // nullable or repeatable).
        modifierText: function(doclet) {
            var descriptions = [];

            if (doclet.nullable === true) {
                descriptions.push(template.translate('tables.body.nullable.long'));
            } else if (doclet.nullable === false) {
                descriptions.push(template.translate('tables.body.nonNullable.long'));
            }

            if (doclet.variable === true) {
                descriptions.push(template.translate('tables.body.repeatable.long'));
            }

            if (typeof doclet.defaultvalue !== 'undefined' && !doclet.isEnum) {
                descriptions.push(template.translate('tables.body.defaultValue', {
                    valueString: template.translate('tables.body.defaultValueString', {
                        value: doclet.defaultvalue
                    })
                }));
            }

            return new SafeString(descriptions.join(' '));
        },
        needsSignature: needsSignature,
        packageLink: function(packageInfo, cssClass) {
            var linkText;

            if (typeof cssClass !== 'string') {
                cssClass = null;
            }

            packageInfo = packageInfo || {};

            linkText = packageInfo.name || template.translate('brandDefault');

            if (packageInfo.name && packageInfo.version) {
                linkText += ' ' + packageInfo.version;
            }

            return new SafeString(link('index', linkText, cssClass));
        },
        parseType: function(type) {
            return parseType(template, type);
        },
        pluck: function(items, key) {
            return _.pluck(items, key);
        },
        reparentItems: function(doclet, key) {
            var itemRegExp;
            var items = doclet[key].slice(0);
            var parentItem = null;

            // only reparent items if that's what the user asked for
            if (_.getPath(template.config, 'tables.nestedPropertyTables')) {
                items.forEach(function(item, i) {
                    if (!item) {
                        return;
                    }

                    if (parentItem && parentItem.name && item.name) {
                        itemRegExp = new RegExp('^(?:' + parentItem.name + '(?:\\[\\])*)\\.(.+)$');

                        if (itemRegExp.test(item.name)) {
                            item = doop(item);
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
        resolveAuthorLinks: function(text) {
            return new SafeString(templateHelper.resolveAuthorLinks(text));
        },
        resolveLinks: function(text) {
            return new SafeString(templateHelper.resolveLinks(text));
        },
        returnTypes: function(returns) {
            var typeUnions = [];

            returns = returns || [];
            returns.forEach(function(returned) {
                if (returned.type && returned.type.names && returned.type.names.length) {
                    typeUnions.push(typeUnion(returned.type.names));
                }
            });

            return parseType(template, typeUnion(typeUnions));
        },
        see: function(see, longname) {
            var atoms;
            var combined = see;

            if (LEADING_SCOPE_PUNC.test(see)) {
                atoms = name.shorten(longname);
                atoms.name = see.substr(1);
                combined = name.combine(atoms);
            }

            return combined;
        },
        shouldHighlight: function(typeName) {
            return ['array', 'object'].indexOf(typeName) !== -1;
        },
        translate: function(key, items, options) {
            var translateOpts;

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
        translateHeading: function(key, items) {
            return new SafeString(template.translate('headings.' + key,
                items ? items.length : null));
        },
        translatePageTitle: function(prefix, title, category) {
            return new SafeString(template.translate('pageTitle', {
                category: category ? template.translate('headings.' + category) : '',
                prefix: prefix,
                title: title
            }));
        },
        typeUnion: function(types) {
            return parseType(template, typeUnion(types));
        }
    };
};
