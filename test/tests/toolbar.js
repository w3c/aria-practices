'use strict';

const { ariaTest } = require('..');
const { By, Key } = require('selenium-webdriver');
const assertAttributeValues = require('../util/assertAttributeValues');
const assertAriaLabelledby = require('../util/assertAriaLabelledby');
const assertAriaRoles = require('../util/assertAriaRoles');
const assertRovingTabindex = require('../util/assertRovingTabindex');

const exampleFile = 'toolbar/toolbar.html';

const ex = {
  toolbarSelector: '#ex1 [role="toolbar"]',
  toolSelector: '#ex1 [role="button"]',
  menuSelector: '#ex1 button',
  allToolSelectors: [
    '#ex1 [role="button"]:nth-of-type(1)',
    '#ex1 [role="button"]:nth-of-type(2)',
    '#ex1 [role="button"]:nth-of-type(3)',
    '#ex1 [role="button"]:nth-of-type(4)',
    '#ex1 [role="button"]:nth-of-type(5)',
    '#ex1 button'
  ]
};

const clickAndWait = async function (t, element) {
  await element.click();

  await t.context.session.wait(async function () {
    let tabindex = await element.getAttribute('tabindex');
    return tabindex === '0';
  }, 500);
};

const waitAndCheckFocus = async function (t, selector) {
  return t.context.session.wait(async function () {
    return t.context.session.executeScript(function () {
      const [selector, index] = arguments;
      let item = document.querySelector(selector);
      return item === document.activeElement;
    }, selector);
  }, 500);
};

const waitAndCheckTabindex = async function (t, selector) {
  return t.context.session.wait(async function () {
    let item = await t.context.session.findElement(By.css(selector));
    return (await item.getAttribute('tabindex')) === '0';
  }, 600);
};

// Attributes

ariaTest('', exampleFile, 'toolbar-role', async (t) => {
  t.plan(1);
  await assertAriaRoles(t, 'ex1', 'toolbar', '1', 'div');
});

ariaTest('', exampleFile, 'toolbar-aria-label', async (t) => {
  t.pass();
});

ariaTest('', exampleFile, 'button-role', async (t) => {
  t.plan(1);
  await assertAriaRoles(t, 'ex1', 'button', '5', 'div');
});

ariaTest('', exampleFile, 'button-tabindex', async (t) => {
  t.plan(3);

  // Test all the role="button" elements with roving tab index
  await assertRovingTabindex(t, ex.toolSelector, Key.ARROW_RIGHT);

  // Test the last element in the toolbox, which is a native "button" element
  let menuButton = await t.context.session.findElement(By.css(ex.menuSelector));
  await clickAndWait(t, menuButton);

  await assertAttributeValues(t, 'ex1', ex.toolSelector, 'tabindex', '-1');
  await assertAttributeValues(t, 'ex1', ex.menuSelector, 'tabindex', '0');
});

ariaTest('', exampleFile, 'button-aria-disabled', async (t) => {
  t.pass();
});


// Keys

ariaTest('', exampleFile, 'key-tab', async (t) => {
  t.pass();
});

ariaTest('', exampleFile, 'key-left-arrow', async (t) => {
  t.plan(12);

  // Put focus on the first item in the list
  let button = await t.context.session.findElement(By.css(ex.allToolSelectors[0]));
  await clickAndWait(t, button);

  let numTools = ex.allToolSelectors.length;
  let toolSelector = ex.allToolSelectors[0];
  let nextToolSelector = ex.allToolSelectors[numTools - 1];

  // Send ARROW LEFT key to the first item
  await t.context.session.findElement(By.css(toolSelector))
    .sendKeys(Key.ARROW_LEFT);

  // Focus should now be on last item
  t.true(
    await waitAndCheckFocus(t, nextToolSelector),
    'Sending ARROW_RIGHT to tool "' + toolSelector + '" should move focus to "' +
      nextToolSelector + '"'
  );

  t.true(
    await waitAndCheckTabindex(t, nextToolSelector),
    'Sending ARROW_RIGHT to tool "' + toolSelector + '" should set tabindex on "' +
      nextToolSelector + '"'
  );


  // Confirm right arrow moves focus to the previous item
  for (let index = numTools - 1; index > 0; index--) {
    let toolSelector = ex.allToolSelectors[index];
    let nextToolSelector = ex.allToolSelectors[index + 1];

    // Send ARROW LEFT key
    await t.context.session.findElement(By.css(toolSelector))
      .sendKeys(Key.ARROW_LEFT);

    t.true(
      await waitAndCheckFocus(t, nextToolSelector),
      'Sending ARROW_RIGHT to tool "' + toolSelector + '" should move focus to "' +
        nextToolSelector + '"'
    );

    t.true(
      await waitAndCheckTabindex(t, nextToolSelector),
      'Sending ARROW_RIGHT to tool "' + toolSelector + '" should set tabindex on "' +
        nextToolSelector + '"'
    );
  }

});

ariaTest('', exampleFile, 'key-right-arrow', async (t) => {
  t.plan(12);

  // Put focus on the first item in the list
  let button = await t.context.session.findElement(By.css(ex.allToolSelectors[0]));
  await clickAndWait(t, button);

  let numTools = ex.allToolSelectors.length;

  // Confirm right arrow moves focus to the next item
  for (let index = 0; index < numTools - 1; index++) {
    let toolSelector = ex.allToolSelectors[index];
    let nextToolSelector = ex.allToolSelectors[index + 1];

    // Send ARROW RIGHT key
    await t.context.session.findElement(By.css(toolSelector))
      .sendKeys(Key.ARROW_RIGHT);

    t.true(
      await waitAndCheckFocus(t, nextToolSelector),
      'Sending ARROW_RIGHT to tool "' + toolSelector + '" should move focus to "' +
        nextToolSelector + '"'
    );

    t.true(
      await waitAndCheckTabindex(t, nextToolSelector),
      'Sending ARROW_RIGHT to tool "' + toolSelector + '" should set tabindex on "' +
        nextToolSelector + '"'
    );
  }

  let toolSelector = ex.allToolSelectors[numTools - 1];
  let nextToolSelector = ex.allToolSelectors[0];

  // Send ARROW RIGHT key to the last item
  await t.context.session.findElement(By.css(toolSelector))
    .sendKeys(Key.ARROW_RIGHT);

  // Focus should now be on first item
  t.true(
    await waitAndCheckFocus(t, nextToolSelector),
    'Sending ARROW_RIGHT to tool "' + toolSelector + '" should move focus to "' +
      nextToolSelector + '"'
  );

  t.true(
    await waitAndCheckTabindex(t, nextToolSelector),
    'Sending ARROW_RIGHT to tool "' + toolSelector + '" should set tabindex on "' +
      nextToolSelector + '"'
  );
});

ariaTest('', exampleFile, 'key-home', async (t) => {
  t.pass();

  // TODO: click on each element, then send the HOME key, check that focus/tabindex is on the first element
});

ariaTest('', exampleFile, 'key-end', async (t) => {
  t.pass();
});
