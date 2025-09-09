const { ariaTest } = require('..');
const { By, Key, until } = require('selenium-webdriver');
const assertAttributeValues = require('../util/assertAttributeValues');
const assertAttributeDNE = require('../util/assertAttributeDNE');
const assertAriaRoles = require('../util/assertAriaRoles');
const translatePlatformKey = require('../util/translatePlatformKeys');

const exampleFile =
  'content/patterns/spinbutton/examples/quantity-spinbutton.html';

const BUFFER_VAL = 500; // until() buffer, in milliseconds

const ex = {
  spin: {
    id: 'adults',
    sel: '#adults',
    min: '1',
    max: '8',
    now: '1',
  },

  help: {
    id: 'help-adults',
  },

  error: {
    id: 'error-adults',
  },

  inc: {
    sel: '[aria-controls="adults"][data-spinbutton-operation="increment"]',
    accname: 'Add adult',
  },

  dec: {
    sel: '[aria-controls="adults"][data-spinbutton-operation="decrement"]',
    accname: 'Remove adult',
  },

  output: {
    sel: 'output[for="adults"]',
    selfDestruct: '2000',
  },
};

ex.inc.symbolSel = ex.inc.sel + ' > span';
ex.dec.symbolSel = ex.dec.sel + ' > span';
ex.inputScenarios = {
  0: { value: '0', valid: false },
  1: { value: '1', valid: true },
  4: { value: '4', valid: true },
  8: { value: '8', valid: true },
  13: { value: '13', valid: false },
  abc: { value: ex.spin.min, valid: true },
  '-7': { value: '7', valid: true },
  ' ': { value: ex.spin.min, valid: true },
};

// Attributes

ariaTest(
  'role="spinbutton" on input element',
  exampleFile,
  'spinbutton-role',
  async (t) => {
    await assertAriaRoles(t, 'example', 'spinbutton', '3', 'input');
  }
);

ariaTest(
  '"aria-valuemin" represents the minimum value on spinbuttons',
  exampleFile,
  'spinbutton-aria-valuemin',
  async (t) => {
    await assertAttributeValues(t, ex.spin.sel, 'aria-valuemin', ex.spin.min);
  }
);

ariaTest(
  '"aria-valuemax" represents the maximum value on spinbuttons',
  exampleFile,
  'spinbutton-aria-valuemax',
  async (t) => {
    await assertAttributeValues(t, ex.spin.sel, 'aria-valuemax', ex.spin.max);
  }
);

ariaTest(
  '"aria-valuenow" reflects spinbutton value as a number',
  exampleFile,
  'spinbutton-aria-valuenow',
  async (t) => {
    await assertAttributeValues(t, ex.spin.sel, 'aria-valuenow', ex.spin.now);
  }
);

ariaTest(
  '"aria-describedby" is used to provide help text for the spinbutton.',
  exampleFile,
  'spinbutton-aria-describedby',
  async (t) => {
    await assertAttributeValues(t, ex.spin.sel, 'aria-describedby', ex.help.id);
  }
);

ariaTest(
  '"aria-errormessage" is used to provide an error message for the spinbutton.',
  exampleFile,
  'spinbutton-aria-errormessage',
  async (t) => {
    await assertAttributeValues(
      t,
      ex.spin.sel,
      'aria-errormessage',
      ex.error.id
    );
  }
);

ariaTest(
  '"tabindex=-1" removes increment and decrement buttons from page tab order',
  exampleFile,
  'button-tabindex',
  async (t) => {
    await assertAttributeValues(t, ex.inc.sel, 'tabindex', '-1');
    await assertAttributeValues(t, ex.dec.sel, 'tabindex', '-1');
  }
);

ariaTest(
  'increment and decrement buttons use aria-controls to reference spinner',
  exampleFile,
  'button-aria-controls',
  async (t) => {
    await assertAttributeValues(t, ex.inc.sel, 'aria-controls', ex.spin.id);
    await assertAttributeValues(t, ex.dec.sel, 'aria-controls', ex.spin.id);
  }
);

ariaTest(
  '"title" provides accessible name for the increment and decrement buttons',
  exampleFile,
  'button-title',
  async (t) => {
    await assertAttributeValues(t, ex.inc.sel, 'title', ex.inc.accname);
    await assertAttributeValues(t, ex.dec.sel, 'title', ex.dec.accname);
  }
);

ariaTest(
  '"aria-hidden" hides symbolic accname equivalent from screen reader users',
  exampleFile,
  'span-aria-hidden',
  async (t) => {
    await assertAttributeValues(t, ex.inc.symbolSel, 'aria-hidden', 'true');
    await assertAttributeValues(t, ex.dec.symbolSel, 'aria-hidden', 'true');
  }
);

ariaTest('output element exists', exampleFile, 'output', async (t) => {
  let output = await t.context.queryElements(t, ex.output.sel);

  t.is(
    output.length,
    1,
    'One output element should be found by selector: ' + ex.output.sel
  );
});

// keys

ariaTest('end', exampleFile, 'spinbutton-end', async (t) => {
  const spinner = await t.context.session.findElement(By.css(ex.spin.sel));
  const max = parseInt(ex.spin.max);

  // Send end key
  await spinner.sendKeys(Key.END);
  t.is(
    parseInt(await spinner.getAttribute('aria-valuenow')),
    max,
    `After sending end key, aria-valuenow should be the maximum value: ${max}`
  );

  // Check that the decrement button is not disabled.
  await assertAttributeDNE(t, ex.dec.sel, 'aria-disabled');

  // Check that the increment button is disabled.
  await assertAttributeValues(t, ex.inc.sel, 'aria-disabled', 'true');
});

ariaTest('home', exampleFile, 'spinbutton-home', async (t) => {
  const spinner = await t.context.session.findElement(By.css(ex.spin.sel));
  const min = parseInt(ex.spin.min);

  // Send home key
  await spinner.sendKeys(Key.HOME);
  t.is(
    parseInt(await spinner.getAttribute('aria-valuenow')),
    min,
    `After sending home key, aria-valuenow should be the minimum value: ${min}`
  );

  // Check that the decrement button is disabled.
  await assertAttributeValues(t, ex.dec.sel, 'aria-disabled', 'true');

  // Check that the increment button is not disabled.
  await assertAttributeDNE(t, ex.inc.sel, 'aria-disabled');
});

ariaTest('up arrow', exampleFile, 'spinbutton-up-arrow', async (t) => {
  const spinner = await t.context.session.findElement(By.css(ex.spin.sel));
  const min = parseInt(ex.spin.min);
  const max = parseInt(ex.spin.max);
  let val = min;

  // Send home key
  await spinner.sendKeys(Key.HOME);

  // Send arrow keys up to and including the maximum value.
  while (++val <= max) {
    await spinner.sendKeys(Key.ARROW_UP);

    // Check that aria-valuenow is updated correctly.
    t.is(
      parseInt(await spinner.getAttribute('aria-valuenow')),
      val,
      `After sending ${val - 1} up arrows, aria-valuenow should be ${val}`
    );
  }

  // Check that the decrement button is no longer disabled.
  await assertAttributeDNE(t, ex.dec.sel, 'aria-disabled');

  // Check that the increment button is now disabled.
  await assertAttributeValues(t, ex.inc.sel, 'aria-disabled', 'true');

  // Send one more and check that aria-valuenow remains at the maximum value.
  await spinner.sendKeys(Key.ARROW_UP);
  t.is(
    parseInt(await spinner.getAttribute('aria-valuenow')),
    max,
    `After sending one more up arrow, aria-valuenow should still be ${max}`
  );

  // Check that the decrement button is still not disabled
  await assertAttributeDNE(t, ex.dec.sel, 'aria-disabled');

  // Check that the increment button is still disabled
  await assertAttributeValues(t, ex.inc.sel, 'aria-disabled', 'true');
});

ariaTest('down arrow', exampleFile, 'spinbutton-down-arrow', async (t) => {
  const spinner = await t.context.session.findElement(By.css(ex.spin.sel));
  const min = parseInt(ex.spin.min);
  const max = parseInt(ex.spin.max);
  let val = max;

  // Send end key
  await spinner.sendKeys(Key.END);

  // Send arrow keys down to and including the minimum value.
  while (--val >= min) {
    await spinner.sendKeys(Key.ARROW_DOWN);

    // Check that aria-valuenow is updated correctly.
    t.is(
      parseInt(await spinner.getAttribute('aria-valuenow')),
      val,
      `After sending ${val + 1} down arrows, aria-valuenow should be ${val}`
    );
  }

  // Check that the decrement button is now disabled.
  await assertAttributeValues(t, ex.dec.sel, 'aria-disabled', 'true');

  // Check that the increment button is no longer disabled.
  await assertAttributeDNE(t, ex.inc.sel, 'aria-disabled');

  // Send one more and check that aria-valuenow remains at the maximum value.
  await spinner.sendKeys(Key.ARROW_DOWN);
  t.is(
    parseInt(await spinner.getAttribute('aria-valuenow')),
    min,
    `After sending one more up arrow, aria-valuenow should still be ${min}`
  );

  // Check that the decrement button is still disabled.
  await assertAttributeValues(t, ex.dec.sel, 'aria-disabled', 'true');

  // Check that the increment button is still not disabled.
  await assertAttributeDNE(t, ex.inc.sel, 'aria-disabled');
});

// text input

ariaTest(
  'Expected behavior for direct input of numeric values',
  exampleFile,
  'standard-single-line-editing-keys',
  async (t) => {
    const spinner = await t.context.session.findElement(By.css(ex.spin.sel));
    const min = parseInt(ex.spin.min);
    const max = parseInt(ex.spin.max);
    const selectAllKeys = translatePlatformKey([Key.CONTROL, 'a']);
    const selectAllChord = Key.chord(...selectAllKeys);

    for (const inputScenario of Object.entries(ex.inputScenarios)) {
      const [input, expected] = inputScenario;
      const [val, valid] = Object.values(expected);

      // Input the value
      await spinner.clear();
      await spinner.sendKeys(selectAllChord);
      await spinner.sendKeys(input);

      // Force blur after input
      await t.context.session.executeScript((el) => el.blur(), spinner);

      // Check that aria-valuenow is updated correctly.
      t.is(
        parseInt(await spinner.getAttribute('aria-valuenow')),
        parseInt(val),
        `After inputting “${input}”, aria-valuenow should be ${val}`
      );

      // Check that the input has the expected aria-invalid state.
      if (!valid) {
        await assertAttributeValues(t, ex.spin.sel, 'aria-invalid', 'true');
      } else {
        await assertAttributeDNE(t, ex.spin.sel, 'aria-invalid');
      }

      // Check that the decrement button has the expected aria-disabled state.
      if (parseInt(val) <= parseInt(min)) {
        await assertAttributeValues(t, ex.dec.sel, 'aria-disabled', 'true');
      } else {
        await assertAttributeDNE(t, ex.dec.sel, 'aria-disabled');
      }

      // Check that the increment button has the expected aria-disabled state.
      if (parseInt(val) >= parseInt(max)) {
        await assertAttributeValues(t, ex.inc.sel, 'aria-disabled', 'true');
      } else {
        await assertAttributeDNE(t, ex.inc.sel, 'aria-disabled');
      }
    }
  }
);

// increment and decrement buttons

ariaTest('increment button', exampleFile, 'increment-button', async (t) => {
  const spinner = await t.context.session.findElement(By.css(ex.spin.sel));
  const output = await t.context.session.findElement(By.css(ex.output.sel));
  const button = await t.context.session.findElement(By.css(ex.inc.sel));
  const min = parseInt(ex.spin.min);
  const max = parseInt(ex.spin.max);
  let val = min;

  // Send home key
  await spinner.sendKeys(Key.HOME);

  // Click increment button up to and including the maximum value.
  while (++val <= max) {
    await button.click();

    // Check that aria-valuenow is updated correctly.
    t.is(
      parseInt(await spinner.getAttribute('aria-valuenow')),
      val,
      `After clicking ${val - 1} times, aria-valuenow should be ${val}`
    );

    // Check that the output element has the expected value.
    t.is(
      await output.getText(),
      String(val),
      `After clicking ${val - 1} times, output should be ${val}`
    );
  }

  // Check that the decrement button is no longer disabled.
  await assertAttributeDNE(t, ex.dec.sel, 'aria-disabled');

  // Check that the increment button is now disabled.
  await assertAttributeValues(t, ex.inc.sel, 'aria-disabled', 'true');

  // Send one more and check that aria-valuenow remains at the maximum value.
  await button.click();
  t.is(
    parseInt(await spinner.getAttribute('aria-valuenow')),
    max,
    `After clicking once more, aria-valuenow should still be ${max}`
  );

  // Check that the output element has the expected value.
  t.is(
    await output.getText(),
    String(max),
    `After clicking once more, output should still be ${max}`
  );

  // Check that the decrement button is still not disabled
  await assertAttributeDNE(t, ex.dec.sel, 'aria-disabled');

  // Check that the increment button is still disabled
  await assertAttributeValues(t, ex.inc.sel, 'aria-disabled', 'true');

  // Wait for the output to self-destruct
  await t.context.session.wait(
    until.elementTextIs(output, ''),
    output.selfDestruct + BUFFER_VAL
  );
  t.pass('After waiting for the output self-destruct timer, output is empty');
});

ariaTest('decrement button', exampleFile, 'decrement-button', async (t) => {
  const spinner = await t.context.session.findElement(By.css(ex.spin.sel));
  const output = await t.context.session.findElement(By.css(ex.output.sel));
  const button = await t.context.session.findElement(By.css(ex.dec.sel));
  const min = parseInt(ex.spin.min);
  const max = parseInt(ex.spin.max);
  let val = max;

  // Send end key
  await spinner.sendKeys(Key.END);

  // Click decrement button down to and including the minimum value.
  while (--val >= min) {
    await button.click();

    // Check that aria-valuenow is updated correctly.
    t.is(
      parseInt(await spinner.getAttribute('aria-valuenow')),
      val,
      `After clicking ${val + 1} times, aria-valuenow should be ${val}`
    );

    // Check that the output element has the expected value.
    t.is(
      await output.getText(),
      String(val),
      `After clicking ${val + 1} times, output should be ${val}`
    );
  }

  // Check that the decrement button is now disabled.
  await assertAttributeValues(t, ex.dec.sel, 'aria-disabled', 'true');

  // Check that the increment button is no longer disabled.
  await assertAttributeDNE(t, ex.inc.sel, 'aria-disabled');

  // Send one more and check that aria-valuenow remains at the maximum value.
  await button.click();
  t.is(
    parseInt(await spinner.getAttribute('aria-valuenow')),
    min,
    `After clicking once more, aria-valuenow should still be ${min}`
  );

  // Check that the output element has the expected value.
  t.is(
    await output.getText(),
    String(min),
    `After clicking once more, output should still be ${min}`
  );

  // Check that the decrement button is still disabled
  await assertAttributeValues(t, ex.dec.sel, 'aria-disabled', 'true');

  // Check that the increment button is still not disabled
  await assertAttributeDNE(t, ex.inc.sel, 'aria-disabled');

  // Wait for the output to self-destruct
  await t.context.session.wait(
    until.elementTextIs(output, ''),
    output.selfDestruct + BUFFER_VAL
  );
  t.pass('After waiting for the output self-destruct timer, output is empty');
});
