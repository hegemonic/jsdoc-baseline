/*
  Copyright 2022 the Baseline Authors.

  Licensed under the Apache License, Version 2.0 (the "License");
  you may not use this file except in compliance with the License.
  You may obtain a copy of the License at

      https://www.apache.org/licenses/LICENSE-2.0

  Unless required by applicable law or agreed to in writing, software
  distributed under the License is distributed on an "AS IS" BASIS,
  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  See the License for the specific language governing permissions and
  limitations under the License.
*/

import { promises as fs } from 'node:fs';
import { basename, join } from 'node:path';

import * as esbuild from 'esbuild';
import { sassPlugin } from 'esbuild-sass-plugin';
import escapeStringRegexp from 'escape-string-regexp';
import { execa } from 'execa';
import glob from 'fast-glob';
import { task } from 'hereby';
import Jasmine from 'jasmine';
import ConsoleReporter from 'jasmine-console-reporter';

function esbuildTextReplace(options) {
  options ??= { filter: /.*/, contentFilter: /.*/, replacers: [] };

  function applyReplacers(source, replacers) {
    let contents = source.slice();

    replacers?.forEach(({ regexp, replacement }) => {
      contents = contents.replaceAll(regexp, replacement);
    });

    return contents;
  }

  return {
    name: 'textReplace',
    setup(build) {
      build.onLoad({ filter: options.filter, namespace: options.namespace }, async ({ path }) => {
        let contents;
        let source;

        source = await fs.readFile(path, 'utf8');
        if (!options.contentFilter || options.contentFilter.test(source)) {
          contents = applyReplacers(source, options?.replacers);
        } else {
          contents = source;
        }

        return { contents };
      });
    },
  };
}

const BIN_DIR = 'node_modules/.bin';
const EXECA_OUT = {
  stdout: 'inherit',
  stderr: 'inherit',
};
const esbuildDevOptions = {
  css: {
    metafile: true,
    minify: false,
  },
  js: {
    metafile: true,
    minify: false,
    // TODO: figure out why this isn't working as expected in Chrome
    // sourcemap: true,
  },
};

const esbuildOptions = {
  css: {
    bundle: true,
    minify: true,
    outfile: './static/css/baseline.css',
    plugins: [
      sassPlugin({
        embedded: true,
      }),
    ],
  },
  js: {
    bundle: true,
    minify: true,
    outfile: './static/scripts/jsdoc.js',
    plugins: [
      esbuildTextReplace({
        filter: /\/webawesome\/dist\/chunks\/.+\.js$/,
        contentFilter: new RegExp(escapeStringRegexp('src/components/icon/library.system.ts')),
        replacers: [
          {
            // Remove unused data from JS bundle.
            //
            // We want to match everything up to the next `var`. RE2 doesn't support negative
            // lookahead, so we fake it.
            regexp: /.*?\s*(var \S+)(?:[^v]|v[^a]|va[^r]|var[^\s])*/gs,
            replacement: `export $1 = {};`,
          },
        ],
      }),
    ],
    target: ['es2020'],
  },
};
const sourceGlob = {
  code: ['publish.js', 'lib/**/*.js', 'scripts/**/*.js'],
  css: [],
  helpers: ['test/helpers/**/*.js'],
  js: {
    copy: [],
    minify: ['scripts/index.js'],
  },
  lint: ['*.js', 'lib/**/*.js', 'scripts/**/*.js', 'test/**/*.js'],
  sass: ['styles/baseline.scss'],
  tests: ['test/specs/add-matchers.cjs', 'test/specs/**/*.js'],
  views: ['views/**/*.hbs'],
};
const target = {
  // TODO: Should this be `static/css`?
  // TODO: Add JS path so we can delete .js.map files.
  css: 'static',
};

function bin(name) {
  return join(BIN_DIR, name);
}

function copyTo(dest) {
  return async (file) => {
    const out = join(dest, basename(file));

    await fs.copyFile(file, out);
  };
}

async function removeMaps(filepath) {
  let files;

  if (!filepath) {
    throw new Error('You must specify a filepath in which to remove .map files.');
  }

  files = await glob(join(filepath, '**/*.map'));

  await Promise.all(files.map((file) => fs.rm(file)));
}

const cssStatic = task({
  name: 'css-static',
  run: async () => {
    const files = await glob(sourceGlob.css);

    await Promise.all(files.map(copyTo(target.css)));
  },
});

const jsBuild = task({
  name: 'js-build',
  run: async () => {
    const files = await glob(sourceGlob.js.minify);

    const result = await esbuild.build({
      ...esbuildDevOptions.js,
      ...esbuildOptions.js,
      entryPoints: files,
    });

    await fs.writeFile('meta.json', JSON.stringify(result.metafile));
  },
});

const jsMinify = task({
  name: 'js-minify',
  run: async () => {
    const files = await glob(sourceGlob.js.minify);

    return esbuild.build({
      ...esbuildOptions.js,
      entryPoints: files,
      metafile: true,
    });
  },
});

const sassBuild = task({
  name: 'sass-build',
  run: async () => {
    const files = await glob(sourceGlob.css.concat(sourceGlob.sass));

    return esbuild.build({
      ...esbuildDevOptions.css,
      ...esbuildOptions.css,
      entryPoints: files,
    });
  },
});

export const coverage = task({
  name: 'coverage',
  run: async () => {
    await execa(bin('c8'), [
      '--exclude=Herebyfile.mjs',
      "--exclude='test{,s}/**'",
      '--reporter=html',
      bin('hereby'),
      'test',
    ]);
  },
});

export const css = task({
  name: 'css',
  run: async () => {
    const files = await glob(sourceGlob.css.concat(sourceGlob.sass));

    await removeMaps(target.css);

    return esbuild.build({
      ...esbuildOptions.css,
      entryPoints: files,
    });
  },
});

export const dev = task({
  name: 'dev',
  dependencies: [cssStatic, jsBuild, sassBuild],
});

export const format = task({
  name: 'format',
  run: async () => {
    await execa(bin('prettier'), ['--write', './']);
  },
});

export const js = task({
  name: 'js',
  dependencies: [jsMinify],
});

export const build = task({
  name: 'build',
  dependencies: [css, js],
});

// TODO: Also check that dependencies use acceptable licenses.
export const licenseCheck = task({
  name: 'license-check',
  run: async () => {
    await execa(bin('license-check-and-add'), ['check', '-f', '.license-check.json'], EXECA_OUT);
  },
});

export const lint = task({
  name: 'lint',
  run: async () => {
    await execa(bin('eslint'), [...sourceGlob.lint], EXECA_OUT);
  },
});

export const report = task({
  name: 'coverage-report',
  run: async () => {
    await execa(bin('c8'), ['report'], EXECA_OUT);
  },
});

export const test = task({
  name: 'test',
  run: async () => {
    const jasmine = new Jasmine();
    const reporter = new ConsoleReporter({
      beep: false,
      verbosity: {
        disabled: false,
        pending: false,
        specs: false,
        summary: true,
      },
    });

    jasmine.clearReporters();
    jasmine.addReporter(reporter);
    jasmine.exitOnCompletion = false;
    jasmine.loadConfig({
      helpers: sourceGlob.helpers,
      random: false,
      spec_files: sourceGlob.tests, // eslint-disable-line camelcase
    });

    await jasmine.execute();
  },
});

const lintAndTest = task({
  name: 'lint-and-test',
  dependencies: [lint, test],
});

export default lintAndTest;
