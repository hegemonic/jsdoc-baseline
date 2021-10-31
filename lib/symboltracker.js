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
/** @module lib/symboltracker */

const _ = require('lodash');

const { CATEGORIES } = require('./enums');
const categoryValues = _.values(CATEGORIES);
const hasOwnProp = Object.prototype.hasOwnProperty;

// Tracks ALL doclets by category (similar, but not identical, to their "kind")
module.exports = class SymbolTracker {
  constructor() {
    for (const value of categoryValues) {
      this[value] = new Set();
    }

    this.longnames = {};
  }

  _addLongname(doclet) {
    if (!hasOwnProp.call(this.longnames, doclet.longname)) {
      this.longnames[doclet.longname] = new Set();
    }

    this.longnames[doclet.longname].add(doclet);

    return this;
  }

  add(doclet, category) {
    if (hasOwnProp.call(this, category)) {
      this[category].add(doclet);
    }

    this._addLongname(doclet);

    return this;
  }

  remove(doclet, category) {
    let removed = [];

    if (hasOwnProp.call(this, category)) {
      if (this[category].has(doclet)) {
        removed.push(doclet);
        this[category].delete(doclet);
      }
    }

    return removed;
  }

  get(category, options) {
    const categories = category ? [category] : _.values(CATEGORIES);
    let doclets;

    options = _.defaults(options || {}, {
      categorize: false,
    });

    doclets = options.categorize ? {} : [];

    for (const current of categories) {
      if (hasOwnProp.call(this, current) && this[current].size) {
        if (options.categorize) {
          doclets[current] = this[current].values();
        } else {
          doclets = doclets.concat(this[current].values());
        }
      }
    }

    return doclets;
  }

  getLongname(longname) {
    if (!hasOwnProp.call(this.longnames, longname)) {
      return [];
    }

    return this.longnames[longname].values();
  }
};
