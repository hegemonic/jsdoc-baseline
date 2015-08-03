'use strict';

var helpers = require('../../../helpers');

describe('tutorial layout', function() {
    // TODO: more tests

    describe('content', function() {
        it('should render the tutorial content as Markdown', function() {
            var text = helpers.render('tutorial', {
                tutorialContent: '## Test'
            });

            expect(text).toContain('<h2>Test</h2>');
        });
    });
});
