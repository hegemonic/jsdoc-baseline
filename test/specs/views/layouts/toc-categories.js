/*
  Copyright 2024 the Baseline Authors.

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

describe('toc-categories layout', () => {
  // TODO: more tests

  describe('labels', () => {
    let tocData;

    beforeEach(() => {
      tocData = [
        {
          category: 'classes',
          hrefs: ['foo-bar.html'],
          items: [
            {
              href: 'foo-bar.html',
              id: 'foo.Bar',
              label: 'Bar',
            },
          ],
          nameCount: {
            Bar: 1,
          },
        },
        {
          category: 'functions',
          hrefs: ['alpha.html#.hotel', 'india.html#.hotel'],
          items: [
            {
              href: 'alpha.html#.hotel',
              id: 'alpha.hotel',
              label: 'hotel',
            },
            {
              href: 'india.html#.hotel',
              id: 'india.hotel',
              label: 'hotel',
            },
          ],
          nameCount: {
            hotel: 2,
          },
        },
      ];
    });
    it('uses the `name` as the label by default', async () => {
      const expected = '<a href="foo-bar.html">Bar</a>';
      const text = await helpers.renderAndNormalize('toc-categories.njk', { tocData });

      expect(text).toContain(expected);
    });

    it('uses the `longname` as the label when multiple items share a `name`', async () => {
      const expectedAlpha = '<a href="alpha.html#.hotel">alpha.hotel</a>';
      const expectedIndia = '<a href="india.html#.hotel">india.hotel</a>';
      const text = await helpers.renderAndNormalize('toc-categories.njk', { tocData });

      expect(text).toContain(expectedAlpha);
      expect(text).toContain(expectedIndia);
    });
  });
});
