const { ariaTest } = require('..');
const { By, Key } = require('selenium-webdriver');
const assertAttributeValues = require('../util/assertAttributeValues');
const assertAriaLabelledby = require('../util/assertAriaLabelledby');
const assertAriaRoles = require('../util/assertAriaRoles');

const exampleFile = 'slider/slider-thermostat.html';

const ex = {
  railRects: '#ex1 rect.rail',
  labelG: '#ex1 g.value-label',
  sliderSelector: '#ex1 [role="slider"]',
  groupSelector: '#ex1 [role="group"]',
  tempSelector: '#id-temp-slider',
  fanSelector: '#id-fan',
  pageTempSelector: '#id-temp-slider .value',
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
  'role="presentation" on SVG element',
  exampleFile,
  'svg-presentation',
  async (t) => {
    await assertAriaRoles(t, 'ex1', 'presentation', '2', 'svg');
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
  'SVG rects used for the rail have aria-hidden',
  exampleFile,
  'aria-hidden-rect',
  async (t) => {
    await assertAttributeValues(t, ex.railRects, 'aria-hidden', 'true');
  }
);

ariaTest(
  'SVG g elements used for labels have aria-hidden',
  exampleFile,
  'aria-hidden-g',
  async (t) => {
    await assertAttributeValues(t, ex.labelG, 'aria-hidden', 'true');
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
      ex.fanSelector,
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
    await assertAttributeValues(t, ex.fanSelector, 'aria-valuemax', ex.fanMax);
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
    await assertAttributeValues(t, ex.fanSelector, 'aria-valuemin', ex.fanMin);
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
    await assertAttributeValues(t, ex.fanSelector, 'aria-valuenow', '0');
  }
);

ariaTest(
  '"aria-valuetext" reflects slider value',
  exampleFile,
  'aria-valuetext',
  async (t) => {
    await assertAttributeValues(
      t,
      ex.fanSelector,
      'aria-valuetext',
      ex.fanValues[0]
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
        .findElement(By.css(ex.pageTempSelector))
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
        .findElement(By.css(ex.pageTempSelector))
        .getText(),
      ex.tempMax + ex.tempSuffix,
      'Temp display should match value of slider: ' + ex.tempMax
    );

    // Send 1 key to fan slider
    const fanSlider = await t.context.session.findElement(
      By.css(ex.fanSelector)
    );
    await fanSlider.sendKeys(Key.ARROW_RIGHT);

    t.deepEqual(
      await getValueAndText(t, ex.fanSelector),
      ['1', ex.fanValues[1]],
      'After sending 1 arrow right key to the fan slider, aria-valuenow should be "1" and aria-value-text should be: ' +
        ex.fanValues[1]
    );

    // Send more than 5 keys to fan slider
    for (let i = 0; i < 5; i++) {
      await fanSlider.sendKeys(Key.ARROW_RIGHT);
    }

    t.deepEqual(
      await getValueAndText(t, ex.fanSelector),
      [ex.fanMax, ex.fanValues[parseInt(ex.fanMax)]],
      'After sending 5 arrow right key to the fan slider, aria-valuenow should be "' +
        ex.fanMax +
        '" and aria-value-text should be: ' +
        ex.fanValues[parseInt(ex.fanMax)]
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
        .findElement(By.css(ex.pageTempSelector))
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
        .findElement(By.css(ex.pageTempSelector))
        .getText(),
      ex.tempMax + ex.tempSuffix,
      'Temp display should match value of slider: ' + ex.tempMax
    );

    // Send 1 key to fan slider
    const fanSlider = await t.context.session.findElement(
      By.css(ex.fanSelector)
    );
    await fanSlider.sendKeys(Key.ARROW_UP);

    t.deepEqual(
      await getValueAndText(t, ex.fanSelector),
      ['1', ex.fanValues[1]],
      'After sending 1 arrow up key to the fan slider, aria-valuenow should be "1" and aria-value-text should be: ' +
        ex.fanValues[1]
    );

    // Send more than 5 keys to fan slider
    for (let i = 0; i < 5; i++) {
      await fanSlider.sendKeys(Key.ARROW_UP);
    }

    t.deepEqual(
      await getValueAndText(t, ex.fanSelector),
      [ex.fanMax, ex.fanValues[parseInt(ex.fanMax)]],
      'After sending 6 arrow up key to the fan slider, aria-valuenow should be "' +
        ex.fanMax +
        '" and aria-value-text should be: ' +
        ex.fanValues[parseInt(ex.fanMax)]
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
        .findElement(By.css(ex.pageTempSelector))
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
        .findElement(By.css(ex.pageTempSelector))
        .getText(),
      ex.tempMax + ex.tempSuffix,
      'Temp display should match value of slider: ' + ex.tempMax
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
        .findElement(By.css(ex.pageTempSelector))
        .getText(),
      ex.tempMax + ex.tempSuffix,
      'Temp display should match value of slider: ' + ex.tempMax
    );

    // Send key end to fan slider
    const fanSlider = await t.context.session.findElement(
      By.css(ex.fanSelector)
    );
    await fanSlider.sendKeys(Key.END);

    t.deepEqual(
      await getValueAndText(t, ex.fanSelector),
      [ex.fanMax, ex.fanValues[parseInt(ex.fanMax)]],
      'After sending key end to the heat slider, aria-valuenow should be "' +
        ex.fanMax +
        '" and aria-value-text should be: ' +
        ex.fanValues[parseInt(ex.fanMax)]
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
        .findElement(By.css(ex.pageTempSelector))
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
        .findElement(By.css(ex.pageTempSelector))
        .getText(),
      ex.tempMin.toString() + ex.tempSuffix,
      'Temp display should match value of slider: ' + ex.tempMin
    );

    // Send 1 key to fan slider
    const fanSlider = await t.context.session.findElement(
      By.css(ex.fanSelector)
    );
    await fanSlider.sendKeys(Key.ARROW_LEFT);

    let fanVal = parseInt(ex.fanMax) - 1;
    t.deepEqual(
      await getValueAndText(t, ex.fanSelector),
      [fanVal.toString(), ex.fanValues[fanVal]],
      'After sending 1 arrow left key to the fan slider, aria-valuenow should be "' +
        fanVal +
        '" and aria-value-text should be: ' +
        ex.fanValues[fanVal]
    );

    // Send more than 5 keys to fan slider
    for (let i = 0; i < 5; i++) {
      await fanSlider.sendKeys(Key.ARROW_LEFT);
    }

    t.deepEqual(
      await getValueAndText(t, ex.fanSelector),
      ['0', ex.fanValues[0]],
      'After sending 6 arrow left key to the fan slider, aria-valuenow should be "0" and aria-value-text should be: ' +
        ex.fanValues[0]
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
        .findElement(By.css(ex.pageTempSelector))
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
        .findElement(By.css(ex.pageTempSelector))
        .getText(),
      ex.tempMin.toString() + ex.tempSuffix,
      'Temp display should match value of slider: ' + ex.tempMin
    );

    // Send 1 key to fan slider
    const fanSlider = await t.context.session.findElement(
      By.css(ex.fanSelector)
    );
    await fanSlider.sendKeys(Key.ARROW_DOWN);

    let fanVal = parseInt(ex.fanMax) - 1;
    t.deepEqual(
      await getValueAndText(t, ex.fanSelector),
      [fanVal.toString(), ex.fanValues[fanVal]],
      'After sending 1 arrow down key to the fan slider, aria-valuenow should be "' +
        fanVal +
        '" and aria-value-text should be: ' +
        ex.fanValues[fanVal]
    );

    // Send more than 5 keys to fan slider
    for (let i = 0; i < 5; i++) {
      await fanSlider.sendKeys(Key.ARROW_DOWN);
    }

    t.deepEqual(
      await getValueAndText(t, ex.fanSelector),
      ['0', ex.fanValues[0]],
      'After sending 6 arrow down key to the fan slider, aria-valuenow should be "0" and aria-value-text should be: ' +
        ex.fanValues[0]
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
        .findElement(By.css(ex.pageTempSelector))
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
        .findElement(By.css(ex.pageTempSelector))
        .getText(),
      ex.tempMin + ex.tempSuffix,
      'Temp display should match value of slider: ' + ex.tempMin
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
        .findElement(By.css(ex.pageTempSelector))
        .getText(),
      ex.tempMin + ex.tempSuffix,
      'Temp display should match value of slider: ' + ex.tempMin
    );

    // Send key home to fan slider
    const fanSlider = await t.context.session.findElement(
      By.css(ex.fanSelector)
    );
    await fanSlider.sendKeys(Key.HOME);

    t.deepEqual(
      await getValueAndText(t, ex.fanSelector),
      [ex.fanMin, ex.fanValues[parseInt(ex.fanMin)]],
      'After sending key home to the heat slider, aria-valuenow should be "' +
        ex.fanMin +
        '" and aria-value-text should be: ' +
        ex.fanValues[parseInt(ex.fanMin)]
    );
  }
);
