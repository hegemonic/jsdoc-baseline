'use strict';

describe('lib/helpers/expression', function() {
    var expression;
    var _ = require('underscore-contrib');
    var handlebars = require('handlebars');
    var helpers = require('../../../../helpers');
    var SafeString = handlebars.SafeString;
    var templateHelper = require('jsdoc/util/templateHelper');

    helpers.setup();
    expression = require('../../../../../lib/helpers/expression');

    it('should export a function', function() {
        expect(typeof expression).toBe('function');
    });

    it('should return an object', function() {
        var instance = expression(helpers.template);
        expect(typeof instance).toBe('object');
    });

    describe('helpers', function() {
        // TODO: use a dummy template instance that pulls L10N strings from fixtures/
        var template = helpers.template;
        var instance = expression(template);

        describe('_decrementHeading', function() {
            beforeEach(function() {
                while (instance._headingLevel() > 1) {
                    instance._decrementHeading();
                }
            });

            it('should reduce the heading level by 1', function() {
                var newLevel;
                var oldLevel;

                instance._incrementHeading();
                oldLevel = instance._headingLevel();

                instance._decrementHeading();
                newLevel = instance._headingLevel();

                expect(oldLevel - newLevel).toBe(1);
            });

            it('should not reduce the heading level below 1', function() {
                var newLevel;
                var oldLevel = instance._headingLevel();

                instance._decrementHeading();
                newLevel = instance._headingLevel();

                expect(oldLevel).toBe(1);
                expect(newLevel).toBe(1);
            });
        });

        describe('_headingLevel', function() {
            it('should return a positive number', function() {
                var level = instance._headingLevel();

                expect(level).toBeNumber();
                expect(level).toBeGreaterThan(0);
            });
        });

        describe('_incrementHeading', function() {
            function decrement() {
                while (instance._headingLevel() > 1) {
                    instance._decrementHeading();
                }
            }

            beforeEach(decrement);
            afterEach(decrement);

            it('should increase the heading level by 1', function() {
                var newLevel;
                var oldLevel = instance._headingLevel();

                instance._incrementHeading();
                newLevel = instance._headingLevel();

                expect(newLevel - oldLevel).toBe(1);
            });

            it('should not increase the heading level above 6', function() {
                for (var i = 0, l = 10; i < l; i++) {
                    instance._incrementHeading();
                }

                expect(instance._headingLevel()).toBe(6);
            });
        });

        describe('ancestors', function() {
            var fakeLinks = [
                {
                    longname: 'module:foo',
                    url: 'module-foo.html'
                },
                {
                    longname: 'module:foo/bar',
                    url: 'module-foo_bar.html'
                },
                {
                    longname: 'module:foo/bar.Baz',
                    url: 'module-foo_bar.Baz.html'
                },
                {
                    longname: 'module:foo/bar.Baz#qux',
                    url: 'module-foo_bar.Baz.html#qux'
                }
            ];

            fakeLinks.forEach(function(fakeLink) {
                templateHelper.registerLink(fakeLink.longname, fakeLink.url);
            });

            it('should link to ancestors when no CSS class is specified', function() {
                var ancestors = instance.ancestors('module:foo/bar.Baz#qux');

                expect(ancestors).toBeInstanceOf(SafeString);
                expect(ancestors.toString()).toBe([
                    '<a href="module-foo_bar.html">foo/<wbr>bar</a>',
                    '.<wbr>',
                    '<a href="module-foo_bar.Baz.html">Baz</a>',
                    '#<wbr>'
                ].join(''));
            });

            it('should link to ancestors when a CSS class is specified', function() {
                var ancestors = instance.ancestors('module:foo/bar.Baz', 'frozzle');

                expect(ancestors).toBeInstanceOf(SafeString);
                expect(ancestors.toString()).toBe([
                    '<a href="module-foo_bar.html" class="frozzle">foo/<wbr>bar</a>',
                    '.<wbr>'
                ].join(''));
            });

            it('should return an empty string when there are no ancestors', function() {
                var ancestors = instance.ancestors('module:foo/bar');

                expect(ancestors).toBeInstanceOf(SafeString);
                expect(ancestors.toString()).toBe('');
            });
        });

        describe('basename', function() {
            it('should return the basename of the specified path', function() {
                var filepath = instance.basename('/foo/bar/baz.html');

                expect(filepath).toBeInstanceOf(SafeString);
                expect(filepath.toString()).toBe('baz.html');
            });

            it('should remove the extension if one is specified', function() {
                var filepath = instance.basename('/foo/bar/baz.html', '.html');

                expect(filepath).toBeInstanceOf(SafeString);
                expect(filepath.toString()).toBe('baz');
            });
        });

        xdescribe('config', function() {
            // TODO
        });

        describe('cssClass', function() {
            var cssClasses = template.cssClasses;
            var cssClassPrefix = template.config.cssClassPrefix;

            afterEach(function() {
                template.cssClasses = cssClasses;
                template.config.cssClassPrefix = cssClassPrefix;
            });

            it('should format the class string correctly', function() {
                var classes = instance.cssClass('!foo', {});

                expect(classes).toBeInstanceOf(SafeString);
                expect(classes.toString()).toBe(' class="foo"');
            });

            it('should keep classes prefixed with ! by default, and strip the !', function() {
                var classes = instance.cssClass('!foo', {});

                expect(classes).toBeInstanceOf(SafeString);
                expect(classes.toString()).toContain('"foo"');
            });

            it('should let users change the prefix for classes that it keeps', function() {
                var classes;

                template.config.cssClassPrefix = '?';
                classes = instance.cssClass('?foo', {});

                expect(classes).toBeInstanceOf(SafeString);
                expect(classes.toString()).toContain('"foo"');
            });

            it('should accept multiple classes', function() {
                var classes = instance.cssClass('!foo', '!bar', {});

                expect(classes).toBeInstanceOf(SafeString);
                expect(classes.toString()).toContain('"foo bar"');
            });

            it('should preserve user-specified classes', function() {
                var classes;

                template.cssClasses = {
                    foo: true
                };
                classes = instance.cssClass('foo', {});

                expect(classes).toBeInstanceOf(SafeString);
                expect(classes.toString()).toContain('"foo"');
            });

            it('should not preserve non-user-specific classes', function() {
                var classes = instance.cssClass('foo', {});

                expect(classes).toBe('');
            });

            it('should not preserve classes that the user explicitly does not want', function() {
                var classes;

                template.cssClasses = {
                    foo: false
                };
                classes = instance.cssClass('foo', {});

                expect(classes).toBe('');
            });

            it('should not preserve classes whose names match inherited properties', function() {
                var classes = instance.cssClass('prototype', {});

                expect(classes).toBe('');
            });
        });

        describe('debug', function() {
            it('should log the JSON-stringified arguments at level DEBUG', function() {
                var logger = require('jsdoc/util/logger');

                spyOn(logger, 'debug');

                instance.debug('foo', {
                    bar: 'baz'
                }, { /* fake options object */ });

                expect(logger.debug).toHaveBeenCalled();
                expect(logger.debug).toHaveBeenCalledWith('foo {"bar":"baz"}');
            });
        });

        describe('defined', function() {
            it('should report that a truthy value is defined', function() {
                expect(instance.defined(1)).toBeTrue();
            });

            it('should report that a falsy value is defined', function() {
                expect(instance.defined(0)).toBeTrue();
            });

            it('should report that an undefined value is undefined', function() {
                expect(instance.defined()).toBeFalse();
            });
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

        describe('example', function() {
            it('should work when the example does not have a caption', function() {
                var example = instance.example('Some example text');

                expect(example.caption).toBeUndefined();
                expect(example.code).toBe('Some example text');
            });

            it('should work when the example has a caption', function() {
                var example = instance.example('<caption>Caption here</caption> Some example text');

                expect(example.caption).toBe('Caption here');
                expect(example.code).toBe('Some example text');
            });

            it('should work when there is a newline before the caption and multiple newlines ' +
                'after the caption', function() {
                var example = instance.example('\n<caption>Caption here</caption>\nExample text\n' +
                    'More example text');

                expect(example.caption).toBe('Caption here');
                expect(example.code).toBe('Example text\nMore example text');
            });
        });

        xdescribe('formatParams', function() {
            // TODO: tests
            // TODO: confirm that we respect the user's L10N file if there are no params, rather
            // than always returning `()`
        });

        describe('generatedBy', function() {
            it('should include the JSDoc version number', function() {
                var generatedBy = instance.generatedBy();

                expect(generatedBy).toBeInstanceOf(SafeString);
                expect(generatedBy.toString()).toContain(global.env.version.number);
            });

            it('should include the date', function() {
                var generatedBy = instance.generatedBy();

                expect(generatedBy.toString()).toContain(new Date(Date.now()).getFullYear());
            });
        });

        describe('group', function() {
            var items = [
                'apple',
                'banana',
                'carrot',
                'durian',
                'eggplant',
                'fava bean',
                'grape',
                'horseradish'
            ];

            it('should group the items into the specified number of groups', function() {
                var grouped = instance.group(items, 2);

                expect(grouped).toEqual([
                    [
                        'apple',
                        'banana',
                        'carrot',
                        'durian'
                    ],
                    [
                        'eggplant',
                        'fava bean',
                        'grape',
                        'horseradish'
                    ]
                ]);
            });

            it('should work if the number of items per group is not specified', function() {
                var grouped = instance.group(items);

                expect(grouped).toEqual([
                    [
                        'apple',
                        'banana',
                        'carrot'
                    ],
                    [
                        'durian',
                        'eggplant',
                        'fava bean'
                    ],
                    [
                        'grape',
                        'horseradish'
                    ]
                ]);
            });

            it('should work if the number of groups exceeds the number of items', function() {
                var grouped = instance.group(items, 10);

                expect(grouped).toEqual([
                    [
                        'apple'
                    ],
                    [
                        'banana'
                    ],
                    [
                        'carrot'
                    ],
                    [
                        'durian'
                    ],
                    [
                        'eggplant'
                    ],
                    [
                        'fava bean'
                    ],
                    [
                        'grape'
                    ],
                    [
                        'horseradish'
                    ],
                    [],
                    []
                ]);
            });
        });

        describe('hasModifiers', function() {
            it('should treat the "defaultvalue" property as a modifier for non-enums', function() {
                var fakeDoclet = {
                    defaultvalue: 'foo'
                };
                var hasModifiers = instance.hasModifiers(fakeDoclet, false);

                expect(hasModifiers).toBe(true);
            });

            it('should not treat the "defaultvalue" property as a modifier for enums', function() {
                var fakeDoclet = {
                    defaultvalue: 'foo'
                };
                var hasModifiers = instance.hasModifiers(fakeDoclet, true);

                expect(hasModifiers).toBe(false);
            });

            it('should treat the "nullable" property as a modifier', function() {
                var fakeDoclet = {
                    nullable: true
                };
                var hasModifiers = instance.hasModifiers(fakeDoclet, false);

                expect(hasModifiers).toBe(true);
            });

            it('should not treat the "optional" property as a modifier', function() {
                var fakeDoclet = {
                    optional: true
                };
                var hasModifiers = instance.hasModifiers(fakeDoclet, false);

                expect(hasModifiers).toBe(false);
            });

            it('should treat the "variable" (repeatable) property as a modifier', function() {
                var fakeDoclet = {
                    variable: true
                };
                var hasModifiers = instance.hasModifiers(fakeDoclet, false);

                expect(hasModifiers).toBe(true);
            });
        });

        xdescribe('id', function() {
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

        describe('keys', function() {
            it('should throw an error if the argument is not an object', function() {
                function shouldThrow() {
                    return instance.keys('hello');
                }

                expect(shouldThrow).toThrow();
            });

            it('should return the object\'s keys as an array', function() {
                var keys = instance.keys({
                    foo: true,
                    bar: '1',
                    baz: null
                });

                expect(keys).toBeArray();
                expect(keys.length).toBe(3);

                keys.sort();
                expect(keys[0]).toBe('bar');
                expect(keys[1]).toBe('baz');
                expect(keys[2]).toBe('foo');
            });
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

        describe('link', function() {
            it('should not blow up if only one parameter is provided', function() {
                function makeLink() {
                    return instance.link('foo');
                }

                expect(makeLink).not.toThrow();
            });

            it('should not blow up if only two parameters are provided', function() {
                function makeLink() {
                    return instance.link('foo', 'bar');
                }

                expect(makeLink).not.toThrow();
            });

            it('should not blow up if only three parameters are provided', function() {
                function makeLink() {
                    return instance.link('foo', 'bar', 'baz');
                }

                expect(makeLink).not.toThrow();
            });

            it('should not blow up when a non-string value is passed in', function() {
                function makeLink() {
                    return instance.link(true);
                }

                expect(makeLink).not.toThrow();
                expect(makeLink()).toBeInstanceOf(SafeString);
                expect(makeLink().toString()).toBe('');
            });

            it('should include the requested link text, link class, and fragment ID', function() {
                var link;

                templateHelper.registerLink('linkExpressionHelper', 'foo.html');
                link = instance.link('linkExpressionHelper', 'helpful!', 'classy', 'bar');

                expect(link).toBeInstanceOf(SafeString);
                expect(link.toString()).toBe('<a href="foo.html#bar" class="classy">helpful!</a>');
            });
        });

        xdescribe('linkLongnameWithSignature', function() {
            // TODO
        });

        describe('linkToLine', function() {
            var fakeDocletMeta = {
                lineno: 70,
                shortpath: 'glitch.js'
            };

            templateHelper.registerLink('glitch.js', 'glitch.js.html');

            it('should work when a CSS class is specified', function() {
                var link = instance.linkToLine(fakeDocletMeta, 'foo');

                expect(link).toBeInstanceOf(SafeString);
                expect(link.toString()).toBe(
                    '<a href="glitch.js.html#source-line-70" class="foo">glitch.<wbr>js:70</a>'
                );
            });

            it('should work when no CSS class is specified', function() {
                var link = instance.linkToLine(fakeDocletMeta);

                expect(link).toBeInstanceOf(SafeString);
                expect(link.toString()).toBe(
                    '<a href="glitch.js.html#source-line-70">glitch.<wbr>js:70</a>'
                );
            });

            it('should not do anything with the line number if the code is on line 1', function() {
                var meta = {
                    lineno: 1,
                    shortpath: 'glitch.js'
                };
                var link = instance.linkToLine(meta);

                expect(link).toBeInstanceOf(SafeString);
                expect(link.toString()).toBe(
                    '<a href="glitch.js.html">glitch.<wbr>js</a>'
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
                var text = instance.modifierText(fakeDoclet, false);

                expect(text).toBeInstanceOf(SafeString);
                expect(text.toString()).not.toBe('');
            });

            it('should return text if the doclet is non-nullable', function() {
                var fakeDoclet = {
                    nullable: false
                };
                var text = instance.modifierText(fakeDoclet, false);

                expect(text).toBeInstanceOf(SafeString);
                expect(text.toString()).not.toBe('');
            });

            it('should return text if the doclet has a "variable" property set to true',
                function() {
                var fakeDoclet = {
                    variable: true
                };
                var text = instance.modifierText(fakeDoclet, false);

                expect(text).toBeInstanceOf(SafeString);
                expect(text.toString()).not.toBe('');
            });

            it('should return text if the doclet has a falsy default value', function() {
                var fakeDoclet = {
                    defaultvalue: 0
                };
                var text = instance.modifierText(fakeDoclet, false);

                expect(text).toBeInstanceOf(SafeString);
                expect(text.toString()).toContain('0');
            });

            it('should return text if the doclet has a default value and is not an enum',
                function() {
                var fakeDoclet = {
                    defaultvalue: '1'
                };
                var text = instance.modifierText(fakeDoclet, false);

                expect(text).toBeInstanceOf(SafeString);
                expect(text.toString()).toContain('1');
            });

            it('should not return text if the doclet has a default value and is an enum',
                function() {
                var fakeDoclet = {
                    defaultvalue: '1'
                };
                var text = instance.modifierText(fakeDoclet, true);

                expect(text).toBeInstanceOf(SafeString);
                expect(text.toString()).toBe('');
            });
        });

        describe('needsSignature', function() {
            it('should say that classes need a signature', function() {
                var fakeDoclet = {
                    kind: 'class'
                };

                expect(instance.needsSignature(fakeDoclet)).toBe(true);
            });

            it('should say that functions need a signature', function() {
                var fakeDoclet = {
                    kind: 'function'
                };

                expect(instance.needsSignature(fakeDoclet)).toBe(true);
            });

            it('should say that typedefs need a signature if they contain a function', function() {
                var fakeDoclet = {
                    kind: 'typedef',
                    type: {
                        names: [
                            'function'
                        ]
                    }
                };

                expect(instance.needsSignature(fakeDoclet)).toBe(true);
            });

            it('should say that typedefs do not need a signature if they do not contain a function',
                function() {
                var fakeDoclet = {
                    kind: 'typedef',
                    type: {
                        names: [
                            'Object'
                        ]
                    }
                };

                expect(instance.needsSignature(fakeDoclet)).toBe(false);
            });

            it('should say that other types do not need a signature', function() {
                var fakeDoclet = {
                    kind: 'member'
                };

                expect(instance.needsSignature(fakeDoclet)).toBe(false);
            });
        });

        xdescribe('packageLink', function() {
            // TODO
        });

        xdescribe('parseType', function() {
            // TODO
        });

        describe('pluck', function() {
            it('should return an array of the specified property\'s values', function() {
                var objs = [
                    {
                        foo: true
                    },
                    {
                        foo: 7
                    }
                ];
                var plucked = instance.pluck(objs, 'foo');

                expect(plucked).toBeArray();
                expect(plucked.length).toBe(2);
                expect(plucked[0]).toBe(true);
                expect(plucked[1]).toBe(7);
            });
        });

        describe('reparentItems', function() {
            var tablesConfig = _.getPath(template.config, 'tables');

            beforeEach(function() {
                template.config.tables = {
                    nestedPropertyTables: true
                };
            });

            afterEach(function() {
                template.config.tables = tablesConfig;
            });

            it('should reparent child properties', function() {
                var fakeDoclet = {
                    params: [
                        {
                            name: 'foo'
                        },
                        {
                            name: 'foo.bar'
                        }
                    ]
                };
                var reparented = instance.reparentItems(fakeDoclet, 'params');

                expect(reparented).toEqual([
                    {
                        name: 'foo',
                        children: [
                            {
                                name: 'bar'
                            }
                        ]
                    }
                ]);
            });

            it('should reparent child properties when multiple parameters have properties', function() {
                var fakeDoclet = {
                    params: [
                        {
                            name: 'foo'
                        },
                        {
                            name: 'foo.bar'
                        },
                        {
                            name: 'baz'
                        },
                        {
                            name: 'baz.qux'
                        }
                    ]
                };
                var reparented = instance.reparentItems(fakeDoclet, 'params');

                expect(reparented).toEqual([
                    {
                        name: 'foo',
                        children: [
                            {
                                name: 'bar'
                            }
                        ]
                    },
                    {
                        name: 'baz',
                        children: [
                            {
                                name: 'qux'
                            }
                        ]
                    }
                ]);
            });

            it('should not reparent child properties if the config setting is false', function() {
                var fakeDoclet = {
                    params: [
                        {
                            name: 'foo'
                        },
                        {
                            name: 'foo.bar'
                        }
                    ]
                };
                var notReparented;

                template.config.tables = {
                    nestedPropertyTables: false
                };
                notReparented = instance.reparentItems(fakeDoclet, 'params');

                expect(notReparented).toEqual(fakeDoclet.params);
            });

            it('should reparent properties of arrays', function() {
                var fakeDoclet = {
                    params: [
                        {
                            name: 'foo'
                        },
                        {
                            name: 'foo[].bar'
                        }
                    ]
                };
                var reparented = instance.reparentItems(fakeDoclet, 'params');

                expect(reparented).toEqual([
                    {
                        name: 'foo',
                        children: [
                            {
                                name: 'bar'
                            }
                        ]
                    }
                ]);
            });

            it('should reparent properties of nested arrays', function() {
                var fakeDoclet = {
                    params: [
                        {
                            name: 'foo'
                        },
                        {
                            name: 'foo[][].bar'
                        }
                    ]
                };
                var reparented = instance.reparentItems(fakeDoclet, 'params');

                expect(reparented).toEqual([
                    {
                        name: 'foo',
                        children: [
                            {
                                name: 'bar'
                            }
                        ]
                    }
                ]);
            });

            it('should not reparent non-child properties', function() {
                var fakeDoclet = {
                    params: [
                        {
                            name: 'foo'
                        },
                        {
                            name: 'bar'
                        }
                    ]
                };
                var reparented = instance.reparentItems(fakeDoclet, 'params');

                expect(reparented).toEqual(fakeDoclet.params);
            });

            it('should handle null properties', function() {
                var fakeDoclet = {
                    params: [
                        {
                            name: 'foo'
                        },
                        null
                    ]
                };
                var reparented = instance.reparentItems(fakeDoclet, 'params');

                expect(reparented).toEqual([
                    {
                        name: 'foo'
                    }
                ]);
            });

            it('should preserve the parsed type of child properties', function() {
                var fakeDoclet = {
                    params: [
                        {
                            name: 'foo'
                        },
                        {
                            name: 'foo.bar',
                            type: {}
                        }
                    ]
                };
                var reparented;

                // JSDoc adds the parsed type as a non-enumerable property, so we do too
                Object.defineProperty(fakeDoclet.params[1].type, 'parsedType', {
                    value: {
                        type: 'NameExpression'
                    }
                });
                reparented = instance.reparentItems(fakeDoclet, 'params');

                expect(reparented).toEqual([
                    {
                        name: 'foo',
                        children: [
                            {
                                name: 'bar',
                                type: {
                                    parsedType: {
                                        type: 'NameExpression'
                                    }
                                }
                            }
                        ]
                    }
                ]);
            });
        });

        xdescribe('resolveAuthorLinks', function() {
            // TODO
        });

        xdescribe('resolveLinks', function() {
            // TODO
        });

        describe('returnTypes', function() {
            // TODO: more tests

            it('should not crash on null input', function() {
                function nullInput() {
                    return instance.returnTypes(null);
                }

                expect(nullInput).not.toThrow();
            });
        });

        xdescribe('see', function() {
            // TODO
        });

        xdescribe('shouldHighlight', function() {
            // TODO
        });

        describe('translate', function() {
            it('should map keys to strings', function() {
                var description = instance.translate('tables.header.description', null, {});

                expect(description).toBeInstanceOf(SafeString);
                expect(description.toString()).toBe('Description');
            });

            it('should pluralize strings based on the length of an array', function() {
                var singular = instance.translate('headings.classes', [0], {});
                var plural = instance.translate('headings.classes', [0, 1], {});

                expect(singular.toString()).toBe('Class');
                expect(plural.toString()).toBe('Classes');
            });

            it('should use the singular form if the argument is not an array', function() {
                var singular = instance.translate('headings.classes', 17, {});

                expect(singular.toString()).toBe('Class');
            });

            it('should pass hash data through to the L10N string', function() {
                var paramText = instance.translate('params.all', null, {
                    hash: {
                        params: 'foo'
                    }
                });

                expect(paramText.toString()).toBe('(foo)');
            });

            it('should be able to pluralize text when hash data is present', function() {
                var plural = instance.translate('headings.classes', [0, 1], {
                    hash: {
                        foo: 'bar'
                    }
                });

                expect(plural.toString()).toBe('Classes');
            });
        });

        xdescribe('translateHeading', function() {
            // TODO
        });

        describe('translatePageTitle', function() {
            it('should include the specified text in the generated title', function() {
                var title = instance.translatePageTitle('Baz', 'Foo bar', 'classes');

                expect(title).toBeInstanceOf(SafeString);
                expect(title.toString()).toContain('Foo bar');
                expect(title.toString()).toContain('Baz');
            });

            it('should work when no category is provided', function() {
                var title = instance.translatePageTitle('Baz', 'Foo bar');

                expect(title).toBeInstanceOf(SafeString);
                expect(title.toString()).toContain('Foo bar');
                expect(title.toString()).toContain('Baz');
            });
        });

        xdescribe('typeUnion', function() {
            // TODO
        });

        describe('url', function() {
            it('should return the URL for the specified longname', function() {
                var url;

                templateHelper.registerLink('urlExpressionHelper', 'urlexpressionhelper.html');
                url = instance.url('urlExpressionHelper');

                expect(url).toBeInstanceOf(SafeString);
                expect(url.toString()).toBe('urlexpressionhelper.html');
            });

            it('should return an empty string if the specified longname is unknown', function() {
                var url = instance.url('not-a-real-longname');

                expect(url).toBeInstanceOf(SafeString);
                expect(url.toString()).toBe('');
            });
        });

        describe('where', function() {
            it('should return items whose properties match the specified values', function() {
                var items = [
                    {
                        foo: 'maybe',
                        bar: 'yes'
                    },
                    {
                        bar: 'yes'
                    },
                    {
                        bar: 'nope'
                    }
                ];
                var filtered = instance.where(items, {
                    hash: {
                        bar: 'yes'
                    }
                });

                expect(filtered).toEqual([
                    {
                        foo: 'maybe',
                        bar: 'yes'
                    },
                    {
                        bar: 'yes'
                    }
                ]);
            });
        });
    });
});
