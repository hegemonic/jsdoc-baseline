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
import * as index from '../../index.js';

describe('index', () => {
  it('exports a "publish" function', () => {
    expect(index.publish).toBeDefined();
    expect(index.publish).toBeFunction();
  });

  describe('publish', () => {
    xit('creates the output directory', () => {
      // TODO
    });

    xit('copies static files to the output directory', () => {
      // TODO
    });

    xit('generates an index page', () => {
      // TODO
    });

    xit('generates a globals page when there are globals', () => {
      // TODO
    });

    xit('does not generate a globals page when there are no globals', () => {
      // TODO
    });

    xit('generates source files by default', () => {
      // TODO
    });

    xit('does not generate source files if the user disabled them', () => {
      // TODO
    });

    xit('generates output files for doclets that get their own output file', () => {
      // TODO
    });

    xit('does not generate output files for doclets that do not get their own output file', () => {
      // TODO
    });
  });
});
