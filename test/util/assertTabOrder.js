'use strict';

const { By, Key } = require('selenium-webdriver');
const assert = require('assert');

const getFocusedElement = async function (t) {
  return t.context.session.executeScript(function () {
    return document.activeElement;
  });
};

const focusMatchesElement = async function (t, selector) {
  return t.context.session.executeScript(function () {
    selector = arguments[0];
    return document.activeElement === document.querySelector(selector);
  }, selector);
};

/**
 * Confirm the continuous subset of elements are in tab order for a test page
 *
 * @param {obj} t                   - ava execution object
 * @param {Array} tabOrderSelectors - elements in tab order
 */
module.exports = async function assertTabOrder (t, tabOrderSelectors) {

  // send TAB to body element to start page tab order
  let body = await t.context.session.findElement(By.css('body'));
  await body.sendKeys(Key.TAB);

  // send TAB until we get to the first element in the sequence
  // or we return to the body element
  while ((await getFocusedElement(t)).getTagName() !== 'body') {
    if (await focusMatchesElement(t, tabOrderSelectors[0])) {
      break;
    }
    await(await getFocusedElement(t)).sendKeys(Key.TAB);
  }

  let focusedElement = await getFocusedElement(t);

  assert.notEqual(
    await focusedElement.getTagName(),
    'body',
    'Element "' + tabOrderSelectors[0] + '" could not be found in tab order,' +
      ' tab index items exhausted'
  );

  for (let itemSelector of tabOrderSelectors) {
    assert(
      await focusMatchesElement(t, itemSelector),
      'Focus should have reached: ' + itemSelector
    );

    await(await getFocusedElement(t)).sendKeys(Key.TAB);
  }

  t.pass();
};

