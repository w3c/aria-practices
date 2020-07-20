'use strict';

const { ariaTest } = require('..');
const { By, Key } = require('selenium-webdriver');
const assertAriaLabelExists = require('../util/assertAriaLabelExists');
const assertAriaRoles = require('../util/assertAriaRoles');
const assertRovingTabindex = require('../util/assertRovingTabindex');
const assertHasFocus = require('../util/assertHasFocus');
const assertAttributeValues = require('../util/assertAttributeValues');
const assertNoElements = require('../util/assertNoElements');

const exampleFile = 'toolbar/toolbar.html';

const ex = {
  buttonSelector: '#ex1 button',
  checkboxSelector: '#ex1 .item',
  itemSelector: '#ex1 .item',
  itemSelectorActive: '#ex1 .item[tabindex="0"]',
  linkSelector: '#ex1 [href]',
  itemSelectors: {
    first: '#ex1 .item:first-child',
    second: '#ex1 .item:nth-child(2)',
    last:'#ex1 #link',
  },
  menuSelector: '#ex1 button[aria-haspopup]',
  spinSelector: '#ex1 [role="spinbutton"]',
  tabbaleItemAfterToolbarSelector: '#textarea1',
  tabbaleItemBeforeToolbarSelector: 'body > main > p > a:last-of-type',
  toolbarLabel: 'Example Toolbar',
  toolbarSelector: '#ex1 [role="toolbar"]'
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

const sendKeyAndAssertNoFocusChange = async function (t, key, selector) {
  await t.context.session.findElement(By.css(selector)).sendKeys(key);
  return assertHasFocus(t, selector);
}

const sendKeyAndAssertSelectorIsHidden = async function (t, key, selector, selectorToBeHidden) {
  await t.context.session.findElement(By.css(selector)).sendKeys(key);
  await assertNoElements(t, selectorToBeHidden);
}

/**
 * Attribute Tests
 */

ariaTest('Toolbar element has role="toolbar"', exampleFile, 'toolbar-role', async (t) => {
  await assertAriaRoles(t, 'ex1', 'toolbar', '1', 'div');
});

// Test fails from bug in example: fix in issue 847 on w3c/aria-practices
ariaTest('Toolbar element has "aria-label"', exampleFile, 'toolbar-aria-label', async (t) => {
  await assertAriaLabelExists(t, ex.toolbarSelector);
});

ariaTest('Toolbar items support roving tabindex on toolbar items', exampleFile, 'toolbar-item-tabindex', async (t) => {
  // Test all the toolbar items with roving tab index
  await assertRovingTabindex(t, ex.itemSelector, Key.ARROW_RIGHT);
});

/**
 * Keyboard & Focus Tests
 */

ariaTest('TAB: Moves focus into the toolbar', exampleFile, 'toolbar-tab', async (t) => {
  let tabTarget = ex.tabbaleItemBeforeToolbarSelector;
  await t.context.session.findElement(By.css(tabTarget)).sendKeys(Key.TAB);
  await assertHasFocus(t, ex.itemSelector);
})

ariaTest('TAB: Moves focus out of the toolbar', exampleFile, 'toolbar-tab', async (t) => {
  await t.context.session.findElement(By.css(ex.itemSelector)).sendKeys(Key.TAB);
  await assertHasFocus(t, ex.tabbaleItemAfterToolbarSelector);
})

ariaTest('ARROW_LEFT: If the first control has focus, focus moves to the last control.', exampleFile, 'toolbar-left-arrow', async (t) => {
  await t.context.session.findElement(By.css(ex.itemSelectors.first)).sendKeys(Key.ARROW_LEFT);
  await assertHasFocus(t, ex.itemSelectors.last);
});

ariaTest('ARROW_LEFT: Moves focus to the previous control.', exampleFile, 'toolbar-left-arrow', async (t) => {
  await t.context.session.findElement(By.css(ex.itemSelectors.second)).sendKeys(Key.ARROW_LEFT);
  await assertHasFocus(t, ex.itemSelectors.first);
});

ariaTest('ARROW_LEFT: If an item in the popup menu has focus, does nothing.', exampleFile, 'toolbar-left-arrow', async (t) => {
  await t.context.session.findElement(By.css(ex.menuSelector)).sendKeys(Key.ARROW_DOWN);
  await sendKeyAndAssertNoFocusChange(t, Key.ARROW_LEFT, '[role="menuitemradio"]');
});

ariaTest('ARROW_RIGHT: If the last control has focus, focus moves to the last control.', exampleFile, 'toolbar-right-arrow', async (t) => {
  await t.context.session.findElement(By.css(ex.itemSelectors.last)).sendKeys(Key.ARROW_RIGHT);
  await assertHasFocus(t, ex.itemSelectors.first);
});

ariaTest('ARROW_RIGHT: Moves focus to the next control.', exampleFile, 'toolbar-right-arrow', async (t) => {
  await t.context.session.findElement(By.css(ex.itemSelectors.first)).sendKeys(Key.ARROW_RIGHT);
  await assertHasFocus(t, ex.itemSelectors.second);
});

ariaTest('ARROW_RIGHT: If an item in the popup menu has focus, does nothing.', exampleFile, 'toolbar-right-arrow', async (t) => {
  await t.context.session.findElement(By.css(ex.menuSelector)).sendKeys(Key.ARROW_DOWN);
  await sendKeyAndAssertNoFocusChange(t, Key.ARROW_RIGHT, '[role="menuitemradio"]');
});

ariaTest('HOME: Moves focus to the first control.', exampleFile, 'toolbar-home', async (t) => {
  await t.context.session.findElement(By.css(ex.itemSelectors.last)).sendKeys(Key.HOME);
  await assertHasFocus(t, ex.itemSelectors.first);
});

ariaTest('END: Moves focus to the last control.', exampleFile, 'toolbar-home', async (t) => {
  await t.context.session.findElement(By.css(ex.itemSelectors.first)).sendKeys(Key.END);
  await assertHasFocus(t, ex.itemSelectors.last);
});

ariaTest('ESCAPE: Escape key hides any .popup-label', exampleFile, 'toolbar-toggle-esc', async (t) => {
  await t.context.session.findElement(By.css(ex.itemSelectors.first)).click();
  await sendKeyAndAssertSelectorIsHidden(t, Key.ESCAPE, ex.itemSelectors.first, '.popup-label.show')
})

ariaTest('Click events on toolbar send focus to .item[tabindex="0"]', exampleFile, 'toolbar-item-tabindex', async (t) => {
  // Set an item to active, tabindex=0  
  await clickAndWait(t, ex.itemSelector);
  await clickAndWait(t, ex.toolbarSelector);
  await assertHasFocus(t, ex.itemSelector);
});
