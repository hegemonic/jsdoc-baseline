'use strict';

var helpers = require('../../../helpers');

describe('symbol detail partial', function() {
    describe('labels', function() {
        xit('should show labels when the doclet has the appropriate properties', function() {
            // TODO
        });

        xit('should not show labels for classes', function() {
            // TODO
        });

        xit('should not show labels for modules', function() {
            // TODO
        });

        xit('should not show labels for namespaces', function() {
            // TODO
        });
    });

    describe('heading', function() {
        xit('should show the constructor prefix, name, and signature for constructors', function() {
            // TODO
        });

        xit('should show the name and signature for functions', function() {
            // TODO
        });

        xit('should show the name for members', function() {
            // TODO
        });

        it('should not show a heading for hidden constructors', function() {
            var fakeDoclet = {
                hideconstructor: true
            };
            var text = helpers.render('symbol-detail', {symbol: fakeDoclet});

            expect(text).not.toContain('<h');
        });
    });

    describe('source file link', function() {
        xit('should show a link when `sourceFiles.singleLink` is false', function() {
            // TODO
        });

        xit('should not show a link when `sourceFiles.singleLink` is true', function() {
            // TODO
        });

        it('should not show a link for hidden constructors', function() {
            var fakeDoclet = {
                hideconstructor: true,
                meta: {
                    filename: 'foo.js',
                    lineno: '1'
                }
            };
            var text = helpers.render('symbol-detail', {symbol: fakeDoclet});

            expect(text).not.toContain('<a');
        });
    });

    describe('description', function() {
        xit('should show the description', function() {
            // TODO
        });

        it('should not show the description for hidden constructors', function() {
            var fakeDoclet = {
                description: 'Hidden',
                hideconstructor: true
            };
            var text = helpers.render('symbol-detail', {symbol: fakeDoclet});

            expect(text).not.toContain('Hidden');
        });
    });

    describe('examples', function() {
        xit('should show the examples', function() {
            // TODO
        });

        it('should not show the examples for hidden constructors', function() {
            var fakeDoclet = {
                examples: [
                    'example'
                ],
                hideconstructor: true
            };
            var text = helpers.render('symbol-detail', {symbol: fakeDoclet});

            expect(text).not.toContain('example');
        });
    });

    describe('params', function() {
        xit('should show the params', function() {
            // TODO
        });

        it('should not show the params for hidden constructors', function() {
            var fakeDoclet = {
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
            var text = helpers.render('symbol-detail', {symbol: fakeDoclet});

            expect(text).not.toContain('foo');
        });
    });

    describe('properties', function() {
        xit('should show the properties', function() {
            // TODO
        });

        it('should not show the properties for hidden constructors', function() {
            var fakeDoclet = {
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
            var text = helpers.render('symbol-detail', {symbol: fakeDoclet});

            expect(text).not.toContain('foo');
        });
    });

    describe('details', function() {
        xit('should show the symbol details', function() {
            // TODO
        });

        it('should not show the symbol details for hidden constructors', function() {
            var fakeDoclet = {
                copyright: 'Foo',
                hideconstructor: true
            };
            var text = helpers.render('symbol-detail', {symbol: fakeDoclet});

            expect(text).not.toContain('Foo');
        });
    });
});
