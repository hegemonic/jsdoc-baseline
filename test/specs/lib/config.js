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
describe('lib/config', () => {
  const { EventBus } = require('@jsdoc/util');
  const config = require('../../../lib/config');
  const path = require('path');

  let env;
  const bus = new EventBus('jsdoc');

  beforeEach(() => (env = helpers.deps.get('env')));
  afterEach(() => helpers.setup());

  it('should be an object', () => {
    expect(config).toBeObject();
  });

  it('should export a "defaultConfig" object', () => {
    expect(config.defaultConfig).toBeObject();
  });

  it('should export a "loadConfigSync" method', () => {
    expect(config.loadConfigSync).toBeFunction();
  });

  it('should export a "readJsonSync" method', () => {
    expect(config.readJsonSync).toBeFunction();
  });

  describe('loadConfigSync', () => {
    it('should work if the config object is embedded in the JSDoc config file', () => {
      let conf;

      env.conf.templates.baseline = {
        beautify: !config.defaultConfig.beautify,
      };
      conf = config.loadConfigSync(helpers.deps);

      expect(conf.beautify).toBe(!config.defaultConfig.beautify);
    });

    it('should use the correct default paths', () => {
      let conf;

      env.conf.templates.baseline = path.resolve(__dirname, '../../fixtures/config.json');
      env.opts.template = '/foo/bar/baz';

      conf = config.loadConfigSync(helpers.deps);

      expect(conf.foo).toBe('bar');
      expect(conf.templatePath).toBe('/foo/bar/baz');
    });

    it('should set default values even if the config file is missing', () => {
      let conf;
      let event;

      env.conf.templates.baseline = path.resolve(__dirname, '/not/a/real/path');

      bus.once('logger:fatal', (e) => {
        event = e;
      });
      conf = config.loadConfigSync(helpers.deps);

      expect(event).toBeDefined();
      expect(Object.keys(conf).length).toBeGreaterThan(0);
    });

    it('should work with JSON files that contain comments', () => {
      let conf;
      let event;

      function listener(e) {
        event = e;
      }

      env.conf.templates.baseline = path.resolve(__dirname, '../../fixtures/comments.json');

      bus.on('logger:fatal', listener);
      conf = config.loadConfigSync(helpers.deps);
      bus.off('logger:fatal', listener);

      expect(event).toBeUndefined();
      expect(conf.foo).toBe('bar');
    });

    it('should get the L10N filename from the locale', () => {
      let conf;

      env.conf.templates.baseline = path.resolve(__dirname, '../../fixtures/config.json');

      conf = config.loadConfigSync(helpers.deps);

      expect(conf.l10nFile).toBe('en.yaml');
    });

    it('should use the L10N filename from the config file, if specified there', () => {
      let conf;

      env.conf.templates.baseline = path.resolve(__dirname, '../../fixtures/config-l10nfile.json');

      conf = config.loadConfigSync(helpers.deps);

      expect(conf.l10nFile).toBe('l10n.yaml');
    });
  });

  describe('readJsonSync', () => {
    it('should be able to read a JSON file with comments', () => {
      function readJson() {
        return config.readJsonSync(path.resolve(__dirname, '../../fixtures/comments.json'));
      }

      expect(readJson).not.toThrow();
      expect(readJson().foo).toBe('bar');
    });

    it('should log a fatal error if there is an exception', () => {
      function readJson() {
        return config.readJsonSync(path.resolve(__dirname, 'no-such-file.json'));
      }

      expect(readJson).not.toThrow();
    });

    it('should return nothing if no path is specified', () => {
      const result = config.readJsonSync();

      expect(result).toBeUndefined();
    });
  });
});
