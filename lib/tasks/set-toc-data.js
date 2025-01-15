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

import SetTocDataCategories from './set-toc-data-categories.js';
import SetTocDataTree from './set-toc-data-tree.js';

export default class SetTocData extends Task {
  func(ctx) {
    let task;

    if (ctx.templateConfig.toc.type === 'tree') {
      task = new SetTocDataTree({ name: 'setTocDataTree' });
    } else {
      task = new SetTocDataCategories({ name: 'setTocDataCategories' });
    }

    return task.run(ctx);
  }
}
