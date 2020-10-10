'use strict';

const { ariaTest } = require('..');
const { By, Key } = require('selenium-webdriver');
const assertAriaControls = require('../util/assertAriaControls');
const assertAriaLabelExists = require('../util/assertAriaLabelExists');
const assertAriaRoles = require('../util/assertAriaRoles');
const assertAttributeDNE = require('../util/assertAttributeDNE');
const assertAttributeValues = require('../util/assertAttributeValues');
const assertRovingTabindex = require('../util/assertRovingTabindex');

const exampleFile = 'toolbar/toolbar.html';

const ex = {
  toolbarSelector: '#ex1 [role="toolbar"]',
  toolbarLabel: 'Example Toolbar',
  itemSelector: '#ex1 .item',
  buttonSelector: '#ex1 button',
  buttonIconSelector: '#ex1 button span.fas',
  styleButtonsSelector: '#ex1 .group:nth-child(1) button',
  alignmentGroupSelector: '#ex1 [role="radiogroup"]',
  alignmentButtonsSelector: '#ex1 .group:nth-child(2) button',
  textEditButtonsSelector: '#ex1 .group:nth-child(3) button',
  fontFamilyButtonSelector: '#ex1 .group:nth-child(4) button',
  fontFamilyMenuitemSelector: '#ex1 [role="menuitemradio"]',
  menuSelector: '#ex1 [role="menu"]',
  spinSelector: '#ex1 [role="spinbutton"]',
  spinUpSelector: '#ex1 [role="spinbutton"] .increase',
  spinDownSelector: '#ex1 [role="spinbutton"] .decrease',
  spinTextSelector: '#ex1 [role="spinbutton"] .value',
  checkboxSelector: '#ex1 .item',
  linkSelector: '#ex1 [href]',
  allToolSelectors: [
    '#ex1 .item'
  ],
  tabbableItemBeforeToolbarSelector: '[href="../../#toolbar"]',
  tabbableItemAfterToolbarSelector: '[href="../../#kbd_roving_tabindex"]'
};

const clickAndWait = async function (t, selector) {
  let element = await t.context.session.findElement(By.css(selector));
  await element.click();

  return await t.context.session.wait(
    async function () {
      let tabindex = await element.getAttribute('tabindex');
      return tabindex === '0';
    },
    t.context.waitTime,
    'Timeout waiting for click to set tabindex="0" on: ' + selector
  ).catch((err) => { return err; });
};

const waitAndCheckFocus = async function (t, selector) {
  return t.context.session.wait(
    async function () {
      return t.context.session.executeScript(function () {
        const [selector, index] = arguments;
        let item = document.context.querySelector(selector);
        return item === document.activeElement;
      }, selector);
    },
    t.context.waitTime,
    'Timeout waiting for activeElement to become: ' + selector,
  ).catch((err) => { return err; });
};

const waitAndCheckTabindex = async function (t, selector) {
  return t.context.session.wait(
    async function () {
      let item = await t.context.session.findElement(By.css(selector));
      return (await item.getAttribute('tabindex')) === '0';
    },
    600,
    'Timeout waiting for tabindex to set to "0" for: ' + selector
  ).catch((err) => { return err; });
};

// Attributes

ariaTest('Toolbar element has role="toolbar"', exampleFile, 'toolbar-role', async (t) => {
  await assertAriaRoles(t, 'ex1', 'toolbar', '1', 'div');
});

ariaTest('Toolbar element has "aria-label"', exampleFile, 'toolbar-aria-label', async (t) => {
  await assertAriaLabelExists(t, ex.toolbarSelector);
});

ariaTest('Toolbar element has "aria-controls"', exampleFile, 'toolbar-aria-controls', async (t) => {
  await assertAriaControls(t, ex.toolbarSelector);
});

ariaTest('Toolbar items support roving tabindex on toolbar items (Part 1)', exampleFile, 'toolbar-item-tabindex', async (t) => {
  // Test all the toolbar items with roving tab index
  await assertRovingTabindex(t, ex.itemSelector, Key.ARROW_RIGHT);
});

ariaTest('Toolbar buttons have aria-pressed', exampleFile, 'toolbar-button-aria-pressed', async (t) => {
  await assertAttributeValues(t, ex.styleButtonsSelector, 'aria-pressed', 'false');

  let buttons = await t.context.queryElements(t, ex.styleButtonsSelector);
  for (let button of buttons) {
    await button.click();
  }

  await assertAttributeValues(t, ex.styleButtonsSelector, 'aria-pressed', 'true');
});

ariaTest('All toolbar images have aria-hidden', exampleFile, 'toolbar-aria-hidden', async (t) => {
  await assertAttributeValues(t, ex.buttonIconSelector, 'aria-hidden', 'true');
});

ariaTest('Div has "radiogroup" role', exampleFile, 'toolbar-radiogroup-role', async (t) => {
  await assertAriaRoles(t, 'ex1', 'radiogroup', '1', 'div');
});

ariaTest('Radiogroup has aria-label', exampleFile, 'toolbar-radiogroup-aria-label', async (t) => {
  await assertAriaLabelExists(t, ex.alignmentGroupSelector);
});

ariaTest('Radio buttons have radio role', exampleFile, 'toolbar-radio-role', async (t) => {
  await assertAriaRoles(t, 'ex1', 'radio', '3', 'button');
});

ariaTest('Radio buttons had aria-checked', exampleFile, 'toolbar-radio-aria-checked', async (t) => {
  let buttons = await t.context.queryElements(t, ex.alignmentButtonsSelector);

  for (let i = 0; i < buttons.length; i++) {
    await buttons[i].click();
    for (let j = 0; j < buttons.length; j++) {
      let value = j === i ? 'true' : 'false';
      t.is(
        await buttons[j].getAttribute('aria-checked'),
        value,
        'Only alignment button ' + i + ' should have aria-checked set after clicking alignment button ' + i
      );
    }
  }
});

ariaTest('Text edit buttons have aria-disabled set to true by default', exampleFile, 'toolbar-button-aria-disabled', async (t) => {
  await assertAttributeValues(t, ex.textEditButtonsSelector, 'aria-disabled', 'true');
});

ariaTest('Font family button has aria-label', exampleFile, 'toolbar-menubutton-aria-label', async (t) => {
  await assertAriaLabelExists(t, ex.fontFamilyButtonSelector);

});

ariaTest('Font family button has aria-haspopup', exampleFile, 'toolbar-menubutton-aria-haspopup', async (t) => {
  await assertAttributeValues(t, ex.fontFamilyButtonSelector, 'aria-haspopup', 'true');
});

ariaTest('Font family button has aria-controls', exampleFile, 'toolbar-menubutton-aria-controls', async (t) => {
  await assertAriaControls(t, ex.fontFamilyButtonSelector);
});

ariaTest('Font family button has aria-expanded', exampleFile, 'toolbar-menubutton-aria-expanded', async (t) => {
  await assertAttributeDNE(t, ex.fontFamilyButtonSelector, 'aria-expanded');

  await (await t.context.session.findElement(By.css(ex.fontFamilyButtonSelector))).click();

  await assertAttributeValues(t, ex.fontFamilyButtonSelector, 'aria-expanded', 'true');
});

ariaTest('Font family menu has menu role', exampleFile, 'toolbar-menu-role', async (t) => {
  await assertAriaRoles(t, 'ex1', 'menu', '1', 'ul');
});

ariaTest('Font family menu has aria-label', exampleFile, 'toolbar-menu-aria-label', async (t) => {
  await assertAriaLabelExists(t, ex.menuSelector);
});

ariaTest('Menuitemradio role', exampleFile, 'toolbar-menuitemradio-role', async (t) => {
  await assertAriaRoles(t, 'ex1', 'menuitemradio', '5', 'li');
});

ariaTest('menuitemradio elements have aria-checked set', exampleFile, 'toolbar-menuitemradio-aria-checked', async (t) => {
  let menuButton = await t.context.session.findElement(By.css(ex.fontFamilyButtonSelector));
  let menuItems = await t.context.queryElements(t, ex.fontFamilyMenuitemSelector);

  for (let i = 0; i < menuItems.length; i++) {
    await menuButton.click();
    await menuItems[i].click();
    await menuButton.click();
    for (let j = 0; j < menuItems.length; j++) {
      let value = j === i ? 'true' : 'false';
      t.is(
        await menuItems[j].getAttribute('aria-checked'),
        value,
        'Only alignment button ' + i + ' should have aria-checked set after clicking alignment button ' + i
      );
    }
  }
});

ariaTest('menuitemradio elements have tabindex set to -1', exampleFile, 'toolbar-menuitemradio-tabindex', async (t) => {
  await (await t.context.session.findElement(By.css(ex.fontFamilyButtonSelector))).click();

  await assertAttributeValues(t, ex.fontFamilyMenuitemSelector, 'tabindex', '-1');
});

ariaTest('Spinbutton has aria-label', exampleFile, 'toolbar-spinbutton-aria-label', async (t) => {
  await assertAriaLabelExists(t, ex.spinSelector);
});

ariaTest('Spinbutton has aria-valuenow', exampleFile, 'toolbar-spinbutton-aria-valuenow', async (t) => {
  await assertAttributeValues(t, ex.spinSelector, 'aria-valuenow', '14');

  await (await t.context.session.findElement(By.css(ex.spinUpSelector))).click();
  await assertAttributeValues(t, ex.spinSelector, 'aria-valuenow', '15');

  await (await t.context.session.findElement(By.css(ex.spinDownSelector))).click();
  await assertAttributeValues(t, ex.spinSelector, 'aria-valuenow', '14');
});

ariaTest('Spin button had valuetext', exampleFile, 'toolbar-spinbutton-aria-valuetext', async (t) => {
  await assertAttributeValues(t, ex.spinSelector, 'aria-valuetext', '14 Point');

  t.is(
    await (await t.context.session.findElement(By.css(ex.spinSelector))).getAttribute('aria-valuetext'),
    await (await t.context.session.findElement(By.css(ex.spinTextSelector))).getText(),
    "The spin buttons aria-valuetext attribute should match the text on the spin button"
  );

  await (await t.context.session.findElement(By.css(ex.spinUpSelector))).click();
  await assertAttributeValues(t, ex.spinSelector, 'aria-valuetext', '15 Point');

  t.is(
    await (await t.context.session.findElement(By.css(ex.spinSelector))).getAttribute('aria-valuetext'),
    await (await t.context.session.findElement(By.css(ex.spinTextSelector))).getText(),
    "The spin buttons aria-valuetext attribute should match the text on the spin button"
  );

  await (await t.context.session.findElement(By.css(ex.spinDownSelector))).click();
  await assertAttributeValues(t, ex.spinSelector, 'aria-valuetext', '14 Point');

  t.is(
    await (await t.context.session.findElement(By.css(ex.spinSelector))).getAttribute('aria-valuetext'),
    await (await t.context.session.findElement(By.css(ex.spinTextSelector))).getText(),
    "The spin buttons aria-valuetext attribute should match the text on the spin button"
  );
});

ariaTest('Spin button has valuemin', exampleFile, 'toolbar-spinbutton-aria-valuemin', async (t) => {
  await assertAttributeValues(t, ex.spinSelector, 'aria-valuemin', '8');
});

ariaTest('', exampleFile, 'toolbar-spinbutton-aria-valuemax', async (t) => {
  await assertAttributeValues(t, ex.spinSelector, 'aria-valuemax', '40');
});

/*

// Keys

ariaTest('key TAB moves focus', exampleFile, 'toolbar-tab', async (t) => {
  let numTools = ex.allToolSelectors.length;

  for (let index = 0; index < numTools; index++) {
    let toolSelector = ex.allToolSelectors[index];

    // Click on element to set focus
    await clickAndWait(t, toolSelector);

    // Send tab key to element
    await t.context.session.findElement(By.css(toolSelector))
      .sendKeys(Key.TAB);

    t.true(
      await waitAndCheckFocus(t, ex.tabbableItemAfterToolbarSelector, index),
      'Sending TAB to: ' + toolSelector + ' should move focus off toolbar'
    );
  }
});

ariaTest('key LEFT ARROW moves focus', exampleFile, 'toolbar-left-arrow', async (t) => {
  // Put focus on the first item in the list
  await clickAndWait(t, ex.allToolSelectors[0]);

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

ariaTest('key RIGHT ARROW moves focus', exampleFile, 'toolbar-right-arrow', async (t) => {
  // Put focus on the first item in the list
  await clickAndWait(t, ex.allToolSelectors[0]);

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

ariaTest('key HOME moves focus', exampleFile, 'toolbar-home', async (t) => {
  let numTools = ex.allToolSelectors.length;

  // Confirm right moves HOME focus to first item
  for (let index = 0; index < numTools - 1; index++) {
    let toolSelector = ex.allToolSelectors[index];

    // Click on element to focus
    await clickAndWait(t, toolSelector);

    // Send HOME key to the last item
    await t.context.session.findElement(By.css(toolSelector))
      .sendKeys(Key.HOME);

    t.true(
      await waitAndCheckFocus(t, ex.allToolSelectors[0], index),
      'Sending HOME to tool "' + toolSelector + '" should move focus to first tool'
    );
  }
});

ariaTest('key END moves focus', exampleFile, 'toolbar-end', async (t) => {
  let numTools = ex.allToolSelectors.length;

  // Confirm right moves HOME focus to first item
  for (let index = 0; index < numTools - 1; index++) {
    let toolSelector = ex.allToolSelectors[index];

    // Click on element to focus
    await clickAndWait(t, toolSelector);

    // Send HOME key to the last item
    await t.context.session.findElement(By.css(toolSelector))
      .sendKeys(Key.HOME);

    t.true(
      await waitAndCheckFocus(t, ex.allToolSelectors[0], index),
      'Sending HOME to tool "' + toolSelector + '" should move focus to first tool'
    );
  }
});

*/
