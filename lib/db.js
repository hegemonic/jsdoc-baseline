const { KIND_TO_CATEGORY } = require('./enums');
const lodash = require('lodash');
const ow = require('ow');

function pruner(access, doclet) {
    // By default, we remove:
    //
    // + Doclets that explicitly declare that they should be ignored
    // + "Undocumented" doclets (usually code with no JSDoc comment; might also include some odd
    //   artifacts of the parsing process)
    // + Doclets that claim to belong to an anonymous scope
    if (doclet.ignore === true) {
        return true;
    }
    if (doclet.undocumented === true) {
        return true;
    }
    if (doclet.memberof === '<anonymous>') {
        return true;
    }

    // We also remove private doclets by default, unless the user told us not to.
    if ((!access.length || (!access.includes('all') && !access.includes('private'))) &&
        doclet.access === 'private') {
        return true;
    }

    if (access.length && !access.includes('all')) {
        // The string `undefined` needs special treatment.
        if (!access.includes('undefined') && (doclet.access === null || doclet.access === undefined)) {
            return true;
        }
        // For other access levels, we can just check whether the user asked us to keep that level.
        if (!access.includes('package') && doclet.access === 'package') {
            return true;
        }
        if (!access.includes('private') && doclet.access === 'private') {
            return true;
        }
        if (!access.includes('protected') && doclet.access === 'protected') {
            return true;
        }
        if (!access.includes('public') && doclet.access === 'public') {
            return true;
        }
    }

    return false;
}

const mixins = {
    categorize: doclets => {
        const categorized = {};

        for (const kind of Object.keys(KIND_TO_CATEGORY)) {
            const category = KIND_TO_CATEGORY[kind];
            const found = doclets.filter(d => d.kind === kind);

            if (found.length) {
                categorized[category] = (categorized[category] || []).concat(found);
            }
        }

        return categorized;
    },
    prune: (_, access, doclets) => {
        _.remove(doclets, d => pruner(access, d));

        return doclets;
    }
};

module.exports = ({ config, values }) => {
    ow(config, ow.optional.object);
    if (config) {
        ow(config.opts, ow.object);
        ow(config.opts.access, ow.optional.array.ofType(ow.string));
    }
    ow(values, ow.array);

    const _ = lodash.runInContext();
    const access = (config && config.opts && config.opts.access) ? config.opts.access : [];

    _.mixin({
        categorize: mixins.categorize,
        prune: doclets => mixins.prune(_, access, doclets)
    });

    return _.chain(values.slice(0));
};
