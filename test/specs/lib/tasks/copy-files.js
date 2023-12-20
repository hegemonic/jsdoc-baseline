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

import { readFile, stat } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { loadConfigSync } from '../../../../lib/config.js';
import CopyFiles from '../../../../lib/tasks/copy-files.js';
import Ticket from '../../../../lib/ticket.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const SOURCE_DIR = path.resolve(__dirname, '../../../fixtures/tasks/copy-files');
const OUTPUT_DIR = 'out';
const TYPE_ERROR = 'TypeError';

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

describe('lib/tasks/copy-files', () => {
  it('is a constructor', () => {
    function factory() {
      return new CopyFiles({});
    }

    expect(factory).not.toThrow();
  });

  it('accepts tickets', () => {
    const tickets = [
      new Ticket({
        source: path.join(SOURCE_DIR, 'foo.js'),
        url: 'foo.js',
      }),
    ];
    const task = new CopyFiles({
      name: 'acceptsTickets',
      tickets,
    });

    expect(task.tickets).toBe(tickets);
  });

  describe('run', () => {
    let conf;
    let context;
    let result;
    let tmp;
    let tmpdir;

    beforeEach(async () => {
      conf = loadConfigSync(helpers.deps);
      context = {
        destination: null,
        templateConfig: conf,
      };

      tmpdir = await helpers.tmpdir();
      tmp = tmpdir.tmp;
      context.destination = path.join(tmp, OUTPUT_DIR);
    });

    afterEach(async () => {
      await tmpdir.reset();
    });

    it('returns a promise on success', (cb) => {
      const task = new CopyFiles({ name: 'returnsPromise' });

      result = task.run(context);

      expect(result).toBeInstanceOf(Promise);

      helpers.handlePromise(result, cb);
    });

    it('returns a promise on failure', (cb) => {
      const task = new CopyFiles({
        name: 'returnsPromise',
      });

      result = task.run();

      expect(result).toBeInstanceOf(Promise);

      helpers.handlePromise(result, cb);
    });

    describe('tickets', () => {
      it('works if no tickets are specified', async () => {
        let error;
        const task = new CopyFiles({ name: 'noTickets' });

        try {
          await task.run(context);
        } catch (e) {
          error = e;
        }

        expect(error).toBeUndefined();
      });

      it('fails if the tickets are bogus', async () => {
        let error;
        const task = new CopyFiles({
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
            source: path.join(SOURCE_DIR, 'foo.js'),
            url: '',
          }),
        ];
        const wrappers = tickets.map((ticket) => new TicketWrapper(ticket));
        const task = new CopyFiles({
          name: 'oneTicket',
          tickets: wrappers,
        });
        const spy = spyOnProperty(wrappers[0], 'url').and.callFake(() => 'foo.js');

        await task.run(context);

        expect(spy).toHaveBeenCalled();
      });

      it('processes multiple tickets', async () => {
        const tickets = [
          new Ticket({
            source: path.join(SOURCE_DIR, 'foo.js'),
            url: '',
          }),
          new Ticket({
            source: path.join(SOURCE_DIR, 'bar.css'),
            url: '',
          }),
        ];
        const wrappers = tickets.map((ticket) => new TicketWrapper(ticket));
        const task = new CopyFiles({
          name: 'twoTickets',
          tickets: wrappers,
        });
        const spies = [
          spyOnProperty(wrappers[0], 'url').and.callFake(() => 'foo.js'),
          spyOnProperty(wrappers[1], 'url').and.callFake(() => 'bar.css'),
        ];

        await task.run(context);

        expect(spies[0]).toHaveBeenCalled();
        expect(spies[1]).toHaveBeenCalled();
      });
    });

    describe('output', () => {
      function statOutputFile(ctx, url) {
        return stat(path.join(ctx.destination, url));
      }

      it('creates the output directory as needed', async () => {
        const url = path.join('some', 'dir', 'foo.js');
        const ticket = new Ticket({
          source: path.join(SOURCE_DIR, 'foo.js'),
          url,
        });
        const task = new CopyFiles({
          name: 'oneTicket',
          tickets: [ticket],
        });

        await task.run(context);

        expect(async () => await statOutputFile(context, url)).not.toThrow();
      });

      it('copies the source to the destination', async () => {
        let file;
        const url = 'foo.js';
        const ticket = new Ticket({
          source: path.join(SOURCE_DIR, url),
          url,
        });
        const task = new CopyFiles({
          name: 'copyFile',
          tickets: [ticket],
        });

        await task.run(context);
        file = await readFile(path.join(context.destination, url), 'utf8');

        expect(file).toContain('foo bar baz');
      });

      it('saves files for multiple tickets in the right places', async () => {
        const urls = [path.join('some', 'dir', 'foo.js'), path.join('some', 'dir', 'bar.css')];
        const tickets = [
          new Ticket({
            source: path.join(SOURCE_DIR, 'foo.js'),
            url: urls[0],
          }),
          new Ticket({
            source: path.join(SOURCE_DIR, 'bar.css'),
            url: urls[1],
          }),
        ];
        const task = new CopyFiles({
          name: 'twoTickets',
          tickets,
        });

        await task.run(context);

        expect(() => statOutputFile(context, urls[0])).not.toThrow();
        expect(() => statOutputFile(context, urls[1])).not.toThrow();
      });

      it('works when tickets are passed to the constructor', async () => {
        let file;
        const url = 'foo.js';
        const ticket = new Ticket({
          source: path.join(SOURCE_DIR, url),
          url,
        });
        const task = new CopyFiles({
          name: 'copyFile',
          tickets: [ticket],
        });

        await task.run(context);
        file = await readFile(path.join(context.destination, url), 'utf8');

        expect(file).toContain('foo bar baz');
      });

      it('works when tickets are added after calling the constructor', async () => {
        let file;
        const url = 'foo.js';
        const ticket = new Ticket({
          source: path.join(SOURCE_DIR, url),
          url,
        });
        const task = new CopyFiles({
          name: 'copyFile',
        });

        task.tickets = [ticket];
        await task.run(context);
        file = await readFile(path.join(context.destination, url), 'utf8');

        expect(file).toContain('foo bar baz');
      });
    });
  });
});
