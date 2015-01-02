'use strict';

// Load the global `expect` shim
require('expectations');

function toBeArray() {
    if (!Array.isArray(this.value)) {
        return this.assertions.fail('to be an array.');
    }

    this.assertions.pass();
}

expect.addAssertion('toBeAnArray', toBeArray);
expect.addAssertion('toBeArray', toBeArray);

function toBeBoolean() {
    if (this.value !== true && this.value !== false) {
        return this.assertions.fail('to be a boolean.');
    }

    this.assertions.pass();
}

expect.addAssertion('toBeABoolean', toBeBoolean);
expect.addAssertion('toBeBoolean', toBeBoolean);

expect.addAssertion('toBeFalse', function() {
    if (this.value !== false) {
        return this.assertions.fail('to be false.');
    }

    this.assertions.pass();
});

function toBeFunction() {
    if (typeof this.value !== 'function') {
        return this.assertions.fail('to be a function.');
    }

    this.assertions.pass();
}

expect.addAssertion('toBeAFunction', toBeFunction);
expect.addAssertion('toBeFunction', toBeFunction);

function toBeInstanceOf(klass) {
    var actualClassName = this.value.constructor ? this.value.constructor.name : undefined;
    var expectedClassName;

    if (typeof klass === 'string') {
        expectedClassName = klass;
    } else {
        expectedClassName = klass.name;
    }

    if (actualClassName !== expectedClassName) {
        return this.assertions.fail('to be an instance of ' + expectedClassName + '.');
    }

    this.assertions.pass();
}

expect.addAssertion('toBeAnInstanceOf', toBeInstanceOf);
expect.addAssertion('toBeInstanceOf', toBeInstanceOf);

function toBeNumber() {
    if (typeof this.value !== 'number') {
        return this.assertions.fail('to be a number.');
    }

    this.assertions.pass();
}

expect.addAssertion('toBeANumber', toBeNumber);
expect.addAssertion('toBeNumber', toBeNumber);
expect.addAssertion('toBeNumeric', toBeNumber);

function toBeObject() {
    // don't treat arrays or `null` as objects
    if (typeof this.value !== 'object' || Array.isArray(this.value) || this.value === null) {
        return this.assertions.fail('to be an object.');
    }

    this.assertions.pass();
}

expect.addAssertion('toBeAnObject', toBeObject);
expect.addAssertion('toBeObject', toBeObject);

function toBeString() {
    if (typeof this.value !== 'string') {
        return this.assertions.fail('to be a string.');
    }

    this.assertions.pass();
}

expect.addAssertion('toBeAString', toBeString);
expect.addAssertion('toBeString', toBeString);

expect.addAssertion('toBeTrue', function() {
    if (this.value !== true) {
        return this.assertions.fail('to be true.')
    }

    this.assertions.pass();
});
