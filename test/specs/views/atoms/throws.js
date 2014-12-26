'use strict';

var helpers = require('../../../helpers');

describe('throws atom', function() {
    it('should generate nothing if the doclet has no "exceptions" items', function() {
        var text = helpers.render('throws', {});

        expect(text).toBe('');
    });

    it('should include the description, if present', function() {
        var doclet = {
            exceptions: [
                {
                    description: 'foo bar baz'
                }
            ]
        };
        var text = helpers.render('throws', doclet);

        expect(text).toContain('foo bar baz');
    });

    it('should describe the exception type, if specified', function() {
        var parsedType = {
            type: 'NameExpression',
            name: 'TypeError'
        };
        var doclet = {
            exceptions: [
                {
                    type: {
                        parsedType: parsedType
                    }
                }
            ]
        };
        var text = helpers.render('throws', doclet);

        expect(text).toContain('<code>TypeError</code>');
    });

    it('should not include an empty <code> tag if the exception type is not specified', function() {
        var doclet = {
            exceptions: [
                {
                    description: 'foo'
                }
            ]
        };
        var text = helpers.render('throws', doclet);

        expect(text).not.toContain('<code>');
    });
});
