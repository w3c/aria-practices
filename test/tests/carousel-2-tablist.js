'use strict';

const { ariaTest } = require('..');
const { By, Key } = require('selenium-webdriver');
const assertAttributeValues = require('../util/assertAttributeValues');
const assertAriaControls = require('../util/assertAriaControls');
const assertAriaLabelledby = require('../util/assertAriaLabelledby');
const assertAriaLabelExists = require('../util/assertAriaLabelExists');
const assertAriaRoles = require('../util/assertAriaRoles');
const assertTabOrder = require('../util/assertTabOrder');

const exampleFile = 'carousel/carousel-2-tablist.html';

const ex = {
  rotationSelector: '#ex1 .rotation',
  landmarkSelector: '#myCarousel',
  rotationLabelPlaying: 'Stop automatic slide show',
  rotationLabelPaused: 'Start automatic slide show'
};

const openTabAtIndex = async function (t, index) {
  const tabs = await t.context.session.findElements(By.css(ex.tabSelector));
  await tabs[index].click();
};

const waitAndCheckFocus = async function (t, selector, index) {
  return t.context.session.wait(async function () {
    return t.context.session.executeScript(function () {
      const [selector, index] = arguments;
      let items = document.querySelectorAll(selector);
      return items[index] === document.activeElement;
    }, selector, index);
  }, t.context.waitTime, 'Timeout waiting for document.activeElement to become item at index ' + index + ' of elements selected by: ' + selector);
};

const waitAndCheckAriaSelected = async function (t, index) {
  return t.context.session.wait(async function () {
    const tabs = await t.context.session.findElements(By.css(ex.tabSelector));
    return (await tabs[index].getAttribute('aria-selected')) === 'true';
  }, t.context.waitTime, 'Timeout waiting for aria-selected to be set to true.');
};

// Attributes

ariaTest('Carousel 2: rotation button has aria-label that is updated based on pause state', exampleFile, 'rotation-aria-label', async (t) => {
  t.plan(3);
  await assertAriaLabelExists(t, ex.rotationSelector);
  await assertAttributeValues(t, ex.rotationSelector, 'aria-label', ex.rotationLabelPlaying);

  let rotationButtonEl = await t.context.session.findElement(By.css(ex.rotationSelector));

  // Send ENTER and wait for change of 'aria-label'
  await rotationButtonEl.sendKeys(Key.ENTER);
  await t.context.session.wait(async function () {
    return rotationButtonEl.getAttribute('aria-label') !== ex.rotationLabelPlaying;
  }, t.context.waitTime, 'Timeout waiting for rotation button\'s aria-label to change');

  await assertAttributeValues(t, ex.rotationSelector, 'aria-label', ex.rotationLabelPaused);

});

