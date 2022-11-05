/**
 * Markdown parsing functions.
 */
const { escape } = require('html-escaper');
const { log } = require('@jsdoc/util');
const MarkdownIt = require('markdown-it');
const mda = require('markdown-it-anchor');

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
 * Wraps a code snippet in HTML tags that enable syntax highlighting.
 *
 * @param {string} code - The code snippet.
 * @param {string?} language - The language of the code snippet.
 * @returns {string} The wrapped code snippet.
 */
function highlight(code, language) {
  let classString;
  let langClass = '';

  if (language && language !== 'plain') {
    langClass = ` lang-${language}`;
  }

  if (language !== 'plain') {
    classString = ` class="prettyprint source${langClass}"`;
  } else {
    classString = ' class="source"';
  }

  return `<pre${classString}><code>${escape(code)}</code></pre>`;
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
 * Gets the appropriate function for applying syntax highlighting to text, based on the user's
 * Markdown configuration settings.
 *
 * @param {Object} conf - The user's Markdown configuration settings.
 * @return {function} The highlighter function.
 */
function getHighlighter(conf) {
  let highlighter;

  switch (typeof conf.highlight) {
    case 'string':
      try {
        highlighter = require(conf.highlight).highlight;
      } catch (e) {
        log.error(e);
      }

      if (typeof highlighter !== 'function') {
        log.error(
          `The syntax highlighting module ${conf.highlight} does not assign a ` +
            'method to `exports.highlight`. Using the default syntax highlighter.'
        );
        highlighter = highlight;
      }

      break;

    case 'function':
      highlighter = conf.highlight;

      break;

    default:
      highlighter = highlight;
  }

  return highlighter;
}

/**
 * Retrieves a function that accepts a single parameter containing Markdown source. The function
 * uses the specified parser to transform the Markdown source to HTML, then returns the HTML as a
 * string.
 *
 * @private
 * @param {Object} [conf] Configuration for the Markdown parser.
 * @returns {function} A function that accepts Markdown source, feeds it to the selected parser, and
 * returns the resulting HTML.
 */
function getParseFunction(conf) {
  let highlighter;
  let parserFunction;
  let renderer;

  conf = conf || {};
  highlighter = getHighlighter(conf);

  renderer = new MarkdownIt({
    breaks: Boolean(conf.hardwrap),
    highlight: highlighter,
    html: true,
  });

  if (conf.idInHeadings) {
    renderer.use(mda);
  }

  parserFunction = (source) => {
    let result;

    source = escapeInlineTagBackslashes(source);

    result = renderer.render(source).replace(/\s+$/, '').replace(/&#39;/g, "'");
    result = unencodeQuotes(result);

    return result;
  };

  return parserFunction;
}

/**
 * Gets a Markdown parsing function. The parsing function accepts a single parameter containing
 * Markdown source. The function converts the Markdown source to HTML, then returns the HTML as a
 * string.
 *
 * @returns {function} A function that converts Markdown to HTML.
 */
exports.getParser = (deps) => {
  const env = deps.get('env');

  return getParseFunction(env.conf.markdown);
};
