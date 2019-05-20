/*
    Copyright 2014-2019 Google LLC

    Licensed under the Apache License, Version 2.0 (the "License");
    you may not use this file except in compliance with the License.
    You may obtain a copy of the License at

        https://www.apache.org/licenses/LICENSE-2.0

    Unless required by applicable law or agreed to in writing, software
    distributed under the License is distributed on an "AS IS" BASIS,
    WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
    See the License for the specific language governing permissions and
    limitations under the License.
*/
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
