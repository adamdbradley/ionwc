(function() {
'use strict';

let styles = `

.checkbox-md {
  position: relative;
  display: inline-block; }

.checkbox-icon {
  position: relative;
  width: 16px;
  height: 16px;
  border-width: 2px;
  border-style: solid;
  border-radius: 2px;
  border-color: #787878;
  background-color: #fff;
  transition-duration: 280ms;
  transition-property: background;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
box-sizing: border-box;
}

.checkbox-checked {
  border-color: #327eff;
  background-color: #327eff; }

.checkbox-checked .checkbox-inner {
  position: absolute;
  top: 0;
  left: 4px;
  width: 5px;
  height: 10px;
  border-width: 2px;
  border-top-width: 0;
  border-left-width: 0;
  border-style: solid;
  border-color: #fff;
  -webkit-transform: rotate(45deg);
  transform: rotate(45deg);
box-sizing: border-box;}

.checkbox-disabled {
  opacity: 0.3;
  pointer-events: none; }

.item.item-md .checkbox-md {
  position: static;
  display: block;
  margin: 9px 36px 9px 4px; }

.item.item-md .checkbox-md[item-right] {
  margin: 11px 10px 10px 0; }

.checkbox-md + .item-inner ion-label {
  margin-left: 0; }

.checkbox-md-primary .checkbox-checked {
  border-color: #327eff;
  background-color: #327eff; }

.checkbox-md-primary .checkbox-checked .checkbox-inner {
  border-color: #fff; }

.checkbox-md-secondary .checkbox-checked {
  border-color: #32db64;
  background-color: #32db64; }

.checkbox-md-secondary .checkbox-checked .checkbox-inner {
  border-color: #fff; }

.checkbox-md-danger .checkbox-checked {
  border-color: #f53d3d;
  background-color: #f53d3d; }

.checkbox-md-danger .checkbox-checked .checkbox-inner {
  border-color: #fff; }

.checkbox-md-light .checkbox-checked {
  border-color: #f4f4f4;
  background-color: #f4f4f4; }

.checkbox-md-light .checkbox-checked .checkbox-inner {
  border-color: #000; }

.checkbox-md-dark .checkbox-checked {
  border-color: #222;
  background-color: #222; }

.checkbox-md-dark .checkbox-checked .checkbox-inner {
  border-color: #fff; }

button {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: transparent;
  cursor: pointer;
  border: 0;
  font-family: inherit;
  font-style: inherit;
  font-variant: inherit;
  line-height: 1;
  text-transform: none;
  cursor: pointer;
  -webkit-appearance: none;
  text-decoration: none;
  touch-action: manipulation;
}
:focus {
    outline: none;
}
`;

customElements.define('ion-checkbox-wc', class extends HTMLElement {

  constructor() {
    super();
    const self = this;

    self._checked = false;
    self._disabled = false;

    let root = self.attachShadow({mode: 'open'});

    createEle(root, 'style', null, null, styles);

    self._icon = createEle(root, 'div', 'checkbox-icon');

    createEle(self._icon, 'div', 'checkbox-inner');

    self._btn = createEle(root, 'button', null, {'role': 'checkbox', 'type': 'button'});
  }

  connectedCallback() {
    const self = this;
    registerListener(self, self._btn, 'click', self._onClick);

    setCssClass(self, 'checkbox-md');
  }

  disconnectedCallback() {
    unregisterListeners(this)
  }

  _onClick(ev) {
    this.checked = !this._checked;
  }

  get checked() {
    return this._checked;
  }
  set checked(value) {
    const self = this;
    value = isTrueProperty(value);
    if (value !== self._checked) {
      self._checked = value;

      setCssClass(self._icon, 'checkbox-checked', value);
      setAttr(self._btn, 'aria-checked', value);

      emitEvent(self, 'ionChange', value);
    }
  }

  get disabled() {
    return this._disabled;
  }
  set disabled(value) {
    debugger
    const self = this;
    value = isTrueProperty(value);
    if (value !== _disabled) {
      self._disabled = value;

      setElementClass(self, 'checkbox-disabled', value);
      setAttr(self.btn, 'aria-disabled', value);
    }
  }

});

function isTrueProperty(val) {
  if (typeof val === 'string') {
    val = val.toLowerCase().trim();
    return (val === 'true' || val === 'on' || val === '');
  }
  return !!val;
}

function createEle(parentEle, tagName, className, attrs, innerHTML) {
  var ele = document.createElement(tagName);
  if (className) {
    ele.className = className;
  }
  if (attrs) {
    var keys = Object.keys(attrs);
    for (var i = 0; i < keys.length; i++) {
      ele.setAttribute(keys[i], attrs[keys[i]]);
    }
  }
  if (innerHTML) {
    ele.innerHTML = innerHTML;
  }
  parentEle.appendChild(ele);
  return ele;
}

function emitEvent(fromTarget, eventName, detail) {
  const ev = new CustomEvent(eventName, { 'detail': detail });
  fromTarget.dispatchEvent(ev);
}

function registerListener(ctx, target, eventName, fn) {
  var boundFn  = fn.bind(ctx);
  target.addEventListener(eventName, boundFn);

  if (!ctx._listeners) {
    ctx._listeners = [];
  }

  ctx._listeners.push(function() {
    target.removeEventListener(eventName, boundFn);
  });
}

function unregisterListeners(ctx) {
  const listeners = ctx._listeners;
  if (listeners) {
    for (var i = 0; i < listeners.length; i++) {
      listeners[i]();
    }
    listeners.length = 0;
  }
}

function setCssClass(ele, className, isAdd) {
  ele.classList[isAdd === false ? 'remove' : 'add'](className);
}

function setAttr(ele, attrName, attrValue) {
  if (attrValue === null) {
    ele.removeAttribute(attrName);
  } else {
    ele.setAttribute(attrName, attrValue);
  }
}

function setText(ele, textValue) {
  ele.textContent = textValue;
}

})();
