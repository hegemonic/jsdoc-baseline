
function $parcel$interopDefault(a) {
  return a && a.__esModule ? a.default : a;
}

      var $parcel$global =
        typeof globalThis !== 'undefined'
          ? globalThis
          : typeof self !== 'undefined'
          ? self
          : typeof window !== 'undefined'
          ? window
          : typeof global !== 'undefined'
          ? global
          : {};
  /*
  Copyright 2025 the Baseline Authors.

  Licensed under the Apache License, Version 2.0 (the "License");
  you may not use this file except in compliance with the License.
  You may obtain a copy of the License at

      https://www.apache.org/licenses/LICENSE-2.0

  Unless required by applicable law or agreed to in writing, software
  distributed under the License is distributed on an "AS IS" BASIS,
  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  See the License for the specific language governing permissions and
  limitations under the License.
*/ /*
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
*/ const $da28390c43b55515$export$72ea7305df66deef = {
    keyframes: [
        {
            scale: 'var(--jsdoc-copy-icon-scale)',
            strokeWidth: 'var(--jsdoc-copy-icon-stroke-width)'
        },
        {
            scale: 'calc(var(--jsdoc-copy-icon-scale) * 1.05)',
            strokeWidth: 'calc(var(--jsdoc-copy-icon-stroke-width) * 1.025)',
            color: 'oklch(from var(--jsdoc-copy-icon-color-hover) calc(l * 1.05) c h)',
            filter: 'drop-shadow(0 0 0.0625rem oklch(from var(--jsdoc-copy-icon-color-hover) calc(l * 1.05) c h))',
            offset: 0.3
        },
        {
            scale: 'calc(var(--jsdoc-copy-icon-scale) * 1.1)',
            strokeWidth: 'calc(var(--jsdoc-copy-icon-stroke-width) * 1.05)',
            color: 'oklch(from var(--jsdoc-copy-icon-color-hover) calc(l * 1.1) c h)',
            filter: 'drop-shadow(0 0 0.125rem oklch(from var(--jsdoc-copy-icon-color-hover) calc(l * 1.1) c h))',
            offset: 0.6
        },
        {
            scale: 'calc(var(--jsdoc-copy-icon-scale) * 1.05)',
            strokeWidth: 'calc(var(--jsdoc-copy-icon-stroke-width) * 1.025)',
            color: 'oklch(from var(--jsdoc-copy-icon-color-hover) calc(l * 1.05) c h)',
            filter: 'drop-shadow(0 0 0.0625rem oklch(from var(--jsdoc-copy-icon-color-hover) calc(l * 1.05) c h))',
            offset: 0.9
        },
        {
            scale: 'var(--jsdoc-copy-icon-scale)',
            strokeWidth: 'var(--jsdoc-copy-icon-stroke-width)',
            color: 'var(--jsdoc-copy-icon-color)'
        }
    ],
    options: {
        duration: 800,
        easing: 'ease-in-out'
    }
};
const $da28390c43b55515$export$3e41007ebfff0e64 = {
    keyframes: [
        {
            scale: 1,
            opacity: 1
        },
        {
            scale: 3,
            opacity: 0.25,
            offset: 0.2
        },
        {
            scale: 5,
            opacity: 0.0625,
            offset: 0.4
        },
        {
            scale: 10,
            opacity: 0
        }
    ],
    options: {
        duration: 300,
        easing: 'ease-in-out'
    }
};


/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */ const $987a32d81eef3330$var$t = globalThis, $987a32d81eef3330$export$b4d10f6001c083c2 = $987a32d81eef3330$var$t.ShadowRoot && (void 0 === $987a32d81eef3330$var$t.ShadyCSS || $987a32d81eef3330$var$t.ShadyCSS.nativeShadow) && "adoptedStyleSheets" in Document.prototype && "replace" in CSSStyleSheet.prototype, $987a32d81eef3330$var$s = Symbol(), $987a32d81eef3330$var$o = new WeakMap;
class $987a32d81eef3330$export$505d1e8739bad805 {
    constructor(t, e, o){
        if (this._$cssResult$ = !0, o !== $987a32d81eef3330$var$s) throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");
        this.cssText = t, this.t = e;
    }
    get styleSheet() {
        let t = this.o;
        const s = this.t;
        if ($987a32d81eef3330$export$b4d10f6001c083c2 && void 0 === t) {
            const e = void 0 !== s && 1 === s.length;
            e && (t = $987a32d81eef3330$var$o.get(s)), void 0 === t && ((this.o = t = new CSSStyleSheet).replaceSync(this.cssText), e && $987a32d81eef3330$var$o.set(s, t));
        }
        return t;
    }
    toString() {
        return this.cssText;
    }
}
const $987a32d81eef3330$export$8d80f9cac07cdb3 = (t)=>new $987a32d81eef3330$export$505d1e8739bad805("string" == typeof t ? t : t + "", void 0, $987a32d81eef3330$var$s), $987a32d81eef3330$export$dbf350e5966cf602 = (t, ...e)=>{
    const o = 1 === t.length ? t[0] : e.reduce((e, s, o)=>e + ((t)=>{
            if (!0 === t._$cssResult$) return t.cssText;
            if ("number" == typeof t) return t;
            throw Error("Value passed to 'css' function must be a 'css' function result: " + t + ". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.");
        })(s) + t[o + 1], t[0]);
    return new $987a32d81eef3330$export$505d1e8739bad805(o, t, $987a32d81eef3330$var$s);
}, $987a32d81eef3330$export$2ca4a66ec4cecb90 = (s, o)=>{
    if ($987a32d81eef3330$export$b4d10f6001c083c2) s.adoptedStyleSheets = o.map((t)=>t instanceof CSSStyleSheet ? t : t.styleSheet);
    else for (const e of o){
        const o = document.createElement("style"), n = $987a32d81eef3330$var$t.litNonce;
        void 0 !== n && o.setAttribute("nonce", n), o.textContent = e.cssText, s.appendChild(o);
    }
}, $987a32d81eef3330$export$ee69dfd951e24778 = $987a32d81eef3330$export$b4d10f6001c083c2 ? (t)=>t : (t)=>t instanceof CSSStyleSheet ? ((t)=>{
        let e = "";
        for (const s of t.cssRules)e += s.cssText;
        return $987a32d81eef3330$export$8d80f9cac07cdb3(e);
    })(t) : t;


/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */ const { is: $21fc252cec898daf$var$i, defineProperty: $21fc252cec898daf$var$e, getOwnPropertyDescriptor: $21fc252cec898daf$var$h, getOwnPropertyNames: $21fc252cec898daf$var$r, getOwnPropertySymbols: $21fc252cec898daf$var$o, getPrototypeOf: $21fc252cec898daf$var$n } = Object, $21fc252cec898daf$var$a = globalThis, $21fc252cec898daf$var$c = $21fc252cec898daf$var$a.trustedTypes, $21fc252cec898daf$var$l = $21fc252cec898daf$var$c ? $21fc252cec898daf$var$c.emptyScript : "", $21fc252cec898daf$var$p = $21fc252cec898daf$var$a.reactiveElementPolyfillSupport, $21fc252cec898daf$var$d = (t, s)=>t, $21fc252cec898daf$export$7312b35fbf521afb = {
    toAttribute (t, s) {
        switch(s){
            case Boolean:
                t = t ? $21fc252cec898daf$var$l : null;
                break;
            case Object:
            case Array:
                t = null == t ? t : JSON.stringify(t);
        }
        return t;
    },
    fromAttribute (t, s) {
        let i = t;
        switch(s){
            case Boolean:
                i = null !== t;
                break;
            case Number:
                i = null === t ? null : Number(t);
                break;
            case Object:
            case Array:
                try {
                    i = JSON.parse(t);
                } catch (t) {
                    i = null;
                }
        }
        return i;
    }
}, $21fc252cec898daf$export$53a6892c50694894 = (t, s)=>!$21fc252cec898daf$var$i(t, s), $21fc252cec898daf$var$b = {
    attribute: !0,
    type: String,
    converter: $21fc252cec898daf$export$7312b35fbf521afb,
    reflect: !1,
    useDefault: !1,
    hasChanged: $21fc252cec898daf$export$53a6892c50694894
};
Symbol.metadata ??= Symbol("metadata"), $21fc252cec898daf$var$a.litPropertyMetadata ??= new WeakMap;
class $21fc252cec898daf$export$c7c07a37856565d extends HTMLElement {
    static addInitializer(t) {
        this._$Ei(), (this.l ??= []).push(t);
    }
    static get observedAttributes() {
        return this.finalize(), this._$Eh && [
            ...this._$Eh.keys()
        ];
    }
    static createProperty(t, s = $21fc252cec898daf$var$b) {
        if (s.state && (s.attribute = !1), this._$Ei(), this.prototype.hasOwnProperty(t) && ((s = Object.create(s)).wrapped = !0), this.elementProperties.set(t, s), !s.noAccessor) {
            const i = Symbol(), h = this.getPropertyDescriptor(t, i, s);
            void 0 !== h && $21fc252cec898daf$var$e(this.prototype, t, h);
        }
    }
    static getPropertyDescriptor(t, s, i) {
        const { get: e, set: r } = $21fc252cec898daf$var$h(this.prototype, t) ?? {
            get () {
                return this[s];
            },
            set (t) {
                this[s] = t;
            }
        };
        return {
            get: e,
            set (s) {
                const h = e?.call(this);
                r?.call(this, s), this.requestUpdate(t, h, i);
            },
            configurable: !0,
            enumerable: !0
        };
    }
    static getPropertyOptions(t) {
        return this.elementProperties.get(t) ?? $21fc252cec898daf$var$b;
    }
    static _$Ei() {
        if (this.hasOwnProperty($21fc252cec898daf$var$d("elementProperties"))) return;
        const t = $21fc252cec898daf$var$n(this);
        t.finalize(), void 0 !== t.l && (this.l = [
            ...t.l
        ]), this.elementProperties = new Map(t.elementProperties);
    }
    static finalize() {
        if (this.hasOwnProperty($21fc252cec898daf$var$d("finalized"))) return;
        if (this.finalized = !0, this._$Ei(), this.hasOwnProperty($21fc252cec898daf$var$d("properties"))) {
            const t = this.properties, s = [
                ...$21fc252cec898daf$var$r(t),
                ...$21fc252cec898daf$var$o(t)
            ];
            for (const i of s)this.createProperty(i, t[i]);
        }
        const t = this[Symbol.metadata];
        if (null !== t) {
            const s = litPropertyMetadata.get(t);
            if (void 0 !== s) for (const [t, i] of s)this.elementProperties.set(t, i);
        }
        this._$Eh = new Map;
        for (const [t, s] of this.elementProperties){
            const i = this._$Eu(t, s);
            void 0 !== i && this._$Eh.set(i, t);
        }
        this.elementStyles = this.finalizeStyles(this.styles);
    }
    static finalizeStyles(s) {
        const i = [];
        if (Array.isArray(s)) {
            const e = new Set(s.flat(1 / 0).reverse());
            for (const s of e)i.unshift((0, $987a32d81eef3330$export$ee69dfd951e24778)(s));
        } else void 0 !== s && i.push((0, $987a32d81eef3330$export$ee69dfd951e24778)(s));
        return i;
    }
    static _$Eu(t, s) {
        const i = s.attribute;
        return !1 === i ? void 0 : "string" == typeof i ? i : "string" == typeof t ? t.toLowerCase() : void 0;
    }
    constructor(){
        super(), this._$Ep = void 0, this.isUpdatePending = !1, this.hasUpdated = !1, this._$Em = null, this._$Ev();
    }
    _$Ev() {
        this._$ES = new Promise((t)=>this.enableUpdating = t), this._$AL = new Map, this._$E_(), this.requestUpdate(), this.constructor.l?.forEach((t)=>t(this));
    }
    addController(t) {
        (this._$EO ??= new Set).add(t), void 0 !== this.renderRoot && this.isConnected && t.hostConnected?.();
    }
    removeController(t) {
        this._$EO?.delete(t);
    }
    _$E_() {
        const t = new Map, s = this.constructor.elementProperties;
        for (const i of s.keys())this.hasOwnProperty(i) && (t.set(i, this[i]), delete this[i]);
        t.size > 0 && (this._$Ep = t);
    }
    createRenderRoot() {
        const t = this.shadowRoot ?? this.attachShadow(this.constructor.shadowRootOptions);
        return (0, $987a32d81eef3330$export$2ca4a66ec4cecb90)(t, this.constructor.elementStyles), t;
    }
    connectedCallback() {
        this.renderRoot ??= this.createRenderRoot(), this.enableUpdating(!0), this._$EO?.forEach((t)=>t.hostConnected?.());
    }
    enableUpdating(t) {}
    disconnectedCallback() {
        this._$EO?.forEach((t)=>t.hostDisconnected?.());
    }
    attributeChangedCallback(t, s, i) {
        this._$AK(t, i);
    }
    _$ET(t, s) {
        const i = this.constructor.elementProperties.get(t), e = this.constructor._$Eu(t, i);
        if (void 0 !== e && !0 === i.reflect) {
            const h = (void 0 !== i.converter?.toAttribute ? i.converter : $21fc252cec898daf$export$7312b35fbf521afb).toAttribute(s, i.type);
            this._$Em = t, null == h ? this.removeAttribute(e) : this.setAttribute(e, h), this._$Em = null;
        }
    }
    _$AK(t, s) {
        const i = this.constructor, e = i._$Eh.get(t);
        if (void 0 !== e && this._$Em !== e) {
            const t = i.getPropertyOptions(e), h = "function" == typeof t.converter ? {
                fromAttribute: t.converter
            } : void 0 !== t.converter?.fromAttribute ? t.converter : $21fc252cec898daf$export$7312b35fbf521afb;
            this._$Em = e;
            const r = h.fromAttribute(s, t.type);
            this[e] = r ?? this._$Ej?.get(e) ?? r, this._$Em = null;
        }
    }
    requestUpdate(t, s, i, e = !1, h) {
        if (void 0 !== t) {
            const r = this.constructor;
            if (!1 === e && (h = this[t]), i ??= r.getPropertyOptions(t), !((i.hasChanged ?? $21fc252cec898daf$export$53a6892c50694894)(h, s) || i.useDefault && i.reflect && h === this._$Ej?.get(t) && !this.hasAttribute(r._$Eu(t, i)))) return;
            this.C(t, s, i);
        }
        !1 === this.isUpdatePending && (this._$ES = this._$EP());
    }
    C(t, s, { useDefault: i, reflect: e, wrapped: h }, r) {
        i && !(this._$Ej ??= new Map).has(t) && (this._$Ej.set(t, r ?? s ?? this[t]), !0 !== h || void 0 !== r) || (this._$AL.has(t) || (this.hasUpdated || i || (s = void 0), this._$AL.set(t, s)), !0 === e && this._$Em !== t && (this._$Eq ??= new Set).add(t));
    }
    async _$EP() {
        this.isUpdatePending = !0;
        try {
            await this._$ES;
        } catch (t) {
            Promise.reject(t);
        }
        const t = this.scheduleUpdate();
        return null != t && await t, !this.isUpdatePending;
    }
    scheduleUpdate() {
        return this.performUpdate();
    }
    performUpdate() {
        if (!this.isUpdatePending) return;
        if (!this.hasUpdated) {
            if (this.renderRoot ??= this.createRenderRoot(), this._$Ep) {
                for (const [t, s] of this._$Ep)this[t] = s;
                this._$Ep = void 0;
            }
            const t = this.constructor.elementProperties;
            if (t.size > 0) for (const [s, i] of t){
                const { wrapped: t } = i, e = this[s];
                !0 !== t || this._$AL.has(s) || void 0 === e || this.C(s, void 0, i, e);
            }
        }
        let t = !1;
        const s = this._$AL;
        try {
            t = this.shouldUpdate(s), t ? (this.willUpdate(s), this._$EO?.forEach((t)=>t.hostUpdate?.()), this.update(s)) : this._$EM();
        } catch (s) {
            throw t = !1, this._$EM(), s;
        }
        t && this._$AE(s);
    }
    willUpdate(t) {}
    _$AE(t) {
        this._$EO?.forEach((t)=>t.hostUpdated?.()), this.hasUpdated || (this.hasUpdated = !0, this.firstUpdated(t)), this.updated(t);
    }
    _$EM() {
        this._$AL = new Map, this.isUpdatePending = !1;
    }
    get updateComplete() {
        return this.getUpdateComplete();
    }
    getUpdateComplete() {
        return this._$ES;
    }
    shouldUpdate(t) {
        return !0;
    }
    update(t) {
        this._$Eq &&= this._$Eq.forEach((t)=>this._$ET(t, this[t])), this._$EM();
    }
    updated(t) {}
    firstUpdated(t) {}
}
$21fc252cec898daf$export$c7c07a37856565d.elementStyles = [], $21fc252cec898daf$export$c7c07a37856565d.shadowRootOptions = {
    mode: "open"
}, $21fc252cec898daf$export$c7c07a37856565d[$21fc252cec898daf$var$d("elementProperties")] = new Map, $21fc252cec898daf$export$c7c07a37856565d[$21fc252cec898daf$var$d("finalized")] = new Map, $21fc252cec898daf$var$p?.({
    ReactiveElement: $21fc252cec898daf$export$c7c07a37856565d
}), ($21fc252cec898daf$var$a.reactiveElementVersions ??= []).push("2.1.2");


/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */ const $aed1389927a5dd65$var$t = globalThis, $aed1389927a5dd65$var$i = (t)=>t, $aed1389927a5dd65$var$s = $aed1389927a5dd65$var$t.trustedTypes, $aed1389927a5dd65$var$e = $aed1389927a5dd65$var$s ? $aed1389927a5dd65$var$s.createPolicy("lit-html", {
    createHTML: (t)=>t
}) : void 0, $aed1389927a5dd65$var$h = "$lit$", $aed1389927a5dd65$var$o = `lit$${Math.random().toFixed(9).slice(2)}$`, $aed1389927a5dd65$var$n = "?" + $aed1389927a5dd65$var$o, $aed1389927a5dd65$var$r = `<${$aed1389927a5dd65$var$n}>`, $aed1389927a5dd65$var$l = document, $aed1389927a5dd65$var$c = ()=>$aed1389927a5dd65$var$l.createComment(""), $aed1389927a5dd65$var$a = (t)=>null === t || "object" != typeof t && "function" != typeof t, $aed1389927a5dd65$var$u = Array.isArray, $aed1389927a5dd65$var$d = (t)=>$aed1389927a5dd65$var$u(t) || "function" == typeof t?.[Symbol.iterator], $aed1389927a5dd65$var$f = "[ \t\n\f\r]", $aed1389927a5dd65$var$v = /<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g, $aed1389927a5dd65$var$_ = /-->/g, $aed1389927a5dd65$var$m = />/g, $aed1389927a5dd65$var$p = RegExp(`>|${$aed1389927a5dd65$var$f}(?:([^\\s"'>=/]+)(${$aed1389927a5dd65$var$f}*=${$aed1389927a5dd65$var$f}*(?:[^ \t\n\f\r"'\`<>=]|("|')|))|$)`, "g"), $aed1389927a5dd65$var$g = /'/g, $aed1389927a5dd65$var$$ = /"/g, $aed1389927a5dd65$var$y = /^(?:script|style|textarea|title)$/i, $aed1389927a5dd65$var$x = (t)=>(i, ...s)=>({
            _$litType$: t,
            strings: i,
            values: s
        }), $aed1389927a5dd65$export$c0bb0b647f701bb5 = $aed1389927a5dd65$var$x(1), $aed1389927a5dd65$export$7ed1367e7fa1ad68 = $aed1389927a5dd65$var$x(2), $aed1389927a5dd65$export$47d5b44d225be5b4 = $aed1389927a5dd65$var$x(3), $aed1389927a5dd65$export$9c068ae9cc5db4e8 = Symbol.for("lit-noChange"), $aed1389927a5dd65$export$45b790e32b2810ee = Symbol.for("lit-nothing"), $aed1389927a5dd65$var$C = new WeakMap, $aed1389927a5dd65$var$P = $aed1389927a5dd65$var$l.createTreeWalker($aed1389927a5dd65$var$l, 129);
function $aed1389927a5dd65$var$V(t, i) {
    if (!$aed1389927a5dd65$var$u(t) || !t.hasOwnProperty("raw")) throw Error("invalid template strings array");
    return void 0 !== $aed1389927a5dd65$var$e ? $aed1389927a5dd65$var$e.createHTML(i) : i;
}
const $aed1389927a5dd65$var$N = (t, i)=>{
    const s = t.length - 1, e = [];
    let n, l = 2 === i ? "<svg>" : 3 === i ? "<math>" : "", c = $aed1389927a5dd65$var$v;
    for(let i = 0; i < s; i++){
        const s = t[i];
        let a, u, d = -1, f = 0;
        for(; f < s.length && (c.lastIndex = f, u = c.exec(s), null !== u);)f = c.lastIndex, c === $aed1389927a5dd65$var$v ? "!--" === u[1] ? c = $aed1389927a5dd65$var$_ : void 0 !== u[1] ? c = $aed1389927a5dd65$var$m : void 0 !== u[2] ? ($aed1389927a5dd65$var$y.test(u[2]) && (n = RegExp("</" + u[2], "g")), c = $aed1389927a5dd65$var$p) : void 0 !== u[3] && (c = $aed1389927a5dd65$var$p) : c === $aed1389927a5dd65$var$p ? ">" === u[0] ? (c = n ?? $aed1389927a5dd65$var$v, d = -1) : void 0 === u[1] ? d = -2 : (d = c.lastIndex - u[2].length, a = u[1], c = void 0 === u[3] ? $aed1389927a5dd65$var$p : '"' === u[3] ? $aed1389927a5dd65$var$$ : $aed1389927a5dd65$var$g) : c === $aed1389927a5dd65$var$$ || c === $aed1389927a5dd65$var$g ? c = $aed1389927a5dd65$var$p : c === $aed1389927a5dd65$var$_ || c === $aed1389927a5dd65$var$m ? c = $aed1389927a5dd65$var$v : (c = $aed1389927a5dd65$var$p, n = void 0);
        const x = c === $aed1389927a5dd65$var$p && t[i + 1].startsWith("/>") ? " " : "";
        l += c === $aed1389927a5dd65$var$v ? s + $aed1389927a5dd65$var$r : d >= 0 ? (e.push(a), s.slice(0, d) + $aed1389927a5dd65$var$h + s.slice(d) + $aed1389927a5dd65$var$o + x) : s + $aed1389927a5dd65$var$o + (-2 === d ? i : x);
    }
    return [
        $aed1389927a5dd65$var$V(t, l + (t[s] || "<?>") + (2 === i ? "</svg>" : 3 === i ? "</math>" : "")),
        e
    ];
};
class $aed1389927a5dd65$var$S {
    constructor({ strings: t, _$litType$: i }, e){
        let r;
        this.parts = [];
        let l = 0, a = 0;
        const u = t.length - 1, d = this.parts, [f, v] = $aed1389927a5dd65$var$N(t, i);
        if (this.el = $aed1389927a5dd65$var$S.createElement(f, e), $aed1389927a5dd65$var$P.currentNode = this.el.content, 2 === i || 3 === i) {
            const t = this.el.content.firstChild;
            t.replaceWith(...t.childNodes);
        }
        for(; null !== (r = $aed1389927a5dd65$var$P.nextNode()) && d.length < u;){
            if (1 === r.nodeType) {
                if (r.hasAttributes()) for (const t of r.getAttributeNames())if (t.endsWith($aed1389927a5dd65$var$h)) {
                    const i = v[a++], s = r.getAttribute(t).split($aed1389927a5dd65$var$o), e = /([.?@])?(.*)/.exec(i);
                    d.push({
                        type: 1,
                        index: l,
                        name: e[2],
                        strings: s,
                        ctor: "." === e[1] ? $aed1389927a5dd65$var$I : "?" === e[1] ? $aed1389927a5dd65$var$L : "@" === e[1] ? $aed1389927a5dd65$var$z : $aed1389927a5dd65$var$H
                    }), r.removeAttribute(t);
                } else t.startsWith($aed1389927a5dd65$var$o) && (d.push({
                    type: 6,
                    index: l
                }), r.removeAttribute(t));
                if ($aed1389927a5dd65$var$y.test(r.tagName)) {
                    const t = r.textContent.split($aed1389927a5dd65$var$o), i = t.length - 1;
                    if (i > 0) {
                        r.textContent = $aed1389927a5dd65$var$s ? $aed1389927a5dd65$var$s.emptyScript : "";
                        for(let s = 0; s < i; s++)r.append(t[s], $aed1389927a5dd65$var$c()), $aed1389927a5dd65$var$P.nextNode(), d.push({
                            type: 2,
                            index: ++l
                        });
                        r.append(t[i], $aed1389927a5dd65$var$c());
                    }
                }
            } else if (8 === r.nodeType) {
                if (r.data === $aed1389927a5dd65$var$n) d.push({
                    type: 2,
                    index: l
                });
                else {
                    let t = -1;
                    for(; -1 !== (t = r.data.indexOf($aed1389927a5dd65$var$o, t + 1));)d.push({
                        type: 7,
                        index: l
                    }), t += $aed1389927a5dd65$var$o.length - 1;
                }
            }
            l++;
        }
    }
    static createElement(t, i) {
        const s = $aed1389927a5dd65$var$l.createElement("template");
        return s.innerHTML = t, s;
    }
}
function $aed1389927a5dd65$var$M(t, i, s = t, e) {
    if (i === $aed1389927a5dd65$export$9c068ae9cc5db4e8) return i;
    let h = void 0 !== e ? s._$Co?.[e] : s._$Cl;
    const o = $aed1389927a5dd65$var$a(i) ? void 0 : i._$litDirective$;
    return h?.constructor !== o && (h?._$AO?.(!1), void 0 === o ? h = void 0 : (h = new o(t), h._$AT(t, s, e)), void 0 !== e ? (s._$Co ??= [])[e] = h : s._$Cl = h), void 0 !== h && (i = $aed1389927a5dd65$var$M(t, h._$AS(t, i.values), h, e)), i;
}
class $aed1389927a5dd65$var$R {
    constructor(t, i){
        this._$AV = [], this._$AN = void 0, this._$AD = t, this._$AM = i;
    }
    get parentNode() {
        return this._$AM.parentNode;
    }
    get _$AU() {
        return this._$AM._$AU;
    }
    u(t) {
        const { el: { content: i }, parts: s } = this._$AD, e = (t?.creationScope ?? $aed1389927a5dd65$var$l).importNode(i, !0);
        $aed1389927a5dd65$var$P.currentNode = e;
        let h = $aed1389927a5dd65$var$P.nextNode(), o = 0, n = 0, r = s[0];
        for(; void 0 !== r;){
            if (o === r.index) {
                let i;
                2 === r.type ? i = new $aed1389927a5dd65$var$k(h, h.nextSibling, this, t) : 1 === r.type ? i = new r.ctor(h, r.name, r.strings, this, t) : 6 === r.type && (i = new $aed1389927a5dd65$var$Z(h, this, t)), this._$AV.push(i), r = s[++n];
            }
            o !== r?.index && (h = $aed1389927a5dd65$var$P.nextNode(), o++);
        }
        return $aed1389927a5dd65$var$P.currentNode = $aed1389927a5dd65$var$l, e;
    }
    p(t) {
        let i = 0;
        for (const s of this._$AV)void 0 !== s && (void 0 !== s.strings ? (s._$AI(t, s, i), i += s.strings.length - 2) : s._$AI(t[i])), i++;
    }
}
class $aed1389927a5dd65$var$k {
    get _$AU() {
        return this._$AM?._$AU ?? this._$Cv;
    }
    constructor(t, i, s, e){
        this.type = 2, this._$AH = $aed1389927a5dd65$export$45b790e32b2810ee, this._$AN = void 0, this._$AA = t, this._$AB = i, this._$AM = s, this.options = e, this._$Cv = e?.isConnected ?? !0;
    }
    get parentNode() {
        let t = this._$AA.parentNode;
        const i = this._$AM;
        return void 0 !== i && 11 === t?.nodeType && (t = i.parentNode), t;
    }
    get startNode() {
        return this._$AA;
    }
    get endNode() {
        return this._$AB;
    }
    _$AI(t, i = this) {
        t = $aed1389927a5dd65$var$M(this, t, i), $aed1389927a5dd65$var$a(t) ? t === $aed1389927a5dd65$export$45b790e32b2810ee || null == t || "" === t ? (this._$AH !== $aed1389927a5dd65$export$45b790e32b2810ee && this._$AR(), this._$AH = $aed1389927a5dd65$export$45b790e32b2810ee) : t !== this._$AH && t !== $aed1389927a5dd65$export$9c068ae9cc5db4e8 && this._(t) : void 0 !== t._$litType$ ? this.$(t) : void 0 !== t.nodeType ? this.T(t) : $aed1389927a5dd65$var$d(t) ? this.k(t) : this._(t);
    }
    O(t) {
        return this._$AA.parentNode.insertBefore(t, this._$AB);
    }
    T(t) {
        this._$AH !== t && (this._$AR(), this._$AH = this.O(t));
    }
    _(t) {
        this._$AH !== $aed1389927a5dd65$export$45b790e32b2810ee && $aed1389927a5dd65$var$a(this._$AH) ? this._$AA.nextSibling.data = t : this.T($aed1389927a5dd65$var$l.createTextNode(t)), this._$AH = t;
    }
    $(t) {
        const { values: i, _$litType$: s } = t, e = "number" == typeof s ? this._$AC(t) : (void 0 === s.el && (s.el = $aed1389927a5dd65$var$S.createElement($aed1389927a5dd65$var$V(s.h, s.h[0]), this.options)), s);
        if (this._$AH?._$AD === e) this._$AH.p(i);
        else {
            const t = new $aed1389927a5dd65$var$R(e, this), s = t.u(this.options);
            t.p(i), this.T(s), this._$AH = t;
        }
    }
    _$AC(t) {
        let i = $aed1389927a5dd65$var$C.get(t.strings);
        return void 0 === i && $aed1389927a5dd65$var$C.set(t.strings, i = new $aed1389927a5dd65$var$S(t)), i;
    }
    k(t) {
        $aed1389927a5dd65$var$u(this._$AH) || (this._$AH = [], this._$AR());
        const i = this._$AH;
        let s, e = 0;
        for (const h of t)e === i.length ? i.push(s = new $aed1389927a5dd65$var$k(this.O($aed1389927a5dd65$var$c()), this.O($aed1389927a5dd65$var$c()), this, this.options)) : s = i[e], s._$AI(h), e++;
        e < i.length && (this._$AR(s && s._$AB.nextSibling, e), i.length = e);
    }
    _$AR(t = this._$AA.nextSibling, s) {
        for(this._$AP?.(!1, !0, s); t !== this._$AB;){
            const s = $aed1389927a5dd65$var$i(t).nextSibling;
            $aed1389927a5dd65$var$i(t).remove(), t = s;
        }
    }
    setConnected(t) {
        void 0 === this._$AM && (this._$Cv = t, this._$AP?.(t));
    }
}
class $aed1389927a5dd65$var$H {
    get tagName() {
        return this.element.tagName;
    }
    get _$AU() {
        return this._$AM._$AU;
    }
    constructor(t, i, s, e, h){
        this.type = 1, this._$AH = $aed1389927a5dd65$export$45b790e32b2810ee, this._$AN = void 0, this.element = t, this.name = i, this._$AM = e, this.options = h, s.length > 2 || "" !== s[0] || "" !== s[1] ? (this._$AH = Array(s.length - 1).fill(new String), this.strings = s) : this._$AH = $aed1389927a5dd65$export$45b790e32b2810ee;
    }
    _$AI(t, i = this, s, e) {
        const h = this.strings;
        let o = !1;
        if (void 0 === h) t = $aed1389927a5dd65$var$M(this, t, i, 0), o = !$aed1389927a5dd65$var$a(t) || t !== this._$AH && t !== $aed1389927a5dd65$export$9c068ae9cc5db4e8, o && (this._$AH = t);
        else {
            const e = t;
            let n, r;
            for(t = h[0], n = 0; n < h.length - 1; n++)r = $aed1389927a5dd65$var$M(this, e[s + n], i, n), r === $aed1389927a5dd65$export$9c068ae9cc5db4e8 && (r = this._$AH[n]), o ||= !$aed1389927a5dd65$var$a(r) || r !== this._$AH[n], r === $aed1389927a5dd65$export$45b790e32b2810ee ? t = $aed1389927a5dd65$export$45b790e32b2810ee : t !== $aed1389927a5dd65$export$45b790e32b2810ee && (t += (r ?? "") + h[n + 1]), this._$AH[n] = r;
        }
        o && !e && this.j(t);
    }
    j(t) {
        t === $aed1389927a5dd65$export$45b790e32b2810ee ? this.element.removeAttribute(this.name) : this.element.setAttribute(this.name, t ?? "");
    }
}
class $aed1389927a5dd65$var$I extends $aed1389927a5dd65$var$H {
    constructor(){
        super(...arguments), this.type = 3;
    }
    j(t) {
        this.element[this.name] = t === $aed1389927a5dd65$export$45b790e32b2810ee ? void 0 : t;
    }
}
class $aed1389927a5dd65$var$L extends $aed1389927a5dd65$var$H {
    constructor(){
        super(...arguments), this.type = 4;
    }
    j(t) {
        this.element.toggleAttribute(this.name, !!t && t !== $aed1389927a5dd65$export$45b790e32b2810ee);
    }
}
class $aed1389927a5dd65$var$z extends $aed1389927a5dd65$var$H {
    constructor(t, i, s, e, h){
        super(t, i, s, e, h), this.type = 5;
    }
    _$AI(t, i = this) {
        if ((t = $aed1389927a5dd65$var$M(this, t, i, 0) ?? $aed1389927a5dd65$export$45b790e32b2810ee) === $aed1389927a5dd65$export$9c068ae9cc5db4e8) return;
        const s = this._$AH, e = t === $aed1389927a5dd65$export$45b790e32b2810ee && s !== $aed1389927a5dd65$export$45b790e32b2810ee || t.capture !== s.capture || t.once !== s.once || t.passive !== s.passive, h = t !== $aed1389927a5dd65$export$45b790e32b2810ee && (s === $aed1389927a5dd65$export$45b790e32b2810ee || e);
        e && this.element.removeEventListener(this.name, this, s), h && this.element.addEventListener(this.name, this, t), this._$AH = t;
    }
    handleEvent(t) {
        "function" == typeof this._$AH ? this._$AH.call(this.options?.host ?? this.element, t) : this._$AH.handleEvent(t);
    }
}
class $aed1389927a5dd65$var$Z {
    constructor(t, i, s){
        this.element = t, this.type = 6, this._$AN = void 0, this._$AM = i, this.options = s;
    }
    get _$AU() {
        return this._$AM._$AU;
    }
    _$AI(t) {
        $aed1389927a5dd65$var$M(this, t);
    }
}
const $aed1389927a5dd65$export$8613d1ca9052b22e = {
    M: $aed1389927a5dd65$var$h,
    P: $aed1389927a5dd65$var$o,
    A: $aed1389927a5dd65$var$n,
    C: 1,
    L: $aed1389927a5dd65$var$N,
    R: $aed1389927a5dd65$var$R,
    D: $aed1389927a5dd65$var$d,
    V: $aed1389927a5dd65$var$M,
    I: $aed1389927a5dd65$var$k,
    H: $aed1389927a5dd65$var$H,
    N: $aed1389927a5dd65$var$L,
    U: $aed1389927a5dd65$var$z,
    B: $aed1389927a5dd65$var$I,
    F: $aed1389927a5dd65$var$Z
}, $aed1389927a5dd65$var$B = $aed1389927a5dd65$var$t.litHtmlPolyfillSupport;
$aed1389927a5dd65$var$B?.($aed1389927a5dd65$var$S, $aed1389927a5dd65$var$k), ($aed1389927a5dd65$var$t.litHtmlVersions ??= []).push("3.3.2");
const $aed1389927a5dd65$export$b3890eb0ae9dca99 = (t, i, s)=>{
    const e = s?.renderBefore ?? i;
    let h = e._$litPart$;
    if (void 0 === h) {
        const t = s?.renderBefore ?? null;
        e._$litPart$ = h = new $aed1389927a5dd65$var$k(i.insertBefore($aed1389927a5dd65$var$c(), t), t, void 0, s ?? {});
    }
    return h._$AI(t), h;
};




/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */ const $844e354847ecce5a$var$s = globalThis;
class $844e354847ecce5a$export$3f2f9f5909897157 extends (0, $21fc252cec898daf$export$c7c07a37856565d) {
    constructor(){
        super(...arguments), this.renderOptions = {
            host: this
        }, this._$Do = void 0;
    }
    createRenderRoot() {
        const t = super.createRenderRoot();
        return this.renderOptions.renderBefore ??= t.firstChild, t;
    }
    update(t) {
        const r = this.render();
        this.hasUpdated || (this.renderOptions.isConnected = this.isConnected), super.update(t), this._$Do = (0, $aed1389927a5dd65$export$b3890eb0ae9dca99)(r, this.renderRoot, this.renderOptions);
    }
    connectedCallback() {
        super.connectedCallback(), this._$Do?.setConnected(!0);
    }
    disconnectedCallback() {
        super.disconnectedCallback(), this._$Do?.setConnected(!1);
    }
    render() {
        return 0, $aed1389927a5dd65$export$9c068ae9cc5db4e8;
    }
}
$844e354847ecce5a$export$3f2f9f5909897157._$litElement$ = !0, $844e354847ecce5a$export$3f2f9f5909897157["finalized"] = !0, $844e354847ecce5a$var$s.litElementHydrateSupport?.({
    LitElement: $844e354847ecce5a$export$3f2f9f5909897157
});
const $844e354847ecce5a$var$o = $844e354847ecce5a$var$s.litElementPolyfillSupport;
$844e354847ecce5a$var$o?.({
    LitElement: $844e354847ecce5a$export$3f2f9f5909897157
});
const $844e354847ecce5a$export$f5c524615a7708d6 = {
    _$AK: (t, e, r)=>{
        t._$AK(e, r);
    },
    _$AL: (t)=>t._$AL
};
($844e354847ecce5a$var$s.litElementVersions ??= []).push("4.2.2");


/**
 * @license
 * Copyright 2022 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */ const $44a4deadd6bc9fd2$export$6acf61af03e62db = !1;




/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */ const $b777701f54f11b66$export$da64fc29f17f9d0e = (t)=>(e, o)=>{
        void 0 !== o ? o.addInitializer(()=>{
            customElements.define(t, e);
        }) : customElements.define(t, e);
    };





/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */ const $28816b39eccda61d$var$o = {
    attribute: !0,
    type: String,
    converter: (0, $21fc252cec898daf$export$7312b35fbf521afb),
    reflect: !1,
    hasChanged: (0, $21fc252cec898daf$export$53a6892c50694894)
}, $28816b39eccda61d$export$8d623b1670eb40f4 = (t = $28816b39eccda61d$var$o, e, r)=>{
    const { kind: n, metadata: i } = r;
    let s = globalThis.litPropertyMetadata.get(i);
    if (void 0 === s && globalThis.litPropertyMetadata.set(i, s = new Map), "setter" === n && ((t = Object.create(t)).wrapped = !0), s.set(r.name, t), "accessor" === n) {
        const { name: o } = r;
        return {
            set (r) {
                const n = e.get.call(this);
                e.set.call(this, r), this.requestUpdate(o, n, t, !0, r);
            },
            init (e) {
                return void 0 !== e && this.C(o, void 0, t, e), e;
            }
        };
    }
    if ("setter" === n) {
        const { name: o } = r;
        return function(r) {
            const n = this[o];
            e.call(this, r), this.requestUpdate(o, n, t, !0, r);
        };
    }
    throw Error("Unsupported decorator location: " + n);
};
function $28816b39eccda61d$export$d541bacb2bda4494(t) {
    return (e, o)=>"object" == typeof o ? $28816b39eccda61d$export$8d623b1670eb40f4(t, e, o) : ((t, e, o)=>{
            const r = e.hasOwnProperty(o);
            return e.constructor.createProperty(o, t), r ? Object.getOwnPropertyDescriptor(e, o) : void 0;
        })(t, e, o);
}




/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */ const $f52fe82312bb67cf$export$51987bb50e1f6752 = (e, t, c)=>(c.configurable = !0, c.enumerable = !0, Reflect.decorate && "object" != typeof t && Object.defineProperty(e, t, c), c);


/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */ function $c0447c72baf98ff7$export$2fa187e846a241c4(e, r) {
    return (n, s, i)=>{
        const o = (t)=>t.renderRoot?.querySelector(e) ?? null;
        if (r) {
            const { get: e, set: r } = "object" == typeof s ? n : i ?? (()=>{
                const t = Symbol();
                return {
                    get () {
                        return this[t];
                    },
                    set (e) {
                        this[t] = e;
                    }
                };
            })();
            return (0, $f52fe82312bb67cf$export$51987bb50e1f6752)(n, s, {
                get () {
                    let t = e.call(this);
                    return void 0 === t && (t = o(this), (null !== t || this.hasUpdated) && r.call(this, t)), t;
                }
            });
        }
        return (0, $f52fe82312bb67cf$export$51987bb50e1f6752)(n, s, {
            get () {
                return o(this);
            }
        });
    };
}





/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */ function $a73bb3d3a9a88bf1$export$ca000e230c0caa3e(r) {
    return (0, $28816b39eccda61d$export$d541bacb2bda4494)({
        ...r,
        state: !0,
        attribute: !1
    });
}





/*
  Copyright 2025 the Baseline Authors.

  Licensed under the Apache License, Version 2.0 (the "License");
  you may not use this file except in compliance with the License.
  You may obtain a copy of the License at

      https://www.apache.org/licenses/LICENSE-2.0

  Unless required by applicable law or agreed to in writing, software
  distributed under the License is distributed on an "AS IS" BASIS,
  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  See the License for the specific language governing permissions and
  limitations under the License.
*/ /**
 * @license lucide v0.562.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ const $e807d328a3d44e80$export$2e2bcd8739ae039 = [
    [
        "path",
        {
            d: "m9 18 6-6-6-6"
        }
    ]
];

/**
 * @license lucide v0.562.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ /**
 * @license lucide v0.562.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ /**
 * @license lucide v0.562.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ /**
 * @license lucide v0.562.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ const $9fd7f3668e58dc0e$export$2e2bcd8739ae039 = {
    xmlns: "http://www.w3.org/2000/svg",
    width: 24,
    height: 24,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    "stroke-width": 2,
    "stroke-linecap": "round",
    "stroke-linejoin": "round"
};


const $9cbb910ae460111f$var$createSVGElement = ([tag, attrs, children])=>{
    const element = document.createElementNS("http://www.w3.org/2000/svg", tag);
    Object.keys(attrs).forEach((name)=>{
        element.setAttribute(name, String(attrs[name]));
    });
    if (children?.length) children.forEach((child)=>{
        const childElement = $9cbb910ae460111f$var$createSVGElement(child);
        element.appendChild(childElement);
    });
    return element;
};
const $9cbb910ae460111f$export$2e2bcd8739ae039 = (iconNode, customAttrs = {})=>{
    const tag = "svg";
    const attrs = {
        ...(0, $9fd7f3668e58dc0e$export$2e2bcd8739ae039),
        ...customAttrs
    };
    return $9cbb910ae460111f$var$createSVGElement([
        tag,
        attrs,
        iconNode
    ]);
};



const $eff8661d6f26b32f$export$10924a90f5ba4e1c = (element)=>Array.from(element.attributes).reduce((attrs, attr)=>{
        attrs[attr.name] = attr.value;
        return attrs;
    }, {});
const $eff8661d6f26b32f$export$18505e447a7bb2d5 = (attrs)=>{
    if (typeof attrs === "string") return attrs;
    if (!attrs || !attrs.class) return "";
    if (attrs.class && typeof attrs.class === "string") return attrs.class.split(" ");
    if (attrs.class && Array.isArray(attrs.class)) return attrs.class;
    return "";
};
const $eff8661d6f26b32f$export$189053d41e721fcb = (arrayOfClassnames)=>{
    const classNameArray = arrayOfClassnames.flatMap($eff8661d6f26b32f$export$18505e447a7bb2d5);
    return classNameArray.map((classItem)=>classItem.trim()).filter(Boolean).filter((value, index, self)=>self.indexOf(value) === index).join(" ");
};
const $eff8661d6f26b32f$var$toPascalCase = (string)=>string.replace(/(\w)(\w*)(_|-|\s*)/g, (g0, g1, g2)=>g1.toUpperCase() + g2.toLowerCase());
const $eff8661d6f26b32f$export$2e2bcd8739ae039 = (element, { nameAttr: nameAttr, icons: icons, attrs: attrs })=>{
    const iconName = element.getAttribute(nameAttr);
    if (iconName == null) return;
    const ComponentName = $eff8661d6f26b32f$var$toPascalCase(iconName);
    const iconNode = icons[ComponentName];
    if (!iconNode) return console.warn(`${element.outerHTML} icon name was not found in the provided icons object.`);
    const elementAttrs = $eff8661d6f26b32f$export$10924a90f5ba4e1c(element);
    const iconAttrs = {
        ...(0, $9fd7f3668e58dc0e$export$2e2bcd8739ae039),
        "data-lucide": iconName,
        ...attrs,
        ...elementAttrs
    };
    const classNames = $eff8661d6f26b32f$export$189053d41e721fcb([
        "lucide",
        `lucide-${iconName}`,
        elementAttrs,
        attrs
    ]);
    if (classNames) Object.assign(iconAttrs, {
        class: classNames
    });
    const svgElement = (0, $9cbb910ae460111f$export$2e2bcd8739ae039)(iconNode, iconAttrs);
    return element.parentNode?.replaceChild(svgElement, element);
};























































































































































































































































































































































































































































































































































































































































































































































































































































































































/**
 * @license lucide v0.562.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ const $abfce74508c99da4$export$2e2bcd8739ae039 = [
    [
        "path",
        {
            d: "M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"
        }
    ],
    [
        "path",
        {
            d: "M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"
        }
    ]
];




















































































































































































































































































































































































































































































































































































































































































































/**
 * @license lucide v0.562.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ const $bc2c5078acf8d853$export$2e2bcd8739ae039 = [
    [
        "path",
        {
            d: "m18.84 12.25 1.72-1.71h-.02a5.004 5.004 0 0 0-.12-7.07 5.006 5.006 0 0 0-6.95 0l-1.72 1.71"
        }
    ],
    [
        "path",
        {
            d: "m5.17 11.75-1.71 1.71a5.004 5.004 0 0 0 .12 7.07 5.006 5.006 0 0 0 6.95 0l1.71-1.71"
        }
    ],
    [
        "line",
        {
            x1: "8",
            x2: "8",
            y1: "2",
            y2: "5"
        }
    ],
    [
        "line",
        {
            x1: "2",
            x2: "5",
            y1: "8",
            y2: "8"
        }
    ],
    [
        "line",
        {
            x1: "16",
            x2: "16",
            y1: "19",
            y2: "22"
        }
    ],
    [
        "line",
        {
            x1: "19",
            x2: "22",
            y1: "16",
            y2: "16"
        }
    ]
];





























































































const $274fb6dc088d038f$export$f8761611413a374e = ({ icons: icons = {}, nameAttr: nameAttr = "data-lucide", attrs: attrs = {}, root: root = document, inTemplates: inTemplates } = {})=>{
    if (!Object.values(icons).length) throw new Error("Please provide an icons object.\nIf you want to use all the icons you can import it like:\n `import { createIcons, icons } from 'lucide';\nlucide.createIcons({icons});`");
    if (typeof root === "undefined") throw new Error("`createIcons()` only works in a browser environment.");
    const elementsToReplace = Array.from(root.querySelectorAll(`[${nameAttr}]`));
    elementsToReplace.forEach((element)=>(0, $eff8661d6f26b32f$export$2e2bcd8739ae039)(element, {
            nameAttr: nameAttr,
            icons: icons,
            attrs: attrs
        }));
    if (inTemplates) {
        const templates = Array.from(root.querySelectorAll("template"));
        templates.forEach((template)=>$274fb6dc088d038f$export$f8761611413a374e({
                icons: icons,
                nameAttr: nameAttr,
                attrs: attrs,
                root: template.content,
                inTemplates: inTemplates
            }));
    }
    if (nameAttr === "data-lucide") {
        const deprecatedElements = root.querySelectorAll("[icon-name]");
        if (deprecatedElements.length > 0) {
            console.warn("[Lucide] Some icons were found with the now deprecated icon-name attribute. These will still be replaced for backwards compatibility, but will no longer be supported in v1.0 and you should switch to data-lucide");
            Array.from(deprecatedElements).forEach((element)=>(0, $eff8661d6f26b32f$export$2e2bcd8739ae039)(element, {
                    nameAttr: "icon-name",
                    icons: icons,
                    attrs: attrs
                }));
        }
    }
};


const $585b166d7a16149d$export$854f63e0321931b1 = 'data-icon';
const $585b166d7a16149d$export$fde44257752a9f60 = {
    ChevronRight: $e807d328a3d44e80$export$2e2bcd8739ae039,
    Link: $abfce74508c99da4$export$2e2bcd8739ae039,
    Unlink: $bc2c5078acf8d853$export$2e2bcd8739ae039
};
function $585b166d7a16149d$export$274edc73af1ae9c8([slotName, iconName]) {
    const icon = document.createElement('span');
    icon.setAttribute($585b166d7a16149d$export$854f63e0321931b1, iconName);
    icon.setAttribute('slot', slotName);
    return icon;
}
function $585b166d7a16149d$export$daed2daeba655e15(options) {
    (0, $274fb6dc088d038f$export$f8761611413a374e)({
        icons: {
            ChevronRight: $e807d328a3d44e80$export$2e2bcd8739ae039,
            Link: $abfce74508c99da4$export$2e2bcd8739ae039,
            Unlink: $bc2c5078acf8d853$export$2e2bcd8739ae039
        },
        attrs: {
            width: 16,
            height: 16
        },
        nameAttr: $585b166d7a16149d$export$854f63e0321931b1,
        root: options?.root
    });
}


let $03ff221d75489cc9$var$_initProto, $03ff221d75489cc9$var$_initClass, $03ff221d75489cc9$var$_classDecs, $03ff221d75489cc9$var$_copyIconDecs, $03ff221d75489cc9$var$_init_copyIcon, $03ff221d75489cc9$var$_successIconDecs, $03ff221d75489cc9$var$_init_successIcon, $03ff221d75489cc9$var$_fromDecs, $03ff221d75489cc9$var$_init_from, $03ff221d75489cc9$var$_showAnimationDecs, $03ff221d75489cc9$var$_init_showAnimation, $03ff221d75489cc9$var$_showAnimationReducedMotionDecs, $03ff221d75489cc9$var$_init_showAnimationReducedMotion, $03ff221d75489cc9$var$_isCopyingDecs, $03ff221d75489cc9$var$_init_isCopying;
function $03ff221d75489cc9$var$_applyDecs(e, t, r, n, o, a) {
    function i(e, t, r) {
        return function(n, o) {
            return r && r(n), e[t].call(n, o);
        };
    }
    function c(e, t) {
        for(var r = 0; r < e.length; r++)e[r].call(t);
        return t;
    }
    function s(e, t, r, n) {
        if ("function" != typeof e && (n || void 0 !== e)) throw new TypeError(t + " must " + (r || "be") + " a function" + (n ? "" : " or undefined"));
        return e;
    }
    function applyDec(e, t, r, n, o, a, c, u, l, f, p, d, h) {
        function m(e) {
            if (!h(e)) throw new TypeError("Attempted to access private element on non-instance");
        }
        var y, v = t[0], g = t[3], b = !u;
        if (!b) {
            r || Array.isArray(v) || (v = [
                v
            ]);
            var w = {}, S = [], A = 3 === o ? "get" : 4 === o || d ? "set" : "value";
            f ? (p || d ? w = {
                get: $03ff221d75489cc9$var$_setFunctionName(function() {
                    return g(this);
                }, n, "get"),
                set: function(e) {
                    t[4](this, e);
                }
            } : w[A] = g, p || $03ff221d75489cc9$var$_setFunctionName(w[A], n, 2 === o ? "" : A)) : p || (w = Object.getOwnPropertyDescriptor(e, n));
        }
        for(var P = e, j = v.length - 1; j >= 0; j -= r ? 2 : 1){
            var D = v[j], E = r ? v[j - 1] : void 0, I = {}, O = {
                kind: [
                    "field",
                    "accessor",
                    "method",
                    "getter",
                    "setter",
                    "class"
                ][o],
                name: n,
                metadata: a,
                addInitializer: (function(e, t) {
                    if (e.v) throw Error("attempted to call addInitializer after decoration was finished");
                    s(t, "An initializer", "be", !0), c.push(t);
                }).bind(null, I)
            };
            try {
                if (b) (y = s(D.call(E, P, O), "class decorators", "return")) && (P = y);
                else {
                    var k, F;
                    O.static = l, O.private = f, f ? 2 === o ? k = function(e) {
                        return m(e), w.value;
                    } : (o < 4 && (k = i(w, "get", m)), 3 !== o && (F = i(w, "set", m))) : (k = function(e) {
                        return e[n];
                    }, (o < 2 || 4 === o) && (F = function(e, t) {
                        e[n] = t;
                    }));
                    var N = O.access = {
                        has: f ? h.bind() : function(e) {
                            return n in e;
                        }
                    };
                    if (k && (N.get = k), F && (N.set = F), P = D.call(E, d ? {
                        get: w.get,
                        set: w.set
                    } : w[A], O), d) {
                        if ("object" == typeof P && P) (y = s(P.get, "accessor.get")) && (w.get = y), (y = s(P.set, "accessor.set")) && (w.set = y), (y = s(P.init, "accessor.init")) && S.push(y);
                        else if (void 0 !== P) throw new TypeError("accessor decorators must return an object with get, set, or init properties or void 0");
                    } else s(P, (p ? "field" : "method") + " decorators", "return") && (p ? S.push(P) : w[A] = P);
                }
            } finally{
                I.v = !0;
            }
        }
        return (p || d) && u.push(function(e, t) {
            for(var r = S.length - 1; r >= 0; r--)t = S[r].call(e, t);
            return t;
        }), p || b || (f ? d ? u.push(i(w, "get"), i(w, "set")) : u.push(2 === o ? w[A] : i.call.bind(w[A])) : Object.defineProperty(e, n, w)), P;
    }
    function u(e, t) {
        return Object.defineProperty(e, Symbol.metadata || Symbol.for("Symbol.metadata"), {
            configurable: !0,
            enumerable: !0,
            value: t
        });
    }
    if (arguments.length >= 6) var l = a[Symbol.metadata || Symbol.for("Symbol.metadata")];
    var f = Object.create(null == l ? null : l), p = function(e, t, r, n) {
        var o, a, i = [], s = function(t) {
            return $03ff221d75489cc9$var$_checkInRHS(t) === e;
        }, u = new Map();
        function l(e) {
            e && i.push(c.bind(null, e));
        }
        for(var f = 0; f < t.length; f++){
            var p = t[f];
            if (Array.isArray(p)) {
                var d = p[1], h = p[2], m = p.length > 3, y = 16 & d, v = !!(8 & d), g = 0 == (d &= 7), b = h + "/" + v;
                if (!g && !m) {
                    var w = u.get(b);
                    if (!0 === w || 3 === w && 4 !== d || 4 === w && 3 !== d) throw Error("Attempted to decorate a public method/accessor that has the same name as a previously decorated public method/accessor. This is not currently supported by the decorators plugin. Property name was: " + h);
                    u.set(b, !(d > 2) || d);
                }
                applyDec(v ? e : e.prototype, p, y, m ? "#" + h : $03ff221d75489cc9$var$_toPropertyKey(h), d, n, v ? a = a || [] : o = o || [], i, v, m, g, 1 === d, v && m ? s : r);
            }
        }
        return l(o), l(a), i;
    }(e, t, o, f);
    return r.length || u(e, f), {
        e: p,
        get c () {
            var t1 = [];
            return r.length && [
                u(applyDec(e, [
                    r
                ], n, e.name, 5, f, t1), f),
                c.bind(null, t1, e)
            ];
        }
    };
}
function $03ff221d75489cc9$var$_toPropertyKey(t) {
    var i = $03ff221d75489cc9$var$_toPrimitive(t, "string");
    return "symbol" == typeof i ? i : i + "";
}
function $03ff221d75489cc9$var$_toPrimitive(t, r) {
    if ("object" != typeof t || !t) return t;
    var e = t[Symbol.toPrimitive];
    if (void 0 !== e) {
        var i = e.call(t, r || "default");
        if ("object" != typeof i) return i;
        throw new TypeError("@@toPrimitive must return a primitive value.");
    }
    return ("string" === r ? String : Number)(t);
}
function $03ff221d75489cc9$var$_setFunctionName(e, t, n) {
    "symbol" == typeof t && (t = (t = t.description) ? "[" + t + "]" : "");
    try {
        Object.defineProperty(e, "name", {
            configurable: !0,
            value: n ? n + " " + t : t
        });
    } catch (e) {}
    return e;
}
function $03ff221d75489cc9$var$_checkInRHS(e) {
    if (Object(e) !== e) throw TypeError("right-hand side of 'in' should be an object, got " + (null !== e ? typeof e : "null"));
    return e;
}
function $03ff221d75489cc9$var$_identity(t) {
    return t;
}
$03ff221d75489cc9$var$_classDecs = [
    (0, $b777701f54f11b66$export$da64fc29f17f9d0e)('copy-url')
];
let $03ff221d75489cc9$export$f114dce89f1b0f5b;
new class extends $03ff221d75489cc9$var$_identity {
    static [class CopyUrl extends (0, $844e354847ecce5a$export$3f2f9f5909897157) {
        static{
            ({ e: [$03ff221d75489cc9$var$_init_copyIcon, $03ff221d75489cc9$var$_init_successIcon, $03ff221d75489cc9$var$_init_from, $03ff221d75489cc9$var$_init_showAnimation, $03ff221d75489cc9$var$_init_showAnimationReducedMotion, $03ff221d75489cc9$var$_init_isCopying, $03ff221d75489cc9$var$_initProto], c: [$03ff221d75489cc9$export$f114dce89f1b0f5b, $03ff221d75489cc9$var$_initClass] } = $03ff221d75489cc9$var$_applyDecs(this, [
                [
                    $03ff221d75489cc9$var$_copyIconDecs,
                    1,
                    "copyIcon"
                ],
                [
                    $03ff221d75489cc9$var$_successIconDecs,
                    1,
                    "successIcon"
                ],
                [
                    $03ff221d75489cc9$var$_fromDecs,
                    1,
                    "from"
                ],
                [
                    $03ff221d75489cc9$var$_showAnimationDecs,
                    1,
                    "showAnimation"
                ],
                [
                    $03ff221d75489cc9$var$_showAnimationReducedMotionDecs,
                    1,
                    "showAnimationReducedMotion"
                ],
                [
                    $03ff221d75489cc9$var$_isCopyingDecs,
                    1,
                    "isCopying"
                ]
            ], $03ff221d75489cc9$var$_classDecs, 0, void 0, (0, $844e354847ecce5a$export$3f2f9f5909897157)));
        }
        /* eslint-disable no-undef */ #A = ($03ff221d75489cc9$var$_initProto(this), $03ff221d75489cc9$var$_init_copyIcon(this));
        get [($03ff221d75489cc9$var$_copyIconDecs = (0, $c0447c72baf98ff7$export$2fa187e846a241c4)('slot[name="copy-icon"]'), $03ff221d75489cc9$var$_successIconDecs = (0, $c0447c72baf98ff7$export$2fa187e846a241c4)('slot[name="success-icon"]'), $03ff221d75489cc9$var$_fromDecs = (0, $28816b39eccda61d$export$d541bacb2bda4494)(), $03ff221d75489cc9$var$_showAnimationDecs = (0, $28816b39eccda61d$export$d541bacb2bda4494)(), $03ff221d75489cc9$var$_showAnimationReducedMotionDecs = (0, $28816b39eccda61d$export$d541bacb2bda4494)(), $03ff221d75489cc9$var$_isCopyingDecs = (0, $a73bb3d3a9a88bf1$export$ca000e230c0caa3e)(), "copyIcon")]() {
            return this.#A;
        }
        set copyIcon(v) {
            this.#A = v;
        }
        #B = $03ff221d75489cc9$var$_init_successIcon(this);
        get successIcon() {
            return this.#B;
        }
        set successIcon(v) {
            this.#B = v;
        }
        #C = $03ff221d75489cc9$var$_init_from(this, '');
        get from() {
            return this.#C;
        }
        set from(v) {
            this.#C = v;
        }
        #D = $03ff221d75489cc9$var$_init_showAnimation(this, $da28390c43b55515$export$3e41007ebfff0e64);
        get showAnimation() {
            return this.#D;
        }
        set showAnimation(v) {
            this.#D = v;
        }
        #E = $03ff221d75489cc9$var$_init_showAnimationReducedMotion(this, $da28390c43b55515$export$72ea7305df66deef);
        get showAnimationReducedMotion() {
            return this.#E;
        }
        set showAnimationReducedMotion(v) {
            this.#E = v;
        }
        #F = $03ff221d75489cc9$var$_init_isCopying(this, false);
        get isCopying() {
            return this.#F;
        }
        set isCopying(v) {
            this.#F = v;
        }
        async handleCopy() {
            let targetUrl;
            let valueToCopy;
            if (this.isCopying) return;
            this.isCopying = true;
            targetUrl = new URL(window.location.href);
            targetUrl.hash = this.from;
            valueToCopy = targetUrl.href;
            if (valueToCopy) {
                await navigator.clipboard.writeText(valueToCopy);
                await this.animateIcon();
            }
        }
        firstUpdated() {
            super.firstUpdated();
            (0, $585b166d7a16149d$export$daed2daeba655e15)({
                root: this.shadowRoot
            });
        }
        render() {
            return (0, $aed1389927a5dd65$export$c0bb0b647f701bb5)`
      <button class="copy-button__button" part="button" type="button" @click=${this.handleCopy}>
        <slot part="copy-icon" name="copy-icon">
          <span data-icon="link" slot="copy-icon"></span>
        </slot>
        <slot part="success-icon" name="success-icon">
          <span data-icon="link" slot="success-icon"></span>
        </slot>
      </button>
    `;
        }
        async animateIcon() {
            const { matches: prefersReducedMotion } = window.matchMedia('(prefers-reduced-motion: reduce)');
            const animation = prefersReducedMotion ? this.showAnimationReducedMotion : this.showAnimation;
            this.copyIcon.hidden = false;
            await this.successIcon.animate(animation.keyframes, animation.options).finished;
            document.documentElement.style.setProperty('--jsdoc-copy-icon-opacity', 0);
            this.copyIcon.hidden = true;
            this.isCopying = false;
        }
    }];
    styles = [
        (0, $987a32d81eef3330$export$dbf350e5966cf602)`
      :host {
        --jsdoc-copy-icon-scale: 1;
        --jsdoc-copy-icon-stroke-width: 2px;
        display: inline-block;
      }

      .copy-button__button {
        flex: 0 0 auto;
        display: flex;
        align-items: center;
        background-color: transparent;
        border: none;
        color: inherit;
        font-size: inherit;
        margin-inline: var(--jsdoc-spacer-x-small);
        padding: var(--jsdoc-spacer-x-small);
        cursor: pointer;
        transform: translateY(var(--jsdoc-spacer-xxx-small));
        transition: color 0.3s ease-in-out;
      }

      .copy-button__button:focus-visible {
        outline-offset: var(--jsdoc-spacer-xx-small);
        transform: translateY(var(--jsdoc-spacer-xxx-small));
      }

      slot[name='copy-icon'],
      slot[name='success-icon'] {
        position: absolute;
        top: 0;
        right: 0;
      }

      slot[name='copy-icon'] {
        color: var(--jsdoc-copy-icon-color);
        opacity: var(--jsdoc-copy-icon-opacity);
        transition: opacity 0.3s ease-in-out;
      }

      slot[name='copy-icon']:focus,
      :focus slot[name='copy-icon'],
      slot[name='copy-icon']:hover,
      :hover slot[name='copy-icon'] {
        color: var(--jsdoc-copy-icon-color-hover);
        opacity: 1;
      }

      slot[name='copy-icon'][hidden]:focus,
      :focus slot[name='copy-icon'][hidden] {
        color: var(--jsdoc-copy-icon-color);
        opacity: var(--jsdoc-copy-icon-opacity);
      }

      slot[name='success-icon'] {
        color: var(--jsdoc-copy-icon-color);
        opacity: var(--jsdoc-copy-icon-opacity);
        transition: opacity 0.3s ease-in-out;
      }

      slot[name='success-icon']:focus,
      :focus slot[name='success-icon'],
      slot[name='success-icon']:hover,
      :hover slot[name='success-icon'] {
        color: var(--jsdoc-copy-icon-color-hover);
      }

      slot {
        display: inline-flex;
      }
    `
    ];
    constructor(){
        super($03ff221d75489cc9$export$f114dce89f1b0f5b), $03ff221d75489cc9$var$_initClass();
    }
}();


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
*/ const $9ef7097e0768e26b$var$HIDE_UNTIL_READY = [
    'copy-url',
    'wa-details',
    'wa-icon',
    'wa-tree',
    'wa-tree-item'
];
// Prevent a flash of undefined custom elements (FOUCE).
(async ()=>{
    // Only wait for custom elements that appear on the current page.
    const waitForElements = $9ef7097e0768e26b$var$HIDE_UNTIL_READY.filter((el)=>document.querySelector(el));
    await Promise.allSettled(waitForElements.map((el)=>customElements.whenDefined(el)));
    for (const elementName of waitForElements)for (const element of document.querySelectorAll(elementName))element.classList.add('ready');
})();



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
*/ var $aac8451d1a0cf2ad$exports = {};
var $aac8451d1a0cf2ad$var$raf = typeof window !== 'undefined' && 'requestAnimationFrame' in window ? window.requestAnimationFrame : function(func) {
    setTimeout(func, 16);
};
function $aac8451d1a0cf2ad$var$ease(options) {
    var startValue = 'startValue' in options ? options.startValue : 0;
    var endValue = 'endValue' in options ? options.endValue : 1;
    var durationMs = 'durationMs' in options ? options.durationMs : 200;
    var onComplete = options.onComplete || function() {};
    var stepCount = durationMs / 16;
    var valueIncrement = (endValue - startValue) / stepCount;
    var sinValueIncrement = Math.PI / stepCount;
    var currentValue = startValue;
    var currentSinValue = 0;
    function step() {
        currentSinValue += sinValueIncrement;
        currentValue += valueIncrement * Math.pow(Math.sin(currentSinValue), 2) * 2;
        if (currentSinValue < Math.PI) {
            options.onStep(currentValue);
            $aac8451d1a0cf2ad$var$raf(step);
        } else {
            options.onStep(endValue);
            onComplete();
        }
    }
    $aac8451d1a0cf2ad$var$raf(step);
}
$aac8451d1a0cf2ad$exports = $aac8451d1a0cf2ad$var$ease;


const $09f80e6da26c5cb9$var$NAVBAR_SCROLL_MARGIN_VAR = '--navbar-scroll-margin';
function $09f80e6da26c5cb9$export$e83efb98d34fb4ce(target) {
    const bodyStyle = getComputedStyle(document.body);
    let navbarMargin;
    // Use the element-specific margin if one is defined.
    if (target) navbarMargin = getComputedStyle(target).getPropertyValue($09f80e6da26c5cb9$var$NAVBAR_SCROLL_MARGIN_VAR);
    // Fall back on the standard margin if necessary.
    if (!navbarMargin) navbarMargin = bodyStyle.getPropertyValue($09f80e6da26c5cb9$var$NAVBAR_SCROLL_MARGIN_VAR);
    // Convert the margin to px.
    navbarMargin = Number(navbarMargin.replace('rem', '')) * parseFloat(bodyStyle.fontSize);
    // Round margin up to the nearest multiple of 5.
    return Math.ceil(navbarMargin / 5) * 5;
}
// Prevent the top navbar from obscuring the page content.
(()=>{
    const KEY_CODES = {
        PAGE_DOWN: 'PageDown',
        PAGE_UP: 'PageUp',
        SPACE: 'Space'
    };
    function adjustForNavbar(target, px) {
        let scrollMargin = $09f80e6da26c5cb9$export$e83efb98d34fb4ce(target);
        return px - scrollMargin;
    }
    function easeToY(endValue) {
        (0, (/*@__PURE__*/$parcel$interopDefault($aac8451d1a0cf2ad$exports)))({
            durationMs: 200,
            startValue: window.scrollY,
            endValue: endValue,
            onStep: (value)=>window.scroll({
                    behavior: 'instant',
                    top: value
                })
        });
    }
    function handleHashEvent(event, id, historyItem) {
        let target;
        if (!id) return;
        target = document.getElementById(id);
        if (target) {
            event.preventDefault();
            easeToY(adjustForNavbar(target, target.offsetTop));
            window.history.pushState(null, null, historyItem);
        }
    }
    function hashToId(hash) {
        return hash.substring(1);
    }
    // If we're loading a URL with an anchor, scroll appropriately.
    window.addEventListener('load', (event)=>{
        const id = hashToId(document.location.hash);
        handleHashEvent(event, id, document.location.href);
    });
    // If the user clicks on an in-page anchor tag, scroll appropriately.
    window.addEventListener('hashchange', (event)=>{
        const url = new URL(event.newURL);
        const id = hashToId(url.hash);
        handleHashEvent(event, id, url.hash);
    });
    // If the user pages up or down, scroll appropriately.
    document.addEventListener('keydown', (event)=>{
        const code = event.code;
        let scrollBy;
        if (code !== KEY_CODES.SPACE && code !== KEY_CODES.PAGE_DOWN && code !== KEY_CODES.PAGE_UP) return;
        event.preventDefault();
        event.stopImmediatePropagation();
        scrollBy = adjustForNavbar(null, window.innerHeight);
        switch(code){
            case KEY_CODES.PAGE_UP:
                easeToY(window.scrollY - scrollBy);
                break;
            default:
                easeToY(window.scrollY + scrollBy);
                break;
        }
    });
})();







/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */ let $89ae29b91346bfd3$var$e;
function $89ae29b91346bfd3$export$dcd0d083aa86c355(r) {
    return (n, o)=>(0, $f52fe82312bb67cf$export$51987bb50e1f6752)(n, o, {
            get () {
                return (this.renderRoot ?? ($89ae29b91346bfd3$var$e ??= document.createDocumentFragment())).querySelectorAll(r);
            }
        });
}




/**
 * Checks if `value` is the
 * [language type](http://www.ecma-international.org/ecma-262/7.0/#sec-ecmascript-language-types)
 * of `Object`. (e.g. arrays, functions, objects, regexes, `new Number(0)`, and `new String('')`)
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an object, else `false`.
 * @example
 *
 * _.isObject({});
 * // => true
 *
 * _.isObject([1, 2, 3]);
 * // => true
 *
 * _.isObject(_.noop);
 * // => true
 *
 * _.isObject(null);
 * // => false
 */ function $f30106a190df98b2$var$isObject(value) {
    var type = typeof value;
    return value != null && (type == 'object' || type == 'function');
}
var $f30106a190df98b2$export$2e2bcd8739ae039 = $f30106a190df98b2$var$isObject;


/** Detect free variable `global` from Node.js. */ var $05297bd1f1c88fb4$var$freeGlobal = typeof $parcel$global == 'object' && $parcel$global && $parcel$global.Object === Object && $parcel$global;
var $05297bd1f1c88fb4$export$2e2bcd8739ae039 = $05297bd1f1c88fb4$var$freeGlobal;


/** Detect free variable `self`. */ var $83c3a1f64864e1bb$var$freeSelf = typeof self == 'object' && self && self.Object === Object && self;
/** Used as a reference to the global object. */ var $83c3a1f64864e1bb$var$root = (0, $05297bd1f1c88fb4$export$2e2bcd8739ae039) || $83c3a1f64864e1bb$var$freeSelf || Function('return this')();
var $83c3a1f64864e1bb$export$2e2bcd8739ae039 = $83c3a1f64864e1bb$var$root;


/**
 * Gets the timestamp of the number of milliseconds that have elapsed since
 * the Unix epoch (1 January 1970 00:00:00 UTC).
 *
 * @static
 * @memberOf _
 * @since 2.4.0
 * @category Date
 * @returns {number} Returns the timestamp.
 * @example
 *
 * _.defer(function(stamp) {
 *   console.log(_.now() - stamp);
 * }, _.now());
 * // => Logs the number of milliseconds it took for the deferred invocation.
 */ var $1d3203c884ceb569$var$now = function() {
    return (0, $83c3a1f64864e1bb$export$2e2bcd8739ae039).Date.now();
};
var $1d3203c884ceb569$export$2e2bcd8739ae039 = $1d3203c884ceb569$var$now;


/** Used to match a single whitespace character. */ var $a61e3886e2998194$var$reWhitespace = /\s/;
/**
 * Used by `_.trim` and `_.trimEnd` to get the index of the last non-whitespace
 * character of `string`.
 *
 * @private
 * @param {string} string The string to inspect.
 * @returns {number} Returns the index of the last non-whitespace character.
 */ function $a61e3886e2998194$var$trimmedEndIndex(string) {
    var index = string.length;
    while(index-- && $a61e3886e2998194$var$reWhitespace.test(string.charAt(index)));
    return index;
}
var $a61e3886e2998194$export$2e2bcd8739ae039 = $a61e3886e2998194$var$trimmedEndIndex;


/** Used to match leading whitespace. */ var $4fb23168cbca793d$var$reTrimStart = /^\s+/;
/**
 * The base implementation of `_.trim`.
 *
 * @private
 * @param {string} string The string to trim.
 * @returns {string} Returns the trimmed string.
 */ function $4fb23168cbca793d$var$baseTrim(string) {
    return string ? string.slice(0, (0, $a61e3886e2998194$export$2e2bcd8739ae039)(string) + 1).replace($4fb23168cbca793d$var$reTrimStart, '') : string;
}
var $4fb23168cbca793d$export$2e2bcd8739ae039 = $4fb23168cbca793d$var$baseTrim;




/** Built-in value references. */ var $c490021fc7a0a284$var$Symbol = (0, $83c3a1f64864e1bb$export$2e2bcd8739ae039).Symbol;
var $c490021fc7a0a284$export$2e2bcd8739ae039 = $c490021fc7a0a284$var$Symbol;



/** Used for built-in method references. */ var $63bcb379e4fecd22$var$objectProto = Object.prototype;
/** Used to check objects for own properties. */ var $63bcb379e4fecd22$var$hasOwnProperty = $63bcb379e4fecd22$var$objectProto.hasOwnProperty;
/**
 * Used to resolve the
 * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
 * of values.
 */ var $63bcb379e4fecd22$var$nativeObjectToString = $63bcb379e4fecd22$var$objectProto.toString;
/** Built-in value references. */ var $63bcb379e4fecd22$var$symToStringTag = (0, $c490021fc7a0a284$export$2e2bcd8739ae039) ? (0, $c490021fc7a0a284$export$2e2bcd8739ae039).toStringTag : undefined;
/**
 * A specialized version of `baseGetTag` which ignores `Symbol.toStringTag` values.
 *
 * @private
 * @param {*} value The value to query.
 * @returns {string} Returns the raw `toStringTag`.
 */ function $63bcb379e4fecd22$var$getRawTag(value) {
    var isOwn = $63bcb379e4fecd22$var$hasOwnProperty.call(value, $63bcb379e4fecd22$var$symToStringTag), tag = value[$63bcb379e4fecd22$var$symToStringTag];
    try {
        value[$63bcb379e4fecd22$var$symToStringTag] = undefined;
        var unmasked = true;
    } catch (e) {}
    var result = $63bcb379e4fecd22$var$nativeObjectToString.call(value);
    if (unmasked) {
        if (isOwn) value[$63bcb379e4fecd22$var$symToStringTag] = tag;
        else delete value[$63bcb379e4fecd22$var$symToStringTag];
    }
    return result;
}
var $63bcb379e4fecd22$export$2e2bcd8739ae039 = $63bcb379e4fecd22$var$getRawTag;


/** Used for built-in method references. */ var $cac2a23c3da16de7$var$objectProto = Object.prototype;
/**
 * Used to resolve the
 * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
 * of values.
 */ var $cac2a23c3da16de7$var$nativeObjectToString = $cac2a23c3da16de7$var$objectProto.toString;
/**
 * Converts `value` to a string using `Object.prototype.toString`.
 *
 * @private
 * @param {*} value The value to convert.
 * @returns {string} Returns the converted string.
 */ function $cac2a23c3da16de7$var$objectToString(value) {
    return $cac2a23c3da16de7$var$nativeObjectToString.call(value);
}
var $cac2a23c3da16de7$export$2e2bcd8739ae039 = $cac2a23c3da16de7$var$objectToString;


/** `Object#toString` result references. */ var $4d8a4e3ff6c4d651$var$nullTag = '[object Null]', $4d8a4e3ff6c4d651$var$undefinedTag = '[object Undefined]';
/** Built-in value references. */ var $4d8a4e3ff6c4d651$var$symToStringTag = (0, $c490021fc7a0a284$export$2e2bcd8739ae039) ? (0, $c490021fc7a0a284$export$2e2bcd8739ae039).toStringTag : undefined;
/**
 * The base implementation of `getTag` without fallbacks for buggy environments.
 *
 * @private
 * @param {*} value The value to query.
 * @returns {string} Returns the `toStringTag`.
 */ function $4d8a4e3ff6c4d651$var$baseGetTag(value) {
    if (value == null) return value === undefined ? $4d8a4e3ff6c4d651$var$undefinedTag : $4d8a4e3ff6c4d651$var$nullTag;
    return $4d8a4e3ff6c4d651$var$symToStringTag && $4d8a4e3ff6c4d651$var$symToStringTag in Object(value) ? (0, $63bcb379e4fecd22$export$2e2bcd8739ae039)(value) : (0, $cac2a23c3da16de7$export$2e2bcd8739ae039)(value);
}
var $4d8a4e3ff6c4d651$export$2e2bcd8739ae039 = $4d8a4e3ff6c4d651$var$baseGetTag;


/**
 * Checks if `value` is object-like. A value is object-like if it's not `null`
 * and has a `typeof` result of "object".
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is object-like, else `false`.
 * @example
 *
 * _.isObjectLike({});
 * // => true
 *
 * _.isObjectLike([1, 2, 3]);
 * // => true
 *
 * _.isObjectLike(_.noop);
 * // => false
 *
 * _.isObjectLike(null);
 * // => false
 */ function $3823fd9acf1ce9b9$var$isObjectLike(value) {
    return value != null && typeof value == 'object';
}
var $3823fd9acf1ce9b9$export$2e2bcd8739ae039 = $3823fd9acf1ce9b9$var$isObjectLike;


/** `Object#toString` result references. */ var $42fc56017f8f6e7c$var$symbolTag = '[object Symbol]';
/**
 * Checks if `value` is classified as a `Symbol` primitive or object.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a symbol, else `false`.
 * @example
 *
 * _.isSymbol(Symbol.iterator);
 * // => true
 *
 * _.isSymbol('abc');
 * // => false
 */ function $42fc56017f8f6e7c$var$isSymbol(value) {
    return typeof value == 'symbol' || (0, $3823fd9acf1ce9b9$export$2e2bcd8739ae039)(value) && (0, $4d8a4e3ff6c4d651$export$2e2bcd8739ae039)(value) == $42fc56017f8f6e7c$var$symbolTag;
}
var $42fc56017f8f6e7c$export$2e2bcd8739ae039 = $42fc56017f8f6e7c$var$isSymbol;


/** Used as references for various `Number` constants. */ var $54df9c4067ca40c2$var$NAN = 0 / 0;
/** Used to detect bad signed hexadecimal string values. */ var $54df9c4067ca40c2$var$reIsBadHex = /^[-+]0x[0-9a-f]+$/i;
/** Used to detect binary string values. */ var $54df9c4067ca40c2$var$reIsBinary = /^0b[01]+$/i;
/** Used to detect octal string values. */ var $54df9c4067ca40c2$var$reIsOctal = /^0o[0-7]+$/i;
/** Built-in method references without a dependency on `root`. */ var $54df9c4067ca40c2$var$freeParseInt = parseInt;
/**
 * Converts `value` to a number.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to process.
 * @returns {number} Returns the number.
 * @example
 *
 * _.toNumber(3.2);
 * // => 3.2
 *
 * _.toNumber(Number.MIN_VALUE);
 * // => 5e-324
 *
 * _.toNumber(Infinity);
 * // => Infinity
 *
 * _.toNumber('3.2');
 * // => 3.2
 */ function $54df9c4067ca40c2$var$toNumber(value) {
    if (typeof value == 'number') return value;
    if ((0, $42fc56017f8f6e7c$export$2e2bcd8739ae039)(value)) return $54df9c4067ca40c2$var$NAN;
    if ((0, $f30106a190df98b2$export$2e2bcd8739ae039)(value)) {
        var other = typeof value.valueOf == 'function' ? value.valueOf() : value;
        value = (0, $f30106a190df98b2$export$2e2bcd8739ae039)(other) ? other + '' : other;
    }
    if (typeof value != 'string') return value === 0 ? value : +value;
    value = (0, $4fb23168cbca793d$export$2e2bcd8739ae039)(value);
    var isBinary = $54df9c4067ca40c2$var$reIsBinary.test(value);
    return isBinary || $54df9c4067ca40c2$var$reIsOctal.test(value) ? $54df9c4067ca40c2$var$freeParseInt(value.slice(2), isBinary ? 2 : 8) : $54df9c4067ca40c2$var$reIsBadHex.test(value) ? $54df9c4067ca40c2$var$NAN : +value;
}
var $54df9c4067ca40c2$export$2e2bcd8739ae039 = $54df9c4067ca40c2$var$toNumber;


/** Error message constants. */ var $ac3ec49038faf270$var$FUNC_ERROR_TEXT = 'Expected a function';
/* Built-in method references for those with the same name as other `lodash` methods. */ var $ac3ec49038faf270$var$nativeMax = Math.max, $ac3ec49038faf270$var$nativeMin = Math.min;
/**
 * Creates a debounced function that delays invoking `func` until after `wait`
 * milliseconds have elapsed since the last time the debounced function was
 * invoked. The debounced function comes with a `cancel` method to cancel
 * delayed `func` invocations and a `flush` method to immediately invoke them.
 * Provide `options` to indicate whether `func` should be invoked on the
 * leading and/or trailing edge of the `wait` timeout. The `func` is invoked
 * with the last arguments provided to the debounced function. Subsequent
 * calls to the debounced function return the result of the last `func`
 * invocation.
 *
 * **Note:** If `leading` and `trailing` options are `true`, `func` is
 * invoked on the trailing edge of the timeout only if the debounced function
 * is invoked more than once during the `wait` timeout.
 *
 * If `wait` is `0` and `leading` is `false`, `func` invocation is deferred
 * until to the next tick, similar to `setTimeout` with a timeout of `0`.
 *
 * See [David Corbacho's article](https://css-tricks.com/debouncing-throttling-explained-examples/)
 * for details over the differences between `_.debounce` and `_.throttle`.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Function
 * @param {Function} func The function to debounce.
 * @param {number} [wait=0] The number of milliseconds to delay.
 * @param {Object} [options={}] The options object.
 * @param {boolean} [options.leading=false]
 *  Specify invoking on the leading edge of the timeout.
 * @param {number} [options.maxWait]
 *  The maximum time `func` is allowed to be delayed before it's invoked.
 * @param {boolean} [options.trailing=true]
 *  Specify invoking on the trailing edge of the timeout.
 * @returns {Function} Returns the new debounced function.
 * @example
 *
 * // Avoid costly calculations while the window size is in flux.
 * jQuery(window).on('resize', _.debounce(calculateLayout, 150));
 *
 * // Invoke `sendMail` when clicked, debouncing subsequent calls.
 * jQuery(element).on('click', _.debounce(sendMail, 300, {
 *   'leading': true,
 *   'trailing': false
 * }));
 *
 * // Ensure `batchLog` is invoked once after 1 second of debounced calls.
 * var debounced = _.debounce(batchLog, 250, { 'maxWait': 1000 });
 * var source = new EventSource('/stream');
 * jQuery(source).on('message', debounced);
 *
 * // Cancel the trailing debounced invocation.
 * jQuery(window).on('popstate', debounced.cancel);
 */ function $ac3ec49038faf270$var$debounce(func, wait, options) {
    var lastArgs, lastThis, maxWait, result, timerId, lastCallTime, lastInvokeTime = 0, leading = false, maxing = false, trailing = true;
    if (typeof func != 'function') throw new TypeError($ac3ec49038faf270$var$FUNC_ERROR_TEXT);
    wait = (0, $54df9c4067ca40c2$export$2e2bcd8739ae039)(wait) || 0;
    if ((0, $f30106a190df98b2$export$2e2bcd8739ae039)(options)) {
        leading = !!options.leading;
        maxing = 'maxWait' in options;
        maxWait = maxing ? $ac3ec49038faf270$var$nativeMax((0, $54df9c4067ca40c2$export$2e2bcd8739ae039)(options.maxWait) || 0, wait) : maxWait;
        trailing = 'trailing' in options ? !!options.trailing : trailing;
    }
    function invokeFunc(time) {
        var args = lastArgs, thisArg = lastThis;
        lastArgs = lastThis = undefined;
        lastInvokeTime = time;
        result = func.apply(thisArg, args);
        return result;
    }
    function leadingEdge(time) {
        // Reset any `maxWait` timer.
        lastInvokeTime = time;
        // Start the timer for the trailing edge.
        timerId = setTimeout(timerExpired, wait);
        // Invoke the leading edge.
        return leading ? invokeFunc(time) : result;
    }
    function remainingWait(time) {
        var timeSinceLastCall = time - lastCallTime, timeSinceLastInvoke = time - lastInvokeTime, timeWaiting = wait - timeSinceLastCall;
        return maxing ? $ac3ec49038faf270$var$nativeMin(timeWaiting, maxWait - timeSinceLastInvoke) : timeWaiting;
    }
    function shouldInvoke(time) {
        var timeSinceLastCall = time - lastCallTime, timeSinceLastInvoke = time - lastInvokeTime;
        // Either this is the first call, activity has stopped and we're at the
        // trailing edge, the system time has gone backwards and we're treating
        // it as the trailing edge, or we've hit the `maxWait` limit.
        return lastCallTime === undefined || timeSinceLastCall >= wait || timeSinceLastCall < 0 || maxing && timeSinceLastInvoke >= maxWait;
    }
    function timerExpired() {
        var time = (0, $1d3203c884ceb569$export$2e2bcd8739ae039)();
        if (shouldInvoke(time)) return trailingEdge(time);
        // Restart the timer.
        timerId = setTimeout(timerExpired, remainingWait(time));
    }
    function trailingEdge(time) {
        timerId = undefined;
        // Only invoke if we have `lastArgs` which means `func` has been
        // debounced at least once.
        if (trailing && lastArgs) return invokeFunc(time);
        lastArgs = lastThis = undefined;
        return result;
    }
    function cancel() {
        if (timerId !== undefined) clearTimeout(timerId);
        lastInvokeTime = 0;
        lastArgs = lastCallTime = lastThis = timerId = undefined;
    }
    function flush() {
        return timerId === undefined ? result : trailingEdge((0, $1d3203c884ceb569$export$2e2bcd8739ae039)());
    }
    function debounced() {
        var time = (0, $1d3203c884ceb569$export$2e2bcd8739ae039)(), isInvoking = shouldInvoke(time);
        lastArgs = arguments;
        lastThis = this;
        lastCallTime = time;
        if (isInvoking) {
            if (timerId === undefined) return leadingEdge(lastCallTime);
            if (maxing) {
                // Handle invocations in a tight loop.
                clearTimeout(timerId);
                timerId = setTimeout(timerExpired, wait);
                return invokeFunc(lastCallTime);
            }
        }
        if (timerId === undefined) timerId = setTimeout(timerExpired, wait);
        return result;
    }
    debounced.cancel = cancel;
    debounced.flush = flush;
    return debounced;
}
var $ac3ec49038faf270$export$2e2bcd8739ae039 = $ac3ec49038faf270$var$debounce;



/** Error message constants. */ var $3fdb7f6a53d841b7$var$FUNC_ERROR_TEXT = 'Expected a function';
/**
 * Creates a throttled function that only invokes `func` at most once per
 * every `wait` milliseconds. The throttled function comes with a `cancel`
 * method to cancel delayed `func` invocations and a `flush` method to
 * immediately invoke them. Provide `options` to indicate whether `func`
 * should be invoked on the leading and/or trailing edge of the `wait`
 * timeout. The `func` is invoked with the last arguments provided to the
 * throttled function. Subsequent calls to the throttled function return the
 * result of the last `func` invocation.
 *
 * **Note:** If `leading` and `trailing` options are `true`, `func` is
 * invoked on the trailing edge of the timeout only if the throttled function
 * is invoked more than once during the `wait` timeout.
 *
 * If `wait` is `0` and `leading` is `false`, `func` invocation is deferred
 * until to the next tick, similar to `setTimeout` with a timeout of `0`.
 *
 * See [David Corbacho's article](https://css-tricks.com/debouncing-throttling-explained-examples/)
 * for details over the differences between `_.throttle` and `_.debounce`.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Function
 * @param {Function} func The function to throttle.
 * @param {number} [wait=0] The number of milliseconds to throttle invocations to.
 * @param {Object} [options={}] The options object.
 * @param {boolean} [options.leading=true]
 *  Specify invoking on the leading edge of the timeout.
 * @param {boolean} [options.trailing=true]
 *  Specify invoking on the trailing edge of the timeout.
 * @returns {Function} Returns the new throttled function.
 * @example
 *
 * // Avoid excessively updating the position while scrolling.
 * jQuery(window).on('scroll', _.throttle(updatePosition, 100));
 *
 * // Invoke `renewToken` when the click event is fired, but not more than once every 5 minutes.
 * var throttled = _.throttle(renewToken, 300000, { 'trailing': false });
 * jQuery(element).on('click', throttled);
 *
 * // Cancel the trailing throttled invocation.
 * jQuery(window).on('popstate', throttled.cancel);
 */ function $3fdb7f6a53d841b7$var$throttle(func, wait, options) {
    var leading = true, trailing = true;
    if (typeof func != 'function') throw new TypeError($3fdb7f6a53d841b7$var$FUNC_ERROR_TEXT);
    if ((0, $f30106a190df98b2$export$2e2bcd8739ae039)(options)) {
        leading = 'leading' in options ? !!options.leading : leading;
        trailing = 'trailing' in options ? !!options.trailing : trailing;
    }
    return (0, $ac3ec49038faf270$export$2e2bcd8739ae039)(func, wait, {
        'leading': leading,
        'maxWait': wait,
        'trailing': trailing
    });
}
var $3fdb7f6a53d841b7$export$2e2bcd8739ae039 = $3fdb7f6a53d841b7$var$throttle;



let $f3918e16b922d6f5$var$_initProto, $f3918e16b922d6f5$var$_initClass, $f3918e16b922d6f5$var$_classDecs, $f3918e16b922d6f5$var$_contentsDecs, $f3918e16b922d6f5$var$_init_contents, $f3918e16b922d6f5$var$_hideFromNavClassDecs, $f3918e16b922d6f5$var$_init_hideFromNavClass, $f3918e16b922d6f5$var$_levelsDecs, $f3918e16b922d6f5$var$_init_levels, $f3918e16b922d6f5$var$_linksDecs, $f3918e16b922d6f5$var$_init_links, $f3918e16b922d6f5$var$_titleDecs, $f3918e16b922d6f5$var$_init_title, $f3918e16b922d6f5$var$_titleTextDecs, $f3918e16b922d6f5$var$_init_titleText, $f3918e16b922d6f5$var$_treeDecs, $f3918e16b922d6f5$var$_init_tree;
function $f3918e16b922d6f5$var$_applyDecs(e, t, r, n, o, a) {
    function i(e, t, r) {
        return function(n, o) {
            return r && r(n), e[t].call(n, o);
        };
    }
    function c(e, t) {
        for(var r = 0; r < e.length; r++)e[r].call(t);
        return t;
    }
    function s(e, t, r, n) {
        if ("function" != typeof e && (n || void 0 !== e)) throw new TypeError(t + " must " + (r || "be") + " a function" + (n ? "" : " or undefined"));
        return e;
    }
    function applyDec(e, t, r, n, o, a, c, u, l, f, p, d, h) {
        function m(e) {
            if (!h(e)) throw new TypeError("Attempted to access private element on non-instance");
        }
        var y, v = t[0], g = t[3], b = !u;
        if (!b) {
            r || Array.isArray(v) || (v = [
                v
            ]);
            var w = {}, S = [], A = 3 === o ? "get" : 4 === o || d ? "set" : "value";
            f ? (p || d ? w = {
                get: $f3918e16b922d6f5$var$_setFunctionName(function() {
                    return g(this);
                }, n, "get"),
                set: function(e) {
                    t[4](this, e);
                }
            } : w[A] = g, p || $f3918e16b922d6f5$var$_setFunctionName(w[A], n, 2 === o ? "" : A)) : p || (w = Object.getOwnPropertyDescriptor(e, n));
        }
        for(var P = e, j = v.length - 1; j >= 0; j -= r ? 2 : 1){
            var D = v[j], E = r ? v[j - 1] : void 0, I = {}, O = {
                kind: [
                    "field",
                    "accessor",
                    "method",
                    "getter",
                    "setter",
                    "class"
                ][o],
                name: n,
                metadata: a,
                addInitializer: (function(e, t) {
                    if (e.v) throw Error("attempted to call addInitializer after decoration was finished");
                    s(t, "An initializer", "be", !0), c.push(t);
                }).bind(null, I)
            };
            try {
                if (b) (y = s(D.call(E, P, O), "class decorators", "return")) && (P = y);
                else {
                    var k, F;
                    O.static = l, O.private = f, f ? 2 === o ? k = function(e) {
                        return m(e), w.value;
                    } : (o < 4 && (k = i(w, "get", m)), 3 !== o && (F = i(w, "set", m))) : (k = function(e) {
                        return e[n];
                    }, (o < 2 || 4 === o) && (F = function(e, t) {
                        e[n] = t;
                    }));
                    var N = O.access = {
                        has: f ? h.bind() : function(e) {
                            return n in e;
                        }
                    };
                    if (k && (N.get = k), F && (N.set = F), P = D.call(E, d ? {
                        get: w.get,
                        set: w.set
                    } : w[A], O), d) {
                        if ("object" == typeof P && P) (y = s(P.get, "accessor.get")) && (w.get = y), (y = s(P.set, "accessor.set")) && (w.set = y), (y = s(P.init, "accessor.init")) && S.push(y);
                        else if (void 0 !== P) throw new TypeError("accessor decorators must return an object with get, set, or init properties or void 0");
                    } else s(P, (p ? "field" : "method") + " decorators", "return") && (p ? S.push(P) : w[A] = P);
                }
            } finally{
                I.v = !0;
            }
        }
        return (p || d) && u.push(function(e, t) {
            for(var r = S.length - 1; r >= 0; r--)t = S[r].call(e, t);
            return t;
        }), p || b || (f ? d ? u.push(i(w, "get"), i(w, "set")) : u.push(2 === o ? w[A] : i.call.bind(w[A])) : Object.defineProperty(e, n, w)), P;
    }
    function u(e, t) {
        return Object.defineProperty(e, Symbol.metadata || Symbol.for("Symbol.metadata"), {
            configurable: !0,
            enumerable: !0,
            value: t
        });
    }
    if (arguments.length >= 6) var l = a[Symbol.metadata || Symbol.for("Symbol.metadata")];
    var f = Object.create(null == l ? null : l), p = function(e, t, r, n) {
        var o, a, i = [], s = function(t) {
            return $f3918e16b922d6f5$var$_checkInRHS(t) === e;
        }, u = new Map();
        function l(e) {
            e && i.push(c.bind(null, e));
        }
        for(var f = 0; f < t.length; f++){
            var p = t[f];
            if (Array.isArray(p)) {
                var d = p[1], h = p[2], m = p.length > 3, y = 16 & d, v = !!(8 & d), g = 0 == (d &= 7), b = h + "/" + v;
                if (!g && !m) {
                    var w = u.get(b);
                    if (!0 === w || 3 === w && 4 !== d || 4 === w && 3 !== d) throw Error("Attempted to decorate a public method/accessor that has the same name as a previously decorated public method/accessor. This is not currently supported by the decorators plugin. Property name was: " + h);
                    u.set(b, !(d > 2) || d);
                }
                applyDec(v ? e : e.prototype, p, y, m ? "#" + h : $f3918e16b922d6f5$var$_toPropertyKey(h), d, n, v ? a = a || [] : o = o || [], i, v, m, g, 1 === d, v && m ? s : r);
            }
        }
        return l(o), l(a), i;
    }(e, t, o, f);
    return r.length || u(e, f), {
        e: p,
        get c () {
            var t1 = [];
            return r.length && [
                u(applyDec(e, [
                    r
                ], n, e.name, 5, f, t1), f),
                c.bind(null, t1, e)
            ];
        }
    };
}
function $f3918e16b922d6f5$var$_toPropertyKey(t) {
    var i = $f3918e16b922d6f5$var$_toPrimitive(t, "string");
    return "symbol" == typeof i ? i : i + "";
}
function $f3918e16b922d6f5$var$_toPrimitive(t, r) {
    if ("object" != typeof t || !t) return t;
    var e = t[Symbol.toPrimitive];
    if (void 0 !== e) {
        var i = e.call(t, r || "default");
        if ("object" != typeof i) return i;
        throw new TypeError("@@toPrimitive must return a primitive value.");
    }
    return ("string" === r ? String : Number)(t);
}
function $f3918e16b922d6f5$var$_setFunctionName(e, t, n) {
    "symbol" == typeof t && (t = (t = t.description) ? "[" + t + "]" : "");
    try {
        Object.defineProperty(e, "name", {
            configurable: !0,
            value: n ? n + " " + t : t
        });
    } catch (e) {}
    return e;
}
function $f3918e16b922d6f5$var$_checkInRHS(e) {
    if (Object(e) !== e) throw TypeError("right-hand side of 'in' should be an object, got " + (null !== e ? typeof e : "null"));
    return e;
}
function $f3918e16b922d6f5$var$_identity(t) {
    return t;
}
const $f3918e16b922d6f5$var$DEFAULT_HEADING_SELECTOR = 'h2, h3, h4, h5, h6';
function $f3918e16b922d6f5$var$extractText(childNodes, childSelector, headingParts = []) {
    for (const child of childNodes){
        if (child instanceof Comment) continue;
        if (child instanceof Text) headingParts.push(child.textContent);
        else if (child.matches(childSelector)) $f3918e16b922d6f5$var$extractText(child.childNodes, childSelector, headingParts);
    }
    return headingParts;
}
function $f3918e16b922d6f5$var$getHeadingLevel(el) {
    if (el?.localName.startsWith('h')) {
        const levelString = el.localName.substring(1);
        const level = parseInt(levelString, 10);
        if (level >= 1 && level <= 6) return level;
    }
    return null;
}
function $f3918e16b922d6f5$var$makeMutationObserverCallback(outline) {
    return (mutationList)=>{
        for (const mutation of mutationList){
            const heading = mutation.target.parentElement.closest(outline.levels);
            if (heading) {
                outline.updateTree();
                break;
            }
        }
    };
}
function $f3918e16b922d6f5$var$textForHeading(heading, outline) {
    const childSelector = `:not(copy-url, .${outline.hideFromNavClass})`;
    let headingParts;
    if (!heading) return null;
    headingParts = $f3918e16b922d6f5$var$extractText(heading.childNodes, childSelector);
    return headingParts.join('').trim();
}
class $f3918e16b922d6f5$var$TreeItem {
    constructor(el, outline){
        this.children = [];
        this.hideFromNav = outline.isHidden(el);
        this.id = el?.id;
        this.level = $f3918e16b922d6f5$var$getHeadingLevel(el);
        this.text = $f3918e16b922d6f5$var$textForHeading(el, outline);
    }
}
$f3918e16b922d6f5$var$_classDecs = [
    (0, $b777701f54f11b66$export$da64fc29f17f9d0e)('jsdoc-outline')
];
let $f3918e16b922d6f5$export$5beeae30d1389e5;
new class extends $f3918e16b922d6f5$var$_identity {
    static [class Outline extends (0, $844e354847ecce5a$export$3f2f9f5909897157) {
        static{
            ({ e: [$f3918e16b922d6f5$var$_init_contents, $f3918e16b922d6f5$var$_init_hideFromNavClass, $f3918e16b922d6f5$var$_init_levels, $f3918e16b922d6f5$var$_init_links, $f3918e16b922d6f5$var$_init_title, $f3918e16b922d6f5$var$_init_titleText, $f3918e16b922d6f5$var$_init_tree, $f3918e16b922d6f5$var$_initProto], c: [$f3918e16b922d6f5$export$5beeae30d1389e5, $f3918e16b922d6f5$var$_initClass] } = $f3918e16b922d6f5$var$_applyDecs(this, [
                [
                    $f3918e16b922d6f5$var$_contentsDecs,
                    1,
                    "contents"
                ],
                [
                    $f3918e16b922d6f5$var$_hideFromNavClassDecs,
                    1,
                    "hideFromNavClass"
                ],
                [
                    $f3918e16b922d6f5$var$_levelsDecs,
                    1,
                    "levels"
                ],
                [
                    $f3918e16b922d6f5$var$_linksDecs,
                    1,
                    "links"
                ],
                [
                    $f3918e16b922d6f5$var$_titleDecs,
                    1,
                    "title"
                ],
                [
                    $f3918e16b922d6f5$var$_titleTextDecs,
                    1,
                    "titleText"
                ],
                [
                    $f3918e16b922d6f5$var$_treeDecs,
                    1,
                    "tree"
                ]
            ], $f3918e16b922d6f5$var$_classDecs, 0, void 0, (0, $844e354847ecce5a$export$3f2f9f5909897157)));
        }
        #A = ($f3918e16b922d6f5$var$_initProto(this), $f3918e16b922d6f5$var$_init_contents(this));
        get [($f3918e16b922d6f5$var$_contentsDecs = (0, $c0447c72baf98ff7$export$2fa187e846a241c4)('slot[name="contents"]'), $f3918e16b922d6f5$var$_hideFromNavClassDecs = (0, $28816b39eccda61d$export$d541bacb2bda4494)({
            attribute: 'hide-from-nav-class'
        }), $f3918e16b922d6f5$var$_levelsDecs = (0, $28816b39eccda61d$export$d541bacb2bda4494)({
            reflect: true
        }), $f3918e16b922d6f5$var$_linksDecs = (0, $89ae29b91346bfd3$export$dcd0d083aa86c355)('a'), $f3918e16b922d6f5$var$_titleDecs = (0, $c0447c72baf98ff7$export$2fa187e846a241c4)('slot[name="title"]'), $f3918e16b922d6f5$var$_titleTextDecs = (0, $28816b39eccda61d$export$d541bacb2bda4494)({
            reflect: true
        }), $f3918e16b922d6f5$var$_treeDecs = (0, $28816b39eccda61d$export$d541bacb2bda4494)(), "contents")]() {
            return this.#A;
        }
        set contents(v) {
            this.#A = v;
        }
        #B = $f3918e16b922d6f5$var$_init_hideFromNavClass(this, 'hide-from-nav');
        get hideFromNavClass() {
            return this.#B;
        }
        set hideFromNavClass(v) {
            this.#B = v;
        }
        #C = $f3918e16b922d6f5$var$_init_levels(this, $f3918e16b922d6f5$var$DEFAULT_HEADING_SELECTOR);
        get levels() {
            return this.#C;
        }
        set levels(v) {
            this.#C = v;
        }
        #D = $f3918e16b922d6f5$var$_init_links(this);
        get links() {
            return this.#D;
        }
        set links(v) {
            this.#D = v;
        }
        #E = $f3918e16b922d6f5$var$_init_title(this);
        get title() {
            return this.#E;
        }
        set title(v) {
            this.#E = v;
        }
        #F = $f3918e16b922d6f5$var$_init_titleText(this, 'On this page');
        get titleText() {
            return this.#F;
        }
        set titleText(v) {
            this.#F = v;
        }
        #G = $f3918e16b922d6f5$var$_init_tree(this);
        get tree() {
            return this.#G;
        }
        set tree(v) {
            this.#G = v;
        }
        #intersectionObserver;
        #linkTargets;
        #mutationObserver;
        #updateTreeThrottled;
        #visibleLinkTargets;
        constructor(){
            super();
            this.#intersectionObserver = null;
            this.#linkTargets = new WeakMap();
            this.#mutationObserver = null;
            this.#visibleLinkTargets = new WeakSet();
        }
        #buildHeadingTree(headings) {
            let tree = [];
            while(headings.length){
                const firstHeading = headings.shift();
                if (this.isHidden(firstHeading)) continue;
                const node = new $f3918e16b922d6f5$var$TreeItem(firstHeading, this);
                const nestedHeadings = this.#takeNestedHeadings(headings, firstHeading);
                if (nestedHeadings.length) node.children = this.#buildHeadingTree(nestedHeadings);
                tree.push(node);
            }
            return tree;
        }
        connectedCallback() {
            super.connectedCallback();
            this.updateTree();
        }
        firstUpdated() {
            super.firstUpdated();
            this.#mutationObserver = new MutationObserver($f3918e16b922d6f5$var$makeMutationObserverCallback(this));
            this.#observeMutations();
            const navbarMargin = (0, $09f80e6da26c5cb9$export$e83efb98d34fb4ce)();
            const bottomMargin = navbarMargin / 2;
            this.#intersectionObserver = new IntersectionObserver((items)=>this.#handleIntersect(items, this.#visibleLinkTargets), {
                rootMargin: `-${navbarMargin}px 0px -${bottomMargin}px 0px`
            });
            this.#toggleCurrentItem();
            this.#observeTargets();
        }
        #handleIntersect(items, visibleLinkTargets) {
            items.forEach((item)=>{
                if (item.isIntersecting) visibleLinkTargets.add(item.target);
                else visibleLinkTargets.delete(item.target);
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
                subtree: true
            });
        }
        #observeTargets() {
            for (const link of Array.from(this.links)){
                const hash = link.hash.slice(1);
                const target = hash ? document.getElementById(hash) : null;
                if (target) {
                    this.#linkTargets.set(link, target);
                    this.#intersectionObserver.observe(target);
                }
            }
        }
        render() {
            return (0, $aed1389927a5dd65$export$c0bb0b647f701bb5)`
      <nav class="container" aria-labelledby="title">
        <slot name="title">
          <h2 part="title" class="title">${this.titleText}</h2>
        </slot>
        <slot name="contents">
          <ul part="contents" class="contents">
            ${this.#renderTreeItems(this.tree ?? [])}
          </ul>
        </slot>
        <slot></slot>
      </nav>
    `;
        }
        #renderChildren(children) {
            if (!children) return (0, $aed1389927a5dd65$export$c0bb0b647f701bb5)``;
            return (0, $aed1389927a5dd65$export$c0bb0b647f701bb5)`
      <ul class="contents nested">
        ${this.#renderTreeItems(children)}
      </ul>
    `;
        }
        #renderTreeItems(tree) {
            const rendered = [];
            for (const node of tree)rendered.push((0, $aed1389927a5dd65$export$c0bb0b647f701bb5)`
        <li>
          <p><a href="#${node.id}">${node.text}</a></p>
          ${this.#renderChildren(node.children)}
        </li>
      `);
            return rendered;
        }
        #takeNestedHeadings(headings, firstHeading) {
            const nested = [];
            const startLevel = $f3918e16b922d6f5$var$getHeadingLevel(firstHeading);
            while($f3918e16b922d6f5$var$getHeadingLevel(headings[0]) > startLevel){
                const nextHeading = headings.shift();
                if (this.isHidden(nextHeading)) continue;
                nested.push(nextHeading);
            }
            return nested;
        }
        #toggleCurrentItem() {
            const links = Array.from(this.links);
            // Activate the link to the first visible target.
            links.find((link)=>{
                const target = this.#linkTargets.get(link);
                if (target && this.#visibleLinkTargets.has(target)) {
                    links.forEach((el)=>el.classList.toggle('current', el === link));
                    return true;
                }
                return false;
            });
        }
        #updateTree() {
            this.tree = this.#buildHeadingTree(Array.from(document.querySelectorAll(`.jsdoc-content ${this.levels}`)));
        }
        updateTree() {
            if (!this.#updateTreeThrottled) this.#updateTreeThrottled = (0, $3fdb7f6a53d841b7$export$2e2bcd8739ae039)(this.#updateTree, 500);
            return this.#updateTreeThrottled();
        }
    }];
    styles = [
        (0, $987a32d81eef3330$export$dbf350e5966cf602)`
      :host {
        --outline-font-size: calc(var(--jsdoc-font-font-size-base) * 0.875);
        --outline-line-height: 0.825rem;
      }

      .contents {
        font-family: var(--jsdoc-font-body-font);
        font-size: var(--outline-font-size);
        line-height: var(--outline-line-height);
        margin-block: revert;
        margin-inline-start: 1rem;
        padding-inline-start: 0;
      }

      .contents li {
        list-style-type: none;

        a {
          color: inherit;
          text-decoration: none;

          &:focus,
          &:hover {
            color: var(--jsdoc-color-sky-700);
          }
        }

        .current {
          color: var(--jsdoc-color-sky-700);
          font-weight: bold;
        }
      }

      .nested {
        padding-inline-start: 0.625rem;
      }

      .title {
        font-family: var(--jsdoc-font-body-font);
        font-size: var(--jsdoc-font-font-size-base);
        font-weight: bold;
        line-height: var(--outline-line-height);
        margin-inline-start: 1rem;
      }
    `
    ];
    constructor(){
        super($f3918e16b922d6f5$export$5beeae30d1389e5), $f3918e16b922d6f5$var$_initClass();
    }
}();


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
*/ /*! Copyright 2026 Fonticons, Inc. - https://webawesome.com/license */ /*! Copyright 2026 Fonticons, Inc. - https://webawesome.com/license */ /*! Copyright 2026 Fonticons, Inc. - https://webawesome.com/license */ // src/events/show.ts
var $eb653cf7dcf5204d$export$dd0bb25790ab4015 = class extends Event {
    constructor(){
        super("wa-show", {
            bubbles: true,
            cancelable: true,
            composed: true
        });
    }
};


/*! Copyright 2026 Fonticons, Inc. - https://webawesome.com/license */ // src/events/hide.ts
var $d0d79e225dd42d88$export$e4267f9b469eac96 = class extends Event {
    constructor(detail){
        super("wa-hide", {
            bubbles: true,
            cancelable: true,
            composed: true
        });
        this.detail = detail;
    }
};


/*! Copyright 2026 Fonticons, Inc. - https://webawesome.com/license */ // src/events/after-hide.ts
var $ead071f558d32283$export$7b1e7adde2f1dd6c = class extends Event {
    constructor(){
        super("wa-after-hide", {
            bubbles: true,
            cancelable: false,
            composed: true
        });
    }
};


/*! Copyright 2026 Fonticons, Inc. - https://webawesome.com/license */ // src/events/after-show.ts
var $c60b6726542b418b$export$b9e1539da35189ca = class extends Event {
    constructor(){
        super("wa-after-show", {
            bubbles: true,
            cancelable: false,
            composed: true
        });
    }
};


/*! Copyright 2026 Fonticons, Inc. - https://webawesome.com/license */ // src/components/details/details.styles.ts

var $768d3457be40e294$export$e0460a263d3b7bef = (0, $987a32d81eef3330$export$dbf350e5966cf602)`
  :host {
    --spacing: var(--wa-space-m);
    --show-duration: 200ms;
    --hide-duration: 200ms;

    display: block;
  }

  details {
    display: block;
    overflow-anchor: none;
    border: var(--wa-panel-border-width) var(--wa-color-surface-border) var(--wa-panel-border-style);
    background-color: var(--wa-color-surface-default);
    border-radius: var(--wa-panel-border-radius);
    color: var(--wa-color-text-normal);

    /* Print styles */
    @media print {
      background: none;
      border: solid var(--wa-border-width-s) var(--wa-color-surface-border);

      summary {
        list-style: none;
      }
    }
  }

  /* Appearance modifiers */
  :host([appearance='plain']) details {
    background-color: transparent;
    border-color: transparent;
    border-radius: 0;
  }

  :host([appearance='outlined']) details {
    background-color: var(--wa-color-surface-default);
    border-color: var(--wa-color-surface-border);
  }

  :host([appearance='filled']) details {
    background-color: var(--wa-color-neutral-fill-quiet);
    border-color: transparent;
  }

  :host([appearance='filled-outlined']) details {
    background-color: var(--wa-color-neutral-fill-quiet);
    border-color: var(--wa-color-neutral-border-quiet);
  }

  :host([disabled]) details {
    opacity: 0.5;
    cursor: not-allowed;
  }

  summary {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: var(--spacing);
    padding: var(--spacing); /* Add padding here */
    border-radius: calc(var(--wa-panel-border-radius) - var(--wa-panel-border-width));
    user-select: none;
    -webkit-user-select: none;
    cursor: pointer;

    &::marker,
    &::-webkit-details-marker {
      display: none;
    }

    &:focus {
      outline: none;
    }

    &:focus-visible {
      outline: var(--wa-focus-ring);
      outline-offset: calc(var(--wa-panel-border-width) + var(--wa-focus-ring-offset));
    }
  }

  :host([open]) summary {
    border-end-start-radius: 0;
    border-end-end-radius: 0;
  }

  /* 'Start' icon placement */
  :host([icon-placement='start']) summary {
    flex-direction: row-reverse;
    justify-content: start;
  }

  [part~='icon'] {
    flex: 0 0 auto;
    display: flex;
    align-items: center;
    color: var(--wa-color-text-quiet);
    transition: rotate var(--wa-transition-normal) var(--wa-transition-easing);
  }

  :host([open]) [part~='icon'] {
    rotate: 90deg;
  }

  :host([open]:dir(rtl)) [part~='icon'] {
    rotate: -90deg;
  }

  :host([open]) slot[name='expand-icon'],
  :host(:not([open])) slot[name='collapse-icon'] {
    display: none;
  }

  .body.animating {
    overflow: hidden;
  }

  .content {
    display: block;
    padding-block-start: var(--spacing);
    padding-inline: var(--spacing); /* Add horizontal padding */
    padding-block-end: var(--spacing); /* Add bottom padding */
  }
`;


/*! Copyright 2026 Fonticons, Inc. - https://webawesome.com/license */ // src/internal/event.ts
function $25db84cda1afb88a$export$6608ab6fe9313967(el, eventName) {
    return new Promise((resolve)=>{
        function done(event) {
            if (event.target === el) {
                el.removeEventListener(eventName, done);
                resolve();
            }
        }
        el.addEventListener(eventName, done);
    });
}


/*! Copyright 2026 Fonticons, Inc. - https://webawesome.com/license */ // src/internal/animate.ts
async function $fbf2d72871bb3665$export$e3607ec2d7a891c4(el, keyframes, options) {
    return el.animate(keyframes, options).finished.catch(()=>{});
}
function $fbf2d72871bb3665$export$b1934f85a9394732(el, className) {
    return new Promise((resolve)=>{
        const controller = new AbortController();
        const { signal: signal } = controller;
        if (el.classList.contains(className)) return;
        el.classList.remove(className);
        el.classList.add(className);
        let onEnd = ()=>{
            el.classList.remove(className);
            resolve();
            controller.abort();
        };
        el.addEventListener("animationend", onEnd, {
            once: true,
            signal: signal
        });
        el.addEventListener("animationcancel", onEnd, {
            once: true,
            signal: signal
        });
    });
}
function $fbf2d72871bb3665$export$ecae829bb3747ea6(duration) {
    duration = duration.toString().toLowerCase();
    if (duration.indexOf("ms") > -1) return parseFloat(duration) || 0;
    if (duration.indexOf("s") > -1) return (parseFloat(duration) || 0) * 1e3;
    return parseFloat(duration) || 0;
}
function $fbf2d72871bb3665$export$ff7706047246b98b() {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    return query.matches;
}


/*! Copyright 2026 Fonticons, Inc. - https://webawesome.com/license */ /*! Copyright 2026 Fonticons, Inc. - https://webawesome.com/license */ // src/events/invalid.ts
var $16a476e6cc0f0a2b$export$dfa7d77f35d3c066 = class extends Event {
    constructor(){
        super("wa-invalid", {
            bubbles: true,
            cancelable: false,
            composed: true
        });
    }
};


/*! Copyright 2026 Fonticons, Inc. - https://webawesome.com/license */ /*! Copyright 2026 Fonticons, Inc. - https://webawesome.com/license */ var $e94b2b28708d0aa9$var$__defProp = Object.defineProperty;
var $e94b2b28708d0aa9$var$__getOwnPropDesc = Object.getOwnPropertyDescriptor;
var $e94b2b28708d0aa9$var$__typeError = (msg)=>{
    throw TypeError(msg);
};
var $e94b2b28708d0aa9$export$85c93885f16e8446 = (decorators, target, key, kind)=>{
    var result = kind > 1 ? void 0 : kind ? $e94b2b28708d0aa9$var$__getOwnPropDesc(target, key) : target;
    for(var i = decorators.length - 1, decorator; i >= 0; i--)if (decorator = decorators[i]) result = (kind ? decorator(target, key, result) : decorator(result)) || result;
    if (kind && result) $e94b2b28708d0aa9$var$__defProp(target, key, result);
    return result;
};
var $e94b2b28708d0aa9$var$__accessCheck = (obj, member, msg)=>member.has(obj) || $e94b2b28708d0aa9$var$__typeError("Cannot " + msg);
var $e94b2b28708d0aa9$export$18a094aefa070634 = (obj, member, getter)=>($e94b2b28708d0aa9$var$__accessCheck(obj, member, "read from private field"), getter ? getter.call(obj) : member.get(obj));
var $e94b2b28708d0aa9$export$addf369becd23283 = (obj, member, value)=>member.has(obj) ? $e94b2b28708d0aa9$var$__typeError("Cannot add the same private member more than once") : member instanceof WeakSet ? member.add(obj) : member.set(obj, value);
var $e94b2b28708d0aa9$export$42432efe6614d3b4 = (obj, member, value, setter)=>($e94b2b28708d0aa9$var$__accessCheck(obj, member, "write to private field"), setter ? setter.call(obj, value) : member.set(obj, value), value);






/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */ function $d17008b6c57595d4$export$b2b799818fbabcf3(t) {
    return (n, o)=>{
        const c = "function" == typeof n ? n : n[o];
        Object.assign(c, t);
    };
}





/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */ function $ed9377dc2d91bfd9$export$163dfc35cc43f240(r) {
    return (n, e)=>(0, $f52fe82312bb67cf$export$51987bb50e1f6752)(n, e, {
            async get () {
                return await this.updateComplete, this.renderRoot?.querySelector(r) ?? null;
            }
        });
}



/**
 * @license
 * Copyright 2021 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */ function $f2d09298da94ba8d$export$4682af2d9ee91415(o) {
    return (e, n)=>{
        const { slot: r, selector: s } = o ?? {}, c = "slot" + (r ? `[name=${r}]` : ":not([name])");
        return (0, $f52fe82312bb67cf$export$51987bb50e1f6752)(e, n, {
            get () {
                const t = this.renderRoot?.querySelector(c), e = t?.assignedElements(o) ?? [];
                return void 0 === s ? e : e.filter((t)=>t.matches(s));
            }
        });
    };
}



/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */ function $28a3b17ba252832c$export$1bdbe53f9df1b8(n) {
    return (o, r)=>{
        const { slot: e } = n ?? {}, s = "slot" + (e ? `[name=${e}]` : ":not([name])");
        return (0, $f52fe82312bb67cf$export$51987bb50e1f6752)(o, r, {
            get () {
                const t = this.renderRoot?.querySelector(s);
                return t?.assignedNodes(n) ?? [];
            }
        });
    };
}




var $7b33480fbd5323dc$var$host_styles_default = (0, $987a32d81eef3330$export$dbf350e5966cf602)`
  :host {
    box-sizing: border-box !important;
  }

  :host *,
  :host *::before,
  :host *::after {
    box-sizing: inherit !important;
  }

  [hidden] {
    display: none !important;
  }
`;
// src/internal/webawesome-element.ts
var $7b33480fbd5323dc$var$_hasRecordedInitialProperties;
var $7b33480fbd5323dc$export$1c2340e2bfaed5f9 = class extends (0, $844e354847ecce5a$export$3f2f9f5909897157) {
    constructor(){
        super();
        (0, $e94b2b28708d0aa9$export$addf369becd23283)(this, $7b33480fbd5323dc$var$_hasRecordedInitialProperties, false);
        this.initialReflectedProperties = /* @__PURE__ */ new Map();
        this.didSSR = (0, $44a4deadd6bc9fd2$export$6acf61af03e62db) || Boolean(this.shadowRoot);
        /**
     * @internal Methods for setting and checking custom states.
     */ this.customStates = {
            /** Adds or removes the specified custom state. */ set: (customState, active)=>{
                if (!Boolean(this.internals?.states)) return;
                try {
                    if (active) this.internals.states.add(customState);
                    else this.internals.states.delete(customState);
                } catch (e) {
                    if (String(e).includes("must start with '--'")) console.error("Your browser implements an outdated version of CustomStateSet. Consider using a polyfill");
                    else throw e;
                }
            },
            /** Determines whether or not the element currently has the specified state. */ has: (customState)=>{
                if (!Boolean(this.internals?.states)) return false;
                try {
                    return this.internals.states.has(customState);
                } catch  {
                    return false;
                }
            }
        };
        try {
            this.internals = this.attachInternals();
        } catch  {
            console.error("Element internals are not supported in your browser. Consider using a polyfill");
        }
        this.customStates.set("wa-defined", true);
        let Self = this.constructor;
        for (let [property2, spec] of Self.elementProperties)if (spec.default === "inherit" && spec.initial !== void 0 && typeof property2 === "string") this.customStates.set(`initial-${property2}-${spec.initial}`, true);
    }
    /** Prepends host styles to the component's styles. */ static get styles() {
        const styles = Array.isArray(this.css) ? this.css : this.css ? [
            this.css
        ] : [];
        return [
            $7b33480fbd5323dc$var$host_styles_default,
            ...styles
        ];
    }
    attributeChangedCallback(name, oldValue, newValue) {
        if (!(0, $e94b2b28708d0aa9$export$18a094aefa070634)(this, $7b33480fbd5323dc$var$_hasRecordedInitialProperties)) {
            this.constructor.elementProperties.forEach((obj, prop)=>{
                if (obj.reflect && this[prop] != null) this.initialReflectedProperties.set(prop, this[prop]);
            });
            (0, $e94b2b28708d0aa9$export$42432efe6614d3b4)(this, $7b33480fbd5323dc$var$_hasRecordedInitialProperties, true);
        }
        super.attributeChangedCallback(name, oldValue, newValue);
    }
    willUpdate(changedProperties) {
        super.willUpdate(changedProperties);
        this.initialReflectedProperties.forEach((value, prop)=>{
            if (changedProperties.has(prop) && this[prop] == null) this[prop] = value;
        });
    }
    firstUpdated(changedProperties) {
        super.firstUpdated(changedProperties);
        if (this.didSSR) this.shadowRoot?.querySelectorAll("slot").forEach((slotElement)=>{
            slotElement.dispatchEvent(new Event("slotchange", {
                bubbles: true,
                composed: false,
                cancelable: false
            }));
        });
    }
    update(changedProperties) {
        try {
            super.update(changedProperties);
        } catch (e) {
            if (this.didSSR && !this.hasUpdated) {
                const event = new Event("lit-hydration-error", {
                    bubbles: true,
                    composed: true,
                    cancelable: false
                });
                event.error = e;
                this.dispatchEvent(event);
            }
            throw e;
        }
    }
    /**
   * @internal Given a native event, this function cancels it and dispatches it again from the host element using the desired
   * event options.
   */ relayNativeEvent(event, eventOptions) {
        event.stopImmediatePropagation();
        this.dispatchEvent(new event.constructor(event.type, {
            ...event,
            ...eventOptions
        }));
    }
};
$7b33480fbd5323dc$var$_hasRecordedInitialProperties = new WeakMap();
(0, $e94b2b28708d0aa9$export$85c93885f16e8446)([
    (0, $28816b39eccda61d$export$d541bacb2bda4494)()
], $7b33480fbd5323dc$export$1c2340e2bfaed5f9.prototype, "dir", 2);
(0, $e94b2b28708d0aa9$export$85c93885f16e8446)([
    (0, $28816b39eccda61d$export$d541bacb2bda4494)()
], $7b33480fbd5323dc$export$1c2340e2bfaed5f9.prototype, "lang", 2);
(0, $e94b2b28708d0aa9$export$85c93885f16e8446)([
    (0, $28816b39eccda61d$export$d541bacb2bda4494)({
        type: Boolean,
        reflect: true,
        attribute: "did-ssr"
    })
], $7b33480fbd5323dc$export$1c2340e2bfaed5f9.prototype, "didSSR", 2);





// src/internal/validators/custom-error-validator.ts
var $e2f29c58e6e4411c$var$CustomErrorValidator = ()=>{
    return {
        observedAttributes: [
            "custom-error"
        ],
        checkValidity (element) {
            const validity = {
                message: "",
                isValid: true,
                invalidKeys: []
            };
            if (element.customError) {
                validity.message = element.customError;
                validity.isValid = false;
                validity.invalidKeys = [
                    "customError"
                ];
            }
            return validity;
        }
    };
};
// src/internal/webawesome-form-associated-element.ts
var $e2f29c58e6e4411c$export$8f4cbae1a5641ee6 = class extends (0, $7b33480fbd5323dc$export$1c2340e2bfaed5f9) {
    constructor(){
        super();
        this.name = null;
        this.disabled = false;
        this.required = false;
        this.assumeInteractionOn = [
            "input"
        ];
        this.validators = [];
        this.valueHasChanged = false;
        this.hasInteracted = false;
        this.customError = null;
        this.emittedEvents = [];
        this.emitInvalid = (e)=>{
            if (e.target !== this) return;
            this.hasInteracted = true;
            this.dispatchEvent(new (0, $16a476e6cc0f0a2b$export$dfa7d77f35d3c066)());
        };
        this.handleInteraction = (event)=>{
            const emittedEvents = this.emittedEvents;
            if (!emittedEvents.includes(event.type)) emittedEvents.push(event.type);
            if (emittedEvents.length === this.assumeInteractionOn?.length) this.hasInteracted = true;
        };
        if (!(0, $44a4deadd6bc9fd2$export$6acf61af03e62db)) this.addEventListener("invalid", this.emitInvalid);
    }
    /**
   * Validators are static because they have `observedAttributes`, essentially attributes to "watch"
   * for changes. Whenever these attributes change, we want to be notified and update the validator.
   */ static get validators() {
        return [
            $e2f29c58e6e4411c$var$CustomErrorValidator()
        ];
    }
    // Append all Validator "observedAttributes" into the "observedAttributes" so they can run.
    static get observedAttributes() {
        const parentAttrs = new Set(super.observedAttributes || []);
        for (const validator of this.validators){
            if (!validator.observedAttributes) continue;
            for (const attr of validator.observedAttributes)parentAttrs.add(attr);
        }
        return [
            ...parentAttrs
        ];
    }
    connectedCallback() {
        super.connectedCallback();
        this.updateValidity();
        this.assumeInteractionOn.forEach((event)=>{
            this.addEventListener(event, this.handleInteraction);
        });
    }
    firstUpdated(...args) {
        super.firstUpdated(...args);
        this.updateValidity();
    }
    willUpdate(changedProperties) {
        if (!(0, $44a4deadd6bc9fd2$export$6acf61af03e62db) && changedProperties.has("customError")) {
            if (!this.customError) this.customError = null;
            this.setCustomValidity(this.customError || "");
        }
        if (changedProperties.has("value") || changedProperties.has("disabled")) {
            const value = this.value;
            if (Array.isArray(value)) {
                if (this.name) {
                    const formData = new FormData();
                    for (const val of value)formData.append(this.name, val);
                    this.setValue(formData, formData);
                }
            } else this.setValue(value, value);
        }
        if (changedProperties.has("disabled")) {
            this.customStates.set("disabled", this.disabled);
            if (this.hasAttribute("disabled") || !(0, $44a4deadd6bc9fd2$export$6acf61af03e62db) && !this.matches(":disabled")) this.toggleAttribute("disabled", this.disabled);
        }
        this.updateValidity();
        super.willUpdate(changedProperties);
    }
    get labels() {
        return this.internals.labels;
    }
    getForm() {
        return this.internals.form;
    }
    /**
   * By default, form controls are associated with the nearest containing `<form>` element. This attribute allows you
   * to place the form control outside of a form and associate it with the form that has this `id`. The form must be in
   * the same document or shadow root for this to work.
   */ set form(val) {
        if (val) this.setAttribute("form", val);
        else this.removeAttribute("form");
    }
    get form() {
        return this.internals.form;
    }
    get validity() {
        return this.internals.validity;
    }
    // Not sure if this supports `novalidate`. Will need to test.
    get willValidate() {
        return this.internals.willValidate;
    }
    get validationMessage() {
        return this.internals.validationMessage;
    }
    checkValidity() {
        this.updateValidity();
        return this.internals.checkValidity();
    }
    reportValidity() {
        this.updateValidity();
        this.hasInteracted = true;
        return this.internals.reportValidity();
    }
    /**
   * Override this to change where constraint validation popups are anchored.
   */ get validationTarget() {
        return this.input || void 0;
    }
    setValidity(...args) {
        const flags = args[0];
        const message = args[1];
        let anchor = args[2];
        if (!anchor) anchor = this.validationTarget;
        this.internals.setValidity(flags, message, anchor || void 0);
        this.requestUpdate("validity");
        this.setCustomStates();
    }
    setCustomStates() {
        const required = Boolean(this.required);
        const isValid = this.internals.validity.valid;
        const hasInteracted = this.hasInteracted;
        this.customStates.set("required", required);
        this.customStates.set("optional", !required);
        this.customStates.set("invalid", !isValid);
        this.customStates.set("valid", isValid);
        this.customStates.set("user-invalid", !isValid && hasInteracted);
        this.customStates.set("user-valid", isValid && hasInteracted);
    }
    /**
   * Do not use this when creating a "Validator". This is intended for end users of components.
   * We track manually defined custom errors so we don't clear them on accident in our validators.
   *
   */ setCustomValidity(message) {
        if (!message) {
            this.customError = null;
            this.setValidity({});
            return;
        }
        this.customError = message;
        this.setValidity({
            customError: true
        }, message, this.validationTarget);
    }
    formResetCallback() {
        this.resetValidity();
        this.hasInteracted = false;
        this.valueHasChanged = false;
        this.emittedEvents = [];
        this.updateValidity();
    }
    formDisabledCallback(isDisabled) {
        this.disabled = isDisabled;
        this.updateValidity();
    }
    /**
   * Called when the browser is trying to restore element’s state to state in which case reason is "restore", or when
   * the browser is trying to fulfill autofill on behalf of user in which case reason is "autocomplete". In the case of
   * "restore", state is a string, File, or FormData object previously set as the second argument to setFormValue.
   */ formStateRestoreCallback(state, reason) {
        this.value = state;
        if (reason === "restore") this.resetValidity();
        this.updateValidity();
    }
    setValue(...args) {
        const [value, state] = args;
        this.internals.setFormValue(value, state);
    }
    get allValidators() {
        const staticValidators = this.constructor.validators || [];
        const validators = this.validators || [];
        return [
            ...staticValidators,
            ...validators
        ];
    }
    /**
   * Reset validity is a way of removing manual custom errors and native validation.
   */ resetValidity() {
        this.setCustomValidity("");
        this.setValidity({});
    }
    updateValidity() {
        if (this.disabled || this.hasAttribute("disabled") || !this.willValidate) {
            this.resetValidity();
            return;
        }
        const validators = this.allValidators;
        if (!validators?.length) return;
        const flags = {
            // Don't trust custom errors from the Browser. Safari breaks the spec.
            customError: Boolean(this.customError)
        };
        const formControl = this.validationTarget || this.input || void 0;
        let finalMessage = "";
        for (const validator of validators){
            const { isValid: isValid, message: message, invalidKeys: invalidKeys } = validator.checkValidity(this);
            if (isValid) continue;
            if (!finalMessage) finalMessage = message;
            if (invalidKeys?.length >= 0) invalidKeys.forEach((str)=>flags[str] = true);
        }
        if (!finalMessage) finalMessage = this.validationMessage;
        this.setValidity(flags, finalMessage, formControl);
    }
};
$e2f29c58e6e4411c$export$8f4cbae1a5641ee6.formAssociated = true;
(0, $e94b2b28708d0aa9$export$85c93885f16e8446)([
    (0, $28816b39eccda61d$export$d541bacb2bda4494)({
        reflect: true
    })
], $e2f29c58e6e4411c$export$8f4cbae1a5641ee6.prototype, "name", 2);
(0, $e94b2b28708d0aa9$export$85c93885f16e8446)([
    (0, $28816b39eccda61d$export$d541bacb2bda4494)({
        type: Boolean
    })
], $e2f29c58e6e4411c$export$8f4cbae1a5641ee6.prototype, "disabled", 2);
(0, $e94b2b28708d0aa9$export$85c93885f16e8446)([
    (0, $28816b39eccda61d$export$d541bacb2bda4494)({
        state: true,
        attribute: false
    })
], $e2f29c58e6e4411c$export$8f4cbae1a5641ee6.prototype, "valueHasChanged", 2);
(0, $e94b2b28708d0aa9$export$85c93885f16e8446)([
    (0, $28816b39eccda61d$export$d541bacb2bda4494)({
        state: true,
        attribute: false
    })
], $e2f29c58e6e4411c$export$8f4cbae1a5641ee6.prototype, "hasInteracted", 2);
(0, $e94b2b28708d0aa9$export$85c93885f16e8446)([
    (0, $28816b39eccda61d$export$d541bacb2bda4494)({
        attribute: "custom-error",
        reflect: true
    })
], $e2f29c58e6e4411c$export$8f4cbae1a5641ee6.prototype, "customError", 2);
(0, $e94b2b28708d0aa9$export$85c93885f16e8446)([
    (0, $28816b39eccda61d$export$d541bacb2bda4494)({
        attribute: false,
        state: true,
        type: Object
    })
], $e2f29c58e6e4411c$export$8f4cbae1a5641ee6.prototype, "validity", 1);


/*! Copyright 2026 Fonticons, Inc. - https://webawesome.com/license */ /*! Copyright 2026 Fonticons, Inc. - https://webawesome.com/license */ // src/translations/en.ts
const $bb622eb0f56d1341$var$connectedElements = new Set();
const $bb622eb0f56d1341$var$translations = new Map();
let $bb622eb0f56d1341$var$fallback;
let $bb622eb0f56d1341$var$documentDirection = 'ltr';
let $bb622eb0f56d1341$var$documentLanguage = 'en';
const $bb622eb0f56d1341$var$isClient = typeof MutationObserver !== "undefined" && typeof document !== "undefined" && typeof document.documentElement !== "undefined";
if ($bb622eb0f56d1341$var$isClient) {
    const documentElementObserver = new MutationObserver($bb622eb0f56d1341$export$722fbec263ad908a);
    $bb622eb0f56d1341$var$documentDirection = document.documentElement.dir || 'ltr';
    $bb622eb0f56d1341$var$documentLanguage = document.documentElement.lang || navigator.language;
    documentElementObserver.observe(document.documentElement, {
        attributes: true,
        attributeFilter: [
            'dir',
            'lang'
        ]
    });
}
function $bb622eb0f56d1341$export$2332cb3ce32cc839(...translation) {
    translation.map((t)=>{
        const code = t.$code.toLowerCase();
        if ($bb622eb0f56d1341$var$translations.has(code)) $bb622eb0f56d1341$var$translations.set(code, Object.assign(Object.assign({}, $bb622eb0f56d1341$var$translations.get(code)), t));
        else $bb622eb0f56d1341$var$translations.set(code, t);
        if (!$bb622eb0f56d1341$var$fallback) $bb622eb0f56d1341$var$fallback = t;
    });
    $bb622eb0f56d1341$export$722fbec263ad908a();
}
function $bb622eb0f56d1341$export$722fbec263ad908a() {
    if ($bb622eb0f56d1341$var$isClient) {
        $bb622eb0f56d1341$var$documentDirection = document.documentElement.dir || 'ltr';
        $bb622eb0f56d1341$var$documentLanguage = document.documentElement.lang || navigator.language;
    }
    [
        ...$bb622eb0f56d1341$var$connectedElements.keys()
    ].map((el)=>{
        if (typeof el.requestUpdate === 'function') el.requestUpdate();
    });
}
class $bb622eb0f56d1341$export$b1a2fed5bb41b893 {
    constructor(host){
        this.host = host;
        this.host.addController(this);
    }
    hostConnected() {
        $bb622eb0f56d1341$var$connectedElements.add(this.host);
    }
    hostDisconnected() {
        $bb622eb0f56d1341$var$connectedElements.delete(this.host);
    }
    dir() {
        return `${this.host.dir || $bb622eb0f56d1341$var$documentDirection}`.toLowerCase();
    }
    lang() {
        return `${this.host.lang || $bb622eb0f56d1341$var$documentLanguage}`.toLowerCase();
    }
    getTranslationData(lang) {
        var _a, _b;
        const locale = new Intl.Locale(lang.replace(/_/g, '-'));
        const language = locale === null || locale === void 0 ? void 0 : locale.language.toLowerCase();
        const region = (_b = (_a = locale === null || locale === void 0 ? void 0 : locale.region) === null || _a === void 0 ? void 0 : _a.toLowerCase()) !== null && _b !== void 0 ? _b : '';
        const primary = $bb622eb0f56d1341$var$translations.get(`${language}-${region}`);
        const secondary = $bb622eb0f56d1341$var$translations.get(language);
        return {
            locale: locale,
            language: language,
            region: region,
            primary: primary,
            secondary: secondary
        };
    }
    exists(key, options) {
        var _a;
        const { primary: primary, secondary: secondary } = this.getTranslationData((_a = options.lang) !== null && _a !== void 0 ? _a : this.lang());
        options = Object.assign({
            includeFallback: false
        }, options);
        if (primary && primary[key] || secondary && secondary[key] || options.includeFallback && $bb622eb0f56d1341$var$fallback && $bb622eb0f56d1341$var$fallback[key]) return true;
        return false;
    }
    term(key, ...args) {
        const { primary: primary, secondary: secondary } = this.getTranslationData(this.lang());
        let term;
        if (primary && primary[key]) term = primary[key];
        else if (secondary && secondary[key]) term = secondary[key];
        else if ($bb622eb0f56d1341$var$fallback && $bb622eb0f56d1341$var$fallback[key]) term = $bb622eb0f56d1341$var$fallback[key];
        else {
            console.error(`No translation found for: ${String(key)}`);
            return String(key);
        }
        if (typeof term === 'function') return term(...args);
        return term;
    }
    date(dateToFormat, options) {
        dateToFormat = new Date(dateToFormat);
        return new Intl.DateTimeFormat(this.lang(), options).format(dateToFormat);
    }
    number(numberToFormat, options) {
        numberToFormat = Number(numberToFormat);
        return isNaN(numberToFormat) ? '' : new Intl.NumberFormat(this.lang(), options).format(numberToFormat);
    }
    relativeTime(value, unit, options) {
        return new Intl.RelativeTimeFormat(this.lang(), options).format(value, unit);
    }
}


var $3a3ae84651facbf4$var$translation = {
    $code: "en",
    $name: "English",
    $dir: "ltr",
    carousel: "Carousel",
    clearEntry: "Clear entry",
    close: "Close",
    copied: "Copied",
    copy: "Copy",
    currentValue: "Current value",
    dropFileHere: "Drop file here or click to browse",
    decrement: "Decrement",
    dropFilesHere: "Drop files here or click to browse",
    error: "Error",
    goToSlide: (slide, count)=>`Go to slide ${slide} of ${count}`,
    hidePassword: "Hide password",
    increment: "Increment",
    loading: "Loading",
    nextSlide: "Next slide",
    numOptionsSelected: (num)=>{
        if (num === 0) return "No options selected";
        if (num === 1) return "1 option selected";
        return `${num} options selected`;
    },
    pauseAnimation: "Pause animation",
    playAnimation: "Play animation",
    previousSlide: "Previous slide",
    progress: "Progress",
    remove: "Remove",
    resize: "Resize",
    scrollableRegion: "Scrollable region",
    scrollToEnd: "Scroll to end",
    scrollToStart: "Scroll to start",
    selectAColorFromTheScreen: "Select a color from the screen",
    showPassword: "Show password",
    slideNum: (slide)=>`Slide ${slide}`,
    toggleColorFormat: "Toggle color format",
    zoomIn: "Zoom in",
    zoomOut: "Zoom out"
};
(0, $bb622eb0f56d1341$export$2332cb3ce32cc839)($3a3ae84651facbf4$var$translation);
var $3a3ae84651facbf4$export$802b895dc4aecf21 = $3a3ae84651facbf4$var$translation;



var $7fddb19538fc1728$export$b1a2fed5bb41b893 = class extends (0, $bb622eb0f56d1341$export$b1a2fed5bb41b893) {
};
(0, $bb622eb0f56d1341$export$2332cb3ce32cc839)((0, $3a3ae84651facbf4$export$802b895dc4aecf21));


/*! Copyright 2026 Fonticons, Inc. - https://webawesome.com/license */ // src/internal/watch.ts
function $3079f7c458d2314a$export$3db5d71bdb2d5499(propertyName, options) {
    const resolvedOptions = {
        waitUntilFirstUpdate: false,
        ...options
    };
    return (proto, decoratedFnName)=>{
        const { update: update } = proto;
        const watchedProperties = Array.isArray(propertyName) ? propertyName : [
            propertyName
        ];
        proto.update = function(changedProps) {
            watchedProperties.forEach((property)=>{
                const key = property;
                if (changedProps.has(key)) {
                    const oldValue = changedProps.get(key);
                    const newValue = this[key];
                    if (oldValue !== newValue) {
                        if (!resolvedOptions.waitUntilFirstUpdate || this.hasUpdated) this[decoratedFnName](oldValue, newValue);
                    }
                }
            });
            update.call(this, changedProps);
        };
    };
}







/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */ const $39adefad669ed5a7$export$9ba3b3f20a85bfa = {
    ATTRIBUTE: 1,
    CHILD: 2,
    PROPERTY: 3,
    BOOLEAN_ATTRIBUTE: 4,
    EVENT: 5,
    ELEMENT: 6
}, $39adefad669ed5a7$export$99b43ad1ed32e735 = (t)=>(...e)=>({
            _$litDirective$: t,
            values: e
        });
class $39adefad669ed5a7$export$befdefbdce210f91 {
    constructor(t){}
    get _$AU() {
        return this._$AM._$AU;
    }
    _$AT(t, e, i) {
        this._$Ct = t, this._$AM = e, this._$Ci = i;
    }
    _$AS(t, e) {
        return this.update(t, e);
    }
    update(t, e) {
        return this.render(...e);
    }
}


/**
 * @license
 * Copyright 2018 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */ const $b5822ac1f58ba956$export$56cc687933817664 = (0, $39adefad669ed5a7$export$99b43ad1ed32e735)(class extends (0, $39adefad669ed5a7$export$befdefbdce210f91) {
    constructor(t){
        if (super(t), t.type !== (0, $39adefad669ed5a7$export$9ba3b3f20a85bfa).ATTRIBUTE || "class" !== t.name || t.strings?.length > 2) throw Error("`classMap()` can only be used in the `class` attribute and must be the only part in the attribute.");
    }
    render(t) {
        return " " + Object.keys(t).filter((s)=>t[s]).join(" ") + " ";
    }
    update(s, [i]) {
        if (void 0 === this.st) {
            this.st = new Set, void 0 !== s.strings && (this.nt = new Set(s.strings.join(" ").split(/\s/).filter((t)=>"" !== t)));
            for(const t in i)i[t] && !this.nt?.has(t) && this.st.add(t);
            return this.render(i);
        }
        const r = s.element.classList;
        for (const t of this.st)t in i || (r.remove(t), this.st.delete(t));
        for(const t in i){
            const s = !!i[t];
            s === this.st.has(t) || this.nt?.has(t) || (s ? (r.add(t), this.st.add(t)) : (r.remove(t), this.st.delete(t)));
        }
        return 0, $aed1389927a5dd65$export$9c068ae9cc5db4e8;
    }
});




var $74429743c58e838b$export$4cb7f22f6ce219b4 = class extends (0, $7b33480fbd5323dc$export$1c2340e2bfaed5f9) {
    constructor(){
        super(...arguments);
        this.localize = new (0, $7fddb19538fc1728$export$b1a2fed5bb41b893)(this);
        this.isAnimating = false;
        this.open = false;
        this.disabled = false;
        this.appearance = "outlined";
        this.iconPlacement = "end";
    }
    disconnectedCallback() {
        super.disconnectedCallback();
        this.detailsObserver?.disconnect();
    }
    firstUpdated() {
        this.body.style.height = this.open ? "auto" : "0";
        if (this.open) this.details.open = true;
        this.detailsObserver = new MutationObserver((changes)=>{
            for (const change of changes)if (change.type === "attributes" && change.attributeName === "open") {
                if (this.details.open) this.show();
                else this.hide();
            }
        });
        this.detailsObserver.observe(this.details, {
            attributes: true
        });
    }
    updated(changedProperties) {
        if (changedProperties.has("isAnimating")) this.customStates.set("animating", this.isAnimating);
    }
    handleSummaryClick(event) {
        const eventPath = event.composedPath();
        const hasInteractiveElement = eventPath.some((element)=>{
            if (!(element instanceof HTMLElement)) return false;
            const tagName = element.tagName?.toLowerCase();
            if ([
                "a",
                "button",
                "input",
                "textarea",
                "select"
            ].includes(tagName)) return true;
            if (element instanceof (0, $e2f29c58e6e4411c$export$8f4cbae1a5641ee6)) return !("disabled" in element) || !element.disabled;
            return false;
        });
        if (hasInteractiveElement) return;
        event.preventDefault();
        if (!this.disabled) {
            if (this.open) this.hide();
            else this.show();
            this.header.focus();
        }
    }
    handleSummaryKeyDown(event) {
        if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            if (this.open) this.hide();
            else this.show();
        }
        if (event.key === "ArrowUp" || event.key === "ArrowLeft") {
            event.preventDefault();
            this.hide();
        }
        if (event.key === "ArrowDown" || event.key === "ArrowRight") {
            event.preventDefault();
            this.show();
        }
    }
    /** Closes other <wa-details> elements in the same document when they have the same name. */ closeOthersWithSameName() {
        if (!this.name) return;
        const root = this.getRootNode();
        const otherDetails = root.querySelectorAll(`wa-details[name="${this.name}"]`);
        otherDetails.forEach((detail)=>{
            if (detail !== this && detail.open) detail.open = false;
        });
    }
    async handleOpenChange() {
        if (this.open) {
            this.details.open = true;
            const waShow = new (0, $eb653cf7dcf5204d$export$dd0bb25790ab4015)();
            this.dispatchEvent(waShow);
            if (waShow.defaultPrevented) {
                this.open = false;
                this.details.open = false;
                return;
            }
            this.closeOthersWithSameName();
            this.isAnimating = true;
            const duration = (0, $fbf2d72871bb3665$export$ecae829bb3747ea6)(getComputedStyle(this.body).getPropertyValue("--show-duration"));
            await (0, $fbf2d72871bb3665$export$e3607ec2d7a891c4)(this.body, [
                {
                    height: "0",
                    opacity: "0"
                },
                {
                    height: `${this.body.scrollHeight}px`,
                    opacity: "1"
                }
            ], {
                duration: duration,
                easing: "linear"
            });
            this.body.style.height = "auto";
            this.isAnimating = false;
            this.dispatchEvent(new (0, $c60b6726542b418b$export$b9e1539da35189ca)());
        } else {
            const waHide = new (0, $d0d79e225dd42d88$export$e4267f9b469eac96)();
            this.dispatchEvent(waHide);
            if (waHide.defaultPrevented) {
                this.details.open = true;
                this.open = true;
                return;
            }
            this.isAnimating = true;
            const duration = (0, $fbf2d72871bb3665$export$ecae829bb3747ea6)(getComputedStyle(this.body).getPropertyValue("--hide-duration"));
            await (0, $fbf2d72871bb3665$export$e3607ec2d7a891c4)(this.body, [
                {
                    height: `${this.body.scrollHeight}px`,
                    opacity: "1"
                },
                {
                    height: "0",
                    opacity: "0"
                }
            ], {
                duration: duration,
                easing: "linear"
            });
            this.body.style.height = "auto";
            this.isAnimating = false;
            this.details.open = false;
            this.dispatchEvent(new (0, $ead071f558d32283$export$7b1e7adde2f1dd6c)());
        }
    }
    /** Shows the details. */ async show() {
        if (this.open || this.disabled) return void 0;
        this.open = true;
        return (0, $25db84cda1afb88a$export$6608ab6fe9313967)(this, "wa-after-show");
    }
    /** Hides the details */ async hide() {
        if (!this.open || this.disabled) return void 0;
        this.open = false;
        return (0, $25db84cda1afb88a$export$6608ab6fe9313967)(this, "wa-after-hide");
    }
    render() {
        const isRtl = !this.hasUpdated ? this.dir === "rtl" : this.localize.dir() === "rtl";
        return (0, $aed1389927a5dd65$export$c0bb0b647f701bb5)`
      <details part="base">
        <summary
          part="header"
          role="button"
          aria-expanded=${this.open ? "true" : "false"}
          aria-controls="content"
          aria-disabled=${this.disabled ? "true" : "false"}
          tabindex=${this.disabled ? "-1" : "0"}
          @click=${this.handleSummaryClick}
          @keydown=${this.handleSummaryKeyDown}
        >
          <slot name="summary" part="summary">${this.summary}</slot>

          <span part="icon">
            <slot name="expand-icon">
              <wa-icon library="system" variant="solid" name=${isRtl ? "chevron-left" : "chevron-right"}></wa-icon>
            </slot>
            <slot name="collapse-icon">
              <wa-icon library="system" variant="solid" name=${isRtl ? "chevron-left" : "chevron-right"}></wa-icon>
            </slot>
          </span>
        </summary>

        <div
          class=${(0, $b5822ac1f58ba956$export$56cc687933817664)({
            body: true,
            animating: this.isAnimating
        })}
          role="region"
          aria-labelledby="header"
        >
          <slot part="content" id="content" class="content"></slot>
        </div>
      </details>
    `;
    }
};
$74429743c58e838b$export$4cb7f22f6ce219b4.css = (0, $768d3457be40e294$export$e0460a263d3b7bef);
(0, $e94b2b28708d0aa9$export$85c93885f16e8446)([
    (0, $c0447c72baf98ff7$export$2fa187e846a241c4)("details")
], $74429743c58e838b$export$4cb7f22f6ce219b4.prototype, "details", 2);
(0, $e94b2b28708d0aa9$export$85c93885f16e8446)([
    (0, $c0447c72baf98ff7$export$2fa187e846a241c4)("summary")
], $74429743c58e838b$export$4cb7f22f6ce219b4.prototype, "header", 2);
(0, $e94b2b28708d0aa9$export$85c93885f16e8446)([
    (0, $c0447c72baf98ff7$export$2fa187e846a241c4)(".body")
], $74429743c58e838b$export$4cb7f22f6ce219b4.prototype, "body", 2);
(0, $e94b2b28708d0aa9$export$85c93885f16e8446)([
    (0, $c0447c72baf98ff7$export$2fa187e846a241c4)(".expand-icon-slot")
], $74429743c58e838b$export$4cb7f22f6ce219b4.prototype, "expandIconSlot", 2);
(0, $e94b2b28708d0aa9$export$85c93885f16e8446)([
    (0, $a73bb3d3a9a88bf1$export$ca000e230c0caa3e)()
], $74429743c58e838b$export$4cb7f22f6ce219b4.prototype, "isAnimating", 2);
(0, $e94b2b28708d0aa9$export$85c93885f16e8446)([
    (0, $28816b39eccda61d$export$d541bacb2bda4494)({
        type: Boolean,
        reflect: true
    })
], $74429743c58e838b$export$4cb7f22f6ce219b4.prototype, "open", 2);
(0, $e94b2b28708d0aa9$export$85c93885f16e8446)([
    (0, $28816b39eccda61d$export$d541bacb2bda4494)()
], $74429743c58e838b$export$4cb7f22f6ce219b4.prototype, "summary", 2);
(0, $e94b2b28708d0aa9$export$85c93885f16e8446)([
    (0, $28816b39eccda61d$export$d541bacb2bda4494)({
        reflect: true
    })
], $74429743c58e838b$export$4cb7f22f6ce219b4.prototype, "name", 2);
(0, $e94b2b28708d0aa9$export$85c93885f16e8446)([
    (0, $28816b39eccda61d$export$d541bacb2bda4494)({
        type: Boolean,
        reflect: true
    })
], $74429743c58e838b$export$4cb7f22f6ce219b4.prototype, "disabled", 2);
(0, $e94b2b28708d0aa9$export$85c93885f16e8446)([
    (0, $28816b39eccda61d$export$d541bacb2bda4494)({
        reflect: true
    })
], $74429743c58e838b$export$4cb7f22f6ce219b4.prototype, "appearance", 2);
(0, $e94b2b28708d0aa9$export$85c93885f16e8446)([
    (0, $28816b39eccda61d$export$d541bacb2bda4494)({
        attribute: "icon-placement",
        reflect: true
    })
], $74429743c58e838b$export$4cb7f22f6ce219b4.prototype, "iconPlacement", 2);
(0, $e94b2b28708d0aa9$export$85c93885f16e8446)([
    (0, $3079f7c458d2314a$export$3db5d71bdb2d5499)("open", {
        waitUntilFirstUpdate: true
    })
], $74429743c58e838b$export$4cb7f22f6ce219b4.prototype, "handleOpenChange", 1);
$74429743c58e838b$export$4cb7f22f6ce219b4 = (0, $e94b2b28708d0aa9$export$85c93885f16e8446)([
    (0, $b777701f54f11b66$export$da64fc29f17f9d0e)("wa-details")
], $74429743c58e838b$export$4cb7f22f6ce219b4);











/*! Copyright 2026 Fonticons, Inc. - https://webawesome.com/license */ /*! Copyright 2026 Fonticons, Inc. - https://webawesome.com/license */ // src/events/error.ts
var $0564bf32056f88f2$export$70537e1409e8a4d5 = class extends Event {
    constructor(){
        super("wa-error", {
            bubbles: true,
            cancelable: false,
            composed: true
        });
    }
};


/*! Copyright 2026 Fonticons, Inc. - https://webawesome.com/license */ // src/events/load.ts
var $46d0be887ab0f6da$export$93d315c41534ba24 = class extends Event {
    constructor(){
        super("wa-load", {
            bubbles: true,
            cancelable: false,
            composed: true
        });
    }
};


/*! Copyright 2026 Fonticons, Inc. - https://webawesome.com/license */ // src/components/icon/icon.styles.ts

var $1a251f6e43e4df44$export$f0b0874d64866432 = (0, $987a32d81eef3330$export$dbf350e5966cf602)`
  :host {
    --primary-color: currentColor;
    --primary-opacity: 1;
    --secondary-color: currentColor;
    --secondary-opacity: 0.4;
    --rotate-angle: 0deg;

    box-sizing: content-box;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    vertical-align: -0.125em;
  }

  /* Standard */
  :host(:not([auto-width])) {
    width: 1.25em;
    height: 1em;
  }

  /* Auto-width */
  :host([auto-width]) {
    width: auto;
    height: 1em;
  }

  svg {
    height: 1em;
    overflow: visible;
    width: auto;

    /* Duotone colors with path-specific opacity fallback */
    path[data-duotone-primary] {
      color: var(--primary-color);
      opacity: var(--path-opacity, var(--primary-opacity));
    }

    path[data-duotone-secondary] {
      color: var(--secondary-color);
      opacity: var(--path-opacity, var(--secondary-opacity));
    }
  }

  /* Rotation */
  :host([rotate]) {
    transform: rotate(var(--rotate-angle, 0deg));
  }

  /* Flipping */
  :host([flip='x']) {
    transform: scaleX(-1);
  }
  :host([flip='y']) {
    transform: scaleY(-1);
  }
  :host([flip='both']) {
    transform: scale(-1, -1);
  }

  /* Rotation and Flipping combined */
  :host([rotate][flip='x']) {
    transform: rotate(var(--rotate-angle, 0deg)) scaleX(-1);
  }
  :host([rotate][flip='y']) {
    transform: rotate(var(--rotate-angle, 0deg)) scaleY(-1);
  }
  :host([rotate][flip='both']) {
    transform: rotate(var(--rotate-angle, 0deg)) scale(-1, -1);
  }

  /* Animations */
  :host([animation='beat']) {
    animation-name: beat;
    animation-delay: var(--animation-delay, 0s);
    animation-direction: var(--animation-direction, normal);
    animation-duration: var(--animation-duration, 1s);
    animation-iteration-count: var(--animation-iteration-count, infinite);
    animation-timing-function: var(--animation-timing, ease-in-out);
  }

  :host([animation='fade']) {
    animation-name: fade;
    animation-delay: var(--animation-delay, 0s);
    animation-direction: var(--animation-direction, normal);
    animation-duration: var(--animation-duration, 1s);
    animation-iteration-count: var(--animation-iteration-count, infinite);
    animation-timing-function: var(--animation-timing, cubic-bezier(0.4, 0, 0.6, 1));
  }

  :host([animation='beat-fade']) {
    animation-name: beat-fade;
    animation-delay: var(--animation-delay, 0s);
    animation-direction: var(--animation-direction, normal);
    animation-duration: var(--animation-duration, 1s);
    animation-iteration-count: var(--animation-iteration-count, infinite);
    animation-timing-function: var(--animation-timing, cubic-bezier(0.4, 0, 0.6, 1));
  }

  :host([animation='bounce']) {
    animation-name: bounce;
    animation-delay: var(--animation-delay, 0s);
    animation-direction: var(--animation-direction, normal);
    animation-duration: var(--animation-duration, 1s);
    animation-iteration-count: var(--animation-iteration-count, infinite);
    animation-timing-function: var(--animation-timing, cubic-bezier(0.28, 0.84, 0.42, 1));
  }

  :host([animation='flip']) {
    animation-name: flip;
    animation-delay: var(--animation-delay, 0s);
    animation-direction: var(--animation-direction, normal);
    animation-duration: var(--animation-duration, 1s);
    animation-iteration-count: var(--animation-iteration-count, infinite);
    animation-timing-function: var(--animation-timing, ease-in-out);
  }

  :host([animation='shake']) {
    animation-name: shake;
    animation-delay: var(--animation-delay, 0s);
    animation-direction: var(--animation-direction, normal);
    animation-duration: var(--animation-duration, 1s);
    animation-iteration-count: var(--animation-iteration-count, infinite);
    animation-timing-function: var(--animation-timing, linear);
  }

  :host([animation='spin']) {
    animation-name: spin;
    animation-delay: var(--animation-delay, 0s);
    animation-direction: var(--animation-direction, normal);
    animation-duration: var(--animation-duration, 2s);
    animation-iteration-count: var(--animation-iteration-count, infinite);
    animation-timing-function: var(--animation-timing, linear);
  }

  :host([animation='spin-pulse']) {
    animation-name: spin-pulse;
    animation-direction: var(--animation-direction, normal);
    animation-duration: var(--animation-duration, 1s);
    animation-iteration-count: var(--animation-iteration-count, infinite);
    animation-timing-function: var(--animation-timing, steps(8));
  }

  :host([animation='spin-reverse']) {
    animation-name: spin;
    animation-delay: var(--animation-delay, 0s);
    animation-direction: var(--animation-direction, reverse);
    animation-duration: var(--animation-duration, 2s);
    animation-iteration-count: var(--animation-iteration-count, infinite);
    animation-timing-function: var(--animation-timing, linear);
  }

  /* Keyframes */
  @media (prefers-reduced-motion: reduce) {
    :host([animation='beat']),
    :host([animation='bounce']),
    :host([animation='fade']),
    :host([animation='beat-fade']),
    :host([animation='flip']),
    :host([animation='shake']),
    :host([animation='spin']),
    :host([animation='spin-pulse']),
    :host([animation='spin-reverse']) {
      animation: none !important;
      transition: none !important;
    }
  }
  @keyframes beat {
    0%,
    90% {
      transform: scale(1);
    }
    45% {
      transform: scale(var(--beat-scale, 1.25));
    }
  }

  @keyframes fade {
    50% {
      opacity: var(--fade-opacity, 0.4);
    }
  }

  @keyframes beat-fade {
    0%,
    100% {
      opacity: var(--beat-fade-opacity, 0.4);
      transform: scale(1);
    }
    50% {
      opacity: 1;
      transform: scale(var(--beat-fade-scale, 1.125));
    }
  }

  @keyframes bounce {
    0% {
      transform: scale(1, 1) translateY(0);
    }
    10% {
      transform: scale(var(--bounce-start-scale-x, 1.1), var(--bounce-start-scale-y, 0.9)) translateY(0);
    }
    30% {
      transform: scale(var(--bounce-jump-scale-x, 0.9), var(--bounce-jump-scale-y, 1.1))
        translateY(var(--bounce-height, -0.5em));
    }
    50% {
      transform: scale(var(--bounce-land-scale-x, 1.05), var(--bounce-land-scale-y, 0.95)) translateY(0);
    }
    57% {
      transform: scale(1, 1) translateY(var(--bounce-rebound, -0.125em));
    }
    64% {
      transform: scale(1, 1) translateY(0);
    }
    100% {
      transform: scale(1, 1) translateY(0);
    }
  }

  @keyframes flip {
    50% {
      transform: rotate3d(var(--flip-x, 0), var(--flip-y, 1), var(--flip-z, 0), var(--flip-angle, -180deg));
    }
  }

  @keyframes shake {
    0% {
      transform: rotate(-15deg);
    }
    4% {
      transform: rotate(15deg);
    }
    8%,
    24% {
      transform: rotate(-18deg);
    }
    12%,
    28% {
      transform: rotate(18deg);
    }
    16% {
      transform: rotate(-22deg);
    }
    20% {
      transform: rotate(22deg);
    }
    32% {
      transform: rotate(-12deg);
    }
    36% {
      transform: rotate(12deg);
    }
    40%,
    100% {
      transform: rotate(0deg);
    }
  }

  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }

  @keyframes spin-pulse {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
`;


/*! Copyright 2026 Fonticons, Inc. - https://webawesome.com/license */ /*! Copyright 2026 Fonticons, Inc. - https://webawesome.com/license */ // src/components/icon/library.system.ts
function $12f398f9a3af62d3$var$dataUri(svg) {
    return `data:image/svg+xml,${encodeURIComponent(svg)}`;
}
var $12f398f9a3af62d3$export$df03f54e09e486fa = {
    //
    // Solid variant
    //
    solid: {
        check: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><!--! Font Awesome Free 7.0.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2025 Fonticons, Inc. --><path fill="currentColor" d="M434.8 70.1c14.3 10.4 17.5 30.4 7.1 44.7l-256 352c-5.5 7.6-14 12.3-23.4 13.1s-18.5-2.7-25.1-9.3l-128-128c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0l101.5 101.5 234-321.7c10.4-14.3 30.4-17.5 44.7-7.1z"/></svg>`,
        "chevron-down": `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><!--! Font Awesome Free 7.0.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2025 Fonticons, Inc. --><path fill="currentColor" d="M201.4 406.6c12.5 12.5 32.8 12.5 45.3 0l192-192c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L224 338.7 54.6 169.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l192 192z"/></svg>`,
        "chevron-left": `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512"><!--! Font Awesome Free 7.0.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2025 Fonticons, Inc. --><path fill="currentColor" d="M9.4 233.4c-12.5 12.5-12.5 32.8 0 45.3l192 192c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L77.3 256 246.6 86.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0l-192 192z"/></svg>`,
        "chevron-right": `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512"><!--! Font Awesome Free 7.0.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2025 Fonticons, Inc. --><path fill="currentColor" d="M311.1 233.4c12.5 12.5 12.5 32.8 0 45.3l-192 192c-12.5 12.5-32.8 12.5-45.3 0s-12.5-32.8 0-45.3L243.2 256 73.9 86.6c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0l192 192z"/></svg>`,
        circle: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><!--! Font Awesome Free 7.0.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2025 Fonticons, Inc. --><path fill="currentColor" d="M0 256a256 256 0 1 1 512 0 256 256 0 1 1 -512 0z"/></svg>`,
        eyedropper: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><!--! Font Awesome Free 7.0.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2025 Fonticons, Inc. --><path fill="currentColor" d="M341.6 29.2l-101.6 101.6-9.4-9.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l160 160c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3l-9.4-9.4 101.6-101.6c39-39 39-102.2 0-141.1s-102.2-39-141.1 0zM55.4 323.3c-15 15-23.4 35.4-23.4 56.6l0 42.4-26.6 39.9c-8.5 12.7-6.8 29.6 4 40.4s27.7 12.5 40.4 4l39.9-26.6 42.4 0c21.2 0 41.6-8.4 56.6-23.4l109.4-109.4-45.3-45.3-109.4 109.4c-3 3-7.1 4.7-11.3 4.7l-36.1 0 0-36.1c0-4.2 1.7-8.3 4.7-11.3l109.4-109.4-45.3-45.3-109.4 109.4z"/></svg>`,
        file: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640"><!--!Font Awesome Free 7.1.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2026 Fonticons, Inc.--><path fill="currentColor" d="M192 64C156.7 64 128 92.7 128 128L128 512C128 547.3 156.7 576 192 576L448 576C483.3 576 512 547.3 512 512L512 234.5C512 217.5 505.3 201.2 493.3 189.2L386.7 82.7C374.7 70.7 358.5 64 341.5 64L192 64zM453.5 240L360 240C346.7 240 336 229.3 336 216L336 122.5L453.5 240z"/></svg>`,
        "file-audio": `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640"><!--!Font Awesome Free 7.1.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2026 Fonticons, Inc.--><path fill="currentColor" d="M128 128C128 92.7 156.7 64 192 64L341.5 64C358.5 64 374.8 70.7 386.8 82.7L493.3 189.3C505.3 201.3 512 217.6 512 234.6L512 512C512 547.3 483.3 576 448 576L192 576C156.7 576 128 547.3 128 512L128 128zM336 122.5L336 216C336 229.3 346.7 240 360 240L453.5 240L336 122.5zM389.8 307.7C380.7 301.4 368.3 303.6 362 312.7C355.7 321.8 357.9 334.2 367 340.5C390.9 357.2 406.4 384.8 406.4 416C406.4 447.2 390.8 474.9 367 491.5C357.9 497.8 355.7 510.3 362 519.3C368.3 528.3 380.8 530.6 389.8 524.3C423.9 500.5 446.4 460.8 446.4 416C446.4 371.2 424 331.5 389.8 307.7zM208 376C199.2 376 192 383.2 192 392L192 440C192 448.8 199.2 456 208 456L232 456L259.2 490C262.2 493.8 266.8 496 271.7 496L272 496C280.8 496 288 488.8 288 480L288 352C288 343.2 280.8 336 272 336L271.7 336C266.8 336 262.2 338.2 259.2 342L232 376L208 376zM336 448.2C336 458.9 346.5 466.4 354.9 459.8C367.8 449.5 376 433.7 376 416C376 398.3 367.8 382.5 354.9 372.2C346.5 365.5 336 373.1 336 383.8L336 448.3z"/></svg>`,
        "file-code": `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640"><!--!Font Awesome Free 7.1.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2026 Fonticons, Inc.--><path fill="currentColor" d="M128 128C128 92.7 156.7 64 192 64L341.5 64C358.5 64 374.8 70.7 386.8 82.7L493.3 189.3C505.3 201.3 512 217.6 512 234.6L512 512C512 547.3 483.3 576 448 576L192 576C156.7 576 128 547.3 128 512L128 128zM336 122.5L336 216C336 229.3 346.7 240 360 240L453.5 240L336 122.5zM282.2 359.6C290.8 349.5 289.7 334.4 279.6 325.8C269.5 317.2 254.4 318.3 245.8 328.4L197.8 384.4C190.1 393.4 190.1 406.6 197.8 415.6L245.8 471.6C254.4 481.7 269.6 482.8 279.6 474.2C289.6 465.6 290.8 450.4 282.2 440.4L247.6 400L282.2 359.6zM394.2 328.4C385.6 318.3 370.4 317.2 360.4 325.8C350.4 334.4 349.2 349.6 357.8 359.6L392.4 400L357.8 440.4C349.2 450.5 350.3 465.6 360.4 474.2C370.5 482.8 385.6 481.7 394.2 471.6L442.2 415.6C449.9 406.6 449.9 393.4 442.2 384.4L394.2 328.4z"/></svg>`,
        "file-excel": `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640"><!--!Font Awesome Free 7.1.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2026 Fonticons, Inc.--><path fill="currentColor" d="M128 128C128 92.7 156.7 64 192 64L341.5 64C358.5 64 374.8 70.7 386.8 82.7L493.3 189.3C505.3 201.3 512 217.6 512 234.6L512 512C512 547.3 483.3 576 448 576L192 576C156.7 576 128 547.3 128 512L128 128zM336 122.5L336 216C336 229.3 346.7 240 360 240L453.5 240L336 122.5zM292 330.7C284.6 319.7 269.7 316.7 258.7 324C247.7 331.3 244.7 346.3 252 357.3L291.2 416L252 474.7C244.6 485.7 247.6 500.6 258.7 508C269.8 515.4 284.6 512.4 292 501.3L320 459.3L348 501.3C355.4 512.3 370.3 515.3 381.3 508C392.3 500.7 395.3 485.7 388 474.7L348.8 416L388 357.3C395.4 346.3 392.4 331.4 381.3 324C370.2 316.6 355.4 319.6 348 330.7L320 372.7L292 330.7z"/></svg>`,
        "file-image": `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640"><!--!Font Awesome Free 7.1.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2026 Fonticons, Inc.--><path fill="currentColor" d="M128 128C128 92.7 156.7 64 192 64L341.5 64C358.5 64 374.8 70.7 386.8 82.7L493.3 189.3C505.3 201.3 512 217.6 512 234.6L512 512C512 547.3 483.3 576 448 576L192 576C156.7 576 128 547.3 128 512L128 128zM336 122.5L336 216C336 229.3 346.7 240 360 240L453.5 240L336 122.5zM256 320C256 302.3 241.7 288 224 288C206.3 288 192 302.3 192 320C192 337.7 206.3 352 224 352C241.7 352 256 337.7 256 320zM220.6 512L419.4 512C435.2 512 448 499.2 448 483.4C448 476.1 445.2 469 440.1 463.7L343.3 361.9C337.3 355.6 328.9 352 320.1 352L319.8 352C311 352 302.7 355.6 296.6 361.9L199.9 463.7C194.8 469 192 476.1 192 483.4C192 499.2 204.8 512 220.6 512z"/></svg>`,
        "file-pdf": `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640"><!--!Font Awesome Free 7.1.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2026 Fonticons, Inc.--><path fill="currentColor" d="M128 64C92.7 64 64 92.7 64 128L64 512C64 547.3 92.7 576 128 576L208 576L208 464C208 428.7 236.7 400 272 400L448 400L448 234.5C448 217.5 441.3 201.2 429.3 189.2L322.7 82.7C310.7 70.7 294.5 64 277.5 64L128 64zM389.5 240L296 240C282.7 240 272 229.3 272 216L272 122.5L389.5 240zM272 444C261 444 252 453 252 464L252 592C252 603 261 612 272 612C283 612 292 603 292 592L292 564L304 564C337.1 564 364 537.1 364 504C364 470.9 337.1 444 304 444L272 444zM304 524L292 524L292 484L304 484C315 484 324 493 324 504C324 515 315 524 304 524zM400 444C389 444 380 453 380 464L380 592C380 603 389 612 400 612L432 612C460.7 612 484 588.7 484 560L484 496C484 467.3 460.7 444 432 444L400 444zM420 572L420 484L432 484C438.6 484 444 489.4 444 496L444 560C444 566.6 438.6 572 432 572L420 572zM508 464L508 592C508 603 517 612 528 612C539 612 548 603 548 592L548 548L576 548C587 548 596 539 596 528C596 517 587 508 576 508L548 508L548 484L576 484C587 484 596 475 596 464C596 453 587 444 576 444L528 444C517 444 508 453 508 464z"/></svg>`,
        "file-powerpoint": `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640"><!--!Font Awesome Free 7.1.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2026 Fonticons, Inc.--><path fill="currentColor" d="M128 128C128 92.7 156.7 64 192 64L341.5 64C358.5 64 374.8 70.7 386.8 82.7L493.3 189.3C505.3 201.3 512 217.6 512 234.6L512 512C512 547.3 483.3 576 448 576L192 576C156.7 576 128 547.3 128 512L128 128zM336 122.5L336 216C336 229.3 346.7 240 360 240L453.5 240L336 122.5zM280 320C266.7 320 256 330.7 256 344L256 488C256 501.3 266.7 512 280 512C293.3 512 304 501.3 304 488L304 464L328 464C367.8 464 400 431.8 400 392C400 352.2 367.8 320 328 320L280 320zM328 416L304 416L304 368L328 368C341.3 368 352 378.7 352 392C352 405.3 341.3 416 328 416z"/></svg>`,
        "file-video": `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640"><!--!Font Awesome Free 7.1.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2026 Fonticons, Inc.--><path fill="currentColor" d="M128 128C128 92.7 156.7 64 192 64L341.5 64C358.5 64 374.8 70.7 386.8 82.7L493.3 189.3C505.3 201.3 512 217.6 512 234.6L512 512C512 547.3 483.3 576 448 576L192 576C156.7 576 128 547.3 128 512L128 128zM336 122.5L336 216C336 229.3 346.7 240 360 240L453.5 240L336 122.5zM208 368L208 464C208 481.7 222.3 496 240 496L336 496C353.7 496 368 481.7 368 464L368 440L403 475C406.2 478.2 410.5 480 415 480C424.4 480 432 472.4 432 463L432 368.9C432 359.5 424.4 351.9 415 351.9C410.5 351.9 406.2 353.7 403 356.9L368 391.9L368 367.9C368 350.2 353.7 335.9 336 335.9L240 335.9C222.3 335.9 208 350.2 208 367.9z"/></svg>`,
        "file-word": `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640"><!--!Font Awesome Free 7.1.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2026 Fonticons, Inc.--><path fill="currentColor" d="M128 128C128 92.7 156.7 64 192 64L341.5 64C358.5 64 374.8 70.7 386.8 82.7L493.3 189.3C505.3 201.3 512 217.6 512 234.6L512 512C512 547.3 483.3 576 448 576L192 576C156.7 576 128 547.3 128 512L128 128zM336 122.5L336 216C336 229.3 346.7 240 360 240L453.5 240L336 122.5zM263.4 338.8C260.5 325.9 247.7 317.7 234.8 320.6C221.9 323.5 213.7 336.3 216.6 349.2L248.6 493.2C250.9 503.7 260 511.4 270.8 512C281.6 512.6 291.4 505.9 294.8 495.6L320 419.9L345.2 495.6C348.6 505.8 358.4 512.5 369.2 512C380 511.5 389.1 503.8 391.4 493.2L423.4 349.2C426.3 336.3 418.1 323.4 405.2 320.6C392.3 317.8 379.4 325.9 376.6 338.8L363.4 398.2L342.8 336.4C339.5 326.6 330.4 320 320 320C309.6 320 300.5 326.6 297.2 336.4L276.6 398.2L263.4 338.8z"/></svg>`,
        "file-zipper": `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640"><!--!Font Awesome Free 7.1.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2026 Fonticons, Inc.--><path fill="currentColor" d="M128 128C128 92.7 156.7 64 192 64L341.5 64C358.5 64 374.8 70.7 386.8 82.7L493.3 189.3C505.3 201.3 512 217.6 512 234.6L512 512C512 547.3 483.3 576 448 576L192 576C156.7 576 128 547.3 128 512L128 128zM336 122.5L336 216C336 229.3 346.7 240 360 240L453.5 240L336 122.5zM192 136C192 149.3 202.7 160 216 160L264 160C277.3 160 288 149.3 288 136C288 122.7 277.3 112 264 112L216 112C202.7 112 192 122.7 192 136zM192 232C192 245.3 202.7 256 216 256L264 256C277.3 256 288 245.3 288 232C288 218.7 277.3 208 264 208L216 208C202.7 208 192 218.7 192 232zM256 304L224 304C206.3 304 192 318.3 192 336L192 384C192 410.5 213.5 432 240 432C266.5 432 288 410.5 288 384L288 336C288 318.3 273.7 304 256 304zM240 368C248.8 368 256 375.2 256 384C256 392.8 248.8 400 240 400C231.2 400 224 392.8 224 384C224 375.2 231.2 368 240 368z"/></svg>`,
        "grip-vertical": `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512"><!--! Font Awesome Free 7.0.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2025 Fonticons, Inc. --><path fill="currentColor" d="M128 40c0-22.1-17.9-40-40-40L40 0C17.9 0 0 17.9 0 40L0 88c0 22.1 17.9 40 40 40l48 0c22.1 0 40-17.9 40-40l0-48zm0 192c0-22.1-17.9-40-40-40l-48 0c-22.1 0-40 17.9-40 40l0 48c0 22.1 17.9 40 40 40l48 0c22.1 0 40-17.9 40-40l0-48zM0 424l0 48c0 22.1 17.9 40 40 40l48 0c22.1 0 40-17.9 40-40l0-48c0-22.1-17.9-40-40-40l-48 0c-22.1 0-40 17.9-40 40zM320 40c0-22.1-17.9-40-40-40L232 0c-22.1 0-40 17.9-40 40l0 48c0 22.1 17.9 40 40 40l48 0c22.1 0 40-17.9 40-40l0-48zM192 232l0 48c0 22.1 17.9 40 40 40l48 0c22.1 0 40-17.9 40-40l0-48c0-22.1-17.9-40-40-40l-48 0c-22.1 0-40 17.9-40 40zM320 424c0-22.1-17.9-40-40-40l-48 0c-22.1 0-40 17.9-40 40l0 48c0 22.1 17.9 40 40 40l48 0c22.1 0 40-17.9 40-40l0-48z"/></svg>`,
        indeterminate: `<svg part="indeterminate-icon" class="icon" viewBox="0 0 16 16"><g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd" stroke-linecap="round"><g stroke="currentColor" stroke-width="2"><g transform="translate(2.285714 6.857143)"><path d="M10.2857143,1.14285714 L1.14285714,1.14285714"/></g></g></g></svg>`,
        minus: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><!--! Font Awesome Free 7.0.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2025 Fonticons, Inc. --><path fill="currentColor" d="M0 256c0-17.7 14.3-32 32-32l384 0c17.7 0 32 14.3 32 32s-14.3 32-32 32L32 288c-17.7 0-32-14.3-32-32z"/></svg>`,
        pause: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512"><!--! Font Awesome Free 7.0.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2025 Fonticons, Inc. --><path fill="currentColor" d="M48 32C21.5 32 0 53.5 0 80L0 432c0 26.5 21.5 48 48 48l64 0c26.5 0 48-21.5 48-48l0-352c0-26.5-21.5-48-48-48L48 32zm224 0c-26.5 0-48 21.5-48 48l0 352c0 26.5 21.5 48 48 48l64 0c26.5 0 48-21.5 48-48l0-352c0-26.5-21.5-48-48-48l-64 0z"/></svg>`,
        play: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><!--! Font Awesome Free 7.0.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2025 Fonticons, Inc. --><path fill="currentColor" d="M91.2 36.9c-12.4-6.8-27.4-6.5-39.6 .7S32 57.9 32 72l0 368c0 14.1 7.5 27.2 19.6 34.4s27.2 7.5 39.6 .7l336-184c12.8-7 20.8-20.5 20.8-35.1s-8-28.1-20.8-35.1l-336-184z"/></svg>`,
        plus: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640"><!--!Font Awesome Free 7.1.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2026 Fonticons, Inc.--><path fill="currentColor" d="M352 128C352 110.3 337.7 96 320 96C302.3 96 288 110.3 288 128L288 288L128 288C110.3 288 96 302.3 96 320C96 337.7 110.3 352 128 352L288 352L288 512C288 529.7 302.3 544 320 544C337.7 544 352 529.7 352 512L352 352L512 352C529.7 352 544 337.7 544 320C544 302.3 529.7 288 512 288L352 288L352 128z"/></svg>`,
        star: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512"><!--! Font Awesome Free 7.0.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2025 Fonticons, Inc. --><path fill="currentColor" d="M309.5-18.9c-4.1-8-12.4-13.1-21.4-13.1s-17.3 5.1-21.4 13.1L193.1 125.3 33.2 150.7c-8.9 1.4-16.3 7.7-19.1 16.3s-.5 18 5.8 24.4l114.4 114.5-25.2 159.9c-1.4 8.9 2.3 17.9 9.6 23.2s16.9 6.1 25 2L288.1 417.6 432.4 491c8 4.1 17.7 3.3 25-2s11-14.2 9.6-23.2L441.7 305.9 556.1 191.4c6.4-6.4 8.6-15.8 5.8-24.4s-10.1-14.9-19.1-16.3L383 125.3 309.5-18.9z"/></svg>`,
        upload: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640"><!--!Font Awesome Free 7.1.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2026 Fonticons, Inc.--><path fill="currentColor" d="M352 173.3L352 384C352 401.7 337.7 416 320 416C302.3 416 288 401.7 288 384L288 173.3L246.6 214.7C234.1 227.2 213.8 227.2 201.3 214.7C188.8 202.2 188.8 181.9 201.3 169.4L297.3 73.4C309.8 60.9 330.1 60.9 342.6 73.4L438.6 169.4C451.1 181.9 451.1 202.2 438.6 214.7C426.1 227.2 405.8 227.2 393.3 214.7L352 173.3zM320 464C364.2 464 400 428.2 400 384L480 384C515.3 384 544 412.7 544 448L544 480C544 515.3 515.3 544 480 544L160 544C124.7 544 96 515.3 96 480L96 448C96 412.7 124.7 384 160 384L240 384C240 428.2 275.8 464 320 464zM464 488C477.3 488 488 477.3 488 464C488 450.7 477.3 440 464 440C450.7 440 440 450.7 440 464C440 477.3 450.7 488 464 488z"/></svg>`,
        user: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><!--! Font Awesome Free 7.0.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2025 Fonticons, Inc. --><path fill="currentColor" d="M224 248a120 120 0 1 0 0-240 120 120 0 1 0 0 240zm-29.7 56C95.8 304 16 383.8 16 482.3 16 498.7 29.3 512 45.7 512l356.6 0c16.4 0 29.7-13.3 29.7-29.7 0-98.5-79.8-178.3-178.3-178.3l-59.4 0z"/></svg>`,
        xmark: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512"><!--! Font Awesome Free 7.0.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2025 Fonticons, Inc. --><path fill="currentColor" d="M55.1 73.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L147.2 256 9.9 393.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192.5 301.3 329.9 438.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.8 256 375.1 118.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192.5 210.7 55.1 73.4z"/></svg>`
    },
    //
    // Regular variant
    //
    regular: {
        "circle-question": `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><!--! Font Awesome Free 7.0.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2025 Fonticons, Inc. --><path fill="currentColor" d="M464 256a208 208 0 1 0 -416 0 208 208 0 1 0 416 0zM0 256a256 256 0 1 1 512 0 256 256 0 1 1 -512 0zm256-80c-17.7 0-32 14.3-32 32 0 13.3-10.7 24-24 24s-24-10.7-24-24c0-44.2 35.8-80 80-80s80 35.8 80 80c0 47.2-36 67.2-56 74.5l0 3.8c0 13.3-10.7 24-24 24s-24-10.7-24-24l0-8.1c0-20.5 14.8-35.2 30.1-40.2 6.4-2.1 13.2-5.5 18.2-10.3 4.3-4.2 7.7-10 7.7-19.6 0-17.7-14.3-32-32-32zM224 368a32 32 0 1 1 64 0 32 32 0 1 1 -64 0z"/></svg>`,
        "circle-xmark": `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><!--! Font Awesome Free 7.0.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2025 Fonticons, Inc. --><path fill="currentColor" d="M256 48a208 208 0 1 1 0 416 208 208 0 1 1 0-416zm0 464a256 256 0 1 0 0-512 256 256 0 1 0 0 512zM167 167c-9.4 9.4-9.4 24.6 0 33.9l55 55-55 55c-9.4 9.4-9.4 24.6 0 33.9s24.6 9.4 33.9 0l55-55 55 55c9.4 9.4 24.6 9.4 33.9 0s9.4-24.6 0-33.9l-55-55 55-55c9.4-9.4 9.4-24.6 0-33.9s-24.6-9.4-33.9 0l-55 55-55-55c-9.4-9.4-24.6-9.4-33.9 0z"/></svg>`,
        copy: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><!--! Font Awesome Free 7.0.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2025 Fonticons, Inc. --><path fill="currentColor" d="M384 336l-192 0c-8.8 0-16-7.2-16-16l0-256c0-8.8 7.2-16 16-16l133.5 0c4.2 0 8.3 1.7 11.3 4.7l58.5 58.5c3 3 4.7 7.1 4.7 11.3L400 320c0 8.8-7.2 16-16 16zM192 384l192 0c35.3 0 64-28.7 64-64l0-197.5c0-17-6.7-33.3-18.7-45.3L370.7 18.7C358.7 6.7 342.5 0 325.5 0L192 0c-35.3 0-64 28.7-64 64l0 256c0 35.3 28.7 64 64 64zM64 128c-35.3 0-64 28.7-64 64L0 448c0 35.3 28.7 64 64 64l192 0c35.3 0 64-28.7 64-64l0-16-48 0 0 16c0 8.8-7.2 16-16 16L64 464c-8.8 0-16-7.2-16-16l0-256c0-8.8 7.2-16 16-16l16 0 0-48-16 0z"/></svg>`,
        eye: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512"><!--! Font Awesome Free 7.0.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2025 Fonticons, Inc. --><path fill="currentColor" d="M288 80C222.8 80 169.2 109.6 128.1 147.7 89.6 183.5 63 226 49.4 256 63 286 89.6 328.5 128.1 364.3 169.2 402.4 222.8 432 288 432s118.8-29.6 159.9-67.7C486.4 328.5 513 286 526.6 256 513 226 486.4 183.5 447.9 147.7 406.8 109.6 353.2 80 288 80zM95.4 112.6C142.5 68.8 207.2 32 288 32s145.5 36.8 192.6 80.6c46.8 43.5 78.1 95.4 93 131.1 3.3 7.9 3.3 16.7 0 24.6-14.9 35.7-46.2 87.7-93 131.1-47.1 43.7-111.8 80.6-192.6 80.6S142.5 443.2 95.4 399.4c-46.8-43.5-78.1-95.4-93-131.1-3.3-7.9-3.3-16.7 0-24.6 14.9-35.7 46.2-87.7 93-131.1zM288 336c44.2 0 80-35.8 80-80 0-29.6-16.1-55.5-40-69.3-1.4 59.7-49.6 107.9-109.3 109.3 13.8 23.9 39.7 40 69.3 40zm-79.6-88.4c2.5 .3 5 .4 7.6 .4 35.3 0 64-28.7 64-64 0-2.6-.2-5.1-.4-7.6-37.4 3.9-67.2 33.7-71.1 71.1zm45.6-115c10.8-3 22.2-4.5 33.9-4.5 8.8 0 17.5 .9 25.8 2.6 .3 .1 .5 .1 .8 .2 57.9 12.2 101.4 63.7 101.4 125.2 0 70.7-57.3 128-128 128-61.6 0-113-43.5-125.2-101.4-1.8-8.6-2.8-17.5-2.8-26.6 0-11 1.4-21.8 4-32 .2-.7 .3-1.3 .5-1.9 11.9-43.4 46.1-77.6 89.5-89.5z"/></svg>`,
        "eye-slash": `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512"><!--! Font Awesome Free 7.0.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2025 Fonticons, Inc. --><path fill="currentColor" d="M41-24.9c-9.4-9.4-24.6-9.4-33.9 0S-2.3-.3 7 9.1l528 528c9.4 9.4 24.6 9.4 33.9 0s9.4-24.6 0-33.9l-96.4-96.4c2.7-2.4 5.4-4.8 8-7.2 46.8-43.5 78.1-95.4 93-131.1 3.3-7.9 3.3-16.7 0-24.6-14.9-35.7-46.2-87.7-93-131.1-47.1-43.7-111.8-80.6-192.6-80.6-56.8 0-105.6 18.2-146 44.2L41-24.9zM176.9 111.1c32.1-18.9 69.2-31.1 111.1-31.1 65.2 0 118.8 29.6 159.9 67.7 38.5 35.7 65.1 78.3 78.6 108.3-13.6 30-40.2 72.5-78.6 108.3-3.1 2.8-6.2 5.6-9.4 8.4L393.8 328c14-20.5 22.2-45.3 22.2-72 0-70.7-57.3-128-128-128-26.7 0-51.5 8.2-72 22.2l-39.1-39.1zm182 182l-108-108c11.1-5.8 23.7-9.1 37.1-9.1 44.2 0 80 35.8 80 80 0 13.4-3.3 26-9.1 37.1zM103.4 173.2l-34-34c-32.6 36.8-55 75.8-66.9 104.5-3.3 7.9-3.3 16.7 0 24.6 14.9 35.7 46.2 87.7 93 131.1 47.1 43.7 111.8 80.6 192.6 80.6 37.3 0 71.2-7.9 101.5-20.6L352.2 422c-20 6.4-41.4 10-64.2 10-65.2 0-118.8-29.6-159.9-67.7-38.5-35.7-65.1-78.3-78.6-108.3 10.4-23.1 28.6-53.6 54-82.8z"/></svg>`,
        star: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512"><!--! Font Awesome Free 7.0.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2025 Fonticons, Inc. --><path fill="currentColor" d="M288.1-32c9 0 17.3 5.1 21.4 13.1L383 125.3 542.9 150.7c8.9 1.4 16.3 7.7 19.1 16.3s.5 18-5.8 24.4L441.7 305.9 467 465.8c1.4 8.9-2.3 17.9-9.6 23.2s-17 6.1-25 2L288.1 417.6 143.8 491c-8 4.1-17.7 3.3-25-2s-11-14.2-9.6-23.2L134.4 305.9 20 191.4c-6.4-6.4-8.6-15.8-5.8-24.4s10.1-14.9 19.1-16.3l159.9-25.4 73.6-144.2c4.1-8 12.4-13.1 21.4-13.1zm0 76.8L230.3 158c-3.5 6.8-10 11.6-17.6 12.8l-125.5 20 89.8 89.9c5.4 5.4 7.9 13.1 6.7 20.7l-19.8 125.5 113.3-57.6c6.8-3.5 14.9-3.5 21.8 0l113.3 57.6-19.8-125.5c-1.2-7.6 1.3-15.3 6.7-20.7l89.8-89.9-125.5-20c-7.6-1.2-14.1-6-17.6-12.8L288.1 44.8z"/></svg>`
    }
};
var $12f398f9a3af62d3$var$systemLibrary = {
    name: "system",
    resolver: (name, _family = "classic", variant = "solid")=>{
        let collection = $12f398f9a3af62d3$export$df03f54e09e486fa[variant];
        let svg = collection[name] ?? $12f398f9a3af62d3$export$df03f54e09e486fa.regular[name] ?? $12f398f9a3af62d3$export$df03f54e09e486fa.regular["circle-question"];
        if (svg) return $12f398f9a3af62d3$var$dataUri(svg);
        return "";
    }
};
var $12f398f9a3af62d3$export$3139252f9828970f = $12f398f9a3af62d3$var$systemLibrary;


/*! Copyright 2026 Fonticons, Inc. - https://webawesome.com/license */ /*! Copyright 2026 Fonticons, Inc. - https://webawesome.com/license */ // src/utilities/base-path.ts
var $4d3f3cdd02f338ef$var$basePath = "";
var $4d3f3cdd02f338ef$var$kitCode = "";
function $4d3f3cdd02f338ef$export$784ad41d332938c6(path) {
    $4d3f3cdd02f338ef$var$basePath = path;
}
function $4d3f3cdd02f338ef$export$9099264ed9b1c55a(subpath = "") {
    if (!$4d3f3cdd02f338ef$var$basePath) {
        const el = document.querySelector("[data-webawesome]");
        if (el?.hasAttribute("data-webawesome")) {
            const rootRelativeUrl = new URL(el.getAttribute("data-webawesome") ?? "", window.location.href).pathname;
            $4d3f3cdd02f338ef$export$784ad41d332938c6(rootRelativeUrl);
        } else {
            const scripts = [
                ...document.getElementsByTagName("script")
            ];
            const waScript = scripts.find((script)=>script.src.endsWith("webawesome.js") || script.src.endsWith("webawesome.loader.js") || script.src.endsWith("webawesome.ssr-loader.js"));
            if (waScript) {
                const path = String(waScript.getAttribute("src"));
                $4d3f3cdd02f338ef$export$784ad41d332938c6(path.split("/").slice(0, -1).join("/"));
            }
        }
    }
    return $4d3f3cdd02f338ef$var$basePath.replace(/\/$/, "") + (subpath ? `/${subpath.replace(/^\//, "")}` : ``);
}
function $4d3f3cdd02f338ef$export$518755054aae088d(code) {
    $4d3f3cdd02f338ef$var$kitCode = code;
}
function $4d3f3cdd02f338ef$export$652d2e1450c9e1cb() {
    if (!$4d3f3cdd02f338ef$var$kitCode) {
        const el = document.querySelector("[data-fa-kit-code]");
        if (el) $4d3f3cdd02f338ef$export$518755054aae088d(el.getAttribute("data-fa-kit-code") || "");
    }
    return $4d3f3cdd02f338ef$var$kitCode;
}


// src/components/icon/library.default.ts
var $1e92385d4d3bb384$var$FA_VERSION = "7.1.0";
function $1e92385d4d3bb384$var$getIconUrl(name, family, variant) {
    const kitCode = (0, $4d3f3cdd02f338ef$export$652d2e1450c9e1cb)();
    const isPro = kitCode.length > 0;
    let folder = "solid";
    if (family === "notdog") {
        if (variant === "solid") folder = "notdog-solid";
        if (variant === "duo-solid") folder = "notdog-duo-solid";
    }
    if (family === "notdog-duo") folder = "notdog-duo-solid";
    if (family === "chisel") folder = "chisel-regular";
    if (family === "etch") folder = "etch-solid";
    if (family === "jelly") {
        folder = "jelly-regular";
        if (variant === "duo-regular") folder = "jelly-duo-regular";
        if (variant === "fill-regular") folder = "jelly-fill-regular";
    }
    if (family === "jelly-duo") folder = "jelly-duo-regular";
    if (family === "jelly-fill") folder = "jelly-fill-regular";
    if (family === "slab") {
        if (variant === "solid" || variant === "regular") folder = "slab-regular";
        if (variant === "press-regular") folder = "slab-press-regular";
    }
    if (family === "slab-press") folder = "slab-press-regular";
    if (family === "thumbprint") folder = "thumbprint-light";
    if (family === "whiteboard") folder = "whiteboard-semibold";
    if (family === "utility") folder = "utility-semibold";
    if (family === "utility-duo") folder = "utility-duo-semibold";
    if (family === "utility-fill") folder = "utility-fill-semibold";
    if (family === "classic") {
        if (variant === "thin") folder = "thin";
        if (variant === "light") folder = "light";
        if (variant === "regular") folder = "regular";
        if (variant === "solid") folder = "solid";
    }
    if (family === "sharp") {
        if (variant === "thin") folder = "sharp-thin";
        if (variant === "light") folder = "sharp-light";
        if (variant === "regular") folder = "sharp-regular";
        if (variant === "solid") folder = "sharp-solid";
    }
    if (family === "duotone") {
        if (variant === "thin") folder = "duotone-thin";
        if (variant === "light") folder = "duotone-light";
        if (variant === "regular") folder = "duotone-regular";
        if (variant === "solid") folder = "duotone";
    }
    if (family === "sharp-duotone") {
        if (variant === "thin") folder = "sharp-duotone-thin";
        if (variant === "light") folder = "sharp-duotone-light";
        if (variant === "regular") folder = "sharp-duotone-regular";
        if (variant === "solid") folder = "sharp-duotone-solid";
    }
    if (family === "brands") folder = "brands";
    return isPro ? `https://ka-p.fontawesome.com/releases/v${$1e92385d4d3bb384$var$FA_VERSION}/svgs/${folder}/${name}.svg?token=${encodeURIComponent(kitCode)}` : `https://ka-f.fontawesome.com/releases/v${$1e92385d4d3bb384$var$FA_VERSION}/svgs/${folder}/${name}.svg`;
}
var $1e92385d4d3bb384$var$library = {
    name: "default",
    resolver: (name, family = "classic", variant = "solid")=>{
        return $1e92385d4d3bb384$var$getIconUrl(name, family, variant);
    },
    mutator: (svg, hostEl)=>{
        if (hostEl?.family && !svg.hasAttribute("data-duotone-initialized")) {
            const { family: family, variant: variant } = hostEl;
            if (// Duotone
            family === "duotone" || // Sharp duotone
            family === "sharp-duotone" || // Notdog duo (correct usage: family="notdog-duo")
            family === "notdog-duo" || // NOTE: family="notdog" variant="duo-solid" is deprecated
            family === "notdog" && variant === "duo-solid" || // Jelly duo (correct usage: family="jelly-duo")
            family === "jelly-duo" || // NOTE: family="jelly" variant="duo-regular" is deprecated
            family === "jelly" && variant === "duo-regular" || // Utility duo (correct usage: family="utility-duo")
            family === "utility-duo" || // Thumbprint
            family === "thumbprint") {
                const paths = [
                    ...svg.querySelectorAll("path")
                ];
                const primaryPath = paths.find((p)=>!p.hasAttribute("opacity"));
                const secondaryPath = paths.find((p)=>p.hasAttribute("opacity"));
                if (!primaryPath || !secondaryPath) return;
                primaryPath.setAttribute("data-duotone-primary", "");
                secondaryPath.setAttribute("data-duotone-secondary", "");
                if (hostEl.swapOpacity && primaryPath && secondaryPath) {
                    const originalOpacity = secondaryPath.getAttribute("opacity") || "0.4";
                    primaryPath.style.setProperty("--path-opacity", originalOpacity);
                    secondaryPath.style.setProperty("--path-opacity", "1");
                }
                svg.setAttribute("data-duotone-initialized", "");
            }
        }
    }
};
var $1e92385d4d3bb384$export$761783e099ce3526 = $1e92385d4d3bb384$var$library;


// src/components/icon/library.ts
var $2302fcffcbec1206$var$defaultIconFamily = "classic";
var $2302fcffcbec1206$var$registry = [
    (0, $1e92385d4d3bb384$export$761783e099ce3526),
    (0, $12f398f9a3af62d3$export$3139252f9828970f)
];
var $2302fcffcbec1206$var$watchedIcons = [];
function $2302fcffcbec1206$export$da63f424a7208010(icon) {
    $2302fcffcbec1206$var$watchedIcons.push(icon);
}
function $2302fcffcbec1206$export$9e46b25ecab82f0b(icon) {
    $2302fcffcbec1206$var$watchedIcons = $2302fcffcbec1206$var$watchedIcons.filter((el)=>el !== icon);
}
function $2302fcffcbec1206$export$be026de5111f322b(name) {
    return $2302fcffcbec1206$var$registry.find((lib)=>lib.name === name);
}
function $2302fcffcbec1206$export$a482e04ad60c9b11(name, options) {
    $2302fcffcbec1206$export$8faa256e94012669(name);
    $2302fcffcbec1206$var$registry.push({
        name: name,
        resolver: options.resolver,
        mutator: options.mutator,
        spriteSheet: options.spriteSheet
    });
    $2302fcffcbec1206$var$watchedIcons.forEach((icon)=>{
        if (icon.library === name) icon.setIcon();
    });
}
function $2302fcffcbec1206$export$8faa256e94012669(name) {
    $2302fcffcbec1206$var$registry = $2302fcffcbec1206$var$registry.filter((lib)=>lib.name !== name);
}
function $2302fcffcbec1206$export$f4ed8c13705d022e(family) {
    $2302fcffcbec1206$var$defaultIconFamily = family;
    $2302fcffcbec1206$var$watchedIcons.forEach((icon)=>icon.setIcon());
}
function $2302fcffcbec1206$export$8c069b61c9cfc554() {
    return $2302fcffcbec1206$var$defaultIconFamily;
}








/**
 * @license
 * Copyright 2020 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */ const { I: $6452c94914aca63a$var$t } = (0, $aed1389927a5dd65$export$8613d1ca9052b22e), $6452c94914aca63a$var$i = (o)=>o, $6452c94914aca63a$export$c3825b437cbdea5c = (o)=>null === o || "object" != typeof o && "function" != typeof o, $6452c94914aca63a$export$80c36ae3cab9881d = {
    HTML: 1,
    SVG: 2,
    MATHML: 3
}, $6452c94914aca63a$export$6b6d145ec2a44ca9 = (o, t)=>void 0 === t ? void 0 !== o?._$litType$ : o?._$litType$ === t, $6452c94914aca63a$export$6a0e8de894d2fcca = (o)=>null != o?._$litType$?.h, $6452c94914aca63a$export$2f448fec17d50a3e = (o)=>void 0 !== o?._$litDirective$, $6452c94914aca63a$export$f28e31de6a6eaf32 = (o)=>o?._$litDirective$, $6452c94914aca63a$export$7f431ad0fff82fd9 = (o)=>void 0 === o.strings, $6452c94914aca63a$var$s = ()=>document.createComment(""), $6452c94914aca63a$export$291b2338ad9b0b30 = (o, n, e)=>{
    const l = o._$AA.parentNode, d = void 0 === n ? o._$AB : n._$AA;
    if (void 0 === e) {
        const i = l.insertBefore($6452c94914aca63a$var$s(), d), n = l.insertBefore($6452c94914aca63a$var$s(), d);
        e = new $6452c94914aca63a$var$t(i, n, o, o.options);
    } else {
        const t = e._$AB.nextSibling, n = e._$AM, c = n !== o;
        if (c) {
            let t;
            e._$AQ?.(o), e._$AM = o, void 0 !== e._$AP && (t = o._$AU) !== n._$AU && e._$AP(t);
        }
        if (t !== d || c) {
            let o = e._$AA;
            for(; o !== t;){
                const t = $6452c94914aca63a$var$i(o).nextSibling;
                $6452c94914aca63a$var$i(l).insertBefore(o, d), o = t;
            }
        }
    }
    return e;
}, $6452c94914aca63a$export$cb8bf9562088e9f4 = (o, t, i = o)=>(o._$AI(t, i), o), $6452c94914aca63a$var$m = {}, $6452c94914aca63a$export$ea70d9dd5965b1c8 = (o, t = $6452c94914aca63a$var$m)=>o._$AH = t, $6452c94914aca63a$export$59e9bce518cde500 = (o)=>o._$AH, $6452c94914aca63a$export$3133b3144bbba267 = (o)=>{
    o._$AR(), o._$AA.remove();
}, $6452c94914aca63a$export$7f600b8138c094dc = (o)=>{
    o._$AR();
};




var $8483a28f72ecbeec$var$CACHEABLE_ERROR = Symbol();
var $8483a28f72ecbeec$var$RETRYABLE_ERROR = Symbol();
var $8483a28f72ecbeec$var$parser;
var $8483a28f72ecbeec$var$iconCache = /* @__PURE__ */ new Map();
var $8483a28f72ecbeec$export$f48cd026bf8fe08 = class extends (0, $7b33480fbd5323dc$export$1c2340e2bfaed5f9) {
    constructor(){
        super(...arguments);
        this.svg = null;
        this.autoWidth = false;
        this.swapOpacity = false;
        this.label = "";
        this.library = "default";
        this.rotate = 0;
        /** Given a URL, this function returns the resulting SVG element or an appropriate error symbol. */ this.resolveIcon = async (url, library)=>{
            let fileData;
            if (library?.spriteSheet) {
                if (!this.hasUpdated) await this.updateComplete;
                this.svg = (0, $aed1389927a5dd65$export$c0bb0b647f701bb5)`<svg part="svg">
        <use part="use" href="${url}"></use>
      </svg>`;
                await this.updateComplete;
                const svg = this.shadowRoot.querySelector("[part='svg']");
                if (typeof library.mutator === "function") library.mutator(svg, this);
                return this.svg;
            }
            try {
                fileData = await fetch(url, {
                    mode: "cors"
                });
                if (!fileData.ok) return fileData.status === 410 ? $8483a28f72ecbeec$var$CACHEABLE_ERROR : $8483a28f72ecbeec$var$RETRYABLE_ERROR;
            } catch  {
                return $8483a28f72ecbeec$var$RETRYABLE_ERROR;
            }
            try {
                const div = document.createElement("div");
                div.innerHTML = await fileData.text();
                const svg = div.firstElementChild;
                if (svg?.tagName?.toLowerCase() !== "svg") return $8483a28f72ecbeec$var$CACHEABLE_ERROR;
                if (!$8483a28f72ecbeec$var$parser) $8483a28f72ecbeec$var$parser = new DOMParser();
                const doc = $8483a28f72ecbeec$var$parser.parseFromString(svg.outerHTML, "text/html");
                const svgEl = doc.body.querySelector("svg");
                if (!svgEl) return $8483a28f72ecbeec$var$CACHEABLE_ERROR;
                svgEl.part.add("svg");
                return document.adoptNode(svgEl);
            } catch  {
                return $8483a28f72ecbeec$var$CACHEABLE_ERROR;
            }
        };
    }
    connectedCallback() {
        super.connectedCallback();
        (0, $2302fcffcbec1206$export$da63f424a7208010)(this);
    }
    firstUpdated(changedProperties) {
        super.firstUpdated(changedProperties);
        if (this.hasAttribute("rotate")) this.style.setProperty("--rotate-angle", `${this.rotate}deg`);
        this.setIcon();
    }
    disconnectedCallback() {
        super.disconnectedCallback();
        (0, $2302fcffcbec1206$export$9e46b25ecab82f0b)(this);
    }
    getIconSource() {
        const library = (0, $2302fcffcbec1206$export$be026de5111f322b)(this.library);
        const family = this.family || (0, $2302fcffcbec1206$export$8c069b61c9cfc554)();
        if (this.name && library) return {
            url: library.resolver(this.name, family, this.variant, this.autoWidth),
            fromLibrary: true
        };
        return {
            url: this.src,
            fromLibrary: false
        };
    }
    handleLabelChange() {
        const hasLabel = typeof this.label === "string" && this.label.length > 0;
        if (hasLabel) {
            this.setAttribute("role", "img");
            this.setAttribute("aria-label", this.label);
            this.removeAttribute("aria-hidden");
        } else {
            this.removeAttribute("role");
            this.removeAttribute("aria-label");
            this.setAttribute("aria-hidden", "true");
        }
    }
    async setIcon() {
        const { url: url, fromLibrary: fromLibrary } = this.getIconSource();
        const library = fromLibrary ? (0, $2302fcffcbec1206$export$be026de5111f322b)(this.library) : void 0;
        if (!url) {
            this.svg = null;
            return;
        }
        let iconResolver = $8483a28f72ecbeec$var$iconCache.get(url);
        if (!iconResolver) {
            iconResolver = this.resolveIcon(url, library);
            $8483a28f72ecbeec$var$iconCache.set(url, iconResolver);
        }
        const svg = await iconResolver;
        if (svg === $8483a28f72ecbeec$var$RETRYABLE_ERROR) $8483a28f72ecbeec$var$iconCache.delete(url);
        if (url !== this.getIconSource().url) return;
        if ((0, $6452c94914aca63a$export$6b6d145ec2a44ca9)(svg)) {
            this.svg = svg;
            return;
        }
        switch(svg){
            case $8483a28f72ecbeec$var$RETRYABLE_ERROR:
            case $8483a28f72ecbeec$var$CACHEABLE_ERROR:
                this.svg = null;
                this.dispatchEvent(new (0, $0564bf32056f88f2$export$70537e1409e8a4d5)());
                break;
            default:
                this.svg = svg.cloneNode(true);
                library?.mutator?.(this.svg, this);
                this.dispatchEvent(new (0, $46d0be887ab0f6da$export$93d315c41534ba24)());
        }
    }
    updated(changedProperties) {
        super.updated(changedProperties);
        const library = (0, $2302fcffcbec1206$export$be026de5111f322b)(this.library);
        if (this.hasAttribute("rotate")) this.style.setProperty("--rotate-angle", `${this.rotate}deg`);
        const svg = this.shadowRoot?.querySelector("svg");
        if (svg) library?.mutator?.(svg, this);
    }
    render() {
        if (this.hasUpdated) return this.svg;
        return (0, $aed1389927a5dd65$export$c0bb0b647f701bb5)`<svg part="svg" width="16" height="16"></svg>`;
    }
};
$8483a28f72ecbeec$export$f48cd026bf8fe08.css = (0, $1a251f6e43e4df44$export$f0b0874d64866432);
(0, $e94b2b28708d0aa9$export$85c93885f16e8446)([
    (0, $a73bb3d3a9a88bf1$export$ca000e230c0caa3e)()
], $8483a28f72ecbeec$export$f48cd026bf8fe08.prototype, "svg", 2);
(0, $e94b2b28708d0aa9$export$85c93885f16e8446)([
    (0, $28816b39eccda61d$export$d541bacb2bda4494)({
        reflect: true
    })
], $8483a28f72ecbeec$export$f48cd026bf8fe08.prototype, "name", 2);
(0, $e94b2b28708d0aa9$export$85c93885f16e8446)([
    (0, $28816b39eccda61d$export$d541bacb2bda4494)({
        reflect: true
    })
], $8483a28f72ecbeec$export$f48cd026bf8fe08.prototype, "family", 2);
(0, $e94b2b28708d0aa9$export$85c93885f16e8446)([
    (0, $28816b39eccda61d$export$d541bacb2bda4494)({
        reflect: true
    })
], $8483a28f72ecbeec$export$f48cd026bf8fe08.prototype, "variant", 2);
(0, $e94b2b28708d0aa9$export$85c93885f16e8446)([
    (0, $28816b39eccda61d$export$d541bacb2bda4494)({
        attribute: "auto-width",
        type: Boolean,
        reflect: true
    })
], $8483a28f72ecbeec$export$f48cd026bf8fe08.prototype, "autoWidth", 2);
(0, $e94b2b28708d0aa9$export$85c93885f16e8446)([
    (0, $28816b39eccda61d$export$d541bacb2bda4494)({
        attribute: "swap-opacity",
        type: Boolean,
        reflect: true
    })
], $8483a28f72ecbeec$export$f48cd026bf8fe08.prototype, "swapOpacity", 2);
(0, $e94b2b28708d0aa9$export$85c93885f16e8446)([
    (0, $28816b39eccda61d$export$d541bacb2bda4494)()
], $8483a28f72ecbeec$export$f48cd026bf8fe08.prototype, "src", 2);
(0, $e94b2b28708d0aa9$export$85c93885f16e8446)([
    (0, $28816b39eccda61d$export$d541bacb2bda4494)()
], $8483a28f72ecbeec$export$f48cd026bf8fe08.prototype, "label", 2);
(0, $e94b2b28708d0aa9$export$85c93885f16e8446)([
    (0, $28816b39eccda61d$export$d541bacb2bda4494)({
        reflect: true
    })
], $8483a28f72ecbeec$export$f48cd026bf8fe08.prototype, "library", 2);
(0, $e94b2b28708d0aa9$export$85c93885f16e8446)([
    (0, $28816b39eccda61d$export$d541bacb2bda4494)({
        type: Number,
        reflect: true
    })
], $8483a28f72ecbeec$export$f48cd026bf8fe08.prototype, "rotate", 2);
(0, $e94b2b28708d0aa9$export$85c93885f16e8446)([
    (0, $28816b39eccda61d$export$d541bacb2bda4494)({
        type: String,
        reflect: true
    })
], $8483a28f72ecbeec$export$f48cd026bf8fe08.prototype, "flip", 2);
(0, $e94b2b28708d0aa9$export$85c93885f16e8446)([
    (0, $28816b39eccda61d$export$d541bacb2bda4494)({
        type: String,
        reflect: true
    })
], $8483a28f72ecbeec$export$f48cd026bf8fe08.prototype, "animation", 2);
(0, $e94b2b28708d0aa9$export$85c93885f16e8446)([
    (0, $3079f7c458d2314a$export$3db5d71bdb2d5499)("label")
], $8483a28f72ecbeec$export$f48cd026bf8fe08.prototype, "handleLabelChange", 1);
(0, $e94b2b28708d0aa9$export$85c93885f16e8446)([
    (0, $3079f7c458d2314a$export$3db5d71bdb2d5499)([
        "family",
        "name",
        "library",
        "variant",
        "src",
        "autoWidth",
        "swapOpacity"
    ], {
        waitUntilFirstUpdate: true
    })
], $8483a28f72ecbeec$export$f48cd026bf8fe08.prototype, "setIcon", 1);
$8483a28f72ecbeec$export$f48cd026bf8fe08 = (0, $e94b2b28708d0aa9$export$85c93885f16e8446)([
    (0, $b777701f54f11b66$export$da64fc29f17f9d0e)("wa-icon")
], $8483a28f72ecbeec$export$f48cd026bf8fe08);
















/*! Copyright 2026 Fonticons, Inc. - https://webawesome.com/license */ /*! Copyright 2026 Fonticons, Inc. - https://webawesome.com/license */ /*! Copyright 2026 Fonticons, Inc. - https://webawesome.com/license */ // src/events/selection-change.ts
var $2b76c5278aa8d71a$export$e5ee3aaf10a9965f = class extends Event {
    constructor(detail){
        super("wa-selection-change", {
            bubbles: true,
            cancelable: false,
            composed: true
        });
        this.detail = detail;
    }
};


/*! Copyright 2026 Fonticons, Inc. - https://webawesome.com/license */ // src/components/tree/tree.styles.ts

var $079baa0d9703c14c$export$a93abbea96ceefc7 = (0, $987a32d81eef3330$export$dbf350e5966cf602)`
  :host {
    /*
     * These are actually used by tree item, but we define them here so they can more easily be set and all tree items
     * stay consistent.
     */
    --indent-guide-color: var(--wa-color-surface-border);
    --indent-guide-offset: 0;
    --indent-guide-style: solid;
    --indent-guide-width: 0;
    --indent-size: var(--wa-space-l);

    display: block;

    /*
     * Tree item indentation uses the "em" unit to increment its width on each level, so setting the font size to zero
     * here removes the indentation for all the nodes on the first level.
     */
    font-size: 0;
  }
`;


/*! Copyright 2026 Fonticons, Inc. - https://webawesome.com/license */ /*! Copyright 2026 Fonticons, Inc. - https://webawesome.com/license */ // src/events/lazy-change.ts
var $d4189ba75bcadecc$export$76db3ad98168fdec = class extends Event {
    constructor(){
        super("wa-lazy-change", {
            bubbles: true,
            cancelable: false,
            composed: true
        });
    }
};


/*! Copyright 2026 Fonticons, Inc. - https://webawesome.com/license */ // src/events/lazy-load.ts
var $b985b252a6be6932$export$a2d99d1daca87373 = class extends Event {
    constructor(){
        super("wa-lazy-load", {
            bubbles: true,
            cancelable: false,
            composed: true
        });
    }
};


/*! Copyright 2026 Fonticons, Inc. - https://webawesome.com/license */ // src/events/expand.ts
var $bb6214ef81f79528$export$3a2e4eb4680f0696 = class extends Event {
    constructor(){
        super("wa-expand", {
            bubbles: true,
            cancelable: false,
            composed: true
        });
    }
};


/*! Copyright 2026 Fonticons, Inc. - https://webawesome.com/license */ // src/events/after-expand.ts
var $d206c8c2ccb6701b$export$1c0000d38e4262c2 = class extends Event {
    constructor(){
        super("wa-after-expand", {
            bubbles: true,
            cancelable: false,
            composed: true
        });
    }
};


/*! Copyright 2026 Fonticons, Inc. - https://webawesome.com/license */ // src/events/collapse.ts
var $7b9a66ff13af75dc$export$425620a18d69235f = class extends Event {
    constructor(){
        super("wa-collapse", {
            bubbles: true,
            cancelable: false,
            composed: true
        });
    }
};


/*! Copyright 2026 Fonticons, Inc. - https://webawesome.com/license */ // src/events/after-collapse.ts
var $49af336dfc2dd2dc$export$3b8ca7bfa6101a0b = class extends Event {
    constructor(){
        super("wa-after-collapse", {
            bubbles: true,
            cancelable: false,
            composed: true
        });
    }
};


/*! Copyright 2026 Fonticons, Inc. - https://webawesome.com/license */ // src/components/tree-item/tree-item.styles.ts

var $e769390f6e4d97b4$export$78c19d3af5c7c006 = (0, $987a32d81eef3330$export$dbf350e5966cf602)`
  :host {
    --show-duration: 200ms;
    --hide-duration: 200ms;

    display: block;
    color: var(--wa-color-text-normal);
    outline: 0;
    z-index: 0;
  }

  :host(:focus) {
    outline: none;
  }

  slot:not([name])::slotted(wa-icon) {
    margin-inline-end: var(--wa-space-xs);
  }

  .tree-item {
    position: relative;
    display: flex;
    align-items: stretch;
    flex-direction: column;
    cursor: default;
    user-select: none;
    -webkit-user-select: none;
  }

  .checkbox {
    line-height: var(--wa-form-control-value-line-height);
    pointer-events: none;
  }

  .expand-button,
  .checkbox,
  .label {
    font-family: inherit;
    font-size: var(--wa-font-size-m);
    font-weight: inherit;
  }

  .checkbox::part(base) {
    display: flex;
    align-items: center;
  }

  .indentation {
    display: block;
    width: 1em;
    flex-shrink: 0;
  }

  .expand-button {
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--wa-color-text-quiet);
    width: 2em;
    height: 2em;
    flex-shrink: 0;
    cursor: pointer;
  }

  .expand-button {
    transition: rotate var(--wa-transition-normal) var(--wa-transition-easing);
  }

  .tree-item-expanded .expand-button {
    rotate: 90deg;
  }

  .tree-item-expanded:dir(rtl) .expand-button {
    rotate: -90deg;
  }

  .tree-item-expanded:not(.tree-item-loading) slot[name='expand-icon'],
  .tree-item:not(.tree-item-expanded) slot[name='collapse-icon'] {
    display: none;
  }

  .tree-item:not(.tree-item-has-expand-button):not(.tree-item-loading) .expand-icon-slot {
    display: none;
  }

  .tree-item:not(.tree-item-has-expand-button):not(.tree-item-loading) .expand-button {
    cursor: default;
  }

  .tree-item-loading .expand-icon-slot wa-icon {
    display: none;
  }

  .expand-button-visible {
    cursor: pointer;
  }

  .item {
    display: flex;
    align-items: center;
    border-inline-start: solid 3px transparent;
  }

  :host([disabled]) .item {
    opacity: 0.5;
    outline: none;
    cursor: not-allowed;
  }

  :host(:focus-visible) .item {
    outline: var(--wa-focus-ring);
    outline-offset: var(--wa-focus-ring-offset);
    z-index: 2;
  }

  :host(:not([aria-disabled='true'])) .tree-item-selected .item {
    background-color: var(--wa-color-neutral-fill-quiet);
    border-inline-start-color: var(--wa-color-brand-fill-loud);
  }

  :host(:not([aria-disabled='true'])) .expand-button {
    color: var(--wa-color-text-quiet);
  }

  .label {
    display: flex;
    align-items: center;
    transition: color var(--wa-transition-normal) var(--wa-transition-easing);
  }

  .children {
    display: block;
    font-size: calc(1em + var(--indent-size, var(--wa-space-m)));
  }

  /* Indentation lines */
  .children {
    position: relative;
  }

  .children::before {
    content: '';
    position: absolute;
    top: var(--indent-guide-offset);
    bottom: var(--indent-guide-offset);
    inset-inline-start: calc(1em - (var(--indent-guide-width) / 2) - 1px);
    border-inline-end: var(--indent-guide-width) var(--indent-guide-style) var(--indent-guide-color);
    z-index: 1;
  }

  @media (forced-colors: active) {
    :host(:not([aria-disabled='true'])) .tree-item-selected .item {
      outline: dashed 1px SelectedItem;
    }
  }
`;













/**
 * @license
 * Copyright 2020 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */ const $2a53f42e0cbfd651$export$28cf49ad70f82d12 = (0, $39adefad669ed5a7$export$99b43ad1ed32e735)(class extends (0, $39adefad669ed5a7$export$befdefbdce210f91) {
    constructor(r){
        if (super(r), r.type !== (0, $39adefad669ed5a7$export$9ba3b3f20a85bfa).PROPERTY && r.type !== (0, $39adefad669ed5a7$export$9ba3b3f20a85bfa).ATTRIBUTE && r.type !== (0, $39adefad669ed5a7$export$9ba3b3f20a85bfa).BOOLEAN_ATTRIBUTE) throw Error("The `live` directive is not allowed on child or event bindings");
        if (!(0, $6452c94914aca63a$export$7f431ad0fff82fd9)(r)) throw Error("`live` bindings can only contain a single expression");
    }
    render(r) {
        return r;
    }
    update(i, [t]) {
        if (t === (0, $aed1389927a5dd65$export$9c068ae9cc5db4e8) || t === (0, $aed1389927a5dd65$export$45b790e32b2810ee)) return t;
        const o = i.element, l = i.name;
        if (i.type === (0, $39adefad669ed5a7$export$9ba3b3f20a85bfa).PROPERTY) {
            if (t === o[l]) return 0, $aed1389927a5dd65$export$9c068ae9cc5db4e8;
        } else if (i.type === (0, $39adefad669ed5a7$export$9ba3b3f20a85bfa).BOOLEAN_ATTRIBUTE) {
            if (!!t === o.hasAttribute(l)) return 0, $aed1389927a5dd65$export$9c068ae9cc5db4e8;
        } else if (i.type === (0, $39adefad669ed5a7$export$9ba3b3f20a85bfa).ATTRIBUTE && o.getAttribute(l) === t + "") return 0, $aed1389927a5dd65$export$9c068ae9cc5db4e8;
        return (0, $6452c94914aca63a$export$ea70d9dd5965b1c8)(i), t;
    }
});




/**
 * @license
 * Copyright 2021 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */ function $457dfa40055900ee$export$a55877ca9db47377(n, r, t) {
    return n ? r(n) : t?.(n);
}




var $7b6886c0f640818c$export$df02022e7951512e = class extends (0, $7b33480fbd5323dc$export$1c2340e2bfaed5f9) {
    constructor(){
        super(...arguments);
        this.localize = new (0, $7fddb19538fc1728$export$b1a2fed5bb41b893)(this);
        this.indeterminate = false;
        this.isLeaf = false;
        this.loading = false;
        this.selectable = false;
        this.expanded = false;
        this.selected = false;
        this.disabled = false;
        this.lazy = false;
    }
    static isTreeItem(node) {
        return node instanceof Element && node.getAttribute("role") === "treeitem";
    }
    connectedCallback() {
        super.connectedCallback();
        this.setAttribute("role", "treeitem");
        this.setAttribute("tabindex", "-1");
        if (this.isNestedItem()) this.slot = "children";
    }
    firstUpdated() {
        this.childrenContainer.hidden = !this.expanded;
        this.childrenContainer.style.height = this.expanded ? "auto" : "0";
        this.isLeaf = !this.lazy && this.getChildrenItems().length === 0;
        this.handleExpandedChange();
    }
    async animateCollapse() {
        this.dispatchEvent(new (0, $7b9a66ff13af75dc$export$425620a18d69235f)());
        const duration = (0, $fbf2d72871bb3665$export$ecae829bb3747ea6)(getComputedStyle(this.childrenContainer).getPropertyValue("--hide-duration"));
        await (0, $fbf2d72871bb3665$export$e3607ec2d7a891c4)(this.childrenContainer, [
            // We can't animate from 'auto', so use the scroll height for now
            {
                height: `${this.childrenContainer.scrollHeight}px`,
                opacity: "1",
                overflow: "hidden"
            },
            {
                height: "0",
                opacity: "0",
                overflow: "hidden"
            }
        ], {
            duration: duration,
            easing: "cubic-bezier(0.4, 0.0, 0.2, 1)"
        });
        this.childrenContainer.hidden = true;
        this.dispatchEvent(new (0, $49af336dfc2dd2dc$export$3b8ca7bfa6101a0b)());
    }
    // Checks whether the item is nested into an item
    isNestedItem() {
        const parent = this.parentElement;
        return !!parent && $7b6886c0f640818c$export$df02022e7951512e.isTreeItem(parent);
    }
    handleChildrenSlotChange() {
        this.loading = false;
        this.isLeaf = !this.lazy && this.getChildrenItems().length === 0;
    }
    willUpdate(changedProperties) {
        if (changedProperties.has("selected") && !changedProperties.has("indeterminate")) this.indeterminate = false;
    }
    async animateExpand() {
        this.dispatchEvent(new (0, $bb6214ef81f79528$export$3a2e4eb4680f0696)());
        this.childrenContainer.hidden = false;
        const duration = (0, $fbf2d72871bb3665$export$ecae829bb3747ea6)(getComputedStyle(this.childrenContainer).getPropertyValue("--show-duration"));
        await (0, $fbf2d72871bb3665$export$e3607ec2d7a891c4)(this.childrenContainer, [
            {
                height: "0",
                opacity: "0",
                overflow: "hidden"
            },
            {
                height: `${this.childrenContainer.scrollHeight}px`,
                opacity: "1",
                overflow: "hidden"
            }
        ], {
            duration: duration,
            easing: "cubic-bezier(0.4, 0.0, 0.2, 1)"
        });
        this.childrenContainer.style.height = "auto";
        this.dispatchEvent(new (0, $d206c8c2ccb6701b$export$1c0000d38e4262c2)());
    }
    handleLoadingChange() {
        this.setAttribute("aria-busy", this.loading ? "true" : "false");
        if (!this.loading) this.animateExpand();
    }
    handleDisabledChange() {
        this.customStates.set("disabled", this.disabled);
        this.setAttribute("aria-disabled", this.disabled ? "true" : "false");
    }
    handleExpandedState() {
        this.customStates.set("expanded", this.expanded);
    }
    handleIndeterminateStateChange() {
        this.customStates.set("indeterminate", this.indeterminate);
    }
    handleSelectedChange() {
        this.customStates.set("selected", this.selected);
        this.setAttribute("aria-selected", this.selected ? "true" : "false");
    }
    handleExpandedChange() {
        if (!this.isLeaf) this.setAttribute("aria-expanded", this.expanded ? "true" : "false");
        else this.removeAttribute("aria-expanded");
    }
    handleExpandAnimation() {
        if (this.expanded) {
            if (this.lazy) {
                this.loading = true;
                this.dispatchEvent(new (0, $b985b252a6be6932$export$a2d99d1daca87373)());
            } else this.animateExpand();
        } else this.animateCollapse();
    }
    handleLazyChange() {
        this.dispatchEvent(new (0, $d4189ba75bcadecc$export$76db3ad98168fdec)());
    }
    /** Gets all the nested tree items in this node. */ getChildrenItems({ includeDisabled: includeDisabled = true } = {}) {
        return this.childrenSlot ? [
            ...this.childrenSlot.assignedElements({
                flatten: true
            })
        ].filter((item)=>$7b6886c0f640818c$export$df02022e7951512e.isTreeItem(item) && (includeDisabled || !item.disabled)) : [];
    }
    render() {
        const isRtl = this.localize.dir() === "rtl";
        const showExpandButton = !this.loading && (!this.isLeaf || this.lazy);
        return (0, $aed1389927a5dd65$export$c0bb0b647f701bb5)`
      <div
        part="base"
        class="${(0, $b5822ac1f58ba956$export$56cc687933817664)({
            "tree-item": true,
            "tree-item-expanded": this.expanded,
            "tree-item-selected": this.selected,
            "tree-item-leaf": this.isLeaf,
            "tree-item-loading": this.loading,
            "tree-item-has-expand-button": showExpandButton
        })}"
      >
        <div class="item" part="item">
          <div class="indentation" part="indentation"></div>

          <div
            part="expand-button"
            class=${(0, $b5822ac1f58ba956$export$56cc687933817664)({
            "expand-button": true,
            "expand-button-visible": showExpandButton
        })}
            aria-hidden="true"
          >
            <slot class="expand-icon-slot" name="expand-icon">
              ${(0, $457dfa40055900ee$export$a55877ca9db47377)(this.loading, ()=>(0, $aed1389927a5dd65$export$c0bb0b647f701bb5)` <wa-spinner part="spinner" exportparts="base:spinner__base"></wa-spinner> `, ()=>(0, $aed1389927a5dd65$export$c0bb0b647f701bb5)`
                  <wa-icon name=${isRtl ? "chevron-left" : "chevron-right"} library="system" variant="solid"></wa-icon>
                `)}
            </slot>
            <slot class="expand-icon-slot" name="collapse-icon">
              <wa-icon name=${isRtl ? "chevron-left" : "chevron-right"} library="system" variant="solid"></wa-icon>
            </slot>
          </div>

          ${(0, $457dfa40055900ee$export$a55877ca9db47377)(this.selectable, ()=>(0, $aed1389927a5dd65$export$c0bb0b647f701bb5)`
              <wa-checkbox
                part="checkbox"
                exportparts="
                    base:checkbox__base,
                    control:checkbox__control,
                    checked-icon:checkbox__checked-icon,
                    indeterminate-icon:checkbox__indeterminate-icon,
                    label:checkbox__label
                  "
                class="checkbox"
                ?disabled="${this.disabled}"
                ?checked="${(0, $2a53f42e0cbfd651$export$28cf49ad70f82d12)(this.selected)}"
                ?indeterminate="${this.indeterminate}"
                tabindex="-1"
              ></wa-checkbox>
            `)}

          <slot class="label" part="label"></slot>
        </div>

        <div class="children" part="children" role="group">
          <slot name="children" @slotchange="${this.handleChildrenSlotChange}"></slot>
        </div>
      </div>
    `;
    }
};
$7b6886c0f640818c$export$df02022e7951512e.css = (0, $e769390f6e4d97b4$export$78c19d3af5c7c006);
(0, $e94b2b28708d0aa9$export$85c93885f16e8446)([
    (0, $a73bb3d3a9a88bf1$export$ca000e230c0caa3e)()
], $7b6886c0f640818c$export$df02022e7951512e.prototype, "indeterminate", 2);
(0, $e94b2b28708d0aa9$export$85c93885f16e8446)([
    (0, $a73bb3d3a9a88bf1$export$ca000e230c0caa3e)()
], $7b6886c0f640818c$export$df02022e7951512e.prototype, "isLeaf", 2);
(0, $e94b2b28708d0aa9$export$85c93885f16e8446)([
    (0, $a73bb3d3a9a88bf1$export$ca000e230c0caa3e)()
], $7b6886c0f640818c$export$df02022e7951512e.prototype, "loading", 2);
(0, $e94b2b28708d0aa9$export$85c93885f16e8446)([
    (0, $a73bb3d3a9a88bf1$export$ca000e230c0caa3e)()
], $7b6886c0f640818c$export$df02022e7951512e.prototype, "selectable", 2);
(0, $e94b2b28708d0aa9$export$85c93885f16e8446)([
    (0, $28816b39eccda61d$export$d541bacb2bda4494)({
        type: Boolean,
        reflect: true
    })
], $7b6886c0f640818c$export$df02022e7951512e.prototype, "expanded", 2);
(0, $e94b2b28708d0aa9$export$85c93885f16e8446)([
    (0, $28816b39eccda61d$export$d541bacb2bda4494)({
        type: Boolean,
        reflect: true
    })
], $7b6886c0f640818c$export$df02022e7951512e.prototype, "selected", 2);
(0, $e94b2b28708d0aa9$export$85c93885f16e8446)([
    (0, $28816b39eccda61d$export$d541bacb2bda4494)({
        type: Boolean,
        reflect: true
    })
], $7b6886c0f640818c$export$df02022e7951512e.prototype, "disabled", 2);
(0, $e94b2b28708d0aa9$export$85c93885f16e8446)([
    (0, $28816b39eccda61d$export$d541bacb2bda4494)({
        type: Boolean,
        reflect: true
    })
], $7b6886c0f640818c$export$df02022e7951512e.prototype, "lazy", 2);
(0, $e94b2b28708d0aa9$export$85c93885f16e8446)([
    (0, $c0447c72baf98ff7$export$2fa187e846a241c4)("slot:not([name])")
], $7b6886c0f640818c$export$df02022e7951512e.prototype, "defaultSlot", 2);
(0, $e94b2b28708d0aa9$export$85c93885f16e8446)([
    (0, $c0447c72baf98ff7$export$2fa187e846a241c4)("slot[name=children]")
], $7b6886c0f640818c$export$df02022e7951512e.prototype, "childrenSlot", 2);
(0, $e94b2b28708d0aa9$export$85c93885f16e8446)([
    (0, $c0447c72baf98ff7$export$2fa187e846a241c4)(".item")
], $7b6886c0f640818c$export$df02022e7951512e.prototype, "itemElement", 2);
(0, $e94b2b28708d0aa9$export$85c93885f16e8446)([
    (0, $c0447c72baf98ff7$export$2fa187e846a241c4)(".children")
], $7b6886c0f640818c$export$df02022e7951512e.prototype, "childrenContainer", 2);
(0, $e94b2b28708d0aa9$export$85c93885f16e8446)([
    (0, $c0447c72baf98ff7$export$2fa187e846a241c4)(".expand-button slot")
], $7b6886c0f640818c$export$df02022e7951512e.prototype, "expandButtonSlot", 2);
(0, $e94b2b28708d0aa9$export$85c93885f16e8446)([
    (0, $3079f7c458d2314a$export$3db5d71bdb2d5499)("loading", {
        waitUntilFirstUpdate: true
    })
], $7b6886c0f640818c$export$df02022e7951512e.prototype, "handleLoadingChange", 1);
(0, $e94b2b28708d0aa9$export$85c93885f16e8446)([
    (0, $3079f7c458d2314a$export$3db5d71bdb2d5499)("disabled")
], $7b6886c0f640818c$export$df02022e7951512e.prototype, "handleDisabledChange", 1);
(0, $e94b2b28708d0aa9$export$85c93885f16e8446)([
    (0, $3079f7c458d2314a$export$3db5d71bdb2d5499)("expanded")
], $7b6886c0f640818c$export$df02022e7951512e.prototype, "handleExpandedState", 1);
(0, $e94b2b28708d0aa9$export$85c93885f16e8446)([
    (0, $3079f7c458d2314a$export$3db5d71bdb2d5499)("indeterminate")
], $7b6886c0f640818c$export$df02022e7951512e.prototype, "handleIndeterminateStateChange", 1);
(0, $e94b2b28708d0aa9$export$85c93885f16e8446)([
    (0, $3079f7c458d2314a$export$3db5d71bdb2d5499)("selected")
], $7b6886c0f640818c$export$df02022e7951512e.prototype, "handleSelectedChange", 1);
(0, $e94b2b28708d0aa9$export$85c93885f16e8446)([
    (0, $3079f7c458d2314a$export$3db5d71bdb2d5499)("expanded", {
        waitUntilFirstUpdate: true
    })
], $7b6886c0f640818c$export$df02022e7951512e.prototype, "handleExpandedChange", 1);
(0, $e94b2b28708d0aa9$export$85c93885f16e8446)([
    (0, $3079f7c458d2314a$export$3db5d71bdb2d5499)("expanded", {
        waitUntilFirstUpdate: true
    })
], $7b6886c0f640818c$export$df02022e7951512e.prototype, "handleExpandAnimation", 1);
(0, $e94b2b28708d0aa9$export$85c93885f16e8446)([
    (0, $3079f7c458d2314a$export$3db5d71bdb2d5499)("lazy", {
        waitUntilFirstUpdate: true
    })
], $7b6886c0f640818c$export$df02022e7951512e.prototype, "handleLazyChange", 1);
$7b6886c0f640818c$export$df02022e7951512e = (0, $e94b2b28708d0aa9$export$85c93885f16e8446)([
    (0, $b777701f54f11b66$export$da64fc29f17f9d0e)("wa-tree-item")
], $7b6886c0f640818c$export$df02022e7951512e);


/*! Copyright 2026 Fonticons, Inc. - https://webawesome.com/license */ // src/internal/math.ts
/* @ts-self-types="./index.d.ts" */ const $0b1fe50756f03b1f$export$2b646eea95309f00 = 'useandom-26T198340PX75pxJACKVERYMINDBUSHWOLF_GQZbfghjklqvwyzrict';


let $9a0d25345480ca11$export$4385e60b38654f68 = (bytes)=>crypto.getRandomValues(new Uint8Array(bytes));
let $9a0d25345480ca11$export$a5cee9e955a615e5 = (alphabet, defaultSize, getRandom)=>{
    let mask = (2 << Math.log2(alphabet.length - 1)) - 1;
    let step = -~(1.6 * mask * defaultSize / alphabet.length);
    return (size = defaultSize)=>{
        let id = '';
        while(true){
            let bytes = getRandom(step);
            let j = step | 0;
            while(j--){
                id += alphabet[bytes[j] & mask] || '';
                if (id.length >= size) return id;
            }
        }
    };
};
let $9a0d25345480ca11$export$62e99e5c9f473d7f = (alphabet, size = 21)=>$9a0d25345480ca11$export$a5cee9e955a615e5(alphabet, size | 0, $9a0d25345480ca11$export$4385e60b38654f68);
let $9a0d25345480ca11$export$ac4959f4f1338dfc = (size = 21)=>{
    let id = '';
    let bytes = crypto.getRandomValues(new Uint8Array(size |= 0));
    while(size--)id += (0, $0b1fe50756f03b1f$export$2b646eea95309f00)[bytes[size] & 63];
    return id;
};


function $0d9abbe812fa507c$export$7d15b64cf5a3a4c4(value, min, max) {
    const noNegativeZero = (n)=>Object.is(n, -0) ? 0 : n;
    if (value < min) return noNegativeZero(min);
    if (value > max) return noNegativeZero(max);
    return noNegativeZero(value);
}
function $0d9abbe812fa507c$export$8b15d37bc3f197d4(prefix = "") {
    return `${prefix}${(0, $9a0d25345480ca11$export$ac4959f4f1338dfc)()}`;
}








function $fbd86ba99423402c$var$syncCheckboxes(changedTreeItem, initialSync = false) {
    function syncParentItem(treeItem) {
        const children = treeItem.getChildrenItems({
            includeDisabled: false
        });
        if (children.length) {
            const allChecked = children.every((item)=>item.selected);
            const allUnchecked = children.every((item)=>!item.selected && !item.indeterminate);
            treeItem.selected = allChecked;
            treeItem.indeterminate = !allChecked && !allUnchecked;
        }
    }
    function syncAncestors(treeItem) {
        const parentItem = treeItem.parentElement;
        if ((0, $7b6886c0f640818c$export$df02022e7951512e).isTreeItem(parentItem)) {
            syncParentItem(parentItem);
            syncAncestors(parentItem);
        }
    }
    function syncDescendants(treeItem) {
        for (const childItem of treeItem.getChildrenItems()){
            childItem.selected = initialSync ? treeItem.selected || childItem.selected : !childItem.disabled && treeItem.selected;
            syncDescendants(childItem);
        }
        if (initialSync) syncParentItem(treeItem);
    }
    syncDescendants(changedTreeItem);
    syncAncestors(changedTreeItem);
}
var $fbd86ba99423402c$export$9405e660b76bb95a = class extends (0, $7b33480fbd5323dc$export$1c2340e2bfaed5f9) {
    constructor(){
        super();
        this.selection = "single";
        this.clickTarget = null;
        this.localize = new (0, $7fddb19538fc1728$export$b1a2fed5bb41b893)(this);
        // Initializes new items by setting the `selectable` property and the expanded/collapsed icons if any
        this.initTreeItem = (item)=>{
            item.updateComplete.then(()=>{
                item.selectable = this.selection === "multiple";
                [
                    "expand",
                    "collapse"
                ].filter((status)=>!!this.querySelector(`[slot="${status}-icon"]`)).forEach((status)=>{
                    const existingIcon = item.querySelector(`[slot="${status}-icon"]`);
                    const expandButtonIcon = this.getExpandButtonIcon(status);
                    if (!expandButtonIcon) return;
                    if (existingIcon === null) item.append(expandButtonIcon);
                    else if (existingIcon.hasAttribute("data-default")) existingIcon.replaceWith(expandButtonIcon);
                });
            });
        };
        this.handleTreeChanged = (mutations)=>{
            for (const mutation of mutations){
                const addedNodes = [
                    ...mutation.addedNodes
                ].filter((0, $7b6886c0f640818c$export$df02022e7951512e).isTreeItem);
                const removedNodes = [
                    ...mutation.removedNodes
                ].filter((0, $7b6886c0f640818c$export$df02022e7951512e).isTreeItem);
                addedNodes.forEach(this.initTreeItem);
                if (this.lastFocusedItem && removedNodes.includes(this.lastFocusedItem)) this.lastFocusedItem = null;
            }
        };
        this.handleFocusOut = (event)=>{
            const relatedTarget = event.relatedTarget;
            if (!relatedTarget || !this.contains(relatedTarget)) this.tabIndex = 0;
        };
        this.handleFocusIn = (event)=>{
            const target = event.target;
            if (event.target === this) this.focusItem(this.lastFocusedItem || this.getAllTreeItems()[0]);
            if ((0, $7b6886c0f640818c$export$df02022e7951512e).isTreeItem(target) && !target.disabled) {
                if (this.lastFocusedItem) this.lastFocusedItem.tabIndex = -1;
                this.lastFocusedItem = target;
                this.tabIndex = -1;
                target.tabIndex = 0;
            }
        };
        if (!(0, $44a4deadd6bc9fd2$export$6acf61af03e62db)) {
            this.addEventListener("focusin", this.handleFocusIn);
            this.addEventListener("focusout", this.handleFocusOut);
            this.addEventListener("wa-lazy-change", this.handleSlotChange);
        }
    }
    async connectedCallback() {
        super.connectedCallback();
        this.setAttribute("role", "tree");
        this.setAttribute("tabindex", "0");
        await this.updateComplete;
        this.mutationObserver = new MutationObserver(this.handleTreeChanged);
        this.mutationObserver.observe(this, {
            childList: true,
            subtree: true
        });
    }
    disconnectedCallback() {
        super.disconnectedCallback();
        this.mutationObserver?.disconnect();
    }
    // Generates a clone of the expand icon element to use for each tree item
    getExpandButtonIcon(status) {
        const slot = status === "expand" ? this.expandedIconSlot : this.collapsedIconSlot;
        const icon = slot.assignedElements({
            flatten: true
        })[0];
        if (icon) {
            const clone = icon.cloneNode(true);
            [
                clone,
                ...clone.querySelectorAll("[id]")
            ].forEach((el)=>el.removeAttribute("id"));
            clone.setAttribute("data-default", "");
            clone.slot = `${status}-icon`;
            return clone;
        }
        return null;
    }
    selectItem(selectedItem) {
        const previousSelection = [
            ...this.selectedItems
        ];
        if (this.selection === "multiple") {
            selectedItem.selected = !selectedItem.selected;
            if (selectedItem.lazy) selectedItem.expanded = true;
            $fbd86ba99423402c$var$syncCheckboxes(selectedItem);
        } else if (this.selection === "single" || selectedItem.isLeaf) {
            const items = this.getAllTreeItems();
            for (const item of items)item.selected = item === selectedItem;
        } else if (this.selection === "leaf") selectedItem.expanded = !selectedItem.expanded;
        const nextSelection = this.selectedItems;
        if (previousSelection.length !== nextSelection.length || nextSelection.some((item)=>!previousSelection.includes(item))) Promise.all(nextSelection.map((el)=>el.updateComplete)).then(()=>{
            this.dispatchEvent(new (0, $2b76c5278aa8d71a$export$e5ee3aaf10a9965f)({
                selection: nextSelection
            }));
        });
    }
    getAllTreeItems() {
        return [
            ...this.querySelectorAll("wa-tree-item")
        ];
    }
    focusItem(item) {
        item?.focus();
    }
    handleKeyDown(event) {
        if (![
            "ArrowDown",
            "ArrowUp",
            "ArrowRight",
            "ArrowLeft",
            "Home",
            "End",
            "Enter",
            " "
        ].includes(event.key)) return;
        if (event.composedPath().some((el)=>[
                "input",
                "textarea"
            ].includes(el?.tagName?.toLowerCase()))) return;
        const items = this.getFocusableItems();
        const isLtr = this.matches(":dir(ltr)");
        const isRtl = this.localize.dir() === "rtl";
        if (items.length > 0) {
            event.preventDefault();
            const activeItemIndex = items.findIndex((item)=>item.matches(":focus"));
            const activeItem = items[activeItemIndex];
            const focusItemAt = (index)=>{
                const item = items[(0, $0d9abbe812fa507c$export$7d15b64cf5a3a4c4)(index, 0, items.length - 1)];
                this.focusItem(item);
            };
            const toggleExpand = (expanded)=>{
                activeItem.expanded = expanded;
            };
            if (event.key === "ArrowDown") focusItemAt(activeItemIndex + 1);
            else if (event.key === "ArrowUp") focusItemAt(activeItemIndex - 1);
            else if (isLtr && event.key === "ArrowRight" || isRtl && event.key === "ArrowLeft") {
                if (!activeItem || activeItem.disabled || activeItem.expanded || activeItem.isLeaf && !activeItem.lazy) focusItemAt(activeItemIndex + 1);
                else toggleExpand(true);
            } else if (isLtr && event.key === "ArrowLeft" || isRtl && event.key === "ArrowRight") {
                if (!activeItem || activeItem.disabled || activeItem.isLeaf || !activeItem.expanded) focusItemAt(activeItemIndex - 1);
                else toggleExpand(false);
            } else if (event.key === "Home") focusItemAt(0);
            else if (event.key === "End") focusItemAt(items.length - 1);
            else if (event.key === "Enter" || event.key === " ") {
                if (!activeItem.disabled) this.selectItem(activeItem);
            }
        }
    }
    handleClick(event) {
        const target = event.target;
        const treeItem = target.closest("wa-tree-item");
        const isExpandButton = event.composedPath().some((el)=>el?.classList?.contains("expand-button"));
        if (!treeItem || treeItem.disabled || target !== this.clickTarget) return;
        if (isExpandButton) treeItem.expanded = !treeItem.expanded;
        else this.selectItem(treeItem);
    }
    handleMouseDown(event) {
        this.clickTarget = event.target;
    }
    handleSlotChange() {
        const items = this.getAllTreeItems();
        items.forEach(this.initTreeItem);
    }
    async handleSelectionChange() {
        const isSelectionMultiple = this.selection === "multiple";
        const items = this.getAllTreeItems();
        this.setAttribute("aria-multiselectable", isSelectionMultiple ? "true" : "false");
        for (const item of items)item.updateComplete.then(()=>{
            item.selectable = isSelectionMultiple;
        });
        if (isSelectionMultiple) {
            await this.updateComplete;
            [
                ...this.querySelectorAll(":scope > wa-tree-item")
            ].forEach((treeItem)=>{
                treeItem.updateComplete.then(()=>{
                    $fbd86ba99423402c$var$syncCheckboxes(treeItem, true);
                });
            });
        }
    }
    /** @internal Returns the list of tree items that are selected in the tree. */ get selectedItems() {
        const items = this.getAllTreeItems();
        const isSelected = (item)=>item.selected;
        return items.filter(isSelected);
    }
    /** @internal Gets focusable tree items in the tree. */ getFocusableItems() {
        const items = this.getAllTreeItems();
        const collapsedItems = /* @__PURE__ */ new Set();
        return items.filter((item)=>{
            if (item.disabled) return false;
            const parent = item.parentElement?.closest("[role=treeitem]");
            if (parent && (!parent.expanded || parent.loading || collapsedItems.has(parent))) collapsedItems.add(item);
            return !collapsedItems.has(item);
        });
    }
    render() {
        return (0, $aed1389927a5dd65$export$c0bb0b647f701bb5)`
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
    `;
    }
};
$fbd86ba99423402c$export$9405e660b76bb95a.css = (0, $079baa0d9703c14c$export$a93abbea96ceefc7);
(0, $e94b2b28708d0aa9$export$85c93885f16e8446)([
    (0, $c0447c72baf98ff7$export$2fa187e846a241c4)("slot:not([name])")
], $fbd86ba99423402c$export$9405e660b76bb95a.prototype, "defaultSlot", 2);
(0, $e94b2b28708d0aa9$export$85c93885f16e8446)([
    (0, $c0447c72baf98ff7$export$2fa187e846a241c4)("slot[name=expand-icon]")
], $fbd86ba99423402c$export$9405e660b76bb95a.prototype, "expandedIconSlot", 2);
(0, $e94b2b28708d0aa9$export$85c93885f16e8446)([
    (0, $c0447c72baf98ff7$export$2fa187e846a241c4)("slot[name=collapse-icon]")
], $fbd86ba99423402c$export$9405e660b76bb95a.prototype, "collapsedIconSlot", 2);
(0, $e94b2b28708d0aa9$export$85c93885f16e8446)([
    (0, $28816b39eccda61d$export$d541bacb2bda4494)()
], $fbd86ba99423402c$export$9405e660b76bb95a.prototype, "selection", 2);
(0, $e94b2b28708d0aa9$export$85c93885f16e8446)([
    (0, $3079f7c458d2314a$export$3db5d71bdb2d5499)("selection")
], $fbd86ba99423402c$export$9405e660b76bb95a.prototype, "handleSelectionChange", 1);
$fbd86ba99423402c$export$9405e660b76bb95a = (0, $e94b2b28708d0aa9$export$85c93885f16e8446)([
    (0, $b777701f54f11b66$export$da64fc29f17f9d0e)("wa-tree")
], $fbd86ba99423402c$export$9405e660b76bb95a);














/*! Copyright 2026 Fonticons, Inc. - https://webawesome.com/license */ /*! Copyright 2026 Fonticons, Inc. - https://webawesome.com/license */ // src/internal/validators/required-validator.ts
var $4de43a45fb7951fc$export$3ecd57aaf2492c21 = (options = {})=>{
    let { validationElement: validationElement, validationProperty: validationProperty } = options;
    if (!validationElement) validationElement = Object.assign(document.createElement("input"), {
        required: true
    });
    if (!validationProperty) validationProperty = "value";
    const obj = {
        observedAttributes: [
            "required"
        ],
        message: validationElement.validationMessage,
        // @TODO: Add a translation.
        checkValidity (element) {
            const validity = {
                message: "",
                isValid: true,
                invalidKeys: []
            };
            const isRequired = element.required ?? element.hasAttribute("required");
            if (!isRequired) return validity;
            const value = element[validationProperty];
            const isEmpty = !value;
            if (isEmpty) {
                validity.message = typeof obj.message === "function" ? obj.message(element) : obj.message || "";
                validity.isValid = false;
                validity.invalidKeys.push("valueMissing");
            }
            return validity;
        }
    };
    return obj;
};


/*! Copyright 2026 Fonticons, Inc. - https://webawesome.com/license */ // src/styles/component/form-control.styles.ts

var $4d205130983bba1c$export$e7c8528c268605e9 = (0, $987a32d81eef3330$export$dbf350e5966cf602)`
  :host {
    display: flex;
    flex-direction: column;
  }

  /* Treat wrapped labels, inputs, and hints as direct children of the host element */
  [part~='form-control'] {
    display: contents;
  }

  /* Label */
  :is([part~='form-control-label'], [part~='label']):has(*:not(:empty)),
  :is([part~='form-control-label'], [part~='label']).has-label {
    display: inline-flex;
    color: var(--wa-form-control-label-color);
    font-weight: var(--wa-form-control-label-font-weight);
    line-height: var(--wa-form-control-label-line-height);
    margin-block-end: 0.5em;
  }

  :host([required]) :is([part~='form-control-label'], [part~='label'])::after {
    content: var(--wa-form-control-required-content);
    margin-inline-start: var(--wa-form-control-required-content-offset);
    color: var(--wa-form-control-required-content-color);
  }

  /* Help text */
  [part~='hint'] {
    display: block;
    color: var(--wa-form-control-hint-color);
    font-weight: var(--wa-form-control-hint-font-weight);
    line-height: var(--wa-form-control-hint-line-height);
    margin-block-start: 0.5em;
    font-size: var(--wa-font-size-smaller);

    &:not(.has-slotted, .has-hint) {
      display: none;
    }
  }
`;


/*! Copyright 2026 Fonticons, Inc. - https://webawesome.com/license */ // src/components/checkbox/checkbox.styles.ts

var $697ca362564a3c54$export$d780863e08270d06 = (0, $987a32d81eef3330$export$dbf350e5966cf602)`
  :host {
    --checked-icon-color: var(--wa-color-brand-on-loud);
    --checked-icon-scale: 0.8;

    display: inline-flex;
    color: var(--wa-form-control-value-color);
    font-family: inherit;
    font-weight: var(--wa-form-control-value-font-weight);
    line-height: var(--wa-form-control-value-line-height);
    user-select: none;
    -webkit-user-select: none;
  }

  [part~='control'] {
    display: inline-flex;
    flex: 0 0 auto;
    position: relative;
    align-items: center;
    justify-content: center;
    width: var(--wa-form-control-toggle-size);
    height: var(--wa-form-control-toggle-size);
    border-color: var(--wa-form-control-border-color);
    border-radius: min(
      calc(var(--wa-form-control-toggle-size) * 0.375),
      var(--wa-border-radius-s)
    ); /* min prevents entirely circular checkbox */
    border-style: var(--wa-border-style);
    border-width: var(--wa-form-control-border-width);
    background-color: var(--wa-form-control-background-color);
    transition:
      background var(--wa-transition-normal),
      border-color var(--wa-transition-fast),
      box-shadow var(--wa-transition-fast),
      color var(--wa-transition-fast);
    transition-timing-function: var(--wa-transition-easing);

    margin-inline-end: 0.5em;
  }

  [part~='base'] {
    display: flex;
    align-items: flex-start;
    position: relative;
    color: currentColor;
    vertical-align: middle;
    cursor: pointer;
  }

  [part~='label'] {
    display: inline;
  }

  /* Checked */
  [part~='control']:has(:checked, :indeterminate) {
    color: var(--checked-icon-color);
    border-color: var(--wa-form-control-activated-color);
    background-color: var(--wa-form-control-activated-color);
  }

  /* Focus */
  [part~='control']:has(> input:focus-visible:not(:disabled)) {
    outline: var(--wa-focus-ring);
    outline-offset: var(--wa-focus-ring-offset);
  }

  /* Disabled */
  :host [part~='base']:has(input:disabled) {
    opacity: 0.5;
    cursor: not-allowed;
  }

  input {
    position: absolute;
    padding: 0;
    margin: 0;
    height: 100%;
    width: 100%;
    opacity: 0;
    pointer-events: none;
  }

  [part~='icon'] {
    display: flex;
    scale: var(--checked-icon-scale);

    /* Without this, Safari renders the icon slightly to the left */
    &::part(svg) {
      translate: 0.0009765625em;
    }

    input:not(:checked, :indeterminate) + & {
      visibility: hidden;
    }
  }

  :host([required]) [part~='label']::after {
    content: var(--wa-form-control-required-content);
    color: var(--wa-form-control-required-content-color);
    margin-inline-start: var(--wa-form-control-required-content-offset);
  }
`;



/*! Copyright 2026 Fonticons, Inc. - https://webawesome.com/license */ // src/internal/slot.ts
var $93b7a88a94552b15$export$34f6a5ffaa663541 = class {
    constructor(host, ...slotNames){
        this.slotNames = [];
        this.handleSlotChange = (event)=>{
            const slot = event.target;
            if (this.slotNames.includes("[default]") && !slot.name || slot.name && this.slotNames.includes(slot.name)) this.host.requestUpdate();
        };
        (this.host = host).addController(this);
        this.slotNames = slotNames;
    }
    hasDefaultSlot() {
        return [
            ...this.host.childNodes
        ].some((node)=>{
            if (node.nodeType === Node.TEXT_NODE && node.textContent.trim() !== "") return true;
            if (node.nodeType === Node.ELEMENT_NODE) {
                const el = node;
                const tagName = el.tagName.toLowerCase();
                if (tagName === "wa-visually-hidden") return false;
                if (!el.hasAttribute("slot")) return true;
            }
            return false;
        });
    }
    hasNamedSlot(name) {
        return this.host.querySelector(`:scope > [slot="${name}"]`) !== null;
    }
    test(slotName) {
        return slotName === "[default]" ? this.hasDefaultSlot() : this.hasNamedSlot(slotName);
    }
    hostConnected() {
        this.host.shadowRoot.addEventListener("slotchange", this.handleSlotChange);
    }
    hostDisconnected() {
        this.host.shadowRoot.removeEventListener("slotchange", this.handleSlotChange);
    }
};


/*! Copyright 2026 Fonticons, Inc. - https://webawesome.com/license */ // src/styles/component/size.styles.ts

var $76e721fb5185d65c$export$8c032c9774eed3ea = (0, $987a32d81eef3330$export$dbf350e5966cf602)`
  :host([size='small']),
  .wa-size-s {
    font-size: var(--wa-font-size-s);
  }

  :host([size='medium']),
  .wa-size-m {
    font-size: var(--wa-font-size-m);
  }

  :host([size='large']),
  .wa-size-l {
    font-size: var(--wa-font-size-l);
  }
`;








/**
 * @license
 * Copyright 2018 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */ const $f1299c93a6622d9e$export$f68dd208b5df064d = (o)=>o ?? (0, $aed1389927a5dd65$export$45b790e32b2810ee);





var $b39a15d50be82877$export$61e9d6bb6a430d58 = class extends (0, $e2f29c58e6e4411c$export$8f4cbae1a5641ee6) {
    constructor(){
        super(...arguments);
        this.hasSlotController = new (0, $93b7a88a94552b15$export$34f6a5ffaa663541)(this, "hint");
        this.title = "";
        this.name = "";
        this._value = this.getAttribute("value") ?? null;
        this.size = "medium";
        this.disabled = false;
        this.indeterminate = false;
        this.checked = this.hasAttribute("checked");
        this.defaultChecked = this.hasAttribute("checked");
        this.required = false;
        this.hint = "";
    }
    static get validators() {
        const validators = (0, $44a4deadd6bc9fd2$export$6acf61af03e62db) ? [] : [
            (0, $4de43a45fb7951fc$export$3ecd57aaf2492c21)({
                validationProperty: "checked",
                // Use a checkbox so we get "free" translation strings.
                validationElement: Object.assign(document.createElement("input"), {
                    type: "checkbox",
                    required: true
                })
            })
        ];
        return [
            ...super.validators,
            ...validators
        ];
    }
    /** The value of the checkbox, submitted as a name/value pair with form data. */ get value() {
        const val = this._value || "on";
        return this.checked ? val : null;
    }
    set value(val) {
        this._value = val;
    }
    handleClick() {
        this.hasInteracted = true;
        this.checked = !this.checked;
        this.indeterminate = false;
        this.updateComplete.then(()=>{
            this.dispatchEvent(new Event("change", {
                bubbles: true,
                composed: true
            }));
        });
    }
    handleDefaultCheckedChange() {
        if (!this.hasInteracted && this.checked !== this.defaultChecked) {
            this.checked = this.defaultChecked;
            this.handleValueOrCheckedChange();
        }
    }
    handleValueOrCheckedChange() {
        this.setValue(this.checked ? this.value : null, this._value);
        this.updateValidity();
    }
    handleStateChange() {
        if (this.hasUpdated) {
            this.input.checked = this.checked;
            this.input.indeterminate = this.indeterminate;
        }
        this.customStates.set("checked", this.checked);
        this.customStates.set("indeterminate", this.indeterminate);
        this.updateValidity();
    }
    handleDisabledChange() {
        this.customStates.set("disabled", this.disabled);
    }
    willUpdate(changedProperties) {
        super.willUpdate(changedProperties);
        if (changedProperties.has("defaultChecked")) {
            if (!this.hasInteracted) this.checked = this.defaultChecked;
        }
        if (changedProperties.has("value") || changedProperties.has("checked")) this.handleValueOrCheckedChange();
    }
    formResetCallback() {
        this.checked = this.defaultChecked;
        super.formResetCallback();
        this.handleValueOrCheckedChange();
    }
    /** Simulates a click on the checkbox. */ click() {
        this.input.click();
    }
    /** Sets focus on the checkbox. */ focus(options) {
        this.input.focus(options);
    }
    /** Removes focus from the checkbox. */ blur() {
        this.input.blur();
    }
    render() {
        const hasHintSlot = (0, $44a4deadd6bc9fd2$export$6acf61af03e62db) ? true : this.hasSlotController.test("hint");
        const hasHint = this.hint ? true : !!hasHintSlot;
        const isIndeterminate = !this.checked && this.indeterminate;
        const iconName = isIndeterminate ? "indeterminate" : "check";
        const iconState = isIndeterminate ? "indeterminate" : "check";
        return (0, $aed1389927a5dd65$export$c0bb0b647f701bb5)`
      <label part="base">
        <span part="control">
          <input
            class="input"
            type="checkbox"
            title=${this.title}
            name=${this.name}
            value=${(0, $f1299c93a6622d9e$export$f68dd208b5df064d)(this._value)}
            .indeterminate=${(0, $2a53f42e0cbfd651$export$28cf49ad70f82d12)(this.indeterminate)}
            .checked=${(0, $2a53f42e0cbfd651$export$28cf49ad70f82d12)(this.checked)}
            .disabled=${this.disabled}
            .required=${this.required}
            aria-checked=${this.checked ? "true" : "false"}
            aria-describedby="hint"
            @click=${this.handleClick}
          />

          <wa-icon part="${iconState}-icon icon" library="system" name=${iconName}></wa-icon>
        </span>

        <slot part="label"></slot>
      </label>

      <slot
        id="hint"
        part="hint"
        name="hint"
        aria-hidden=${hasHint ? "false" : "true"}
        class="${(0, $b5822ac1f58ba956$export$56cc687933817664)({
            "has-slotted": hasHint
        })}"
      >
        ${this.hint}
      </slot>
    `;
    }
};
$b39a15d50be82877$export$61e9d6bb6a430d58.css = [
    (0, $4d205130983bba1c$export$e7c8528c268605e9),
    (0, $76e721fb5185d65c$export$8c032c9774eed3ea),
    (0, $697ca362564a3c54$export$d780863e08270d06)
];
$b39a15d50be82877$export$61e9d6bb6a430d58.shadowRootOptions = {
    ...(0, $e2f29c58e6e4411c$export$8f4cbae1a5641ee6).shadowRootOptions,
    delegatesFocus: true
};
(0, $e94b2b28708d0aa9$export$85c93885f16e8446)([
    (0, $c0447c72baf98ff7$export$2fa187e846a241c4)('input[type="checkbox"]')
], $b39a15d50be82877$export$61e9d6bb6a430d58.prototype, "input", 2);
(0, $e94b2b28708d0aa9$export$85c93885f16e8446)([
    (0, $28816b39eccda61d$export$d541bacb2bda4494)()
], $b39a15d50be82877$export$61e9d6bb6a430d58.prototype, "title", 2);
(0, $e94b2b28708d0aa9$export$85c93885f16e8446)([
    (0, $28816b39eccda61d$export$d541bacb2bda4494)({
        reflect: true
    })
], $b39a15d50be82877$export$61e9d6bb6a430d58.prototype, "name", 2);
(0, $e94b2b28708d0aa9$export$85c93885f16e8446)([
    (0, $28816b39eccda61d$export$d541bacb2bda4494)({
        reflect: true
    })
], $b39a15d50be82877$export$61e9d6bb6a430d58.prototype, "value", 1);
(0, $e94b2b28708d0aa9$export$85c93885f16e8446)([
    (0, $28816b39eccda61d$export$d541bacb2bda4494)({
        reflect: true
    })
], $b39a15d50be82877$export$61e9d6bb6a430d58.prototype, "size", 2);
(0, $e94b2b28708d0aa9$export$85c93885f16e8446)([
    (0, $28816b39eccda61d$export$d541bacb2bda4494)({
        type: Boolean
    })
], $b39a15d50be82877$export$61e9d6bb6a430d58.prototype, "disabled", 2);
(0, $e94b2b28708d0aa9$export$85c93885f16e8446)([
    (0, $28816b39eccda61d$export$d541bacb2bda4494)({
        type: Boolean,
        reflect: true
    })
], $b39a15d50be82877$export$61e9d6bb6a430d58.prototype, "indeterminate", 2);
(0, $e94b2b28708d0aa9$export$85c93885f16e8446)([
    (0, $28816b39eccda61d$export$d541bacb2bda4494)({
        type: Boolean,
        attribute: false
    })
], $b39a15d50be82877$export$61e9d6bb6a430d58.prototype, "checked", 2);
(0, $e94b2b28708d0aa9$export$85c93885f16e8446)([
    (0, $28816b39eccda61d$export$d541bacb2bda4494)({
        type: Boolean,
        reflect: true,
        attribute: "checked"
    })
], $b39a15d50be82877$export$61e9d6bb6a430d58.prototype, "defaultChecked", 2);
(0, $e94b2b28708d0aa9$export$85c93885f16e8446)([
    (0, $28816b39eccda61d$export$d541bacb2bda4494)({
        type: Boolean,
        reflect: true
    })
], $b39a15d50be82877$export$61e9d6bb6a430d58.prototype, "required", 2);
(0, $e94b2b28708d0aa9$export$85c93885f16e8446)([
    (0, $28816b39eccda61d$export$d541bacb2bda4494)()
], $b39a15d50be82877$export$61e9d6bb6a430d58.prototype, "hint", 2);
(0, $e94b2b28708d0aa9$export$85c93885f16e8446)([
    (0, $3079f7c458d2314a$export$3db5d71bdb2d5499)("defaultChecked")
], $b39a15d50be82877$export$61e9d6bb6a430d58.prototype, "handleDefaultCheckedChange", 1);
(0, $e94b2b28708d0aa9$export$85c93885f16e8446)([
    (0, $3079f7c458d2314a$export$3db5d71bdb2d5499)([
        "checked",
        "indeterminate"
    ])
], $b39a15d50be82877$export$61e9d6bb6a430d58.prototype, "handleStateChange", 1);
(0, $e94b2b28708d0aa9$export$85c93885f16e8446)([
    (0, $3079f7c458d2314a$export$3db5d71bdb2d5499)("disabled")
], $b39a15d50be82877$export$61e9d6bb6a430d58.prototype, "handleDisabledChange", 1);
$b39a15d50be82877$export$61e9d6bb6a430d58 = (0, $e94b2b28708d0aa9$export$85c93885f16e8446)([
    (0, $b777701f54f11b66$export$da64fc29f17f9d0e)("wa-checkbox")
], $b39a15d50be82877$export$61e9d6bb6a430d58);





/*! Copyright 2026 Fonticons, Inc. - https://webawesome.com/license */ /*! Copyright 2026 Fonticons, Inc. - https://webawesome.com/license */ // src/components/spinner/spinner.styles.ts

var $5f66755dfeb7843d$export$6a9ed4d91972acb3 = (0, $987a32d81eef3330$export$dbf350e5966cf602)`
  :host {
    --track-width: 2px;
    --track-color: var(--wa-color-neutral-fill-normal);
    --indicator-color: var(--wa-color-brand-fill-loud);
    --speed: 2s;

    /*
      Resizing a spinner element using anything but font-size will break the animation because the animation uses em
      units. Therefore, if a spinner is used in a flex container without \`flex: none\` applied, the spinner can
      grow/shrink and break the animation. The use of \`flex: none\` on the host element prevents this by always having
      the spinner sized according to its actual dimensions.
    */
    flex: none;
    display: inline-flex;
    width: 1em;
    height: 1em;
  }

  svg {
    width: 100%;
    height: 100%;
    aspect-ratio: 1;
    animation: spin var(--speed) linear infinite;
  }

  .track {
    stroke: var(--track-color);
  }

  .indicator {
    stroke: var(--indicator-color);
    stroke-dasharray: 75, 100;
    stroke-dashoffset: -5;
    animation: dash 1.5s ease-in-out infinite;
    stroke-linecap: round;
  }

  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }

  @keyframes dash {
    0% {
      stroke-dasharray: 1, 150;
      stroke-dashoffset: 0;
    }
    50% {
      stroke-dasharray: 90, 150;
      stroke-dashoffset: -35;
    }
    100% {
      stroke-dasharray: 90, 150;
      stroke-dashoffset: -124;
    }
  }
`;







var $bf4f827afa79c154$export$7c9c940b7822a46a = class extends (0, $7b33480fbd5323dc$export$1c2340e2bfaed5f9) {
    constructor(){
        super(...arguments);
        this.localize = new (0, $7fddb19538fc1728$export$b1a2fed5bb41b893)(this);
    }
    render() {
        return (0, $aed1389927a5dd65$export$c0bb0b647f701bb5)`
      <svg
        part="base"
        role="progressbar"
        aria-label=${this.localize.term("loading")}
        fill="none"
        viewBox="0 0 50 50"
        xmlns="http://www.w3.org/2000/svg"
      >
        <circle class="track" cx="25" cy="25" r="20" fill="none" stroke-width="5" />
        <circle class="indicator" cx="25" cy="25" r="20" fill="none" stroke-width="5" />
      </svg>
    `;
    }
};
$bf4f827afa79c154$export$7c9c940b7822a46a.css = (0, $5f66755dfeb7843d$export$6a9ed4d91972acb3);
$bf4f827afa79c154$export$7c9c940b7822a46a = (0, $e94b2b28708d0aa9$export$85c93885f16e8446)([
    (0, $b777701f54f11b66$export$da64fc29f17f9d0e)("wa-spinner")
], $bf4f827afa79c154$export$7c9c940b7822a46a);






















/*! Copyright 2026 Fonticons, Inc. - https://webawesome.com/license */ 


































const $7e4d80bc56f0b6c9$var$slotToIcon = {
    'expand-icon': 'chevron-right',
    'collapse-icon': 'chevron-right'
};
function $7e4d80bc56f0b6c9$var$preventDefault(e) {
    e.preventDefault();
}
function $7e4d80bc56f0b6c9$var$stopImmediatePropagation(e) {
    e.stopImmediatePropagation();
}
class $7e4d80bc56f0b6c9$var$JsdocTree extends (0, $fbd86ba99423402c$export$9405e660b76bb95a) {
    // Renaming <wa-tree-item> breaks handleClick(), so we provide our own version.
    handleClick(event) {
        const target = event.target;
        const treeItem = target.closest('jsdoc-tree-item');
        const isExpandButton = event.composedPath().some((el)=>el?.classList?.contains('expand-button'));
        if (!treeItem || treeItem.disabled || target !== this.clickTarget) return;
        if (isExpandButton) treeItem.expanded = !treeItem.expanded;
        else this.selectItem(treeItem);
    }
}
class $7e4d80bc56f0b6c9$var$JsdocTreeItem extends (0, $7b6886c0f640818c$export$df02022e7951512e) {
    connectedCallback() {
        super.connectedCallback();
        Object.entries($7e4d80bc56f0b6c9$var$slotToIcon).forEach(([slotName, iconName])=>{
            const icon = (0, $585b166d7a16149d$export$274edc73af1ae9c8)([
                slotName,
                iconName
            ]);
            this.prepend(icon);
        });
        (0, $585b166d7a16149d$export$daed2daeba655e15)();
    }
    firstUpdated() {
        super.firstUpdated();
        for (const waIcon of this.shadowRoot.querySelectorAll('wa-icon'))waIcon.remove();
    }
}
customElements.define('jsdoc-tree', $7e4d80bc56f0b6c9$var$JsdocTree);
customElements.define('jsdoc-tree-item', $7e4d80bc56f0b6c9$var$JsdocTreeItem);
// Prevent always-open accordions from being closed and reopened.
document.querySelectorAll('wa-details').forEach((item)=>{
    item.addEventListener('wa-hide', $7e4d80bc56f0b6c9$var$preventDefault);
    item.addEventListener('wa-show', $7e4d80bc56f0b6c9$var$preventDefault);
});
// Prevent expandable tree items from expanding when their link is clicked.
document.querySelectorAll(':not(wa-details) > jsdoc-tree > jsdoc-tree-item').forEach((item)=>{
    const child = item.firstElementChild;
    if (child?.localName === 'a') child.addEventListener('click', $7e4d80bc56f0b6c9$var$stopImmediatePropagation);
});




//# sourceMappingURL=jsdoc.js.map
