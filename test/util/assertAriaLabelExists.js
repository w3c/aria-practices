const assert = require('assert');

/**
 * Confirm the aria-label value exists.
 *
 * @param {object} t                  - ava execution object
 * @param {string} elementSelector - the element with aria-labelledby set
 */

module.exports = async function assertAriaLabel(t, elementSelector) {
  const elements = await t.context.queryElements(t, elementSelector);

  for (let index = 0; index < elements.length; index++) {
    let ariaLabelExists = await t.context.session.executeScript(
      async function () {
        const [selector, index] = arguments;
        let els = document.querySelectorAll(selector);
        return els[index].hasAttribute('aria-label');
      },
      elementSelector,
      index
    );

    assert(
      ariaLabelExists,
      '"aria-label" attribute should exist on element(s): ' + elementSelector
    );

    let labelValue = await elements[index].getAttribute('aria-label');

    assert.ok(
      labelValue,
      '"aria-label" attribute should have a value on element(s): ' +
        elementSelector
    );
  }

  t.pass();
};
