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
describe('details-table-row partial', () => {
    // TODO: more tests

    it('should not insert an empty paragraph when a doclet has no modifiers', () => {
        const text = helpers.render('details-table-row', {
            description: 'foo'
        });

        expect(text).not.toContain('<p></p>');
    });

    it('should include the default value when one is provided', () => {
        const text = helpers.render('details-table-row', {
            description: 'test',
            defaultvalue: 'foo'
        });

        expect(text).toContain('foo');
    });

    it('should include modifier text even when the description is missing', () => {
        const text = helpers.render('details-table-row', {
            defaultvalue: 'foo'
        });

        expect(text).toContain('foo');
    });
});
