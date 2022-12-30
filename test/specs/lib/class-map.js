/*
  Copyright 2022 the Baseline Authors.

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
describe('lib/class-map', () => {
  const ClassMap = require('../../../lib/class-map');
  let map;

  beforeEach(() => {
    map = new ClassMap({ alligator: 'gator', gorilla: '' });
  });

  it('is a constructor', () => {
    expect(() => new ClassMap()).not.toThrow();
  });

  it('accepts an object', () => {
    expect(() => new ClassMap({})).not.toThrow();
  });

  describe('isEmpty', () => {
    it('returns `true` when no classes are mapped', () => {
      expect(new ClassMap().isEmpty()).toBeTrue();
    });

    it('returns `false` when at least one class is mapped', () => {
      expect(map.isEmpty()).toBeFalse();
    });
  });

  describe('mapClassname', () => {
    it('returns an empty string when no value is provided', () => {
      expect(map.mapClassname()).toBeEmptyString();
    });

    it('maps a single classname', () => {
      expect(map.mapClassname('alligator')).toBe('gator');
    });

    it('maps multiple space-separated classnames', () => {
      expect(map.mapClassname('alligator tiger')).toEqual('gator tiger');
    });
  });

  describe('mapClassnameToHtmlAttribute', () => {
    it('maps a single classname', () => {
      expect(map.mapClassnameToHtmlAttribute('alligator')).toBe(' class="gator"');
    });

    it('maps multiple space-separated classnames', () => {
      expect(map.mapClassnameToHtmlAttribute('alligator tiger')).toBe(' class="gator tiger"');
    });
  });

  describe('mapClassnames', () => {
    it('does not change classnames that are not mapped', () => {
      expect(map.mapClassnames(['alligator', 'giraffe'])).toEqual(['gator', 'giraffe']);
    });

    it('maps classnames that are mapped to truthy values', () => {
      expect(map.mapClassnames(['alligator', 'flamingo'])).toEqual(['gator', 'flamingo']);
    });

    it('omits classnames that are mapped to falsy values', () => {
      expect(map.mapClassnames(['gorilla'])).toBeEmptyArray();
    });
  });

  describe('mapClassnamesToHtmlAttribute', () => {
    it('returns an empty string if there are no classes to apply', () => {
      expect(map.mapClassnamesToHtmlAttribute(['gorilla'])).toBeEmptyString();
    });

    it('adds the mapped classnames to the HTML attribute', () => {
      expect(map.mapClassnamesToHtmlAttribute(['alligator', 'rhino'])).toBe(' class="gator rhino"');
    });
  });
});
