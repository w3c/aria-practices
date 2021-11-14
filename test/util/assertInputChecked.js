const assert = require('assert');

/**
 * Confirm the input element checked state.
 *
 * @param {object} t               - ava execution object
 * @param {string} elementSelector - the input element
 */

module.exports = async function assertInputChecked(t, elementSelector, value) {
  const inputChecked = await t.context.session.executeScript(
    async function () {
      const selector = arguments[0];
      let el = document.querySelector(selector);
      return el.checked === arguments[1];
    },
    elementSelector,
    value
  );

  assert.ok(
    inputChecked,
    'input[type=checked] at ' + elementSelector + ' should have value: ' + value
  );
  t.pass();
};
