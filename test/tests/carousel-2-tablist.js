'use strict';

const { ariaTest } = require('..');
const { By, Key } = require('selenium-webdriver');
const assertAttributeValues = require('../util/assertAttributeValues');
const assertAriaControls = require('../util/assertAriaControls');
const assertAriaLabelledby = require('../util/assertAriaLabelledby');
const assertAriaLabelExists = require('../util/assertAriaLabelExists');
const assertAriaRoles = require('../util/assertAriaRoles');
const assertTabOrder = require('../util/assertTabOrder');

const exampleFile = 'carousel/carousel-2-tablist.html';

const ex = {
  rotationSelector: '#ex1 .rotation',
  landmarkSelector: '#myCarousel',
  tablistSelector: '#ex1 [role="tablist"]',
  tabSelector: '#ex1 [role="tab"]',
  tabpanelSelector: '#ex1 [role="tabpanel"]',
  tabCount: 6,
  tabTabOrder: [
    // tab id, tabpanel id
    ['#carousel-tab-1', '#carousel-item-1'],
    ['#carousel-tab-2', '#carousel-item-2'],
    ['#carousel-tab-3', '#carousel-item-3'],
    ['#carousel-tab-4', '#carousel-item-4'],
    ['#carousel-tab-5', '#carousel-item-5'],
    ['#carousel-tab-6', '#carousel-item-6']
  ],
  rotationLabelPlaying: 'Stop automatic slide show',
  rotationLabelPaused: 'Start automatic slide show'
};

const openTabAtIndex = async function (t, index) {
  const tabs = await t.context.session.findElements(By.css(ex.tabSelector));
  await tabs[index].click();
};

const waitAndCheckFocus = async function (t, selector, index) {
  return t.context.session.wait(async function () {
    return t.context.session.executeScript(function () {
      const [selector, index] = arguments;
      let items = document.querySelectorAll(selector);
      return items[index] === document.activeElement;
    }, selector, index);
  }, t.context.waitTime, 'Timeout waiting for document.activeElement to become item at index ' + index + ' of elements selected by: ' + selector);
};

const waitAndCheckAriaSelected = async function (t, index) {
  return t.context.session.wait(async function () {
    const tabs = await t.context.session.findElements(By.css(ex.tabSelector));
    return (await tabs[index].getAttribute('aria-selected')) === 'true';
  }, t.context.waitTime, 'Timeout waiting for aria-selected to be set to true.');
};

// Attributes

ariaTest('Carousel 2: rotation button has aria-label that is updated based on pause state', exampleFile, 'rotation-aria-label', async (t) => {
  t.plan(4);
  await assertAriaLabelExists(t, ex.rotationSelector);
  await assertAttributeValues(t, ex.rotationSelector, 'aria-label', ex.rotationLabelPlaying);

  let rotationButtonEl = await t.context.session.findElement(By.css(ex.rotationSelector));

  // Send ENTER and wait for change of 'aria-label'
  await rotationButtonEl.sendKeys(Key.ENTER);
  await t.context.session.wait(async function () {
    return rotationButtonEl.getAttribute('aria-label') !== ex.rotationLabelPlaying;
  }, t.context.waitTime, 'Timeout waiting for rotation button\'s aria-label to change');

  await assertAttributeValues(t, ex.rotationSelector, 'aria-label', ex.rotationLabelPaused);

  // Send SPACE and wait for change of 'aria-label'
  await rotationButtonEl.sendKeys(Key.ENTER);
  await t.context.session.wait(async function () {
    return rotationButtonEl.getAttribute('aria-label') !== ex.rotationLabelPaused;
  }, t.context.waitTime, 'Timeout waiting for rotation button\'s aria-label to change');

  await assertAttributeValues(t, ex.rotationSelector, 'aria-label', ex.rotationLabelPlaying);


});

ariaTest('Carousel 2: role="tablist" on div element', exampleFile, 'tablist-role', async (t) => {
  t.plan(1);
  await assertAriaRoles(t, 'ex1', 'tablist', '1', 'div');
});

ariaTest('Carousel 2: "aria-label" attribute on role="tablist"', exampleFile, 'tablist-aria-label', async (t) => {
  t.plan(1);
  await assertAriaLabelExists(t, ex.tablistSelector);
});

ariaTest('Carousel 2: role="tab" on button elements', exampleFile, 'tab-role', async (t) => {
  t.plan(1);
  await assertAriaRoles(t, 'ex1', 'tab', ex.tabCount, 'button');
});

ariaTest('"Carousel 2: aria-selected" set on role="tab"', exampleFile, 'tab-aria-selected', async (t) => {
  t.plan(2 * ex.tabCount * ex.tabCount);

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


ariaTest('Carousel 2: "tabindex" on role="tab"', exampleFile, 'tab-tabindex', async (t) => {
  t.plan(ex.tabCount * ex.tabCount);

  let tabs = await t.context.session.findElements(By.css(ex.tabSelector));
  for (let selectedEl = 0; selectedEl < tabs.length; selectedEl++) {

    // Open the tab
    await openTabAtIndex(t, selectedEl);

    for (let el = 0; el < tabs.length; el++) {

      // The open tab should have tabindex of 0
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
        );      }

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

ariaTest('Carousel 2: "aria-controls" attribute on role="tab"', exampleFile, 'tab-aria-controls', async (t) => {
  t.plan(1);
  await assertAriaControls(t, ex.tabSelector);
});

ariaTest('Carousel 2: role="tabpanel" on div element', exampleFile, 'tabpanel-role', async (t) => {
  t.plan(1);
  await assertAriaRoles(t, 'ex1', 'tabpanel', ex.tabCount, 'div');
});

ariaTest('Carousel 2: "aria-label" attribute on role="tabpanel" elements', exampleFile, 'tabpanel-aria-label', async (t) => {
  t.plan(1);
  await assertAriaLabelExists(t, ex.tabpanelSelector);
});

ariaTest('Carousel 2: tabindex="0" on role="tabpanel" elements', exampleFile, 'tabpanel-tabindex', async (t) => {
  t.plan(1);
  await assertAttributeValues(t, ex.tabpanelSelector, 'tabindex', '0');
});

ariaTest('Carousel 2: aria-roledescription="slide" on role="tabpanel" elements', exampleFile, 'tabpanel-roledescription', async (t) => {
  t.plan(1);
  await assertAttributeValues(t, ex.tabpanelSelector, 'aria-roledescription', 'slide');
});


// Keys

ariaTest('Carousel 2: TAB key moves focus to open tab and panel', exampleFile, 'key-tab', async (t) => {
  t.plan(ex.tabCount);

  for (let index = 0; index < ex.tabCount; index++) {
    await openTabAtIndex(t, index);

    await assertTabOrder(t, ex.tabTabOrder[index]);
  }
});

ariaTest('Carousel 2: ARROW_RIGHT key moves focus and activates tab', exampleFile, 'key-right-arrow', async (t) => {
  t.plan(3 * ex.tabCount);

  // Put focus on first tab
  await openTabAtIndex(t, 0);

  const tabs = await t.context.session.findElements(By.css(ex.tabSelector));
  const tabpanels = await t.context.session.findElements(By.css(ex.tabpanelSelector));
  for (let index = 0; index < tabs.length - 1; index++) {

    // Send the arrow right key to move focus
    await tabs[index].sendKeys(Key.ARROW_RIGHT);

    // Check the focus is correct
    t.true(
      await waitAndCheckFocus(t, ex.tabSelector, index + 1),
      'right arrow on tab "' + index + '" should put focus on the next tab.'
    );

    t.true(
      await waitAndCheckAriaSelected(t, index + 1),
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
    await waitAndCheckFocus(t, ex.tabSelector, 0),
    'right arrow on tab "' + (tabs.length - 1) + '" should put focus to first tab.'
  );
  t.true(
    await waitAndCheckAriaSelected(t, 0),
    'right arrow on tab "' + (tabs.length - 1) + '" should set aria-selected="true" on first tab.'
  );
  t.true(
    await tabpanels[0].isDisplayed(),
    'right arrow on tab "' + (tabs.length - 1) + '" should display the first panel.'
  );

});


ariaTest('Carousel 2: ARROW_LEFT key moves focus and activates tab', exampleFile, 'key-left-arrow', async (t) => {
  t.plan(3 * ex.tabCount);

  const tabs = await t.context.session.findElements(By.css(ex.tabSelector));
  const tabpanels = await t.context.session.findElements(By.css(ex.tabpanelSelector));

  // Put focus on first tab
  await openTabAtIndex(t, 0);

  // Send the left arrow
  await tabs[0].sendKeys(Key.ARROW_LEFT);

  // Check the focus returns to the last item
  t.true(
    await waitAndCheckFocus(t, ex.tabSelector, tabs.length - 1),
    'left arrow on tab 0 should put focus to last tab.'
  );

  t.true(
    await waitAndCheckAriaSelected(t, tabs.length - 1),
    'left arrow on tab 0 should set aria-selected="true" on last tab.'
  );
  t.true(
    await tabpanels[tabs.length - 1].isDisplayed(),
    'left arrow on tab 0 should display the last panel.'
  );

  for (let index = tabs.length - 1; index > 0; index--) {

    // Send the arrow left key to move focus
    await tabs[index].sendKeys(Key.ARROW_LEFT);

    // Check the focus is correct
    t.true(
      await waitAndCheckFocus(t, ex.tabSelector, index - 1),
      'left arrow on tab "' + index + '" should put focus on the previous tab.'
    );
    t.true(
      await waitAndCheckAriaSelected(t, index - 1),
      'left arrow on tab "' + index + '" should set aria-selected="true" on previous tab.'
    );
    t.true(
      await tabpanels[index - 1].isDisplayed(),
      'left arrow on tab "' + index + '" should display the next previous panel.'
    );
  }
});

ariaTest('Carousel 2: HOME key moves focus and selects tab', exampleFile, 'key-home', async (t) => {
  t.plan(3 * ex.tabCount);

  const tabs = await t.context.session.findElements(By.css(ex.tabSelector));
  const tabpanels = await t.context.session.findElements(By.css(ex.tabpanelSelector));
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
    t.true(
      await waitAndCheckAriaSelected(t, 0),
      'home key on tab "' + index + '" should set aria-selected="true" on the first tab.'
    );
    t.true(
      await tabpanels[0].isDisplayed(),
      'home key on tab "' + index + '" should display the first tab.'
    );
  }
});

ariaTest('Carousel 2: END key moves focus and selects tab', exampleFile, 'key-end', async (t) => {
  t.plan(3 * ex.tabCount);

  const tabs = await t.context.session.findElements(By.css(ex.tabSelector));
  const tabpanels = await t.context.session.findElements(By.css(ex.tabpanelSelector));
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
    t.true(
      await waitAndCheckAriaSelected(t, tabs.length - 1),
      'home key on tab "' + index + '" should set aria-selected="true" on the last tab.'
    );
    t.true(
      await tabpanels[tabs.length - 1].isDisplayed(),
      'home key on tab "' + index + '" should display the last tab.'
    );
  }
});
