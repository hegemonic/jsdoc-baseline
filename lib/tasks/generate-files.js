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

import path from 'node:path';

import { Task } from '@jsdoc/task-runner';
import fs from 'fs-extra';

import { KIND_TO_CATEGORY } from '../enums.js';

export default class GenerateFiles extends Task {
  constructor(opts) {
    super(opts);

    this.tickets = opts.tickets || [];

    this.func = (ctx) => {
      try {
        const beautify = ctx.templateConfig.beautify;
        const packageInfo = ctx.package;
        const promises = [];
        const template = ctx.template;
        const tickets = this.tickets;

        tickets.forEach((ticket) => {
          const options = {
            beautify,
          };
          let output;
          const outputFile = path.join(ctx.destination, ticket.url);
          const outputDir = path.dirname(outputFile);
          let promise = Promise.resolve();

          ticket.data.href = ticket.url;
          if (!ticket.data.package) {
            ticket.data.package = packageInfo;
          }
          ticket.data.tocData = ctx.tocData;
          // Only beautify HTML files.
          if (path.extname(ticket.url) !== '.html') {
            options.beautify = false;
          }

          // TODO: Replace with async method. (For some reason, calling `fs.ensureDir` in
          // this class's tests used the real `fs` instead of the mock. Need to figure out
          // why.)
          fs.ensureDirSync(outputDir);
          promise = promise.then(
            async () => {
              output = await template.render(ticket.viewName, ticket.data, options);

              return fs.writeFile(outputFile, output);
            },
            (e) => Promise.reject(e)
          );

          promises.push(promise);
        });

        return Promise.all(promises);
      } catch (e) {
        return Promise.reject(e);
      }
    };
  }

  static categorizeDoclets(doclets, sortKeys) {
    const categorized = {};

    if (!doclets) {
      return categorized;
    }

    doclets = Array.from(doclets);
    if (sortKeys?.length) {
      GenerateFiles.sortDoclets(doclets, sortKeys);
    }

    for (const kind of Object.keys(KIND_TO_CATEGORY)) {
      const category = KIND_TO_CATEGORY[kind];
      const found = doclets.filter((d) => d.kind === kind);

      if (found.length) {
        categorized[category] = (categorized[category] ?? []).concat(found);
      }
    }

    return categorized;
  }

  static sortDoclets(doclets, sortKeys) {
    const keys = sortKeys.slice().reverse();

    doclets.sort((a, b) => {
      let result = 0;

      for (const key of keys) {
        if (a[key] > b[key] || (b[key] && !a[key])) {
          result = 1;
        }
        if (a[key] < b[key] || (a[key] && !b[key])) {
          result = -1;
        }
      }

      return result;
    });
  }
}
