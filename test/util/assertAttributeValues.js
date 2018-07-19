'use strict';

const { By } = require('selenium-webdriver');

/**
 * Confirm the the value of an attribute on an element.
 * Contains 2 assertions.
 *
 * @param {obj} t                  - ava execution object
 * @param {String} elementSelector - the element with aria-labelledby set
 * @param {String} attribute       - the attribute
 * @param {String} value           - the value
 */
module.exports = async function confirmAttributeValue (t, elementSelector, attribute, value) {
  let elementLocator = By.css(elementSelector);
  let elements = await t.context.session.findElements(elementLocator);
  for (let element of elements) {
    t.is(
      await element.getAttribute(attribute),
      value,
      'Attribute "' + attribute + '" with value "' + value + '" should be found on element(s) with selector "' + elementSelector + '"'
    );
  }
};
