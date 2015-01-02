/*global before */
// Use this file to set before/after/beforeEach/afterEach hooks that will be applied to all
// test suites.

'use strict';

before(function() {
    require('expectations');
    require('../helpers/matchers');
    require('../helpers/mocks');
});
