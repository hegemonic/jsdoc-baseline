/*
  Copyright 2014 the Baseline Authors.

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
describe('main layout', () => {
  // TODO: more tests

  describe('footer', () => {
    it('includes a footer by default', () => {
      const text = helpers.render('layout.njk', {});

      expect(text).toContain('<footer');
    });

    it('omits the footer when necessary', async () => {
      const template = await helpers.createTemplate({
        components: {
          footer: false,
        },
      });
      const text = template.render('layout.njk', {});

      expect(text).not.toContain('<footer');
    });
  });
});
