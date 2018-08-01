'use strict';

const { ariaTest } = require('..');
const { By, Key } = require('selenium-webdriver');
const assertAttributeValues = require('../util/assertAttributeValues');
const assertAriaLabelledby = require('../util/assertAriaLabelledby');
const assertAriaControls = require('../util/assertAriaControls');
const assertAriaRoles = require('../util/assertAriaRoles');
const assertTabOrder = require('../util/assertTabOrder');

const exampleFile = 'tabs/tabs-1/tabs.html';

const ex = {
  tablistSelector: '#ex1 [role="tablist"]',
  tabSelector: '#ex1 [role="tab"]',
  tabpanelSelector: '#ex1 [role="tabpanel"]',
  tabCount: 3,
  deletableId: 'complex',
  tabTabOrder: [
    ['#nils', '#nils-tab'],
    ['#agnes', '#agnes-tab'],
    ['#complex', '#complexcomplex']
  ]
};

const openTabAtIndex = async function (t, tabOrderIndex) {
  const selector = ex.tabSelector + ':nth-child(' + (tabOrderIndex + 1) + ')';

  await t.context.session.findElement(By.css(selector)).click();
};

const checkFocus = function (t, selector, index) {
  return t.context.session.executeScript(function () {
    const [selector, index] = arguments;
    let items = document.querySelectorAll(selector);
    return items[index] === document.activeElement;
  }, selector, index);
};

// Attributes

ariaTest('role="tablist" on div element', exampleFile, 'tablist-role', async (t) => {
  t.plan(1);
  await assertAriaRoles(t, 'ex1', 'tablist', '1', 'div');
});

ariaTest('"ariaLabel" attribute on role="tablist"', exampleFile, 'tablist-aria-label', async (t) => {
  t.plan(2);

  const element = await t.context.session.findElement(By.css(ex.tablistSelector));

  const ariaLabelExists = await t.context.session.executeScript(async function () {
    const selector = arguments[0];
    let el = document.querySelector(selector);
    return el.hasAttribute('aria-label');
  }, ex.tablistSelector);

  t.true(
    ariaLabelExists,
    '"aria-label" attribute should exist on element: ' + ex.tablistSelector
  );

  let label = await element.getAttribute('aria-label');

  t.is(
    label,
    'Entertainment',
    '"aria-label" attribute should be set to "Entertainment" for element: ' + ex.tablistSelector
  );
});

ariaTest('role="tab" on button elements', exampleFile, 'tab-role', async (t) => {
  t.plan(1);
  await assertAriaRoles(t, 'ex1', 'tab', '3', 'button');
});

ariaTest('"aria-selected" set on role="tab"', exampleFile, 'tab-aria-selected', async (t) => {
  t.plan(18);

  let tabs = await t.context.session.findElements(By.css(ex.tabSelector));
  let tabpanels = await t.context.session.findElements(By.css(ex.tabpanelSelector));

  for (let selectedEl = 0; selectedEl < tabs.length; selectedEl++) {

    // Open the tab
    await openTabAtIndex(t, selectedEl);

    for (let el = 0; el < tabs.length; el++) {

      // test only one element has aria-selected="true"
      let selected = el === selectedEl ? 'true' : 'false';
      t.is(
        await tabs[el].getAttribute('aria-selected'),
        selected,
        'Tab at index ' + selectedEl + ' is selected, therefore, tab at index ' +
          el + ' should have aria-selected="' + selected + '"'
      );

      // test only the appropriate tabpanel element is visible
      let tabpanelVisible = el === selectedEl;
      t.is(
        await tabpanels[el].isDisplayed(),
        tabpanelVisible,
        'Tab at index ' + selectedEl + ' is selected, therefore, only the tabpanel at ' +
          'index ' + selectedEl + ' should be displayed'
      );
    }
  }
});

ariaTest('"tabindex" on role="tab"', exampleFile, 'tab-tabindex', async (t) => {
  t.plan(9);

  let tabs = await t.context.session.findElements(By.css(ex.tabSelector));
  for (let selectedEl = 0; selectedEl < tabs.length; selectedEl++) {

    // Open the tab
    await openTabAtIndex(t, selectedEl);

    for (let el = 0; el < tabs.length; el++) {

      // The open tab should have no tabindex set
      if (el === selectedEl) {
        const tabindexExists = await t.context.session.executeScript(async function () {
          const [selector, el] = arguments;
          let tabs = document.querySelectorAll(selector);
          return tabs[el].hasAttribute('tabindex');
        }, ex.tabSelector, el);

        t.false(
          tabindexExists,
          'Tab at index ' + selectedEl + ' is selected, therefore, that tab should not ' +
            'have the "tabindex" attribute'
        );

      }

      // Unopened tabs should have tabindex="-1"
      else {
        t.is(
          await tabs[el].getAttribute('tabindex'),
          '-1',
          'Tab at index ' + selectedEl + ' is selected, therefore, tab at index ' +
            el + ' should have tabindex="-1"'
        );
      }
    }
  }
});

ariaTest('"aria-control" attribute on role="tab"', exampleFile, 'tab-aria-control', async (t) => {
  t.plan(1);
  await assertAriaControls(t, 'ex1', ex.tabSelector);
});

ariaTest('role="tabpanel" on div element', exampleFile, 'tabpanel-role', async (t) => {
  t.plan(1);
  await assertAriaRoles(t, 'ex1', 'tabpanel', '3', 'div');
});

ariaTest('"aria-labelledby" attribute on role="tabpanel" elements', exampleFile, 'tabpanel-aria-labelledby', async (t) => {
  t.plan(1);
  await assertAriaLabelledby(t, 'ex1', ex.tabpanelSelector);
});

ariaTest('tabindex="0" on role="tabpanel" elements', exampleFile, 'tabpanel-tabindex', async (t) => {
  t.plan(1);
  await assertAttributeValues(t, ex.tabpanelSelector, 'tabindex', '0');
});


// Keys

ariaTest('TAB key moves focus to open tab and panel', exampleFile, 'key-tab', async (t) => {
  t.plan(3);

  for (let index = 0; index < ex.tabCount; index++) {
    await openTabAtIndex(t, index);

    await assertTabOrder(t, ex.tabTabOrder[index]);
  }
});

ariaTest('ARROW_RIGHT key moves focus and activates tab', exampleFile, 'key-right-arrow', async (t) => {
  t.plan(9);

  // Put focus on first tab
  openTabAtIndex(t, 0);

  const tabs = await t.context.session.findElements(By.css(ex.tabSelector));
  const tabpanels = await t.context.session.findElements(By.css(ex.tabpanelSelector));
  for (let index = 0; index < tabs.length - 1; index++) {

    // Send the arrow right key to move focus
    await tabs[index].sendKeys(Key.ARROW_RIGHT);

    // Check the focus is correct
    t.true(
      await checkFocus(t, ex.tabSelector, index + 1),
      'right arrow on tab "' + index + '" should put focus on the next tab.'
    );
    t.is(
      await tabs[index + 1].getAttribute('aria-selected'),
      'true',
      'right arrow on tab "' + index + '" should set aria-selected="true" on next tab.'
    );
    t.true(
      await tabpanels[index + 1].isDisplayed(),
      'right arrow on tab "' + index + '" should display the next tab panel.'
    );
  }

  // Send the arrow right key to move focus
  await tabs[tabs.length - 1].sendKeys(Key.ARROW_RIGHT);

  // Check the focus returns to the first item
  t.true(
    await checkFocus(t, ex.tabSelector, 0),
    'right arrow on tab "' + (tabs.length - 1) + '" should put focus to first tab.'
  );
  t.is(
    await tabs[0].getAttribute('aria-selected'),
    'true',
    'right arrow on tab "' + (tabs.length - 1) + '" should set aria-selected="true" on first tab.'
  );
  t.true(
    await tabpanels[0].isDisplayed(),
    'right arrow on tab "' + (tabs.length - 1) + '" should display the first panel.'
  );

});

ariaTest('ARROW_LEFT key moves focus and activates tab', exampleFile, 'key-left-arrow', async (t) => {
  t.plan(9);

  const tabs = await t.context.session.findElements(By.css(ex.tabSelector));
  const tabpanels = await t.context.session.findElements(By.css(ex.tabpanelSelector));

  // Put focus on first tab
  openTabAtIndex(t, 0);

  // Send the right arrow
  await tabs[0].sendKeys(Key.ARROW_LEFT);

  // Check the focus returns to the last item
  t.true(
    await checkFocus(t, ex.tabSelector, tabs.length - 1),
    'right arrow on tab 0 should put focus to last tab.'
  );
  t.is(
    await tabs[tabs.length - 1].getAttribute('aria-selected'),
    'true',
    'right arrow on tab 0 should set aria-selected="true" on last tab.'
  );
  t.true(
    await tabpanels[tabs.length - 1].isDisplayed(),
    'right arrow on tab 0 should display the last panel.'
  );

  for (let index = tabs.length - 1; index > 0; index--) {

    // Send the arrow right key to move focus
    await tabs[index].sendKeys(Key.ARROW_LEFT);

    // Check the focus is correct
    t.true(
      await checkFocus(t, ex.tabSelector, index - 1),
      'right arrow on tab "' + index + '" should put focus on the previous tab.'
    );
    t.is(
      await tabs[index - 1].getAttribute('aria-selected'),
      'true',
      'right arrow on tab "' + index + '" should set aria-selected="true" on previous tab.'
    );
    t.true(
      await tabpanels[index - 1].isDisplayed(),
      'right arrow on tab "' + index + '" should display the next previous panel.'
    );
  }
});

ariaTest('HOME key moves focus and selects tab', exampleFile, 'key-home', async (t) => {

  t.plan(9);

  const tabs = await t.context.session.findElements(By.css(ex.tabSelector));
  const tabpanels = await t.context.session.findElements(By.css(ex.tabpanelSelector));
  for (let index = 0; index < tabs.length; index++) {

    // Put focus on the tab
    openTabAtIndex(t, index);

    // Send the home key to the tab
    await tabs[index].sendKeys(Key.HOME);

    // Check the focus is correct
    t.true(
      await checkFocus(t, ex.tabSelector, 0),
      'home key on tab "' + index + '" should put focus on the first tab.'
    );
    t.is(
      await tabs[0].getAttribute('aria-selected'),
      'true',
      'home key on tab "' + index + '" should set aria-selected="true" on the first tab.'
    );
    t.true(
      await tabpanels[0].isDisplayed(),
      'home key on tab "' + index + '" should display the first tab.'
    );
  }
});

ariaTest('END key moves focus and selects tab', exampleFile, 'key-end', async (t) => {
  t.plan(9);

  const tabs = await t.context.session.findElements(By.css(ex.tabSelector));
  const tabpanels = await t.context.session.findElements(By.css(ex.tabpanelSelector));
  for (let index = 0; index < tabs.length; index++) {

    // Put focus on the tab
    openTabAtIndex(t, index);

    // Send the end key to the tab
    await tabs[index].sendKeys(Key.END);

    // Check the focus is correct
    t.true(
      await checkFocus(t, ex.tabSelector, tabs.length - 1),
      'home key on tab "' + index + '" should put focus on the last tab.'
    );
    t.is(
      await tabs[tabs.length - 1].getAttribute('aria-selected'),
      'true',
      'home key on tab "' + index + '" should set aria-selected="true" on the last tab.'
    );
    t.true(
      await tabpanels[tabs.length - 1].isDisplayed(),
      'home key on tab "' + index + '" should display the last tab.'
    );
  }
});

ariaTest('DELETE key removes third tab', exampleFile, 'key-delete', async (t) => {
  t.plan(4);

  let tabs = await t.context.session.findElements(By.css(ex.tabSelector));

  // Put focus on the first tab
  openTabAtIndex(t, 0);

  // Send the delete key to the tab
  await tabs[0].sendKeys(Key.DELETE);

  t.is(
    (await t.context.session.findElements(By.css(ex.tabSelector))).length,
    3,
    'Sending DELETE to first tab should not change number of tabs'
  );

  // Put focus on the second tab
  openTabAtIndex(t, 1);

  // Send the delete key to the tab
  await tabs[1].sendKeys(Key.DELETE);

  t.is(
    (await t.context.session.findElements(By.css(ex.tabSelector))).length,
    3,
    'Sending DELETE to second tab should not change number of tabs'
  );

  // Put focus on the last tab
  openTabAtIndex(t, 2);

  // Send the delete key to the tab
  await tabs[2].sendKeys(Key.DELETE);

  t.is(
    (await t.context.session.findElements(By.css(ex.tabSelector))).length,
    2,
    'Sending DELETE to third tab should change number of tabs'
  );

  t.is(
    (await t.context.session.findElements(By.id(ex.deletableId))).length,
    0,
    'Sending DELETE to third tab should have delete tab with id: ' + ex.deletableId
  );

});
