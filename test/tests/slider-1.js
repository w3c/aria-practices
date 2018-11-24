'use strict';

const { ariaTest } = require('..');
const { By, Key } = require('selenium-webdriver');
const assertAttributeValues = require('../util/assertAttributeValues');
const assertAriaLabelledby = require('../util/assertAriaLabelledby');
const assertAriaRoles = require('../util/assertAriaRoles');

const exampleFile = 'slider/slider-1.html';

const ex = {
  sliderSelector: '#ex1 [role="slider"]',
  hexTextInput: '#idColorValueHex',
  rgbTextInput: '#idColorValueRGB',
  colorBox: '#idColorBox'
};

const testDisplayMatchesValue = async function (t, rgbString) {
  const rgbValue = await t.context.session
    .findElement(By.css(ex.rgbTextInput))
    .getAttribute('value');
  const hexValue = await t.context.session
    .findElement(By.css(ex.hexTextInput))
    .getAttribute('value');
  const boxColor = await t.context.session
    .findElement(By.css(ex.colorBox))
    .getCssValue('background-color');

  if (rgbValue !== rgbString) {
    return ex.rgbTextInput + ' was not update, value is ' + rgbValue +
      ' but expected ' + rgbString;
  }

  if (boxColor !== 'rgb(' + rgbString + ')') {
    return 'Box color was not update, background-color is ' + boxColor +
      ' but expected ' + 'rgb(' + rgbString + ')';
  }

  const rbgFromHexString = hexValue.match(/^#([0-9a-f]{2})([0-9a-f]{2})([0-9a-f]{2})$/i)
    .slice(1,4)
    .map(x => parseInt(x, 16))
    .join(', ');

  if (rbgFromHexString !== rgbString) {
    return ex.hexTextInput + ' was not update, value is ' + rbgFromHexString +
      ' but expected ' + rgbString;
  }

  return true;
};

const sendAllSlidersToEnd = async function (t) {
  const sliders = await t.context.session.findElements(By.css(ex.sliderSelector));

  for (let slider of sliders) {
    await slider.sendKeys(Key.END);
  }
};

// Attributes

ariaTest('role="slider" on div element', exampleFile, 'slider-role', async (t) => {
  t.plan(1);
  await assertAriaRoles(t, 'ex1', 'slider', '3', 'div');
});

ariaTest('"tabindex" set to "0" on sliders', exampleFile, 'tabindex', async (t) => {
  t.plan(1);
  await assertAttributeValues(t, ex.sliderSelector, 'tabindex', '0');
});

ariaTest('"aria-valuemax" set to "255" on sliders', exampleFile, 'aria-valuemax', async (t) => {
  t.plan(1);
  await assertAttributeValues(t, ex.sliderSelector, 'aria-valuemax', '255');
});

ariaTest('"aria-valuemin" set to "0" on sliders', exampleFile, 'aria-valuemin', async (t) => {
  t.plan(1);
  await assertAttributeValues(t, ex.sliderSelector, 'aria-valuemin', '0');
});

ariaTest('"aria-valuenow" reflects slider value', exampleFile, 'aria-valuenow', async (t) => {
  t.plan(1);
  await assertAttributeValues(t, ex.sliderSelector, 'aria-valuenow', '0');
});

ariaTest('"aria-labelledby" set on sliders', exampleFile, 'aria-labelledby', async (t) => {
  t.plan(1);
  await assertAriaLabelledby(t, ex.sliderSelector);
});

// Keys

ariaTest('Right arrow increases slider value by 1', exampleFile, 'key-right-arrow', async (t) => {
  t.plan(12);

  const sliders = await t.context.session.findElements(By.css(ex.sliderSelector));

  // Send 1 key to red slider
  const redSlider = sliders[0];
  await redSlider.sendKeys(Key.ARROW_RIGHT);

  t.is(
    await redSlider.getAttribute('aria-valuenow'),
    '1',
    'After sending 1 arrow right key to the red slider, the value of the red slider should be 1'
  );
  t.true(
    await testDisplayMatchesValue(t, '1, 0, 0'),
    'Display should match rgb(1, 0, 0)'
  );

  // Send more than 255 keys to red slider
  for (let i = 0; i < 260; i++) {
    await redSlider.sendKeys(Key.ARROW_RIGHT);
  }

  t.is(
    await redSlider.getAttribute('aria-valuenow'),
    '255',
    'After sending 260 arrow right key, the value of the red slider should be 255'
  );
  t.true(
    await testDisplayMatchesValue(t, '255, 0, 0'),
    'Display should match rgb(255, 0, 0)'
  );

  // Send 1 key to green slider
  const greenSlider = sliders[1];
  await greenSlider.sendKeys(Key.ARROW_RIGHT);

  t.is(
    await greenSlider.getAttribute('aria-valuenow'),
    '1',
    'After sending 1 arrow right key to the blue slider, the value of the green slider should be 1'
  );
  t.true(
    await testDisplayMatchesValue(t, '255, 1, 0'),
    'Display should match rgb(255, 1, 0)'
  );

  // Send more than 255 keys to green slider
  for (let i = 0; i < 260; i++) {
    await greenSlider.sendKeys(Key.ARROW_RIGHT);
  }

  t.is(
    await greenSlider.getAttribute('aria-valuenow'),
    '255',
    'After sending 260 arrow right key, the value of the green slider should be 255'
  );
  t.true(
    await testDisplayMatchesValue(t, '255, 255, 0'),
    'Display should match rgb(255, 255, 0)'
  );

  // Send 1 key to blue slider
  const blueSlider = sliders[2];
  await blueSlider.sendKeys(Key.ARROW_RIGHT);

  t.is(
    await blueSlider.getAttribute('aria-valuenow'),
    '1',
    'After sending 1 arrow right key to the blue slider, the value of the blue slider should be 1'
  );
  t.true(
    await testDisplayMatchesValue(t, '255, 255, 1'),
    'Display should match rgb(255, 255, 1)'
  );

  // Send more than 255 keys to blue slider
  for (let i = 0; i < 260; i++) {
    await blueSlider.sendKeys(Key.ARROW_RIGHT);
  }

  t.is(
    await blueSlider.getAttribute('aria-valuenow'),
    '255',
    'After sending 260 arrow right key, the value of the blue slider should be 255'
  );
  t.true(
    await testDisplayMatchesValue(t, '255, 255, 255'),
    'Display should match rgb(255, 255, 255)'
  );
});

ariaTest('up arrow increases slider value by 1', exampleFile, 'key-up-arrow', async (t) => {
  t.plan(12);

  const sliders = await t.context.session.findElements(By.css(ex.sliderSelector));

  // Send 1 key to red slider
  const redSlider = sliders[0];
  await redSlider.sendKeys(Key.ARROW_UP);

  t.is(
    await redSlider.getAttribute('aria-valuenow'),
    '1',
    'After sending 1 arrow up key to the red slider, the value of the red slider should be 1'
  );
  t.true(
    await testDisplayMatchesValue(t, '1, 0, 0'),
    'Display should match rgb(1, 0, 0)'
  );

  // Send more than 255 keys to red slider
  for (let i = 0; i < 260; i++) {
    await redSlider.sendKeys(Key.ARROW_UP);
  }

  t.is(
    await redSlider.getAttribute('aria-valuenow'),
    '255',
    'After sending 260 arrow up key, the value of the red slider should be 255'
  );
  t.true(
    await testDisplayMatchesValue(t, '255, 0, 0'),
    'Display should match rgb(255, 0, 0)'
  );

  // Send 1 key to green slider
  const greenSlider = sliders[1];
  await greenSlider.sendKeys(Key.ARROW_UP);

  t.is(
    await greenSlider.getAttribute('aria-valuenow'),
    '1',
    'After sending 1 arrow up key to the blue slider, the value of the green slider should be 1'
  );
  t.true(
    await testDisplayMatchesValue(t, '255, 1, 0'),
    'Display should match rgb(255, 1, 0)'
  );

  // Send more than 255 keys to green slider
  for (let i = 0; i < 260; i++) {
    await greenSlider.sendKeys(Key.ARROW_UP);
  }

  t.is(
    await greenSlider.getAttribute('aria-valuenow'),
    '255',
    'After sending 260 arrow up key, the value of the green slider should be 255'
  );
  t.true(
    await testDisplayMatchesValue(t, '255, 255, 0'),
    'Display should match rgb(255, 255, 0)'
  );

  // Send 1 key to blue slider
  const blueSlider = sliders[2];
  await blueSlider.sendKeys(Key.ARROW_UP);

  t.is(
    await blueSlider.getAttribute('aria-valuenow'),
    '1',
    'After sending 1 arrow up key to the blue slider, the value of the blue slider should be 1'
  );
  t.true(
    await testDisplayMatchesValue(t, '255, 255, 1'),
    'Display should match rgb(255, 255, 1)'
  );

  // Send more than 255 keys to blue slider
  for (let i = 0; i < 260; i++) {
    await blueSlider.sendKeys(Key.ARROW_UP);
  }

  t.is(
    await blueSlider.getAttribute('aria-valuenow'),
    '255',
    'After sending 260 arrow up key, the value of the blue slider should be 255'
  );
  t.true(
    await testDisplayMatchesValue(t, '255, 255, 255'),
    'Display should match rgb(255, 255, 255)'
  );
});


ariaTest('page up increases slider value by 10', exampleFile, 'key-page-up', async (t) => {
  t.plan(12);

  const sliders = await t.context.session.findElements(By.css(ex.sliderSelector));

  // Send 1 key to red slider
  const redSlider = sliders[0];
  await redSlider.sendKeys(Key.PAGE_UP);

  t.is(
    await redSlider.getAttribute('aria-valuenow'),
    '10',
    'After sending 1 page up key to the red slider, the value of the red slider should be 10'
  );
  t.true(
    await testDisplayMatchesValue(t, '10, 0, 0'),
    'Display should match rgb(10, 0, 0)'
  );

  // Send more than 26 keys to red slider
  for (let i = 0; i < 26; i++) {
    await redSlider.sendKeys(Key.PAGE_UP);
  }

  t.is(
    await redSlider.getAttribute('aria-valuenow'),
    '255',
    'After sending 26 page up key, the value of the red slider should be 255'
  );
  t.true(
    await testDisplayMatchesValue(t, '255, 0, 0'),
    'Display should match rgb(255, 0, 0)'
  );

  // Send 1 key to green slider
  const greenSlider = sliders[1];
  await greenSlider.sendKeys(Key.PAGE_UP);

  t.is(
    await greenSlider.getAttribute('aria-valuenow'),
    '10',
    'After sending 1 page up key to the blue slider, the value of the green slider should be 10'
  );
  t.true(
    await testDisplayMatchesValue(t, '255, 10, 0'),
    'Display should match rgb(255, 10, 0)'
  );

  // Send more than 26 keys to green slider
  for (let i = 0; i < 26; i++) {
    await greenSlider.sendKeys(Key.PAGE_UP);
  }

  t.is(
    await greenSlider.getAttribute('aria-valuenow'),
    '255',
    'After sending 260 page up key, the value of the green slider should be 255'
  );
  t.true(
    await testDisplayMatchesValue(t, '255, 255, 0'),
    'Display should match rgb(255, 255, 0)'
  );

  // Send 1 key to blue slider
  const blueSlider = sliders[2];
  await blueSlider.sendKeys(Key.PAGE_UP);

  t.is(
    await blueSlider.getAttribute('aria-valuenow'),
    '10',
    'After sending 1 page up key to the blue slider, the value of the blue slider should be 10'
  );
  t.true(
    await testDisplayMatchesValue(t, '255, 255, 10'),
    'Display should match rgb(255, 255, 10)'
  );

  // Send more than 26 keys to blue slider
  for (let i = 0; i < 26; i++) {
    await blueSlider.sendKeys(Key.PAGE_UP);
  }

  t.is(
    await blueSlider.getAttribute('aria-valuenow'),
    '255',
    'After sending 26 page up key, the value of the blue slider should be 255'
  );
  t.true(
    await testDisplayMatchesValue(t, '255, 255, 255'),
    'Display should match rgb(255, 255, 255)'
  );
});

ariaTest('key end set slider at max value', exampleFile, 'key-end', async (t) => {
  t.plan(6);

  const sliders = await t.context.session.findElements(By.css(ex.sliderSelector));

  // Send key end to red slider
  const redSlider = sliders[0];
  await redSlider.sendKeys(Key.END);

  t.is(
    await redSlider.getAttribute('aria-valuenow'),
    '255',
    'After sending 1 end key to the red slider, the value of the red slider should be 255'
  );
  t.true(
    await testDisplayMatchesValue(t, '255, 0, 0'),
    'Display should match rgb(255, 0, 0)'
  );

  // Send key end to green slider
  const greenSlider = sliders[1];
  await greenSlider.sendKeys(Key.END);

  t.is(
    await greenSlider.getAttribute('aria-valuenow'),
    '255',
    'After sending 1 end key to the blue slider, the value of the green slider should be 255'
  );
  t.true(
    await testDisplayMatchesValue(t, '255, 255, 0'),
    'Display should match rgb(255, 255, 0)'
  );

  // Send key end to blue slider
  const blueSlider = sliders[2];
  await blueSlider.sendKeys(Key.END);

  t.is(
    await blueSlider.getAttribute('aria-valuenow'),
    '255',
    'After sending 1 end key to the blue slider, the value of the blue slider should be 255'
  );
  t.true(
    await testDisplayMatchesValue(t, '255, 255, 255'),
    'Display should match rgb(255, 255, 255)'
  );
});

ariaTest('left arrow decreases slider value by 1', exampleFile, 'key-left-arrow', async (t) => {
  t.plan(12);

  await sendAllSlidersToEnd(t);

  const sliders = await t.context.session.findElements(By.css(ex.sliderSelector));

  // Send 1 key to red slider
  const redSlider = sliders[0];
  await redSlider.sendKeys(Key.ARROW_LEFT);

  t.is(
    await redSlider.getAttribute('aria-valuenow'),
    '254',
    'After sending 1 arrow left key to the red slider, the value of the red slider should be 254'
  );
  t.true(
    await testDisplayMatchesValue(t, '254, 255, 255'),
    'Display should match rgb(254, 255, 255)'
  );

  // Send more than 255 keys to red slider
  for (let i = 0; i < 260; i++) {
    await redSlider.sendKeys(Key.ARROW_LEFT);
  }

  t.is(
    await redSlider.getAttribute('aria-valuenow'),
    '0',
    'After sending 260 arrow left key, the value of the red slider should be 0'
  );
  t.true(
    await testDisplayMatchesValue(t, '0, 255, 255'),
    'Display should match rgb(0, 255, 255)'
  );

  // Send 1 key to green slider
  const greenSlider = sliders[1];
  await greenSlider.sendKeys(Key.ARROW_LEFT);

  t.is(
    await greenSlider.getAttribute('aria-valuenow'),
    '254',
    'After sending 1 arrow left key to the blue slider, the value of the green slider should be 254'
  );
  t.true(
    await testDisplayMatchesValue(t, '0, 254, 255'),
    'Display should match rgb(0, 254, 255)'
  );

  // Send more than 255 keys to green slider
  for (let i = 0; i < 260; i++) {
    await greenSlider.sendKeys(Key.ARROW_LEFT);
  }

  t.is(
    await greenSlider.getAttribute('aria-valuenow'),
    '0',
    'After sending 260 arrow left key, the value of the green slider should be 0'
  );
  t.true(
    await testDisplayMatchesValue(t, '0, 0, 255'),
    'Display should match rgb(0, 0, 255)'
  );

  // Send 1 key to blue slider
  const blueSlider = sliders[2];
  await blueSlider.sendKeys(Key.ARROW_LEFT);

  t.is(
    await blueSlider.getAttribute('aria-valuenow'),
    '254',
    'After sending 1 arrow left key to the blue slider, the value of the blue slider should be 254'
  );
  t.true(
    await testDisplayMatchesValue(t, '0, 0, 254'),
    'Display should match rgb(0, 0, 254)'
  );

  // Send more than 255 keys to blue slider
  for (let i = 0; i < 260; i++) {
    await blueSlider.sendKeys(Key.ARROW_LEFT);
  }

  t.is(
    await blueSlider.getAttribute('aria-valuenow'),
    '0',
    'After sending 260 arrow left key, the value of the blue slider should be 0'
  );
  t.true(
    await testDisplayMatchesValue(t, '0, 0, 0'),
    'Display should match rgb(0, 0, 0)'
  );
});

ariaTest('down arrow decreases slider value by 1', exampleFile, 'key-down-arrow', async (t) => {
  t.plan(12);

  await sendAllSlidersToEnd(t);

  const sliders = await t.context.session.findElements(By.css(ex.sliderSelector));

  // Send 1 key to red slider
  const redSlider = sliders[0];
  await redSlider.sendKeys(Key.ARROW_DOWN);

  t.is(
    await redSlider.getAttribute('aria-valuenow'),
    '254',
    'After sending 1 arrow down key to the red slider, the value of the red slider should be 254'
  );
  t.true(
    await testDisplayMatchesValue(t, '254, 255, 255'),
    'Display should match rgb(254, 255, 255)'
  );

  // Send more than 255 keys to red slider
  for (let i = 0; i < 260; i++) {
    await redSlider.sendKeys(Key.ARROW_DOWN);
  }

  t.is(
    await redSlider.getAttribute('aria-valuenow'),
    '0',
    'After sending 260 arrow down key, the value of the red slider should be 0'
  );
  t.true(
    await testDisplayMatchesValue(t, '0, 255, 255'),
    'Display should match rgb(0, 255, 255)'
  );

  // Send 1 key to green slider
  const greenSlider = sliders[1];
  await greenSlider.sendKeys(Key.ARROW_DOWN);

  t.is(
    await greenSlider.getAttribute('aria-valuenow'),
    '254',
    'After sending 1 arrow down key to the blue slider, the value of the green slider should be 254'
  );
  t.true(
    await testDisplayMatchesValue(t, '0, 254, 255'),
    'Display should match rgb(0, 254, 255)'
  );

  // Send more than 255 keys to green slider
  for (let i = 0; i < 260; i++) {
    await greenSlider.sendKeys(Key.ARROW_DOWN);
  }

  t.is(
    await greenSlider.getAttribute('aria-valuenow'),
    '0',
    'After sending 260 arrow down key, the value of the green slider should be 0'
  );
  t.true(
    await testDisplayMatchesValue(t, '0, 0, 255'),
    'Display should match rgb(0, 0, 255)'
  );

  // Send 1 key to blue slider
  const blueSlider = sliders[2];
  await blueSlider.sendKeys(Key.ARROW_DOWN);

  t.is(
    await blueSlider.getAttribute('aria-valuenow'),
    '254',
    'After sending 1 arrow down key to the blue slider, the value of the blue slider should be 254'
  );
  t.true(
    await testDisplayMatchesValue(t, '0, 0, 254'),
    'Display should match rgb(0, 0, 254)'
  );

  // Send more than 255 keys to blue slider
  for (let i = 0; i < 260; i++) {
    await blueSlider.sendKeys(Key.ARROW_DOWN);
  }

  t.is(
    await blueSlider.getAttribute('aria-valuenow'),
    '0',
    'After sending 260 arrow down key, the value of the blue slider should be 0'
  );
  t.true(
    await testDisplayMatchesValue(t, '0, 0, 0'),
    'Display should match rgb(0, 0, 0)'
  );
});

ariaTest('page down decreases slider value by 10', exampleFile, 'key-page-down', async (t) => {
  t.plan(12);

  await sendAllSlidersToEnd(t);

  const sliders = await t.context.session.findElements(By.css(ex.sliderSelector));

  // Send 1 key to red slider
  const redSlider = sliders[0];
  await redSlider.sendKeys(Key.PAGE_DOWN);

  t.is(
    await redSlider.getAttribute('aria-valuenow'),
    '245',
    'After sending 1 page down key to the red slider, the value of the red slider should be 245'
  );
  t.true(
    await testDisplayMatchesValue(t, '245, 255, 255'),
    'Display should match rgb(245, 255, 255)'
  );

  // Send more than 25 keys to red slider
  for (let i = 0; i < 26; i++) {
    await redSlider.sendKeys(Key.PAGE_DOWN);
  }

  t.is(
    await redSlider.getAttribute('aria-valuenow'),
    '0',
    'After sending 26 page down key, the value of the red slider should be 0'
  );
  t.true(
    await testDisplayMatchesValue(t, '0, 255, 255'),
    'Display should match rgb(0, 255, 255)'
  );

  // Send 1 key to green slider
  const greenSlider = sliders[1];
  await greenSlider.sendKeys(Key.PAGE_DOWN);

  t.is(
    await greenSlider.getAttribute('aria-valuenow'),
    '245',
    'After sending 1 page down key to the blue slider, the value of the green slider should be 245'
  );
  t.true(
    await testDisplayMatchesValue(t, '0, 245, 255'),
    'Display should match rgb(0, 245, 255)'
  );

  // Send more than 25 keys to green slider
  for (let i = 0; i < 26; i++) {
    await greenSlider.sendKeys(Key.PAGE_DOWN);
  }

  t.is(
    await greenSlider.getAttribute('aria-valuenow'),
    '0',
    'After sending 26 page down key, the value of the green slider should be 0'
  );
  t.true(
    await testDisplayMatchesValue(t, '0, 0, 255'),
    'Display should match rgb(0, 0, 255)'
  );

  // Send 1 key to blue slider
  const blueSlider = sliders[2];
  await blueSlider.sendKeys(Key.PAGE_DOWN);

  t.is(
    await blueSlider.getAttribute('aria-valuenow'),
    '245',
    'After sending 1 page down key to the blue slider, the value of the blue slider should be 245'
  );
  t.true(
    await testDisplayMatchesValue(t, '0, 0, 245'),
    'Display should match rgb(0, 0, 245)'
  );

  // Send more than 25 keys to blue slider
  for (let i = 0; i < 26; i++) {
    await blueSlider.sendKeys(Key.PAGE_DOWN);
  }

  t.is(
    await blueSlider.getAttribute('aria-valuenow'),
    '0',
    'After sending 26 page down key, the value of the blue slider should be 0'
  );
  t.true(
    await testDisplayMatchesValue(t, '0, 0, 0'),
    'Display should match rgb(0, 0, 0)'
  );
});

ariaTest('home set slider value to minimum', exampleFile, 'key-home', async (t) => {
  t.plan(6);

  const sliders = await t.context.session.findElements(By.css(ex.sliderSelector));

  await sendAllSlidersToEnd(t);

  // Send key end to red slider
  const redSlider = sliders[0];
  await redSlider.sendKeys(Key.HOME);

  t.is(
    await redSlider.getAttribute('aria-valuenow'),
    '0',
    'After sending 1 home key to the red slider, the value of the red slider should be 0'
  );
  t.true(
    await testDisplayMatchesValue(t, '0, 255, 255'),
    'Display should match rgb(0, 255, 255)'
  );

  // Send key home to green slider
  const greenSlider = sliders[1];
  await greenSlider.sendKeys(Key.HOME);

  t.is(
    await greenSlider.getAttribute('aria-valuenow'),
    '0',
    'After sending 1 home key to the blue slider, the value of the green slider should be 0'
  );
  t.true(
    await testDisplayMatchesValue(t, '0, 0, 255'),
    'Display should match rgb(0, 0, 255)'
  );

  // Send key home to blue slider
  const blueSlider = sliders[2];
  await blueSlider.sendKeys(Key.HOME);

  t.is(
    await blueSlider.getAttribute('aria-valuenow'),
    '0',
    'After sending 1 home key to the blue slider, the value of the blue slider should be 0'
  );
  t.true(
    await testDisplayMatchesValue(t, '0, 0, 0'),
    'Display should match rgb(0, 0, 0)'
  );
});
