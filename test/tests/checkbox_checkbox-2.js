'use strict';

const { ariaTest } = require('..');
const { By, Key } = require('selenium-webdriver');
const assertAttributeValues = require('../util/assertAttributeValues');
const assertAriaRoles = require('../util/assertAriaRoles');
const assertTabOrder = require('../util/assertTabOrder');

const exampleFile = 'checkbox/checkbox-2/checkbox-2.html';

const ex = {
  checkboxSelector: '#ex1 [role="checkbox"]',
  condimentsSelector: '#ex1 input[type="checkbox"]',
  checkedCondsSelector: '#ex1 [type="checkbox"]:checked',
  allCheckboxes: [
    '#ex1 [role="checkbox"]',
    '#ex1 #cond1',
    '#ex1 #cond2',
    '#ex1 #cond3',
    '#ex1 #cond4'
  ],
  numCondiments: 4
};

const uncheckAllConds = async function (t) {
  const checkboxes = await t.context.queryElements(t, ex.checkedCondsSelector);
  for (let checkbox of checkboxes) {
    await checkbox.click();
  }
};

// Attributes

ariaTest('role="checkbox" element exists', exampleFile, 'checkbox-role', async (t) => {
    await assertAriaRoles(t, 'ex1', 'checkbox', '1', 'div');
});

ariaTest('"tabindex" on checkbox element', exampleFile, 'checkbox-tabindex', async (t) => {
    await assertAttributeValues(t, ex.checkboxSelector, 'tabindex', '0');
});

ariaTest('"aria-controls" ', exampleFile, 'checkbox-aria-controls', async (t) => {
  
  const checkbox = await t.context.session.findElement(By.css(ex.checkboxSelector));
  const controls = (await checkbox.getAttribute('aria-controls')).split(' ');

  t.is(
    controls.length,
    ex.numCondiments,
    'The attribute "aria-controls" should have ' + ex.numCondiments + ' values seperated by spaces'
  );

  for (let id of controls) {
    t.is(
      (await t.context.session.findElements(By.id(id))).length,
      1,
      'An element with id ' + id + ' should exist'
    );
  }
});

ariaTest('"aria-checked" on checkbox element', exampleFile, 'checkbox-aria-checked-false', async (t) => {
  
  await uncheckAllConds(t);
  let checkbox = t.context.session.findElement(By.css(ex.checkboxSelector));

  t.is(
    await checkbox.getAttribute('aria-checked'),
    'false',
    'The control checkbox should have attribute aria-checked = "false" when not condiments are checked via manually unchecking all boxes'
  );

  // Click the checkbox twice to cycle it back to checked='false'
  await checkbox.click();
  await checkbox.click();

  // Make sure all condiments are still not selected
  t.is(
    await checkbox.getAttribute('aria-checked'),
    'false',
    'The control checkbox should have attribute aria-checked = "false" after clicking checkbox twice (with no parially checked state)'
  );

  t.is(
    (await t.context.session.findElements(By.css(ex.checkedCondsSelector))).length,
    0,
    'No condiments should be selected via: ' + ex.checkedCondsSelector
  );

});

ariaTest('"aria-checked" on checkbox element', exampleFile, 'checkbox-aria-checked-mixed', async (t) => {
  
  await uncheckAllConds(t);
  let checkbox = t.context.session.findElement(By.css(ex.checkboxSelector));

  // Check one box
  const condiments = await t.context.queryElements(t, ex.condimentsSelector);
  await condiments[0].click();

  t.is(
    await checkbox.getAttribute('aria-checked'),
    'mixed',
    'The control checkbox should have attribute aria-checked = "mixed" when only some condiments are checked'
  );

  // Click the checkbox three times to cycle it back to checked='true'
  await checkbox.click();
  await checkbox.click();
  await checkbox.click();

  // Make sure all condiments are still not selected
  t.is(
    await checkbox.getAttribute('aria-checked'),
    'mixed',
    'The control checkbox should have attribute aria-checked = "mixed" after clicking checkbox three times'
  );

  t.is(
    (await t.context.queryElements(t, ex.checkedCondsSelector)).length,
    1,
    '1 condiments should be selected via: ' + ex.checkedCondsSelector
  );
});

ariaTest('"aria-checked" on checkbox element', exampleFile, 'checkbox-aria-checked-true', async (t) => {
  
  await uncheckAllConds(t);
  let checkbox = t.context.session.findElement(By.css(ex.checkboxSelector));

  // Check the all boxes
  const condiments = await t.context.queryElements(t, ex.condimentsSelector);
  for (let cond of condiments) {
    await cond.click();
  }

  t.is(
    await checkbox.getAttribute('aria-checked'),
    'true',
    'The control checkbox should have attribute aria-checked = "true" when only some condiments are checked'
  );

  // Click the checkbox twice to cycle it back to checked='true'
  await checkbox.click();
  await checkbox.click();

  // Make sure all condiments are still selected
  t.is(
    await checkbox.getAttribute('aria-checked'),
    'true',
    'The control checkbox should have attribute aria-checked = "true" after clicking checkbox twice (with no parially checked state)'
  );

  t.is(
    (await t.context.queryElements(t, ex.checkedCondsSelector)).length,
    ex.numCondiments,
    ex.numCondiments + ' condiments should be selected via: ' + ex.checkedCondsSelector
  );
});

ariaTest('key TAB moves focus between checkboxes', exampleFile, 'key-tab', async (t) => {
  
  await assertTabOrder(t, ex.allCheckboxes);
});

ariaTest('key SPACE selects or unselects checkbox', exampleFile, 'key-space', async (t) => {
  
  // Check one box
  await uncheckAllConds(t);
  const condiments = await t.context.queryElements(t, ex.condimentsSelector);
  await condiments[0].click();

  // Send SPACE key to checkbox to change state
  let checkbox = t.context.session.findElement(By.css(ex.checkboxSelector));
  await checkbox.sendKeys(Key.SPACE);

  // Check that the state
  t.is(
    await checkbox.getAttribute('aria-checked'),
    'true',
    'After sending SPACE to the checkbox in a mixed state, aria-checked should equal "true"'
  );

  t.is(
    (await t.context.queryElements(t, ex.checkedCondsSelector)).length,
    ex.numCondiments,
    'After sending SPACE to the checkbox in a mixed state, ' + ex.numCondiments + ' condiments should be selected via: ' + ex.checkedCondsSelector
  );

  // Send SPACE key to checkbox to change state
  await checkbox.sendKeys(Key.SPACE);

  // Check that the state
  t.is(
    await checkbox.getAttribute('aria-checked'),
    'false',
    'After sending SPACE to the checkbox in a all-checked state, aria-checked should equal "false"'
  );

  t.is(
    (await t.context.session.findElements(By.css(ex.checkedCondsSelector))).length,
    0,
    'After sending SPACE to the checkbox in a check state, 0 condiments should be selected via: ' + ex.checkedCondsSelector
  );

  // Send SPACE key to checkbox to change state
  await checkbox.sendKeys(Key.SPACE);

  // Check that the state
  t.is(
    await checkbox.getAttribute('aria-checked'),
    'mixed',
    'After sending SPACE to the checkbox in an all-unchecked state, aria-checked should equal "mixed"'
  );

  t.is(
    (await t.context.queryElements(t, ex.checkedCondsSelector)).length,
    1,
    'After sending SPACE to the checkbox in a uncheck state, 1 condiments should be selected via: ' + ex.checkedCondsSelector
  );
});
