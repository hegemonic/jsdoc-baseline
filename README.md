# Baseline

An extensible template for [JSDoc 3](https://github.com/jsdoc3/jsdoc).

More docs to come.


## Installation

1. Install [JSDoc](https://github.com/jsdoc3/jsdoc).

    **Note**: Baseline currently requires the latest version of JSDoc from the master branch on
    GitHub.

    To install JSDoc globally (may require `sudo`):

        npm install -g https://github.com/jsdoc3/jsdoc/tarball/master

    To add JSDoc to your Node.js project as a development dependency:

        npm install --save-dev https://github.com/jsdoc3/jsdoc/tarball/master

2. Add the Baseline template to your Node.js project as a development dependency:

        npm install --save-dev https://github.com/hegemonic/baseline/tarball/master


## Usage

To use the Baseline template, run JSDoc with the `--template` command-line option:

    jsdoc --template <path/to/baseline> <path/to/js-files>
