const _ = require('lodash');
const { db, mixins } = require('../../../lib/db');
const { CATEGORY_TO_KIND } = require('../../../lib/enums');

describe('lib/db', () => {
    let config;
    const fakeDoclets = {
        access: {
            package: {
                access: 'package'
            },
            private: {
                access: 'private'
            },
            protected: {
                access: 'protected'
            },
            public: {
                access: 'public'
            },
            undefined: {
                access: undefined
            }
        },
        anonymous: {
            memberof: '<anonymous>'
        },
        kinds: {
            constant: {
                kind: 'constant'
            },
            function: {
                kind: 'function'
            },
            module: {
                kind: 'module'
            }
        },
        ignore: {
            ignore: true
        },
        sorting: {
            a: {
                longname: 'bar',
                since: '1.0.0'
            },
            b: {
                longname: 'bar',
                since: '2.0.0'
            },
            c: {
                longname: 'baz',
                since: '1.0.0'
            },
            d: {
                longname: 'baz'
            },
            e: {
                longname: 'foo',
                since: '3.0.0'
            }
        },
        undocumented: {
            undocumented: true
        }
    };

    beforeEach(() => {
        config = {
            opts: {
                access: [
                    'package',
                    'protected',
                    'public',
                    'undefined'
                ]
            }
        };
    });

    describe('db', () => {
        it('is a function', () => {
            expect(db).toBeFunction();
        });

        it('returns a `LodashWrapper`', () => {
            const wrapped = db({
                config,
                values: []
            });

            expect(wrapped).toBeInstanceOf('LodashWrapper');
        });

        it('provides the values when asked', () => {
            const values = [1, 2, 3];

            expect(db({
                config,
                values
            }).value()).toEqual(values);
        });

        it('provides Lodash functions', () => {
            const values = db({
                config,
                values: [1, 2, 3]
            }).filter(v => v < 3).value();

            expect(values).toEqual([1, 2]);
        });

        it('accepts custom mixins and passes them the correct parameters', () => {
            const extraArg = 'extraArg';
            let params;
            const customMixins = {
                testMixin: (...args) => {
                    params = args;
                }
            };
            const values = [1, 2, 3];

            db({
                config,
                mixins: customMixins,
                values
            }).testMixin(extraArg).value();

            expect(params.length).toBe(4);
            expect(params[0]).toBeFunction();
            expect(params[1]).toBe(config);
            expect(params[2]).toEqual(values);
            expect(params[3]).toBe(extraArg);
        });

        it('can categorize doclets based on their kind', () => {
            const data = _.values(fakeDoclets.kinds);
            const categorized = db({
                config,
                values: data
            }).categorize().value();
            const categories = Object.keys(categorized);

            expect(categories.length).toBe(3);
            for (const category of categories) {
                const doclets = categorized[category];

                for (const doclet of doclets) {
                    expect(CATEGORY_TO_KIND[category]).toContain(doclet.kind);
                }
            }
        });

        it('categorizes items correctly when multiple doclet kinds map to one category', () => {
            const propertyDoclet = {
                kind: 'member'
            };
            const data = _.values(fakeDoclets.kinds).concat([propertyDoclet]);
            const categorized = db({
                values: data
            }).categorize().value();

            expect(categorized.properties.length).toBe(2);
            expect(categorized.properties).toContain(fakeDoclets.kinds.constant);
            expect(categorized.properties).toContain(propertyDoclet);
        });

        it('does not prune the doclets by default', () => {
            const doclets = [
                fakeDoclets.access.private,
                fakeDoclets.anonymous,
                fakeDoclets.ignore,
                fakeDoclets.undocumented
            ];
            const values = db({
                config,
                values: doclets
            }).value();

            expect(values).toEqual(doclets);
        });

        it('prunes the doclets when asked', () => {
            const doclets = [
                fakeDoclets.access.private,
                fakeDoclets.anonymous,
                fakeDoclets.ignore,
                fakeDoclets.undocumented
            ];
            const values = db({
                config,
                values: doclets
            }).prune().value();

            expect(values).toBeEmptyArray();
        });

        it('can sort the doclets on the requested properties', () => {
            const sorting = fakeDoclets.sorting;
            const values = db({
                values: [
                    sorting.e,
                    sorting.d,
                    sorting.c,
                    sorting.b,
                    sorting.a
                ]
            }).sortOn(['longname', 'since']).value();

            expect(values).toEqual([
                sorting.a,
                sorting.b,
                sorting.c,
                sorting.d,
                sorting.e
            ]);
        });

        describe('prune', () => {
            it('is a function', () => {
                expect(db({
                    config,
                    values: [1, 2, 3]
                }).prune).toBeFunction();
            });

            it('prunes ignored doclets', () => {
                const values = db({
                    config,
                    values: [fakeDoclets.ignore]
                }).prune().value();

                expect(values).toBeEmptyArray();
            });

            it('prunes undocumented doclets', () => {
                const values = db({
                    config,
                    values: [fakeDoclets.undocumented]
                }).prune().value();

                expect(values).toBeEmptyArray();
            });

            it('prunes members of anonymous scopes', () => {
                const values = db({
                    config,
                    values: [fakeDoclets.anonymous]
                }).prune().value();

                expect(values).toBeEmptyArray();
            });

            describe('access', () => {
                const access = fakeDoclets.access;

                it('prunes `private` doclets by default', () => {
                    const values = db({
                        config,
                        values: [access.private]
                    }).prune().value();

                    expect(values).toBeEmptyArray();
                });

                it('keeps doclets with `access === undefined` by default', () => {
                    const doclets = [access.undefined];
                    const values = db({
                        values: doclets
                    }).prune().value();

                    expect(values).toEqual(doclets);
                });

                it('never prunes on `doclet.access` when `access` config includes `all`', () => {
                    const doclets = _.values(access);
                    let values;

                    config.opts.access = ['all'];
                    values = db({
                        config,
                        values: doclets
                    }).prune().value();

                    expect(values).toEqual(doclets);
                });

                it('prunes package doclets when `access` config omits `package`', () => {
                    let values;

                    config.opts.access = ['public'];
                    values = db({
                        config,
                        values: [access.package]
                    }).prune().value();

                    expect(values).toBeEmptyArray();
                });

                it('prunes protected doclets when `access` config omits `protected`', () => {
                    let values;

                    config.opts.access = ['public'];
                    values = db({
                        config,
                        values: [access.protected]
                    }).prune().value();

                    expect(values).toBeEmptyArray();
                });

                it('prunes public doclets when `access` config omits `public`', () => {
                    let values;

                    config.opts.access = ['private'];
                    values = db({
                        config,
                        values: [access.public]
                    }).prune().value();

                    expect(values).toBeEmptyArray();
                });

                it('prunes doclets with no access when `access` config omits `undefined`', () => {
                    let values;

                    config.opts.access = ['public'];
                    values = db({
                        config,
                        values: [access.undefined]
                    }).prune().value();

                    expect(values).toBeEmptyArray();
                });
            });
        });
    });

    describe('mixins', () => {
        it('has a `categorize` method', () => {
            expect(mixins.categorize).toBeFunction();
        });

        it('has a `prune` method', () => {
            expect(mixins.prune).toBeFunction();
        });

        it('has a `sortOn` method', () => {
            expect(mixins.sortOn).toBeFunction();
        });
    });
});
