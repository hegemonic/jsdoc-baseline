Thanks for your interest in contributing to Baseline! If you'd like to send a
pull request, here's how to do it.

**Note**: Baseline is still being developed, and the code is changing quickly.
Please submit a bug report or feature request before you spend time on a pull
request. Thanks!

## Contributor License Agreement

Contributions to this project must be accompanied by a Contributor License
Agreement. You (or your employer) retain the copyright to your contribution;
this simply gives us permission to use and redistribute your contributions as
part of the project. Head over to <https://cla.developers.google.com/> to see
your current agreements on file or to sign a new one.

You generally only need to submit a CLA once, so if you've already submitted one
(even if it was for a different project), you probably don't need to do it
again.

## Install dependencies

To install the required Node.js modules:

```sh
npm install -g gulp
npm install

To install Bower and its required components:

```sh
npm install -g bower
bower install
```

## Make your changes

Be sure to add tests and update the existing tests as needed.

**Note**: Don't edit the files in `static/`! Those files are generated
automatically.

### CSS files

1. Update the [LESS][less] source files in the `styles/` directory.
2. Run `gulp css` to generate CSS files or `gulp css-minify` to generate
minified CSS files.

### Client-side scripts

1. Update the source files in the `scripts/` directory.
2. Run `gulp js` to copy and minify the script files.

## Run tests

Make sure your changes pass the tests:

```sh
gulp test
```

You'll get errors if your code is not lint-free, or if the test coverage isn't
adequate. Please fix all errors before you send a pull request.

## Code reviews

We use GitHub pull requests for code reviews. Consult [GitHub Help][github-pr]
for more information on using pull requests.

## Community guidelines

This project follows
[Google's Open Source Community Guidelines](https://opensource.google.com/conduct/).

[fork-repo]: https://help.github.com/articles/fork-a-repo
[less]: http://lesscss.org/
[github-pr]: https://help.github.com/articles/about-pull-requests/
