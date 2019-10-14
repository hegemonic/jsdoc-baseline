const { db } = require('../../lib/db');
const helper = require('jsdoc/util/templateHelper');
const { KIND_TO_CATEGORY, OUTPUT_FILE_CATEGORIES } = require('../enums');
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

module.exports = class SetContext extends Task {
    constructor(opts) {
        super(opts);

        this.globalKinds = defaultGlobalKinds.slice(0);
        this.func = ctx => {
            try {
                // TODO: Use `Set`?
                const allLongnames = ctx.allLongnames = [];
                const globalKinds = this.globalKinds;
                const globals = [];
                // TODO: Use `Set`?
                const needsOutputFile = ctx.needsOutputFile = {};

                ctx.template = new Template(ctx.templateConfig);

                // Claim some special filenames in advance.
                helper.registerLink('index', helper.getUniqueFilename('index'));
                helper.registerLink('global', helper.getUniqueFilename('global'));

                // Get destination from config.
                ctx.destination = ctx.config.opts.destination;

                // Setup tasks that require iterating over all doclets.
                for (const doclet of ctx.doclets.value()) {
                    const category = KIND_TO_CATEGORY[doclet.kind];
                    const longname = doclet.longname;

                    // Track globals.
                    if (doclet.scope === 'global' && globalKinds.includes(doclet.kind)) {
                        globals.push(doclet);
                    }

                    if (longname) {
                        // Add the longname to the list if necessary.
                        if (!allLongnames.includes(longname)) {
                            allLongnames.push(longname);
                        }

                        // Identify longnames for which we generate an output file.
                        if (OUTPUT_FILE_CATEGORIES.includes(category)) {
                            needsOutputFile[longname] = true;
                        }

                        helper.registerLink(longname, helper.createLink(doclet));
                    }
                }

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
