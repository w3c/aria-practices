const { ariaTest } = require('..');
const { Key } = require('selenium-webdriver');
const assertAttributeValues = require('../util/assertAttributeValues');
const assertAriaLabelExists = require('../util/assertAriaLabelExists');
const assertAriaRoles = require('../util/assertAriaRoles');

const exampleFile = 'slider/slider-multithumb.html';

const ex = {
  sliderSelector: '#ex1 [role="slider"]',
  svgSelector: '#ex1 svg',
  railSelector: '#ex1 g.rail',
  rangeSelector: '#ex1 g.range',
  hotelSliderSelector: '#ex1 .slider-multithumb:nth-of-type(1) [role="slider"]',
  hotelMin: '0',
  hotelMax: '400',
  hotelDefaultValues: ['100', '250'],
  hotelLabelSelector:
    '#ex1 .slider-multithumb:nth-of-type(1) [role=slider] .value',
};

const verifyAllValues = async function (
  t,
  value,
  slider1,
  attribute1,
  slider2,
  attribute2,
  label,
  message
) {
  t.is(
    await slider1.getAttribute(attribute1),
    value,
    attribute1 + ' on first slider: ' + message
  );

  t.is(
    await slider2.getAttribute(attribute2),
    value,
    attribute2 + ' on second slider: ' + message
  );

  t.is(await label.getText(), '$' + value, 'value in label after: ' + message);
};

// Attributes

ariaTest('role="none" on SVG element', exampleFile, 'svg-none', async (t) => {
  await assertAriaRoles(t, 'ex1', 'none', '1', 'svg');
});

ariaTest(
  'SVG g elements used for the rail have aria-hidden',
  exampleFile,
  'aria-hidden-g',
  async (t) => {
    await assertAttributeValues(t, ex.railSelector, 'aria-hidden', 'true');
  }
);

ariaTest(
  'SVG g elements used for the range have aria-hidden',
  exampleFile,
  'aria-hidden-g',
  async (t) => {
    await assertAttributeValues(t, ex.rangeSelector, 'aria-hidden', 'true');
  }
);

ariaTest(
  'role="slider" on div element',
  exampleFile,
  'slider-role',
  async (t) => {
    await assertAriaRoles(t, 'ex1', 'slider', '2', 'g');
  }
);

ariaTest(
  '"tabindex" set to "0" on sliders',
  exampleFile,
  'tabindex',
  async (t) => {
    await assertAttributeValues(t, ex.sliderSelector, 'tabindex', '0');
  }
);

ariaTest(
  '"aria-valuemax" set on sliders',
  exampleFile,
  'aria-valuemax',
  async (t) => {
    const hotelSliders = await t.context.queryElements(
      t,
      ex.hotelSliderSelector
    );

    t.is(
      await hotelSliders[0].getAttribute('aria-valuemax'),
      ex.hotelDefaultValues[1],
      'Value of "aria-valuemax" for first hotel slider on page load should be: ' +
        ex.hotelDefaultValues[1]
    );
    t.is(
      await hotelSliders[1].getAttribute('aria-valuemax'),
      ex.hotelMax,
      'Value of "aria-valuemax" for second hotel slider on page load should be: ' +
        ex.hotelMax
    );
  }
);

ariaTest(
  '"aria-valuemin" set to "0" on sliders',
  exampleFile,
  'aria-valuemin',
  async (t) => {
    const hotelSliders = await t.context.queryElements(
      t,
      ex.hotelSliderSelector
    );

    t.is(
      await hotelSliders[0].getAttribute('aria-valuemin'),
      '0',
      'Value of "aria-valuemin" for first hotel slider on page load should be: "0"'
    );
    t.is(
      await hotelSliders[1].getAttribute('aria-valuemin'),
      ex.hotelDefaultValues[0],
      'Value of "aria-valuemin" for second hotel slider on page load should be: ' +
        ex.hotelDefaultValues[0]
    );
  }
);

ariaTest(
  '"aria-valuenow" reflects slider value',
  exampleFile,
  'aria-valuenow',
  async (t) => {
    const hotelSliders = await t.context.queryElements(
      t,
      ex.hotelSliderSelector
    );

    t.is(
      await hotelSliders[0].getAttribute('aria-valuenow'),
      ex.hotelDefaultValues[0],
      'Value of "aria-valuenow" for first hotel slider on page load should be: ' +
        ex.hotelDefaultValues[0]
    );
    t.is(
      await hotelSliders[1].getAttribute('aria-valuenow'),
      ex.hotelDefaultValues[1],
      'Value of "aria-valuenow" for second hotel slider on page load should be: ' +
        ex.hotelDefaultValues[1]
    );
  }
);

ariaTest(
  '"aria-label" set on sliders',
  exampleFile,
  'aria-label',
  async (t) => {
    await assertAriaLabelExists(t, ex.sliderSelector);
  }
);

// Keys

ariaTest(
  'Right arrow increases slider value by 1',
  exampleFile,
  'key-right-arrow',
  async (t) => {
    const hotelSliders = await t.context.queryElements(
      t,
      ex.hotelSliderSelector
    );
    const hotelLabels = await t.context.queryElements(t, ex.hotelLabelSelector);

    // Send 1 key to lower hotel slider
    await hotelSliders[0].sendKeys(Key.ARROW_RIGHT);

    await verifyAllValues(
      t,
      (parseInt(ex.hotelDefaultValues[0]) + 1).toString(),
      hotelSliders[0],
      'aria-valuenow',
      hotelSliders[1],
      'aria-valuemin',
      hotelLabels[0],
      'after one ARROW RIGHT to lower hotel slider'
    );

    await hotelSliders[0].sendKeys(Key.END, Key.ARROW_RIGHT);

    await verifyAllValues(
      t,
      ex.hotelDefaultValues[1],
      hotelSliders[0],
      'aria-valuenow',
      hotelSliders[1],
      'aria-valuemin',
      hotelLabels[0],
      'after END then one ARROW RIGHT to lower hotel slider'
    );

    // Send 1 key to lower upper slider
    await hotelSliders[1].sendKeys(Key.ARROW_RIGHT);

    await verifyAllValues(
      t,
      (parseInt(ex.hotelDefaultValues[1]) + 1).toString(),
      hotelSliders[0],
      'aria-valuemax',
      hotelSliders[1],
      'aria-valuenow',
      hotelLabels[1],
      'after one ARROW RIGHT to lower hotel slider'
    );

    await hotelSliders[1].sendKeys(Key.END, Key.ARROW_RIGHT);

    await verifyAllValues(
      t,
      ex.hotelMax,
      hotelSliders[0],
      'aria-valuemax',
      hotelSliders[1],
      'aria-valuenow',
      hotelLabels[1],
      'after END then one ARROW RIGHT to upper hotel slider'
    );
  }
);

ariaTest(
  'Up arrow increases slider value by 1',
  exampleFile,
  'key-up-arrow',
  async (t) => {
    const hotelSliders = await t.context.queryElements(
      t,
      ex.hotelSliderSelector
    );
    const hotelLabels = await t.context.queryElements(t, ex.hotelLabelSelector);

    // Send 1 key to lower hotel slider
    await hotelSliders[0].sendKeys(Key.ARROW_UP);

    await verifyAllValues(
      t,
      (parseInt(ex.hotelDefaultValues[0]) + 1).toString(),
      hotelSliders[0],
      'aria-valuenow',
      hotelSliders[1],
      'aria-valuemin',
      hotelLabels[0],
      'after one ARROW UP to lower hotel slider'
    );

    await hotelSliders[0].sendKeys(Key.END, Key.ARROW_UP);

    await verifyAllValues(
      t,
      ex.hotelDefaultValues[1],
      hotelSliders[0],
      'aria-valuenow',
      hotelSliders[1],
      'aria-valuemin',
      hotelLabels[0],
      'after END then one ARROW UP to lower hotel slider'
    );

    // Send 1 key to lower upper slider
    await hotelSliders[1].sendKeys(Key.ARROW_UP);

    await verifyAllValues(
      t,
      (parseInt(ex.hotelDefaultValues[1]) + 1).toString(),
      hotelSliders[0],
      'aria-valuemax',
      hotelSliders[1],
      'aria-valuenow',
      hotelLabels[1],
      'after one ARROW UP to lower hotel slider'
    );

    await hotelSliders[1].sendKeys(Key.END, Key.ARROW_UP);

    await verifyAllValues(
      t,
      ex.hotelMax,
      hotelSliders[0],
      'aria-valuemax',
      hotelSliders[1],
      'aria-valuenow',
      hotelLabels[1],
      'after END then one ARROW UP to upper hotel slider'
    );
  }
);

ariaTest(
  'Page up increases slider value by 10',
  exampleFile,
  'key-page-up',
  async (t) => {
    const hotelSliders = await t.context.queryElements(
      t,
      ex.hotelSliderSelector
    );
    const hotelLabels = await t.context.queryElements(t, ex.hotelLabelSelector);

    // Send 1 key to lower hotel slider
    await hotelSliders[0].sendKeys(Key.PAGE_UP);

    await verifyAllValues(
      t,
      (parseInt(ex.hotelDefaultValues[0]) + 10).toString(),
      hotelSliders[0],
      'aria-valuenow',
      hotelSliders[1],
      'aria-valuemin',
      hotelLabels[0],
      'after one PAGE UP to lower hotel slider'
    );

    await hotelSliders[0].sendKeys(Key.END, Key.PAGE_UP);

    await verifyAllValues(
      t,
      ex.hotelDefaultValues[1],
      hotelSliders[0],
      'aria-valuenow',
      hotelSliders[1],
      'aria-valuemin',
      hotelLabels[0],
      'after END then one PAGE UP to lower hotel slider'
    );

    // Send 1 key to lower upper slider
    await hotelSliders[1].sendKeys(Key.PAGE_UP);

    await verifyAllValues(
      t,
      (parseInt(ex.hotelDefaultValues[1]) + 10).toString(),
      hotelSliders[0],
      'aria-valuemax',
      hotelSliders[1],
      'aria-valuenow',
      hotelLabels[1],
      'after one PAGE UP to upper hotel slider'
    );

    await hotelSliders[1].sendKeys(Key.END, Key.PAGE_UP);

    await verifyAllValues(
      t,
      ex.hotelMax,
      hotelSliders[0],
      'aria-valuemax',
      hotelSliders[1],
      'aria-valuenow',
      hotelLabels[1],
      'after END then one PAGE UP to upper hotel slider'
    );
  }
);

ariaTest(
  'left arrow decreases slider value by 1',
  exampleFile,
  'key-left-arrow',
  async (t) => {
    const hotelSliders = await t.context.queryElements(
      t,
      ex.hotelSliderSelector
    );
    const hotelLabels = await t.context.queryElements(t, ex.hotelLabelSelector);

    // Send 1 key to lower hotel slider
    await hotelSliders[0].sendKeys(Key.ARROW_LEFT);

    await verifyAllValues(
      t,
      (parseInt(ex.hotelDefaultValues[0]) - 1).toString(),
      hotelSliders[0],
      'aria-valuenow',
      hotelSliders[1],
      'aria-valuemin',
      hotelLabels[0],
      'after one ARROW LEFT to lower hotel slider'
    );

    await hotelSliders[0].sendKeys(Key.HOME, Key.ARROW_LEFT);

    await verifyAllValues(
      t,
      ex.hotelMin,
      hotelSliders[0],
      'aria-valuenow',
      hotelSliders[1],
      'aria-valuemin',
      hotelLabels[0],
      'after HOME then one ARROW LEFT to lower hotel slider'
    );

    // Send 1 key to lower upper slider
    await hotelSliders[1].sendKeys(Key.ARROW_LEFT);

    await verifyAllValues(
      t,
      (parseInt(ex.hotelDefaultValues[1]) - 1).toString(),
      hotelSliders[0],
      'aria-valuemax',
      hotelSliders[1],
      'aria-valuenow',
      hotelLabels[1],
      'after one ARROW LEFT to upper hotel slider'
    );

    await hotelSliders[1].sendKeys(Key.HOME, Key.ARROW_LEFT);

    await verifyAllValues(
      t,
      ex.hotelMin,
      hotelSliders[0],
      'aria-valuemax',
      hotelSliders[1],
      'aria-valuenow',
      hotelLabels[1],
      'after HOME then one ARROW LEFT to upper hotel slider'
    );
  }
);

ariaTest(
  'down arrow decreases slider value by 1',
  exampleFile,
  'key-down-arrow',
  async (t) => {
    const hotelSliders = await t.context.queryElements(
      t,
      ex.hotelSliderSelector
    );
    const hotelLabels = await t.context.queryElements(t, ex.hotelLabelSelector);

    // Send 1 key to lower hotel slider
    await hotelSliders[0].sendKeys(Key.ARROW_DOWN);

    await verifyAllValues(
      t,
      (parseInt(ex.hotelDefaultValues[0]) - 1).toString(),
      hotelSliders[0],
      'aria-valuenow',
      hotelSliders[1],
      'aria-valuemin',
      hotelLabels[0],
      'after one ARROW DOWN to lower hotel slider'
    );

    await hotelSliders[0].sendKeys(Key.HOME, Key.ARROW_DOWN);

    await verifyAllValues(
      t,
      ex.hotelMin,
      hotelSliders[0],
      'aria-valuenow',
      hotelSliders[1],
      'aria-valuemin',
      hotelLabels[0],
      'after HOME then one ARROW DOWN to lower hotel slider'
    );

    // Send 1 key to lower upper slider
    await hotelSliders[1].sendKeys(Key.ARROW_DOWN);

    await verifyAllValues(
      t,
      (parseInt(ex.hotelDefaultValues[1]) - 1).toString(),
      hotelSliders[0],
      'aria-valuemax',
      hotelSliders[1],
      'aria-valuenow',
      hotelLabels[1],
      'after one ARROW DOWN to upper hotel slider'
    );

    await hotelSliders[1].sendKeys(Key.HOME, Key.ARROW_DOWN);

    await verifyAllValues(
      t,
      ex.hotelMin,
      hotelSliders[0],
      'aria-valuemax',
      hotelSliders[1],
      'aria-valuenow',
      hotelLabels[1],
      'after HOME then one ARROW DOWN to upper hotel slider'
    );
  }
);

ariaTest(
  'page down decreases slider value by 10',
  exampleFile,
  'key-page-down',
  async (t) => {
    const hotelSliders = await t.context.queryElements(
      t,
      ex.hotelSliderSelector
    );
    const hotelLabels = await t.context.queryElements(t, ex.hotelLabelSelector);

    // Send 1 key to lower hotel slider
    await hotelSliders[0].sendKeys(Key.PAGE_DOWN);

    await verifyAllValues(
      t,
      (parseInt(ex.hotelDefaultValues[0]) - 10).toString(),
      hotelSliders[0],
      'aria-valuenow',
      hotelSliders[1],
      'aria-valuemin',
      hotelLabels[0],
      'after one PAGE DOWN to lower hotel slider'
    );

    await hotelSliders[0].sendKeys(Key.HOME, Key.PAGE_DOWN);

    await verifyAllValues(
      t,
      ex.hotelMin,
      hotelSliders[0],
      'aria-valuenow',
      hotelSliders[1],
      'aria-valuemin',
      hotelLabels[0],
      'after HOME then one PAGE DOWN to lower hotel slider'
    );

    // Send 1 key to lower upper slider
    await hotelSliders[1].sendKeys(Key.PAGE_DOWN);

    await verifyAllValues(
      t,
      (parseInt(ex.hotelDefaultValues[1]) - 10).toString(),
      hotelSliders[0],
      'aria-valuemax',
      hotelSliders[1],
      'aria-valuenow',
      hotelLabels[1],
      'after one PAGE DOWN to upper hotel slider'
    );

    await hotelSliders[1].sendKeys(Key.HOME, Key.PAGE_DOWN);

    await verifyAllValues(
      t,
      ex.hotelMin,
      hotelSliders[0],
      'aria-valuemax',
      hotelSliders[1],
      'aria-valuenow',
      hotelLabels[1],
      'after HOME then one PAGE DOWN to upper hotel slider'
    );
  }
);

ariaTest('home sends value to minimum', exampleFile, 'key-home', async (t) => {
  const hotelSliders = await t.context.queryElements(t, ex.hotelSliderSelector);
  const hotelLabels = await t.context.queryElements(t, ex.hotelLabelSelector);

  // Send 1 key to upper hotel slider
  await hotelSliders[1].sendKeys(Key.HOME);

  await verifyAllValues(
    t,
    ex.hotelDefaultValues[0],
    hotelSliders[0],
    'aria-valuemax',
    hotelSliders[1],
    'aria-valuenow',
    hotelLabels[1],
    'after one HOME to upper hotel slider'
  );

  // Send 1 key to upper hotel slider
  await hotelSliders[0].sendKeys(Key.HOME);

  await verifyAllValues(
    t,
    ex.hotelMin,
    hotelSliders[0],
    'aria-valuenow',
    hotelSliders[1],
    'aria-valuemin',
    hotelLabels[0],
    'after one HOME to lower hotel slider'
  );
});

ariaTest('end sends value to minimum', exampleFile, 'key-end', async (t) => {
  const hotelSliders = await t.context.queryElements(t, ex.hotelSliderSelector);
  const hotelLabels = await t.context.queryElements(t, ex.hotelLabelSelector);

  await hotelSliders[0].sendKeys(Key.END);

  await verifyAllValues(
    t,
    ex.hotelDefaultValues[1],
    hotelSliders[0],
    'aria-valuenow',
    hotelSliders[1],
    'aria-valuemin',
    hotelLabels[0],
    'after one END to lower hotel slider'
  );

  await hotelSliders[1].sendKeys(Key.END);

  await verifyAllValues(
    t,
    ex.hotelMax,
    hotelSliders[0],
    'aria-valuemax',
    hotelSliders[1],
    'aria-valuenow',
    hotelLabels[1],
    'after one END to upper hotel slider'
  );
});
