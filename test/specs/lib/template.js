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

import { defaultConfig } from '../../../lib/config.js';
import Template from '../../../lib/template.js';

describe('lib/template', () => {
  let instance; // eslint-disable-line no-unused-vars

  beforeEach(() => {
    instance = Template.create(defaultConfig, {}, helpers.deps);
  });

  it('should be a constructor', () => {
    expect(Template).toBeFunction();
    expect(new Template(defaultConfig, {}, helpers.deps)).toBeInstanceOf(Template);
  });

  xdescribe('render', () => {
    xit('TODO: Write me');
  });

  xdescribe('translate', () => {
    xit('TODO: Write me');
  });
});
