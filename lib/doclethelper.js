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

export default class DocletHelper {
  constructor() {
    this.docletStore = null;
    this.shortPaths = {};
  }

  addDoclets(docletStore) {
    this.docletStore = docletStore;

    this.findShortPaths().resolveModuleExports();

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
   * purposes.
   *
   * @private
   * @returns {this}
   */
  resolveModuleExports() {
    let exportsDoclets;
    const modules = this.docletStore.docletsByKind.get('module');
    let sorted;

    if (modules && modules.size) {
      for (const moduleDoclet of modules) {
        exportsDoclets = Array.from(this.docletStore.docletsByLongname.get(moduleDoclet.longname));
        sorted = this._sortModuleDoclets(moduleDoclet, exportsDoclets);

        if (sorted.secondary.length) {
          moduleDoclet.exports = sorted.secondary;
        }
      }
    }

    return this;
  }

  findShortPaths() {
    const commonPrefix = this.docletStore.commonPathPrefix + '/';
    let sourcePath;
    const sourcePaths = this.docletStore.sourcePaths;

    // If there's only one filepath, then its short path is just its basename.
    if (sourcePaths.length === 1) {
      sourcePath = sourcePaths[0];
      this.shortPaths[sourcePath] = path.basename(sourcePath);
    } else if (sourcePaths.length) {
      sourcePaths.forEach((filepath) => {
        this.shortPaths[filepath] = filepath
          .replace(commonPrefix, '')
          // Always use forward slashes.
          .replace(/\\/g, '/');
      });
    }

    return this;
  }
}
