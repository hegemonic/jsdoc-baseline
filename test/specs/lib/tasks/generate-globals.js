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

// eslint-disable-next-line simple-import-sort/imports
import mock from 'mock-fs';

import path from 'node:path';

import fs from 'fs-extra';

import { defaultConfig } from '../../../../lib/config.js';
import GenerateGlobals from '../../../../lib/tasks/generate-globals.js';

const OUTPUT_DIR = 'out';

function createTestDoclets() {
  return [
    helpers.createDoclet(['@name globalConstant', '@longname globalConstant', '@const', '@global']),
    helpers.createDoclet(['@name globalEvent', '@longname globalEvent', '@event', '@global']),
    helpers.createDoclet([
      '@name globalFunction',
      '@longname globalFunction',
      '@function',
      '@global',
    ]),
    helpers.createDoclet(['@name globalMember', '@longname globalMember', '@member', '@global']),
    // TODO: Update views to do something with mixins, then uncomment this doclet.
    // helpers.createDoclet(['@name globalMixin', '@longname globalMixin', '@mixin', '@global']),
    helpers.createDoclet(['@name globalTypedef', '@longname globalTypedef', '@typedef', '@global']),
  ];
}

describe('lib/tasks/generate-globals', () => {
  let conf;
  let context;
  let instance;

  beforeEach(async () => {
    conf = {
      opts: {
        access: ['undefined'],
      },
    };
    context = {
      config: conf,
      destination: OUTPUT_DIR,
      docletStore: helpers.createDocletStore(createTestDoclets()),
      pageTitlePrefix: '',
      template: await helpers.createTemplate(defaultConfig),
      templateConfig: defaultConfig,
    };
    context.linkManager = context.template.linkManager;
    instance = new GenerateGlobals({ name: 'generateGlobals' });

    context.linkManager.getUniqueFilename('global');

    mock(helpers.baseViews);
  });

  afterEach(() => {
    mock.restore();
    context.docletStore.stopListening();
  });

  it('is a constructor', () => {
    function factory() {
      return new GenerateGlobals({});
    }

    expect(factory).not.toThrow();
  });

  it('accepts a `url` property', () => {
    const url = 'foo.html';

    instance = new GenerateGlobals({ url });

    expect(instance.url).toBe(url);
  });

  describe('run', () => {
    it('returns a promise on success', (cb) => {
      const result = instance.run(context);

      expect(result).toBeInstanceOf(Promise);

      helpers.handlePromise(result, cb);
    });

    it('returns a promise on failure', (cb) => {
      let result;

      context.template = null;
      result = instance.run(context);

      expect(result).toBeInstanceOf(Promise);

      helpers.handlePromise(result, cb);
    });

    it('generates nothing if there are no globals', async () => {
      context.docletStore.stopListening();
      context.docletStore = helpers.createDocletStore([]);

      await instance.run(context);

      expect(fs.existsSync(OUTPUT_DIR)).toBeFalse();
    });

    it('generates a single file if there are globals', async () => {
      await instance.run(context);

      expect(fs.readdirSync(OUTPUT_DIR).length).toBe(1);
    });

    it('uses a custom `url` if specified', async () => {
      const url = 'foo.html';

      instance.url = url;
      await instance.run(context);

      expect(fs.existsSync(path.join(OUTPUT_DIR, url))).toBeTrue();
    });

    it('includes all of the globals in the generated file', async () => {
      let file;

      await instance.run(context);
      file = fs.readFileSync(path.join(OUTPUT_DIR, 'global.html'), 'utf8');

      for (const global of context.docletStore.globals) {
        expect(file).toContain(global.name);
      }
    });

    describe('title', () => {
      it('is singular when there is one global', async () => {
        let file;

        context.docletStore.stopListening();
        context.docletStore = helpers.createDocletStore([
          helpers.createDoclet([
            '@name globalConstant',
            '@longname globalConstant',
            '@const',
            '@global',
          ]),
        ]);
        await instance.run(context);
        file = fs.readFileSync(path.join(OUTPUT_DIR, 'global.html'), 'utf8');

        expect(file).toContain('<title>Global</title>');
      });

      it('is plural when there are multiple globals', async () => {
        let file;

        await instance.run(context);
        file = fs.readFileSync(path.join(OUTPUT_DIR, 'global.html'), 'utf8');

        expect(file).toContain('<title>Globals</title>');
      });

      it('includes the page title prefix if there is one', async () => {
        let file;

        context.pageTitlePrefix = 'Testing: ';
        await instance.run(context);
        file = fs.readFileSync(path.join(OUTPUT_DIR, 'global.html'), 'utf8');

        expect(file).toContain('<title>Testing: Globals</title>');
      });
    });
  });
});
