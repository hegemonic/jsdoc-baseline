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
import path from 'node:path';

import _ from 'lodash';

import { db } from './db.js';
import { CATEGORIES } from './enums.js';

const categoryValues = _.values(CATEGORIES);

function getPathFromMeta(meta) {
  // TODO: why 'null' as a string?
  return meta.path && meta.path !== 'null' ? path.join(meta.path, meta.filename) : meta.filename;
}

export default class DocletHelper {
  constructor(dependencies) {
    // Array of all doclets, to facilitate migration away from this class.
    this.allDoclets = [];
    // Doclets tracked by category.
    this.byCategory = new Map();
    this.dependencies = dependencies;
    this.docletStore = null;
    this.shortPaths = {};

    this._sourcePaths = [];

    for (const category of categoryValues) {
      this.byCategory.set(category, new Set());
    }
  }

  addDoclets(docletStore) {
    let doclet;
    let doclets;
    let exported;
    let i;
    let ii;
    let j;
    let jj;

    this.docletStore = docletStore;
    // TODO: Make sorting configurable; do this work in SetContext task
    doclets = db({
      config: this.dependencies.get('config'),
      values: Array.from(docletStore.doclets),
    });
    doclets = this.allDoclets = doclets.sortOn(['name', 'longname', 'version', 'since']).value();

    for (i = 0, ii = doclets.length; i < ii; i++) {
      this.addSourcePath(doclets[i]);
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
    const commonPrefix = this.docletStore.commonPathPrefix;
    let sourcePath;

    if (this._sourcePaths.length) {
      // If there's only one filepath, then its short path is just its basename.
      if (this._sourcePaths.length === 1) {
        sourcePath = this._sourcePaths[0];
        this.shortPaths[sourcePath] = path.basename(sourcePath);
      } else {
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
      if (filepath && Object.hasOwn(this.shortPaths, filepath)) {
        meta.shortpath = this.shortPaths[filepath];
      }
    }

    return this;
  }

  getLongname(longname) {
    return Array.from(this.docletStore.docletsByLongname.get(longname));
  }
}
