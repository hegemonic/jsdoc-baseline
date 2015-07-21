'use strict';

var helpers = require('../../../helpers');

describe('main layout', function() {
    // TODO: more tests

    describe('footer', function() {
        it('should include a footer by default', function() {
            var text = helpers.render('layout', {});

            expect(text).toContain('<footer');
        });

        it('should omit the footer when necessary', function() {
            var template = helpers.createTemplate({
                components: {
                    footer: false
                }
            });
            var text = template.render('layout', {});

            expect(text).not.toContain('<footer');
        });
    });
});
