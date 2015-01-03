'use strict';

describe('lib/publishjob', function() {
    var instance;
    var fs = new (require('fake-fs'))();
    var PublishJob = require('../../../lib/publishjob');
    var Template = require('../../../lib/template');

    beforeEach(function() {
        var template = new Template('.').init();

        // must create the instance before patching `fs` so the template resources can be loaded
        instance = new PublishJob(template, {
            destination: '/path/to/destination'
        });

        fs.patch();
    });

    afterEach(function() {
        fs.unpatch();
    });

    it('should be a constructor', function() {
        fs.unpatch();

        expect(PublishJob).toBeFunction();
        expect(new PublishJob(new Template('.'), {})).toBeInstanceOf(PublishJob);
    });

    xdescribe('copyStaticFiles', function() {
        // TODO
    });

    xdescribe('createOutputDirectory', function() {
        // TODO
    });

    xdescribe('generate', function() {
        // TODO
    });

    xdescribe('generateByLongname', function() {
        // TODO
    });

    xdescribe('generateGlobals', function() {
        // TODO
    });

    xdescribe('generateIndex', function() {
        // TODO
    });

    xdescribe('generateSourceFiles', function() {
        // TODO
    });

    xdescribe('generateTocData', function() {
        // TODO
    });

    xdescribe('generateTutorials', function() {
        // TODO
    });

    xdescribe('render', function() {
        // TODO
    });

    xdescribe('setPackage', function() {
        // TODO
    });
});
