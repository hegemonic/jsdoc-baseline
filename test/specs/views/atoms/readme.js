'use strict';

var helpers = require('../../../helpers');

describe('readme atom', function() {
    it('should generate nothing if there is no readme', function() {
        var text = helpers.render('readme', {});

        expect(text).toBe('');
    });

    it('should include the readme data', function() {
        var text = helpers.render('readme', { readme: 'hello world' });

        expect(text).toContain('hello world');
    });

    it('should not escape HTML readme data', function() {
        var text = helpers.render('readme', { readme: '<h1>hello world</h1>' });

        expect(text).toContain('<h1>hello world</h1>');
    });
});
