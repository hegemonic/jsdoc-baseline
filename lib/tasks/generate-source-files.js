const { CATEGORIES } = require('../enums');
const fs = require('fs-extra');
const GenerateFiles = require('./generate-files');
const helper = require('jsdoc/util/templateHelper');
const Ticket = require('../ticket');

module.exports = class GenerateSourceFiles extends GenerateFiles {
    run(ctx) {
        let rejectedPromise;
        const sourceFiles = ctx.sourceFiles;

        this.tickets = [];

        for (const file of Object.keys(sourceFiles)) {
            const sourceFile = sourceFiles[file];
            const data = {
                docs: null,
                pageCategory: CATEGORIES.SOURCES,
                pageTitle: sourceFile,
                pageTitlePrefix: ctx.pageTitlePrefix
            };
            let url;

            try {
                // Links are keyed to the shortened path.
                url = helper.getUniqueFilename(sourceFile);
                helper.registerLink(sourceFile, url);

                data.docs = fs.readFileSync(file, ctx.template.encoding);
            }
            catch (e) {
                // TODO: Send to message bus
                rejectedPromise = Promise.reject(e);
                break;
            }

            this.tickets.push(new Ticket({
                data,
                url,
                viewName: 'source'
            }));
        }

        return rejectedPromise || super.run(ctx);
    }
};
