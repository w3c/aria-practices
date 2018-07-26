'use strict';

const { By } = require('selenium-webdriver');
const assert = require('assert');

/**
 * Confirm the aria-describedby attribute and corrosponding element.
 *
 * @param {obj} t                  - ava execution object
 * @param {String} exampleId       - the example id (in case of multiple examples per page)
 * @param {String} elementSelector - the element with aria-describedby set
 */

module.exports = async function assertAriaDescribedby (t, exampleId, elementSelector) {
  let element = await t.context.session
    .findElement(By.css(elementSelector));

  let ariaDescribedbyExists = await t.context.session.executeScript(async function () {
    let selector = arguments[0];
    let el = document.querySelector(selector);
    return el.hasAttribute('aria-describedby');
  }, elementSelector);

  assert(
    ariaDescribedbyExists,
    '"aria-describedby" attribute should exist on element: ' + elementSelector
  );

  let descriptionId = await element.getAttribute('aria-describedby');

  assert.ok(
    descriptionId,
    '"aria-describedby" attribute should have a value on element: ' + elementSelector
  );

  let descriptionText = await t.context.session.executeScript(async function () {
    const id = arguments[0];
    let el = document.querySelector('#' + id);
    return el.innerText;
  }, descriptionId);

  assert.ok(
    descriptionText,
    'Element with id "' + descriptionId + '" should contain description text in example: ' + exampleId
  );

  t.pass();
};
