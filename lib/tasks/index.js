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
const CopyFiles = require('./copy-files');
const CopyStaticFiles = require('./copy-static-files');
const GenerateCoreDocs = require('./generate-core-docs');
const GenerateFiles = require('./generate-files');
const GenerateGlobals = require('./generate-globals');
const GenerateIndex = require('./generate-index');
const GenerateSourceFiles = require('./generate-source-files');
const GenerateToc = require('./generate-toc');
const SetContext = require('./set-context');

module.exports = {
  CopyFiles,
  CopyStaticFiles,
  GenerateCoreDocs,
  GenerateFiles,
  GenerateGlobals,
  GenerateIndex,
  GenerateSourceFiles,
  GenerateToc,
  SetContext,
};
