'use strict';

const { By } = require('selenium-webdriver');
const assert = require('assert');

/**
 * Assert the aria-activedescendant focus is correctly set to the item that has
 * attribute aria-selected set to "true" in a list of options.
 *
 * @param {obj} t                  - ava execution object
 * @param {String} ariaDescendantSelector - selector for element with aria-activeDescendant set
 * @param {String} optionsSelector - selector to select list of canidate elements for focus
 * @param {Number} index           - index of element in list returned by optionsSelector with focus
 */
module.exports = async function assertAriaSelectedAndActivedescendant (t, ariaDescendantSelector, optionsSelector, index) {

  // Confirm the option at index index has aria-selected set to true

  let options = await t.context.session
    .findElements(By.css(optionsSelector));

  assert.strictEqual(
    await options[index].getAttribute('aria-selected'),
    'true',
    'aria-selected should be on item at index ' + index + ' for items: ' + optionsSelector
  );

  // Confrirm aria-activedescendant refers to the correct optoin

  let optionId = await options[index].getAttribute('id');

  assert.strictEqual(
    await t.context.session
      .findElement(By.css(ariaDescendantSelector))
      .getAttribute('aria-activedescendant'),
    optionId,
    'aria-activedescendant should be set to ' + optionId + ' for items: ' + ariaDescendantSelector
  );

  // Confirm the focus is on the aria-activedescendent element

  let focused = await t.context.session.executeScript(function () {
    const selector = arguments[0];
    let item = document.querySelector(selector);
    return item === document.activeElement;
  }, ariaDescendantSelector);

  assert(
    focused,
    'document focus should be on aria-activedescendant element: ' + ariaDescendantSelector
  );

  t.pass();
};
