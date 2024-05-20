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
import { execa } from 'execa';
import glob from 'fast-glob';
import { promises as fs } from 'fs';
import { task } from 'hereby';
import Jasmine from 'jasmine';
import ConsoleReporter from 'jasmine-console-reporter';
import path from 'path';

const BIN_DIR = 'node_modules/.bin';
const EXECA_OUT = {
  stdout: 'inherit',
  stderr: 'inherit',
};
const sourceGlob = {
  code: ['publish.js', 'lib/**/*.js', 'scripts/**/*.js'],
  css: ['styles/hljs-tomorrow.css'],
  helpers: ['test/helpers/**/*.js'],
  js: {
    copy: [],
    minify: ['scripts/*.js'],
  },
  lint: ['*.js', 'lib/**/*.js', 'scripts/**/*.js', 'test/**/*.js'],
  sass: ['styles/baseline.scss'],
  tests: ['test/specs/add-matchers.cjs', 'test/specs/**/*.js'],
  views: ['views/**/*.hbs'],
};
const target = {
  css: 'static/css',
  js: 'static/scripts',
};

function bin(name) {
  return path.join(BIN_DIR, name);
}

function copyTo(dest) {
  return async (file) => {
    const out = path.join(dest, path.basename(file));

    await fs.copyFile(file, out);
  };
}

async function removeMaps(filepath) {
  let files;

  if (!filepath) {
    throw new Error('You must specify a filepath in which to remove .map files.');
  }

  files = await glob(path.join(filepath, '**/*.map'));

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

    await execa(
      bin('parcel'),
      ['build', ...files, '--dist-dir', target.js, '--no-optimize'],
      EXECA_OUT
    );
  },
});

const jsCopy = task({
  name: 'js-copy',
  run: async () => {
    const files = await glob(sourceGlob.js.copy);

    await Promise.all(files.map(copyTo(target.js)));
  },
});

const jsMinify = task({
  name: 'js-minify',
  run: async () => {
    const files = await glob(sourceGlob.js.minify);

    await execa(
      bin('parcel'),
      ['build', ...files, '--dist-dir', target.js, '--no-source-maps'],
      EXECA_OUT
    );
  },
});

const sassBuild = task({
  name: 'sass-build',
  run: async () => {
    const files = await glob(sourceGlob.css.concat(sourceGlob.sass));

    await execa(
      bin('parcel'),
      ['build', ...files, '--dist-dir', target.css, '--no-optimize'],
      EXECA_OUT
    );
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
    await execa(
      bin('parcel'),
      ['build', ...files, '--dist-dir', target.css, '--no-source-maps'],
      EXECA_OUT
    );
  },
});

export const dev = task({
  name: 'dev',
  dependencies: [cssStatic, jsBuild, jsCopy, sassBuild],
});

export const format = task({
  name: 'format',
  run: async () => {
    await execa(bin('prettier'), ['--write', './']);
  },
});

export const js = task({
  name: 'js',
  dependencies: [jsCopy, jsMinify],
  run: async () => {
    await removeMaps(target.js);
  },
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
