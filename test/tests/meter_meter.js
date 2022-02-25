const { ariaTest } = require('..');
const { By } = require('selenium-webdriver');
const assertAriaLabelledby = require('../util/assertAriaLabelledby');
const assertAriaRoles = require('../util/assertAriaRoles');

const exampleFile = 'meter/meter.html';

const ex = {
  meterSelector: '#example [role="meter"]',
  fillSelector: '#example [role="meter"] > svg',
};

// Attributes
ariaTest(
  'role="meter" element exists',
  exampleFile,
  'meter-role',
  async (t) => {
    await assertAriaRoles(t, 'example', 'meter', '1', 'div');
  }
);

ariaTest(
  '"aria-labelledby" attribute',
  exampleFile,
  'meter-aria-labelledby',
  async (t) => {
    await assertAriaLabelledby(t, ex.meterSelector);
  }
);

ariaTest(
  '"aria-valuemin" attribute',
  exampleFile,
  'meter-aria-valuemin',
  async (t) => {
    const meter = await t.context.session.findElement(By.css(ex.meterSelector));
    const valuemin = await meter.getAttribute('aria-valuemin');

    t.is(typeof valuemin, 'string', 'aria-valuemin is present on the meter');
    t.false(isNaN(parseFloat(valuemin)), 'aria-valuemin is a number');
  }
);

ariaTest(
  '"aria-valuemax" attribute',
  exampleFile,
  'meter-aria-valuemax',
  async (t) => {
    const meter = await t.context.session.findElement(By.css(ex.meterSelector));
    const [valuemax, valuemin] = await Promise.all([
      meter.getAttribute('aria-valuemax'),
      meter.getAttribute('aria-valuemin'),
    ]);

    t.is(typeof valuemax, 'string', 'aria-valuemax is present on the meter');
    t.false(isNaN(parseFloat(valuemax)), 'aria-valuemax is a number');
    t.true(
      parseFloat(valuemax) >= parseFloat(valuemin),
      'max value is greater than min value'
    );
  }
);

ariaTest(
  '"aria-valuenow" attribute',
  exampleFile,
  'meter-aria-valuenow',
  async (t) => {
    const meter = await t.context.session.findElement(By.css(ex.meterSelector));
    const [valuenow, valuemax, valuemin] = await Promise.all([
      meter.getAttribute('aria-valuenow'),
      meter.getAttribute('aria-valuemax'),
      meter.getAttribute('aria-valuemin'),
    ]);

    t.is(typeof valuenow, 'string', 'aria-valuenow is present on the meter');
    t.false(isNaN(parseFloat(valuenow)), 'aria-valuenow is a number');
    t.true(
      parseFloat(valuenow) >= parseFloat(valuemin),
      'current value is greater than min value'
    );
    t.true(
      parseFloat(valuenow) <= parseFloat(valuemax),
      'current value is less than max value'
    );
  }
);

ariaTest(
  'fill matches current value',
  exampleFile,
  'meter-aria-valuenow',
  async (t) => {
    const meter = await t.context.session.findElement(By.css(ex.meterSelector));
    const fill = await t.context.session.findElement(By.css(ex.fillSelector));
    const [valuenow, valuemax, valuemin] = await Promise.all([
      meter.getAttribute('aria-valuenow'),
      meter.getAttribute('aria-valuemax'),
      meter.getAttribute('aria-valuemin'),
    ]);

    const currentPercent = (valuenow - valuemin) / (valuemax - valuemin);
    const [fillSize, meterSize] = await Promise.all([
      fill.getRect(),
      meter.getRect(),
    ]);

    // fudging a little here, since meter has 8px total border + padding
    // would be better in a unit test eventually
    const expectedFillWidth = (meterSize.width - 8) * currentPercent;
    t.true(
      Math.abs(expectedFillWidth - fillSize.width) < 10,
      'Fill width is the correct percent of meter, +/- 10px'
    );
  }
);
