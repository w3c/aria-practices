const { ariaTest } = require('..');
const { By, Key } = require('selenium-webdriver');
const assertAttributeValues = require('../util/assertAttributeValues');
const assertAriaControls = require('../util/assertAriaControls');
const assertAriaLabelExists = require('../util/assertAriaLabelExists');
const assertAriaRoles = require('../util/assertAriaRoles');
const assertTabOrder = require('../util/assertTabOrder');

const exampleFile = 'carousel/carousel-2-tablist.html';

const ex = {
  landmarkSelector: '#myCarousel',
  rotationSelector: '#ex1 .rotation',
  pausePlayButtonSelector: '#ex1 button:first-of-type',
  tablistSelector: '#ex1 [role="tablist"]',
  tabSelector: '#ex1 [role="tab"]',
  tabSelectedSelector: '#ex1 [role="tab"][aria-selected="true"]',
  tabpanelSelector: '#ex1 [role="tabpanel"]',
  slideContainerSelector: '#ex1 .carousel-items',
  tabCount: 6,
  tabTabOrder: [
    // tab id, tabpanel id
    ['#carousel-tab-1', '#carousel-image-1'],
    ['#carousel-tab-2', '#carousel-image-2'],
    ['#carousel-tab-3', '#carousel-image-3'],
    ['#carousel-tab-4', '#carousel-image-4'],
    ['#carousel-tab-5', '#carousel-image-5'],
    ['#carousel-tab-6', '#carousel-image-6'],
  ],
  allFocusableItems: [
    '#ex1 button:first-of-type',
    '#ex1 [role="tab"][aria-selected=true]',
    '#ex1 .active .carousel-image a',
    '#ex1 .active .carousel-caption a',
  ],
  rotationLabelPlaying: 'Stop automatic slide show',
  rotationLabelPaused: 'Start automatic slide show',
  activeCarouselItem: '#ex1 .active',
};

const openTabAtIndex = async function (t, index) {
  const tabs = await t.context.queryElements(t, ex.tabSelector);
  await tabs[index].click();
};

const waitAndCheckFocus = async function (t, selector, index) {
  return t.context.session.wait(
    async function () {
      return t.context.session.executeScript(
        function () {
          const [selector, index] = arguments;
          let items = document.querySelectorAll(selector);
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
  'rotation button has aria-label that is updated based on pause state',
  exampleFile,
  'rotation-aria-label',
  async (t) => {
    t.plan(4);
    await assertAriaLabelExists(t, ex.rotationSelector);
    await assertAttributeValues(
      t,
      ex.rotationSelector,
      'aria-label',
      ex.rotationLabelPlaying
    );

    let rotationButtonEl = await t.context.session.findElement(
      By.css(ex.rotationSelector)
    );

    // Send SPACE key and wait for change of 'aria-label'
    await rotationButtonEl.sendKeys(Key.SPACE);
    await t.context.session.wait(
      async function () {
        return (
          rotationButtonEl.getAttribute('aria-label') !==
          ex.rotationLabelPlaying
        );
      },
      t.context.waitTime,
      "Timeout waiting for rotation button's aria-label to change"
    );

    await assertAttributeValues(
      t,
      ex.rotationSelector,
      'aria-label',
      ex.rotationLabelPaused
    );

    // Send ENTER key and wait for change of 'aria-label'
    await rotationButtonEl.sendKeys(Key.ENTER);
    await t.context.session.wait(
      async function () {
        return (
          rotationButtonEl.getAttribute('aria-label') !== ex.rotationLabelPaused
        );
      },
      t.context.waitTime,
      "Timeout waiting for rotation button's aria-label to change"
    );

    await assertAttributeValues(
      t,
      ex.rotationSelector,
      'aria-label',
      ex.rotationLabelPlaying
    );
  }
);

ariaTest(
  'role="tablist" on div element',
  exampleFile,
  'tablist-role',
  async (t) => {
    t.plan(1);
    await assertAriaRoles(t, 'ex1', 'tablist', '1', 'div');
  }
);

ariaTest(
  '"aria-label" attribute on role="tablist"',
  exampleFile,
  'tablist-aria-label',
  async (t) => {
    t.plan(1);
    await assertAriaLabelExists(t, ex.tablistSelector);
  }
);

ariaTest(
  'role="tab" on button elements',
  exampleFile,
  'tab-role',
  async (t) => {
    t.plan(1);
    await assertAriaRoles(t, 'ex1', 'tab', ex.tabCount, 'button');
  }
);

ariaTest(
  '"aria-label" attribute on role="tab"',
  exampleFile,
  'tab-aria-label',
  async (t) => {
    t.plan(1);
    await assertAriaLabelExists(t, ex.tabSelector);
  }
);

ariaTest(
  '"aria-selected" set on role="tab"',
  exampleFile,
  'tab-aria-selected',
  async (t) => {
    t.plan(2 * ex.tabCount * ex.tabCount);

    let tabs = await t.context.queryElements(t, ex.tabSelector);
    let tabpanels = await t.context.queryElements(t, ex.tabpanelSelector);

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
  t.plan(ex.tabCount * ex.tabCount);

  let tabs = await t.context.queryElements(t, ex.tabSelector);
  for (let selectedEl = 0; selectedEl < tabs.length; selectedEl++) {
    // Open the tab
    await openTabAtIndex(t, selectedEl);

    for (let el = 0; el < tabs.length; el++) {
      // The open tab should have tabindex of 0
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
  '"aria-controls" attribute on role="tab"',
  exampleFile,
  'tab-aria-controls',
  async (t) => {
    t.plan(1);
    await assertAriaControls(t, ex.tabSelector);
  }
);

ariaTest(
  'role="tabpanel" on div element',
  exampleFile,
  'tabpanel-role',
  async (t) => {
    t.plan(1);
    await assertAriaRoles(t, 'ex1', 'tabpanel', ex.tabCount, 'div');
  }
);

ariaTest(
  '"aria-label" attribute on role="tabpanel" elements',
  exampleFile,
  'tabpanel-aria-label',
  async (t) => {
    t.plan(1);
    await assertAriaLabelExists(t, ex.tabSelector);
  }
);

ariaTest(
  'aria-roledescription="slide" on role="tabpanel" elements',
  exampleFile,
  'tabpanel-roledescription',
  async (t) => {
    t.plan(1);
    await assertAttributeValues(
      t,
      ex.tabpanelSelector,
      'aria-roledescription',
      'slide'
    );
  }
);

ariaTest(
  'section has aria-roledescription set to carousel',
  exampleFile,
  'carousel-region-aria-roledescription',
  async (t) => {
    t.plan(1);

    // check the aria-roledescription set to carousel
    await assertAttributeValues(
      t,
      ex.landmarkSelector,
      'aria-roledescription',
      'carousel'
    );
  }
);

ariaTest(
  'section has aria-label',
  exampleFile,
  'carousel-region-aria-label',
  async (t) => {
    t.plan(1);

    await assertAriaLabelExists(t, ex.landmarkSelector);
  }
);

ariaTest(
  'slide container have aria-live initially set to off',
  exampleFile,
  'carousel-aria-live',
  async (t) => {
    t.plan(4);

    // On page load, `aria-level` is `off`
    await assertAttributeValues(
      t,
      ex.slideContainerSelector,
      'aria-live',
      'off'
    );

    // Focus on the widget, and aria-selected should change to 'polite'
    await t.context.session
      .findElement(By.css(ex.tabSelectedSelector))
      .sendKeys(Key.ENTER);

    await assertAttributeValues(
      t,
      ex.slideContainerSelector,
      'aria-live',
      'polite'
    );

    // Move focus to pause-start button start rotation, and the aria-live should change to 'polite' again
    await t.context.session
      .findElement(By.css(ex.pausePlayButtonSelector))
      .click();
    await assertAttributeValues(
      t,
      ex.slideContainerSelector,
      'aria-live',
      'polite'
    );

    // Click the pause button, and the aria-selected should change to 'off' again
    await t.context.session
      .findElement(By.css(ex.pausePlayButtonSelector))
      .click();
    await assertAttributeValues(
      t,
      ex.slideContainerSelector,
      'aria-live',
      'off'
    );
  }
);

// Keys

ariaTest(
  'TAB key moves focus to open tab and panel',
  exampleFile,
  'key-tab',
  async (t) => {
    t.plan(ex.tabCount);

    for (let index = 0; index < ex.tabCount; index++) {
      await openTabAtIndex(t, index);

      await assertTabOrder(t, ex.tabTabOrder[index]);
    }
  }
);

ariaTest(
  'ARROW_RIGHT key moves focus and activates tab',
  exampleFile,
  'key-right-arrow',
  async (t) => {
    t.plan(3 * ex.tabCount);

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

      t.true(
        await waitAndCheckAriaSelected(t, index + 1),
        'right arrow on tab "' +
          index +
          '" should set aria-selected="true" on next tab.'
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
      'right arrow on tab "' +
        (tabs.length - 1) +
        '" should put focus to first tab.'
    );
    t.true(
      await waitAndCheckAriaSelected(t, 0),
      'right arrow on tab "' +
        (tabs.length - 1) +
        '" should set aria-selected="true" on first tab.'
    );
    t.true(
      await tabpanels[0].isDisplayed(),
      'right arrow on tab "' +
        (tabs.length - 1) +
        '" should display the first panel.'
    );
  }
);

ariaTest(
  'ARROW_LEFT key moves focus and activates tab',
  exampleFile,
  'key-left-arrow',
  async (t) => {
    t.plan(3 * ex.tabCount);

    const tabs = await t.context.queryElements(t, ex.tabSelector);
    const tabpanels = await t.context.queryElements(t, ex.tabpanelSelector);

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
        'left arrow on tab "' +
          index +
          '" should put focus on the previous tab.'
      );
      t.true(
        await waitAndCheckAriaSelected(t, index - 1),
        'left arrow on tab "' +
          index +
          '" should set aria-selected="true" on previous tab.'
      );
      t.true(
        await tabpanels[index - 1].isDisplayed(),
        'left arrow on tab "' +
          index +
          '" should display the next previous panel.'
      );
    }
  }
);

ariaTest(
  'HOME key moves focus and selects tab',
  exampleFile,
  'key-home',
  async (t) => {
    t.plan(3 * ex.tabCount);

    const tabs = await t.context.queryElements(t, ex.tabSelector);
    const tabpanels = await t.context.queryElements(t, ex.tabpanelSelector);
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
        'home key on tab "' +
          index +
          '" should set aria-selected="true" on the first tab.'
      );
      t.true(
        await tabpanels[0].isDisplayed(),
        'home key on tab "' + index + '" should display the first tab.'
      );
    }
  }
);

ariaTest(
  'END key moves focus and selects tab',
  exampleFile,
  'key-end',
  async (t) => {
    t.plan(3 * ex.tabCount);

    const tabs = await t.context.queryElements(t, ex.tabSelector);
    const tabpanels = await t.context.queryElements(t, ex.tabpanelSelector);
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
        'home key on tab "' +
          index +
          '" should set aria-selected="true" on the last tab.'
      );
      t.true(
        await tabpanels[tabs.length - 1].isDisplayed(),
        'home key on tab "' + index + '" should display the last tab.'
      );
    }
  }
);

// Keyboard interaction

ariaTest(
  'TAB moves key through buttons',
  exampleFile,
  'rotation-key-tab',
  async (t) => {
    t.plan(1);

    await assertTabOrder(t, ex.allFocusableItems);
  }
);

ariaTest(
  'ENTER pause and start carousel motion',
  exampleFile,
  'rotation-enter-or-space-toggle',
  async (t) => {
    t.plan(2);

    let activeElement = await t.context.session
      .findElement(By.css(ex.activeCarouselItem))
      .getAttribute('aria-label');

    await t.context.session
      .findElement(By.css(ex.pausePlayButtonSelector))
      .sendKeys(Key.ENTER);
    // Move focus from widget
    await t.context.session
      .findElement(By.css(ex.pausePlayButtonSelector))
      .sendKeys(Key.chord(Key.SHIFT, Key.TAB));

    let compareWithNextElement = await t.context.session.wait(
      async function () {
        let newActiveElement = await t.context.session
          .findElement(By.css(ex.activeCarouselItem))
          .getAttribute('aria-label');
        return activeElement === newActiveElement;
      },
      t.context.WaitTime
    );

    t.true(
      compareWithNextElement,
      'The active elements should stay the same when the pause button has been sent ENTER'
    );

    await t.context.session
      .findElement(By.css(ex.pausePlayButtonSelector))
      .sendKeys(Key.ENTER);

    compareWithNextElement = await t.context.session.wait(async function () {
      let newActiveElement = await t.context.session
        .findElement(By.css(ex.activeCarouselItem))
        .getAttribute('aria-label');
      return activeElement !== newActiveElement;
    }, t.context.WaitTime);

    t.true(
      compareWithNextElement,
      'The active elements should change when the play button has been sent ENTER'
    );
  }
);

ariaTest(
  'SPACE pause and start carousel motion',
  exampleFile,
  'rotation-enter-or-space-toggle',
  async (t) => {
    t.plan(2);

    let activeElement = await t.context.session
      .findElement(By.css(ex.activeCarouselItem))
      .getAttribute('aria-label');

    await t.context.session
      .findElement(By.css(ex.pausePlayButtonSelector))
      .sendKeys(Key.SPACE);
    // Move focus from widget
    await t.context.session
      .findElement(By.css(ex.pausePlayButtonSelector))
      .sendKeys(Key.chord(Key.SHIFT, Key.TAB));

    let compareWithNextElement = await t.context.session.wait(
      async function () {
        let newActiveElement = await t.context.session
          .findElement(By.css(ex.activeCarouselItem))
          .getAttribute('aria-label');
        return activeElement === newActiveElement;
      },
      t.context.WaitTime
    );

    t.true(
      compareWithNextElement,
      'The active elements should stay the same when the pause button has been sent SPACE'
    );

    await t.context.session
      .findElement(By.css(ex.pausePlayButtonSelector))
      .sendKeys(Key.SPACE);

    compareWithNextElement = await t.context.session.wait(async function () {
      let newActiveElement = await t.context.session
        .findElement(By.css(ex.activeCarouselItem))
        .getAttribute('aria-label');
      return activeElement !== newActiveElement;
    }, t.context.WaitTime);

    t.true(
      compareWithNextElement,
      'The active elements should change when the play button has been sent SPACE'
    );
  }
);
