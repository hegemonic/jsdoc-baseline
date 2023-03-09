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
import Ticket from '../../../lib/ticket.js';

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

  it('accepts a `source` string', () => {
    const source = 'foo.html';
    const ticket = new Ticket({ source });

    expect(ticket.source).toBe(source);
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
