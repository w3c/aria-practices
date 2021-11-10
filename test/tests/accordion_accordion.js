const { ariaTest } = require('..');
const { By, Key } = require('selenium-webdriver');
const assertAriaControls = require('../util/assertAriaControls');
const assertAriaLabelledby = require('../util/assertAriaLabelledby');

const exampleFile = 'accordion/accordion.html';

const ex = {
  buttonSelector: '#ex1 button',
  panelSelector: '#ex1 [role="region"]',
  buttonsInOrder: ['#accordion1id', '#accordion2id', '#accordion3id'],
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
  'role "region" exists on accordion panels',
  exampleFile,
  'region-role',
  async (t) => {
    const buttons = await t.context.queryElements(t, ex.buttonSelector);
    const panelIds = [];
    for (let button of buttons) {
      panelIds.push(await button.getAttribute('aria-controls'));
    }

    for (let panelId of panelIds) {
      t.is(
        await t.context.session
          .findElement(By.id(panelId))
          .getAttribute('role'),
        'region',
        'Panel with id "' + panelId + '" should have role="region"'
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
  'ENTER key toggles section',
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

    // first panel starts open; enter should close
    await buttons[0].sendKeys(Key.ENTER);
    t.false(
      await panels[0].isDisplayed(),
      'Pressing enter on first button collapses the region'
    );
    t.is(
      await buttons[0].getAttribute('aria-expanded'),
      'false',
      `Pressing enter on first button sets aria-expanded to "false".`
    );
  }
);

ariaTest(
  'SPACE key expands section',
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

    // first panel starts open; space should close
    await buttons[0].sendKeys(Key.SPACE);
    t.false(
      await panels[0].isDisplayed(),
      'Pressing space on first button collapses the region'
    );
    t.is(
      await buttons[0].getAttribute('aria-expanded'),
      'false',
      `Pressing space on first button sets aria-expanded to "false".`
    );
  }
);

ariaTest(
  'TAB moves focus between headers and displayed inputs',
  exampleFile,
  'key-tab',
  async (t) => {
    const buttons = await t.context.queryElements(t, ex.buttonSelector);

    // verify that open panel is in the tab order
    let elementsInOrder = [
      ex.buttonsInOrder[0],
      ...ex.firstPanelInputSelectors,
      ex.buttonsInOrder[1],
      ex.buttonsInOrder[2],
    ];

    // Send TAB to the first panel button
    let firstElement = elementsInOrder.shift();
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

    // Close the first panel, and verify that tab does not go through the closed panel
    await buttons[0].click();

    elementsInOrder = [
      ex.buttonsInOrder[0],
      ex.buttonsInOrder[1],
      ex.buttonsInOrder[2],
    ];

    // Send TAB to the first panel button
    firstElement = elementsInOrder.shift();
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
  'SHIFT+TAB moves focus between headers and displayed inputs',
  exampleFile,
  'key-shift-tab',
  async (t) => {
    const buttons = await t.context.queryElements(t, ex.buttonSelector);

    // Close first panel
    await buttons[0].click();

    let elementsInOrder = [
      ex.buttonsInOrder[0],
      ex.buttonsInOrder[1],
      ex.buttonsInOrder[2],
    ];

    // Send SHIFT-TAB to the last panel button
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

    // Open one panel
    await buttons[1].click();

    elementsInOrder = [
      ex.buttonsInOrder[0],
      ex.buttonsInOrder[1],
      ...ex.secondPanelInputSelectors,
      ex.buttonsInOrder[2],
    ];

    // Send TAB to the last panel button
    lastElement = elementsInOrder.pop();
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
