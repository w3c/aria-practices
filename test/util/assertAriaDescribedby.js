const assert = require('assert');

/**
 * Confirm the aria-describedby attribute and corresponding element.
 *
 * @param {object} t                  - ava execution object
 * @param {string} elementSelector - the element with aria-describedby set
 */

module.exports = async function assertAriaDescribedby(t, elementSelector) {
  const elements = await t.context.queryElements(t, elementSelector);

  for (let index = 0; index < elements.length; index++) {
    let ariaDescribedbyExists = await t.context.session.executeScript(
      async function () {
        const [selector, index] = arguments;
        let els = document.querySelectorAll(selector);
        return els[index].hasAttribute('aria-describedby');
      },
      elementSelector,
      index
    );

    assert(
      ariaDescribedbyExists,
      '"aria-describedby" attribute should exist on element: ' + elementSelector
    );

    let descriptionValue = await elements[index].getAttribute(
      'aria-describedby'
    );

    assert.ok(
      descriptionValue,
      '"aria-describedby" attribute should have a value on element: ' +
        elementSelector
    );

    const descriptionIds = descriptionValue.split(' ');

    for (let descriptionId of descriptionIds) {
      let descriptionText = await t.context.session.executeScript(
        async function () {
          const id = arguments[0];
          let el = document.querySelector('#' + id);
          return el.innerText;
        },
        descriptionId
      );

      let descriptionImage = await t.context.queryElements(
        t,
        `#${descriptionId}`
      );

      assert.ok(
        descriptionText || descriptionImage.length,
        'Element with id "' +
          descriptionId +
          '" should contain description text (or image) according to attribute "aria-describedby" on element: ' +
          elementSelector
      );
    }
  }

  t.pass();
};
