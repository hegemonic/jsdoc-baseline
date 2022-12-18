/*
    Copyright 2014-2020 Google LLC

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
describe('lib/template', () => {
  const { defaultConfig } = require('../../../lib/config');
  let instance; // eslint-disable-line no-unused-vars
  const Template = require('../../../lib/template');

  beforeEach(() => {
    instance = new Template(defaultConfig, helpers.deps);
  });

  it('should be a constructor', () => {
    expect(Template).toBeFunction();
    expect(new Template(defaultConfig, helpers.deps)).toBeInstanceOf(Template);
  });

  xdescribe('render', () => {
    xit('TODO: Write me');
  });

  xdescribe('translate', () => {
    xit('TODO: Write me');
  });
});
