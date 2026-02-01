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

describe('examples partial', () => {
  const fakeDoclet = {
    name: 'Foo',
    longname: 'Foo',
    kind: 'class',
    examples: [
      'let foo = new Foo();',
      '<caption>Create a <code>Foo</code></caption>\nconst foo = new Foo();',
      'foo.length < bar.length',
    ],
  };

  it('inserts a heading', async () => {
    const expected = await helpers.normalizeHtml(`
      <h2 id="examples" class="examples">
        Examples <copy-url from="examples"></copy-url>
      </h2>
    `);
    const actual = await helpers.renderAndNormalize('examples.njk', {
      href: 'foo.html',
      item: fakeDoclet,
    });

    expect(actual).toContain(expected);
  });

  it('shows every example', async () => {
    const actual = await helpers.renderAndNormalize('examples.njk', {
      href: 'foo.html',
      item: fakeDoclet,
    });

    expect(actual).toContain('let');
    expect(actual).toContain('const');
  });

  it('extracts the caption if one is present', async () => {
    const expected = '<p class="example-caption">Create a <code>Foo</code></p>';
    const actual = await helpers.renderAndNormalize('examples.njk', {
      href: 'foo.html',
      item: fakeDoclet,
    });

    expect(actual).toContain(expected);
  });
});
