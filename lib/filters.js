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

import { name } from '@jsdoc/core';
import catharsis from 'catharsis';
import escapeRegExp from 'escape-string-regexp';
import { escape as escapeHtml } from 'html-escaper';
import _ from 'lodash';
import nunjucks from 'nunjucks';
import spdxLicenses from 'spdx-license-list';

import * as ENUMS from './enums.js';
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

function basicLink(item, linkManager, opts = {}) {
  if (opts.linkText) {
    opts.linkText = escapeHtml(opts.linkText);
  }

  // TODO: Does the link manager escape link text? If not, it should
  return new SafeString(linkManager.createLink(item, opts));
}

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

function getCatharsisOptions(template, codeTag) {
  return {
    // TODO: use the correct locale
    codeTag,
    jsdoc: true,
    links: template.linkManager.stringToLinkUri,
  };
}

function getPathFromMeta(meta) {
  return meta.path ? path.join(meta.path, meta.filename) : meta.filename;
}

function jsdocVersion() {
  // TODO: Add a real value after we're able to plumb it through to the template.
  return '';
}

function needsSignature({ kind, type, meta }) {
  let needsSig = false;

  // Function and class definitions always get a signature.
  if (kind === 'function' || kind === 'class') {
    needsSig = true;
  }
  // Typedefs that contain functions get a signature, too.
  else if (kind === 'typedef' && type && type.names && type.names.length) {
    for (let i = 0, l = type.names.length; i < l; i++) {
      if (type.names[i].toLowerCase() === 'function') {
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

function parseType(template, type) {
  const catharsisOptions = getCatharsisOptions(template);

  // TODO: Should '' be {} or null?
  return type ? catharsis.parse(type, catharsisOptions) : '';
}

// Inserts a soft break after any of the characters in SOFT_BREAK_AFTER.
function softBreak(text) {
  return text.replace(SOFT_BREAK_AFTER, '$1<wbr />');
}

function typeUnion(types) {
  let typeExpression;

  types = types || [];
  typeExpression = types.join('|');

  if (types.length > 1) {
    typeExpression = `(${typeExpression})`;
  }

  return typeExpression;
}

/** @hideconstructor */
export class Filters {
  constructor(template) {
    this._cssClassMap = template.cssClassMap;
    this._dependencies = template.dependencies;
    this._headingLevel = 1;
    this._highlighter = null;
    this._template = template;
    this._linkManager = template.linkManager;
    this._markdownParser = null;
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
    const classMap = this._cssClassMap;

    const links = getAncestors(longname).map((ancestor) => {
      let ancestorName;

      // Don't try to link to scope punctuation.
      if (ancestor.length === 1 && SCOPE_PUNC_VALUES.includes(ancestor)) {
        return softBreak(ancestor);
      }

      ancestorName = name.toParts(ancestor).name;

      return basicLink(ancestor, this._linkManager, {
        cssClass: classMap.mapClassname(cssClass),
        linkText: name.stripNamespace(ancestorName),
        monospace,
      });
    });

    return new SafeString(links.join(''));
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

  /**
   * Gets the value of the specified key in the template configuration settings.
   *
   * @param {string} key - The key whose value will be retrieved.
   * @return {string} The configuration value.
   */
  config(key) {
    return _.get(this._template.config, key);
  }

  /**
   * Creates a `Filters` object.
   */
  static async create(template) {
    const filters = new Filters(template);

    filters._highlighter = await getHighlighter(filters._dependencies);
    filters._markdownParser = template.config.markdown
      ? await getMarkdownRenderer(filters._dependencies)
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
    if (this._headingLevel > MIN_HEADING_LEVEL) {
      this._headingLevel--;
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
   * Creates a human-readable description of a parsed type expression.
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
   * @param {Object} parsedType - A parsed type expression, using the same format as the
   * [Catharsis](https://github.com/hegemonic/catharsis) type-expression parser.
   * @param {?string} [format=simple] - The format to use when creating the description. Set to
   * `simple` or `extended`.
   * @param {?string} [property=description] - The property of the extended description to
   * retrieve. Ignored unless `format` is set to `extended`.
   * @param {?string} [codeTag=code] - The HTML tag to add to each type.
   * @return {string} A description of the type expression, or of one of the type
   * expression's modifiers.
   */
  describeType(parsedType, format = 'simple', property = 'description', codeTag = 'code') {
    const catharsisOptions = getCatharsisOptions(this._template, codeTag);
    let description;

    if (!['extended', 'simple'].includes(format)) {
      throw new Error('The describeType filter accepts the options "simple" and "extended".');
    } else if (format === 'extended') {
      property = property || 'description';
    }

    if (typeof parsedType === 'object') {
      description = catharsis.describe(parsedType, catharsisOptions);
    } else {
      // We don't know the type.
      description = catharsis.describe(catharsis.parse('?'), catharsisOptions);
    }

    if (format === 'extended') {
      return new SafeString(_.get(description.extended, property));
    } else {
      return new SafeString(description.simple);
    }
  }

  /**
   * Creates a human-readable description of a parsed type expression, without using code formatting
   * for types.
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
   * @param {Object} parsedType - A parsed type expression, using the same format as the
   * [Catharsis](https://github.com/hegemonic/catharsis) type-expression parser.
   * @param {?string} [format=simple] - The format to use when creating the description. Set to
   * `simple` or `extended`.
   * @param {?string} [property=description] - The property of the extended description to
   * retrieve. Ignored unless `format` is set to `extended`.
   * @return {string} A description of the type expression, or of one of the type
   * expression's modifiers.
   */
  describeTypePlaintext(parsedType, format = 'simple', property = 'description') {
    return this.describeType(parsedType, format, property, null);
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
    return formatParams(params, this._template);
  }

  /**
   * Gets a string identifying the tool that was used to generate the documentation, as well as
   * the date on which the documentation was generated.
   *
   * @return {string} A string with details about how and when the documentation was generated.
   */
  generatedBy() {
    const formatter = new Intl.DateTimeFormat(this._template.config.locale, {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });

    return new SafeString(
      this._template.translate('generatedBy', {
        version: jsdocVersion(),
        date: formatter.format(Date.now()),
      })
    );
  }

  /**
   * Groups a tree of doclets into logical sections.
   *
   * To identify logical sections, this method looks for the longname of the most recent ancestor
   * that is the parent of multiple doclets, and that is neither an inner member nor an instance
   * member.
   *
   * @param {Object} items - A tree of doclets, in the format returned by JSDoc's
   * {@link module:@jsdoc/core.name.longnamesToTree} method.
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
   * @param {boolean} isEnum - Indicates whether the doclet represents an enumeration.
   * @return {boolean} If the doclet has modifiers, `true`; otherwise, `false`.
   */
  hasModifiers({ nullable, variable, defaultvalue }, isEnum) {
    return Boolean(
      typeof nullable === 'boolean' ||
        variable === true ||
        (typeof defaultvalue !== 'undefined' && !isEnum)
    );
  }

  /**
   * Gets the current heading level. Added internally by the loader.
   *
   * @private
   * @return {string} The current heading level.
   */
  headingLevel() {
    return this._headingLevel;
  }

  /**
   * Adds syntax highlighting to the specified code. Optionally, the caller can specify the code's
   * language. If the language is omitted, the highlighter makes its best guess.
   *
   * @param {string} code - The code to highlight.
   * @param {string} lang - The language that the code is written in.
   * @return {string} The highlighted code.
   */
  highlight(code, lang) {
    return new SafeString(this._highlighter(code, lang, { cssClassMap: this._cssClassMap }));
  }

  /**
   * Adds syntax highlighting to the specified code, omitting the enclosing `<pre></pre>` tags.
   *
   * Optionally, the caller can specify the code's language. If the language is omitted, the
   * highlighter makes its best guess.
   *
   * @param {string} code - The code to highlight.
   * @param {string} lang - The language that the code is written in.
   * @return {string} The highlighted code.
   */
  highlightOmitPre(code, lang) {
    return new SafeString(
      this._highlighter(code, lang, { cssClassMap: this._cssClassMap, omitPre: true })
    );
  }

  /**
   * Adds syntax highlighting to the specified code, omitting the usual `<pre><code></code></pre>`
   * wrapper.
   *
   * Optionally, the caller can specify the code's language. If the language is omitted, the
   * highlighter makes its best guess.
   *
   * @param {string} code - The code to highlight.
   * @param {string} lang - The language that the code is written in.
   * @return {string} The highlighted code.
   */
  highlightUnwrapped(code, lang) {
    return new SafeString(
      this._highlighter(code, lang, { cssClassMap: this._cssClassMap, omitWrapper: true })
    );
  }

  /**
   * Given a doclet, gets an ID that can be used as an `id` attribute for an HTML element.
   *
   * @param {module:jsdoc/doclet.Doclet} doclet - The doclet to use.
   * @return {string} An ID for the doclet.
   */
  id(doclet) {
    return this._linkManager.registerDoclet(doclet).fragmentId;
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
    if (this._headingLevel < MAX_HEADING_LEVEL) {
      this._headingLevel++;
    }

    return '';
  }

  /**
   * Gets the version of JSDoc that is being used (for example, `4.0.0`).
   *
   * @return {string} The JSDoc version number.
   */
  jsdocVersion() {
    return jsdocVersion();
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
   * Retrieve a sorted list of labels that should be displayed for a symbol.
   *
   * The labels indicate all of the following:
   *
   * + The symbol's kind (only if the symbol gets its own output file)
   * + Whether the symbol is private or protected
   * + Whether the symbol is an asynchronous function
   * + Whether the symbol is a generator function
   * + Whether the symbol is a constant
   * + Whether the symbol is read-only
   * + Whether the symbol is abstract
   *
   * Labels are sorted alphabetically, with the exception of the label for the symbol's kind,
   * which always comes first.
   *
   * @param {jsdoc/doclet.Doclet} doclet - The doclet for the symbol.
   * @return {Array<Object>} An array of objects with two string properties: `class`, a CSS class
   * for the label, and `text`, the text for the label.
   */
  labels(doclet) {
    let labels = [];

    if (doclet.access) {
      labels.push(doclet.access);
    }

    if (doclet.async) {
      labels.push('async');
    }

    if (doclet.generator) {
      labels.push('generator');
    }

    if (doclet.kind === 'constant') {
      labels.push(doclet.kind);
    }

    if (doclet.readonly) {
      labels.push('readonly');
    }

    if (
      doclet.scope &&
      doclet.scope !== name.SCOPE.NAMES.INSTANCE &&
      doclet.scope !== name.SCOPE.NAMES.GLOBAL
    ) {
      labels.push(doclet.scope);
    }

    if (doclet.virtual) {
      labels.push('virtual');
    }

    // Translate and sort all the labels we've collected so far.
    labels = labels
      .map((text) => ({
        class: `label-${text}`,
        text: this._template.translate(`labels.${text}`),
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
    if (ENUMS.OUTPUT_FILE_KINDS.includes(doclet.kind)) {
      labels.unshift({
        class: 'label-kind',
        text: this._template.translate(`kinds.${doclet.kind}`),
      });
    }

    // Finally, update CSS classes as needed.
    labels = labels.map((label) => {
      label.class = this._cssClassMap.mapClassname(label.class);

      return label;
    });

    return labels;
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
        basicLink(spdxLicenses[licenseId].url, this._linkManager, {
          linkText: spdxLicenses[licenseId].name,
        })
      );
    }

    return result;
  }

  /**
   * Gets an HTML link for a specified longname.
   *
   * To control whether the link uses a fixed-width font, set the `monospace` argument to `true`
   * or `false`. For example: `{{ 'foo.bar' | link(null, true) }}`
   *
   * @param {string} longname - The longname to link to.
   * @param {?string} linkText - The link text to use, or the longname if no text is provided.
   * @param {boolean} monospace - Whether to use monospace text.
   * @return {handlebars.SafeString} An HTML link to the longname.
   */
  link(longname, linkText, monospace) {
    // Handle unusual cases where `longname` isn't a string for some reason. (One example:
    // JSDoc sets a doclet's `deprecated` property to `true` when the `@deprecated` tag has
    // no text.)
    if (typeof longname !== 'string') {
      longname = '';
    }

    if (!_.isBoolean(monospace)) {
      monospace = false;
    }

    return new SafeString(
      basicLink(longname, this._linkManager, {
        linkText: linkText || '',
        monospace,
      })
    );
  }

  /**
   * Links to the symbol represented by a doclet, using the symbol's longname and complete
   * signature as the link text.
   *
   * If the symbol's longname includes a namespace or variation, the namespace or variation do not
   * appear in the link text.
   *
   * @param {jsdoc/doclet.Doclet} doclet - The doclet that will be linked to.
   * @param {?string} cssClass - A CSS class to add to the link.
   * @return {string} A link to the specified symbol.
   */
  linkLongnameWithSignature(doclet, cssClass) {
    let linkText;

    linkText = name.stripNamespace(doclet.longname || '');
    linkText = name.stripVariation(linkText);

    if (needsSignature(doclet)) {
      linkText += formatParams(doclet.params, this._template);
    }

    return new SafeString(
      basicLink(doclet.longname, this._linkManager, {
        cssClass: this._cssClassMap.mapClassname(cssClass),
        linkText,
      })
    );
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
    const sourceFiles = this._template.context.sourceFiles;
    const shortpath = sourceFiles[filepath];

    // Don't add a fragment ID if we're linking to the start of the file.
    if (lineno > 1) {
      fragmentId = `L${lineno}`;
    }

    linkText = this._template.translate('linkToLine', {
      filepath: shortpath,
      lineno: lineno,
      items: lineno,
    });

    return new SafeString(
      basicLink(shortpath, this._linkManager, {
        cssClass: this._cssClassMap.mapClassname(cssClass),
        fragmentId,
        linkText,
        monospace,
      })
    );
  }

  /**
   * Links to the symbol represented by a doclet, using the symbol's name (_not_ its longname) and
   * its complete signature as the link text.
   *
   * @param {jsdoc/doclet.Doclet} doclet - The doclet that will be linked to.
   * @param {?string} cssClass - A CSS class to add to the link.
   * @return {string} A link to the specified symbol.
   */
  linkWithSignature(doclet, cssClass = '') {
    let linkText = doclet.name;

    if (needsSignature(doclet)) {
      linkText += formatParams(doclet.params, this._template);
    }

    return new SafeString(
      basicLink(doclet.longname, this._linkManager, {
        cssClass: this._cssClassMap.mapClassname(cssClass),
        linkText,
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
    return new SafeString(this._markdownParser(text));
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
   * @param {jsdoc/doclet.Doclet} doclet - A doclet representing the symbol.
   * @param {boolean} isEnum - If the doclet is part of an enumeration, `true`; otherwise,
   * `false`.
   * @return {string} Descriptions of the symbol's modifiers.
   */
  modifierText({ nullable, variable, defaultvalue }, isEnum) {
    const descriptions = [];

    if (nullable === true) {
      descriptions.push(this._template.translate('tables.body.nullable.long'));
    } else if (nullable === false) {
      descriptions.push(this._template.translate('tables.body.nonNullable.long'));
    }

    if (variable === true) {
      descriptions.push(this._template.translate('tables.body.repeatable.long'));
    }

    if (typeof defaultvalue !== 'undefined' && !isEnum) {
      descriptions.push(
        this._template.translate('tables.body.defaultValue', {
          valueString: this._template.translate('tables.body.defaultValueString', {
            value: String(defaultvalue),
          }),
        })
      );
    }

    return descriptions.join(' ');
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

    if (typeof cssClass !== 'string') {
      cssClass = '';
    }

    packageInfo = packageInfo || {};

    linkText = packageInfo.name || this._template.translate('brandDefault');

    if (packageInfo.name && packageInfo.version) {
      linkText += ` ${packageInfo.version}`;
    }

    return basicLink('index', this._linkManager, {
      cssClass: this._cssClassMap.mapClassname(cssClass),
      linkText,
    });
  }

  /**
   * Parse a type expression into an object. The object uses the format returned by the
   * [Catharsis](https://github.com/hegemonic/catharsis) library.
   *
   * @param {string?} type - The type expression to parse.
   * @return {(Object|string)} The parsed object, or an empty string if no type expression was
   * specified.
   */
  parseType(type) {
    return parseType(this._template, type);
  }

  /**
   * Given an array of objects, extract the value of the specified key from each object.
   *
   * @param {Array.<Object>} items - The objects whose property values will be extracted.
   * @param {string} key - The name of the property whose values will be extracted.
   * @return {Array.<*>} The values associated with the specified key.
   */
  pluck(items, key) {
    return items.reduce(function (accumulator, current) {
      if (Object.hasOwn(current, key)) {
        accumulator.push(current[key]);
      }

      return accumulator;
    }, []);
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
    const filters = listMethods(this, { includePrivate: true });

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
   *       {
   *           name: 'foo'
   *       },
   *       {
   *           name: 'foo.bar'
   *       }
   *   ]
   * }
   *
   * // Returned array
   * [
   *     {
   *         name: 'foo',
   *         children: [
   *             {
   *                 name: 'bar'
   *             }
   *         ]
   *     }
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
    let parsedType;

    // Only reparent items if that's what the user asked for.
    if (_.get(this._template.config, 'tables.nestedPropertyTables')) {
      items.forEach((item, i) => {
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
            // Clone the item, and manually clone a non-enumerable property that we need
            // need to keep.
            parsedType = item.type ? item.type.parsedType : null;
            item = _.cloneDeep(item);
            if (parsedType) {
              item.type.parsedType = parsedType;
            }

            item.name = match[1];
            parentItem.children = parentItem.children || [];
            parentItem.children.push(item);
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
    return new SafeString(this._linkManager.resolveInlineLinks(text));
  }

  /**
   * Converts an array of return types to a parsed type expression that represents all of the
   * return types as a single type union. For example, the return types `string` and `number` are
   * turned into an object representing the type expression `(string|number)`.
   *
   * @param {Object} doclet - A JSDoc doclet.
   * @return {Object} A parsed type expression, using the same format as the
   * [Catharsis](https://github.com/hegemonic/catharsis) type-expression parser.
   */
  returnTypes(doclet) {
    let source = [];
    const typeUnions = [];

    // We used to expect callers to pass in doclet.returns, so if "doclet" is an array, just
    // use it.
    if (Array.isArray(doclet)) {
      source = doclet;
    } else if (doclet) {
      source = doclet.yields || doclet.returns || [];
    }

    source.forEach(({ type }) => {
      if (type && type.names && type.names.length) {
        typeUnions.push(typeUnion(type.names));
      }
    });

    return parseType(this._template, typeUnion(typeUnions));
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

    return new SafeString(this._template.translate(key, kwargs));
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
      this._template.translate('pageTitle', {
        category: category ? this._template.translate(`headings.${category}`) : '',
        prefix,
        title,
      })
    );
  }

  /**
   * Converts an array of type names into a parsed type expression that represents all of the
   * types as a single type union. For example, the types `string` and `number` are turned into an
   * object representing the type expression `(string|number)`.
   *
   * @param {Array.<string>} types - The array of type names.
   * @return {Object} A parsed type expression, using the same format as the
   * [Catharsis](https://github.com/hegemonic/catharsis) type-expression parser.
   */
  typeUnion(types) {
    return parseType(this._template, typeUnion(types));
  }

  /**
   * Retrieves the URL associated with a longname, or an empty string if the longname is not
   * recognized.
   *
   * @param {string} longname - The longname whose URL will be retrieved.
   * @return {string} The URL associated with the longname, or an empty string.
   */
  url(longname) {
    return this._linkManager.getUri(longname);
  }
}
