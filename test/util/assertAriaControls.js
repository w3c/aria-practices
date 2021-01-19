const assert = require('assert');

/**
 * Confirm the aria-controls element.
 *
 * @param {object} t                  - ava execution object
 * @param {string} elementSelector - the element with aria-controls set
 */

module.exports = async function assertAriaControls(t, elementSelector) {
  const elements = await t.context.queryElements(t, elementSelector);

  for (let element of elements) {
    const ariaControlsExists = await t.context.session.executeScript(
      async function () {
        const selector = arguments[0];
        let el = document.querySelector(selector);
        return el.hasAttribute('aria-controls');
      },
      elementSelector
    );

    assert.ok(
      ariaControlsExists,
      '"aria-controls" attribute should exist on element(s): ' + elementSelector
    );

    const controlId = await element.getAttribute('aria-controls');

    assert.ok(
      controlId,
      '"aria-controls" attribute should have a value on element(s): ' +
        elementSelector
    );

    const controlEl = await t.context.queryElements(t, `#${controlId}`);

    assert.equal(
      controlEl.length,
      1,
      'Element with id "' +
        controlId +
        '" should exist as reference by "aria-controls" on: ' +
        elementSelector
    );
  }
  t.pass();
};
