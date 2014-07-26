/*global describe, expect, it, xit */
/*eslint max-nested-callbacks: 0 */

'use strict';

require('expectations');
require('./helpers/').setup();

describe('publish', function() {
    var publish = require('../publish');

    it('exports a "publish" function', function() {
        expect(publish.publish).toBeDefined();
        expect(typeof publish.publish).toBe('function');
    });

    it('publish', function() {
        xit('creates the output directory', function() {
            // TODO
        });

        xit('copies static files to the output directory', function() {
            // TODO
        });

        xit('generates an index page', function() {
            // TODO
        });

        xit('generates a globals page when there are globals', function() {
            // TODO
        });

        xit('does not generate a globals page when there are no globals', function() {
            // TODO
        });

        xit('generates source files by default', function() {
            // TODO
        });

        xit('does not generate source files if the user disabled them', function() {
            // TODO
        });

        xit('generates docs for tutorials if necessary', function() {
            // TODO
        });

        xit('generates output files for doclets that get their own output file', function() {
            // TODO
        });

        xit('does not generate output files for doclets that do not get their own output file',
            function() {
            // TODO
        });
    });
});
