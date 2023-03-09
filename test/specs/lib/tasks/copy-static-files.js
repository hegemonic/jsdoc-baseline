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

import { loadConfigSync } from '../../../../lib/config.js';
import FileInfo from '../../../../lib/file-info.js';
import CopyStaticFiles from '../../../../lib/tasks/copy-static-files.js';

const OUTPUT_DIR = 'out';
const SOURCE_DIR = 'files';

describe('lib/tasks/copy-static-files', () => {
  let conf;
  let context;
  let instance;

  beforeEach(async () => {
    conf = loadConfigSync(helpers.deps);
    conf.staticFiles = [new FileInfo(SOURCE_DIR, 'foo.txt')];
    context = {
      destination: OUTPUT_DIR,
      template: await helpers.createTemplate(conf),
      templateConfig: conf,
    };
    instance = new CopyStaticFiles({ name: 'copyStaticFiles' });

    mock({
      files: {
        'foo.txt': 'foo',
        foo: {
          'bar.txt': 'bar',
          bar: {
            'baz.txt': 'baz',
          },
        },
      },
    });
  });

  afterEach(() => {
    mock.restore();
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

      expect(await fs.pathExists(OUTPUT_DIR)).toBeTrue();
    });

    it('works if the output directory already exists', async () => {
      let error;

      await fs.mkdir(OUTPUT_DIR);
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
      fooContents = fs.readFileSync(path.join(OUTPUT_DIR, 'foo.txt'), 'utf8');

      expect(fooContents).toBe('foo');
    });

    it('copies multiple files', async () => {
      let fooContents;
      let barContents;

      context.templateConfig.staticFiles = [
        new FileInfo(SOURCE_DIR, 'foo.txt'),
        new FileInfo(SOURCE_DIR, path.join('foo', 'bar.txt')),
      ];
      await instance.run(context);
      fooContents = fs.readFileSync(path.join(OUTPUT_DIR, 'foo.txt'), 'utf8');
      barContents = fs.readFileSync(path.join(OUTPUT_DIR, 'foo', 'bar.txt'), 'utf8');

      expect(fooContents).toBe('foo');
      expect(barContents).toBe('bar');
    });

    it('replicates the directory layout', async () => {
      context.templateConfig.staticFiles = [
        new FileInfo(SOURCE_DIR, 'foo.txt'),
        new FileInfo(SOURCE_DIR, path.join('foo', 'bar.txt')),
        new FileInfo(SOURCE_DIR, path.join('foo', 'bar', 'baz.txt')),
      ];

      await instance.run(context);

      expect(await fs.pathExists(path.join(OUTPUT_DIR, 'foo.txt'))).toBeTrue();
      expect(await fs.pathExists(path.join(OUTPUT_DIR, 'foo', 'bar.txt'))).toBeTrue();
      expect(await fs.pathExists(path.join(OUTPUT_DIR, 'foo', 'bar', 'baz.txt'))).toBeTrue();
    });
  });
});
