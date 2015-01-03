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

var fs = require('jsdoc/fs');
var path = require('jsdoc/path');

var RECURSE_DEPTH = 10;

/**
 * Utility for finding files across multiple directories. Used to implement template inheritance.
 *
 * @exports lib/filefinder
 */
function FileFinder() {
    this.cache = {};
    this.paths = [];
}
/**
 * Constructor for the module object.
 * @class
 */
FileFinder.prototype.FileFinder = FileFinder;

/**
 * Set the list of paths to search, and recursively cache the directory listing for each path.
 * Paths are searched in order.
 *
 * @param {Array<string>} filepaths - The filepaths that will be searched.
 */
FileFinder.prototype.loadPathsSync = function(filepaths) {
    this.cache = {};
    this.paths = filepaths.map(function(filepath) {
        return path.resolve(filepath);
    });

    this.paths.forEach(function(filepath) {
        this.cache[filepath] = {};

        fs.ls(filepath, RECURSE_DEPTH).forEach(function(f) {
            this.cache[filepath][f] = true;
        }, this);
    }, this);
};

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
        throw new Error('ENOENT, no such file or directory ' + filename);
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

module.exports = new FileFinder();
