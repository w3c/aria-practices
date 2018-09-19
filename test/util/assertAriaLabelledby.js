'use strict';

const { By } = require('selenium-webdriver');
const assert = require('assert');

/**
 * Confirm the aria-labelledby element.
 *
 * @param {obj} t                  - ava execution object
 * @param {String} elementSelector - the element with aria-labelledby set
 */

module.exports = async function assertAriaLabelledby (t, elementSelector) {
  const elements = await t.context.session.findElements(By.css(elementSelector));

  for (let index = 0; index < elements.length; index++) {
    let ariaLabelledbyExists = await t.context.session.executeScript(async function () {
      const [selector, index] = arguments;
      let els = document.querySelectorAll(selector);
      return els[index].hasAttribute('aria-labelledby');
    }, elementSelector, index);

    assert(
      ariaLabelledbyExists,
      '"aria-labelledby" attribute should exist on element(s): ' + elementSelector
    );

    let labelId = await elements[index].getAttribute('aria-labelledby');

    assert.ok(
      labelId,
      '"aria-labelledby" attribute should have a value on element(s): ' + elementSelector
    );

    let labelText = await t.context.session.executeScript(async function () {
      const id = arguments[0];
      let el = document.querySelector('#' + id);
      return el.innerText;
    }, labelId);

    assert.ok(
      labelText,
      'Element with id "' + labelId + '" should contain label text according to attribute "aria-labelledby" on element: ' + elementSelector
    );
  }

  t.pass();
};
