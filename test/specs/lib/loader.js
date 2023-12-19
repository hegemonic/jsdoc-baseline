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

import { FileSystemLoader } from 'nunjucks';

import ClassMap from '../../../lib/class-map.js';
import * as loader from '../../../lib/loader.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

describe('lib/loader', () => {
  it('exports a ViewLoader constructor', () => {
    expect(typeof loader.ViewLoader).toBe('function');
  });

  describe('ViewLoader', () => {
    let instance;
    const { ViewLoader } = loader;
    const viewPath = path.resolve(__dirname, '../../fixtures/views/loader');

    beforeEach(() => {
      instance = new ViewLoader([viewPath], {
        cssClassMap: new ClassMap({ fun: 'work', games: 'toil' }),
      });
    });

    it('extends nunjucks.FileSystemLoader', () => {
      expect(instance instanceof FileSystemLoader).toBeTrue();
    });

    describe('emit', () => {
      it('emits nothing by default', () => {
        let source;

        instance.once('load', (name, src) => {
          source = src;
        });
        instance.emit('load', 'loader-test.njk', {});

        expect(source).toBeUndefined();
      });

      it('emits events when REALLY_EMIT_KEY is passed in', () => {
        let source;

        instance.once('load', (name, src) => {
          source = src;
        });
        instance.emit('load', 'loader-test.njk', { src: 'hello world' }, 'REALLY_EMIT_KEY');

        expect(source).toBeObject();
        expect(source.src).toBe('hello world');
      });

      it('does not emit REALLY_EMIT_KEY', () => {
        let key;
        let source;

        instance.once('load', (name, src, emitKey) => {
          source = src;
          key = emitKey;
        });
        instance.emit('load', 'loader-test.njk', { src: 'hello world' }, 'REALLY_EMIT_KEY');

        expect(source).toBeObject();
        expect(key).toBeUndefined();
      });
    });

    describe('getSource', () => {
      it('reads the specified file', async () => {
        const source = instance.getSource('loader-test.njk');
        const actual = await readFile(path.join(viewPath, 'loader-test.njk'), 'utf8');

        expect(source).toBeObject();
        expect(source.src).toBe(actual);
      });

      it('maps CSS classes', () => {
        const source = instance.getSource('css-map.njk');

        // The class in the template file is `fun`, not `work`.
        expect(source.src).toContain('<span class="work">yay!</span>');
      });

      it('adds helpers to <h> elements with no attributes', () => {
        const source = instance.getSource('h-no-attributes.njk');

        expect(source.src).toContain('<h{{ headingLevel() }}>hello world</h{{ headingLevel() }}>');
      });

      it('adds helpers to <h> elements with attributes', () => {
        const source = instance.getSource('h-with-attributes.njk');

        expect(source.src).toContain(
          '<h{{ headingLevel() }} id="hi">hello world</h{{ headingLevel() }}>'
        );
      });

      it('adds helpers to <section> elements with no attributes', () => {
        const source = instance.getSource('section-no-attributes.njk');

        expect(source.src).toContain(
          '<section>{{ incrementHeading() }}<p>hello world</p>' +
            '{{ decrementHeading() }}</section>'
        );
      });

      it('adds helpers to <section> elements with attributes', () => {
        const source = instance.getSource('section-with-attributes.njk');

        expect(source.src).toContain(
          '<section id="hi">{{ incrementHeading() }}' +
            '<p>hello world</p>{{ decrementHeading() }}</section>'
        );
      });
    });

    describe('preprocess', () => {
      // No need to repeat the `getSource()` tests here. Just verify that `preprocess()` applies the
      // same transforms.
      it('processes class attributes', () => {
        const text = instance.preprocess('<div class="fun games"></div>');

        expect(text).toBe('<div class="work toil"></div>');
      });

      it('processes <h> and <section> elements', () => {
        const text = instance.preprocess('<section><h>hello world</h></section>');

        expect(text).toBe(
          '<section>{{ incrementHeading() }}<h{{ headingLevel() }}>' +
            'hello world</h{{ headingLevel() }}>{{ decrementHeading() }}</section>'
        );
      });
    });

    describe('preprocessors', () => {
      it('is an object', () => {
        expect(instance.preprocessors).toBeObject();
      });

      it('has a `classes` method', () => {
        expect(instance.preprocessors.classes).toBeFunction();
      });

      it('has a `headings` method', () => {
        expect(instance.preprocessors.headings).toBeFunction();
      });

      it('has a `sections` method', () => {
        expect(instance.preprocessors.sections).toBeFunction();
      });
    });
  });
});
