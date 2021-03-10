const { ariaTest } = require('..');
const { By, Key } = require('selenium-webdriver');
const assertAriaControls = require('../util/assertAriaControls');
const assertAttributeValues = require('../util/assertAttributeValues');

const exampleFile = 'disclosure/disclosure-image-description.html';

const ex = {
  buttonSelector: '#ex1 button',
  descriptionSelector: '#ex1 #id_long_desc',
};

// Attributes

ariaTest(
  '"aria-controls" attribute on button',
  exampleFile,
  'aria-controls',
  async (t) => {
    await assertAriaControls(t, ex.buttonSelector);
  }
);

ariaTest(
  '"aria-expanded" attribute on button',
  exampleFile,
  'aria-expanded',
  async (t) => {
    await assertAttributeValues(t, ex.buttonSelector, 'aria-expanded', 'false');

    let description = await t.context.session.findElement(
      By.css(ex.buttonSelector)
    );
    t.true(
      await description.isDisplayed(),
      'Description should not be displayed if button has aria-expanded="false"'
    );

    let button = await t.context.session.findElement(By.css(ex.buttonSelector));
    await button.click();

    await assertAttributeValues(t, ex.buttonSelector, 'aria-expanded', 'true');
    t.true(
      await description.isDisplayed(),
      'Description should be displayed if button has aria-expanded="true"'
    );
  }
);

// Keys

ariaTest(
  'TAB should move focus to button',
  exampleFile,
  'key-tab',
  async (t) => {
    // Send SHIFT+TAB to button
    await await t.context.session
      .findElement(By.css(ex.buttonSelector))
      .sendKeys(Key.chord(Key.SHIFT, Key.TAB));

    // Find the element that is in focus
    const previousElement = await t.context.session.executeScript(() => {
      return document.activeElement;
    });

    // Send that element TAB
    await previousElement.sendKeys(Key.TAB);

    // Confirm focus is on the button
    const focusIsOnButton = await t.context.session.executeScript(function () {
      const selector = arguments[0];
      const items = document.querySelector(selector);
      return items === document.activeElement;
    }, ex.buttonSelector);

    t.true(
      focusIsOnButton,
      'The disclosure button (' +
        ex.buttonSelector +
        ') should be reachable in tab sequence.'
    );
  }
);

ariaTest(
  'key ENTER expands details',
  exampleFile,
  'key-space-or-enter',
  async (t) => {
    const button = await t.context.session.findElement(
      By.css(ex.buttonSelector)
    );
    const description = await t.context.session.findElement(
      By.css(ex.descriptionSelector)
    );
    await button.sendKeys(Key.ENTER);

    t.is(
      await button.getAttribute('aria-expanded'),
      'true',
      'Button should have aria-expanded true after sending ENTER to "' +
        ex.buttonSelector +
        '"'
    );

    t.true(
      await description.isDisplayed(),
      'Description should be displayed after sending ENTER to button to "' +
        ex.buttonSelector +
        '"'
    );

    await button.sendKeys(Key.ENTER);

    t.is(
      await button.getAttribute('aria-expanded'),
      'false',
      'Button should have aria-expanded false after sending ENTER twice to "' +
        ex.buttonSelector +
        '"'
    );

    t.false(
      await description.isDisplayed(),
      'Description should not be displayed after sending ENTER twice to button to "' +
        ex.buttonSelector +
        '"'
    );
  }
);

ariaTest(
  'key SPACE expands details',
  exampleFile,
  'key-space-or-enter',
  async (t) => {
    let button = await t.context.session.findElement(By.css(ex.buttonSelector));
    let description = await t.context.session.findElement(
      By.css(ex.descriptionSelector)
    );
    await button.sendKeys(Key.SPACE);

    t.is(
      await button.getAttribute('aria-expanded'),
      'true',
      'Button should have aria-expanded true after sending SPACE to "' +
        ex.buttonSelector +
        '"'
    );

    t.true(
      await description.isDisplayed(),
      'Description should be displayed after sending SPACE to button to "' +
        ex.buttonSelector +
        '"'
    );

    await button.sendKeys(Key.SPACE);

    t.is(
      await button.getAttribute('aria-expanded'),
      'false',
      'Button should have aria-expanded false after sending SPACE twice to "' +
        ex.buttonSelector +
        '"'
    );

    t.false(
      await description.isDisplayed(),
      'Description should not be displayed after sending SPACE twice to button to "' +
        ex.buttonSelector +
        '"'
    );
  }
);
