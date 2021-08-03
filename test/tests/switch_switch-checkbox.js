const { ariaTest } = require('..');
const { By, Key } = require('selenium-webdriver');
const assertAriaRoles = require('../util/assertAriaRoles');
const assertAttributeValues = require('../util/assertAttributeValues');
const assertTabOrder = require('../util/assertTabOrder');
const assertInputChecked = require('../util/assertInputChecked');

const exampleFile = 'switch/switch-checkbox.html';

const ex = {
  switchSelector: '#ex1 [role="switch"]',
  spanOnSelector: '#ex1 span.on',
  spanOffSelector: '#ex1 span.off',
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
  '"aria-hidden" set to "true" on SPAN elements containing "on" and "off" ',
  exampleFile,
  'aria-hidden',
  async (t) => {
    await assertAttributeValues(t, ex.spanOnSelector, 'aria-hidden', 'true');
    await assertAttributeValues(t, ex.spanOffSelector, 'aria-hidden', 'true');
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
