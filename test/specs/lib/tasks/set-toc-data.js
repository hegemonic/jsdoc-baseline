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

import { name } from '@jsdoc/core';

import { defaultConfig } from '../../../../lib/config.js';
import SetTocData from '../../../../lib/tasks/set-toc-data.js';

describe('lib/tasks/set-toc-data', () => {
  let instance;

  beforeEach(() => {
    instance = new SetTocData({
      name: 'setTocData',
    });
  });

  it('is a constructor', () => {
    function factory() {
      return new SetTocData({ name: 'setTocData' });
    }

    expect(factory).not.toThrow();
  });

  describe('run', () => {
    let context;
    const doclets = [
      helpers.createDoclet(['@name foo', '@longname foo', '@namespace']),
      helpers.createDoclet(['@name Bar', '@longname foo.Bar', '@memberof foo', '@class']),
    ];
    const navTree = name.longnamesToTree(
      doclets.map((d) => d.longname),
      doclets.reduce((accumulator, doclet) => {
        accumulator[doclet.longname] = doclet;

        return accumulator;
      }),
      {}
    );
    const needsOutputFile = {
      foo: doclets[0],
      'foo.Bar': doclets[1],
    };

    beforeEach(async () => {
      const template = await helpers.createTemplate(defaultConfig);

      context = {
        config: {
          opts: {},
        },
        destination: 'out',
        docletStore: helpers.createDocletStore(doclets),
        linkManager: template.linkManager,
        navTree,
        needsOutputFile,
      };

      for (const doclet of doclets) {
        template.linkManager.registerDoclet(doclet);
      }
    });

    afterEach(() => {
      context.docletStore?.stopListening();
    });

    it('creates tree-shaped TOC data by default', async () => {
      const expected = [
        {
          descendantHrefs: ['foo-bar.html'],
          href: 'foo.html',
          id: 'foo',
          kind: 'namespace',
          label: 'foo',
          children: [
            {
              descendantHrefs: [],
              href: 'foo-bar.html',
              id: 'foo.Bar',
              kind: 'class',
              label: 'Bar',
              children: [],
            },
          ],
        },
      ];

      await instance.run(context);

      expect(helpers.toObject(context.tocData)).toEqual(expected);
    });
  });
});
