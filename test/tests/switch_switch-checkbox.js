const { ariaTest } = require('..');
const { By, Key } = require('selenium-webdriver');
const assertAriaRoles = require('../util/assertAriaRoles');
const assertTabOrder = require('../util/assertTabOrder');
const assertInputChecked = require('../util/assertInputChecked');

const exampleFile = 'switch/switch-checkbox.html';

const ex = {
  switchSelector: '#ex1 [role="switch"]',
  switches: [
    '#ex1 fieldset label:nth-child(2) input',
    '#ex1 fieldset label:nth-child(3) input',
  ],
};

// Attributes
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
  'key SPACE turns switch on and off',
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
  'key Enter turns switch on and off',
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
