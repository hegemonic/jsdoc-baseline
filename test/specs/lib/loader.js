'use strict';

describe('lib/loader', function() {
    var loader = require('../../../lib/loader');

    it('should export a "loadSync" method', function() {
        expect(typeof loader.loadSync).toBe('function');
    });

    it('should export a "preprocess" method', function() {
        expect(typeof loader.preprocess).toBe('function');
    });

    describe('loadSync', function() {
        var fs = new (require('fake-fs'))();

        function loadString(text) {
            fs.file('/Users/jdoe/file.txt', text);

            return loader.loadSync('/Users/jdoe/file.txt', 'utf8');
        }

        beforeEach(function() {
            fs.patch();
        });

        afterEach(function() {
            fs.unpatch();
        });

        it('should read the specified file', function() {
            var text = loadString('hello world');

            expect(text).toBe('hello world');
        });

        it('should add helpers to <h> elements with no attributes', function() {
            var text = loadString('<h>hello world</h>');

            expect(text).toBe('<h{{_headingLevel}}>hello world</h{{_headingLevel}}>');
        });

        it('should add helpers to <h> elements with attributes', function() {
            var text = loadString('<h id="foo">hello world</h>');

            expect(text).toBe('<h{{_headingLevel}} id="foo">hello world</h{{_headingLevel}}>');
        });

        it('should add helpers to <section> elements with no attributes', function() {
            var text = loadString('<section><p>hello world</p></section>');

            expect(text).toBe('<section>{{_incrementHeading}}<p>hello world</p>' +
                '{{_decrementHeading}}</section>');
        });

        it('should add helpers to <section> elements with attributes', function() {
            var text = loadString('<section id="foo"><p>hello world</p></section>');

            expect(text).toBe('<section id="foo">{{_incrementHeading}}<p>hello world</p>' +
                '{{_decrementHeading}}</section>');
        });
    });

    describe('preprocess', function() {
        // no need to repeat all the loadSync tests here; just verify that preprocess applies
        // the same transforms
        it('should process <h> and <section> elements', function() {
            var text = loader.preprocess('<section><h>hello world</h></section>');

            expect(text).toBe('<section>{{_incrementHeading}}<h{{_headingLevel}}>hello world' +
                '</h{{_headingLevel}}>{{_decrementHeading}}</section>');
        });
    });
});
