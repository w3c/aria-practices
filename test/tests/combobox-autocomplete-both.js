'use strict';

const { ariaTest } = require('..');
const { By, Key } = require('selenium-webdriver');
const assertAttributeValues = require('../util/assertAttributeValues');
const assertAttributeDNE = require('../util/assertAttributeDNE');
const assertAriaLabelledby = require('../util/assertAriaLabelledby');
const assertAriaRoles = require('../util/assertAriaRoles');
const assertAriaSelectedAndActivedescendant = require('../util/assertAriaSelectedAndActivedescendant');

const exampleFile = 'combobox/aria1.0pattern/combobox-autocomplete-both.html';

const ex = {
  textboxSelector: '#ex1 input[type="text"]',
  listboxSelector: '#ex1 [role="listbox"]',
  optionsSelector: '#ex1 [role="option"]',
  numAOptions: 5,
  numCharFirstAOption: 6
};

const reload = async (session) => {
  return session.get(await session.getCurrentUrl());
};

const waitForFocusChange = async (t, textboxSelector, originalFocus) => {
  try {
    await t.context.session.wait(async function () {
      let newfocus = await t.context.session
        .findElement(By.css(textboxSelector))
        .getAttribute('aria-activedescendant');
      return newfocus != originalFocus;
    }, 500);
  }
  catch (e) {
    throw new Error('Error waiting for "aria-activedescendant" value to change from "' +
                    originalFocus + '". ' + e.message);
  }
};

const confirmCursorIndex = async (t, selector, cursorIndex) => {
  return t.context.session.executeScript(function () {
    const [selector, cursorIndex] = arguments;
    let item = document.querySelector(selector);
    return item.selectionStart === cursorIndex;
  }, selector, cursorIndex);
};

// Attributes
ariaTest('Test for role="combobox"', exampleFile, 'combobox-role', async (t) => {
  t.plan(1);
  await assertAriaRoles(t, 'ex1', 'combobox', '1', 'input');
});

ariaTest('"aria-autocomplete" on comboxbox element', exampleFile, 'combobox-aria-autocomplete', async (t) => {
  t.plan(1);
  await assertAttributeValues(t, 'ex1', ex.textboxSelector, 'aria-autocomplete', 'both');
});

ariaTest('"aria-haspopup" on combobox element', exampleFile, 'combobox-aria-haspopup', async (t) => {
  t.plan(1);
  await assertAttributeValues(t, 'ex1', ex.textboxSelector, 'aria-haspopup', 'true');
});

ariaTest('"aria-owns" attribute on combobox element', exampleFile, 'combobox-aria-owns', async (t) => {
  t.plan(2);

  const popupId = await t.context.session
    .findElement(By.css(ex.textboxSelector))
    .getAttribute('aria-owns');

  t.truthy(
    popupId,
    '"aria-owns" attribute should exist on: ' + ex.textboxSelector
  );

  const popupElements = await t.context.session
    .findElement(By.id('ex1'))
    .findElements(By.id(popupId));

  t.is(
    popupElements.length,
    1,
    'There should be a element with id "' + popupId + '" as referenced by the aria-owns attribute'
  );
});

ariaTest('"aria-expanded" on combobox element', exampleFile, 'combobox-aria-expanded', async (t) => {
  t.plan(4);

  const combobox = await t.context.session.findElement(By.css(ex.textboxSelector));

  // Check that aria-expanded is false and the listbox is not visible before interacting

  t.is(
    await combobox.getAttribute('aria-expanded'),
    'false',
    'combobox element should have attribute "aria-expanded" set to false by default.'
  );

  const popupId = await t.context.session
    .findElement(By.css(ex.textboxSelector))
    .getAttribute('aria-owns');

  const popupElement = await t.context.session
    .findElement(By.id('ex1'))
    .findElement(By.id(popupId));

  t.false(
    await popupElement.isDisplayed(),
    'Popup element should not be displayed when \'aria-expanded\' is false\''
  );

  // Send key "a" to textbox

  await t.context.session
    .findElement(By.css(ex.textboxSelector))
    .sendKeys('a');

  // Check that aria-expanded is true and the listbox is visible

  t.is(
    await combobox.getAttribute('aria-expanded'),
    'true',
    'combobox element should have attribute "aria-expand" set to true after typing.'
  );

  t.true(
    await popupElement.isDisplayed(),
    'Popup element should be displayed when \'aria-expanded\' is true\''
  );

});

ariaTest('"aria-activedescendant" on combobox element', exampleFile, 'combobox-aria-activedescendant', async (t) => {
  t.plan(1);
  await assertAttributeValues(t, ex.textboxSelector, 'aria-activedescendant', null);
});

ariaTest('role "listbox" on ul element', exampleFile, 'listbox-role', async (t) => {
  t.plan(1);
  await assertAriaRoles(t, 'ex1', 'listbox', '1', 'ul');
});

ariaTest('"aria-label" attribute on listbox element', exampleFile, 'listbox-aria-label', async (t) => {
  t.plan(1);
  await assertAttributeValues(t, 'ex1', ex.listboxSelector, 'aria-label', 'states');
});

ariaTest('role "option" on lu elements', exampleFile, 'option-role', async (t) => {
  t.plan(1);

  // Send key "a" then key "BACK_SPACE" to show all options
  await t.context.session.findElement(By.css(ex.textboxSelector)).sendKeys(Key.ARROW_DOWN);
  await assertAriaRoles(t, 'ex1', 'option', '56', 'li');
});

ariaTest('"aria-selected" attribute on options element', exampleFile, 'option-aria-selected', async (t) => {
  t.plan(1);

  // Send key "a" then key "BACK_SPACE" to show all options
  await t.context.session.findElement(By.css(ex.textboxSelector)).sendKeys('a');
  await assertAttributeValues(t, ex.optionsSelector + ':nth-of-type(1)', 'aria-selected', 'true');
});


// Keys

ariaTest('Test down key press with focus on textbox',
  exampleFile, 'textbox-key-down-arrow', async (t) => {

    t.plan(2);

    // Send ARROW_DOWN to the textbox
    await t.context.session
      .findElement(By.css(ex.textboxSelector))
      .sendKeys(Key.ARROW_DOWN);

    // Check that the listbox is displayed
    t.truthy(
      await t.context.session.findElement(By.css(ex.listboxSelector)).isDisplayed(),
      'In example ex3 listbox should display after ARROW_DOWN keypress'
    );

    // Check that the active descendent focus is correct
    await assertAriaSelectedAndActivedescendant(t, ex.textboxSelector, ex.optionsSelector, 0);

  });

ariaTest('Test down key press with focus on list',
  exampleFile, 'listbox-key-down-arrow', async (t) => {

    t.plan(4);

    // Send 'a' to text box, then send ARROW_DOWN to textbox to set focus on listbox
    await t.context.session
      .findElement(By.css(ex.textboxSelector))
      .sendKeys('a', Key.ARROW_DOWN);

    // Test that ARROW_DOWN moves active descendant focus on item in listbox
    for (let i = 2; i < ex.numAOptions + 1; i++) {
      let oldfocus = await t.context.session
        .findElement(By.css(ex.textboxSelector))
        .getAttribute('aria-activedescendant');

      await t.context.session
        .findElement(By.css(ex.textboxSelector))
        .sendKeys(Key.ARROW_DOWN);

      // Account for race condition
      await waitForFocusChange(t, ex.textboxSelector, oldfocus);

      await assertAriaSelectedAndActivedescendant(t, ex.textboxSelector, ex.optionsSelector, i % ex.numAOptions);
    }

  });


ariaTest('Test up key press with focus on textbox',
  exampleFile, 'textbox-key-up-arrow', async (t) => {

    t.plan(2);

    // Send ARROW_UP to the textbox
    await t.context.session
      .findElement(By.css(ex.textboxSelector))
      .sendKeys(Key.ARROW_UP);

    // Check that the listbox is displayed
    t.truthy(
      await t.context.session.findElement(By.css(ex.listboxSelector)).isDisplayed(),
      'In example ex3 listbox should display after ARROW_UP keypress'
    );

    // Check that the active descendent focus is correct
    let numOptions = (await t.context.session.findElements(By.css(ex.optionsSelector))).length;
    await assertAriaSelectedAndActivedescendant(t, ex.textboxSelector, ex.optionsSelector, numOptions - 1);
  });

// This test fails due to bug: https://github.com/w3c/aria-practices/issues/821
// Uncomment when the bug is fixed.

// ariaTest('Test up key press with focus on listbox',
//   exampleFile, 'listbox-key-up-arrow', async (t) => {

//     t.plan(3);

//     // Send 'a' to text box, then send ARROW_UP to textbox to textbox to put focus in textbox
//     // Up arrow should move selection to the last item in the list
//     await t.context.session
//       .findElement(By.css(ex.textboxSelector))
//       .sendKeys('a', Key.ARROW_UP);

//     // Test that ARROW_UP moves active descendant focus up one item in the listbox
//     for (let index = ex.numAOptions - 1; index > 0 ; index--) {
//       let oldfocus = await t.context.session
//         .findElement(By.css(ex.textboxSelector))
//         .getAttribute('aria-activedescendant');

//       // Send Key
//       await t.context.session
//         .findElement(By.css(ex.textboxSelector))
//         .sendKeys(Key.ARROW_UP);

//       await waitForFocusChange(t, ex.textboxSelector, oldfocus);

//       await assertAriaSelectedAndActivedescendant(t, ex.textboxSelector, ex.optionsSelector, index);
//     }
//   });

ariaTest('Test enter key press with focus on textbox',
  exampleFile, 'textbox-key-enter', async (t) => {

    t.plan(2);

    // Send key "a" to the textbox

    await t.context.session
      .findElement(By.css(ex.textboxSelector))
      .sendKeys('a');

    // Get the value of the first option in the listbox

    const firstOption = await t.context.session.findElement(By.css(ex.optionsSelector)).getText();

    // Send key ENTER

    await t.context.session
      .findElement(By.css(ex.textboxSelector))
      .sendKeys(Key.ENTER);

    // Confirm that the listbox is still open

    await assertAttributeValues(t, ex.textboxSelector, 'aria-expanded', 'false');

    // Confirm that the value of the textbox is now set to the first option

    t.is(
      await t.context.session
        .findElement(By.css(ex.textboxSelector))
        .getAttribute('value'),
      firstOption,
      'key press "ENTER" should result in first option in textbox'
    );

  });

ariaTest('Test escape key press with focus on textbox',
  exampleFile, 'textbox-key-escape', async (t) => {
    t.plan(2);

    // Send key "a", then key ESCAPE to the textbox

    await t.context.session
      .findElement(By.css(ex.textboxSelector))
      .sendKeys('a', Key.ESCAPE);

    // Confirm the listbox is closed and the textboxed is clearedx

    await assertAttributeValues(t, ex.textboxSelector, 'aria-expanded', 'false');
    t.is(
      await t.context.session
        .findElement(By.css(ex.textboxSelector))
        .getAttribute('value'),
      '',
      'In key press "ESCAPE" should result in first option in textbox'
    );

  });

ariaTest('Test escape key press with focus on textbox',
  exampleFile, 'listbox-key-escape', async (t) => {
    t.plan(2);

    // Send key "a" then key "ARROW_DOWN to put the focus on the listbox,
    // then key ESCAPE to the textbox

    await t.context.session
      .findElement(By.css(ex.textboxSelector))
      .sendKeys('a', Key.ARROW_DOWN, Key.ESCAPE);

    // Confirm the listbox is closed and the textboxed is cleared

    await assertAttributeValues(t, ex.textboxSelector, 'aria-expanded', 'false');
    t.is(
      await t.context.session
        .findElement(By.css(ex.textboxSelector))
        .getAttribute('value'),
      '',
      'In listbox key press "ESCAPE" should result in first option in textbox'
    );

  });

ariaTest('left arrow from focus on list puts focus on listbox and moves cursor right',
  exampleFile, 'listbox-key-left-arrow', async (t) => {
    t.plan(2);

    // Send key "a" then key "ARROW_DOWN" to put the focus on the listbox,
    // then key ESCAPE to the textbox
    const textbox = t.context.session.findElement(By.css(ex.textboxSelector));
    await textbox.sendKeys('a', Key.ARROW_DOWN);

    // Send key "ARROW_LEFT"
    await textbox.sendKeys(Key.ARROW_LEFT);

    t.true(
      await confirmCursorIndex(t, ex.textboxSelector, ex.numCharFirstAOption - 1),
      'Cursor should be at index ' + (ex.numCharFirstAOption - 1) + ' after one ARROW_LEFT key'
    );

    t.is(
      await textbox.getAttribute('aria-activedescendant'),
      '',
      'Focus should be on the textbox after on ARROW_LEFT key',
    );
  });


ariaTest('Right arrow from focus on list puts focus on listbox',
  exampleFile, 'listbox-key-right-arrow', async (t) => {
    t.plan(2);

    // Send key "a" then key "ARROW_DOWN" to put the focus on the listbox,
    // then key ESCAPE to the textbox
    const textbox = t.context.session.findElement(By.css(ex.textboxSelector));
    await textbox.sendKeys('a', Key.ARROW_DOWN);

    // Send key "RIGHT_ARROW"
    await textbox.sendKeys(Key.ARROW_RIGHT);

    t.true(
      await confirmCursorIndex(t, ex.textboxSelector, ex.numCharFirstAOption),
      'Cursor should be at index ' + ex.numCharFirstAOption + ' after one ARROW_RIGHT key'
    );

    t.is(
      await textbox.getAttribute('aria-activedescendant'),
      '',
      'Focus should be on the textbox after on ARROW_RIGHT key',
    );
  });

ariaTest('Home arrow from focus on list puts focus on listbox and moves cursor',
  exampleFile, 'listbox-key-home', async (t) => {
    t.plan(2);

    // Send key "a" then key "ARROW_DOWN" to put the focus on the listbox,
    // then key ESCAPE to the textbox
    const textbox = t.context.session.findElement(By.css(ex.textboxSelector));
    await textbox.sendKeys('a', Key.ARROW_DOWN);

    // Send key "ARROW_HOME"
    await textbox.sendKeys(Key.HOME);

    t.true(
      await confirmCursorIndex(t, ex.textboxSelector, 0),
      'Cursor should be at index 0 after one ARROW_HOME key'
    );

    t.is(
      await textbox.getAttribute('aria-activedescendant'),
      '',
      'Focus should be on the textbox after one ARROW_HOME key',
    );
  });

ariaTest('End arrow from focus on list puts focus on listbox',
  exampleFile, 'listbox-key-end', async (t) => {
    t.plan(2);

    // Send key "a" then key "ARROW_DOWN" to put the focus on the listbox,
    // then key ESCAPE to the textbox
    const textbox = t.context.session.findElement(By.css(ex.textboxSelector));
    await textbox.sendKeys('a', Key.ARROW_DOWN);

    // Send key "END_ARROW"
    await textbox.sendKeys(Key.END);

    t.true(
      await confirmCursorIndex(t, ex.textboxSelector, ex.numCharFirstAOption),
      'Cursor should be at index ' + ex.numCharFirstAOption + ' after one ARROW_END key'
    );

    t.is(
      await textbox.getAttribute('aria-activedescendant'),
      '',
      'Focus should be on the textbox after on ARROW_END key',
    );
  });

