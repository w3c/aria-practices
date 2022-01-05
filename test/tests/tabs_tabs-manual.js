const { ariaTest } = require('..');
const { By, Key } = require('selenium-webdriver');
const assertAriaControls = require('../util/assertAriaControls');
const assertAriaLabelledby = require('../util/assertAriaLabelledby');
const assertAriaRoles = require('../util/assertAriaRoles');
const assertTabOrder = require('../util/assertTabOrder');

const exampleFile = 'tabs/tabs-manual.html';

const ex = {
  tablistSelector: '#ex1 [role="tablist"]',
  tabSelector: '#ex1 [role="tab"]',
  tabpanelSelector: '#ex1 [role="tabpanel"]',
  tabCount: 4,
  tabTabOrder: [
    // button id, tabpanel id
    ['#tab-1', '#tabpanel-1 a'],
    ['#tab-2', '#tabpanel-2 a'],
    ['#tab-3', '#tabpanel-3 a'],
    ['#tab-4', '#tabpanel-4 a'],
  ],
};

const openTabAtIndex = async function (t, tabOrderIndex) {
  const selector = ex.tabSelector + ':nth-child(' + (tabOrderIndex + 1) + ')';

  await t.context.session.findElement(By.css(selector)).click();
};

const waitAndCheckFocus = async function (t, selector, index) {
  return t.context.session.wait(
    async function () {
      return t.context.session.executeScript(
        function () {
          const [selector, index] = arguments;
          const items = document.querySelectorAll(selector);
          return items[index] === document.activeElement;
        },
        selector,
        index
      );
    },
    t.context.waitTime,
    'Timeout waiting for document.activeElement to become item at index ' +
      index +
      ' of elements selected by: ' +
      selector
  );
};

const waitAndCheckAriaSelected = async function (t, index) {
  return t.context.session.wait(
    async function () {
      const tabs = await t.context.queryElements(t, ex.tabSelector);
      return (await tabs[index].getAttribute('aria-selected')) === 'true';
    },
    t.context.waitTime,
    'Timeout waiting for aria-selected to be set to true.'
  );
};

// Attributes

ariaTest(
  'role="tablist" on div element',
  exampleFile,
  'tablist-role',
  async (t) => {
    await assertAriaRoles(t, 'ex1', 'tablist', '1', 'div');
  }
);

ariaTest(
  '"ariaLabelledby" attribute on role="tablist"',
  exampleFile,
  'tablist-aria-labelledby',
  async (t) => {
    await assertAriaLabelledby(t, ex.tablistSelector);
  }
);

ariaTest(
  'role="tab" on button elements',
  exampleFile,
  'tab-role',
  async (t) => {
    await assertAriaRoles(t, 'ex1', 'tab', ex.tabCount.toString(), 'button');
  }
);

ariaTest(
  '"aria-selected" set on role="tab"',
  exampleFile,
  'tab-aria-selected',
  async (t) => {
    const tabs = await t.context.queryElements(t, ex.tabSelector);
    const tabpanels = await t.context.queryElements(t, ex.tabpanelSelector);

    for (let selectedEl = 0; selectedEl < tabs.length; selectedEl++) {
      // Open the tab
      await openTabAtIndex(t, selectedEl);

      for (let el = 0; el < tabs.length; el++) {
        // test only one element has aria-selected="true"
        let selected = el === selectedEl ? 'true' : 'false';
        t.is(
          await tabs[el].getAttribute('aria-selected'),
          selected,
          'Tab at index ' +
            selectedEl +
            ' is selected, therefore, tab at index ' +
            el +
            ' should have aria-selected="' +
            selected +
            '"'
        );

        // test only the appropriate tabpanel element is visible
        let tabpanelVisible = el === selectedEl;
        t.is(
          await tabpanels[el].isDisplayed(),
          tabpanelVisible,
          'Tab at index ' +
            selectedEl +
            ' is selected, therefore, only the tabpanel at ' +
            'index ' +
            selectedEl +
            ' should be displayed'
        );
      }
    }
  }
);

ariaTest('"tabindex" on role="tab"', exampleFile, 'tab-tabindex', async (t) => {
  const tabs = await t.context.queryElements(t, ex.tabSelector);
  for (let selectedEl = 0; selectedEl < tabs.length; selectedEl++) {
    // Open the tab
    await openTabAtIndex(t, selectedEl);

    for (let el = 0; el < tabs.length; el++) {
      // The open tab should have no tabindex set
      if (el === selectedEl) {
        const tabindexExists = await t.context.session.executeScript(
          async function () {
            const [selector, el] = arguments;
            let tabs = document.querySelectorAll(selector);
            return tabs[el].hasAttribute('tabindex');
          },
          ex.tabSelector,
          el
        );

        t.false(
          tabindexExists,
          'Tab at index ' +
            selectedEl +
            ' is selected, therefore, that tab should not ' +
            'have the "tabindex" attribute'
        );
      }

      // Unopened tabs should have tabindex="-1"
      else {
        t.is(
          await tabs[el].getAttribute('tabindex'),
          '-1',
          'Tab at index ' +
            selectedEl +
            ' is selected, therefore, tab at index ' +
            el +
            ' should have tabindex="-1"'
        );
      }
    }
  }
});

ariaTest(
  '"aria-control" attribute on role="tab"',
  exampleFile,
  'tab-aria-controls',
  async (t) => {
    await assertAriaControls(t, ex.tabSelector);
  }
);

ariaTest(
  'role="tabpanel" on div element',
  exampleFile,
  'tabpanel-role',
  async (t) => {
    await assertAriaRoles(t, 'ex1', 'tabpanel', ex.tabCount.toString(), 'div');
  }
);

ariaTest(
  '"aria-labelledby" attribute on role="tabpanel" elements',
  exampleFile,
  'tabpanel-aria-labelledby',
  async (t) => {
    await assertAriaLabelledby(t, ex.tabpanelSelector);
  }
);

// Keys

ariaTest(
  'TAB key moves focus to open tab and first link in the tabpanel',
  exampleFile,
  'key-tab',
  async (t) => {
    for (let index = 0; index < ex.tabCount; index++) {
      await openTabAtIndex(t, index);

      await assertTabOrder(t, ex.tabTabOrder[index]);
    }
  }
);

ariaTest(
  'ARROW_RIGHT key moves focus',
  exampleFile,
  'key-right-arrow',
  async (t) => {
    // Put focus on first tab
    await openTabAtIndex(t, 0);

    const tabs = await t.context.queryElements(t, ex.tabSelector);
    const tabpanels = await t.context.queryElements(t, ex.tabpanelSelector);
    for (let index = 0; index < tabs.length - 1; index++) {
      // Send the arrow right key to move focus
      await tabs[index].sendKeys(Key.ARROW_RIGHT);

      // Check the focus is correct
      t.true(
        await waitAndCheckFocus(t, ex.tabSelector, index + 1),
        'right arrow on tab "' + index + '" should put focus on the next tab.'
      );
      t.false(
        await tabpanels[index + 1].isDisplayed(),
        'right arrow on tab "' +
          index +
          '" should not display the next tab panel.'
      );
    }

    // Send the arrow right key to move focus
    await tabs[tabs.length - 1].sendKeys(Key.ARROW_RIGHT);

    // Check the focus returns to the first item
    t.true(
      await waitAndCheckFocus(t, ex.tabSelector, 0),
      'right arrow on tab "' +
        (tabs.length - 1) +
        '" should put focus to first tab.'
    );
  }
);

ariaTest(
  'ENTER activates tab that contains focus',
  exampleFile,
  'key-enter-or-space',
  async (t) => {
    const tabs = await t.context.queryElements(t, ex.tabSelector);
    const tabpanels = await t.context.queryElements(t, ex.tabpanelSelector);
    for (let index = 0; index < tabs.length - 1; index++) {
      // Send ENTER to activate tab
      await tabs[index].sendKeys(Key.ENTER);

      // Check the focus is correct
      t.true(
        await tabpanels[index].isDisplayed(),
        'Enter on tab "' + index + '" should active the current panel.'
      );
      t.true(
        await waitAndCheckAriaSelected(t, index),
        'Enter on tab "' + index + '" should set aria-selected to "true".'
      );

      // Send arrow key to move focus
      await tabs[index].sendKeys(Key.ARROW_RIGHT);
    }
  }
);

ariaTest(
  'SPACE activates tab that contains focus',
  exampleFile,
  'key-enter-or-space',
  async (t) => {
    const tabs = await t.context.queryElements(t, ex.tabSelector);
    const tabpanels = await t.context.queryElements(t, ex.tabpanelSelector);
    for (let index = 0; index < tabs.length - 1; index++) {
      // Send SPACE to activate tab
      await tabs[index].sendKeys(Key.SPACE);

      // Check the focus is correct
      t.true(
        await tabpanels[index].isDisplayed(),
        'Enter on tab "' + index + '" should active the current panel.'
      );
      t.true(
        await waitAndCheckAriaSelected(t, index),
        'Enter on tab "' + index + '" should set aria-selected to "true".'
      );

      // Send arrow key to move focus
      await tabs[index].sendKeys(Key.ARROW_RIGHT);
    }
  }
);

ariaTest(
  'ARROW_LEFT key moves focus',
  exampleFile,
  'key-left-arrow',
  async (t) => {
    const tabs = await t.context.queryElements(t, ex.tabSelector);
    const tabpanels = await t.context.queryElements(t, ex.tabpanelSelector);

    // Put focus on first tab
    await openTabAtIndex(t, 0);

    // Send the right arrow
    await tabs[0].sendKeys(Key.ARROW_LEFT);

    // Check the focus returns to the last item
    t.true(
      await waitAndCheckFocus(t, ex.tabSelector, tabs.length - 1),
      'right arrow on tab 0 should put focus to last tab.'
    );
    t.false(
      await tabpanels[tabs.length - 1].isDisplayed(),
      'right arrow on tab 0 should not display the last panel.'
    );

    for (let index = tabs.length - 1; index > 0; index--) {
      // Send the arrow right key to move focus
      await tabs[index].sendKeys(Key.ARROW_LEFT);

      // Check the focus is correct
      t.true(
        await waitAndCheckFocus(t, ex.tabSelector, index - 1),
        'right arrow on tab "' +
          index +
          '" should put focus on the previous tab.'
      );
    }
  }
);

ariaTest('HOME key moves focus', exampleFile, 'key-home', async (t) => {
  const tabs = await t.context.queryElements(t, ex.tabSelector);
  for (let index = 0; index < tabs.length; index++) {
    // Put focus on the tab
    await openTabAtIndex(t, index);

    // Send the home key to the tab
    await tabs[index].sendKeys(Key.HOME);

    // Check the focus is correct
    t.true(
      await waitAndCheckFocus(t, ex.tabSelector, 0),
      'home key on tab "' + index + '" should put focus on the first tab.'
    );
  }
});

ariaTest('END key moves focus', exampleFile, 'key-end', async (t) => {
  const tabs = await t.context.queryElements(t, ex.tabSelector);
  for (let index = 0; index < tabs.length; index++) {
    // Put focus on the tab
    await openTabAtIndex(t, index);

    // Send the end key to the tab
    await tabs[index].sendKeys(Key.END);

    // Check the focus is correct
    t.true(
      await waitAndCheckFocus(t, ex.tabSelector, tabs.length - 1),
      'home key on tab "' + index + '" should put focus on the last tab.'
    );
  }
});
