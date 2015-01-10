'use strict';

describe('lib/template', function() {
    var config = require('../../../lib/config');
    var instance;
    var Template = require('../../../lib/template');

    beforeEach(function() {
        instance = new Template(config.loadSync('', '.').get());
    });

    it('should be a constructor', function() {
        expect(Template).toBeFunction();
        expect(new Template(config.loadSync('', '.').get())).toBeInstanceOf(Template);
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
