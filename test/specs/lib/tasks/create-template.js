const config = require('../../../../lib/config');
const CreateTemplate = require('../../../../lib/tasks/create-template');
const Template = require('../../../../lib/template');

const TYPE_ERROR = 'TypeError';

describe('lib/tasks/create-template', () => {
    it('is a constructor', () => {
        expect(() => new CreateTemplate({ name: 'create' })).not.toThrow();
    });

    describe('run', () => {
        it('adds a template to the shared context', async () => {
            const context = {
                templateConfig: config.loadSync().get()
            };
            const task = new CreateTemplate({ name: 'create' });

            await task.run(context);

            expect(context.template).toBeObject();
            expect(context.template instanceof Template).toBeTrue();
        });

        it('fails if `templateConfig` is missing', async () => {
            let error;
            const task = new CreateTemplate({ name: 'create' });

            try {
                await task.run({});
            } catch (e) {
                error = e;
            }

            expect(error).toBeErrorOfType(TYPE_ERROR);
        });
    });
});
