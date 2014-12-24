// Helper functions for testing the Baseline template.

'use strict';

var path = require('path');

var template;

// Provides a template-rendering function that can be shared across modules.
exports.render = function() {
    var Template;

    exports.setup();

    if (!template) {
        Template = require('../../lib/template');
        template = new Template('.').init();
    }

    return template.render.apply(template, arguments);
};

// Resets global variables used by JSDoc to the default values for tests.
exports.resetJsdocGlobals = function() {
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
