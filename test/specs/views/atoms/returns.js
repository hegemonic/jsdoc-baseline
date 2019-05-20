describe('returns atom', () => {
    it('should generate nothing if the doclet has no returns items', () => {
        const text = helpers.render('returns', {});

        expect(text).toBe('');
    });

    it('should include the description, if present', () => {
        const doclet = {
            returns: [
                {
                    description: 'foo bar baz'
                }
            ]
        };
        const text = helpers.render('returns', doclet);

        expect(text).toContain('foo bar baz');
    });

    it('should describe the return type, if specified', () => {
        const parsedType = {
            type: 'NameExpression',
            name: 'string'
        };
        const doclet = {
            returns: [
                {
                    type: {
                        parsedType
                    }
                }
            ]
        };
        const text = helpers.render('returns', doclet);

        expect(text).toContain('<code>string</code>');
    });

    it('should not include an empty <code> tag if the return type is not specified', () => {
        const doclet = {
            returns: [
                {
                    description: 'foo'
                }
            ]
        };
        const text = helpers.render('returns', doclet);

        expect(text).not.toContain('<code>');
    });
});
