'use strict';

describe('lib/helpers/block', function() {
    var block;
    var handlebars = require('handlebars');
    var helpers = require('../../../../helpers');

    var SafeString = handlebars.SafeString;
    var template = helpers.template;

    function makeOptions(hash, fn, inverse) {
        return {
            fn: fn || function() {
                return true;
            },
            hash: hash || {},
            inverse: inverse || function() {
                return false;
            }
        };
    }

    helpers.setup();
    block = require('../../../../../lib/helpers/block');

    it('should export a function', function() {
        expect(block).toBeFunction();
    });

    it('should return an object', function() {
        expect(block(template)).toBeObject();
    });

    describe('helpers', function() {
        var instance = block(template);

        function testBlockHelper(helper, args, hash) {
            var result;
            var options = makeOptions(hash);

            args = args || [];
            args.push(options);

            result = instance[helper].apply(instance, args);

            return result;
        }

        describe('all', function() {
            it('should use the inverse condition for an empty list of items', function() {
                var result = testBlockHelper('all', [], {});

                expect(result).toBeFalse();
            });

            it('should use the normal condition for a list of truthy items', function() {
                var result = testBlockHelper('all', [true, 7], {});

                expect(result).toBeTrue();
            });

            it('should use the inverse condition for a list that contains a falsy item', function() {
                var result = testBlockHelper('all', [true, ''], {});

                expect(result).toBeFalse();
            });
        });

        describe('any', function() {
            it('should use the inverse condition for an empty list of items', function() {
                var result = testBlockHelper('any', [[]], {});

                expect(result).toBeFalse();
            });

            it('should use the normal condition for a list of truthy items', function() {
                var result = testBlockHelper('any', [[true, 7]], {});

                expect(result).toBeTrue();
            });

            it('should use the normal condition for a list with truthy and falsy items', function() {
                var result = testBlockHelper('any', [[true, '']], {});

                expect(result).toBeTrue();
            });

            it('should use the normal condition for a list of falsy items', function() {
                var result = testBlockHelper('any', [[false, '']], {});

                expect(result).toBeTrue();
            });
        });

        describe('blockHelperMissing', function() {
            it('should throw an error when called', function() {
                function callMissing() {
                    return instance.blockHelperMissing({});
                }

                expect(callMissing).toThrow();
            });

            it('should include the missing block name in the error message', function() {
                try {
                    instance.blockHelperMissing({name: 'foo'});
                } catch (e) {
                    expect(e.message).toContain('foo');
                }
            });
        });

        describe('contains', function() {
            it('should throw an error if called without a value to search for', function() {
                function callWithoutValue() {
                    return instance.contains({
                        hash: {}
                    });
                }

                expect(callWithoutValue).toThrow();
            });

            it('should say that an empty list of search terms does not contain the value', function() {
                var result = testBlockHelper('contains', [], {
                    value: 'foo'
                });

                expect(result).toBeFalse();
            });

            it('should say that a list of search terms with no match does not contain the value', function() {
                var result = testBlockHelper('contains', ['bar', 'baz'], {
                    value: 'foo'
                });

                expect(result).toBeFalse();
            });

            it('should be able to find the value within the search terms', function() {
                var result = testBlockHelper('contains', ['foo', 'bar'], {
                    value: 'foo'
                });

                expect(result).toBeTrue();
            });
        });

        xdescribe('eachIndexGroup', function() {
            // TODO
        });

        describe('first', function() {
            it('should use the first item from the list as the thisObj', function() {
                var options = makeOptions({}, function(thisObj) {
                    return thisObj;
                });
                var result = instance.first(['foo', 'bar'], options);

                expect(result).toBe('foo');
            });
        });

        describe('is', function() {
            it('should use the normal condition if the items are identical', function() {
                var obj1 = {};
                var obj2 = obj1;
                var options = makeOptions();
                var result = instance.is(obj1, obj2, options);

                expect(result).toBeTrue();
            });

            it('should use the inverse condition if the items are not identical', function() {
                var obj1 = {};
                var obj2 = {};
                var options = makeOptions();
                var result = instance.is(obj1, obj2, options);

                expect(result).toBeFalse();
            });
        });

        describe('isnt', function() {
            it('should use the normal condition if the items are not identical', function() {
                var obj1 = {};
                var obj2 = {};
                var options = makeOptions();
                var result = instance.isnt(obj1, obj2, options);

                expect(result).toBeTrue();
            });

            it('should use the inverse condition if the items are identical', function() {
                var obj1 = {};
                var obj2 = obj1;
                var options = makeOptions();
                var result = instance.isnt(obj1, obj2, options);

                expect(result).toBeFalse();
            });
        });

        describe('last', function() {
            it('should use the last item from the list as the thisObj', function() {
                var options = makeOptions({}, function(thisObj) {
                    return thisObj;
                });
                var result = instance.last(['foo', 'bar'], options);

                expect(result).toBe('bar');
            });
        });

        describe('markdown', function() {
            var options = makeOptions({}, function() {
                return '**foo**';
            });
            var useMarkdown = !!template.config.markdown;

            afterEach(function() {
                template.config.markdown = useMarkdown;
            });

            it('should use a Markdown parser by default', function() {
                var text = instance.markdown(options);

                expect(text).toBeInstanceOf(SafeString);
                expect(text.toString()).toBe('<p><strong>foo</strong></p>');
            });

            it('should not use a Markdown parser when the user disables Markdown', function() {
                var text;
                var tempInstance;

                template.config.markdown = false;
                tempInstance = block(template);
                text = tempInstance.markdown(options);

                expect(text).toBeInstanceOf(SafeString);
                expect(text.toString()).toBe('<p>**foo**</p>');
            });

            it('should automatically expand standalone <p> tags into proper markup when Markdown ' +
                'is disabled', function() {
                var text;
                var tempInstance;
                var tempOptions = makeOptions({}, function() {
                    return 'foo<p>bar<p>baz';
                });

                template.config.markdown = false;
                tempInstance = block(template);
                text = tempInstance.markdown(tempOptions);

                expect(text).toBeInstanceOf(SafeString);
                expect(text.toString()).toBe('<p>foo</p><p>bar</p><p>baz</p>');
            });

            it('should not wrap text in an extra <p> tag when Markdown is disabled', function() {
                var text;
                var tempInstance;
                var tempOptions = makeOptions({}, function() {
                    return '<p>**foo**</p>';
                });

                template.config.markdown = false;
                tempInstance = block(template);
                text = tempInstance.markdown(tempOptions);

                expect(text).toBeInstanceOf(SafeString);
                expect(text.toString()).toBe('<p>**foo**</p>');
            });
        });

        describe('markdownLinks', function() {
            var options = makeOptions({}, function() {
                return '[Mr. Macintosh]' +
                    '(http://www.folklore.org/StoryView.py?story=Mister_Macintosh.txt)';
            });
            var useMarkdown = !!template.config.markdown;

            afterEach(function() {
                template.config.markdown = useMarkdown;
            });

            it('should convert Markdown links to HTML links by default', function() {
                var text = instance.markdownLinks(options);

                expect(text).toBeInstanceOf(SafeString);
                expect(text.toString()).toBe('<p><a href="http://www.folklore.org/StoryView.py?' +
                    'story=Mister_Macintosh.txt">Mr. Macintosh</a></p>');
            });

            it('should not convert Markdown text with no links', function() {
                var tempOptions = makeOptions({}, function() {
                    return '**foo**';
                });
                var text = instance.markdownLinks(tempOptions);

                expect(text).toBeInstanceOf(SafeString);
                expect(text.toString()).toBe('<p>**foo**</p>');
            });

            it('should not convert Markdown links if Markdown is disabled', function() {
                var text;
                var tempInstance;

                template.config.markdown = false;
                tempInstance = block(template);
                text = tempInstance.markdownLinks(options);

                expect(text).toBeInstanceOf(SafeString);
                expect(text.toString()).toBe('<p>[Mr. Macintosh]' +
                    '(http://www.folklore.org/StoryView.py?story=Mister_Macintosh.txt)</p>');
            });
        });

        xdescribe('withOnly', function() {
            // TODO
        });
    });
});
