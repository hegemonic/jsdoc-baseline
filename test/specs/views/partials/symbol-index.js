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

import { longnamesToTree } from '@jsdoc/name';
import _ from 'lodash';

function makeDoclets(longnameMap) {
  let doclets = {};

  for (const longname of Object.keys(longnameMap)) {
    doclets[longname] = { kind: longnameMap[longname], longname };
  }

  return doclets;
}

describe('symbol-index partial', () => {
  let allLongnamesTree;
  const longnameToKind = {
    'module:breakfast': 'module',
    'module:breakfast.eat': 'function',
    'module:lunch': 'module',
    'module:lunch.getFavorite': 'function',
    'module:lunch.setFavorite': 'function',
    'module:lunch.skip': 'member',
    'module:lunch.time': 'member',
    Sandwich: 'class',
    'Sandwich#addCheeses': 'function',
    'Sandwich#addProteins': 'function',
    'Sandwich#addSpreads': 'function',
    'Sandwich#addToppings': 'function',
    'Sandwich#chooseBread': 'function',
    'Sandwich#chooseSize': 'function',
    'Sandwich#insertToothpick': 'function',
    'Sandwich#slice': 'function',
    'Sandwich#toast': 'function',
    'Sandwich#wrap': 'function',
  };
  const fakeDoclets = makeDoclets(longnameToKind);
  let template;
  let tmpdir;

  function filteredTree(longnames) {
    return longnamesToTree(longnames, fakeDoclets);
  }

  beforeEach(async () => {
    allLongnamesTree = longnamesToTree(Object.keys(fakeDoclets), fakeDoclets);
    tmpdir = await helpers.tmpdir();
    template = await helpers.createTemplate();
  });

  afterEach(async () => {
    await tmpdir.reset();
  });

  describe('heading', () => {
    it('adds a heading if there is a README', async () => {
      const data = { allLongnamesTree, href: 'test.html', readme: 'hello' };
      const expected = '<h2>Package index</h2>';
      let rendered = await template.render('symbol-index.njk', data);

      rendered = await helpers.normalizeHtml(rendered);

      expect(rendered).toContain(expected);
    });

    it('omits the heading if there is not a README', async () => {
      const data = { allLongnamesTree, href: 'test.html' };
      const unexpected = '<h2>Package index</h2>';
      let rendered = await template.render('symbol-index.njk', data);

      rendered = await helpers.normalizeHtml(rendered);

      expect(rendered).not.toContain(unexpected);
    });
  });

  describe('groups', () => {
    it('creates one section per group', async () => {
      let data;
      const expectedBreakfast = await helpers.normalizeHtml(`
        <section>
          <div class="symbol-index-content">
            <h2 id="module:breakfast">module:breakfast</h2>
            <div class="symbol-index-section">
              <div class="symbol-index-column">
                <dl class="symbol-index-list">
                  <dt class="symbol-index-name">breakfast</dt>
                  <dd></dd>
                  <dt class="symbol-index-name">breakfast.<wbr>eat()</dt>
                  <dd></dd>
                </dl>
              </div>
              <div class="symbol-index-column"></div>
              <div class="symbol-index-column"></div>
            </div>
          </div>
        </section>
      `);

      const expectedLunch = await helpers.normalizeHtml(`
        <section>
          <div class="symbol-index-content">
            <h2 id="module:lunch">module:lunch</h2>
            <div class="symbol-index-section">
              <div class="symbol-index-column">
                <dl class="symbol-index-list">
                  <dt class="symbol-index-name">lunch</dt>
                  <dd></dd>
                  <dt class="symbol-index-name">lunch.<wbr>getFavorite()</dt>
                  <dd></dd>
                </dl>
              </div>
              <div class="symbol-index-column"></div>
              <div class="symbol-index-column"></div>
            </div>
          </div>
        </section>
      `);
      let longnames = [
        'module:breakfast',
        'module:breakfast.eat',
        'module:lunch',
        'module:lunch.getFavorite',
      ];
      let rendered;

      allLongnamesTree = filteredTree(longnames);
      data = { allLongnamesTree, href: 'test.html' };
      rendered = await template.render('symbol-index.njk', data);
      rendered = await helpers.normalizeHtml(rendered);

      expect(rendered).toContain(expectedBreakfast);
      expect(rendered).toContain(expectedLunch);
    });

    it('sorts the groups by name', async () => {
      let data;
      const expected = await helpers.normalizeHtml(`
        <div class="symbol-index">
          <section>
            <div class="symbol-index-content">
              <h2 id="module:lunch">module:lunch</h2>
              <div class="symbol-index-section">
                <div class="symbol-index-column">
                  <dl class="symbol-index-list">
                    <dt class="symbol-index-name">lunch</dt>
                    <dd></dd>
                    <dt class="symbol-index-name">lunch.<wbr>getFavorite()</dt>
                    <dd></dd>
                  </dl>
                </div>
                <div class="symbol-index-column"></div>
                <div class="symbol-index-column"></div>
              </div>
            </div>
          </section>
          <section>
            <div class="symbol-index-content">
              <h2 id="Sandwich">Sandwich</h2>
              <div class="symbol-index-section">
                <div class="symbol-index-column">
                  <dl class="symbol-index-list">
                    <dt class="symbol-index-name">Sandwich()</dt>
                    <dd></dd>
                    <dt class="symbol-index-name">Sandwich#<wbr>addCheeses()</dt>
                    <dd></dd>
                  </dl>
                </div>
                <div class="symbol-index-column"></div>
                <div class="symbol-index-column"></div>
              </div>
            </div>
          </section>
        </div>
      `);
      let longnames = [
        'Sandwich',
        'Sandwich#addCheeses',
        'module:lunch',
        'module:lunch.getFavorite',
      ];
      let rendered;

      allLongnamesTree = filteredTree(longnames);
      data = { allLongnamesTree, href: 'test.html' };
      rendered = await template.render('symbol-index.njk', data);
      rendered = await helpers.normalizeHtml(rendered);

      expect(rendered).toContain(expected);
    });

    describe('columns', () => {
      it('keeps 3 items in a single column', async () => {
        let data;
        const expected = await helpers.normalizeHtml(`
          <div class="symbol-index">
            <section>
              <div class="symbol-index-content">
                <h2 id="Sandwich">Sandwich</h2>
                <div class="symbol-index-section">
                  <div class="symbol-index-column">
                    <dl class="symbol-index-list">
                      <dt class="symbol-index-name">Sandwich()</dt>
                      <dd></dd>
                      <dt class="symbol-index-name">Sandwich#<wbr>addCheeses()</dt>
                      <dd></dd>
                      <dt class="symbol-index-name">Sandwich#<wbr>addProteins()</dt>
                      <dd></dd>
                    </dl>
                  </div>
                  <div class="symbol-index-column"></div>
                  <div class="symbol-index-column"></div>
                </div>
              </div>
            </section>
          </div>
        `);
        const longnames = ['Sandwich', 'Sandwich#addCheeses', 'Sandwich#addProteins'];
        let rendered;

        allLongnamesTree = filteredTree(longnames);
        data = { allLongnamesTree, href: 'test.html' };
        rendered = await template.render('symbol-index.njk', data);
        rendered = await helpers.normalizeHtml(rendered);

        expect(rendered).toContain(expected);
      });

      it('splits 4 items across 2 columns', async () => {
        let data;
        const expected = await helpers.normalizeHtml(`
          <div class="symbol-index">
            <section>
              <div class="symbol-index-content">
                <h2 id="Sandwich">Sandwich</h2>
                <div class="symbol-index-section">
                  <div class="symbol-index-column">
                    <dl class="symbol-index-list">
                      <dt class="symbol-index-name">Sandwich()</dt>
                      <dd></dd>
                      <dt class="symbol-index-name">Sandwich#<wbr>addCheeses()</dt>
                      <dd></dd>
                    </dl>
                  </div>
                  <div class="symbol-index-column">
                    <dl class="symbol-index-list">
                      <dt class="symbol-index-name">Sandwich#<wbr>addProteins()</dt>
                      <dd></dd>
                      <dt class="symbol-index-name">Sandwich#<wbr>addSpreads()</dt>
                      <dd></dd>
                    </dl>
                  </div>
                  <div class="symbol-index-column"></div>
                </div>
              </div>
            </section>
          </div>
        `);
        const longnames = [
          'Sandwich',
          'Sandwich#addCheeses',
          'Sandwich#addProteins',
          'Sandwich#addSpreads',
        ];
        let rendered;

        allLongnamesTree = filteredTree(longnames);
        data = { allLongnamesTree, href: 'test.html' };
        rendered = await template.render('symbol-index.njk', data);
        rendered = await helpers.normalizeHtml(rendered);

        expect(rendered).toContain(expected);
      });

      it('splits 6 items across 3 columns', async () => {
        let data;
        const expected = await helpers.normalizeHtml(`
          <div class="symbol-index">
            <section>
              <div class="symbol-index-content">
                <h2 id="Sandwich">Sandwich</h2>
                <div class="symbol-index-section">
                  <div class="symbol-index-column">
                    <dl class="symbol-index-list">
                      <dt class="symbol-index-name">Sandwich()</dt>
                      <dd></dd>
                      <dt class="symbol-index-name">Sandwich#<wbr>addCheeses()</dt>
                      <dd></dd>
                    </dl>
                  </div>
                  <div class="symbol-index-column">
                    <dl class="symbol-index-list">
                      <dt class="symbol-index-name">Sandwich#<wbr>addProteins()</dt>
                      <dd></dd>
                      <dt class="symbol-index-name">Sandwich#<wbr>addSpreads()</dt>
                      <dd></dd>
                    </dl>
                  </div>
                  <div class="symbol-index-column">
                    <dl class="symbol-index-list">
                      <dt class="symbol-index-name">Sandwich#<wbr>addToppings()</dt>
                      <dd></dd>
                      <dt class="symbol-index-name">Sandwich#<wbr>chooseBread()</dt>
                      <dd></dd>
                    </dl>
                  </div>
                </div>
              </div>
            </section>
          </div>
        `);
        const longnames = [
          'Sandwich',
          'Sandwich#addCheeses',
          'Sandwich#addProteins',
          'Sandwich#addSpreads',
          'Sandwich#addToppings',
          'Sandwich#chooseBread',
        ];
        let rendered;

        allLongnamesTree = filteredTree(longnames);
        data = { allLongnamesTree, href: 'test.html' };
        rendered = await template.render('symbol-index.njk', data);
        rendered = await helpers.normalizeHtml(rendered);

        expect(rendered).toContain(expected);
      });

      it('creates 3 columns at most, even when there are many items', async () => {
        let data;
        const longnames = Object.keys(longnameToKind).filter((longname) =>
          longname.startsWith('Sandwich')
        );
        let rendered;

        allLongnamesTree = filteredTree(longnames);
        data = { allLongnamesTree, href: 'test.html' };
        rendered = await template.render('symbol-index.njk', data);

        expect([...rendered.matchAll(/<div class="symbol-index-column">/g)]).toBeArrayOfSize(3);
      });

      it('balances the number of items in each column', async () => {
        function extract(column, elementName, className) {
          let items;
          let regexp;

          if (className) {
            className = ` class="${className}"`;
          } else {
            className = '';
          }

          regexp = new RegExp(`(?:<${elementName}${className}>[\\s\\S]+?<\\/${elementName}>)`, 'g');
          items = [...column.matchAll(regexp)];

          return _.flatten(items);
        }

        let columns;
        let data;
        const longnames = Object.keys(longnameToKind).filter((longname) =>
          longname.startsWith('Sandwich')
        );
        let rendered;

        allLongnamesTree = filteredTree(longnames);
        data = { allLongnamesTree, href: 'test.html' };
        rendered = await template.render('symbol-index.njk', data);
        columns = extract(rendered, 'div', 'symbol-index-column');

        expect(extract(columns[0], 'dt', 'symbol-index-name')).toBeArrayOfSize(4);
        expect(extract(columns[1], 'dt', 'symbol-index-name')).toBeArrayOfSize(4);
        expect(extract(columns[2], 'dt', 'symbol-index-name')).toBeArrayOfSize(3);
      });
    });
  });
});
