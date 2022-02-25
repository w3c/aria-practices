const assert = require('assert');

/**
 * Confirm the aria-labelledby element.
 *
 * @param {object} t                  - ava execution object
 * @param {string} elementSelector - the element with aria-labelledby set
 */

module.exports = async function assertAriaLabelledby(t, elementSelector) {
  const elements = await t.context.queryElements(t, elementSelector);

  for (let index = 0; index < elements.length; index++) {
    const ariaLabelledbyExists = await t.context.session.executeScript(
      async function () {
        const [selector, index] = arguments;
        let els = document.querySelectorAll(selector);
        return els[index].hasAttribute('aria-labelledby');
      },
      elementSelector,
      index
    );

    assert(
      ariaLabelledbyExists,
      '"aria-labelledby" attribute should exist on element(s): ' +
        elementSelector
    );

    const labelValue = await elements[index].getAttribute('aria-labelledby');

    assert.ok(
      labelValue,
      '"aria-labelledby" attribute should have a value on element(s): ' +
        elementSelector
    );

    const labelIds = labelValue.split(' ');

    for (let labelId of labelIds) {
      let labelText = await t.context.session.executeScript(async function () {
        const id = arguments[0];
        let el = document.querySelector('#' + id);
        return el.innerText;
      }, labelId);

      assert.ok(
        labelText,
        'Element with id "' +
          labelId +
          '" should contain label text to describe element: ' +
          elementSelector
      );
    }
  }

  t.pass();
};
