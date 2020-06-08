/*
    Copyright 2014-2020 Google LLC

    Licensed under the Apache License, Version 2.0 (the "License");
    you may not use this file except in compliance with the License.
    You may obtain a copy of the License at

        https://www.apache.org/licenses/LICENSE-2.0

    Unless required by applicable law or agreed to in writing, software
    distributed under the License is distributed on an "AS IS" BASIS,
    WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
    See the License for the specific language governing permissions and
    limitations under the License.
*/
const mock = require('mock-fs');

describe('lib/loader', () => {
    const loader = require('../../../lib/loader');

    it('should export a "loadSync" method', () => {
        expect(typeof loader.loadSync).toBe('function');
    });

    it('should export a "preprocess" method', () => {
        expect(typeof loader.preprocess).toBe('function');
    });

    describe('loadSync', () => {
        function loadString(text) {
            let result;

            mock({
                '/Users/jdoe/file.txt': text
            });
            result = loader.loadSync('/Users/jdoe/file.txt', 'utf8');
            mock.restore();

            return result;
        }

        it('should read the specified file', () => {
            const text = loadString('hello world');

            expect(text).toBe('hello world');
        });

        it('should add helpers to <h> elements with no attributes', () => {
            const text = loadString('<h>hello world</h>');

            expect(text).toBe('<h{{_headingLevel}}>hello world</h{{_headingLevel}}>');
        });

        it('should add helpers to <h> elements with attributes', () => {
            const text = loadString('<h id="foo">hello world</h>');

            expect(text).toBe('<h{{_headingLevel}} id="foo">hello world</h{{_headingLevel}}>');
        });

        it('should add helpers to <section> elements with no attributes', () => {
            const text = loadString('<section><p>hello world</p></section>');

            expect(text).toBe('<section>{{_incrementHeading}}<p>hello world</p>' +
                '{{_decrementHeading}}</section>');
        });

        it('should add helpers to <section> elements with attributes', () => {
            const text = loadString('<section id="foo"><p>hello world</p></section>');

            expect(text).toBe('<section id="foo">{{_incrementHeading}}<p>hello world</p>' +
                '{{_decrementHeading}}</section>');
        });
    });

    describe('preprocess', () => {
        // no need to repeat all the loadSync tests here; just verify that preprocess applies
        // the same transforms
        it('should process <h> and <section> elements', () => {
            const text = loader.preprocess('<section><h>hello world</h></section>');

            expect(text).toBe('<section>{{_incrementHeading}}<h{{_headingLevel}}>hello world' +
                '</h{{_headingLevel}}>{{_decrementHeading}}</section>');
        });
    });
});
