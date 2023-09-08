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
import catharsis from 'catharsis';

describe('signature partial', () => {
  // TODO: more tests

  it('includes the return type for functions if one is supplied', async () => {
    const fakeDoclet = {
      kind: 'function',
      name: 'foo',
      returns: [
        {
          type: {
            names: ['string'],
          },
        },
      ],
    };
    const returnTypesSeparator = helpers.template.translate('returnTypesSeparator');
    const text = await helpers.render('signature.njk', { item: fakeDoclet });

    expect(text).toContain(returnTypesSeparator);
    expect(text).toContain('string');
  });

  it('does not show the return-type separator if there is no return type', async () => {
    const fakeDoclet = {
      kind: 'function',
      name: 'foo',
      returns: [
        {
          description: 'bar',
        },
      ],
    };
    const returnTypesSeparator = helpers.template.translate('returnTypesSeparator');
    const text = await helpers.render('signature.njk', { item: fakeDoclet });

    expect(text).not.toContain(returnTypesSeparator);
  });

  it('shows complete type information for properties', async () => {
    const fakeDoclet = {
      kind: 'member',
      name: 'foo',
      type: {
        names: ['function'],
        parsedType: catharsis.parse('?function(!string)'),
      },
    };
    const text = await helpers.render('signature.njk', { item: fakeDoclet });

    expect(text).toContain('nullable function(non-null string)');
  });
});
