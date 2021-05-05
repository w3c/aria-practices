const { ariaTest } = require('..');
const { By, Key } = require('selenium-webdriver');
const assertAttributeValues = require('../util/assertAttributeValues');
const assertAriaLabelledby = require('../util/assertAriaLabelledby');
const assertAriaRoles = require('../util/assertAriaRoles');

const exampleFile = 'slider/slider-seek.html';

const ex = {
  sliderSelector: '#ex1 [role="slider"]',
  railRects: '#ex1 rect.rail',
  seekSelector: '#id-seek',
  seekValueSelector: '#id-seek-slider .value',
  seekMax: '300',
  seekMin: '0',
  seekDefault: '90',
  seekDefaultValue: '1 Minute 30 Seconds of 5 Minutes',
  seekInc: 1,
  seekPageInc: 15,
};

const sendAllSlidersToEnd = async function (t) {
  const sliders = await t.context.queryElements(t, ex.sliderSelector);

  for (let slider of sliders) {
    await slider.sendKeys(Key.END);
  }
};

const getSeekValueAndText = function (v, change) {
  let minutesLabel = 'Minutes';
  let secondsLabel = 'Seconds';
  let valuetext = '';

  v = parseInt(v) + change;
  if (v > parseInt(ex.seekMax)) {
    v = parseInt(ex.seekMax);
  }
  if (v < parseInt(ex.seekMin)) {
    v = parseInt(ex.seekMin);
  }
  const value = v.toString();

  let minutes = parseInt(v / 60);
  let seconds = v % 60;

  if (minutes === 1) {
    minutesLabel = 'Minute';
  }

  if (minutes > 0) {
    valuetext += minutes + ' ' + minutesLabel;
  }

  if (seconds === 1) {
    secondsLabel = 'Second';
  }

  if (seconds > 0) {
    if (minutes > 0) {
      valuetext += ' ';
    }
    valuetext += seconds + ' ' + secondsLabel;
  }

  if (minutes === 0 && seconds === 0) {
    valuetext += '0 ' + secondsLabel;
  }

  return [value, valuetext];
};

const getValueAndText = async function (t, selector) {
  const slider = await t.context.session.findElement(By.css(selector));
  const value = await slider.getAttribute('aria-valuenow');
  const text = await slider.getAttribute('aria-valuetext');
  return [value, text];
};

// Attributes

ariaTest('role="none" on SVG element', exampleFile, 'svg-none', async (t) => {
  await assertAriaRoles(t, 'ex1', 'none', '1', 'svg');
});

ariaTest(
  'SVG rects used for the rail have aria-hidden',
  exampleFile,
  'aria-hidden-rect',
  async (t) => {
    await assertAttributeValues(t, ex.railRects, 'aria-hidden', 'true');
  }
);

ariaTest(
  'role="slider" on SVG g element',
  exampleFile,
  'slider-role',
  async (t) => {
    await assertAriaRoles(t, 'ex1', 'slider', '1', 'g');
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
      ex.seekSelector,
      'aria-valuemax',
      ex.seekMax
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
      ex.seekSelector,
      'aria-valuemin',
      ex.seekMin
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
      ex.seekSelector,
      'aria-valuenow',
      ex.seekDefault
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
      ex.seekSelector,
      'aria-valuetext',
      ex.seekDefaultValue
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
    // Send 1 key to seek slider
    const seekSlider = await t.context.session.findElement(
      By.css(ex.seekSelector)
    );
    await seekSlider.sendKeys(Key.ARROW_RIGHT);

    let value, text;
    [value, text] = getSeekValueAndText(ex.seekDefault, 1);

    t.deepEqual(
      await getValueAndText(t, ex.seekSelector),
      [value, text],
      'After sending 1 arrow right key to the seek slider, aria-valuenow should be " + value + " and aria-value-text should be: ' +
        text
    );

    // Send more than 5 keys to seek slider
    for (let i = 0; i < 5; i++) {
      await seekSlider.sendKeys(Key.ARROW_RIGHT);
    }

    [value, text] = getSeekValueAndText(value, 5);

    t.deepEqual(
      await getValueAndText(t, ex.seekSelector),
      [value, text],
      'After sending 5 arrow right key to the seek slider, aria-valuenow should be "' +
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
    // Send 1 key to seek slider
    const seekSlider = await t.context.session.findElement(
      By.css(ex.seekSelector)
    );
    await seekSlider.sendKeys(Key.ARROW_UP);

    let value, text;
    [value, text] = getSeekValueAndText(ex.seekDefault, ex.seekInc);

    t.deepEqual(
      await getValueAndText(t, ex.seekSelector),
      [value, text],
      'After sending 1 arrow up key to the seek slider, aria-valuenow should be ' +
        value +
        ' and aria-value-text should be: ' +
        text
    );

    // Send more than 5 keys to seek slider
    for (let i = 0; i < 5; i++) {
      await seekSlider.sendKeys(Key.ARROW_UP);
    }

    [value, text] = getSeekValueAndText(value, 5 * ex.seekInc);

    t.deepEqual(
      await getValueAndText(t, ex.seekSelector),
      [value, text],
      'After sending 6 arrow up key to the seek slider, aria-valuenow should be "' +
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
    // Send 1 Page Up key to seek slider
    const seekSlider = await t.context.session.findElement(
      By.css(ex.seekSelector)
    );
    await seekSlider.sendKeys(Key.PAGE_UP);

    let value, text;
    [value, text] = getSeekValueAndText(ex.seekDefault, ex.seekPageInc);

    t.deepEqual(
      await getValueAndText(t, ex.seekSelector),
      [value, text],
      'After sending 1 page up key to the seek slider, aria-valuenow should be ' +
        value +
        ' and aria-value-text should be: ' +
        text
    );

    // Send 5 more page up keys to seek slider
    for (let i = 0; i < 5; i++) {
      await seekSlider.sendKeys(Key.PAGE_UP);
    }

    [value, text] = getSeekValueAndText(value, 5 * ex.seekPageInc);

    t.deepEqual(
      await getValueAndText(t, ex.seekSelector),
      [value, text],
      'After sending 6 arrow page up keys to the seek slider, aria-valuenow should be "' +
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
    // Send key end to seek slider
    const seekSlider = await t.context.session.findElement(
      By.css(ex.seekSelector)
    );
    await seekSlider.sendKeys(Key.END);

    let value, text;
    [value, text] = getSeekValueAndText(ex.seekMax, 0);

    t.deepEqual(
      await getValueAndText(t, ex.seekSelector),
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

    // Send 1 key to seek slider
    const seekSlider = await t.context.session.findElement(
      By.css(ex.seekSelector)
    );
    await seekSlider.sendKeys(Key.ARROW_LEFT);

    let value, text;
    [value, text] = getSeekValueAndText(ex.seekMax, -1 * ex.seekInc);

    t.deepEqual(
      await getValueAndText(t, ex.seekSelector),
      [value, text],
      'After sending 1 arrow left key to the seek slider, aria-valuenow should be "' +
        value +
        '" and aria-value-text should be: ' +
        text
    );

    // Send more than 5 keys to seek slider
    for (let i = 0; i < 5; i++) {
      await seekSlider.sendKeys(Key.ARROW_LEFT);
    }

    [value, text] = getSeekValueAndText(value, -5 * ex.seekInc);

    t.deepEqual(
      await getValueAndText(t, ex.seekSelector),
      [value, text],
      'After sending 6 arrow left key to the seek slider, aria-valuenow should be "' +
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

    // Send 1 key to seek slider
    const seekSlider = await t.context.session.findElement(
      By.css(ex.seekSelector)
    );
    await seekSlider.sendKeys(Key.ARROW_DOWN);

    let value, text;
    [value, text] = getSeekValueAndText(ex.seekMax, -1 * ex.seekInc);

    t.deepEqual(
      await getValueAndText(t, ex.seekSelector),
      [value, text],
      'After sending 1 down arrow key to the seek slider, aria-valuenow should be "' +
        value +
        '" and aria-value-text should be: ' +
        text
    );

    // Send more than 5 keys to seek slider
    for (let i = 0; i < 5; i++) {
      await seekSlider.sendKeys(Key.ARROW_DOWN);
    }

    [value, text] = getSeekValueAndText(value, -5 * ex.seekInc);

    t.deepEqual(
      await getValueAndText(t, ex.seekSelector),
      [value, text],
      'After sending 6 page arrow key to the seek slider, aria-valuenow should be "' +
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
    // Send 1 Page Down key to seek slider
    const seekSlider = await t.context.session.findElement(
      By.css(ex.seekSelector)
    );
    await seekSlider.sendKeys(Key.PAGE_DOWN);

    let value, text;
    [value, text] = getSeekValueAndText(ex.seekDefault, -1 * ex.seekPageInc);

    t.deepEqual(
      await getValueAndText(t, ex.seekSelector),
      [value, text],
      'After sending 1 page down key to the seek slider, aria-valuenow should be ' +
        value +
        ' and aria-value-text should be: ' +
        text
    );

    // Send 5 more page up keys to seek slider
    for (let i = 0; i < 5; i++) {
      await seekSlider.sendKeys(Key.PAGE_DOWN);
    }

    [value, text] = getSeekValueAndText(value, -5 * ex.seekPageInc);

    t.deepEqual(
      await getValueAndText(t, ex.seekSelector),
      [value, text],
      'After sending 6 arrow page down keys to the seek slider, aria-valuenow should be "' +
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
    // Send key home to seek slider
    const seekSlider = await t.context.session.findElement(
      By.css(ex.seekSelector)
    );
    await seekSlider.sendKeys(Key.HOME);

    let value, text;
    [value, text] = getSeekValueAndText(ex.seekMin, 0);

    t.deepEqual(
      await getValueAndText(t, ex.seekSelector),
      [value, text],
      'After sending key home to the heat slider, aria-valuenow should be "' +
        ex.seekMin +
        '" and aria-value-text should be: ' +
        text
    );
  }
);
