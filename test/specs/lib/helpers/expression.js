'use strict';

describe('lib/helpers/expression', function() {
    var expression;
    var handlebars = require('handlebars');
    var helpers = require('../../../helpers');
    var templateHelper = require('jsdoc/util/templateHelper');

    helpers.setup();
    expression = require('../../../../lib/helpers/expression');

    it('should export a function', function() {
        expect(typeof expression).toBe('function');
    });

    it('should return an object', function() {
        var instance = expression(helpers.template);
        expect(typeof instance).toBe('object');
    });

    describe('helpers', function() {
        var instance = expression(helpers.template);

        xdescribe('_decrementHeading', function() {
            // TODO
        });

        xdescribe('_headingLevel', function() {
            // TODO
        });

        xdescribe('_incrementHeading', function() {
            // TODO
        });

        xdescribe('ancestors', function() {
            // TODO
        });

        xdescribe('config', function() {
            // TODO
        });

        xdescribe('continuedId', function() {
            // TODO
        });

        xdescribe('continuedIdNext', function() {
            // TODO
        });

        xdescribe('cssClass', function() {
            // TODO
        });

        xdescribe('debug', function() {
            // TODO
        });

        xdescribe('describeType', function() {
            // TODO
        });

        xdescribe('example', function() {
            // TODO
        });

        xdescribe('formatParams', function() {
            // TODO
        });

        xdescribe('generatedBy', function() {
            // TODO
        });

        xdescribe('group', function() {
            // TODO
        });

        describe('hasModifiers', function() {
            it('should treat the "defaultValue" property as a modifier for non-enums', function() {
                var fakeDoclet = {
                    defaultValue: 'foo'
                };
                var hasModifiers = instance.hasModifiers(fakeDoclet);

                expect(hasModifiers).toBe(true);
            });

            it('should not treat the "defaultValue" property as a modifier for enums', function() {
                var fakeDoclet = {
                    defaultValue: 'foo',
                    isEnum: true
                };
                var hasModifiers = instance.hasModifiers(fakeDoclet);

                expect(hasModifiers).toBe(false);
            });

            it('should treat the "nullable" property as a modifier', function() {
                var fakeDoclet = {
                    nullable: true
                };
                var hasModifiers = instance.hasModifiers(fakeDoclet);

                expect(hasModifiers).toBe(true);
            });

            it('should not treat the "optional" property as a modifier', function() {
                var fakeDoclet = {
                    optional: true
                };
                var hasModifiers = instance.hasModifiers(fakeDoclet);

                expect(hasModifiers).toBe(false);
            });

            it('should treat the "variable" (repeatable) property as a modifier', function() {
                var fakeDoclet = {
                    variable: true
                };
                var hasModifiers = instance.hasModifiers(fakeDoclet);

                expect(hasModifiers).toBe(true);
            });
        });

        xdescribe('id', function() {
            // TODO
        });

        xdescribe('isContinued', function() {
            // TODO
        });

        xdescribe('jsdocVersion', function() {
            // TODO
        });

        xdescribe('json', function() {
            // TODO
        });

        xdescribe('keys', function() {
            // TODO
        });

        xdescribe('labels', function() {
            // TODO
        });

        xdescribe('licenseLink', function() {
            // TODO
        });

        xdescribe('link', function() {
            // TODO
        });

        xdescribe('linkLongnameWithSignature', function() {
            // TODO
        });

        describe('linkToLine', function() {
            // TODO: more tests

            it('should ignore the context object', function() {
                var fakeDocletMeta = {
                    lineno: 70,
                    shortpath: 'glitch.js'
                };
                var link;

                templateHelper.registerLink('glitch.js', 'glitch.js.html');
                link = instance.linkToLine(fakeDocletMeta, {});

                expect(link instanceof handlebars.SafeString).toBe(true);
                expect(link.toString()).toBe(
                    '<a href="glitch.js.html#source-line-70">glitch.<wbr>js:70</a>'
                );
            });
        });

        xdescribe('linkToTutorial', function() {
            // TODO
        });

        xdescribe('linkWithSignature', function() {
            // TODO
        });

        xdescribe('modifierText', function() {
            // TODO
        });

        xdescribe('moveChildren', function() {
            // TODO
        });

        xdescribe('needsSignature', function() {
            // TODO
        });

        xdescribe('packageLink', function() {
            // TODO
        });

        xdescribe('parseType', function() {
            // TODO
        });

        xdescribe('pluck', function() {
            // TODO
        });

        xdescribe('resolveAuthorLinks', function() {
            // TODO
        });

        xdescribe('resolveLinks', function() {
            // TODO
        });

        xdescribe('returnTypes', function() {
            // TODO
        });

        xdescribe('see', function() {
            // TODO
        });

        xdescribe('setRootProperty', function() {
            // TODO
        });

        xdescribe('shouldHighlight', function() {
            // TODO
        });

        xdescribe('translate', function() {
            // TODO
        });

        xdescribe('translateHeading', function() {
            // TODO
        });

        xdescribe('translatePageTitle', function() {
            // TODO
        });

        xdescribe('typeUnion', function() {
            // TODO
        });
    });
});
