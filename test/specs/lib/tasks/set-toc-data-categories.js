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
    const doclets = [
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

    beforeEach(async () => {
      const template = await helpers.createTemplate(defaultConfig);

      context = {
        config: {
          opts: {},
        },
        destination: 'out',
        docletStore: helpers.createDocletStore(doclets),
        linkManager: template.linkManager,
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
        },
        {
          category: 'events',
          hrefs: ['alpha.html'],
          items: [
            {
              href: 'alpha.html',
              id: 'event:alpha.foxtrot',
              label: 'foxtrot',
            },
          ],
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
        },
      ];

      await instance.run(context);

      expect(context.tocData).toEqual(expected);
    });

    it('lets users override the list of categories', async () => {
      const expected = [
        {
          category: 'functions',
          hrefs: ['alpha.html'],
          items: [
            {
              href: 'alpha.html',
              id: 'alpha.hotel',
              label: 'hotel',
            },
          ],
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
        },
      ];

      context.tocCategories = [CATEGORIES.FUNCTIONS, CATEGORIES.MODULES];
      await instance.run(context);

      expect(context.tocData).toEqual(expected);
    });
  });
});
