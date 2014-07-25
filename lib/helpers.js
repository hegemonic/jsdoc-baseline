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

/** @module lib/helpers */

var _ = require('underscore-contrib');
var logger = require('jsdoc/util/logger');
var moment = require('moment');
var templateHelper = require('jsdoc/util/templateHelper');
var util = require('util');

var ENUMS = require('./enums');
var CATEGORIES = ENUMS.CATEGORIES;
var JSDOC_MISSING_TRANSLATION = ENUMS.JSDOC_MISSING_TRANSLATION;
var hasOwnProp = Object.prototype.hasOwnProperty;

function addLink(item, linkText) {
    if (linkText) {
        linkText = templateHelper.htmlsafe(linkText);
    }

    return templateHelper.linkto(item, linkText);
}

function linkItems(arr) {
    arr = arr.slice(0);
    arr.forEach(function(item) {
        item = addLink(item);
    });

    return arr;
}

/**
 * @class
 * @exports module:lib/helpers
 * @param {module:lib/template} template - The template instance that is using the helpers.
 */
var Helpers = module.exports = function Helpers(template) {
    this.template = template;

    // set locale for localized dates
    moment().lang(this.template.config.locale);
};

Helpers.prototype.ancestorLinks = function ancestorLinks(doclet, cssClass) {
    var links = [];

    if (doclet.ancestors) {
        doclet.ancestors.forEach(function(ancestor) {
            var linkText = (templateHelper.scopeToPunc[ancestor.scope] || '') + ancestor.name;
            var link = templateHelper.linkto(ancestor.longname, linkText, cssClass);
            links.push(link);
        });
    }

    if (links.length) {
        links[links.length - 1] += (templateHelper.scopeToPunc[doclet.scope] || '');
    }

    return links.join('');
};

Helpers.prototype.CATEGORIES = CATEGORIES;

Helpers.prototype.config = function config(key) {
    return _.getPath(this.template.options, key);
};

Helpers.prototype.containsFunctionType = function containsFunctionType(type) {
    var containsFunction = false;

    if (type && type.names && type.names.length) {
        for (var i = 0, l = type.names.length; i < l; i++) {
            if (type.names[i].toLowerCase() === 'function') {
                containsFunction = true;
                break;
            }
        }
    }

    return containsFunction;
};

Helpers.prototype.cssClass = function cssClass() {
    var cssClasses = this.template.cssClasses;
    var keys = _.flatten(Array.prototype.slice.call(arguments));
    var mappedClasses = [];

    keys.forEach(function(key) {
        // if the name is prefixed by `!`, strip the prefix and unconditionally add it
        if (key.indexOf('!') === 0) {
            mappedClasses.push(key.substr(1));
        }
        // otherwise, only add the name if the user asked for it
        // (a falsy value doesn't count as "asking for it")
        else if (hasOwnProp.call(cssClasses, key) && cssClasses[key]) {
            mappedClasses.push(key);
        }
    });

    if (!mappedClasses.length) {
        return '';
    }

    return util.format(' class="%s"', mappedClasses.join(' '));
};

Helpers.prototype.formatParams = function formatParams(params) {
    var formatted = '';

    params.filter(function(param) {
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
    });

    formatted = '(' + formatted + ')';

    return formatted;
};

Helpers.prototype.hasOwnProp = function hasOwnProp() {
    var args = Array.prototype.slice.call(arguments, 0);
    var localThis = args.shift();

    return hasOwnProp.apply(localThis, args);
};

Helpers.prototype.jsdocVersion = function jsdocVersion() {
    return global.env.version.number;
};

Helpers.prototype.link = function link(input, linkText) {
    if ( Array.isArray(input) ) {
        return linkItems(input);
    }

    return addLink(input, linkText);
};

Helpers.prototype.localizedDate = function localizedDate(formatString) {
    return moment().format(formatString || this.template.config.dateFormat);
};

Helpers.prototype.log = logger.debug;

Helpers.prototype.moveChildren = function moveChildren(items) {
    var parentItem = null;

    items = items.slice(0);

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

    return _.compact(items);
};

Helpers.prototype.needsSignature = function needsSignature(doclet) {
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
};

Helpers.prototype.translate = function translate(key, opts) {
    /*eslint camelcase: 0 */
    var options;
    var translation;

    if (typeof opts === 'number') {
        options = { smart_count: opts };
    }
    else {
        options = opts || {};
    }

    options = _.defaults(options, {
        _: JSDOC_MISSING_TRANSLATION,
        smart_count: 1
    });
    translation = this.template.l10n.t(key, options);

    if (translation === JSDOC_MISSING_TRANSLATION) {
        logger.warn('Unable to find a localized string for the key %s', key);
    }

    return translation;
};
