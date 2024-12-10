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

import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import { Task } from '@jsdoc/task-runner';

import { loadConfigSync } from '../../../lib/config.js';
import tasks from '../../../lib/default-tasks.js';
import { Publisher } from '../../../lib/publisher.js';

const __dirname = dirname(fileURLToPath(import.meta.url));

describe('Publisher', () => {
  it('is a constructor', () => {
    function create() {
      return new Publisher();
    }

    expect(create).not.toThrow();
  });

  it('sets `docletStore`', () => {
    const fakeStore = {};
    const publisher = new Publisher(fakeStore);

    expect(publisher.docletStore).toBe(fakeStore);
  });

  it('sets `env`', () => {
    const fakeEnv = {};
    const publisher = new Publisher(null, fakeEnv);

    expect(publisher.env).toBe(fakeEnv);
  });

  it('sets `tasks`', () => {
    const publisher = new Publisher();

    expect(publisher.tasks).toBe(tasks);
  });

  describe('init', () => {
    let env;
    let fakeStore;
    let publisher;
    let templateConfig;

    beforeEach(() => {
      env = helpers.env;
      env.conf.templates.baseline = resolve(__dirname, '../../fixtures/config.json');
      fakeStore = {};
      publisher = new Publisher(fakeStore, env);
      templateConfig = loadConfigSync(env);
    });
    afterEach(() => helpers.setup());

    it('sets `config`', async () => {
      await publisher.init();

      expect(publisher.config).toBeObject();
      expect(publisher.config.opts).toBe(env.opts);
      expect(publisher.config.templates.baseline).toEqual(templateConfig);
      for (const opt of Object.keys(env.opts)) {
        expect(publisher.config[opt]).toBe(env.opts[opt]);
      }
    });

    it('sets `context`', async () => {
      await publisher.init();

      expect(publisher.context).toBeObject();
      expect(publisher.context.config).toBe(publisher.config);
      expect(publisher.context.docletStore).toBe(publisher.docletStore);
      expect(publisher.context.env).toBe(publisher.env);
      expect(publisher.context.templateConfig).toBe(publisher.templateConfig);
    });

    it('sets `templateConfig`', async () => {
      await publisher.init();

      expect(publisher.templateConfig).toEqual(templateConfig);
    });
  });

  describe('publish', () => {
    it('runs the tasks', async () => {
      let a = false;
      let b = false;
      let publisher;

      class TaskA extends Task {
        constructor() {
          const opts = {
            name: 'TaskA',
            func: () => {
              a = true;

              return Promise.resolve();
            },
            dependsOn: [],
          };

          super(opts);
        }
      }

      class TaskB extends Task {
        constructor() {
          const opts = {
            name: 'TaskB',
            func: () => {
              b = true;

              return Promise.resolve();
            },
            dependsOn: ['TaskA'],
          };

          super(opts);
        }
      }

      publisher = new Publisher({}, helpers.env);
      await publisher.init();
      publisher.tasks = [new TaskA(), new TaskB()];
      await publisher.publish();

      expect(a).toBeTrue();
      expect(b).toBeTrue();
    });
  });
});
