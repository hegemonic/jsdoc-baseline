const config = require('../../../../lib/config');
const { db } = require('../../../../lib/db');
const helper = require('jsdoc/util/templateHelper');
const SetContext = require('../../../../lib/tasks/set-context');
const Template = require('../../../../lib/template');

const TYPE_ERROR = 'TypeError';

describe('lib/tasks/set-context', () => {
    let context;
    const fakeDoclets = db({
        values: [
            {
                kind: 'class',
                longname: 'Foo'
            },
            {
                kind: 'function',
                longname: 'bar',
                scope: 'global'
            }
        ]
    });
    let instance;

    beforeEach(() => {
        context = {
            config: {
                opts: {
                    destination: 'out'
                }
            },
            doclets: fakeDoclets,
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

            for (const doclet of fakeDoclets.value()) {
                expect(helper.longnameToUrl[doclet.longname]).toBeString();
            }
        });

        describe('properties', () => {
            it('sets `allLongnames` correctly', async () => {
                await instance.run(context);

                expect(context.allLongnames).toEqual([
                    'Foo',
                    'bar'
                ]);
            });

            it('sets `destination` correctly', async () => {
                await instance.run(context);

                expect(context.destination).toBe('out');
            });

            it('sets `globals` correctly', async () => {
                const globals = fakeDoclets.filter(d => d.scope === 'global').value();

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

            it('sets `template` correctly', async () => {
                await instance.run(context);

                expect(context.template).toBeInstanceOf(Template);
            });
        });
    });
});
