const { ariaTest } = require('..');
const { By, Key } = require('selenium-webdriver');
const assertAttributeValues = require('../util/assertAttributeValues');
const assertAriaLabelledby = require('../util/assertAriaLabelledby');
const assertAriaRoles = require('../util/assertAriaRoles');

const exampleFile = 'slider/slider-valuetext.html';

const ex = {
  railRects: '#ex1 rect.rail',
  labelG: '#ex1 g.value-label',
  sliderSelector: '#ex1 [role="slider"]',
  tempSelector: '#id-temp-slider',
  tempValueSelector: '#id-temp-slider .value',
  tempMax: '38.0',
  tempMin: '10.0',
  tempDefault: '25.0',
  tempInc: '.1',
  tempPageInc: '2.0',
  tempSuffix: '°C',

  seekSelector: '#id-seek',
  seekValueSelector: '#id-seek-slider .value',
  seekMax: '300',
  seekMin: '0',
  seekDefault: '90',
  seekDefaultValue: '1 Minute 30 Seconds',
  seekInc: 1,
  seekPageInc: 10,
};

const sendAllSlidersToEnd = async function (t) {
  const sliders = await t.context.queryElements(t, ex.sliderSelector);

  for (let slider of sliders) {
    await slider.sendKeys(Key.END);
  }
};

const getValueAndText = async function (t, selector) {
  const slider = await t.context.session.findElement(By.css(selector));
  const value = await slider.getAttribute('aria-valuenow');
  const text = await slider.getAttribute('aria-valuetext');
  return [value, text];
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

  return [value, valuetext];
};

// Attributes

ariaTest('role="none" on SVG element', exampleFile, 'svg-none', async (t) => {
  await assertAriaRoles(t, 'ex1', 'none', '2', 'svg');
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
    await assertAriaRoles(t, 'ex1', 'slider', '2', 'g');
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
  '"aria-orientation" set on sliders',
  exampleFile,
  'aria-orientation',
  async (t) => {
    await assertAttributeValues(
      t,
      ex.tempSelector,
      'aria-orientation',
      'vertical'
    );
    await assertAttributeValues(
      t,
      ex.seekSelector,
      'aria-orientation',
      'horizontal'
    );
  }
);

ariaTest(
  '"aria-valuemax" set on sliders',
  exampleFile,
  'aria-valuemax',
  async (t) => {
    await assertAttributeValues(
      t,
      ex.tempSelector,
      'aria-valuemax',
      ex.tempMax
    );
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
      ex.tempSelector,
      'aria-valuemin',
      ex.tempMin
    );
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
      ex.tempSelector,
      'aria-valuenow',
      ex.tempDefault
    );
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
    // Send 1 key to temp slider
    const tempSlider = await t.context.session.findElement(
      By.css(ex.tempSelector)
    );
    await tempSlider.sendKeys(Key.ARROW_RIGHT);

    let sliderVal = parseFloat(ex.tempDefault) + ex.tempInc;
    t.is(
      await tempSlider.getAttribute('aria-valuenow'),
      sliderVal.toString(),
      'After sending 1 arrow right key to the temp slider, "aria-valuenow": ' +
        sliderVal
    );
    t.is(
      await t.context.session
        .findElement(By.css(ex.tempValueSelector))
        .getText(),
      sliderVal.toString() + ex.tempSuffix,
      'Temp display should match value of slider: ' + sliderVal
    );

    // Send 200 more keys to temp slider
    for (let i = 0; i < 200; i++) {
      await tempSlider.sendKeys(Key.ARROW_RIGHT);
    }

    t.is(
      await tempSlider.getAttribute('aria-valuenow'),
      ex.tempMax,
      'After sending 200 arrow right key, the value of the temp slider should be: ' +
        ex.tempMax
    );
    t.is(
      await t.context.session
        .findElement(By.css(ex.tempValueSelector))
        .getText(),
      ex.tempMax + ex.tempSuffix,
      'Temp display should match value of slider: ' + ex.tempMax
    );

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
    // Send 1 key to temp slider
    const tempSlider = await t.context.session.findElement(
      By.css(ex.tempSelector)
    );
    await tempSlider.sendKeys(Key.ARROW_UP);

    let sliderVal = parseFloat(ex.tempDefault) + ex.tempInc;
    t.is(
      await tempSlider.getAttribute('aria-valuenow'),
      sliderVal.toString(),
      'After sending 1 arrow up key to the temp slider, "aria-valuenow": ' +
        sliderVal
    );
    t.is(
      await t.context.session
        .findElement(By.css(ex.tempValueSelector))
        .getText(),
      sliderVal.toString() + ex.tempSuffix,
      'Temp display should match value of slider: ' + sliderVal
    );

    // Send 200 more keys to temp slider
    for (let i = 0; i < 200; i++) {
      await tempSlider.sendKeys(Key.ARROW_UP);
    }

    t.is(
      await tempSlider.getAttribute('aria-valuenow'),
      ex.tempMax,
      'After sending 200 arrow up key, the value of the temp slider should be: ' +
        ex.tempMax
    );
    t.is(
      await t.context.session
        .findElement(By.css(ex.tempValueSelector))
        .getText(),
      ex.tempMax + ex.tempSuffix,
      'Temp display should match value of slider: ' + ex.tempMax
    );

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
    // Send 1 key to temp slider
    const tempSlider = await t.context.session.findElement(
      By.css(ex.tempSelector)
    );
    await tempSlider.sendKeys(Key.PAGE_UP);

    let sliderVal = (
      parseFloat(ex.tempDefault) + parseFloat(ex.tempPageInc)
    ).toFixed(1);
    t.is(
      await tempSlider.getAttribute('aria-valuenow'),
      sliderVal.toString(),
      'After sending 1 page up key to the temp slider, the value of the temp slider should be: ' +
        sliderVal
    );
    t.is(
      await t.context.session
        .findElement(By.css(ex.tempValueSelector))
        .getText(),
      sliderVal.toString() + ex.tempSuffix,
      'Temp display should match value of slider: ' + sliderVal
    );

    // Send more than 10 keys to temp slider
    for (let i = 0; i < 10; i++) {
      await tempSlider.sendKeys(Key.PAGE_UP);
    }

    t.is(
      await tempSlider.getAttribute('aria-valuenow'),
      ex.tempMax,
      'After sending 10 page up key, the value of the temp slider should be: ' +
        ex.tempMax
    );
    t.is(
      await t.context.session
        .findElement(By.css(ex.tempValueSelector))
        .getText(),
      ex.tempMax + ex.tempSuffix,
      'Temp display should match value of slider: ' + ex.tempMax
    );

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
    // Send key end to temp slider
    const tempSlider = await t.context.session.findElement(
      By.css(ex.tempSelector)
    );
    await tempSlider.sendKeys(Key.END);

    t.is(
      await tempSlider.getAttribute('aria-valuenow'),
      ex.tempMax,
      'After sending key END, the value of the temp slider should be: ' +
        ex.tempMax
    );
    t.is(
      await t.context.session
        .findElement(By.css(ex.tempValueSelector))
        .getText(),
      ex.tempMax + ex.tempSuffix,
      'Temp display should match value of slider: ' + ex.tempMax
    );

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

    // Send 1 key to temp slider
    const tempSlider = await t.context.session.findElement(
      By.css(ex.tempSelector)
    );
    await tempSlider.sendKeys(Key.ARROW_LEFT);

    let tempVal = (parseFloat(ex.tempMax) - parseFloat(ex.tempInc)).toFixed(1);
    t.is(
      await tempSlider.getAttribute('aria-valuenow'),
      tempVal.toString(),
      'After sending 1 arrow left key, the value of the temp slider should be: ' +
        tempVal
    );
    t.is(
      await t.context.session
        .findElement(By.css(ex.tempValueSelector))
        .getText(),
      tempVal.toString() + ex.tempSuffix,
      'Temp display should match value of slider: ' + tempVal
    );

    // Send 300 more keys to temp slider
    for (let i = 0; i < 300; i++) {
      await tempSlider.sendKeys(Key.ARROW_LEFT);
    }

    t.is(
      await tempSlider.getAttribute('aria-valuenow'),
      ex.tempMin.toString(),
      'After sending 300 arrow left key to the temp slider, "aria-valuenow": ' +
        ex.tempMin
    );
    t.is(
      await t.context.session
        .findElement(By.css(ex.tempValueSelector))
        .getText(),
      ex.tempMin.toString() + ex.tempSuffix,
      'Temp display should match value of slider: ' + ex.tempMin
    );

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

    // Send 1 key to temp slider
    const tempSlider = await t.context.session.findElement(
      By.css(ex.tempSelector)
    );
    await tempSlider.sendKeys(Key.ARROW_DOWN);

    let tempVal = (parseFloat(ex.tempMax) - parseFloat(ex.tempInc)).toFixed(1);
    t.is(
      await tempSlider.getAttribute('aria-valuenow'),
      tempVal.toString(),
      'After sending 1 arrow down key, the value of the temp slider should be: ' +
        tempVal
    );
    t.is(
      await t.context.session
        .findElement(By.css(ex.tempValueSelector))
        .getText(),
      tempVal.toString() + ex.tempSuffix,
      'Temp display should match value of slider: ' + tempVal
    );

    // Send 300 more keys to temp slider
    for (let i = 0; i < 300; i++) {
      await tempSlider.sendKeys(Key.ARROW_DOWN);
    }

    t.is(
      await tempSlider.getAttribute('aria-valuenow'),
      ex.tempMin.toString(),
      'After sending 300 arrow down key to the temp slider, "aria-valuenow": ' +
        ex.tempMin
    );
    t.is(
      await t.context.session
        .findElement(By.css(ex.tempValueSelector))
        .getText(),
      ex.tempMin.toString() + ex.tempSuffix,
      'Temp display should match value of slider: ' + ex.tempMin
    );

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
    // Send 1 key to temp slider
    const tempSlider = await t.context.session.findElement(
      By.css(ex.tempSelector)
    );
    await tempSlider.sendKeys(Key.PAGE_DOWN);

    let sliderVal = (
      parseFloat(ex.tempDefault) - parseFloat(ex.tempPageInc)
    ).toFixed(1);
    t.is(
      await tempSlider.getAttribute('aria-valuenow'),
      sliderVal.toString(),
      'After sending 1 page down key to the temp slider, the value of the temp slider should be: ' +
        sliderVal
    );
    t.is(
      await t.context.session
        .findElement(By.css(ex.tempValueSelector))
        .getText(),
      sliderVal.toString() + ex.tempSuffix,
      'Temp display should match value of slider: ' + sliderVal
    );

    // Send more than 20 keys to temp slider
    for (let i = 0; i < 20; i++) {
      await tempSlider.sendKeys(Key.PAGE_DOWN);
    }

    t.is(
      await tempSlider.getAttribute('aria-valuenow'),
      ex.tempMin,
      'After sending 20 page down key, the value of the temp slider should be: ' +
        ex.tempMin
    );
    t.is(
      await t.context.session
        .findElement(By.css(ex.tempValueSelector))
        .getText(),
      ex.tempMin + ex.tempSuffix,
      'Temp display should match value of slider: ' + ex.tempMin
    );

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
    // Send key home to temp slider
    const tempSlider = await t.context.session.findElement(
      By.css(ex.tempSelector)
    );
    await tempSlider.sendKeys(Key.HOME);

    t.is(
      await tempSlider.getAttribute('aria-valuenow'),
      ex.tempMin,
      'After sending key HOME, the value of the temp slider should be: ' +
        ex.tempMin
    );
    t.is(
      await t.context.session
        .findElement(By.css(ex.tempValueSelector))
        .getText(),
      ex.tempMin + ex.tempSuffix,
      'Temp display should match value of slider: ' + ex.tempMin
    );

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
