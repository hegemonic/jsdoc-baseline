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
import { TaskRunner } from '@jsdoc/task-runner';
import _ from 'lodash';

import { loadConfigSync } from './lib/config.js';
import { db } from './lib/db.js';
import tasks from './lib/default-tasks.js';
import DocletHelper from './lib/doclethelper.js';

export async function publish(taffyData, dependencies) {
  const options = dependencies.get('options');
  const templateConfig = loadConfigSync(dependencies);
  const allConfig = _.defaults(
    {},
    {
      templates: {
        baseline: templateConfig,
      },
    },
    options,
    { opts: options }
  );
  const context = {
    config: allConfig,
    dependencies,
    templateConfig,
  };
  const docletHelper = new DocletHelper(dependencies);
  const runner = new TaskRunner();

  docletHelper.addDoclets(taffyData);
  context.doclets = db({
    config: allConfig,
    values: docletHelper.allDoclets,
  });
  context.sourceFiles = docletHelper.shortPaths;

  runner.addTasks(tasks);
  try {
    await runner.run(context);
  } catch (e) {
    // TODO: Send to message bus
    return Promise.reject(e);
  }

  return Promise.resolve();
}
