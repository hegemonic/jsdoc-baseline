/* global before */
// Use this file to set before/after/beforeEach/afterEach hooks that will be applied to all
// test suites.

before(() => {
    require('expectations');
    require('../helpers/matchers');
    require('../helpers/mocks');
});
