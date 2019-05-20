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
const _ = require('lodash');

const CATEGORIES = exports.CATEGORIES = {
    CLASSES: 'classes',
    EVENTS: 'events',
    EXTERNALS: 'externals',
    FUNCTIONS: 'functions',
    GLOBALS: 'globals',
    INTERFACES: 'interfaces',
    LISTENERS: 'listeners',
    MIXINS: 'mixins',
    MODULES: 'modules',
    NAMESPACES: 'namespaces',
    PACKAGES: 'packages',
    PROPERTIES: 'properties',
    SOURCES: 'sources',
    TUTORIALS: 'tutorials',
    TYPEDEFS: 'typedefs'
};

// Map of doclet kinds to template categories. Must also call `isGlobal()` to determine whether a
// doclet is global.
exports.KIND_TO_CATEGORY = {
    'class': CATEGORIES.CLASSES,
    'constant': CATEGORIES.PROPERTIES,
    'event': CATEGORIES.EVENTS,
    'external': CATEGORIES.EXTERNALS,
    'function': CATEGORIES.FUNCTIONS,
    'interface': CATEGORIES.INTERFACES,
    'member': CATEGORIES.PROPERTIES,
    'mixin': CATEGORIES.MIXINS,
    'module': CATEGORIES.MODULES,
    'namespace': CATEGORIES.NAMESPACES,
    'package': CATEGORIES.PACKAGES,
    // 'source' is not a doclet kind
    // 'tutorial' is not a doclet kind
    'typedef': CATEGORIES.TYPEDEFS
};

// Map of template categories to doclet kinds.
exports.CATEGORY_TO_KIND = _.invert(exports.KIND_TO_CATEGORY);

// Categories that require a separate output file for each longname.
exports.OUTPUT_FILE_CATEGORIES = [
    CATEGORIES.CLASSES,
    CATEGORIES.EXTERNALS,
    CATEGORIES.INTERFACES,
    CATEGORIES.MIXINS,
    CATEGORIES.MODULES,
    CATEGORIES.NAMESPACES
];

// Doclet kinds that require a separate output file for each longname.
exports.OUTPUT_FILE_KINDS = exports.OUTPUT_FILE_CATEGORIES.map(category => exports.CATEGORY_TO_KIND[category]);
