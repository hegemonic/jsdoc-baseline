/*
  Copyright 2024 the Baseline Authors.

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

describe('params atom', () => {
  const PARAMS = 'params.njk';

  let params;

  beforeEach(() => {
    params = {
      hasType: {
        description: 'Param with type',
        name: 'hasType',
        type: {
          parsedType: catharsis.parse('string'),
        },
      },
      noName: {
        description: 'Param without name',
      },
      noType: {
        description: 'Param without type',
        name: 'noType',
      },
      optionalHasType: {
        description: 'Optional param with type',
        name: 'optionalHasType',
        optional: true,
        type: {
          parsedType: catharsis.parse('string'),
        },
      },
      optionalNoType: {
        description: 'Optional param without type',
        name: 'optionalNoType',
        optional: true,
      },
      withMarkdown: {
        description: 'Param with **Markdown**',
      },
    };
  });

  describe('table', () => {
    describe('parameter column', () => {
      it('has a heading', async () => {
        const text = await helpers.render(PARAMS, {
          item: {
            params: [params.hasType],
          },
        });

        expect(text).toContain('<th>Name</th>');
      });

      it('shows the parameter name in bold code font', async () => {
        const text = await helpers.render(PARAMS, {
          item: {
            params: [params.hasType],
          },
        });

        expect(text).toContain('<code><strong>hasType</strong></code>');
      });

      it('shows a placeholder for unnamed params', async () => {
        const text = await helpers.render(PARAMS, {
          item: {
            params: [params.noName],
          },
        });

        expect(text).toContain('<strong>&mdash;</strong>');
      });
    });

    describe('description column', () => {
      it('has a heading', async () => {
        const text = await helpers.render(PARAMS, {
          item: {
            params: [params.hasType],
          },
        });

        expect(text).toContain('<th>Description</th>');
      });

      it('shows the type', async () => {
        const text = await helpers.render(PARAMS, {
          item: {
            params: [params.hasType],
          },
        });

        expect(text).toContain('<code>string</code>');
      });

      it('identifies optional params with types', async () => {
        const text = await helpers.render(PARAMS, {
          item: {
            params: [params.optionalHasType],
          },
        });

        expect(text).toContain('<p class="details-table-type">optional&nbsp;');
      });

      it('identifies optional params without types', async () => {
        const text = await helpers.render(PARAMS, {
          item: {
            params: [params.optionalNoType],
          },
        });

        expect(text).toContain('<p class="details-table-type">optional&nbsp;');
      });

      it('works for params with no type', async () => {
        const text = await helpers.renderAndNormalize(PARAMS, {
          item: {
            params: [params.noType],
          },
        });
        const expected = await helpers.normalizeHtml(`
          <td class="details-table-description">
            <p>Param without type</p>
          </td>
        `);

        expect(text).toContain(expected);
      });

      it('shows the description after the type', async () => {
        const text = await helpers.renderAndNormalize(PARAMS, {
          item: {
            params: [params.hasType],
          },
        });
        const expected = await helpers.normalizeHtml(`
          <p class="details-table-type"><code>string</code></p>
          <p>Param with type</p>
        `);

        expect(text).toContain(expected);
      });

      it('processes Markdown formatting in the description', async () => {
        const text = await helpers.render(PARAMS, {
          item: {
            params: [params.withMarkdown],
          },
        });

        expect(text).toContain('<p>Param with <strong>Markdown</strong></p>');
      });

      xit('shows info about modifiers for the param', async () => {
        // TODO
      });

      xit('shows child params when they are present', async () => {
        // TODO
      });
    });
  });
});
