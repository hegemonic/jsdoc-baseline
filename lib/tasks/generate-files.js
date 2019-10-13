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
const fs = require('fs-extra');
const ow = require('ow');
const path = require('path');
const { Task } = require('@jsdoc/task-runner');

module.exports = class GenerateFiles extends Task {
    constructor(opts) {
        super(opts);

        this.tickets = opts.tickets || [];

        this.func = ctx => {
            ow(this.tickets, ow.array.ofType(ow.object));

            const promises = [];
            const template = ctx.template;
            const encoding = template.encoding;

            // TODO: Warn if there are no tickets
            // TODO: Debug: number of tickets

            for (const ticket of this.tickets) {
                const options = {
                    beautify: ctx.templateConfig.beautify
                };
                let output;
                let outputFile;
                let outputPath;

                try {
                    outputFile = path.join(ctx.destination, ticket.url);
                    outputPath = path.dirname(outputFile);
                    fs.ensureDirSync(outputPath);
                } catch (e) {
                    return Promise.reject(e);
                }

                if (!ticket.data.package) {
                    ticket.data.package = ctx.package;
                }

                // Only beautify HTML files.
                if (path.extname(ticket.url) !== '.html') {
                    options.beautify = false;
                }

                // TODO: Send to message bus
                // logger.debug('Rendering template output for %s with view %s', url, viewName);
                output = template.render(ticket.viewName, ticket.data, options);

                promises.push(fs.writeFile(outputFile, output, encoding));
            }

            return Promise.all(promises);
        };
    }
};
