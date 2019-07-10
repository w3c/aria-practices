'use strict';

const { ariaTest } = require('..');
const { By, Key } = require('selenium-webdriver');
const assertAttributeValues = require('../util/assertAttributeValues');
const assertAttributeDNE = require('../util/assertAttributeDNE');
const assertAriaLabelledby = require('../util/assertAriaLabelledby');
const assertAriaLabelExists = require('../util/assertAriaLabelExists');
const assertAriaRoles = require('../util/assertAriaRoles');
const assertRovingTabindex = require('../util/assertRovingTabindex');
const assertTabOrder = require('../util/assertTabOrder');

const exampleFile = 'dialog-modal/datepicker-dialog.html';

const ex = {
  dialogSelector: '#example [role="dialog"]',
  inputSelector: '#example input',
  buttonSelector: '#example button.icon',
  statusSelector: '#example [role="status"]',
  messageSelector: '#example .message',
  gridSelector: '#example [role="grid"]',
  gridcellSelector: '#example [role="gridcell"]',
  controlButtons: '#example [role="dialog"] .header button',
  currentMonthDateButtons: '#example [role="dialog"] button.dateButton:not(.disabled)',
  allDateButtons: '#example [role="dialog"] button.dateButton',
  jan12019Button: '#example [role="dialog"] button[data-date="2019-01-01"]',
  jan22019Button: '#example [role="dialog"] button[data-date="2019-01-02"]'
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
  await assertAttributeValues(t, ex.messageSelector, 'aria-live', 'polite');
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
ariaTest.failing('aria-selected on selected date', exampleFile, 'gridcell-button-aria-selected', async (t) => {
  t.plan(5);

  await t.context.session.findElement(By.css(ex.buttonSelector)).click();
  await assertAttributeDNE(t, ex.allDateButtons, 'aria-selected');

  await setDateToJanFirst2019(t);
  await t.context.session.findElement(By.css(ex.buttonSelector)).click();
  await assertAriaAttributeValue(t, ex.jan12019Button, 'aria-selected', true);

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
  await assertAriaAttributeValue(t, ex.jan22019Button, 'aria-selected', true);

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

// ariaTest('', exampleFile, 'button-space-return-down-arrow', async (t) => {
// });

// ariaTest('', exampleFile, 'dialog-esc', async (t) => {
// });

// ariaTest('', exampleFile, 'dialog-tab', async (t) => {
// });

// ariaTest('', exampleFile, 'dialog-shift-tab', async (t) => {
// });

// ariaTest('', exampleFile, 'month-year-button-space-return', async (t) => {
// });

// ariaTest('', exampleFile, 'grid-space-return', async (t) => {
// });

// ariaTest('', exampleFile, 'grid-up-arrow', async (t) => {
// });

// ariaTest('', exampleFile, 'grid-down-arrow', async (t) => {
// });

// ariaTest('', exampleFile, 'grid-right-arrow', async (t) => {
// });

// ariaTest('', exampleFile, 'grid-left-arrow', async (t) => {
// });

// ariaTest('', exampleFile, 'grid-home', async (t) => {
// });

// ariaTest('', exampleFile, 'grid-end', async (t) => {
// });

// ariaTest('', exampleFile, 'grid-pageup', async (t) => {
// });

// ariaTest('', exampleFile, 'grid-shift=pageup', async (t) => {
// });

// ariaTest('', exampleFile, 'grid-pagedown', async (t) => {
// });

// ariaTest('', exampleFile, 'grid-shift-pagedown', async (t) => {
// });

// ariaTest('', exampleFile, 'okay-cancel-button-space-return', async (t) => {
// });
