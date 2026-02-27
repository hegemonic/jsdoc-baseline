/*
  Copyright 2026 the Baseline Authors.

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

describe('summary block partial', () => {
  // TODO: more tests

  describe('heading', () => {
    it('always adds a pluralized heading ID that starts with `summary-`', async () => {
      // There's only one doclet, so the heading will be singular. The heading ID should still be
      // plural.
      const fakeDoclets = [
        {
          name: 'Bar',
          longname: 'Foo.Bar',
          kind: 'namespace',
          scope: 'static',
        },
      ];
      const expected = await helpers.normalizeHtml(`
        <h1 id="summary-namespaces" class="hide-from-nav summary-callout-heading">
          Namespace <copy-url from="summary-namespaces"></copy-url>
        </h1>
      `);
      const text = await helpers.renderAndNormalize('summary-block.njk', {
        headingKey: 'headings.namespaces',
        items: fakeDoclets,
        href: 'foo-bar.html',
      });

      expect(text).toContain(expected);
    });
  });
});
