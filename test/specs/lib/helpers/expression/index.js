/*
    Copyright 2014-2019 Google LLC

    Licensed under the Apache License, Version 2.0 (the "License");
    you may not use this file except in compliance with the License.
    You may obtain a copy of the License at

        https://www.apache.org/licenses/LICENSE-2.0

    Unless required by applicable law or agreed to in writing, software
    distributed under the License is distributed on an "AS IS" BASIS,
    WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
    See the License for the specific language governing permissions and
    limitations under the License.
*/
describe('lib/helpers/expression', () => {
    const env = require('jsdoc/env');
    const { EventBus } = require('@jsdoc/util');
    const handlebars = require('handlebars');
    const SafeString = handlebars.SafeString;
    const templateHelper = require('jsdoc/util/templateHelper');
    const expression = require('../../../../../lib/helpers/expression');

    const bus = new EventBus('jsdoc');

    it('should export a function', () => {
        expect(typeof expression).toBe('function');
    });

    it('should return an object', () => {
        const instance = expression(helpers.template);

        expect(typeof instance).toBe('object');
    });

    describe('helpers', () => {
        // TODO: use a dummy template instance that pulls L10N strings from fixtures/
        const template = helpers.template;
        const instance = expression(template);

        describe('_decrementHeading', () => {
            beforeEach(() => {
                while (instance._headingLevel() > 1) {
                    instance._decrementHeading();
                }
            });

            it('should reduce the heading level by 1', () => {
                let newLevel;
                let oldLevel;

                instance._incrementHeading();
                oldLevel = instance._headingLevel();

                instance._decrementHeading();
                newLevel = instance._headingLevel();

                expect(oldLevel - newLevel).toBe(1);
            });

            it('should not reduce the heading level below 1', () => {
                let newLevel;
                const oldLevel = instance._headingLevel();

                instance._decrementHeading();
                newLevel = instance._headingLevel();

                expect(oldLevel).toBe(1);
                expect(newLevel).toBe(1);
            });
        });

        describe('_headingLevel', () => {
            it('should return a positive number', () => {
                const level = instance._headingLevel();

                expect(level).toBeNumber();
                expect(level).toBeGreaterThan(0);
            });
        });

        describe('_incrementHeading', () => {
            function decrement() {
                while (instance._headingLevel() > 1) {
                    instance._decrementHeading();
                }
            }

            beforeEach(decrement);
            afterEach(decrement);

            it('should increase the heading level by 1', () => {
                let newLevel;
                const oldLevel = instance._headingLevel();

                instance._incrementHeading();
                newLevel = instance._headingLevel();

                expect(newLevel - oldLevel).toBe(1);
            });

            it('should not increase the heading level above 6', () => {
                for (let i = 0, l = 10; i < l; i++) {
                    instance._incrementHeading();
                }

                expect(instance._headingLevel()).toBe(6);
            });
        });

        describe('ancestors', () => {
            const fakeLinks = [
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

            fakeLinks.forEach(({longname, url}) => {
                templateHelper.registerLink(longname, url);
            });

            it('should link to ancestors when no CSS class is specified', () => {
                const ancestors = instance.ancestors('module:foo/bar.Baz#qux');

                expect(ancestors).toBeInstanceOf(SafeString);
                expect(ancestors.toString()).toBe([
                    '<a href="module-foo_bar.html">foo/<wbr>bar</a>',
                    '.<wbr>',
                    '<a href="module-foo_bar.Baz.html">Baz</a>',
                    '#<wbr>'
                ].join(''));
            });

            it('should link to ancestors when a CSS class is specified', () => {
                const ancestors = instance.ancestors('module:foo/bar.Baz', 'frozzle');

                expect(ancestors).toBeInstanceOf(SafeString);
                expect(ancestors.toString()).toBe([
                    '<a href="module-foo_bar.html" class="frozzle">foo/<wbr>bar</a>',
                    '.<wbr>'
                ].join(''));
            });

            it('should return an empty string when there are no ancestors', () => {
                const ancestors = instance.ancestors('module:foo/bar');

                expect(ancestors).toBeInstanceOf(SafeString);
                expect(ancestors.toString()).toBe('');
            });
        });

        describe('basename', () => {
            it('should return the basename of the specified path', () => {
                const filepath = instance.basename('/foo/bar/baz.html');

                expect(filepath).toBeInstanceOf(SafeString);
                expect(filepath.toString()).toBe('baz.html');
            });

            it('should remove the extension if one is specified', () => {
                const filepath = instance.basename('/foo/bar/baz.html', '.html');

                expect(filepath).toBeInstanceOf(SafeString);
                expect(filepath.toString()).toBe('baz');
            });
        });

        xdescribe('config', () => {
            // TODO
        });

        describe('cssClass', () => {
            const cssClasses = template.cssClasses;
            const cssClassPrefix = template.config.cssClassPrefix;

            afterEach(() => {
                template.cssClasses = cssClasses;
                template.config.cssClassPrefix = cssClassPrefix;
            });

            it('should format the class string correctly', () => {
                const classes = instance.cssClass('!foo', {});

                expect(classes).toBeInstanceOf(SafeString);
                expect(classes.toString()).toBe(' class="foo"');
            });

            it('should keep classes prefixed with ! by default, and strip the !', () => {
                const classes = instance.cssClass('!foo', {});

                expect(classes).toBeInstanceOf(SafeString);
                expect(classes.toString()).toContain('"foo"');
            });

            it('should let users change the prefix for classes that it keeps', () => {
                let classes;

                template.config.cssClassPrefix = '?';
                classes = instance.cssClass('?foo', {});

                expect(classes).toBeInstanceOf(SafeString);
                expect(classes.toString()).toContain('"foo"');
            });

            it('should accept multiple classes', () => {
                const classes = instance.cssClass('!foo', '!bar', {});

                expect(classes).toBeInstanceOf(SafeString);
                expect(classes.toString()).toContain('"foo bar"');
            });

            it('should preserve user-specified classes', () => {
                let classes;

                template.cssClasses = {
                    foo: true
                };
                classes = instance.cssClass('foo', {});

                expect(classes).toBeInstanceOf(SafeString);
                expect(classes.toString()).toContain('"foo"');
            });

            it('should not preserve non-user-specific classes', () => {
                const classes = instance.cssClass('foo', {});

                expect(classes).toBe('');
            });

            it('should not preserve classes that the user explicitly does not want', () => {
                let classes;

                template.cssClasses = {
                    foo: false
                };
                classes = instance.cssClass('foo', {});

                expect(classes).toBe('');
            });

            it('should not preserve classes whose names match inherited properties', () => {
                const classes = instance.cssClass('prototype', {});

                expect(classes).toBe('');
            });
        });

        describe('debug', () => {
            it('should log the JSON-stringified arguments at level DEBUG', () => {
                let event;

                bus.once('logger:debug', e => {
                    event = e;
                });

                instance.debug('foo', {
                    bar: 'baz'
                }, { /* fake options object */ });

                expect(event).toBe('foo {"bar":"baz"}');
            });
        });

        describe('defined', () => {
            it('should report that a truthy value is defined', () => {
                expect(instance.defined(1)).toBeTrue();
            });

            it('should report that a falsy value is defined', () => {
                expect(instance.defined(0)).toBeTrue();
            });

            it('should report that an undefined value is undefined', () => {
                expect(instance.defined()).toBeFalse();
            });
        });

        describe('describeType', () => {
            const catharsis = require('catharsis');

            const parsedType = catharsis.parse('!string');

            it('should use "unknown type" if no type is provided', () => {
                const description = instance.describeType(undefined);

                expect(description).toBeInstanceOf(SafeString);
                expect(description.toString()).toBe('unknown');
            });

            it('should throw if the requested format is not available', () => {
                function shouldThrow() {
                    return instance.describeType(parsedType, 'marshmallow');
                }

                expect(shouldThrow).toThrow();
            });

            it('should return the simple description by default', () => {
                const description = instance.describeType(parsedType);

                expect(description).toBeInstanceOf(SafeString);
                expect(description.toString()).toBe('non-null string');
            });

            it('should return the extended format\'s description by default when the format is ' +
                '"extended"', () => {
                const description = instance.describeType(parsedType, 'extended');

                expect(description).toBeInstanceOf(SafeString);
                expect(description.toString()).toBe('string');
            });

            it('should return the requested property when the format is "extended"', () => {
                const description = instance.describeType(parsedType, 'extended',
                    'modifiers.nullable');

                expect(description).toBeInstanceOf(SafeString);
                expect(description.toString()).toBe('Must not be null.');
            });
        });

        describe('example', () => {
            it('should work when the example does not have a caption', () => {
                const example = instance.example('Some example text');

                expect(example.caption).toBeUndefined();
                expect(example.code).toBe('Some example text');
            });

            it('should work when the example has a caption', () => {
                const example = instance.example('<caption>Caption here</caption> Some example text');

                expect(example.caption).toBe('Caption here');
                expect(example.code).toBe('Some example text');
            });

            it('should work when there is a newline before the caption and multiple newlines ' +
                'after the caption', () => {
                const example = instance.example('\n<caption>Caption here</caption>\nExample text\n' +
                    'More example text');

                expect(example.caption).toBe('Caption here');
                expect(example.code).toBe('Example text\nMore example text');
            });
        });

        xdescribe('filterProperties', () => {
            // TODO: tests
        });

        xdescribe('formatParams', () => {
            // TODO: tests
            // TODO: confirm that we respect the user's L10N file if there are no params, rather
            // than always returning `()`
        });

        describe('generatedBy', () => {
            it('should include the JSDoc version number', () => {
                const generatedBy = instance.generatedBy();

                expect(generatedBy).toBeInstanceOf(SafeString);
                expect(generatedBy.toString()).toContain(env.version.number);
            });

            it('should include the date', () => {
                const generatedBy = instance.generatedBy();

                expect(generatedBy.toString()).toContain(new Date(Date.now()).getFullYear());
            });
        });

        describe('group', () => {
            const items = [
                'apple',
                'banana',
                'carrot',
                'durian',
                'eggplant',
                'fava bean',
                'grape',
                'horseradish'
            ];

            it('should group the items into the specified number of groups', () => {
                const grouped = instance.group(items, 2);

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

            it('should work if the number of items per group is not specified', () => {
                const grouped = instance.group(items);

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

            it('should work if the number of groups exceeds the number of items', () => {
                const grouped = instance.group(items, 10);

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

        describe('hasModifiers', () => {
            it('should treat the "defaultvalue" property as a modifier for non-enums', () => {
                const fakeDoclet = {
                    defaultvalue: 'foo'
                };
                const hasModifiers = instance.hasModifiers(fakeDoclet, false);

                expect(hasModifiers).toBe(true);
            });

            it('should not treat the "defaultvalue" property as a modifier for enums', () => {
                const fakeDoclet = {
                    defaultvalue: 'foo'
                };
                const hasModifiers = instance.hasModifiers(fakeDoclet, true);

                expect(hasModifiers).toBe(false);
            });

            it('should treat the "nullable" property as a modifier', () => {
                const fakeDoclet = {
                    nullable: true
                };
                const hasModifiers = instance.hasModifiers(fakeDoclet, false);

                expect(hasModifiers).toBe(true);
            });

            it('should not treat the "optional" property as a modifier', () => {
                const fakeDoclet = {
                    optional: true
                };
                const hasModifiers = instance.hasModifiers(fakeDoclet, false);

                expect(hasModifiers).toBe(false);
            });

            it('should treat the "variable" (repeatable) property as a modifier', () => {
                const fakeDoclet = {
                    variable: true
                };
                const hasModifiers = instance.hasModifiers(fakeDoclet, false);

                expect(hasModifiers).toBe(true);
            });
        });

        xdescribe('id', () => {
            // TODO

            xit('should not crash if nothing is passed in', () => {
                // TODO
            });
        });

        describe('jsdocVersion', () => {
            it('should return the version number as a string', () => {
                // look for the fake version number set by the test helpers
                expect(instance.jsdocVersion()).toBe('1.2.3.4');
            });
        });

        describe('json', () => {
            it('should JSON-stringify its argument', () => {
                const stringified = instance.json({foo: 'bar'});

                expect(stringified).toBeInstanceOf(SafeString);
                expect(stringified.toString()).toBe('{"foo":"bar"}');
            });
        });

        describe('keys', () => {
            it('should throw an error if the argument is not an object', () => {
                function shouldThrow() {
                    return instance.keys('hello');
                }

                expect(shouldThrow).toThrow();
            });

            it('should return the object\'s keys as an array', () => {
                const keys = instance.keys({
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

        xdescribe('labels', () => {
            // TODO
        });

        describe('licenseLink', () => {
            it('should return a URL if a valid license ID is specified', () => {
                expect(instance.licenseLink('MIT')).toContain('http://');
            });

            it('should return the license ID if no link is found', () => {
                expect(instance.licenseLink('fuzzy-bunny')).toBe('fuzzy-bunny');
            });
        });

        describe('link', () => {
            it('should not blow up if only one parameter is provided', () => {
                function makeLink() {
                    return instance.link('foo');
                }

                expect(makeLink).not.toThrow();
            });

            it('should not blow up if only two parameters are provided', () => {
                function makeLink() {
                    return instance.link('foo', 'bar');
                }

                expect(makeLink).not.toThrow();
            });

            it('should not blow up if only three parameters are provided', () => {
                function makeLink() {
                    return instance.link('foo', 'bar', 'baz');
                }

                expect(makeLink).not.toThrow();
            });

            it('should not blow up when a non-string value is passed in', () => {
                function makeLink() {
                    return instance.link(true);
                }

                expect(makeLink).not.toThrow();
                expect(makeLink()).toBeInstanceOf(SafeString);
                expect(makeLink().toString()).toBe('');
            });

            it('should include the requested link text, link class, and fragment ID', () => {
                let link;

                templateHelper.registerLink('linkExpressionHelper', 'foo.html');
                link = instance.link('linkExpressionHelper', 'helpful!', 'classy', 'bar');

                expect(link).toBeInstanceOf(SafeString);
                expect(link.toString()).toBe('<a href="foo.html#bar" class="classy">helpful!</a>');
            });
        });

        xdescribe('linkLongnameWithSignature', () => {
            // TODO
        });

        describe('linkToLine', () => {
            const fakeDocletMeta = {
                lineno: 70,
                shortpath: 'glitch.js'
            };

            templateHelper.registerLink('glitch.js', 'glitch.js.html');

            it('should work when a CSS class is specified', () => {
                const link = instance.linkToLine(fakeDocletMeta, 'foo');

                expect(link).toBeInstanceOf(SafeString);
                expect(link.toString()).toBe(
                    '<a href="glitch.js.html#source-line-70" class="foo">glitch.<wbr>js:70</a>'
                );
            });

            it('should work when no CSS class is specified', () => {
                const link = instance.linkToLine(fakeDocletMeta);

                expect(link).toBeInstanceOf(SafeString);
                expect(link.toString()).toBe(
                    '<a href="glitch.js.html#source-line-70">glitch.<wbr>js:70</a>'
                );
            });

            it('should not do anything with the line number if the code is on line 1', () => {
                const meta = {
                    lineno: 1,
                    shortpath: 'glitch.js'
                };
                const link = instance.linkToLine(meta);

                expect(link).toBeInstanceOf(SafeString);
                expect(link.toString()).toBe(
                    '<a href="glitch.js.html">glitch.<wbr>js</a>'
                );
            });
        });

        xdescribe('linkToTutorial', () => {
            // TODO
        });

        xdescribe('linkWithSignature', () => {
            // TODO
        });

        describe('modifierText', () => {
            it('should return text if the doclet is nullable', () => {
                const fakeDoclet = {
                    nullable: true
                };
                const text = instance.modifierText(fakeDoclet, false);

                expect(text).toBeInstanceOf(SafeString);
                expect(text.toString()).not.toBe('');
            });

            it('should return text if the doclet is non-nullable', () => {
                const fakeDoclet = {
                    nullable: false
                };
                const text = instance.modifierText(fakeDoclet, false);

                expect(text).toBeInstanceOf(SafeString);
                expect(text.toString()).not.toBe('');
            });

            it('should return text if the doclet has a "variable" property set to true',
                () => {
                    const fakeDoclet = {
                        variable: true
                    };
                    const text = instance.modifierText(fakeDoclet, false);

                    expect(text).toBeInstanceOf(SafeString);
                    expect(text.toString()).not.toBe('');
                });

            it('should return text if the doclet has a falsy default value', () => {
                const fakeDoclet = {
                    defaultvalue: 0
                };
                const text = instance.modifierText(fakeDoclet, false);

                expect(text).toBeInstanceOf(SafeString);
                expect(text.toString()).toContain('0');
            });

            it('should return text if the doclet has a default value and is not an enum',
                () => {
                    const fakeDoclet = {
                        defaultvalue: '1'
                    };
                    const text = instance.modifierText(fakeDoclet, false);

                    expect(text).toBeInstanceOf(SafeString);
                    expect(text.toString()).toContain('1');
                });

            it('should not return text if the doclet has a default value and is an enum',
                () => {
                    const fakeDoclet = {
                        defaultvalue: '1'
                    };
                    const text = instance.modifierText(fakeDoclet, true);

                    expect(text).toBeInstanceOf(SafeString);
                    expect(text.toString()).toBe('');
                });
        });

        describe('needsSignature', () => {
            it('should say that classes need a signature', () => {
                const fakeDoclet = {
                    kind: 'class'
                };

                expect(instance.needsSignature(fakeDoclet)).toBe(true);
            });

            it('should say that functions need a signature', () => {
                const fakeDoclet = {
                    kind: 'function'
                };

                expect(instance.needsSignature(fakeDoclet)).toBe(true);
            });

            it('should say that typedefs need a signature if they contain a function', () => {
                const fakeDoclet = {
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
                () => {
                    const fakeDoclet = {
                        kind: 'typedef',
                        type: {
                            names: [
                                'Object'
                            ]
                        }
                    };

                    expect(instance.needsSignature(fakeDoclet)).toBe(false);
                });

            it('should say that other types do not need a signature', () => {
                const fakeDoclet = {
                    kind: 'member'
                };

                expect(instance.needsSignature(fakeDoclet)).toBe(false);
            });
        });

        xdescribe('packageLink', () => {
            // TODO
        });

        xdescribe('parseType', () => {
            // TODO
        });

        describe('pluck', () => {
            it('should return an array of the specified property\'s values', () => {
                const objs = [
                    {
                        foo: true
                    },
                    {
                        foo: 7
                    }
                ];
                const plucked = instance.pluck(objs, 'foo');

                expect(plucked).toBeArray();
                expect(plucked.length).toBe(2);
                expect(plucked[0]).toBe(true);
                expect(plucked[1]).toBe(7);
            });
        });

        describe('query', () => {
            let originalQuery;

            beforeEach(() => {
                originalQuery = env.opts.query;
            });

            afterEach(() => {
                env.opts.query = originalQuery;
            });

            it('should work if no query parameters were specified', () => {
                delete env.opts.query;

                const text = instance.query('foo');

                expect(text).toBeInstanceOf(SafeString);
                expect(text.toString()).toBe('');
            });

            it('should retrieve an empty string if the specified parameter is missing', () => {
                env.opts.query = {
                    foo: 'bar'
                };

                const text = instance.query('baz');

                expect(text).toBeInstanceOf(SafeString);
                expect(text.toString()).toBe('');
            });

            it('should retrieve truthy values from env.opts.query', () => {
                env.opts.query = {
                    foo: 'bar'
                };

                const text = instance.query('foo');

                expect(text).toBeInstanceOf(SafeString);
                expect(text.toString()).toBe('bar');
            });

            it('should retrieve falsy values from env.opts.query', () => {
                env.opts.query = {
                    foo: 0
                };

                const text = instance.query('foo');

                expect(text).toBeInstanceOf(SafeString);
                expect(text.toString()).toBe('0');
            });
        });

        describe('reparentItems', () => {
            const tablesConfig = template.config.tables;

            beforeEach(() => {
                template.config.tables = {
                    nestedPropertyTables: true
                };
            });

            afterEach(() => {
                template.config.tables = tablesConfig;
            });

            it('should reparent child properties', () => {
                const fakeDoclet = {
                    params: [
                        {
                            name: 'foo'
                        },
                        {
                            name: 'foo.bar'
                        }
                    ]
                };
                const reparented = instance.reparentItems(fakeDoclet, 'params');

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

            it('should reparent child properties when multiple parameters have properties', () => {
                const fakeDoclet = {
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
                const reparented = instance.reparentItems(fakeDoclet, 'params');

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

            it('should not reparent child properties if the config setting is false', () => {
                const fakeDoclet = {
                    params: [
                        {
                            name: 'foo'
                        },
                        {
                            name: 'foo.bar'
                        }
                    ]
                };
                let notReparented;

                template.config.tables = {
                    nestedPropertyTables: false
                };
                notReparented = instance.reparentItems(fakeDoclet, 'params');

                expect(notReparented).toEqual(fakeDoclet.params);
            });

            it('should reparent properties of arrays', () => {
                const fakeDoclet = {
                    params: [
                        {
                            name: 'foo'
                        },
                        {
                            name: 'foo[].bar'
                        }
                    ]
                };
                const reparented = instance.reparentItems(fakeDoclet, 'params');

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

            it('should reparent properties of nested arrays', () => {
                const fakeDoclet = {
                    params: [
                        {
                            name: 'foo'
                        },
                        {
                            name: 'foo[][].bar'
                        }
                    ]
                };
                const reparented = instance.reparentItems(fakeDoclet, 'params');

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

            it('should not reparent non-child properties', () => {
                const fakeDoclet = {
                    params: [
                        {
                            name: 'foo'
                        },
                        {
                            name: 'bar'
                        }
                    ]
                };
                const reparented = instance.reparentItems(fakeDoclet, 'params');

                expect(reparented).toEqual(fakeDoclet.params);
            });

            it('should handle null properties', () => {
                const fakeDoclet = {
                    params: [
                        {
                            name: 'foo'
                        },
                        null
                    ]
                };
                const reparented = instance.reparentItems(fakeDoclet, 'params');

                expect(reparented).toEqual([
                    {
                        name: 'foo'
                    }
                ]);
            });

            it('should preserve the parsed type of child properties', () => {
                const fakeDoclet = {
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
                let reparented;

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

            it('should not crash when parameters have weird names like `{Object)`', () => {
                function reparent() {
                    const fakeDoclet = {
                        params: [
                            {
                                name: '{Object)'
                            },
                            {
                                name: '{Object)'
                            }
                        ]
                    };

                    instance.reparentItems(fakeDoclet, 'params');
                }

                expect(reparent).not.toThrow();
            });

            xit('should ignore child properties when appropriate', () => {
                // TODO: check whether it ignores properties with ignore === true
            });
        });

        xdescribe('resolveAuthorLinks', () => {
            // TODO
        });

        xdescribe('resolveLinks', () => {
            // TODO
        });

        describe('returnTypes', () => {
            it('should not crash on null input', () => {
                function nullInput() {
                    return instance.returnTypes(null);
                }

                expect(nullInput).not.toThrow();
            });

            it('should find values in the `returns` property', () => {
                const fakeDoclet = {
                    returns: [
                        {
                            type: {
                                names: [
                                    'string'
                                ]
                            },
                            description: 'A string.'
                        }
                    ]
                };
                const parsedType = instance.returnTypes(fakeDoclet);

                expect(parsedType).toEqual({
                    type: 'NameExpression',
                    name: 'string'
                });
            });

            it('should find values in the `yields` property', () => {
                const fakeDoclet = {
                    yields: [
                        {
                            type: {
                                names: [
                                    'number'
                                ]
                            },
                            description: 'A number.'
                        }
                    ]
                };
                const parsedType = instance.returnTypes(fakeDoclet);

                expect(parsedType).toEqual({
                    type: 'NameExpression',
                    name: 'number'
                });
            });

            it('should prefer `yields` over `returns`', () => {
                const fakeDoclet = {
                    returns: [
                        {
                            type: {
                                names: [
                                    'string'
                                ]
                            },
                            description: 'A string.'
                        }
                    ],
                    yields: [
                        {
                            type: {
                                names: [
                                    'number'
                                ]
                            },
                            description: 'A number.'
                        }
                    ]
                };
                const parsedType = instance.returnTypes(fakeDoclet);

                expect(parsedType).toEqual({
                    type: 'NameExpression',
                    name: 'number'
                });
            });

            it('should work if `doclet.returns` is passed in directly', () => {
                const fakeReturns = [
                    {
                        type: {
                            names: [
                                'string'
                            ]
                        },
                        description: 'A string.'
                    }
                ];
                const parsedType = instance.returnTypes(fakeReturns);

                expect(parsedType).toEqual({
                    type: 'NameExpression',
                    name: 'string'
                });
            });
        });

        xdescribe('see', () => {
            // TODO
        });

        xdescribe('shouldHighlight', () => {
            // TODO
        });

        describe('translate', () => {
            it('should map keys to strings', () => {
                const description = instance.translate('tables.header.description', null, {});

                expect(description).toBeInstanceOf(SafeString);
                expect(description.toString()).toBe('Description');
            });

            it('should pluralize strings based on the length of an array', () => {
                const singular = instance.translate('headings.classes', [0], {});
                const plural = instance.translate('headings.classes', [0, 1], {});

                expect(singular.toString()).toBe('Class');
                expect(plural.toString()).toBe('Classes');
            });

            it('should use the singular form if the argument is not an array', () => {
                const singular = instance.translate('headings.classes', 17, {});

                expect(singular.toString()).toBe('Class');
            });

            it('should pass hash data through to the L10N string', () => {
                const paramText = instance.translate('params.all', null, {
                    hash: {
                        params: 'foo'
                    }
                });

                expect(paramText.toString()).toBe('(foo)');
            });

            it('should be able to pluralize text when hash data is present', () => {
                const plural = instance.translate('headings.classes', [0, 1], {
                    hash: {
                        foo: 'bar'
                    }
                });

                expect(plural.toString()).toBe('Classes');
            });
        });

        xdescribe('translateHeading', () => {
            // TODO
        });

        describe('translatePageTitle', () => {
            it('should include the specified text in the generated title', () => {
                const title = instance.translatePageTitle('Baz', 'Foo bar', 'classes');

                expect(title).toBeInstanceOf(SafeString);
                expect(title.toString()).toContain('Foo bar');
                expect(title.toString()).toContain('Baz');
            });

            it('should work when no category is provided', () => {
                const title = instance.translatePageTitle('Baz', 'Foo bar');

                expect(title).toBeInstanceOf(SafeString);
                expect(title.toString()).toContain('Foo bar');
                expect(title.toString()).toContain('Baz');
            });
        });

        xdescribe('typeUnion', () => {
            // TODO
        });

        describe('url', () => {
            it('should return the URL for the specified longname', () => {
                let url;

                templateHelper.registerLink('urlExpressionHelper', 'urlexpressionhelper.html');
                url = instance.url('urlExpressionHelper');

                expect(url).toBeInstanceOf(SafeString);
                expect(url.toString()).toBe('urlexpressionhelper.html');
            });

            it('should return an empty string if the specified longname is unknown', () => {
                const url = instance.url('not-a-real-longname');

                expect(url).toBeInstanceOf(SafeString);
                expect(url.toString()).toBe('');
            });
        });

        describe('where', () => {
            it('should return items whose properties match the specified values', () => {
                const items = [
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
                const filtered = instance.where(items, {
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

            it('should not crash on null input', () => {
                function nullInput() {
                    return instance.where(null, {});
                }

                expect(nullInput).not.toThrow();
            });
        });
    });
});
