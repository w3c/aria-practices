'use strict';

const { By } = require('selenium-webdriver');
const assert = require('assert');

/**
 * Assert the aria-activedescendant focus is correctly set to the item that has
 * at the appropriate index.
 *
 * @param {obj} t                  - ava execution object
 * @param {String} activedescendantSelector - selector for element with aria-activeDescendant set
 * @param {String} optionsSelector - selector to select list of candidate elements for focus
 * @param {Number} index           - index of element in list returned by optionsSelector with focus
 */
module.exports = async function assertAriaSelectedAndActivedescendant (t, activedescendantSelector, optionsSelector, index) {

  // Confirm aria-activedescendant refers to the correct option

  const options = await t.context.session
    .findElements(By.css(optionsSelector));
  const optionId = await options[index].getAttribute('id');

  assert.strictEqual(
    await t.context.session
      .findElement(By.css(activedescendantSelector))
      .getAttribute('aria-activedescendant'),
    optionId,
    'aria-activedescendant should be set to ' + optionId + ' for item: ' + activedescendantSelector
  );

  // Confirm the focus is on the aria-activedescendent element

  const focused = await t.context.session.executeScript(function () {
    const selector = arguments[0];
    let item = document.querySelector(selector);
    return item === document.activeElement;
  }, activedescendantSelector);

  assert(
    focused,
    'document focus should be on aria-activedescendant element: ' + activedescendantSelector
  );

  t.pass();
};
