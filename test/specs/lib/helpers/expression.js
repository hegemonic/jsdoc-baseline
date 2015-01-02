'use strict';

describe('lib/helpers/expression', function() {
    var expression;
    var handlebars = require('handlebars');
    var helpers = require('../../../helpers');
    var SafeString = handlebars.SafeString;
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

        describe('describeType', function() {
            var catharsis = require('catharsis');

            var parsedType = catharsis.parse('!string');

            it('should use "unknown type" if no type is provided', function() {
                var description = instance.describeType(undefined);

                expect(description).toBeInstanceOf(SafeString);
                expect(description.toString()).toBe('unknown');
            });

            it('should throw if the requested format is not available', function() {
                function shouldThrow() {
                    return instance.describeType(parsedType, 'marshmallow');
                }

                expect(shouldThrow).toThrow();
            });

            it('should return the simple description by default', function() {
                var description = instance.describeType(parsedType);

                expect(description).toBeInstanceOf(SafeString);
                expect(description.toString()).toBe('non-null string');
            });

            it('should return the extended format\'s description by default when the format is ' +
                '"extended"', function() {
                var description = instance.describeType(parsedType, 'extended');

                expect(description).toBeInstanceOf(SafeString);
                expect(description.toString()).toBe('string');
            });

            it('should return the requested property when the format is "extended"', function() {
                var description = instance.describeType(parsedType, 'extended',
                    'modifiers.nullable');

                expect(description).toBeInstanceOf(SafeString);
                expect(description.toString()).toBe('Must not be null.');
            });
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

        describe('jsdocVersion', function() {
            it('should return the version number as a string', function() {
                // look for the fake version number set by the test helpers
                expect(instance.jsdocVersion()).toBe('1.2.3.4');
            });
        });

        describe('json', function() {
            it('should JSON-stringify its argument', function() {
                var stringified = instance.json({foo: 'bar'});

                expect(stringified).toBeInstanceOf(SafeString);
                expect(stringified.toString()).toBe('{"foo":"bar"}');
            });
        });

        xdescribe('keys', function() {
            // TODO
        });

        xdescribe('labels', function() {
            // TODO
        });

        describe('licenseLink', function() {
            it('should return a URL if a valid license ID is specified', function() {
                expect(instance.licenseLink('MIT')).toContain('http://');
            });

            it('should return the license ID if no link is found', function() {
                expect(instance.licenseLink('fuzzy-bunny')).toBe('fuzzy-bunny');
            });
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

                expect(link).toBeInstanceOf(SafeString);
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

        describe('modifierText', function() {
            it('should return text if the doclet is nullable', function() {
                var fakeDoclet = {
                    nullable: true
                };
                var text = instance.modifierText(fakeDoclet);

                expect(text).toBeInstanceOf(SafeString);
                expect(text.toString()).not.toBe('');
            });

            it('should return text if the doclet is non-nullable', function() {
                var fakeDoclet = {
                    nullable: false
                };
                var text = instance.modifierText(fakeDoclet);

                expect(text).toBeInstanceOf(SafeString);
                expect(text.toString()).not.toBe('');
            });

            it('should return text if the doclet has a "variable" property set to true',
                function() {
                var fakeDoclet = {
                    variable: true
                };
                var text = instance.modifierText(fakeDoclet);

                expect(text).toBeInstanceOf(SafeString);
                expect(text.toString()).not.toBe('');
            });

            it('should return text if the doclet has a default value and is not an enum',
                function() {
                var fakeDoclet = {
                    defaultValue: '1'
                };
                var text = instance.modifierText(fakeDoclet);

                expect(text).toBeInstanceOf(SafeString);
                expect(text.toString()).not.toBe('');
            });

            it('should not return text if the doclet has a default value and is an enum',
                function() {
                var fakeDoclet = {
                    defaultValue: '1',
                    isEnum: true
                };
                var text = instance.modifierText(fakeDoclet);

                expect(text).toBeInstanceOf(SafeString);
                expect(text.toString()).toBe('');
            });
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
