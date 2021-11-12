const { ariaTest } = require('..');
const { By, Key } = require('selenium-webdriver');
const assertAttributeValues = require('../util/assertAttributeValues');
const assertAriaRoles = require('../util/assertAriaRoles');

const exampleFile = 'switch/switch.html';

const ex = {
  switchSelector: '#ex1 [role="switch"]',
  spanOnSelector: '#ex1 span.on',
  spanOffSelector: '#ex1 span.off',
};

const waitAndCheckAriaChecked = async function (t, selector, value) {
  return t.context.session
    .wait(
      async function () {
        let s = await t.context.session.findElement(By.css(selector));
        return (await s.getAttribute('aria-checked')) === value;
      },
      t.context.waitTime,
      'Timeout: aria-checked is not set to "' + value + '" for: ' + selector
    )
    .catch((err) => {
      return err;
    });
};

// Attributes

ariaTest(
  'role="switch" elements exist',
  exampleFile,
  'switch-role',
  async (t) => {
    await assertAriaRoles(t, 'ex1', 'switch', '1', 'div');

    // Test that each switch has an accessible name
    // In this case, the accessible name is the text within the div
    let switches = await t.context.queryElements(t, ex.switchSelector);

    for (let index = 0; index < switches.length; index++) {
      let text = await switches[index].getText();
      t.true(
        typeof text === 'string' && text.length > 0,
        'switch div at index: ' +
          index +
          ' should have contain text describing the switch'
      );
    }
  }
);

ariaTest(
  '"aria-hidden" set to "true" on SPAN elements containing "on" and "off" ',
  exampleFile,
  'aria-hidden',
  async (t) => {
    await assertAttributeValues(t, ex.spanOnSelector, 'aria-hidden', 'true');
    await assertAttributeValues(t, ex.spanOffSelector, 'aria-hidden', 'true');
  }
);

ariaTest(
  'tabindex="0" for switch elements',
  exampleFile,
  'switch-tabindex',
  async (t) => {
    await assertAttributeValues(t, ex.switchSelector, 'tabindex', '0');
  }
);

ariaTest(
  '"aria-checked" on switch element',
  exampleFile,
  'switch-aria-checked',
  async (t) => {
    // check the aria-checked attribute is false to begin
    await assertAttributeValues(t, ex.switchSelector, 'aria-checked', 'false');

    // Click all switches to select them
    let switches = await t.context.queryElements(t, ex.switchSelector);
    for (let s of switches) {
      await s.click();
    }

    // check the aria-checked attribute has been updated to true
    await assertAttributeValues(t, ex.switchSelector, 'aria-checked', 'true');
  }
);

ariaTest(
  'key SPACE turns switch on and off',
  exampleFile,
  'key-space',
  async (t) => {
    // Send SPACE key to check box to select
    await t.context.session
      .findElement(By.css(ex.switchSelector))
      .sendKeys(' ');

    t.true(
      await waitAndCheckAriaChecked(t, ex.switchSelector, 'true'),
      'aria-selected should be set after sending SPACE key to switch: ' +
        ex.switchSelector
    );

    // Send SPACE key to check box to unselect
    await t.context.session
      .findElement(By.css(ex.switchSelector))
      .sendKeys(' ');

    t.true(
      await waitAndCheckAriaChecked(t, ex.switchSelector, 'false'),
      'aria-selected should be set after sending SPACE key to switch: ' +
        ex.switchSelector
    );
  }
);

ariaTest(
  'key Enter turns switch on and off',
  exampleFile,
  'key-space',
  async (t) => {
    // Send Enter key to check box to select
    await t.context.session
      .findElement(By.css(ex.switchSelector))
      .sendKeys(Key.ENTER);

    t.true(
      await waitAndCheckAriaChecked(t, ex.switchSelector, 'true'),
      'aria-selected should be set after sending SPACE key to switch: ' +
        ex.switchSelector
    );

    // Send Enter key to check box to unselect
    await t.context.session
      .findElement(By.css(ex.switchSelector))
      .sendKeys(Key.ENTER);

    t.true(
      await waitAndCheckAriaChecked(t, ex.switchSelector, 'false'),
      'aria-selected should be set after sending SPACE key to switch: ' +
        ex.switchSelector
    );
  }
);
