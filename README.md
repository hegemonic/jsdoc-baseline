# Baseline

![Build status](https://img.shields.io/github/actions/workflow/status/hegemonic/jsdoc-baseline/build.yaml?branch=main&style=flat-square)
[![npm version](https://img.shields.io/npm/v/jsdoc-baseline.svg?style=flat-square)](https://www.npmjs.org/package/jsdoc-baseline)

An extensible template for [JSDoc][jsdoc].

**This is a preview version of the Baseline template.** Baseline is under active development.
Everything in the template is subject to change.

## What is Baseline?

Baseline is an HTML template for [JSDoc][jsdoc]. It offers several benefits:

- **Extensible from the ground up.** You can use extensions to customize your documentation's
  content and appearance without changing Baseline itself. In addition, you can localize the
  headings and other text that are added by the template. **Note:** Customization options are
  limited in this preview version.
- **Easy to navigate.** An expandable table of contents helps users find what they're looking for.
  Also, a summary at the top of each page shows what's documented on that page.
- **Modern template syntax.** Baseline uses [Nunjucks][nunjucks], a powerful JavaScript template
  engine, to define the template layout. You can define new Nunjucks filters and use them in your
  customizations to Baseline.

## Installing Baseline

1.  Add [JSDoc][jsdoc] to your Node.js project as a development dependency:

    ```sh
    npm install --save-dev jsdoc
    ```

2.  Add the Baseline template to your Node.js project as a development dependency:

    ```sh
    npm install --save-dev jsdoc-baseline
    ```

## Configuring and using Baseline

To use the Baseline template with its default settings, run JSDoc with the `--template` (or `-t`)
command-line option:

```sh
jsdoc --template <path/to/baseline> <path/to/js-files>
```

To use the Baseline template with customized settings:

1.  Copy `baseline-config-example.json` to a new file (for example, `baseline-config.json`).
2.  Modify the configuration file as needed. See `baseline-config-example.json` for information
    about the supported options. You can use comments in the configuration file.
3.  Update your JSDoc `conf.json` file to include a `templates.baseline` property. This property
    must contain the path to your Baseline configuration file.
4.  Run JSDoc as shown above, using the `--configure` (or `-c`) option to tell JSDoc where to find
    your `conf.json` file:

```sh
jsdoc --configure <path/to/conf.json> --template <path/to/baseline> <path/to/js-files>
```

## Legal stuff

Copyright 2014 the Baseline Authors. Licensed under the Apache License, Version 2.0. See
[LICENSE.md][license] for more information.

[jsdoc]: https://github.com/jsdoc/jsdoc
[license]: https://github.com/hegemonic/jsdoc-baseline/blob/master/LICENSE.md
[nunjucks]: https://mozilla.github.io/nunjucks/
