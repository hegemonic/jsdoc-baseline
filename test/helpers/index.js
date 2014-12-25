// Helper functions for testing the Baseline template.

'use strict';

var path = require('path');

// Render a Handlebars view.
exports.render = function() {
    return exports.template.render.apply(exports.template, arguments);
};

// Reset global variables used by JSDoc to the default values for tests.
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

// Set up the runtime environment so that JSDoc can work properly.
exports.setup = resetJsdocGlobals;

// Shared template object.
exports.template = (function() {
    var Template;

    exports.setup();
    Template = require('../../lib/template');

    return new Template('.').init();
})();
