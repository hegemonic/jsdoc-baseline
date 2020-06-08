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
const { KIND_TO_CATEGORY } = require('./enums');
const lodash = require('lodash');
const ow = require('ow');

function pruner(access, doclet) {
    // By default, we remove:
    //
    // + Doclets that explicitly declare that they should be ignored
    // + "Undocumented" doclets (usually code with no JSDoc comment; might also include some odd
    //   artifacts of the parsing process)
    // + Doclets that claim to belong to an anonymous scope
    if (doclet.ignore === true) {
        return true;
    }
    if (doclet.undocumented === true) {
        return true;
    }
    if (doclet.memberof === '<anonymous>') {
        return true;
    }

    // We also remove private doclets by default, unless the user told us not to.
    if ((!access.length || (!access.includes('all') && !access.includes('private'))) &&
        doclet.access === 'private') {
        return true;
    }

    if (access.length && !access.includes('all')) {
        // The string `undefined` needs special treatment.
        if (!access.includes('undefined') && (doclet.access === null || doclet.access === undefined)) {
            return true;
        }
        // For other access levels, we can just check whether the user asked us to keep that level.
        if (!access.includes('package') && doclet.access === 'package') {
            return true;
        }
        if (!access.includes('private') && doclet.access === 'private') {
            return true;
        }
        if (!access.includes('protected') && doclet.access === 'protected') {
            return true;
        }
        if (!access.includes('public') && doclet.access === 'public') {
            return true;
        }
    }

    return false;
}

exports.mixins = {
    categorize: (_, _config, doclets) => {
        const categorized = {};

        for (const kind of Object.keys(KIND_TO_CATEGORY)) {
            const category = KIND_TO_CATEGORY[kind];
            const found = doclets.filter(d => d.kind === kind);

            if (found.length) {
                categorized[category] = (categorized[category] || []).concat(found);
            }
        }

        return categorized;
    },
    prune: (_, config, doclets) => {
        const access = (config && config.opts && config.opts.access) ? config.opts.access : null;

        if (access) {
            _.remove(doclets, d => pruner(access, d));
        }

        return doclets;
    },
    sortOn: (_, _config, doclets, keys) => {
        doclets.sort((a, b) => {
            const k = keys.slice();
            let result = 0;

            while (k.length) {
                const key = k.pop();

                if (a[key] > b[key] || (b[key] && !a[key])) {
                    result = 1;
                }
                if (a[key] < b[key] || (a[key] && !b[key])) {
                    result = -1;
                }
            }

            return result;
        });

        return doclets;
    }
};

exports.db = ({ config, mixins = exports.mixins, values }) => {
    ow(config, ow.optional.object);
    if (config) {
        ow(config.opts, ow.object);
        ow(config.opts.access, ow.optional.array.ofType(ow.string));
    }
    ow(mixins, ow.object.valuesOfType(ow.function));
    ow(values, ow.array);

    const _ = lodash.runInContext();
    const boundMixins = {};

    Object.keys(mixins).forEach(key => {
        boundMixins[key] = (...args) => mixins[key](_, config, ...args);
    });

    _.mixin(boundMixins);

    return _.chain(values.slice(0));
};
