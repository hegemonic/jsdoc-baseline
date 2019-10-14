/*
    Copyright 2014-2019 Google LLC

    Licensed under the Apache License, Version 2.0 (the "License");
    you may not use this file except in compliance with the License.
    You may obtain a copy of the License at

        https://www.apache.org/licenses/LICENSE-2.0

    Unless required by applicable law or agreed to in writing, software
    distributed under the License is distributed on an "AS IS" BASIS,
    WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
    See the License for the specific language governing permissions and
    limitations under the License.
*/
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
            try {
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
            } catch (e) {
                return Promise.reject(e);
            }
        };
    }

    run(ctx) {
        try {
            ow(ctx, ow.optional.object);
            ow(this.destination, ow.optional.string);
            ow(this.sourceFiles, ow.array.ofType(ow.object.hasKeys('absolute', 'parent', 'relative')));

            this.destination = this.destination || ctx.config.destination;
        } catch (e) {
            return Promise.reject(e);
        }

        return super.run(ctx);
    }
};
