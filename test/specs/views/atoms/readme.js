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
describe('readme atom', () => {
    it('should generate nothing if there is no readme', () => {
        const text = helpers.render('readme', {});

        expect(text).toBe('');
    });

    it('should include the readme data', () => {
        const text = helpers.render('readme', { readme: 'hello world' });

        expect(text).toContain('hello world');
    });

    it('should not escape HTML readme data', () => {
        const text = helpers.render('readme', { readme: '<h1>hello world</h1>' });

        expect(text).toContain('<h1>hello world</h1>');
    });
});
