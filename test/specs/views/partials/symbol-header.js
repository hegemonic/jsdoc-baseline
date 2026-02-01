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

describe('symbol header partial', () => {
  // TODO: more tests

  describe('title', () => {
    // TODO: more tests

    it('uses `pageHeading` as the title if it is defined', async () => {
      const expected = await helpers.normalizeHtml(`
        <header class="page-header">
          <h1 id="hello">Hello <copy-url from="hello"></copy-url></h1>
        </header>
      `);
      const text = await helpers.renderAndNormalize('symbol-header.njk', {
        href: 'hello.html',
        pageHeading: 'Hello',
      });

      expect(text).toContain(expected);
    });
  });

  describe('description', () => {
    // TODO: more tests

    xit('does not show a description for classes', () => {
      // TODO: write me
    });

    xit('does not show a description for namespaces that are also functions', () => {
      // TODO: write me
    });

    it('shows a description for namespaces that are not functions', async () => {
      const fakeDoclet = {
        name: 'foo',
        longname: 'foo',
        description: 'The foo namespace.',
        kind: 'namespace',
        scope: 'global',
      };
      const expected = await helpers.normalizeHtml(`
        <div class="symbol-description">
          <p>The foo namespace.</p>
        </div>
      `);
      const text = await helpers.renderAndNormalize('symbol-header.njk', {
        href: 'foo.html',
        item: fakeDoclet,
      });

      expect(text).toContain(expected);
    });

    it('shows a description for symbols that are not classes or namespaces', async () => {
      const fakeDoclet = {
        name: 'foo',
        longname: 'foo',
        description: 'The foo module.',
        kind: 'module',
      };
      const expected = await helpers.normalizeHtml(`
        <div class="symbol-description">
          <p>The foo module.</p>
        </div>
      `);
      const text = await helpers.renderAndNormalize('symbol-header.njk', {
        href: 'foo.html',
        item: fakeDoclet,
      });

      expect(text).toContain(expected);
    });
  });

  describe('details', () => {
    // TODO: more tests

    it('shows the symbol details', async () => {
      const fakeDoclet = {
        name: 'Foo',
        longname: 'Foo',
        implements: ['IBar'],
        kind: 'class',
        scope: 'global',
      };
      const expected = await helpers.normalizeHtml(`
        <dt>Implements</dt>
        <dd>IBar</dd>
      `);
      const text = await helpers.renderAndNormalize('symbol-header.njk', {
        href: 'foo.html',
        item: fakeDoclet,
      });

      expect(text).toContain(expected);
    });

    it('does not add a <dl> if there are no details to show', async () => {
      const fakeDoclet = {
        name: 'Foo',
        longname: 'Foo',
        kind: 'class',
        scope: 'global',
      };
      const unexpected = '<dl';
      const text = await helpers.render('symbol-header.njk', {
        href: 'foo.html',
        item: fakeDoclet,
      });

      expect(text).not.toContain(unexpected);
    });
  });

  describe('class details', () => {
    xit('does not show details for a normal class', () => {
      // TODO
    });

    it('shows details for hidden constructors', async () => {
      const fakeDoclet = {
        copyright: 'Foo',
        hideconstructor: true,
      };
      const expected = 'Foo';
      const text = await helpers.render('symbol-header.njk', {
        href: 'foo.html',
        item: fakeDoclet,
      });

      expect(text).toContain(expected);
    });
  });
});
