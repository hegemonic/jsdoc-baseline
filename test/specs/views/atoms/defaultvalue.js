'use strict';

var helpers = require('../../../helpers');

describe('defaultvalue atom', function() {
    it('should generate nothing if there is no default value', function() {
        var text = helpers.render('defaultvalue', {});

        expect(text).toBe('');
    });

    it('should show truthy default values', function() {
        var text = helpers.render('defaultvalue', {
            defaultvalue: 1
        });

        expect(text).toContain('<dd>1</dd>');
    });

    it('should show falsy default values', function() {
        var text = helpers.render('defaultvalue', {
            defaultvalue: 0
        });

        expect(text).toContain('<dd>0</dd>');
    });

    it('should wrap default values in a <pre> tag when appropriate', function() {
        var text = helpers.render('defaultvalue', {
            defaultvalue: '{"foo": "bar"}',
            defaultvaluetype: 'object'
        });

        expect(text).toContain('<pre class="prettyprint">');
    });
});
