'use strict';

const { ariaTest } = require('..');
const { By, Key } = require('selenium-webdriver');
const assertAttributeValues = require('../util/assertAttributeValues');
const assertAttributeDNE = require('../util/assertAttributeDNE');
const assertAriaControls = require('../util/assertAriaControls');
const assertAriaLabelledby = require('../util/assertAriaLabelledby');
const assertAriaDescribedby = require('../util/assertAriaDescribedby');
const assertAriaLabelExists = require('../util/assertAriaLabelExists');
const assertAriaRoles = require('../util/assertAriaRoles');
const assertRovingTabindex = require('../util/assertRovingTabindex');
const assertTabOrder = require('../util/assertTabOrder');

const exampleFile = 'combobox/combobox-datepicker.html';

let today = new Date();
let todayDataDate = today.toISOString().split('T')[0];

const ex = {
  comboboxSelector: '#ex1 .group input',
  buttonSelector: '#ex1 .group button',
  dialogSelector: '#ex1 [role="dialog"]',
  cancelSelector: '#ex1 [role="dialog"] button[value="cancel"]',
  dialogMessageSelector: '#ex1 .dialog-message',
  gridSelector: '#ex1 [role="grid"]',
  controlButtons: '#ex1 [role="dialog"] .header button',
  currentMonthDateButtons: '#ex1 [role="dialog"] .dates td:not(.disabled)',
  allDates: '#ex1 [role="dialog"] .dates td',
  jan12019Day: '#ex1 [role="dialog"] .dates td[data-date="2019-01-01"]',
  jan22019Day: '#ex1 [role="dialog"] .dates td[data-date="2019-01-02"]',
  todayButton: `#ex1 [role="dialog"] .dates [data-date="${todayDataDate}"]`,
  monthYear: '#cb-dialog-label',
  prevYear: '#ex1 [role="dialog"] button.prev-year',
  prevMonth: '#ex1 [role="dialog"] button.prev-month',
  nextMonth: '#ex1 [role="dialog"] button.next-month',
  nextYear: '#ex1 [role="dialog"] button.next-year'
};
ex.allFocusableElementsInDialog = [
  `#ex1 [role="dialog"] td[data-date="${todayDataDate}"]`,
  '#ex1 [role="dialog"] button[value="cancel"]',
  '#ex1 [role="dialog"] button[value="ok"]',
  ex.prevYear,
  ex.prevMonth,
  ex.nextMonth,
  ex.nextYear
]

const clickFirstOfMonth = async function (t) {
  let today = new Date();
  today.setUTCHours(0,0,0,0);

  let firstOfMonth = new Date(today);
  firstOfMonth.setDate(1);
  let firstOfMonthString = today.toISOString().split('T')[0];

  return (await t.context.queryElements(t, By.css(`[data-date=${firstOfMonthString}]`))).click();
};

const clickToday = async function (t) {
  let today = new Date();
  today.setUTCHours(0,0,0,0);
  let todayString = today.toISOString().split('T')[0];
  return (await t.context.queryElements(t, By.css(`[data-date=${todayString}]`))).click();
};

const setDateToJanFirst2019 = async function (t) {
  await (await t.context.queryElements(t, By.css(ex.comboboxSelector))).click();
  return t.context.session.executeScript(function () {
    const inputSelector = arguments[0];
    document.querySelector(inputSelector).value = '1/1/2019';
  }, ex.comboboxSelector);
};

const focusMatchesElement = async function (t, selector) {
  return t.context.session.wait(async function () {
    return t.context.session.executeScript(function () {
      selector = arguments[0];
      return document.activeElement === document.querySelector(selector);
    }, selector);
  }, t.context.WaitTime);
};

// Attributes

ariaTest('Combobox: has role', exampleFile, 'textbox-role', async (t) => {
  await assertAriaRoles(t, 'ex1', 'combobox', 1, 'input');
});

ariaTest('Combobox: has aria-haspopup set to "dialog"', exampleFile, 'textbox-aria-haspopup', async (t) => {
  await assertAttributeValues(t, ex.comboboxSelector, 'aria-haspopup', 'dialog');
});

ariaTest('Combobox: has aria-contorls set to "id-dialog-1"', exampleFile, 'textbox-aria-controls', async (t) => {
  await assertAttributeValues(t, ex.comboboxSelector, 'aria-controls', 'cb-dialog-1');
});

ariaTest('Combobox: Initially aria-expanded set to "false"', exampleFile, 'textbox-aria-expanded-false', async (t) => {
  await assertAttributeValues(t, ex.comboboxSelector, 'aria-expanded', 'false');
});

ariaTest('Combobox: aria-expanded set to "true" when dialog is open', exampleFile, 'textbox-aria-expanded-true', async (t) => {
  // Open dialog box
  await (await t.context.queryElements(t, By.css(ex.comboboxSelector))).sendKeys(Key.ENTER);
  await assertAttributeValues(t, ex.comboboxSelector, 'aria-expanded', 'true');
});



// Button Tests

ariaTest('Button: "aria-label" attribute', exampleFile, 'calendar-button-aria-label', async (t) => {
  await assertAriaLabelExists(t,  ex.buttonSelector);
});

ariaTest('Button: "tabindex" is set to -1', exampleFile, 'calendar-button-tabindex', async (t) => {
  await assertAttributeValues(t, ex.buttonSelector, 'tabindex', '-1');
});


ariaTest('Button: has aria-haspopup set to "dialog"', exampleFile, 'textbox-aria-haspopup', async (t) => {
  await assertAttributeValues(t, ex.buttonSelector, 'aria-haspopup', 'dialog');
});

ariaTest('Button: has aria-controls set to "id-dialog-1"', exampleFile, 'textbox-aria-controls', async (t) => {
  await assertAttributeValues(t, ex.buttonSelector, 'aria-controls', 'cb-dialog-1');
});

ariaTest('Button: Initially aria-expanded set to "false"', exampleFile, 'calendar-button-aria-expanded-false', async (t) => {
  await assertAttributeValues(t, ex.buttonSelector, 'aria-expanded', 'false');
});

ariaTest('Button: aria-expanded set to "true" when the dialog box is open', exampleFile, 'calendar-button-aria-expanded-true', async (t) => {
  // Open dialog box
  await (await t.context.queryElements(t, By.css(ex.buttonSelector))).sendKeys(Key.ENTER);
  await assertAttributeValues(t, ex.buttonSelector, 'aria-expanded', 'true');
});


// Dialog Tests

ariaTest('role="dialog" attribute on div', exampleFile, 'dialog-role', async (t) => {
  await assertAriaRoles(t, 'ex1', 'dialog', 1, 'div');
});

ariaTest('aria-modal="true" on modal', exampleFile, 'dialog-aria-modal', async (t) => {
  await assertAttributeValues(t, ex.dialogSelector, 'aria-modal', 'true');
});

ariaTest('aria-labelledby exist on dialog', exampleFile, 'dialog-aria-labelledby', async (t) => {
  await assertAriaLabelledby(t, ex.dialogSelector);
});

ariaTest('aria-live="polite" on keyboard support message', exampleFile, 'dialog-aria-live', async (t) => {
  await assertAttributeValues(t, ex.dialogMessageSelector, 'aria-live', 'polite');
});

ariaTest('"aria-label" exists on control buttons', exampleFile, 'calendar-navigation-button-aria-label', async (t) => {
  await assertAriaLabelExists(t,  ex.buttonSelector);
});

ariaTest('aria-live="polite" on dialog header', exampleFile, 'calendar-navigation-aria-live', async (t) => {
  await assertAttributeValues(t, `${ex.dialogSelector} h2`, 'aria-live', 'polite');
});

ariaTest('grid role on table element', exampleFile, 'grid-role', async (t) => {
  await assertAriaRoles(t, 'ex1', 'grid', 1, 'table');
});

ariaTest('aria-labelledby on grid element', exampleFile, 'grid-aria-labelledby', async (t) => {
  await assertAriaLabelledby(t, ex.gridSelector);
});


ariaTest('Roving tab index on dates in gridcell', exampleFile, 'gridcell-tabindex', async (t) => {
  let button = await t.context.queryElements(t, By.css(ex.buttonSelector));
  await setDateToJanFirst2019(t);

  await button.click();
  await button.click();

  let focusableButtons = await t.context.queryElements(t, By.css(ex.currentMonthDateButtons));
  let allButtons = await t.context.queryElements(t, By.css(ex.allDates));

  // test only one element has tabindex="0"
  for (let tabableEl = 0; tabableEl < focusableButtons.length; tabableEl++) {
    let dateSelected = await focusableButtons[tabableEl].getText();

    for (let el = 0; el < allButtons.length; el++) {
      let date = await allButtons[el].getText();
      let disabled = (await allButtons[el].getAttribute('class')).includes('disabled');
      let tabindex = dateSelected === date && !disabled ? '0' : '-1';
      t.log('Tabindex: ' + tabindex + ' DS: ' + dateSelected + ' D: ' + date + ' Disabled: ' + disabled);

      t.is(
        await allButtons[el].getAttribute('tabindex'),
        tabindex,
        'focus is on day ' + (tabableEl + 1) + ' therefore the button number ' +
           el + ' should have tab index set to: ' + tabindex
      );
    }

    // Send the tabindex="0" element the appropriate key to switch focus to the next element
    await focusableButtons[tabableEl].sendKeys(Key.ARROW_RIGHT);
  }
});

ariaTest('aria-selected on selected date', exampleFile, 'gridcell-aria-selected', async (t) => {
  let button = await t.context.session.findElement(By.css(ex.buttonSelector));

  await button.click();
  await assertAttributeDNE(t, ex.allDates, 'aria-selected');

  await setDateToJanFirst2019(t);
  await button.click();
  await assertAttributeValues(t, ex.jan12019Day, 'aria-selected', 'true');

  let selectedButtons = await t.context.queryElements(t, By.css(`${ex.allDates}[aria-selected="true"]`));

  t.is(
    selectedButtons.length,
    1,
    'after setting date in box, only one button should have aria-selected'
  );

  await (await t.context.session.findElement(By.css(ex.jan22019Day))).click();
  await button.click();
  await assertAttributeValues(t, ex.jan22019Day, 'aria-selected', 'true');

  selectedButtons = await t.context.queryElements(t, By.css(`${ex.allDates}[aria-selected="true"]`));

  t.is(
    selectedButtons.length,
    1,
    'after clicking a date and re-opening datepicker, only one button should have aria-selected'
  );

});

// Keyboard


ariaTest('DOWN ARROW, ALT plus DOWN ARROW and ENTER to open datepicker', exampleFile, 'combobox-down-arrow-enter', async (t) => {
  let combobox = await t.context.session.findElement(By.css(ex.comboboxSelector));
  let dialog = await t.context.session.findElement(By.css(ex.dialogSelector));
  let cancel = await t.context.session.findElement(By.css(ex.cancelSelector))

  // Test ENTER key
  await combobox.sendKeys(Key.ENTER);

  t.not(
    await dialog.getCssValue('display'),
    'none',
    'After sending ENTER to the combobox, the calendar dialog should open'
  );

  // Close dialog
  await cancel.sendKeys(Key.ENTER);

  t.not(
    await dialog.getCssValue('display'),
    'block',
    'After sending ESCAPE to the dialog, the calendar dialog should close'
  );

  // Test DOWN ARROW key
  await combobox.sendKeys(Key.ARROW_DOWN);

  t.not(
    await dialog.getCssValue('display'),
    'none',
    'After sending DOWN ARROW to the combobox, the calendar dialog should open'
  );

  // Close dialog
  await cancel.sendKeys(Key.ENTER);

  t.not(
    await dialog.getCssValue('display'),
    'block',
    'After sending ESCAPE to the dialog, the calendar dialog should close'
  );

  // Test ALT + DOWN ARROW key
  await combobox.sendKeys(Key.ALT, Key.ARROW_DOWN);

  t.not(
    await dialog.getCssValue('display'),
    'none',
    'After sending DOWN ARROW to the combobox, the calendar dialog should open'
  );

  // Close dialog
  await cancel.sendKeys(Key.ENTER);

  t.not(
    await dialog.getCssValue('display'),
    'block',
    'After sending ESCAPE to the dialog, the calendar dialog should close'
  );

});

ariaTest('ENTER to open datepicker', exampleFile, 'button-space-return', async (t) => {
  let chooseDateButton = await t.context.session.findElement(By.css(ex.buttonSelector));
  await chooseDateButton.sendKeys(Key.ENTER);

  t.not(
    await (await t.context.session.findElement(By.css(ex.dialogSelector))).getCssValue('display'),
    'none',
    'After sending ENTER to the "choose date" button, the calendar dialog should open'
  );
});

ariaTest('SPACE to open datepicker', exampleFile, 'button-space-return', async (t) => {
  let chooseDateButton = await t.context.session.findElement(By.css(ex.buttonSelector));
  await chooseDateButton.sendKeys(' ');

  t.not(
    await (await t.context.session.findElement(By.css(ex.dialogSelector))).getCssValue('display'),
    'none',
    'After sending SPACE to the "choose date" button, the calendar dialog should open'
  );
});

ariaTest('Sending key ESC when focus is in dialog closes dialog', exampleFile, 'dialog-esc', async (t) => {
  let chooseDateButton = await t.context.session.findElement(By.css(ex.buttonSelector));

  for (let i = 0; i < ex.allFocusableElementsInDialog.length; i++) {

    await chooseDateButton.sendKeys(Key.ENTER);
    let el = await t.context.session.findElement(By.css(ex.allFocusableElementsInDialog[i]));
    await el.sendKeys(Key.ESCAPE);

    t.is(
      await (await t.context.session.findElement(By.css(ex.dialogSelector))).getCssValue('display'),
      'none',
      'After sending ESC to element "' + ex.allFocusableElementsInDialog[i] + '" in the dialog, the calendar dialog should close'
    );

    t.is(
      await (await t.context.session.findElement(By.css(ex.comboboxSelector))).getAttribute('value'),
      '',
      'After sending ESC to element "' + ex.allFocusableElementsInDialog[i] + '" in the dialog, no date should be selected'
    );
  }
});

ariaTest('ENTER on previous year or month and SPACE on next year or month changes the year or month', exampleFile, 'month-year-button-space-return', async (t) => {
  await (await t.context.session.findElement(By.css(ex.buttonSelector))).sendKeys(Key.ENTER);

  let monthYear = await t.context.session.findElement(By.css(ex.monthYear));
  let originalMonthYear = await monthYear.getText();

  for (let yearOrMonth of ['Year', 'Month']) {
    let yearOrMonthLower = yearOrMonth.toLowerCase();

    // enter on previous year or month should change the monthYear text
    await (await t.context.session.findElement(By.css(ex[`prev${yearOrMonth}`]))).sendKeys(Key.ENTER);

    t.not(
      await monthYear.getText(),
      originalMonthYear,
      `After sending ENTER on the "previous ${yearOrMonthLower}" button, the month and year text should be not be ${originalMonthYear}`
    );

    // space on next year or month should change it back to the original
    await (await t.context.session.findElement(By.css(ex[`next${yearOrMonth}`]))).sendKeys(Key.SPACE);

    t.is(
      await monthYear.getText(),
      originalMonthYear,
      `After sending SPACE on the "next ${yearOrMonthLower}" button, the month and year text should be ${originalMonthYear}`
    );
  }
});

ariaTest('Tab should go through all tabbable items, then repear', exampleFile, 'dialog-tab', async (t) => {
  await (await t.context.session.findElement(By.css(ex.buttonSelector))).sendKeys(Key.ENTER);

  for (let itemSelector of ex.allFocusableElementsInDialog) {
    t.true(
      await focusMatchesElement(t, itemSelector),
      'Focus should be on: ' + itemSelector
    );

    await (await t.context.session.findElement(By.css(itemSelector))).sendKeys(Key.TAB);
  }

  t.true(
    await focusMatchesElement(t, ex.allFocusableElementsInDialog[0]),
    'After tabbing through all items, focus should return to: ' + ex.allFocusableElementsInDialog[0]
  );
});

ariaTest('Shift-tab should move focus backwards', exampleFile, 'dialog-shift-tab', async (t) => {
  t.plan(7);

  await (await t.context.session.findElement(By.css(ex.buttonSelector))).sendKeys(Key.ENTER);

  await (await t.context.session.findElement(By.css(ex.allFocusableElementsInDialog[0])))
    .sendKeys(Key.chord(Key.SHIFT, Key.TAB));

  let lastIndex = ex.allFocusableElementsInDialog.length - 1;
  for (let i = lastIndex; i >= 0; i--) {
    t.true(
      await focusMatchesElement(t, ex.allFocusableElementsInDialog[i]),
      'Focus should be on: ' + ex.allFocusableElementsInDialog[i]
    );

    await (await t.context.session.findElement(By.css(ex.allFocusableElementsInDialog[i])))
      .sendKeys(Key.chord(Key.SHIFT, Key.TAB));
  }
});
