const { db } = require('../../lib/db');
const helper = require('jsdoc/util/templateHelper');
const { CATEGORIES, KIND_TO_CATEGORY, OUTPUT_FILE_CATEGORIES } = require('../enums');
const { Task } = require('@jsdoc/task-runner');
const Template = require('../template');

const defaultGlobalKinds = (() => {
    const kinds = [];

    for (const kind of Object.keys(KIND_TO_CATEGORY)) {
        // The globals page can include anything other than a) packages and b) doclets that cause us
        // to generate an output file.
        if (kind !== 'package' && !OUTPUT_FILE_CATEGORIES.includes(KIND_TO_CATEGORY[kind])) {
            kinds.push(kind);
        }
    }

    return kinds;
})();

function isValidPackage(doclet) {
    return doclet && doclet.kind === 'package' && doclet.longname !== 'package:undefined';
}

module.exports = class SetContext extends Task {
    constructor(opts) {
        super(opts);

        this.globalKinds = defaultGlobalKinds.slice(0);
        this.func = ctx => {
            try {
                const allDocletsByLongname = {};
                // TODO: Use `Set`?
                const allLongnames = ctx.allLongnames = [];
                const doclets = ctx.doclets;
                const eventDoclets = {};
                const globalKinds = this.globalKinds;
                const globals = [];
                const listeners = {};
                // TODO: Use `Set`?
                const needsOutputFile = ctx.needsOutputFile = {};

                ctx.template = new Template(ctx.templateConfig);

                // Claim some special filenames in advance.
                helper.registerLink('index', helper.getUniqueFilename('index'));
                helper.registerLink('global', helper.getUniqueFilename('global'));

                // Get destination from config.
                ctx.destination = ctx.config.opts.destination;

                // Setup tasks that require iterating over all doclets.
                for (const doclet of doclets.value()) {
                    const category = KIND_TO_CATEGORY[doclet.kind];
                    const longname = doclet.longname;

                    if (doclet.kind === 'package' && !ctx.package) {
                        ctx.package = isValidPackage(doclet) ? doclet : undefined;
                        // The rest of this loop isn't relevant to packages.
                        continue;
                    }

                    // Track events.
                    if (category === CATEGORIES.EVENTS) {
                        eventDoclets[longname] = eventDoclets[longname] || [];
                        eventDoclets[longname].push(doclet);
                    }

                    // Track which events, if any, this symbol listens to.
                    if (doclet.listens && doclet.listens.length) {
                        for (const listensTo of doclet.listens) {
                            listeners[listensTo] = listeners[listensTo] || [];
                            listeners[listensTo].push(longname);
                        }
                    }

                    // Track globals.
                    if (doclet.scope === 'global' && globalKinds.includes(doclet.kind)) {
                        globals.push(doclet);
                    }

                    if (longname) {
                        // Add the longname to the list if necessary.
                        if (!allLongnames.includes(longname)) {
                            allLongnames.push(longname);
                        }

                        // Track the doclet by its longname.
                        allDocletsByLongname[longname] = doclet;

                        // Identify longnames for which we generate an output file.
                        if (OUTPUT_FILE_CATEGORIES.includes(category)) {
                            needsOutputFile[longname] = true;
                        }

                        helper.registerLink(longname, helper.createLink(doclet));
                    }
                }

                // If an event has listeners, add the listeners to the event doclet.
                // TODO: Find a way to add this info to the context, not the doclets.
                for (const key of Object.keys(eventDoclets)) {
                    let docletsToUpdate;

                    if ({}.hasOwnProperty.call(listeners, key)) {
                        docletsToUpdate = eventDoclets[key];
                        for (const d of docletsToUpdate) {
                            d.listeners = (d.listeners || []).concat(listeners[key]);
                        }
                    }
                }

                // Set page title prefix.
                if (ctx.package && ctx.package.name) {
                    ctx.pageTitlePrefix = ctx.template.translate('pageTitlePrefix', {
                        name: ctx.package.name,
                        version: ctx.package.version || ''
                    });
                } else {
                    ctx.pageTitlePrefix = '';
                }

                // Set tree of all known longnames.
                ctx.allLongnamesTree = helper.longnamesToTree(allLongnames, allDocletsByLongname);

                // Add globals in `db` form.
                ctx.globals = db({
                    values: globals
                });
                // Add data for the nav tree.
                ctx.navTree = helper.longnamesToTree(Object.keys(needsOutputFile));
            } catch (e) {
                return Promise.reject(e);
            }

            return Promise.resolve();
        };
    }
};
