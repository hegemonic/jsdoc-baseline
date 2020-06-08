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
const path = require('path');
const { Task } = require('@jsdoc/task-runner');

module.exports = class GenerateFiles extends Task {
    constructor(opts) {
        super(opts);

        this.tickets = opts.tickets || [];

        this.func = ctx => {
            try {
                const beautify = ctx.templateConfig.beautify;
                const packageInfo = ctx.package;
                const promises = [];
                const template = ctx.template;
                const tickets = this.tickets;

                tickets.forEach(ticket => {
                    const options = {
                        beautify
                    };
                    let output;
                    const outputFile = path.join(ctx.destination, ticket.url);
                    const outputDir = path.dirname(outputFile);
                    let promise = Promise.resolve();

                    if (!ticket.data.package) {
                        ticket.data.package = packageInfo;
                    }
                    // Only beautify HTML files.
                    if (path.extname(ticket.url) !== '.html') {
                        options.beautify = false;
                    }
                    output = template.render(ticket.viewName, ticket.data, options);

                    // TODO: Replace with async method. (For some reason, calling `fs.ensureDir` in
                    // this class's tests used the real `fs` instead of the mock. Need to figure out
                    // why.)
                    fs.ensureDirSync(outputDir);
                    promise = promise.then(
                        () => fs.writeFile(outputFile, output),
                        e => Promise.reject(e)
                    );

                    promises.push(promise);
                });

                return Promise.all(promises);
            } catch (e) {
                return Promise.reject(e);
            }
        };
    }
};
