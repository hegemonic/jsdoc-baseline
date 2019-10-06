const { Task } = require('@jsdoc/task-runner');
const Template = require('../template');

module.exports = class CreateTemplate extends Task {
    constructor(opts) {
        super(opts);

        this.func = ctx => {
            ctx.template = new Template(ctx.templateConfig);

            return Promise.resolve();
        };
    }
};
