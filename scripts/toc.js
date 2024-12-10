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

import '@shoelace-style/shoelace/dist/components/details/details.js';
import '@shoelace-style/shoelace/dist/components/tree/tree.js';
import '@shoelace-style/shoelace/dist/components/tree-item/tree-item.js';

import { setDefaultAnimation } from '@shoelace-style/shoelace/dist/utilities/animation-registry.js';

const HIDE_UNTIL_READY = ['sl-details', 'sl-tree'];

function preventDefault(e) {
  e.preventDefault();
}

function stopImmediatePropagation(e) {
  e.stopImmediatePropagation();
}

// Prevent always-open accordions from being closed and reopened.
document.querySelectorAll('sl-details').forEach((item) => {
  item.addEventListener('sl-hide', preventDefault);
  item.addEventListener('sl-show', preventDefault);
});

// Prevent expandable tree items from expanding when their link is clicked.
document.querySelectorAll(':not(sl-details) > sl-tree > sl-tree-item').forEach((item) => {
  const child = item.firstElementChild;

  if (child?.nodeName === 'A') {
    child.addEventListener('click', stopImmediatePropagation);
  }
});

// Prevent a flash of undefined custom elements (FOUCE).
(async () => {
  // Only wait for custom elements that appear on the current page.
  const waitForElements = HIDE_UNTIL_READY.filter((el) => document.querySelector(el));

  await Promise.allSettled(waitForElements.map((el) => customElements.whenDefined(el)));

  for (const elementName of waitForElements) {
    for (const element of document.querySelectorAll(elementName)) {
      element.classList.add('ready');
    }
  }
})();

// Update `<sl-details>` animations.
(() => {
  const keyframesShow = [{ height: '0' }, { height: 'auto' }];
  const options = { duration: 150, easing: 'ease-in-out' };

  setDefaultAnimation('details.show', {
    keyframes: keyframesShow,
    options,
  });
  setDefaultAnimation('details.hide', {
    keyframes: keyframesShow.slice().reverse(),
    options,
  });
})();
