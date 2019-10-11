const { CATEGORIES } = require('../enums');
const db = require('../db');
const GenerateFiles = require('./generate-files');
const helper = require('jsdoc/util/templateHelper');
const Ticket = require('../ticket');

// TODO: Should this list be longer? Should we restrict this at all?
const globalKinds = [
    'constant',
    'function',
    'member',
    'typedef'
];

module.exports = class GenerateGlobals extends GenerateFiles {
    findGlobals(doclets) {
        return doclets
            .filter(doclet => doclet.scope === 'global' && globalKinds.includes(doclet.kind))
            .value();
    }

    run(ctx) {
        let data;
        const globals = this.findGlobals(ctx.doclets);
        const template = ctx.template;
        let title;
        let url;

        if (!globals.length) {
            return Promise.resolve();
        }

        title = template.translate(`headings.${CATEGORIES.GLOBALS}`, globals.length);
        data = {
            members: db({
                values: globals
            }).categorize().value(),
            pageCategory: null,
            pageHeading: template.translate(`headings.${CATEGORIES.GLOBALS}`, globals.length),
            pageTitle: template.translate('pageTitleNoCategory', {
                prefix: ctx.pageTitlePrefix,
                title
            }),
            pageTitlePrefix: ctx.pageTitlePrefix
        };
        url = helper.longnameToUrl.global;

        this.tickets = [
            new Ticket({
                data,
                url,
                viewName: 'globals'
            })
        ];

        return super.run(ctx);
    }
};
