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
  constructor(conf, context, deps) {
    const cssClassMap = new ClassMap(conf.cssClassMap);
    const loaderOptions = { cssClassMap };

    this._format = null;
    this._l10nData = null;
    this._l10nFormatter = null;
    this._loaders = [
      new ViewLoader(conf.views, loaderOptions),
      new ViewLoader(BASE_VIEWS, loaderOptions),
    ];
    this._renderEnv = null;
    this.config = conf;
    this.context = context;
    this.cssClassMap = cssClassMap;
    this.dependencies = deps;
    this.encoding = this.config.encoding;
    this.extension = '.njk';
    this.locale = this.config.locale;
    this.ids = {};
    this.linkManager = new LinkManager({
      config: conf,
      cssClassMap,
      fileExtension: conf.extensions.outputFiles,
      linkExtension: conf.extensions.links,
    });
    this.log = deps.get('log');
    this.path = this.config.templatePath;
    this.views = new Map();

    this.log.debug(
      `Instantiated the template in ${this.path} with config: ${JSON.stringify(this.config)}`
    );
  }

  async #loadYaml(filepath) {
    let parsedObject;

    try {
      if (filepath) {
        parsedObject = yaml.load(await readFile(filepath, 'utf8'));
      }
    } catch (e) {
      this.log.fatal(`Unable to load the file ${filepath}: ${e}`);
    }

    return parsedObject;
  }

  _compileFormatters(messageFormat, l10nData) {
    let compiled = {};

    messageFormat ??= new MessageFormat(this.locale);
    l10nData ??= this._l10nData;

    Object.keys(l10nData).forEach((key) => {
      const valueType = typeof l10nData[key];

      switch (valueType) {
        case 'string':
          compiled[key] = messageFormat.compile(l10nData[key]);

          break;
        case 'object':
          compiled[key] = this._compileFormatters(messageFormat, l10nData[key]);

          break;
        default:
          throw new Error(`Locale data contains unexpected value with type ${valueType}`);
      }
    });

    return compiled;
  }

  async _init() {
    let prettier;

    await this._renderEnvInit();
    await this._l10nInit();

    try {
      prettier = await import('prettier');
      this._format = prettier.format;
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
  async _l10nInit() {
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
    this._l10nData = deepExtend.apply(deepExtend, l10nData.reverse());
    this._l10nFormatter = this._compileFormatters();

    return this;
  }

  /**
   * Sets up the render environment.
   *
   * @private
   */
  async _renderEnvInit() {
    const { Filters } = await import(this.config.helpers.filters);
    const filters = await Filters.create(this);

    this._renderEnv = new nunjucks.Environment(this._loaders);
    filters.registerAll(this._renderEnv);
  }

  static get BASE_VIEWS() {
    return BASE_VIEWS;
  }

  static async create(...args) {
    const template = new Template(...args);

    await template._init();

    return template;
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
    rendered = this._renderEnv.render(viewName, data);

    if (this.config.beautify && options.beautify) {
      if (!this._format) {
        this.log.warn('Unable to load formatter. Output will not be formatted.');
      } else {
        try {
          rendered = this._format(rendered, PRETTIER_OPTIONS);
        } catch (e) {
          this.log.warn(`Unable to format "${data.pageTitle}": ${e}`);
        }
      }
    }

    return Promise.resolve(rendered);
  }

  translate(key, opts) {
    const formatter = _.get(this._l10nFormatter, key);
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
