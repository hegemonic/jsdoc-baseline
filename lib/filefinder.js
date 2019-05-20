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
/**
 * Utility module for finding files across multiple directories. Used to implement template
 * inheritance.
 *
 * @module lib/filefinder
 */

const fs = require('jsdoc/fs');
const path = require('jsdoc/path');

const DEFAULT_FINDER_NAME = 'default';
const RECURSE_DEPTH = 10;

const namedFinders = {};

function equalArrays(arrayA, arrayB) {
    let identical = true;

    // the current implementation of get() cannot trigger this condition
    /* istanbul ignore if */
    if (arrayA === arrayB) {
        return true;
    }

    if (arrayA.length !== arrayB.length) {
        return false;
    }

    for (let i = 0, l = arrayA.length; i < l; i++) {
        if (arrayA[i] !== arrayB[i]) {
            identical = false;
            break;
        }
    }

    return identical;
}

function makeError(filename) {
    return new Error(`ENOENT, no such file or directory ${filename}`);
}

/**
 * Constructor for `FileFinder` objects.
 *
 * @private
 * @class
 */
class FileFinder {
    constructor() {
        this.cache = {};
        this.paths = [];
    }

    /**
     * Find all occurrences of the requested filename in the search paths, using the cached directory
     * listings.
     *
     * @private
     * @param {string} filename - The filename to find.
     * @param {boolean} breakOnFirstMatch - Set to `true` to find only the first occurrence of the file.
     * @return {Array<string>} The resolved paths to each occurrence of the file.
     */
    _findAllSync(filename, breakOnFirstMatch) {
        const found = [];
        let p;
        let resolved;

        for (let i = 0, l = this.paths.length; i < l; i++) {
            p = this.paths[i];
            resolved = path.resolve(p, filename);

            if ({}.hasOwnProperty.call(this.cache[p], resolved)) {
                found.push(resolved);
                if (breakOnFirstMatch) {
                    break;
                }
            }
        }

        return found;
    }

    /**
     * Find the first occurrence of the requested filename in the search paths, using the cached
     * directory listings.
     *
     * @private
     * @param {string} filename - The filename to find.
     * @return {?string} The resolved path to the file.
     */
    _findSync(filename) {
        const found = this._findAllSync(filename, true);

        return found[0] || null;
    }

    /**
     * Find the specified filename in the search paths, and return the fully resolved path to the file.
     *
     * @param {string} filename - The filename to find.
     * @return {string} The fully resolved path to the file.
     * @throws {Error} The specified file cannot be found.
     */
    findFileSync(filename) {
        const filepath = this._findSync(filename);

        if (!filepath) {
            throw makeError(filename);
        }

        return filepath;
    }

    /**
     * Find all occurrences of the specified filename in the search paths, and return the fully resolved
     * paths to each file.
     *
     * @param {string} filename - The filename to find.
     * @return {Array<string>} The fully resolved paths to the files.
     * @throws {Error} The specified file cannot be found.
     */
    findAllFilesSync(filename) {
        const filepaths = this._findAllSync(filename);

        if (!filepaths.length) {
            throw makeError(filename);
        }

        return filepaths;
    }

    /**
     * Find the specified filename in the search paths, and synchronously read the first occurrence of
     * the file.
     *
     * @param {string} filename - The filename to read.
     * @param {string} encoding - The character encoding to use.
     * @return {string} The contents of the specified file.
     * @throws {Error} The specified file cannot be found.
     */
    readFileSync(filename, encoding) {
        const filepath = this._findSync(filename);

        if (!filepath) {
            throw makeError(filename);
        }

        return fs.readFileSync(filepath, encoding);
    }

    /**
     * Require the specified module, using the first occurrence of this module in the search paths.
     *
     * @param {string} filename - The module's filename.
     * @return {Object} The module object.
     * @throws {Error} The module cannot be found.
     */
    require(filename) {
        let filepath;

        ['', '.js', '.json'].forEach(function(ext) {
            if (filepath) {
                return;
            }

            filepath = this._findSync(filename + ext);
        }, this);

        if (!filepath) {
            throw new Error(`Cannot find module '${filename}'`);
        }

        return require(filepath);
    }
}

/**
 * Constructor for `FileFinder` objects. Do not invoke this constructor directly. Instead, use the
 * `get` method to retrieve a fully initialized `FileFinder`.
 *
 * @class
 */
exports.FileFinder = FileFinder;

/**
 * Get a file finder that searches for files in the specified filepaths, in order. If you omit the
 * name, this method returns the default file finder, named `default`.
 *
 * Calling this method will recursively cache the directory listing for each path that you specify.
 * If possible, avoid using filepaths that have a large number of subdirectories or deeply nested
 * subdirectories.
 *
 * @param {string} name - The name of the file finder to retrieve.
 * @param {Array<string>} filepaths - The filepaths that will be searched.
 * @param {Object} options - Options for retrieving the file finder.
 * @param {boolean} [options.forceUpdate=false] - Create a new file finder even if the named finder
 * already exists.
 * @return {module:lib/filefinder.FileFinder} A fully initialized `FileFinder`.
 */
exports.get = (name, filepaths, options) => {
    let finder;

    name = name || DEFAULT_FINDER_NAME;
    options = options || {};

    if (filepaths) {
        filepaths = filepaths.map(filepath => path.resolve(filepath));
    }

    // Reuse the existing finder if:
    //
    // 1.  The finder exists, AND:
    // 2a. The caller didn't provide any filepaths; OR
    // 2b. The caller provided the same filepaths as the existing finder, AND the caller didn't tell
    //     us to force-update.
    if ({}.hasOwnProperty.call(namedFinders, name) && (!filepaths || (!options.forceUpdate &&
        equalArrays(filepaths, namedFinders[name].paths)))) {
        return namedFinders[name];
    }

    finder = new FileFinder();
    finder.paths = filepaths || [];

    finder.paths.forEach(filepath => {
        finder.cache[filepath] = {};

        fs.ls(filepath, RECURSE_DEPTH).forEach(f => {
            finder.cache[filepath][f] = true;
        });
    });

    namedFinders[name] = finder;

    return finder;
};
