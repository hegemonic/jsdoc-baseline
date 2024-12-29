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

describe('symbol detail partial', () => {
  describe('labels', () => {
    xit('shows labels when the doclet has the appropriate properties', () => {
      // TODO
    });

    xit('does not show labels for classes', () => {
      // TODO
    });

    xit('does not show labels for modules', () => {
      // TODO
    });

    xit('does not show labels for namespaces', () => {
      // TODO
    });
  });

  describe('heading', () => {
    xit('shows the constructor prefix, name, and signature for constructors', () => {
      // TODO
    });

    xit('shows the name and signature for functions', () => {
      // TODO
    });

    xit('shows the name for members', () => {
      // TODO
    });

    it('does not show a heading for hidden constructors', async () => {
      const fakeDoclet = {
        hideconstructor: true,
      };
      const text = await helpers.render('symbol-detail', { item: fakeDoclet });

      expect(text).not.toContain('<h');
    });

    it('dequotes quoted names for externals', async () => {
      const fakeDoclet = {
        kind: 'external',
        longname: '"my.external"',
        name: '"my.external"',
      };
      const text = await helpers.render('symbol-detail', { item: fakeDoclet });

      expect(text).toContain('my.external');
      expect(text).not.toContain('"my.external"');
    });
  });

  describe('source file link', () => {
    xit('shows a link when `sourceFiles.singleLink` is false', () => {
      // TODO
    });

    xit('does not show a link when `sourceFiles.singleLink` is true', () => {
      // TODO
    });

    it('does not show a link for hidden constructors', async () => {
      const fakeDoclet = {
        hideconstructor: true,
        meta: {
          filename: 'foo.js',
          lineno: '1',
        },
      };
      const text = await helpers.render('symbol-detail', { item: fakeDoclet });

      expect(text).not.toContain('<a');
    });
  });

  describe('description', () => {
    xit('shows the description', () => {
      // TODO
    });

    it('does not show the description for hidden constructors', async () => {
      const fakeDoclet = {
        description: 'Hidden',
        hideconstructor: true,
      };
      const text = await helpers.render('symbol-detail', { item: fakeDoclet });

      expect(text).not.toContain('Hidden');
    });
  });

  describe('examples', () => {
    xit('shows the examples', () => {
      // TODO
    });

    it('does not show the examples for hidden constructors', () => {
      const fakeDoclet = {
        examples: ['example'],
        hideconstructor: true,
      };
      const text = helpers.render('symbol-detail', { item: fakeDoclet });

      expect(text).not.toContain('example');
    });
  });

  describe('params', () => {
    xit('shows the params', () => {
      // TODO
    });

    it('does not show the params for hidden constructors', async () => {
      const fakeDoclet = {
        hideconstructor: true,
        params: [
          {
            type: {
              names: ['string'],
            },
            description: 'Foo parameter.',
            name: 'foo',
          },
        ],
      };
      const text = await helpers.render('symbol-detail', { item: fakeDoclet });

      expect(text).not.toContain('foo');
    });
  });

  describe('properties', () => {
    xit('shows the properties', () => {
      // TODO
    });

    it('does not show the properties for hidden constructors', async () => {
      const fakeDoclet = {
        hideconstructor: true,
        properties: [
          {
            type: {
              names: ['string'],
            },
            description: 'Foo property.',
            name: 'foo',
          },
        ],
      };
      const text = await helpers.render('symbol-detail', { item: fakeDoclet });

      expect(text).not.toContain('foo');
    });
  });

  describe('details', () => {
    it('shows the symbol details', async () => {
      const fakeDoclet = {
        name: 'foo',
        longname: 'foo',
        kind: 'function',
        scope: 'global',
        returns: [
          {
            type: {
              names: ['string'],
              expression: 'string',
            },
            description: 'Return value.',
          },
        ],
      };
      const expected = await helpers.normalizeHtml(`
        <dt>Returns</dt>
        <dd>
          <p><code>string</code> Return value.</p>
        </dd>`);
      const text = await helpers.renderAndNormalize('symbol-detail', { item: fakeDoclet });

      expect(text).toContain(expected);
    });

    it('does not add a <dl> if there are no details to show', async () => {
      const fakeDoclet = {
        name: 'foo',
        longname: 'foo',
        kind: 'function',
        scope: 'global',
      };
      const text = await helpers.render('symbol-detail', { item: fakeDoclet });

      expect(text).not.toContain('<dl');
    });

    it('does not show the symbol details for hidden constructors', async () => {
      const fakeDoclet = {
        copyright: 'Foo',
        hideconstructor: true,
      };
      const text = await helpers.render('symbol-detail', { item: fakeDoclet });

      expect(text).not.toContain('Foo');
    });
  });
});
