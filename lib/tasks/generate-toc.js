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
const GenerateFiles = require('./generate-files');
const { name } = require('@jsdoc/core');
const Ticket = require('../ticket');

module.exports = class GenerateToc extends GenerateFiles {
    constructor(opts) {
        super(opts);

        this.url = opts.url;
    }

    run(ctx) {
        const targets = [];
        const tocData = [];

        class TocItem {
            constructor(item, children) {
                this.label = ctx.linkManager.createLink(item.longname, {
                    linkText: name.stripNamespace(item.name)
                });
                this.id = item.longname;
                this.children = children || [];
            }
        }

        function addItems(data) {
            Object.keys(data).sort().forEach(key => {
                const item = data[key];
                let tocEntry;

                if (item) {
                    tocEntry = new TocItem(item);

                    if (!targets.length) {
                        tocData.push(tocEntry);
                    } else {
                        targets[targets.length - 1].children.push(tocEntry);
                    }

                    targets.push(tocEntry);
                    if (item.children) {
                        addItems(item.children);
                    }
                    targets.pop();
                }
            });
        }

        try {
            // If there are globals, force their TOC item to come first.
            if (ctx.globals.value().length) {
                addItems({
                    'global': {
                        name: 'Globals',
                        longname: 'global',
                        children: []
                    }
                });
            }
            addItems(ctx.navTree);

            this.tickets = [
                new Ticket({
                    data: { tocData },
                    url: this.url,
                    viewName: 'toc.njk'
                })
            ];

            return super.run(ctx);
        } catch (e) {
            return Promise.reject(e);
        }
    }
};
