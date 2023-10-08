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

import { CATEGORIES } from '../enums.js';
import Ticket from '../ticket.js';
import GenerateFiles from './generate-files.js';

export default class GenerateGlobals extends GenerateFiles {
  constructor(opts) {
    super(opts);

    this.url = opts.url;
  }

  run(ctx) {
    let data;
    const { docletStore, template, templateConfig } = ctx;
    let globals;
    let title;

    try {
      globals = Array.from(docletStore.globals);

      if (!globals.length) {
        return Promise.resolve();
      }

      this.url ??= ctx.linkManager.getUri('global');

      title = template.translate(`headings.${CATEGORIES.GLOBALS}`, globals.length);
      data = {
        members: GenerateGlobals.categorizeDoclets(globals, templateConfig?.docletSortKeys),
        pageCategory: null,
        pageHeading: template.translate(`headings.${CATEGORIES.GLOBALS}`, globals.length),
        pageTitle: template.translate('pageTitleNoCategory', {
          prefix: ctx.pageTitlePrefix,
          title,
        }),
        pageTitlePrefix: ctx.pageTitlePrefix,
      };

      this.tickets = [
        new Ticket({
          data,
          url: this.url,
          viewName: 'globals.njk',
        }),
      ];
    } catch (e) {
      return Promise.reject(e);
    }

    return super.run(ctx);
  }
}
