/*
    Copyright 2014-2019 Google LLC

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
describe('lib/publishjob', () => {
    const mock = require('mock-fs');
    const fs = require('fs');
    const config = require('../../../lib/config');
    let instance;
    const PublishJob = require('../../../lib/publishjob');
    const Template = require('../../../lib/template');
    let template;

    beforeEach(() => {
        template = new Template(config.loadSync('', '.').get());

        // must create the instance before patching `fs` so the template resources can be loaded
        instance = new PublishJob(template, {
            destination: '/path/to/destination'
        });

        mock();
    });

    afterEach(() => {
        mock.restore();
    });

    it('should be a constructor', () => {
        mock.restore();

        expect(PublishJob).toBeFunction();
        expect(new PublishJob(template, {})).toBeInstanceOf(PublishJob);
    });

    describe('createOutputDirectory', () => {
        it('should create the primary output directory if called with no arguments', () => {
            function stat() {
                return fs.statSync('/path/to/destination');
            }

            instance.createOutputDirectory();

            expect(stat).not.toThrow();
            expect(stat().isDirectory()).toBe(true);
        });

        it('should resolve paths relative to the primary output directory', () => {
            function stat() {
                return fs.statSync('/path/to/destination/subdir');
            }

            instance.createOutputDirectory('subdir');

            expect(stat).not.toThrow();
            expect(stat().isDirectory()).toBe(true);
        });
    });

    xdescribe('generate', () => {
        // TODO
    });

    xdescribe('generateByLongname', () => {
        // TODO
    });

    xdescribe('generateTutorials', () => {
        // TODO
    });

    xdescribe('render', () => {
        // TODO
    });

    describe('setAllLongnamesTree', () => {
        it('should set allLongnamesTree to the specified value', () => {
            const fakeTree = {};

            instance.setAllLongnamesTree(fakeTree);

            expect(instance.allLongnamesTree).toBe(fakeTree);
        });

        it('should return the instance', () => {
            const result = instance.setAllLongnamesTree({});

            expect(result).toBe(instance);
        });
    });

    describe('setNavTree', () => {
        it('should set navTree to the specified value', () => {
            const fakeTree = {};

            instance.setNavTree(fakeTree);

            expect(instance.navTree).toBe(fakeTree);
        });

        it('should return the instance', () => {
            const result = instance.setNavTree({});

            expect(result).toBe(instance);
        });
    });

    describe('setPackage', () => {
        it('should set the package to the specified value', () => {
            const fakeDoclet = {};

            instance.setPackage(fakeDoclet);

            expect(instance.package).toBe(fakeDoclet);
        });

        it('should return the instance', () => {
            const result = instance.setPackage({});

            expect(result).toBe(instance);
        });

        it('should set the page title prefix based on the package data', () => {
            const fakeDoclet = {
                name: 'foo',
                version: '0.0.1'
            };

            instance.setPackage(fakeDoclet);

            expect(instance.pageTitlePrefix).toContain('foo 0.0.1');
        });

        it('should work when the package does not have a version', () => {
            const fakeDoclet = {
                name: 'foo'
            };

            instance.setPackage(fakeDoclet);

            expect(instance.pageTitlePrefix).toContain('foo');
        });

        it('should not throw when the argument is undefined', () => {
            function setEmptyPackage() {
                instance.setPackage();
            }

            expect(setEmptyPackage).not.toThrow();
        });
    });
});
