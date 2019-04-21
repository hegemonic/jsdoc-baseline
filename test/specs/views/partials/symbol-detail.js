const helpers = require('../../../helpers');

describe('symbol detail partial', () => {
    describe('labels', () => {
        xit('should show labels when the doclet has the appropriate properties', () => {
            // TODO
        });

        xit('should not show labels for classes', () => {
            // TODO
        });

        xit('should not show labels for modules', () => {
            // TODO
        });

        xit('should not show labels for namespaces', () => {
            // TODO
        });
    });

    describe('heading', () => {
        xit('should show the constructor prefix, name, and signature for constructors', () => {
            // TODO
        });

        xit('should show the name and signature for functions', () => {
            // TODO
        });

        xit('should show the name for members', () => {
            // TODO
        });

        it('should not show a heading for hidden constructors', () => {
            const fakeDoclet = {
                hideconstructor: true
            };
            const text = helpers.render('symbol-detail', {symbol: fakeDoclet});

            expect(text).not.toContain('<h');
        });
    });

    describe('source file link', () => {
        xit('should show a link when `sourceFiles.singleLink` is false', () => {
            // TODO
        });

        xit('should not show a link when `sourceFiles.singleLink` is true', () => {
            // TODO
        });

        it('should not show a link for hidden constructors', () => {
            const fakeDoclet = {
                hideconstructor: true,
                meta: {
                    filename: 'foo.js',
                    lineno: '1'
                }
            };
            const text = helpers.render('symbol-detail', {symbol: fakeDoclet});

            expect(text).not.toContain('<a');
        });
    });

    describe('description', () => {
        xit('should show the description', () => {
            // TODO
        });

        it('should not show the description for hidden constructors', () => {
            const fakeDoclet = {
                description: 'Hidden',
                hideconstructor: true
            };
            const text = helpers.render('symbol-detail', {symbol: fakeDoclet});

            expect(text).not.toContain('Hidden');
        });
    });

    describe('examples', () => {
        xit('should show the examples', () => {
            // TODO
        });

        it('should not show the examples for hidden constructors', () => {
            const fakeDoclet = {
                examples: [
                    'example'
                ],
                hideconstructor: true
            };
            const text = helpers.render('symbol-detail', {symbol: fakeDoclet});

            expect(text).not.toContain('example');
        });
    });

    describe('params', () => {
        xit('should show the params', () => {
            // TODO
        });

        it('should not show the params for hidden constructors', () => {
            const fakeDoclet = {
                hideconstructor: true,
                params: [
                    {
                        type: {
                            names: [
                                'string'
                            ]
                        },
                        description: 'Foo parameter.',
                        name: 'foo'
                    }
                ]
            };
            const text = helpers.render('symbol-detail', {symbol: fakeDoclet});

            expect(text).not.toContain('foo');
        });
    });

    describe('properties', () => {
        xit('should show the properties', () => {
            // TODO
        });

        it('should not show the properties for hidden constructors', () => {
            const fakeDoclet = {
                hideconstructor: true,
                properties: [
                    {
                        type: {
                            names: [
                                'string'
                            ]
                        },
                        description: 'Foo property.',
                        name: 'foo'
                    }
                ]
            };
            const text = helpers.render('symbol-detail', {symbol: fakeDoclet});

            expect(text).not.toContain('foo');
        });
    });

    describe('details', () => {
        xit('should show the symbol details', () => {
            // TODO
        });

        it('should not show the symbol details for hidden constructors', () => {
            const fakeDoclet = {
                copyright: 'Foo',
                hideconstructor: true
            };
            const text = helpers.render('symbol-detail', {symbol: fakeDoclet});

            expect(text).not.toContain('Foo');
        });
    });
});
