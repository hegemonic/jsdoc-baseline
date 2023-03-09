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
import { name } from '@jsdoc/core';
import _ from 'lodash';

import { defaultConfig } from '../../../../lib/config.js';
import { db } from '../../../../lib/db.js';
import SetTocData from '../../../../lib/tasks/set-toc-data.js';

const OUTPUT_DIR = 'out';
const TYPE_ERROR = 'TypeError';

function findTocLongnames(items, seen = []) {
  items.forEach((item) => {
    seen.push(item.id);
    findTocLongnames(item.children, seen);
  });

  return _.uniq(seen).sort();
}

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
    const globals = db({
      values: [
        {
          kind: 'constant',
          longname: 'globalConstant',
          name: 'globalConstant',
          scope: 'global',
        },
        {
          kind: 'function',
          longname: 'globalFunction',
          name: 'globalFunction',
          scope: 'global',
        },
        {
          kind: 'member',
          longname: 'globalMember',
          name: 'globalMember',
          scope: 'global',
        },
        {
          kind: 'typedef',
          longname: 'globalTypedef',
          name: 'globalTypedef',
          scope: 'global',
        },
      ],
    });
    const nonGlobals = [
      {
        kind: 'namespace',
        longname: 'foo',
        name: 'foo',
      },
      {
        kind: 'class',
        longname: 'foo.Bar',
        name: 'Bar',
      },
    ];
    const navTree = name.longnamesToTree(
      nonGlobals.map((d) => d.longname),
      nonGlobals.reduce((accumulator, doclet) => {
        accumulator[doclet.longname] = doclet;

        return accumulator;
      }),
      {}
    );

    beforeEach(async () => {
      const template = await helpers.createTemplate(defaultConfig);

      context = {
        config: {
          opts: {},
        },
        destination: OUTPUT_DIR,
        globals,
        linkManager: template.linkManager,
        navTree,
        // template,
        // templateConfig: defaultConfig,
      };
    });

    it('fails if the `globals` are missing', async () => {
      let error;

      context.globals = null;
      try {
        await instance.run(context);
      } catch (e) {
        error = e;
      }

      expect(error).toBeErrorOfType(TYPE_ERROR);
    });

    it('fails if the `navTree` is missing', async () => {
      let error;

      context.navTree = null;
      try {
        await instance.run(context);
      } catch (e) {
        error = e;
      }

      expect(error).toBeErrorOfType(TYPE_ERROR);
    });

    it('adds the TOC data to the context', async () => {
      await instance.run(context);

      expect(context.tocData).toBeArrayOfObjects();
    });

    it('adds everything in the `navTree` to the TOC', async () => {
      const longnames = nonGlobals.map((d) => d.longname).sort();
      let tocLongnames;

      context.globals = db({ values: [] });
      await instance.run(context);
      tocLongnames = findTocLongnames(context.tocData);

      expect(tocLongnames).toEqual(longnames);
    });

    it('does not include an entry for globals if there are no globals', async () => {
      let tocLongnames;

      context.globals = db({ values: [] });
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
