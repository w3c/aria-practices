/*
 *   This content is licensed according to the W3C Software License at
 *   https://www.w3.org/Consortium/Legal/2015/copyright-software-and-document
 *
 *   File:   quantity-spinbutton.js
 */

'use strict';

class SpinButton {
  constructor(el) {
    this.el = el;
    this.id = el.id;
    this.controls = Array.from(
      document.querySelectorAll(`button[aria-controls="${this.id}"]`)
    );
    this.output = document.querySelector(`output[for="${this.id}"]`);
    this.timer = null;
    this.setBounds();
    el.addEventListener('input', () => this.setValue(el.value));
    el.addEventListener('blur', () => this.setValue(el.value, true));
    el.addEventListener('keydown', (e) => this.handleKey(e));
    this.controls.forEach((btn) =>
      btn.addEventListener('click', () => this.handleClick(btn))
    );
    this.setValue(el.value);
  }

  clamp(n) {
    return Math.min(Math.max(n, this.min), this.max);
  }

  parseValue(raw) {
    const s = String(raw).trim();
    if (!s) return null;
    const n = parseInt(s.replace(/[^\d-]/g, ''), 10);
    return isNaN(n) ? null : n;
  }

  setBounds() {
    const el = this.el;
    this.hasMin = el.hasAttribute('aria-valuemin');
    this.hasMax = el.hasAttribute('aria-valuemax');
    this.min = this.hasMin
      ? +el.getAttribute('aria-valuemin')
      : Number.MIN_SAFE_INTEGER;
    this.max = this.hasMax
      ? +el.getAttribute('aria-valuemax')
      : Number.MAX_SAFE_INTEGER;
  }

  setValue(raw, onBlur = false) {
    let val = typeof raw === 'number' ? raw : this.parseValue(raw);
    val =
      val === null ? (onBlur && this.hasMin ? this.min : '') : this.clamp(val);
    this.el.value = val;
    this.el.setAttribute('aria-valuenow', val);
    this.updateButtonStates();
  }

  updateButtonStates() {
    const val = +this.el.value;
    this.controls.forEach((btn) => {
      const op = btn.getAttribute('data-spinbutton-operation');
      btn.setAttribute(
        'aria-disabled',
        (op === 'decrement' ? val <= this.min : val >= this.max)
          ? 'true'
          : 'false'
      );
    });
  }

  announce() {
    if (!this.output) return;
    this.output.textContent = this.el.value;
    clearTimeout(this.timer);
    this.timer = setTimeout(() => {
      this.output.textContent = '';
      this.timer = null;
    }, 3000);
  }

  handleKey(e) {
    let v = +this.el.value || 0;
    if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
      e.preventDefault();
      this.setValue(v + (e.key === 'ArrowUp' ? 1 : -1));
    } else if (e.key === 'Home') {
      e.preventDefault();
      this.setValue(this.min);
    } else if (e.key === 'End') {
      e.preventDefault();
      this.setValue(this.max);
    }
  }

  handleClick(btn) {
    const dir =
      btn.getAttribute('data-spinbutton-operation') === 'decrement' ? -1 : 1;
    this.setValue((+this.el.value || 0) + dir);
    this.announce();
  }
}

window.addEventListener('load', () =>
  document
    .querySelectorAll('[role="spinbutton"]')
    .forEach((el) => new SpinButton(el))
);
