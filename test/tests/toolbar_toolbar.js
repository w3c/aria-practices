'use strict';

const { ariaTest } = require('..');
const { By, Key } = require('selenium-webdriver');
const assertAriaLabelExists = require('../util/assertAriaLabelExists');
const assertAriaRoles = require('../util/assertAriaRoles');
const assertRovingTabindex = require('../util/assertRovingTabindex');
const assertHasFocus = require('../util/assertHasFocus');
const assertAttributeValues = require('../util/assertAttributeValues');
const assertNoElements = require('../util/assertNoElements');
const assertAttributeCanBeToggled = require('../util/assertAttributeCanBeToggled');

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
  radioButtons: {
    first: '#ex1 [role="radio"]:nth-child(1)',
    second: '#ex1 [role="radio"]:nth-child(2)',
    last: '#ex1 [role="radio"]:nth-child(1)',
  },
  spinSelector: '#ex1 [role="spinbutton"]',
  tabbaleItemAfterToolbarSelector: '#textarea1',
  tabbaleItemBeforeToolbarSelector: 'body > main > p > a:last-of-type',
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
 * Toolbar
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

ariaTest('CLICK events on toolbar send focus to .item[tabindex="0"]', exampleFile, 'toolbar-item-tabindex', async (t) => {
  // Set an item to active, tabindex=0  
  await clickAndWait(t, ex.itemSelector);
  await clickAndWait(t, ex.toolbarSelector);
  await assertHasFocus(t, ex.itemSelector);
});


ariaTest('END: Moves focus to the last control.', exampleFile, 'toolbar-home', async (t) => {
  await t.context.session.findElement(By.css(ex.itemSelectors.first)).sendKeys(Key.END);
  await assertHasFocus(t, ex.itemSelectors.last);
});

ariaTest('ESCAPE: Escape key hides any .popup-label', exampleFile, 'toolbar-toggle-esc', async (t) => {
  await t.context.session.findElement(By.css(ex.itemSelectors.first)).click();
  await sendKeyAndAssertSelectorIsHidden(t, Key.ESCAPE, ex.itemSelectors.first, '.popup-label.show')
})

ariaTest('HOME: Moves focus to the first control.', exampleFile, 'toolbar-home', async (t) => {
  await t.context.session.findElement(By.css(ex.itemSelectors.last)).sendKeys(Key.HOME);
  await assertHasFocus(t, ex.itemSelectors.first);
});

ariaTest('TAB: Moves focus into the toolbar, to the first menu item', exampleFile, 'toolbar-tab', async (t) => {
  let tabTarget = ex.tabbaleItemBeforeToolbarSelector;
  await t.context.session.findElement(By.css(tabTarget)).sendKeys(Key.TAB);
  await assertHasFocus(t, ex.itemSelector);
})

ariaTest('TAB: Moves focus out of the toolbar, to the next control', exampleFile, 'toolbar-tab', async (t) => {
  await t.context.session.findElement(By.css(ex.itemSelector)).sendKeys(Key.TAB);
  await assertHasFocus(t, ex.tabbaleItemAfterToolbarSelector);
});

/**
 * Radio Group
 */

ariaTest('ENTER: Toggle the pressed state of the button.', exampleFile, 'toolbar-toggle-enter-or-space', async (t) => {
  // Move focus to 'Bold' togglable button
  await assertAttributeCanBeToggled(t, ex.itemSelector, 'aria-pressed', Key.ENTER);
});

ariaTest('ENTER: If the focused radio button is checked, do nothing.', exampleFile, 'toolbar-radio-enter-or-space', async (t) => {
  await assertAttributeValues(t, ex.radioButtons.second, 'aria-checked', 'false');
  await t.context.session.findElement(By.css(ex.radioButtons.second)).sendKeys(Key.ENTER);
  await assertAttributeValues(t, ex.radioButtons.second, 'aria-checked', 'true');
  await t.context.session.findElement(By.css(ex.radioButtons.second)).sendKeys(Key.ENTER);
  await assertAttributeValues(t, ex.radioButtons.second, 'aria-checked', 'true');
});

ariaTest('ENTER: Otherwise, uncheck the currently checked radio button and check the radio button that has focus.', exampleFile, 'toolbar-radio-enter-or-space', async (t) => {
  await assertAttributeValues(t, ex.radioButtons.second, 'aria-checked', 'false');
  await t.context.session.findElement(By.css(ex.radioButtons.second)).sendKeys(Key.ENTER);
  await assertAttributeValues(t, ex.radioButtons.second, 'aria-checked', 'true');
  await t.context.session.findElement(By.css(ex.radioButtons.first)).sendKeys(Key.ENTER);
  await assertAttributeValues(t, ex.radioButtons.first, 'aria-checked', 'true');
  await assertAttributeValues(t, ex.radioButtons.second, 'aria-checked', 'false');
});

ariaTest('SPACE: Toggle the pressed state of the button.', exampleFile, 'toolbar-toggle-enter-or-space', async (t) => {
  await assertAttributeCanBeToggled(t, ex.itemSelector, 'aria-pressed', Key.SPACE);
});

ariaTest('SPACE: If the focused radio button is checked, do nothing.', exampleFile, 'toolbar-radio-enter-or-space', async (t) => {
  await assertAttributeValues(t, ex.radioButtons.second, 'aria-checked', 'false');
  await t.context.session.findElement(By.css(ex.radioButtons.second)).sendKeys(Key.SPACE);
  await assertAttributeValues(t, ex.radioButtons.second, 'aria-checked', 'true');
  await t.context.session.findElement(By.css(ex.radioButtons.second)).sendKeys(Key.SPACE);
  await assertAttributeValues(t, ex.radioButtons.second, 'aria-checked', 'true');
});

ariaTest('SPACE: Otherwise, uncheck the currently checked radio button and check the radio button that has focus.', exampleFile, 'toolbar-radio-enter-or-space', async (t) => {
  await assertAttributeValues(t, ex.radioButtons.second, 'aria-checked', 'false');
  await t.context.session.findElement(By.css(ex.radioButtons.second)).sendKeys(Key.SPACE);
  await assertAttributeValues(t, ex.radioButtons.second, 'aria-checked', 'true');
  await t.context.session.findElement(By.css(ex.radioButtons.first)).sendKeys(Key.SPACE);
  await assertAttributeValues(t, ex.radioButtons.first, 'aria-checked', 'true');
  await assertAttributeValues(t, ex.radioButtons.second, 'aria-checked', 'false');
});

ariaTest('DOWN: Moves focus to the next radio button.', exampleFile, 'toolbar-radio-down-arrow', async (t) => {
  await t.context.session.findElement(By.css(ex.radioButtons.first)).sendKeys(Key.DOWN);
  await assertHasFocus(t, ex.radioButtons.second);
});

ariaTest('DOWN: If the last radio button has focus, focus moves to the first radio button.', exampleFile, 'toolbar-radio-down-arrow', async (t) => {
  await t.context.session.findElement(By.css(ex.radioButtons.last)).sendKeys(Key.DOWN);
  await assertHasFocus(t, ex.radioButtons.first);
});

ariaTest('UP: Moves focus to the next radio button.', exampleFile, 'toolbar-radio-up-arrow', async (t) => {
  await t.context.session.findElement(By.css(ex.radioButtons.last)).sendKeys(Key.UP);
  await assertHasFocus(t, ex.radioButtons.second);
});

ariaTest('UP: If the first radio button has focus, focus moves to the last radio button.', exampleFile, 'toolbar-radio-up-arrow', async (t) => {
  await t.context.session.findElement(By.css(ex.radioButtons.first)).sendKeys(Key.UP);
  await assertHasFocus(t, ex.radioButtons.last);
});