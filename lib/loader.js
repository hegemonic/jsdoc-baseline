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
import nunjucks from 'nunjucks';

const CSS_CLASSES = /\s*class="\s*(.+?)\s*"/g;
const REALLY_EMIT_KEY = 'REALLY_EMIT_KEY';
const REGEXP_TAG_ATTRIBUTES = '(?:\\s+[^>]+)?';
const REGEXP_HEADING_OPEN = new RegExp(`<h(${REGEXP_TAG_ATTRIBUTES})?>`, 'g');
const REGEXP_HEADING_CLOSE = /<\/h>/g;
const REGEXP_SECTION_OPEN = /<section([^>]*)>/g;
const REGEXP_SECTION_CLOSE = /<\/section>/g;

export class ViewLoader extends nunjucks.FileSystemLoader {
  constructor(searchPaths, opts = {}) {
    super(searchPaths, opts);

    this._cssClassMap = opts.cssClassMap;
  }

  // We want to emit events that reflect the preprocessing that happens in this class. Therefore,
  // we need to block events that are triggered in the superclass. We do this by ignoring all
  // calls to `emit()` where the last parameter is not `REALLY_EMIT_KEY`.
  emit(...args) {
    if (args.indexOf(REALLY_EMIT_KEY) === args.length - 1) {
      // Don't emit `REALLY_EMIT_KEY`.
      args.pop();
      super.emit(...args);
    }
  }

  getSource(name) {
    const source = super.getSource(name);

    if (source) {
      source.src = this.preprocess(source.src);
      this.emit('load', name, source, REALLY_EMIT_KEY);
    }

    return source;
  }

  preprocess(str) {
    Object.keys(this.preprocessors).forEach((preproc) => {
      str = this.preprocessors[preproc](str, { cssClassMap: this._cssClassMap });
    });

    return str;
  }

  preprocessors = {
    // Replace CSS classes with user-defined classes.
    classes(str, { cssClassMap }) {
      if (!cssClassMap || cssClassMap.isEmpty()) {
        return str;
      }

      str = str.replaceAll(CSS_CLASSES, (_match, captured) => {
        const classnames = captured.split(' ');

        return cssClassMap.mapClassnamesToHtmlAttribute(classnames);
      });

      return str;
    },
    // Replace <h></h> with auto-incremented heading levels.
    headings(str) {
      return str
        .replace(REGEXP_HEADING_OPEN, '<h{{ headingLevel() }}$1>')
        .replace(REGEXP_HEADING_CLOSE, '</h{{ headingLevel() }}>');
    },
    // Add a helper to <section> elements so we can auto-increment headings.
    sections(str) {
      return str
        .replace(REGEXP_SECTION_OPEN, '<section$1>{{ incrementHeading() }}')
        .replace(REGEXP_SECTION_CLOSE, '{{ decrementHeading() }}</section>');
    },
  };
}
