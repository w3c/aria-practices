const assert = require('assert');

/**
 * Confirm the aria-owns element.
 *
 * @param {object} t                  - ava execution object
 * @param {string} elementSelector - the element with aria-owns set
 */

module.exports = async function assertAriaOwns(t, elementSelector) {
  const elements = await t.context.queryElements(t, elementSelector);

  for (let element of elements) {
    const ariaOwnsExists = await t.context.session.executeScript(
      async function () {
        const selector = arguments[0];
        let el = document.querySelector(selector);
        return el.hasAttribute('aria-owns');
      },
      elementSelector
    );

    assert.ok(
      ariaOwnsExists,
      '"aria-owns" attribute should exist on element(s): ' + elementSelector
    );

    const ownsId = await element.getAttribute('aria-owns');

    assert.ok(
      ownsId,
      '"aria-owns" attribute should have a value on element(s): ' +
        elementSelector
    );

    const ownedEl = await t.context.queryElements(t, `#${ownsId}`);

    assert.equal(
      ownedEl.length,
      1,
      'Element with id "' +
        ownsId +
        '" should exist as reference by "aria-owns" on: ' +
        elementSelector
    );
  }
  t.pass();
};
