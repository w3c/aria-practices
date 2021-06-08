/*
 *   This content is licensed according to the W3C Software License at
 *   https://www.w3.org/Consortium/Legal/2015/copyright-software-and-document
 *
 *   Accordion Group pattern example
 */

'use strict';

/*
 * WARNING: This script depends on accordion.js existing at the time AccordionGroup is instantiated
 * This would normally be done with import/export statements, but the APG does not currently use JS modules
 */

class AccordionGroup {
  constructor(accordionEls) {
    const accordionOptions = {
      onAccordionClick: this.onAccordionClick.bind(this),
      disableOpenButton: true,
    };

    this.accordions = accordionEls.map(
      // eslint-disable-next-line no-undef
      (el) => new Accordion(el, accordionOptions)
    );
    this.openIndex = 0;
    this.resetOpenState(0);
  }

  onAccordionClick(open, accordion) {
    const index = this.accordions.indexOf(accordion);
    this.updateOpenIndex(index);
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
const accordionGroupEls = [...document.querySelectorAll('.accordion-group h3')];
new AccordionGroup(accordionGroupEls);
