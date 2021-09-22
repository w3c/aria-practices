const { ariaTest } = require('..');
const { By, Key } = require('selenium-webdriver');
const assertAttributeValues = require('../util/assertAttributeValues');
const assertAriaLabelledby = require('../util/assertAriaLabelledby');
const assertAriaRoles = require('../util/assertAriaRoles');

const exampleFile = 'slider/slider-rating.html';

const ex = {
  sliderSelector: '#ex1 [role="slider"]',
  ratingSelector: '#id-rating',
  svgSelector: '#ex1 svg',
  ratingMax: '5',
  ratingMin: '0',
  ratingDefault: '0',
  ratingDefaultValue: 'zero of five stars',
  ratingInc: 0.5,
  ratingPageInc: 1,
};

const sendAllSlidersToEnd = async function (t) {
  const sliders = await t.context.queryElements(t, ex.sliderSelector);

  for (let slider of sliders) {
    await slider.sendKeys(Key.END);
  }
};

const getRatingValueAndText = function (v, change) {
  let value = parseFloat(v) + parseFloat(change);
  value = Math.min(Math.max(value, ex.ratingMin), ex.ratingMax);

  let valuetext = 'Unexpected value: ' + value;

  switch (value) {
    case 0:
      valuetext = 'zero stars';
      break;

    case 0.5:
      valuetext = 'one half star';
      break;

    case 1.0:
      valuetext = 'one star';
      break;

    case 1.5:
      valuetext = 'one and a half stars';
      break;

    case 2.0:
      valuetext = 'two stars';
      break;

    case 2.5:
      valuetext = 'two and a half stars';
      break;

    case 3.0:
      valuetext = 'three stars';
      break;

    case 3.5:
      valuetext = 'three and a half stars';
      break;

    case 4.0:
      valuetext = 'four stars';
      break;

    case 4.5:
      valuetext = 'four and a half stars';
      break;

    case 5.0:
      valuetext = 'five stars';
      break;

    default:
      break;
  }

  return [value.toString(), valuetext];
};

const getValueAndText = async function (t, selector) {
  const slider = await t.context.session.findElement(By.css(selector));
  const value = await slider.getAttribute('aria-valuenow');
  const text = await slider.getAttribute('aria-valuetext');
  return [value, text];
};

// Attributes

ariaTest(
  '"aria-hidden" set to "true" on SVG element',
  exampleFile,
  'svg-aria-hidden',
  async (t) => {
    await assertAttributeValues(t, ex.svgSelector, 'aria-hidden', 'true');
  }
);

ariaTest(
  'role="slider" on div element',
  exampleFile,
  'slider-role',
  async (t) => {
    await assertAriaRoles(t, 'ex1', 'slider', '1', 'div');
  }
);

ariaTest(
  '"tabindex" set to "0" on sliders',
  exampleFile,
  'slider-tabindex',
  async (t) => {
    await assertAttributeValues(t, ex.sliderSelector, 'tabindex', '0');
  }
);

ariaTest(
  '"aria-valuemax" set on sliders',
  exampleFile,
  'aria-valuemax',
  async (t) => {
    await assertAttributeValues(
      t,
      ex.ratingSelector,
      'aria-valuemax',
      ex.ratingMax
    );
  }
);

ariaTest(
  '"aria-valuemin" set on sliders',
  exampleFile,
  'aria-valuemin',
  async (t) => {
    await assertAttributeValues(
      t,
      ex.ratingSelector,
      'aria-valuemin',
      ex.ratingMin
    );
  }
);

ariaTest(
  '"aria-valuenow" reflects slider value',
  exampleFile,
  'aria-valuenow',
  async (t) => {
    await assertAttributeValues(
      t,
      ex.ratingSelector,
      'aria-valuenow',
      ex.ratingDefault
    );
  }
);

ariaTest(
  '"aria-valuetext" reflects slider value',
  exampleFile,
  'aria-valuetext',
  async (t) => {
    await assertAttributeValues(
      t,
      ex.ratingSelector,
      'aria-valuetext',
      ex.ratingDefaultValue
    );
  }
);

ariaTest(
  '"aria-labelledby" set on sliders',
  exampleFile,
  'aria-labelledby',
  async (t) => {
    await assertAriaLabelledby(t, ex.sliderSelector);
  }
);

// Keys

ariaTest(
  'Right arrow increases slider value by 1',
  exampleFile,
  'key-right-arrow',
  async (t) => {
    // Send 1 key to rating slider
    const ratingSlider = await t.context.session.findElement(
      By.css(ex.ratingSelector)
    );
    await ratingSlider.sendKeys(Key.ARROW_RIGHT);

    let value, text;
    [value, text] = getRatingValueAndText(ex.ratingDefault, ex.ratingInc);

    t.deepEqual(
      await getValueAndText(t, ex.ratingSelector),
      [value, text],
      'After sending 1 arrow right key to the rating slider, aria-valuenow should be " + value + " and aria-value-text should be: ' +
        text
    );

    // Send more than 5 keys to rating slider
    for (let i = 0; i < 5; i++) {
      await ratingSlider.sendKeys(Key.ARROW_RIGHT);
    }

    [value, text] = getRatingValueAndText(value, 5 * ex.ratingInc);

    t.deepEqual(
      await getValueAndText(t, ex.ratingSelector),
      [value, text],
      'After sending 5 arrow right key to the rating slider, aria-valuenow should be "' +
        value +
        '" and aria-value-text should be: ' +
        text
    );
  }
);

ariaTest(
  'up arrow increases slider value by 1',
  exampleFile,
  'key-up-arrow',
  async (t) => {
    // Send 1 key to rating slider
    const ratingSlider = await t.context.session.findElement(
      By.css(ex.ratingSelector)
    );
    await ratingSlider.sendKeys(Key.ARROW_UP);

    let value, text;
    [value, text] = getRatingValueAndText(ex.ratingDefault, ex.ratingInc);

    t.deepEqual(
      await getValueAndText(t, ex.ratingSelector),
      [value, text],
      'After sending 1 arrow up key to the rating slider, aria-valuenow should be ' +
        value +
        ' and aria-value-text should be: ' +
        text
    );

    // Send more than 5 keys to rating slider
    for (let i = 0; i < 5; i++) {
      await ratingSlider.sendKeys(Key.ARROW_UP);
    }

    [value, text] = getRatingValueAndText(value, 5 * ex.ratingInc);

    t.deepEqual(
      await getValueAndText(t, ex.ratingSelector),
      [value, text],
      'After sending 6 arrow up key to the rating slider, aria-valuenow should be "' +
        value +
        '" and aria-value-text should be: ' +
        text
    );
  }
);

ariaTest(
  'page up increases slider value by big step',
  exampleFile,
  'key-page-up',
  async (t) => {
    // Send 1 Page Up key to rating slider
    const ratingSlider = await t.context.session.findElement(
      By.css(ex.ratingSelector)
    );
    await ratingSlider.sendKeys(Key.PAGE_UP);

    let value, text;
    [value, text] = getRatingValueAndText(ex.ratingDefault, ex.ratingPageInc);

    t.deepEqual(
      await getValueAndText(t, ex.ratingSelector),
      [value, text],
      'After sending 1 page up key to the rating slider, aria-valuenow should be ' +
        value +
        ' and aria-value-text should be: ' +
        text
    );

    // Send 5 more page up keys to rating slider
    for (let i = 0; i < 5; i++) {
      await ratingSlider.sendKeys(Key.PAGE_UP);
    }

    [value, text] = getRatingValueAndText(value, 5 * ex.ratingPageInc);

    t.deepEqual(
      await getValueAndText(t, ex.ratingSelector),
      [value, text],
      'After sending 6 arrow page up keys to the rating slider, aria-valuenow should be "' +
        value +
        '" and aria-value-text should be: ' +
        text
    );
  }
);

ariaTest(
  'key end set slider at max value',
  exampleFile,
  'key-end',
  async (t) => {
    // Send key end to rating slider
    const ratingSlider = await t.context.session.findElement(
      By.css(ex.ratingSelector)
    );
    await ratingSlider.sendKeys(Key.END);

    let value, text;
    [value, text] = getRatingValueAndText(ex.ratingMax, 0);

    t.deepEqual(
      await getValueAndText(t, ex.ratingSelector),
      [value, text],
      'After sending key end to the heat slider, aria-valuenow should be "' +
        value +
        '" and aria-value-text should be: ' +
        text
    );
  }
);

ariaTest(
  'left arrow decreases slider value by 1',
  exampleFile,
  'key-left-arrow',
  async (t) => {
    await sendAllSlidersToEnd(t);

    // Send 1 key to rating slider
    const ratingSlider = await t.context.session.findElement(
      By.css(ex.ratingSelector)
    );
    await ratingSlider.sendKeys(Key.ARROW_LEFT);

    let value, text;
    [value, text] = getRatingValueAndText(ex.ratingMax, -1 * ex.ratingInc);

    t.deepEqual(
      await getValueAndText(t, ex.ratingSelector),
      [value, text],
      'After sending 1 arrow left key to the rating slider, aria-valuenow should be "' +
        value +
        '" and aria-value-text should be: ' +
        text
    );

    // Send more than 5 keys to rating slider
    for (let i = 0; i < 5; i++) {
      await ratingSlider.sendKeys(Key.ARROW_LEFT);
    }

    [value, text] = getRatingValueAndText(value, -5 * ex.ratingInc);

    t.deepEqual(
      await getValueAndText(t, ex.ratingSelector),
      [value, text],
      'After sending 6 arrow left key to the rating slider, aria-valuenow should be "' +
        value +
        '" and aria-value-text should be: ' +
        text
    );
  }
);

ariaTest(
  'down arrow decreases slider value by 1',
  exampleFile,
  'key-down-arrow',
  async (t) => {
    await sendAllSlidersToEnd(t);

    // Send 1 key to rating slider
    const ratingSlider = await t.context.session.findElement(
      By.css(ex.ratingSelector)
    );
    await ratingSlider.sendKeys(Key.ARROW_DOWN);

    let value, text;
    [value, text] = getRatingValueAndText(ex.ratingMax, -1 * ex.ratingInc);

    t.deepEqual(
      await getValueAndText(t, ex.ratingSelector),
      [value, text],
      'After sending 1 down arrow key to the rating slider, aria-valuenow should be "' +
        value +
        '" and aria-value-text should be: ' +
        text
    );

    // Send more than 5 keys to rating slider
    for (let i = 0; i < 5; i++) {
      await ratingSlider.sendKeys(Key.ARROW_DOWN);
    }

    [value, text] = getRatingValueAndText(value, -5 * ex.ratingInc);

    t.deepEqual(
      await getValueAndText(t, ex.ratingSelector),
      [value, text],
      'After sending 6 page arrow key to the rating slider, aria-valuenow should be "' +
        value +
        '" and aria-value-text should be: ' +
        text
    );
  }
);

ariaTest(
  'page down decreases slider value by big step',
  exampleFile,
  'key-page-down',
  async (t) => {
    // Send 1 Page Down key to rating slider
    const ratingSlider = await t.context.session.findElement(
      By.css(ex.ratingSelector)
    );
    await ratingSlider.sendKeys(Key.PAGE_DOWN);

    let value, text;
    [value, text] = getRatingValueAndText(
      ex.ratingDefault,
      -1 * ex.ratingPageInc
    );

    t.deepEqual(
      await getValueAndText(t, ex.ratingSelector),
      [value, text],
      'After sending 1 page down key to the rating slider, aria-valuenow should be ' +
        value +
        ' and aria-value-text should be: ' +
        text
    );

    // Send 5 more page up keys to rating slider
    for (let i = 0; i < 5; i++) {
      await ratingSlider.sendKeys(Key.PAGE_DOWN);
    }

    [value, text] = getRatingValueAndText(value, -5 * ex.ratingPageInc);

    t.deepEqual(
      await getValueAndText(t, ex.ratingSelector),
      [value, text],
      'After sending 6 arrow page down keys to the rating slider, aria-valuenow should be "' +
        value +
        '" and aria-value-text should be: ' +
        text
    );
  }
);

ariaTest(
  'home set slider value to minimum',
  exampleFile,
  'key-home',
  async (t) => {
    // Send key home to rating slider
    const ratingSlider = await t.context.session.findElement(
      By.css(ex.ratingSelector)
    );
    await ratingSlider.sendKeys(Key.HOME);

    let value, text;
    [value, text] = getRatingValueAndText(ex.ratingMin, 0);

    t.deepEqual(
      await getValueAndText(t, ex.ratingSelector),
      [value, text],
      'After sending key home to the heat slider, aria-valuenow should be "' +
        ex.ratingMin +
        '" and aria-value-text should be: ' +
        text
    );
  }
);
