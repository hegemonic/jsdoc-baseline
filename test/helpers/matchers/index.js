// Load the global `expect` shim
require('expectations');

/* eslint-disable consistent-return,no-invalid-this */

expect.addAssertion('toBeArray', function() {
    if (!Array.isArray(this.value)) {
        return this.assertions.fail('to be an array.');
    }

    this.assertions.pass();
});

expect.addAssertion('toBeBoolean', function() {
    if (this.value !== true && this.value !== false) {
        return this.assertions.fail('to be a boolean.');
    }

    this.assertions.pass();
});

expect.addAssertion('toBeFalse', function() {
    if (this.value !== false) {
        return this.assertions.fail('to be false.');
    }

    this.assertions.pass();
});

expect.addAssertion('toBeFunction', function() {
    if (typeof this.value !== 'function') {
        return this.assertions.fail('to be a function.');
    }

    this.assertions.pass();
});

expect.addAssertion('toBeInstanceOf', function(klass) {
    const actualClassName = this.value.constructor ? this.value.constructor.name : undefined;
    let expectedClassName;

    if (typeof klass === 'string') {
        expectedClassName = klass;
    } else {
        expectedClassName = klass.name;
    }

    if (actualClassName !== expectedClassName) {
        return this.assertions.fail(`to be an instance of ${expectedClassName}.`);
    }

    this.assertions.pass();
});

expect.addAssertion('toBeNumber', function() {
    if (typeof this.value !== 'number') {
        return this.assertions.fail('to be a number.');
    }

    this.assertions.pass();
});

expect.addAssertion('toBeObject', function() {
    // don't treat arrays or `null` as objects
    if (typeof this.value !== 'object' || Array.isArray(this.value) || this.value === null) {
        return this.assertions.fail('to be an object.');
    }

    this.assertions.pass();
});

expect.addAssertion('toBeString', function() {
    if (typeof this.value !== 'string') {
        return this.assertions.fail('to be a string.');
    }

    this.assertions.pass();
});

expect.addAssertion('toBeTrue', function() {
    if (this.value !== true) {
        return this.assertions.fail('to be true.');
    }

    this.assertions.pass();
});

/* eslint-enable consistent-return,no-invalid-this */
