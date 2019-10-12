const t = require('./tasks');

module.exports = config => ({
    copyStaticFiles: new t.CopyFiles({
        name: 'copyStaticFiles',
        // TODO: Get these values from the context instead.
        destination: config.destination,
        sourceFiles: config.templates.baseline.staticFiles
    }),
    generateGlobals: new t.GenerateGlobals({
        name: 'generateGlobals',
        dependsOn: ['setContext']
    }),
    generateIndex: new t.GenerateIndex({
        name: 'generateIndex',
        dependsOn: ['setContext']
    }),
    generateSourceFiles: new t.GenerateSourceFiles({
        name: 'generateSourceFiles',
        dependsOn: ['setContext']
    }),
    generateToc: new t.GenerateToc({
        name: 'generateToc',
        dependsOn: ['setContext']
    }),
    setContext: new t.SetContext({
        name: 'setContext'
    })
});
