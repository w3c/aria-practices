const { By, Key } = require('selenium-webdriver');
const assert = require('assert');

const focusMatchesElement = async function (t, selector) {
  return t.context.session.wait(async function () {
    return t.context.session.executeScript(function () {
      selector = arguments[0];
      return document.activeElement === document.querySelector(selector);
    }, selector);
  }, t.context.WaitTime);
};

/**
 * Confirm the continuous subset of elements are in tab order for a test page
 *
 * @param {object} t                   - ava execution object
 * @param {Array} tabOrderSelectors - elements in tab order
 */
module.exports = async function assertTabOrder(t, tabOrderSelectors) {
  // Focus on the first element in the list
  await t.context.session.executeScript(function () {
    const selector = arguments[0];
    document.querySelector(selector).focus();
  }, tabOrderSelectors[0]);

  for (let itemSelector of tabOrderSelectors) {
    assert(
      await focusMatchesElement(t, itemSelector),
      'Focus should be on: ' + itemSelector
    );

    await t.context.session.findElement(By.css(itemSelector)).sendKeys(Key.TAB);
  }

  t.pass();
};
