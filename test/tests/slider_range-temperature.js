const { ariaTest } = require('..');
const { Key } = require('selenium-webdriver');
const assertAttributeValues = require('../util/assertAttributeValues');

const exampleFile = 'slider/range-temperature.html';

const ex = {
  tempSelector: '#id-temp-range',
  tempMax: '38.0°C',
  tempMin: '10.0°C',
  tempDefault: '25.0°C',
};

// Attributes

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
      ex.tempDefault
    );
  }
);

// Keys

ariaTest(
  '"aria-valuetext" updated with changes in range value',
  exampleFile,
  'range-aria-valuetext',
  async (t) => {
    const temp = await t.context.queryElement(t, ex.tempSelector);

    await temp.sendKeys(Key.END);

    await assertAttributeValues(
      t,
      ex.tempSelector,
      'aria-valuetext',
      ex.tempMax
    );

    await temp.sendKeys(Key.HOME);

    await assertAttributeValues(
      t,
      ex.tempSelector,
      'aria-valuetext',
      ex.tempMin
    );
  }
);
