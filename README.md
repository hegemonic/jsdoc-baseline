# Baseline

An extensible template for [JSDoc 3](https://github.com/jsdoc3/jsdoc).

**This is a preview version of the Baseline template.** Baseline is still under active development.
Everything in the template is subject to change.


## What is Baseline?

Baseline is a new HTML template for [JSDoc 3][jsdoc]. It offers several benefits:

+ **Extensible from the ground up.** You can use extensions to customize your documentation's
content and appearance without changing Baseline itself. In addition, you can localize the headings
and other text that are added by the template. **Note:** Customization options are limited in this
preview version. More options will be available soon.
+ **Easy to navigate.** An expandable table of contents helps users find what they're looking for.
Also, a summary at the top of each page shows users what's documented on that page.
+ **Modern template syntax.** Baseline uses [Handlebars][handlebars], a powerful JavaScript template
engine, to define the template layout. Handlebars makes it possible to define new tags and helpers
that you can use in your customizations to Baseline.

[jsdoc]: https://github.com/jsdoc3/jsdoc
[handlebars]: http://handlebarsjs.com/


## Installing Baseline

1. Install [JSDoc](https://github.com/jsdoc3/jsdoc).

    **Note**: Baseline currently requires the latest version of JSDoc from the master branch on
    GitHub. In addition, Baseline does not currently support JSDoc running on Mozilla Rhino; use
    Node.js instead. Rhino support will be available in the future.

    To install JSDoc globally (may require `sudo`):

        npm install -g https://github.com/jsdoc3/jsdoc/tarball/master

    To add JSDoc to your Node.js project as a development dependency:

        npm install --save-dev https://github.com/jsdoc3/jsdoc/tarball/master

2. Add the Baseline template to your Node.js project as a development dependency:

        npm install --save-dev https://github.com/hegemonic/baseline/tarball/master


## Configuring and Using Baseline

To use the Baseline template with its default settings, simply run JSDoc with the `--template`
(or `-t`) command-line option:

    jsdoc --template <path/to/baseline> <path/to/js-files>

To use the Baseline template with customized settings:

1. Copy `baseline-config.json.EXAMPLE` to a new file (for example, `baseline-config.json`).
2. Modify the configuration file as needed. See `baseline-config.json.EXAMPLE` for information about
the supported options. You can use comments in the configuration file.
3. Update your JSDoc `conf.json` file to include a `templates.baseline` property. This property
must contain the path to your Baseline configuration file.
4. Run JSDoc as shown above, using the `--configure` (or `-c`) option to tell JSDoc where to find
your `conf.json` file:

        jsdoc --configure <path/to/conf.json> --template <path/to/baseline> <path/to/js-files>

**Note**: Future versions of Baseline will provide additional configuration settings, including
settings for overriding and modifying portions of the template.


## Legal stuff

Copyright 2014-2015 Google Inc. Licensed under the Apache License, Version 2.0.

See [LICENSE.md][license] for more information.

[license]: LICENSE.md
