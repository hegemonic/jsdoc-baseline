/*
    Copyright 2014-2020 Google LLC

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
describe('defaultvalue atom', () => {
    it('should generate nothing if there is no default value', () => {
        const text = helpers.render('defaultvalue', {});

        expect(text).toBe('');
    });

    it('should show truthy default values', () => {
        const text = helpers.render('defaultvalue', {
            defaultvalue: 1
        });

        expect(text).toContain('<dd>1</dd>');
    });

    it('should show falsy default values', () => {
        const text = helpers.render('defaultvalue', {
            defaultvalue: 0
        });

        expect(text).toContain('<dd>0</dd>');
    });

    it('should wrap default values in a <pre> tag when appropriate', () => {
        const text = helpers.render('defaultvalue', {
            defaultvalue: '{"foo": "bar"}',
            defaultvaluetype: 'object'
        });

        expect(text).toContain('<pre class="prettyprint">');
    });
});
