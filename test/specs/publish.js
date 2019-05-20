describe('publish', () => {
    const publish = require('../../publish');

    it('exports a "publish" function', () => {
        expect(publish.publish).toBeDefined();
        expect(typeof publish.publish).toBe('function');
    });

    describe('publish', () => {
        xit('creates the output directory', () => {
            // TODO
        });

        xit('copies static files to the output directory', () => {
            // TODO
        });

        xit('generates an index page', () => {
            // TODO
        });

        xit('generates a globals page when there are globals', () => {
            // TODO
        });

        xit('does not generate a globals page when there are no globals', () => {
            // TODO
        });

        xit('generates source files by default', () => {
            // TODO
        });

        xit('does not generate source files if the user disabled them', () => {
            // TODO
        });

        xit('generates docs for tutorials if necessary', () => {
            // TODO
        });

        xit('generates output files for doclets that get their own output file', () => {
            // TODO
        });

        xit('does not generate output files for doclets that do not get their own output file',
            () => {
            // TODO
            });
    });
});
