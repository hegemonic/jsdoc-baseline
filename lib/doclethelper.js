/*
    Copyright 2014-2020 Google LLC

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
const commonPathPrefix = require('common-path-prefix');
const helper = require('jsdoc/util/templateHelper');
const { log } = require('@jsdoc/util');
const path = require('path');
const SymbolTracker = require('./symboltracker');

const { CATEGORIES, KIND_TO_CATEGORY } = require('./enums');

const hasOwnProp = Object.prototype.hasOwnProperty;

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
        // Doclets tracked by longname, not categorized
        this.all = {};
        // Array of all doclets, to facilitate migration away from this class.
        this.allDoclets = [];
        // Global doclets
        this.globals = new SymbolTracker();
        // Doclets tracked by longname
        this.longname = {};
        // Doclets tracked by memberof
        this.memberof = {};
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

    // TODO: rename
    // TODO: can we move the doclet-munging elsewhere?
    _categorize(doclet) {
        let category;

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
            log.debug(
                `Not tracking doclet with kind: ${doclet.kind}, name: ${doclet.name}, ` +
                `longname: ${doclet.longname}`);
        } else {
            this.symbols.add(doclet, category);
            this._trackByCategory(doclet, category);
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

        doclets = this.allDoclets = taffyData().get();

        for (i = 0, ii = doclets.length; i < ii; i++) {
            this._categorize(doclets[i])
                .addSourcePath(doclets[i]);
        }

        this.findShortPaths()
            .resolveModuleExports();

        for (i = 0, ii = doclets.length; i < ii; i++) {
            doclet = doclets[i];

            this.addShortPath(doclet);

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

    findShortPaths() {
        let commonPrefix;

        if (this._sourcePaths.length) {
            commonPrefix = commonPathPrefix(this._sourcePaths);
            this._sourcePaths.forEach(filepath => {
                this.shortPaths[filepath] = filepath.replace(commonPrefix, '')
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

    getLongname(longname) {
        if (!hasOwnProp.call(this.longname, longname)) {
            return {};
        }

        return this.longname[longname];
    }
};
