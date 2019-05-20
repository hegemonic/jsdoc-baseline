describe('symbol header partial', () => {
    // TODO: more tests

    describe('class details', () => {
        xit('should not show details for a normal class', () => {
            // TODO
        });

        it('should show details for hidden constructors', () => {
            const fakeDoclet = {
                copyright: 'Foo',
                hideconstructor: true
            };
            const text = helpers.render('symbol-header', fakeDoclet);

            expect(text).toContain('Foo');
        });
    });
});
