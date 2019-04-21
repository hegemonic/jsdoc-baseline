describe('lib/template', () => {
    const config = require('../../../lib/config');
    /* eslint-disable no-unused-vars */
    let instance;
    /* eslint-enable no-unused-vars */
    const Template = require('../../../lib/template');

    beforeEach(() => {
        instance = new Template(config.loadSync('', '.').get());
    });

    it('should be a constructor', () => {
        expect(Template).toBeFunction();
        expect(new Template(config.loadSync('', '.').get())).toBeInstanceOf(Template);
    });

    xdescribe('init', () => {
        // TODO
    });

    xdescribe('render', () => {
        // TODO
    });

    xdescribe('translate', () => {
        // TODO
    });
});
