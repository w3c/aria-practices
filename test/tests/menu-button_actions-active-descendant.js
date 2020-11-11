const { ariaTest } = require('..');
const { By, Key } = require('selenium-webdriver');
const assertAttributeValues = require('../util/assertAttributeValues');
const assertAriaLabelledby = require('../util/assertAriaLabelledby');
const assertAriaControls = require('../util/assertAriaControls');
const assertAriaRoles = require('../util/assertAriaRoles');
const assertAriaActivedescendant = require('../util/assertAriaActivedescendant');

const exampleFile = 'menu-button/menu-button-actions-active-descendant.html';

const ex = {
  menubuttonSelector: '#ex1 button',
  menuSelector: '#ex1 [role="menu"]',
  menuitemSelector: '#ex1 [role="menuitem"]',
  numMenuitems: 4,
  lastactionSelector: '#action_output',
  defaultAriaActivedescendantVal: 'mi1',
};

const checkFocus = function (t, selector, index) {
  return t.context.session.executeScript(
    function () {
      const [selector, index] = arguments;
      const items = document.querySelectorAll(selector);
      return items[index] === document.activeElement;
    },
    selector,
    index
  );
};

const scrollToAndOpenMenu = async function (t) {
  // Click the "last action" box to scroll the menu into view before opening the menu and sending enter
  // This prevents a bug where when you click the menu button, the menu is opened and the page scrolls down
  // to reveal the menu, which places the curser over the last menu item, which sets aria-activedescendent to
  // the last item in the list.
  await t.context.session.findElement(By.css(ex.lastactionSelector)).click();

  await t.context.session.findElement(By.css(ex.menubuttonSelector)).click();

  return t.context.session.wait(
    async function () {
      return t.context.session
        .findElement(By.css(ex.menuSelector))
        .isDisplayed();
    },
    t.context.waitTime,
    'Timeout waiting for menu to open after click'
  );
};

// Attributes

ariaTest(
  '"aria-haspopup" attribute on menu button',
  exampleFile,
  'button-aria-haspopup',
  async (t) => {
    await assertAttributeValues(
      t,
      ex.menubuttonSelector,
      'aria-haspopup',
      'true'
    );
  }
);

ariaTest(
  '"aria-controls" attribute on menu button',
  exampleFile,
  'button-aria-controls',
  async (t) => {
    await assertAriaControls(t, ex.menubuttonSelector);
  }
);

ariaTest(
  '"aria-expanded" attribute on menu button',
  exampleFile,
  'button-aria-expanded',
  async (t) => {
    const hasAttribute = await t.context.session.executeScript(function () {
      selector = arguments[0];
      return document.querySelector(selector).hasAttribute('aria-expanded');
    }, ex.menubuttonSelector);

    t.false(
      hasAttribute,
      'The menuitem should not have the "aria-expanded" attribute if the popup is closed'
    );

    t.false(
      await t.context.session
        .findElement(By.css(ex.menuSelector))
        .isDisplayed(),
      'The popup should not be displayed if aria-expanded is false'
    );

    await scrollToAndOpenMenu(t);

    await assertAttributeValues(
      t,
      ex.menubuttonSelector,
      'aria-expanded',
      'true'
    );
    t.true(
      await t.context.session
        .findElement(By.css(ex.menuitemSelector))
        .isDisplayed(),
      'The popup should be displayed if aria-expanded is true'
    );
  }
);

ariaTest('role="menu" on ul element', exampleFile, 'menu-role', async (t) => {
  await assertAriaRoles(t, 'ex1', 'menu', 1, 'ul');
});

ariaTest(
  '"aria-labelledby" on role="menu"',
  exampleFile,
  'menu-aria-labelledby',
  async (t) => {
    await assertAriaLabelledby(t, ex.menuSelector);
  }
);

ariaTest(
  'tabindex="-1" on role="menu"',
  exampleFile,
  'menu-tabindex',
  async (t) => {
    await scrollToAndOpenMenu(t);
    await assertAttributeValues(t, ex.menuSelector, 'tabindex', '-1');
  }
);

ariaTest(
  'aria-activedescendant on role="menu"',
  exampleFile,
  'menu-aria-activedescendant',
  async (t) => {
    await assertAttributeValues(
      t,
      ex.menuSelector,
      'aria-activedescendant',
      ex.defaultAriaActivedescendantVal
    );
  }
);

ariaTest(
  'role="menuitem" on li element',
  exampleFile,
  'menuitem-role',
  async (t) => {
    await assertAriaRoles(t, 'ex1', 'menuitem', ex.numMenuitems, 'li');
  }
);

// Keys

ariaTest(
  '"enter" on menu button',
  exampleFile,
  'button-down-arrow-or-space-or-enter',
  async (t) => {
    await t.context.session
      .findElement(By.css(ex.menubuttonSelector))
      .sendKeys(Key.ENTER);

    t.true(
      await t.context.session
        .findElement(By.css(ex.menuSelector))
        .isDisplayed(),
      'The popup should be displayed after sending button ENTER'
    );

    await assertAriaActivedescendant(
      t,
      ex.menuSelector,
      ex.menuitemSelector,
      0
    );
  }
);

ariaTest(
  '"down arrow" on menu button',
  exampleFile,
  'button-down-arrow-or-space-or-enter',
  async (t) => {
    await t.context.session
      .findElement(By.css(ex.menubuttonSelector))
      .sendKeys(Key.ARROW_DOWN);

    t.true(
      await t.context.session
        .findElement(By.css(ex.menuSelector))
        .isDisplayed(),
      'The popup should be displayed after sending button ARROW_DOWN'
    );

    await assertAriaActivedescendant(
      t,
      ex.menuSelector,
      ex.menuitemSelector,
      0
    );
  }
);

ariaTest(
  '"space" on menu button',
  exampleFile,
  'button-down-arrow-or-space-or-enter',
  async (t) => {
    await t.context.session
      .findElement(By.css(ex.menubuttonSelector))
      .sendKeys(Key.SPACE);

    t.true(
      await t.context.session
        .findElement(By.css(ex.menuSelector))
        .isDisplayed(),
      'The popup should be displayed after sending button SPACE'
    );

    await assertAriaActivedescendant(
      t,
      ex.menuSelector,
      ex.menuitemSelector,
      0
    );
  }
);

ariaTest(
  '"up arrow" on menu button',
  exampleFile,
  'button-up-arrow',
  async (t) => {
    await t.context.session
      .findElement(By.css(ex.menubuttonSelector))
      .sendKeys(Key.ARROW_UP);

    t.true(
      await t.context.session
        .findElement(By.css(ex.menuitemSelector))
        .isDisplayed(),
      'The popup should be displayed after sending button ARROW_UP'
    );

    await assertAriaActivedescendant(
      t,
      ex.menuSelector,
      ex.menuitemSelector,
      ex.numMenuitems - 1
    );
  }
);

ariaTest('"enter" on role="menu"', exampleFile, 'menu-enter', async (t) => {
  const menu = await t.context.session.findElement(By.css(ex.menuSelector));
  const items = await t.context.queryElements(t, ex.menuitemSelector);

  // Select the FIRST item: Send ENTER to the menu while aria-activedescendant is the first item

  await scrollToAndOpenMenu(t);
  let itemText = await items[0].getText();
  await menu.sendKeys(Key.ENTER);

  t.is(
    itemText,
    await t.context.session
      .findElement(By.css(ex.lastactionSelector))
      .getAttribute('value'),
    'When first item is focused, key enter should select action: ' + itemText
  );

  t.false(
    await t.context.session.findElement(By.css(ex.menuSelector)).isDisplayed(),
    'Key enter while focus is on first item should close menu.'
  );

  t.true(
    await checkFocus(t, ex.menubuttonSelector, 0),
    'Key enter while focus is on first item should put focus back on menu.'
  );

  // Select the SECOND item: Send ENTER to the menu while aria-activedescendant is the second item

  await scrollToAndOpenMenu(t);
  itemText = await items[1].getText();
  await menu.sendKeys(Key.ARROW_DOWN, Key.ENTER);

  t.is(
    itemText,
    await t.context.session
      .findElement(By.css(ex.lastactionSelector))
      .getAttribute('value'),
    'When second item is focused, key enter should select action: ' + itemText
  );

  t.false(
    await t.context.session.findElement(By.css(ex.menuSelector)).isDisplayed(),
    'Key enter while focus is on second item should close menu.'
  );

  t.true(
    await checkFocus(t, ex.menubuttonSelector, 0),
    'Key enter while focus is on second item should put focus back on menu.'
  );

  // Select the THIRD item: Send ENTER to the menu while aria-activedescendant is the third item

  await scrollToAndOpenMenu(t);
  itemText = await items[2].getText();
  await menu.sendKeys(Key.ARROW_DOWN, Key.ARROW_DOWN, Key.ENTER);

  t.is(
    itemText,
    await t.context.session
      .findElement(By.css(ex.lastactionSelector))
      .getAttribute('value'),
    'When third item is focused, key enter should select action: ' + itemText
  );

  t.false(
    await t.context.session.findElement(By.css(ex.menuSelector)).isDisplayed(),
    'Key enter while focus is on third item should close menu.'
  );

  t.true(
    await checkFocus(t, ex.menubuttonSelector, 0),
    'Key enter while focus is on third item should put focus back on menu.'
  );

  // Select the FOURTH item: Send ENTER to the menu while aria-activedescendant is the fourth item

  await scrollToAndOpenMenu(t);
  itemText = await items[3].getText();
  await menu.sendKeys(
    Key.ARROW_DOWN,
    Key.ARROW_DOWN,
    Key.ARROW_DOWN,
    Key.ENTER
  );

  t.is(
    itemText,
    await t.context.session
      .findElement(By.css(ex.lastactionSelector))
      .getAttribute('value'),
    'When fourth item is focused, key enter should select action: ' + itemText
  );

  t.false(
    await t.context.session.findElement(By.css(ex.menuSelector)).isDisplayed(),
    'Key enter while focus is on fourth item should close menu.'
  );

  t.true(
    await checkFocus(t, ex.menubuttonSelector, 0),
    'Key enter while focus is on fourth item should put focus back on menu.'
  );
});

ariaTest('"escape" on role="menu"', exampleFile, 'menu-escape', async (t) => {
  const menu = await t.context.session.findElement(By.css(ex.menuSelector));
  const items = await t.context.queryElements(t, ex.menuitemSelector);
  for (let item of items) {
    await scrollToAndOpenMenu(t);
    const itemText = await item.getText();
    await item.sendKeys(Key.ESCAPE);

    t.not(
      itemText,
      await t.context.session
        .findElement(By.css(ex.lastactionSelector))
        .getAttribute('value'),
      'Key escape should not select action: ' + itemText
    );

    t.false(
      await t.context.session
        .findElement(By.css(ex.menuSelector))
        .isDisplayed(),
      'Key escape on item "' + itemText + '" should close menu.'
    );

    t.true(
      await checkFocus(t, ex.menubuttonSelector, 0),
      'Key escape on item "' + itemText + '" should put focus back on menu.'
    );
  }
});

// This test is flaky, so is commented out for now.
// We are tracking it in issue:https://github.com/w3c/aria-practices/issues/1415
// ariaTest('"down arrow" on role="menu"', exampleFile, 'menu-down-arrow', async (t) => {

//   await openMenu(t);
//   const menu = await t.context.session.findElement(By.css(ex.menuSelector));
//   const items = await t.context.queryElements(t, ex.menuitemSelector);

//   for (let index = 0; index < items.length - 1; index++) {

//     await menu.sendKeys(Key.ARROW_DOWN);
//     await assertAriaActivedescendant(t, ex.menuSelector, ex.menuitemSelector, index + 1);
//   }

//   await menu.sendKeys(Key.ARROW_DOWN);
//   await assertAriaActivedescendant(t, ex.menuSelector, ex.menuitemSelector, 0);
// });

// This test is flaky, so is commented out for now.
// We are tracking it in issue:https://github.com/w3c/aria-practices/issues/1415
// ariaTest('"up arrow" on role="menu"', exampleFile, 'menu-up-arrow', async (t) => {

//   await openMenu(t);
//   const menu = await t.context.session.findElement(By.css(ex.menuSelector));
//   const items = await t.context.queryElements(t, ex.menuitemSelector);

//   await menu.sendKeys(Key.ARROW_UP);
//   await assertAriaActivedescendant(t, ex.menuSelector, ex.menuitemSelector, ex.numMenuitems - 1);

//   for (let index = items.length - 1; index > 0; index--) {

//     await menu.sendKeys(Key.ARROW_UP);
//     await assertAriaActivedescendant(t, ex.menuSelector, ex.menuitemSelector, index - 1);
//   }

// });

ariaTest('"home" on role="menu"', exampleFile, 'menu-home', async (t) => {
  const menu = await t.context.session.findElement(By.css(ex.menuSelector));
  const items = await t.context.queryElements(t, ex.menuitemSelector);
  await scrollToAndOpenMenu(t);

  // Send HOME to the menu while aria-activedescendant is the first item

  await menu.sendKeys(Key.HOME);
  await assertAriaActivedescendant(t, ex.menuSelector, ex.menuitemSelector, 0);

  // Send HOME to the menu while aria-activedescendant is the second item

  await menu.sendKeys(Key.ARROW_DOWN, Key.HOME);
  await assertAriaActivedescendant(t, ex.menuSelector, ex.menuitemSelector, 0);

  // Send HOME to the menu while aria-activedescendant is the third item

  await menu.sendKeys(Key.ARROW_DOWN, Key.ARROW_DOWN, Key.HOME);
  await assertAriaActivedescendant(t, ex.menuSelector, ex.menuitemSelector, 0);

  // Send HOME to the menu while aria-activedescendant is the fourth item

  await menu.sendKeys(Key.ARROW_DOWN, Key.ARROW_DOWN, Key.ARROW_DOWN, Key.HOME);
  await assertAriaActivedescendant(t, ex.menuSelector, ex.menuitemSelector, 0);
});

ariaTest('"end" on role="menu"', exampleFile, 'menu-end', async (t) => {
  const menu = await t.context.session.findElement(By.css(ex.menuSelector));
  const items = await t.context.queryElements(t, ex.menuitemSelector);
  const last = ex.numMenuitems - 1;
  await scrollToAndOpenMenu(t);

  // Send END to the menu while aria-activedescendant is the first item

  await menu.sendKeys(Key.END);
  await assertAriaActivedescendant(
    t,
    ex.menuSelector,
    ex.menuitemSelector,
    last
  );

  // Send END to the menu while aria-activedescendant is the second item

  await menu.sendKeys(Key.ARROW_DOWN, Key.END);
  await assertAriaActivedescendant(
    t,
    ex.menuSelector,
    ex.menuitemSelector,
    last
  );

  // Send END to the menu while aria-activedescendant is the third item

  await menu.sendKeys(Key.ARROW_DOWN, Key.ARROW_DOWN, Key.END);
  await assertAriaActivedescendant(
    t,
    ex.menuSelector,
    ex.menuitemSelector,
    last
  );

  // Send END to the menu while aria-activedescendant is the fourth item

  await menu.sendKeys(Key.ARROW_DOWN, Key.ARROW_DOWN, Key.ARROW_DOWN, Key.END);
  await assertAriaActivedescendant(
    t,
    ex.menuSelector,
    ex.menuitemSelector,
    last
  );
});

// This test is flaky, so is commented out for now.
// We are tracking it in issue:https://github.com/w3c/aria-practices/issues/1415
// ariaTest('"character" on role="menu"', exampleFile, 'menu-character', async (t) => {
//   const charIndexTest = [
//     { sendChar: 'x', sendIndex: 0, endIndex: 0 },
//     { sendChar: 'a', sendIndex: 0, endIndex: 1 },
//     { sendChar: 'y', sendIndex: 1, endIndex: 1 },
//     { sendChar: 'a', sendIndex: 1, endIndex: 2 }
//   ];

//   await openMenu(t);
//   const menu = await t.context.session.findElement(By.css(ex.menuSelector));

//   for (let test of charIndexTest) {
//     await menu.sendKeys(test.sendChar);

//     await assertAriaActivedescendant(t, ex.menuSelector, ex.menuitemSelector, test.endIndex);
//   }
// });
