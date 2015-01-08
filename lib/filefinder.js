/*
    Copyright 2015 Google Inc. All rights reserved.

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
 * Utility module for finding files across multiple directories. Used to implement template
 * inheritance.
 *
 * @module lib/filefinder
 */

var fs = require('jsdoc/fs');
var path = require('jsdoc/path');

var DEFAULT_FINDER_NAME = 'default';
var RECURSE_DEPTH = 10;

var namedFinders = {};

function equalArrays(arrayA, arrayB) {
    var identical = true;

    if (arrayA === arrayB) {
        return true;
    }

    if (arrayA.length !== arrayB.length) {
        return false;
    }

    for (var i = 0, l = arrayA.length; i < l; i++) {
        if (arrayA[i] !== arrayB[i]) {
            identical = false;
            break;
        }
    }

    return identical;
}

function makeError(filename) {
    return new Error('ENOENT, no such file or directory ' + filename);
}

/**
 * Constructor for `FileFinder` objects.
 *
 * @private
 * @class
 */
function FileFinder() {
    this.cache = {};
    this.paths = [];
}
/**
 * Constructor for `FileFinder` objects. Do not invoke this constructor directly. Instead, use the
 * `get` method to retrieve a fully initialized `FileFinder`.
 *
 * @class
 */
exports.FileFinder = FileFinder;

/**
 * Find the first occurrence of the requested filename in the search paths, using the cached
 * directory listings.
 *
 * @private
 * @param {string} filename - The filename to find.
 * @return {?string} The resolved path to the file.
 */
FileFinder.prototype._findSync = function(filename) {
    var p;
    var found = null;
    var resolved;

    for (var i = 0, l = this.paths.length; i < l; i++) {
        p = this.paths[i];
        resolved = path.resolve(p, filename);

        if (this.cache[p][resolved]) {
            found = resolved;
            break;
        }
    }

    return found;
};

/**
 * Find the specified filename in the search paths, and return the fully resolved path to the file.
 *
 * @param {string} filename - The filename to find.
 * @return {string} The fully resolved path to the file.
 * @throws {Error} The specified file cannot be found.
 */
FileFinder.prototype.findFileSync = function(filename) {
    var filepath = this._findSync(filename);

    if (!filepath) {
        throw makeError(filename);
    }

    return filepath;
};

/**
 * Find the specified filename in the search paths, and synchronously read the first occurrence of
 * the file.
 *
 * @param {string} filename - The filename to read.
 * @param {string} encoding - The character encoding to use.
 * @return {string} The contents of the specified file.
 * @throws {Error} The specified file cannot be found.
 */
FileFinder.prototype.readFileSync = function(filename, encoding) {
    var filepath = this._findSync(filename);

    if (!filepath) {
        throw makeError(filename)
    }

    return fs.readFileSync(filepath, encoding);
};

/**
 * Require the specified module, using the first occurrence of this module in the search paths.
 *
 * @param {string} filename - The module's filename.
 * @return {Object} The module object.
 * @throws {Error} The module cannot be found.
 */
FileFinder.prototype.require = function(filename) {
    var filepath;

    ['', '.js', '.json'].forEach(function(ext) {
        if (filepath) {
            return;
        }

        filepath = this._findSync(filename + ext);
    }, this);

    if (!filepath) {
        throw new Error('Cannot find module \'' + filename + '\'');
    }

    return require(filepath);
};

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
exports.get = function(name, filepaths, options) {
    var finder;

    name = name || DEFAULT_FINDER_NAME;
    options = options || {};

    if (filepaths) {
        filepaths = filepaths.map(function(filepath) {
            return path.resolve(filepath);
        });
    }

    // Reuse the existing finder if:
    //
    // a) The caller didn't provide any filepaths; OR
    // b) The caller provided the same filepaths as the existing finder, AND the caller didn't tell
    //    us to force-update.
    if (!filepaths || (!options.forceUpdate && {}.hasOwnProperty.call(namedFinders, name) &&
        equalArrays(filepaths, namedFinders[name].paths))) {
        return namedFinders[name];
    }

    finder = new FileFinder();
    finder.paths = filepaths;

    finder.paths.forEach(function(filepath) {
        finder.cache[filepath] = {};

        fs.ls(filepath, RECURSE_DEPTH).forEach(function(f) {
            finder.cache[filepath][f] = true;
        });
    });

    namedFinders[name] = finder;
    return finder;
};
