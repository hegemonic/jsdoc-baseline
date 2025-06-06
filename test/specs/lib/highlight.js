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

import path from 'node:path';
import { fileURLToPath } from 'node:url';

import * as highlight from '../../../lib/highlight.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function setHighlightValue(highlightValue) {
  const env = helpers.env;

  env.conf.markdown ??= {};
  env.conf.markdown.highlight = highlightValue;
}

function cssClass(classname) {
  return new RegExp(`class="([^"]+\\s+)?${classname}(\\s+[^"]+)?"`);
}

describe('lib/highlight', () => {
  afterEach(() => {
    helpers.setup();
  });

  it('has a `getHighlighter` method', () => {
    expect(highlight).toHaveMethod('getHighlighter');
  });

  describe('getHighlighter', () => {
    const { getHighlighter } = highlight;
    let highlighter;

    beforeEach(async () => {
      highlighter = await getHighlighter(helpers.env);
    });

    it('returns the default highlighter if none is specified', async () => {
      // We don't have a good way to check whether it's the "default highlighter," so we just
      // confirm that it's a function that returns a string. Its behavior is tested elsewhere.
      const defaultHighlighter = await getHighlighter(helpers.env);

      expect(defaultHighlighter).toBeFunction();
      expect(defaultHighlighter('hello')).toBeString();
    });

    it('loads a module when one is specified', async () => {
      let html;
      let newHighlighter;
      const requirePath = path.resolve(__dirname, '../../fixtures/highlighter/highlighter.js');

      setHighlightValue(requirePath);
      newHighlighter = await getHighlighter(helpers.env);
      html = newHighlighter('hello');

      expect(html).toBe('hello is highlighted!');
    });

    it('logs an error and returns the default if the module cannot be loaded', async () => {
      const events = [];
      let newHighlighter;

      function listener(e) {
        events.push(e);
      }

      helpers.env.emitter.on('logger:error', listener);
      setHighlightValue('./not-a-real-module');
      newHighlighter = await getHighlighter(helpers.env);
      helpers.env.emitter.off('logger:error', listener);

      expect(events).toBeArrayOfSize(1);
      expect(events[0]).toBeString();
      expect(newHighlighter('hello')).toBe(highlighter('hello'));
    });

    it('logs an error and returns the default if the module has no `highlight` method', async () => {
      let newHighlighter;
      const spy = spyOn(helpers.env.log, 'error');

      setHighlightValue(`./${__filename}`);
      newHighlighter = await getHighlighter(helpers.env);

      expect(spy).toHaveBeenCalled();
      expect(newHighlighter('hello')).toBe(highlighter('hello'));
    });

    it('uses the function in the config file if specified', async () => {
      let newHighlighter;

      setHighlightValue((code) => `This highlighter is ${code}`);
      newHighlighter = await getHighlighter(helpers.env);

      expect(newHighlighter('lackluster')).toBe('This highlighter is lackluster');
    });

    describe('default highlighter', () => {
      it('trims trailing whitespace, but not leading whitespace', () => {
        const html = highlighter('\n\n\n.\n\n\n', 'js');

        expect(html).toMatch(/<code[^>]*>[\n]{3}\.<\/code>/);
      });

      it('adds a `<pre><code>` wrapper by default', () => {
        const html = highlighter('hi');

        expect(html).toMatch(/^<pre><code[^>]*>.+<\/code><\/pre>$/);
      });

      it('omits the `<pre><code>` wrapper when requested', () => {
        const html = highlighter('hi', null, { omitWrapper: true });

        expect(html).not.toMatch(/^<pre><code[^>]*>.+<\/code><\/pre>$/);
      });

      it('omits only the `<pre>` wrapper when requested', () => {
        const html = highlighter('hi', null, { omitPre: true });

        expect(html).toMatch(/^<code[^>]*>.+<\/code>$/);
      });

      describe('plaintext', () => {
        it('adds a "do not highlight" CSS class if the language is `none`', () => {
          const html = highlighter('hi', 'none');

          expect(html).toMatch(cssClass('no-hljs'));
        });

        it('HTML-escapes the code if the language is `none`', () => {
          const html = highlighter('<>', 'none');

          expect(html).toMatch('&lt;&gt;');
        });

        it('adds a "do not highlight" CSS class if the language is `plain`', () => {
          const html = highlighter('hi', 'plain');

          expect(html).toMatch(cssClass('no-hljs'));
        });

        it('HTML-escapes the code if the language is `plain`', () => {
          const html = highlighter('<>', 'plain');

          expect(html).toMatch('&lt;&gt;');
        });
      });

      describe('highlighted', () => {
        it('adds a "do highlight" CSS class if no language is specified', () => {
          const html = highlighter('hi');

          expect(html).toMatch(cssClass('hljs'));
        });

        it('adds a "do highlight" CSS class if JavaScript is specified', () => {
          const html = highlighter('hi', 'js');

          expect(html).toMatch(cssClass('hljs'));
        });

        it('adds a class to identify the language if the language is identified', () => {
          const html = highlighter('let foo;', 'js');

          expect(html).toMatch(cssClass('language-js'));
        });

        it('does not add a CSS class for the specified language if it is unknown', () => {
          const html = highlighter('hi', 'jubjub');

          expect(html).not.toMatch(cssClass('language-jubjub'));
        });

        it('does not add a CSS class for the language if it cannot be identified', () => {
          const html = highlighter('💩');

          expect(html).not.toMatch(cssClass('language-[a-z]+'));
        });

        it('HTML-escapes the code', () => {
          const html = highlighter('<>');

          expect(html).toMatch('&lt;&gt;');
        });
      });
    });
  });
});
