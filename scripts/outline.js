/*
  Copyright 2026 the Baseline Authors.

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

import { html, LitElement } from 'lit';
import { customElement } from 'lit/decorators/custom-element.js';
import { property } from 'lit/decorators/property.js';
import { queryAll } from 'lit/decorators/query-all.js';
import throttle from 'lodash-es/throttle.js';

const DEFAULT_HEADING_SELECTOR = 'h2, h3, h4, h5, h6';

function extractText(childNodes, childSelector, headingParts = []) {
  for (const child of childNodes) {
    if (child instanceof Text) {
      headingParts.push(child.textContent);
    } else if (child.matches(childSelector)) {
      extractText(child.childNodes, childSelector, headingParts);
    }
  }

  return headingParts;
}

function getHeadingLevel(el) {
  if (el?.localName.startsWith('h')) {
    const levelString = el.localName.substring(1);
    const level = parseInt(levelString, 10);

    if (level >= 1 && level <= 6) {
      return level;
    }
  }

  return null;
}

function makeMutationObserverCallback(outline) {
  return (mutationList) => {
    for (const mutation of mutationList) {
      const heading = mutation.target.parentElement.closest(outline.levels);

      if (heading) {
        outline.updateTree();
        break;
      }
    }
  };
}

function textForHeading(heading, outline) {
  const childSelector = `:not(copy-url, .${outline.hideFromNavClass})`;
  let headingParts;

  if (!heading) {
    return null;
  }

  headingParts = extractText(heading.childNodes, childSelector);

  return headingParts.join('').trim();
}

class TreeItem {
  constructor(el, outline) {
    this.children = [];
    this.hideFromNav = outline.isHidden(el);
    this.id = el?.id;
    this.level = getHeadingLevel(el);
    this.text = textForHeading(el, outline);
  }
}

@customElement('jsdoc-outline')
export class Outline extends LitElement {
  /* eslint-disable no-undef */
  @property({ reflect: true })
  accessor heading = 'On this page';

  @property({ attribute: 'hide-from-nav-class' })
  accessor hideFromNavClass = 'hide-from-nav';

  @property({ reflect: true })
  accessor levels = DEFAULT_HEADING_SELECTOR;

  @queryAll('a')
  accessor links;

  @property({ attribute: 'outline-class' })
  accessor outlineClass = 'jsdoc-outline';

  @property({ attribute: 'outline-nested-class' })
  accessor outlineNestedClass = 'jsdoc-outline-nested';

  @property()
  accessor tree;
  /* eslint-enable no-undef */

  #intersectionObserver;
  #linkTargets;
  #mutationObserver;
  #updateTreeThrottled;
  #visibleLinkTargets;

  constructor() {
    super();

    this.#intersectionObserver = null;
    this.#linkTargets = new WeakMap();
    this.#mutationObserver = null;
    this.#visibleLinkTargets = new WeakSet();
  }

  #buildHeadingTree(headings) {
    let tree = [];

    while (headings.length) {
      const firstHeading = headings.shift();

      if (this.isHidden(firstHeading)) {
        continue;
      }

      const node = new TreeItem(firstHeading, this);
      const nestedHeadings = this.#takeNestedHeadings(headings, firstHeading);

      if (nestedHeadings.length) {
        node.children = this.#buildHeadingTree(nestedHeadings);
      }

      tree.push(node);
    }

    return tree;
  }

  connectedCallback() {
    super.connectedCallback();

    this.updateTree();
  }

  createRenderRoot() {
    // Render content in light DOM.
    return this;
  }

  firstUpdated() {
    super.firstUpdated();

    this.#mutationObserver = new MutationObserver(makeMutationObserverCallback(this));
    this.#observeMutations();

    // TODO: Offset at top when header is visible
    this.#intersectionObserver = new IntersectionObserver((items) => {
      this.#handleIntersect(items, this.#visibleLinkTargets);
    });
    this.#toggleCurrentItem();
    this.#observeTargets();
  }

  #handleIntersect(items, visibleLinkTargets) {
    items.forEach((item) => {
      if (item.isIntersecting) {
        visibleLinkTargets.add(item.target);
      } else {
        visibleLinkTargets.delete(item.target);
      }
    });

    this.#toggleCurrentItem();
  }

  isHidden(el) {
    return Array.from(el.classList).includes(this.hideFromNavClass);
  }

  #observeMutations() {
    this.#mutationObserver.observe(document.body, {
      attributes: true,
      characterData: true,
      childList: true,
      subtree: true,
    });
  }

  #observeTargets() {
    for (const link of Array.from(this.links)) {
      const hash = link.hash.slice(1);
      const target = hash ? document.getElementById(hash) : null;

      if (target) {
        this.#linkTargets.set(link, target);
        this.#intersectionObserver.observe(target);
      }
    }
  }

  render() {
    return html`
      <ul class="${this.outlineClass}">
        ${this.#renderTreeItems(this.tree ?? [])}
      </ul>
    `;
  }

  #renderChildren(children) {
    if (!children) {
      return html``;
    }

    return html`
      <ul class="${this.outlineNestedClass}">
        ${this.#renderTreeItems(children)}
      </ul>
    `;
  }

  #renderTreeItems(tree) {
    const rendered = [];

    for (const node of tree) {
      rendered.push(html`
        <li>
          <p><a href="#${node.id}">${node.text}</a></p>
          ${this.#renderChildren(node.children)}
        </li>
      `);
    }

    return rendered;
  }

  #takeNestedHeadings(headings, firstHeading) {
    const nested = [];
    const startLevel = getHeadingLevel(firstHeading);

    while (getHeadingLevel(headings[0]) > startLevel) {
      const nextHeading = headings.shift();

      if (this.isHidden(nextHeading)) {
        continue;
      }

      nested.push(nextHeading);
    }

    return nested;
  }

  #toggleCurrentItem() {
    const links = Array.from(this.links);

    // Activate the link to the first visible target.
    links.find((link) => {
      const target = this.#linkTargets.get(link);

      if (target && this.#visibleLinkTargets.has(target)) {
        links.forEach((el) => el.classList.toggle('current', el === link));
        return true;
      }

      return false;
    });
  }

  #updateTree() {
    this.tree = this.#buildHeadingTree(Array.from(document.querySelectorAll(this.levels)));
  }

  updateTree() {
    if (!this.#updateTreeThrottled) {
      this.#updateTreeThrottled = throttle(this.#updateTree, 500);
    }

    return this.#updateTreeThrottled();
  }
}
