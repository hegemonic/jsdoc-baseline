const mock = require('mock-fs');
const config = require('../../../../lib/config');
const db = require('../../../../lib/db');
const fs = require('fs-extra');
const GenerateIndex = require('../../../../lib/tasks/generate-index');
const helper = require('jsdoc/util/templateHelper');
const path = require('path');
const Template = require('../../../../lib/template');

const OUTPUT_DIR = 'out';

describe('lib/tasks/generate-index', () => {
    let conf;
    let context;
    const doclets = [
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
    let instance;
    let templateConfig;

    // TODO: Update this code when you remove this logic from `publish.js`.
    helper.registerLink('index', helper.getUniqueFilename('index'));

    beforeEach(() => {
        templateConfig = config.loadSync().get();
        conf = {
            opts: {
                access: ['undefined']
            }
        };
        context = {
            allLongnamesTree: helper.longnamesToTree(
                doclets.map(d => d.longname),
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
            readme: '<p>test</p>',
            template: new Template(templateConfig),
            templateConfig
        };
        instance = new GenerateIndex({ name: 'generateIndex '});

        mock();
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

            expect(file).toContain(context.readme);
        });

        it('includes all of the longnames in the generated file', async () => {
            let file;

            await instance.run(context);
            file = fs.readFileSync(path.join(OUTPUT_DIR, instance.url), 'utf8');

            for (const doclet of doclets) {
                expect(file).toContain(doclet.longname);
            }
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
