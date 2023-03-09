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

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { Dependencies } from '@jsdoc/core';
import deepExtend from 'deep-extend';
import glob from 'fast-glob';
import _ from 'lodash';

import { defaultConfig } from '../../lib/config.js';
import Template from '../../lib/template.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Resets environment variables used by JSDoc to the default values for tests.
function resetJsdocEnv() {
  const env = {};

  env.conf = {
    markdown: {},
    tags: {
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

  global.helpers.deps = new Dependencies();
  global.helpers.deps.registerValue('env', env);
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

  // Creates a new, fully initialized Template object with the specified configuration settings.
  createTemplate: (config) => {
    config = config || {};
    global.helpers.setup();

    config = deepExtend({}, defaultConfig, config);

    return mock.bypass(async () => {
      const template = await Template.create(config, global.helpers.deps);

      return template;
    });
  },

  deps: new Dependencies(),

  // Renders a Handlebars view.
  render: (...args) => global.helpers.template.render(...args),

  // Sets up the runtime environment so that JSDoc can work properly.
  setup: resetJsdocEnv,
};

global.helpers.template = await (async () => {
  const template = await global.helpers.createTemplate();

  return template;
})();
