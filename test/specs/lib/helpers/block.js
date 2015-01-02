'use strict';

describe('lib/helpers/block', function() {
    var block;
    var helpers = require('../../../helpers');

    helpers.setup();
    block = require('../../../../lib/helpers/block');

    it('should export a function', function() {
        expect(block).toBeFunction();
    });

    it('should return an object', function() {
        expect(block()).toBeObject();
    });

    describe('helpers', function() {
        var instance = block();

        function testBlockHelper(helper, args, hash) {
            var result;
            var options = {
                fn: function() {
                    result = true;
                },
                hash: hash || {},
                inverse: function() {
                    result = false;
                }
            };

            args = args || [];
            args.push(options);

            instance[helper].apply(instance, args);

            return result;
        }

        xdescribe('all', function() {
            // TODO
        });

        xdescribe('any', function() {
            // TODO
        });

        xdescribe('balancedGroup', function() {
            // TODO
        });

        xdescribe('blockHelperMissing', function() {
            // TODO
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

        xdescribe('continuedBlock', function() {
            // TODO
        });

        xdescribe('eachContinuedGroup', function() {
            // TODO
        });

        xdescribe('eachContinuedGroupSection', function() {
            // TODO
        });

        xdescribe('first', function() {
            // TODO
        });

        xdescribe('is', function() {
            // TODO
        });

        xdescribe('isnt', function() {
            // TODO
        });

        xdescribe('last', function() {
            // TODO
        });

        xdescribe('markdown', function() {
            // TODO
        });

        xdescribe('markdownLinks', function() {
            // TODO
        });

        xdescribe('translateContinued', function() {
            // TODO
        });

        xdescribe('withOnly', function() {
            // TODO
        });
    });
});
