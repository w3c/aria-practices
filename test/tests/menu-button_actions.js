const { ariaTest } = require('..');
const { By, Key } = require('selenium-webdriver');
const assertAttributeValues = require('../util/assertAttributeValues');
const assertAriaLabelledby = require('../util/assertAriaLabelledby');
const assertAriaControls = require('../util/assertAriaControls');
const assertAriaRoles = require('../util/assertAriaRoles');

const exampleFile = 'menu-button/menu-button-actions.html';

const ex = {
  menubuttonSelector: '#ex1 button',
  menuSelector: '#ex1 [role="menu"]',
  menuitemSelector: '#ex1 [role="menuitem"]',
  numMenuitems: 4,
  lastactionSelector: '#action_output',
};

const getFocusText = function (t) {
  return t.context.session.executeScript(function () {
    return document.activeElement.textContent.trim();
  });
};

const checkFocus = function (t, selector, index) {
  return t.context.session.executeScript(
    function () {
      const [selector, index] = arguments;
      let items = document.querySelectorAll(selector);
      return items[index] === document.activeElement;
    },
    selector,
    index
  );
};

const openMenu = async function (t) {
  return await t.context.session
    .findElement(By.css(ex.menubuttonSelector))
    .sendKeys(Key.ARROW_DOWN);
};

// Attributes

ariaTest(
  '"aria-haspopup" attribute on menu button',
  exampleFile,
  'menu-button-aria-haspopup',
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
  'menu-button-aria-controls',
  async (t) => {
    await assertAriaControls(t, ex.menubuttonSelector);
  }
);

ariaTest(
  '"aria-expanded" attribute on menu button',
  exampleFile,
  'menu-button-aria-expanded',
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

    await openMenu(t);

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
  'role="menuitem" on li element',
  exampleFile,
  'menuitem-role',
  async (t) => {
    await assertAriaRoles(t, 'ex1', 'menuitem', ex.numMenuitems, 'li');
  }
);

ariaTest(
  'tabindex="-1" on role="menuitem"',
  exampleFile,
  'menuitem-tabindex',
  async (t) => {
    await assertAttributeValues(t, ex.menuitemSelector, 'tabindex', '-1');
  }
);

// Keys

ariaTest(
  '"enter" on menu button',
  exampleFile,
  'menu-button-key-open',
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

    t.true(
      await checkFocus(t, ex.menuitemSelector, 0),
      'Focus should be on first item after sending button ENTER'
    );
  }
);

ariaTest(
  '"down arrow" on menu button',
  exampleFile,
  'menu-button-key-open',
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

    t.true(
      await checkFocus(t, ex.menuitemSelector, 0),
      'Focus should be on first item after sending button ARROW_DOWN'
    );
  }
);

ariaTest(
  '"space" on menu button',
  exampleFile,
  'menu-button-key-open',
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

    t.true(
      await checkFocus(t, ex.menuitemSelector, 0),
      'Focus should be on first item after sending button SPACE'
    );
  }
);

ariaTest(
  '"up arrow" on menu button',
  exampleFile,
  'menu-button-key-up-arrow',
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

    t.true(
      await checkFocus(t, ex.menuitemSelector, ex.numMenuitems - 1),
      'Focus should be on last item after sending button ARROW_UP'
    );
  }
);

ariaTest(
  '"enter" on role="menuitem"',
  exampleFile,
  'menu-key-enter',
  async (t) => {
    const items = await t.context.queryElements(t, ex.menuitemSelector);
    for (let item of items) {
      await openMenu(t);
      const itemText = await item.getText();
      await item.sendKeys(Key.ENTER);

      t.is(
        itemText,
        await t.context.session
          .findElement(By.css(ex.lastactionSelector))
          .getAttribute('value'),
        'Key enter should select action: ' + itemText
      );

      t.false(
        await t.context.session
          .findElement(By.css(ex.menuSelector))
          .isDisplayed(),
        'Key enter on item "' + itemText + '" should close menu.'
      );

      t.true(
        await checkFocus(t, ex.menubuttonSelector, 0),
        'Key enter on item "' + itemText + '" should put focus back on menu.'
      );
    }
  }
);

ariaTest(
  '"escape" on role="menuitem"',
  exampleFile,
  'menu-key-escape',
  async (t) => {
    const items = await t.context.queryElements(t, ex.menuitemSelector);
    for (let item of items) {
      await openMenu(t);
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
  }
);

ariaTest(
  '"down arrow" on role="menuitem"',
  exampleFile,
  'menu-key-down-arrow',
  async (t) => {
    await openMenu(t);

    const items = await t.context.queryElements(t, ex.menuitemSelector);
    for (let index = 0; index < items.length - 1; index++) {
      await items[index].sendKeys(Key.ARROW_DOWN);

      const itemText = await items[index].getText();
      t.true(
        await checkFocus(t, ex.menuitemSelector, index + 1),
        'down arrow on item "' +
          itemText +
          ' (' +
          index +
          ') " should put focus on the next item.'
      );
    }

    await items[items.length - 1].sendKeys(Key.ARROW_DOWN);

    const itemText = await items[items.length - 1].getText();
    t.true(
      await checkFocus(t, ex.menuitemSelector, 0),
      'down arrow on item "' +
        itemText +
        ' (0) " should put focus to first item.'
    );
  }
);

ariaTest(
  '"up arrow" on role="menuitem"',
  exampleFile,
  'menu-key-up-arrow',
  async (t) => {
    await openMenu(t);

    const items = await t.context.queryElements(t, ex.menuitemSelector);

    await items[0].sendKeys(Key.ARROW_UP);

    const itemText = await items[0].getText();
    t.true(
      await checkFocus(t, ex.menuitemSelector, items.length - 1),
      'up arrow on item "' +
        itemText +
        ' (0 of ' +
        items.length +
        ') " should put focus to last item.'
    );

    for (let index = items.length - 1; index > 0; index--) {
      await items[index].sendKeys(Key.ARROW_UP);

      const itemText = await items[index].getText();
      t.true(
        await checkFocus(t, ex.menuitemSelector, index - 1),
        'up arrow on item "' +
          itemText +
          ' (' +
          index +
          ') " should put focus on the previous item.'
      );
    }
  }
);

ariaTest(
  '"home" on role="menuitem"',
  exampleFile,
  'menu-key-home',
  async (t) => {
    await openMenu(t);

    const items = await t.context.queryElements(t, ex.menuitemSelector);
    for (let index = 0; index < items.length; index++) {
      await items[index].sendKeys(Key.HOME);

      const itemText = await items[index].getText();
      t.true(
        await checkFocus(t, ex.menuitemSelector, 0),
        'key home on item "' +
          itemText +
          '" should put focus on the first time.'
      );
    }
  }
);

ariaTest('"end" on role="menuitem"', exampleFile, 'menu-key-end', async (t) => {
  await openMenu(t);

  const items = await t.context.queryElements(t, ex.menuitemSelector);
  for (let index = 0; index < items.length; index++) {
    await items[index].sendKeys(Key.END);

    const itemText = await items[index].getText();
    t.true(
      await checkFocus(t, ex.menuitemSelector, items.length - 1),
      'key end on item "' + itemText + '" should put focus on the last item.'
    );
  }
});

ariaTest(
  '"character" on role="menuitem"',
  exampleFile,
  'menu-key-character',
  async (t) => {
    const charIndexTest = [
      { sendChar: 'x', sendIndex: 0, endIndex: 0 },
      { sendChar: 'a', sendIndex: 0, endIndex: 1 },
      { sendChar: 'y', sendIndex: 1, endIndex: 1 },
      { sendChar: 'a', sendIndex: 1, endIndex: 2 },
    ];

    await openMenu(t);
    const items = await t.context.queryElements(t, ex.menuitemSelector);

    for (let test of charIndexTest) {
      await items[test.sendIndex].sendKeys(test.sendChar);

      t.true(
        await checkFocus(t, ex.menuitemSelector, test.endIndex),
        'Sending character "' +
          test.sendChar +
          '" to item at index ' +
          test.sendIndex +
          '" should put focus on item at index: ' +
          test.endIndex
      );
    }
  }
);
