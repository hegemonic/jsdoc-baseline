const db = require('../../lib/db');
const helper = require('jsdoc/util/templateHelper');
const { KIND_TO_CATEGORY, OUTPUT_FILE_CATEGORIES } = require('../enums');
const { Task } = require('@jsdoc/task-runner');
const Template = require('../template');

// TODO: Should this list be longer? Should we restrict this at all?
const defaultGlobalKinds = [
    'constant',
    'function',
    'member',
    'typedef'
];

module.exports = class SetContext extends Task {
    constructor(opts) {
        super(opts);

        this.globalKinds = defaultGlobalKinds.slice(0);
        this.func = ctx => {
            let allLongnames;
            let globalKinds;
            const globals = [];
            let needsOutputFile;

            try {
                // TODO: Use `Set` for these (except `globalKinds`).
                allLongnames = ctx.allLongnames = [];
                globalKinds = this.globalKinds;
                needsOutputFile = ctx.needsOutputFile = {};

                ctx.template = new Template(ctx.templateConfig);

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
