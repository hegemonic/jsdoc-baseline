'use strict';

var helpers = require('../../../helpers');

describe('returns atom', function() {
    it('should generate nothing if the doclet has no returns items', function() {
        var text = helpers.render('returns', {});

        expect(text).toBe('');
    });

    it('should include the description, if present', function() {
        var doclet = {
            returns: [
                {
                    description: 'foo bar baz'
                }
            ]
        };
        var text = helpers.render('returns', doclet);

        expect(text).toContain('foo bar baz');
    });

    it('should describe the return type, if specified', function() {
        var parsedType = {
            type: 'NameExpression',
            name: 'string'
        };
        var doclet = {
            returns: [
                {
                    type: {
                        parsedType: parsedType
                    }
                }
            ]
        };
        var text = helpers.render('returns', doclet);

        expect(text).toContain('<code>string</code>');
    });

    it('should not include an empty <code> tag if the return type is not specified', function() {
        var doclet = {
            returns: [
                {
                    description: 'foo'
                }
            ]
        };
        var text = helpers.render('returns', doclet);

        expect(text).not.toContain('<code>');
    });
});
