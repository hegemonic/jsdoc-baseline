const GenerateFiles = require('./generate-files');
const helper = require('jsdoc/util/templateHelper');
const name = require('jsdoc/name');
const Ticket = require('../ticket');

module.exports = class GenerateToc extends GenerateFiles {
    constructor(opts) {
        super(opts);

        this.url = opts.url || 'scripts/jsdoc-toc.js';
    }

    run(ctx) {
        const targets = [];
        const tocData = [];

        class TocItem {
            constructor(item, children) {
                this.label = helper.linkto(item.longname, name.stripNamespace(item.name));
                this.id = item.longname;
                this.children = children || [];
            }
        }

        function addItems(data) {
            Object.keys(data).sort().forEach(key => {
                const item = data[key];
                let tocEntry;

                if (item) {
                    tocEntry = new TocItem(item);

                    if (!targets.length) {
                        tocData.push(tocEntry);
                    } else {
                        targets[targets.length - 1].children.push(tocEntry);
                    }

                    targets.push(tocEntry);
                    if (item.children) {
                        addItems(item.children);
                    }
                    targets.pop();
                }
            });
        }

        try {
            // If there are globals, force their TOC item to come first.
            if (ctx.globals.value().length) {
                addItems({
                    'global': {
                        name: 'Globals',
                        longname: 'global',
                        children: []
                    }
                });
            }
            addItems(ctx.navTree);

            this.tickets = [
                new Ticket({
                    data: { tocData },
                    url: this.url,
                    viewName: 'toc'
                })
            ];
        } catch (e) {
            return Promise.reject(e);
        }

        return super.run(ctx);
    }
};
