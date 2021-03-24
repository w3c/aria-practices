/*
 *   This content is licensed according to the W3C Software License at
 *   https://www.w3.org/Consortium/Legal/2015/copyright-software-and-document
 *
 *   Simple accordion pattern example
 */

'use strict';

// options are:
// { onAccordionClick?: function, disableOpenButton?: boolean }

export class Accordion {
  constructor(domNode, options = {}) {
    this.rootEl = domNode;
    this.buttonEl = this.rootEl.querySelector('button[aria-expanded]');
    this.options = options;

    const controlsId = this.buttonEl.getAttribute('aria-controls');
    this.contentEl = document.getElementById(controlsId);

    this.isOpen = this.buttonEl.getAttribute('aria-expanded') === 'true';

    // add event listeners
    this.buttonEl.addEventListener('click', this.onButtonClick.bind(this));
  }

  onButtonClick() {
    const { onAccordionClick = this.toggle.bind(this) } = this.options;

    onAccordionClick(!this.isOpen, this);
  }

  toggle(open) {
    console.log('accordion toggle fn');
    // don't do anything if the open state doesn't change
    if (open === this.isOpen) {
      return;
    }

    // update the internal state
    this.isOpen = open;

    // handle DOM updates
    this.buttonEl.setAttribute('aria-expanded', `${open}`);
    if (open) {
      this.contentEl.removeAttribute('hidden');
      if (this.options.disableOpenButton) {
        this.buttonEl.setAttribute('aria-disabled', 'true');
      }
    } else {
      this.contentEl.setAttribute('hidden', '');
      if (this.options.disableOpenButton) {
        this.buttonEl.removeAttribute('aria-disabled');
      }
    }
  }

  updateOptions(options) {
    this.options = options;
  }

  // Add public open and close methods for convenience
  open() {
    this.toggle(true);
  }

  close() {
    this.toggle(false);
  }
}

// init accordions
const accordionEls = [...document.querySelectorAll('.accordion h3')];
accordionEls.forEach((el) => {
  new Accordion(el);
});