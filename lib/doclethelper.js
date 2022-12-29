/*
  Copyright 2014 the Baseline Authors.

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
const { db } = require('./db');
const { log } = require('@jsdoc/util');
const path = require('path');

const { CATEGORIES, KIND_TO_CATEGORY } = require('./enums');
const categoryValues = _.values(CATEGORIES);

const hasOwnProp = Object.prototype.hasOwnProperty;

function isGlobal({ scope, kind }) {
  const globalKinds = ['member', 'function', 'constant', 'typedef'];

  if (scope === 'global' && globalKinds.includes(kind)) {
    return true;
  }

  return false;
}

// Check whether doclet has a category and is not a dummy package object.
function shouldTrack({ kind, longname }) {
  return Boolean(KIND_TO_CATEGORY[kind]) && longname !== 'package:undefined';
}

function getPathFromMeta(meta) {
  // TODO: why 'null' as a string?
  return meta.path && meta.path !== 'null' ? path.join(meta.path, meta.filename) : meta.filename;
}

module.exports = class DocletHelper {
  constructor(dependencies) {
    // Array of all doclets, to facilitate migration away from this class.
    this.allDoclets = [];
    // Doclets tracked by category.
    this.byCategory = new Map();
    this.dependencies = dependencies;
    // Doclets tracked by longname.
    this.longname = {};
    this.shortPaths = {};

    this._sourcePaths = [];

    for (const category of categoryValues) {
      this.byCategory.set(category, new Set());
    }
  }

  _trackByCategory(doclet, category) {
    this.byCategory.get(category).add(doclet);
  }

  _trackByLongname(doclet) {
    const longname = doclet.longname;

    if (!isGlobal(doclet) && longname) {
      // Track the doclet by its longname.
      if (!hasOwnProp.call(this.longname, longname)) {
        this.longname[longname] = [];
      }
      this.longname[longname].push(doclet);
    }

    return this;
  }

  _categorize(doclet) {
    const category = KIND_TO_CATEGORY[doclet.kind];

    if (!shouldTrack(doclet)) {
      log.debug(
        `Not tracking doclet with kind: ${doclet.kind}, name: ${doclet.name}, ` +
          `longname: ${doclet.longname}`
      );
    } else {
      this._trackByCategory(doclet, category);
      this._trackByLongname(doclet);
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

    // TODO: Make sorting configurable; do this work in SetContext task
    doclets = db({
      config: this.dependencies.get('config'),
      values: taffyData().get(),
    });
    doclets = this.allDoclets = doclets.prune().sortOn(['longname', 'version', 'since']).value();

    for (i = 0, ii = doclets.length; i < ii; i++) {
      this._categorize(doclets[i]).addSourcePath(doclets[i]);
    }

    this.findShortPaths().resolveModuleExports();

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

  addSourcePath({ meta }) {
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
      secondary: [],
    };

    if (exportsDoclets) {
      result.secondary = exportsDoclets
        // 1. Never add module doclets as secondary doclets.
        // 2. Only show symbols that have a type or a description. Make an exception for
        // classes, because we want to show the constructor-signature heading no matter what.
        .filter(
          ({ type, description, kind }) =>
            (type || description || kind === 'class') && kind !== 'module'
        );
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
    const modules = this.byCategory.get(CATEGORIES.MODULES);
    const newModules = new Set();
    let sorted;

    if (modules && modules.size) {
      for (const moduleDoclet of modules) {
        exportsDoclets = this.getLongname(moduleDoclet.longname);
        sorted = this._sortModuleDoclets(moduleDoclet, exportsDoclets);

        if (sorted.secondary.length) {
          moduleDoclet.exports = sorted.secondary;
        }
        // Add the primary module doclet to the new list of module doclets.
        newModules.add(sorted.primary);
      }
    }

    this.byCategory.set(CATEGORIES.MODULES, newModules);

    return this;
  }

  findShortPaths() {
    let commonPrefix;
    let sourcePath;

    if (this._sourcePaths.length) {
      // If there's only one filepath, then its short path is just its basename.
      if (this._sourcePaths.length === 1) {
        sourcePath = this._sourcePaths[0];
        this.shortPaths[sourcePath] = path.basename(sourcePath);
      } else {
        commonPrefix = commonPathPrefix(this._sourcePaths);
        this._sourcePaths.forEach((filepath) => {
          this.shortPaths[filepath] = filepath
            .replace(commonPrefix, '')
            // always use forward slashes
            .replace(/\\/g, '/');
        });
      }
    }

    return this;
  }

  addShortPath({ meta }) {
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
