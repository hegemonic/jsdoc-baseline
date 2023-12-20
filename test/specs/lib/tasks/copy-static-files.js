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

import { access, readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import ensureDir from 'make-dir';

import { loadConfigSync } from '../../../../lib/config.js';
import FileInfo from '../../../../lib/file-info.js';
import CopyStaticFiles from '../../../../lib/tasks/copy-static-files.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const OUTPUT_DIR = 'out';
const SOURCE_DIR = path.resolve(__dirname, '../../../fixtures/tasks/copy-static-files');

describe('lib/tasks/copy-static-files', () => {
  let conf;
  let context;
  let instance;
  let tmp;
  let tmpdir;

  beforeEach(async () => {
    conf = loadConfigSync(helpers.deps);
    conf.staticFiles = [new FileInfo(SOURCE_DIR, 'foo.txt')];
    context = {
      destination: null,
      template: await helpers.createTemplate(conf),
      templateConfig: conf,
    };
    instance = new CopyStaticFiles({ name: 'copyStaticFiles' });
    tmpdir = await helpers.tmpdir();
    tmp = tmpdir.tmp;
    context.destination = path.join(tmp, OUTPUT_DIR);
  });

  afterEach(async () => {
    await tmpdir.reset();
  });

  it('is a constructor', () => {
    expect(() => new CopyStaticFiles({ name: 'test' })).not.toThrow();
  });

  describe('run', () => {
    it('returns a promise on success', (cb) => {
      const result = instance.run(context);

      expect(result).toBeInstanceOf(Promise);

      helpers.handlePromise(result, cb);
    });

    it('returns a promise on error', (cb) => {
      const result = instance.run();

      expect(result).toBeInstanceOf(Promise);

      helpers.handlePromise(result, cb);
    });

    it('creates the output directory if necessary', async () => {
      await instance.run(context);

      expect(async () => await access(context.destination)).not.toThrow();
    });

    it('works if the output directory already exists', async () => {
      let error;

      await ensureDir(context.destination);
      try {
        await instance.run(context);
      } catch (e) {
        error = e;
      }

      expect(error).toBeUndefined();
    });

    it('copies one file', async () => {
      let fooContents;

      await instance.run(context);
      fooContents = await readFile(path.join(context.destination, 'foo.txt'), 'utf8');

      expect(fooContents).toContain('foo');
    });

    it('copies multiple files', async () => {
      let fooContents;
      let barContents;

      context.templateConfig.staticFiles = [
        new FileInfo(SOURCE_DIR, 'foo.txt'),
        new FileInfo(SOURCE_DIR, 'foo/bar.txt'),
      ];
      await instance.run(context);

      fooContents = await readFile(path.join(context.destination, 'foo.txt'), 'utf8');
      barContents = await readFile(path.join(context.destination, 'foo/bar.txt'), 'utf8');

      expect(fooContents).toContain('foo');
      expect(barContents).toContain('bar');
    });

    it('replicates the directory layout', async () => {
      let promises;

      context.templateConfig.staticFiles = [
        new FileInfo(SOURCE_DIR, 'foo.txt'),
        new FileInfo(SOURCE_DIR, 'foo/bar.txt'),
        new FileInfo(SOURCE_DIR, 'foo/bar/baz.txt'),
      ];

      await instance.run(context);

      promises = [
        access(path.join(context.destination, 'foo.txt')),
        access(path.join(context.destination, 'foo/bar.txt')),
        access(path.join(context.destination, 'foo/bar/baz.txt')),
      ];

      return Promise.all(promises);
    });
  });
});
