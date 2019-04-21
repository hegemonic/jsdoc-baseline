describe('lib/helpers/block', () => {
    let block;
    const handlebars = require('handlebars');
    const helpers = require('../../../../helpers');

    const SafeString = handlebars.SafeString;
    const template = helpers.template;

    function makeOptions(hash, fn, inverse) {
        return {
            fn: fn || (() => true),
            hash: hash || {},
            inverse: inverse || (() => false)
        };
    }

    helpers.setup();
    block = require('../../../../../lib/helpers/block');

    it('should export a function', () => {
        expect(block).toBeFunction();
    });

    it('should return an object', () => {
        expect(block(template)).toBeObject();
    });

    describe('helpers', () => {
        const instance = block(template);

        function testBlockHelper(helper, args, hash) {
            let result;
            const options = makeOptions(hash);

            args = args || [];
            args.push(options);

            result = instance[helper](...args);

            return result;
        }

        describe('all', () => {
            it('should use the inverse condition for an empty list of items', () => {
                const result = testBlockHelper('all', [], {});

                expect(result).toBeFalse();
            });

            it('should use the normal condition for a list of truthy items', () => {
                const result = testBlockHelper('all', [true, 7], {});

                expect(result).toBeTrue();
            });

            it('should use the inverse condition for a list that contains a falsy item', () => {
                const result = testBlockHelper('all', [true, ''], {});

                expect(result).toBeFalse();
            });
        });

        describe('any', () => {
            it('should use the inverse condition for an empty list of items', () => {
                const result = testBlockHelper('any', [[]], {});

                expect(result).toBeFalse();
            });

            it('should use the normal condition for a list of truthy items', () => {
                const result = testBlockHelper('any', [[true, 7]], {});

                expect(result).toBeTrue();
            });

            it('should use the normal condition for a list with truthy and falsy items', () => {
                const result = testBlockHelper('any', [[true, '']], {});

                expect(result).toBeTrue();
            });

            it('should use the normal condition for a list of falsy items', () => {
                const result = testBlockHelper('any', [[false, '']], {});

                expect(result).toBeTrue();
            });
        });

        describe('blockHelperMissing', () => {
            it('should throw an error when called', () => {
                function callMissing() {
                    return instance.blockHelperMissing({});
                }

                expect(callMissing).toThrow();
            });

            it('should include the missing block name in the error message', () => {
                try {
                    instance.blockHelperMissing({name: 'foo'});
                } catch (e) {
                    expect(e.message).toContain('foo');
                }
            });
        });

        describe('contains', () => {
            it('should throw an error if called without a value to search for', () => {
                function callWithoutValue() {
                    return instance.contains({
                        hash: {}
                    });
                }

                expect(callWithoutValue).toThrow();
            });

            it('should say that an empty list of search terms does not contain the value', () => {
                const result = testBlockHelper('contains', [], {
                    value: 'foo'
                });

                expect(result).toBeFalse();
            });

            it('should say that a list of search terms with no match does not contain the value', () => {
                const result = testBlockHelper('contains', ['bar', 'baz'], {
                    value: 'foo'
                });

                expect(result).toBeFalse();
            });

            it('should be able to find the value within the search terms', () => {
                const result = testBlockHelper('contains', ['foo', 'bar'], {
                    value: 'foo'
                });

                expect(result).toBeTrue();
            });

            it('should flatten nested arrays', () => {
                const result = testBlockHelper('contains', ['foo', ['bar', 'baz']], {
                    value: 'baz'
                });

                expect(result).toBeTrue();
            });
        });

        xdescribe('eachIndexGroup', () => {
            // TODO
        });

        describe('first', () => {
            it('should use the first item from the list as the thisObj', () => {
                const options = makeOptions({}, thisObj => thisObj);
                const result = instance.first(['foo', 'bar'], options);

                expect(result).toBe('foo');
            });
        });

        describe('is', () => {
            it('should use the normal condition if the items are identical', () => {
                const obj1 = {};
                const obj2 = obj1;
                const options = makeOptions();
                const result = instance.is(obj1, obj2, options);

                expect(result).toBeTrue();
            });

            it('should use the inverse condition if the items are not identical', () => {
                const obj1 = {};
                const obj2 = {};
                const options = makeOptions();
                const result = instance.is(obj1, obj2, options);

                expect(result).toBeFalse();
            });
        });

        describe('isnt', () => {
            it('should use the normal condition if the items are not identical', () => {
                const obj1 = {};
                const obj2 = {};
                const options = makeOptions();
                const result = instance.isnt(obj1, obj2, options);

                expect(result).toBeTrue();
            });

            it('should use the inverse condition if the items are identical', () => {
                const obj1 = {};
                const obj2 = obj1;
                const options = makeOptions();
                const result = instance.isnt(obj1, obj2, options);

                expect(result).toBeFalse();
            });
        });

        describe('last', () => {
            it('should use the last item from the list as the thisObj', () => {
                const options = makeOptions({}, thisObj => thisObj);
                const result = instance.last(['foo', 'bar'], options);

                expect(result).toBe('bar');
            });
        });

        describe('markdown', () => {
            const options = makeOptions({}, () => '**foo**');
            const useMarkdown = Boolean(template.config.markdown);

            afterEach(() => {
                template.config.markdown = useMarkdown;
            });

            it('should use a Markdown parser by default', () => {
                const text = instance.markdown(options);

                expect(text).toBeInstanceOf(SafeString);
                expect(text.toString()).toBe('<p><strong>foo</strong></p>');
            });

            it('should not use a Markdown parser when the user disables Markdown', () => {
                let text;
                let tempInstance;

                template.config.markdown = false;
                tempInstance = block(template);
                text = tempInstance.markdown(options);

                expect(text).toBeInstanceOf(SafeString);
                expect(text.toString()).toBe('<p>**foo**</p>');
            });

            it('should automatically expand standalone <p> tags into proper markup when Markdown ' +
                'is disabled', () => {
                let text;
                let tempInstance;
                const tempOptions = makeOptions({}, () => 'foo<p>bar<p>baz');

                template.config.markdown = false;
                tempInstance = block(template);
                text = tempInstance.markdown(tempOptions);

                expect(text).toBeInstanceOf(SafeString);
                expect(text.toString()).toBe('<p>foo</p><p>bar</p><p>baz</p>');
            });

            it('should not wrap text in an extra <p> tag when Markdown is disabled', () => {
                let text;
                let tempInstance;
                const tempOptions = makeOptions({}, () => '<p>**foo**</p>');

                template.config.markdown = false;
                tempInstance = block(template);
                text = tempInstance.markdown(tempOptions);

                expect(text).toBeInstanceOf(SafeString);
                expect(text.toString()).toBe('<p>**foo**</p>');
            });
        });

        describe('markdownLinks', () => {
            const options = makeOptions({}, () => '[Mr. Macintosh]' +
                '(http://www.folklore.org/StoryView.py?story=Mister_Macintosh.txt)');
            const useMarkdown = Boolean(template.config.markdown);

            afterEach(() => {
                template.config.markdown = useMarkdown;
            });

            it('should convert Markdown links to HTML links by default', () => {
                const text = instance.markdownLinks(options);

                expect(text).toBeInstanceOf(SafeString);
                expect(text.toString()).toBe('<p><a href="http://www.folklore.org/StoryView.py?' +
                    'story=Mister_Macintosh.txt">Mr. Macintosh</a></p>');
            });

            it('should not convert Markdown text with no links', () => {
                const tempOptions = makeOptions({}, () => '**foo**');
                const text = instance.markdownLinks(tempOptions);

                expect(text).toBeInstanceOf(SafeString);
                expect(text.toString()).toBe('<p>**foo**</p>');
            });

            it('should not convert Markdown links if Markdown is disabled', () => {
                let text;
                let tempInstance;

                template.config.markdown = false;
                tempInstance = block(template);
                text = tempInstance.markdownLinks(options);

                expect(text).toBeInstanceOf(SafeString);
                expect(text.toString()).toBe('<p>[Mr. Macintosh]' +
                    '(http://www.folklore.org/StoryView.py?story=Mister_Macintosh.txt)</p>');
            });
        });

        describe('withOnly', () => {
            it('should create a context with the options hash values as properties', () => {
                const options = makeOptions({
                    test: 'foo'
                }, ({test}) => test);
                const text = instance.withOnly(options);

                expect(text).toBe('foo');
            });
        });
    });
});
