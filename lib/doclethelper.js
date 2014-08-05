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

/** @module lib/doclethelper */

var doop = require('jsdoc/util/doop');
var helper = require('jsdoc/util/templateHelper');
var logger = require('jsdoc/util/logger');
var path = require('jsdoc/path');
var SymbolTracker = require('./symboltracker');

var ENUMS = require('./enums');
var CATEGORIES = ENUMS.CATEGORIES;
var KIND_TO_CATEGORY = ENUMS.KIND_TO_CATEGORY;
var OUTPUT_FILE_CATEGORIES = ENUMS.OUTPUT_FILE_CATEGORIES;

var hasOwnProp = Object.prototype.hasOwnProperty;

var DocletHelper = module.exports = function DocletHelper() {
    // Doclets tracked alphabetically (with namespaces removed)
    this.alpha = {};
    this.data = null;
    // Global doclets
    this.globals = new SymbolTracker();
    // Listeners tracked by event longname
    this.listeners = {};
    // Doclets tracked by longname
    this.longname = {};
    // Doclets tracked by memberof
    this.memberof = {};
    // Longnames of doclets that need their own output file
    this.needsFile = {};
    this.navTree = {};
    this.shortPaths = {};
    this.symbols = new SymbolTracker();

    this._sourcePaths = [];
};

// TODO: think carefully about whether these are the only symbols that should appear as global. For
// example, why not show a global class as such?
function isGlobal(doclet) {
    var globalKinds = ['member', 'function', 'constant', 'typedef'];

    if (doclet.scope === 'global' && globalKinds.indexOf(doclet.kind) !== -1) {
        return true;
    }

    return false;
}

function stripNamespace(name) {
    return name.replace(/^[A-Za-z]+:/, '');
}

function stripVariation(name) {
    return name.replace(/\([^)]\)$/, '');
}

DocletHelper.prototype._trackAlphabetically = function _trackAlphabetically(doclet) {
    var alphaCategory;
    var longname = stripNamespace(doclet.longname);
    var firstChar = longname.charAt(0).toLowerCase();

    if (/[a-z]/.test(firstChar)) {
        alphaCategory = firstChar;
    }
    else if (/[0-9]/.test(firstChar)) {
        alphaCategory = '_numeric';
    }
    else {
        alphaCategory = '_other';
    }

    this.alpha[alphaCategory] = this.alpha[alphaCategory] || {};
    this.alpha[alphaCategory][longname] = doclet;

    return this;
};

DocletHelper.prototype._trackByCategory = function _trackByCategory(doclet, category) {
    var longname = doclet.longname;
    var self = this;

    if (isGlobal(doclet)) {
        // Only track the doclet as a global; we don't want it to appear elsewhere
        this.globals.add(doclet, category);
    }
    else if (longname) {
        // Track the doclet by its longname. Also, if the doclet is a member of something else,
        // track it by its memberof value, so we can easily retrieve all of the members later.
        ['longname', 'memberof'].forEach(function(prop) {
            var docletValue = doclet[prop];

            if (docletValue) {
                self[prop][docletValue] = self[prop][docletValue] || new SymbolTracker();
                self[prop][docletValue].add(doclet, category);
            }
        });
    }

    return this;
};

DocletHelper.prototype._trackListeners = function _trackListeners(doclet) {
    // TODO: shouldn't JSDoc do this? does it already?
    var listens = doclet.listens || [];
    var self = this;

    listens.forEach(function(longname) {
        self.listeners[longname] = self.listeners[longname] || new SymbolTracker();
        self.listeners[longname].add(doclet, CATEGORIES.LISTENERS);
    });

    return this;
};


DocletHelper.prototype._trackMemberof = function _trackMemberof(doclet, category) {
    var longname = doclet.longname;

    if (isGlobal(doclet)) {
        // Only track the doclet as a global; we don't want it to appear elsewhere
        this.globals.add(doclet, category);
    }
    else if (longname && hasOwnProp.call(doclet, 'memberof')) {
        this.memberof[doclet.memberof] = this.memberof[doclet.memberof] || new SymbolTracker();
        this.memberof[doclet.memberof].add(doclet, category);
    }

    return this;
};

DocletHelper.prototype._trackNeedsFile = function _trackNeedsFile(doclet, category) {
    if (doclet.longname && OUTPUT_FILE_CATEGORIES.indexOf(category) !== -1) {
        this.needsFile[doclet.longname] = true;
    }

    return this;
};

// TODO: rename
// TODO: can we move the doclet-munging elsewhere?
DocletHelper.prototype._categorize = function _categorize(doclet) {
    var category;

    // Remove the variation (if present) from the doclet's longname, so we can group variations
    // under the same longname
    doclet.longname = stripVariation(doclet.longname);

    // Preprocessing based on the doclet's kind
    switch (doclet.kind) {
        case 'constant':
            // Group constants with other members
            // TODO: probably not needed
            doclet.kind = 'member';
            break;

        case 'external':
            // strip quotes from externals, since we allow quoted names that would normally indicate
            // a namespace hierarchy (as in `@external "jquery.fn"`)
            // TODO: we should probably be doing this for other types of symbols, here or elsewhere;
            // see jsdoc3/jsdoc#396
            // TODO: can we make this a filter?
            doclet.name = doclet.name.replace(/^"([\s\S]+)"$/g, '$1');
            break;

        default:
            // ignore
            break;
    }

    category = KIND_TO_CATEGORY[doclet.kind];

    if (!category) {
        logger.debug('Not tracking doclet with unknown kind %s. Name: %s, longname: %s',
            doclet.kind, doclet.name, doclet.longname);
    }

    if (category) {
        this.symbols.add(doclet, category);
        this._trackByCategory(doclet, category)
            ._trackNeedsFile(doclet, category);
    }

    this._trackAlphabetically(doclet)
        ._trackListeners(doclet);

    return this;
};

DocletHelper.prototype.addDoclets = function addDoclets(taffyData) {
    var doclet;
    var doclets;
    var i;
    var l;

    // TODO: make these steps configurable (especially sorting!)
    // TODO: try to avoid storing the TaffyDB data
    this.data = helper.prune(taffyData);
    this.data.sort('longname, version, since');

    doclets = this.data().get();

    for (i = 0, l = doclets.length; i < l; i++) {
        this.addDoclet(doclets[i]);
    }

    this.findShortPaths()
        .resolveModuleExports()
        .addListeners();
    // TODO: consider moving this if we're not going to attach the doclets
    this.navTree = helper.longnamesToTree(this.getOutputLongnames());

    for (i = 0, l = doclets.length; i < l; i++) {
        doclet = doclets[i];

        this.registerLink(doclet)
            .addShortPath(doclet)
            .addId(doclet);
    }

    return this;
};

DocletHelper.prototype.addDoclet = function addDoclet(doclet) {
    this._categorize(doclet)
        .processExamples(doclet)
        .processSee(doclet)
        .addSourcePath(doclet)
        .addAncestors(doclet);

    return this;
};

DocletHelper.prototype.hasGlobals = function hasGlobals() {
    return this.globals.hasDoclets();
};

DocletHelper.prototype.registerLink = function registerLink(doclet) {
    var url = helper.createLink(doclet);
    helper.registerLink(doclet.longname, url);

    return this;
};

DocletHelper.prototype.processExamples = function processExamples(doclet) {
    if (doclet.examples) {
        doclet.examples = doclet.examples.map(function(example) {
            var caption, code;

            // TODO: ought to happen in JSDoc proper
            if (example.match(/^\s*<caption>([\s\S]+?)<\/caption>(?:\s*[\n\r])([\s\S]+)$/i)) {
                caption = RegExp.$1;
                code = RegExp.$2;
            }

            return {
                caption: caption || '',
                code: code || example
            };
        });
    }

    return this;
};

DocletHelper.prototype.processSee = function processSee(doclet) {
    if (doclet.see) {
        // support `@see #methodName` as a link to methodName within the current file
        doclet.see = doclet.see.map(function(see) {
            if (/^#\S+/.test(see)) {
                see = helper.linkto(doclet.longname, null, null, see.replace(/^#/, ''));
            }

            return see;
        });
    }

    return this;
};

DocletHelper.prototype.addAncestors = function addAncestors(doclet) {
    // TODO: this appears to be the only place where we use this.data; can we get rid of it?
    doclet.ancestors = helper.getAncestors(this.data, doclet);
};

DocletHelper.prototype.addId = function addId(doclet) {
    var id;

    var url = helper.longnameToUrl[doclet.longname];

    if (url.indexOf('#') !== -1) {
        id = helper.longnameToUrl[doclet.longname].split(/#/).pop();
    }
    else {
        id = doclet.name;
    }

    if (id) {
        doclet.id = helper.getUniqueId(url, id);
    }

    return this;
};

function getPathFromMeta(meta) {
    // TODO: why 'null' as a string?
    return meta.path && meta.path !== 'null' ?
        path.join(meta.path, meta.filename) :
        meta.filename;
}

DocletHelper.prototype.addSourcePath = function addSourcePath(doclet) {
    var sourcePath;

    if (doclet.meta) {
        sourcePath = getPathFromMeta(doclet.meta);
        this.shortPaths[sourcePath] = null;

        if (this._sourcePaths.indexOf(sourcePath) === -1) {
            this._sourcePaths.push(sourcePath);
        }
    }

    return this;
};

function sortModuleDoclets(moduleDoclet, exportsDoclets, docletsByLongname) {
    var result = {
        primary: moduleDoclet || null,
        secondary: []
    };

    if (exportsDoclets) {
        exportsDoclets.forEach(function(doclet) {
            // Don't add module doclets as secondary doclets
            if (doclet.kind === 'module') {
                return;
            }

            // TODO: get rid of this, or make it configurable and move to template file
            doclet = doop(doclet);
            doclet.name = doclet.name
                .replace('module:', 'require("') + '")';
            if (doclet.kind === 'class' || doclet.kind === 'function') {
                doclet.name = '(' + doclet.name + ')';
            }

            docletsByLongname[doclet.longname].remove(doclet, KIND_TO_CATEGORY[doclet.kind]);

            result.secondary.push(doclet);
        });
    }

    return result;
}

/**
 * For classes or functions with the same name as modules (which indicates that the module exports
 * only that class or function), attach the classes or functions to the `exports` property of the
 * appropriate module doclets. The name of each class or function is also updated for display
 * purposes. This function mutates the original arrays.
 *
 * @private
 * @returns {this}
 */
DocletHelper.prototype.resolveModuleExports = function resolveModuleExports() {
    var exportsDoclets;
    var modules = this.symbols.get(CATEGORIES.MODULES);
    var newModules = new SymbolTracker();
    var self = this;
    var sorted;

    if (modules && modules.length) {
        modules.forEach(function(moduleDoclet) {
            exportsDoclets = self.symbols.getLongname(moduleDoclet.longname);
            sorted = sortModuleDoclets(moduleDoclet, exportsDoclets, self.longname);

            if (sorted.secondary.length) {
                moduleDoclet.exports = sorted.secondary;
            }
            // Add the primary module doclet to the new list of module doclets.
            newModules.add(sorted.primary, CATEGORIES.MODULES);
        });
    }

    this.symbols[CATEGORIES.MODULES] = newModules;

    return this;
};

DocletHelper.prototype.addListeners = function addListeners() {
    var events = this.symbols.get(CATEGORIES.EVENTS);
    var self = this;

    events.forEach(function(eventDoclet) {
        var listenerDoclets;

        var listeners = self.listeners[eventDoclet.longname];
        if (listeners) {
            listenerDoclets = listeners.get(CATEGORIES.LISTENERS);
            if (listenerDoclets && listenerDoclets.length) {
                eventDoclet.listeners = eventDoclet.listeners || [];
                listenerDoclets.forEach(function(listenerDoclet) {
                    eventDoclet.listeners.push(listenerDoclet.longname);
                });
            }
        }
    });

    return this;
};

DocletHelper.prototype.findShortPaths = function findShortPaths() {
    var commonPrefix;

    var self = this;

    if (this._sourcePaths.length) {
        commonPrefix = path.commonPrefix(this._sourcePaths);
        this._sourcePaths.forEach(function(filepath) {
            self.shortPaths[filepath] = filepath.replace(commonPrefix, '')
                // always use forward slashes
                .replace(/\\/g, '/');
        });
    }

    return this;
};

DocletHelper.prototype.addShortPath = function addShortPath(doclet) {
    var filepath;

    if (doclet.meta) {
        filepath = getPathFromMeta(doclet.meta);
        if (filepath && hasOwnProp.call(this.shortPaths, filepath)) {
            doclet.meta.shortpath = this.shortPaths[filepath];
        }
    }

    return this;
};

DocletHelper.prototype.getAlphabetized = function getAlphabetized() {
    return this.alpha;
};

DocletHelper.prototype.getCategory = function getCategory(category) {
    return this.symbols.get(category);
};

DocletHelper.prototype.getLongname = function getLongname(longname) {
    if (!hasOwnProp.call(this.longname, longname)) {
        return {};
    }

    return this.longname[longname];
};

DocletHelper.prototype.getMemberof = function getMemberof(longname) {
    if (!hasOwnProp.call(this.memberof, longname)) {
        return {};
    }

    return this.memberof[longname];
};

DocletHelper.prototype.getOutputLongnames = function getOutputLongnames() {
    return Object.keys(this.needsFile);
};

DocletHelper.prototype.getPackage = function getPackage() {
    return this.symbols.get(CATEGORIES.PACKAGES)[0];
};
