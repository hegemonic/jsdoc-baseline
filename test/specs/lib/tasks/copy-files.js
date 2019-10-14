const mock = require('mock-fs');
const CopyFiles = require('../../../../lib/tasks/copy-files');
const FileInfo = require('../../../../lib/file-info');
const fs = require('fs-extra');
const path = require('path');

const ARGUMENT_ERROR = 'ArgumentError';
const TYPE_ERROR = 'TypeError';

const mockDest = path.join('Users', 'jdoe', 'testdir', 'out');
const mockSource = path.join('Users', 'jdoe', 'testdir', 'files');

describe('lib/tasks/copy-files', () => {
    beforeEach(() => {
        mock({
            Users: {
                jdoe: {
                    testdir: {
                        files: {
                            'foo.txt': 'foo',
                            foo: {
                                'bar.txt': 'bar',
                                bar: {
                                    'baz.txt': 'baz'
                                }
                            }
                        }
                    }
                }
            }
        });
    });

    afterEach(() => {
        mock.restore();
    });

    it('is a constructor', () => {
        expect(() => new CopyFiles({ name: 'test' })).not.toThrow();
    });

    it('accepts a `destination`', () => {
        const task = new CopyFiles({
            name: 'hasDestination',
            destination: mockDest
        });

        expect(task.destination).toBe(mockDest);
    });

    it('does not immediately fail on an invalid `destination`', () => {
        function factory() {
            return new CopyFiles({
                name: 'badDestination',
                destination: 7
            });
        }

        expect(factory).not.toThrow();
    });

    it('accepts `sourceFiles`', () => {
        const sourceFiles = [
            new FileInfo(mockSource, 'foo.txt')
        ];
        const task = new CopyFiles({
            name: 'hasSourceFiles',
            sourceFiles
        });

        expect(task.sourceFiles).toBe(sourceFiles);
    });

    it('does not immediately fail on invalid `sourceFiles`', () => {
        function factory() {
            return new CopyFiles({
                name: 'badSourceFiles',
                sourceFiles: true
            });
        }

        expect(factory).not.toThrow();
    });

    describe('run', () => {
        it('returns a promise on success', cb => {
            const task = new CopyFiles({
                name: 'copyFiles',
                destination: mockDest,
                sourceFiles: [
                    new FileInfo(mockSource, 'foo.txt')
                ]
            });
            const result = task.run();

            expect(result).toBeInstanceOf(Promise);

            // Handle the fulfilled promise.
            result.then(() => cb(), () => cb());
        });

        it('returns a promise on error', cb => {
            const task = new CopyFiles({
                name: 'badCopyFiles'
            });
            const result = task.run();

            expect(result).toBeInstanceOf(Promise);

            // Handle the rejected promise.
            result.then(() => cb(), () => cb());
        });

        it('validates the `destination` property', async () => {
            let error;
            const task = new CopyFiles({
                name: 'badDestination',
                destination: true,
                sourceFiles: [
                    new FileInfo(mockSource, 'foo.txt')
                ]
            });

            try {
                await task.run();
            } catch (e) {
                error = e;
            }

            expect(error).toBeErrorOfType(ARGUMENT_ERROR);
        });

        it('validates the `sourceFiles` property', async () => {
            let error;
            const task = new CopyFiles({
                name: 'badSourceFiles',
                destination: mockDest,
                sourceFiles: [
                    7
                ]
            });

            try {
                await task.run();
            } catch (e) {
                error = e;
            }

            expect(error).toBeErrorOfType(ARGUMENT_ERROR);
        });

        it('fails if you do not provide the destination in any way', async () => {
            let error;
            const task = new CopyFiles({
                name: 'noDestination',
                sourceFiles: [
                    new FileInfo(mockSource, 'foo.txt')
                ]
            });

            try {
                await task.run({
                    config: null
                });
            } catch (e) {
                error = e;
            }

            expect(error).toBeErrorOfType(TYPE_ERROR);
        });

        it('creates the output directory if necessary', async () => {
            const task = new CopyFiles({
                name: 'outputDirectoryCreated',
                destination: mockDest,
                sourceFiles: [
                    new FileInfo(mockSource, 'foo.txt')
                ]
            });

            await task.run();

            expect(await fs.pathExists(mockDest)).toBeTrue();
        });

        it('works if the output directory already exists', async () => {
            let error;
            const task = new CopyFiles({
                name: 'outputDirectoryExists',
                destination: mockDest,
                sourceFiles: [
                    new FileInfo(mockSource, 'foo.txt')
                ]
            });

            await fs.mkdir(mockDest);
            try {
                await task.run();
            } catch (e) {
                error = e;
            }

            expect(error).toBeUndefined();
        });

        it('copies one file', async () => {
            let fooContents;
            const task = new CopyFiles({
                name: 'copyOneFile',
                destination: mockDest,
                sourceFiles: [
                    new FileInfo(mockSource, 'foo.txt')
                ]
            });

            await task.run();
            fooContents = fs.readFileSync(path.join(mockDest, 'foo.txt'), 'utf8');

            expect(fooContents).toBe('foo');
        });

        it('copies multiple files', async () => {
            let fooContents;
            let barContents;
            const task = new CopyFiles({
                name: 'copyMultipleFiles',
                destination: mockDest,
                sourceFiles: [
                    new FileInfo(mockSource, 'foo.txt'),
                    new FileInfo(mockSource, 'foo/bar.txt')
                ]
            });

            await task.run();
            fooContents = fs.readFileSync(path.join(mockDest, 'foo.txt'), 'utf8');
            barContents = fs.readFileSync(path.join(mockDest, 'foo', 'bar.txt'), 'utf8');

            expect(fooContents).toBe('foo');
            expect(barContents).toBe('bar');
        });

        it('replicates the directory layout', async () => {
            const task = new CopyFiles({
                name: 'copyMultipleFiles',
                destination: mockDest,
                sourceFiles: [
                    new FileInfo(mockSource, 'foo.txt'),
                    new FileInfo(mockSource, 'foo/bar.txt'),
                    new FileInfo(mockSource, 'foo/bar/baz.txt')
                ]
            });

            await task.run();

            expect(await fs.pathExists(path.join(mockDest, 'foo.txt'))).toBeTrue();
            expect(await fs.pathExists(path.join(mockDest, 'foo', 'bar.txt'))).toBeTrue();
            expect(await fs.pathExists(path.join(mockDest, 'foo', 'bar', 'baz.txt'))).toBeTrue();
        });
    });
});
