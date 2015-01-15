'use strict';

describe('lib/publishjob', function() {
    var config = require('../../../lib/config');
    var instance;
    var fs = new (require('fake-fs'))();
    var PublishJob = require('../../../lib/publishjob');
    var Template = require('../../../lib/template');
    var template;

    beforeEach(function() {
        template = new Template(config.loadSync('', '.').get()).init();

        // must create the instance before patching `fs` so the template resources can be loaded
        instance = new PublishJob(template, {
            destination: '/path/to/destination'
        });

        fs.patch();
    });

    afterEach(function() {
        fs.unpatch();
    });

    it('should be a constructor', function() {
        fs.unpatch();

        expect(PublishJob).toBeFunction();
        expect(new PublishJob(template, {})).toBeInstanceOf(PublishJob);
    });

    xdescribe('copyStaticFiles', function() {
        // TODO
    });

    xdescribe('createOutputDirectory', function() {
        // TODO
    });

    xdescribe('generate', function() {
        // TODO
    });

    xdescribe('generateByLongname', function() {
        // TODO
    });

    xdescribe('generateGlobals', function() {
        // TODO
    });

    xdescribe('generateIndex', function() {
        // TODO
    });

    xdescribe('generateSourceFiles', function() {
        // TODO
    });

    xdescribe('generateTocData', function() {
        // TODO
    });

    xdescribe('generateTutorials', function() {
        // TODO
    });

    xdescribe('render', function() {
        // TODO
    });

    describe('setAllLongnamesTree', function() {
        it('should set allLongnamesTree to the specified value', function() {
            var fakeTree = {};

            instance.setAllLongnamesTree(fakeTree);

            expect(instance.allLongnamesTree).toBe(fakeTree);
        });

        it('should return the instance', function() {
            var result = instance.setAllLongnamesTree({});

            expect(result).toBe(instance);
        });
    });

    describe('setNavTree', function() {
        it('should set navTree to the specified value', function() {
            var fakeTree = {};

            instance.setNavTree(fakeTree);

            expect(instance.navTree).toBe(fakeTree);
        });

        it('should return the instance', function() {
            var result = instance.setNavTree({});

            expect(result).toBe(instance);
        });
    });

    describe('setPackage', function() {
        it('should set the package to the specified value', function() {
            var fakeDoclet = {};

            instance.setPackage(fakeDoclet);

            expect(instance.package).toBe(fakeDoclet);
        });

        it('should return the instance', function() {
            var result = instance.setPackage({});

            expect(result).toBe(instance);
        });

        it('should set the page title prefix based on the package data', function() {
            var fakeDoclet = {
                name: 'foo',
                version: '0.0.1'
            };

            instance.setPackage(fakeDoclet);

            expect(instance.pageTitlePrefix).toContain('foo 0.0.1');
        });

        it('should work when the package does not have a version', function() {
            var fakeDoclet = {
                name: 'foo'
            };

            instance.setPackage(fakeDoclet);

            expect(instance.pageTitlePrefix).toContain('foo');
        });

        it('should not throw when the argument is undefined', function() {
            function setEmptyPackage() {
                instance.setPackage();
            }

            expect(setEmptyPackage).not.toThrow();
        });
    });
});
