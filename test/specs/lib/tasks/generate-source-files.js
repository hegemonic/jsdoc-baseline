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

import { access, readdir, readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { defaultConfig } from '../../../../lib/config.js';
import GenerateSourceFiles from '../../../../lib/tasks/generate-source-files.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const fixtureDir = path.resolve(__dirname, '../../../fixtures/tasks/generate-source-files');
const OUTPUT_DIR = 'out';

describe('lib/tasks/generate-source-files', () => {
  it('is a constructor', () => {
    function factory() {
      return new GenerateSourceFiles({});
    }

    expect(factory).not.toThrow();
  });

  describe('run', () => {
    let context;
    let tmp;
    let tmpdir;

    beforeEach(async () => {
      context = {
        destination: null,
        pageTitlePrefix: '',
        sourceFiles: {
          [path.join(fixtureDir, 'foo.js')]: 'foo.js',
          [path.join(fixtureDir, 'bar.js')]: 'bar.js',
        },
        template: await helpers.createTemplate(defaultConfig),
        templateConfig: defaultConfig,
      };
      tmpdir = await helpers.tmpdir();
      tmp = tmpdir.tmp;
      context.destination = path.join(tmp, OUTPUT_DIR);
      context.linkManager = context.template.linkManager;
      Object.values(context.sourceFiles).forEach((sourceFile) =>
        context.linkManager.requestFilename(sourceFile)
      );
    });

    afterEach(async () => {
      await tmpdir.reset();
    });

    it('returns a promise on success', (cb) => {
      const task = new GenerateSourceFiles({ name: 'success' });
      const result = task.run(context);

      expect(result).toBeInstanceOf(Promise);

      helpers.handlePromise(result, cb);
    });

    it('returns a promise on failure', (cb) => {
      let result;
      let task;

      context.sourceFiles = null;

      task = new GenerateSourceFiles({ name: 'failure' });
      result = task.run(context);

      expect(result).toBeInstanceOf(Promise);

      helpers.handlePromise(result, cb);
    });

    describe('output', () => {
      async function findOutputFile(start) {
        const files = await readdir(context.destination);

        for (const file of files) {
          if (file.startsWith(start)) {
            return file;
          }
        }

        throw new Error(`No files in ${context.destination} start with ${start}`);
      }

      it('creates an output file for each source file', async () => {
        let fooFile;
        let fooError;
        let barFile;
        let barError;
        const task = new GenerateSourceFiles({ name: 'outputFiles' });

        await task.run(context);

        try {
          fooFile = await findOutputFile('foo-js');
          await access(path.join(context.destination, fooFile));
        } catch (e) {
          fooError = e;
        }

        try {
          barFile = await findOutputFile('bar-js');
          await access(path.join(context.destination, barFile));
        } catch (e) {
          barError = e;
        }

        expect(fooError).toBeUndefined();
        expect(barError).toBeUndefined();
      });

      it('fails if a source file is missing', async () => {
        let error;
        const task = new GenerateSourceFiles({ name: 'outputFiles' });

        context.sourceFiles = {
          [path.join(fixtureDir, 'no-such-file.js')]: 'no-such-file.js',
        };
        try {
          await task.run(context);
        } catch (e) {
          error = e;
        }

        expect(error).toBeError();
      });

      it('uses the `source` view', async () => {
        let file;
        let fileName;
        const task = new GenerateSourceFiles({ name: 'sourceView' });

        await task.run(context);

        fileName = await findOutputFile('foo-js');
        file = await readFile(path.join(context.destination, fileName), 'utf8');

        expect(file).toContain('Source: foo.js');
      });

      it('encodes characters in the source file that are not HTML-safe', async () => {
        let file;
        let fileName;
        const task = new GenerateSourceFiles({ name: 'encodedChars' });

        await task.run(context);

        fileName = await findOutputFile('bar-js');
        file = await readFile(path.join(context.destination, fileName), 'utf8');

        expect(file).toMatch(/2.* .*&lt;.* .*3/);
      });

      it('includes the filename in the page title', async () => {
        let file;
        let fileName;
        const task = new GenerateSourceFiles({ name: 'filenameInTitle' });

        await task.run(context);

        fileName = await findOutputFile('foo-js');
        file = await readFile(path.join(context.destination, fileName), 'utf8');

        expect(file).toMatch(/foo.js<\/title>/);
      });

      it('includes the appropriate category in the page title', async () => {
        let file;
        let fileName;
        const task = new GenerateSourceFiles({ name: 'categoryInTitle' });

        await task.run(context);

        fileName = await findOutputFile('foo-js');
        file = await readFile(path.join(context.destination, fileName), 'utf8');

        expect(file).toContain('<title>Source');
      });

      it('includes the page title prefix in the page title', async () => {
        let file;
        let fileName;
        const task = new GenerateSourceFiles({ name: 'prefixInTitle' });

        context.pageTitlePrefix = 'Hello';
        await task.run(context);

        fileName = await findOutputFile('foo-js');
        file = await readFile(path.join(context.destination, fileName), 'utf8');

        expect(file).toContain('<title>Hello');
      });
    });
  });
});
