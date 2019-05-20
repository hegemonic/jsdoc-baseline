describe('main layout', () => {
    // TODO: more tests

    describe('footer', () => {
        it('should include a footer by default', () => {
            const text = helpers.render('layout', {});

            expect(text).toContain('<footer');
        });

        it('should omit the footer when necessary', () => {
            const template = helpers.createTemplate({
                components: {
                    footer: false
                }
            });
            const text = template.render('layout', {});

            expect(text).not.toContain('<footer');
        });
    });
});
