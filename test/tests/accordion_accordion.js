const { ariaTest } = require('..');
const { By, Key } = require('selenium-webdriver');
const assertAriaControls = require('../util/assertAriaControls');

const exampleFile = 'accordion/accordion.html';

const ex = {
  buttonSelector: '#ex1 .accordion-trigger',
  panelSelector: '#ex1 .accordion-panel',
  buttonsInOrder: ['#accordion1id', '#accordion2id', '#accordion3id'],
  panelsInOrder: ['#sect1', '#sect2', '#sect3'],
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
  'TAB moves focus between buttons',
  exampleFile,
  'key-tab',
  async (t) => {
    // verify that all buttons are in the tab order
    let elementsInOrder = ex.buttonsInOrder;

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
  }
);

ariaTest(
  'SHIFT + TAB moves focus between buttons',
  exampleFile,
  'key-shift-tab',
  async (t) => {
    // verify that all buttons are in the tab order
    const elementsInOrder = ex.buttonsInOrder;

    // Send shift + tab to the last panel button
    const lastElement = elementsInOrder[elementsInOrder.length - 1];
    await t.context.session
      .findElement(By.css(lastElement))
      .sendKeys(Key.chord(Key.SHIFT, Key.TAB));

    // Confirm focus moves to second-to-last item
    let targetElement = elementsInOrder[elementsInOrder.length - 2];
    t.true(
      await focusMatchesElement(t, targetElement),
      'Focus should reach element: ' + targetElement
    );
  }
);
