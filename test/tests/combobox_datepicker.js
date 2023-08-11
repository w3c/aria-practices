const { ariaTest } = require('..');
const { By, Key } = require('selenium-webdriver');
const assertAttributeValues = require('../util/assertAttributeValues');
const assertAttributeDNE = require('../util/assertAttributeDNE');
const assertAriaLabelledby = require('../util/assertAriaLabelledby');
const assertAriaLabelExists = require('../util/assertAriaLabelExists');
const assertAriaRoles = require('../util/assertAriaRoles');

const exampleFile =
  'content/patterns/combobox/examples/combobox-datepicker.html';

let today = new Date();
let todayDataDate = today.toISOString().split('T')[0];

const ex = {
  comboboxSelector: '#ex1 .group input',
  buttonSelector: '#ex1 .group button',
  calendarNavigationButtonSelector: '#ex1 [role="dialog"] .header button',
  currentlyFocusedDay: '#ex1 [role="dialog"] td[tabindex="0"]',
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
  monthYear: '#cb-grid-label',
  prevYear: '#ex1 [role="dialog"] button.prev-year',
  prevMonth: '#ex1 [role="dialog"] button.prev-month',
  nextMonth: '#ex1 [role="dialog"] button.next-month',
  nextYear: '#ex1 [role="dialog"] button.next-year',
  selectedDay: '#ex1 [role="dialog"] td[aria-selected="true"]',
};

ex.allFocusableElementsInDialog = [
  `#ex1 [role="dialog"] td[data-date="${todayDataDate}"]`,
  '#ex1 [role="dialog"] button[value="cancel"]',
  '#ex1 [role="dialog"] button[value="ok"]',
  ex.prevYear,
  ex.prevMonth,
  ex.nextMonth,
  ex.nextYear,
];

const setDate = async function (t, day) {
  const m = day.getMonth() + 1;
  const d = day.getDate();
  const y = day.getFullYear();

  await (await t.context.queryElement(t, ex.comboboxSelector)).click();
  return t.context.session.executeScript(
    function () {
      const inputSelector = arguments[0];
      const month = arguments[1];
      const day = arguments[2];
      const year = arguments[3];
      document.querySelector(inputSelector).value = `${month}/${day}/${year}`;
    },
    ex.comboboxSelector,
    m,
    d,
    y
  );
};

const checkDate = async function assertAriaRoles(t, dateSelector, day) {
  const d = day.getDate() < 10 ? '0' + day.getDate() : day.getDate();
  const m =
    day.getMonth() < 9 ? '0' + (day.getMonth() + 1) : day.getMonth() + 1;
  const targetDate = `${day.getFullYear()}-${m}-${d}`;

  t.is(
    await t.context.session
      .findElement(By.css(dateSelector))
      .getAttribute('data-date'),
    targetDate
  );
};

const setDateToJanFirst2019 = async function (t) {
  await (await t.context.queryElement(t, ex.comboboxSelector)).click();
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

ariaTest(
  'Combobox: has aria-haspopup set to "dialog"',
  exampleFile,
  'textbox-aria-haspopup',
  async (t) => {
    await assertAttributeValues(
      t,
      ex.comboboxSelector,
      'aria-haspopup',
      'dialog'
    );
  }
);

ariaTest(
  'Combobox: has aria-controls set to "id-dialog-1"',
  exampleFile,
  'textbox-aria-controls',
  async (t) => {
    await assertAttributeValues(
      t,
      ex.comboboxSelector,
      'aria-controls',
      'cb-dialog-1'
    );
  }
);

ariaTest(
  'Combobox: has aria-controls set to "id-description-1"',
  exampleFile,
  'textbox-aria-describedby',
  async (t) => {
    await assertAttributeValues(
      t,
      ex.comboboxSelector,
      'aria-describedby',
      'cb-description-1'
    );
  }
);

ariaTest(
  'Combobox: Initially aria-expanded set to "false"',
  exampleFile,
  'textbox-aria-expanded-false',
  async (t) => {
    await assertAttributeValues(
      t,
      ex.comboboxSelector,
      'aria-expanded',
      'false'
    );
  }
);

ariaTest(
  'Combobox: aria-expanded set to "true" when dialog is open',
  exampleFile,
  'textbox-aria-expanded-true',
  async (t) => {
    // Open dialog box
    await (
      await t.context.queryElement(t, ex.comboboxSelector)
    ).sendKeys(Key.ARROW_DOWN);
    await assertAttributeValues(
      t,
      ex.comboboxSelector,
      'aria-expanded',
      'true'
    );
  }
);

// Button Tests

ariaTest(
  'Button: "aria-label" attribute',
  exampleFile,
  'calendar-button-aria-label',
  async (t) => {
    await assertAriaLabelExists(t, ex.buttonSelector);
  }
);

ariaTest(
  'Button: "tabindex" is set to -1',
  exampleFile,
  'calendar-button-tabindex',
  async (t) => {
    await assertAttributeValues(t, ex.buttonSelector, 'tabindex', '-1');
  }
);

// Dialog Tests

ariaTest(
  'role="dialog" attribute on div',
  exampleFile,
  'dialog-role',
  async (t) => {
    await assertAriaRoles(t, 'ex1', 'dialog', 1, 'div');
  }
);

ariaTest(
  'aria-modal="true" on modal',
  exampleFile,
  'dialog-aria-modal',
  async (t) => {
    await assertAttributeValues(t, ex.dialogSelector, 'aria-modal', 'true');
  }
);

ariaTest(
  'aria-label exist on dialog',
  exampleFile,
  'dialog-aria-label',
  async (t) => {
    await assertAriaLabelExists(t, ex.dialogSelector);
  }
);

ariaTest(
  'aria-autocomplete="none" on textbox',
  exampleFile,
  'textbox-aria-autocomplete',
  async (t) => {
    await assertAttributeValues(
      t,
      ex.comboboxSelector,
      'aria-autocomplete',
      'none'
    );
  }
);

ariaTest(
  '"aria-label" exists on control buttons',
  exampleFile,
  'calendar-navigation-button-aria-label',
  async (t) => {
    await assertAriaLabelExists(t, ex.calendarNavigationButtonSelector);
  }
);

ariaTest(
  'aria-live="polite" on dialog header',
  exampleFile,
  'calendar-navigation-aria-live',
  async (t) => {
    await assertAttributeValues(
      t,
      `${ex.dialogSelector} h2`,
      'aria-live',
      'polite'
    );
  }
);

ariaTest(
  'aria-live="polite" on keyboard support message',
  exampleFile,
  'dialog-aria-live',
  async (t) => {
    await assertAttributeValues(
      t,
      ex.dialogMessageSelector,
      'aria-live',
      'polite'
    );
  }
);

ariaTest('grid role on table element', exampleFile, 'grid-role', async (t) => {
  await assertAriaRoles(t, 'ex1', 'grid', 1, 'table');
});

ariaTest(
  'aria-labelledby on grid element',
  exampleFile,
  'grid-aria-labelledby',
  async (t) => {
    await assertAriaLabelledby(t, ex.gridSelector);
  }
);

ariaTest(
  'Roving tab index on dates in gridcell',
  exampleFile,
  'gridcell-tabindex',
  async (t) => {
    let button = await t.context.queryElement(t, ex.buttonSelector);
    await setDateToJanFirst2019(t);

    await button.sendKeys(Key.ENTER);

    let focusableButtons = await t.context.queryElements(
      t,
      ex.currentMonthDateButtons
    );
    let allButtons = await t.context.queryElements(t, ex.allDates);

    // test only one element has tabindex="0"
    for (
      let tabbableEl = 0;
      tabbableEl < focusableButtons.length;
      tabbableEl++
    ) {
      let dateSelected = await focusableButtons[tabbableEl].getText();

      for (let el = 0; el < allButtons.length; el++) {
        let date = await allButtons[el].getText();
        let disabled = (await allButtons[el].getAttribute('class')).includes(
          'disabled'
        );
        let tabindex = dateSelected === date && !disabled ? '0' : '-1';
        t.log(
          'Tabindex: ' +
            tabindex +
            ' DS: ' +
            dateSelected +
            ' D: ' +
            date +
            ' Disabled: ' +
            disabled
        );

        t.is(
          await allButtons[el].getAttribute('tabindex'),
          tabindex,
          'focus is on day ' +
            (tabbableEl + 1) +
            ' therefore the button number ' +
            el +
            ' should have tab index set to: ' +
            tabindex
        );
      }

      // Send the tabindex="0" element the appropriate key to switch focus to the next element
      await focusableButtons[tabbableEl].sendKeys(Key.ARROW_RIGHT);
    }
  }
);

ariaTest(
  'aria-selected on selected date',
  exampleFile,
  'gridcell-aria-selected',
  async (t) => {
    let button = await t.context.queryElement(t, ex.buttonSelector);

    await button.click();
    await assertAttributeDNE(t, ex.allDates, 'aria-selected');

    await setDateToJanFirst2019(t);
    await button.click();
    await assertAttributeValues(t, ex.jan12019Day, 'aria-selected', 'true');

    let selectedButtons = await t.context.queryElements(
      t,
      `${ex.allDates}[aria-selected="true"]`
    );

    t.is(
      selectedButtons.length,
      1,
      'after setting date in box, only one button should have aria-selected'
    );

    await (await t.context.queryElement(t, ex.jan22019Day)).click();
    await button.click();
    await assertAttributeValues(t, ex.jan22019Day, 'aria-selected', 'true');

    selectedButtons = await t.context.queryElements(
      t,
      `${ex.allDates}[aria-selected="true"]`
    );

    t.is(
      selectedButtons.length,
      1,
      'after clicking a date and re-opening datepicker, only one button should have aria-selected'
    );
  }
);

// Keyboard

ariaTest(
  'DOWN ARROW, ALT plus DOWN ARROW and ENTER to open datepicker',
  exampleFile,
  'combobox-down-arrow',
  async (t) => {
    let combobox = await t.context.queryElement(t, ex.comboboxSelector);
    let dialog = await t.context.queryElement(t, ex.dialogSelector);
    let cancel = await t.context.queryElement(t, ex.cancelSelector);

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
  }
);

ariaTest(
  'Sending key ESC when focus is in dialog closes dialog',
  exampleFile,
  'dialog-esc',
  async (t) => {
    let chooseDateButton = await t.context.queryElement(t, ex.buttonSelector);

    for (let i = 0; i < ex.allFocusableElementsInDialog.length; i++) {
      await chooseDateButton.sendKeys(Key.ENTER);
      let el = await t.context.queryElement(
        t,
        ex.allFocusableElementsInDialog[i]
      );
      await el.sendKeys(Key.ESCAPE);

      t.is(
        await (
          await t.context.queryElement(t, ex.dialogSelector)
        ).getCssValue('display'),
        'none',
        'After sending ESC to element "' +
          ex.allFocusableElementsInDialog[i] +
          '" in the dialog, the calendar dialog should close'
      );

      t.is(
        await (
          await t.context.queryElement(t, ex.comboboxSelector)
        ).getAttribute('value'),
        '',
        'After sending ESC to element "' +
          ex.allFocusableElementsInDialog[i] +
          '" in the dialog, no date should be selected'
      );
    }
  }
);

ariaTest(
  'ENTER on previous year or month and SPACE on next year or month changes the year or month',
  exampleFile,
  'month-year-button-space-return',
  async (t) => {
    await (
      await t.context.queryElement(t, ex.buttonSelector)
    ).sendKeys(Key.ENTER);

    let monthYear = await t.context.queryElement(t, ex.monthYear);
    let originalMonthYear = await monthYear.getText();

    for (let yearOrMonth of ['Year', 'Month']) {
      let yearOrMonthLower = yearOrMonth.toLowerCase();

      // enter on previous year or month should change the monthYear text
      await (
        await t.context.queryElement(t, ex[`prev${yearOrMonth}`])
      ).sendKeys(Key.ENTER);

      t.not(
        await monthYear.getText(),
        originalMonthYear,
        `After sending ENTER on the "previous ${yearOrMonthLower}" button, the month and year text should be not be ${originalMonthYear}`
      );

      // space on next year or month should change it back to the original
      await (
        await t.context.queryElement(t, ex[`next${yearOrMonth}`])
      ).sendKeys(' ');

      t.is(
        await monthYear.getText(),
        originalMonthYear,
        `After sending SPACE on the "next ${yearOrMonthLower}" button, the month and year text should be ${originalMonthYear}`
      );
    }
  }
);

ariaTest(
  'Tab should go through all tabbable items, then repeat',
  exampleFile,
  'dialog-tab',
  async (t) => {
    await (
      await t.context.queryElement(t, ex.buttonSelector)
    ).sendKeys(Key.ENTER);

    for (let itemSelector of ex.allFocusableElementsInDialog) {
      t.true(
        await focusMatchesElement(t, itemSelector),
        'Focus should be on: ' + itemSelector
      );

      await (await t.context.queryElement(t, itemSelector)).sendKeys(Key.TAB);
    }

    t.true(
      await focusMatchesElement(t, ex.allFocusableElementsInDialog[0]),
      'After tabbing through all items, focus should return to: ' +
        ex.allFocusableElementsInDialog[0]
    );
  }
);

ariaTest(
  'Shift-tab should move focus backwards',
  exampleFile,
  'dialog-shift-tab',
  async (t) => {
    t.plan(7);

    await (
      await t.context.queryElement(t, ex.buttonSelector)
    ).sendKeys(Key.ENTER);

    await (
      await t.context.queryElement(t, ex.allFocusableElementsInDialog[0])
    ).sendKeys(Key.chord(Key.SHIFT, Key.TAB));

    let lastIndex = ex.allFocusableElementsInDialog.length - 1;
    for (let i = lastIndex; i >= 0; i--) {
      t.true(
        await focusMatchesElement(t, ex.allFocusableElementsInDialog[i]),
        'Focus should be on: ' + ex.allFocusableElementsInDialog[i]
      );

      await (
        await t.context.queryElement(t, ex.allFocusableElementsInDialog[i])
      ).sendKeys(Key.chord(Key.SHIFT, Key.TAB));
    }
  }
);

ariaTest(
  'ENTER selects date in focus and closes dialog box',
  exampleFile,
  'grid-enter',
  async (t) => {
    // By default, focus will be on today's date.
    let day = new Date();

    let combo = await t.context.queryElement(t, ex.comboboxSelector);
    await setDate(t, day);
    await combo.sendKeys(Key.ARROW_DOWN);

    await t.context.session
      .findElement(By.css(ex.selectedDay))
      .sendKeys(Key.ARROW_RIGHT);
    await t.context.session
      .findElement(By.css(ex.currentlyFocusedDay))
      .sendKeys(Key.ENTER);

    day.setDate(day.getDate() + 1);

    t.is(
      await t.context.session
        .findElement(By.css(ex.comboboxSelector))
        .getAttribute('value'),
      `${day.getMonth() + 1}/${day.getDate()}/${day.getFullYear()}`
    );
  }
);

ariaTest(
  'SPACE selects date in focus',
  exampleFile,
  'grid-space',
  async (t) => {
    // By default, focus will be on todays date.
    let day = new Date();

    let combo = await t.context.queryElement(t, ex.comboboxSelector);
    await setDate(t, day);
    await combo.sendKeys(Key.ARROW_DOWN);

    await t.context.session
      .findElement(By.css(ex.selectedDay))
      .sendKeys(Key.ARROW_RIGHT);
    await t.context.session
      .findElement(By.css(ex.currentlyFocusedDay))
      .sendKeys(' ');

    day.setDate(day.getDate() + 1);
    await checkDate(t, ex.selectedDay, day);
  }
);

ariaTest(
  `UP ARROW moves focus to same day on previous week`,
  exampleFile,
  'grid-up-arrow',
  async (t) => {
    // By default, focus will be on todays date.
    let day = new Date();

    let combo = await t.context.queryElement(t, ex.comboboxSelector);
    await setDate(t, day);
    await combo.sendKeys(Key.ARROW_DOWN);

    await t.context.session
      .findElement(By.css(ex.selectedDay))
      .sendKeys(Key.ARROW_UP);

    day.setDate(day.getDate() - 7);
    await checkDate(t, ex.currentlyFocusedDay, day);
  }
);

ariaTest(
  `DOWN ARROW moves focus to same day on next week`,
  exampleFile,
  'grid-down-arrow',
  async (t) => {
    // By default, focus will be on todays date.
    let day = new Date();

    let combo = await t.context.queryElement(t, ex.comboboxSelector);
    await setDate(t, day);
    await combo.sendKeys(Key.ARROW_DOWN);

    await t.context.session
      .findElement(By.css(ex.selectedDay))
      .sendKeys(Key.ARROW_DOWN);

    day.setDate(day.getDate() + 7);
    await checkDate(t, ex.currentlyFocusedDay, day);
  }
);

ariaTest(
  `RIGHT ARROW moves focus to next day`,
  exampleFile,
  'grid-right-arrow',
  async (t) => {
    // By default, focus will be on todays date.
    let day = new Date();

    let combo = await t.context.queryElement(t, ex.comboboxSelector);
    await setDate(t, day);
    await combo.sendKeys(Key.ARROW_DOWN);

    await t.context.session
      .findElement(By.css(ex.selectedDay))
      .sendKeys(Key.ARROW_RIGHT);

    day.setDate(day.getDate() + 1);
    await checkDate(t, ex.currentlyFocusedDay, day);
  }
);

ariaTest(
  `LEFT ARROW moves focus to previous day`,
  exampleFile,
  'grid-left-arrow',
  async (t) => {
    // By default, focus will be on todays date.
    let day = new Date();

    let combo = await t.context.queryElement(t, ex.comboboxSelector);
    await setDate(t, day);
    await combo.sendKeys(Key.ARROW_DOWN);

    await t.context.session
      .findElement(By.css(ex.selectedDay))
      .sendKeys(Key.ARROW_LEFT);

    day.setDate(day.getDate() - 1);
    await checkDate(t, ex.currentlyFocusedDay, day);
  }
);

ariaTest(
  `HOME moves focus to the Sunday of the current week`,
  exampleFile,
  'grid-home',
  async (t) => {
    const dates = [
      ['3/1/2023', '2/26/2023'],
      ['3/2/2023', '2/26/2023'],
      ['3/3/2023', '2/26/2023'],
      ['3/4/2023', '2/26/2023'],
      ['3/5/2023', '3/5/2023'],
      ['3/6/2023', '3/5/2023'],
    ];

    for (let i = 0; i < dates.length; i += 1) {
      let startDate = dates[i][0];
      let targetDate = dates[i][1];

      let day = new Date(startDate);

      let combo = await t.context.queryElement(t, ex.comboboxSelector);
      await setDate(t, day);
      await combo.sendKeys(Key.ARROW_DOWN);

      await t.context.session
        .findElement(By.css(ex.selectedDay))
        .sendKeys(Key.HOME);

      day = new Date(targetDate);
      await checkDate(t, ex.currentlyFocusedDay, day);
    }
  }
);

ariaTest(
  `END moves focus to the Saturday of the current week`,
  exampleFile,
  'grid-end',
  async (t) => {
    const dates = [
      ['2/28/2023', '3/4/2023'],
      ['3/1/2023', '3/4/2023'],
      ['3/2/2023', '3/4/2023'],
      ['3/3/2023', '3/4/2023'],
      ['3/4/2023', '3/4/2023'],
      ['3/5/2023', '3/11/2023'],
    ];

    for (let i = 0; i < dates.length; i += 1) {
      let startDate = dates[i][0];
      let targetDate = dates[i][1];

      let day = new Date(startDate);

      let combo = await t.context.queryElement(t, ex.comboboxSelector);
      await setDate(t, day);
      await combo.sendKeys(Key.ARROW_DOWN);

      await t.context.session
        .findElement(By.css(ex.selectedDay))
        .sendKeys(Key.END);

      day = new Date(targetDate);
      await checkDate(t, ex.currentlyFocusedDay, day);
    }
  }
);

ariaTest(
  `PAGE UP moves focus to same day on previous month`,
  exampleFile,
  'grid-pageup',
  async (t) => {
    const startDate = '1/31/2023';
    const targetDates = [
      '12/31/2022',
      '11/30/2022',
      '10/31/2022',
      '9/30/2022',
      '8/31/2022',
      '7/31/2022',
      '6/30/2022',
      '5/31/2022',
      '4/30/2022',
      '3/31/2022',
      '2/28/2022',
      '1/31/2022',
    ];

    let combo = await t.context.queryElement(t, ex.comboboxSelector);
    let day = new Date(startDate);
    await setDate(t, day);
    await combo.sendKeys(Key.ARROW_DOWN);

    for (let i = 0; i < targetDates.length; i += 1) {
      day = new Date(targetDates[i]);

      await t.context.session
        .findElement(By.css(ex.currentlyFocusedDay))
        .sendKeys(Key.PAGE_UP);

      await checkDate(t, ex.currentlyFocusedDay, day);
    }
  }
);

ariaTest(
  `SHIFT PAGE UP moves focus to same day and month in the previous year`,
  exampleFile,
  'grid-shift-pageup',
  async (t) => {
    const startDate = '1/31/2023';
    const targetDates = [
      '1/31/2022',
      '1/31/2021',
      '1/31/2020',
      '1/31/2019',
      '1/31/2018',
      '1/31/2017',
    ];

    let combo = await t.context.queryElement(t, ex.comboboxSelector);
    let day = new Date(startDate);
    await setDate(t, day);
    await combo.sendKeys(Key.ARROW_DOWN);

    for (let i = 0; i < targetDates.length; i += 1) {
      day = new Date(targetDates[i]);

      await t.context.session
        .findElement(By.css(ex.currentlyFocusedDay))
        .sendKeys(Key.chord(Key.SHIFT, Key.PAGE_UP));

      await checkDate(t, ex.currentlyFocusedDay, day);
    }
  }
);

ariaTest(
  `PAGE DOWN moves focus to same day on next month`,
  exampleFile,
  'grid-pagedown',
  async (t) => {
    const startDate = '1/31/2023';
    const targetDates = [
      '2/28/2023',
      '3/31/2023',
      '4/30/2023',
      '5/31/2023',
      '6/30/2023',
      '7/31/2023',
      '8/31/2023',
      '9/30/2023',
      '10/31/2023',
      '11/30/2023',
      '12/31/2023',
      '1/31/2024',
    ];

    let combo = await t.context.queryElement(t, ex.comboboxSelector);
    let day = new Date(startDate);
    await setDate(t, day);
    await combo.sendKeys(Key.ARROW_DOWN);

    for (let i = 0; i < targetDates.length; i += 1) {
      day = new Date(targetDates[i]);

      await t.context.session
        .findElement(By.css(ex.currentlyFocusedDay))
        .sendKeys(Key.PAGE_DOWN);

      await checkDate(t, ex.currentlyFocusedDay, day);
    }
  }
);

ariaTest(
  `SHIFT PAGE DOWN moves focus to same day and month in the next year`,
  exampleFile,
  'grid-shift-pagedown',
  async (t) => {
    const startDate = '1/31/2023';
    const targetDates = [
      '1/31/2024',
      '1/31/2025',
      '1/31/2026',
      '1/31/2027',
      '1/31/2028',
      '1/31/2029',
    ];

    let combo = await t.context.queryElement(t, ex.comboboxSelector);
    let day = new Date(startDate);
    await setDate(t, day);
    await combo.sendKeys(Key.ARROW_DOWN);

    for (let i = 0; i < targetDates.length; i += 1) {
      day = new Date(targetDates[i]);

      await t.context.session
        .findElement(By.css(ex.currentlyFocusedDay))
        .sendKeys(Key.chord(Key.SHIFT, Key.PAGE_DOWN));

      await checkDate(t, ex.currentlyFocusedDay, day);
    }
  }
);

ariaTest(
  `ENTER on cancel button does not select date`,
  exampleFile,
  'okay-cancel-button-space-return',
  async (t) => {
    await t.context.session
      .findElement(By.css(ex.comboboxSelector))
      .sendKeys(Key.ARROW_DOWN);

    await t.context.session
      .findElement(By.css(ex.cancelSelector))
      .sendKeys(Key.ENTER);

    t.is(
      await t.context.session
        .findElement(By.css(ex.comboboxSelector))
        .getAttribute('value'),
      '',
      'ENTER sent to cancel should not set a date'
    );

    t.is(
      await t.context.session
        .findElement(By.css(ex.dialogSelector))
        .getCssValue('display'),
      'none',
      'After sending ENTER to the "cancel" button, the calendar dialog should close'
    );

    await setDateToJanFirst2019(t);

    await t.context.session
      .findElement(By.css(ex.comboboxSelector))
      .sendKeys(Key.ARROW_DOWN);

    await t.context.session
      .findElement(By.css(ex.currentlyFocusedDay))
      .sendKeys(Key.ARROW_RIGHT);
    await t.context.session
      .findElement(By.css(ex.cancelSelector))
      .sendKeys(Key.ENTER);
    t.is(
      await t.context.session
        .findElement(By.css(ex.comboboxSelector))
        .getAttribute('value'),
      '1/1/2019',
      'ENTER send to cancel should not change date'
    );
    t.is(
      await t.context.session
        .findElement(By.css(ex.dialogSelector))
        .getCssValue('display'),
      'none',
      'After sending ENTER to the "cancel" button, the calendar dialog should close'
    );
  }
);
