'use strict';

var helpers = require('../../../helpers');

describe('details-table-row partial', function() {
    // TODO: more tests

    it('should not insert an empty paragraph when a doclet has no modifiers', function() {
        var text = helpers.render('details-table-row', {
            description: 'foo'
        });

        expect(text).not.toContain('<p></p>');
    });
});
