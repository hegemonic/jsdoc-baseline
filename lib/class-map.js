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
export default class ClassMap {
  constructor(map) {
    this._map = map || {};
  }

  isEmpty() {
    return !Object.keys(this._map).length;
  }

  mapClassname(classname) {
    if (!classname) {
      return '';
    }

    return this.mapClassnames(classname.split(' ')).join(' ');
  }

  mapClassnameToHtmlAttribute(classname) {
    return this.mapClassnamesToHtmlAttribute(classname.split(' '));
  }

  mapClassnames(classnames) {
    const map = this._map;
    const newClassnames = [];

    for (const classname of classnames) {
      if (!Object.hasOwn(map, classname)) {
        // The classname isn't in the map, so use it as-is.
        newClassnames.push(classname);
      } else if (map[classname]) {
        // The classname is in the map, and the new name isn't falsy, so add the new name.
        newClassnames.push(map[classname]);
      }
    }

    return newClassnames;
  }

  mapClassnamesToHtmlAttribute(classnames) {
    const newClassnames = this.mapClassnames(classnames);

    if (!newClassnames.length) {
      return '';
    }

    return ` class="${newClassnames.join(' ')}"`;
  }
}
