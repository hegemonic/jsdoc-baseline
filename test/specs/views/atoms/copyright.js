describe('copyright atom', () => {
    it('should generate nothing if there is no copyright owner', () => {
        const text = helpers.render('copyright', {});

        expect(text).toBe('');
    });

    it('should show the copyright owner', () => {
        const text = helpers.render('copyright', {
            copyright: 'John Doe'
        });

        expect(text).toContain('<dd>John Doe</dd>');
    });

    it('should link to the copyright owner when appropriate', () => {
        const text = helpers.render('copyright', {
            copyright: 'http://example.org'
        });

        expect(text).toContain('<a href="http://example.org">http://example.org</a>');
    });
});
