/*
 *   This content is licensed according to the W3C Software License at
 *   https://www.w3.org/Consortium/Legal/2015/copyright-software-and-document
 *
 *   Simple accordion pattern example
 */

'use strict';

// Single Accordion
// options are:
// { onAccordionClick?: function, disableOpenButton?: boolean }
class Accordion {
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
    const { onAccordionClick = this.toggle } = this.options;

    onAccordionClick(!this.isOpen, this);
  }

  toggle(open) {
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

// Accordion Group
const defaultGroupOptions = {
  forceOneOpen: false,
  initialIndex: 0,
};

class AccordionGroup {
  constructor(accordionEls, options = defaultGroupOptions) {
    const accordionOptions = {
      onAccordionClick: this.onAccordionClick.bind(this),
      disableOpenButton: options.forceOneOpen,
    };

    this.accordions = accordionEls.map(
      (el) => new Accordion(el, accordionOptions)
    );
    this.options = options;
    this.openIndex = options.initialIndex;

    if (options.forceOneOpen) {
      this.resetOpenState(this.openIndex);
    }
  }

  onAccordionClick(open, accordion) {
    const index = this.accordions.indexOf(accordion);

    if (this.options.forceOneOpen) {
      this.updateOpenIndex(index);
    } else {
      open ? accordion.open() : accordion.close();
    }
  }

  resetOpenState(openIndex) {
    this.accordions.forEach((accordion, i) => {
      if (i === openIndex) {
        accordion.open();
      } else {
        accordion.close();
      }
    });
  }

  // public method to change whether or not to manage accordion open state
  updateOpenBehavior(forceOpen) {
    if (forceOpen !== this.options.forceOneOpen) {
      // reset open state of all accordions in the group
      this.options.forceOneOpen = forceOpen;
      forceOpen && this.resetOpenState(this.openIndex);

      // update the disableOpenButton option for individual accordions
      const accordionOptions = {
        onAccordionClick: this.onAccordionClick.bind(this),
        disableOpenButton: forceOpen,
      };
      this.accordions.forEach((accordion) => {
        accordion.updateOptions(accordionOptions);
      });
    }
  }

  updateOpenIndex(newIndex) {
    if (newIndex === this.openIndex) {
      return;
    }

    this.accordions[this.openIndex].close();
    this.accordions[newIndex].open();

    this.openIndex = newIndex;
  }
}

// init accordions
const accordionEls = [...document.querySelectorAll('.accordion h3')];
const accordionGroup = new AccordionGroup(accordionEls);

// listen to arrow key checkbox
var behaviorSwitch = document.getElementById('arrow-behavior-switch');
if (behaviorSwitch) {
  behaviorSwitch.addEventListener('change', function () {
    accordionGroup.updateOpenBehavior(behaviorSwitch.checked);
  });
}
