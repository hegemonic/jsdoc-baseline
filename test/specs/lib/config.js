'use strict';

describe('lib/config', function() {
    var config = require('../../../lib/config');
    var logger = require('jsdoc/util/logger');
    var path = require('jsdoc/path');

    var baselineConfigPath = global.env.conf.templates.baseline;
    var templatePath = global.env.opts.template;

    afterEach(function() {
        global.env.conf.templates.baseline = baselineConfigPath;
        global.env.opts.template = templatePath;

        config.reset();
    });

    it('should be an object', function() {
        expect(config).toBeObject();
    });

    it('should export a "defaultConfig" object', function() {
        expect(config.defaultConfig).toBeObject();
    });

    it('should export a "get" method', function() {
        expect(config.get).toBeFunction();
    });

    it('should export a "loadSync" method', function() {
        expect(config.loadSync).toBeFunction();
    });

    it('should export a "protectedConfig" object', function() {
        expect(config.protectedConfig).toBeObject();
    });

    it('should export a "readJsonSync" method', function() {
        expect(config.readJsonSync).toBeFunction();
    });

    it('should export a "reset" method', function() {
        expect(config.reset).toBeFunction();
    });

    it('should export a "set" method', function() {
        expect(config.set).toBeFunction();
    });

    describe('get', function() {
        it('should return the specified key', function() {
            global.env.conf.templates.baseline = path.resolve(__dirname,
                '../../fixtures/config.json');
            config.loadSync();

            expect(config.get('foo')).toBe('bar');
        });

        it('should return all config values if no key is specified', function() {
            expect(config.loadSync().get()).toBeObject();
        });
    });

    describe('loadSync', function() {
        it('should return the "config" module object', function() {
            var conf = config.loadSync();

            expect(conf).toBe(config);
        });

        it('should use the correct default paths', function() {
            global.env.conf.templates.baseline = path.resolve(__dirname,
                '../../fixtures/config.json');
            global.env.opts.template = '/foo/bar/baz';

            config.loadSync();

            expect(config.get('foo')).toBe('bar');
            expect(config.get('templatePath')).toBe('/foo/bar/baz');
        });

        it('should accept the template-config and template paths as parameters', function() {
            var baselineTemplatePath = '/foo/bar/baz';
            var confPath = path.resolve(__dirname, '../../fixtures/config.json');

            config.loadSync(confPath, baselineTemplatePath);

            expect(config.get('foo')).toBe('bar');
            expect(config.get('templatePath')).toBe('/foo/bar/baz');
        });

        it('should set default values even if the config file is missing', function() {
            spyOn(logger, 'fatal');

            global.env.conf.templates.baseline = path.resolve(__dirname, '/not/a/real/path');

            config.loadSync();

            expect(logger.fatal).toHaveBeenCalled();
            expect(Object.keys(config.get()).length).not.toBe(0);
        });

        it('should work with JSON files that contain comments', function() {
            spyOn(logger, 'fatal');

            global.env.conf.templates.baseline = path.resolve(__dirname,
                '../../fixtures/comments.json');

            config.loadSync();

            expect(logger.fatal).not.toHaveBeenCalled();
            expect(config.get('foo')).toBe('bar');
        });

        it('should get the L10N filename from the locale', function() {
            global.env.conf.templates.baseline = path.resolve(__dirname,
                '../../fixtures/config.json');

            config.loadSync();

            expect(config.get('l10nFile')).toBe('en.yaml');
        });

        it('should use the L10N filename from the config file, if specified there', function() {
            global.env.conf.templates.baseline = path.resolve(__dirname,
                '../../fixtures/config-l10nfile.json');

            config.loadSync();

            expect(config.get('l10nFile')).toBe('l10n.yaml');
        });
    });

    describe('readJsonSync', function() {
        beforeEach(function() {
            spyOn(logger, 'fatal');
        });

        it('should be able to read a JSON file with comments', function() {
            function readJson() {
                return config.readJsonSync(path.resolve(__dirname, '../../fixtures/comments.json'));
            }

            expect(readJson).not.toThrow();
            expect(readJson().foo).toBe('bar');
            expect(logger.fatal).not.toHaveBeenCalled();
        });
    });

    describe('reset', function() {
        it('should reset all config values', function() {
            config.set('a', 'b');
            config.reset();

            expect(config.get('a')).toBeUndefined();
        });
    });

    describe('set', function() {
        it('should not throw before calling "loadSync"', function() {
            function updateConfig() {
                config.set('a', 'b');
            }

            expect(updateConfig).not.toThrow();
        });

        it('should not throw after calling "loadSync"', function() {
            function updateConfig() {
                config.set('a', 'b');
            }

            config.loadSync();

            expect(updateConfig).not.toThrow();
        });

        it('should return the "config" module object', function() {
            var conf = config.set('a', 'b');

            expect(conf).toBe(config);
        });

        it('should merge values into protected arrays, rather than replacing them', function() {
            // test with an arbitrary protected config value
            var key = Object.keys(config.protectedConfig)[0];
            var value;

            config.set(key, '/foo/bar/baz');
            value = config.get(key);

            expect(value).toBeArray();
            expect(value.length).toBeGreaterThan(1);
            expect(value[0]).toBe('/foo/bar/baz');
        });

        it('should merge array values into protected arrays', function() {
            // test with an arbitrary protected config value
            var key = Object.keys(config.protectedConfig)[0];
            var value;

            config.set(key, ['/foo/bar/baz']);
            value = config.get(key);

            expect(value).toBeArray();
            expect(value.length).toBeGreaterThan(1);
            expect(value[0]).toBe('/foo/bar/baz');
        });

        it('should replace unprotected values', function() {
            // test with an arbitrary unprotected config value
            var key = Object.keys(config.defaultConfig)[0];
            var value;

            config.set(key, '/foo/bar/baz');
            value = config.get(key);

            expect(value).toBe('/foo/bar/baz');
        });
    });
});
