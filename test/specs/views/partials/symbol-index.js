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
const mock = require('mock-fs');
const _ = require('lodash');
const { longnamesToTree } = require('@jsdoc/core').name;

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

  function filteredTree(longnames) {
    return longnamesToTree(longnames, fakeDoclets);
  }

  beforeEach(() => {
    allLongnamesTree = longnamesToTree(Object.keys(fakeDoclets), fakeDoclets);
    mock(
      helpers.baseViewsModified({
        'symbol-index-section.njk': `
          <index-group>
            {% for item in items -%}
              <index-item>{{ item.longname }}</index-item>
            {% endfor %}
          </index-group>`,
      })
    );
    template = helpers.createTemplate();
  });

  afterEach(() => {
    mock.restore();
  });

  describe('heading', () => {
    it('adds a heading if there is a README', () => {
      const data = { allLongnamesTree, readme: 'hello' };
      const rendered = template.render('symbol-index.njk', data);

      expect(rendered).toContainHtml('<h2>Package index</h2>');
    });

    it('omits the heading if there is not a README', () => {
      const data = { allLongnamesTree };
      const rendered = template.render('symbol-index.njk', data);

      expect(rendered).not.toContainHtml('<h2>Package index</h2>');
    });
  });

  describe('groups', () => {
    it('creates one section per group', () => {
      let data;
      let longnames = [
        'module:breakfast',
        'module:breakfast.eat',
        'module:lunch',
        'module:lunch.getFavorite',
      ];
      let rendered;

      allLongnamesTree = filteredTree(longnames);
      data = { allLongnamesTree };
      rendered = template.render('symbol-index.njk', data);

      expect(rendered).toContainHtml(`
        <section>
          <div class="symbol-index-content">
            <h2 id="module:breakfast">module:breakfast</h2>
            <div class="symbol-index-section">
              <index-group>
                <index-item>module:breakfast</index-item>
                <index-item>module:breakfast.eat</index-item>
              </index-group>
            </div>
          </div>
        </section>
      `);
      expect(rendered).toContainHtml(`
        <section>
          <div class="symbol-index-content">
            <h2 id="module:lunch">module:lunch</h2>
            <div class="symbol-index-section">
              <index-group>
                <index-item>module:lunch</index-item>
                <index-item>module:lunch.getFavorite</index-item>
              </index-group>
            </div>
          </div>
        </section>
      `);
    });

    it('sorts the groups by name', () => {
      let data;
      let longnames = [
        'Sandwich',
        'Sandwich#addCheeses',
        'module:lunch',
        'module:lunch.getFavorite',
      ];
      let rendered;

      allLongnamesTree = filteredTree(longnames);
      data = { allLongnamesTree };
      rendered = template.render('symbol-index.njk', data);

      expect(rendered).toContainHtml(`
        <section>
          <div class="symbol-index-content">
            <h2 id="module:lunch">module:lunch</h2>
            <div class="symbol-index-section">
              <index-group>
                <index-item>module:lunch</index-item>
                <index-item>module:lunch.getFavorite</index-item>
              </index-group>
            </div>
          </div>
        </section>
        <section>
          <div class="symbol-index-content">
            <h2 id="Sandwich">Sandwich</h2>
            <div class="symbol-index-section">
              <index-group>
                <index-item>Sandwich</index-item>
                <index-item>Sandwich#addCheeses</index-item>
              </index-group>
            </div>
          </div>
        </section>
      `);
    });

    describe('columns', () => {
      it('keeps 3 items in a single column', () => {
        let data;
        const longnames = ['Sandwich', 'Sandwich#addCheeses', 'Sandwich#addProteins'];
        let rendered;

        allLongnamesTree = filteredTree(longnames);
        data = { allLongnamesTree };
        rendered = template.render('symbol-index.njk', data);

        expect(rendered).toContainHtml(`
          <index-group>
            <index-item>Sandwich</index-item>
            <index-item>Sandwich#addCheeses</index-item>
            <index-item>Sandwich#addProteins</index-item>
          </index-group>
        `);
      });

      it('splits 4 items across 2 columns', () => {
        let data;
        const longnames = [
          'Sandwich',
          'Sandwich#addCheeses',
          'Sandwich#addProteins',
          'Sandwich#addSpreads',
        ];
        let rendered;

        allLongnamesTree = filteredTree(longnames);
        data = { allLongnamesTree };
        rendered = template.render('symbol-index.njk', data);

        expect(rendered).toContainHtml(`
          <index-group>
            <index-item>Sandwich</index-item>
            <index-item>Sandwich#addCheeses</index-item>
          </index-group>
          <index-group>
            <index-item>Sandwich#addProteins</index-item>
            <index-item>Sandwich#addSpreads</index-item>
          </index-group>
        `);
      });

      it('splits 6 items across 3 columns', () => {
        let data;
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
        data = { allLongnamesTree };
        rendered = template.render('symbol-index.njk', data);

        expect(rendered).toContainHtml(`
          <index-group>
            <index-item>Sandwich</index-item>
            <index-item>Sandwich#addCheeses</index-item>
          </index-group>
          <index-group>
            <index-item>Sandwich#addProteins</index-item>
            <index-item>Sandwich#addSpreads</index-item>
          </index-group>
          <index-group>
            <index-item>Sandwich#addToppings</index-item>
            <index-item>Sandwich#chooseBread</index-item>
          </index-group>
        `);
      });

      it('creates 3 columns at most, even when there are many items', () => {
        let data;
        const longnames = Object.keys(longnameToKind).filter((longname) =>
          longname.startsWith('Sandwich')
        );
        let rendered;

        allLongnamesTree = filteredTree(longnames);
        data = { allLongnamesTree };
        rendered = template.render('symbol-index.njk', data);

        expect([...rendered.matchAll(/<index-group>/g)]).toBeArrayOfSize(3);
      });

      it('balances the number of items in each column', () => {
        function extract(column, elementName) {
          const regexp = new RegExp(`(?:<${elementName}>[\\s\\S]+?<\\/${elementName}>)`, 'g');
          const items = [...column.matchAll(regexp)];

          return _.flatten(items);
        }

        let columns;
        let data;
        const longnames = Object.keys(longnameToKind).filter((longname) =>
          longname.startsWith('Sandwich')
        );
        let rendered;

        allLongnamesTree = filteredTree(longnames);
        data = { allLongnamesTree };
        rendered = template.render('symbol-index.njk', data);
        columns = extract(rendered, 'index-group');

        expect(extract(columns[0], 'index-item')).toBeArrayOfSize(4);
        expect(extract(columns[1], 'index-item')).toBeArrayOfSize(4);
        expect(extract(columns[2], 'index-item')).toBeArrayOfSize(3);
      });
    });
  });
});
