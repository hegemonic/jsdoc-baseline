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

// TODO: Merge into layouts/toc-categories.js
describe('TOC categories partial', () => {
  // TODO: more tests

  describe('always expanded', () => {
    let template;
    let tocData;

    beforeEach(async () => {
      template = await helpers.createTemplate({
        toc: {
          type: 'categories',
          categories: {
            alwaysExpanded: true,
          },
        },
      });
      tocData = [
        {
          category: 'modules',
          hrefs: ['module-foo.html'],
          items: [
            {
              href: 'module-foo.html',
              id: 'module:foo',
              label: 'foo',
            },
          ],
        },
      ];
    });

    afterEach(() => {
      helpers.setup();
    });

    it('uses the correct properties for the container element', async () => {
      const output = await template.render('toc-categories.njk', { href: 'test.html', tocData });

      expect(output).toContain('<wa-details keep-open open>');
    });

    it('does not add a heading to the TOC item for globals', async () => {
      const globalTocCategory = {
        category: 'globals',
        hrefs: ['global.html'],
        items: [{ href: 'global.html', id: 'global', label: 'Global' }],
        nameCount: {},
      };
      let output;

      tocData.shift(globalTocCategory);
      output = await template.render('toc-categories.njk', { href: 'test.html', tocData });

      expect(output).not.toContain('Global');
    });
  });
});
