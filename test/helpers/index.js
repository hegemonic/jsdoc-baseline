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

// Helper functions for testing the Baseline template.
import mock from 'mock-fs'; // eslint-disable-line

import EventEmitter from 'node:events';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { Dependencies } from '@jsdoc/core';
import { Doclet, DocletStore, Package } from '@jsdoc/doclet';
import { Dictionary } from '@jsdoc/tag';
import { getLogFunctions } from '@jsdoc/util';
import deepExtend from 'deep-extend';
import { format } from 'prettier';
import glob from 'fast-glob';
import _ from 'lodash';

import { defaultConfig } from '../../lib/config.js';
import Template from '../../lib/template.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const LONGNAME_FAKE_TAG = '@longname ';

function stripWhitespace(str) {
  // Remove leading whitespace.
  str = str.replace(/^[\s]+/gm, '');
  // Remove empty lines.
  str = str.replace(/^\n$/gm, '');

  return str;
}

// Resets environment variables used by JSDoc to the default values for tests.
function resetJsdocEnv() {
  let deps;
  const emitter = new EventEmitter();
  const env = {};

  env.conf = {
    markdown: {},
    tags: {
      allowUnknownTags: true,
      dictionaries: ['jsdoc'],
    },
    templates: {
      cleverLinks: false,
      monospaceLinks: false,
    },
  };
  env.dirname = path.resolve(__dirname, '../../node_modules/jsdoc');
  env.opts = {
    // list of source files parsed by JSDoc
    _: [],
    // encoding for reading/writing files
    encoding: 'utf8',
    // destination for template output
    destination: './out/',
    // path to the JSDoc template
    template: path.resolve(__dirname, '../..'),
  };
  env.version = {
    number: '1.2.3.4',
  };

  global.helpers.deps = deps = new Dependencies();
  deps.registerValue('config', env.conf);
  deps.registerValue('emitter', emitter);
  deps.registerValue('env', env);
  deps.registerValue('log', getLogFunctions(emitter));
  deps.registerValue('options', env.opts);
  deps.registerSingletonFactory('tags', () => Dictionary.fromConfig(deps));
}

function findMatchingFilepath(filepaths, filename) {
  let result;

  for (const filepath of filepaths) {
    if (filepath.endsWith(filename)) {
      result = filepath;
      break;
    }
  }

  return result;
}

global.helpers = {
  // Maps each base view's path to its contents. Allows base views to be read when file system is
  // mocked.
  baseViews: (() => {
    const baseViews = {};
    const viewsPath = path.resolve(__dirname, '../../views');
    const globbed = glob.sync('**/*.njk', {
      cwd: viewsPath,
      fs,
      onlyFiles: true,
    });

    globbed.forEach((filepath) => {
      filepath = path.join(viewsPath, filepath);
      baseViews[filepath] = fs.readFileSync(filepath);
    });

    return baseViews;
  })(),

  // The same as `baseViews()`, but you can override the contents of specific files.
  baseViewsModified: (mods) => {
    const filepaths = Object.keys(global.helpers.baseViews);
    let views = {};

    Object.keys(mods).forEach((filename) => {
      const baseViewsKey = findMatchingFilepath(filepaths, filename);

      if (!baseViewsKey) {
        throw new Error(
          `No existing view named "${filename}". You can only override an existing view.`
        );
      }

      views = _.defaults(views, { [baseViewsKey]: mods[filename] });
    });

    return _.defaults(views, global.helpers.baseViews);
  },

  createDoclet: (comment, meta, deps) => {
    let doclet;
    let longname;

    // `@longname` isn't a real tag, but we accept it for convenience.
    comment = comment.filter((tag) => {
      if (tag.startsWith(LONGNAME_FAKE_TAG)) {
        longname = tag.replace(LONGNAME_FAKE_TAG, '');

        return false;
      }

      return true;
    });

    deps ??= global.helpers.deps;
    meta ??= {};
    doclet = new Doclet(`/**\n${comment.join('\n')}\n*/`, meta, deps);
    if (longname) {
      doclet.longname = longname;
    }

    if (meta?._emitEvent !== false) {
      deps.get('emitter').emit('newDoclet', { doclet });
    }

    return doclet;
  },

  createDocletStore: (doclets) => {
    const docletStore = new DocletStore(global.helpers.deps);

    for (const doclet of doclets) {
      docletStore.add(doclet);
    }

    return docletStore;
  },

  createPackage: (data, deps) => {
    return new Package(JSON.stringify(data ?? {}), deps ?? global.helpers.deps);
  },

  // Creates a new, fully initialized Template object with the specified configuration settings.
  createTemplate: (config) => {
    config = config || {};
    global.helpers.setup();

    config = deepExtend({}, defaultConfig, config);

    return mock.bypass(async () => {
      const template = await Template.create(config, {}, global.helpers.deps);

      return template;
    });
  },

  deps: null,

  handlePromise: (promise, cb) =>
    promise.then(
      () => cb(),
      () => cb()
    ),

  normalizeHtml: async (str) => {
    str = await format(str, {
      parser: 'html',
      tabWidth: 2,
    });

    return stripWhitespace(str);
  },

  // Renders a Handlebars view.
  render: (...args) => global.helpers.template.render(...args),

  renderAndNormalize: async (...args) => {
    const rendered = await global.helpers.render(...args);

    return global.helpers.normalizeHtml(rendered);
  },

  // Sets up the runtime environment so that JSDoc can work properly.
  setup: resetJsdocEnv,

  // Converts a class instance to a dictionary-like object, so that `toEqual()` works.
  toObject: (instance) => JSON.parse(JSON.stringify(instance)),
};

global.helpers.template = await (async () => {
  const template = await global.helpers.createTemplate();

  return template;
})();

resetJsdocEnv();
