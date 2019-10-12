const mock = require('mock-fs');
const config = require('../../../../lib/config');
const fs = require('fs-extra');
const GenerateFiles = require('../../../../lib/tasks/generate-files');
const logger = require('jsdoc/util/logger');
const path = require('path');
const Template = require('../../../../lib/template');
const Ticket = require('../../../../lib/ticket');

const ARGUMENT_ERROR = 'ArgumentError';

const mockObj = {
    out: {}
};

function eatPromise(p) {
    if (p) {
        p.then(() => null, () => null);
    }
}

// Wrapper that provides explicit getters we can spy on.
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

    describe('run', () => {
        let badTicket;
        let conf;
        let context;
        let fatalSpy;
        let result;

        beforeEach(() => {
            // Suppress logging.
            fatalSpy = spyOn(logger, 'fatal');

            badTicket = new Ticket({
                data: {},
                url: 'foo',
                viewName: 'no-such-view'
            });
            conf = config.loadSync().get();
            context = {
                destination: 'out',
                templateConfig: conf
            };

            context.template = new Template(context.templateConfig);
            mock(mockObj);
        });

        afterEach(() => {
            eatPromise(result);
            mock.restore();
        });

        it('returns a promise on success', () => {
            const task = new GenerateFiles({ name: 'returnsPromise' });

            result = task.run(context);

            expect(result).toBeInstanceOf(Promise);
        });

        it('returns a promise on failure', () => {
            const task = new GenerateFiles({
                name: 'returnsPromise',
                tickets: [badTicket]
            });

            result = task.run(context);

            expect(result).toBeInstanceOf(Promise);
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
                    tickets: true
                });

                try {
                    await task.run(context);
                } catch (e) {
                    error = e;
                }

                expect(error).toBeErrorOfType(ARGUMENT_ERROR);
            });

            it('processes one ticket', async () => {
                const tickets = [
                    new Ticket({
                        data: {},
                        url: 'foo.html',
                        viewName: 'deprecated'
                    })
                ];
                const wrappers = tickets.map(ticket => new TicketWrapper(ticket));
                const task = new GenerateFiles({
                    name: 'oneTicket',
                    tickets: wrappers
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
                        viewName: 'deprecated'
                    }),
                    new Ticket({
                        data: {},
                        url: 'bar.html',
                        viewName: 'copyright'
                    })
                ];
                const wrappers = tickets.map(ticket => new TicketWrapper(ticket));
                const task = new GenerateFiles({
                    name: 'twoTickets',
                    tickets: wrappers
                });
                const spies = wrappers.map(
                    wrapper => spyOnProperty(wrapper, 'data').and.callFake(() => ({}))
                );

                await task.run(context);

                expect(spies[0]).toHaveBeenCalled();
                expect(spies[1]).toHaveBeenCalled();
            });
        });

        describe('output', () => {
            function stat(url) {
                return fs.statSync(path.join(context.destination, url));
            }

            it('creates the output directory as needed', async () => {
                const url = path.join('some', 'dir', 'foo.html');
                const ticket = new Ticket({
                    data: {},
                    url,
                    viewName: 'layout'
                });
                const task = new GenerateFiles({
                    name: 'oneTicket',
                    tickets: [ticket]
                });

                await task.run(context);

                expect(() => stat(url)).not.toThrow();
            });

            it('saves files for multiple tickets in the right places', async () => {
                const urls = [
                    path.join('some', 'dir', 'foo.html'),
                    path.join('some', 'dir', 'bar.html')
                ];
                const tickets = [
                    new Ticket({
                        data: {},
                        url: urls[0],
                        viewName: 'layout'
                    }),
                    new Ticket({
                        data: {},
                        url: urls[1],
                        viewName: 'layout'
                    })
                ];
                const task = new GenerateFiles({
                    name: 'oneTicket',
                    tickets
                });

                await task.run(context);

                expect(() => stat(urls[0])).not.toThrow();
                expect(() => stat(urls[1])).not.toThrow();
            });

            it('beautifies HTML output by default', async () => {
                let file;
                const ticket = new Ticket({
                    data: {},
                    url: 'foo.html',
                    viewName: 'layout'
                });
                const task = new GenerateFiles({
                    name: 'beautify',
                    tickets: [ticket]
                });

                await task.run(context);
                file = fs.readFileSync(path.join('out', 'foo.html'), 'utf8');

                expect(file).not.toMatch(/[ ]{20}/);
            });

            it('only beautifies HTML output', async () => {
                let file;
                const ticket = new Ticket({
                    data: {},
                    url: 'foo.nothtml',
                    viewName: 'layout'
                });
                const task = new GenerateFiles({
                    name: 'beautify',
                    tickets: [ticket]
                });

                await task.run(context);
                file = fs.readFileSync(path.join('out', 'foo.nothtml'), 'utf8');

                expect(file).toMatch(/[ ]{20}/);
            });

            it('does not beautify the output file if asked not to', async () => {
                let file;
                let task;
                let ticket;

                context.templateConfig.beautify = false;

                mock.restore();
                context.template = new Template(context.templateConfig);
                mock({
                    out: {}
                });

                ticket = new Ticket({
                    data: {},
                    url: 'foo.html',
                    viewName: 'layout'
                });
                task = new GenerateFiles({
                    name: 'noBeautify',
                    tickets: [ticket]
                });

                await task.run(context);
                file = fs.readFileSync(path.join('out', 'foo.html'), 'utf8');

                expect(file).toMatch(/[ ]{20}/);
            });
        });

        describe('rendering', () => {
            it('uses the specified view', async () => {
                let file;
                const url = 'foo.html';
                const ticket = new Ticket({
                    data: {
                        deprecated: 'since 4.0.0'
                    },
                    url,
                    viewName: 'deprecated'
                });
                const task = new GenerateFiles({
                    name: 'usesView',
                    tickets: [ticket]
                });

                await task.run(context);
                file = fs.readFileSync(path.join('out', 'foo.html'), 'utf8');

                expect(file).toContain('Deprecated');
            });

            it('fails on unknown views', async () => {
                const ticket = new Ticket({
                    data: {},
                    url: 'foo.html',
                    viewName: 'no-such-view'
                });
                const task = new GenerateFiles({
                    name: 'unknownView',
                    tickets: [ticket]
                });

                await task.run(context);

                expect(fatalSpy).toHaveBeenCalled();
            });
        });
    });
});
