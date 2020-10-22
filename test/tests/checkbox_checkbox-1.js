'use strict';

const { ariaTest } = require('..');
const { By, Key } = require('selenium-webdriver');
const assertAttributeValues = require('../util/assertAttributeValues');
const assertAriaLabelledby = require('../util/assertAriaLabelledby');
const assertAriaRoles = require('../util/assertAriaRoles');
const assertTabOrder = require('../util/assertTabOrder');

const exampleFile = 'checkbox/checkbox-1/checkbox-1.html';

const ex = {
  groupSelector: '#ex1 [role="group"]',
  checkboxSelector: '#ex1 [role="checkbox"]',
  checkboxes: [
    '#ex1 li:nth-of-type(1) [role="checkbox"]',
    '#ex1 li:nth-of-type(2) [role="checkbox"]',
    '#ex1 li:nth-of-type(3) [role="checkbox"]',
    '#ex1 li:nth-of-type(4) [role="checkbox"]',
  ],
  defaultSelectedCheckboxes: ['#ex1 li:nth-of-type(2) [role="checkbox"]'],
};

const waitAndCheckAriaChecked = async function (t, selector, value) {
  return t.context.session
    .wait(
      async function () {
        let checkbox = await t.context.session.findElement(By.css(selector));
        return (await checkbox.getAttribute('aria-checked')) === value;
      },
      t.context.waitTime,
      'Timeout: aria-checked is not set to "' + value + '" for: ' + selector
    )
    .catch((err) => {
      return err;
    });
};

const checkVisuallyChecked = async function (t, selector, checked) {
  let expectedBackgroundColor = checked
    ? 'rgb(96, 155, 251)'
    : 'rgba(0, 0, 0, 0)';

  let background = await t.context.session.executeScript(function () {
    const [selector] = arguments;
    return window
      .getComputedStyle(document.querySelector(selector), ':before')
      .getPropertyValue('background-color');
  }, selector);

  return background === expectedBackgroundColor;
};

const uncheckAllSelectedByDefault = async function (t) {
  for (let checkboxSelector of ex.defaultSelectedCheckboxes) {
    await t.context.session.findElement(By.css(checkboxSelector)).click();
  }
};

// Attributes

ariaTest('element h3 exists', exampleFile, 'h3', async (t) => {
  let header = await t.context.queryElements(t, '#ex1 h3');

  t.is(
    header.length,
    1,
    'One h3 element exist within the example to label the checkboxes'
  );

  t.truthy(
    await header[0].getText(),
    'One h3 element exist with readable content within the example to label the checkboxes'
  );
});

ariaTest(
  'role="group" element exists',
  exampleFile,
  'group-role',
  async (t) => {
    await assertAriaRoles(t, 'ex1', 'group', '1', 'div');
  }
);

ariaTest(
  '"aria-labelledby" on group element',
  exampleFile,
  'group-aria-labelledby',
  async (t) => {
    await assertAriaLabelledby(t, ex.groupSelector);
  }
);

ariaTest(
  'role="checkbox" elements exist',
  exampleFile,
  'checkbox-role',
  async (t) => {
    await assertAriaRoles(t, 'ex1', 'checkbox', '4', 'div');

    // Test that each checkbox has an accessible name
    // In this case, the accessible name is the text within the div
    let checkboxes = await t.context.queryElements(t, ex.checkboxSelector);

    for (let index = 0; index < checkboxes.length; index++) {
      let text = await checkboxes[index].getText();
      t.true(
        typeof text === 'string' && text.length > 0,
        'checkbox div at index: ' +
          index +
          ' should have contain text describing the textbox'
      );
    }
  }
);

ariaTest(
  'tabindex="0" for checkbox elements',
  exampleFile,
  'checkbox-tabindex',
  async (t) => {
    await assertAttributeValues(t, ex.checkboxSelector, 'tabindex', '0');
  }
);

ariaTest(
  '"aria-checked" on checkbox element',
  exampleFile,
  'checkbox-aria-checked',
  async (t) => {
    await uncheckAllSelectedByDefault(t);

    // check the aria-checked attribute is false to begin
    await assertAttributeValues(
      t,
      ex.checkboxSelector,
      'aria-checked',
      'false'
    );

    // check that the visual indicator matches the checked state (unchecked)
    for (let checkboxSelector of ex.checkboxes) {
      t.true(
        await checkVisuallyChecked(t, checkboxSelector, false),
        'All checkboxes should be visually checked'
      );
    }

    // Click all checkboxes to select them
    let checkboxes = await t.context.queryElements(t, ex.checkboxSelector);
    for (let checkbox of checkboxes) {
      await checkbox.click();
    }

    // check the aria-checked attribute has been updated to true
    await assertAttributeValues(t, ex.checkboxSelector, 'aria-checked', 'true');

    // check that the visual indicator matches the checked state (checked)
    for (let checkboxSelector of ex.checkboxes) {
      t.true(
        await checkVisuallyChecked(t, checkboxSelector, true),
        'All checkboxes should be visually checked'
      );
    }
  }
);

ariaTest(
  'key TAB moves focus between checkboxes',
  exampleFile,
  'key-tab',
  async (t) => {
    await assertTabOrder(t, ex.checkboxes);
  }
);

ariaTest(
  'key SPACE selects or unselects checkbox',
  exampleFile,
  'key-space',
  async (t) => {
    await uncheckAllSelectedByDefault(t);

    for (let checkboxSelector of ex.checkboxes) {
      // Send SPACE key to check box to select
      await t.context.session
        .findElement(By.css(checkboxSelector))
        .sendKeys(Key.SPACE);

      t.true(
        await waitAndCheckAriaChecked(t, checkboxSelector, 'true'),
        'aria-selected should be set after sending SPACE key to checkbox: ' +
          checkboxSelector
      );

      t.true(
        await checkVisuallyChecked(t, checkboxSelector, true),
        'checkbox should be visual checked after sending SPACE key to checkbox: ' +
          checkboxSelector
      );

      // Send SPACE key to check box to unselect
      await t.context.session
        .findElement(By.css(checkboxSelector))
        .sendKeys(Key.SPACE);

      t.true(
        await waitAndCheckAriaChecked(t, checkboxSelector, 'false'),
        'aria-selected should be set after sending SPACE key to checkbox: ' +
          checkboxSelector
      );

      t.true(
        await checkVisuallyChecked(t, checkboxSelector, false),
        'checkbox should be visual checked after sending SPACE key to checkbox: ' +
          checkboxSelector
      );
    }
  }
);
