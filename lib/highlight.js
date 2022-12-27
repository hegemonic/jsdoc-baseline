/*
  Copyright 2022 Google LLC

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
const { escape: escapeHtml } = require('html-escaper');
const hljs = require('highlight.js/lib/common');
const { log } = require('@jsdoc/util');

const HIGHLIGHT_DISABLED_CLASS = 'no-hljs';
const HIGHLIGHT_ENABLED_CLASS = 'hljs';
const LANGUAGE_CLASS_PREFIX = 'language-';

function getLanguagePrefix(lang) {
  return LANGUAGE_CLASS_PREFIX + lang;
}

/**
 * Adds syntax highlighting to a code snippet.
 *
 * @param {string} code - The code snippet.
 * @param {string?} lang - The language of the code snippet.
 * @param {Object?} opts - Options for the highlighter.
 * @returns {string} The code snippet with syntax highlighting added.
 */
function highlight(code, lang, opts = {}) {
  let cssClass;
  let cssClasses = [];
  let language;
  let languages = null;

  // Only trim trailing whitespace. Trimming leading whitespace would mess up the line numbers.
  code = code.trimEnd();

  if (lang === 'none' || lang === 'plain') {
    // TODO: Use classmap; probably requires extracting cssClass logic from filters.js. Or maybe we
    // could just move the class-swapping to the template loader?
    cssClasses.push(HIGHLIGHT_DISABLED_CLASS);
    code = escapeHtml(code);
  } else {
    // TODO: Use classmap
    cssClasses.push(HIGHLIGHT_ENABLED_CLASS);
    if (lang && hljs.getLanguage(lang)) {
      languages = [lang];
    }

    ({ value: code, language } = hljs.highlightAuto(code, languages));
    if (language) {
      cssClasses.push(getLanguagePrefix(language));
    }
  }

  if (!opts.omitWrapper) {
    // Ignore coverage; there's always at least one CSS class right now.
    /* c8 ignore next */
    cssClass = cssClasses.length ? ` class="${cssClasses.join(' ')}"` : '';
    code = `<code${cssClass}>${code}</code>`;
  }

  return code;
}

/**
 * Gets the appropriate function for applying syntax highlighting to text, based on the user's
 * configuration settings.
 *
 * @param {Object?} deps - The JSDoc dependency container.
 * @return {function} The highlighter function.
 */
exports.getHighlighter = (deps) => {
  let env;
  let highlighter;
  let highlighterConfig;

  if (deps) {
    env = deps.get('env');
    // TODO: Move this config setting
    highlighterConfig = env.conf.markdown.highlight;
  }

  switch (typeof highlighterConfig) {
    case 'string':
      try {
        highlighter = require(highlighterConfig).highlight;
      } catch (e) {
        log.error(e);
      }

      if (typeof highlighter !== 'function') {
        log.error(
          `The syntax highlighting module ${highlighterConfig} does not assign a method to ` +
            '`exports.highlight`. Using the default syntax highlighter.'
        );
        highlighter = highlight;
      }

      break;

    case 'function':
      highlighter = highlighterConfig;

      break;

    default:
      highlighter = highlight;
  }

  return highlighter;
};
