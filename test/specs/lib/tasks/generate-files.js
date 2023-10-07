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

// eslint-disable-next-line simple-import-sort/imports
import mock from 'mock-fs';

import path from 'node:path';

import fs from 'fs-extra';
import _ from 'lodash';

import { defaultConfig } from '../../../../lib/config.js';
import { CATEGORY_TO_KIND } from '../../../../lib/enums.js';
import GenerateFiles from '../../../../lib/tasks/generate-files.js';
import Ticket from '../../../../lib/ticket.js';

const OUTPUT_DIR = 'out';
const TYPE_ERROR = 'TypeError';

function rethrower(e) {
  return () => {
    throw e;
  };
}

// Wrapper that provides explicit getters we can spy on.
// TODO: Move to test helper.
class TicketWrapper {
  constructor(ticket) {
    this.ticket = ticket;
  }

  get data() {
    return this.ticket.data;
  }

  get name() {
    return this.ticket.name;
  }

  get source() {
    return this.ticket.source;
  }

  get url() {
    return this.ticket.url;
  }

  get viewName() {
    return this.ticket.viewName;
  }
}

describe('lib/tasks/generate-files', () => {
  it('is a constructor', () => {
    function factory() {
      return new GenerateFiles({});
    }

    expect(factory).not.toThrow();
  });

  it('has a static `categorizeDoclets` method', () => {
    expect(GenerateFiles.categorizeDoclets).toBeFunction();
  });

  it('accepts tickets', () => {
    const tickets = [
      new Ticket({
        data: {},
        url: 'foo.html',
        viewName: 'layout.njk',
      }),
    ];
    const task = new GenerateFiles({
      name: 'acceptsTickets',
      tickets,
    });

    expect(task.tickets).toBe(tickets);
  });

  describe('categorizeDoclets', () => {
    const fakeDoclets = [{ kind: 'constant' }, { kind: 'function' }, { kind: 'module' }];

    it('categorizes doclets based on their kind', () => {
      const categorized = GenerateFiles.categorizeDoclets(fakeDoclets);
      const categories = Object.keys(categorized);

      expect(categories).toBeArrayOfSize(3);

      for (const category of categories) {
        const doclets = categorized[category];

        for (const doclet of doclets) {
          expect(CATEGORY_TO_KIND[category]).toContain(doclet.kind);
        }
      }
    });

    it('categorizes items correctly when multiple doclet kinds map to one category', () => {
      const propertyDoclet = { kind: 'member' };
      const data = fakeDoclets.concat(propertyDoclet);
      const categorized = GenerateFiles.categorizeDoclets(data);

      expect(categorized.properties).toBeArrayOfSize(2);
      expect(categorized.properties).toEqual([{ kind: 'constant' }, { kind: 'member' }]);
    });
  });

  describe('run', () => {
    let context;
    let result;

    beforeAll(async () => {
      // Prettier lazy-loads its HTML parser. Force it to load while the filesystem isn't mocked.
      await helpers.normalizeHtml('<p>foo</p>');
    });

    beforeEach(async () => {
      const templateConfig = _.cloneDeep(defaultConfig);

      context = {
        destination: OUTPUT_DIR,
        templateConfig,
      };
      context.template = await helpers.createTemplate(templateConfig);
      mock(helpers.baseViews);
    });

    afterEach(() => {
      mock.restore();
    });

    it('returns a promise on success', (cb) => {
      const task = new GenerateFiles({ name: 'returnsPromise' });

      result = task.run(context);

      expect(result).toBeInstanceOf(Promise);

      helpers.handlePromise(result, cb);
    });

    it('returns a promise on failure', (cb) => {
      const task = new GenerateFiles({
        name: 'returnsPromise',
      });

      result = task.run();

      expect(result).toBeInstanceOf(Promise);

      helpers.handlePromise(result, cb);
    });

    describe('tickets', () => {
      it('works if no tickets are specified', async () => {
        let error;
        const task = new GenerateFiles({ name: 'noTickets' });

        try {
          await task.run(context);
        } catch (e) {
          error = e;
        }

        expect(error).toBeUndefined();
      });

      it('fails if the tickets are bogus', async () => {
        let error;
        const task = new GenerateFiles({
          name: 'badTickets',
          tickets: true,
        });

        try {
          await task.run(context);
        } catch (e) {
          error = e;
        }

        expect(error).toBeErrorOfType(TYPE_ERROR);
      });

      it('processes one ticket', async () => {
        const tickets = [
          new Ticket({
            data: {},
            url: 'foo.html',
            viewName: 'deprecated.njk',
          }),
        ];
        const wrappers = tickets.map((ticket) => new TicketWrapper(ticket));
        const task = new GenerateFiles({
          name: 'oneTicket',
          tickets: wrappers,
        });
        const spy = spyOnProperty(wrappers[0], 'data').and.callFake(() => ({}));

        await task.run(context);

        expect(spy).toHaveBeenCalled();
      });

      it('processes multiple tickets', async () => {
        const tickets = [
          new Ticket({
            data: {},
            url: 'foo.html',
            viewName: 'deprecated.njk',
          }),
          new Ticket({
            data: {},
            url: 'bar.html',
            viewName: 'copyright.njk',
          }),
        ];
        const wrappers = tickets.map((ticket) => new TicketWrapper(ticket));
        const task = new GenerateFiles({
          name: 'twoTickets',
          tickets: wrappers,
        });
        const spies = wrappers.map((wrapper) =>
          spyOnProperty(wrapper, 'data').and.callFake(() => ({}))
        );

        await task.run(context);

        expect(spies[0]).toHaveBeenCalled();
        expect(spies[1]).toHaveBeenCalled();
      });
    });

    describe('output', () => {
      function stat(ctx, url) {
        return fs.statSync(path.join(ctx.destination, url));
      }

      it('creates the output directory as needed', async () => {
        const url = path.join('some', 'dir', 'foo.html');
        const ticket = new Ticket({
          data: {},
          url,
          viewName: 'layout.njk',
        });
        const task = new GenerateFiles({
          name: 'oneTicket',
          tickets: [ticket],
        });

        await task.run(context);

        expect(() => stat(context, url)).not.toThrow();
      });

      it('saves files for multiple tickets in the right places', async () => {
        const urls = [path.join('some', 'dir', 'foo.html'), path.join('some', 'dir', 'bar.html')];
        const tickets = [
          new Ticket({
            data: {},
            url: urls[0],
            viewName: 'layout.njk',
          }),
          new Ticket({
            data: {},
            url: urls[1],
            viewName: 'layout.njk',
          }),
        ];
        const task = new GenerateFiles({
          name: 'oneTicket',
          tickets,
        });

        await task.run(context);

        expect(() => stat(context, urls[0])).not.toThrow();
        expect(() => stat(context, urls[1])).not.toThrow();
      });

      it('works when tickets are passed to the constructor', async () => {
        const url = 'foo.html';
        const ticket = new Ticket({
          data: {},
          url,
          viewName: 'layout.njk',
        });
        const task = new GenerateFiles({
          name: 'generateFiles',
          tickets: [ticket],
        });

        await task.run(context);

        expect(() => stat(context, url)).not.toThrow();
      });

      it('works when tickets are added after calling the constructor', async () => {
        const url = 'foo.html';
        const ticket = new Ticket({
          data: {},
          url,
          viewName: 'layout.njk',
        });
        const task = new GenerateFiles({
          name: 'generateFiles',
        });

        task.tickets = [ticket];
        await task.run(context);

        expect(() => stat(context, url)).not.toThrow();
      });

      it('does not beautify HTML output by default', async () => {
        let file;
        const ticket = new Ticket({
          data: {},
          url: 'foo.html',
          viewName: 'layout.njk',
        });
        const task = new GenerateFiles({
          name: 'beautify',
          tickets: [ticket],
        });

        await task.run(context);
        file = fs.readFileSync(path.join(OUTPUT_DIR, 'foo.html'), 'utf8');

        expect(file).toMatch(/[ ]{20}/);
      });

      it('only beautifies HTML output', async () => {
        let file;
        const ticket = new Ticket({
          data: {},
          url: 'foo.nothtml',
          viewName: 'layout.njk',
        });
        const task = new GenerateFiles({
          name: 'beautify',
          tickets: [ticket],
        });

        await task.run(context);
        file = fs.readFileSync(path.join(OUTPUT_DIR, 'foo.nothtml'), 'utf8');

        expect(file).toMatch(/[ ]{20}/);
      });

      it('beautifies the output file if asked to', async () => {
        let file;
        let task;
        const templateConfig = (context.templateConfig = _.cloneDeep(defaultConfig));
        let ticket;

        templateConfig.beautify = true;
        context.template = await helpers.createTemplate(templateConfig);

        ticket = new Ticket({
          data: {},
          url: 'foo.html',
          viewName: 'layout.njk',
        });
        task = new GenerateFiles({
          name: 'beautify',
          tickets: [ticket],
        });

        await task.run(context);
        file = fs.readFileSync(path.join(OUTPUT_DIR, 'foo.html'), 'utf8');

        expect(file).not.toMatch(/[ ]{20}/);
      });

      it('does not beautify the output file if asked not to', async () => {
        let file;
        let task;
        let ticket;

        context.templateConfig.beautify = false;

        ticket = new Ticket({
          data: {},
          url: 'foo.html',
          viewName: 'layout.njk',
        });
        task = new GenerateFiles({
          name: 'noBeautify',
          tickets: [ticket],
        });

        await task.run(context);
        file = fs.readFileSync(path.join(OUTPUT_DIR, 'foo.html'), 'utf8');

        expect(file).toMatch(/[ ]{20}/);
      });
    });

    describe('rendering', () => {
      it('uses the specified view', async () => {
        let file;
        const url = 'foo.html';
        const ticket = new Ticket({
          data: {
            item: {
              deprecated: 'since 4.0.0',
            },
          },
          url,
          viewName: 'deprecated.njk',
        });
        const task = new GenerateFiles({
          name: 'usesView',
          tickets: [ticket],
        });

        await task.run(context);
        file = fs.readFileSync(path.join(OUTPUT_DIR, 'foo.html'), 'utf8');

        expect(file).toContain('Deprecated');
      });

      it('fails on unknown views', async () => {
        let error;
        const ticket = new Ticket({
          data: {},
          url: 'foo.html',
          viewName: 'no-such-view',
        });
        const task = new GenerateFiles({
          name: 'unknownView',
          tickets: [ticket],
        });

        try {
          await task.run(context);
        } catch (e) {
          error = e;
        }

        expect(rethrower(error)).toThrowError();
      });
    });
  });
});
