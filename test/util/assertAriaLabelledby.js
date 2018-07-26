'use strict';

const { By } = require('selenium-webdriver');
const assert = require('assert');

/**
 * Confirm the aria-labelledby element.
 *
 * @param {obj} t                  - ava execution object
 * @param {String} exampleId       - the id example (in case of multiple examples per page)
 * @param {String} elementSelector - the element with aria-labelledby set
 */

module.exports = async function assertAriaLabelledby (t, exampleId, elementSelector) {
  let element = await t.context.session
    .findElement(By.css(elementSelector));

  let ariaLabelledbyExists = await t.context.session.executeScript(async function () {
    const selector = arguments[0];
    let el = document.querySelector(selector);
    return el.hasAttribute('aria-labelledby');
  }, elementSelector);

  assert(
    ariaLabelledbyExists,
    '"aria-labelledby" attribute should exist on element: ' + elementSelector
  );

  let labelId = await element.getAttribute('aria-labelledby');

  assert.ok(
    labelId,
    '"aria-labelledby" attribute should have a value on element: ' + elementSelector
  );

  let labelText = await t.context.session.executeScript(async function () {
    const id = arguments[0];
    let el = document.querySelector('#' + id);
    return el.innerText;
  }, labelId);

  assert.ok(
    labelText,
    'Element with id "' + labelId + '" should contain label text in example: ' + exampleId
  );

  t.pass();
};
