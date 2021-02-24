const { ariaTest } = require('..');
const { Key } = require('selenium-webdriver');
const assertAttributeValues = require('../util/assertAttributeValues');
const assertAriaControls = require('../util/assertAriaControls');
const assertAriaLabelExists = require('../util/assertAriaLabelExists');
const assertAriaLabelledby = require('../util/assertAriaLabelledby');
const assertAriaRoles = require('../util/assertAriaRoles');

const exampleFile = 'slider/range-thermostat.html';

const ex = {
  rangeSelector: '#ex1 input[type="range"]',
  buttonSelector: '#ex1 button',
  groupSelector: '#ex1 [role="group"]',
  tempSelector: '#id-temp-range',
  fanRangeSelector: '#id-fan-input',
  fanButtonSelector: '#id-fan button',
  tempMax: '38.0',
  tempMin: '10.0',
  tempDefault: '25.0',
  tempInc: '.1',
  tempPageInc: '2.0',
  tempSuffix: '°C',
  fanMax: '3',
  fanMin: '0',
  fanValues: ['off', 'low', 'medium', 'high'],
};

// Attributes

ariaTest(
  'role="group" on DIV element',
  exampleFile,
  'group-role',
  async (t) => {
    await assertAriaRoles(t, 'ex1', 'group', '1', 'div');
  }
);

ariaTest(
  '"aria-labelledby" set on group',
  exampleFile,
  'group-aria-labelledby',
  async (t) => {
    await assertAriaLabelledby(t, ex.groupSelector);
  }
);

ariaTest(
  '"tabindex" set to "-1" on buttons',
  exampleFile,
  'button-tabindex',
  async (t) => {
    await assertAttributeValues(t, ex.buttonSelector, 'tabindex', '-1');
  }
);

ariaTest(
  '"aria-label" set on button',
  exampleFile,
  'button-aria-label',
  async (t) => {
    await assertAriaLabelExists(t, ex.buttonSelector);
  }
);

ariaTest(
  '"aria-controls" attribute of button',
  exampleFile,
  'button-aria-controls',
  async (t) => {
    await assertAriaControls(t, ex.buttonSelector);
  }
);

ariaTest(
  '"aria-orientation" set on ranges',
  exampleFile,
  'range-aria-orientation',
  async (t) => {
    await assertAttributeValues(
      t,
      ex.tempSelector,
      'aria-orientation',
      'vertical'
    );
  }
);

ariaTest(
  '"aria-valuetext" reflects range value',
  exampleFile,
  'range-aria-valuetext',
  async (t) => {
    await assertAttributeValues(
      t,
      ex.tempSelector,
      'aria-valuetext',
      ex.tempDefault + ex.tempSuffix
    );
    await assertAttributeValues(
      t,
      ex.fanRangeSelector,
      'aria-valuetext',
      ex.fanValues[0]
    );
  }
);

// Keys

ariaTest(
  '"aria-valuetext" updated with button click value',
  exampleFile,
  'range-aria-valuetext',
  async (t) => {
    let i;
    const range = await t.context.queryElement(t, ex.fanRangeSelector);
    const buttons = await t.context.queryElements(t, ex.fanButtonSelector);

    for (i = 0; i < buttons.length; i++) {
      const button = buttons[i];

      await button.click();

      const valuetext = await button.getAttribute('data-valuetext');

      await assertAttributeValues(
        t,
        ex.fanRangeSelector,
        'aria-valuetext',
        valuetext
      );
    }

    await range.sendKeys(Key.HOME);

    for (i = 0; i < buttons.length; i++) {
      const button = buttons[i];

      const valuetext = await button.getAttribute('data-valuetext');

      await assertAttributeValues(
        t,
        ex.fanRangeSelector,
        'aria-valuetext',
        valuetext
      );

      await range.sendKeys(Key.ARROW_RIGHT);
    }
  }
);
