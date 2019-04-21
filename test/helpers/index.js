// Helper functions for testing the Baseline template.

const deepExtend = require('deep-extend');
const path = require('path');

// Create a new, fully initialized Template object with the specified configuration settings.
exports.createTemplate = config => {
    let defaultConfig;
    let Template;

    config = config || {};

    exports.setup();
    defaultConfig = require('../../lib/config')
        .loadSync('', '.')
        .get();
    Template = require('../../lib/template');

    config = deepExtend({}, defaultConfig, config);

    return new Template(config).init();
};

// Render a Handlebars view.
exports.render = (...args) => exports.template.render(...args);

// Reset environment variables used by JSDoc to the default values for tests.
function resetJsdocEnv() {
    const env = require('jsdoc/env');

    env.conf = {
        tags: {
            dictionaries: ['jsdoc']
        },
        templates: {
            cleverLinks: false,
            monospaceLinks: false
        }
    };
    env.dirname = path.resolve(__dirname, '../../node_modules/jsdoc');
    env.opts = {
        // list of source files parsed by JSDoc
        _: [],
        // encoding for reading/writing files
        encoding: 'utf8',
        // destination for template output
        destination: './out/',
        // path to the JSDoc template
        template: path.resolve(__dirname, '../..')
    };
    env.version = {
        number: '1.2.3.4'
    };
}

// Set up the runtime environment so that JSDoc can work properly.
exports.setup = resetJsdocEnv;

// Shared template object.
exports.template = (() => exports.createTemplate())();
