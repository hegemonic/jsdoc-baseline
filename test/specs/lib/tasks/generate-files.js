const mock = require('mock-fs');
const _ = require('lodash');
const { defaultConfig } = require('../../../../lib/config');
const fs = require('fs-extra');
const GenerateFiles = require('../../../../lib/tasks/generate-files');
const path = require('path');
const Template = require('../../../../lib/template');
const Ticket = require('../../../../lib/ticket');

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

  describe('run', () => {
    let context;
    let result;

    beforeEach(() => {
      context = {
        destination: OUTPUT_DIR,
        templateConfig: defaultConfig,
      };

      context.template = new Template(context.templateConfig);
      mock(helpers.baseViews);
    });

    afterEach(() => {
      mock.restore();
    });

    it('returns a promise on success', (cb) => {
      const task = new GenerateFiles({ name: 'returnsPromise' });

      result = task.run(context);

      expect(result).toBeInstanceOf(Promise);

      result.then(
        () => cb(),
        () => cb()
      );
    });

    it('returns a promise on failure', (cb) => {
      const task = new GenerateFiles({
        name: 'returnsPromise',
      });

      result = task.run();

      expect(result).toBeInstanceOf(Promise);

      result.then(
        () => cb(),
        () => cb()
      );
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

      it('beautifies HTML output by default', async () => {
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

        expect(file).not.toMatch(/[ ]{20}/);
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

      it('does not beautify the output file if asked not to', async () => {
        let file;
        let task;
        let ticket;

        context.templateConfig.beautify = false;

        mock.restore();
        context.template = new Template(context.templateConfig);
        mock(
          _.defaults({}, helpers.baseViews, {
            out: {},
          })
        );

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
