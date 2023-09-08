/*
  Copyright 2023 the Baseline Authors.

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
describe('symbol overview partial', () => {
  // TODO: more tests

  describe('details', () => {
    // TODO: more tests

    it('shows extra details for externals', async () => {
      const fakeDoclets = [
        {
          name: 'Foo',
          longname: 'Foo',
          kind: 'class',
          scope: 'global',
        },
        {
          name: 'bar',
          longname: 'bar',
          kind: 'external',
          scope: 'global',
          see: ['https://example.com/'],
        },
      ];
      const text = await helpers.render('symbol-overview.njk', { docs: fakeDoclets });

      expect(text).toContainHtml(`
        <dt>See also</dt>
        <dd><a href="https://example.com/">https://example.com/</a></dd>
      `);
    });

    it('does not add an empty <dl> if the doclet is not an external', async () => {
      const fakeDoclet = {
        name: 'Foo',
        longname: 'Foo',
        kind: 'class',
        scope: 'global',
      };
      const text = await helpers.render('symbol-overview.njk', { docs: [fakeDoclet] });

      expect(text).not.toContainHtml(`
        <dl class="dl-compact">
        </dl>
      `);
    });
  });
});
