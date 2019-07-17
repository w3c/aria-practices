'use strict';

const { ariaTest } = require('..');
const { By, Key } = require('selenium-webdriver');
const assertAttributeValues = require('../util/assertAttributeValues');
const assertAriaControls = require('../util/assertAriaControls');
const assertAriaLabelledby = require('../util/assertAriaLabelledby');
const assertAriaDescribedby = require('../util/assertAriaDescribedby');
const assertAriaLabelExists = require('../util/assertAriaLabelExists');
const assertAriaRoles = require('../util/assertAriaRoles');
const assertTabOrder = require('../util/assertTabOrder');

const exampleFile = 'combobox/aria1.1pattern/combo-11-datepicker.html';

let today = new Date();
let todayDataDate = today.toISOString().split('T')[0];

const ex = {
  comboboxSelector: '#myDatepicker',
  dialogSelector: '#example [role="dialog"]',
  inputSelector: '#example input',
  buttonSelector: '#example button.icon',
  statusSelector: '#example [role="status"]',
  dialogMessageSelector: '#example .dialogMessage',
  gridSelector: '#example [role="grid"]',
  gridcellSelector: '#example [role="gridcell"]',
  controlButtons: '#example [role="dialog"] .header button',
  currentMonthDateButtons: '#example [role="dialog"] button.dateButton:not(.disabled)',
  allDateButtons: '#example [role="dialog"] button.dateButton',
  jan12019Button: '#example [role="dialog"] button[data-date="2019-01-01"]',
  jan22019Button: '#example [role="dialog"] button[data-date="2019-01-02"]',
  todayButton: `#example [role="dialog"] button[data-date="${todayDataDate}"]`,
  allFocusableElementsInDialog: [
    `#example [role="dialog"] button[data-date="${todayDataDate}"]`,
    '#example [role="dialog"] button[value="cancel"]',
    '#example [role="dialog"] button[value="ok"]',
    '#example [role="dialog"] button.prevYear',
    '#example [role="dialog"] button.prevMonth',
    '#example [role="dialog"] button.nextMonth',
    '#example [role="dialog"] button.nextYear'
  ]
};

const clickFirstOfMonth = async function (t) {
  let today = new Date();
  today.setUTCHours(0,0,0,0);

  let firstOfMonth = new Date(today);
  firstOfMonth.setDate(1);
  let firstOfMonthString = today.toISOString().split('T')[0];

  return t.context.session.findElement(By.css(`[data-date=${firstOfMonthString}]`)).click();
};

const clickToday = async function (t) {
  let today = new Date();
  today.setUTCHours(0,0,0,0);
  let todayString = today.toISOString().split('T')[0];
  return t.context.session.findElement(By.css(`[data-date=${todayString}]`)).click();
};

const setDateToJanFirst2019 = async function (t) {
  await t.context.session.findElement(By.css(ex.inputSelector)).click();
  return t.context.session.executeScript(function () {
    const inputSelector = arguments[0];
    document.querySelector(inputSelector).value = '1/1/2019';
  }, ex.inputSelector);
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

ariaTest('Combobox: has role', exampleFile, 'combobox-role', async (t) => {
  t.plan(1);
  await assertAriaRoles(t, 'example', 'combobox', 1, 'div');
});

ariaTest('Combobox: has aria-labelledby', exampleFile, 'combobox-aria-labelledby', async (t) => {
  t.plan(1);
  await assertAriaLabelledby(t, ex.comboboxSelector);
});

ariaTest('Combobox: has aria-haspopup set to "dialog"', exampleFile, 'combobox-aria-haspopup', async (t) => {
  t.plan(1);
  await assertAttributeValues(t, ex.comboboxSelector, 'aria-haspopup', 'dialog');
});

ariaTest('Combobox: has aria-owns set to "myDatepickerDialog"', exampleFile, 'combobox-aria-owns', async (t) => {
  t.plan(1);
  await assertAttributeValues(t, ex.comboboxSelector, 'aria-owns', 'myDatepickerDialog');
});

ariaTest('Combobox: has aria-labelledby set to "id-label-1"', exampleFile, 'combobox-aria-labelledby', async (t) => {
  t.plan(1);
  await assertAttributeValues(t, ex.comboboxSelector, 'aria-labelledby', 'id-label-1');
});

ariaTest('Combobox: Initially aria-expanded set to "false"', exampleFile, 'combobox-aria-expanded', async (t) => {
  t.plan(1);
  await assertAttributeValues(t, ex.comboboxSelector, 'aria-expanded', 'false');
});


// Button Tests

ariaTest('"aria-label" attribute on button', exampleFile, 'calendar-button-aria-label', async (t) => {
  t.plan(1);
  await assertAriaLabelExists(t,  ex.buttonSelector);
});

// Dialog Tests

ariaTest('role="dialog" attribute on div', exampleFile, 'dialog-role', async (t) => {
  t.plan(1);
  await assertAriaRoles(t, 'example', 'dialog', 1, 'div');
});

ariaTest('aria-modal="true" on modal', exampleFile, 'dialog-aria-modal', async (t) => {
  t.plan(1);
  await assertAttributeValues(t, ex.dialogSelector, 'aria-modal', 'true');
});

ariaTest('aria-labelledby exist on dialog', exampleFile, 'dialog-aria-labelledby', async (t) => {
  t.plan(1);
  await assertAriaLabelledby(t, ex.dialogSelector);
});

ariaTest('aria-live="polite" on keyboard support message', exampleFile, 'dialog-aria-live', async (t) => {
  t.plan(1);
  await assertAttributeValues(t, ex.dialogMessageSelector, 'aria-live', 'polite');
});

ariaTest('"aria-label" exists on control buttons', exampleFile, 'change-date-button-aria-label', async (t) => {
  t.plan(1);
  await assertAriaLabelExists(t, ex.controlButtons);
});

ariaTest('aria-live="polite" on dialog header', exampleFile, 'change-date-aria-live', async (t) => {
  t.plan(1);
  await assertAttributeValues(t, `${ex.dialogSelector} h2`, 'aria-live', 'polite');
});

ariaTest('grid role on table element', exampleFile, 'grid-role', async (t) => {
  t.plan(1);
  await assertAriaRoles(t, 'example', 'grid', 1, 'table');
});

ariaTest('aria-labelledby on grid element', exampleFile, 'grid-aria-labelledby', async (t) => {
  t.plan(1);
  await assertAriaLabelledby(t, ex.gridSelector);
});

ariaTest('Roving tab index on dates in gridcell', exampleFile, 'gridcell-button-tabindex', async (t) => {
  await setDateToJanFirst2019(t);
  await t.context.session.findElement(By.css(ex.buttonSelector)).click();

  let focusableButtons = await t.context.session.findElements(By.css(ex.currentMonthDateButtons));
  let allButtons = await t.context.session.findElements(By.css(ex.allDateButtons));

  // test only one element has tabindex="0"
  for (let tabableEl = 0; tabableEl < 30; tabableEl++) {
    let dateSelected = await focusableButtons[tabableEl].getText();

    for (let el = 0; el < allButtons.length; el++) {
      let date = await allButtons[el].getText();
      let disabled = (await allButtons[el].getAttribute('class')).includes('disabled');
      let tabindex = dateSelected === date && !disabled ? '0' : '-1';

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

// This test failed due to issue: https://github.com/w3c/aria-practices/issues/1072
// If you fix it, please remove ".failing"
ariaTest('aria-selected on selected date', exampleFile, 'gridcell-button-aria-selected', async (t) => {
  t.plan(5);

  await t.context.session.findElement(By.css(ex.buttonSelector)).click();
  await assertAttributeDNE(t, ex.allDateButtons, 'aria-selected');

  await setDateToJanFirst2019(t);
  await t.context.session.findElement(By.css(ex.buttonSelector)).click();
  await assertAttributeValues(t, ex.jan12019Button, 'aria-selected', 'true');

  let selectedButtons = await t.context.session.findElements(
    By.css(`${ex.allDateButtons}[aria-selected="true"]`)
  );

  t.is(
    selectedButtons.length,
    1,
    'after setting date in box, only one button should have aria-selected'
  );

  await t.context.session.findElement(By.css(ex.jan22019Button)).click();
  await t.context.session.findElement(By.css(ex.buttonSelector)).click();
  await assertAttributeValues(t, ex.jan22019Button, 'aria-selected', 'true');

  selectedButtons = await t.context.session.findElements(
    By.css(`${ex.allDateButtons}[aria-selected="true"]`)
  );

  t.is(
    selectedButtons.length,
    1,
    'after clicking a date and re-opening datepicker, only one button should have aria-selected'
  );

});


// Keyboard

ariaTest('ENTER to open datepicker', exampleFile, 'button-space-return', async (t) => {
  let chooseDateButton = await t.context.session.findElement(By.css(ex.buttonSelector));
  chooseDateButton.sendKeys(Key.ENTER);

  t.not(
    await t.context.session.findElement(By.css(ex.dialogSelector)).getCssValue('display'),
    'none',
    'After sending ENTER to the "choose date" button, the calendar dialog should open'
  );
});

ariaTest('SPACE to open datepicker', exampleFile, 'button-space-return', async (t) => {
  let chooseDateButton = await t.context.session.findElement(By.css(ex.buttonSelector));
  chooseDateButton.sendKeys(Key.SPACE);

  t.not(
    await t.context.session.findElement(By.css(ex.dialogSelector)).getCssValue('display'),
    'none',
    'After sending SPACE to the "choose date" button, the calendar dialog should open'
  );
});

ariaTest('Sending key ESC when focus is in dialog closes dialog', exampleFile, 'dialog-esc', async (t) => {
  t.plan(14);

  let chooseDateButton = await t.context.session.findElement(By.css(ex.buttonSelector));

  for (let i = 0; i < ex.allFocusableElementsInDialog.length; i++) {

    await chooseDateButton.click();
    let el = t.context.session.findElement(By.css(ex.allFocusableElementsInDialog[i]));
    await el.sendKeys(Key.ESCAPE);

    t.is(
      await t.context.session.findElement(By.css(ex.dialogSelector)).getCssValue('display'),
      'none',
      'After sending ESC to element "' + ex.allFocusableElementsInDialog[i] + '" in the dialog, the calendar dialog should close'
    );

    t.is(
      await t.context.session.findElement(By.css(ex.inputSelector)).getAttribute('value'),
      '',
      'After sending ESC to element "' + ex.allFocusableElementsInDialog[i] + '" in the dialog, no date should be selected'
    );
  }
});

ariaTest('Tab should go through all tabbable items, then repear', exampleFile, 'dialog-tab', async (t) => {
  t.plan(8);

  await t.context.session.findElement(By.css(ex.buttonSelector)).click();

  for (let itemSelector of ex.allFocusableElementsInDialog) {
    t.true(
      await focusMatchesElement(t, itemSelector),
      'Focus should be on: ' + itemSelector
    );

    await t.context.session.findElement(By.css(itemSelector)).sendKeys(Key.TAB);
  }

  t.true(
    await focusMatchesElement(t, ex.allFocusableElementsInDialog[0]),
    'After tabbing through all items, focus should return to: ' + ex.allFocusableElementsInDialog[0]
  );
});

ariaTest('', exampleFile, 'dialog-shift-tab', async (t) => {
  t.plan(7);

  await t.context.session.findElement(By.css(ex.buttonSelector)).click();

  await t.context.session.findElement(By.css(ex.allFocusableElementsInDialog[0]))
    .sendKeys(Key.chord(Key.SHIFT, Key.TAB));

  let lastIndex = ex.allFocusableElementsInDialog.length - 1;
  for (let i = lastIndex; i >= 0; i--) {
    t.true(
      await focusMatchesElement(t, ex.allFocusableElementsInDialog[i]),
      'Focus should be on: ' + ex.allFocusableElementsInDialog[i]
    );

    await t.context.session.findElement(By.css(ex.allFocusableElementsInDialog[i]))
      .sendKeys(Key.chord(Key.SHIFT, Key.TAB));
  }
});
