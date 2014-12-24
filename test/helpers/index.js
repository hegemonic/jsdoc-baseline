// Helper functions for testing the Baseline template.

'use strict';

var path = require('path');
var temp = require('temp').track();

var tempPath = null;

var TEMP_DIRECTORY = exports.TEMP_DIRECTORY = 'baseline-test';

// Creates a temp directory relative to the main temp directory.
exports.createTempDirectory = function createTempDirectory(dirPath) {
    var resolvedPath;

    // create the main temp directory if necessary
    if (!tempPath) {
        resolvedPath = tempPath = temp.mkdirSync(TEMP_DIRECTORY);
    }

    if (dirPath) {
        resolvedPath = path.resolve(TEMP_DIRECTORY, dirPath);
        temp.mkdirSync(dirPath);
    }

    return resolvedPath;
};

// Resets global variables used by JSDoc to the default values for tests.
// TODO: this is also used in the gulpfile, so find another place for it
exports.resetJsdocGlobals = function resetJsdocGlobals() {
    global.env = {
        conf: {
            templates: {
                cleverLinks: false,
                monospaceLinks: false
            }
        },
        dirname: path.resolve(__dirname, '../../node_modules/jsdoc'),
        opts: {
            // list of source files parsed by JSDoc
            _: [],
            // encoding for reading/writing files
            encoding: 'utf8',
            // destination for template output
            destination: './out/',
            // path to the JSDoc template
            template: path.resolve(__dirname, '../..')
        }
    };
};

// Sets up the runtime environment so that JSDoc can work properly.
exports.setup = exports.resetJsdocGlobals;
