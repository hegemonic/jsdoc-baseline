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
import * as list from '../../../lib/list-methods.js';

describe('lib/list-methods', () => {
  it('has a listMethods method', () => {
    expect(list.listMethods).toBeFunction();
  });

  /* eslint-disable no-empty-function */
  describe('listMethods', () => {
    const listMethods = list.listMethods;

    it('lists methods owned by an object', () => {
      class Point {
        x() {}
        y() {}
      }

      const point = new Point();
      const methods = listMethods(point);

      expect(methods.sort()).toEqual(['x', 'y']);
    });

    it('lists inherited methods', () => {
      class Point {
        x() {}
        y() {}
      }

      class LineOrigin extends Point {
        type() {}
      }

      const origin = new LineOrigin();
      const methods = listMethods(origin);

      expect(methods.sort()).toEqual(['type', 'x', 'y']);
    });

    it('does not list methods on Object.prototype', () => {
      class Point {
        x() {}
        y() {}
      }

      const point = new Point();
      const methods = listMethods(point);

      expect(methods).not.toContain('hasOwnProperty');
    });

    it('lists private methods (with a leading underscore) by default', () => {
      class Point {
        _private() {}
        x() {}
        y() {}
      }

      const point = new Point();
      const methods = listMethods(point);

      expect(methods.sort()).toEqual(['_private', 'x', 'y']);
    });

    it('omits private methods (with a leading underscore) when requested', () => {
      class Point {
        _private() {}
        x() {}
        y() {}
      }

      const point = new Point();
      const methods = listMethods(point, {
        includePrivate: false,
      });

      expect(methods.sort()).toEqual(['x', 'y']);
    });

    it('lists private methods when includePrivate is falsy, but not `false`', () => {
      class Point {
        _coordinates() {}
        x() {}
        y() {}
      }

      const point = new Point();
      const methods = listMethods(point, {
        includePrivate: undefined,
      });

      expect(methods.sort()).toEqual(['_coordinates', 'x', 'y']);
    });

    it('accepts a regexp that matches private methods', () => {
      class Point {
        coordinates_() {}
        x() {}
        y() {}
      }

      const point = new Point();
      const methods = listMethods(point, {
        includePrivate: false,
        privateRegExp: /_$/,
      });

      expect(methods.sort()).toEqual(['x', 'y']);
    });
  });
  /* eslint-enable no-empty-function */
});
