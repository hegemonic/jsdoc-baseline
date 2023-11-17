/*
  Copyright 2014 the Baseline Authors.

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

import path from 'node:path';
import { fileURLToPath } from 'node:url';

import * as config from '../../../lib/config.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

describe('lib/config', () => {
  let emitter;
  let env;

  beforeEach(() => {
    emitter = helpers.deps.get('emitter');
    env = helpers.deps.get('env');
  });
  afterEach(() => helpers.setup());

  it('is an object', () => {
    expect(config).toBeObject();
  });

  it('has a `defaultConfig` object', () => {
    expect(config.defaultConfig).toBeObject();
  });

  describe('loadConfigSync', () => {
    it('works if the config object is embedded in the JSDoc config file', () => {
      let conf;

      env.conf.templates.baseline = {
        beautify: !config.defaultConfig.beautify,
      };
      conf = config.loadConfigSync(helpers.deps);

      expect(conf.beautify).toBe(!config.defaultConfig.beautify);
    });

    it('uses the correct default paths', () => {
      let conf;

      env.conf.templates.baseline = path.resolve(__dirname, '../../fixtures/config.json');
      env.opts.template = '/foo/bar/baz';

      conf = config.loadConfigSync(helpers.deps);

      expect(conf.foo).toBe('bar');
      expect(conf.templatePath).toBe('/foo/bar/baz');
    });

    it('emits a fatal error if the config file is missing', () => {
      let event;

      function listener(e) {
        event = e;
      }

      env.conf.templates.baseline = path.resolve(__dirname, '/not/a/real/path');

      emitter.on('logger:fatal', listener);
      config.loadConfigSync(helpers.deps);
      emitter.off('logger:fatal', listener);

      expect(event).toBeDefined();
    });

    it('supports JSON files that contain comments', () => {
      let conf;
      let event;

      function listener(e) {
        event = e;
      }

      env.conf.templates.baseline = path.resolve(__dirname, '../../fixtures/comments.json');

      emitter.on('logger:fatal', listener);
      conf = config.loadConfigSync(helpers.deps);
      emitter.off('logger:fatal', listener);

      expect(event).toBeUndefined();
      expect(conf.foo).toBe('bar');
    });

    it('gets the L10N filename from the locale', () => {
      let conf;

      env.conf.templates.baseline = path.resolve(__dirname, '../../fixtures/config.json');

      conf = config.loadConfigSync(helpers.deps);

      expect(conf.l10nFile).toBe('en.yaml');
    });

    it('uses the L10N filename from the config file, if specified there', () => {
      let conf;

      env.conf.templates.baseline = path.resolve(__dirname, '../../fixtures/config-l10nfile.json');

      conf = config.loadConfigSync(helpers.deps);

      expect(conf.l10nFile).toBe('l10n.yaml');
    });
  });

  describe('readJsonSync', () => {
    it('reads a JSON file with comments', () => {
      function readJson() {
        return config.readJsonSync(path.resolve(__dirname, '../../fixtures/comments.json'));
      }

      expect(readJson).not.toThrow();
      expect(readJson().foo).toBe('bar');
    });

    it('throws if there is an exception', () => {
      function readJson() {
        return config.readJsonSync(path.resolve(__dirname, 'no-such-file.json'));
      }

      expect(readJson).toThrow();
    });

    it('returns `undefined` if no path is specified', () => {
      const result = config.readJsonSync();

      expect(result).toBeUndefined();
    });
  });
});
