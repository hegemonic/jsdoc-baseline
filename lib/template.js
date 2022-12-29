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
/** @module lib/template */

const _ = require('lodash');
const deepExtend = require('deep-extend');
let format;
const LinkManager = require('./link-manager');
const { log } = require('@jsdoc/util');
const { lsSync } = require('@jsdoc/util').fs;
const MessageFormat = require('messageformat');
const nunjucks = require('nunjucks');
const path = require('path');
const { readFileSync } = require('fs');
const { ViewLoader } = require('./loader');
const yaml = require('js-yaml');

try {
  format = require('prettier').format;
} catch (e) {
  // The formatter is optional, so this is fine. We'll log a warning if a caller tries to render
  // something with the formatter enabled.
}

const BASE_VIEWS = [
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

function loadYaml(filepath) {
  let parsedObject;

  try {
    if (filepath) {
      parsedObject = yaml.load(readFileSync(filepath, 'utf8'));
    }
  } catch (e) {
    log.fatal(`Unable to load the file ${filepath}: ${e}`);
  }

  return parsedObject;
}

module.exports = class Template {
  constructor(conf, deps) {
    this._format = format;
    this._l10nData = null;
    this._l10nFormatter = null;
    this._loaders = [new ViewLoader(conf.views), new ViewLoader(BASE_VIEWS)];
    this._renderEnv = null;
    this.config = conf;
    this.cssClasses = conf.cssClassMap;
    this.dependencies = deps;
    this.encoding = this.config.encoding;
    this.extension = '.njk';
    this.locale = this.config.locale;
    this.ids = {};
    this.linkManager = new LinkManager({
      config: conf,
      fileExtension: conf.extensions.outputFiles,
      linkExtension: conf.extensions.links,
    });
    this.path = this.config.templatePath;
    this.views = new Map();
    this._renderEnvInit()._l10nInit();

    log.debug(`Initialized the template in ${this.path} with config: ${this.config}`);
  }

  /**
   * Loads the string resources and formatters used for localization.
   *
   * @private
   * @returns {this}
   */
  _l10nInit() {
    const l10nData = [];
    let l10nFiles;

    try {
      l10nFiles = lsSync(this.config.l10n, 0);
    } catch (e) {
      log.fatal(`Unable to find the localization data file ${this.config.l10nFile}`);

      return this;
    }

    l10nFiles.forEach((filepath) => {
      l10nData.push(loadYaml(filepath));
    });

    // Merge the objects in reverse order so that the first one loaded wins.
    this._l10nData = deepExtend.apply(deepExtend, l10nData.reverse());
    this._l10nFormatter = new MessageFormat(this.locale).compile(this._l10nData);

    return this;
  }

  /**
   * Sets up the render environment.
   *
   * @private
   * @returns {this}
   */
  _renderEnvInit() {
    const { Filters } = require(this.config.helpers.filters);
    const filters = new Filters(this);

    this._renderEnv = new nunjucks.Environment(this._loaders);
    filters.registerAll(this._renderEnv);

    return this;
  }

  static get BASE_VIEWS() {
    return BASE_VIEWS;
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
        log.warn(`Unable to load formatter. Output will not be formatted.`);
      } else {
        rendered = this._format(rendered, PRETTIER_OPTIONS);
      }
    }

    return rendered;
  }

  translate(key, opts) {
    const formatter = _.get(this._l10nFormatter, key);
    let options;
    let translation;

    if (!formatter) {
      log.warn(`Unable to find a localized string for the key ${key}`);

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
};
