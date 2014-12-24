// Helper functions for testing the Baseline template.

'use strict';

var path = require('path');

// Provides a template-rendering function that can be shared across modules.
exports.render = function() {
    exports.setup();

    return exports.template.render.apply(exports.template, arguments);
};

// Resets global variables used by JSDoc to the default values for tests.
function resetJsdocGlobals() {
    global.env = {
        conf: {
            tags: {},
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
}

// Sets up the runtime environment so that JSDoc can work properly. Called automatically when this
// module is loaded.
exports.setup = resetJsdocGlobals;

exports.template = (function() {
    var Template;

    exports.setup();
    Template = require('../../lib/template');

    return new Template('.').init();
})();
