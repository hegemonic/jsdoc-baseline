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

/** @module lib/doclethelper */

var doop = require('jsdoc/util/doop');
var helper = require('jsdoc/util/templateHelper');
var logger = require('jsdoc/util/logger');
var name = require('jsdoc/name');
var path = require('jsdoc/path');
// loaded by the file finder
var SymbolTracker;

var finders;

// loaded by the file finder
var ENUMS;
var CATEGORIES;
var KIND_TO_CATEGORY;
var OUTPUT_FILE_CATEGORIES;

var hasOwnProp = Object.prototype.hasOwnProperty;

// set up modules that cannot be preloaded
function init() {
    if (!ENUMS) {
        finders = {
            // this finder should exist by the time we get here
            modules: require('./filefinder').get('modules')
        };

        SymbolTracker = finders.modules.require('./symboltracker');

        ENUMS = finders.modules.require('./enums');
        CATEGORIES = ENUMS.CATEGORIES;
        KIND_TO_CATEGORY = ENUMS.KIND_TO_CATEGORY;
        OUTPUT_FILE_CATEGORIES = ENUMS.OUTPUT_FILE_CATEGORIES;
    }
}

var DocletHelper = module.exports = function() {
    init();

    // Doclets tracked by longname, not categorized
    this.all = {};
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

DocletHelper.prototype._trackByCategory = function(doclet, category) {
    var longname = doclet.longname;
    var self = this;

    if (isGlobal(doclet)) {
        // Only track the doclet as a global; we don't want it to appear elsewhere
        this.globals.add(doclet, category);
    }
    else if (longname) {
        // Track the doclet by its longname, unless it's a package.
        if (!hasOwnProp.call(this.all, longname) && doclet.kind !== 'package') {
            this.all[longname] = doclet;
        }

        // Using a categorized tracker, track the doclet by its longname. Also, if the doclet is a
        // member of something else, track it by its memberof value, so we can easily retrieve all
        // of the members later.
        ['longname', 'memberof'].forEach(function(prop) {
            var docletValue = doclet[prop];

            if (docletValue) {
                self[prop][docletValue] = hasOwnProp.call(self[prop], docletValue) ?
                    self[prop][docletValue] :
                    new SymbolTracker();
                 self[prop][docletValue].add(doclet, category);
            }
        });
    }

    return this;
};

DocletHelper.prototype._trackListeners = function(doclet) {
    var listens = doclet.listens || [];
    var self = this;

    listens.forEach(function(longname) {
        self.listeners[longname] = self.listeners[longname] || new SymbolTracker();
        self.listeners[longname].add(doclet, CATEGORIES.LISTENERS);
    });

    return this;
};


DocletHelper.prototype._trackMemberof = function(doclet, category) {
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

DocletHelper.prototype._trackNeedsFile = function(doclet, category) {
    if (doclet.longname && OUTPUT_FILE_CATEGORIES.indexOf(category) !== -1) {
        this.needsFile[doclet.longname] = true;
    }

    return this;
};

DocletHelper.prototype._shouldTrack = function(doclet) {
    // does the doclet have a category?
    return !!KIND_TO_CATEGORY[doclet.kind] &&
        // is the doclet a dummy package object?
        doclet.longname !== 'package:undefined';
};

// TODO: rename
// TODO: can we move the doclet-munging elsewhere?
DocletHelper.prototype._categorize = function(doclet) {
    var category;

    // Remove the variation (if present) from the doclet's longname, so we can group variations
    // under the same longname
    // TODO: store these in a lookup table rather than mangling the doclet
    doclet.longname = name.stripVariation(doclet.longname);

    // Preprocessing based on the doclet's kind
    switch (doclet.kind) {
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

    if (!this._shouldTrack(doclet)) {
        logger.debug('Not tracking doclet with kind: %s, name: %s, longname: %s',
            doclet.kind, doclet.name, doclet.longname);
    } else {
        this.symbols.add(doclet, category);
        this._trackByCategory(doclet, category)
            ._trackNeedsFile(doclet, category)
            ._trackListeners(doclet);
    }

    return this;
};

DocletHelper.prototype.addDoclets = function(taffyData) {
    var doclet;
    var doclets;
    var exported;
    var i;
    var ii;
    var j;
    var jj;

    // TODO: make these steps configurable (especially sorting!)
    helper.prune(taffyData);
    taffyData.sort('longname, version, since');

    doclets = taffyData().get();

    for (i = 0, ii = doclets.length; i < ii; i++) {
        this.addDoclet(doclets[i]);
    }

    this.findShortPaths()
        .resolveModuleExports()
        .addListeners();
    this.navTree = helper.longnamesToTree(this.getOutputLongnames());
    this.allLongnamesTree = helper.longnamesToTree(this.getAllLongnames(), this.all);

    for (i = 0, ii = doclets.length; i < ii; i++) {
        doclet = doclets[i];

        this.registerLink(doclet)
            .addShortPath(doclet);

        // repeat the per-doclet tasks for any exported doclets that are attached to this one
        // TODO: can we avoid the need to do this?
        if (doclet.exports) {
            for (j = 0, jj = doclet.exports.length; j < jj; j++) {
                exported = doclet.exports[j];

                this.addShortPath(exported);
            }
        }
    }

    return this;
};

DocletHelper.prototype.addDoclet = function(doclet) {
    this._categorize(doclet)
        .addSourcePath(doclet);

    return this;
};

DocletHelper.prototype.hasGlobals = function() {
    return this.globals.hasDoclets();
};

DocletHelper.prototype.registerLink = function(doclet) {
    var url = helper.createLink(doclet);
    helper.registerLink(doclet.longname, url);

    return this;
};

function getPathFromMeta(meta) {
    // TODO: why 'null' as a string?
    return meta.path && meta.path !== 'null' ?
        path.join(meta.path, meta.filename) :
        meta.filename;
}

DocletHelper.prototype.addSourcePath = function(doclet) {
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

DocletHelper.prototype._sortModuleDoclets = function(moduleDoclet, exportsDoclets) {
    var result = {
        primary: moduleDoclet || null,
        secondary: []
    };

    if (exportsDoclets) {
        result.secondary = exportsDoclets
            // 1. Never add module doclets as secondary doclets.
            // 2. Only show symbols that have a type or a description. Make an exception for
            // classes, because we want to show the constructor-signature heading no matter what.
            .filter(function(doclet) {
                return (doclet.type || doclet.description || doclet.kind === 'class') &&
                    doclet.kind !== 'module';
            })
            .map(function(doclet) {
                // TODO: get rid of this, or make it configurable and move to template file
                doclet = doop(doclet);
                doclet.name = doclet.name
                    .replace('module:', 'require("') + '")';
                if (doclet.kind === 'class' || doclet.kind === 'function') {
                    doclet.name = '(' + doclet.name + ')';
                }

                this.longname[doclet.longname].remove(doclet, KIND_TO_CATEGORY[doclet.kind]);

                return doclet;
            }, this);
    }

    return result;
};

/**
 * For classes or functions with the same name as modules (which indicates that the module exports
 * only that class or function), attach the classes or functions to the `exports` property of the
 * appropriate module doclets. The name of each class or function is also updated for display
 * purposes. This function mutates the original arrays.
 *
 * @private
 * @returns {this}
 */
DocletHelper.prototype.resolveModuleExports = function() {
    var exportsDoclets;
    var modules = this.symbols.get(CATEGORIES.MODULES);
    var newModules = new SymbolTracker();
    var sorted;

    if (modules && modules.length) {
        modules.forEach(function(moduleDoclet) {
            exportsDoclets = this.symbols.getLongname(moduleDoclet.longname);
            sorted = this._sortModuleDoclets(moduleDoclet, exportsDoclets);

            if (sorted.secondary.length) {
                moduleDoclet.exports = sorted.secondary;
            }
            // Add the primary module doclet to the new list of module doclets.
            newModules.add(sorted.primary, CATEGORIES.MODULES);
        }, this);
    }

    this.symbols[CATEGORIES.MODULES] = newModules;

    return this;
};

DocletHelper.prototype.addListeners = function() {
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

DocletHelper.prototype.findShortPaths = function() {
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

DocletHelper.prototype.addShortPath = function(doclet) {
    var filepath;

    if (doclet.meta) {
        filepath = getPathFromMeta(doclet.meta);
        if (filepath && hasOwnProp.call(this.shortPaths, filepath)) {
            doclet.meta.shortpath = this.shortPaths[filepath];
        }
    }

    return this;
};

DocletHelper.prototype.getCategory = function(category) {
    return this.symbols.get(category);
};

DocletHelper.prototype.getLongname = function(longname) {
    if (!hasOwnProp.call(this.longname, longname)) {
        return {};
    }

    return this.longname[longname];
};

DocletHelper.prototype.getMemberof = function(longname) {
    if (!hasOwnProp.call(this.memberof, longname)) {
        return {};
    }

    return this.memberof[longname];
};

DocletHelper.prototype.getAllLongnames = function() {
    return Object.keys(this.all);
};

DocletHelper.prototype.getOutputLongnames = function() {
    var needsFile = this.needsFile;

    return Object.keys(needsFile).filter(function(longname) {
        return needsFile[longname] === true;
    });
};

DocletHelper.prototype.getPackage = function() {
    return this.symbols.get(CATEGORIES.PACKAGES)[0];
};
