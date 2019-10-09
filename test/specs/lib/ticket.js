const Ticket = require('../../../lib/ticket');

const ARGUMENT_ERROR = 'ArgumentError';

describe('lib/ticket', () => {
    it('is a constructor', () => {
        function factory() {
            return new Ticket();
        }

        expect(factory).not.toThrow();
    });

    it('fails on bad input', () => {
        function factory() {
            return new Ticket(7);
        }

        expect(factory).toThrowErrorOfType(ARGUMENT_ERROR);
    });

    it('accepts a `data` object', () => {
        const data = {};
        const ticket = new Ticket({ data });

        expect(ticket.data).toBe(data);
    });

    it('accepts a `name` string', () => {
        const name = 'ticketName';
        const ticket = new Ticket({ name });

        expect(ticket.name).toBe(name);
    });

    it('accepts a `url` string', () => {
        const url = 'foo.html';
        const ticket = new Ticket({ url });

        expect(ticket.url).toBe(url);
    });

    it('accepts a `viewName` string', () => {
        const viewName = 'some-random-view';
        const ticket = new Ticket({ viewName });

        expect(ticket.viewName).toBe(viewName);
    });
});
