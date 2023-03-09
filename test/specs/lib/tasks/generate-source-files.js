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

// Prettier lazy-loads its parsers, so preload the HTML parser while we're not mocked.
import 'prettier/esm/parser-html.mjs';

import path from 'node:path';

import fs from 'fs-extra';
import _ from 'lodash';

import { defaultConfig } from '../../../../lib/config.js';
import GenerateSourceFiles from '../../../../lib/tasks/generate-source-files.js';

const mockObj = _.defaults({}, helpers.baseViews, {
  'foo.js': 'exports.foo = 1;',
  'bar.js': 'exports.bar = () => 2 < 3;',
  out: {},
});
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

    beforeEach(async () => {
      context = {
        destination: OUTPUT_DIR,
        pageTitlePrefix: '',
        sourceFiles: {
          'foo.js': 'foo.js',
          'bar.js': 'bar.js',
        },
        template: await helpers.createTemplate(defaultConfig),
        templateConfig: defaultConfig,
      };
      context.linkManager = context.template.linkManager;
      Object.keys(context.sourceFiles).forEach((sourceFile) =>
        context.linkManager.requestFilename(sourceFile)
      );

      mock(mockObj);
    });

    afterEach(() => {
      mock.restore();
    });

    it('returns a promise on success', (cb) => {
      const task = new GenerateSourceFiles({ name: 'success' });
      const result = task.run(context);

      expect(result).toBeInstanceOf(Promise);

      // Handle the resolved promise.
      result.then(
        () => cb(),
        () => cb()
      );
    });

    it('returns a promise on failure', (cb) => {
      let result;
      let task;

      context.sourceFiles = null;

      task = new GenerateSourceFiles({ name: 'failure' });
      result = task.run(context);

      expect(result).toBeInstanceOf(Promise);

      // Handle the rejected promise.
      result.then(
        () => cb(),
        () => cb()
      );
    });

    describe('output', () => {
      function findOutputFile(start) {
        const files = fs.readdirSync(OUTPUT_DIR);

        for (const file of files) {
          if (file.startsWith(start)) {
            return file;
          }
        }

        throw new Error(`No files in ${OUTPUT_DIR} start with ${start}`);
      }

      it('creates an output file for each source file', async () => {
        let fooFile;
        let fooError;
        let barFile;
        let barError;
        const task = new GenerateSourceFiles({ name: 'outputFiles' });

        await task.run(context);

        try {
          fooFile = findOutputFile('foo-js');
          fs.statSync(path.join(OUTPUT_DIR, fooFile));
        } catch (e) {
          fooError = e;
        }

        try {
          barFile = findOutputFile('bar-js');
          fs.statSync(path.join(OUTPUT_DIR, barFile));
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
          'no-such-file.js': 'no-such-file.js',
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

        fileName = findOutputFile('foo-js');
        file = fs.readFileSync(path.join(OUTPUT_DIR, fileName), 'utf8');

        expect(file).toMatch(/<code[^>]+>.*exports.*\..*foo.*<\/code>/);
      });

      it('encodes characters in the source file that are not HTML-safe', async () => {
        let file;
        let fileName;
        const task = new GenerateSourceFiles({ name: 'encodedChars' });

        await task.run(context);

        fileName = findOutputFile('bar-js');
        file = fs.readFileSync(path.join(OUTPUT_DIR, fileName), 'utf8');

        expect(file).toMatch(/2.* .*&lt;.* .*3/);
      });

      it('includes the filename in the page title', async () => {
        let file;
        let fileName;
        const task = new GenerateSourceFiles({ name: 'filenameInTitle' });

        await task.run(context);

        fileName = findOutputFile('foo-js');
        file = fs.readFileSync(path.join(OUTPUT_DIR, fileName), 'utf8');

        expect(file).toMatch(/foo.js<\/title>/);
      });

      it('includes the appropriate category in the page title', async () => {
        let file;
        let fileName;
        const task = new GenerateSourceFiles({ name: 'categoryInTitle' });

        await task.run(context);

        fileName = findOutputFile('foo-js');
        file = fs.readFileSync(path.join(OUTPUT_DIR, fileName), 'utf8');

        expect(file).toContain('<title>Source');
      });

      it('includes the page title prefix in the page title', async () => {
        let file;
        let fileName;
        const task = new GenerateSourceFiles({ name: 'prefixInTitle' });

        context.pageTitlePrefix = 'Hello';
        await task.run(context);

        fileName = findOutputFile('foo-js');
        file = fs.readFileSync(path.join(OUTPUT_DIR, fileName), 'utf8');

        expect(file).toContain('<title>Hello');
      });
    });
  });
});
