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

import * as name from '@jsdoc/name';

import { defaultConfig } from '../../../../lib/config.js';
import SetTocDataTree from '../../../../lib/tasks/set-toc-data-tree.js';

const TYPE_ERROR = 'TypeError';

function findTocLongnames(items, seen) {
  let result;

  seen ??= new Set();

  items.forEach((item) => {
    seen.add(item.id);
    findTocLongnames(item.children, seen);
  });

  result = Array.from(seen);
  result.sort();

  return result;
}

describe('lib/tasks/set-toc-data-tree', () => {
  let instance;

  beforeEach(() => {
    instance = new SetTocDataTree({
      name: 'setTocDataTree',
    });
  });

  it('is a constructor', () => {
    function factory() {
      return new SetTocDataTree({ name: 'setTocDataTree' });
    }

    expect(factory).not.toThrow();
  });

  describe('run', () => {
    let context;
    const globals = [
      helpers.createDoclet([
        '@name globalConstant',
        '@longname globalConstant',
        '@constant',
        '@global',
      ]),
      helpers.createDoclet([
        '@name globalFunction',
        '@longname globalFunction',
        '@function',
        '@global',
      ]),
      helpers.createDoclet(['@name globalMember', '@longname globalMember', '@member', '@global']),
      helpers.createDoclet([
        '@name globalTypedef',
        '@longname globalTypedef',
        '@typedef',
        '@global',
      ]),
    ];
    const nonGlobals = [
      helpers.createDoclet(['@name foo', '@longname foo', '@namespace']),
      helpers.createDoclet(['@name Bar', '@longname foo.Bar', '@memberof foo', '@class']),
    ];
    const navTree = name.longnamesToTree(
      nonGlobals.map((d) => d.longname),
      nonGlobals.reduce((accumulator, doclet) => {
        accumulator[doclet.longname] = doclet;

        return accumulator;
      }),
      {}
    );
    const needsOutputFile = {
      foo: nonGlobals[0],
      'foo.Bar': nonGlobals[1],
    };

    beforeEach(async () => {
      const doclets = globals.concat(nonGlobals);
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

    it('emits lifecycle events', async () => {
      let success;

      instance.on('start', () => {
        success = true;
      });
      await instance.run(context);

      expect(success).toBeTrue();
    });

    it('fails if the `docletStore` is missing', async () => {
      let error;

      context.docletStore.stopListening();
      context.docletStore = null;
      try {
        await instance.run(context);
      } catch (e) {
        error = e;
      }

      expect(error).toBeErrorOfType(TYPE_ERROR);
    });

    it('sets `navTree` correctly', async () => {
      await instance.run(context);

      expect(context.navTree).toBeObject();
      expect(context.navTree.foo).toBeObject();
    });

    it('adds the TOC data to the context', async () => {
      const expected = [
        {
          descendantHrefs: [],
          href: 'global.html',
          id: 'global',
          kind: 'namespace',
          label: 'Globals',
          children: [],
        },
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

    it('adds everything in the `navTree` to the TOC', async () => {
      const longnames = nonGlobals.map((d) => d.longname).sort();
      let tocLongnames;

      context.docletStore.stopListening();
      context.docletStore = helpers.createDocletStore(nonGlobals);
      await instance.run(context);
      tocLongnames = findTocLongnames(context.tocData);

      expect(tocLongnames).toEqual(longnames);
    });

    it('does not include an entry for globals if there are no globals', async () => {
      let tocLongnames;

      context.docletStore.stopListening();
      context.docletStore = helpers.createDocletStore(nonGlobals);
      await instance.run(context);
      tocLongnames = findTocLongnames(context.tocData);

      expect(tocLongnames).not.toContain('global');
    });

    it('includes an entry for globals when there are globals', async () => {
      let tocLongnames;

      await instance.run(context);
      tocLongnames = findTocLongnames(context.tocData);

      expect(tocLongnames).toContain('global');
    });
  });
});
