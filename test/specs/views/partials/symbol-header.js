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
      const text = await helpers.render('symbol-header.njk', { item: fakeDoclet });

      expect(text).toContainHtml(`
        <div class="symbol-description">
          <p>The foo namespace.</p>
        </div>
      `);
    });

    it('shows a description for symbols that are not classes or namespaces', async () => {
      const fakeDoclet = {
        name: 'foo',
        longname: 'foo',
        description: 'The foo module.',
        kind: 'module',
      };
      const text = await helpers.render('symbol-header.njk', { item: fakeDoclet });

      expect(text).toContainHtml(`
        <div class="symbol-description">
          <p>The foo module.</p>
        </div>
      `);
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
      const text = await helpers.render('symbol-header.njk', { item: fakeDoclet });

      expect(text).toContainHtml(`
        <dt>Implements</dt>
        <dd>IBar</dd>
      `);
    });

    it('does not add a <dl> if there are no details to show', async () => {
      const fakeDoclet = {
        name: 'Foo',
        longname: 'Foo',
        kind: 'class',
        scope: 'global',
      };
      const text = await helpers.render('symbol-header.njk', { item: fakeDoclet });

      expect(text).not.toContain('<dl');
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
      const text = await helpers.render('symbol-header.njk', { item: fakeDoclet });

      expect(text).toContain('Foo');
    });
  });
});
