'use strict';

const { ariaTest } = require('..');
const { By, Key } = require('selenium-webdriver');
const assertAttributeDNE = require('../util/assertAttributeDNE');
const assertAttributeValues = require('../util/assertAttributeValues');
const assertAriaControls = require('../util/assertAriaControls');
const assertAriaLabelExists = require('../util/assertAriaLabelExists');
const assertAriaRoles = require('../util/assertAriaRoles');

const exampleFile = 'carousel/carousel-1.html';

const ex = {
  landmarkSelector: '#myCarousel',
  buttonSelector: '#ex1 button',
  pausePlayButtonSelector: '#ex1 button:first-of-type',
  previousButtonSelector: '#ex1 .previous',
  nextButtonSelector: '#ex1 .next',
  slideContainerSelector: '#ex1 .carousel-items',
  slideSelector: '#ex1 .carousel-item'
};


// Attributes

ariaTest('section element used to contain slider', exampleFile, 'carousel-region-role', async (t) => {
  t.plan(1);

  // This test primarially tests that the ex.landmarkSelector points to a `section` element
  const landmarkEl = await t.context.session.findElement(By.css(ex.landmarkSelector));
  t.is(
    await landmarkEl.getTagName(),
    'section',
    ex.landmarkSelector + ' selector should select `section` element'
  );
});

ariaTest('section has aria-roledescription set to carousel', exampleFile, 'carousel-region-aria-roledescription', async (t) => {
  t.plan(1);

  // check the aria-roledescrption set to carousel
  await assertAttributeValues(t, ex.landmarkSelector, 'aria-roledescription', 'carousel');
});

ariaTest('section has aria-label', exampleFile, 'carousel-region-aria-label', async (t) => {
  t.plan(1);

  await assertAriaLabelExists(t, ex.landmarkSelector);
});

ariaTest('slide container have aria-live initially set to off', exampleFile, 'carousel-aria-live', async (t) => {
  t.plan(4);

  // On page load, `aria-level` is `off`
  await assertAttributeValues(t, ex.slideContainerSelector, 'aria-live', 'off');

  // Focus on the widget, and aria-selected should change to 'polite'
  await t.context.session.findElement(By.css(ex.nextButtonSelector)).click();
  await assertAttributeValues(t, ex.slideContainerSelector, 'aria-live', 'polite');

  // Move focus off the widget, and the aria-selected should change to 'off' agains
  await t.context.session.findElement(By.css('#ex_label')).click();
  await assertAttributeValues(t, ex.slideContainerSelector, 'aria-live', 'off');

  // Click the pause button, and the aria-selected should change to 'polite' again
  await t.context.session.findElement(By.css(ex.pausePlayButtonSelector)).click();
  await assertAttributeValues(t, ex.slideContainerSelector, 'aria-live', 'polite');
});

ariaTest('pause, previous and next buttons have aria-label', exampleFile, 'carousel-button-aria-label', async (t) => {
  t.plan(1);
  await assertAriaLabelExists(t, ex.buttonSelector);
});

ariaTest('previous and next buttons have aria-controls', exampleFile, 'carousel-button-aria-controls', async (t) => {
  t.plan(2);
  await assertAriaControls(t, ex.previousButtonSelector);
  await assertAriaControls(t, ex.nextButtonSelector);
});

ariaTest('slides have role group', exampleFile, 'carousel-group-role', async (t) => {
  t.plan(1);
  await assertAriaRoles(t, 'myCarousel', 'group', 6, 'div');
});

ariaTest('slides have aria-label', exampleFile, 'carousel-group-aria-label', async (t) => {
  t.plan(1);
  await assertAriaLabelExists(t, ex.slideSelector);
});

ariaTest('slides have aria-roledescription set to slide', exampleFile, 'carousel-group-aria-roledescription', async (t) => {
  t.plan(1);

  // check the aria-roledescrption set to carousel
  await assertAttributeValues(t, ex.slideSelector, 'aria-roledescription', 'slide');
});

ariaTest('Pause button uses aria-disabled', exampleFile, 'carousel-button-start-disabled', async (t) => {
  t.plan(3);

  // On page load, `aria-disabled` is not present on pause button
  await assertAttributeDNE(t, ex.pausePlayButtonSelector, 'aria-disabled');

  // Focus on the widget, and aria-disabled should change to true
  await t.context.session.findElement(By.css(ex.previousButtonSelector)).click();
  await assertAttributeValues(t, ex.pausePlayButtonSelector, 'aria-disabled', 'true');

  // Move to focus to pause button, and the aria-disabled should change to false
  await t.context.session.findElement(By.css(ex.previousButtonSelector)).sendKeys(Key.chord(Key.SHIFT, Key.TAB));
  await assertAttributeDNE(t, ex.pausePlayButtonSelector, 'aria-disabled');
});
