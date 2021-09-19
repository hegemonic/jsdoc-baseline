describe('lib/markdown', () => {
  const env = require('jsdoc/env');
  const markdown = require('../../../lib/markdown');
  const path = require('path');

  it('is an object', () => {
    expect(markdown).toBeObject();
  });

  it('exports a getParser function', () => {
    expect(markdown.getParser).toBeFunction();
  });

  describe('getParser', () => {
    const originalMarkdownConf = env.conf.markdown;

    function setMarkdownConf(conf) {
      env.conf.markdown = conf;
    }

    afterEach(() => {
      env.conf.markdown = originalMarkdownConf;
    });

    it('returns a function when the config is empty', () => {
      let parser;

      setMarkdownConf({});
      parser = markdown.getParser();

      expect(parser).toBeFunction();
    });

    it('does not change text within inline tags', () => {
      const parser = markdown.getParser();

      expect(parser('{@link MyClass#_x} and {@link MyClass#_y}')).toBe(
        '<p>{@link MyClass#_x} and {@link MyClass#_y}</p>'
      );
    });

    it('does not convert HTTP/HTTPS URLs to links', () => {
      const parser = markdown.getParser();

      expect(parser('Visit {@link http://usejsdoc.com}.')).toBe(
        '<p>Visit {@link http://usejsdoc.com}.</p>'
      );
      expect(parser('Visit {@link https://google.com}.')).toBe(
        '<p>Visit {@link https://google.com}.</p>'
      );
    });

    it('escapes the expected characters in code blocks', () => {
      const parser = markdown.getParser();
      const markdownText = '```html\n<p><a href="#">Sample \'HTML.\'</a></p>\n```';
      const convertedText =
        '' +
        '<pre class="prettyprint source lang-html"><code>' +
        "&lt;p&gt;&lt;a href=&quot;#&quot;&gt;Sample 'HTML.'&lt;/a&gt;&lt;/p&gt;\n" +
        '</code></pre>';

      expect(parser(markdownText)).toBe(convertedText);
    });

    it('hardwraps new lines when requested', () => {
      let parser;

      setMarkdownConf({ hardwrap: true });
      parser = markdown.getParser();

      expect(parser('line one\nline two')).toBe('<p>line one<br>\nline two</p>');
    });

    it('adds heading IDs when requested', () => {
      let parser;

      setMarkdownConf({ idInHeadings: true });
      parser = markdown.getParser();

      expect(parser('# Hello')).toBe('<h1 id="hello">Hello</h1>');
    });

    it('does not pretty-print code blocks that start with "```plain"', () => {
      const parser = markdown.getParser();
      const markdownText = '```plain\nconsole.log("foo");\n```';
      const convertedText =
        '<pre class="source"><code>console.log(&quot;foo&quot;);\n</code></pre>';

      expect(parser(markdownText)).toBe(convertedText);
    });

    describe('syntax highlighter', () => {
      it('supports a `highlight` function defined in the config file', () => {
        let parser;

        setMarkdownConf({
          highlight(code, language) {
            return `<pre><code>${code} highlighted as ${language}</code></pre>`;
          },
        });
        parser = markdown.getParser();

        expect(parser('```js\nhello\n```')).toBe(
          '<pre><code>hello\n highlighted as js</code></pre>'
        );
      });

      it('supports `highlight` as the path to a highlighter module', () => {
        let parser;

        setMarkdownConf({
          highlight: path.join(__dirname, '../../fixtures/markdown/highlighter'),
        });
        parser = markdown.getParser();

        expect(parser('```js\nhello\n```')).toBe(
          '<pre><code>hello\n in this language: js</code></pre>'
        );
      });

      // TODO: Re-enable when `jsdoc.didLog()` is available outside of the JSDoc repo
      xit('logs an error if the `highlight` module cannot be found', () => {
        /*
                function getParser() {
                    setMarkdownConf({
                        highlight: path.join(__dirname, 'foo/bar/baz')
                    });
                    markdown.getParser();
                }

                expect(jsdoc.didLog(getParser, 'error')).toBeTrue();
                */
      });

      // TODO: Re-enable when `jsdoc.didLog()` is available outside of the JSDoc repo
      xit(
        'logs an error if the `highlight` module does not assign a method to ' +
          '`exports.highlight`',
        () => {
          /*
                function getParser() {
                    setMarkdownConf({
                        highlight: path.join(__dirname, '../../fixtures/markdown/bad-highlighter')
                    });
                    markdown.getParser();
                }

                expect(jsdoc.didLog(getParser, 'error')).toBeTrue();
                */
        }
      );
    });
  });
});
