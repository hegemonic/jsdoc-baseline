const { CATEGORIES, OUTPUT_FILE_CATEGORIES } = require('../enums');
const GenerateFiles = require('./generate-files');
const helper = require('jsdoc/util/templateHelper');
const name = require('jsdoc/name');
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
                            pageTitle: name.stripNamespace(name.shorten(longname).name),
                            pageTitlePrefix: ctx.pageTitlePrefix
                        },
                        url: helper.longnameToUrl[longname],
                        viewName: 'symbol'
                    }));
                }
            }
        } catch (e) {
            return Promise.reject(e);
        }

        return super.run(ctx);
    }
};
