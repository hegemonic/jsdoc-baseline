const CopyFiles = require('./copy-files');
const GenerateCoreDocs = require('./generate-core-docs');
const GenerateFiles = require('./generate-files');
const GenerateGlobals = require('./generate-globals');
const GenerateIndex = require('./generate-index');
const GenerateSourceFiles = require('./generate-source-files');
const GenerateToc = require('./generate-toc');
const SetContext = require('./set-context');

module.exports = {
    CopyFiles,
    GenerateCoreDocs,
    GenerateFiles,
    GenerateGlobals,
    GenerateIndex,
    GenerateSourceFiles,
    GenerateToc,
    SetContext
};
