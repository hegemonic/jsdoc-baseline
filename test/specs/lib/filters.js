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

import _ from 'lodash';

import * as filters from '../../../lib/filters.js';

describe('lib/filters', () => {
  it('exports a Filters constructor', () => {
    expect(filters.Filters).toBeFunction();
  });

  describe('Filters', () => {
    const { Filters } = filters;
    let instance;
    let linkManager;
    let template;

    function fakeLongnames() {
      return ['module:foo', 'module:foo/bar', 'module:foo/bar.Baz', 'module:foo/bar.Baz#qux'];
    }

    async function init(templateOpts) {
      template = await helpers.createTemplate(templateOpts);
      linkManager = template.linkManager;
      instance = await Filters.create(template);
    }

    function requestFilenames(longnames) {
      longnames.forEach((longname) => {
        linkManager.requestFilename(longname);
      });
    }

    beforeEach(async () => {
      await init();
    });

    describe('ancestors', () => {
      beforeEach(() => {
        requestFilenames(fakeLongnames());
      });

      it('links to ancestors when no CSS class is specified', () => {
        const ancestors = instance.ancestors('module:foo/bar.Baz#qux');

        expect(ancestors.toString()).toBe(
          [
            '<a href="module-foo-bar.html">foo/<wbr>bar</a>',
            '.<wbr>',
            '<a href="module-foo-bar-baz.html">Baz</a>',
            '#<wbr>',
          ].join('')
        );
      });

      it('links to ancestors when a CSS class is specified', () => {
        const ancestors = instance.ancestors('module:foo/bar.Baz', 'frozzle');

        expect(ancestors.toString()).toBe(
          '<a href="module-foo-bar.html" class="frozzle">foo/<wbr>bar</a>.<wbr>'
        );
      });

      it('maps the CSS class when needed', async () => {
        let ancestors;

        await init({
          cssClassMap: {
            flibble: 'flobble',
          },
        });
        requestFilenames(fakeLongnames());

        ancestors = instance.ancestors('module:foo/bar.Baz', 'flibble');

        expect(ancestors.toString()).toBe(
          '<a href="module-foo-bar.html" class="flobble">foo/<wbr>bar</a>.<wbr>'
        );
      });

      it('returns an empty string when there are no ancestors', () => {
        const ancestors = instance.ancestors('module:foo/bar');

        expect(ancestors.toString()).toBe('');
      });
    });

    describe('badges', () => {
      xit('TODO: Write more tests');

      it('returns an empty array if no doclet is provided', () => {
        expect(instance.badges()).toBeEmptyArray();
      });

      it('maps CSS classes as needed', async () => {
        let badges;

        await init({
          cssClassMap: {
            'badge-kind': 'badge-kinder-egg',
          },
        });
        badges = instance.badges({ kind: 'class' });

        expect(badges).toBeArrayOfSize(1);
        expect(badges[0].class).toContain('badge-kinder-egg');
      });
    });

    describe('basename', () => {
      it('returns the basename of the specified path', () => {
        const filepath = instance.basename('/foo/bar/baz.html');

        expect(filepath.toString()).toBe('baz.html');
      });

      it('removes the extension if one is specified', () => {
        const filepath = instance.basename('/foo/bar/baz.html', '.html');

        expect(filepath.toString()).toBe('baz');
      });
    });

    xdescribe('config', () => {
      xit('TODO: Write me');
    });

    describe('decrementHeading', () => {
      it('reduces the heading level by 1', () => {
        let newLevel;
        let oldLevel;

        instance.incrementHeading();
        oldLevel = instance.headingLevel();

        instance.decrementHeading();
        newLevel = instance.headingLevel();

        expect(oldLevel - newLevel).toBe(1);
      });

      it('does not reduce the heading level below 1', () => {
        let newLevel;
        const oldLevel = instance.headingLevel();

        instance.decrementHeading();
        newLevel = instance.headingLevel();

        expect(oldLevel).toBe(1);
        expect(newLevel).toBe(1);
      });
    });

    describe('defined', () => {
      it('reports that a truthy value is defined', () => {
        expect(instance.defined(1)).toBeTrue();
      });

      it('reports that a falsy value is defined', () => {
        expect(instance.defined(0)).toBeTrue();
      });

      it('reports that an undefined value is undefined', () => {
        expect(instance.defined()).toBeFalse();
      });
    });

    describe('dequote', () => {
      it('removes enclosing quotation marks', () => {
        expect(instance.dequote('"hello"')).toBe('hello');
      });

      it('does not change strings with embedded quotation marks', () => {
        expect(instance.dequote('he"llo')).toBe('he"llo');
      });
    });

    describe('describeType', () => {
      it('uses "unknown type" if no type is provided', () => {
        const description = instance.describeType(undefined);

        expect(description.toString()).toBe('<code>unknown</code>');
      });

      it('throws if the requested format is not available', () => {
        function shouldThrow() {
          return instance.describeType('!string', { format: 'marshmallow' });
        }

        expect(shouldThrow).toThrow();
      });

      it('returns the simple description by default', () => {
        const description = instance.describeType('!string');

        expect(description.toString()).toBe('non-null <code>string</code>');
      });

      it('returns the extended format\'s description when the format is "extended"', () => {
        const description = instance.describeType('!string', { format: 'extended' });

        expect(description.toString()).toBe('<code>string</code>');
      });

      it('returns the requested property when the format is "extended"', () => {
        const description = instance.describeType('!string', {
          format: 'extended',
          property: 'modifiers.nullable',
        });

        expect(description.toString()).toBe('Must not be null.');
      });

      it('links to known types in the same package', () => {
        let description;

        linkManager.requestFilename('foo');
        description = instance.describeType('foo');

        expect(description.toString()).toBe('<code><a href="foo.html">foo</a></code>');
      });
    });

    xdescribe('filterProperties', () => {
      xit('TODO: Write me');
    });

    xdescribe('formatParams', () => {
      xit('TODO: Write me');
    });

    describe('generatedBy', () => {
      it('includes the JSDoc version number', () => {
        const generatedBy = instance.generatedBy();

        expect(generatedBy.toString()).toContain(helpers.env.version.number);
      });

      it('includes the date', () => {
        const year = new Date(Date.now()).getFullYear();
        const generatedBy = instance.generatedBy();

        expect(generatedBy.toString()).toContain(year);
      });
    });

    describe('getDescendants', () => {
      it('uses the `memberof` property to find descendants', () => {
        let descendants;
        const fooDoclet = helpers.createDoclet(['@name foo', '@longname foo']);
        const barDoclet = helpers.createDoclet([
          '@name bar',
          '@longname foo.bar',
          '@memberof foo',
          '@static',
        ]);

        template.context.docletStore = helpers.createDocletStore([fooDoclet, barDoclet]);
        descendants = instance.getDescendants(fooDoclet);

        expect(descendants).toBeArrayOfSize(1);
        expect(descendants[0]).toBe(barDoclet);
      });

      it('works if there are no descendants', () => {
        let descendants;
        const fooDoclet = helpers.createDoclet(['@name foo', '@longname foo']);

        template.context.docletStore = helpers.createDocletStore([fooDoclet]);
        descendants = instance.getDescendants(fooDoclet);

        expect(descendants).toBeEmptyArray();
      });

      it('does not return non-descendants', () => {
        let descendants;
        const fooDoclet = helpers.createDoclet(['@name foo', '@longname foo']);
        const barDoclet = helpers.createDoclet([
          '@name bar',
          '@longname foo.bar',
          '@memberof foo',
          '@static',
        ]);
        const bazDoclet = helpers.createDoclet(['@name baz', '@longname baz']);

        template.context.docletStore = helpers.createDocletStore([fooDoclet, barDoclet, bazDoclet]);
        descendants = instance.getDescendants(fooDoclet);

        expect(descendants).toBeArrayOfSize(1);
        expect(descendants[0]).toBe(barDoclet);
      });

      it('finds descendants recursively', () => {
        let descendants;
        const fooDoclet = helpers.createDoclet(['@name foo', '@longname foo']);
        const barDoclet = helpers.createDoclet([
          '@name bar',
          '@longname foo.bar',
          '@memberof foo',
          '@static',
        ]);
        const bazDoclet = helpers.createDoclet([
          '@name baz',
          '@longname foo.bar.baz',
          '@memberof foo.bar',
          '@static',
        ]);

        template.context.docletStore = helpers.createDocletStore([fooDoclet, barDoclet, bazDoclet]);
        descendants = _.sortBy(instance.getDescendants(fooDoclet), 'longname');

        expect(descendants).toBeArrayOfSize(2);
        expect(descendants[0].longname).toBe('foo.bar');
        expect(descendants[1].longname).toBe('foo.bar.baz');
      });

      it('clones descendants and changes their `name` if they are nested', () => {
        let descendants;
        const fooDoclet = helpers.createDoclet(['@name foo', '@longname foo']);
        const barDoclet = helpers.createDoclet([
          '@name bar',
          '@longname foo.bar',
          '@memberof foo',
          '@static',
        ]);
        const bazDoclet = helpers.createDoclet([
          '@name baz',
          '@longname foo.bar.baz',
          '@memberof foo.bar',
          '@static',
        ]);

        template.context.docletStore = helpers.createDocletStore([fooDoclet, barDoclet, bazDoclet]);
        descendants = _.sortBy(instance.getDescendants(fooDoclet), 'longname');

        expect(descendants[0]).toBe(barDoclet);
        expect(descendants[1]).not.toBe(bazDoclet);
        expect(descendants[1].name).toBe('bar.baz');
      });

      it('works with scopes other than `static`', () => {
        let descendants;
        const fooDoclet = helpers.createDoclet(['@name foo', '@longname foo']);
        const barDoclet = helpers.createDoclet([
          '@name bar',
          '@longname foo~bar',
          '@memberof foo',
          '@inner',
        ]);
        const bazDoclet = helpers.createDoclet([
          '@name baz',
          '@longname foo~bar#baz',
          '@memberof foo~bar',
          '@instance',
        ]);

        template.context.docletStore = helpers.createDocletStore([fooDoclet, barDoclet, bazDoclet]);
        descendants = _.sortBy(instance.getDescendants(fooDoclet), 'longname');

        expect(descendants[0]).toBe(barDoclet);
        expect(descendants[1].name).toBe('bar#baz');
      });
    });

    xdescribe('groupDocletTree', () => {
      xit('TODO: Write me');
    });

    describe('hasModifiers', () => {
      it('treats the "defaultvalue" property as a modifier for non-enums', () => {
        const fakeDoclet = {
          defaultvalue: 'foo',
        };
        const hasModifiers = instance.hasModifiers(fakeDoclet, { isEnum: false });

        expect(hasModifiers).toBe(true);
      });

      it('does not treat the "defaultvalue" property as a modifier for enums', () => {
        const fakeDoclet = {
          defaultvalue: 'foo',
        };
        const hasModifiers = instance.hasModifiers(fakeDoclet, { isEnum: true });

        expect(hasModifiers).toBe(false);
      });

      it('treats the "nullable" property as a modifier', () => {
        const fakeDoclet = {
          nullable: true,
        };
        const hasModifiers = instance.hasModifiers(fakeDoclet, { isEnum: false });

        expect(hasModifiers).toBe(true);
      });

      it('does not treat the "optional" property as a modifier', () => {
        const fakeDoclet = {
          optional: true,
        };
        const hasModifiers = instance.hasModifiers(fakeDoclet, { isEnum: false });

        expect(hasModifiers).toBe(false);
      });

      it('treats the "variable" (repeatable) property as a modifier', () => {
        const fakeDoclet = {
          variable: true,
        };
        const hasModifiers = instance.hasModifiers(fakeDoclet, { isEnum: false });

        expect(hasModifiers).toBe(true);
      });
    });

    describe('hasOneOf', () => {
      it('retuns `true` if an object has at least one of the specified properties', () => {
        const obj = { baz: true };
        const props = ['foo', 'bar', 'baz'];

        expect(instance.hasOneOf(obj, props)).toBeTrue();
      });

      it('returns `false` if an object has none of the specified properties', () => {
        const obj = { qux: true };
        const props = ['foo', 'bar', 'baz'];

        expect(instance.hasOneOf(obj, props)).toBeFalse();
      });

      it('returns `false` if the object is missing', () => {
        expect(instance.hasOneOf()).toBeFalse();
      });
    });

    describe('headingLevel', () => {
      it('returns a positive number', () => {
        const level = instance.headingLevel();

        expect(level).toBeNumber();
        expect(level).toBeGreaterThan(0);
      });
    });

    describe('highlight', () => {
      // Behavior is tested further by the tests for `lib/highlight`.

      it('returns highlighted code wrapped in `<pre><code>`', () => {
        const highlighted = instance.highlight('const foo = "bar";', 'js');

        expect(highlighted.toString()).toMatch(/<pre><code[^>]*>.+<\/code><\/pre>/);
        expect(highlighted.toString()).toMatch('hljs');
      });

      it('works when no language is specified', () => {
        const highlighted = instance.highlight('const foo = "bar";');

        expect(highlighted.toString()).toMatch(/<pre><code[^>]*>.+<\/code><\/pre>/);
        expect(highlighted.toString()).toMatch('hljs');
      });

      it('maps CSS classes when needed', async () => {
        let highlighted;

        await init({
          cssClassMap: {
            'language-js': 'language-ecmascript',
          },
        });
        highlighted = instance.highlight('const foo = "bar";', 'js');

        expect(highlighted.toString()).toMatch(/class=".*language-ecmascript.*"/);
      });

      it('omits the `<pre>` tag when asked', () => {
        const highlighted = instance.highlight('const foo = "bar";', 'js', { omitPre: true });

        expect(highlighted.toString()).not.toMatch(/<pre><code[^>]*>.+<\/code><\/pre>/);
        expect(highlighted.toString()).toMatch(/<code[^>]*>.+<\/code>/);
        expect(highlighted.toString()).toMatch('hljs');
      });
    });

    xdescribe('idForDoclet', () => {
      // TODO: Write me

      xit('should not crash if nothing is passed in', () => {
        // TODO: Write me
      });
    });

    xdescribe('idForString', () => {
      xit('TODO: Write me');
    });

    xdescribe('includes', () => {
      xit('TODO: Write me');
    });

    describe('incrementHeading', () => {
      it('increases the heading level by 1', () => {
        let newLevel;
        const oldLevel = instance.headingLevel();

        instance.incrementHeading();
        newLevel = instance.headingLevel();

        expect(newLevel - oldLevel).toBe(1);
      });

      it('does not increase the heading level above 6', () => {
        for (let i = 0, l = 10; i < l; i++) {
          instance.incrementHeading();
        }

        expect(instance.headingLevel()).toBe(6);
      });
    });

    describe('jsdocVersion', () => {
      it('returns the version number as a string', () => {
        // The test helpers set this bogus version number.
        expect(instance.jsdocVersion()).toBe('1.2.3.4');
      });
    });

    describe('keys', () => {
      it('returns an empty array if the argument is not an object', () => {
        expect(instance.keys('hello')).toEqual([]);
      });

      it('returns the keys as an array', () => {
        const keys = instance.keys({
          foo: true,
          bar: '1',
          baz: null,
        });

        expect(keys.sort()).toEqual(['bar', 'baz', 'foo']);
      });
    });

    describe('licenseLink', () => {
      it('returns a link if a valid license ID is specified', () => {
        expect(String(instance.licenseLink('MIT'))).toContain('https://');
      });

      it('returns the license ID if no link is found', () => {
        expect(instance.licenseLink('fuzzy-bunny')).toBe('fuzzy-bunny');
      });
    });

    describe('link', () => {
      it('does not blow up if only one parameter is provided', () => {
        function makeLink() {
          return instance.link('foo');
        }

        expect(makeLink).not.toThrow();
      });

      it('does not blow up if only two parameters are provided', () => {
        function makeLink() {
          return instance.link('foo', 'bar');
        }

        expect(makeLink).not.toThrow();
      });

      it('does not blow up when a non-string value is passed in', () => {
        function makeLink() {
          return instance.link(true);
        }

        expect(makeLink).not.toThrow();
        expect(makeLink().toString()).toBe('');
      });

      it('includes the requested link text', () => {
        let link;

        linkManager.requestFilename('foo');
        link = instance.link('foo', 'helpful!');

        expect(link.toString()).toBe('<a href="foo.html">helpful!</a>');
      });

      it('allows you to force a link to use a fixed-width font', () => {
        const uri = 'https://example.com/';
        const defaultLink = instance.link(uri);
        const monospaceLink = instance.link(uri, null, { monospace: true });

        // First, make sure we're actually overriding the default behavior.
        expect(defaultLink.toString()).not.toBe(monospaceLink.toString());

        expect(monospaceLink.toString()).toContain('<code>');
      });
    });

    describe('linkifyTypeExpression', () => {
      it('uses "unknown type" if no type is provided', () => {
        const linkified = instance.linkifyTypeExpression(undefined);

        expect(linkified.toString()).toBe('?');
      });

      it('returns the simple description by default', () => {
        const linkified = instance.linkifyTypeExpression('!string');

        expect(linkified.toString()).toBe('!string');
      });

      it('normalizes and HTML-escapes type applications', () => {
        const linkified = instance.linkifyTypeExpression('Array.<string>');

        expect(linkified.toString()).toBe('Array&lt;string&gt;');
      });

      it('links to known types in the same package', () => {
        let linkified;

        linkManager.requestFilename('foo');
        linkified = instance.linkifyTypeExpression('foo');

        expect(linkified.toString()).toBe('<a href="foo.html">foo</a>');
      });
    });

    describe('linkToLine', () => {
      const fakeDocletMeta = {
        lineno: 70,
        filename: 'glitch.js',
        path: '/Users/someone',
      };

      beforeEach(() => {
        template.context.sourceFiles = {
          '/Users/someone/glitch.js': 'glitch.js',
        };

        linkManager.requestFilename('glitch.js');
      });

      it('works when a CSS class is specified', () => {
        const link = instance.linkToLine(fakeDocletMeta, 'foo');

        expect(link.toString()).toBe(
          '<a href="glitch-js.html#L70" class="foo">glitch.<wbr>js:70</a>'
        );
      });

      it('works when no CSS class is specified', () => {
        const link = instance.linkToLine(fakeDocletMeta);

        expect(link.toString()).toBe('<a href="glitch-js.html#L70">glitch.<wbr>js:70</a>');
      });

      it('maps CSS classes as needed', async () => {
        let link;

        await init({
          cssClassMap: {
            flibble: 'flobble',
          },
        });
        linkManager.requestFilename('glitch.js');
        template.context.sourceFiles = {
          '/Users/someone/glitch.js': 'glitch.js',
        };

        link = instance.linkToLine(fakeDocletMeta, 'flibble');

        expect(link.toString()).toBe(
          '<a href="glitch-js.html#L70" class="flobble">glitch.<wbr>js:70</a>'
        );
      });

      it('ignores the line number if the code is on line 1', () => {
        const meta = {
          lineno: 1,
          filename: 'glitch.js',
          path: '/Users/someone',
        };
        const link = instance.linkToLine(meta);

        expect(link.toString()).toBe('<a href="glitch-js.html">glitch.<wbr>js</a>');
      });
    });

    describe('linkWithSignature', () => {
      xit('TODO: Write more tests');

      it('uses the longname in the link by default', () => {
        const fooDoclet = {
          kind: 'class',
          longname: 'Foo',
          name: 'Foo',
        };
        const barDoclet = {
          kind: 'function',
          longname: 'Foo#bar',
          memberof: 'Foo',
          name: 'bar',
          scope: 'instance',
        };
        let link;

        linkManager.registerDoclet(fooDoclet);
        linkManager.registerDoclet(barDoclet);

        link = instance.linkWithSignature(barDoclet);

        expect(link.toString()).toBe('<a href="foo.html#bar"><code>Foo#<wbr>bar()</code></a>');
      });

      it('uses the name in the link by request', () => {
        const fooDoclet = {
          kind: 'class',
          longname: 'Foo',
          name: 'Foo',
        };
        const barDoclet = {
          kind: 'function',
          longname: 'Foo#bar',
          memberof: 'Foo',
          name: 'bar',
          scope: 'instance',
        };
        let link;

        linkManager.registerDoclet(fooDoclet);
        linkManager.registerDoclet(barDoclet);

        link = instance.linkWithSignature(barDoclet, { linkType: 'name' });

        expect(link.toString()).toBe('<a href="foo.html#bar"><code>bar()</code></a>');
      });

      it('maps CSS classes as needed', async () => {
        const fakeDoclet = {
          kind: 'class',
          longname: 'Foo',
          name: 'Foo',
          params: [{ name: 'bar' }],
        };
        let link;

        await init({
          cssClassMap: {
            flibble: 'flobble',
          },
        });
        requestFilenames(['Foo']);

        link = instance.linkWithSignature(fakeDoclet, { cssClass: 'flibble' });

        expect(link.toString()).toBe(
          '<a href="foo.html" class="flobble"><code>Foo(bar)</code></a>'
        );
      });

      it('omits the `<code>` tag by request', () => {
        const fooDoclet = {
          kind: 'class',
          longname: 'Foo',
          name: 'Foo',
        };
        let link;

        linkManager.registerDoclet(fooDoclet);

        link = instance.linkWithSignature(fooDoclet, { monospace: false });

        expect(link.toString()).toBe('<a href="foo.html">Foo()</a>');
      });
    });

    describe('markdown', () => {
      it('uses a Markdown parser by default', () => {
        const text = instance.markdown('**foo**');

        expect(text.toString()).toBe('<p><strong>foo</strong></p>');
      });

      it('does not use a Markdown parser when Markdown is disabled', async () => {
        let text;

        template.config.markdown = false;
        instance = await Filters.create(template);
        text = instance.markdown('**foo**');

        expect(text.toString()).toBe('<p>**foo**</p>');
      });

      it('expands standalone <p> tags into proper markup when Markdown is disabled', async () => {
        let text;

        template.config.markdown = false;
        instance = await Filters.create(template);
        text = instance.markdown('foo<p>bar<p>baz');

        expect(text.toString()).toBe('<p>foo</p><p>bar</p><p>baz</p>');
      });

      it('does not wrap text in an extra <p> tag when Markdown is disabled', async () => {
        let text;

        template.config.markdown = false;
        instance = await Filters.create(template);
        text = instance.markdown('<p>**foo**</p>');

        expect(text.toString()).toBe('<p>**foo**</p>');
      });
    });

    describe('modifierText', () => {
      it('returns text if the doclet is nullable', () => {
        const fakeDoclet = {
          nullable: true,
        };
        const text = instance.modifierText(fakeDoclet, { isEnum: false });

        expect(text.toString()).not.toBe('');
      });

      it('returns text if the doclet is non-nullable', () => {
        const fakeDoclet = {
          nullable: false,
        };
        const text = instance.modifierText(fakeDoclet, { isEnum: false });

        expect(text.toString()).not.toBe('');
      });

      it('returns text if the doclet has a "variable" property set to true', () => {
        const fakeDoclet = {
          variable: true,
        };
        const text = instance.modifierText(fakeDoclet, { isEnum: false });

        expect(text.toString()).not.toBe('');
      });

      it('returns text if the doclet has a falsy default value', () => {
        const fakeDoclet = {
          defaultvalue: 0,
        };
        const text = instance.modifierText(fakeDoclet, { isEnum: false });

        expect(text.toString()).toContain('0');
      });

      it('returns text if the doclet has a default value and is not an enum', () => {
        const fakeDoclet = {
          defaultvalue: '1',
        };
        const text = instance.modifierText(fakeDoclet, { isEnum: false });

        expect(text.toString()).toContain('1');
      });

      it('does not return text if the doclet has a default value and is an enum', () => {
        const fakeDoclet = {
          defaultvalue: '1',
        };
        const text = instance.modifierText(fakeDoclet, { isEnum: true });

        expect(text.toString()).toBe('');
      });

      it('does not HTML-escape the string', () => {
        const fakeDoclet = {
          defaultvalue: 1,
        };
        const text = instance.modifierText(fakeDoclet, { isEnum: false });

        expect(text.toString()).toContain('<code>1</code>');
      });

      describe('with type expression', () => {
        it('omits nullability by default if the type expression contains that info', () => {
          const fakeDoclet = {
            nullable: false,
            type: {
              expression: '!string',
            },
          };
          const text = instance.modifierText(fakeDoclet, { isEnum: false });

          expect(text.toString()).toBe('');
        });

        it('if requested, shows nullability no matter what', () => {
          const fakeDoclet = {
            nullable: false,
            type: {
              expression: '!string',
            },
          };
          const text = instance.modifierText(fakeDoclet, {
            isEnum: false,
            showAllModifiers: true,
          });

          expect(text.toString()).not.toBe('');
        });

        it('omits repeatability by default if the type expression contains that info', () => {
          const fakeDoclet = {
            variable: true,
            type: {
              expression: '...string',
            },
          };
          const text = instance.modifierText(fakeDoclet, { isEnum: false });

          expect(text.toString()).toBe('');
        });

        it('if requested, shows repeatability no matter what', () => {
          const fakeDoclet = {
            variable: true,
            type: {
              expression: '...string',
            },
          };
          const text = instance.modifierText(fakeDoclet, {
            isEnum: false,
            showAllModifiers: true,
          });

          expect(text.toString()).not.toBe('');
        });
      });
    });

    describe('needsSignature', () => {
      it('says that classes need a signature', () => {
        const fakeDoclet = {
          kind: 'class',
        };

        expect(instance.needsSignature(fakeDoclet)).toBe(true);
      });

      it('says that functions need a signature', () => {
        const fakeDoclet = {
          kind: 'function',
        };

        expect(instance.needsSignature(fakeDoclet)).toBe(true);
      });

      it('says that typedefs need a signature if they contain a function', () => {
        const fakeDoclet = {
          kind: 'typedef',
          type: {
            names: ['function'],
          },
        };

        expect(instance.needsSignature(fakeDoclet)).toBe(true);
      });

      it('says that typedefs do not need a signature if they do not contain a function', () => {
        const fakeDoclet = {
          kind: 'typedef',
          type: {
            names: ['Object'],
          },
        };

        expect(instance.needsSignature(fakeDoclet)).toBe(false);
      });

      it('says that other types do not need a signature', () => {
        const fakeDoclet = {
          kind: 'member',
        };

        expect(instance.needsSignature(fakeDoclet)).toBe(false);
      });
    });

    describe('packageLink', () => {
      xit('TODO: Write more tests');

      it('maps CSS classes as needed', async () => {
        let link;

        await init({
          cssClassMap: {
            piffle: 'poffle',
          },
        });
        linkManager.requestFilename('index');

        link = instance.packageLink({ name: 'JubJub' }, 'piffle');

        expect(link.toString()).toBe('<a href="index.html" class="poffle">JubJub</a>');
      });
    });

    xdescribe('parseType', () => {
      xit('TODO: Write me');
    });

    describe('pluck', () => {
      it("returns an array of the specified property's values", () => {
        const objs = [
          {
            foo: true,
          },
          {
            foo: 7,
          },
        ];
        const plucked = instance.pluck(objs, 'foo');

        expect(plucked).toEqual([true, 7]);
      });
    });

    describe('processExample', () => {
      it('extracts the caption if one is present', () => {
        const example = '<caption>Create a <code>Foo</code></caption>\nconst foo = new Foo();';
        const processed = instance.processExample(example);

        expect(String(processed.caption)).toBe('Create a <code>Foo</code>');
        expect(processed.code).toBe('const foo = new Foo();');
      });

      it('returns the code when there is no caption', () => {
        const example = 'let foo = new Foo();';
        const processed = instance.processExample(example);

        expect(String(processed.caption)).toBeEmptyString();
        expect(processed.code).toBe(example);
      });
    });

    xdescribe('registerAll', () => {
      xit('TODO: Write me');
    });

    describe('reparentItems', () => {
      beforeEach(() => {
        template.config.tables = {
          nestedPropertyTables: true,
        };
      });

      it('reparents child properties', () => {
        const fakeDoclet = {
          params: [
            {
              name: 'foo',
            },
            {
              name: 'foo.bar',
            },
          ],
        };
        const reparented = instance.reparentItems(fakeDoclet, 'params');

        expect(reparented).toEqual([
          {
            name: 'foo',
            children: [
              {
                name: 'bar',
              },
            ],
          },
        ]);
      });

      it('reparents child properties when multiple parameters have properties', () => {
        const fakeDoclet = {
          params: [
            {
              name: 'foo',
            },
            {
              name: 'foo.bar',
            },
            {
              name: 'baz',
            },
            {
              name: 'baz.qux',
            },
          ],
        };
        const reparented = instance.reparentItems(fakeDoclet, 'params');

        expect(reparented).toEqual([
          {
            name: 'foo',
            children: [
              {
                name: 'bar',
              },
            ],
          },
          {
            name: 'baz',
            children: [
              {
                name: 'qux',
              },
            ],
          },
        ]);
      });

      it('does not reparent child properties if the config setting is false', () => {
        const fakeDoclet = {
          params: [
            {
              name: 'foo',
            },
            {
              name: 'foo.bar',
            },
          ],
        };
        let notReparented;

        template.config.tables = {
          nestedPropertyTables: false,
        };
        notReparented = instance.reparentItems(fakeDoclet, 'params');

        expect(notReparented).toEqual(fakeDoclet.params);
      });

      it('reparents properties of arrays', () => {
        const fakeDoclet = {
          params: [
            {
              name: 'foo',
            },
            {
              name: 'foo[].bar',
            },
          ],
        };
        const reparented = instance.reparentItems(fakeDoclet, 'params');

        expect(reparented).toEqual([
          {
            name: 'foo',
            children: [
              {
                name: 'bar',
              },
            ],
          },
        ]);
      });

      it('reparents properties of nested arrays', () => {
        const fakeDoclet = {
          params: [
            {
              name: 'foo',
            },
            {
              name: 'foo[][].bar',
            },
          ],
        };
        const reparented = instance.reparentItems(fakeDoclet, 'params');

        expect(reparented).toEqual([
          {
            name: 'foo',
            children: [
              {
                name: 'bar',
              },
            ],
          },
        ]);
      });

      it('does not reparent non-child properties', () => {
        const fakeDoclet = {
          params: [
            {
              name: 'foo',
            },
            {
              name: 'bar',
            },
          ],
        };
        const reparented = instance.reparentItems(fakeDoclet, 'params');

        expect(reparented).toEqual(fakeDoclet.params);
      });

      it('handles null properties', () => {
        const fakeDoclet = {
          params: [
            {
              name: 'foo',
            },
            null,
          ],
        };
        const reparented = instance.reparentItems(fakeDoclet, 'params');

        expect(reparented).toEqual([
          {
            name: 'foo',
          },
        ]);
      });

      it('does not crash when parameters have weird names like `{Object)`', () => {
        function reparent() {
          const fakeDoclet = {
            params: [
              {
                name: '{Object)',
              },
              {
                name: '{Object)',
              },
            ],
          };

          instance.reparentItems(fakeDoclet, 'params');
        }

        expect(reparent).not.toThrow();
      });

      xit('ignores child properties when appropriate', () => {
        // TODO: check whether it ignores properties with ignore === true
      });
    });

    describe('resolveAuthorLinks', () => {
      it('does not crash if no input is specified', () => {
        function resolve() {
          instance.resolveAuthorLinks();
        }

        expect(resolve).not.toThrow();
      });

      it('converts email addresses in angle brackets to mailto: links', () => {
        const str = ' John Doe  <asdf.fdsa-2@gmail.com> ';
        const out = instance.resolveAuthorLinks(str);

        expect(out.toString()).toBe('<a href="mailto:asdf.fdsa-2@gmail.com">John Doe</a>');
      });

      it('escapes author names when necessary', () => {
        const str = ' John<Doe  <asdf.fdsa-2@gmail.com> ';
        const out = instance.resolveAuthorLinks(str);

        expect(out.toString()).toBe('<a href="mailto:asdf.fdsa-2@gmail.com">John&lt;Doe</a>');
      });

      it('escapes and returns the input string if no email address is found', () => {
        const str = 'John Doe <dummy>';
        const out = instance.resolveAuthorLinks(str);

        expect(out.toString()).toBe('John Doe &lt;dummy&gt;');
      });
    });

    xdescribe('resolveLinks', () => {
      xit('TODO: Write me');
    });

    describe('returnTypes', () => {
      it('does not crash on null input', () => {
        function nullInput() {
          return instance.returnTypes(null);
        }

        expect(nullInput).not.toThrow();
      });

      it('finds values in the `returns` property', () => {
        const fakeDoclet = {
          returns: [
            {
              type: {
                names: ['string'],
              },
              description: 'A string.',
            },
          ],
        };
        const typeExpression = instance.returnTypes(fakeDoclet);

        expect(typeExpression).toBe('string');
      });

      it('finds values in the `yields` property', () => {
        const fakeDoclet = {
          yields: [
            {
              type: {
                names: ['number'],
              },
              description: 'A number.',
            },
          ],
        };
        const typeExpression = instance.returnTypes(fakeDoclet);

        expect(typeExpression).toBe('number');
      });

      it('prefers `yields` over `returns`', () => {
        const fakeDoclet = {
          returns: [
            {
              type: {
                names: ['string'],
              },
              description: 'A string.',
            },
          ],
          yields: [
            {
              type: {
                names: ['number'],
              },
              description: 'A number.',
            },
          ],
        };
        const typeExpression = instance.returnTypes(fakeDoclet);

        expect(typeExpression).toBe('number');
      });

      it('works with multiple return types', () => {
        const fakeDoclet = {
          returns: [
            {
              type: {
                names: ['string', 'number'],
              },
              description: 'A string. Or, perhaps, a number.',
            },
          ],
        };
        const typeExpression = instance.returnTypes(fakeDoclet);

        expect(typeExpression).toBe('(string|number)');
      });

      it('works if `doclet.returns` is passed in directly', () => {
        const fakeReturns = [
          {
            type: {
              names: ['string'],
            },
            description: 'A string.',
          },
        ];
        const typeExpression = instance.returnTypes(fakeReturns);

        expect(typeExpression).toBe('string');
      });
    });

    xdescribe('see', () => {
      xit('TODO: Write me');
    });

    xdescribe('shouldHighlight', () => {
      xit('TODO: Write me');
    });

    describe('translate', () => {
      it('maps keys to strings', () => {
        const description = instance.translate('tables.header.description', null);

        expect(description.toString()).toBe('Description');
      });

      it('pluralizes strings based on the length of an array', () => {
        const singular = instance.translate('headings.classes', [0]);
        const plural = instance.translate('headings.classes', [0, 1]);

        expect(singular.toString()).toBe('Class');
        expect(plural.toString()).toBe('Classes');
      });

      it('uses the singular form if the argument is not an array', () => {
        const singular = instance.translate('headings.classes', 17);

        expect(singular.toString()).toBe('Class');
      });

      it('passes keyword args through to the L10N string', () => {
        const paramText = instance.translate('params.all', null, {
          params: 'foo',
        });

        expect(paramText.toString()).toBe('(foo)');
      });

      it('can pluralize text when keyword args are present', () => {
        const plural = instance.translate('headings.classes', [0, 1], {
          foo: 'bar',
        });

        expect(plural.toString()).toBe('Classes');
      });
    });

    describe('translatePageTitle', () => {
      it('includes the specified text in the generated title', () => {
        const title = instance.translatePageTitle('Baz', 'Foo bar', 'classes');

        expect(title.toString()).toContain('Foo bar');
        expect(title.toString()).toContain('Baz');
      });

      it('works when no category is provided', () => {
        const title = instance.translatePageTitle('Baz', 'Foo bar');

        expect(title.toString()).toContain('Foo bar');
        expect(title.toString()).toContain('Baz');
      });
    });

    xdescribe('typeUnion', () => {
      xit('TODO: Write me');
    });

    describe('url', () => {
      it('returns the URL for the specified longname', () => {
        let url;

        linkManager.requestFilename('urlExpressionHelper');
        url = instance.url('urlExpressionHelper');

        expect(url.toString()).toBe('url-expression-helper.html');
      });

      it('returns an empty string if the specified longname is unknown', () => {
        const url = instance.url('not-a-real-longname');

        expect(url.toString()).toBe('');
      });
    });
  });
});
