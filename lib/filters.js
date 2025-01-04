/*
  Copyright 2020 the Baseline Authors.

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

import * as name from '@jsdoc/name';
import catharsis from 'catharsis';
import escapeRegExp from 'escape-string-regexp';
import { escape as escapeHtml } from 'html-escaper';
import _ from 'lodash';
import memize from 'memize';
import nunjucks from 'nunjucks';
import spdxLicenses from 'spdx-license-list';

import { OUTPUT_FILE_KINDS } from './enums.js';
import { getHighlighter } from './highlight.js';
import { listMethods } from './list-methods.js';
import { getRenderer as getMarkdownRenderer } from './markdown.js';

const { SafeString } = nunjucks.runtime;

const MIN_HEADING_LEVEL = 1;
const MAX_HEADING_LEVEL = 6;
const SCOPE_PUNC_VALUES = _.values(name.SCOPE_TO_PUNC).join('');
const LEADING_SCOPE_PUNC = new RegExp(`^([${escapeRegExp(SCOPE_PUNC_VALUES)}])`);
const SOFT_BREAK_AFTER = (() => {
  const values = `${SCOPE_PUNC_VALUES}/`;

  return new RegExp(`([${escapeRegExp(values)}])`, 'g');
})();

const describeParsedType = memize((type, opts) => catharsis.describe(type, opts));

function fakeMarkdown(text) {
  // If the text uses standalone <p> tags to delimit paragraphs, Javadoc-style, fix them up.
  if (/<p>/.test(text) && !/<\/p>/.test(text)) {
    text = text.replace(/<p>/g, '</p><p>');
  }

  // If the text isn't already wrapped in a <p> tag, add one.
  if (!/^<p>/.test(text)) {
    text = `<p>${text}</p>`;
  }

  return text;
}

function filterProperties(props = []) {
  return props.filter((prop) => {
    // Properties can be null.
    if (prop) {
      return prop.ignore !== true;
    }

    return false;
  });
}

function formatParams(params, template) {
  let formatted = '';

  params = params || [];

  params
    .filter((param) => param.name && !param.name.includes('.'))
    .forEach((param, i) => {
      let formattedParam = param.name || '';

      if (param.variable) {
        formattedParam = template
          .translate('params.repeatable', {
            param: formattedParam,
          })
          .trim();
      }

      formattedParam = template
        .translate('params.joiner', {
          items: i,
          param: formattedParam,
        })
        .trim();

      if (param.optional) {
        formattedParam = template
          .translate('params.optional', {
            param: formattedParam,
          })
          .trim();
      }

      formatted += formattedParam;
    });

  formatted = template.translate('params.all', {
    params: formatted,
  });

  return formatted;
}

function getAncestors(longname) {
  const ancestors = [];
  let nameInfo = name.toParts(longname);
  let memberof = nameInfo.memberof;
  const originalScope = nameInfo.scope;

  while (memberof) {
    nameInfo = name.toParts(memberof);
    ancestors.push(nameInfo.longname);
    if (nameInfo.scope) {
      ancestors.push(nameInfo.scope);
    }
    memberof = nameInfo.memberof || null;
  }

  if (ancestors.length) {
    ancestors.unshift(originalScope);
  }

  return ancestors.reverse();
}

function getPathFromMeta(meta) {
  return meta.path ? path.join(meta.path, meta.filename) : meta.filename;
}

function jsdocVersion(env) {
  return env.version.number;
}

function needsSignature({ kind, type, meta }) {
  let needsSig = false;

  // Function and class definitions always get a signature.
  if (kind === 'function' || kind === 'class') {
    needsSig = true;
  }
  // Typedefs that contain functions get a signature, too.
  else if (kind === 'typedef' && type?.names?.length) {
    for (const typeName of type.names) {
      if (typeName.toLowerCase() === 'function') {
        needsSig = true;
        break;
      }
    }
  }
  // And namespaces that are functions get a signature (but finding them is a bit messy).
  else if (kind === 'namespace' && meta?.code?.type?.match(/[Ff]unction/)) {
    needsSig = true;
  }

  return needsSig;
}

const parseTypeExpression = memize((expr, opts) => catharsis.parse(expr, opts));

// Inserts a soft break after any of the characters in SOFT_BREAK_AFTER.
function softBreak(text) {
  return text.replace(SOFT_BREAK_AFTER, '$1<wbr>');
}

const stringifyParsedType = memize((type, opts) => catharsis.stringify(type, opts));

function typeUnion(types) {
  let typeExpression;

  types = types ?? [];
  typeExpression = types.join('|');

  if (types.length > 1) {
    typeExpression = `(${typeExpression})`;
  }

  return typeExpression;
}

/** @hideconstructor */
export class Filters {
  #catharsisOptions;
  #cssClassMap;
  #headingLevel;
  #linkManager;
  #template;

  constructor(template) {
    // Cached type-parser options. We cache these because we memoize the type-parser methods, and
    // the memoizer only works when the input parameters are strictly equal to a previous call.
    this.#catharsisOptions = null;
    this.#cssClassMap = template.cssClassMap;
    this.#headingLevel = 1;
    this.#template = template;
    this.#linkManager = template.linkManager;

    this.env = template.env;
    this.highlighter = null;
    this.markdownRenderer = null;
  }

  /**
   * Given a longname, returns HTML links for the longname's ancestors. The list of ancestors
   * includes trailing scope punctuation.
   *
   * For example, given the longname `foo.bar.Baz`, this method returns a string similar to
   * `<a href="foo.html">foo</a>.<a href="foo-bar.html">bar</a>.`. Note that this string includes
   * a trailing `.`, because `Baz` is a static member of `foo.bar`.
   *
   * By default, the links do not use a fixed-width font. To use a fixed-width font, set the
   * `monospace` argument to `true`. For example: `{{ 'foo.bar' | ancestors(null, true) }}`
   *
   * @param {string} longname - The longname whose ancestors will be turned into HTML links.
   * @param {?string} cssClass - A CSS class added to each link.
   * @param {boolean} monospace - Whether to use monospace text.
   * @return {string} The linked version of the longname's ancestors.
   */
  ancestors(longname, cssClass, monospace) {
    const links = getAncestors(longname).map((ancestor) => {
      let ancestorName;

      // Don't try to link to scope punctuation.
      if (ancestor.length === 1 && SCOPE_PUNC_VALUES.includes(ancestor)) {
        return softBreak(ancestor);
      }

      ancestorName = name.toParts(ancestor).name;

      return this.#basicLink(ancestor, {
        cssClass: this.#cssClassMap.mapClassname(cssClass),
        linkText: name.stripNamespace(ancestorName),
        monospace,
      });
    });

    return new SafeString(links.join(''));
  }

  /**
   * Retrieve a sorted list of badges that should be displayed for a symbol.
   *
   * The badges indicate all of the following:
   *
   * + The symbol's kind (only if the symbol gets its own output file)
   * + Whether the symbol is private or protected
   * + Whether the symbol is an asynchronous function
   * + Whether the symbol is a generator function
   * + Whether the symbol is a constant
   * + Whether the symbol is read-only
   * + Whether the symbol is abstract
   *
   * Badges are sorted alphabetically, with the exception of the badge for the symbol's kind, which
   * always comes first.
   *
   * @param {jsdoc/doclet.Doclet} doclet - The doclet for the symbol.
   * @return {Array<Object>} An array of objects with two string properties: `class`, a CSS class
   * for the badge, and `text`, the text for the badge.
   */
  badges(doclet) {
    let badges = [];

    if (doclet.access) {
      badges.push(doclet.access);
    }

    if (doclet.async) {
      badges.push('async');
    }

    if (doclet.generator) {
      badges.push('generator');
    }

    if (doclet.kind === 'constant') {
      badges.push(doclet.kind);
    }

    if (doclet.readonly) {
      badges.push('readonly');
    }

    if (
      doclet.scope &&
      doclet.scope !== name.SCOPE.NAMES.INSTANCE &&
      doclet.scope !== name.SCOPE.NAMES.GLOBAL
    ) {
      badges.push(doclet.scope);
    }

    if (doclet.virtual) {
      badges.push('virtual');
    }

    // Translate and sort all the labels we've collected so far.
    badges = badges
      .map((text) => ({
        class: `badge-${text}`,
        text: _.capitalize(this.#template.translate(`badges.${text}`)),
      }))
      .sort((a, b) => {
        if (a.text > b.text) {
          return 1;
        }

        if (a.text < b.text) {
          return -1;
        }

        return 0;
      });

    // Then prepend the label for the doclet's kind, if applicable. We want this label to
    // come first.
    if (OUTPUT_FILE_KINDS.includes(doclet.kind)) {
      badges.unshift({
        class: 'badge-kind',
        text: _.capitalize(this.#template.translate(`kinds.${doclet.kind}`)),
      });
    }

    // Finally, update CSS classes as needed.
    badges.forEach((badge) => {
      badge.class = this.#cssClassMap.mapClassname(badge.class);
    });

    return badges;
  }

  /**
   * Given a filepath, returns the basename for that filepath, removing the extension if one is
   * provided. For example:
   *
   * + For the path `/foo/bar/baz.html`, returns `baz.html`.
   * + For the path `/foo/bar/baz.html` and the extension `.html`, returns `baz`.
   *
   * @param {string} filepath - The filepath whose basename will be returned.
   * @param {?string} extension - The trailing string that will be removed if present. Include the
   * leading period (`.`).
   * @return {string} The basename for the filepath.
   */
  basename(filepath, extension = '') {
    return path.basename(String(filepath), extension);
  }

  #basicLink(item, opts = {}) {
    if (opts?.linkText) {
      opts.linkText = escapeHtml(opts.linkText);
    }

    return new SafeString(this.#linkManager.createLink(item, opts));
  }

  /**
   * Gets the value of the specified key in the template configuration settings.
   *
   * @param {string} key - The key whose value will be retrieved.
   * @return {string} The configuration value.
   */
  config(key) {
    return _.get(this.#template.config, key);
  }

  /**
   * Creates a `Filters` object.
   */
  static async create(template) {
    const filters = new Filters(template);

    filters.highlighter = await getHighlighter(filters.env);
    filters.markdownRenderer = template.config.markdown
      ? await getMarkdownRenderer(filters.env)
      : fakeMarkdown;

    return filters;
  }

  /**
   * Subtracts 1 from the current heading level, unless the current heading level is the
   * minimum heading level. Added internally by the loader.
   *
   * @private
   * @return {string} An empty string.
   */
  decrementHeading() {
    if (this.#headingLevel > MIN_HEADING_LEVEL) {
      this.#headingLevel--;
    }

    return '';
  }

  /**
   * Checks whether a value is defined (in other words, whether its type is something other
   * than `undefined`).
   *
   * @param {*} value - The value to check.
   * @return {boolean} If the item is defined, `true`; otherwise, `false`.
   */
  defined(value) {
    return !_.isUndefined(value);
  }

  /**
   * Removes quotation marks, if any, around a string.
   *
   * @param {string} str - The string from which to remove quotation marks.
   * @return {string} The updated string.
   */
  dequote(str) {
    return str.replace(/^"([\s\S]+)"$/g, '$1');
  }

  /**
   * Creates a human-readable description of a type expression.
   *
   * If the format is set to `simple`, this helper returns a complete, brief description of the
   * type expression, including modifiers such as whether the value is nullable.
   *
   * If the format is set to `extended`, you can use the `property` parameter to select one of
   * several values to retrieve, each of which can be used as a sentence:
   *
   * + `description` (default): A description of the type expression, without information about
   *   the modifiers described below.
   * + `modifiers.functionNew`: Identifies what type of value will be returned if the function is
   *   called with the `new` keyword.
   * + `modifiers.functionThis`: Identifies what `this` refers to within the function.
   * + `modifiers.optional`: Indicates whether the value is optional.
   * + `modifiers.nullable`: Indicates whether the value is nullable.
   * + `modifiers.repeatable`: Indicates whether the value is a function parameter that can be
   *   repeated.
   *
   * @param {string} typeExpression - A type expression.
   * @param {?Object} kwargs - Keyword arguments for the filter.
   * @param {?string} [kwargs.codeTag=code] - The HTML tag to add to each type.
   * @param {?string} [kwargs.format=simple] - The format to use when creating the description. Set
   * to `simple` or `extended`.
   * @param {?string} [kwargs.property=description] - The property of the extended description to
   * retrieve. Ignored unless `format` is set to `extended`.
   * @return {string} A description of the type expression, or of one of the type
   * expression's modifiers.
   */
  describeType(typeExpression, kwargs) {
    const codeTag = kwargs?.codeTag;
    const catharsisOptions = this.#getCatharsisOptions(codeTag);
    let description;
    const format = kwargs?.format ?? 'simple';
    let parsedType;
    let property = kwargs?.property ?? 'description';

    if (!['extended', 'simple'].includes(format)) {
      throw new Error('The describeType filter accepts the formats "simple" and "extended".');
    }

    if (_.isString(typeExpression)) {
      parsedType = this.parseTypeExpression(typeExpression);
    } else {
      // We don't know the type.
      parsedType = this.parseTypeExpression('?');
    }
    description = describeParsedType(parsedType, catharsisOptions);

    if (format === 'extended') {
      return new SafeString(_.get(description.extended, property));
    } else {
      return new SafeString(description.simple);
    }
  }

  // Remove properties that the user explicitly said to ignore.
  filterProperties(props) {
    return filterProperties(props);
  }

  /**
   * Format a list of parameters as a single string that is suitable for display as a method
   * signature.
   *
   * @param {Array.<Object>} params - The `params` attribute from a JSDoc doclet.
   * @return {string} The formatted list of parameters.
   */
  formatParams(params) {
    return formatParams(params, this.#template);
  }

  /**
   * Gets a string identifying the tool that was used to generate the documentation, as well as
   * the date on which the documentation was generated.
   *
   * @return {string} A string with details about how and when the documentation was generated.
   */
  generatedBy() {
    const formatter = new Intl.DateTimeFormat(this.#template.config.locale, {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });

    return new SafeString(
      this.#template.translate('generatedBy', {
        version: jsdocVersion(this.env),
        date: formatter.format(Date.now()),
      })
    );
  }

  #getCatharsisOptions(codeTag) {
    this.#catharsisOptions ??= {
      // TODO: Use the correct locale.
      codeTag: codeTag ?? 'code',
      jsdoc: true,
      htmlSafe: true,
      links: this.#template.linkManager.stringToLinkUri,
    };

    return this.#catharsisOptions;
  }

  /**
   * Groups a tree of doclets into logical sections.
   *
   * To identify logical sections, this method looks for the longname of the most recent ancestor
   * that is the parent of multiple doclets, and that is neither an inner member nor an instance
   * member.
   *
   * @param {Object} items - A tree of doclets, in the format returned by JSDoc's
   * {@link module:@jsdoc/name.longnamesToTree} method.
   * @return {Object.<string, <Array.<Object>>>} A dictionary containing the grouped doclets.
   */
  groupDocletTree(items) {
    const indexGroups = {};
    // doclet kinds that always get their own section
    const sectionKinds = ['class', 'interface', 'module', 'namespace'];

    function findNameKey({ doclet, longname }) {
      let previousMemberof;
      const nameParts = {
        previous: null,
        current: null,
        next: null,
      };

      // Is the current item of a kind that always gets its own section? If so, just use the
      // doclet's longname as the section name key.
      if (doclet && sectionKinds.includes(doclet.kind)) {
        return longname;
      }

      // Otherwise, find the appropriate ancestor name to use as the section name key.
      do {
        previousMemberof = nameParts.current ? nameParts.current.memberof : longname;

        nameParts.previous = nameParts.current;
        nameParts.current = name.toParts(previousMemberof);
        nameParts.next = nameParts.current.memberof
          ? name.toParts(nameParts.current.memberof)
          : null;
      } while (
        // Keep breaking down the name if all of the following are true:
        // - The current item was a memberof something.
        // - The current item's memberof has a scope attached to it.
        // - The next item's longname is not already being used as a name key.
        nameParts.next &&
        nameParts.next.scope !== '' &&
        !Object.hasOwn(indexGroups, nameParts.next.longname)
      );

      return nameParts.current.memberof || nameParts.current.name;
    }

    function visit(item) {
      Object.keys(item).forEach((key) => {
        const currentItem = item[key];
        const nameKey = findNameKey(currentItem);

        if (currentItem.doclet) {
          if (!Object.hasOwn(indexGroups, nameKey)) {
            indexGroups[nameKey] = [];
          }
          indexGroups[nameKey].push(currentItem.doclet);
        }
        // Omit members of enums; they don't need to show up on the index page.
        if (currentItem.children && (!currentItem.doclet || !currentItem.doclet.isEnum)) {
          visit(currentItem.children);
        }
      });
    }

    visit(items);

    return indexGroups;
  }

  /**
   * Checks whether a doclet has any modifiers that might need special treatment.
   *
   * Specifically, this helper returns `true` if any of the following statements about the doclet
   * are true:
   *
   * + Is a nullable or non-nullable value
   * + Is a repeatable method parameter
   * + Has a default value
   * + Is an enumeration
   *
   * @param {jsdoc/doclet.Doclet} doclet - The doclet to check for modifiers.
   * @param {?Object} kwargs - Keyword arguments for the filter.
   * @param {?boolean} kwargs.isEnum - Indicates whether the doclet represents an enumeration.
   * @return {boolean} If the doclet has modifiers, `true`; otherwise, `false`.
   */
  hasModifiers({ nullable, variable, defaultvalue }, kwargs) {
    return Boolean(
      _.isBoolean(nullable) ||
        variable === true ||
        (!_.isUndefined(defaultvalue) && !kwargs?.isEnum)
    );
  }

  /**
   * Gets the current heading level. Added internally by the loader.
   *
   * @private
   * @return {string} The current heading level.
   */
  headingLevel() {
    return this.#headingLevel;
  }

  /**
   * Adds syntax highlighting to the specified code. Optionally, the caller can specify the code's
   * language. If the language is omitted, the highlighter makes its best guess.
   *
   * @param {string} code - The code to highlight.
   * @param {string} lang - The language that the code is written in.
   * @param {?Object} kwargs - Keyword arguments for the filter.
   * @param {?boolean} kwargs.omitPre - Whether to omit the enclosing `<pre></pre>` tags.
   * @return {string} The highlighted code.
   */
  highlight(code, lang, kwargs) {
    return new SafeString(
      this.highlighter(code, lang, {
        cssClassMap: this.#cssClassMap,
        omitPre: Boolean(kwargs?.omitPre),
      })
    );
  }

  /**
   * Given a doclet, gets an ID that can be used as an `id` attribute for an HTML element.
   *
   * @param {module:jsdoc/doclet.Doclet} doclet - The doclet to use.
   * @return {string} An ID for the doclet.
   */
  idForDoclet(doclet) {
    return this.#linkManager.registerDoclet(doclet).fragmentId;
  }

  /**
   * Given a filename and a suggested ID, gets an `id` attribute value that's unique within the
   * file, and that's safe to use as a fragment ID.
   *
   * @param {string} filename - The file being generated.
   * @param {string} str - The suggested value for the ID.
   * @return {string} An `id` attribute that's unique within the file and safe to use as a fragment
   * ID.
   */
  idForString(filename, str) {
    return this.#linkManager.registerFragmentId(filename, str);
  }

  /**
   * Checks whether a value appears in an array of values.
   *
   * @param {*} value - The value to check for in the array.
   * @param {Array<*>} arr - The array to check.
   * @return {boolean} Set to `true` if the array includes the value; otherwise, `false`.
   */
  includes(value, arr) {
    return arr.includes(value);
  }

  /**
   * Adds 1 to the current heading level, unless the current heading level is the maximum heading
   * level. Added internally by the loader.
   *
   * @private
   * @return {string} An empty string.
   */
  incrementHeading() {
    if (this.#headingLevel < MAX_HEADING_LEVEL) {
      this.#headingLevel++;
    }

    return '';
  }

  /**
   * Gets the version of JSDoc that is being used (for example, `4.0.0`).
   *
   * @return {string} The JSDoc version number.
   */
  jsdocVersion() {
    return jsdocVersion(this.env);
  }

  /**
   * Gets the keys for an object. Keys can appear in any order.
   *
   * @param {Object} obj - The object.
   * @return {Array<string>} The object's keys.
   */
  keys(obj) {
    if (!_.isObject(obj)) {
      return [];
    }

    return Object.keys(obj);
  }

  /**
   * Gets a link to the specified license ID on the [Software Package Data Exchange (SPDX)
   * website](https://spdx.org/). If the license ID is not a valid SPDX identifier, this method
   * returns the license ID.
   *
   * @param {string} licenseId - The SPDX license ID. See the [SPDX license
   * list](https://spdx.org/licenses/) for a list of valid identifiers.
   * @return {string} A link to the specified license, or the license ID if the ID is not
   * recognized.
   */
  licenseLink(licenseId) {
    let result = licenseId;

    if (Object.hasOwn(spdxLicenses, licenseId)) {
      result = new SafeString(
        this.#basicLink(spdxLicenses[licenseId].url, {
          linkText: spdxLicenses[licenseId].name,
        })
      );
    }

    return result;
  }

  /**
   * Gets an HTML link for a specified longname.
   *
   * By default, the link text does not use a fixed-width font. To control this behavior, set the
   * `monospace` keyword argument to `true` or `false`. For example:
   * `{{ 'foo.bar' | link(null, monospace=true) }}`
   *
   * @param {string} longname - The longname to link to.
   * @param {?string} linkText - The link text to use, or the longname if no text is provided.
   * @param {?Object} kwargs - Keyword arguments for the filter.
   * @param {?boolean} kwargs.monospace - Whether to use monospace text. Defaults to `false`.
   * @return {handlebars.SafeString} An HTML link to the longname.
   */
  link(longname, linkText, kwargs) {
    // Handle unusual cases where `longname` isn't a string for some reason. (One example:
    // JSDoc sets a doclet's `deprecated` property to `true` when the `@deprecated` tag has
    // no text.)
    if (!_.isString(longname)) {
      longname = '';
    }

    return new SafeString(
      this.#basicLink(longname, {
        linkText: linkText || '',
        monospace: kwargs?.monospace ?? false,
      })
    );
  }

  /**
   * Adds links to embedded types within a type expression. Also normalizes the type expression and
   * replaces angle brackets (`<` and `>`) with HTML entities.
   *
   * For example, if the type expression is `Array<MyWidget>`, and you've documented `MyWidget`,
   * then this method returns a string that links to the generated documentation for `MyWidget`.
   *
   * @param {Object} typeExpression - A type expression.
   * @return {string} A string representation of the type expression, with links to the
   * documentation for embedded types.
   */
  linkifyTypeExpression(typeExpression) {
    const catharsisOptions = this.#getCatharsisOptions();
    let linkifiedType;
    let parsedType;

    if (_.isString(typeExpression)) {
      parsedType = parseTypeExpression(typeExpression, catharsisOptions);
      linkifiedType = stringifyParsedType(parsedType, catharsisOptions);
    } else {
      // We don't know the type.
      linkifiedType = '?';
    }

    return new SafeString(linkifiedType);
  }

  /**
   * Links to the line in a pretty-printed source file where the code associated with a doclet is
   * defined. The link is formatted using the `linkToLine` string in the template's L10N resource
   * file.
   *
   * By default, the link does not use a fixed-width font. To use a fixed-width font, set
   * `options.monospace` `true`. For example: `{{linkToLine meta monospace=true}}`
   *
   * @param {object} meta - The `meta` attribute of a doclet.
   * @param {?string} cssClass - A CSS class to add to the link.
   * @param {?object} options - Options for creating the link.
   * @param {?boolean} options.monospace - Whether to use a monospace font for the link text.
   * @return {string} A link to the appropriate line in the pretty-printed source file.
   */
  linkToLine(meta, cssClass, options = {}) {
    const { lineno } = meta;
    const filepath = getPathFromMeta(meta);
    let fragmentId;
    let linkText;
    const monospace = Boolean(options.monospace);
    const sourceFiles = this.#template.context.sourceFiles;
    const shortpath = sourceFiles[filepath];

    // Don't add a fragment ID if we're linking to the start of the file.
    if (lineno > 1) {
      fragmentId = `L${lineno}`;
    }

    linkText = this.#template.translate('linkToLine', {
      filepath: shortpath,
      lineno: lineno,
      items: lineno,
    });

    return new SafeString(
      this.#basicLink(shortpath, {
        cssClass: this.#cssClassMap.mapClassname(cssClass),
        fragmentId,
        linkText,
        monospace,
      })
    );
  }

  /**
   * Links to the symbol represented by a doclet.
   *
   * By default, the link text includes the symbol's longname and signature. To show the name
   * instead of the longname, set the `linkType` keyword argument to `name`.
   *
   * @param {jsdoc/doclet.Doclet} doclet - The doclet that will be linked to.
   * @param {?Object} [kwargs] - Keyword arguments for the filter.
   * @param {?string} [kwargs.cssClass] - A CSS class to add to the link.
   * @param {?string} [kwargs.linkType=longname] - Set to `longname` to show the full longname in
   * the link text or `name` to show only the name.
   * @param {?boolean} [kwargs.monospace=true] - Whether to use a fixed-width font for the link
   * text.
   * @return {string} A link to the specified symbol.
   */
  linkWithSignature(doclet, kwargs) {
    const cssClass = kwargs?.cssClass ?? '';
    const linkType = kwargs?.linkType ?? 'longname';
    const monospace = kwargs?.monospace ?? true;
    let linkText;

    if (linkType === 'name') {
      linkText = doclet.name;
    } else {
      linkText = name.stripNamespace(doclet.longname ?? '');
      linkText = name.stripVariation(linkText);
    }

    if (needsSignature(doclet)) {
      linkText += formatParams(doclet.params, this.#template);
    }

    return new SafeString(
      this.#basicLink(doclet.longname, {
        cssClass: this.#cssClassMap.mapClassname(cssClass),
        linkText,
        monospace,
      })
    );
  }

  /**
   * Renders a Markdown string as HTML.
   *
   * @param {string} text - The Markdown string to render.
   * @return {string} The rendered HTML.
   */
  markdown(text) {
    return new SafeString(this.markdownRenderer(text));
  }

  // TODO: Allow the caller to specify which modifiers they're interested in.
  /**
   * Gets a series of sentences that describe any modifiers for a symbol, including whether the
   * symbol:
   *
   * + Is a nullable or non-nullable value
   * + Is a repeatable method parameter
   * + Has a default value
   * + Is an enumeration
   *
   * The sentences are formatted using the following strings in the template's L10N resource file:
   *
   * + tables.body.defaultValue
   * + tables.body.defaultValueString
   * + tables.body.nonNullable.long
   * + tables.body.nullable.long
   * + tables.body.repeatable.long
   *
   * If the symbol's type expression already contains information about these modifiers, then text
   * is omitted for the modifier. For example, if the symbol's type expression is `?string`, then
   * the returned text does not indicate that the symbol is nullable. To change this behavior, set
   * the `showAllModifiers` keyword argument to `true`.
   *
   * @param {module:@jsdoc/doclet.Doclet} doclet - A doclet representing the symbol.
   * @param {?Object} kwargs - Keyword arguments for the filter.
   * @param {?boolean} kwargs.isEnum - If the doclet is part of an enumeration, `true`; otherwise,
   * `false`. The default is `false`.
   * @param {?boolean} kwargs.showAllModifiers - If you want to get descriptions of all modifiers,
   * including those in the symbol's type expression, `true`; otherwise, `false`. The default is
   * `false`.
   * @return {string} Descriptions of the symbol's modifiers.
   */
  modifierText({ defaultvalue, nullable, type, variable }, kwargs) {
    const catharsisOptions = this.#getCatharsisOptions();
    const descriptions = [];
    const parsedType = this.parseTypeExpression(type?.expression);
    let typeDescription;

    if (!kwargs?.showAllModifiers && parsedType) {
      typeDescription = describeParsedType(parsedType, catharsisOptions).extended;
    }

    if (!typeDescription?.modifiers.nullable) {
      if (nullable === true) {
        descriptions.push(this.#template.translate('tables.body.nullable.long'));
      } else if (nullable === false) {
        descriptions.push(this.#template.translate('tables.body.nonNullable.long'));
      }
    }

    if (variable === true && !typeDescription?.modifiers.repeatable) {
      descriptions.push(this.#template.translate('tables.body.repeatable.long'));
    }

    if (!_.isUndefined(defaultvalue) && !kwargs?.isEnum) {
      descriptions.push(
        this.#template.translate('tables.body.defaultValue', {
          valueString: this.#template.translate('tables.body.defaultValueString', {
            value: String(defaultvalue),
          }),
        })
      );
    }

    return new SafeString(descriptions.join(' '));
  }

  /**
   * Checks whether a symbol needs a function signature.
   *
   * @param {jsdoc/doclet.Doclet} doclet - A doclet representing the symbol.
   * @return {boolean} If the doclet needs a function signature, `true`; otherwise, `false`.
   */
  needsSignature(doclet) {
    return needsSignature(doclet);
  }

  /**
   * Creates a link to the generated documentation's `index.html` file. If the package's name and
   * version number are available, they are used as the link text. Otherwise, a default value is
   * used.
   *
   * @param {jsdoc/package.Package} packageInfo - Information about the package.
   * @param {?string} cssClass - A CSS class to add to the link.
   * @return {handlebars.SafeString} A link to the documentation's `index.html` file.
   */
  packageLink(packageInfo, cssClass) {
    let linkText;

    if (!_.isString(cssClass)) {
      cssClass = '';
    }

    packageInfo = packageInfo || {};

    linkText = packageInfo.name || this.#template.translate('brandDefault');

    if (packageInfo.name && packageInfo.version) {
      linkText += ` ${packageInfo.version}`;
    }

    return this.#basicLink('index', {
      cssClass: this.#cssClassMap.mapClassname(cssClass),
      linkText,
    });
  }

  /**
   * Parse a type expression into an object. The object uses the format returned by the
   * [Catharsis](https://github.com/hegemonic/catharsis) library.
   *
   * @param {?string} type - The type expression to parse.
   * @return {(Object|string)} The parsed object, or an empty string if no type expression was
   * specified.
   */
  parseTypeExpression(type) {
    if (type) {
      return parseTypeExpression(type, this.#getCatharsisOptions());
    }

    // TODO: Should we return `{}` or `null` instead?
    return '';
  }

  /**
   * Given an array of objects, extract the value of the specified key from each object.
   *
   * @param {Array.<Object>} items - The objects whose property values will be extracted.
   * @param {string} key - The name of the property whose values will be extracted.
   * @return {Array.<*>} The values associated with the specified key.
   */
  pluck(items, key) {
    return items.reduce((accumulator, current) => {
      if (Object.hasOwn(current, key)) {
        accumulator.push(current[key]);
      }

      return accumulator;
    }, []);
  }

  /**
   * Extracts the caption, if one is present, from an example.
   *
   * @param {string} example - The example to process.
   * @return {{caption: module:nunjucks.runtime.SafeString, code: string}} The caption and code for
   * the example.
   */
  processExample(example) {
    let caption;
    let code;
    const match = example.match(/^\s*<caption>([\s\S]+)<\/caption>(?:\s*[\n\r])([\s\S]+)$/i);

    if (match) {
      caption = match[1];
      code = match[2];
    }

    return {
      caption: new SafeString(caption ?? ''),
      code: code ?? example,
    };
  }

  /**
   * Registers all of this object's instance methods as filters and global functions within a
   * `nunjucks.Environment`. Called during template setup.
   *
   * @private
   * @param {module:nunjucks.Environment} renderEnv - The rendering environment in which to
   * register the filters and global functions.
   */
  registerAll(renderEnv) {
    let bound;
    const filters = listMethods(this, { ignoreRegExp: /^template$/, includePrivate: true });

    for (const filter of filters) {
      bound = _.bind(this[filter], this);
      renderEnv.addFilter(filter, bound);
      renderEnv.addGlobal(filter, bound);
    }
  }

  /**
   * Given a doclet that includes function parameters or properties, reparents the parameters or
   * properties that belong to a parent object.
   *
   * For example, if there are two parameters named `foo` and `foo.bar`, the `foo.bar` parameter
   * becomes an item named `bar` in an array of children of `foo`:
   *
   * ```js
   * // Original doclet
   * {
   *   params: [
   *     {
   *       name: 'foo'
   *     },
   *     {
   *       name: 'foo.bar'
   *     }
   *   ]
   * }
   *
   * // Returned array
   * [
   *   {
   *     name: 'foo',
   *     children: [
   *       {
   *         name: 'bar'
   *       }
   *     ]
   *   }
   * ]
   * ```
   *
   * If the template configuration property `tables.nestedPropertyTables` is set to `false`, the
   * parameters or properties are not reparented. They are returned as-is.
   *
   * This function does not modify the original doclet.
   *
   * @param {jsdoc/doclet.Doclet} doclet - The doclet with parameter or property information.
   * @param {string} key  - Set to `params` for function parameters or `properties` for
   * object properties.
   * @return {Array.<Object>} An array of objects describing the parameters or properties.
   */
  reparentItems(doclet, key) {
    let itemRegExp;
    // Remove properties that we don't want to include.
    const items = filterProperties(doclet[key]);
    let match;
    let parentItem = null;

    // Only reparent items if that's what the user asked for.
    if (_.get(this.#template.config, 'tables.nestedPropertyTables')) {
      items.forEach((item, i) => {
        let clonedItem;

        if (!item) {
          return;
        }

        if (parentItem && parentItem.name && item.name) {
          try {
            itemRegExp = new RegExp(`^(?:${parentItem.name}(?:\\[\\])*)\\.(.+)$`);
          } catch (e) {
            // There's probably a typo in the JSDoc comment that resulted in a weird
            // parameter name.
            return;
          }

          match = item.name.match(itemRegExp);
          if (match) {
            clonedItem = _.cloneDeep(item);

            clonedItem.name = match[1];
            parentItem.children = parentItem.children || [];
            parentItem.children.push(clonedItem);
            items[i] = null;
          } else {
            parentItem = item;
          }
        } else {
          parentItem = item;
        }
      });
    }

    return _.compact(items);
  }

  /**
   * Given a string, converts text like `Jane Doe <jdoe@example.org>` into an HTML `mailto:` link
   * like `<a href="mailto:jdoe@example.org">Jane Doe</a>`.
   *
   * @param {string} text - The text that will be checked for email addresses.
   * @return {string} An updated version of the text, which email addresses converted to links.
   */
  resolveAuthorLinks(text) {
    let matches;

    if (text) {
      matches = text.match(/^\s?([\s\S]+)\b\s+<(\S+@\S+)>\s?$/);

      if (matches && matches.length === 3) {
        text = `<a href="mailto:${matches[2]}">${escapeHtml(matches[1])}</a>`;
      } else {
        text = escapeHtml(text);
      }
    }

    return new SafeString(text);
  }

  /**
   * Finds inline `{@link}` tags, and replace them with HTML links. This method also finds and
   * converts variations on these tags that are recognized by JSDoc, including `{@linkplain}` and
   * `{@linkcode}`.
   *
   * @param {string} text - The text that contains inline tags.
   * @return {string} An updated version of the text, with HTML links instead of inline link tags.
   */
  resolveLinks(text) {
    return new SafeString(this.#linkManager.resolveInlineLinks(text));
  }

  /**
   * Converts a doclet, or an array of return types, to a type expression that represents all of the
   * return types as a single type union. For example, the return types `['string', 'number']` are
   * combined as the type expression `(string|number)`.
   *
   * @param {?(Object|Array<string>)} input - A JSDoc doclet, or an array of type expressions.
   * @return {Object} A type union that represents all of the return types from the input.
   */
  returnTypes(input) {
    let source;
    const typeExpressions = [];

    if (_.isArray(input)) {
      source = input;
    } else {
      source = input?.yields ?? input?.returns ?? [];
    }

    source.forEach(({ type }) => {
      if (type?.names?.length) {
        typeExpressions.push(...type.names);
      }
    });

    return typeUnion(typeExpressions);
  }

  // TODO: Document after tests are in place.
  see(see, longname) {
    let atoms;
    let combined = see;

    if (LEADING_SCOPE_PUNC.test(see)) {
      atoms = name.toParts(longname);
      atoms.name = see.substr(1);
      combined = name.fromParts(atoms);
    }

    return combined;
  }

  /**
   * Checks whether a default value should get syntax highlighting, based on the value of the
   * doclet's `defaultvaluetype` property.
   *
   * @param {string} typeName - The `defaultvaluetype` property of a doclet.
   * @return {boolean} If the doclet's default value should get syntax highlighting, `true`;
   * otherwise, `false`.
   */
  shouldHighlight(typeName) {
    return ['array', 'object'].includes(typeName);
  }

  /**
   * The template object associated with the filters.
   *
   * @type module:jsdoc-baseline/lib/template
   */
  get template() {
    return this.#template;
  }

  set template(template) {
    // Invalidate cached options for type parser.
    this.#catharsisOptions = null;
    this.#template = template;
  }

  /**
   * Retrieves the translation for a given translation key. The translation is pluralized based on
   * the number of items in the `items` array.
   *
   * @param {string} key - The translation key. Must map to a key in the template's L10N resources
   * file.
   * @param {?(Array.<*>|*)} items - An array of items whose length determines how to pluralize
   * the translation. If the value is not an array, this filter assumes that there is one item.
   * @param {?object} kwargs - Keyword arguments to use for the translation.
   * @return {string} The translation for the given translation key.
   */
  translate(key, items, kwargs = {}) {
    let itemCount = 1;

    if (_.isArray(items)) {
      itemCount = items.length;
    }
    kwargs.items = itemCount;

    return new SafeString(this.#template.translate(key, kwargs));
  }

  // TODO: This should also accept a suffix.
  /**
   * Retrieves the translation for the `pageTitle` translation key, using the given prefix, title,
   * and category.
   *
   * @param {string} prefix - A prefix to include in the translated text (for example, `My
   * Project > `).
   * @param {string} title - A page-specific title (for example, `Foo`).
   * @param {?string} category - The kind of symbol that is represented on this page. Must map to a
   * key in the template's L10N resources file when the prefix `headings.` is added.
   * @return {string} The translation for the `pageTitle` translation key.
   */
  translatePageTitle(prefix, title, category) {
    return new SafeString(
      this.#template.translate('pageTitle', {
        category: category ? this.#template.translate(`headings.${category}`) : '',
        prefix,
        title,
      })
    );
  }

  /**
   * Converts an array of type names into a type expression that represents all of the types as a
   * single type union. For example, when you call this method with the types
   * `['string', 'number']`, the return value is `(string|number)`.
   *
   * @param {Array<string>} types - The array of type names.
   * @return {string} A type union that contains the specified types.
   */
  typeUnion(types) {
    return typeUnion(types);
  }

  /**
   * Retrieves the URL associated with a longname, or an empty string if the longname is not
   * recognized.
   *
   * @param {string} longname - The longname whose URL will be retrieved.
   * @return {string} The URL associated with the longname, or an empty string.
   */
  url(longname) {
    return this.#linkManager.getUri(longname);
  }
}
