const mock = require('mock-fs');
const config = require('../../../../lib/config');
const { db } = require('../../../../lib/db');
const fs = require('fs-extra');
const GenerateToc = require('../../../../lib/tasks/generate-toc');
const helper = require('jsdoc/util/templateHelper');
const path = require('path');
const Template = require('../../../../lib/template');

const OUTPUT_DIR = 'out';
const TYPE_ERROR = 'TypeError';

describe('lib/tasks/generate-toc', () => {
    let instance;

    beforeEach(() => {
        instance = new GenerateToc({ name: 'generateToc' });
    });

    it('is a constructor', () => {
        function factory() {
            return new GenerateToc({ name: 'generateToc' });
        }

        expect(factory).not.toThrow();
    });

    it('has a `url` property by default', () => {
        expect(instance.url).toBeString();
    });

    it('accepts new values for `url`', () => {
        instance.url = 'foo';

        expect(instance.url).toBe('foo');
    });

    it('accepts a custom `url` property', () => {
        instance = new GenerateToc({
            name: 'customUrl',
            url: 'foo'
        });

        expect(instance.url).toBe('foo');
    });

    describe('run', () => {
        let context;
        const globals = db({
            values: [
                {
                    kind: 'constant',
                    longname: 'globalConstant',
                    name: 'globalConstant',
                    scope: 'global'
                },
                {
                    kind: 'function',
                    longname: 'globalFunction',
                    name: 'globalFunction',
                    scope: 'global'
                },
                {
                    kind: 'member',
                    longname: 'globalMember',
                    name: 'globalMember',
                    scope: 'global'
                },
                {
                    kind: 'typedef',
                    longname: 'globalTypedef',
                    name: 'globalTypedef',
                    scope: 'global'
                }
            ]
        });
        const nonGlobals = [
            {
                kind: 'namespace',
                longname: 'foo',
                name: 'foo'
            },
            {
                kind: 'class',
                longname: 'foo.Bar',
                name: 'Bar'
            }
        ];
        const navTree = helper.longnamesToTree(nonGlobals.map(d => d.longname));
        const templateConfig = config.loadSync().get();
        const template = new Template(templateConfig);

        beforeEach(() => {
            context = {
                config: {
                    opts: {}
                },
                destination: OUTPUT_DIR,
                globals,
                navTree,
                template,
                templateConfig
            };

            mock();
        });

        afterEach(() => {
            mock.restore();
        });

        it('fails if the `globals` are missing', async () => {
            let error;

            context.globals = null;
            try {
                await instance.run(context);
            } catch (e) {
                error = e;
            }

            expect(error).toBeErrorOfType(TYPE_ERROR);
        });

        it('fails if the `navTree` is missing', async () => {
            let error;

            context.navTree = null;
            try {
                await instance.run(context);
            } catch (e) {
                error = e;
            }

            expect(error).toBeErrorOfType(TYPE_ERROR);
        });

        it('fails if the `template` is missing', async () => {
            let error;

            context.template = null;
            try {
                await instance.run(context);
            } catch (e) {
                error = e;
            }

            expect(error).toBeErrorOfType(TYPE_ERROR);
        });

        it('saves the output file to the default location', async () => {
            const url = instance.url;
            const outputPath = path.join(OUTPUT_DIR, url);

            await instance.run(context);

            expect(fs.existsSync(outputPath)).toBeTrue();
        });

        it('saves the output file to another location if asked', async () => {
            const url = instance.url = path.join('scripts', 'foo.js');
            const outputPath = path.join(OUTPUT_DIR, url);

            await instance.run(context);

            expect(fs.existsSync(outputPath)).toBeTrue();
        });

        it('adds everything in the `navTree` to the TOC', async () => {
            let file;
            const names = nonGlobals.map(d => d.name);
            const url = instance.url;
            const outputPath = path.join(OUTPUT_DIR, url);

            await instance.run(context);
            file = fs.readFileSync(outputPath, 'utf8');

            for (const name of names) {
                expect(file).toContain(name);
            }
        });

        it('does not include an entry for globals if there are no globals', async () => {
            let file;
            const url = instance.url;
            const outputPath = path.join(OUTPUT_DIR, url);

            context.globals = db({ values: [] });
            await instance.run(context);
            file = fs.readFileSync(outputPath, 'utf8');

            expect(file).not.toContain('global');
        });

        it('includes an entry for globals when there are globals', async () => {
            let file;
            const url = instance.url;
            const outputPath = path.join(OUTPUT_DIR, url);

            await instance.run(context);
            file = fs.readFileSync(outputPath, 'utf8');

            expect(file).toContain('global');
        });
    });
});
