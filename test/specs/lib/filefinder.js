'use strict';

describe('lib/filefinder', function() {
    var fileFinder = require('../../../lib/filefinder');

    var fixturePaths = [
        'test/fixtures/filefinder/pathA',
        'test/fixtures/filefinder/pathB'
    ];

    beforeEach(function() {
        fileFinder = new fileFinder.FileFinder();
        fileFinder.loadPathsSync(fixturePaths);
    });

    afterEach(function() {
        fileFinder = new fileFinder.FileFinder();
    });

    it('should be an object', function() {
        expect(fileFinder).toBeObject();
    });

    it('should export its constructor', function() {
        expect(fileFinder.FileFinder).toBeFunction();
        expect(fileFinder).toBeInstanceOf(fileFinder.FileFinder);
    });

    it('should export a "loadPathsSync" method', function() {
        expect(fileFinder.loadPathsSync).toBeFunction();
    });

    it('should export a "readFileSync" method', function() {
        expect(fileFinder.readFileSync).toBeFunction();
    });

    it('should export a "require" method', function() {
        expect(fileFinder.require).toBeFunction();
    });

    describe('loadPathsSync', function() {
        it('should accept an array of valid paths', function() {
            function load() {
                fileFinder.loadPathsSync(fixturePaths);
            }

            expect(load).not.toThrow();
        });

        it('should throw an error if a path is invalid', function() {
            function load() {
                fileFinder.loadPathsSync(['/no/such/path/at/all']);
            }

            expect(load).toThrow();
        });
    });

    describe('readFileSync', function() {
        it('should return the first instance of the file that it finds', function() {
            function read() {
                return fileFinder.readFileSync('asset1.txt', 'utf8');
            }

            expect(read).not.toThrow();
            expect(read()).toContain('Asset 1, path A');
        });

        it('should find files that do not exist in the first directory', function() {
            function read() {
                return fileFinder.readFileSync('asset2.txt', 'utf8');
            }

            expect(read).not.toThrow();
            expect(read()).toContain('Asset 2, path B');
        });

        it('should throw an error if the file does not exist', function() {
            function read() {
                return fileFinder.readFileSync('fluffy.txt', 'utf8');
            }

            expect(read).toThrow();
        });
    });

    describe('require', function() {
        it('should return the first instance of the module that it finds', function() {
            function req() {
                return fileFinder.require('module1');
            }

            req();
            expect(req).not.toThrow();
            expect(req()).toBe('Module 1, path A');
        });

        it('should find modules that do not exist in the first directory', function() {
            function req() {
                return fileFinder.require('module2');
            }

            expect(req).not.toThrow();
            expect(req()).toBe('Module 2, path B');
        });

        it('should throw an error if the module does not exist', function() {
            function req() {
                return fileFinder.require('fluffy');
            }

            expect(req).toThrow();
        });
    });
});
