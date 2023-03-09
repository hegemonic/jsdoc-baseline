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

import fs from 'fs-extra';

import { CATEGORIES } from '../enums.js';
import Ticket from '../ticket.js';
import GenerateFiles from './generate-files.js';

export default class GenerateSourceFiles extends GenerateFiles {
  run(ctx) {
    try {
      const sourceFiles = ctx.sourceFiles;

      this.tickets = [];

      for (const file of Object.keys(sourceFiles)) {
        const sourceFile = sourceFiles[file];
        const data = {
          docs: null,
          filename: path.basename(sourceFile),
          filenameExtension: path.extname(sourceFile).replace('.', ''),
          pageCategory: CATEGORIES.SOURCES,
          pageTitle: sourceFile,
          pageTitlePrefix: ctx.pageTitlePrefix,
        };
        let url;

        // Links are keyed to the shortened path.
        url = ctx.linkManager.getUri(sourceFile);
        data.docs = fs.readFileSync(file, ctx.template.encoding);

        this.tickets.push(
          new Ticket({
            data,
            url,
            viewName: 'source.njk',
          })
        );
      }
    } catch (e) {
      return Promise.reject(e);
    }

    return super.run(ctx);
  }
}
