// Replicates Jasmine's built-in functions for creating spies, stubs, and mocks.
// Supports Jasmine 1.3 syntax only. Does not support jasmine.createSpy() or jasmine.createSpyObj().

'use strict';

var simple = require('simple-mock');
var util = require('util');

// Load the global `expect` shim
require('expectations');

function Spy(obj, key) {
    var mock = simple.mock(obj, key).returnWith();

    Object.defineProperties(this, {
        _key: {
            value: key
        },
        _mock: {
            writable: true,
            value: mock
        },
        _obj: {
            value: obj
        },
        argsForCall: {
            enumerable: true,
            get: function() {
                return mock.calls.map(function(call) {
                    return call.args;
                });
            }
        },
        calls: {
            enumerable: true,
            get: function() {
                return mock.calls;
            }
        },
        isSpy: {
            enumerable: true,
            value: true
        },
        mostRecentCall: {
            enumerable: true,
            get: function() {
                return mock.lastCall;
            }
        }
    });
}

Spy.prototype._reset = function() {
    var args = [].slice.call(arguments);

    args.unshift(this._obj, this._key);

    this._mock.restore();

    this._mock = simple.mock.apply(simple, arguments);
};

Spy.prototype.andCallFake = function(func) {
    this._reset(func);
};

Spy.prototype.andCallThrough = function() {
    // simple-mock calls through to the original function by default
    this._reset();
};

Spy.prototype.andReturn = function(value) {
    this._mock.restore();

    this._mock = simple.mock(this._obj[this._key]).returnWith(value);
};

function checkMock(expectInstance) {
    if (!expectInstance.value instanceof Spy) {
        throw new Error(util.format('Expected a spy, but got %j.', expectInstance.value));
    }
}

expect.addAssertion('toHaveBeenCalled', function() {
    if (arguments.length) {
        throw new Error('toHaveBeenCalled does not take arguments; use toHaveBeenCalledWith');
    }

    checkMock(this);

    if (!this.value.called) {
        return this.assertions.fail('to have been called.');
    }

    this.assertions.pass();
});

expect.addAssertion('toHaveBeenCalledWith', function() {
    var args = [].slice.call(arguments);
    var call;
    var mock = this.value;
    var wasCalledWith = true;

    checkMock(mock);

    for (var i = 0, ii = mock.calls.length; i < ii; i++) {
        call = mock.calls[i];

        // did we get the right number of arguments?
        if (call.args.length === args.length) {
            // do the values match?
            for (var j = 0, jj = call.args.length; j < jj; j++) {
                if (call.args[j] !== args[j]) {
                    wasCalledWith = false;
                    break;
                }
            }
        } else {
            wasCalledWith = false;
        }

        if (wasCalledWith === true) {
            break;
        }
    }

    if (!wasCalledWith) {
        return this.assertions.fail(util.format(' to have been called with %j, ' +
            'but actual calls were: %j', args, mock.argsForCall));
    }

    return this.assertions.pass();
});

global.spyOn = function(obj, key) {
    return new Spy(obj, key);
};

// Automatically restore the mocks after each test
afterEach(function() {
    simple.restore();
});
