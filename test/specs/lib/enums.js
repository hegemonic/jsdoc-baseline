describe('lib/enums', () => {
    const ENUMS = require('../../../lib/enums');

    it('should export a "CATEGORIES" object', () => {
        expect(ENUMS.CATEGORIES).toBeObject();
    });

    it('should export a "CATEGORY_TO_KIND" object', () => {
        expect(ENUMS.CATEGORY_TO_KIND).toBeObject();
    });

    it('should export a "KIND_TO_CATEGORY" object', () => {
        expect(ENUMS.KIND_TO_CATEGORY).toBeObject();
    });

    it('should export an "OUTPUT_FILE_CATEGORIES" array', () => {
        expect(ENUMS.OUTPUT_FILE_CATEGORIES).toBeArray();
    });

    it('should export an "OUTPUT_FILE_KINDS" array', () => {
        expect(ENUMS.OUTPUT_FILE_KINDS).toBeArray();
    });
});
