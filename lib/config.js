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
const _ = require('lodash');
const FileInfo = require('./file-info');
const fs = require('fs-extra');
const glob = require('fast-glob');
const { log } = require('@jsdoc/util');
const path = require('path');
const stripJsonComments = require('strip-json-comments');

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

const defaultConfig = (exports.defaultConfig = Object.freeze({
  beautify: false,
  cssClassMap: path.resolve(__dirname, '..', 'styles', 'classmap.json'),
  cssClassPrefix: '!',
  components: {
    footer: true,
    summary: true,
  },
  encoding: 'utf-8', // written to <meta> tag in HTML files
  extensions: {
    links: DEFAULT_FILE_EXTENSION,
    outputFiles: DEFAULT_FILE_EXTENSION,
  },
  helpers: {
    filters: path.resolve(__dirname, 'filters'),
  },
  l10n: path.resolve(__dirname, '..', 'lang'),
  locale: 'en',
  markdown: true,
  modules: [__dirname],
  sourceFiles: {
    generate: true,
    singleLink: true,
  },
  staticFiles: findStaticFiles(),
  tables: {
    nestedPropertyTables: true,
  },
  views: [],
}));

exports.loadConfigSync = (deps) => {
  let config;
  let configPath;
  const env = deps.get('env');
  let templatePath;

  configPath = env.conf.templates.baseline;
  templatePath = env.opts.template;

  if (typeof configPath === 'string') {
    config = exports.readJsonSync(configPath);
  } else {
    config = configPath;
  }

  config = _.defaults(config || {}, _.cloneDeep(defaultConfig));

  config.l10nFile = config.l10nFile || `${config.locale}.yaml`;
  config.templatePath = templatePath;

  return config;
};

exports.readJsonSync = (filepath) => {
  let parsedObject;

  try {
    if (filepath) {
      parsedObject = JSON.parse(stripJsonComments(fs.readFileSync(filepath, 'utf8')));
    }
  } catch (e) {
    log.fatal(`Unable to read the JSON file ${filepath}: ${e}`);
  }

  return parsedObject;
};
