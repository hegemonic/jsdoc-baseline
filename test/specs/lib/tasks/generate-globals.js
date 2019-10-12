const mock = require('mock-fs');
const config = require('../../../../lib/config');
const db = require('../../../../lib/db');
const fs = require('fs-extra');
const GenerateGlobals = require('../../../../lib/tasks/generate-globals');
const helper = require('jsdoc/util/templateHelper');
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
    ];
    let instance;
    let templateConfig;

    // TODO: Update this code when you remove this logic from `publish.js`.
    helper.registerLink('global', helper.getUniqueFilename('global'));

    beforeEach(() => {
        templateConfig = config.loadSync().get();
        conf = {
            opts: {
                access: ['undefined']
            }
        };
        context = {
            config: conf,
            destination: OUTPUT_DIR,
            globals: db({
                config: conf,
                values: globals
            }),
            pageTitlePrefix: '',
            template: new Template(templateConfig),
            templateConfig
        };
        instance = new GenerateGlobals({ name: 'generateGlobals '});

        mock();
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

    describe('run', () => {
        function findOutputFile(start) {
            const files = fs.readdirSync(OUTPUT_DIR);

            for (const file of files) {
                if (file.startsWith(start)) {
                    return file;
                }
            }

            throw new Error(`No files in ${OUTPUT_DIR} start with ${start}`);
        }

        it('generates nothing if there are no globals', async () => {
            context.globals = db({
                config: conf,
                values: []
            });

            await instance.run(context);

            expect(fs.existsSync(OUTPUT_DIR)).toBeFalse();
        });

        it('generates a single file if there are globals', async () => {
            await instance.run(context);

            expect(fs.readdirSync(OUTPUT_DIR).length).toBe(1);
        });

        it('includes all of the globals in the generated file', async () => {
            let file;

            await instance.run(context);
            file = fs.readFileSync(path.join(OUTPUT_DIR, findOutputFile('global')), 'utf8');

            for (const global of globals) {
                expect(file).toContain(global.name);
            }
        });

        describe('title', () => {
            it('is singular when there is one global', async () => {
                let file;

                context.globals = db({
                    values: [globals[0]]
                });
                await instance.run(context);
                file = fs.readFileSync(path.join(OUTPUT_DIR, findOutputFile('global')), 'utf8');

                expect(file).toContain('<title>Global</title>');
            });

            it('is plural when there are multiple globals', async () => {
                let file;

                await instance.run(context);
                file = fs.readFileSync(path.join(OUTPUT_DIR, findOutputFile('global')), 'utf8');

                expect(file).toContain('<title>Globals</title>');
            });

            it('includes the page title prefix if there is one', async () => {
                let file;

                context.pageTitlePrefix = 'Testing: ';
                await instance.run(context);
                file = fs.readFileSync(path.join(OUTPUT_DIR, findOutputFile('global')), 'utf8');

                expect(file).toContain('<title>Testing: Globals</title>');
            });
        });
    });
});
