'use strict';

const { By } = require('selenium-webdriver');
const assert = require('assert');

/**
 * Confirm the aria-controls element.
 *
 * @param {obj} t                  - ava execution object
 * @param {String} exampleId       - the id example (in case of multiple examples per page)
 * @param {String} elementSelector - the element with aria-controls set
 */

module.exports = async function assertAriaControls (t, exampleId, elementSelector) {
  const elements = await t.context.session.findElements(By.css(elementSelector));

  for (let element of elements) {
    const ariaControlsExists = await t.context.session.executeScript(async function () {
      const selector = arguments[0];
      let el = document.querySelector(selector);
      return el.hasAttribute('aria-controls');
    }, elementSelector);

    assert.ok(
      ariaControlsExists,
      '"aria-controls" attribute should exist on element(s): ' + elementSelector
    );

    const controlId = await element.getAttribute('aria-controls');

    assert.ok(
      controlId,
      '"aria-controls" attribute should have a value on element(s): ' + elementSelector
    );

    const controlEl = await t.context.session.findElements(By.id(controlId));

    assert.equal(
      controlEl.length,
      1,
      'Element with id "' + controlId + '" should exist in: ' + exampleId
    );
  }
  t.pass();
};
