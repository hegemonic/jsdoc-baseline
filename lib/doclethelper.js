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
/** @module lib/doclethelper */

const _ = require('lodash');
const helper = require('jsdoc/util/templateHelper');
const logger = require('jsdoc/util/logger');
const name = require('jsdoc/name');
const path = require('jsdoc/path');
// loaded by the file finder
let SymbolTracker;

let finders;

// loaded by the file finder
let ENUMS;
let CATEGORIES;
let KIND_TO_CATEGORY;
let OUTPUT_FILE_CATEGORIES;

const hasOwnProp = Object.prototype.hasOwnProperty;

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

// TODO: think carefully about whether these are the only symbols that should appear as global. For
// example, why not show a global class as such?
function isGlobal({scope, kind}) {
    const globalKinds = ['member', 'function', 'constant', 'typedef'];

    if (scope === 'global' && globalKinds.includes(kind)) {
        return true;
    }

    return false;
}

// Check whether doclet has a category and is not a dummy package object.
function shouldTrack({kind, longname}) {
    return Boolean(KIND_TO_CATEGORY[kind]) && longname !== 'package:undefined';
}

function getPathFromMeta(meta) {
    // TODO: why 'null' as a string?
    return meta.path && meta.path !== 'null' ?
        path.join(meta.path, meta.filename) :
        meta.filename;
}

module.exports = class DocletHelper {
    constructor() {
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
    }

    _trackByCategory(doclet, category) {
        const longname = doclet.longname;

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
            ['longname', 'memberof'].forEach(prop => {
                const docletValue = doclet[prop];

                if (docletValue) {
                    this[prop][docletValue] = hasOwnProp.call(this[prop], docletValue) ?
                        this[prop][docletValue] :
                        new SymbolTracker();
                    this[prop][docletValue].add(doclet, category);
                }
            });
        }

        return this;
    }

    _trackListeners(doclet) {
        const listens = doclet.listens || [];

        listens.forEach(longname => {
            this.listeners[longname] = this.listeners[longname] || new SymbolTracker();
            this.listeners[longname].add(doclet, CATEGORIES.LISTENERS);
        });

        return this;
    }

    _trackMemberof(doclet, category) {
        const longname = doclet.longname;

        if (isGlobal(doclet)) {
            // Only track the doclet as a global; we don't want it to appear elsewhere
            this.globals.add(doclet, category);
        }
        else if (longname && hasOwnProp.call(doclet, 'memberof')) {
            this.memberof[doclet.memberof] = this.memberof[doclet.memberof] || new SymbolTracker();
            this.memberof[doclet.memberof].add(doclet, category);
        }

        return this;
    }

    _trackNeedsFile({longname}, category) {
        if (longname && OUTPUT_FILE_CATEGORIES.includes(category)) {
            this.needsFile[longname] = true;
        }

        return this;
    }

    // TODO: rename
    // TODO: can we move the doclet-munging elsewhere?
    _categorize(doclet) {
        let category;

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

        if (!shouldTrack(doclet)) {
            logger.debug('Not tracking doclet with kind: %s, name: %s, longname: %s',
                doclet.kind, doclet.name, doclet.longname);
        } else {
            this.symbols.add(doclet, category);
            this._trackByCategory(doclet, category)
                ._trackNeedsFile(doclet, category)
                ._trackListeners(doclet);
        }

        return this;
    }

    addDoclets(taffyData) {
        let doclet;
        let doclets;
        let exported;
        let i;
        let ii;
        let j;
        let jj;

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
    }

    addDoclet(doclet) {
        this._categorize(doclet)
            .addSourcePath(doclet);

        return this;
    }

    hasGlobals() {
        return this.globals.hasDoclets();
    }

    registerLink(doclet) {
        const url = helper.createLink(doclet);

        helper.registerLink(doclet.longname, url);

        return this;
    }

    addSourcePath({meta}) {
        let sourcePath;

        if (meta) {
            sourcePath = getPathFromMeta(meta);
            this.shortPaths[sourcePath] = null;

            if (!this._sourcePaths.includes(sourcePath)) {
                this._sourcePaths.push(sourcePath);
            }
        }

        return this;
    }

    _sortModuleDoclets(moduleDoclet, exportsDoclets) {
        const result = {
            primary: moduleDoclet || null,
            secondary: []
        };

        if (exportsDoclets) {
            result.secondary = exportsDoclets
                // 1. Never add module doclets as secondary doclets.
                // 2. Only show symbols that have a type or a description. Make an exception for
                // classes, because we want to show the constructor-signature heading no matter what.
                .filter(({type, description, kind}) => (type || description || kind === 'class') &&
                kind !== 'module')
                .map(function(doclet) {
                    // TODO: get rid of this, or make it configurable and move to template file
                    doclet = _.cloneDeep(doclet);
                    doclet.name = `${doclet.name.replace('module:', 'require("')}")`;
                    if (doclet.kind === 'class' || doclet.kind === 'function') {
                        doclet.name = `(${doclet.name})`;
                    }

                    this.longname[doclet.longname].remove(doclet, KIND_TO_CATEGORY[doclet.kind]);

                    return doclet;
                }, this);
        }

        return result;
    }

    /**
     * For classes or functions with the same name as modules (which indicates that the module exports
     * only that class or function), attach the classes or functions to the `exports` property of the
     * appropriate module doclets. The name of each class or function is also updated for display
     * purposes. This method mutates the original arrays.
     *
     * @private
     * @returns {this}
     */
    resolveModuleExports() {
        let exportsDoclets;
        const modules = this.symbols.get(CATEGORIES.MODULES);
        const newModules = new SymbolTracker();
        let sorted;

        if (modules && modules.length) {
            modules.forEach((moduleDoclet) => {
                exportsDoclets = this.symbols.getLongname(moduleDoclet.longname);
                sorted = this._sortModuleDoclets(moduleDoclet, exportsDoclets);

                if (sorted.secondary.length) {
                    moduleDoclet.exports = sorted.secondary;
                }
                // Add the primary module doclet to the new list of module doclets.
                newModules.add(sorted.primary, CATEGORIES.MODULES);
            });
        }

        this.symbols[CATEGORIES.MODULES] = newModules;

        return this;
    }

    addListeners() {
        const events = this.symbols.get(CATEGORIES.EVENTS);
        const self = this;

        events.forEach(eventDoclet => {
            let listenerDoclets;
            const listeners = self.listeners[eventDoclet.longname];

            if (listeners) {
                listenerDoclets = listeners.get(CATEGORIES.LISTENERS);
                if (listenerDoclets && listenerDoclets.length) {
                    eventDoclet.listeners = eventDoclet.listeners || [];
                    listenerDoclets.forEach(({longname}) => {
                        eventDoclet.listeners.push(longname);
                    });
                }
            }
        });

        return this;
    }

    findShortPaths() {
        let commonPrefix;

        const self = this;

        if (this._sourcePaths.length) {
            commonPrefix = path.commonPrefix(this._sourcePaths);
            this._sourcePaths.forEach(filepath => {
                self.shortPaths[filepath] = filepath.replace(commonPrefix, '')
                    // always use forward slashes
                    .replace(/\\/g, '/');
            });
        }

        return this;
    }

    addShortPath({meta}) {
        let filepath;

        if (meta) {
            filepath = getPathFromMeta(meta);
            if (filepath && hasOwnProp.call(this.shortPaths, filepath)) {
                meta.shortpath = this.shortPaths[filepath];
            }
        }

        return this;
    }

    getCategory(category) {
        return this.symbols.get(category);
    }

    getLongname(longname) {
        if (!hasOwnProp.call(this.longname, longname)) {
            return {};
        }

        return this.longname[longname];
    }

    getMemberof(longname) {
        if (!hasOwnProp.call(this.memberof, longname)) {
            return {};
        }

        return this.memberof[longname];
    }

    getAllLongnames() {
        return Object.keys(this.all);
    }

    getOutputLongnames() {
        const needsFile = this.needsFile;

        return Object.keys(needsFile).filter(longname => needsFile[longname] === true);
    }

    getPackage() {
        return this.symbols.get(CATEGORIES.PACKAGES)[0];
    }
};
