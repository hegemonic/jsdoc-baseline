const mock = require('mock-fs');
const config = require('../../../../lib/config');
const CopyStaticFiles = require('../../../../lib/tasks/copy-static-files');
const FileInfo = require('../../../../lib/file-info');
const fs = require('fs-extra');
const path = require('path');
const Template = require('../../../../lib/template');

const OUTPUT_DIR = 'out';
const SOURCE_DIR = 'files';

describe('lib/tasks/copy-static-files', () => {
    let conf;
    let context;
    let instance;

    beforeEach(() => {
        conf = config.loadSync().get();
        conf.staticFiles = [
            new FileInfo(SOURCE_DIR, 'foo.txt')
        ];
        context = {
            destination: OUTPUT_DIR,
            template: new Template(conf),
            templateConfig: conf
        };
        instance = new CopyStaticFiles({ name: 'copyStaticFiles' });

        mock({
            files: {
                'foo.txt': 'foo',
                foo: {
                    'bar.txt': 'bar',
                    bar: {
                        'baz.txt': 'baz'
                    }
                }
            }
        });
    });

    afterEach(() => {
        mock.restore();
    });

    it('is a constructor', () => {
        expect(() => new CopyStaticFiles({ name: 'test' })).not.toThrow();
    });

    describe('run', () => {
        it('returns a promise on success', cb => {
            const result = instance.run(context);

            expect(result).toBeInstanceOf(Promise);

            // Handle the fulfilled promise.
            result.then(() => cb(), () => cb());
        });

        it('returns a promise on error', cb => {
            const result = instance.run();

            expect(result).toBeInstanceOf(Promise);

            // Handle the rejected promise.
            result.then(() => cb(), () => cb());
        });

        it('creates the output directory if necessary', async () => {
            await instance.run(context);

            expect(await fs.pathExists(OUTPUT_DIR)).toBeTrue();
        });

        it('works if the output directory already exists', async () => {
            let error;

            await fs.mkdir(OUTPUT_DIR);
            try {
                await instance.run(context);
            } catch (e) {
                error = e;
            }

            expect(error).toBeUndefined();
        });

        it('copies one file', async () => {
            let fooContents;

            await instance.run(context);
            fooContents = fs.readFileSync(path.join(OUTPUT_DIR, 'foo.txt'), 'utf8');

            expect(fooContents).toBe('foo');
        });

        it('copies multiple files', async () => {
            let fooContents;
            let barContents;

            context.templateConfig.staticFiles = [
                new FileInfo(SOURCE_DIR, 'foo.txt'),
                new FileInfo(SOURCE_DIR, path.join('foo', 'bar.txt'))
            ];
            await instance.run(context);
            fooContents = fs.readFileSync(path.join(OUTPUT_DIR, 'foo.txt'), 'utf8');
            barContents = fs.readFileSync(path.join(OUTPUT_DIR, 'foo', 'bar.txt'), 'utf8');

            expect(fooContents).toBe('foo');
            expect(barContents).toBe('bar');
        });

        it('replicates the directory layout', async () => {
            context.templateConfig.staticFiles = [
                new FileInfo(SOURCE_DIR, 'foo.txt'),
                new FileInfo(SOURCE_DIR, path.join('foo', 'bar.txt')),
                new FileInfo(SOURCE_DIR, path.join('foo', 'bar', 'baz.txt'))
            ];

            await instance.run(context);

            expect(await fs.pathExists(path.join(OUTPUT_DIR, 'foo.txt'))).toBeTrue();
            expect(await fs.pathExists(path.join(OUTPUT_DIR, 'foo', 'bar.txt'))).toBeTrue();
            expect(await fs.pathExists(path.join(OUTPUT_DIR, 'foo', 'bar', 'baz.txt'))).toBeTrue();
        });
    });
});
