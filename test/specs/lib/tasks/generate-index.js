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
const mock = require('mock-fs');
const _ = require('lodash');
const { db } = require('../../../../lib/db');
const { defaultConfig } = require('../../../../lib/config');
const fs = require('fs-extra');
const GenerateIndex = require('../../../../lib/tasks/generate-index');
const { name } = require('@jsdoc/core');
const path = require('path');

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

  beforeEach(() => {
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
      destination: OUTPUT_DIR,
      doclets: db({ values: doclets }),
      globals: db({ values: [] }),
      pageTitlePrefix: '',
      readme: 'fixtures/readme.md',
      template: helpers.createTemplate(defaultConfig),
      templateConfig: defaultConfig,
    };
    context.linkManager = context.template.linkManager;
    indexFilename = context.linkManager.getUniqueFilename('index');
    instance = new GenerateIndex({
      name: 'generateIndex',
      url: indexFilename,
    });

    mock(
      _.defaults({}, helpers.baseViews, {
        'fixtures/readme.md': 'Hello, world!',
      })
    );
  });

  afterEach(() => {
    mock.restore();
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
    it('generates a file if there are no doclets', async () => {
      context.doclets = db({ values: [] });

      await instance.run(context);

      expect(fs.existsSync(path.join(OUTPUT_DIR, instance.url))).toBeTrue();
    });

    it('generates a file if there are doclets', async () => {
      await instance.run(context);

      expect(fs.existsSync(path.join(OUTPUT_DIR, instance.url))).toBeTrue();
    });

    it('uses a custom `url` if specified', async () => {
      const url = 'foo.html';

      instance.url = url;
      await instance.run(context);

      expect(fs.existsSync(path.join(OUTPUT_DIR, url))).toBeTrue();
    });

    it('uses the correct template', async () => {
      let file;

      await instance.run(context);
      file = fs.readFileSync(path.join(OUTPUT_DIR, instance.url), 'utf8');

      expect(file).toContain('Hello, world!');
    });

    it('includes all of the longnames in the generated file', async () => {
      let file;

      await instance.run(context);
      file = fs.readFileSync(path.join(OUTPUT_DIR, instance.url), 'utf8');

      for (const doclet of doclets) {
        expect(file).toContain(doclet.longname);
      }
    });

    describe('readme', () => {
      it('includes the README file, converted to HTML', async () => {
        let file;

        await instance.run(context);
        file = fs.readFileSync(path.join(OUTPUT_DIR, instance.url), 'utf8');

        expect(file).toContain('<p>Hello, world!</p>');
      });
    });

    describe('title', () => {
      it('includes the page title prefix if there is one', async () => {
        let file;

        context.pageTitlePrefix = 'Testing: ';
        await instance.run(context);
        file = fs.readFileSync(path.join(OUTPUT_DIR, instance.url), 'utf8');

        expect(file).toContain('<title>Testing: ');
      });
    });
  });
});
