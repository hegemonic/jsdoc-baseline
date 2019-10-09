const _ = require('lodash');
const t = require('../../../../lib/tasks/index');

const expectedTasks = [
    'CopyFiles',
    'CreateTemplate',
    'GenerateFiles',
    'GenerateSourceFiles'
];

describe('lib/tasks/index', () => {
    it('is an object', () => {
        expect(t).toBeObject();
    });

    for (const key of expectedTasks) {
        const fileName = _.kebabCase(key);

        it(`is lib/tasks/${fileName}`, () => {
            const klass = require(`../../../../lib/tasks/${fileName}`);

            expect(t[key]).toBe(klass);
        });
    }
});
