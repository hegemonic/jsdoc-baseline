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
describe('lib/markdown', () => {
  const markdown = require('../../../lib/markdown');

  it('is an object', () => {
    expect(markdown).toBeObject();
  });

  it('exports a getRenderer function', () => {
    expect(markdown.getRenderer).toBeFunction();
  });

  describe('getRenderer', () => {
    function setMarkdownConf(conf) {
      const env = helpers.deps.get('env');

      env.conf.markdown = conf;
    }

    afterEach(() => {
      helpers.setup();
    });

    it('returns a function when the config is empty', () => {
      let parser;

      setMarkdownConf({});
      parser = markdown.getRenderer(helpers.deps);

      expect(parser).toBeFunction();
    });

    it('does not change text within inline tags', () => {
      const parser = markdown.getRenderer(helpers.deps);

      expect(parser('{@link MyClass#_x} and {@link MyClass#_y}')).toBe(
        '<p>{@link MyClass#_x} and {@link MyClass#_y}</p>'
      );
    });

    it('does not convert HTTP/HTTPS URLs to links', () => {
      const parser = markdown.getRenderer(helpers.deps);

      expect(parser('Visit {@link http://usejsdoc.com}.')).toBe(
        '<p>Visit {@link http://usejsdoc.com}.</p>'
      );
      expect(parser('Visit {@link https://google.com}.')).toBe(
        '<p>Visit {@link https://google.com}.</p>'
      );
    });

    it('hardwraps new lines when requested', () => {
      let parser;

      setMarkdownConf({ hardwrap: true });
      parser = markdown.getRenderer(helpers.deps);

      expect(parser('line one\nline two')).toBe('<p>line one<br>\nline two</p>');
    });

    it('adds heading IDs when requested', () => {
      let parser;

      setMarkdownConf({ idInHeadings: true });
      parser = markdown.getRenderer(helpers.deps);

      expect(parser('# Hello')).toBe('<h1 id="hello">Hello</h1>');
    });
  });
});
