'use strict';

describe('lib/template', function() {
    var instance;
    var Template = require('../../../lib/template');

    beforeEach(function() {
        instance = new Template('.');
    });

    it('should be a constructor', function() {
        expect(Template).toBeFunction();
        expect(new Template('', '')).toBeInstanceOf(Template);
    });

    xdescribe('init', function() {
        // TODO
    });

    xdescribe('render', function() {
        // TODO
    });

    xdescribe('translate', function() {
        // TODO
    });
});
