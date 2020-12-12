const mock = require('mock-fs');
const config = require('../../../../lib/config');
const { db } = require('../../../../lib/db');
const fs = require('fs-extra');
const GenerateCoreDocs = require('../../../../lib/tasks/generate-core-docs');
const { KIND_TO_CATEGORY, OUTPUT_FILE_CATEGORIES } = require('../../../../lib/enums');
const path = require('path');
const Template = require('../../../../lib/template');

const OUTPUT_DIR = 'out';

describe('lib/tasks/generate-core-docs', () => {
    it('is a constructor', () => {
        function factory() {
            return new GenerateCoreDocs({});
        }

        expect(factory).not.toThrow();
    });

    describe('run', () => {
        const allDoclets = [
            {
                kind: 'namespace',
                longname: 'foo',
                name: 'foo'
            },
            {
                kind: 'class',
                longname: 'foo.Bar',
                memberof: 'foo',
                name: 'Bar',
                scope: 'static'
            },
            {
                kind: 'function',
                longname: 'foo~baz',
                memberof: 'foo',
                name: 'baz',
                scope: 'inner'
            }
        ];
        let conf;
        let context;
        let doclets;
        let instance;
        let templateConfig;

        beforeEach(() => {
            doclets = allDoclets.slice();
            templateConfig = config.loadSync().get();
            conf = {
                opts: {
                    access: ['undefined']
                }
            };
            context = {
                config: conf,
                destination: OUTPUT_DIR,
                doclets: db({
                    config: conf,
                    values: doclets
                }),
                needsOutputFile: (() => {
                    const obj = {};

                    doclets
                        .filter(d => OUTPUT_FILE_CATEGORIES.includes(KIND_TO_CATEGORY[d.kind]))
                        .map(d => d.longname)
                        .forEach(longname => {
                            obj[longname] = true;
                        });

                    return obj;
                })(),
                pageTitlePrefix: '',
                template: new Template(templateConfig),
                templateConfig
            };
            context.linkManager = context.template.linkManager;
            for (const d of allDoclets) {
                context.linkManager.registerDoclet(d);
            }
            instance = new GenerateCoreDocs({ name: 'generateCoreDocs' });

            mock();
        });

        afterEach(() => {
            mock.restore();
        });

        it('returns a promise on success', () => {
            const result = instance.run(context);

            expect(result).toBeInstanceOf(Promise);

            result.then(() => null, () => null);
        });

        it('returns a promise on failure', () => {
            let result;

            context.doclets = null;
            result = instance.run(context);

            expect(result).toBeInstanceOf(Promise);

            result.then(() => null, () => null);
        });

        describe('output', () => {
            it('generates output only for categories that need them', async () => {
                let files;

                await instance.run(context);
                files = fs.readdirSync(OUTPUT_DIR).sort();

                expect(files.length).toBe(2);
                expect(files[0]).toMatch(/^foo-bar/);
                expect(files[1]).toMatch(/^foo/);
                expect(files[1]).not.toMatch(/^foo-bar/);
            });

            it('does not generate output if a module has the same longname', async () => {
                let files;
                const longname = 'module:baz';
                const newDoclets = [
                    {
                        kind: 'module',
                        longname,
                        name: longname
                    },
                    {
                        kind: 'class',
                        longname,
                        name: longname
                    }
                ];
                const values = doclets.concat(newDoclets);

                context.doclets = db({ values });
                context.needsOutputFile[longname] = true;
                context.linkManager.registerDoclet(newDoclets[0]);

                await instance.run(context);
                files = fs.readdirSync(OUTPUT_DIR, 'utf8').sort();

                expect(files.length).toBe(3);
                expect(files[0]).toMatch(/^foo-bar/);
                expect(files[1]).toMatch(/^foo/);
                expect(files[2]).toMatch(/^module-baz/);
            });

            it('uses the correct template', async () => {
                let file;
                let files;

                await instance.run(context);
                files = fs.readdirSync(OUTPUT_DIR, 'utf8').filter(f => f.match(/^foo\.[^B]/));
                file = fs.readFileSync(path.join(OUTPUT_DIR, files[0]), 'utf8');

                expect(file).toContain('symbol-name');
            });

            it('shows the members of a longname', async () => {
                let file;
                let files;

                await instance.run(context);
                files = fs.readdirSync(OUTPUT_DIR, 'utf8').filter(f => f.match(/^foo\.[^B]/));
                file = fs.readFileSync(path.join(OUTPUT_DIR, files[0]), 'utf8');

                expect(file).toContain('foo-bar');
            });

            describe('title', () => {
                it('includes the longname in the page title', async () => {
                    let file;
                    let files;

                    await instance.run(context);
                    files = fs.readdirSync(OUTPUT_DIR, 'utf8').filter(f => f.match(/^foo\.[^B]/));
                    file = fs.readFileSync(path.join(OUTPUT_DIR, files[0]), 'utf8');

                    expect(file).toContain('<title>Namespace: foo</title>');
                });

                it('includes the page-title prefix in the page title', async () => {
                    let file;
                    let files;

                    context.pageTitlePrefix = 'Prefix: ';
                    await instance.run(context);
                    files = fs.readdirSync(OUTPUT_DIR, 'utf8').filter(f => f.match(/^foo\.[^B]/));
                    file = fs.readFileSync(path.join(OUTPUT_DIR, files[0]), 'utf8');

                    expect(file).toContain('<title>Prefix: Namespace: foo</title');
                });
            });
        });
    });
});
