'use strict';

const { ariaTest } = require('..');
const { By, Key } = require('selenium-webdriver');
const assertAttributeValues = require('../util/assertAttributeValues');
const assertAriaLabelledby = require('../util/assertAriaLabelledby');
const assertAriaRoles = require('../util/assertAriaRoles');
const assertRovingTabindex = require('../util/assertRovingTabindex');
const assertTabOrder = require('../util/assertTabOrder');

const exampleFile = 'radio/radio-1/radio-1.html';

const ex = {
  radiogroupSelector: '#ex1 [role="radiogroup"]',
  radioSelector: '#ex1 [role="radio"]',
  innerRadioSelector: '[role="radio"]',
  crustRadioSelector: '#ex1 [role="radiogroup"]:nth-of-type(1) [role="radio"]',
  deliveryRadioSelector: '#ex1 [role="radiogroup"]:nth-of-type(2) [role="radio"]'
};

const checkFocus = async function (t, selector, index) {
  return t.context.session.executeScript(function () {
    const [selector, index] = arguments;
    const items = document.querySelectorAll(selector);
    return items[index] === document.activeElement;
  }, selector, index);
};

// Attributes

ariaTest('role="radigroup" on div element', exampleFile, 'radiogroup-role', async (t) => {
  t.plan(1);
  await assertAriaRoles(t, 'ex1', 'radiogroup', '2', 'div');
});

ariaTest('"aria-labelledby" attribute on radiogroup', exampleFile, 'radiogroup-aria-labelledby', async (t) => {
  t.plan(1);
  await assertAriaLabelledby(t, 'ex1', ex.radiogroupSelector);
});

ariaTest('role="radio" on div elements', exampleFile, 'radio-role', async (t) => {
  t.plan(1);
  await assertAriaRoles(t, 'ex1', 'radio', '6', 'div');
});

ariaTest('roving tabindex on radio elements', exampleFile, 'radio-tabindex', async (t) => {
  t.plan(2);

  // Test first radio group
  let radios = ex.radiogroupSelector + ':nth-of-type(1) ' + ex.innerRadioSelector;
  await assertRovingTabindex(t, radios, Key.ARROW_RIGHT);

  // Test second radio group
  radios = ex.radiogroupSelector + ':nth-of-type(2) ' + ex.innerRadioSelector;
  await assertRovingTabindex(t, radios, Key.ARROW_RIGHT);
});

ariaTest('"aria-checked" set on role="radio"', exampleFile, 'radio-aria-checked', async (t) => {
  t.plan(19);

  // The radio groups will be all unchecked on page load
  await assertAttributeValues(t, 'ex1', ex.radioSelector, 'aria-checked', 'false');

  const radiogroups = await t.context.session.findElements(By.css(ex.radiogroupSelector));
  for (let radiogroup of radiogroups) {
    let radios = await radiogroup.findElements(By.css(ex.innerRadioSelector));

    for (let checked = 0; checked < radios.length; checked++) {

      await radios[checked].click();
      for (let el = 0; el < radios.length; el++) {

        // test only one element has aria-checked="true"
        let isChecked = el === checked ? 'true' : 'false';
        t.is(
          await radios[el].getAttribute('aria-checked'),
          isChecked,
          'Tab at index ' + checked + ' is checked, therefore, tab at index ' +
            el + ' should have aria-checked="' + checked + '"'
        );
      }
    }
  }
});

ariaTest('Moves focus to first or checked item', exampleFile, 'key-tab', async (t) => {
  t.plan(2);

  // On page load, the first item in the radio list should be in tab index
  await assertTabOrder(t, [
    ex.crustRadioSelector + ':nth-of-type(1)',
    ex.deliveryRadioSelector + ':nth-of-type(1)'
  ]);

  // Click the second item in each radio list, to set roving tab index
  await t.context.session
    .findElement(By.css(ex.crustRadioSelector + ':nth-of-type(2)')).click();
  await t.context.session
    .findElement(By.css(ex.deliveryRadioSelector + ':nth-of-type(2)')).click();

  await assertTabOrder(t, [
    ex.crustRadioSelector + ':nth-of-type(2)',
    ex.deliveryRadioSelector + ':nth-of-type(2)'
  ]);
});

ariaTest('Selects radio item', exampleFile, 'key-space', async (t) => {
  t.plan(2);

  const firstCrustSelector = ex.crustRadioSelector + ':nth-of-type(1)';
  await t.context.session.findElement(By.css(firstCrustSelector)).sendKeys(Key.SPACE);
  await assertAttributeValues(t, 'ex1', firstCrustSelector, 'aria-checked', 'true');

  const firstDeliverySelector = ex.deliveryRadioSelector + ':nth-of-type(1)';
  await t.context.session.findElement(By.css(firstDeliverySelector)).sendKeys(Key.SPACE);
  await assertAttributeValues(t, 'ex1', firstDeliverySelector, 'aria-checked', 'true');

});

ariaTest('RIGHT ARROW changes focus and checks radio', exampleFile, 'key-right-arrow', async (t) => {
  t.plan(6);

  let radios = await t.context.session.findElements(By.css(ex.crustRadioSelector));

  // Right arrow moves focus to right
  for (let index = 0; index < radios.length - 1; index++) {
    await radios[index].sendKeys(Key.ARROW_RIGHT);
    const newindex = index + 1;

    t.true(
      await checkFocus(t, ex.crustRadioSelector, newindex),
      'Focus should be on radio at index ' + newindex + ' after ARROW_RIGHT to radio' +
        ' at index '+ index
    );
    t.is(
      await radios[newindex].getAttribute('aria-checked'),
      'true',
      'Radio at index ' + newindex + ' should be checked after ARROW_RIGHT to radio' +
        ' at index ' + index
    );
  }

  // Right arrow should move focus from last item to first
  await radios[radios.length-1].sendKeys(Key.ARROW_RIGHT);
  t.true(
    await checkFocus(t, ex.crustRadioSelector, 0),
    'Focus should be on radio at index 0 after ARROW_RIGHT to radio at index ' + (radios.length-1)
  );
  t.is(
    await radios[0].getAttribute('aria-checked'),
    'true',
    'Radio at index 0 should be checked after ARROW_RIGHT to radio at index ' + (radios.length-1)
  );
});

ariaTest('DOWN ARROW changes focus and checks radio', exampleFile, 'key-down-arrow', async (t) => {
  t.plan(6);

  let radios = await t.context.session.findElements(By.css(ex.crustRadioSelector));

  // Down arrow moves focus to down
  for (let index = 0; index < radios.length - 1; index++) {
    await radios[index].sendKeys(Key.ARROW_DOWN);
    const newindex = index + 1;

    t.true(
      await checkFocus(t, ex.crustRadioSelector, newindex),
      'Focus should be on radio at index ' + newindex + ' after ARROW_DOWN to radio' +
        ' at index '+ index
    );
    t.is(
      await radios[newindex].getAttribute('aria-checked'),
      'true',
      'Radio at index ' + newindex + ' should be checked after ARROW_DOWN to radio' +
        ' at index ' + index
    );
  }

  // Down arrow should move focus from last item to first
  await radios[radios.length-1].sendKeys(Key.ARROW_DOWN);
  t.true(
    await checkFocus(t, ex.crustRadioSelector, 0),
    'Focus should be on radio at index 0 after ARROW_DOWN to radio at index ' + (radios.length-1)
  );
  t.is(
    await radios[0].getAttribute('aria-checked'),
    'true',
    'Radio at index 0 should be checked after ARROW_DOWN to radio at index ' + (radios.length-1)
  );
});

ariaTest('LEFT ARROW changes focus and checks radio', exampleFile, 'key-left-arrow', async (t) => {
  t.plan(6);

  let radios = await t.context.session.findElements(By.css(ex.crustRadioSelector));

  // Left arrow should move focus from first item to last, then progressively left
  await radios[0].sendKeys(Key.ARROW_LEFT);

  t.true(
    await checkFocus(t, ex.crustRadioSelector, radios.length-1),
    'Focus should be on radio at index ' + (radios.length-1) + ' after ARROW_LEFT to radio at index 0'
  );
  t.is(
    await radios[radios.length-1].getAttribute('aria-checked'),
    'true',
    'Radio at index ' + (radios.length-1) + ' should be checked after ARROW_LEFT to radio at index 0'
  );


  for (let index = radios.length-1; index > 0 ; index--) {
    await radios[index].sendKeys(Key.ARROW_LEFT);
    const newindex = index - 1;

    t.true(
      await checkFocus(t, ex.crustRadioSelector, newindex),
      'Focus should be on radio at index ' + newindex + ' after ARROW_LEFT to radio' +
        ' at index '+ index
    );
    t.is(
      await radios[newindex].getAttribute('aria-checked'),
      'true',
      'Radio at index ' + newindex + ' should be checked after ARROW_LEFT to radio' +
        ' at index ' + index
    );
  }
});

ariaTest('UP ARROW changes focus and checks radio', exampleFile, 'key-up-arrow', async (t) => {
  t.plan(6);

  let radios = await t.context.session.findElements(By.css(ex.crustRadioSelector));

  // Up arrow should move focus from first item to last, then progressively up
  await radios[0].sendKeys(Key.ARROW_UP);

  t.true(
    await checkFocus(t, ex.crustRadioSelector, radios.length-1),
    'Focus should be on radio at index ' + (radios.length-1) + ' after ARROW_UP to radio at index 0'
  );
  t.is(
    await radios[radios.length-1].getAttribute('aria-checked'),
    'true',
    'Radio at index ' + (radios.length-1) + ' should be checked after ARROW_UP to radio at index 0'
  );


  for (let index = radios.length-1; index > 0 ; index--) {
    await radios[index].sendKeys(Key.ARROW_UP);
    const newindex = index - 1;

    t.true(
      await checkFocus(t, ex.crustRadioSelector, newindex),
      'Focus should be on radio at index ' + newindex + ' after ARROW_UP to radio' +
        ' at index '+ index
    );
    t.is(
      await radios[newindex].getAttribute('aria-checked'),
      'true',
      'Radio at index ' + newindex + ' should be checked after ARROW_UP to radio' +
        ' at index ' + index
    );
  }
});
