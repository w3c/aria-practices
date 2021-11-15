const { ariaTest } = require('..');
const { By, Key } = require('selenium-webdriver');
const assertAttributeValues = require('../util/assertAttributeValues');
const assertAriaLabelledby = require('../util/assertAriaLabelledby');
const assertAriaRoles = require('../util/assertAriaRoles');
const assertTabOrder = require('../util/assertTabOrder');

const exampleFile = 'switch/switch-button.html';

const ex = {
  groupSelector: '#ex1 [role="group"]',
  switchSelector: '#ex1 [role="switch"]',
  switches: [
    '#ex1 [role="group"] [role="switch"]:nth-of-type(1)',
    '#ex1 [role="group"] [role="switch"]:nth-of-type(2)',
  ],
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

ariaTest('element h3 exists', exampleFile, 'h3', async (t) => {
  let header = await t.context.queryElements(t, '#ex1 h3');

  t.is(
    header.length,
    1,
    'One h3 element exist within the example to label the switches'
  );

  t.truthy(
    await header[0].getText(),
    'One h3 element exist with readable content within the example to label the switches'
  );
});

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
  'role="group" element exists',
  exampleFile,
  'group-role',
  async (t) => {
    await assertAriaRoles(t, 'ex1', 'group', '1', 'div');
  }
);

ariaTest(
  '"aria-labelledby" on group element',
  exampleFile,
  'group-aria-labelledby',
  async (t) => {
    await assertAriaLabelledby(t, ex.groupSelector);
  }
);

ariaTest(
  'role="switch" elements exist',
  exampleFile,
  'switch-role',
  async (t) => {
    await assertAriaRoles(t, 'ex1', 'switch', '2', 'button');

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
  'key TAB moves focus between switches',
  exampleFile,
  'key-tab',
  async (t) => {
    await assertTabOrder(t, ex.switches);
  }
);

ariaTest(
  'key SPACE turns switch on and off',
  exampleFile,
  'key-space',
  async (t) => {
    for (let switchSelector of ex.switches) {
      // Send SPACE key to check box to select
      await t.context.session.findElement(By.css(switchSelector)).sendKeys(' ');

      t.true(
        await waitAndCheckAriaChecked(t, switchSelector, 'true'),
        'aria-selected should be set after sending SPACE key to switch: ' +
          switchSelector
      );

      // Send SPACE key to check box to unselect
      await t.context.session.findElement(By.css(switchSelector)).sendKeys(' ');

      t.true(
        await waitAndCheckAriaChecked(t, switchSelector, 'false'),
        'aria-selected should be set after sending SPACE key to switch: ' +
          switchSelector
      );
    }
  }
);

ariaTest(
  'key Enter turns switch on and off',
  exampleFile,
  'key-space',
  async (t) => {
    for (let switchSelector of ex.switches) {
      // Send Enter key to check box to select
      await t.context.session
        .findElement(By.css(switchSelector))
        .sendKeys(Key.ENTER);

      t.true(
        await waitAndCheckAriaChecked(t, switchSelector, 'true'),
        'aria-selected should be set after sending ENTER key to switch: ' +
          switchSelector
      );

      // Send Enter key to check box to unselect
      await t.context.session
        .findElement(By.css(switchSelector))
        .sendKeys(Key.ENTER);

      t.true(
        await waitAndCheckAriaChecked(t, switchSelector, 'false'),
        'aria-selected should be set after sending ENTER key to switch: ' +
          switchSelector
      );
    }
  }
);
