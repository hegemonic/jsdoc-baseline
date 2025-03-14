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
export const CATEGORIES = {
  CLASSES: 'classes',
  ENUMS: 'enums',
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
  TYPEDEFS: 'typedefs',
};

// Map of doclet kinds to template categories. Note that globals are a category, but they cannot be
// identified by their kind.
export const KIND_TO_CATEGORY = {
  class: CATEGORIES.CLASSES,
  constant: CATEGORIES.PROPERTIES,
  enum: CATEGORIES.ENUMS,
  event: CATEGORIES.EVENTS,
  external: CATEGORIES.EXTERNALS,
  function: CATEGORIES.FUNCTIONS,
  interface: CATEGORIES.INTERFACES,
  member: CATEGORIES.PROPERTIES,
  mixin: CATEGORIES.MIXINS,
  module: CATEGORIES.MODULES,
  namespace: CATEGORIES.NAMESPACES,
  package: CATEGORIES.PACKAGES,
  // 'source' is not a doclet kind
  typedef: CATEGORIES.TYPEDEFS,
};

// Map of template categories to doclet kinds.
export const CATEGORY_TO_KIND = (() => {
  const result = {};

  for (const key of Object.keys(KIND_TO_CATEGORY)) {
    const category = KIND_TO_CATEGORY[key];

    result[category] = result[category] || [];
    result[category].push(key);
  }

  return result;
})();

// Categories that require a separate output file for each longname.
export const OUTPUT_FILE_CATEGORIES = [
  CATEGORIES.CLASSES,
  CATEGORIES.EXTERNALS,
  CATEGORIES.INTERFACES,
  CATEGORIES.MIXINS,
  CATEGORIES.MODULES,
  CATEGORIES.NAMESPACES,
];

// Doclet kinds that require a separate output file for each longname.
export const OUTPUT_FILE_KINDS = OUTPUT_FILE_CATEGORIES.reduce(
  (accumulator, current) => accumulator.concat(CATEGORY_TO_KIND[current]),
  []
);
