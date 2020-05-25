const { CATEGORIES, KIND_TO_CATEGORY, OUTPUT_FILE_CATEGORIES } = require('../enums');
const { db } = require('../../lib/db');
const helper = require('jsdoc/util/templateHelper');
const { name } = require('@jsdoc/core');
const { Task } = require('@jsdoc/task-runner');
const Template = require('../template');

const defaultGlobalKinds = (() => {
    const kinds = [];

    for (const kind of Object.keys(KIND_TO_CATEGORY)) {
        // The globals page can include anything other than:
        //
        // + Packages
        // + Doclets that cause the template to generate an output file
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

        this.globalKinds = defaultGlobalKinds.slice();
        this.func = ctx => {
            try {
                const doclets = ctx.doclets;
                const workspace = {
                    allDocletsByLongname: {},
                    allLongnames: [],
                    events: {},
                    globals: [],
                    listeners: {},
                    needsOutputFile: {}
                };

                ctx.template = new Template(ctx.templateConfig);

                // Claim some special filenames before anything else has a chance to get them.
                this._claimSpecialFilenames();

                for (const doclet of doclets.value()) {
                    this._handleDoclet(doclet, ctx, workspace);
                }

                this._addListenersToEvents(workspace);
                this._updateContext(ctx, workspace);
            } catch (e) {
                return Promise.reject(e);
            }

            return Promise.resolve();
        };
    }

    // If an event has listeners, add the listeners to the event doclet.
    // TODO: Add this info to the context, not the doclets.
    _addListenersToEvents({ events, listeners }) {
        for (const key of Object.keys(events)) {
            let docletsToUpdate;

            if ({}.hasOwnProperty.call(listeners, key)) {
                docletsToUpdate = events[key];
                for (const d of docletsToUpdate) {
                    d.listeners = (d.listeners || []).concat(listeners[key]);
                }
            }
        }
    }

    _claimSpecialFilenames() {
        helper.registerLink('index', helper.getUniqueFilename('index'));
        helper.registerLink('global', helper.getUniqueFilename('global'));
    }

    _handleDoclet(doclet, ctx, workspace) {
        const {
            allDocletsByLongname,
            allLongnames,
            events,
            globals,
            listeners,
            needsOutputFile
        } = workspace;
        const category = KIND_TO_CATEGORY[doclet.kind];
        // Remove the variation, if any, from the longname.
        // TODO: Don't strip the variation from the actual doclet here; do it in the template.
        const longname = doclet.longname = name.stripVariation(doclet.longname);

        if (doclet.kind === 'package' && !ctx.package) {
            ctx.package = isValidPackage(doclet) ? doclet : undefined;

            // The rest of this method isn't relevant to packages.
            return;
        }

        // Track events.
        if (category === CATEGORIES.EVENTS) {
            events[longname] = events[longname] || [];
            events[longname].push(doclet);
        }

        // Track which events, if any, this symbol listens to.
        if (doclet.listens && doclet.listens.length) {
            for (const listensTo of doclet.listens) {
                listeners[listensTo] = listeners[listensTo] || [];
                listeners[listensTo].push(longname);
            }
        }

        // Track globals.
        if (doclet.scope === 'global' && this.globalKinds.includes(doclet.kind)) {
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

    _updateContext(ctx, workspace) {
        ctx.allLongnames = workspace.allLongnames;
        ctx.allLongnamesTree = helper.longnamesToTree(
            workspace.allLongnames,
            workspace.allDocletsByLongname
        );
        ctx.destination = ctx.config.opts.destination;
        ctx.globals = db({
            values: workspace.globals
        });
        ctx.navTree = helper.longnamesToTree(Object.keys(workspace.needsOutputFile));
        ctx.needsOutputFile = workspace.needsOutputFile;

        if (!ctx.package || !ctx.package.name) {
            ctx.pageTitlePrefix = '';
        } else {
            ctx.pageTitlePrefix = ctx.template.translate('pageTitlePrefix', {
                name: ctx.package.name,
                version: ctx.package.version || ''
            });
        }
    }
};
