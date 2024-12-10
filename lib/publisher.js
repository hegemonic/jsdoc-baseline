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

import { loadConfigSync } from './config.js';
import tasks from './default-tasks.js';

export class Publisher {
  constructor(docletStore, env) {
    this.docletStore = docletStore;
    this.env = env;
    this.tasks = tasks;
  }

  init() {
    const options = this.env.options;
    const templateConfig = loadConfigSync(this.env);
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

    this.config = allConfig;
    this.context = {
      config: allConfig,
      docletStore: this.docletStore,
      env: this.env,
      templateConfig,
    };
    this.templateConfig = templateConfig;

    return Promise.resolve();
  }

  publish() {
    const runner = new TaskRunner();

    runner.addTasks(this.tasks);

    return runner.run(this.context);
  }
}
