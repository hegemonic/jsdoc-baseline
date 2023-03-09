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
import { name } from '@jsdoc/core';
import { Task } from '@jsdoc/task-runner';

class TocEntry {
  constructor(item, ctx) {
    const labelText = name.stripNamespace(item.name);

    this.descendantHrefs = [];
    this.href = ctx.linkManager.getUri(item.longname);
    this.id = item.longname;
    this.kind = item.doclet ? item.doclet.kind : 'namespace';
    this.label = labelText;
    this.children = [];
  }
}

function addItems(data, tocData, ctx, stack = []) {
  Object.keys(data)
    .sort()
    .forEach((key) => {
      const item = data[key];
      let tocEntry;

      if (item) {
        tocEntry = new TocEntry(item, ctx);

        if (!stack.length) {
          tocData.push(tocEntry);
        } else {
          stack[stack.length - 1].children.push(tocEntry);
        }

        // Add the current entry's href to each ancestor's list of descendant hrefs. We use this
        // information to decide whether to expand each TOC node at page load.
        stack.forEach((entry) => {
          entry.descendantHrefs.push(tocEntry.href);
        });

        stack.push(tocEntry);
        if (item.children) {
          addItems(item.children, tocData, ctx, stack);
        }
        stack.pop();
      }
    });
}

export default class SetTocData extends Task {
  constructor(opts) {
    super(opts);
  }

  run(ctx) {
    let tocData = [];

    // If there are globals, force their TOC item to come first.
    if (ctx.globals.value().length) {
      addItems(
        {
          global: {
            name: 'Globals',
            longname: 'global',
            children: [],
          },
        },
        tocData,
        ctx
      );
    }
    addItems(ctx.navTree, tocData, ctx);

    ctx.tocData = tocData;

    return Promise.resolve();
  }
}
