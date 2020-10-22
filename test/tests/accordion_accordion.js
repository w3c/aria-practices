'use strict';

const { ariaTest } = require('..');
const { By, Key } = require('selenium-webdriver');
const assertAriaControls = require('../util/assertAriaControls');
const assertAriaLabelledby = require('../util/assertAriaLabelledby');

const exampleFile = 'accordion/accordion.html';

const ex = {
  buttonSelector: '#coding-arena button',
  panelSelector: '#coding-arena [role="region"]',
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

    for (let expandIndex = 0; expandIndex < buttons.length; expandIndex++) {
      // Click a heading to expand the section
      await buttons[expandIndex].click();

      for (let index = 0; index < buttons.length; index++) {
        const expandedValue = index === expandIndex ? 'true' : 'false';
        t.is(
          await buttons[index].getAttribute('aria-expanded'),
          expandedValue,
          'Accordion button at index ' +
            expandIndex +
            ' has been clicked, therefore ' +
            '"aria-expanded" on button ' +
            index +
            ' should be "' +
            expandedValue
        );
      }
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
  '"aria-disabled" set on expanded sections',
  exampleFile,
  'button-aria-disabled',
  async (t) => {
    const buttons = await t.context.queryElements(t, ex.buttonSelector);

    for (let expandIndex = 0; expandIndex < buttons.length; expandIndex++) {
      // Click a heading to expand the section
      await buttons[expandIndex].click();

      for (let index = 0; index < buttons.length; index++) {
        const disabledValue = index === expandIndex ? 'true' : null;
        t.is(
          await buttons[index].getAttribute('aria-disabled'),
          disabledValue,
          'Accordion button at index ' +
            expandIndex +
            ' has been clicked, therefore ' +
            '"aria-disabled" on button ' +
            index +
            ' should be "' +
            disabledValue
        );
      }
    }
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
  'ENTER key expands section',
  exampleFile,
  'key-enter-or-space',
  async (t) => {
    const buttons = await t.context.queryElements(t, ex.buttonSelector);
    const panels = await t.context.queryElements(t, ex.panelSelector);

    for (let expandIndex of [1, 2, 0]) {
      await buttons[expandIndex].sendKeys(Key.ENTER);

      t.true(
        await panels[expandIndex].isDisplayed(),
        'Sending key ENTER to button at index ' +
          expandIndex +
          ' should expand the region.'
      );

      t.is(
        await buttons[expandIndex].getAttribute('aria-expanded'),
        'true',
        'Sending key ENTER to button at index ' +
          expandIndex +
          ' set aria-expanded to "true".'
      );

      t.is(
        await buttons[expandIndex].getAttribute('aria-disabled'),
        'true',
        'Sending key ENTER to button at index ' +
          expandIndex +
          ' set aria-disable to "true".'
      );

      await buttons[expandIndex].sendKeys(Key.ENTER);

      t.true(
        await panels[expandIndex].isDisplayed(),
        'Sending key ENTER twice to button at index ' +
          expandIndex +
          ' do nothing.'
      );
    }
  }
);

ariaTest(
  'SPACE key expands section',
  exampleFile,
  'key-enter-or-space',
  async (t) => {
    const buttons = await t.context.queryElements(t, ex.buttonSelector);
    const panels = await t.context.queryElements(t, ex.panelSelector);

    for (let expandIndex of [1, 2, 0]) {
      await buttons[expandIndex].sendKeys(Key.SPACE);

      t.true(
        await panels[expandIndex].isDisplayed(),
        'Sending key SPACE to button at index ' +
          expandIndex +
          ' should expand the region.'
      );

      t.is(
        await buttons[expandIndex].getAttribute('aria-expanded'),
        'true',
        'Sending key SPACE to button at index ' +
          expandIndex +
          ' set aria-expanded to "true".'
      );

      t.is(
        await buttons[expandIndex].getAttribute('aria-disabled'),
        'true',
        'Sending key SPACE to button at index ' +
          expandIndex +
          ' set aria-disable to "true".'
      );

      await buttons[expandIndex].sendKeys(Key.SPACE);

      t.true(
        await panels[expandIndex].isDisplayed(),
        'Sending key SPACE twice to button at index ' +
          expandIndex +
          ' do nothing.'
      );
    }
  }
);

ariaTest(
  'TAB moves focus between headers and displayed inputs',
  exampleFile,
  'key-tab',
  async (t) => {
    const buttons = await t.context.queryElements(t, ex.buttonSelector);

    // Open a panel
    await buttons[0].click();

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

    // Open the next panel
    await buttons[1].click();

    elementsInOrder = [
      ex.buttonsInOrder[0],
      ex.buttonsInOrder[1],
      ...ex.secondPanelInputSelectors,
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

    // Open the next panel
    await buttons[2].click();

    elementsInOrder = [
      ex.buttonsInOrder[0],
      ex.buttonsInOrder[1],
      ex.buttonsInOrder[2],
      ...ex.thirdPanelInputSelectors,
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

    // Open a panel
    await buttons[0].click();

    let elementsInOrder = [
      ex.buttonsInOrder[0],
      ...ex.firstPanelInputSelectors,
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

    // Open the next panel
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

    // Open the next panel
    await buttons[2].click();

    elementsInOrder = [
      ex.buttonsInOrder[0],
      ex.buttonsInOrder[1],
      ex.buttonsInOrder[2],
      ...ex.thirdPanelInputSelectors,
    ];

    // Send TAB to the last focusable item
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

ariaTest(
  'DOWN ARROW moves focus between headers',
  exampleFile,
  'key-down-arrow',
  async (t) => {
    const buttons = await t.context.queryElements(t, ex.buttonSelector);

    // Confirm focus moves through remaining items
    for (let index = 0; index < ex.buttonsInOrder.length - 1; index++) {
      let itemSelector = ex.buttonsInOrder[index];
      await t.context.session
        .findElement(By.css(itemSelector))
        .sendKeys(Key.ARROW_DOWN);

      t.true(
        await focusMatchesElement(t, ex.buttonsInOrder[index + 1]),
        'Focus should reach element: ' + ex.buttonsInOrder[index + 1]
      );
    }

    // Focus should wrap to first item
    let itemSelector = ex.buttonsInOrder[ex.buttonsInOrder.length - 1];
    await t.context.session
      .findElement(By.css(itemSelector))
      .sendKeys(Key.ARROW_DOWN);

    t.true(
      await focusMatchesElement(t, ex.buttonsInOrder[0]),
      'Focus should reach element: ' + ex.buttonsInOrder[0]
    );
  }
);

ariaTest(
  'UP ARROW moves focus between headers',
  exampleFile,
  'key-up-arrow',
  async (t) => {
    const buttons = await t.context.queryElements(t, ex.buttonSelector);

    // Confirm focus moves through remaining items
    for (let index = ex.buttonsInOrder.length - 1; index > 0; index--) {
      let itemSelector = ex.buttonsInOrder[index];
      await t.context.session
        .findElement(By.css(itemSelector))
        .sendKeys(Key.ARROW_UP);

      t.true(
        await focusMatchesElement(t, ex.buttonsInOrder[index - 1]),
        'Focus should reach element: ' + ex.buttonsInOrder[index - 1]
      );
    }

    // Focus should wrap to last item
    let itemSelector = ex.buttonsInOrder[0];
    await t.context.session
      .findElement(By.css(itemSelector))
      .sendKeys(Key.ARROW_UP);

    t.true(
      await focusMatchesElement(
        t,
        ex.buttonsInOrder[ex.buttonsInOrder.length - 1]
      ),
      'Focus should reach element: ' +
        ex.buttonsInOrder[ex.buttonsInOrder.length - 1]
    );
  }
);

ariaTest(
  'HOME key will always move focus to first button',
  exampleFile,
  'key-home',
  async (t) => {
    const buttons = await t.context.queryElements(t, ex.buttonSelector);
    const lastIndex = ex.buttonsInOrder.length - 1;

    // Confirm focus moves through remaining items
    for (let index = 0; index <= lastIndex; index++) {
      let itemSelector = ex.buttonsInOrder[index];
      await t.context.session
        .findElement(By.css(itemSelector))
        .sendKeys(Key.HOME);

      t.true(
        await focusMatchesElement(t, ex.buttonsInOrder[0]),
        'Focus should reach element: ' + ex.buttonsInOrder[0]
      );
    }
  }
);

ariaTest(
  'END key will always move focus to last button',
  exampleFile,
  'key-end',
  async (t) => {
    const buttons = await t.context.queryElements(t, ex.buttonSelector);
    const lastIndex = ex.buttonsInOrder.length - 1;

    // Confirm focus moves through remaining items
    for (let index = lastIndex; index >= 0; index--) {
      let itemSelector = ex.buttonsInOrder[index];
      await t.context.session
        .findElement(By.css(itemSelector))
        .sendKeys(Key.END);

      t.true(
        await focusMatchesElement(t, ex.buttonsInOrder[lastIndex]),
        'Focus should reach element: ' + ex.buttonsInOrder[lastIndex]
      );
    }
  }
);
