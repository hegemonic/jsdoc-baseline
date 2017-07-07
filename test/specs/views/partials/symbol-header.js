'use strict';

var helpers = require('../../../helpers');

describe('symbol header partial', function() {
    // TODO: more tests

    describe('class details', function() {
        xit('should not show details for a normal class', function() {
            // TODO
        });

        it('should show details for hidden constructors', function() {
            var fakeDoclet = {
                copyright: 'Foo',
                hideconstructor: true
            };
            var text = helpers.render('symbol-header', fakeDoclet);

            expect(text).toContain('Foo');
        });
    });
});
