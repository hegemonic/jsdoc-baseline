const ow = require('ow');
const path = require('path');

module.exports = class FileInfo {
    constructor(parentPath, relativeChildPath) {
        ow(parentPath, ow.string);
        ow(relativeChildPath, ow.string);

        this.absolute = path.join(parentPath, relativeChildPath);
        this.parent = parentPath;
        this.relative = relativeChildPath;
    }
};
