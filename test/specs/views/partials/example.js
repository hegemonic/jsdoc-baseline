/*
  Copyright 2023 the Baseline Authors.

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

import nunjucks from 'nunjucks';

const { SafeString } = nunjucks.runtime;

describe('example partial', () => {
  it('highlights the example', async () => {
    const example = {
      caption: new SafeString(''),
      code: 'let foo = new Foo();',
    };
    const actual = await helpers.renderAndNormalize('example.njk', { example });

    expect(actual).toContain('<pre><code class="hljs');
    expect(actual).toContain('Foo');
  });

  it('shows the caption, if present', async () => {
    const example = {
      caption: new SafeString('Create a <code>Foo</code>'),
      code: 'let foo = new Foo();',
    };
    const expected = '<p class="example-caption">Create a <code>Foo</code></p>';
    const actual = await helpers.renderAndNormalize('example.njk', { example });

    expect(actual).toContain(expected);
  });
});
