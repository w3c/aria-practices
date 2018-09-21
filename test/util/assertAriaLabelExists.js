'use strict';

const { By } = require('selenium-webdriver');
const assert = require('assert');

/**
 * Confirm the aria-label value exists.
 *
 * @param {obj} t                  - ava execution object
 * @param {String} elementSelector - the element with aria-labelledby set
 */

module.exports = async function assertAriaLabel (t, elementSelector) {

  let ariaLabelExists = await t.context.session.executeScript(async function () {
    const selector = arguments[0];
    let els = document.querySelector(selector);
    return els.hasAttribute('aria-label');
  }, elementSelector);

  assert(
    ariaLabelExists,
    '"aria-label" attribute should exist on element(s): ' + elementSelector
  );

  let element = t.context.session.findElement(By.css(elementSelector));
  let labelValue = await element.getAttribute('aria-label');

  assert.ok(
    labelValue,
    '"aria-label" attribute should have a value on element(s): ' + elementSelector
  );

  t.pass();
};
