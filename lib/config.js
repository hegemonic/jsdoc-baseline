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

import path from 'node:path';
import { fileURLToPath } from 'node:url';

import glob from 'fast-glob';
import fs from 'fs-extra';
import _ from 'lodash';
import stripJsonComments from 'strip-json-comments';

import FileInfo from './file-info.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

function findStaticFiles() {
  const parentPath = path.resolve(__dirname, '../static');
  const globbed = glob.sync('**/*', {
    cwd: parentPath,
    fs,
    onlyFiles: true,
  });

  return globbed.map((globbedPath) => new FileInfo(parentPath, globbedPath));
}

const DEFAULT_FILE_EXTENSION = '.html';

export const defaultConfig = Object.freeze({
  beautify: false,
  components: {
    footer: true,
    summary: true,
  },
  cssClassMap: {},
  docletSortKeys: ['name', 'longname', 'version', 'since'],
  encoding: 'utf-8', // written to <meta> tag in HTML files
  extensions: {
    links: DEFAULT_FILE_EXTENSION,
    outputFiles: DEFAULT_FILE_EXTENSION,
  },
  helpers: {
    filters: path.resolve(__dirname, 'filters.js'),
  },
  l10n: path.resolve(__dirname, '..', 'lang'),
  lang: 'en-US',
  locale: 'en',
  markdown: true,
  sourceFiles: {
    generate: true,
    singleLink: true,
  },
  // TODO: Make it easier to specify the static files by hand.
  staticFiles: findStaticFiles(),
  tables: {
    nestedPropertyTables: true,
  },
  toc: {
    // Set to `categories` (default) or `tree`.
    type: 'categories',
  },
  views: [],
});

export function readJsonSync(filepath) {
  let parsedObject;

  if (filepath) {
    parsedObject = JSON.parse(stripJsonComments(fs.readFileSync(filepath, 'utf8')));
  }

  return parsedObject;
}

export function loadConfigSync(env) {
  let config;
  let configPath;
  let templatePath;

  configPath = env.conf.templates.baseline;
  templatePath = env.opts.template;

  if (typeof configPath === 'string') {
    try {
      config = readJsonSync(configPath);
    } catch (e) {
      env.log.fatal(e.message);
    }
  } else {
    config = configPath;
  }

  config = _.defaults(config ?? {}, _.cloneDeep(defaultConfig));

  config.l10nFile ??= `${config.locale}.yaml`;
  config.templatePath = templatePath;

  env.templateConfig = config;

  return config;
}
