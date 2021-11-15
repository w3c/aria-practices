const assert = require('assert');

/**
 * Confirm the value of an attribute on an element.
 *
 * @param {object} t                  - ava execution object
 * @param {string} elementSelector - the element to check
 * @param {string} attribute       - the attribute
 * @param {string} value           - the value
 */
module.exports = async function assertAttributeValues(
  t,
  elementSelector,
  attribute,
  value
) {
  let elements = await t.context.queryElements(t, elementSelector);

  for (let element of elements) {
    assert.strictEqual(
      await element.getAttribute(attribute),
      value,
      'Attribute "' +
        attribute +
        '" with value "' +
        value +
        '" should be found on element(s) with selector "' +
        elementSelector +
        '"'
    );
  }
  t.pass();
};
