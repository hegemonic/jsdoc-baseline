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
const { BASE_VIEWS } = require('../../../lib/template');
const { FileSystemLoader } = require('nunjucks');
const loader = require('../../../lib/loader');
const path = require('path');

describe('lib/loader', () => {
    it('exports a ViewLoader constructor', () => {
        expect(typeof loader.ViewLoader).toBe('function');
    });

    it('exports a preprocess method', () => {
        expect(typeof loader.preprocess).toBe('function');
    });

    describe('ViewLoader', () => {
        const fakePath = path.join(path.dirname(Object.keys(helpers.baseViews)[0]), 'fake.njk');
        const fakes = {
            [fakePath]: null
        };
        let instance;
        const ViewLoader = loader.ViewLoader;

        function mockSource(str) {
            let source;

            fakes[fakePath] = str;
            mock(fakes);
            source = instance.getSource('fake.njk');
            mock.restore();

            return source;
        }

        beforeEach(() => {
            instance = new ViewLoader(BASE_VIEWS);
        });

        it('extends nunjucks.FileSystemLoader', () => {
            expect(instance instanceof FileSystemLoader).toBeTrue();
        });

        describe('emit', () => {
            it('emits nothing by default', () => {
                let source;

                instance.once('load', (name, src) => {
                    source = src;
                });
                instance.emit('load', 'foo.njk', {});

                expect(source).toBeUndefined();
            });

            it('emits events when REALLY_EMIT_KEY is passed in', () => {
                let source;

                instance.once('load', (name, src) => {
                    source = src;
                });
                instance.emit('load', 'foo.njk', { src: 'hello world' }, 'REALLY_EMIT_KEY');

                expect(source).toBeObject();
                expect(source.src).toBe('hello world');
            });

            it('does not emit REALLY_EMIT_KEY', () => {
                let key;
                let source;

                instance.once('load', (name, src, emitKey) => {
                    source = src;
                    key = emitKey;
                });
                instance.emit('load', 'foo.njk', { src: 'hello world' }, 'REALLY_EMIT_KEY');

                expect(source).toBeObject();
                expect(key).toBeUndefined();
            });
        });

        describe('getSource', () => {
            it('reads the specified file', () => {
                const fakeSource = 'hello world';
                const source = mockSource(fakeSource);

                expect(source).toBeObject();
                expect(source.src).toBeString();
                expect(source.src).toBe(fakeSource);
            });

            it('adds helpers to <h> elements with no attributes', () => {
                const fakeSource = '<h>hello world</h>';
                const source = mockSource(fakeSource);

                expect(source.src).toBe('<h{{ headingLevel() }}>hello world' +
                    '</h{{ headingLevel() }}>');
            });

            it('adds helpers to <h> elements with attributes', () => {
                const fakeSource = '<h id="hi">hello world</h>';
                const source = mockSource(fakeSource);

                expect(source.src).toBe('<h{{ headingLevel() }} id="hi">hello world' +
                    '</h{{ headingLevel() }}>');
            });

            it('adds helpers to <section> elements with no attributes', () => {
                const fakeSource = '<section><p>hello world</p></section>';
                const source = mockSource(fakeSource);

                expect(source.src).toBe('<section>{{ incrementHeading() }}<p>hello world</p>' +
                    '{{ decrementHeading() }}</section>');
            });

            it('adds helpers to <section> elements with attributes', () => {
                const fakeSource = '<section id="hi"><p>hello world</p></section>';
                const source = mockSource(fakeSource);

                expect(source.src).toBe('<section id="hi">{{ incrementHeading() }}' +
                    '<p>hello world</p>{{ decrementHeading() }}</section>');
            });
        });

        describe('preprocess', () => {
            // No need to repeat all the ViewLoader tests here. Just verify that preprocess applies the
            // same transforms as the ViewLoader.
            it('should process <h> and <section> elements', () => {
                const text = loader.preprocess('<section><h>hello world</h></section>');

                expect(text).toBe('<section>{{ incrementHeading() }}<h{{ headingLevel() }}>' +
                    'hello world</h{{ headingLevel() }}>{{ decrementHeading() }}</section>');
            });
        });
    });
});
