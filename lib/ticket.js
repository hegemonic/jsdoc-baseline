const ow = require('ow');

module.exports = class Ticket {
    constructor(opts = {}) {
        ow(opts, ow.object);
        ow(opts.data, ow.optional.object);
        ow(opts.name, ow.optional.string);
        ow(opts.url, ow.optional.string);
        ow(opts.viewName, ow.optional.string);

        this.data = opts.data;
        this.name = opts.name;
        this.url = opts.url;
        this.viewName = opts.viewName;
    }
};
