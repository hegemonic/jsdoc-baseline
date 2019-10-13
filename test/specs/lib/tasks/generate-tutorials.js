const mock = require('mock-fs');
const config = require('../../../../lib/config');
const fs = require('fs-extra');
const GenerateTutorials = require('../../../../lib/tasks/generate-tutorials');
const helper = require('jsdoc/util/templateHelper');
const path = require('path');
const resolver = require('jsdoc/tutorial/resolver');
const Template = require('../../../../lib/template');

const mockObj = {
    tutorials: {
        'A.md': '## Tutorial A',
        'A1.md': '## Tutorial A.1',
        'B.md': '## Tutorial B',
        'info.json': JSON.stringify({
            A: {
                title: 'Tutorial A',
                children: ['A1']
            },
            A1: {
                title: 'Tutorial A.1'
            },
            B: {
                title: 'Tutorial B'
            }
        })
    }
};
const OUTPUT_DIR = 'out';

describe('lib/tasks/generate-tutorials', () => {
    it('is a constructor', () => {
        function factory() {
            return new GenerateTutorials({});
        }

        expect(factory).not.toThrow();
    });

    describe('run', () => {
        let conf;
        let context;
        let loadedTutorials;
        let instance;

        beforeEach(() => {
            conf = config.loadSync().get();
            context = {
                destination: OUTPUT_DIR,
                pageTitlePrefix: '',
                template: new Template(conf),
                templateConfig: conf
            };
            instance = new GenerateTutorials({ name: 'generateTutorials' });

            mock(mockObj);

            if (!loadedTutorials) {
                resolver.load('tutorials');
                resolver.resolve();
                loadedTutorials = true;
            }

            context.tutorials = resolver.root;
            helper.setTutorials(resolver.root);
        });

        afterEach(() => {
            mock.restore();
        });

        it('returns a promise on success', () => {
            const result = instance.run(context);

            expect(result).toBeInstanceOf(Promise);

            // Handle the resolved promise.
            result.then(() => null, () => null);
        });

        it('returns a promise on failure', () => {
            let result;

            context.tutorials = 'hi';
            result = instance.run(context);

            expect(result).toBeInstanceOf(Promise);

            // Handle the rejected promise.
            result.then(() => null, () => null);
        });

        describe('output', () => {
            it('creates an output file for each tutorial', async () => {
                let files;

                await instance.run(context);
                files = fs.readdirSync(OUTPUT_DIR, 'utf8');

                expect(files.length).toBe(3);
            });

            it('includes the tutorial name in the page title', async () => {
                let file;
                let files;

                await instance.run(context);
                files = fs.readdirSync(OUTPUT_DIR, 'utf8').filter(f => f.match(/A1/));
                file = fs.readFileSync(path.join(OUTPUT_DIR, files[0]), 'utf8');

                expect(file).toContain('Tutorial A.1</title>');
            });

            it('includes the page title prefix in the page title', async () => {
                let file;
                let files;

                context.pageTitlePrefix = 'Prefix: ';
                await instance.run(context);
                files = fs.readdirSync(OUTPUT_DIR, 'utf8').filter(f => f.match(/A1/));
                file = fs.readFileSync(path.join(OUTPUT_DIR, files[0]), 'utf8');

                expect(file).toContain('<title>Prefix: ');
            });

            it('includes the tutorial content', async () => {
                let file;
                let files;

                await instance.run(context);
                files = fs.readdirSync(OUTPUT_DIR, 'utf8').filter(f => f.match(/A1/));
                file = fs.readFileSync(path.join(OUTPUT_DIR, files[0]), 'utf8');

                expect(file).toContain('<h2>Tutorial A.1</h2>');
            });

            it('links to child tutorials', async () => {
                let file;
                let files;

                await instance.run(context);
                files = fs.readdirSync(OUTPUT_DIR, 'utf8').filter(f => f.match(/A[^1]/));
                file = fs.readFileSync(path.join(OUTPUT_DIR, files[0]), 'utf8');

                expect(file).toMatch(/<a[^>]+>Tutorial A.1<\/a>/);
            });
        });
    });
});
