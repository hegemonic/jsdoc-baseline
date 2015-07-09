// Helper functions for testing the Baseline template.

'use strict';

var deepExtend = require('deep-extend');
var path = require('path');

// Create a new, fully initialized Template object with the specified configuration settings.
exports.createTemplate = function(config) {
    var defaultConfig;
    var Template;

    config = config || {};

    exports.setup();
    defaultConfig = require('../../lib/config').loadSync('', '.').get();
    Template = require('../../lib/template');

    config = deepExtend({}, defaultConfig, config);

    return new Template(config).init();
};

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
    return exports.createTemplate();
})();
