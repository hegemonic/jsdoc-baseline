describe('throws atom', () => {
    it('should generate nothing if the doclet has no "exceptions" items', () => {
        const text = helpers.render('throws', {});

        expect(text).toBe('');
    });

    it('should include the description, if present', () => {
        const doclet = {
            exceptions: [
                {
                    description: 'foo bar baz'
                }
            ]
        };
        const text = helpers.render('throws', doclet);

        expect(text).toContain('foo bar baz');
    });

    it('should describe the exception type, if specified', () => {
        const parsedType = {
            type: 'NameExpression',
            name: 'TypeError'
        };
        const doclet = {
            exceptions: [
                {
                    type: {
                        parsedType
                    }
                }
            ]
        };
        const text = helpers.render('throws', doclet);

        expect(text).toContain('<code>TypeError</code>');
    });

    it('should not include an empty <code> tag if the exception type is not specified', () => {
        const doclet = {
            exceptions: [
                {
                    description: 'foo'
                }
            ]
        };
        const text = helpers.render('throws', doclet);

        expect(text).not.toContain('<code>');
    });
});
