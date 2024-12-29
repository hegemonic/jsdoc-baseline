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

const OBJECT_PROTO = Object.getPrototypeOf({});
const REGEXP_PRIVATE = /^_/;

export function listMethods(obj, opts = {}) {
  const includePrivate = opts.includePrivate ?? true;
  const ignoreRegExp = opts.ignoreRegExp;
  const methods = new Set();
  const privateRegExp = opts.privateRegExp ?? REGEXP_PRIVATE;
  let proto = Object.getPrototypeOf(obj);

  while (proto && proto !== OBJECT_PROTO) {
    for (const prop of Object.getOwnPropertyNames(proto)) {
      if (ignoreRegExp && prop.match(ignoreRegExp)) {
        continue;
      }

      if (prop !== 'constructor' && _.isFunction(proto[prop])) {
        methods.add(prop);
      }
    }

    proto = Object.getPrototypeOf(proto);
  }

  if (!includePrivate) {
    methods.forEach((method) => {
      if (privateRegExp.test(method)) {
        methods.delete(method);
      }
    });
  }

  return [...methods];
}
