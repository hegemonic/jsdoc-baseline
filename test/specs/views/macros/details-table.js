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
const _ = require('lodash');
const { defaultConfig } = require('../../../../lib/config');
const path = require('path');

describe('details-table macro', () => {
  // TODO: more tests
  const config = _.defaultsDeep(
    {
      views: [path.resolve(__dirname, '..', '..', '..', 'fixtures', 'views')],
    },
    defaultConfig
  );
  let template;

  beforeEach(() => {
    template = helpers.createTemplate(config);
  });

  it('does not insert an empty paragraph when a doclet has no modifiers', () => {
    const text = template.render('details-table-test.njk', {
      values: [
        {
          description: 'foo',
        },
      ],
    });

    expect(text).not.toContain('<p></p>');
  });

  it('includes the default value when one is provided', () => {
    const text = template.render('details-table-test.njk', {
      values: [
        {
          description: 'test',
          defaultvalue: 'foo',
        },
      ],
    });

    expect(text).toContain('foo');
  });

  it('includes modifier text even when the description is missing', () => {
    const text = template.render('details-table-test.njk', {
      values: [
        {
          defaultvalue: 'foo',
        },
      ],
    });

    expect(text).toContain('foo');
  });
});
