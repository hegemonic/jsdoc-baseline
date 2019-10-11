const t = require('./tasks');

module.exports = config => ({
    copyStaticFiles: new t.CopyFiles({
        name: 'copyStaticFiles',
        destination: config.destination,
        sourceFiles: config.templates.baseline.staticFiles
    }),
    createTemplate: new t.CreateTemplate({
        name: 'createTemplate'
    }),
    generateGlobals: new t.GenerateGlobals({
        name: 'generateGlobals',
        dependsOn: ['createTemplate']
    }),
    generateSourceFiles: new t.GenerateSourceFiles({
        name: 'generateSourceFiles',
        dependsOn: ['createTemplate']
    })
});
