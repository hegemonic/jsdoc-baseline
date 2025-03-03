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

import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import MessageFormat from '@messageformat/core';
import deepExtend from 'deep-extend';
import glob from 'fast-glob';
import yaml from 'js-yaml';
import _ from 'lodash';
import nunjucks from 'nunjucks';

import ClassMap from './class-map.js';
import { LinkManager } from './link-manager.js';
import { ViewLoader } from './loader.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export const BASE_VIEWS = [
  path.resolve(__dirname, '../views/atoms'),
  path.resolve(__dirname, '../views/layouts'),
  path.resolve(__dirname, '../views/macros'),
  path.resolve(__dirname, '../views/partials'),
];
const PRETTIER_OPTIONS = {
  parser: 'html',
  printWidth: 100,
  tabWidth: 2,
};

/** @hideconstructor */
export default class Template {
  #format;
  #l10nData;
  #l10nFormatter;
  #loaders;
  #renderEnv;

  constructor(conf, context, env) {
    const cssClassMap = new ClassMap(conf.cssClassMap);
    const loaderOptions = { cssClassMap };

    this.#format = null;
    this.#l10nData = null;
    this.#l10nFormatter = null;
    this.#loaders = [
      new ViewLoader(conf.views, loaderOptions),
      new ViewLoader(BASE_VIEWS, loaderOptions),
    ];
    this.#renderEnv = null;
    this.config = conf;
    this.context = context;
    this.cssClassMap = cssClassMap;
    this.encoding = this.config.encoding;
    this.env = env;
    this.extension = '.njk';
    this.locale = this.config.locale;
    this.ids = {};
    this.linkManager = new LinkManager({
      config: conf,
      cssClassMap,
      fileExtension: conf.extensions.outputFiles,
      linkExtension: conf.extensions.links,
    });
    this.log = env.log;
    this.path = this.config.templatePath;
    this.views = new Map();

    this.log.debug(
      `Instantiated the template in ${this.path} with config: ${JSON.stringify(this.config)}`
    );
  }

  static get BASE_VIEWS() {
    return BASE_VIEWS;
  }

  static async create(...args) {
    const template = new Template(...args);

    await template.#init();

    return template;
  }

  #compileFormatters(messageFormat, l10nData) {
    let compiled = {};

    messageFormat ??= new MessageFormat(this.locale);
    l10nData ??= this.#l10nData;

    Object.keys(l10nData).forEach((key) => {
      const valueType = typeof l10nData[key];

      switch (valueType) {
        case 'string':
          compiled[key] = messageFormat.compile(l10nData[key]);

          break;
        case 'object':
          compiled[key] = this.#compileFormatters(messageFormat, l10nData[key]);

          break;
        default:
          throw new Error(`Locale data contains unexpected value with type ${valueType}`);
      }
    });

    return compiled;
  }

  async #init() {
    let prettier;

    await this.#renderEnvInit();
    await this.#l10nInit();

    try {
      prettier = await import('prettier');
      this.#format = prettier.format;
    } catch (e) {
      // The formatter is optional, so this is fine. We'll log a warning if a caller tries to render
      // something with the formatter enabled.
    }
  }

  /**
   * Loads the string resources and formatters used for localization.
   *
   * @private
   * @returns {this}
   */
  async #l10nInit() {
    let l10nData;
    let l10nFiles;

    try {
      l10nFiles = await glob.async('*.yaml', {
        absolute: true,
        cwd: this.config.l10n,
        onlyFiles: true,
      });
    } catch (e) {
      this.log.fatal(`Unable to find the localization data file ${this.config.l10nFile}`);

      return this;
    }

    l10nData = await Promise.all(l10nFiles.map((f) => this.#loadYaml(f)));

    // Merge the objects in reverse order so that the first one loaded wins.
    this.#l10nData = deepExtend.apply(deepExtend, l10nData.reverse());
    this.#l10nFormatter = this.#compileFormatters();

    return this;
  }

  async #loadYaml(filepath) {
    let parsedObject;
    let yamlData;

    try {
      if (filepath) {
        yamlData = await readFile(filepath, 'utf8');
        parsedObject = yaml.load(yamlData);
      }
    } catch (e) {
      this.log.fatal(`Unable to load the file ${filepath}: ${e}`);
    }

    return parsedObject;
  }

  render(viewName, data, options = {}) {
    const i18nData = {
      locales: this.config.locale,
    };
    let rendered;

    if (!viewName.endsWith(this.extension)) {
      viewName += this.extension;
    }

    data.intl = i18nData;
    rendered = this.#renderEnv.render(viewName, data);

    if (this.config.beautify && options.beautify) {
      if (!this.#format) {
        this.log.warn('Unable to load formatter. Output will not be formatted.');
      } else {
        try {
          rendered = this.#format(rendered, PRETTIER_OPTIONS);
        } catch (e) {
          this.log.warn(`Unable to format "${data.pageTitle}": ${e}`);
        }
      }
    }

    return Promise.resolve(rendered);
  }

  /**
   * Sets up the render environment.
   *
   * @private
   */
  async #renderEnvInit() {
    const { Filters } = await import(this.config.helpers.filters);
    const filters = await Filters.create(this);

    this.#renderEnv = new nunjucks.Environment(this.#loaders);
    filters.registerAll(this.#renderEnv);
  }

  translate(key, opts) {
    const formatter = _.get(this.#l10nFormatter, key);
    let options;
    let translation;

    if (!formatter) {
      this.log.warn(`Unable to find a localized string for the key ${key}`);

      return '';
    }

    if (typeof opts === 'number') {
      options = {
        items: opts,
      };
    } else {
      options = opts || {};
      if (typeof options.items === 'undefined') {
        options.items = 1;
      }
    }

    translation = formatter(options);

    // Remove the trailing newline, if present.
    return translation.replace(/\n$/, '');
  }
}
