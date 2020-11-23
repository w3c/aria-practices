const { ariaTest } = require('..');
const { By, Key } = require('selenium-webdriver');
const assertAttributeValues = require('../util/assertAttributeValues');
const assertAriaLabelledby = require('../util/assertAriaLabelledby');
const assertAriaControls = require('../util/assertAriaControls');
const assertAriaRoles = require('../util/assertAriaRoles');
const replaceExternalLink = require('../util/replaceExternalLink');

const exampleFile = 'menu-button/menu-button-links.html';

const ex = {
  menubuttonSelector: '#ex1 button',
  menuSelector: '#ex1 [role="menu"]',
  menuitemSelector: '#ex1 [role="menuitem"]',
  numMenuitems: 6,
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
  const expanded = await t.context.session
    .findElement(By.css(ex.menubuttonSelector))
    .getAttribute('aria-expanded');

  if (expanded !== 'true') {
    await t.context.session
      .findElement(By.css(ex.menubuttonSelector))
      .sendKeys(Key.ENTER);
  }

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

const waitForNoAriaExpanded = async function (t) {
  return t.context.session.wait(
    async function () {
      let ariaExpanded = await t.context.session
        .findElement(By.css(ex.menuSelector))
        .getAttribute('aria-expanded');
      return ariaExpanded === null;
    },
    t.context.waitTime,
    'Timeout waiting for aria-expanded to be removed'
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

ariaTest('role="none" on li element', exampleFile, 'none-role', async (t) => {
  await assertAriaRoles(t, 'ex1', 'none', ex.numMenuitems, 'li');
});

ariaTest(
  'role="menuitem" on a element',
  exampleFile,
  'menuitem-role',
  async (t) => {
    await assertAriaRoles(t, 'ex1', 'menuitem', ex.numMenuitems, 'a');
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

    t.true(
      await checkFocus(t, ex.menuitemSelector, 0),
      'Focus should be on first item after sending button ENTER'
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

    t.true(
      await checkFocus(t, ex.menuitemSelector, 0),
      'Focus should be on first item after sending button ARROW_DOWN'
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

    t.true(
      await checkFocus(t, ex.menuitemSelector, 0),
      'Focus should be on first item after sending button SPACE'
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

    t.true(
      await checkFocus(t, ex.menuitemSelector, ex.numMenuitems - 1),
      'Focus should be on last item after sending button ARROW_UP'
    );
  }
);

ariaTest('"enter" on role="menuitem"', exampleFile, 'menu-enter', async (t) => {
  for (let index = 0; index < ex.numMenuitems; index++) {
    // Return to test page
    await t.context.session.get(t.context.url);
    const item = (await t.context.queryElements(t, ex.menuitemSelector))[index];

    // Update url to remove external reference for dependable testing
    const newUrl = t.context.url + '#test-url-change';
    await replaceExternalLink(t, newUrl, ex.menuitemSelector, index);

    await openMenu(t);
    await item.sendKeys(Key.ENTER);

    t.is(
      await t.context.session.getCurrentUrl(),
      newUrl,
      'Key enter when focus on list item at index ' +
        index +
        'should active the link'
    );
  }
});

ariaTest(
  '"escape" on role="menuitem"',
  exampleFile,
  'menu-escape',
  async (t) => {
    const items = await t.context.queryElements(t, ex.menuitemSelector);
    for (let index = 0; index < items.length; index++) {
      const item = items[index];

      await openMenu(t);
      await item.sendKeys(Key.ESCAPE);
      await waitForNoAriaExpanded(t);

      // fixes for running regression tests on windows
      let url = t.context.url;
      if (url.indexOf('\\') >= 0) {
        url = url.replace(/\\/g, '/');
        url = url.replace('file://C:', 'file:///C:');
      }

      t.is(
        await t.context.session.getCurrentUrl(),
        url,
        'Key escape when focus on list item at index ' +
          index +
          ' should not activate the link'
      );

      t.true(
        await checkFocus(t, ex.menubuttonSelector, 0),
        'Key escape on item at index ' +
          index +
          ' should put focus back on menu.'
      );
    }
  }
);

ariaTest(
  '"down arrow" on role="menuitem"',
  exampleFile,
  'menu-down-arrow',
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
          '" should put focus on the next item.'
      );
    }

    await items[items.length - 1].sendKeys(Key.ARROW_DOWN);

    const itemText = await items[items.length - 1].getText();
    t.true(
      await checkFocus(t, ex.menuitemSelector, 0),
      'down arrow on item "' + itemText + '" should put focus to first item.'
    );
  }
);

ariaTest(
  '"up arrow" on role="menuitem"',
  exampleFile,
  'menu-up-arrow',
  async (t) => {
    await openMenu(t);

    const items = await t.context.queryElements(t, ex.menuitemSelector);

    await items[0].sendKeys(Key.ARROW_UP);

    const itemText = await items[0].getText();
    t.true(
      await checkFocus(t, ex.menuitemSelector, items.length - 1),
      'up arrow on item "' + itemText + '" should put focus to last item.'
    );

    for (let index = items.length - 1; index > 0; index--) {
      await items[index].sendKeys(Key.ARROW_UP);

      const itemText = await items[index].getText();
      t.true(
        await checkFocus(t, ex.menuitemSelector, index - 1),
        'down arrow on item "' +
          itemText +
          '" should put focus on the previous item.'
      );
    }
  }
);

ariaTest('"home" on role="menuitem"', exampleFile, 'menu-home', async (t) => {
  await openMenu(t);

  const items = await t.context.queryElements(t, ex.menuitemSelector);
  for (let index = 0; index < items.length; index++) {
    await items[index].sendKeys(Key.HOME);

    const itemText = await items[index].getText();
    t.true(
      await checkFocus(t, ex.menuitemSelector, 0),
      'key home on item "' + itemText + '" should put focus on the first time.'
    );
  }
});

ariaTest('"end" on role="menuitem"', exampleFile, 'menu-end', async (t) => {
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
  'menu-character',
  async (t) => {
    const charIndexTest = [
      { sendChar: 'a', sendIndex: 0, endIndex: 2 },
      { sendChar: 'w', sendIndex: 2, endIndex: 3 },
      { sendChar: 'w', sendIndex: 3, endIndex: 4 },
      { sendChar: 'w', sendIndex: 4, endIndex: 0 },
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
