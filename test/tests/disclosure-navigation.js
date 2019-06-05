'use strict';

const { ariaTest } = require('..');
const { By, Key } = require('selenium-webdriver');
const assertAriaControls = require('../util/assertAriaControls');
const assertAttributeValues = require('../util/assertAttributeValues');
const assertTabOrder = require('../util/assertTabOrder');
const assertHasFocus = require('../util/assertHasFocus');

const exampleFile = 'disclosure/disclosure-navigation.html';

const ex = {
  buttonSelector: '#ex1 button',
  menuSelector: '#ex1 .disclosure-nav > li > ul',
  buttonSelectors: [
    '#ex1 li:nth-child(1) button',
    '#ex1 li:nth-child(2) button',
    '#ex1 li:nth-child(3) button'
  ],
  menuSelectors: [
    '#ex1 li:nth-child(1) ul',
    '#ex1 li:nth-child(2) ul',
    '#ex1 li:nth-child(3) ul'
  ]
};

// Attributes

ariaTest('"aria-controls" attribute on button', exampleFile, 'button-aria-controls', async (t) => {
  t.plan(1);
  await assertAriaControls(t, ex.buttonSelectors[0]);
});

ariaTest('"aria-expanded" attribute on button', exampleFile, 'button-aria-expanded', async (t) => {
  t.plan(7);

  await assertAttributeValues(t, ex.buttonSelectors[0], 'aria-expanded', 'false');

  let buttons = await t.context.session.findElements(By.css(ex.buttonSelector));
  let menus = await t.context.session.findElements(By.css(ex.menuSelector));
  for (let i = buttons.length - 1; i >= 0; i--) {
    await buttons[i].click();
    t.true(
      await menus[i].isDisplayed(),
      'Each dropdown menu should display after clicking its trigger'
    );
    await assertAttributeValues(t, ex.buttonSelectors[i], 'aria-expanded', 'true');
  }
});

// Keys

ariaTest('TAB should move focus between buttons', exampleFile, 'key-tab', async (t) => {
  t.plan(1);

  await assertTabOrder(t, ex.buttonSelectors);
});

ariaTest('key ENTER expands dropdown', exampleFile, 'key-enter-space', async (t) => {
  t.plan(12);

  const buttons = await t.context.session.findElements(By.css(ex.buttonSelector));
  const menus = await t.context.session.findElements(By.css(ex.menuSelector));

  for (let i = buttons.length - 1; i >= 0; i--) {
    await buttons[i].sendKeys(Key.ENTER);
    await assertAttributeValues(t, ex.buttonSelectors[i], 'aria-expanded', 'true');
    t.true(
      await menus[i].isDisplayed(),
      'Dropdown menu should display sending ENTER to its trigger'
    );

    await buttons[i].sendKeys(Key.ENTER);
    await assertAttributeValues(t, ex.buttonSelectors[i], 'aria-expanded', 'false');
    t.false(
      await menus[i].isDisplayed(),
      'Dropdown menu should close after sending ENTER twice to its trigger'
    );
  }
});

ariaTest('key SPACE expands dropdown', exampleFile, 'key-enter-space', async (t) => {
  t.plan(12);

  const buttons = await t.context.session.findElements(By.css(ex.buttonSelector));
  const menus = await t.context.session.findElements(By.css(ex.menuSelector));

  for (let i = buttons.length - 1; i >= 0; i--) {
    await buttons[i].sendKeys(Key.SPACE);
    await assertAttributeValues(t, ex.buttonSelectors[i], 'aria-expanded', 'true');
    t.true(
      await menus[i].isDisplayed(),
      'Dropdown menu should display sending SPACE to its trigger'
    );

    await buttons[i].sendKeys(Key.SPACE);
    await assertAttributeValues(t, ex.buttonSelectors[i], 'aria-expanded', 'false');
    t.false(
      await menus[i].isDisplayed(),
      'Dropdown menu should close after sending SPACE twice to its trigger'
    );
  }
});

ariaTest('key ESCAPE closes dropdown', exampleFile, 'key-escape', async (t) => {
  t.plan(3);

  const button = await t.context.session.findElement(By.css(ex.buttonSelectors[0]));
  const menu = await t.context.session.findElement(By.css(ex.menuSelectors[0]));
  const firstLink = await t.context.session.findElement(By.css(`${ex.menuSelectors[0]} a`));

  await button.click();
  t.true(
    await menu.isDisplayed(),
    'Dropdown menu is displayed on click'
  );

  await firstLink.sendKeys(Key.ESCAPE);
  await assertAttributeValues(t, ex.buttonSelectors[0], 'aria-expanded', 'false');
  t.false(
    await menu.isDisplayed(),
    'Dropdown menu should close after sending ESCAPE to the menu'
  );
});

ariaTest('arrow keys move focus between disclosure buttons', exampleFile, 'key-arrows', async (t) => {
  t.plan(6);

  const buttons = await t.context.session.findElements(By.css(ex.buttonSelector));

  await buttons[0].sendKeys(Key.ARROW_RIGHT);
  await assertHasFocus(t, ex.buttonSelectors[1], 'right arrow moves focus from first to second button');

  await buttons[1].sendKeys(Key.ARROW_RIGHT);
  await assertHasFocus(t, ex.buttonSelectors[2], 'right arrow moves focus from second to third button');

  await buttons[2].sendKeys(Key.ARROW_RIGHT);
  await assertHasFocus(t, ex.buttonSelectors[2], 'right arrow does not move focus from last button');

  await buttons[0].sendKeys(Key.ARROW_LEFT);
  await assertHasFocus(t, ex.buttonSelectors[0], 'left arrow does not move focus from first button');

  await buttons[1].sendKeys(Key.ARROW_LEFT);
  await assertHasFocus(t, ex.buttonSelectors[0], 'left arrow moves focus from second to first button');

  await buttons[2].sendKeys(Key.ARROW_LEFT);
  await assertHasFocus(t, ex.buttonSelectors[1], 'left arrow moves focus from third to second button');
});

ariaTest('home and end move focus to first and last buttons', exampleFile, 'key-home-end', async (t) => {
  t.plan(2);

  const buttons = await t.context.session.findElements(By.css(ex.buttonSelector));

  await buttons[1].sendKeys(Key.HOME);
  await assertHasFocus(t, ex.buttonSelectors[0], 'home key moves focus to first button');

  await buttons[0].sendKeys(Key.END);
  await assertHasFocus(t, ex.buttonSelectors[2], 'end key moves focus to last button');
});
