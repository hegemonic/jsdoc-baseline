const helpers = require('../../../helpers');

describe('details-table-row partial', () => {
    // TODO: more tests

    it('should not insert an empty paragraph when a doclet has no modifiers', () => {
        const text = helpers.render('details-table-row', {
            description: 'foo'
        });

        expect(text).not.toContain('<p></p>');
    });

    it('should include the default value when one is provided', () => {
        const text = helpers.render('details-table-row', {
            description: 'test',
            defaultvalue: 'foo'
        });

        expect(text).toContain('foo');
    });

    it('should include modifier text even when the description is missing', () => {
        const text = helpers.render('details-table-row', {
            defaultvalue: 'foo'
        });

        expect(text).toContain('foo');
    });
});
