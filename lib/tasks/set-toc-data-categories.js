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

import { Task } from '@jsdoc/task-runner';
import _ from 'lodash';

import { CATEGORIES, CATEGORY_TO_KIND } from '../enums.js';

export const DEFAULT_CATEGORIES = [
  CATEGORIES.MODULES,
  CATEGORIES.EXTERNALS,
  CATEGORIES.NAMESPACES,
  CATEGORIES.CLASSES,
  CATEGORIES.INTERFACES,
  CATEGORIES.EVENTS,
  CATEGORIES.MIXINS,
];

function docletsForCategory(docletMap, category) {
  let doclets = [];
  const toKind = CATEGORY_TO_KIND[category];

  for (const kind of toKind) {
    if (docletMap.has(kind)) {
      doclets = doclets.concat(Array.from(docletMap.get(kind)));
    }
  }

  doclets = _.sortBy(doclets, ['name', 'longname']);

  return doclets;
}

export default class SetTocDataCategories extends Task {
  func(ctx) {
    const docletsByKind = ctx.docletStore.docletsByKind;
    const globalCount = ctx.docletStore.globals.size;
    let globalHref;
    const linkManager = ctx.linkManager;
    const tocCategories = ctx.tocCategories ?? DEFAULT_CATEGORIES;
    const tocData = [];

    // If there are globals, show their TOC item first.
    if (globalCount) {
      globalHref = linkManager.getUrl('global');
      tocData.push({
        category: 'globals',
        hrefs: [globalHref],
        items: [
          {
            href: globalHref,
            id: 'global',
            label: ctx.template.translate('headings.globals', globalCount),
          },
        ],
        nameCount: {},
      });
    }

    for (const category of tocCategories) {
      const doclets = docletsForCategory(docletsByKind, category);
      let hrefs;
      let items = [];
      const nameCount = {};

      if (doclets.length) {
        doclets.forEach((doclet) => {
          const { longname, name } = doclet;
          // Track the number of doclets with the same `name`. We use this information to decide
          // what label to show in the TOC.
          const count = nameCount[name] ?? 0;

          nameCount[name] = count + 1;

          items.push({
            href: linkManager.getUrl(longname),
            id: longname,
            label: name,
          });
        });
        hrefs = items.map((item) => item.href);

        tocData.push({ category, hrefs, items, nameCount });
      }
    }

    ctx.tocData = tocData;

    return Promise.resolve();
  }
}
