const { ariaTest } = require('..');
const { By, Key } = require('selenium-webdriver');
const assertAttributeValues = require('../util/assertAttributeValues');
const assertAttributeDNE = require('../util/assertAttributeDNE');
const assertAriaLabelledby = require('../util/assertAriaLabelledby');
const assertAriaLabelExists = require('../util/assertAriaLabelExists');
const assertAriaRoles = require('../util/assertAriaRoles');

const exampleFile = 'dialog-modal/datepicker-dialog.html';

let today = new Date();
let todayDataDate = today.toISOString().split('T')[0];

const ex = {
  dialogSelector: '#example [role="dialog"]',
  inputSelector: '#example input',
  buttonSelector: '#example button.icon',
  messageSelector: '#example .dialog-message',
  controlButtons: '#example [role="dialog"] .header button',
  gridSelector: '#example [role="dialog"] table.dates',
  gridcellSelector: '#example [role="dialog"] table.dates td',
  currentMonthDateButtons: '#example table.dates td:not(.disabled)',
  allDates: '#example [role="dialog"] table.dates td',
  jan12019Day:
    '#example [role="dialog"] table.dates td[data-date="2019-01-01"]',
  jan22019Day:
    '#example [role="dialog"] table.dates td[data-date="2019-01-02"]',
  todayDay: `#example [role="dialog"] table.dates td[data-date="${todayDataDate}"]`,
  currentlyFocusedDay: '#example [role="dialog"] table.dates td[tabindex="0"]',
  allFocusableElementsInDialog: [
    `#example [role="dialog"] table.dates td[data-date="${todayDataDate}"]`,
    '#example [role="dialog"] button[value="cancel"]',
    '#example [role="dialog"] button[value="ok"]',
    '#example [role="dialog"] button.prev-year',
    '#example [role="dialog"] button.prev-month',
    '#example [role="dialog"] button.next-month',
    '#example [role="dialog"] button.next-year',
  ],
  prevMonthButton: '#example [role="dialog"] button.prev-month',
  prevYearButton: '#example [role="dialog"] button.prev-year',
  nextMonthButton: '#example [role="dialog"] button.next-month',
  nextYearButton: '#example [role="dialog"] button.next-year',
  cancelButton: '#example [role="dialog"] button[value="cancel"]',
  okButton: '#example [role="dialog"] button[value="ok"]',
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

// Button Tests

ariaTest(
  '"aria-label" attribute on button',
  exampleFile,
  'calendar-button-aria-label',
  async (t) => {
    await assertAriaLabelExists(t, ex.buttonSelector);
  }
);

// Dialog Tests

ariaTest(
  'role="dialog" attribute on div',
  exampleFile,
  'dialog-role',
  async (t) => {
    await assertAriaRoles(t, 'example', 'dialog', 1, 'div');
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
  'aria-live="polite" on keyboard support message',
  exampleFile,
  'dialog-aria-live',
  async (t) => {
    await assertAttributeValues(t, ex.messageSelector, 'aria-live', 'polite');
  }
);

ariaTest(
  '"aria-label" exists on control buttons',
  exampleFile,
  'change-date-button-aria-label',
  async (t) => {
    await assertAriaLabelExists(t, ex.controlButtons);
  }
);

ariaTest(
  'aria-live="polite" on dialog header',
  exampleFile,
  'change-date-aria-live',
  async (t) => {
    await assertAttributeValues(
      t,
      `${ex.dialogSelector} h2`,
      'aria-live',
      'polite'
    );
  }
);

ariaTest('grid role on table element', exampleFile, 'grid-role', async (t) => {
  await assertAriaRoles(t, 'example', 'grid', 1, 'table');
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
  'gridcell-button-tabindex',
  async (t) => {
    await setDateToJanFirst2019(t);
    await t.context.session.findElement(By.css(ex.buttonSelector)).click();

    let focusableButtons = await t.context.queryElements(
      t,
      ex.currentMonthDateButtons
    );
    let allButtons = await t.context.queryElements(t, ex.allDates);

    // test only one element has tabindex="0"
    for (let tabbableEl = 0; tabbableEl < 30; tabbableEl++) {
      let dateSelected = await focusableButtons[tabbableEl].getText();

      for (let el = 0; el < allButtons.length; el++) {
        let date = await allButtons[el].getText();
        let disabled = (await allButtons[el].getAttribute('class')).includes(
          'disabled'
        );
        let tabindex = dateSelected === date && !disabled ? '0' : '-1';

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
  'gridcell-button-aria-selected',
  async (t) => {
    await t.context.session.findElement(By.css(ex.buttonSelector)).click();
    await assertAttributeDNE(t, ex.allDates, 'aria-selected');

    await setDateToJanFirst2019(t);
    await t.context.session.findElement(By.css(ex.buttonSelector)).click();
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

    await t.context.session.findElement(By.css(ex.jan22019Day)).click();
    await t.context.session.findElement(By.css(ex.buttonSelector)).click();
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
  'ENTER to open datepicker',
  exampleFile,
  'button-space-return',
  async (t) => {
    let chooseDateButton = await t.context.session.findElement(
      By.css(ex.buttonSelector)
    );
    chooseDateButton.sendKeys(Key.ENTER);

    t.not(
      await t.context.session
        .findElement(By.css(ex.dialogSelector))
        .getCssValue('display'),
      'none',
      'After sending ENTER to the "choose date" button, the calendar dialog should open'
    );
  }
);

ariaTest(
  'SPACE to open datepicker',
  exampleFile,
  'button-space-return',
  async (t) => {
    let chooseDateButton = await t.context.session.findElement(
      By.css(ex.buttonSelector)
    );
    chooseDateButton.sendKeys(' ');

    t.not(
      await t.context.session
        .findElement(By.css(ex.dialogSelector))
        .getCssValue('display'),
      'none',
      'After sending SPACE to the "choose date" button, the calendar dialog should open'
    );
  }
);

ariaTest(
  'Sending key ESC when focus is in dialog closes dialog',
  exampleFile,
  'dialog-esc',
  async (t) => {
    let chooseDateButton = await t.context.session.findElement(
      By.css(ex.buttonSelector)
    );

    for (let i = 0; i < ex.allFocusableElementsInDialog.length; i++) {
      await chooseDateButton.sendKeys(Key.ENTER);
      let el = t.context.session.findElement(
        By.css(ex.allFocusableElementsInDialog[i])
      );
      await el.sendKeys(Key.ESCAPE);

      t.is(
        await t.context.session
          .findElement(By.css(ex.dialogSelector))
          .getCssValue('display'),
        'none',
        'After sending ESC to element "' +
          ex.allFocusableElementsInDialog[i] +
          '" in the dialog, the calendar dialog should close'
      );

      t.is(
        await t.context.session
          .findElement(By.css(ex.inputSelector))
          .getAttribute('value'),
        '',
        'After sending ESC to element "' +
          ex.allFocusableElementsInDialog[i] +
          '" in the dialog, no date should be selected'
      );
    }
  }
);

ariaTest(
  'Tab should go through all tabbable items, then loop',
  exampleFile,
  'dialog-tab',
  async (t) => {
    await t.context.session.findElement(By.css(ex.buttonSelector)).click();

    for (let itemSelector of ex.allFocusableElementsInDialog) {
      t.true(
        await focusMatchesElement(t, itemSelector),
        'Focus should be on: ' + itemSelector
      );

      await t.context.session
        .findElement(By.css(itemSelector))
        .sendKeys(Key.TAB);
    }

    t.true(
      await focusMatchesElement(t, ex.allFocusableElementsInDialog[0]),
      'After tabbing through all items, focus should return to: ' +
        ex.allFocusableElementsInDialog[0]
    );
  }
);

ariaTest(
  'Shift+tab should send focus backwards through dialog, then loop',
  exampleFile,
  'dialog-shift-tab',
  async (t) => {
    await t.context.session.findElement(By.css(ex.buttonSelector)).click();

    await t.context.session
      .findElement(By.css(ex.allFocusableElementsInDialog[0]))
      .sendKeys(Key.chord(Key.SHIFT, Key.TAB));

    let lastIndex = ex.allFocusableElementsInDialog.length - 1;
    for (let i = lastIndex; i >= 0; i--) {
      t.true(
        await focusMatchesElement(t, ex.allFocusableElementsInDialog[i]),
        'Focus should be on: ' + ex.allFocusableElementsInDialog[i]
      );

      await t.context.session
        .findElement(By.css(ex.allFocusableElementsInDialog[i]))
        .sendKeys(Key.chord(Key.SHIFT, Key.TAB));
    }
  }
);

ariaTest(
  'ENTER to buttons change calendar and date in focus',
  exampleFile,
  'month-year-button-space-return',
  async (t) => {
    await t.context.session.findElement(By.css(ex.buttonSelector)).click();
    // By default, focus will be on todays date.
    let day = new Date();

    // send enter to next month button

    await t.context.session
      .findElement(By.css(ex.nextMonthButton))
      .sendKeys(Key.ENTER);
    day.setMonth(day.getMonth() + 1);
    let dayInFocus = await t.context.session
      .findElement(By.css(ex.currentlyFocusedDay))
      .getAttribute('data-date');

    t.is(
      dayInFocus,
      day.toISOString().split('T')[0],
      'After selected next month button, date should be ' +
        day.toISOString().split('T')[0] +
        ' but found: ' +
        dayInFocus
    );

    // send enter to next year button
    await t.context.session
      .findElement(By.css(ex.nextYearButton))
      .sendKeys(Key.ENTER);
    day.setFullYear(day.getFullYear() + 1);
    dayInFocus = await t.context.session
      .findElement(By.css(ex.currentlyFocusedDay))
      .getAttribute('data-date');

    t.is(
      dayInFocus,
      day.toISOString().split('T')[0],
      'After selected next month button, then next year button date should be ' +
        day.toISOString().split('T')[0] +
        ' but found: ' +
        dayInFocus
    );

    // Send enter to previous month button
    await t.context.session
      .findElement(By.css(ex.prevMonthButton))
      .sendKeys(Key.ENTER);
    day.setMonth(day.getMonth() - 1);
    dayInFocus = await t.context.session
      .findElement(By.css(ex.currentlyFocusedDay))
      .getAttribute('data-date');

    t.is(
      dayInFocus,
      day.toISOString().split('T')[0],
      'After selected next month button, then next year button date, then previous month button, date should be ' +
        day.toISOString().split('T')[0] +
        ' but found: ' +
        dayInFocus
    );

    // Send enter to previous year button

    await t.context.session
      .findElement(By.css(ex.prevYearButton))
      .sendKeys(Key.ENTER);
    day.setFullYear(day.getFullYear() - 1);
    dayInFocus = await t.context.session
      .findElement(By.css(ex.currentlyFocusedDay))
      .getAttribute('data-date');

    t.is(
      dayInFocus,
      day.toISOString().split('T')[0],
      'After selected next month button, then next year button date, then previous month button, then previous year button, date should be ' +
        day.toISOString().split('T')[0] +
        ' but found: ' +
        dayInFocus
    );
  }
);

ariaTest(
  'SPACE to buttons change calendar and date in focus',
  exampleFile,
  'month-year-button-space-return',
  async (t) => {
    await t.context.session.findElement(By.css(ex.buttonSelector)).click();
    // By default, focus will be on todays date.
    let day = new Date();

    // send space to next month button

    await t.context.session
      .findElement(By.css(ex.nextMonthButton))
      .sendKeys(Key.SPACE);
    day.setMonth(day.getMonth() + 1);
    let dayInFocus = await t.context.session
      .findElement(By.css(ex.currentlyFocusedDay))
      .getAttribute('data-date');

    t.is(
      dayInFocus,
      day.toISOString().split('T')[0],
      'After selected next month button, date should be ' +
        day.toISOString().split('T')[0] +
        ' but found: ' +
        dayInFocus
    );

    // send space to next year button
    await t.context.session
      .findElement(By.css(ex.nextYearButton))
      .sendKeys(Key.SPACE);
    day.setFullYear(day.getFullYear() + 1);
    dayInFocus = await t.context.session
      .findElement(By.css(ex.currentlyFocusedDay))
      .getAttribute('data-date');

    t.is(
      dayInFocus,
      day.toISOString().split('T')[0],
      'After selected next month button, then next year button date should be ' +
        day.toISOString().split('T')[0] +
        ' but found: ' +
        dayInFocus
    );

    // Send space to previous month button
    await t.context.session
      .findElement(By.css(ex.prevMonthButton))
      .sendKeys(Key.SPACE);
    day.setMonth(day.getMonth() - 1);
    dayInFocus = await t.context.session
      .findElement(By.css(ex.currentlyFocusedDay))
      .getAttribute('data-date');

    t.is(
      dayInFocus,
      day.toISOString().split('T')[0],
      'After selected next month button, then next year button date, then previous month button, date should be ' +
        day.toISOString().split('T')[0] +
        ' but found: ' +
        dayInFocus
    );

    // Send space to previous year button

    await t.context.session
      .findElement(By.css(ex.prevYearButton))
      .sendKeys(Key.SPACE);
    day.setFullYear(day.getFullYear() - 1);
    dayInFocus = await t.context.session
      .findElement(By.css(ex.currentlyFocusedDay))
      .getAttribute('data-date');

    t.is(
      dayInFocus,
      day.toISOString().split('T')[0],
      'After selected next month button, then next year button date, then previous month button, then previous year button, date should be ' +
        day.toISOString().split('T')[0] +
        ' but found: ' +
        dayInFocus
    );
  }
);

ariaTest(
  'SPACE or RETURN selects date in focus',
  exampleFile,
  'grid-space-return',
  async (t) => {
    // By default, focus will be on todays date.
    let day = new Date();

    await t.context.session
      .findElement(By.css(ex.buttonSelector))
      .sendKeys(Key.ENTER);
    await t.context.session
      .findElement(By.css(ex.todayDay))
      .sendKeys(Key.ENTER);
    t.is(
      await t.context.session
        .findElement(By.css(ex.inputSelector))
        .getAttribute('value'),
      `${day.getMonth() + 1}/${day.getDate()}/${day.getFullYear()}`,
      "ENTER sent to today's date button should select date"
    );

    await t.context.session.findElement(By.css(ex.buttonSelector)).click();
    await t.context.session
      .findElement(By.css(ex.todayDay))
      .sendKeys(Key.ARROW_RIGHT);
    await t.context.session
      .findElement(By.css(ex.currentlyFocusedDay))
      .sendKeys(' ');

    day.setDate(day.getDate() + 1);
    t.is(
      await t.context.session
        .findElement(By.css(ex.inputSelector))
        .getAttribute('value'),
      `${day.getMonth() + 1}/${day.getDate()}/${day.getFullYear()}`,
      "SPACE sent to tomorrow's date button should select tomorrow"
    );
  }
);

ariaTest(
  'UP ARROW moves date up by week',
  exampleFile,
  'grid-up-arrow',
  async (t) => {
    await t.context.session.findElement(By.css(ex.buttonSelector)).click();
    let day = new Date();

    for (let i = 1; i <= 5; i++) {
      // Send up arrow to key
      await t.context.session
        .findElement(By.css(ex.currentlyFocusedDay))
        .sendKeys(Key.ARROW_UP);

      day.setDate(day.getDate() - 7);
      t.is(
        await t.context.session
          .findElement(By.css(ex.currentlyFocusedDay))
          .getAttribute('data-date'),
        day.toISOString().split('T')[0],
        'After sending ' +
          i +
          ' UP ARROWS to focused date, the focused date should be: ' +
          day.toISOString().split('T')[0]
      );
    }
  }
);

ariaTest(
  'DOWN ARROW moves date down by week',
  exampleFile,
  'grid-down-arrow',
  async (t) => {
    await t.context.session.findElement(By.css(ex.buttonSelector)).click();
    let day = new Date();

    for (let i = 1; i <= 5; i++) {
      // Send up arrow to key
      await t.context.session
        .findElement(By.css(ex.currentlyFocusedDay))
        .sendKeys(Key.ARROW_DOWN);

      day.setDate(day.getDate() + 7);
      t.is(
        await t.context.session
          .findElement(By.css(ex.currentlyFocusedDay))
          .getAttribute('data-date'),
        day.toISOString().split('T')[0],
        'After sending ' +
          i +
          ' DOWN ARROWS to focused date, the focused date should be: ' +
          day.toISOString().split('T')[0]
      );
    }
  }
);

ariaTest(
  'RIGHT ARROW moves date greater by one',
  exampleFile,
  'grid-right-arrow',
  async (t) => {
    await t.context.session.findElement(By.css(ex.buttonSelector)).click();
    let day = new Date();

    for (let i = 1; i <= 31; i++) {
      // Send up arrow to key
      await t.context.session
        .findElement(By.css(ex.currentlyFocusedDay))
        .sendKeys(Key.ARROW_RIGHT);

      day.setDate(day.getDate() + 1);
      t.is(
        await t.context.session
          .findElement(By.css(ex.currentlyFocusedDay))
          .getAttribute('data-date'),
        day.toISOString().split('T')[0],
        'After sending ' +
          i +
          ' RIGHT ARROWS to focused date, the focused date should be: ' +
          day.toISOString().split('T')[0]
      );
    }
  }
);

ariaTest(
  'LEFT ARROW moves date previous one',
  exampleFile,
  'grid-left-arrow',
  async (t) => {
    await t.context.session.findElement(By.css(ex.buttonSelector)).click();
    let day = new Date();

    for (let i = 1; i <= 31; i++) {
      // Send up arrow to key
      await t.context.session
        .findElement(By.css(ex.currentlyFocusedDay))
        .sendKeys(Key.ARROW_LEFT);

      day.setDate(day.getDate() - 1);
      t.is(
        await t.context.session
          .findElement(By.css(ex.currentlyFocusedDay))
          .getAttribute('data-date'),
        day.toISOString().split('T')[0],
        'After sending ' +
          i +
          ' LEFT ARROWS to focused date, the focused date should be: ' +
          day.toISOString().split('T')[0]
      );
    }
  }
);

ariaTest(
  'Key HOME sends focus to beginning of row',
  exampleFile,
  'grid-home',
  async (t) => {
    await t.context.session.findElement(By.css(ex.buttonSelector)).click();
    let day = new Date();

    await t.context.session
      .findElement(By.css(ex.currentlyFocusedDay))
      .sendKeys(Key.HOME);
    day.setDate(day.getDate() - day.getDay()); // getDay returns day of week
    t.is(
      await t.context.session
        .findElement(By.css(ex.currentlyFocusedDay))
        .getAttribute('data-date'),
      day.toISOString().split('T')[0],
      'Sending HOME should move focus to Sunday: ' +
        day.toISOString().split('T')[0]
    );

    await t.context.session
      .findElement(By.css(ex.currentlyFocusedDay))
      .sendKeys(Key.HOME);
    t.is(
      await t.context.session
        .findElement(By.css(ex.currentlyFocusedDay))
        .getAttribute('data-date'),
      day.toISOString().split('T')[0],
      'Sending HOME to Sunday should not move focus from:' +
        day.toISOString().split('T')[0]
    );
  }
);

ariaTest(
  'Key END sends focus to end of row',
  exampleFile,
  'grid-end',
  async (t) => {
    await t.context.session.findElement(By.css(ex.buttonSelector)).click();
    let day = new Date();

    await t.context.session
      .findElement(By.css(ex.currentlyFocusedDay))
      .sendKeys(Key.END);

    day.setDate(day.getDate() + (6 - day.getDay())); // getDay returns day of week
    t.is(
      await t.context.session
        .findElement(By.css(ex.currentlyFocusedDay))
        .getAttribute('data-date'),
      day.toISOString().split('T')[0],
      'Sending END should move focus to Saturday: ' +
        day.toISOString().split('T')[0]
    );

    await t.context.session
      .findElement(By.css(ex.currentlyFocusedDay))
      .sendKeys(Key.END);
    t.is(
      await t.context.session
        .findElement(By.css(ex.currentlyFocusedDay))
        .getAttribute('data-date'),
      day.toISOString().split('T')[0],
      'Sending END to Saturday should not move focus from:' +
        day.toISOString().split('T')[0]
    );
  }
);

ariaTest(
  'Sending PAGE UP moves focus by back month',
  exampleFile,
  'grid-pageup',
  async (t) => {
    await t.context.session.findElement(By.css(ex.buttonSelector)).click();
    let day = new Date();

    await t.context.session
      .findElement(By.css(ex.currentlyFocusedDay))
      .sendKeys(Key.PAGE_UP);
    day.setMonth(day.getMonth() - 1);
    t.is(
      await t.context.session
        .findElement(By.css(ex.currentlyFocusedDay))
        .getAttribute('data-date'),
      day.toISOString().split('T')[0],
      'Sending PAGE UP should move focus back by month: ' +
        day.toISOString().split('T')[0]
    );

    await t.context.session
      .findElement(By.css(ex.currentlyFocusedDay))
      .sendKeys(Key.PAGE_UP);
    day.setMonth(day.getMonth() - 1);
    t.is(
      await t.context.session
        .findElement(By.css(ex.currentlyFocusedDay))
        .getAttribute('data-date'),
      day.toISOString().split('T')[0],
      'Sending PAGE UP should move focus back by month, again:' +
        day.toISOString().split('T')[0]
    );
  }
);

ariaTest(
  'Sending SHIFT+PAGE UP moves focus back by year',
  exampleFile,
  'grid-shift-pageup',
  async (t) => {
    await t.context.session.findElement(By.css(ex.buttonSelector)).click();
    let day = new Date();

    await t.context.session
      .findElement(By.css(ex.currentlyFocusedDay))
      .sendKeys(Key.chord(Key.SHIFT, Key.PAGE_UP));
    day.setFullYear(day.getFullYear() - 1);
    t.is(
      await t.context.session
        .findElement(By.css(ex.currentlyFocusedDay))
        .getAttribute('data-date'),
      day.toISOString().split('T')[0],
      'Sending SHIFT+PAGE UP should move focus back by year: ' +
        day.toISOString().split('T')[0]
    );

    await t.context.session
      .findElement(By.css(ex.currentlyFocusedDay))
      .sendKeys(Key.chord(Key.SHIFT, Key.PAGE_UP));
    day.setFullYear(day.getFullYear() - 1);
    t.is(
      await t.context.session
        .findElement(By.css(ex.currentlyFocusedDay))
        .getAttribute('data-date'),
      day.toISOString().split('T')[0],
      'Sending SHIFT+PAGE UP should move focus back by year, again:' +
        day.toISOString().split('T')[0]
    );
  }
);

ariaTest(
  'Sending PAGE DOWN moves focus back by month',
  exampleFile,
  'grid-pagedown',
  async (t) => {
    await t.context.session.findElement(By.css(ex.buttonSelector)).click();
    let day = new Date();

    await t.context.session
      .findElement(By.css(ex.currentlyFocusedDay))
      .sendKeys(Key.PAGE_DOWN);
    day.setMonth(day.getMonth() + 1);
    t.is(
      await t.context.session
        .findElement(By.css(ex.currentlyFocusedDay))
        .getAttribute('data-date'),
      day.toISOString().split('T')[0],
      'Sending PAGE UP should move focus forward by month: ' +
        day.toISOString().split('T')[0]
    );

    await t.context.session
      .findElement(By.css(ex.currentlyFocusedDay))
      .sendKeys(Key.PAGE_DOWN);
    day.setMonth(day.getMonth() + 1);
    t.is(
      await t.context.session
        .findElement(By.css(ex.currentlyFocusedDay))
        .getAttribute('data-date'),
      day.toISOString().split('T')[0],
      'Sending PAGE UP should move focus forward by month, again:' +
        day.toISOString().split('T')[0]
    );
  }
);

ariaTest(
  'Sending SHIFT+PAGE DOWN moves focus back by year',
  exampleFile,
  'grid-shift-pagedown',
  async (t) => {
    await t.context.session.findElement(By.css(ex.buttonSelector)).click();
    let day = new Date();

    await t.context.session
      .findElement(By.css(ex.currentlyFocusedDay))
      .sendKeys(Key.chord(Key.SHIFT, Key.PAGE_DOWN));
    day.setFullYear(day.getFullYear() + 1);
    t.is(
      await t.context.session
        .findElement(By.css(ex.currentlyFocusedDay))
        .getAttribute('data-date'),
      day.toISOString().split('T')[0],
      'Sending SHIFT+PAGE UP should move focus forward by year: ' +
        day.toISOString().split('T')[0]
    );

    await t.context.session
      .findElement(By.css(ex.currentlyFocusedDay))
      .sendKeys(Key.chord(Key.SHIFT, Key.PAGE_DOWN));
    day.setFullYear(day.getFullYear() + 1);
    t.is(
      await t.context.session
        .findElement(By.css(ex.currentlyFocusedDay))
        .getAttribute('data-date'),
      day.toISOString().split('T')[0],
      'Sending SHIFT+PAGE UP should move focus forward by year, again:' +
        day.toISOString().split('T')[0]
    );
  }
);

ariaTest(
  'ENTER on cancel button does not select date',
  exampleFile,
  'okay-cancel-button-space-return',
  async (t) => {
    await t.context.session.findElement(By.css(ex.buttonSelector)).click();
    await t.context.session
      .findElement(By.css(ex.cancelButton))
      .sendKeys(Key.ENTER);
    t.is(
      await t.context.session
        .findElement(By.css(ex.inputSelector))
        .getAttribute('value'),
      '',
      'ENTER sent to cancel should not set a date'
    );
    t.is(
      await t.context.session
        .findElement(By.css(ex.dialogSelector))
        .getCssValue('display'),
      'none',
      'After sending ENDER to the "cancel" button, the calendar dialog should close'
    );

    await setDateToJanFirst2019(t);
    await t.context.session.findElement(By.css(ex.buttonSelector)).click();
    await t.context.session
      .findElement(By.css(ex.currentlyFocusedDay))
      .sendKeys(Key.ARROW_RIGHT);
    await t.context.session
      .findElement(By.css(ex.cancelButton))
      .sendKeys(Key.ENTER);
    t.is(
      await t.context.session
        .findElement(By.css(ex.inputSelector))
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

ariaTest(
  'SPACE on cancel button does not select date',
  exampleFile,
  'okay-cancel-button-space-return',
  async (t) => {
    await t.context.session.findElement(By.css(ex.buttonSelector)).click();
    await t.context.session
      .findElement(By.css(ex.cancelButton))
      .sendKeys(Key.SPACE);
    t.is(
      await t.context.session
        .findElement(By.css(ex.inputSelector))
        .getAttribute('value'),
      '',
      'SPACE sent to cancel should not set a date'
    );
    t.is(
      await t.context.session
        .findElement(By.css(ex.dialogSelector))
        .getCssValue('display'),
      'none',
      'After sending SPACE to the "cancel" button, the calendar dialog should close'
    );

    await setDateToJanFirst2019(t);
    await t.context.session.findElement(By.css(ex.buttonSelector)).click();
    await t.context.session
      .findElement(By.css(ex.currentlyFocusedDay))
      .sendKeys(Key.ARROW_RIGHT);
    await t.context.session
      .findElement(By.css(ex.cancelButton))
      .sendKeys(Key.SPACE);
    t.is(
      await t.context.session
        .findElement(By.css(ex.inputSelector))
        .getAttribute('value'),
      '1/1/2019',
      'SPACE send to cancel should not change date'
    );
    t.is(
      await t.context.session
        .findElement(By.css(ex.dialogSelector))
        .getCssValue('display'),
      'none',
      'After sending SPACE to the "cancel" button, the calendar dialog should close'
    );
  }
);

ariaTest(
  'ENTER on ok button does selects date',
  exampleFile,
  'okay-cancel-button-space-return',
  async (t) => {
    let day = new Date();

    await t.context.session.findElement(By.css(ex.buttonSelector)).click();
    await t.context.session
      .findElement(By.css(ex.okButton))
      .sendKeys(Key.ENTER);
    t.is(
      await t.context.session
        .findElement(By.css(ex.inputSelector))
        .getAttribute('value'),
      `${day.getMonth() + 1}/${day.getDate()}/${day.getFullYear()}`,
      'ENTER sent to ok button should set a date'
    );
    t.is(
      await t.context.session
        .findElement(By.css(ex.dialogSelector))
        .getCssValue('display'),
      'none',
      'After sending ENTER to the "ok" button, the calendar dialog should close'
    );

    await setDateToJanFirst2019(t);
    await t.context.session.findElement(By.css(ex.buttonSelector)).click();
    await t.context.session
      .findElement(By.css(ex.currentlyFocusedDay))
      .sendKeys(Key.ARROW_RIGHT);
    await t.context.session
      .findElement(By.css(ex.okButton))
      .sendKeys(Key.ENTER);
    t.is(
      await t.context.session
        .findElement(By.css(ex.inputSelector))
        .getAttribute('value'),
      '1/2/2019',
      'ENTER send to ok should not change date to Jan 2nd'
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

ariaTest(
  'SPACE on ok button does selects date',
  exampleFile,
  'okay-cancel-button-space-return',
  async (t) => {
    let day = new Date();

    await t.context.session.findElement(By.css(ex.buttonSelector)).click();
    await t.context.session
      .findElement(By.css(ex.okButton))
      .sendKeys(Key.SPACE);
    t.is(
      await t.context.session
        .findElement(By.css(ex.inputSelector))
        .getAttribute('value'),
      `${day.getMonth() + 1}/${day.getDate()}/${day.getFullYear()}`,
      'SPACE sent to ok button should set a date'
    );
    t.is(
      await t.context.session
        .findElement(By.css(ex.dialogSelector))
        .getCssValue('display'),
      'none',
      'After sending SPACE to the "ok" button, the calendar dialog should close'
    );

    await setDateToJanFirst2019(t);
    await t.context.session.findElement(By.css(ex.buttonSelector)).click();
    await t.context.session
      .findElement(By.css(ex.currentlyFocusedDay))
      .sendKeys(Key.ARROW_RIGHT);
    await t.context.session
      .findElement(By.css(ex.okButton))
      .sendKeys(Key.SPACE);
    t.is(
      await t.context.session
        .findElement(By.css(ex.inputSelector))
        .getAttribute('value'),
      '1/2/2019',
      'SPACE send to ok should not change date to Jan 2nd'
    );
    t.is(
      await t.context.session
        .findElement(By.css(ex.dialogSelector))
        .getCssValue('display'),
      'none',
      'After sending SPACE to the "cancel" button, the calendar dialog should close'
    );
  }
);
