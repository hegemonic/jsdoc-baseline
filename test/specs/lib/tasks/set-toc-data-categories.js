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

import { defaultConfig } from '../../../../lib/config.js';
import { CATEGORIES } from '../../../../lib/enums.js';
import SetTocDataCategories from '../../../../lib/tasks/set-toc-data-categories.js';

describe('lib/tasks/set-toc-data-categories', () => {
  let instance;

  beforeEach(() => {
    instance = new SetTocDataCategories({
      name: 'setTocDataCategories',
    });
  });

  it('is a constructor', () => {
    function factory() {
      return new SetTocDataCategories({ name: 'setTocDataCategories' });
    }

    expect(factory).not.toThrow();
  });

  describe('run', () => {
    let context;
    let doclets;
    let template;

    beforeEach(async () => {
      template = await helpers.createTemplate(defaultConfig);

      doclets = [
        helpers.createDoclet(['@name alpha', '@longname alpha', '@namespace']),
        helpers.createDoclet(['@name Bravo', '@longname alpha.Bravo', '@memberof alpha', '@class']),
        helpers.createDoclet(['@name charlie', '@longname module:charlie', '@module']),
        helpers.createDoclet(['@name delta', '@longname external:delta', '@external']),
        helpers.createDoclet(['@name IEcho', '@longname IEcho', '@interface']),
        helpers.createDoclet([
          '@name foxtrot',
          '@longname event:alpha.foxtrot',
          '@memberof alpha',
          '@event',
        ]),
        helpers.createDoclet(['@name golf', '@longname golf', '@mixin']),
        helpers.createDoclet([
          '@name hotel',
          '@longname alpha.hotel',
          '@memberof alpha',
          '@function',
        ]),
      ];
      context = {
        config: {
          opts: {},
        },
        destination: 'out',
        docletStore: helpers.createDocletStore(doclets),
        linkManager: template.linkManager,
        template,
      };

      for (const doclet of doclets) {
        template.linkManager.registerDoclet(doclet);
      }
    });

    afterEach(() => {
      context.docletStore?.stopListening();
    });

    it('creates TOC data organized by category', async () => {
      const expected = [
        {
          category: 'modules',
          hrefs: ['module-charlie.html'],
          items: [
            {
              href: 'module-charlie.html',
              id: 'module:charlie',
              label: 'charlie',
            },
          ],
          nameCount: {
            charlie: 1,
          },
        },
        {
          category: 'externals',
          hrefs: ['external-delta.html'],
          items: [
            {
              href: 'external-delta.html',
              id: 'external:delta',
              label: 'delta',
            },
          ],
          nameCount: {
            delta: 1,
          },
        },
        {
          category: 'namespaces',
          hrefs: ['alpha.html'],
          items: [
            {
              href: 'alpha.html',
              id: 'alpha',
              label: 'alpha',
            },
          ],
          nameCount: {
            alpha: 1,
          },
        },
        {
          category: 'classes',
          hrefs: ['alpha-bravo.html'],
          items: [
            {
              href: 'alpha-bravo.html',
              id: 'alpha.Bravo',
              label: 'Bravo',
            },
          ],
          nameCount: {
            Bravo: 1,
          },
        },
        {
          category: 'interfaces',
          hrefs: ['i-echo.html'],
          items: [
            {
              href: 'i-echo.html',
              id: 'IEcho',
              label: 'IEcho',
            },
          ],
          nameCount: {
            IEcho: 1,
          },
        },
        {
          category: 'events',
          hrefs: ['alpha.html#.event:foxtrot'],
          items: [
            {
              href: 'alpha.html#.event:foxtrot',
              id: 'event:alpha.foxtrot',
              label: 'foxtrot',
            },
          ],
          nameCount: {
            foxtrot: 1,
          },
        },
        {
          category: 'mixins',
          hrefs: ['golf.html'],
          items: [
            {
              href: 'golf.html',
              id: 'golf',
              label: 'golf',
            },
          ],
          nameCount: {
            golf: 1,
          },
        },
      ];

      await instance.run(context);

      expect(context.tocData).toEqual(expected);
    });

    it('lets users override the list of categories', async () => {
      const expected = [
        {
          category: 'functions',
          hrefs: ['alpha.html#.hotel'],
          items: [
            {
              href: 'alpha.html#.hotel',
              id: 'alpha.hotel',
              label: 'hotel',
            },
          ],
          nameCount: {
            hotel: 1,
          },
        },
        {
          category: 'modules',
          hrefs: ['module-charlie.html'],
          items: [
            {
              href: 'module-charlie.html',
              id: 'module:charlie',
              label: 'charlie',
            },
          ],
          nameCount: {
            charlie: 1,
          },
        },
      ];

      context.tocCategories = [CATEGORIES.FUNCTIONS, CATEGORIES.MODULES];
      await instance.run(context);

      expect(context.tocData).toEqual(expected);
    });

    it('tracks the number of doclets with the same name by category', async () => {
      const expected = [
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
      const doclet = helpers.createDoclet([
        '@name hotel',
        '@longname india.hotel',
        '@memberof india',
        '@function',
      ]);

      doclets.push(doclet);
      template.linkManager.registerDoclet(doclet);

      context.tocCategories = [CATEGORIES.FUNCTIONS];
      await instance.run(context);

      expect(context.tocData).toEqual(expected);
    });

    it('adds an entry for globals, when present, at the start of the TOC', async () => {
      const expected = {
        href: 'global.html',
        id: 'global',
        label: 'Global',
      };
      const globalDoclet = helpers.createDoclet([
        '@name india',
        '@longname india',
        '@function',
        '@global',
      ]);
      doclets.push(globalDoclet);
      template.linkManager.registerDoclet(globalDoclet);

      await instance.run(context);

      expect(context.tocData[0].items).toContain(expected);
    });
  });
});
