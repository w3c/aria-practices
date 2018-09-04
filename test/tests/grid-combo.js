'use strict';

const { ariaTest } = require('..');
const { By, Key } = require('selenium-webdriver');
const assertAriaLabelledby = require('../util/assertAriaLabelledby');
const assertAttributeValues = require('../util/assertAttributeValues');
const assertAttributeDNE = require('../util/assertAttributeDNE');
const assertAriaRoles = require('../util/assertAriaRoles');
const assertAriaSelectedAndActivedescendant = require('../util/assertAriaSelectedAndActivedescendant');

const exampleFile = 'combobox/aria1.1pattern/grid-combo.html';

const ex = {
  comboboxSelector: '#ex1 [role="combobox"]',
  labelSelector: '#ex1 label',
  textboxSelector: '#ex1 input[type="text"]',
  gridSelector: '#ex1 [role="grid"]',
  gridSelector: '#ex1 [role="grid"]',
  rowSelector: '#ex1 [role="row"]',
  gridcellSelector: '#ex1 [role="gridcell"]',
  gridcellFocusedClass: 'focused-cell',
  numAOptions: 3
};

const reload = async (session) => {
  return session.get(await session.getCurrentUrl());
};

const waitForFocusChange = async (t, textboxSelector, originalFocus) => {
  await t.context.session.wait(
    async function () {
      let newfocus = await t.context.session
        .findElement(By.css(textboxSelector))
        .getAttribute('aria-activedescendant');
      return newfocus != originalFocus;
    },
    500,
    'Timeout waiting for "aria-activedescendant" value to change from "' + originalFocus + '". '
  );
};

const confirmCursorIndex = async (t, selector, cursorIndex) => {
  return t.context.session.executeScript(function () {
    const [selector, cursorIndex] = arguments;
    let item = document.querySelector(selector);
    return item.selectionStart === cursorIndex;
  }, selector, cursorIndex);
};

const gridcellId = (row, column) => {
  return 'result-item-' + row + 'x' + column;
};

// Attributes
ariaTest('Test for role="combobox"', exampleFile, 'combobox-role', async (t) => {
  t.plan(1);
  await assertAriaRoles(t, 'ex1', 'combobox', '1', 'div');
});

ariaTest('"aria-haspopup"=grid on combobox element', exampleFile, 'combobox-aria-haspopup', async (t) => {
  t.plan(1);
  await assertAttributeValues(t, ex.comboboxSelector, 'aria-haspopup', 'grid');
});

ariaTest('"aria-owns" attribute on combobox element', exampleFile, 'combobox-aria-owns', async (t) => {
  t.plan(2);

  const popupId = await t.context.session
    .findElement(By.css(ex.comboboxSelector))
    .getAttribute('aria-owns');

  t.truthy(
    popupId,
    '"aria-owns" attribute should exist on: ' + ex.comboboxSelector
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

  const combobox = await t.context.session.findElement(By.css(ex.comboboxSelector));

  // Check that aria-expanded is false and the grid is not visible before interacting

  t.is(
    await combobox.getAttribute('aria-expanded'),
    'false',
    'combobox element should have attribute "aria-expanded" set to false by default.'
  );

  const popupId = await t.context.session
    .findElement(By.css(ex.comboboxSelector))
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

  // Check that aria-expanded is true and the grid is visible

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

ariaTest('"id" attribute on texbox used to discover accessible name', exampleFile, 'textbox-id', async (t) => {
  t.plan(2);

  const labelForTextboxId = await t.context.session
    .findElement(By.css(ex.labelSelector))
    .getAttribute('for');

  t.truthy(
    labelForTextboxId,
    '"for" attribute with id value should exist on label: ' + ex.labelSelector
  );

  const textboxElementId = await t.context.session
    .findElement(By.css(ex.textboxSelector))
    .getAttribute('id');

  t.true(
    labelForTextboxId === textboxElementId,
    'Id on textbox element (' + ex.textboxSelector + ') should match the "for" attribute of the label (' + labelForTextboxId + ')'
  );
});

ariaTest('"aria-autocomplete" on grid element', exampleFile, 'textbox-aria-autocomplete', async (t) => {
  t.plan(1);
  await assertAttributeValues(t, ex.textboxSelector, 'aria-autocomplete', 'list');
});

ariaTest('"aria-controls" attribute on grid element', exampleFile, 'textbox-aria-controls', async (t) => {
  t.plan(2);

  const popupId = await t.context.session
    .findElement(By.css(ex.textboxSelector))
    .getAttribute('aria-controls');

  t.truthy(
    popupId,
    '"aria-controls" attribute should exist on: ' + ex.textboxSelector
  );

  const popupElements = await t.context.session
    .findElement(By.id('ex1'))
    .findElements(By.id(popupId));

  t.is(
    popupElements.length,
    1,
    'There should be a element with id "' + popupId + '" as referenced by the aria-controls attribute'
  );
});

ariaTest('"aria-activedescendant" on combobox element', exampleFile, 'textbox-aria-activedescendant', async (t) => {
  t.plan(1);
  await assertAttributeValues(t, ex.textboxSelector, 'aria-activedescendant', null);
});

ariaTest('role "grid" on div element', exampleFile, 'grid-role', async (t) => {
  t.plan(1);
  await assertAriaRoles(t, 'ex1', 'grid', '1', 'div');
});

ariaTest('"aria-labelledby" attribute on grid element', exampleFile, 'grid-aria-labelledby', async (t) => {
  t.plan(1);
  await assertAriaLabelledby(t, ex.textboxSelector, 'aria-labelledby');
});

ariaTest('role "row" exists within grid element', exampleFile, 'row-role', async (t) => {
  t.plan(1);

  // Send key "a" then arrow down to reveal all options
  await t.context.session.findElement(By.css(ex.textboxSelector)).sendKeys('a', Key.ARROW_DOWN);

  let rowElements = await t.context.session.findElement(By.css(ex.gridSelector))
    .findElements(By.css('[role="row"]'));

  t.truthy(
    await rowElements.length,
    'role="row" elements should be found within a gridcell element after opening popup'
  );
});

// This test fails due to bug: https://github.com/w3c/aria-practices/issues/859

// ariaTest('"aria-selected" attribute on row element', exampleFile, 'row-aria-selected', async (t) => {
//   t.plan(2);

//   // Send key "a"
//   await t.context.session.findElement(By.css(ex.textboxSelector)).sendKeys('a');
//   await assertAttributeDNE(t, ex.rowSelector + ':nth-of-type(1)', 'aria-selected');

//   // Send key ARROW_DOWN to selected first option
//   await t.context.session.findElement(By.css(ex.textboxSelector)).sendKeys(Key.ARROW_DOWN);
//   await assertAttributeValues(t, ex.rowSelector + ':nth-of-type(1)', 'aria-selected', 'true');
// });

ariaTest('role "gridcell" exists within row element', exampleFile, 'gridcell-role', async (t) => {
  t.plan(1);

  // Send key "a" then arrow down to reveal all options
  await t.context.session.findElement(By.css(ex.textboxSelector)).sendKeys('a', Key.ARROW_DOWN);

  let rowElements = await t.context.session.findElement(By.css(ex.rowSelector))
    .findElements(By.css('[role="gridcell"]'));

  t.truthy(
    await rowElements.length,
    'role="gridcell" elements should be found within a row element after opening popup'
  );
});


// Keys

ariaTest('Test down key press with focus on textbox',
  exampleFile, 'textbox-key-down-arrow', async (t) => {

    t.plan(4);

    // Send ARROW_DOWN to the textbox
    await t.context.session
      .findElement(By.css(ex.textboxSelector))
      .sendKeys(Key.ARROW_DOWN);

    // Check that the grid is displayed
    t.false(
      await t.context.session.findElement(By.css(ex.gridSelector)).isDisplayed(),
      'In example ex3 grid should not be display after ARROW_DOWN keypress while textbox is empty'
    );

    // Send "a" then ARROW_DOWN to the textbox
    await t.context.session
      .findElement(By.css(ex.textboxSelector))
      .sendKeys('a', Key.ARROW_DOWN);

    // Check that the grid is displayed
    t.true(
      await t.context.session.findElement(By.css(ex.gridSelector)).isDisplayed(),
      'In example ex3 grid should display after ARROW_DOWN keypress when textbox has character values'
    );

    // Check that the active descendent focus is correct
    let focusedId = await t.context.session.findElement(By.css(ex.textboxSelector))
      .getAttribute('aria-activedescendant');

    t.is(
      focusedId,
      gridcellId(0,0),
      'After down arrow sent to textbox, aria-activedescendant should be set to the first gridcell element: ' + gridcellId(0,0)
    );

    let focusedElementClasses = await t.context.session.findElement(By.id(gridcellId(0,0)))
      .getAttribute('class');

    t.true(
      focusedElementClasses.includes(ex.gridcellFocusedClass),
      'Gridcell with id "' + gridcellId(0,0) + '" should have visual focus'
    );

  });

ariaTest('Test down key press with focus on list',
  exampleFile, 'popup-key-down-arrow', async (t) => {

    t.plan(6);

    // Send 'a' to text box, then send ARROW_DOWN to textbox to set focus on grid
    await t.context.session
      .findElement(By.css(ex.textboxSelector))
      .sendKeys('a', Key.ARROW_DOWN);

    // Test that ARROW_DOWN moves active descendant focus on item in grid
    for (let i = 1; i <  ex.numAOptions; i++) {
      let oldfocus = await t.context.session
        .findElement(By.css(ex.textboxSelector))
        .getAttribute('aria-activedescendant');

      await t.context.session
        .findElement(By.css(ex.textboxSelector))
        .sendKeys(Key.ARROW_DOWN);

      // Account for race condition
      await waitForFocusChange(t, ex.textboxSelector, oldfocus);

      // Check that the active descendent focus is correct

      let focusedId = await t.context.session.findElement(By.css(ex.textboxSelector))
        .getAttribute('aria-activedescendant');
      t.is(
        focusedId,
        gridcellId(i,0),
        'After down up sent to textbox, aria-activedescendant should be set to this gridcell element: ' + gridcellId(i,0)
      );

      let focusedElementClasses = await t.context.session.findElement(By.id(gridcellId(i,0)))
        .getAttribute('class');
      t.true(
        focusedElementClasses.includes(ex.gridcellFocusedClass),
        'Gridcell with id "' + gridcellId(i,0) + '" should have visual focus'
      );
    }

    // Sending ARROW_DOWN to the last item should put focus on the first
    let oldfocus = await t.context.session
      .findElement(By.css(ex.textboxSelector))
      .getAttribute('aria-activedescendant');
    await t.context.session
      .findElement(By.css(ex.textboxSelector))
      .sendKeys(Key.ARROW_DOWN);

    // Account for race condition
    await waitForFocusChange(t, ex.textboxSelector, oldfocus);

    // Focus should be on the first item

    let focusedId = await t.context.session.findElement(By.css(ex.textboxSelector))
      .getAttribute('aria-activedescendant');
    t.is(
      focusedId,
      gridcellId(0,0),
      'After down arrow sent to last grid row, aria-activedescendant should be set to the first gridcell element: ' + gridcellId(0,0)
    );

    let focusedElementClasses = await t.context.session.findElement(By.id(gridcellId(0,0)))
      .getAttribute('class');
    t.true(
      focusedElementClasses.includes(ex.gridcellFocusedClass),
      'Gridcell with id "' + gridcellId(0,0) + '" should have visual focus'
    );

  });


ariaTest('Test up key press with focus on textbox',
  exampleFile, 'textbox-key-up-arrow', async (t) => {

    t.plan(4);

    // Send ARROW_UP to the textbox
    await t.context.session
      .findElement(By.css(ex.textboxSelector))
      .sendKeys(Key.ARROW_UP);

    // Check that the grid is displayed
    t.false(
      await t.context.session.findElement(By.css(ex.gridSelector)).isDisplayed(),
      'In example ex3 grid should not be display after ARROW_UP keypress while textbox is empty'
    );

    // Send "a" then ARROW_UP to the textbox
    await t.context.session
      .findElement(By.css(ex.textboxSelector))
      .sendKeys('a', Key.ARROW_UP);

    // Check that the grid is displayed
    t.true(
      await t.context.session.findElement(By.css(ex.gridSelector)).isDisplayed(),
      'In example ex3 grid should display after ARROW_UP keypress when textbox has character values'
    );

    // Check that the active descendent focus is correct
    let focusedId = await t.context.session.findElement(By.css(ex.textboxSelector))
      .getAttribute('aria-activedescendant');

    t.is(
      focusedId,
      gridcellId(ex.numAOptions - 1,0),
      'After up arrow sent to textbox, aria-activedescendant should be set to the last row first gridcell element: ' + gridcellId(ex.numAOptions - 1,0)
    );

    let focusedElementClasses = await t.context.session.findElement(By.id(gridcellId(ex.numAOptions - 1,0)))
      .getAttribute('class');

    t.true(
      focusedElementClasses.includes(ex.gridcellFocusedClass),
      'Gridcell with id "' + gridcellId(ex.numAOptions - 1,0) + '" should have visual focus'
    );

  });

ariaTest('Test up key press with focus on grid',
  exampleFile, 'popup-key-up-arrow', async (t) => {

    t.plan(6);

    // Send 'a' to text box, then send ARROW_UP to textbox to textbox to put focus in textbox
    // Up arrow should move selection to the last item in the list
    await t.context.session
      .findElement(By.css(ex.textboxSelector))
      .sendKeys('a', Key.ARROW_UP);

    // Test that ARROW_UP moves active descendant focus up one item in the grid
    for (let index = ex.numAOptions - 2; index >= 0 ; index--) {
      let oldfocus = await t.context.session
        .findElement(By.css(ex.textboxSelector))
        .getAttribute('aria-activedescendant');

      // Send Key
      await t.context.session
        .findElement(By.css(ex.textboxSelector))
        .sendKeys(Key.ARROW_UP);

      await waitForFocusChange(t, ex.textboxSelector, oldfocus);

      // Check that the active descendent focus is correct

      let focusedId = await t.context.session.findElement(By.css(ex.textboxSelector))
        .getAttribute('aria-activedescendant');
      t.is(
        focusedId,
        gridcellId(index,0),
        'After up arrow sent to textbox, aria-activedescendant should be set to gridcell element: ' + gridcellId(index,0)
      );

      let focusedElementClasses = await t.context.session.findElement(By.id(gridcellId(index,0)))
        .getAttribute('class');
      t.true(
        focusedElementClasses.includes(ex.gridcellFocusedClass),
        'Gridcell with id "' + gridcellId(index,0) + '" should have visual focus'
      );
    }

    // Test that ARROW_UP, when on the first item, returns focus to the last item in the list
    let oldfocus = await t.context.session
      .findElement(By.css(ex.textboxSelector))
      .getAttribute('aria-activedescendant');

    // Send Key
    await t.context.session
      .findElement(By.css(ex.textboxSelector))
      .sendKeys(Key.ARROW_UP);

    await waitForFocusChange(t, ex.textboxSelector, oldfocus);

    // Check that the active descendent focus is correct

    let focusedId = await t.context.session.findElement(By.css(ex.textboxSelector))
      .getAttribute('aria-activedescendant');
    t.is(
      focusedId,
      gridcellId(ex.numAOptions - 1,0),
      'After up arrow sent to first element in popup, aria-activedescendant should be set to the last row first gridcell element: ' + gridcellId(ex.numAOptions - 1,0)
    );

    let focusedElementClasses = await t.context.session.findElement(By.id(gridcellId(ex.numAOptions - 1,0)))
      .getAttribute('class');
    t.true(
      focusedElementClasses.includes(ex.gridcellFocusedClass),
      'Gridcell with id "' + gridcellId(ex.numAOptions - 1,0) + '" should have visual focus'
    );

  });

ariaTest('Test enter key press with focus on grid',
  exampleFile, 'popup-key-enter', async (t) => {

    t.plan(2);

    // Send key "a" to the textbox, then key ARROW_DOWN to select the first item

    await t.context.session
      .findElement(By.css(ex.textboxSelector))
      .sendKeys('a', Key.ARROW_DOWN);

    // Get the value of the first option in the grid

    const firstOption = await t.context.session.findElement(By.css(ex.gridcellSelector)).getText();

    // Send key ENTER

    await t.context.session
      .findElement(By.css(ex.textboxSelector))
      .sendKeys(Key.ENTER);

    // Confirm that the grid is closed

    await assertAttributeValues(t, ex.comboboxSelector, 'aria-expanded', 'false');

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

    // Wait for gridbox to close
    await t.context.session.wait(
      async function () {
        return !(await t.context.session.findElement(By.css(ex.gridSelector)).isDisplayed());
      },
      500,
      'Timeout waiting for gridbox to close afer escape'
    );

    // Confirm the grid is closed and the textboxed is cleared
    await assertAttributeValues(t, ex.comboboxSelector, 'aria-expanded', 'false');
    t.is(
      await t.context.session
        .findElement(By.css(ex.textboxSelector))
        .getAttribute('value'),
      '',
      'In key press "ESCAPE" should result in clearing of the textbox'
    );

  });

// This test fails due to bug: https://github.com/w3c/aria-practices/issues/860

// ariaTest('Test escape key press with focus on popup',
//   exampleFile, 'popup-key-escape', async (t) => {
//     t.plan(2);

//     // Send key "a" then key "ARROW_DOWN to put the focus on the grid,
//     // then key ESCAPE to the textbox

//     await t.context.session
//       .findElement(By.css(ex.textboxSelector))
//       .sendKeys('a', Key.ARROW_DOWN, Key.ESCAPE);

//     // Wait for gridbox to close
//     await t.context.session.wait(
//       async function () {
//         return ! (await t.context.session.findElement(By.css(ex.gridSelector)).isDisplayed());
//       },
//       500,
//       'Timeout waiting for gridbox to close afer escape'
//     );

//     // Confirm the grid is closed and the textboxed is cleared
//     await assertAttributeValues(t, ex.comboboxSelector, 'aria-expanded', 'false');
//     t.is(
//       await t.context.session
//         .findElement(By.css(ex.textboxSelector))
//         .getAttribute('value'),
//       '',
//       'In grid key press "ESCAPE" should result in clearing of the textbox'
//     );

//   });

ariaTest('left arrow from focus on list puts focus on grid and moves cursor right',
  exampleFile, 'popup-key-left-arrow', async (t) => {
    t.plan(4);

    // Send key "a" then key "ARROW_DOWN" to put the focus on the grid
    const textbox = t.context.session.findElement(By.css(ex.textboxSelector));
    await textbox.sendKeys('a', Key.ARROW_DOWN);

    // Send key "ARROW_LEFT"
    await textbox.sendKeys(Key.ARROW_LEFT);

    // Check that the active descendent focus is correct
    let lastrow = ex.numAOptions - 1;

    var focusedId = await t.context.session.findElement(By.css(ex.textboxSelector))
      .getAttribute('aria-activedescendant');
    t.is(
      focusedId,
      gridcellId(lastrow,1),
      'After left arrow sent to pop-up, aria-activedescendant should be set to the last row, last gricell: ' + gridcellId(lastrow, 1)
    );

    var focusedElementClasses = await t.context.session.findElement(By.id(gridcellId(lastrow,1)))
      .getAttribute('class');
    t.true(
      focusedElementClasses.includes(ex.gridcellFocusedClass),
      'Gridcell with id "' + gridcellId(lastrow,1) + '" should have visual focus'
    );

    // Send key "ARROW_LEFT" a second time
    await textbox.sendKeys(Key.ARROW_LEFT);

    // Check that the active descendent focus is correct
    focusedId = await t.context.session.findElement(By.css(ex.textboxSelector))
      .getAttribute('aria-activedescendant');
    t.is(
      focusedId,
      gridcellId(lastrow,0),
      'After left arrow sent twice to popup, aria-activedescendant should be set to the last row first gridcell: ' + gridcellId(lastrow, 0)
    );

    focusedElementClasses = await t.context.session.findElement(By.id(gridcellId(lastrow,0)))
      .getAttribute('class');
    t.true(
      focusedElementClasses.includes(ex.gridcellFocusedClass),
      'Gridcell with id "' + gridcellId(lastrow,0) + '" should have visual focus'
    );

  });


ariaTest('Right arrow from focus on list puts focus on grid',
  exampleFile, 'popup-key-right-arrow', async (t) => {
    t.plan(6);

    // Send key "a" then key "ARROW_DOWN" to put the focus on the grid
    const textbox = t.context.session.findElement(By.css(ex.textboxSelector));
    await textbox.sendKeys('a', Key.ARROW_DOWN);

    // Send key "RIGHT_ARROW"
    await textbox.sendKeys(Key.ARROW_RIGHT);

    // Check that the active descendent focus is correct
    var focusedId = await t.context.session.findElement(By.css(ex.textboxSelector))
      .getAttribute('aria-activedescendant');
    t.is(
      focusedId,
      gridcellId(0,1),
      'After right arrow sent to pop-up, aria-activedescendant should be set to the first row second gridcell element: ' + gridcellId(0, 1)
    );

    var focusedElementClasses = await t.context.session.findElement(By.id(gridcellId(0,1)))
      .getAttribute('class');
    t.true(
      focusedElementClasses.includes(ex.gridcellFocusedClass),
      'Gridcell with id "' + gridcellId(0,1) + '" should have visual focus'
    );

    // Send key "ARROW_RIGHT" a second time
    await textbox.sendKeys(Key.ARROW_RIGHT);

    // Check that the active descendent focus is correct
    focusedId = await t.context.session.findElement(By.css(ex.textboxSelector))
      .getAttribute('aria-activedescendant');
    t.is(
      focusedId,
      gridcellId(1,0),
      'After right arrow send twice to popup, aria-activedescendant should be set to the second row first gridcell element: ' + gridcellId(1, 0)
    );

    focusedElementClasses = await t.context.session.findElement(By.id(gridcellId(1,0)))
      .getAttribute('class');
    t.true(
      focusedElementClasses.includes(ex.gridcellFocusedClass),
      'Gridcell with id "' + gridcellId(1,0) + '" should have visual focus'
    );

    // Send key "ARROW_RIGHT" four more times
    await textbox.sendKeys(Key.ARROW_RIGHT, Key.ARROW_RIGHT, Key.ARROW_RIGHT, Key.ARROW_RIGHT);

    // Check that the active descendent focus is correct
    focusedId = await t.context.session.findElement(By.css(ex.textboxSelector))
      .getAttribute('aria-activedescendant');
    t.is(
      focusedId,
      gridcellId(0,0),
      'After right arrow to the popup 6 times in total, aria-activedescendant should be back on the first row, first gridcell: ' + gridcellId(0, 0)
    );

    focusedElementClasses = await t.context.session.findElement(By.id(gridcellId(0,0)))
      .getAttribute('class');
    t.true(
      focusedElementClasses.includes(ex.gridcellFocusedClass),
      'Gridcell with id "' + gridcellId(0,0) + '" should have visual focus'
    );

  });

ariaTest('Home from focus on list puts focus on grid and moves cursor',
  exampleFile, 'popup-key-home', async (t) => {
    t.plan(2);

    // Send key "a" then key "ARROW_DOWN" to put the focus on the grid
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

ariaTest('End from focus on list puts focus on grid',
  exampleFile, 'popup-key-end', async (t) => {
    t.plan(2);

    // Send key "a" then key "ARROW_DOWN" to put the focus on the grid
    const textbox = t.context.session.findElement(By.css(ex.textboxSelector));
    await textbox.sendKeys('a', Key.ARROW_DOWN);

    // Send key "END_ARROW"
    await textbox.sendKeys(Key.END);

    t.true(
      await confirmCursorIndex(t, ex.textboxSelector, 1),
      'Cursor should be at index 1 after one ARROW_END key'
    );

    t.is(
      await textbox.getAttribute('aria-activedescendant'),
      '',
      'Focus should be on the textbox after on ARROW_END key',
    );
  });

ariaTest('Sending character keys while focus is on grid moves focus',
  exampleFile, 'popup-key-char', async (t) => {
    t.plan(2);

    // Send key "ARROW_DOWN" to put the focus on the grid
    const textbox = t.context.session.findElement(By.css(ex.textboxSelector));
    await textbox.sendKeys(Key.ARROW_DOWN);

    // Send key "a"
    await textbox.sendKeys('a');

    t.is(
      await textbox.getAttribute('value'),
      'a',
      'Value of the textbox should be "a" after sending key "a" to the textbox while the focus ' +
        'is on the grid'
    );

    t.is(
      await textbox.getAttribute('aria-activedescendant'),
      '',
      'Focus should be on the textbox after sending a character key while the focus is on the grid',
    );

  });

