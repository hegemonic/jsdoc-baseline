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

import _ from 'lodash';

import tasks from '../../../../lib/tasks/index.js';

const expectedTasks = [
  'CopyStaticFiles',
  'GenerateCoreDocs',
  'GenerateFiles',
  'GenerateGlobals',
  'GenerateIndex',
  'GenerateSourceFiles',
  'SetContext',
  'SetTocData',
  'SetTocDataTree',
];

describe('lib/tasks/index', () => {
  it('is an object', () => {
    expect(tasks).toBeObject();
  });

  for (const key of expectedTasks) {
    const fileName = _.kebabCase(key);

    it(`is lib/tasks/${fileName}`, async () => {
      const { default: klass } = await import(`../../../../lib/tasks/${fileName}.js`);

      expect(tasks[key]).toBe(klass);
    });
  }
});
