(()=>{let e;/*
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
*/// src/styles/component.styles.ts
/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */let t=globalThis,i=t.ShadowRoot&&(void 0===t.ShadyCSS||t.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,s=Symbol(),r=new WeakMap;class o{constructor(e,t,i){if(this._$cssResult$=!0,i!==s)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=e,this.t=t}get styleSheet(){let e=this.o,t=this.t;if(i&&void 0===e){let i=void 0!==t&&1===t.length;i&&(e=r.get(t)),void 0===e&&((this.o=e=new CSSStyleSheet).replaceSync(this.cssText),i&&r.set(t,e))}return e}toString(){return this.cssText}}let n=e=>new o("string"==typeof e?e:e+"",void 0,s),l=(e,...t)=>{let i=1===e.length?e[0]:t.reduce((t,i,s)=>t+(e=>{if(!0===e._$cssResult$)return e.cssText;if("number"==typeof e)return e;throw Error("Value passed to 'css' function must be a 'css' function result: "+e+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(i)+e[s+1],e[0]);return new o(i,e,s)},a=(e,s)=>{if(i)e.adoptedStyleSheets=s.map(e=>e instanceof CSSStyleSheet?e:e.styleSheet);else for(let i of s){let s=document.createElement("style"),r=t.litNonce;void 0!==r&&s.setAttribute("nonce",r),s.textContent=i.cssText,e.appendChild(s)}},h=i?e=>e:e=>e instanceof CSSStyleSheet?(e=>{let t="";for(let i of e.cssRules)t+=i.cssText;return n(t)})(e):e,{is:d,defineProperty:c,getOwnPropertyDescriptor:p,getOwnPropertyNames:u,getOwnPropertySymbols:m,getPrototypeOf:f}=Object,g=globalThis,v=g.trustedTypes,b=v?v.emptyScript:"",y=g.reactiveElementPolyfillSupport,_=(e,t)=>e,w={toAttribute(e,t){switch(t){case Boolean:e=e?b:null;break;case Object:case Array:e=null==e?e:JSON.stringify(e)}return e},fromAttribute(e,t){let i=e;switch(t){case Boolean:i=null!==e;break;case Number:i=null===e?null:Number(e);break;case Object:case Array:try{i=JSON.parse(e)}catch(e){i=null}}return i}},x=(e,t)=>!d(e,t),$={attribute:!0,type:String,converter:w,reflect:!1,hasChanged:x};Symbol.metadata??=Symbol("metadata"),g.litPropertyMetadata??=new WeakMap;class k extends HTMLElement{static addInitializer(e){this._$Ei(),(this.l??=[]).push(e)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(e,t=$){if(t.state&&(t.attribute=!1),this._$Ei(),this.elementProperties.set(e,t),!t.noAccessor){let i=Symbol(),s=this.getPropertyDescriptor(e,i,t);void 0!==s&&c(this.prototype,e,s)}}static getPropertyDescriptor(e,t,i){let{get:s,set:r}=p(this.prototype,e)??{get(){return this[t]},set(e){this[t]=e}};return{get(){return s?.call(this)},set(t){let o=s?.call(this);r.call(this,t),this.requestUpdate(e,o,i)},configurable:!0,enumerable:!0}}static getPropertyOptions(e){return this.elementProperties.get(e)??$}static _$Ei(){if(this.hasOwnProperty(_("elementProperties")))return;let e=f(this);e.finalize(),void 0!==e.l&&(this.l=[...e.l]),this.elementProperties=new Map(e.elementProperties)}static finalize(){if(this.hasOwnProperty(_("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(_("properties"))){let e=this.properties,t=[...u(e),...m(e)];for(let i of t)this.createProperty(i,e[i])}let e=this[Symbol.metadata];if(null!==e){let t=litPropertyMetadata.get(e);if(void 0!==t)for(let[e,i]of t)this.elementProperties.set(e,i)}for(let[e,t]of(this._$Eh=new Map,this.elementProperties)){let i=this._$Eu(e,t);void 0!==i&&this._$Eh.set(i,e)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(e){let t=[];if(Array.isArray(e)){let i=new Set(e.flat(1/0).reverse());for(let e of i)t.unshift(h(e))}else void 0!==e&&t.push(h(e));return t}static _$Eu(e,t){let i=t.attribute;return!1===i?void 0:"string"==typeof i?i:"string"==typeof e?e.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){this._$Eg=new Promise(e=>this.enableUpdating=e),this._$AL=new Map,this._$E_(),this.requestUpdate(),this.constructor.l?.forEach(e=>e(this))}addController(e){(this._$ES??=[]).push(e),void 0!==this.renderRoot&&this.isConnected&&e.hostConnected?.()}removeController(e){this._$ES?.splice(this._$ES.indexOf(e)>>>0,1)}_$E_(){let e=new Map,t=this.constructor.elementProperties;for(let i of t.keys())this.hasOwnProperty(i)&&(e.set(i,this[i]),delete this[i]);e.size>0&&(this._$Ep=e)}createRenderRoot(){let e=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return a(e,this.constructor.elementStyles),e}connectedCallback(){this.renderRoot??=this.createRenderRoot(),this.enableUpdating(!0),this._$ES?.forEach(e=>e.hostConnected?.())}enableUpdating(e){}disconnectedCallback(){this._$ES?.forEach(e=>e.hostDisconnected?.())}attributeChangedCallback(e,t,i){this._$AK(e,i)}_$EO(e,t){let i=this.constructor.elementProperties.get(e),s=this.constructor._$Eu(e,i);if(void 0!==s&&!0===i.reflect){let r=(void 0!==i.converter?.toAttribute?i.converter:w).toAttribute(t,i.type);this._$Em=e,null==r?this.removeAttribute(s):this.setAttribute(s,r),this._$Em=null}}_$AK(e,t){let i=this.constructor,s=i._$Eh.get(e);if(void 0!==s&&this._$Em!==s){let e=i.getPropertyOptions(s),r="function"==typeof e.converter?{fromAttribute:e.converter}:void 0!==e.converter?.fromAttribute?e.converter:w;this._$Em=s,this[s]=r.fromAttribute(t,e.type),this._$Em=null}}requestUpdate(e,t,i,s=!1,r){if(void 0!==e){if(!((i??=this.constructor.getPropertyOptions(e)).hasChanged??x)(s?r:this[e],t))return;this.C(e,t,i)}!1===this.isUpdatePending&&(this._$Eg=this._$EP())}C(e,t,i){this._$AL.has(e)||this._$AL.set(e,t),!0===i.reflect&&this._$Em!==e&&(this._$Ej??=new Set).add(e)}async _$EP(){this.isUpdatePending=!0;try{await this._$Eg}catch(e){Promise.reject(e)}let e=this.scheduleUpdate();return null!=e&&await e,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this._$Ep){for(let[e,t]of this._$Ep)this[e]=t;this._$Ep=void 0}let e=this.constructor.elementProperties;if(e.size>0)for(let[t,i]of e)!0!==i.wrapped||this._$AL.has(t)||void 0===this[t]||this.C(t,this[t],i)}let e=!1,t=this._$AL;try{(e=this.shouldUpdate(t))?(this.willUpdate(t),this._$ES?.forEach(e=>e.hostUpdate?.()),this.update(t)):this._$ET()}catch(t){throw e=!1,this._$ET(),t}e&&this._$AE(t)}willUpdate(e){}_$AE(e){this._$ES?.forEach(e=>e.hostUpdated?.()),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(e)),this.updated(e)}_$ET(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$Eg}shouldUpdate(e){return!0}update(e){this._$Ej&&=this._$Ej.forEach(e=>this._$EO(e,this[e])),this._$ET()}updated(e){}firstUpdated(e){}}k.elementStyles=[],k.shadowRootOptions={mode:"open"},k[_("elementProperties")]=new Map,k[_("finalized")]=new Map,y?.({ReactiveElement:k}),(g.reactiveElementVersions??=[]).push("2.0.0");/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */let A=globalThis,C=A.trustedTypes,E=C?C.createPolicy("lit-html",{createHTML:e=>e}):void 0,S="$lit$",z=`lit$${(Math.random()+"").slice(9)}$`,I="?"+z,T=`<${I}>`,L=document,U=()=>L.createComment(""),P=e=>null===e||"object"!=typeof e&&"function"!=typeof e,M=Array.isArray,O=e=>M(e)||"function"==typeof e?.[Symbol.iterator],F="[ 	\n\f\r]",B=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,N=/-->/g,R=/>/g,H=RegExp(`>|${F}(?:([^\\s"'>=/]+)(${F}*=${F}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`,"g"),V=/'/g,D=/"/g,j=/^(?:script|style|textarea|title)$/i,q=e=>(t,...i)=>({_$litType$:e,strings:t,values:i}),W=q(1),K=(q(2),Symbol.for("lit-noChange")),Y=Symbol.for("lit-nothing"),Z=new WeakMap,J=L.createTreeWalker(L,129);function G(e,t){if(!Array.isArray(e)||!e.hasOwnProperty("raw"))throw Error("invalid template strings array");return void 0!==E?E.createHTML(t):t}let Q=(e,t)=>{let i=e.length-1,s=[],r,o=2===t?"<svg>":"",n=B;for(let t=0;t<i;t++){let i=e[t],l,a,h=-1,d=0;for(;d<i.length&&(n.lastIndex=d,null!==(a=n.exec(i)));)d=n.lastIndex,n===B?"!--"===a[1]?n=N:void 0!==a[1]?n=R:void 0!==a[2]?(j.test(a[2])&&(r=RegExp("</"+a[2],"g")),n=H):void 0!==a[3]&&(n=H):n===H?">"===a[0]?(n=r??B,h=-1):void 0===a[1]?h=-2:(h=n.lastIndex-a[2].length,l=a[1],n=void 0===a[3]?H:'"'===a[3]?D:V):n===D||n===V?n=H:n===N||n===R?n=B:(n=H,r=void 0);let c=n===H&&e[t+1].startsWith("/>")?" ":"";o+=n===B?i+T:h>=0?(s.push(l),i.slice(0,h)+S+i.slice(h)+z+c):i+z+(-2===h?t:c)}return[G(e,o+(e[i]||"<?>")+(2===t?"</svg>":"")),s]};class X{constructor({strings:e,_$litType$:t},i){let s;this.parts=[];let r=0,o=0,n=e.length-1,l=this.parts,[a,h]=Q(e,t);if(this.el=X.createElement(a,i),J.currentNode=this.el.content,2===t){let e=this.el.content.firstChild;e.replaceWith(...e.childNodes)}for(;null!==(s=J.nextNode())&&l.length<n;){if(1===s.nodeType){if(s.hasAttributes())for(let e of s.getAttributeNames())if(e.endsWith(S)){let t=h[o++],i=s.getAttribute(e).split(z),n=/([.?@])?(.*)/.exec(t);l.push({type:1,index:r,name:n[2],strings:i,ctor:"."===n[1]?er:"?"===n[1]?eo:"@"===n[1]?en:es}),s.removeAttribute(e)}else e.startsWith(z)&&(l.push({type:6,index:r}),s.removeAttribute(e));if(j.test(s.tagName)){let e=s.textContent.split(z),t=e.length-1;if(t>0){s.textContent=C?C.emptyScript:"";for(let i=0;i<t;i++)s.append(e[i],U()),J.nextNode(),l.push({type:2,index:++r});s.append(e[t],U())}}}else if(8===s.nodeType){if(s.data===I)l.push({type:2,index:r});else{let e=-1;for(;-1!==(e=s.data.indexOf(z,e+1));)l.push({type:7,index:r}),e+=z.length-1}}r++}}static createElement(e,t){let i=L.createElement("template");return i.innerHTML=e,i}}function ee(e,t,i=e,s){if(t===K)return t;let r=void 0!==s?i._$Co?.[s]:i._$Cl,o=P(t)?void 0:t._$litDirective$;return r?.constructor!==o&&(r?._$AO?.(!1),void 0===o?r=void 0:(r=new o(e))._$AT(e,i,s),void 0!==s?(i._$Co??=[])[s]=r:i._$Cl=r),void 0!==r&&(t=ee(e,r._$AS(e,t.values),r,s)),t}class et{constructor(e,t){this._$AV=[],this._$AN=void 0,this._$AD=e,this._$AM=t}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(e){let{el:{content:t},parts:i}=this._$AD,s=(e?.creationScope??L).importNode(t,!0);J.currentNode=s;let r=J.nextNode(),o=0,n=0,l=i[0];for(;void 0!==l;){if(o===l.index){let t;2===l.type?t=new ei(r,r.nextSibling,this,e):1===l.type?t=new l.ctor(r,l.name,l.strings,this,e):6===l.type&&(t=new el(r,this,e)),this._$AV.push(t),l=i[++n]}o!==l?.index&&(r=J.nextNode(),o++)}return J.currentNode=L,s}p(e){let t=0;for(let i of this._$AV)void 0!==i&&(void 0!==i.strings?(i._$AI(e,i,t),t+=i.strings.length-2):i._$AI(e[t])),t++}}class ei{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(e,t,i,s){this.type=2,this._$AH=Y,this._$AN=void 0,this._$AA=e,this._$AB=t,this._$AM=i,this.options=s,this._$Cv=s?.isConnected??!0}get parentNode(){let e=this._$AA.parentNode,t=this._$AM;return void 0!==t&&11===e?.nodeType&&(e=t.parentNode),e}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(e,t=this){P(e=ee(this,e,t))?e===Y||null==e||""===e?(this._$AH!==Y&&this._$AR(),this._$AH=Y):e!==this._$AH&&e!==K&&this._(e):void 0!==e._$litType$?this.g(e):void 0!==e.nodeType?this.$(e):O(e)?this.T(e):this._(e)}k(e){return this._$AA.parentNode.insertBefore(e,this._$AB)}$(e){this._$AH!==e&&(this._$AR(),this._$AH=this.k(e))}_(e){this._$AH!==Y&&P(this._$AH)?this._$AA.nextSibling.data=e:this.$(L.createTextNode(e)),this._$AH=e}g(e){let{values:t,_$litType$:i}=e,s="number"==typeof i?this._$AC(e):(void 0===i.el&&(i.el=X.createElement(G(i.h,i.h[0]),this.options)),i);if(this._$AH?._$AD===s)this._$AH.p(t);else{let e=new et(s,this),i=e.u(this.options);e.p(t),this.$(i),this._$AH=e}}_$AC(e){let t=Z.get(e.strings);return void 0===t&&Z.set(e.strings,t=new X(e)),t}T(e){M(this._$AH)||(this._$AH=[],this._$AR());let t=this._$AH,i,s=0;for(let r of e)s===t.length?t.push(i=new ei(this.k(U()),this.k(U()),this,this.options)):i=t[s],i._$AI(r),s++;s<t.length&&(this._$AR(i&&i._$AB.nextSibling,s),t.length=s)}_$AR(e=this._$AA.nextSibling,t){for(this._$AP?.(!1,!0,t);e&&e!==this._$AB;){let t=e.nextSibling;e.remove(),e=t}}setConnected(e){void 0===this._$AM&&(this._$Cv=e,this._$AP?.(e))}}class es{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(e,t,i,s,r){this.type=1,this._$AH=Y,this._$AN=void 0,this.element=e,this.name=t,this._$AM=s,this.options=r,i.length>2||""!==i[0]||""!==i[1]?(this._$AH=Array(i.length-1).fill(new String),this.strings=i):this._$AH=Y}_$AI(e,t=this,i,s){let r=this.strings,o=!1;if(void 0===r)(o=!P(e=ee(this,e,t,0))||e!==this._$AH&&e!==K)&&(this._$AH=e);else{let s,n;let l=e;for(e=r[0],s=0;s<r.length-1;s++)(n=ee(this,l[i+s],t,s))===K&&(n=this._$AH[s]),o||=!P(n)||n!==this._$AH[s],n===Y?e=Y:e!==Y&&(e+=(n??"")+r[s+1]),this._$AH[s]=n}o&&!s&&this.j(e)}j(e){e===Y?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,e??"")}}class er extends es{constructor(){super(...arguments),this.type=3}j(e){this.element[this.name]=e===Y?void 0:e}}class eo extends es{constructor(){super(...arguments),this.type=4}j(e){this.element.toggleAttribute(this.name,!!e&&e!==Y)}}class en extends es{constructor(e,t,i,s,r){super(e,t,i,s,r),this.type=5}_$AI(e,t=this){if((e=ee(this,e,t,0)??Y)===K)return;let i=this._$AH,s=e===Y&&i!==Y||e.capture!==i.capture||e.once!==i.once||e.passive!==i.passive,r=e!==Y&&(i===Y||s);s&&this.element.removeEventListener(this.name,this,i),r&&this.element.addEventListener(this.name,this,e),this._$AH=e}handleEvent(e){"function"==typeof this._$AH?this._$AH.call(this.options?.host??this.element,e):this._$AH.handleEvent(e)}}class el{constructor(e,t,i){this.element=e,this.type=6,this._$AN=void 0,this._$AM=t,this.options=i}get _$AU(){return this._$AM._$AU}_$AI(e){ee(this,e)}}let ea=A.litHtmlPolyfillSupport;ea?.(X,ei),(A.litHtmlVersions??=[]).push("3.0.0");let eh=(e,t,i)=>{let s=i?.renderBefore??t,r=s._$litPart$;if(void 0===r){let e=i?.renderBefore??null;s._$litPart$=r=new ei(t.insertBefore(U(),e),e,void 0,i??{})}return r._$AI(e),r};/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */class ed extends k{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){let e=super.createRenderRoot();return this.renderOptions.renderBefore??=e.firstChild,e}update(e){let t=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(e),this._$Do=eh(t,this.renderRoot,this.renderOptions)}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(!0)}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(!1)}render(){return K}}ed._$litElement$=!0,ed.finalized=!0,globalThis.litElementHydrateSupport?.({LitElement:ed});let ec=globalThis.litElementPolyfillSupport;ec?.({LitElement:ed}),(globalThis.litElementVersions??=[]).push("4.0.0");var ep,eu=l`
  :host {
    box-sizing: border-box;
  }

  :host *,
  :host *::before,
  :host *::after {
    box-sizing: inherit;
  }

  [hidden] {
    display: none !important;
  }
`,em=l`
  ${eu}

  :host {
    /*
     * These are actually used by tree item, but we define them here so they can more easily be set and all tree items
     * stay consistent.
     */
    --indent-guide-color: var(--sl-color-neutral-200);
    --indent-guide-offset: 0;
    --indent-guide-style: solid;
    --indent-guide-width: 0;
    --indent-size: var(--sl-spacing-large);

    display: block;
    isolation: isolate;

    /*
     * Tree item indentation uses the "em" unit to increment its width on each level, so setting the font size to zero
     * here removes the indentation for all the nodes on the first level.
     */
    font-size: 0;
  }
`,ef=l`
  ${eu}

  :host {
    display: block;
    outline: 0;
    z-index: 0;
  }

  :host(:focus) {
    outline: none;
  }

  slot:not([name])::slotted(sl-icon) {
    margin-inline-end: var(--sl-spacing-x-small);
  }

  .tree-item {
    position: relative;
    display: flex;
    align-items: stretch;
    flex-direction: column;
    color: var(--sl-color-neutral-700);
    cursor: pointer;
    user-select: none;
    -webkit-user-select: none;
  }

  .tree-item__checkbox {
    pointer-events: none;
  }

  .tree-item__expand-button,
  .tree-item__checkbox,
  .tree-item__label {
    font-family: var(--sl-font-sans);
    font-size: var(--sl-font-size-medium);
    font-weight: var(--sl-font-weight-normal);
    line-height: var(--sl-line-height-dense);
    letter-spacing: var(--sl-letter-spacing-normal);
  }

  .tree-item__checkbox::part(base) {
    display: flex;
    align-items: center;
  }

  .tree-item__indentation {
    display: block;
    width: 1em;
    flex-shrink: 0;
  }

  .tree-item__expand-button {
    display: flex;
    align-items: center;
    justify-content: center;
    box-sizing: content-box;
    color: var(--sl-color-neutral-500);
    padding: var(--sl-spacing-x-small);
    width: 1rem;
    height: 1rem;
    flex-shrink: 0;
    cursor: pointer;
  }

  .tree-item__expand-button {
    transition: var(--sl-transition-medium) rotate ease;
  }

  .tree-item--expanded .tree-item__expand-button {
    rotate: 90deg;
  }

  .tree-item--expanded.tree-item--rtl .tree-item__expand-button {
    rotate: -90deg;
  }

  .tree-item--expanded slot[name='expand-icon'],
  .tree-item:not(.tree-item--expanded) slot[name='collapse-icon'] {
    display: none;
  }

  .tree-item:not(.tree-item--has-expand-button) .tree-item__expand-icon-slot {
    display: none;
  }

  .tree-item__expand-button--visible {
    cursor: pointer;
  }

  .tree-item__item {
    display: flex;
    align-items: center;
    border-inline-start: solid 3px transparent;
  }

  .tree-item--disabled .tree-item__item {
    opacity: 0.5;
    outline: none;
    cursor: not-allowed;
  }

  :host(:focus-visible) .tree-item__item {
    outline: var(--sl-focus-ring);
    outline-offset: var(--sl-focus-ring-offset);
    z-index: 2;
  }

  :host(:not([aria-disabled='true'])) .tree-item--selected .tree-item__item {
    background-color: var(--sl-color-neutral-100);
    border-inline-start-color: var(--sl-color-primary-600);
  }

  :host(:not([aria-disabled='true'])) .tree-item__expand-button {
    color: var(--sl-color-neutral-600);
  }

  .tree-item__label {
    display: flex;
    align-items: center;
    transition: var(--sl-transition-fast) color;
  }

  .tree-item__children {
    display: block;
    font-size: calc(1em + var(--indent-size, var(--sl-spacing-medium)));
  }

  /* Indentation lines */
  .tree-item__children {
    position: relative;
  }

  .tree-item__children::before {
    content: '';
    position: absolute;
    top: var(--indent-guide-offset);
    bottom: var(--indent-guide-offset);
    left: calc(1em - (var(--indent-guide-width) / 2) - 1px);
    border-inline-end: var(--indent-guide-width) var(--indent-guide-style) var(--indent-guide-color);
    z-index: 1;
  }

  .tree-item--rtl .tree-item__children::before {
    left: auto;
    right: 1em;
  }

  @media (forced-colors: active) {
    :host(:not([aria-disabled='true'])) .tree-item--selected .tree-item__item {
      outline: dashed 1px SelectedItem;
    }
  }
`,eg=l`
  ${eu}

  :host {
    display: inline-block;
  }

  .checkbox {
    position: relative;
    display: inline-flex;
    align-items: flex-start;
    font-family: var(--sl-input-font-family);
    font-weight: var(--sl-input-font-weight);
    color: var(--sl-input-label-color);
    vertical-align: middle;
    cursor: pointer;
  }

  .checkbox--small {
    --toggle-size: var(--sl-toggle-size-small);
    font-size: var(--sl-input-font-size-small);
  }

  .checkbox--medium {
    --toggle-size: var(--sl-toggle-size-medium);
    font-size: var(--sl-input-font-size-medium);
  }

  .checkbox--large {
    --toggle-size: var(--sl-toggle-size-large);
    font-size: var(--sl-input-font-size-large);
  }

  .checkbox__control {
    flex: 0 0 auto;
    position: relative;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: var(--toggle-size);
    height: var(--toggle-size);
    border: solid var(--sl-input-border-width) var(--sl-input-border-color);
    border-radius: 2px;
    background-color: var(--sl-input-background-color);
    color: var(--sl-color-neutral-0);
    transition:
      var(--sl-transition-fast) border-color,
      var(--sl-transition-fast) background-color,
      var(--sl-transition-fast) color,
      var(--sl-transition-fast) box-shadow;
  }

  .checkbox__input {
    position: absolute;
    opacity: 0;
    padding: 0;
    margin: 0;
    pointer-events: none;
  }

  .checkbox__checked-icon,
  .checkbox__indeterminate-icon {
    display: inline-flex;
    width: var(--toggle-size);
    height: var(--toggle-size);
  }

  /* Hover */
  .checkbox:not(.checkbox--checked):not(.checkbox--disabled) .checkbox__control:hover {
    border-color: var(--sl-input-border-color-hover);
    background-color: var(--sl-input-background-color-hover);
  }

  /* Focus */
  .checkbox:not(.checkbox--checked):not(.checkbox--disabled) .checkbox__input:focus-visible ~ .checkbox__control {
    outline: var(--sl-focus-ring);
    outline-offset: var(--sl-focus-ring-offset);
  }

  /* Checked/indeterminate */
  .checkbox--checked .checkbox__control,
  .checkbox--indeterminate .checkbox__control {
    border-color: var(--sl-color-primary-600);
    background-color: var(--sl-color-primary-600);
  }

  /* Checked/indeterminate + hover */
  .checkbox.checkbox--checked:not(.checkbox--disabled) .checkbox__control:hover,
  .checkbox.checkbox--indeterminate:not(.checkbox--disabled) .checkbox__control:hover {
    border-color: var(--sl-color-primary-500);
    background-color: var(--sl-color-primary-500);
  }

  /* Checked/indeterminate + focus */
  .checkbox.checkbox--checked:not(.checkbox--disabled) .checkbox__input:focus-visible ~ .checkbox__control,
  .checkbox.checkbox--indeterminate:not(.checkbox--disabled) .checkbox__input:focus-visible ~ .checkbox__control {
    outline: var(--sl-focus-ring);
    outline-offset: var(--sl-focus-ring-offset);
  }

  /* Disabled */
  .checkbox--disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  .checkbox__label {
    display: inline-block;
    color: var(--sl-input-label-color);
    line-height: var(--toggle-size);
    margin-inline-start: 0.5em;
    user-select: none;
    -webkit-user-select: none;
  }

  :host([required]) .checkbox__label::after {
    content: var(--sl-input-required-content);
    margin-inline-start: var(--sl-input-required-content-offset);
  }
`,ev=Object.defineProperty,eb=Object.defineProperties,ey=Object.getOwnPropertyDescriptor,e_=Object.getOwnPropertyDescriptors,ew=Object.getOwnPropertySymbols,ex=Object.prototype.hasOwnProperty,e$=Object.prototype.propertyIsEnumerable,ek=(e,t,i)=>t in e?ev(e,t,{enumerable:!0,configurable:!0,writable:!0,value:i}):e[t]=i,eA=(e,t)=>{for(var i in t||(t={}))ex.call(t,i)&&ek(e,i,t[i]);if(ew)for(var i of ew(t))e$.call(t,i)&&ek(e,i,t[i]);return e},eC=(e,t)=>eb(e,e_(t)),eE=(e,t,i,s)=>{for(var r,o=s>1?void 0:s?ey(t,i):t,n=e.length-1;n>=0;n--)(r=e[n])&&(o=(s?r(t,i,o):r(o))||o);return s&&o&&ev(t,i,o),o},eS=/* @__PURE__ */new WeakMap,ez=/* @__PURE__ */new WeakMap,eI=/* @__PURE__ */new WeakSet,eT=/* @__PURE__ */new WeakMap,eL=class{constructor(e,t){this.handleFormData=e=>{let t=this.options.disabled(this.host),i=this.options.name(this.host),s=this.options.value(this.host),r="sl-button"===this.host.tagName.toLowerCase();t||r||"string"!=typeof i||!(i.length>0)||void 0===s||(Array.isArray(s)?s.forEach(t=>{e.formData.append(i,t.toString())}):e.formData.append(i,s.toString()))},this.handleFormSubmit=e=>{var t;let i=this.options.disabled(this.host),s=this.options.reportValidity;this.form&&!this.form.noValidate&&(null==(t=eS.get(this.form))||t.forEach(e=>{this.setUserInteracted(e,!0)})),!this.form||this.form.noValidate||i||s(this.host)||(e.preventDefault(),e.stopImmediatePropagation())},this.handleFormReset=()=>{this.options.setValue(this.host,this.options.defaultValue(this.host)),this.setUserInteracted(this.host,!1),eT.set(this.host,[])},this.handleInteraction=e=>{let t=eT.get(this.host);t.includes(e.type)||t.push(e.type),t.length===this.options.assumeInteractionOn.length&&this.setUserInteracted(this.host,!0)},this.reportFormValidity=()=>{if(this.form&&!this.form.noValidate){let e=this.form.querySelectorAll("*");for(let t of e)if("function"==typeof t.reportValidity&&!t.reportValidity())return!1}return!0},(this.host=e).addController(this),this.options=eA({form:e=>{if(e.hasAttribute("form")&&""!==e.getAttribute("form")){let t=e.getRootNode(),i=e.getAttribute("form");if(i)return t.getElementById(i)}return e.closest("form")},name:e=>e.name,value:e=>e.value,defaultValue:e=>e.defaultValue,disabled:e=>{var t;return null!=(t=e.disabled)&&t},reportValidity:e=>"function"!=typeof e.reportValidity||e.reportValidity(),setValue:(e,t)=>e.value=t,assumeInteractionOn:["sl-input"]},t)}hostConnected(){let e=this.options.form(this.host);e&&this.attachForm(e),eT.set(this.host,[]),this.options.assumeInteractionOn.forEach(e=>{this.host.addEventListener(e,this.handleInteraction)})}hostDisconnected(){this.detachForm(),eT.delete(this.host),this.options.assumeInteractionOn.forEach(e=>{this.host.removeEventListener(e,this.handleInteraction)})}hostUpdated(){let e=this.options.form(this.host);e||this.detachForm(),e&&this.form!==e&&(this.detachForm(),this.attachForm(e)),this.host.hasUpdated&&this.setValidity(this.host.validity.valid)}attachForm(e){e?(this.form=e,eS.has(this.form)?eS.get(this.form).add(this.host):eS.set(this.form,/* @__PURE__ */new Set([this.host])),this.form.addEventListener("formdata",this.handleFormData),this.form.addEventListener("submit",this.handleFormSubmit),this.form.addEventListener("reset",this.handleFormReset),ez.has(this.form)||(ez.set(this.form,this.form.reportValidity),this.form.reportValidity=()=>this.reportFormValidity())):this.form=void 0}detachForm(){var e;this.form&&(null==(e=eS.get(this.form))||e.delete(this.host),this.form.removeEventListener("formdata",this.handleFormData),this.form.removeEventListener("submit",this.handleFormSubmit),this.form.removeEventListener("reset",this.handleFormReset),ez.has(this.form)&&(this.form.reportValidity=ez.get(this.form),ez.delete(this.form))),this.form=void 0}setUserInteracted(e,t){t?eI.add(e):eI.delete(e),e.requestUpdate()}doAction(e,t){if(this.form){let i=document.createElement("button");i.type=e,i.style.position="absolute",i.style.width="0",i.style.height="0",i.style.clipPath="inset(50%)",i.style.overflow="hidden",i.style.whiteSpace="nowrap",t&&(i.name=t.name,i.value=t.value,["formaction","formenctype","formmethod","formnovalidate","formtarget"].forEach(e=>{t.hasAttribute(e)&&i.setAttribute(e,t.getAttribute(e))})),this.form.append(i),i.click(),i.remove()}}/** Returns the associated `<form>` element, if one exists. */getForm(){var e;return null!=(e=this.form)?e:null}/** Resets the form, restoring all the control to their default value */reset(e){this.doAction("reset",e)}/** Submits the form, triggering validation and form data injection. */submit(e){this.doAction("submit",e)}/**
   * Synchronously sets the form control's validity. Call this when you know the future validity but need to update
   * the host element immediately, i.e. before Lit updates the component in the next update.
   */setValidity(e){let t=this.host,i=!!eI.has(t),s=!!t.required;t.toggleAttribute("data-required",s),t.toggleAttribute("data-optional",!s),t.toggleAttribute("data-invalid",!e),t.toggleAttribute("data-valid",e),t.toggleAttribute("data-user-invalid",!e&&i),t.toggleAttribute("data-user-valid",e&&i)}/**
   * Updates the form control's validity based on the current value of `host.validity.valid`. Call this when anything
   * that affects constraint validation changes so the component receives the correct validity states.
   */updateValidity(){let e=this.host;this.setValidity(e.validity.valid)}/**
   * Dispatches a non-bubbling, cancelable custom event of type `sl-invalid`.
   * If the `sl-invalid` event will be cancelled then the original `invalid`
   * event (which may have been passed as argument) will also be cancelled.
   * If no original `invalid` event has been passed then the `sl-invalid`
   * event will be cancelled before being dispatched.
   */emitInvalidEvent(e){let t=new CustomEvent("sl-invalid",{bubbles:!1,composed:!1,cancelable:!0,detail:{}});e||t.preventDefault(),this.host.dispatchEvent(t)||null==e||e.preventDefault()}},eU=Object.freeze({badInput:!1,customError:!1,patternMismatch:!1,rangeOverflow:!1,rangeUnderflow:!1,stepMismatch:!1,tooLong:!1,tooShort:!1,typeMismatch:!1,valid:!0,valueMissing:!1});Object.freeze(eC(eA({},eU),{valid:!1,valueMissing:!0})),Object.freeze(eC(eA({},eU),{valid:!1,customError:!0}));var eP=l`
  ${eu}

  :host {
    display: inline-block;
    width: 1em;
    height: 1em;
    box-sizing: content-box !important;
  }

  svg {
    display: block;
    height: 100%;
    width: 100%;
  }
`,eM="",eO={caret:`
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <polyline points="6 9 12 15 18 9"></polyline>
    </svg>
  `,check:`
    <svg part="checked-icon" class="checkbox__icon" viewBox="0 0 16 16">
      <g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd" stroke-linecap="round">
        <g stroke="currentColor">
          <g transform="translate(3.428571, 3.428571)">
            <path d="M0,5.71428571 L3.42857143,9.14285714"></path>
            <path d="M9.14285714,0 L3.42857143,9.14285714"></path>
          </g>
        </g>
      </g>
    </svg>
  `,"chevron-down":`
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-chevron-down" viewBox="0 0 16 16">
      <path fill-rule="evenodd" d="M1.646 4.646a.5.5 0 0 1 .708 0L8 10.293l5.646-5.647a.5.5 0 0 1 .708.708l-6 6a.5.5 0 0 1-.708 0l-6-6a.5.5 0 0 1 0-.708z"/>
    </svg>
  `,"chevron-left":`
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-chevron-left" viewBox="0 0 16 16">
      <path fill-rule="evenodd" d="M11.354 1.646a.5.5 0 0 1 0 .708L5.707 8l5.647 5.646a.5.5 0 0 1-.708.708l-6-6a.5.5 0 0 1 0-.708l6-6a.5.5 0 0 1 .708 0z"/>
    </svg>
  `,"chevron-right":`
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-chevron-right" viewBox="0 0 16 16">
      <path fill-rule="evenodd" d="M4.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L10.293 8 4.646 2.354a.5.5 0 0 1 0-.708z"/>
    </svg>
  `,copy:`
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-files" viewBox="0 0 16 16" part="svg">
      <path d="M13 0H6a2 2 0 0 0-2 2 2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h7a2 2 0 0 0 2-2 2 2 0 0 0 2-2V2a2 2 0 0 0-2-2zm0 13V4a2 2 0 0 0-2-2H5a1 1 0 0 1 1-1h7a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1zM3 4a1 1 0 0 1 1-1h7a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V4z"></path>
    </svg>
  `,eye:`
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-eye" viewBox="0 0 16 16">
      <path d="M16 8s-3-5.5-8-5.5S0 8 0 8s3 5.5 8 5.5S16 8 16 8zM1.173 8a13.133 13.133 0 0 1 1.66-2.043C4.12 4.668 5.88 3.5 8 3.5c2.12 0 3.879 1.168 5.168 2.457A13.133 13.133 0 0 1 14.828 8c-.058.087-.122.183-.195.288-.335.48-.83 1.12-1.465 1.755C11.879 11.332 10.119 12.5 8 12.5c-2.12 0-3.879-1.168-5.168-2.457A13.134 13.134 0 0 1 1.172 8z"/>
      <path d="M8 5.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5zM4.5 8a3.5 3.5 0 1 1 7 0 3.5 3.5 0 0 1-7 0z"/>
    </svg>
  `,"eye-slash":`
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-eye-slash" viewBox="0 0 16 16">
      <path d="M13.359 11.238C15.06 9.72 16 8 16 8s-3-5.5-8-5.5a7.028 7.028 0 0 0-2.79.588l.77.771A5.944 5.944 0 0 1 8 3.5c2.12 0 3.879 1.168 5.168 2.457A13.134 13.134 0 0 1 14.828 8c-.058.087-.122.183-.195.288-.335.48-.83 1.12-1.465 1.755-.165.165-.337.328-.517.486l.708.709z"/>
      <path d="M11.297 9.176a3.5 3.5 0 0 0-4.474-4.474l.823.823a2.5 2.5 0 0 1 2.829 2.829l.822.822zm-2.943 1.299.822.822a3.5 3.5 0 0 1-4.474-4.474l.823.823a2.5 2.5 0 0 0 2.829 2.829z"/>
      <path d="M3.35 5.47c-.18.16-.353.322-.518.487A13.134 13.134 0 0 0 1.172 8l.195.288c.335.48.83 1.12 1.465 1.755C4.121 11.332 5.881 12.5 8 12.5c.716 0 1.39-.133 2.02-.36l.77.772A7.029 7.029 0 0 1 8 13.5C3 13.5 0 8 0 8s.939-1.721 2.641-3.238l.708.709zm10.296 8.884-12-12 .708-.708 12 12-.708.708z"/>
    </svg>
  `,eyedropper:`
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-eyedropper" viewBox="0 0 16 16">
      <path d="M13.354.646a1.207 1.207 0 0 0-1.708 0L8.5 3.793l-.646-.647a.5.5 0 1 0-.708.708L8.293 5l-7.147 7.146A.5.5 0 0 0 1 12.5v1.793l-.854.853a.5.5 0 1 0 .708.707L1.707 15H3.5a.5.5 0 0 0 .354-.146L11 7.707l1.146 1.147a.5.5 0 0 0 .708-.708l-.647-.646 3.147-3.146a1.207 1.207 0 0 0 0-1.708l-2-2zM2 12.707l7-7L10.293 7l-7 7H2v-1.293z"></path>
    </svg>
  `,"grip-vertical":`
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-grip-vertical" viewBox="0 0 16 16">
      <path d="M7 2a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm3 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0zM7 5a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm3 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0zM7 8a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm3 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm-3 3a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm3 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm-3 3a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm3 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0z"></path>
    </svg>
  `,indeterminate:`
    <svg part="indeterminate-icon" class="checkbox__icon" viewBox="0 0 16 16">
      <g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd" stroke-linecap="round">
        <g stroke="currentColor" stroke-width="2">
          <g transform="translate(2.285714, 6.857143)">
            <path d="M10.2857143,1.14285714 L1.14285714,1.14285714"></path>
          </g>
        </g>
      </g>
    </svg>
  `,"person-fill":`
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-person-fill" viewBox="0 0 16 16">
      <path d="M3 14s-1 0-1-1 1-4 6-4 6 3 6 4-1 1-1 1H3zm5-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6z"/>
    </svg>
  `,"play-fill":`
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-play-fill" viewBox="0 0 16 16">
      <path d="m11.596 8.697-6.363 3.692c-.54.313-1.233-.066-1.233-.697V4.308c0-.63.692-1.01 1.233-.696l6.363 3.692a.802.802 0 0 1 0 1.393z"></path>
    </svg>
  `,"pause-fill":`
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-pause-fill" viewBox="0 0 16 16">
      <path d="M5.5 3.5A1.5 1.5 0 0 1 7 5v6a1.5 1.5 0 0 1-3 0V5a1.5 1.5 0 0 1 1.5-1.5zm5 0A1.5 1.5 0 0 1 12 5v6a1.5 1.5 0 0 1-3 0V5a1.5 1.5 0 0 1 1.5-1.5z"></path>
    </svg>
  `,radio:`
    <svg part="checked-icon" class="radio__icon" viewBox="0 0 16 16">
      <g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
        <g fill="currentColor">
          <circle cx="8" cy="8" r="3.42857143"></circle>
        </g>
      </g>
    </svg>
  `,"star-fill":`
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-star-fill" viewBox="0 0 16 16">
      <path d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z"/>
    </svg>
  `,"x-lg":`
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-x-lg" viewBox="0 0 16 16">
      <path d="M2.146 2.854a.5.5 0 1 1 .708-.708L8 7.293l5.146-5.147a.5.5 0 0 1 .708.708L8.707 8l5.147 5.146a.5.5 0 0 1-.708.708L8 8.707l-5.146 5.147a.5.5 0 0 1-.708-.708L7.293 8 2.146 2.854Z"/>
    </svg>
  `,"x-circle-fill":`
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-x-circle-fill" viewBox="0 0 16 16">
      <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM5.354 4.646a.5.5 0 1 0-.708.708L7.293 8l-2.647 2.646a.5.5 0 0 0 .708.708L8 8.707l2.646 2.647a.5.5 0 0 0 .708-.708L8.707 8l2.647-2.646a.5.5 0 0 0-.708-.708L8 7.293 5.354 4.646z"></path>
    </svg>
  `},eF=[{name:"default",resolver:e=>(function(e=""){if(!eM){let e=[...document.getElementsByTagName("script")],t=e.find(e=>e.hasAttribute("data-shoelace"));if(t)eM=t.getAttribute("data-shoelace");else{let t=e.find(e=>/shoelace(\.min)?\.js($|\?)/.test(e.src)||/shoelace-autoloader(\.min)?\.js($|\?)/.test(e.src)),i="";t&&(i=t.getAttribute("src")),eM=i.split("/").slice(0,-1).join("/")}}return eM.replace(/\/$/,"")+(e?`/${e.replace(/^\//,"")}`:"")})(`assets/icons/${e}.svg`)},{name:"system",resolver:e=>e in eO?`data:image/svg+xml,${encodeURIComponent(eO[e])}`:""}],eB=[];function eN(e){return eF.find(t=>t.name===e)}// src/internal/watch.ts
function eR(e,t){let i=eA({waitUntilFirstUpdate:!1},t);return(t,s)=>{let{update:r}=t,o=Array.isArray(e)?e:[e];t.update=function(e){o.forEach(t=>{if(e.has(t)){let r=e.get(t),o=this[t];r!==o&&(!i.waitUntilFirstUpdate||this.hasUpdated)&&this[s](r,o)}}),r.call(this,e)}}}/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */let eH={attribute:!0,type:String,converter:w,reflect:!1,hasChanged:x},eV=(e=eH,t,i)=>{let{kind:s,metadata:r}=i,o=globalThis.litPropertyMetadata.get(r);if(void 0===o&&globalThis.litPropertyMetadata.set(r,o=new Map),o.set(i.name,e),"accessor"===s){let{name:s}=i;return{set(i){let r=t.get.call(this);t.set.call(this,i),this.requestUpdate(s,r,e)},init(t){return void 0!==t&&this.C(s,void 0,e),t}}}if("setter"===s){let{name:s}=i;return function(i){let r=this[s];t.call(this,i),this.requestUpdate(s,r,e)}}throw Error("Unsupported decorator location: "+s)};function eD(e){return(t,i)=>"object"==typeof i?eV(e,t,i):((e,t,i)=>{let s=t.hasOwnProperty(i);return t.constructor.createProperty(i,s?{...e,wrapped:!0}:e),s?Object.getOwnPropertyDescriptor(t,i):void 0})(e,t,i)}/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */function ej(e){return eD({...e,state:!0,attribute:!1})}/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */let eq=(e,t,i)=>(i.configurable=!0,i.enumerable=!0,Reflect.decorate&&"object"!=typeof t&&Object.defineProperty(e,t,i),i);/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */function eW(e,t){return(i,s,r)=>{let o=t=>t.renderRoot?.querySelector(e)??null;if(t){let{get:e,set:n}="object"==typeof s?i:r??(()=>{let e=Symbol();return{get(){return this[e]},set(t){this[e]=t}}})();return eq(i,s,{get(){if(t){let t=e.call(this);return void 0===t&&(t=o(this),n.call(this,t)),t}return o(this)}})}return eq(i,s,{get(){return o(this)}})}}var eK=class extends ed{constructor(){super(),Object.entries(this.constructor.dependencies).forEach(([e,t])=>{this.constructor.define(e,t)})}emit(e,t){let i=new CustomEvent(e,eA({bubbles:!0,cancelable:!1,composed:!0,detail:{}},t));return this.dispatchEvent(i),i}/* eslint-enable */static define(e,t=this,i={}){let s=customElements.get(e);if(!s){customElements.define(e,class extends t{},i);return}let r=" (unknown version)",o=r;"version"in t&&t.version&&(r=" v"+t.version),"version"in s&&s.version&&(o=" v"+s.version),r&&o&&r===o||console.warn(`Attempted to register <${e}>${r}, but <${e}>${o} has already been registered.`)}};/* eslint-disable */// @ts-expect-error This is auto-injected at build time.
eK.version="2.11.2",eK.dependencies={},eE([eD()],eK.prototype,"dir",2),eE([eD()],eK.prototype,"lang",2);/**
 * @license
 * Copyright 2020 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */let{D:eY}={S:S,A:z,P:I,C:1,M:Q,L:et,R:O,V:ee,D:ei,I:es,H:eo,N:en,U:er,B:el},eZ=(e,t)=>void 0===t?void 0!==e?._$litType$:e?._$litType$===t,eJ=e=>void 0===e.strings,eG={},eQ=(e,t=eG)=>e._$AH=t;var eX=Symbol(),e0=Symbol(),e1=/* @__PURE__ */new Map,e2=class extends eK{constructor(){super(...arguments),this.initialRender=!1,this.svg=null,this.label="",this.library="default"}/** Given a URL, this function returns the resulting SVG element or an appropriate error symbol. */async resolveIcon(e,t){var i;let s;if(null==t?void 0:t.spriteSheet)return W`<svg part="svg">
        <use part="use" href="${e}"></use>
      </svg>`;try{if(!(s=await fetch(e,{mode:"cors"})).ok)return 410===s.status?eX:e0}catch(e){return e0}try{let e=document.createElement("div");e.innerHTML=await s.text();let t=e.firstElementChild;if((null==(i=null==t?void 0:t.tagName)?void 0:i.toLowerCase())!=="svg")return eX;ep||(ep=new DOMParser);let r=ep.parseFromString(t.outerHTML,"text/html"),o=r.body.querySelector("svg");if(!o)return eX;return o.part.add("svg"),document.adoptNode(o)}catch(e){return eX}}connectedCallback(){super.connectedCallback(),eB.push(this)}firstUpdated(){this.initialRender=!0,this.setIcon()}disconnectedCallback(){var e;super.disconnectedCallback(),e=this,eB=eB.filter(t=>t!==e)}getIconSource(){let e=eN(this.library);return this.name&&e?{url:e.resolver(this.name),fromLibrary:!0}:{url:this.src,fromLibrary:!1}}handleLabelChange(){let e="string"==typeof this.label&&this.label.length>0;e?(this.setAttribute("role","img"),this.setAttribute("aria-label",this.label),this.removeAttribute("aria-hidden")):(this.removeAttribute("role"),this.removeAttribute("aria-label"),this.setAttribute("aria-hidden","true"))}async setIcon(){var e;let{url:t,fromLibrary:i}=this.getIconSource(),s=i?eN(this.library):void 0;if(!t){this.svg=null;return}let r=e1.get(t);if(r||(r=this.resolveIcon(t,s),e1.set(t,r)),!this.initialRender)return;let o=await r;if(o===e0&&e1.delete(t),t===this.getIconSource().url){if(eZ(o)){this.svg=o;return}switch(o){case e0:case eX:this.svg=null,this.emit("sl-error");break;default:this.svg=o.cloneNode(!0),null==(e=null==s?void 0:s.mutator)||e.call(s,this.svg),this.emit("sl-load")}}}render(){return this.svg}};e2.styles=eP,eE([ej()],e2.prototype,"svg",2),eE([eD({reflect:!0})],e2.prototype,"name",2),eE([eD()],e2.prototype,"src",2),eE([eD()],e2.prototype,"label",2),eE([eD({reflect:!0})],e2.prototype,"library",2),eE([eR("label")],e2.prototype,"handleLabelChange",1),eE([eR(["name","src","library"])],e2.prototype,"setIcon",1);/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */let e5={ATTRIBUTE:1,PROPERTY:3,BOOLEAN_ATTRIBUTE:4},e8=e=>(...t)=>({_$litDirective$:e,values:t});class e3{constructor(e){}get _$AU(){return this._$AM._$AU}_$AT(e,t,i){this._$Ct=e,this._$AM=t,this._$Ci=i}_$AS(e,t){return this.update(e,t)}update(e,t){return this.render(...t)}}/**
 * @license
 * Copyright 2018 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */let e6=e8(class extends e3{constructor(e){if(super(e),e.type!==e5.ATTRIBUTE||"class"!==e.name||e.strings?.length>2)throw Error("`classMap()` can only be used in the `class` attribute and must be the only part in the attribute.")}render(e){return" "+Object.keys(e).filter(t=>e[t]).join(" ")+" "}update(e,[t]){if(void 0===this.it){for(let i in this.it=new Set,void 0!==e.strings&&(this.st=new Set(e.strings.join(" ").split(/\s/).filter(e=>""!==e))),t)t[i]&&!this.st?.has(i)&&this.it.add(i);return this.render(t)}let i=e.element.classList;for(let e of this.it)e in t||(i.remove(e),this.it.delete(e));for(let e in t){let s=!!t[e];s===this.it.has(e)||this.st?.has(e)||(s?(i.add(e),this.it.add(e)):(i.remove(e),this.it.delete(e)))}return K}}),e7=e=>e??Y,e4=e8(class extends e3{constructor(e){if(super(e),e.type!==e5.PROPERTY&&e.type!==e5.ATTRIBUTE&&e.type!==e5.BOOLEAN_ATTRIBUTE)throw Error("The `live` directive is not allowed on child or event bindings");if(!eJ(e))throw Error("`live` bindings can only contain a single expression")}render(e){return e}update(e,[t]){if(t===K||t===Y)return t;let i=e.element,s=e.name;if(e.type===e5.PROPERTY){if(t===i[s])return K}else if(e.type===e5.BOOLEAN_ATTRIBUTE){if(!!t===i.hasAttribute(s))return K}else if(e.type===e5.ATTRIBUTE&&i.getAttribute(s)===t+"")return K;return eQ(e),t}});var e9=class extends eK{constructor(){super(...arguments),this.formControlController=new eL(this,{value:e=>e.checked?e.value||"on":void 0,defaultValue:e=>e.defaultChecked,setValue:(e,t)=>e.checked=t}),this.hasFocus=!1,this.title="",this.name="",this.size="medium",this.disabled=!1,this.checked=!1,this.indeterminate=!1,this.defaultChecked=!1,this.form="",this.required=!1}/** Gets the validity state object */get validity(){return this.input.validity}/** Gets the validation message */get validationMessage(){return this.input.validationMessage}firstUpdated(){this.formControlController.updateValidity()}handleClick(){this.checked=!this.checked,this.indeterminate=!1,this.emit("sl-change")}handleBlur(){this.hasFocus=!1,this.emit("sl-blur")}handleInput(){this.emit("sl-input")}handleInvalid(e){this.formControlController.setValidity(!1),this.formControlController.emitInvalidEvent(e)}handleFocus(){this.hasFocus=!0,this.emit("sl-focus")}handleDisabledChange(){this.formControlController.setValidity(this.disabled)}handleStateChange(){this.input.checked=this.checked,this.input.indeterminate=this.indeterminate,this.formControlController.updateValidity()}/** Simulates a click on the checkbox. */click(){this.input.click()}/** Sets focus on the checkbox. */focus(e){this.input.focus(e)}/** Removes focus from the checkbox. */blur(){this.input.blur()}/** Checks for validity but does not show a validation message. Returns `true` when valid and `false` when invalid. */checkValidity(){return this.input.checkValidity()}/** Gets the associated form, if one exists. */getForm(){return this.formControlController.getForm()}/** Checks for validity and shows the browser's validation message if the control is invalid. */reportValidity(){return this.input.reportValidity()}/**
   * Sets a custom validation message. The value provided will be shown to the user when the form is submitted. To clear
   * the custom validation message, call this method with an empty string.
   */setCustomValidity(e){this.input.setCustomValidity(e),this.formControlController.updateValidity()}render(){return W`
      <label
        part="base"
        class=${e6({checkbox:!0,"checkbox--checked":this.checked,"checkbox--disabled":this.disabled,"checkbox--focused":this.hasFocus,"checkbox--indeterminate":this.indeterminate,"checkbox--small":"small"===this.size,"checkbox--medium":"medium"===this.size,"checkbox--large":"large"===this.size})}
      >
        <input
          class="checkbox__input"
          type="checkbox"
          title=${this.title}
          name=${this.name}
          value=${e7(this.value)}
          .indeterminate=${e4(this.indeterminate)}
          .checked=${e4(this.checked)}
          .disabled=${this.disabled}
          .required=${this.required}
          aria-checked=${this.checked?"true":"false"}
          @click=${this.handleClick}
          @input=${this.handleInput}
          @invalid=${this.handleInvalid}
          @blur=${this.handleBlur}
          @focus=${this.handleFocus}
        />

        <span
          part="control${this.checked?" control--checked":""}${this.indeterminate?" control--indeterminate":""}"
          class="checkbox__control"
        >
          ${this.checked?W`
                <sl-icon part="checked-icon" class="checkbox__checked-icon" library="system" name="check"></sl-icon>
              `:""}
          ${!this.checked&&this.indeterminate?W`
                <sl-icon
                  part="indeterminate-icon"
                  class="checkbox__indeterminate-icon"
                  library="system"
                  name="indeterminate"
                ></sl-icon>
              `:""}
        </span>

        <div part="label" class="checkbox__label">
          <slot></slot>
        </div>
      </label>
    `}};e9.styles=eg,e9.dependencies={"sl-icon":e2},eE([eW('input[type="checkbox"]')],e9.prototype,"input",2),eE([ej()],e9.prototype,"hasFocus",2),eE([eD()],e9.prototype,"title",2),eE([eD()],e9.prototype,"name",2),eE([eD()],e9.prototype,"value",2),eE([eD({reflect:!0})],e9.prototype,"size",2),eE([eD({type:Boolean,reflect:!0})],e9.prototype,"disabled",2),eE([eD({type:Boolean,reflect:!0})],e9.prototype,"checked",2),eE([eD({type:Boolean,reflect:!0})],e9.prototype,"indeterminate",2),eE([((e="value")=>(t,i)=>{let s=t.constructor,r=s.prototype.attributeChangedCallback;s.prototype.attributeChangedCallback=function(t,o,n){var l;let a=s.getPropertyOptions(e),h="string"==typeof a.attribute?a.attribute:e;if(t===h){let t=a.converter||w,s="function"==typeof t?t:null!=(l=null==t?void 0:t.fromAttribute)?l:w.fromAttribute,r=s(n,a.type);this[e]!==r&&(this[i]=r)}r.call(this,t,o,n)}})("checked")],e9.prototype,"defaultChecked",2),eE([eD({reflect:!0})],e9.prototype,"form",2),eE([eD({type:Boolean,reflect:!0})],e9.prototype,"required",2),eE([eR("disabled",{waitUntilFirstUpdate:!0})],e9.prototype,"handleDisabledChange",1),eE([eR(["checked","indeterminate"],{waitUntilFirstUpdate:!0})],e9.prototype,"handleStateChange",1);var te=l`
  ${eu}

  :host {
    --track-width: 2px;
    --track-color: rgb(128 128 128 / 25%);
    --indicator-color: var(--sl-color-primary-600);
    --speed: 2s;

    display: inline-flex;
    width: 1em;
    height: 1em;
  }

  .spinner {
    flex: 1 1 auto;
    height: 100%;
    width: 100%;
  }

  .spinner__track,
  .spinner__indicator {
    fill: none;
    stroke-width: var(--track-width);
    r: calc(0.5em - var(--track-width) / 2);
    cx: 0.5em;
    cy: 0.5em;
    transform-origin: 50% 50%;
  }

  .spinner__track {
    stroke: var(--track-color);
    transform-origin: 0% 0%;
  }

  .spinner__indicator {
    stroke: var(--indicator-color);
    stroke-linecap: round;
    stroke-dasharray: 150% 75%;
    animation: spin var(--speed) linear infinite;
  }

  @keyframes spin {
    0% {
      transform: rotate(0deg);
      stroke-dasharray: 0.01em, 2.75em;
    }

    50% {
      transform: rotate(450deg);
      stroke-dasharray: 1.375em, 1.375em;
    }

    100% {
      transform: rotate(1080deg);
      stroke-dasharray: 0.01em, 2.75em;
    }
  }
`;// src/utilities/localize.ts
let tt=new Set,ti=new MutationObserver(tn),ts=new Map,tr=document.documentElement.dir||"ltr",to=document.documentElement.lang||navigator.language;function tn(){tr=document.documentElement.dir||"ltr",to=document.documentElement.lang||navigator.language,[...tt.keys()].map(e=>{"function"==typeof e.requestUpdate&&e.requestUpdate()})}ti.observe(document.documentElement,{attributes:!0,attributeFilter:["dir","lang"]});class tl{constructor(e){this.host=e,this.host.addController(this)}hostConnected(){tt.add(this.host)}hostDisconnected(){tt.delete(this.host)}dir(){return`${this.host.dir||tr}`.toLowerCase()}lang(){return`${this.host.lang||to}`.toLowerCase()}getTranslationData(e){var t,i;let s=new Intl.Locale(e.replace(/_/g,"-")),r=null==s?void 0:s.language.toLowerCase(),o=null!==(i=null===(t=null==s?void 0:s.region)||void 0===t?void 0:t.toLowerCase())&&void 0!==i?i:"",n=ts.get(`${r}-${o}`),l=ts.get(r);return{locale:s,language:r,region:o,primary:n,secondary:l}}exists(t,i){var s;let{primary:r,secondary:o}=this.getTranslationData(null!==(s=i.lang)&&void 0!==s?s:this.lang());return i=Object.assign({includeFallback:!1},i),!!r&&!!r[t]||!!o&&!!o[t]||!!i.includeFallback&&!!e&&!!e[t]}term(t,...i){let s;let{primary:r,secondary:o}=this.getTranslationData(this.lang());if(r&&r[t])s=r[t];else if(o&&o[t])s=o[t];else{if(!e||!e[t])return console.error(`No translation found for: ${String(t)}`),String(t);s=e[t]}return"function"==typeof s?s(...i):s}date(e,t){return e=new Date(e),new Intl.DateTimeFormat(this.lang(),t).format(e)}number(e,t){return isNaN(e=Number(e))?"":new Intl.NumberFormat(this.lang(),t).format(e)}relativeTime(e,t,i){return new Intl.RelativeTimeFormat(this.lang(),i).format(e,t)}}var ta=class extends tl{},th=class extends eK{constructor(){super(...arguments),this.localize=new ta(this)}render(){return W`
      <svg part="base" class="spinner" role="progressbar" aria-label=${this.localize.term("loading")}>
        <circle class="spinner__track"></circle>
        <circle class="spinner__indicator"></circle>
      </svg>
    `}};th.styles=te;// src/utilities/animation-registry.ts
var td=/* @__PURE__ */new Map,tc=/* @__PURE__ */new WeakMap;function tp(e,t){return"rtl"===t.toLowerCase()?{keyframes:e.rtlKeyframes||e.keyframes,options:e.options}:e}function tu(e,t){td.set(e,null!=t?t:{keyframes:[],options:{duration:0}})}function tm(e,t,i){let s=tc.get(e);if(null==s?void 0:s[t])return tp(s[t],i.dir);let r=td.get(t);return r?tp(r,i.dir):{keyframes:[],options:{duration:0}}}// src/internal/animate.ts
function tf(e,t,i){return new Promise(s=>{if((null==i?void 0:i.duration)===1/0)throw Error("Promise-based animations must be finite.");let r=e.animate(t,eC(eA({},i),{duration:!function(){let e=window.matchMedia("(prefers-reduced-motion: reduce)");return e.matches}()?i.duration:0}));r.addEventListener("cancel",s,{once:!0}),r.addEventListener("finish",s,{once:!0})})}function tg(e){return Promise.all(e.getAnimations().map(e=>new Promise(t=>{let i=requestAnimationFrame(t);e.addEventListener("cancel",()=>i,{once:!0}),e.addEventListener("finish",()=>i,{once:!0}),e.cancel()})))}function tv(e,t){return e.map(e=>eC(eA({},e),{height:"auto"===e.height?`${t}px`:e.height}))}var tb=class e extends eK{constructor(){super(...arguments),this.localize=new ta(this),this.indeterminate=!1,this.isLeaf=!1,this.loading=!1,this.selectable=!1,this.expanded=!1,this.selected=!1,this.disabled=!1,this.lazy=!1}static isTreeItem(e){return e instanceof Element&&"treeitem"===e.getAttribute("role")}connectedCallback(){super.connectedCallback(),this.setAttribute("role","treeitem"),this.setAttribute("tabindex","-1"),this.isNestedItem()&&(this.slot="children")}firstUpdated(){this.childrenContainer.hidden=!this.expanded,this.childrenContainer.style.height=this.expanded?"auto":"0",this.isLeaf=!this.lazy&&0===this.getChildrenItems().length,this.handleExpandedChange()}async animateCollapse(){this.emit("sl-collapse"),await tg(this.childrenContainer);let{keyframes:e,options:t}=tm(this,"tree-item.collapse",{dir:this.localize.dir()});await tf(this.childrenContainer,tv(e,this.childrenContainer.scrollHeight),t),this.childrenContainer.hidden=!0,this.emit("sl-after-collapse")}// Checks whether the item is nested into an item
isNestedItem(){let t=this.parentElement;return!!t&&e.isTreeItem(t)}handleChildrenSlotChange(){this.loading=!1,this.isLeaf=!this.lazy&&0===this.getChildrenItems().length}willUpdate(e){e.has("selected")&&!e.has("indeterminate")&&(this.indeterminate=!1)}async animateExpand(){this.emit("sl-expand"),await tg(this.childrenContainer),this.childrenContainer.hidden=!1;let{keyframes:e,options:t}=tm(this,"tree-item.expand",{dir:this.localize.dir()});await tf(this.childrenContainer,tv(e,this.childrenContainer.scrollHeight),t),this.childrenContainer.style.height="auto",this.emit("sl-after-expand")}handleLoadingChange(){this.setAttribute("aria-busy",this.loading?"true":"false"),this.loading||this.animateExpand()}handleDisabledChange(){this.setAttribute("aria-disabled",this.disabled?"true":"false")}handleSelectedChange(){this.setAttribute("aria-selected",this.selected?"true":"false")}handleExpandedChange(){this.isLeaf?this.removeAttribute("aria-expanded"):this.setAttribute("aria-expanded",this.expanded?"true":"false")}handleExpandAnimation(){this.expanded?this.lazy?(this.loading=!0,this.emit("sl-lazy-load")):this.animateExpand():this.animateCollapse()}handleLazyChange(){this.emit("sl-lazy-change")}/** Gets all the nested tree items in this node. */getChildrenItems({includeDisabled:t=!0}={}){return this.childrenSlot?[...this.childrenSlot.assignedElements({flatten:!0})].filter(i=>e.isTreeItem(i)&&(t||!i.disabled)):[]}render(){let e="rtl"===this.localize.dir(),t=!this.loading&&(!this.isLeaf||this.lazy);return W`
      <div
        part="base"
        class="${e6({"tree-item":!0,"tree-item--expanded":this.expanded,"tree-item--selected":this.selected,"tree-item--disabled":this.disabled,"tree-item--leaf":this.isLeaf,"tree-item--has-expand-button":t,"tree-item--rtl":"rtl"===this.localize.dir()})}"
      >
        <div
          class="tree-item__item"
          part="
            item
            ${this.disabled?"item--disabled":""}
            ${this.expanded?"item--expanded":""}
            ${this.indeterminate?"item--indeterminate":""}
            ${this.selected?"item--selected":""}
          "
        >
          <div class="tree-item__indentation" part="indentation"></div>

          <div
            part="expand-button"
            class=${e6({"tree-item__expand-button":!0,"tree-item__expand-button--visible":t})}
            aria-hidden="true"
          >
            ${this.loading?W` <sl-spinner></sl-spinner> `:void 0}
            <slot class="tree-item__expand-icon-slot" name="expand-icon">
              <sl-icon library="system" name=${e?"chevron-left":"chevron-right"}></sl-icon>
            </slot>
            <slot class="tree-item__expand-icon-slot" name="collapse-icon">
              <sl-icon library="system" name=${e?"chevron-left":"chevron-right"}></sl-icon>
            </slot>
          </div>

          ${this.selectable?W`
              <sl-checkbox
                part="checkbox"
                exportparts="
                    base:checkbox__base,
                    control:checkbox__control,
                    control--checked:checkbox__control--checked,
                    control--indeterminate:checkbox__control--indeterminate,
                    checked-icon:checkbox__checked-icon,
                    indeterminate-icon:checkbox__indeterminate-icon,
                    label:checkbox__label
                  "
                class="tree-item__checkbox"
                ?disabled="${this.disabled}"
                ?checked="${e4(this.selected)}"
                ?indeterminate="${this.indeterminate}"
                tabindex="-1"
              ></sl-checkbox>
            `:void 0}

          <slot class="tree-item__label" part="label"></slot>
        </div>

        <div class="tree-item__children" part="children" role="group">
          <slot name="children" @slotchange="${this.handleChildrenSlotChange}"></slot>
        </div>
      </div>
    `}};function ty(e,t=!1){function i(e){let t=e.getChildrenItems({includeDisabled:!1});if(t.length){let i=t.every(e=>e.selected),s=t.every(e=>!e.selected&&!e.indeterminate);e.selected=i,e.indeterminate=!i&&!s}}!function e(s){for(let i of s.getChildrenItems())i.selected=t?s.selected||i.selected:!i.disabled&&s.selected,e(i);t&&i(s)}(e),function e(t){let s=t.parentElement;tb.isTreeItem(s)&&(i(s),e(s))}(e)}tb.styles=ef,tb.dependencies={"sl-checkbox":e9,"sl-icon":e2,"sl-spinner":th},eE([ej()],tb.prototype,"indeterminate",2),eE([ej()],tb.prototype,"isLeaf",2),eE([ej()],tb.prototype,"loading",2),eE([ej()],tb.prototype,"selectable",2),eE([eD({type:Boolean,reflect:!0})],tb.prototype,"expanded",2),eE([eD({type:Boolean,reflect:!0})],tb.prototype,"selected",2),eE([eD({type:Boolean,reflect:!0})],tb.prototype,"disabled",2),eE([eD({type:Boolean,reflect:!0})],tb.prototype,"lazy",2),eE([eW("slot:not([name])")],tb.prototype,"defaultSlot",2),eE([eW("slot[name=children]")],tb.prototype,"childrenSlot",2),eE([eW(".tree-item__item")],tb.prototype,"itemElement",2),eE([eW(".tree-item__children")],tb.prototype,"childrenContainer",2),eE([eW(".tree-item__expand-button slot")],tb.prototype,"expandButtonSlot",2),eE([eR("loading",{waitUntilFirstUpdate:!0})],tb.prototype,"handleLoadingChange",1),eE([eR("disabled")],tb.prototype,"handleDisabledChange",1),eE([eR("selected")],tb.prototype,"handleSelectedChange",1),eE([eR("expanded",{waitUntilFirstUpdate:!0})],tb.prototype,"handleExpandedChange",1),eE([eR("expanded",{waitUntilFirstUpdate:!0})],tb.prototype,"handleExpandAnimation",1),eE([eR("lazy",{waitUntilFirstUpdate:!0})],tb.prototype,"handleLazyChange",1),tu("tree-item.expand",{keyframes:[{height:"0",opacity:"0",overflow:"hidden"},{height:"auto",opacity:"1",overflow:"hidden"}],options:{duration:250,easing:"cubic-bezier(0.4, 0.0, 0.2, 1)"}}),tu("tree-item.collapse",{keyframes:[{height:"auto",opacity:"1",overflow:"hidden"},{height:"0",opacity:"0",overflow:"hidden"}],options:{duration:200,easing:"cubic-bezier(0.4, 0.0, 0.2, 1)"}});var t_=class extends eK{constructor(){super(),this.selection="single",this.localize=new ta(this),this.clickTarget=null,// Initializes new items by setting the `selectable` property and the expanded/collapsed icons if any
this.initTreeItem=e=>{e.selectable="multiple"===this.selection,["expand","collapse"].filter(e=>!!this.querySelector(`[slot="${e}-icon"]`)).forEach(t=>{let i=e.querySelector(`[slot="${t}-icon"]`);null===i?e.append(this.getExpandButtonIcon(t)):i.hasAttribute("data-default")&&i.replaceWith(this.getExpandButtonIcon(t))})},this.handleTreeChanged=e=>{for(let t of e){let e=[...t.addedNodes].filter(tb.isTreeItem),i=[...t.removedNodes].filter(tb.isTreeItem);e.forEach(this.initTreeItem),this.lastFocusedItem&&i.includes(this.lastFocusedItem)&&(this.lastFocusedItem=null)}},this.handleFocusOut=e=>{let t=e.relatedTarget;t&&this.contains(t)||(this.tabIndex=0)},this.handleFocusIn=e=>{let t=e.target;e.target===this&&this.focusItem(this.lastFocusedItem||this.getAllTreeItems()[0]),tb.isTreeItem(t)&&!t.disabled&&(this.lastFocusedItem&&(this.lastFocusedItem.tabIndex=-1),this.lastFocusedItem=t,this.tabIndex=-1,t.tabIndex=0)},this.addEventListener("focusin",this.handleFocusIn),this.addEventListener("focusout",this.handleFocusOut),this.addEventListener("sl-lazy-change",this.handleSlotChange)}async connectedCallback(){super.connectedCallback(),this.setAttribute("role","tree"),this.setAttribute("tabindex","0"),await this.updateComplete,this.mutationObserver=new MutationObserver(this.handleTreeChanged),this.mutationObserver.observe(this,{childList:!0,subtree:!0})}disconnectedCallback(){super.disconnectedCallback(),this.mutationObserver.disconnect()}// Generates a clone of the expand icon element to use for each tree item
getExpandButtonIcon(e){let t="expand"===e?this.expandedIconSlot:this.collapsedIconSlot,i=t.assignedElements({flatten:!0})[0];if(i){let t=i.cloneNode(!0);return[t,...t.querySelectorAll("[id]")].forEach(e=>e.removeAttribute("id")),t.setAttribute("data-default",""),t.slot=`${e}-icon`,t}return null}selectItem(e){let t=[...this.selectedItems];if("multiple"===this.selection)e.selected=!e.selected,e.lazy&&(e.expanded=!0),ty(e);else if("single"===this.selection||e.isLeaf){let t=this.getAllTreeItems();for(let i of t)i.selected=i===e}else"leaf"===this.selection&&(e.expanded=!e.expanded);let i=this.selectedItems;(t.length!==i.length||i.some(e=>!t.includes(e)))&&Promise.all(i.map(e=>e.updateComplete)).then(()=>{this.emit("sl-selection-change",{detail:{selection:i}})})}getAllTreeItems(){return[...this.querySelectorAll("sl-tree-item")]}focusItem(e){null==e||e.focus()}handleKeyDown(e){if(!["ArrowDown","ArrowUp","ArrowRight","ArrowLeft","Home","End","Enter"," "].includes(e.key)||e.composedPath().some(e=>{var t;return["input","textarea"].includes(null==(t=null==e?void 0:e.tagName)?void 0:t.toLowerCase())}))return;let t=this.getFocusableItems(),i="ltr"===this.localize.dir(),s="rtl"===this.localize.dir();if(t.length>0){e.preventDefault();let r=t.findIndex(e=>e.matches(":focus")),o=t[r],n=e=>{var i,s,r,o;let n=t[i=e,s=0,r=t.length-1,o=i<s?s:i>r?r:i,Object.is(o,-0)?0:o];this.focusItem(n)},l=e=>{o.expanded=e};"ArrowDown"===e.key?n(r+1):"ArrowUp"===e.key?n(r-1):i&&"ArrowRight"===e.key||s&&"ArrowLeft"===e.key?!o||o.disabled||o.expanded||o.isLeaf&&!o.lazy?n(r+1):l(!0):i&&"ArrowLeft"===e.key||s&&"ArrowRight"===e.key?!o||o.disabled||o.isLeaf||!o.expanded?n(r-1):l(!1):"Home"===e.key?n(0):"End"===e.key?n(t.length-1):"Enter"!==e.key&&" "!==e.key||o.disabled||this.selectItem(o)}}handleClick(e){let t=e.target,i=t.closest("sl-tree-item"),s=e.composedPath().some(e=>{var t;return null==(t=null==e?void 0:e.classList)?void 0:t.contains("tree-item__expand-button")});i&&!i.disabled&&t===this.clickTarget&&(s?i.expanded=!i.expanded:this.selectItem(i))}handleMouseDown(e){this.clickTarget=e.target}handleSlotChange(){let e=this.getAllTreeItems();e.forEach(this.initTreeItem)}async handleSelectionChange(){let e="multiple"===this.selection,t=this.getAllTreeItems();for(let i of(this.setAttribute("aria-multiselectable",e?"true":"false"),t))i.selectable=e;e&&(await this.updateComplete,[...this.querySelectorAll(":scope > sl-tree-item")].forEach(e=>ty(e,!0)))}/** @internal Returns the list of tree items that are selected in the tree. */get selectedItems(){let e=this.getAllTreeItems();return e.filter(e=>e.selected)}/** @internal Gets focusable tree items in the tree. */getFocusableItems(){let e=this.getAllTreeItems(),t=/* @__PURE__ */new Set;return e.filter(e=>{var i;if(e.disabled)return!1;let s=null==(i=e.parentElement)?void 0:i.closest("[role=treeitem]");return s&&(!s.expanded||s.loading||t.has(s))&&t.add(e),!t.has(e)})}render(){return W`
      <div
        part="base"
        class="tree"
        @click=${this.handleClick}
        @keydown=${this.handleKeyDown}
        @mousedown=${this.handleMouseDown}
      >
        <slot @slotchange=${this.handleSlotChange}></slot>
        <span hidden aria-hidden="true"><slot name="expand-icon"></slot></span>
        <span hidden aria-hidden="true"><slot name="collapse-icon"></slot></span>
      </div>
    `}};t_.styles=em,eE([eW("slot:not([name])")],t_.prototype,"defaultSlot",2),eE([eW("slot[name=expand-icon]")],t_.prototype,"expandedIconSlot",2),eE([eW("slot[name=collapse-icon]")],t_.prototype,"collapsedIconSlot",2),eE([eD()],t_.prototype,"selection",2),eE([eR("selection")],t_.prototype,"handleSelectionChange",1),t_.define("sl-tree"),function(...t){t.map(t=>{let i=t.$code.toLowerCase();ts.has(i)?ts.set(i,Object.assign(Object.assign({},ts.get(i)),t)):ts.set(i,t),e||(e=t)}),tn()}({$code:"en",$name:"English",$dir:"ltr",carousel:"Carousel",clearEntry:"Clear entry",close:"Close",copied:"Copied",copy:"Copy",currentValue:"Current value",error:"Error",goToSlide:(e,t)=>`Go to slide ${e} of ${t}`,hidePassword:"Hide password",loading:"Loading",nextSlide:"Next slide",numOptionsSelected:e=>0===e?"No options selected":1===e?"1 option selected":`${e} options selected`,previousSlide:"Previous slide",progress:"Progress",remove:"Remove",resize:"Resize",scrollToEnd:"Scroll to end",scrollToStart:"Scroll to start",selectAColorFromTheScreen:"Select a color from the screen",showPassword:"Show password",slideNum:e=>`Slide ${e}`,toggleColorFormat:"Toggle color format"}),tb.define("sl-tree-item");let tw=["sl-tree","sl-tree-item"];function tx(e){e.stopImmediatePropagation()}// Prevent expandable tree items from expanding when their link is clicked.
document.querySelectorAll("sl-tree-item").forEach(e=>{let t=e.firstElementChild;t&&"A"===t.nodeName&&t.addEventListener("click",tx)}),(async()=>{// Prevent a flash of undefined custom elements (FOUCE).
await Promise.allSettled(tw.map(e=>customElements.whenDefined(e))),document.querySelectorAll("sl-tree").forEach(e=>{e.classList.add("ready")})})()})();