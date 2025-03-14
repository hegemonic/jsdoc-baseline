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

import * as name from '@jsdoc/name';

import { defaultConfig } from '../../../../lib/config.js';
import GenerateIndex from '../../../../lib/tasks/generate-index.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const OUTPUT_DIR = 'out';

describe('lib/tasks/generate-index', () => {
  let conf;
  let context;
  const doclets = [
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
  let indexFilename;
  let instance;
  let tmp;
  let tmpdir;

  beforeEach(async () => {
    conf = {
      opts: {
        access: ['undefined'],
      },
    };
    context = {
      allLongnamesTree: name.longnamesToTree(
        doclets.map((d) => d.longname),
        doclets.reduce((obj, d) => {
          obj[d.longname] = d;

          return obj;
        }, {})
      ),
      config: conf,
      destination: null,
      pageTitlePrefix: '',
      readme: path.resolve(__dirname, '../../../fixtures/tasks/generate-index/readme.md'),
      template: await helpers.createTemplate(defaultConfig),
      templateConfig: defaultConfig,
    };
    tmpdir = await helpers.tmpdir();
    tmp = tmpdir.tmp;
    context.destination = path.join(tmp, OUTPUT_DIR);
    context.linkManager = context.template.linkManager;
    indexFilename = context.linkManager.getUniqueFilename('index');
    instance = new GenerateIndex({
      name: 'generateIndex',
      url: indexFilename,
    });
  });

  afterEach(async () => {
    await tmpdir.reset();
  });

  it('is a constructor', () => {
    function factory() {
      return new GenerateIndex({});
    }

    expect(factory).not.toThrow();
  });

  it('accepts a `url` property', () => {
    const url = 'foo.html';

    instance = new GenerateIndex({ url });

    expect(instance.url).toBe(url);
  });

  describe('run', () => {
    it('emits lifecycle events', async () => {
      let success;

      instance.on('start', () => {
        success = true;
      });
      await instance.run(context);

      expect(success).toBeTrue();
    });

    it('generates a file', async () => {
      await instance.run(context);

      expect(async () => await access(path.join(context.destination, instance.url))).not.toThrow();
    });

    it('uses a custom `url` if specified', async () => {
      const url = 'foo.html';

      instance.url = url;
      await instance.run(context);

      expect(async () => await access(path.join(context.destination, url))).not.toThrow();
    });

    it('uses the correct template', async () => {
      let file;

      await instance.run(context);
      file = await readFile(path.join(context.destination, instance.url), 'utf8');

      expect(file).toContain('Hello, world!');
    });

    it('includes all of the longnames in the generated file', async () => {
      let file;

      await instance.run(context);
      file = await readFile(path.join(context.destination, instance.url), 'utf8');

      for (const doclet of doclets) {
        expect(file).toContain(doclet.longname);
      }
    });

    describe('readme', () => {
      it('includes the README file, converted to HTML', async () => {
        let file;

        await instance.run(context);
        file = await readFile(path.join(context.destination, instance.url), 'utf8');

        expect(file).toContain('<p>Hello, world!</p>');
      });
    });

    describe('title', () => {
      it('includes the page title prefix if there is one', async () => {
        let file;

        context.pageTitlePrefix = 'Testing: ';
        await instance.run(context);
        file = await readFile(path.join(context.destination, instance.url), 'utf8');

        expect(file).toContain('<title>Testing: ');
      });
    });
  });
});
