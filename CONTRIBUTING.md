Thanks for your interest in contributing to Baseline! If you'd like to send a pull request, here's
how to do it:


# Complete the Contributor License Agreement

You'll need to complete Google's Contributor License Agreement (CLA) before your pull request can be
accepted.

+ **If you hold the copyright to your pull request**, complete the [Individual CLA][google-cla].
+ **If your organization holds the copyright**, complete the
[Software Grant and Corporate CLA][google-corp-cla].

If you (or your organization) have submitted a CLA to Google in the past, you don't need to submit a
new CLA.

[google-cla]: https://developers.google.com/open-source/cla/individual
[google-corp-cla]: https://developers.google.com/open-source/cla/corporate


# Fork the repository, and create a new branch

See [GitHub's instructions][fork-repo] if you're not familiar with this process.

[fork-repo]: https://help.github.com/articles/fork-a-repo


# Install the required dependencies

To install the required Node.js modules:

    $ npm install -g gulp
    $ npm install

To install Bower and its required components:

    $ npm install -g bower
    $ bower install


# Make your changes

Be sure to add tests and update the existing tests as needed.

**Note**: Don't edit the files in `static/`! Those files are generated automatically.

## Editing CSS files

1. Update the [LESS][less] source files in the `styles/` directory.
2. Run `gulp css` to generate CSS files or `gulp css-minify` to generate minified CSS files.

[less]: http://lesscss.org/

## Editing client-side scripts

1. Update the source files in the `scripts/` directory.
2. Run `gulp js` to copy and minify the script files.


# Run tests

Make sure your changes pass the tests:

    $ gulp test

You'll get errors if your code is not lint-free, or if the test coverage isn't adequate. Please fix
all errors before you send a pull request.


# Commit and push your changes, then send a pull request

All pull requests are reviewed as quickly as possible. If you don't hear anything within a week,
feel free to ask for an update.
