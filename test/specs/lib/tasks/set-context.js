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

import { loadConfigSync } from '../../../../lib/config.js';
import SetContext from '../../../../lib/tasks/set-context.js';
import Template from '../../../../lib/template.js';

const TYPE_ERROR = 'TypeError';

describe('lib/tasks/set-context', () => {
  let context;
  const fakeDoclets = [
    helpers.createDoclet(['@name Foo', '@longname Foo', '@class'], {
      filename: '/Users/someone/lib/foo.js',
      lineno: 1,
    }),
    helpers.createDoclet(['@name bar', '@longname bar', '@function', '@global'], {
      filename: '/Users/someone/bar.js',
      lineno: 1,
    }),
  ];
  let instance;

  beforeEach(() => {
    context = {
      config: {
        opts: {
          destination: 'out',
        },
      },
      env: helpers.env,
      docletStore: helpers.createDocletStore(fakeDoclets),
      templateConfig: loadConfigSync(helpers.env),
    };
    instance = new SetContext({ name: 'setContext' });
  });

  afterEach(() => {
    context.docletStore.stopListening();
  });

  it('is a constructor', () => {
    function factory() {
      return new SetContext();
    }

    expect(factory).not.toThrow();
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

    it('fails if the context is missing', async () => {
      let error;

      try {
        await instance.run();
      } catch (e) {
        error = e;
      }

      expect(error).toBeErrorOfType(TYPE_ERROR);
    });

    it('fails if the config is missing from the context', async () => {
      let error;

      context.config = null;
      try {
        await instance.run(context);
      } catch (e) {
        error = e;
      }

      expect(error).toBeErrorOfType(TYPE_ERROR);
    });

    it('fails if the template config is missing from the context', async () => {
      let error;

      context.templateConfig = null;
      try {
        await instance.run(context);
      } catch (e) {
        error = e;
      }

      expect(error).toBeErrorOfType(TYPE_ERROR);
    });

    it('registers a link for each doclet', async () => {
      await instance.run(context);

      for (const doclet of fakeDoclets) {
        expect(context.linkManager.getUrl(doclet.longname)).toBeString();
      }
    });

    describe('event listeners', () => {
      it('adds a `listeners` property to events that have listeners', async () => {
        const eventDoclet = helpers.createDoclet([
          '@name event:foo',
          '@longname event:foo',
          '@event',
        ]);
        const listenerDoclet = helpers.createDoclet([
          '@name Bar',
          '@longname Bar',
          '@class',
          '@listens event:foo',
        ]);

        context.docletStore.stopListening();
        context.docletStore = helpers.createDocletStore([eventDoclet, listenerDoclet]);
        await instance.run(context);

        expect(eventDoclet.listeners).toEqual(['Bar']);
      });
    });

    describe('longnames', () => {
      it('strips the variation, if present, from each longname', async () => {
        const doclet = helpers.createDoclet([
          '@name foo',
          '@longname foo(2)',
          '@function',
          '@variation 2',
        ]);

        context.docletStore.stopListening();
        context.docletStore = helpers.createDocletStore([doclet]);
        await instance.run(context);

        expect(doclet.longname).toBe('foo');
      });
    });

    describe('properties', () => {
      it('sets `allLongnamesTree` correctly', async () => {
        await instance.run(context);

        expect(context.allLongnamesTree).toBeObject();
        expect(context.allLongnamesTree.Foo).toBeObject();
        expect(context.allLongnamesTree.Foo.doclet).toBe(
          fakeDoclets.filter((d) => d.longname === 'Foo')[0]
        );
        expect(context.allLongnamesTree.bar).toBeObject();
        expect(context.allLongnamesTree.bar.doclet).toBe(
          fakeDoclets.filter((d) => d.longname === 'bar')[0]
        );
      });

      it('sets `destination` correctly', async () => {
        await instance.run(context);

        expect(context.destination).toBe('out');
      });

      it('sets `needsOutputFile` correctly', async () => {
        await instance.run(context);

        expect(context.needsOutputFile).toBeObject();
        expect(context.needsOutputFile.Foo).toBeTruthy();
        expect(context.needsOutputFile.bar).toBeUndefined();
      });

      it('does not set `package` when there is no package', async () => {
        await instance.run(context);

        expect(context.package).toBeUndefined();
      });

      it('does not set `package` when the package is a placeholder', async () => {
        const fakePackage = helpers.createPackage();

        context.docletStore.stopListening();
        context.docletStore = helpers.createDocletStore([...fakeDoclets, fakePackage]);
        await instance.run(context);

        expect(context.package).toBeUndefined();
      });

      it('sets `package` correctly when there is a package', async () => {
        const fakePackage = helpers.createPackage({ name: 'foo' });

        context.docletStore.stopListening();
        context.docletStore = helpers.createDocletStore([...fakeDoclets, fakePackage]);
        await instance.run(context);

        expect(context.package).toBe(fakePackage);
      });

      it('sets `package` to the first package when there are two packages', async () => {
        const fakePackages = [
          helpers.createPackage({ name: 'foo' }),
          helpers.createPackage({ name: 'bar' }),
        ];

        context.docletStore.stopListening();
        context.docletStore = helpers.createDocletStore(fakeDoclets.concat(fakePackages));
        await instance.run(context);

        expect(context.package).toBe(fakePackages[0]);
      });

      it('sets `pageTitlePrefix` correctly when there is no package', async () => {
        await instance.run(context);

        expect(context.pageTitlePrefix).toBeEmptyString();
      });

      it('sets `pageTitlePrefix` correctly when there is a package', async () => {
        context.package = {
          name: 'foo',
          version: '5.6.7',
        };
        await instance.run(context);

        expect(context.pageTitlePrefix).toMatch(/^foo 5\.6\.7/);
      });

      it('sets `readme` correctly', async () => {
        const filepath = '/foo/bar/README.md';

        context.config.opts.readme = filepath;
        await instance.run(context);

        expect(context.readme).toBe(filepath);
      });

      it('sets `sourceFiles` correctly when there is one source file', async () => {
        context.docletStore.stopListening();
        context.docletStore = helpers.createDocletStore(fakeDoclets.slice(0, 1));

        await instance.run(context);

        expect(context.sourceFiles).toEqual({
          '/Users/someone/lib/foo.js': 'foo.js',
        });
      });

      it('sets `sourceFiles` correctly when there are multiple source files', async () => {
        await instance.run(context);

        expect(context.sourceFiles).toEqual({
          '/Users/someone/lib/foo.js': 'lib/foo.js',
          '/Users/someone/bar.js': 'bar.js',
        });
      });

      it('sets `template` correctly', async () => {
        await instance.run(context);

        expect(context.template).toBeInstanceOf(Template);
      });
    });
  });
});
