const _ = require('lodash');
const LinkManager = require('../../../lib/link-manager');

const ARGUMENT_ERROR = 'ArgumentError';

describe('lib/link-manager', () => {
  let instance;
  let opts = {
    config: {},
    fileExtension: '.html',
    linkExtension: '.html',
  };

  beforeEach(() => {
    instance = new LinkManager(opts);
  });

  it('is a constructor', () => {
    function factory() {
      return new LinkManager(opts);
    }

    expect(factory).not.toThrow();
  });

  it('fails on bad input', () => {
    function factory() {
      return new LinkManager({
        config: 7,
      });
    }

    expect(factory).toThrowErrorOfType(ARGUMENT_ERROR);
  });

  it('accepts a custom slugifier', () => {
    const slugifierOpts = _.defaults(opts, {
      slugifier: (str) => 'fake-slug-' + str,
    });

    function factory() {
      return new LinkManager(slugifierOpts);
    }

    expect(factory).not.toThrow();
  });

  describe('createLink', () => {
    it('accepts a string that identifies the link target', () => {
      function create() {
        return instance.createLink('foo');
      }

      expect(create).not.toThrow();
    });

    it('fails if no link target is specified', () => {
      function create() {
        return instance.createLink();
      }

      expect(create).toThrowErrorOfType(ARGUMENT_ERROR);
    });

    it('fails if the `options` argument is invalid', () => {
      function create() {
        return instance.createLink('foo', 17);
      }

      expect(create).toThrowErrorOfType(ARGUMENT_ERROR);
    });

    it('returns the original string for unrecognized link targets', () => {
      expect(instance.createLink('hello')).toBe('hello');
    });

    describe('link target and text', () => {
      it('fails if the link target is not a string', () => {
        function create() {
          return instance.createLink(17);
        }

        expect(create).toThrowErrorOfType(ARGUMENT_ERROR);
      });

      it('fails if the link text is not a string', () => {
        function create() {
          return instance.createLink('foo', {
            linkText: false,
          });
        }

        expect(create).toThrowErrorOfType(ARGUMENT_ERROR);
      });

      it('uses the full longname, with soft breaks, as link text by default', () => {
        let link;
        const longname = 'foo.bar.baz';

        instance.requestFilename(longname);
        link = instance.createLink(longname, {
          monospace: false,
        });

        expect(link).toBe('<a href="foo-bar-baz.html">foo.<wbr />bar.<wbr />baz</a>');
      });

      it('adds soft breaks to link text where appropriate', () => {
        let link;
        const longname = 'foo.bar.baz';

        instance.requestFilename(longname);
        link = instance.createLink(longname, {
          linkText: 'some/other/thing',
          monospace: false,
        });

        expect(link).toBe('<a href="foo-bar-baz.html">some/<wbr />other/<wbr />thing</a>');
      });

      it('does not add soft breaks to link text that is also a URI', () => {
        let link;
        const longname = 'foo';

        instance.requestFilename(longname);
        link = instance.createLink(longname, {
          linkText: 'https://example.com/',
          monospace: false,
        });

        expect(link).toBe('<a href="foo.html">https://example.com/</a>');
      });

      it('uses the requested link extension in the link target', () => {
        let link;
        const longname = 'foo';

        instance = new LinkManager(
          _.assign({}, opts, {
            linkExtension: '.cfm',
          })
        );
        instance.requestFilename(longname);
        link = instance.createLink(longname, {
          monospace: false,
        });

        expect(link).toBe('<a href="foo.cfm">foo</a>');
      });
    });

    describe('CSS classes', () => {
      it('adds CSS classes to the link when asked', () => {
        let link;
        const longname = 'foo';

        instance.requestFilename(longname);
        link = instance.createLink(longname, {
          cssClass: 'bar baz',
          monospace: false,
        });

        expect(link).toBe('<a href="foo.html" class="bar baz">foo</a>');
      });
    });

    describe('<code> tag', () => {
      it('by default, does not add <code> to autopopulated link text that is a URI', () => {
        const link = instance.createLink('https://example.com/some/page');

        expect(link).toBe(
          '<a href="https://example.com/some/page">https://example.com/some/page</a>'
        );
      });

      it('by default, does not add <code> to user-specified link text that is a URI', () => {
        let link;
        const longname = 'foo';

        instance.requestFilename(longname);
        link = instance.createLink(longname, {
          linkText: 'https://example.com/',
        });

        expect(link).toBe('<a href="foo.html">https://example.com/</a>');
      });

      it('respects `opts.monospace = true` for longnames', () => {
        let link;
        const longname = 'foo';

        instance.requestFilename(longname);
        link = instance.createLink(longname, {
          monospace: true,
        });

        expect(link).toBe('<a href="foo.html"><code>foo</code></a>');
      });

      it('respects `opts.monospace = false` for longnames', () => {
        let link;
        const longname = 'foo';

        instance.requestFilename(longname);
        link = instance.createLink(longname, {
          monospace: false,
        });

        expect(link).toBe('<a href="foo.html">foo</a>');
      });
    });

    describe('fragment IDs', () => {
      it('uses the appropriate fragment ID by default', () => {
        let link;

        instance.registerDoclet({
          kind: 'function',
          longname: 'Foo#bar',
          memberof: 'Foo',
          name: 'bar',
          scope: 'instance',
        });
        link = instance.createLink('Foo#bar');

        expect(link).toContain('href="foo.html#bar"');
      });

      it('adds a specific fragment ID when asked', () => {
        let link;
        const longname = 'bar';

        instance.requestFilename(longname);
        link = instance.createLink(longname, {
          fragmentId: 'baz',
        });

        expect(link).toContain('href="bar.html#baz"');
      });
    });

    describe('URIs', () => {
      it('turns URIs into links', () => {
        const link = instance.createLink('https://example.com/');

        expect(link).toBe('<a href="https://example.com/">https://example.com/</a>');
      });

      it('turns URIs that are enclosed in angle brackets into links', () => {
        const link = instance.createLink('<https://example.com/>');

        expect(link).toBe('<a href="https://example.com/">https://example.com/</a>');
      });
    });
  });

  describe('getUniqueFilename', () => {
    it('fails on bad input', () => {
      function getUnique() {
        return instance.getUniqueFilename(7);
      }

      expect(getUnique).toThrowErrorOfType(ARGUMENT_ERROR);
    });

    it('always returns a unique string, with the file extension, for a given input', () => {
      const base = 'foo';
      const filename1 = instance.getUniqueFilename(base);
      const filename2 = instance.getUniqueFilename(base);

      expect(filename1).not.toBe(filename2);
    });
  });

  describe('getUri', () => {
    it('fails on bad input', () => {
      function getUri() {
        return instance.getUri(7);
      }

      expect(getUri).toThrowErrorOfType(ARGUMENT_ERROR);
    });

    it('returns an empty string for unrecognized input', () => {
      const uri = instance.getUri('foo');

      expect(uri).toBe('');
    });

    it('returns the correct URI, with the requested link extension', () => {
      let uri;

      instance.linkExtension = '.test';
      instance.requestFilename('foo');
      uri = instance.getUri('foo');

      expect(uri).toBe('foo.test');
    });
  });

  describe('registerDoclet', () => {
    it('fails on bad input', () => {
      function registerDoclet() {
        instance.registerDoclet(7);
      }

      expect(registerDoclet).toThrowErrorOfType(ARGUMENT_ERROR);
    });

    it('handles doclets that get their own output files', () => {
      const fakeDoclet = {
        kind: 'class',
        longname: 'Foo',
        name: 'Foo',
        scope: 'global',
      };
      const fileInfo = instance.registerDoclet(fakeDoclet);

      expect(fileInfo.filename).toBe('foo');
      expect(fileInfo.fragmentId).toBeUndefined();
    });

    it('handles doclets that represent the sole export of a module', () => {
      const fakeDoclet = {
        kind: 'function',
        longname: 'module:foo',
        name: 'module:foo',
        scope: 'global',
      };
      const fileInfo = instance.registerDoclet(fakeDoclet);

      expect(fileInfo.filename).toBe('module-foo');
      expect(fileInfo.fragmentId).toBeUndefined();
    });

    it('returns the existing filename if a doclet with this longname was registered', () => {
      const fakeDoclet = {
        kind: 'class',
        longname: 'Foo',
        name: 'Foo',
        scope: 'global',
      };
      let fileInfo;

      // We only care about the second return value.
      instance.registerDoclet(fakeDoclet);
      fileInfo = instance.registerDoclet(fakeDoclet);

      expect(fileInfo.filename).toBe('foo');
      expect(fileInfo.fragmentId).toBeUndefined();
    });

    it('returns a filename and fragment ID based on `memberof` when appropriate', () => {
      const fakeDoclet = {
        kind: 'function',
        longname: 'Foo#bar',
        memberof: 'Foo',
        name: 'bar',
        scope: 'instance',
      };
      const fileInfo = instance.registerDoclet(fakeDoclet);

      expect(fileInfo.filename).toBe('foo');
      expect(fileInfo.fragmentId).toBe('bar');
    });

    it('returns the existing filename if a doclet with this memberof was registered', () => {
      const fakeDoclets = [
        {
          kind: 'function',
          longname: 'Foo#bar',
          memberof: 'Foo',
          name: 'bar',
          scope: 'instance',
        },
        {
          kind: 'function',
          longname: 'Foo#baz',
          memberof: 'Foo',
          name: 'baz',
          scope: 'instance',
        },
      ];
      const fileInfo = [];

      fileInfo[0] = instance.registerDoclet(fakeDoclets[0]);
      fileInfo[1] = instance.registerDoclet(fakeDoclets[1]);

      expect(fileInfo[1].filename).toBe(fileInfo[0].filename);
    });

    it('registers the filename for doclets that do not get their own output files', () => {
      const fakeDoclet = {
        kind: 'function',
        longname: 'Foo#bar',
        memberof: 'Foo',
        name: 'bar',
        scope: 'instance',
      };
      const fileInfo = instance.registerDoclet(fakeDoclet);

      expect(fileInfo.filename).toBe('foo');
    });

    it('returns the filename for globals if there is no `memberof`', () => {
      const fakeDoclet = {
        kind: 'function',
        longname: 'foo',
        name: 'foo',
        scope: 'global',
      };
      const fileInfo = instance.registerDoclet(fakeDoclet);

      expect(fileInfo.filename).toBe('global');
    });

    it('creates a fragment ID if the `name` and `longname` are different', () => {
      const fakeDoclet = {
        kind: 'function',
        longname: 'Foo.bar',
        name: 'bar',
        scope: 'static',
      };
      const fileInfo = instance.registerDoclet(fakeDoclet);

      expect(fileInfo.fragmentId).toBeString();
    });

    it('creates a fragment ID if the scope is `global`', () => {
      const fakeDoclet = {
        kind: 'function',
        longname: 'foo',
        name: 'foo',
        scope: 'global',
      };
      const fileInfo = instance.registerDoclet(fakeDoclet);

      expect(fileInfo.filename).toBe('global');
      expect(fileInfo.fragmentId).toBe('foo');
    });

    it('registers fragment IDs', () => {
      const fakeDoclet = {
        kind: 'function',
        longname: 'Foo#bar',
        memberof: 'Foo',
        name: 'bar',
        scope: 'instance',
      };
      let link;

      instance.registerDoclet(fakeDoclet);
      link = instance.createLink('Foo#bar');

      expect(link).toContain('<a href="foo.html#bar">');
    });
  });

  describe('registerFragmentId', () => {
    it('fails on bad input', () => {
      function register() {
        instance.registerFragmentId(7, 13);
      }

      expect(register).toThrowErrorOfType(ARGUMENT_ERROR);
    });

    it('uses the specified ID', () => {
      const id = instance.registerFragmentId('foo', 'bar');

      expect(id).toBe('bar');
    });
  });

  describe('requestFilename', () => {
    it('uses a slugified string in the filename', () => {
      const filename = instance.requestFilename('foo!bar');

      expect(filename).toBe('foo-bar');
    });

    it('always provides a unique filename with the default slugifier', () => {
      const str = 'foo';
      const filename1 = instance.requestFilename(str);
      const filename2 = instance.requestFilename(str);

      expect(filename1).not.toEqual(filename2);
    });

    it('uses the custom slugifier if present', () => {
      let filename;
      const optsWithSlugifier = _.defaults({}, opts, {
        slugifyFactory: () => (str) => str + '-but-slugified',
      });

      instance = new LinkManager(optsWithSlugifier);
      filename = instance.requestFilename('foo');

      expect(filename).toBe('foo-but-slugified');
    });
  });

  describe('resetCounters', () => {
    it('resets the counter for generating unique links', () => {
      const links = [
        instance.requestFilename('foo'),
        instance.requestFilename('foo'),
        (() => {
          instance.resetCounters();

          return instance.requestFilename('foo');
        })(),
      ];

      expect(links).toEqual(['foo', 'foo-2', 'foo']);
    });
  });

  describe('resolveInlineLinks', () => {
    it('returns an empty string if there is no input', () => {
      expect(instance.resolveInlineLinks()).toBeEmptyString();
    });

    it('returns the original input if there are no inline tags', () => {
      const str = 'test string';

      expect(instance.resolveInlineLinks(str)).toBe(str);
    });

    it('replaces {@link} inline tags', () => {
      instance.requestFilename('foo');

      expect(instance.resolveInlineLinks('Testing a {@link foo}')).toBe(
        'Testing a <a href="foo.html"><code>foo</code></a>'
      );
    });

    it('does not add a link if the tag value is unknown', () => {
      expect(instance.resolveInlineLinks('Testing a {@link foo}')).toBe('Testing a foo');
    });

    it('replaces {@linkcode} inline tags and adds a <code> tag to link text', () => {
      instance.requestFilename('foo');

      expect(instance.resolveInlineLinks('Testing a {@linkcode foo}')).toBe(
        'Testing a <a href="foo.html"><code>foo</code></a>'
      );
    });

    it('replaces {@linkplain} inline tags and does not add a <code> tag to link text', () => {
      instance.requestFilename('foo');

      expect(instance.resolveInlineLinks('Testing a {@linkplain foo}')).toBe(
        'Testing a <a href="foo.html">foo</a>'
      );
    });

    it('only changes specific inline tags', () => {
      const str = 'Testing a {@faketag fake}';

      expect(instance.resolveInlineLinks(str)).toBe(str);
    });

    it('replaces multiple occurrences of the same inline tag', () => {
      expect(instance.resolveInlineLinks('Multiple {@link inline} {@link tags}')).toBe(
        'Multiple inline tags'
      );
    });

    it('shortens longnames in link text when appropriate', () => {
      const fakeDoclets = [
        {
          kind: 'class',
          longname: 'Foo',
          name: 'Foo',
        },
        {
          kind: 'function',
          longname: 'Foo#bar',
          memberof: 'Foo',
          name: 'bar',
          scope: 'instance',
        },
      ];

      instance = new LinkManager(
        _.assign({}, opts, {
          config: {
            templates: {
              useShortNamesInLinks: true,
            },
          },
        })
      );
      for (const doclet of fakeDoclets) {
        instance.registerDoclet(doclet);
      }

      expect(instance.resolveInlineLinks('{@link Foo#bar}')).toBe(
        '<a href="foo.html#bar"><code>bar</code></a>'
      );
    });

    it('extracts leading link text in square brackets from one tag', () => {
      instance.requestFilename('foo');

      expect(instance.resolveInlineLinks('Some [link text]{@linkplain foo}.')).toBe(
        'Some <a href="foo.html">link text</a>.'
      );
    });

    it('extracts leading link text in square brackets from multiple tags', () => {
      const str = 'Some [link text]{@linkplain foo}, and [some more]{@linkplain foo}.';
      const expected =
        'Some <a href="foo.html">link text</a>, and <a href="foo.html">some more</a>.';

      instance.requestFilename('foo');

      expect(instance.resolveInlineLinks(str)).toBe(expected);
    });

    it('does not change text in square brackets that does not precede a tag', () => {
      const str = 'This is [not link text].';

      expect(instance.resolveInlineLinks(str)).toBe(str);
    });
  });

  describe('stringToLinkUri', () => {
    it('has keys that are known strings and values that are URIs for those strings', () => {
      const extension = '.html';
      const filename1 = instance.requestFilename('foo');
      const filename2 = instance.requestFilename('bar');

      // toEqual() doesn't work with proxies.
      expect(instance.stringToLinkUri.foo).toBe(filename1 + extension);
      expect(instance.stringToLinkUri.bar).toBe(filename2 + extension);
    });

    it('uses the extension for links, not the extension for generated files', () => {
      instance.requestFilename('foo');
      instance.linkExtension = '.test';

      // toEqual() doesn't work with proxies.
      expect(instance.stringToLinkUri.foo).toBe('foo.test');
    });
  });
});
