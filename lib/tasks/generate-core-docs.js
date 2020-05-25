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
const { CATEGORIES, OUTPUT_FILE_CATEGORIES } = require('../enums');
const GenerateFiles = require('./generate-files');
const helper = require('jsdoc/util/templateHelper');
const { name } = require('@jsdoc/core');
const Ticket = require('../ticket');

const MODULE_CAT = CATEGORIES.MODULES;

function shouldGenerate(category, categorized) {
    if (!OUTPUT_FILE_CATEGORIES.includes(category)) {
        return false;
    }

    // If there's a module with the same longname, and we're not looking at modules right now, don't
    // generate output.
    // TODO: Do we discard the extraneous doclets before we get here? If so, remove this check.
    if (category !== MODULE_CAT && categorized[MODULE_CAT] && categorized[MODULE_CAT].length) {
        return false;
    }

    return true;
}

module.exports = class GenerateCoreDocs extends GenerateFiles {
    run(ctx) {
        let allDoclets;

        this.tickets = [];

        try {
            allDoclets = ctx.doclets;

            for (const longname of Object.keys(ctx.needsOutputFile)) {
                const doclets = allDoclets
                    .filter(d => d.longname === longname)
                    .categorize()
                    .value();
                const memberOfDoclets = allDoclets
                    .filter(d => d.memberof === longname)
                    .categorize()
                    .value();

                // TODO: What happens here if you have incorrect/weird input (for example, two
                // doclets with the same longname, but one is a class and the other is an
                // interface)?
                for (const category of Object.keys(doclets)) {
                    if (!shouldGenerate(category, doclets)) {
                        continue;
                    }

                    this.tickets.push(new Ticket({
                        data: {
                            docs: doclets[category],
                            members: memberOfDoclets,
                            pageCategory: category,
                            pageTitle: name.stripNamespace(name.toParts(longname).name),
                            pageTitlePrefix: ctx.pageTitlePrefix
                        },
                        url: helper.longnameToUrl[longname],
                        viewName: 'symbol'
                    }));
                }
            }

            return super.run(ctx);
        } catch (e) {
            return Promise.reject(e);
        }
    }
};
