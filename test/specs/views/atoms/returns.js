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
describe('returns atom', () => {
    it('should generate nothing if the doclet has no returns items', () => {
        const text = helpers.render('returns', {});

        expect(text).toBe('');
    });

    it('should include the description, if present', () => {
        const doclet = {
            returns: [
                {
                    description: 'foo bar baz'
                }
            ]
        };
        const text = helpers.render('returns', doclet);

        expect(text).toContain('foo bar baz');
    });

    it('should describe the return type, if specified', () => {
        const parsedType = {
            type: 'NameExpression',
            name: 'string'
        };
        const doclet = {
            returns: [
                {
                    type: {
                        parsedType
                    }
                }
            ]
        };
        const text = helpers.render('returns', doclet);

        expect(text).toContain('<code>string</code>');
    });

    it('should not include an empty <code> tag if the return type is not specified', () => {
        const doclet = {
            returns: [
                {
                    description: 'foo'
                }
            ]
        };
        const text = helpers.render('returns', doclet);

        expect(text).not.toContain('<code>');
    });
});
