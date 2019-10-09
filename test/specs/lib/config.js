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
describe('lib/config', () => {
    const config = require('../../../lib/config');
    const env = require('jsdoc/env');
    const logger = require('jsdoc/util/logger');
    const path = require('jsdoc/path');

    const baselineConfigPath = env.conf.templates.baseline;
    const templatePath = env.opts.template;

    afterEach(() => {
        env.conf.templates.baseline = baselineConfigPath;
        env.opts.template = templatePath;

        config.reset();
    });

    it('should be an object', () => {
        expect(config).toBeObject();
    });

    it('should export a "defaultConfig" object', () => {
        expect(config.defaultConfig).toBeObject();
    });

    it('should export a "get" method', () => {
        expect(config.get).toBeFunction();
    });

    it('should export a "loadSync" method', () => {
        expect(config.loadSync).toBeFunction();
    });

    it('should export a "readJsonSync" method', () => {
        expect(config.readJsonSync).toBeFunction();
    });

    it('should export a "reset" method', () => {
        expect(config.reset).toBeFunction();
    });

    it('should export a "set" method', () => {
        expect(config.set).toBeFunction();
    });

    describe('get', () => {
        it('should return the specified key', () => {
            env.conf.templates.baseline = path.resolve(__dirname,
                '../../fixtures/config.json');
            config.loadSync();

            expect(config.get('foo')).toBe('bar');
        });

        it('should return all config values if no key is specified', () => {
            expect(config.loadSync().get()).toBeObject();
        });
    });

    describe('loadSync', () => {
        it('should return the "config" module object', () => {
            const conf = config.loadSync();

            expect(conf).toBe(config);
        });

        it('should work if the config object is embedded in the JSDoc config file', () => {
            env.conf.templates.baseline = {
                beautify: !config.defaultConfig.beautify
            };
            config.loadSync();

            expect(config.get('beautify')).toBe(!config.defaultConfig.beautify);
        });

        it('should use the correct default paths', () => {
            env.conf.templates.baseline = path.resolve(__dirname,
                '../../fixtures/config.json');
            env.opts.template = '/foo/bar/baz';

            config.loadSync();

            expect(config.get('foo')).toBe('bar');
            expect(config.get('templatePath')).toBe('/foo/bar/baz');
        });

        it('should accept the template-config and template paths as parameters', () => {
            const baselineTemplatePath = '/foo/bar/baz';
            const confPath = path.resolve(__dirname, '../../fixtures/config.json');

            config.loadSync(confPath, baselineTemplatePath);

            expect(config.get('foo')).toBe('bar');
            expect(config.get('templatePath')).toBe('/foo/bar/baz');
        });

        it('should set default values even if the config file is missing', () => {
            spyOn(logger, 'fatal');

            env.conf.templates.baseline = path.resolve(__dirname, '/not/a/real/path');

            config.loadSync();

            expect(logger.fatal).toHaveBeenCalled();
            expect(Object.keys(config.get()).length).not.toBe(0);
        });

        it('should work with JSON files that contain comments', () => {
            spyOn(logger, 'fatal');

            env.conf.templates.baseline = path.resolve(__dirname,
                '../../fixtures/comments.json');

            config.loadSync();

            expect(logger.fatal).not.toHaveBeenCalled();
            expect(config.get('foo')).toBe('bar');
        });

        it('should get the L10N filename from the locale', () => {
            env.conf.templates.baseline = path.resolve(__dirname,
                '../../fixtures/config.json');

            config.loadSync();

            expect(config.get('l10nFile')).toBe('en.yaml');
        });

        it('should use the L10N filename from the config file, if specified there', () => {
            env.conf.templates.baseline = path.resolve(__dirname,
                '../../fixtures/config-l10nfile.json');

            config.loadSync();

            expect(config.get('l10nFile')).toBe('l10n.yaml');
        });
    });

    describe('readJsonSync', () => {
        beforeEach(() => {
            spyOn(logger, 'fatal');
        });

        it('should be able to read a JSON file with comments', () => {
            function readJson() {
                return config.readJsonSync(path.resolve(__dirname, '../../fixtures/comments.json'));
            }

            expect(readJson).not.toThrow();
            expect(readJson().foo).toBe('bar');
            expect(logger.fatal).not.toHaveBeenCalled();
        });

        it('should log a fatal error if there is an exception', () => {
            function readJson() {
                return config.readJsonSync(path.resolve(__dirname, 'no-such-file.json'));
            }

            expect(readJson).not.toThrow();
            expect(logger.fatal).toHaveBeenCalled();
        });

        it('should return nothing if no path is specified', () => {
            const result = config.readJsonSync();

            expect(result).toBeUndefined();
        });
    });

    describe('reset', () => {
        it('should reset all config values', () => {
            config.set('a', 'b');
            config.reset();

            expect(config.get('a')).toBeUndefined();
        });
    });

    describe('set', () => {
        it('should not throw before calling "loadSync"', () => {
            function updateConfig() {
                config.set('a', 'b');
            }

            expect(updateConfig).not.toThrow();
        });

        it('should not throw after calling "loadSync"', () => {
            function updateConfig() {
                config.set('a', 'b');
            }

            config.loadSync();

            expect(updateConfig).not.toThrow();
        });

        it('should return the "config" module object', () => {
            const conf = config.set('a', 'b');

            expect(conf).toBe(config);
        });
    });
});
