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
import { db } from '../../../../lib/db.js';
import { KIND_TO_CATEGORY, OUTPUT_FILE_CATEGORIES } from '../../../../lib/enums.js';
import GenerateCoreDocs from '../../../../lib/tasks/generate-core-docs.js';

const OUTPUT_DIR = 'out';

describe('lib/tasks/generate-core-docs', () => {
  it('is a constructor', () => {
    function factory() {
      return new GenerateCoreDocs({});
    }

    expect(factory).not.toThrow();
  });

  describe('run', () => {
    const allDoclets = [
      {
        kind: 'namespace',
        longname: 'foo',
        name: 'foo',
      },
      {
        kind: 'class',
        longname: 'foo.Bar',
        memberof: 'foo',
        name: 'Bar',
        scope: 'static',
      },
      {
        kind: 'function',
        longname: 'foo~baz',
        memberof: 'foo',
        name: 'baz',
        scope: 'inner',
      },
    ];
    let conf;
    let context;
    let doclets;
    let instance;

    beforeEach(async () => {
      doclets = allDoclets.slice();
      conf = {
        opts: {
          access: ['undefined'],
        },
      };
      context = {
        config: conf,
        destination: OUTPUT_DIR,
        doclets: db({
          config: conf,
          values: doclets,
        }),
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
      context.linkManager = context.template.linkManager;
      for (const d of allDoclets) {
        context.linkManager.registerDoclet(d);
      }
      instance = new GenerateCoreDocs({ name: 'generateCoreDocs' });

      mock(helpers.baseViews);
    });

    afterEach(() => {
      mock.restore();
    });

    it('returns a promise on success', () => {
      const result = instance.run(context);

      expect(result).toBeInstanceOf(Promise);

      result.then(
        () => null,
        () => null
      );
    });

    it('returns a promise on failure', () => {
      let result;

      context.doclets = null;
      result = instance.run(context);

      expect(result).toBeInstanceOf(Promise);

      result.then(
        () => null,
        () => null
      );
    });

    describe('output', () => {
      it('generates output only for categories that need them', async () => {
        let files;

        await instance.run(context);
        files = fs.readdirSync(OUTPUT_DIR).sort();

        expect(files.length).toBe(2);
        expect(files[0]).toMatch(/^foo-bar/);
        expect(files[1]).toMatch(/^foo/);
        expect(files[1]).not.toMatch(/^foo-bar/);
      });

      it('does not generate output if a module has the same longname', async () => {
        let files;
        const longname = 'module:baz';
        const newDoclets = [
          {
            kind: 'module',
            longname,
            name: longname,
          },
          {
            kind: 'class',
            longname,
            name: longname,
          },
        ];
        const values = doclets.concat(newDoclets);

        context.doclets = db({ values });
        context.needsOutputFile[longname] = true;
        context.linkManager.registerDoclet(newDoclets[0]);

        await instance.run(context);
        files = fs.readdirSync(OUTPUT_DIR, 'utf8').sort();

        expect(files.length).toBe(3);
        expect(files[0]).toMatch(/^foo-bar/);
        expect(files[1]).toMatch(/^foo/);
        expect(files[2]).toMatch(/^module-baz/);
      });

      it('uses the correct template', async () => {
        let file;
        let files;

        await instance.run(context);
        files = fs.readdirSync(OUTPUT_DIR, 'utf8').filter((f) => f.match(/^foo\.[^B]/));
        file = fs.readFileSync(path.join(OUTPUT_DIR, files[0]), 'utf8');

        expect(file).toContain('symbol-name');
      });

      it('shows the members of a longname', async () => {
        let file;
        let files;

        await instance.run(context);
        files = fs.readdirSync(OUTPUT_DIR, 'utf8').filter((f) => f.match(/^foo\.[^B]/));
        file = fs.readFileSync(path.join(OUTPUT_DIR, files[0]), 'utf8');

        expect(file).toContain('foo-bar');
      });

      describe('title', () => {
        it('includes the longname in the page title', async () => {
          let file;
          let files;

          await instance.run(context);
          files = fs.readdirSync(OUTPUT_DIR, 'utf8').filter((f) => f.match(/^foo\.[^B]/));
          file = fs.readFileSync(path.join(OUTPUT_DIR, files[0]), 'utf8');

          expect(file).toContain('<title>Namespace: foo</title>');
        });

        it('includes the page-title prefix in the page title', async () => {
          let file;
          let files;

          context.pageTitlePrefix = 'Prefix: ';
          await instance.run(context);
          files = fs.readdirSync(OUTPUT_DIR, 'utf8').filter((f) => f.match(/^foo\.[^B]/));
          file = fs.readFileSync(path.join(OUTPUT_DIR, files[0]), 'utf8');

          expect(file).toContain('<title>Prefix: Namespace: foo</title');
        });
      });
    });
  });
});
