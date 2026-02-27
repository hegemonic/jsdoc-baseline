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

import { defaultConfig } from '../../../../lib/config.js';

describe('members links partial', () => {
  // TODO: more tests

  describe('heading', () => {
    it('always adds a pluralized heading ID', async () => {
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
        <h1 id="namespaces">
          Namespace <copy-url from="namespaces"></copy-url>
        </h1>
      `);
      const text = await helpers.renderAndNormalize('members-links.njk', {
        headingKey: 'headings.namespaces',
        items: fakeDoclets,
        href: 'foo-bar.html',
      });

      expect(text).toContain(expected);
    });
  });

  describe('items', () => {
    let context;
    const doclets = [
      helpers.createDoclet(['@name Foo', '@longname Foo', '@class']),
      helpers.createDoclet(['@name Bar', '@longname Foo.Bar', '@memberof Foo', '@namespace']),
    ];

    beforeEach(async () => {
      const template = await helpers.createTemplate(defaultConfig);

      context = {
        config: {
          opts: {},
        },
        destination: 'out',
        docletStore: helpers.createDocletStore(doclets),
        linkManager: template.linkManager,
        template,
        templateConfig: defaultConfig,
      };

      for (const doclet of doclets) {
        template.linkManager.registerDoclet(doclet, 'hi');
      }
    });

    afterEach(() => {
      context.docletStore?.stopListening();
    });

    describe('item headings', () => {
      it('does not use HTML tags in the heading ID', async () => {
        const expected = await helpers.normalizeHtml(`
        <h2 id="bar">
          Bar <copy-url from="bar"></copy-url>
        </h2>
      `);
        const text = await helpers.renderAndNormalize('members-links.njk', {
          headingKey: 'headings.namespaces',
          items: doclets,
          href: 'foo.html',
        });

        expect(text).toContain(expected);
      });
    });
  });
});
