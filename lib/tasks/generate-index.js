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
const fs = require('fs-extra');
const GenerateFiles = require('./generate-files');
const Ticket = require('../ticket');

module.exports = class GenerateIndex extends GenerateFiles {
    constructor(opts) {
        super(opts);

        this.url = opts.url;
    }

    run(ctx) {
        try {
            const data = {
                allLongnamesTree: ctx.allLongnamesTree,
                package: ctx.package,
                pageTitle: ctx.template.translate('pageTitleNoCategory', {
                    prefix: ctx.pageTitlePrefix,
                    title: ctx.template.translate('brandDefault')
                }),
                // TODO: Figure out why `fs.readFile` doesn't get mocked correctly.
                readme: ctx.readme ? fs.readFileSync(ctx.readme, ctx.template.encoding) : null
            };

            this.url = this.url || ctx.linkManager.getUri('index');

            this.tickets = [
                new Ticket({
                    data,
                    url: this.url,
                    viewName: 'index.njk'
                })
            ];
        } catch (e) {
            return Promise.reject(e);
        }

        return super.run(ctx);
    }
};
