const mock = require('mock-fs');
const { db } = require('../../../../lib/db');
const { defaultConfig } = require('../../../../lib/config');
const fs = require('fs-extra');
const GenerateGlobals = require('../../../../lib/tasks/generate-globals');
const path = require('path');
const Template = require('../../../../lib/template');

const OUTPUT_DIR = 'out';

describe('lib/tasks/generate-globals', () => {
  let conf;
  let context;
  const globals = [
    {
      kind: 'constant',
      longname: 'globalConstant',
      name: 'globalConstant',
      scope: 'global',
    },
    {
      kind: 'event',
      longname: 'globalEvent',
      name: 'globalEvent',
      scope: 'global',
    },
    {
      kind: 'function',
      longname: 'globalFunction',
      name: 'globalFunction',
      scope: 'global',
    },
    {
      kind: 'member',
      longname: 'globalMember',
      name: 'globalMember',
      scope: 'global',
    },
    // TODO: Update views to do something with mixins, then uncomment this doclet.
    /*
        {
            kind: 'mixin',
            longname: 'globalMixin',
            name: 'globalMixin',
            scope: 'global'
        },
        */
    {
      kind: 'typedef',
      longname: 'globalTypedef',
      name: 'globalTypedef',
      scope: 'global',
    },
  ];
  let instance;

  beforeEach(() => {
    conf = {
      opts: {
        access: ['undefined'],
      },
    };
    context = {
      config: conf,
      destination: OUTPUT_DIR,
      globals: db({
        config: conf,
        values: globals,
      }),
      pageTitlePrefix: '',
      template: new Template(defaultConfig),
      templateConfig: defaultConfig,
    };
    context.linkManager = context.template.linkManager;
    instance = new GenerateGlobals({ name: 'generateGlobals' });

    context.linkManager.getUniqueFilename('global');

    mock(helpers.baseViews);
  });

  afterEach(() => {
    mock.restore();
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

      // Handle the resolved promise.
      result.then(
        () => cb(),
        () => cb()
      );
    });

    it('returns a promise on failure', (cb) => {
      let result;

      context.template = null;
      result = instance.run(context);

      expect(result).toBeInstanceOf(Promise);

      // Handle the rejected promise.
      result.then(
        () => cb(),
        () => cb()
      );
    });

    it('generates nothing if there are no globals', async () => {
      context.globals = db({
        config: conf,
        values: [],
      });

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

      for (const global of globals) {
        expect(file).toContain(global.name);
      }
    });

    describe('title', () => {
      it('is singular when there is one global', async () => {
        let file;

        context.globals = db({
          values: [globals[0]],
        });
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
