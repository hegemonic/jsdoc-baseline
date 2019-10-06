const t = require('./tasks');

module.exports = config => ({
    copyStaticFiles: new t.CopyFiles({
        name: 'copyStaticFiles',
        destination: config.destination,
        sourceFiles: config.templates.baseline.staticFiles
    }),
    createTemplate: new t.CreateTemplate({
        name: 'createTemplate'
    })
});
