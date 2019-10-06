const fs = require('fs-extra');
const ow = require('ow');
const path = require('path');
const { Task } = require('@jsdoc/task-runner');

module.exports = class CopyFiles extends Task {
    constructor(opts) {
        super(opts);

        this.destination = opts.destination;
        this.sourceFiles = opts.sourceFiles;
        this.func = () => {
            const created = new Set();
            const destination = this.destination;
            const filePaths = this.sourceFiles;

            return Promise.all(filePaths.map(async sourceFile => {
                const destFilePath = path.resolve(destination, sourceFile.relative);
                const destParentPath = path.dirname(destFilePath);

                if (!created.has(destParentPath)) {
                    await fs.ensureDir(destParentPath);
                    created.add(destParentPath);
                }

                await fs.copyFile(sourceFile.absolute, destFilePath);
            }));
        };
    }

    run(ctx) {
        ow(ctx, ow.optional.object);
        ow(this.destination, ow.optional.string);
        ow(this.sourceFiles, ow.array.ofType(ow.object.hasKeys('absolute', 'parent', 'relative')));

        try {
            this.destination = this.destination || ctx.config.destination;
        } catch (e) {
            return Promise.reject(e);
        }

        return super.run(ctx);
    }
};
