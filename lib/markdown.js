/*
  Copyright 2020 Google LLC

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
const { getHighlighter } = require('./highlight');
const MarkdownIt = require('markdown-it');
const mdAnchor = require('markdown-it-anchor');

const inlineTagRegExp = /\{@[^}\r\n]+\}/g;

/**
 * Escapes backslashes within inline tags, so that the Markdown renderer does not treat them as
 * formatting characters.
 *
 * @param {string} text - The text to escape.
 * @return {string} The escaped text.
 */
function escapeInlineTagBackslashes(text) {
  return text.replace(inlineTagRegExp, (wholeMatch) => wholeMatch.replace(/\\/g, '\\\\'));
}

/**
 * Converts `&quot;` to `"` within inline tags.
 *
 * @param {string} text - The text to unencode.
 * @return {string} The modified text, with standard double quotes in inline tags.
 */
function unencodeQuotes(text) {
  return text.replace(inlineTagRegExp, (wholeMatch) => wholeMatch.replace(/&quot;/g, '"'));
}

/**
 * Gets a Markdown parsing function. The parsing function accepts a single parameter containing
 * Markdown source. The function converts the Markdown source to HTML, then returns the HTML as a
 * string.
 *
 * @returns {function} A function that converts Markdown to HTML.
 */
exports.getParser = (deps) => {
  let conf;
  const env = deps.get('env');
  let renderer;

  conf = env.conf.markdown || {};

  renderer = new MarkdownIt({
    breaks: Boolean(conf.hardwrap),
    highlight: getHighlighter(deps),
    html: true,
  });

  if (conf.idInHeadings) {
    renderer.use(mdAnchor, { tabIndex: false });
  }

  return (source) => {
    let result;

    source = escapeInlineTagBackslashes(source);

    result = renderer.render(source).replace(/\s+$/, '').replace(/&#39;/g, "'");
    result = unencodeQuotes(result);

    return result;
  };
};
