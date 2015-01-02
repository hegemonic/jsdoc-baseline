'use strict';

describe('lib/enums', function() {
    var ENUMS = require('../../../lib/enums');

    it('should export a "CATEGORIES" object', function() {
        expect(ENUMS.CATEGORIES).toBeObject();
    });

    it('should export a "CATEGORY_TO_KIND" object', function() {
        expect(ENUMS.CATEGORY_TO_KIND).toBeObject();
    });

    it('should export a "KIND_TO_CATEGORY" object', function() {
        expect(ENUMS.KIND_TO_CATEGORY).toBeObject();
    });

    it('should export an "OUTPUT_FILE_CATEGORIES" array', function() {
        expect(ENUMS.OUTPUT_FILE_CATEGORIES).toBeArray();
    });

    it('should export an "OUTPUT_FILE_KINDS" array', function() {
        expect(ENUMS.OUTPUT_FILE_KINDS).toBeArray();
    });
});
