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
* Expression helpers for use in Handlebars templates. An expression helper returns text that can be
* added to a rendered view.
*
* @module lib/helpers/expression
*/

var _ = require('underscore-contrib');
var catharsis = require('catharsis');
var escape = require('escape-string-regexp');
var handlebars = require('handlebars');
var logger = require('jsdoc/util/logger');
var moment = require('moment');
var spdxLicenses = require('spdx-license-list');
var templateHelper = require('jsdoc/util/templateHelper');
var util = require('util');

var Exception = handlebars.Exception;
var SafeString = handlebars.SafeString;

var MIN_HEADING_LEVEL = 1;
var MAX_HEADING_LEVEL = 6;
var NUMBER_OF_GROUPS = 3;
var SOFT_BREAK_AFTER = (function() {
    var values = _.values(templateHelper.scopeToPunc);
    values.push('/');

    return new RegExp('([' + escape(values.join('')) + '])', 'g');
})();

// Insert a soft break after any of the characters in SOFT_BREAK_AFTER.
function softBreak(text) {
    return text.replace(SOFT_BREAK_AFTER, '$1<wbr>');
}

function addLink(item, linkText, linkClass) {
    var htmlLink;
    var regExp;

    if (linkText) {
        linkText = templateHelper.htmlsafe(linkText);
        regExp = new RegExp(util.format('(>(%s)<\\\/)', escape(linkText)));
    }

    htmlLink = templateHelper.linkto(item, linkText, linkClass);
    if (regExp) {
        htmlLink = htmlLink.replace(regExp, function(match, p1, p2) {
            return p1.replace(p2, softBreak(p2));
        });
    }

    return htmlLink;
}

function firstDefinedValue() {
    var arg;
    var args = [].slice.call(arguments, 0);

    do {
        arg = args.shift();
        if (arg !== null && typeof arg !== 'undefined') {
            break;
        }
    } while (args.length);

    return arg;
}

function formatDate(template, formatString) {
    return moment().format(formatString || template.translate('dateFormat'));
}

function formatParams(params) {
    var formatted = '';

    (params || []).filter(function(param) {
        return param.name && param.name.indexOf('.') === -1;
    }).forEach(function (param, i) {
        var formattedParam = param.name || '';

        if (param.variable) {
            formattedParam = '...' + formattedParam;
        }

        if (i > 0) {
            formattedParam = ', ' + formattedParam;
        }

        if (param.optional) {
            formattedParam = '[' + formattedParam + ']';
        }

        formatted += formattedParam;
    }, this);

    formatted = '(' + formatted + ')';

    return formatted;
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

function link(input, linkText, linkClass) {
    return addLink(input, linkText, linkClass);
}

function linkList(template, items, open, joiner, close) {
    var links = [];

    if (items.length > 1) {
        open = firstDefinedValue(open, template.translate('linkList.open'));
        joiner = firstDefinedValue(joiner, template.translate('linkList.joiner'));
        close = firstDefinedValue(close, template.translate('linkList.close'));
    } else {
        open = joiner = close = '';
    }

    items.forEach(function(item) {
        // returns a SafeString
        links.push(link(item));
    });

    return open + links.join(joiner) + close;
}

function parseType(template, type) {
    var catharsisOptions = getCatharsisOptions(template);

    return type ?
        catharsis.parse(type, catharsisOptions) :
        '';
}

function stripNamespace(text) {
    return text.replace(/^[A-Za-z]+:/, '');
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

module.exports = function(template) {
    var currentHeadingLevel = MIN_HEADING_LEVEL;

    // set locale for localized dates
    moment().lang(template.config.locale);

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
        ancestorLinks: function(doclet, cssClass) {
            var links = [];

            if (doclet.ancestors) {
                doclet.ancestors.forEach(function(ancestor) {
                    var linkText = (templateHelper.scopeToPunc[ancestor.scope] || '') +
                        ancestor.name;
                    var ancestorLink = templateHelper.linkto(ancestor.longname, linkText, cssClass);
                    links.push(ancestorLink);
                });
            }

            if (links.length) {
                links[links.length - 1] += (templateHelper.scopeToPunc[doclet.scope] || '');
            }

            return links.join('');
        },
        config: function(key) {
            return _.getPath(template.config, key);
        },
        continuedId: function(options) {
            var data = options.data;

            return options.data.continuedIdBase + data.counter;
        },
        continuedIdNext: function(options) {
            var data = options.data;

            return data.continuedIdBase + (data.counter + 1);
        },
        cssClass: function() {
            var cssClasses = template.cssClasses;
            var keys = [].slice.call(arguments, 0, arguments.length - 1);
            var mappedClasses = [];

            keys.forEach(function(key) {
                // if the name is prefixed by `!`, strip the prefix and unconditionally add it
                // TODO: make this configurable
                if (key.indexOf('!') === 0) {
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
        date: function(formatString) {
            return new SafeString(formatDate(template, formatString));
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
                return new SafeString(description.extended[property]);
            } else {
                return new SafeString(description.simple);
            }
        },
        // TODO: make the string literals configurable
        formatParams: formatParams,
        generatedBy: function() {
            return new SafeString(template.translate('generatedBy', {
                version: jsdocVersion(),
                date: formatDate(template)
            }));
        },
        // TODO: is this used anywhere? can we get rid of it?
        group: function(items, groups, perGroup) {
            var grouped = [];
            var toGroup = items.slice(0);

            groups = groups || NUMBER_OF_GROUPS;
            // TODO: does the following default make any sense?
            perGroup = perGroup || NUMBER_OF_GROUPS;

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
        isContinued: function(options) {
            var data = options.data;

            return data.currentSection === data.nextSectionAfterColumn;
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
        licenseLink: function(licenseId) {
            if ({}.hasOwnProperty.call(spdxLicenses, licenseId)) {
                return link(spdxLicenses[licenseId], 'http://spdx.org/licenses/' + licenseId);
            }

            return licenseId;
        },
        link: function(item, linkText, linkClass) {
            // don't treat the `options` object as a parameter
            if (typeof linkClass === 'object') {
                linkClass = null;
            }
            if (typeof linkText === 'object') {
                linkText = null;
            }

            return new SafeString(link(item, linkText, linkClass));
        },
        // Link to the line in a pretty-printed source file where the code associated with a doclet
        // is defined.
        linkToLine: function(docletMeta) {
            /*eslint-disable camelcase */
            return new SafeString(link(docletMeta.shortpath, template.translate('linkToLine', {
                filepath: docletMeta.shortpath,
                lineno: docletMeta.lineno,
                smart_count: docletMeta.lineno
            })));
            /*eslint-enable camelcase */
        },
        linkToTutorial: function(text) {
            return new SafeString(templateHelper.toTutorial(text));
        },
        // Link to a symbol, using the complete signature for that symbol as the link text.
        linkWithSignature: function(doclet, cssClass) {
            var linkText = doclet.name + formatParams(doclet.params);

            return new SafeString(link(doclet.longname, linkText, cssClass));
        },
        // Link to a symbol, using its longname rather than its name, and using the complete
        // signature for that symbol as the link text.
        linkLongnameWithSignature: function(doclet, cssClass) {
            var linkText = stripNamespace(doclet.longname || '');

            if (doclet.params) {
                linkText += formatParams(doclet.params);
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

            if (doclet.defaultValue && !doclet.isEnum) {
                descriptions.push(template.translate('tables.body.defaultValue', {
                    valueString: template.translate('tables.body.defaultValueString', {
                        value: doclet.defaultValue
                    })
                }));
            }

            return new SafeString(descriptions.join(' '));
        },
        // TODO: this is pretty nasty; can we do this in doclethelper instead?
        moveChildren: function(doclet, key) {
            var items = doclet[key].slice(0);
            var parentItem = null;

            items.forEach(function(item, i) {
                // TODO: when would this happen? can we remove it?
                if (!item) {
                    return;
                }

                if (parentItem && item.name && item.name.indexOf(item.name + '.') === 0) {
                    parentItem.children = parentItem.children || [];
                    parentItem.children.push(item);
                    items[i] = null;
                }
                else {
                    parentItem = item;
                }
            });

            doclet[key] = _.compact(items);
        },
        needsSignature: function(doclet) {
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
        },
        packageLink: function(packageInfo, cssClass) {
            var linkText = packageInfo.name || template.translate('brandDefault');

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
        resolveAuthorLinks: function(text) {
            return new SafeString(templateHelper.resolveAuthorLinks(text));
        },
        resolveLinks: function(text) {
            return new SafeString(templateHelper.resolveLinks(text));
        },
        returnTypes: function(returns) {
            var typeUnions = [];

            returns.forEach(function(returned) {
                if (returned.type && returned.type.names && returned.type.names.length) {
                    typeUnions.push(typeUnion(returned.type.names));
                }
            });

            return parseType(template, typeUnion(typeUnions));
        },
        setRootProperty: function(key, value, options) {
            options.root[key] = value;
            return '';
        },
        shouldHighlight: function(typeName) {
            return ['array', 'object'].indexOf(typeName) !== -1;
        },
        translate: function(key, items) {
            return new SafeString(template.translate(key, items.length));
        },
        translateHeading: function(key, items) {
            return new SafeString(template.translate('headings.' + key,
                items ? items.length : null));
        },
        translatePageTitle: function(title, category) {
            if (!category) {
                return title;
            }

            return new SafeString(template.translate('pageTitle', {
                category: template.translate('headings.' + category),
                title: title
            }));
        },
        typeNames: function(doclet) {
            if (doclet && doclet.type && doclet.type.names && doclet.type.names.length) {
                return new SafeString(linkList(template, doclet.type.names));
            }

            return '';
        },
        typeUnion: function(types) {
            return parseType(template, typeUnion(types));
        }
    };
};
