/*
  Copyright 2022 the Baseline Authors.

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

import * as name from '@jsdoc/name';
import { inline as inlineTags } from '@jsdoc/tag';
import { slugifyWithCounter } from '@sindresorhus/slugify';
import escapeRegExp from 'escape-string-regexp';
import _ from 'lodash';
import ow from 'ow';

import { OUTPUT_FILE_KINDS } from './enums.js';

const { includesInlineTag, replaceInlineTags } = inlineTags;

const GLOBAL_SCOPE = name.SCOPE.NAMES.GLOBAL;
const MODULE_NAMESPACE = name.MODULE_NAMESPACE;
// TODO: Get this from the tag dictionary instead of cheating.
const NAMESPACES = ['event', 'external', 'module'];
const SCOPE_PUNC_VALUES = _.values(name.SCOPE_TO_PUNC).join('');
const SCOPE_TO_PUNC = name.SCOPE_TO_PUNC;
const SOFT_BREAK_AFTER = (() => {
  const values = `${SCOPE_PUNC_VALUES}/`;

  return new RegExp(`([${escapeRegExp(values)}])`, 'g');
})();

// Handle inline links that are preceded by bracketed link text, like: `[link text]{@link Foo#bar}`
// TODO: Consider dropping support for this unnecessary syntax variant.
function extractLeadingText(string, completeTag) {
  const tagIndex = string.indexOf(completeTag);
  let leadingText = null;
  const leadingTextRegExp = /\[(.+?)\]/g;
  let leadingTextInfo = leadingTextRegExp.exec(string);

  // Did we find leading text, and if so, does it immediately precede the tag?
  while (leadingTextInfo && leadingTextInfo.length) {
    if (leadingTextInfo.index + leadingTextInfo[0].length === tagIndex) {
      string = string.replace(leadingTextInfo[0], '');
      leadingText = leadingTextInfo[1];
      break;
    }

    leadingTextInfo = leadingTextRegExp.exec(string);
  }

  return {
    leadingText: leadingText,
    string: string,
  };
}

function getNamespace(kind) {
  if (!NAMESPACES.includes(kind)) {
    return '';
  }

  return `${kind}:`;
}

function getShortName(longname) {
  return name.toParts(longname).name;
}

function hasUrlPrefix(str) {
  return /^[A-Za-z]+:\/\//.test(str);
}

/**
 * Check whether a doclet represents the only symbol exported by a module (as in
 * `module.exports = function() {};`).
 *
 * @private
 * @param {module:jsdoc/doclet.Doclet} doclet - The doclet for the symbol.
 * @return {boolean} `true` if the symbol is the only symbol exported by a module; otherwise,
 * `false`.
 */
function isModuleExports(doclet) {
  return (
    doclet.longname === doclet.name &&
    doclet.longname?.startsWith(MODULE_NAMESPACE) &&
    doclet.kind !== 'module'
  );
}

// Creates a slugifier for fragment IDs, ensuring that each fragment ID in a file is unique to that
// file.
function slugifyFragmentIdFactory() {
  const slugify = slugifyWithCounter();

  return (str, opts) => {
    opts = _.defaults(
      {},
      {
        decamelize: false,
        lowercase: false,
        preserveCharacters: ['_', '#', '.', '~', ':'],
        preserveTrailingDash: true,
      },
      opts
    );

    return slugify(str, opts);
  };
}

// Inserts a soft break after any of the characters in SOFT_BREAK_AFTER.
function softBreak(text) {
  return text.replace(SOFT_BREAK_AFTER, '$1<wbr>');
}

function splitLinkText(text) {
  let linkText;
  let target;
  let splitIndex;

  // If a pipe is not present, we split on the first space.
  splitIndex = text.indexOf('|');
  if (splitIndex === -1) {
    splitIndex = text.search(/\s/);
  }

  if (splitIndex !== -1) {
    linkText = text.substr(splitIndex + 1);
    // Normalize subsequent newlines to a single space.
    linkText = linkText.replace(/\n+/, ' ');
    target = text.substr(0, splitIndex);
  }

  return {
    linkText: linkText?.trim(),
    target: target?.trim() ?? text,
  };
}

function stripAngleBrackets(str) {
  return str.replace(/^<(.+)>$/, '$1');
}

function formatNameForLink(doclet) {
  let newName = getNamespace(doclet.kind) + (doclet.name ?? '') + (doclet.variation ?? '');
  const scopePunc = SCOPE_TO_PUNC[doclet.scope] ?? '';

  // Only prepend the scope punctuation if it's not the same character that marks the start of a
  // fragment ID. Using `#` in HTML5 fragment IDs is legal, but URLs like `foo.html##bar` are
  // just confusing.
  if (scopePunc !== '#') {
    newName = scopePunc + newName;
  }

  return newName;
}

function shouldUseMonospace(tag, text) {
  let result = true;

  if (hasUrlPrefix(text)) {
    result = false;
  } else if (tag === 'linkplain') {
    result = false;
  }

  return result;
}

/**
 * Generates file names and links to known symbols.
 */
export class LinkManager {
  #config;
  #fileExtension;
  #filenameToString;
  #fragmentIdSlugifiersByFilename;
  #linkExtension;
  #longnameToFragmentId;
  #slugifyFactory;
  #slugifyFilename;
  #stringToFilename;
  #urlMap;

  // TODO: Accept a category-to-directory map (requires multiple slugifiers).
  /**
   * Creates a link manager.
   *
   * @param {object} opts - Options for the link manager.
   * @param {object} opts.config - JSDoc configuration settings.
   * @param {string} opts.fileExtension - The file extension to use for generated HTML pages.
   * For example, `.html`.
   * @param {string} opts.linkExtension - The file extension to use for links to other pages in
   * the generated docs. For example, `.html`. If your web server does not expect file extensions
   * in links, use an empty string.
   * @param {?function} opts.slugifyFactory - A factory function for a slugifier. Must return a
   * function that accepts a string and returns a slugified version of that string. The slugified
   * version must be safe to use in a filename. Also, if the function is called more than once
   * with the same input, it must return a unique value each time; for example, by appending `-2`,
   * `-3`, and so on.
   */
  constructor(opts) {
    ow(opts, ow.object);
    ow(opts.config, ow.object);
    // We check `opts.fileExtension` and `opts.linkExtension` in their setters.
    ow(opts.slugifyFactory, ow.optional.function);

    this.#config = opts.config;
    this.#filenameToString = new Map();
    this.#stringToFilename = new Map();
    // Facade that we can pass to Catharsis.
    this.#urlMap = {
      get: (key) => {
        return this.getUrl(key);
      },
    };
    this.#longnameToFragmentId = new Map();
    this.#fragmentIdSlugifiersByFilename = new Map();
    this.#slugifyFactory = opts.slugifyFactory ?? slugifyWithCounter;
    this.#slugifyFilename = this.#slugifyFactory();
    this.fileExtension = opts.fileExtension;
    this.linkExtension = opts.linkExtension;
  }

  #createFilename(str) {
    const filename = this.#slugifyFilename(str);

    this.#setFilenameForString(str, filename);

    return filename;
  }

  #filenameWithFileExtension(filename) {
    return filename + this.#fileExtension;
  }

  #filenameWithLinkExtension(filename) {
    return filename + this.#linkExtension;
  }

  #getFragmentIdForLongname(filename, longname, id) {
    const fragmentId = this.#longnameToFragmentId.get(longname);

    if (!fragmentId && id) {
      id = this.#slugifyFragmentIdForFile(filename, id);
      this.#longnameToFragmentId.set(longname, id);
    }

    return fragmentId ?? id ?? '';
  }

  #getFragmentIdForString(filename, id) {
    if (id) {
      id = this.#slugifyFragmentIdForFile(filename, id);
    }

    return id ?? '';
  }

  #getOrCreateFilename(str) {
    let filename = this.#stringToFilename.get(str);

    if (!filename) {
      filename = this.#createFilename(str);
    }

    return filename;
  }

  // Process a string that contains an inline tag representing a link.
  #processLink(string, { completeTag, tag, text }) {
    const leading = extractLeadingText(string, completeTag);
    let linkText = leading.leadingText;
    let monospace;
    let split;
    let target;

    string = leading.string;

    split = splitLinkText(text);
    target = split.target;
    linkText = linkText || split.linkText;

    monospace = shouldUseMonospace(tag, linkText);

    return string.replace(
      completeTag,
      this.createLink(target, {
        // TODO: Allow CSS class to be passed in. Maybe accept class names in constructor?
        linkText,
        monospace,
      })
    );
  }

  #setFilenameForString(str, filename) {
    this.#filenameToString.set(filename, str);
    this.#stringToFilename.set(str, filename);
  }

  #shouldShortenLongname() {
    return this.#config.templates?.useShortNamesInLinks;
  }

  #slugifyFragmentIdForFile(filename, id) {
    const slugify =
      this.#fragmentIdSlugifiersByFilename.get(filename) ?? slugifyFragmentIdFactory();

    this.#fragmentIdSlugifiersByFilename.set(filename, slugify);

    return slugify(id);
  }

  // TODO: Accept an `opts.category` parameter that creates the filename in a subdirectory.
  /**
   * Creates an HTML link to a longname, or to a URL that might be enclosed in angle brackets.
   *
   * If the file namer does not recognize the longname, this method returns the link text, not an
   * HTML link.
   *
   * @param {string} str - The longname or URL for which to create a link.
   * @param {?object} opts - Options for creating the link.
   * @param {?string} opts.cssClass - The string to use for the `class` attribute of the link. For
   * example, `my-class` or `class1 class2`. If you omit this parameter, the link does not have a
   * `class` attribute.
   * @param {?string} opts.fragmentId - The fragment ID to include in the link. Do not include a
   * leading `#`.
   * @param {?string} opts.linkText - The link text to use in the link. Defaults to the value of
   * `str`.
   * @param {?boolean} opts.monospace - Whether to use a fixed-width font for the link text.
   * Defaults to `false` if `opts.linkText` is specified; otherwise, `true`.
   * @return {string} An HTML anchor (`<a>`) tag, including an `href` attribute and link text, _or_
   * the link text if the longname or URL is not recognized.
   */
  createLink(str, opts = {}) {
    ow(str, ow.string);
    ow(opts, ow.object);
    ow(opts.cssClass, ow.optional.string);
    ow(opts.fragmentId, ow.optional.string);
    ow(opts.linkText, ow.optional.string);
    ow(opts.monospace, ow.optional.boolean);

    let classAttr = '';
    const cssClass = opts.cssClass;
    let href;
    let filename;
    let fragmentId = opts.fragmentId;
    let linkText = opts.linkText;
    let monospace = opts.monospace ?? true;
    let stripped;

    // If a string includes inline tags, then it needs special treatment.
    if (includesInlineTag(str)) {
      return this.resolveInlineLinks(str);
    }

    // If link text was provided, and if the caller didn't explicitly request monospace, then
    // don't use monospace.
    if (linkText && !opts.monospace) {
      monospace = false;
    }

    // Handle input like the values in `@see <http://example.org>` or `@see http://example.org`.
    stripped = stripAngleBrackets(str);
    if (hasUrlPrefix(stripped)) {
      // Assume it's a URL.
      href = stripped;
      linkText = linkText || href;
    } else {
      // It's a longname, or some other string that might have been registered as a link.
      if (!linkText) {
        linkText = this.#shouldShortenLongname() ? getShortName(str) : str;
      }
      // Add line-break opportunities to the link text, unless it appears to be a URL.
      if (!hasUrlPrefix(linkText)) {
        linkText = softBreak(linkText);
      }

      filename = this.#stringToFilename.get(str) || null;
      href = filename ? this.#filenameWithLinkExtension(filename) : null;

      if (!fragmentId) {
        fragmentId = this.#longnameToFragmentId.get(str);
      }
      if (fragmentId) {
        href = `${href}#${fragmentId}`;
      }
    }

    if (href) {
      if (monospace) {
        linkText = `<code>${linkText}</code>`;
      }
      if (cssClass) {
        classAttr = ` class="${cssClass}"`;
      }
      linkText = `<a href="${href}"${classAttr}>${linkText}</a>`;
    }

    return linkText;
  }

  get fileExtension() {
    return this.#fileExtension;
  }

  set fileExtension(extension) {
    ow(extension, ow.string);

    this.#fileExtension = extension;
  }

  get linkExtension() {
    return this.#linkExtension;
  }

  set linkExtension(extension) {
    ow(extension, ow.string);

    this.#linkExtension = extension;
  }

  // TODO: Accept an `opts.category` parameter that creates the filename in a subdirectory.
  getUniqueFilename(str) {
    ow(str, ow.string);

    const filename = this.#createFilename(str);

    return this.#filenameWithFileExtension(filename);
  }

  getUrl(str) {
    ow(str, ow.string);

    const filename = this.#stringToFilename.get(str);
    let fragmentId;
    let url;

    if (!filename) {
      return '';
    }

    url = this.#filenameWithLinkExtension(filename);
    fragmentId = this.#longnameToFragmentId.get(str);
    if (fragmentId) {
      url = `${url}#${fragmentId}`;
    }

    return url;
  }

  registerDoclet(doclet) {
    ow(doclet, ow.object);
    ow(doclet.kind, ow.string);
    ow(doclet.longname, ow.string);
    ow(doclet.memberof, ow.optional.string);
    ow(doclet.name, ow.string);
    ow(doclet.scope, ow.optional.string);

    let filename;
    let fragmentId;

    if (OUTPUT_FILE_KINDS.includes(doclet.kind) || isModuleExports(doclet)) {
      // The doclet gets its own output file.
      filename = this.#getOrCreateFilename(doclet.longname);
    } else {
      // The doclet goes in another output file.
      // TODO: Seems like `doclet.memberof` might not be what we want for, say, enum values.
      filename = this.#getOrCreateFilename(doclet.memberof || GLOBAL_SCOPE);
      // Associate the correct output file with the longname.
      this.#setFilenameForString(doclet.longname, filename);
      // Create a fragment ID for the longname if necessary.
      if (doclet.name !== doclet.longname || doclet.scope === GLOBAL_SCOPE) {
        fragmentId = formatNameForLink(doclet);
        fragmentId = this.#getFragmentIdForLongname(filename, doclet.longname, fragmentId);
      }
    }

    return {
      filename,
      fragmentId,
    };
  }

  // Intended for registering fragment IDs that are inserted into the output by, say, a Markdown
  // heading slugifier.
  registerFragmentId(filename, id) {
    ow(filename, ow.string);
    ow(id, ow.string);

    return this.#getFragmentIdForString(filename, id);
  }

  // TODO: Accept an `opts.category` parameter that creates the filename in a subdirectory.
  requestFilename(str) {
    return this.#createFilename(str);
  }

  resetCounters() {
    this.#slugifyFilename = this.#slugifyFactory();
  }

  // TODO: Make the list of inline tags configurable.
  /**
   * Replaces `{@link}`, `{@linkcode}`, and `{@linkplain}` inline tags with the appropriate
   * HTML links.
   *
   * @param {string} str - A string that might contain inline links.
   * @returns {string} An updated string, with inline links replaced by HTML links.
   */
  resolveInlineLinks(str) {
    const replacers = {};

    // Fast path for values that clearly do not contain inline tags.
    if (!str || !str.includes('{@')) {
      return str ?? '';
    }

    replacers.link = (string, tagInfo) => this.#processLink(string, tagInfo);
    replacers.linkcode = replacers.link;
    replacers.linkplain = replacers.link;

    return replaceInlineTags(str, replacers).newString;
  }

  get stringToLinkUrl() {
    return this.#urlMap;
  }
}
