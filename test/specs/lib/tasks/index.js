const t = require('../../../../lib/tasks/index');

describe('lib/tasks/index', () => {
    it('is an object', () => {
        expect(t).toBeObject();
    });

    describe('CopyFiles', () => {
        it('is lib/tasks/copy-files', () => {
            const CopyFiles = require('../../../../lib/tasks/copy-files');

            expect(t.CopyFiles).toBe(CopyFiles);
        });
    });
});
