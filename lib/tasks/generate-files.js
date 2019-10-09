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
