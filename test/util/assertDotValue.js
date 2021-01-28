const assert = require('assert');

/**
 * Confirm the dot value of an element in javascript (testing the IDL Interface)
 *
 * @param {object} t                  - ava execution object
 * @param {string} elementSelector - a selector that returns one element
 * @param {string} attr            - the attribute to access by javascript dot notation
 * @param {string} value           - the value of the attribute
 */

module.exports = async function assertDotValue(
  t,
  elementSelector,
  attr,
  value
) {
  let valueOfAttr = await t.context.session.executeScript(
    async function () {
      const [selector, attr] = arguments;
      let el = document.querySelector(selector);
      return el[attr];
    },
    elementSelector,
    attr,
    value
  );

  assert.equal(
    valueOfAttr,
    value,
    'attribute `' +
      attr +
      '` with value `' +
      value +
      '` should be found on javascript node returned by: ' +
      elementSelector
  );

  t.pass();
};
