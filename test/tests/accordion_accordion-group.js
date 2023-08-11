const { ariaTest } = require('..');
const { By, Key } = require('selenium-webdriver');
const assertAriaControls = require('../util/assertAriaControls');
const assertAriaLabelledby = require('../util/assertAriaLabelledby');

const exampleFile = 'accordion/accordion-group.html';

const ex = {
  buttonSelector: '#ex1 .accordion-trigger',
  panelSelector: '#ex1 .accordion-panel',
  buttonsInOrder: ['#accordion1id', '#accordion2id', '#accordion3id'],
  panelsInOrder: ['#sect1', '#sect2', '#sect3'],
  firstPanelInputSelectors: [
    '#cufc1',
    '#cufc2',
    '#cufc3',
    '#cufc4',
    '#cufc5',
    '#cufc6',
  ],
  secondPanelInputSelectors: [
    '#b-add1',
    '#b-add2',
    '#b-city',
    '#b-state',
    '#b-zip',
  ],
  thirdPanelInputSelectors: [
    '#m-add1',
    '#m-add2',
    '#m-city',
    '#m-state',
    '#m-zip',
  ],
};

const parentTagName = function (t, element) {
  return t.context.session.executeScript(async function () {
    const buttonEl = arguments[0];
    return buttonEl.parentElement.tagName;
  }, element);
};

const focusMatchesElement = async function (t, selector) {
  return t.context.session.wait(
    async function () {
      return t.context.session.executeScript(function () {
        selector = arguments[0];
        return document.activeElement === document.querySelector(selector);
      }, selector);
    },
    t.context.waitTime,
    'Timeout waiting for focus to land on element: ' + selector
  );
};

// Attributes

ariaTest(
  'h3 element should wrap accordion button',
  exampleFile,
  'h3-element',
  async (t) => {
    const buttons = await t.context.queryElements(t, ex.buttonSelector);

    for (let button of buttons) {
      t.is(
        await parentTagName(t, button),
        'H3',
        'Parent of button ' +
          (await button.getText()) +
          'should be an H3 element'
      );
    }
  }
);

ariaTest(
  'aria-expanded on button element',
  exampleFile,
  'button-aria-expanded',
  async (t) => {
    const buttons = await t.context.queryElements(t, ex.buttonSelector);

    for (let index = 0; index < buttons.length; index++) {
      // first accordion starts open
      const value = await buttons[index].getAttribute('aria-expanded');
      const expectedValue = index === 0 ? 'true' : 'false';

      t.is(
        value,
        expectedValue,
        `Accordion button ${index} should have aria-expanded="${expectedValue}"`
      );
    }
  }
);

ariaTest(
  'aria-controls on button element',
  exampleFile,
  'button-aria-controls',
  async (t) => {
    await assertAriaControls(t, ex.buttonSelector);
  }
);

ariaTest(
  '"aria-disabled" on button element',
  exampleFile,
  'button-aria-disabled',
  async (t) => {
    const openButton = await t.context.queryElement(t, ex.buttonsInOrder[0]);
    const closedButton = await t.context.queryElement(t, ex.buttonsInOrder[1]);

    // open button has aria-disabled="true"
    let disabledValue = await openButton.getAttribute('aria-disabled');
    t.is(
      disabledValue,
      'true',
      'Open accordion button should have aria-disabled="true"'
    );

    // closed button does not have aria-disabled
    disabledValue = await closedButton.getAttribute('aria-disabled');
    t.is(
      disabledValue,
      null,
      'Closed accordion button should not have aria-disabled defined'
    );
  }
);

ariaTest(
  'role "group" exists on accordion panels',
  exampleFile,
  'group-role',
  async (t) => {
    for (let panelId of ex.panelsInOrder) {
      const panelElement = await t.context.queryElement(t, panelId);
      t.is(
        await panelElement.getAttribute('role'),
        'group',
        'Panel with id "' + panelId + '" should have role="group"'
      );
    }
  }
);

ariaTest(
  '"aria-labelledby" on region',
  exampleFile,
  'region-aria-labelledby',
  async (t) => {
    await assertAriaLabelledby(t, ex.panelSelector);
  }
);

// Keys

ariaTest(
  'ENTER key opens closed sections',
  exampleFile,
  'key-enter-or-space',
  async (t) => {
    const buttons = await t.context.queryElements(t, ex.buttonSelector);
    const panels = await t.context.queryElements(t, ex.panelSelector);

    for (let expandIndex of [1, 2]) {
      await buttons[expandIndex].sendKeys(Key.ENTER);
      const panelDisplay = await panels[expandIndex].isDisplayed();
      const buttonAria = await buttons[expandIndex].getAttribute(
        'aria-expanded'
      );

      t.true(
        panelDisplay,
        `Pressing enter on button ${expandIndex} should expand the region.`
      );
      t.is(
        buttonAria,
        'true',
        `Pressing enter on button ${expandIndex} sets aria-expanded to "true".`
      );
    }
  }
);

ariaTest(
  'ENTER key should not close open section',
  exampleFile,
  'key-enter-or-space',
  async (t) => {
    const openButton = await t.context.queryElement(t, ex.buttonsInOrder[0]);
    const openPanel = await t.context.queryElement(t, ex.panelsInOrder[0]);

    // first panel starts open
    t.true(await openPanel.isDisplayed(), 'first panel starts open');
    t.is(
      await openButton.getAttribute('aria-expanded'),
      'true',
      'first button has aria-expanded="true"'
    );

    // enter should do nothing
    await openButton.sendKeys(Key.ENTER);
    t.true(
      await openPanel.isDisplayed(),
      'Pressing enter on first button does not toggle region'
    );
    t.is(
      await openButton.getAttribute('aria-expanded'),
      'true',
      'Pressing enter on first button does not change aria-expanded'
    );
  }
);

ariaTest(
  'SPACE key expands closed sections',
  exampleFile,
  'key-enter-or-space',
  async (t) => {
    const buttons = await t.context.queryElements(t, ex.buttonSelector);
    const panels = await t.context.queryElements(t, ex.panelSelector);

    for (let expandIndex of [1, 2]) {
      await buttons[expandIndex].sendKeys(Key.SPACE);
      const panelDisplay = await panels[expandIndex].isDisplayed();
      const buttonAria = await buttons[expandIndex].getAttribute(
        'aria-expanded'
      );

      t.true(
        panelDisplay,
        `Pressing space on button ${expandIndex} should expand the region.`
      );
      t.is(
        buttonAria,
        'true',
        `Pressing space on button ${expandIndex} sets aria-expanded to "true".`
      );
    }
  }
);

ariaTest(
  'SPACE key should not close open section',
  exampleFile,
  'key-enter-or-space',
  async (t) => {
    const openButton = await t.context.queryElement(t, ex.buttonsInOrder[0]);
    const openPanel = await t.context.queryElement(t, ex.panelsInOrder[0]);

    // first panel starts open
    t.true(await openPanel.isDisplayed(), 'first panel starts open');
    t.is(
      await openButton.getAttribute('aria-expanded'),
      'true',
      'first button has aria-expanded="true"'
    );

    // SPACE should do nothing
    await openButton.sendKeys(Key.SPACE);
    t.true(
      await openPanel.isDisplayed(),
      'Pressing SPACE on first button does not toggle region'
    );
    t.is(
      await openButton.getAttribute('aria-expanded'),
      'true',
      'Pressing SPACE on first button does not change aria-expanded'
    );
  }
);

ariaTest(
  'TAB moves focus through open panel and buttons',
  exampleFile,
  'key-tab',
  async (t) => {
    // verify that all buttons and open panel inputs are in the tab order
    const elementsInOrder = [
      ex.buttonsInOrder[0],
      ...ex.firstPanelInputSelectors,
      ex.buttonsInOrder[1],
      ex.buttonsInOrder[2],
    ];

    // Send TAB to the first panel button
    const firstElement = elementsInOrder.shift();
    await t.context.session.findElement(By.css(firstElement)).sendKeys(Key.TAB);

    // Confirm focus moves through remaining items
    for (let itemSelector of elementsInOrder) {
      t.true(
        await focusMatchesElement(t, itemSelector),
        'Focus should reach element: ' + itemSelector
      );
      await t.context.session
        .findElement(By.css(itemSelector))
        .sendKeys(Key.TAB);
    }
  }
);

ariaTest(
  'SHIFT + TAB moves focus through open panel and buttons',
  exampleFile,
  'key-shift-tab',
  async (t) => {
    // open the second panel to test shift + tab
    const secondButton = await t.context.queryElement(t, ex.buttonsInOrder[1]);
    await secondButton.sendKeys(Key.SPACE);

    // verify that all buttons are in the tab order
    const elementsInOrder = [
      ex.buttonsInOrder[0],
      ex.buttonsInOrder[1],
      ...ex.secondPanelInputSelectors,
      ex.buttonsInOrder[2],
    ];

    // Send shift + tab to the last panel button
    let lastElement = elementsInOrder.pop();
    await t.context.session
      .findElement(By.css(lastElement))
      .sendKeys(Key.chord(Key.SHIFT, Key.TAB));

    // Confirm focus moves through remaining items
    for (let index = elementsInOrder.length - 1; index >= 0; index--) {
      let itemSelector = elementsInOrder[index];
      t.true(
        await focusMatchesElement(t, itemSelector),
        'Focus should reach element: ' + itemSelector
      );
      await t.context.session
        .findElement(By.css(itemSelector))
        .sendKeys(Key.chord(Key.SHIFT, Key.TAB));
    }
  }
);
