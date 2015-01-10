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
            tags: {
                dictionaries: ['jsdoc']
            },
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
        },
        version: {
            number: '1.2.3.4'
        }
    };
}

// Set up the runtime environment so that JSDoc can work properly.
exports.setup = resetJsdocGlobals;

// Shared template object.
exports.template = (function() {
    var conf;
    var Template;

    exports.setup();
    conf = require('../../lib/config').loadSync('', '.').get();
    Template = require('../../lib/template');

    return new Template(conf).init();
})();
