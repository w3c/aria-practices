'use strict';

const { By } = require('selenium-webdriver');
const assert = require('assert');

/**
 * Confirm the value of an attribute on an element.
 *
 * @param {obj} t                  - ava execution object
 * @param {String} elementSelector - the element to check
 * @param {String} attribute       - the attribute
 * @param {String} value           - the value
 */
module.exports = async function assertAttributeValues (t, elementSelector, attribute, value) {
  let elementLocator = By.css(elementSelector);
  let elements = await t.context.session.findElements(elementLocator);

  assert.ok(
    elements.length,
    'CSS elector returned no results: ' + elementSelector
  );

  for (let element of elements) {
    assert.strictEqual(
      await element.getAttribute(attribute),
      value,
      'Attribute "' + attribute + '" with value "' + value + '" should be found on element(s) with selector "' + elementSelector + '"'
    );
  }
  t.pass();
};
