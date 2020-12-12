const config = require('../../../../lib/config');
const { db } = require('../../../../lib/db');
const SetContext = require('../../../../lib/tasks/set-context');
const Template = require('../../../../lib/template');

const TYPE_ERROR = 'TypeError';

describe('lib/tasks/set-context', () => {
    let context;
    const fakeDoclets = [
        {
            kind: 'class',
            longname: 'Foo',
            name: 'Foo'
        },
        {
            kind: 'function',
            longname: 'bar',
            name: 'bar',
            scope: 'global'
        }
    ];
    let instance;

    beforeEach(() => {
        context = {
            config: {
                opts: {
                    destination: 'out'
                }
            },
            doclets: db({ values: fakeDoclets }),
            templateConfig: config.loadSync().get()
        };
        instance = new SetContext({ name: 'setContext' });
    });

    it('is a constructor', () => {
        function factory() {
            return new SetContext();
        }

        expect(factory).not.toThrow();
    });

    it('has a `globalKinds` property', () => {
        expect(instance.globalKinds).toBeArrayOfStrings();
    });

    describe('run', () => {
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
                expect(context.linkManager.getUri(doclet.longname)).toBeString();
            }
        });

        describe('event listeners', () => {
            it('adds a `listeners` property to events that have listeners', async () => {
                const eventDoclet = {
                    kind: 'event',
                    longname: 'event:foo',
                    name: 'event:foo'
                };
                const listenerDoclet = {
                    kind: 'function',
                    listens: ['event:foo'],
                    longname: 'bar',
                    name: 'bar'
                };

                context.doclets = db({
                    values: [eventDoclet, listenerDoclet]
                });
                await instance.run(context);

                expect(eventDoclet.listeners).toEqual(['bar']);
            });
        });

        describe('longnames', () => {
            it('strips the variation, if present, from each longname', async () => {
                const doclet = {
                    kind: 'function',
                    longname: 'foo(2)',
                    name: 'foo',
                    variation: '2'
                };

                context.doclets = db({ values: [doclet] });
                await instance.run(context);

                expect(doclet.longname).toBe('foo');
            });
        });

        describe('properties', () => {
            it('sets `allLongnames` correctly', async () => {
                await instance.run(context);

                expect(context.allLongnames).toEqual([
                    'Foo',
                    'bar'
                ]);
            });

            it('sets `allLongnamesTree` correctly', async () => {
                await instance.run(context);

                expect(context.allLongnamesTree).toBeObject();
                expect(context.allLongnamesTree.Foo).toBeObject();
                expect(context.allLongnamesTree.Foo.doclet).toBeObject();
                expect(context.allLongnamesTree.bar).toBeObject();
                expect(context.allLongnamesTree.bar.doclet).toBeObject();
            });

            it('sets `destination` correctly', async () => {
                await instance.run(context);

                expect(context.destination).toBe('out');
            });

            it('sets `globals` correctly', async () => {
                const globals = fakeDoclets.filter(d => d.scope === 'global');

                await instance.run(context);

                expect(context.globals.value()).toEqual(globals);
            });

            it('sets `navTree` correctly', async () => {
                await instance.run(context);

                expect(context.navTree).toBeObject();
                expect(context.navTree.Foo).toBeObject();
            });

            it('sets `needsOutputFile` correctly', async () => {
                await instance.run(context);

                expect(context.needsOutputFile).toBeObject();
                expect(context.needsOutputFile.Foo).toBeTrue();
                expect(context.needsOutputFile.bar).toBeUndefined();
            });

            it('does not set `package` when there is no package', async () => {
                await instance.run(context);

                expect(context.package).toBeUndefined();
            });

            it('does not set `package` when the package is a placeholder', async () => {
                const packages = [
                    {
                        kind: 'package',
                        name: 'package:undefined',
                        longname: 'package:undefined'
                    }
                ];

                context.doclets = db({
                    values: fakeDoclets.concat(packages)
                });
                await instance.run(context);

                expect(context.package).toBeUndefined();
            });

            it('sets `package` correctly when there is a package', async () => {
                const packages = [
                    {
                        kind: 'package',
                        name: 'package:foo',
                        longname: 'package:foo'
                    }
                ];

                context.doclets = db({
                    values: fakeDoclets.concat(packages)
                });
                await instance.run(context);

                expect(context.package).toBe(packages[0]);
            });

            it('sets `package` to the first package when there are two packages', async () => {
                const packages = [
                    {
                        kind: 'package',
                        name: 'package:foo',
                        longname: 'package:foo'
                    },
                    {
                        kind: 'package',
                        name: 'package:bar',
                        longname: 'package:bar'
                    }
                ];

                context.doclets = db({
                    values: fakeDoclets.concat(packages)
                });
                await instance.run(context);

                expect(context.package).toBe(packages[0]);
            });

            it('sets `pageTitlePrefix` correctly when there is no package', async () => {
                await instance.run(context);

                expect(context.pageTitlePrefix).toBeEmptyString();
            });

            it('sets `pageTitlePrefix` correctly when there is a package', async () => {
                context.package = {
                    name: 'foo',
                    version: '5.6.7'
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

            it('sets `template` correctly', async () => {
                await instance.run(context);

                expect(context.template).toBeInstanceOf(Template);
            });
        });
    });
});
