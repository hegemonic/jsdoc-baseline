const mock = require('mock-fs');
const CopyFiles = require('../../../../lib/tasks/copy-files');
const FileInfo = require('../../../../lib/file-info');
const fs = require('fs-extra');
const path = require('path');

const ARGUMENT_ERROR = 'ArgumentError';
const TYPE_ERROR = 'TypeError';

const mockFilesPath = path.join('Users', 'jdoe', 'testdir', 'files');
const mockObj = {
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
};

describe('lib/tasks/copy-files', () => {
    beforeEach(() => {
        mock(mockObj);
    });

    afterEach(() => {
        mock.restore();
    });

    it('is a constructor', () => {
        expect(() => new CopyFiles({ name: 'test' })).not.toThrow();
    });

    it('accepts a `name`', () => {
        const name = 'foo';
        const task = new CopyFiles({
            name
        });

        expect(task.name).toBe(name);
    });

    it('accepts a `destination`', () => {
        const destination = 'out';
        const task = new CopyFiles({
            name: 'hasDestination',
            destination
        });

        expect(task.destination).toBe(destination);
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
        const sourceFiles = new FileInfo(mockFilesPath, 'foo.txt');
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
        it('validates the `destination` property', async () => {
            let error;
            const task = new CopyFiles({
                name: 'badDestination',
                destination: true,
                sourceFiles: [
                    new FileInfo(mockFilesPath, 'foo.txt')
                ]
            });

            try {
                await task.run();
            } catch (e) {
                error = e;
            }

            expect(error).toBeErrorOfType(ARGUMENT_ERROR);
        });

        it('validates the `name` property', async () => {
            let error;
            const task = new CopyFiles({
                destination: 'out',
                sourceFiles: [
                    new FileInfo(mockFilesPath, 'foo.txt')
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
                destination: 'out',
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
                    new FileInfo(mockFilesPath, 'foo.txt')
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
                destination: 'out',
                sourceFiles: [
                    new FileInfo(mockFilesPath, 'foo.txt')
                ]
            });

            await task.run();

            expect(await fs.pathExists('out')).toBeTrue();
        });

        it('works if the output directory already exists', async () => {
            let error;
            const task = new CopyFiles({
                name: 'outputDirectoryExists',
                destination: 'out',
                sourceFiles: [
                    new FileInfo(mockFilesPath, 'foo.txt')
                ]
            });

            await fs.mkdir('out');
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
                destination: 'out',
                sourceFiles: [
                    new FileInfo(mockFilesPath, 'foo.txt')
                ]
            });

            await task.run();
            fooContents = await fs.readFile('out/foo.txt', 'utf8');

            expect(fooContents).toBe('foo');
        });

        it('copies multiple files', async () => {
            let fooContents;
            let barContents;
            const task = new CopyFiles({
                name: 'copyMultipleFiles',
                destination: 'out',
                sourceFiles: [
                    new FileInfo(mockFilesPath, 'foo.txt'),
                    new FileInfo(mockFilesPath, 'foo/bar.txt')
                ]
            });

            await task.run();
            fooContents = await fs.readFile('out/foo.txt', 'utf8');
            barContents = await fs.readFile('out/foo/bar.txt', 'utf8');

            expect(fooContents).toBe('foo');
            expect(barContents).toBe('bar');
        });

        it('replicates the directory layout', async () => {
            const task = new CopyFiles({
                name: 'copyMultipleFiles',
                destination: 'out',
                sourceFiles: [
                    new FileInfo(mockFilesPath, 'foo.txt'),
                    new FileInfo(mockFilesPath, 'foo/bar.txt'),
                    new FileInfo(mockFilesPath, 'foo/bar/baz.txt')
                ]
            });

            await task.run();

            expect(await fs.pathExists('out/foo.txt')).toBeTrue();
            expect(await fs.pathExists('out/foo/bar.txt')).toBeTrue();
            expect(await fs.pathExists('out/foo/bar/baz.txt')).toBeTrue();
        });
    });
});
