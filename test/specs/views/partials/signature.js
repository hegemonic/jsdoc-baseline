const helpers = require('../../../helpers');

describe('signature partial', () => {
    // TODO: more tests

    it('should include the return type for functions if one is supplied', () => {
        const fakeDoclet = {
            kind: 'function',
            name: 'foo',
            returns: [
                {
                    type: {
                        names: [
                            'string'
                        ]
                    }
                }
            ]
        };
        const returnTypesSeparator = helpers.template.translate('returnTypesSeparator');
        const text = helpers.render('signature', fakeDoclet);

        expect(text).toContain(returnTypesSeparator);
        expect(text).toContain('string');
    });

    it('should not show the return-type separator if there is no return type', () => {
        const fakeDoclet = {
            kind: 'function',
            name: 'foo',
            returns: [
                {
                    description: 'bar'
                }
            ]
        };
        const returnTypesSeparator = helpers.template.translate('returnTypesSeparator');
        const text = helpers.render('signature', fakeDoclet);

        expect(text).not.toContain(returnTypesSeparator);
    });

    it('should show complete type information for properties', () => {
        const catharsis = require('catharsis');

        const fakeDoclet = {
            kind: 'member',
            name: 'foo',
            type: {
                names: [
                    'function'
                ],
                parsedType: catharsis.parse('?function(!string)')
            }
        };
        const text = helpers.render('signature', fakeDoclet);

        expect(text).toContain('nullable function(non-null string)');
    });
});
