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

import { readdir, readFile } from 'node:fs/promises';
import path from 'node:path';

import { defaultConfig } from '../../../../lib/config.js';
import { KIND_TO_CATEGORY, OUTPUT_FILE_CATEGORIES } from '../../../../lib/enums.js';
import GenerateCoreDocs from '../../../../lib/tasks/generate-core-docs.js';

const OUTPUT_DIR = 'out';

function createTestDoclets() {
  return [
    helpers.createDoclet(['@namespace', '@name foo', '@longname foo']),
    helpers.createDoclet(['@class', '@name Bar', '@longname foo.Bar', '@memberof foo', '@static']),
    helpers.createDoclet([
      '@function',
      '@name baz',
      '@longname foo~baz',
      '@memberof foo',
      '@inner',
    ]),
  ];
}

describe('lib/tasks/generate-core-docs', () => {
  it('is a constructor', () => {
    function factory() {
      return new GenerateCoreDocs({});
    }

    expect(factory).not.toThrow();
  });

  describe('run', () => {
    let conf;
    let context;
    let doclets;
    let instance;
    let tmp;
    let tmpdir;

    beforeEach(async () => {
      doclets = createTestDoclets();
      conf = {
        opts: {
          access: ['undefined'],
        },
      };
      context = {
        config: conf,
        destination: null,
        docletStore: helpers.createDocletStore(doclets),
        needsOutputFile: (() => {
          const obj = {};

          doclets
            .filter((d) => OUTPUT_FILE_CATEGORIES.includes(KIND_TO_CATEGORY[d.kind]))
            .map((d) => d.longname)
            .forEach((longname) => {
              obj[longname] = true;
            });

          return obj;
        })(),
        pageTitlePrefix: '',
        template: await helpers.createTemplate(defaultConfig),
        templateConfig: defaultConfig,
      };
      tmpdir = await helpers.tmpdir();
      tmp = tmpdir.tmp;
      context.destination = path.join(tmp, OUTPUT_DIR);
      context.linkManager = context.template.linkManager;
      for (const doclet of doclets) {
        context.linkManager.registerDoclet(doclet);
      }
      instance = new GenerateCoreDocs({ name: 'generateCoreDocs' });
    });

    afterEach(async () => {
      context.docletStore?.stopListening();
      await tmpdir.reset();
    });

    it('emits lifecycle events', async () => {
      let success;

      instance.on('start', () => {
        success = true;
      });
      await instance.run(context);

      expect(success).toBeTrue();
    });

    it('returns a promise on success', (cb) => {
      const result = instance.run(context);

      expect(result).toBeInstanceOf(Promise);

      helpers.handlePromise(result, cb);
    });

    it('returns a promise on failure', (cb) => {
      let result;

      context.docletStore = null;
      result = instance.run(context);

      expect(result).toBeInstanceOf(Promise);

      helpers.handlePromise(result, cb);
    });

    describe('output', () => {
      it('generates output only for categories that need them', async () => {
        let files;

        await instance.run(context);
        files = (await readdir(context.destination)).sort();

        expect(files.length).toBe(2);
        expect(files[0]).toMatch(/^foo-bar/);
        expect(files[1]).toMatch(/^foo/);
        expect(files[1]).not.toMatch(/^foo-bar/);
      });

      it('does not generate output if a module has the same longname', async () => {
        const fakeMeta = {
          filename: 'baz.js',
          path: '/Users/someone',
        };
        let files;
        const longname = 'module:baz';
        const newDoclets = [
          helpers.createDoclet(['@name module:baz', '@longname module:baz', '@module'], fakeMeta),
          helpers.createDoclet(['@name module:baz', '@longname module:baz', '@class'], fakeMeta),
        ];
        const values = doclets.concat(newDoclets);

        context.docletStore.stopListening();
        context.docletStore = helpers.createDocletStore(values);
        context.needsOutputFile[longname] = true;
        context.linkManager.registerDoclet(newDoclets[0]);

        await instance.run(context);
        files = (await readdir(context.destination)).sort();

        expect(files.length).toBe(3);
        expect(files[0]).toMatch(/^foo-bar/);
        expect(files[1]).toMatch(/^foo/);
        expect(files[2]).toMatch(/^module-baz/);
      });

      it('uses the correct template', async () => {
        let file;
        let files;

        await instance.run(context);
        files = (await readdir(context.destination, 'utf8')).filter((f) => f.match(/^foo\.[^B]/));
        file = await readFile(path.join(context.destination, files[0]), 'utf8');

        expect(file).toContain('symbol-name');
      });

      it('shows the members of a longname', async () => {
        let file;
        let files;

        await instance.run(context);
        files = (await readdir(context.destination, 'utf8')).filter((f) => f.match(/^foo\.[^B]/));
        file = await readFile(path.join(context.destination, files[0]), 'utf8');

        expect(file).toContain('foo-bar');
      });

      describe('title', () => {
        it('includes the longname in the page title', async () => {
          let file;
          let files;

          await instance.run(context);
          files = (await readdir(context.destination, 'utf8')).filter((f) => f.match(/^foo\.[^B]/));
          file = await readFile(path.join(context.destination, files[0]), 'utf8');

          expect(file).toContain('<title>Namespace: foo</title>');
        });

        it('includes the page-title prefix in the page title', async () => {
          let file;
          let files;

          context.pageTitlePrefix = 'Prefix: ';
          await instance.run(context);
          files = (await readdir(context.destination, 'utf8')).filter((f) => f.match(/^foo\.[^B]/));
          file = await readFile(path.join(context.destination, files[0]), 'utf8');

          expect(file).toContain('<title>Prefix: Namespace: foo</title');
        });
      });
    });
  });
});
