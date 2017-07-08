'use strict';

describe('lib/filefinder', function() {
    var fileFinder = require('../../../lib/filefinder');
    var finder;
    var path = require('jsdoc/path');

    var fixturePaths = [
        'test/fixtures/filefinder/pathA',
        'test/fixtures/filefinder/pathB'
    ];

    beforeEach(function() {
        finder = fileFinder.get('default', fixturePaths, {
            forceUpdate: true
        });
    });

    afterEach(function() {
        finder = fileFinder.get('default', [], {
            forceUpdate: true
        });
    });

    it('should be an object', function() {
        expect(fileFinder).toBeObject();
    });

    it('should export its constructor', function() {
        expect(fileFinder.FileFinder).toBeFunction();
    });

    it('should export a "get" method', function() {
        expect(fileFinder.get).toBeFunction();
    });

    describe('get', function() {
        it('should return the current default finder if no arguments are provided', function() {
            var defaultFinder = fileFinder.get('default');
            var noArgsFinder = fileFinder.get();

            expect(noArgsFinder).toBe(defaultFinder);
        });

        it('should accept an array of valid paths', function() {
            function load() {
                fileFinder.get('default', fixturePaths);
            }

            expect(load).not.toThrow();
        });

        it('should throw an error if a path is invalid', function() {
            function load() {
                fileFinder.get('default', ['/no/such/path/at/all']);
            }

            expect(load).toThrow();
        });

        it('should not recreate the finder if the same array is passed in', function() {
            var fileArray = [];
            var defaultFinder = fileFinder.get('default', fileArray);
            var currentFinder = fileFinder.get('default', fileArray);

            expect(currentFinder).toBe(defaultFinder);
        });

        it('should not recreate the finder if two functionally identical arrays are passed in',
            function() {
                var arrayA = [fixturePaths[0]];
                var arrayB = [fixturePaths[0]];
                var defaultFinder = fileFinder.get('default', arrayA);
                var currentFinder = fileFinder.get('default', arrayB);

                expect(currentFinder).toBe(defaultFinder);
            });

        it('should recreate the finder if an array of a different length is provided', function() {
            var defaultFinder = fileFinder.get('default', [fixturePaths[0]]);
            var currentFinder = fileFinder.get('default', fixturePaths);

            expect(currentFinder).not.toBe(defaultFinder);
        });

        it('should recreate the finder if an array of the same length, with different contents, ' +
            'is passed in', function() {
            var defaultFinder = fileFinder.get('default', fixturePaths);
            var currentFinder = fileFinder.get('default', fixturePaths.slice(0).reverse());

            expect(currentFinder).not.toBe(defaultFinder);
        });

        it('should not retrieve a fake finder from higher up the prototype chain', function() {
            expect(fileFinder.get('constructor')).not.toBe({}.constructor);
        });
    });

    describe('FileFinder', function() {
        // mostly covered by tests for other functions
        describe('findAllFilesSync', function() {
            it('should return an array with all occurrences of a file', function() {
                var files = finder.findAllFilesSync('./asset1.txt');

                expect(files).toBeArray();
                expect(files.length).toBe(2);
                expect(files[0]).not.toBe(files[1]);
            });

            it('should throw an error if the file is not found', function() {
                function findFakeFile() {
                    return finder.findAllFilesSync(path.resolve(__dirname, './fake'));
                }

                expect(findFakeFile).toThrow();
            });
        });

        // mostly covered by tests for other functions
        describe('findFileSync', function() {
            it('should throw an error if the file is not found', function() {
                function findFakeFile() {
                    return finder.findFileSync(path.resolve(__dirname, './fake'));
                }

                expect(findFakeFile).toThrow();
            });
        });

        describe('readFileSync', function() {
            it('should return the first instance of the file that it finds', function() {
                function read() {
                    return finder.readFileSync('asset1.txt', 'utf8');
                }

                expect(read).not.toThrow();
                expect(read()).toContain('Asset 1, path A');
            });

            it('should find files that do not exist in the first directory', function() {
                function read() {
                    return finder.readFileSync('asset2.txt', 'utf8');
                }

                expect(read).not.toThrow();
                expect(read()).toContain('Asset 2, path B');
            });

            it('should throw an error if the file does not exist', function() {
                function read() {
                    return finder.readFileSync('fluffy.txt', 'utf8');
                }

                expect(read).toThrow();
            });
        });

        describe('require', function() {
            it('should return the first instance of the module that it finds', function() {
                function req() {
                    return finder.require('./module1');
                }

                expect(req).not.toThrow();
                expect(req()).toBe('Module 1, path A');
            });

            it('should find modules that do not exist in the first directory', function() {
                function req() {
                    return finder.require('./module2');
                }

                expect(req).not.toThrow();
                expect(req()).toBe('Module 2, path B');
            });

            it('should throw an error if the module does not exist', function() {
                function req() {
                    return finder.require('./fluffy');
                }

                expect(req).toThrow();
            });
        });
    });
});
