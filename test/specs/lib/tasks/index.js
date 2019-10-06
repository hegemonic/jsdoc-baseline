const _ = require('lodash');
const t = require('../../../../lib/tasks/index');

describe('lib/tasks/index', () => {
    it('is an object', () => {
        expect(t).toBeObject();
    });

    for (const key of Object.keys(t)) {
        const fileName = _.kebabCase(key);

        it(`is lib/tasks/${fileName}`, () => {
            const klass = require(`../../../../lib/tasks/${fileName}`);

            expect(t[key]).toBe(klass);
        });
    }
});
