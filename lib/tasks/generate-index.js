const GenerateFiles = require('./generate-files');
const helper = require('jsdoc/util/templateHelper');
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
                readme: ctx.readme
            };

            this.url = this.url || helper.longnameToUrl.index;

            this.tickets = [
                new Ticket({
                    data,
                    url: this.url,
                    viewName: 'index'
                })
            ];
        } catch (e) {
            return Promise.reject(e);
        }

        return super.run(ctx);
    }
};
