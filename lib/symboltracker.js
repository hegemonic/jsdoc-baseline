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
/** @module lib/symboltracker */

const _ = require('lodash');

const { CATEGORIES } = require('./enums');
const categoryValues = _.values(CATEGORIES);
const hasOwnProp = Object.prototype.hasOwnProperty;

// Tracks ALL doclets by category (similar, but not identical, to their "kind")
module.exports = class SymbolTracker {
    constructor() {
        for (let i = 0, l = categoryValues.length; i < l; i++) {
            this[categoryValues[i]] = [];
        }

        this.longnames = {};
    }

    _addLongname(doclet) {
        if (!hasOwnProp.call(this.longnames, doclet.longname)) {
            this.longnames[doclet.longname] = [];
        }

        this.longnames[doclet.longname].push(doclet);

        return this;
    }

    add(doclet, category) {
        if (hasOwnProp.call(this, category)) {
            this[category].push(doclet);
        }

        this._addLongname(doclet);

        return this;
    }

    remove(doclet, category) {
        let idx;
        let removed = [];

        if (hasOwnProp.call(this, category)) {
            idx = this[category].indexOf(doclet);
            if (idx !== -1) {
                removed = this[category].splice(idx, 1);
            }
        }

        return removed;
    }

    get(category, options) {
        const categories = category ? [category] : _.values(CATEGORIES);
        let current;
        let doclets;

        options = _.defaults(options || {}, {
            categorize: false
        });

        doclets = options.categorize ? {} : [];

        for (let i = 0, l = categories.length; i < l; i++) {
            current = categories[i];
            if (hasOwnProp.call(this, current) && this[current].length) {
                if (options.categorize) {
                    doclets[current] = this[current].slice(0);
                }
                else {
                    doclets = doclets.concat(this[current]);
                }
            }
        }

        return doclets;
    }

    getLongname(longname) {
        if (!hasOwnProp.call(this.longnames, longname)) {
            return [];
        }

        return this.longnames[longname].slice(0);
    }
};
