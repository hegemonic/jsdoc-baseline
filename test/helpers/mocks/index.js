// Replicates Jasmine's built-in functions for creating spies, stubs, and mocks.
// Supports Jasmine 1.3 syntax only. Does not support jasmine.createSpy() or jasmine.createSpyObj().

const simple = require('simple-mock');

// Load the global `expect` shim
require('expectations');

class Spy {
    constructor(obj, key) {
        const mock = simple.mock(obj, key).returnWith();

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
                get() {
                    return mock.calls.map(({ args }) => args);
                }
            },
            calls: {
                enumerable: true,
                get() {
                    return mock.calls;
                }
            },
            isSpy: {
                enumerable: true,
                value: true
            },
            mostRecentCall: {
                enumerable: true,
                get() {
                    return mock.lastCall;
                }
            }
        });
    }

    _reset() {
        const args = [].slice.call(arguments);

        args.unshift(this._obj, this._key);

        this._mock.restore();

        this._mock = simple.mock(...arguments);
    }

    andCallFake(func) {
        this._reset(func);
    }

    andCallThrough() {
        // simple-mock calls through to the original function by default
        this._reset();
    }

    andReturn(value) {
        this._mock.restore();

        this._mock = simple.mock(this._obj[this._key]).returnWith(value);
    }
}

/* eslint-disable consistent-return,no-invalid-this */
expect.addAssertion('toHaveBeenCalled', function() {
    if (arguments.length) {
        throw new Error('toHaveBeenCalled does not take arguments; use toHaveBeenCalledWith');
    }

    if (!this.value.called) {
        return this.assertions.fail('to have been called.');
    }

    this.assertions.pass();
});

expect.addAssertion('toHaveBeenCalledWith', function() {
    const args = [].slice.call(arguments);
    let call;
    const mock = this.value;
    let wasCalledWith = true;

    for (let i = 0, ii = mock.calls.length; i < ii; i++) {
        call = mock.calls[i];

        // did we get the right number of arguments?
        if (call.args.length === args.length) {
            // do the values match?
            for (let j = 0, jj = call.args.length; j < jj; j++) {
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
        return this.assertions.fail(` to have been called with ${args}, but actual calls were: ` +
            `${mock.argsForCall}`);
    }

    return this.assertions.pass();
});

/* eslint-enable consistent-return,no-invalid-this */

global.spyOn = (obj, key) => new Spy(obj, key);

// Automatically restore the mocks after each test
afterEach(() => {
    simple.restore();
});
