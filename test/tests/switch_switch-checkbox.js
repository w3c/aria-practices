const { ariaTest } = require('..');
const { By, Key } = require('selenium-webdriver');
const assertAriaLabelledby = require('../util/assertAriaLabelledby');
const assertAriaRoles = require('../util/assertAriaRoles');
const assertTabOrder = require('../util/assertTabOrder');
const assertInputChecked = require('../util/assertInputChecked');

const exampleFile = 'switch/switch-checkbox.html';

const ex = {
  groupSelector: '#ex1 [role="group"]',
  switchSelector: '#ex1 [role="switch"]',
  switches: ['#id-switch-1', '#id-switch-2'],
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
    await assertAriaRoles(t, 'ex1', 'switch', '2', 'input');
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
  'key SPACE ets or unsets switch',
  exampleFile,
  'key-space-enter',
  async (t) => {
    for (let switchSelector of ex.switches) {
      // Send SPACE key to check box to select
      await t.context.session
        .findElement(By.css(switchSelector))
        .sendKeys(Key.SPACE);
      await assertInputChecked(t, switchSelector, true);

      // Send SPACE key to check box to unselect
      await t.context.session
        .findElement(By.css(switchSelector))
        .sendKeys(Key.SPACE);
      await assertInputChecked(t, switchSelector, false);
    }
  }
);

ariaTest(
  'key Enter sets or unsets switch',
  exampleFile,
  'key-space-enter',
  async (t) => {
    for (let switchSelector of ex.switches) {
      // Send Enter key to check box to select
      await t.context.session
        .findElement(By.css(switchSelector))
        .sendKeys(Key.ENTER);
      await assertInputChecked(t, switchSelector, true);

      // Send Enter key to check box to unselect
      await t.context.session
        .findElement(By.css(switchSelector))
        .sendKeys(Key.ENTER);
      await assertInputChecked(t, switchSelector, false);
    }
  }
);
