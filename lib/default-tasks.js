/*
    Copyright 2014-2019 Google LLC

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
const path = require('path');
const t = require('./tasks');

module.exports = {
    copyStaticFiles: new t.CopyStaticFiles({
        name: 'copyStaticFiles',
        dependsOn: ['setContext']
    }),
    generateCoreDocs: new t.GenerateCoreDocs({
        name: 'generateCoreDocs',
        dependsOn: [
            'generateSourceFiles',
            'setContext'
        ]
    }),
    generateGlobals: new t.GenerateGlobals({
        name: 'generateGlobals',
        dependsOn: [
            'generateSourceFiles',
            'setContext'
        ]
    }),
    generateIndex: new t.GenerateIndex({
        name: 'generateIndex',
        dependsOn: ['setContext']
    }),
    generateSourceFiles: new t.GenerateSourceFiles({
        name: 'generateSourceFiles',
        dependsOn: ['setContext']
    }),
    generateToc: new t.GenerateToc({
        name: 'generateToc',
        dependsOn: ['setContext'],
        url: path.join('scripts', 'jsdoc-toc.js')
    }),
    setContext: new t.SetContext({
        name: 'setContext'
    })
};
