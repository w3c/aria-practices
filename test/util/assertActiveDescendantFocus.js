'use strict';

const { By } = require('selenium-webdriver');

/**
 * Confirm the aria-activedescendant focus.
 * Contains 2 assertions.
 *
 * @param {obj} t                  - ava execution object
 * @param {String} ariaDescendantSelector - selector for element with aria-activeDescendant set
 * @param {String} optionsSelector - selector to select list of canidate elements for focus
 * @param {Number} index           - index of element in list returned by optionsSelector with focus
 */
module.exports = async function confirmAriaDescendantFocus (t, ariaDescendantSelector, optionsSelector, index) {
  let options = await t.context.session
    .findElements(By.css(optionsSelector));

  t.is(
    await options[index].getAttribute('aria-selected'),
    'true',
    'aria-selected should be on item at index ' + index + ' for items: ' + optionsSelector
  );

  let optionId = await options[index].getAttribute('id');

  t.is(
    await t.context.session
      .findElement(By.css(ariaDescendantSelector))
      .getAttribute('aria-activedescendant'),
    optionId,
    'aria-activedescendant should be set to ' + optionId + ' for items: ' + ariaDescendantSelector
  );

};
