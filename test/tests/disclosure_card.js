const { ariaTest } = require('..');
const { By, Key } = require('selenium-webdriver');
const assertAriaControls = require('../util/assertAriaControls');
const assertAttributeValues = require('../util/assertAttributeValues');
const assertTabOrder = require('../util/assertTabOrder');
const exampleFile = 'content/patterns/disclosure/examples/disclosure-card.html';

const ex = {
  buttonSelector: '#ex1 header button',
  detailSelector: '#ex1 .details',
  buttonSelectors: [
    '#ex1 ol li:nth-child(1) header button',
    '#ex1 ol li:nth-child(2) header button',
    '#ex1 ol li:nth-child(3) header button',
  ],
  detailsSelectors: [
    '#ex1 ol li:nth-child(1) .details',
    '#ex1 ol li:nth-child(2) .details',
    '#ex1 ol li:nth-child(3) .details',
  ],
  expandedFocusableItems: [
    '#ex1 ol li:nth-child(1) header button',
    '#ex1 ol li:nth-child(1) .details a',
    '#ex1 ol li:nth-child(1) .details input[type="checkbox"]',
    '#ex1 ol li:nth-child(1) .details button',
    '#ex1 ol li:nth-child(2) header button',
    '#ex1 ol li:nth-child(2) .details a',
    '#ex1 ol li:nth-child(2) .details input[type="checkbox"]',
    '#ex1 ol li:nth-child(2) .details button',
    '#ex1 ol li:nth-child(3) header button',
    '#ex1 ol li:nth-child(3) .details a',
    '#ex1 ol li:nth-child(3) .details input[type="checkbox"]',
    '#ex1 ol li:nth-child(3) .details button',
  ],
};

const waitAndCheckExpandedTrue = async function (t, selector) {
  return t.context.session.wait(
    async function () {
      const element = t.context.session.findElement(By.css(selector));
      return (await element.getAttribute('aria-expanded')) === 'true';
    },
    t.context.waitTime,
    'Timeout waiting for aria-expanded to change to true on element: ' +
      selector
  );
};

const waitAndCheckExpandedFalse = async function (t, selector) {
  return t.context.session.wait(
    async function () {
      const element = t.context.session.findElement(By.css(selector));
      return (await element.getAttribute('aria-expanded')) === 'false';
    },
    t.context.waitTime,
    'Timeout waiting for aria-expanded to change to false on element: ' +
      selector
  );
};

// Attributes

ariaTest(
  '"aria-controls" attribute on button',
  exampleFile,
  'button-aria-controls',
  async (t) => {
    await assertAriaControls(t, ex.buttonSelector);
  }
);

ariaTest(
  '"aria-expanded" attribute on button',
  exampleFile,
  'button-aria-expanded',
  async (t) => {
    await assertAttributeValues(t, ex.buttonSelector, 'aria-expanded', 'false');

    let details = await t.context.queryElements(t, ex.detailSelector);
    for (let detail of details) {
      t.true(
        (await detail.getAttribute('inert')) === 'true',
        'All details containers should be inert before clicking the Details buttons'
      );
    }

    let buttons = await t.context.queryElements(t, ex.buttonSelector);
    for (let button of buttons) {
      await button.click();
    }

    for (let detail of details) {
      t.false(
        (await detail.getAttribute('inert')) === 'true',
        'All details containers should not be inert after clicking the Details buttons'
      );
    }

    await assertAttributeValues(t, ex.buttonSelector, 'aria-expanded', 'true');
  }
);

// Keys

ariaTest('TAB should move focus', exampleFile, 'key-tab', async (t) => {
  await assertTabOrder(t, ex.buttonSelectors);

  let buttons = await t.context.queryElements(t, ex.buttonSelector);
  for (let button of buttons) {
    await button.click();
  }

  await assertTabOrder(t, ex.expandedFocusableItems);
});

ariaTest(
  'key ENTER expands details',
  exampleFile,
  'key-enter-or-space',
  async (t) => {
    for (let index = 0; index < ex.buttonSelectors.length; index++) {
      let buttonSelector = ex.buttonSelectors[index];
      let detailSelector = ex.detailsSelectors[index];
      let button = await t.context.session.findElement(By.css(buttonSelector));

      await button.sendKeys(Key.ENTER);

      t.true(
        await waitAndCheckExpandedTrue(t, buttonSelector),
        'Details button should have aria-expanded true after sending ENTER: ' +
          buttonSelector
      );

      t.false(
        (await t.context.session
          .findElement(By.css(detailSelector))
          .getAttribute('inert')) === 'true',
        `\`${detailSelector}\` should not be inert after sending ENTER to \`${buttonSelector}\``
      );

      await button.sendKeys(Key.ENTER);

      t.true(
        await waitAndCheckExpandedFalse(t, buttonSelector),
        'Details button should have aria-expanded false after sending ENTER twice: ' +
          buttonSelector
      );

      t.true(
        (await t.context.session
          .findElement(By.css(detailSelector))
          .getAttribute('inert')) === 'true',
        `\`${detailSelector}\` should be inert after sending ENTER to \`${buttonSelector}\``
      );
    }
  }
);

ariaTest(
  'key SPACE expands details',
  exampleFile,
  'key-enter-or-space',
  async (t) => {
    for (let index = 0; index < ex.buttonSelectors.length; index++) {
      let buttonSelector = ex.buttonSelectors[index];
      let detailSelector = ex.detailsSelectors[index];
      let button = await t.context.session.findElement(By.css(buttonSelector));

      await button.sendKeys(Key.SPACE);

      t.true(
        await waitAndCheckExpandedTrue(t, buttonSelector),
        'Details button should have aria-expanded true after sending SPACE: ' +
          buttonSelector
      );

      t.false(
        (await t.context.session
          .findElement(By.css(detailSelector))
          .getAttribute('inert')) === 'true',
        `\`${detailSelector}\` should not be inert after sending SPACE to \`${buttonSelector}\``
      );

      await button.sendKeys(Key.SPACE);

      t.true(
        await waitAndCheckExpandedFalse(t, buttonSelector),
        'Details button should have aria-expanded false after sending SPACE twice: ' +
          buttonSelector
      );

      t.true(
        (await t.context.session
          .findElement(By.css(detailSelector))
          .getAttribute('inert')) === 'true',
        `\`${detailSelector}\` should be inert after sending SPACE to \`${buttonSelector}\``
      );
    }
  }
);
