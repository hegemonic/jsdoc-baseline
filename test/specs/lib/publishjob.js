describe('lib/publishjob', () => {
    const config = require('../../../lib/config');
    let instance;
    const fs = new (require('fake-fs'))();
    const PublishJob = require('../../../lib/publishjob');
    const Template = require('../../../lib/template');
    let template;

    beforeEach(() => {
        template = new Template(config.loadSync('', '.').get()).init();

        // must create the instance before patching `fs` so the template resources can be loaded
        instance = new PublishJob(template, {
            destination: '/path/to/destination'
        });

        fs.patch();
    });

    afterEach(() => {
        fs.unpatch();
    });

    it('should be a constructor', () => {
        fs.unpatch();

        expect(PublishJob).toBeFunction();
        expect(new PublishJob(template, {})).toBeInstanceOf(PublishJob);
    });

    xdescribe('copyStaticFiles', () => {
        // TODO
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

    xdescribe('generateGlobals', () => {
        // TODO
    });

    xdescribe('generateIndex', () => {
        // TODO
    });

    xdescribe('generateSourceFiles', () => {
        // TODO
    });

    xdescribe('generateTocData', () => {
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
