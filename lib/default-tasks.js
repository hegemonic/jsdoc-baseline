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

import t from './tasks/index.js';

export default {
  copyStaticFiles: new t.CopyStaticFiles({
    name: 'copyStaticFiles',
    dependsOn: ['setContext'],
  }),
  generateCoreDocs: new t.GenerateCoreDocs({
    name: 'generateCoreDocs',
    dependsOn: ['generateSourceFiles', 'setContext', 'setTocDataTree'],
  }),
  generateGlobals: new t.GenerateGlobals({
    name: 'generateGlobals',
    dependsOn: ['generateSourceFiles', 'setContext', 'setTocDataTree'],
  }),
  generateIndex: new t.GenerateIndex({
    name: 'generateIndex',
    dependsOn: ['setContext', 'setTocDataTree'],
  }),
  generateSourceFiles: new t.GenerateSourceFiles({
    name: 'generateSourceFiles',
    dependsOn: ['setContext', 'setTocDataTree'],
  }),
  setTocDataTree: new t.SetTocDataTree({
    name: 'setTocDataTree',
    dependsOn: ['setContext'],
  }),
  setContext: new t.SetContext({
    name: 'setContext',
  }),
};
