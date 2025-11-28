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

import * as name from '@jsdoc/name';

import { CATEGORIES, OUTPUT_FILE_CATEGORIES } from '../enums.js';
import Ticket from '../ticket.js';
import GenerateFiles from './generate-files.js';

const MODULE_CATEGORY = CATEGORIES.MODULES;

function shouldGenerate(category, categorized) {
  if (!OUTPUT_FILE_CATEGORIES.includes(category)) {
    return false;
  }

  // If there's a module with the same longname, and we're not looking at modules right now, don't
  // generate output.
  // TODO: Do we discard the extraneous doclets before we get here? If so, remove this check.
  if (category !== MODULE_CATEGORY && categorized[MODULE_CATEGORY]?.length) {
    return false;
  }

  return true;
}

function findModuleExports(longname, docletStore) {
  const exportDoclets = Array.from(docletStore.docletsByLongname.get(longname));

  return exportDoclets.filter(
    ({ type, description, kind }) => (type || description || kind === 'class') && kind !== 'module'
  );
}

export default class GenerateCoreDocs extends GenerateFiles {
  func(ctx) {
    const { docletStore, templateConfig } = ctx;

    try {
      for (const longname of Object.keys(ctx.needsOutputFile)) {
        const doclets = GenerateCoreDocs.categorizeDoclets(
          docletStore.docletsByLongname.get(longname),
          templateConfig?.docletSortKeys
        );
        const memberofDoclets = GenerateCoreDocs.categorizeDoclets(
          docletStore.docletsByMemberof.get(longname),
          templateConfig?.docletSortKeys
        );

        // TODO: What happens here if you have incorrect/weird input (for example, two
        // doclets with the same longname, but one is a class and the other is an
        // interface)?
        for (const category of Object.keys(doclets)) {
          let exports;

          if (!shouldGenerate(category, doclets)) {
            continue;
          }

          if (category === MODULE_CATEGORY) {
            exports = findModuleExports(longname, docletStore);
          }

          this.tickets.push(
            new Ticket({
              data: {
                docs: doclets[category],
                exports,
                members: memberofDoclets,
                pageCategory: category,
                pageTitle: name.stripNamespace(name.toParts(longname).name),
                pageTitlePrefix: ctx.pageTitlePrefix,
              },
              url: ctx.linkManager.getUrl(longname),
              viewName: 'symbol.njk',
            })
          );
        }
      }

      return super.func(ctx);
    } catch (e) {
      return Promise.reject(e);
    }
  }
}
