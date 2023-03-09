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

export default class CopyFiles extends Task {
  constructor(opts) {
    super(opts);

    this.tickets = opts.tickets || [];

    this.func = (ctx) => {
      try {
        const promises = [];
        const tickets = this.tickets;

        tickets.forEach((ticket) => {
          const outputFile = path.join(ctx.destination, ticket.url);
          const outputDir = path.dirname(outputFile);
          let promise = Promise.resolve();

          promise = promise
            .then(
              () => fs.ensureDir(outputDir),
              (e) => Promise.reject(e)
            )
            .then(
              () => fs.copyFile(ticket.source, outputFile),
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
}
