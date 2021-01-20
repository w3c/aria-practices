const { ariaTest } = require('..');
const { By, Key, until } = require('selenium-webdriver');
const assertAriaRoles = require('../util/assertAriaRoles');
const assertAttributeValues = require('../util/assertAttributeValues');
const assertAriaLabelExists = require('../util/assertAriaLabelExists');
const assertRovingTabindex = require('../util/assertRovingTabindex');

const exampleFile = 'treegrid/treegrid-1.html';

const ex = {
  treegridSelector: '#ex1 [role="treegrid"]',
  emailRowSelector: '#ex1 [role="row"]',
  gridcellSelector: '#ex1 [role="gridcell"]',
  threadSelector: '#ex1 [role="row"][aria-expanded]',
  closedThreadSelector: '#ex1 [role="row"][aria-expanded]',
  emailLinkSelector: '#ex1 td a',
  lastRowIndex: 7,
  // For each row, the aria-level, aria-setsize and aria-posinset values
  rowRelationData: [
    ['1', '1', '1'],
    ['2', '3', '1'],
    ['2', '3', '2'],
    ['3', '1', '1'],
    ['2', '3', '3'],
    ['3', '1', '1'],
    ['4', '2', '1'],
    ['4', '2', '2'],
  ],
};

const reload = async (t) => {
  return t.context.session.get(t.context.url);
};

const closeAllThreads = async function (t) {
  await openAllThreads(t);

  let threads = await t.context.queryElements(t, ex.threadSelector);

  // Going through all open email thread elements in reverse dom order will close child
  // threads first, therefore all threads will be visible before sending keying
  for (let i = threads.length - 1; i >= 0; i--) {
    await threads[i].sendKeys(Key.ARROW_LEFT);
  }
};

const openAllThreads = async function (t) {
  let closedThreads = await t.context.queryElements(t, ex.closedThreadSelector);

  // Going through all closed email thread elements in dom order will open parent
  // threads first, therefore all child threads will be visible before opening
  for (let thread of closedThreads) {
    await thread.sendKeys(Key.ARROW_RIGHT);
  }
};

const openAllThreadsAndFocusOnFirstRow = async function (t) {
  await openAllThreads(t);
  await t.context.session.findElement(By.css(ex.gridcellSelector)).click();

  await t.context.session.wait(
    async function () {
      const val = await t.context.session
        .findElement(By.css(ex.emailRowSelector))
        .getAttribute('tabindex');
      return val === '0';
    },
    500,
    'Timeout waiting for tabindex to update to "0" after clicking first grid row'
  );
};

const checkFocus = async function (t, selector, index) {
  return t.context.session.executeScript(
    function (/* selector, index*/) {
      const [selector, index] = arguments;
      const items = document.querySelectorAll(selector);
      return items[index] === document.activeElement;
    },
    selector,
    index
  );
};

const checkFocusOnParentEmail = async function (t, emailIndex) {
  return t.context.session.executeScript(
    function () {
      const [selector, emailIndex] = arguments;

      const emails = document.querySelectorAll(selector);
      const email = emails[emailIndex];
      const currentLevel = parseInt(email.getAttribute('aria-level'));

      const previousLevel = currentLevel - 1;

      // The first email we find that is up one level is the parent email
      for (let i = emailIndex - 1; i >= 0; i--) {
        if (parseInt(emails[i].getAttribute('aria-level')) === previousLevel) {
          return document.activeElement === emails[i];
        }
      }

      return false;
    },
    ex.emailRowSelector,
    emailIndex
  );
};

const isOpenedThread = async function (el) {
  return (await el.getAttribute('aria-expanded')) === 'true';
};

const isClosedThread = async function (el) {
  return (await el.getAttribute('aria-expanded')) === 'false';
};

const checkFocusOnGridcell = async function (t, rowIndex, gridcellIndex) {
  let gridcellsSelector =
    '#ex1 [role="row"]:nth-of-type(' + (rowIndex + 1) + ') [role="gridcell"]';

  // If the gridcell is index 0 or 1, it does not contain a widget, focus
  // should be on the gridcell itself
  if (gridcellIndex < 2) {
    return checkFocus(t, gridcellsSelector, gridcellIndex);
  }

  // Otherwise, the gridcell contains an interactive widget, and focus
  // should be on the interactive widget
  gridcellsSelector = gridcellsSelector + ':nth-of-type(3) a';
  return checkFocus(t, gridcellsSelector, 0);
};

const sendKeyToGridcellAndWait = async function (
  t,
  rowIndex,
  gridcellIndex,
  key
) {
  let gridcellSelector =
    '#ex1 [role="row"]:nth-of-type(' + (rowIndex + 1) + ') [role="gridcell"]';
  gridcellSelector =
    gridcellSelector + ':nth-of-type(' + (gridcellIndex + 1) + ')';

  // If index 2, then we need to send keys to the 'a' element within the gridcell
  if (gridcellIndex == 2) {
    gridcellSelector = gridcellSelector + ' a';
  }

  await t.context.session.findElement(By.css(gridcellSelector)).sendKeys(key);

  // Wait for focus to move (this example can be slow to update focus on key press)
  t.context.session.wait(async function () {
    return (await checkFocus(t, gridcellSelector, 0)) === false;
  }, 500);
};

const sendKeyToRowAndWait = async function (t, rowIndex, key) {
  const emailRows = await t.context.queryElements(t, ex.emailRowSelector);
  await emailRows[rowIndex].sendKeys(key);

  // Wait for focus to move (this example can be slow to update focus on key press)
  t.context.session.wait(async function () {
    return (await checkFocus(t, ex.emailRowSelector, rowIndex)) === false;
  }, 500);
};

const putFocusOnRow1Gridcell = async function (t, columnIndex) {
  if (columnIndex === 0) {
    await t.context.session
      .findElement(By.css(ex.emailRowSelector))
      .sendKeys(Key.ARROW_RIGHT);
  } else if (columnIndex === 1) {
    await t.context.session
      .findElement(By.css(ex.emailRowSelector))
      .sendKeys(Key.ARROW_RIGHT);
    await sendKeyToGridcellAndWait(t, 0, 0, Key.ARROW_RIGHT);
  } else if (columnIndex === 2) {
    await t.context.session
      .findElement(By.css(ex.emailRowSelector))
      .sendKeys(Key.ARROW_RIGHT);
    await sendKeyToGridcellAndWait(t, 0, 0, Key.ARROW_RIGHT);
    await sendKeyToGridcellAndWait(t, 0, 1, Key.ARROW_RIGHT);
  }
};

const putFocusOnLastRowGridcell = async function (t, columnIndex) {
  let rows = await t.context.queryElements(t, ex.emailRowSelector);
  let lastRow = rows.length - 1;

  if (columnIndex === 0) {
    await rows[lastRow].sendKeys(Key.ARROW_RIGHT);
  } else if (columnIndex === 1) {
    await rows[lastRow].sendKeys(Key.ARROW_RIGHT);
    await sendKeyToGridcellAndWait(t, lastRow, 0, Key.ARROW_RIGHT);
  } else if (columnIndex === 2) {
    await rows[lastRow].sendKeys(Key.ARROW_RIGHT);
    await sendKeyToGridcellAndWait(t, lastRow, 0, Key.ARROW_RIGHT);
    await sendKeyToGridcellAndWait(t, lastRow, 1, Key.ARROW_RIGHT);
  }
};

// Attributes

ariaTest(
  'treegrid role on table element',
  exampleFile,
  'treegrid-role',
  async (t) => {
    await assertAriaRoles(t, 'ex1', 'treegrid', 1, 'table');
  }
);

ariaTest(
  'aria-label on treegrid',
  exampleFile,
  'treegrid-aria-label',
  async (t) => {
    await assertAriaLabelExists(t, ex.treegridSelector);
  }
);

ariaTest('row role on tr element', exampleFile, 'row-role', async (t) => {
  await assertAriaRoles(t, 'ex1', 'row', 8, 'tr');
});

ariaTest(
  'roving tabindex on rows and links',
  exampleFile,
  'row-tabindex',
  async (t) => {
    await openAllThreadsAndFocusOnFirstRow(t);

    // Assert roving tab index on rows
    await assertRovingTabindex(t, ex.emailRowSelector, Key.ARROW_DOWN);

    await reload(t);
    await openAllThreadsAndFocusOnFirstRow(t);

    // Assert roving tab index on the links
    await assertRovingTabindex(t, ex.emailLinkSelector, Key.ARROW_DOWN);

    // TODO:
    // Test tabindex values on gridcells. At the time of this test the
    // description does not match the behavior and it is unclear which is correct.
    // See issue #790
  }
);

ariaTest(
  'aria-expanded on row elements',
  exampleFile,
  'row-aria-expanded',
  async (t) => {
    // After page load and after closing the first thread, all threads will be closed
    await t.context.session
      .findElement(By.css(ex.threadSelector))
      .sendKeys(Key.ARROW_LEFT);
    await assertAttributeValues(t, ex.threadSelector, 'aria-expanded', 'false');

    // Open all threads
    await openAllThreadsAndFocusOnFirstRow(t);
    await assertAttributeValues(t, ex.threadSelector, 'aria-expanded', 'true');

    // Close the first thread
    await t.context.session
      .findElement(By.css(ex.threadSelector))
      .sendKeys(Key.ARROW_LEFT);

    // Make sure the first thread is closed
    const threads = await t.context.queryElements(t, ex.threadSelector);
    t.is(
      await threads.shift().getAttribute('aria-expanded'),
      'false',
      'Closing the first thread (via "arrow left" key) should set aria-expanded to "false"'
    );

    // But all other threads are still open
    for (let thread of threads) {
      t.is(
        await thread.getAttribute('aria-expanded'),
        'true',
        'All threads other than the first thread should remain open after closing on the first.'
      );
    }
  }
);

ariaTest(
  'aria-level on row elements',
  exampleFile,
  'row-aria-level',
  async (t) => {
    let rows = await t.context.queryElements(t, ex.emailRowSelector);

    for (let index = 0; index < rows.length; index++) {
      t.is(
        await rows[index].getAttribute('aria-level'),
        ex.rowRelationData[index][0],
        'The email at index ' +
          index +
          ' should have "aria-level" value: ' +
          ex.rowRelationData[index][0]
      );
    }
  }
);

ariaTest(
  'aria-setsize on row elements',
  exampleFile,
  'row-aria-setsize',
  async (t) => {
    let rows = await t.context.queryElements(t, ex.emailRowSelector);

    for (let index = 0; index < rows.length; index++) {
      t.is(
        await rows[index].getAttribute('aria-setsize'),
        ex.rowRelationData[index][1],
        'The email at index ' +
          index +
          ' should have "aria-setsize" value: ' +
          ex.rowRelationData[index][1]
      );
    }
  }
);

ariaTest(
  'aria-posinset on row elements',
  exampleFile,
  'row-aria-posinset',
  async (t) => {
    let rows = await t.context.queryElements(t, ex.emailRowSelector);

    for (let index = 0; index < rows.length; index++) {
      t.is(
        await rows[index].getAttribute('aria-posinset'),
        ex.rowRelationData[index][2],
        'The email at index ' +
          index +
          ' should have "aria-posinset" value: ' +
          ex.rowRelationData[index][2]
      );
    }
  }
);

ariaTest(
  'gridcell roles on td elements',
  exampleFile,
  'gridcell-role',
  async (t) => {
    await assertAriaRoles(t, 'ex1', 'gridcell', 24, 'td');
  }
);

// Keys

ariaTest(
  'Navigating through rows with right arrow',
  exampleFile,
  'key-right-arrow',
  async (t) => {
    await closeAllThreads(t);

    // Going through all closed email thread elements in dom order will open parent
    // threads first.

    const emailRows = await t.context.queryElements(t, ex.emailRowSelector);
    for (let index = 0; index < emailRows.length; index++) {
      // Send ARROW RIGHT only to emails that are the start of threads
      if (await isClosedThread(emailRows[index])) {
        await emailRows[index].sendKeys(Key.ARROW_RIGHT);
        t.true(
          await emailRows[index + 1].isDisplayed(),
          'Sending key ARROW RIGHT to email at index ' +
            index +
            ' should open a thread, displaying the next email row(s) in the treegrid.'
        );
      }
    }
  }
);

ariaTest(
  'Navigating through gridcells with right arrow',
  exampleFile,
  'key-right-arrow',
  async (t) => {
    await openAllThreads(t);

    const emailRows = await t.context.queryElements(t, ex.emailRowSelector);
    for (let index = 0; index < emailRows.length; index++) {
      // Check that arrow right moves focus to the first gridcell of each row if the email
      // is not the start of a thread, or the thread is open
      await emailRows[index].sendKeys(Key.ARROW_RIGHT);
      t.true(
        await checkFocusOnGridcell(t, index, 0),
        'Sending key ARROW RIGHT to email at index ' +
          index +
          ' should move focus to the first gridcell'
      );

      // Check that arrow right moves focus to the next gridcell
      await sendKeyToGridcellAndWait(t, index, 0, Key.ARROW_RIGHT);
      t.true(
        await checkFocusOnGridcell(t, index, 1),
        'Sending ARROW RIGHT keys to gridcell at index 1 should move focus to gridcell at index 2'
      );

      // Check that arrow right does not move focus when sent to last gridcell
      await sendKeyToGridcellAndWait(t, index, 2, Key.ARROW_RIGHT);
      t.true(
        await checkFocusOnGridcell(t, index, 2),
        'Sending ARROW RIGHT keys to final gridcell should key focus on final gridcell'
      );
    }
  }
);

ariaTest(
  'Navigating through rows with left arrow',
  exampleFile,
  'key-left-arrow',
  async (t) => {
    await openAllThreads(t);

    const emailRows = await t.context.queryElements(t, ex.emailRowSelector);
    let i = emailRows.length - 1;
    while (i > 0) {
      const isOpened = await isOpenedThread(emailRows[i]);

      await emailRows[i].sendKeys(Key.ARROW_LEFT);

      // If the emailRows was an opened Thread
      if (isOpened) {
        t.is(
          await emailRows[i].getAttribute('aria-expanded'),
          'false',
          'Sending key ARROW_LEFT to thread at email index ' +
            i +
            ' when the thread is opened should close the thread'
        );

        t.true(
          await checkFocus(t, ex.emailRowSelector, i),
          'Sending key ARROW_LEFT to thread at email index ' +
            i +
            ' when the thread is opened should not move the focus'
        );
        // Send one more arrow key to the folder that is now closed
        continue;
      }

      // If the email row is an email without children, or a closed thead,
      // arrow will move up to parent email
      else {
        t.true(
          await checkFocusOnParentEmail(t, i),
          'Sending key ARROW_LEFT to email at index ' +
            i +
            ' should move focus to parent email'
        );

        t.is(
          await emailRows[i].isDisplayed(),
          true,
          'Sending key ARROW_LEFT to email at index ' +
            i +
            ' should not close the folder it is in'
        );
      }

      i--;
    }
  }
);

ariaTest(
  'Navigating through gridcells with left arrow',
  exampleFile,
  'key-left-arrow',
  async (t) => {
    await openAllThreads(t);

    const emailRows = await t.context.queryElements(t, ex.emailRowSelector);

    for (let index = 0; index < emailRows.length; index++) {
      // Set up: put focus on a gridcell by sending a "ARROW LEFT" key to an open row
      await emailRows[index].sendKeys(Key.ARROW_RIGHT);

      // Now send that row an "ARROW LEFT" key and make sure focus is on the first row
      await sendKeyToGridcellAndWait(t, index, 0, Key.ARROW_LEFT);
      t.true(
        await checkFocus(t, ex.emailRowSelector, index),
        'Focus should be on grid row at index " + index + " after ARROW LEFT sent to first gridcell in first row'
      );

      // Set up: put focus on last gridcell
      await emailRows[index].sendKeys(Key.ARROW_RIGHT);
      await sendKeyToGridcellAndWait(t, index, 0, Key.END);

      // Now send that gridcell an "ARROW LEFT" key and make sure focus is on the second gridcell
      await sendKeyToGridcellAndWait(t, index, 2, Key.ARROW_LEFT);
      t.true(
        await checkFocusOnGridcell(t, index, 1),
        'Focus should be on the second gridcell in the first row after ARROW LEFT sent to third gridcell in grid row of index: ' +
          index
      );

      // Now send the second gridcell an "ARROW LEFT" key and make sure focus is on the first
      await sendKeyToGridcellAndWait(t, index, 1, Key.ARROW_LEFT);
      t.true(
        await checkFocusOnGridcell(t, index, 0),
        'Focus should be on the first gridcell in the first row after ARROW LEFT sent to second gridcell  in grid row of index: ' +
          index
      );
    }
  }
);

ariaTest(
  'Navigating through rows with down arrow',
  exampleFile,
  'key-down-arrow',
  async (t) => {
    await openAllThreads(t);

    const emailRows = await t.context.queryElements(t, ex.emailRowSelector);
    for (let index = 0; index < emailRows.length - 1; index++) {
      // Send ARROW DOWN to email rows
      await emailRows[index].sendKeys(Key.ARROW_DOWN);
      t.true(
        await checkFocus(t, ex.emailRowSelector, index + 1),
        'Sending key ARROW DOWN to email at index ' +
          index +
          ' should move focus to the next email'
      );
    }

    // Send ARROW DOWN to last email
    await emailRows[emailRows.length - 1].sendKeys(Key.ARROW_DOWN);
    t.true(
      await checkFocus(t, ex.emailRowSelector, emailRows.length - 1),
      'Sending key ARROW DOWN to last email should not move focus'
    );
  }
);

ariaTest(
  'Navigating through gridcells with down arrow',
  exampleFile,
  'key-down-arrow',
  async (t) => {
    await openAllThreads(t);
    const emailRows = await t.context.queryElements(t, ex.emailRowSelector);

    for (let columnIndex = 0; columnIndex < 3; columnIndex++) {
      await putFocusOnRow1Gridcell(t, columnIndex);

      for (let rowindex = 0; rowindex < emailRows.length - 1; rowindex++) {
        // Send ARROW DOWN to gridcell
        await sendKeyToGridcellAndWait(
          t,
          rowindex,
          columnIndex,
          Key.ARROW_DOWN
        );
        t.true(
          await checkFocusOnGridcell(t, rowindex + 1, columnIndex),
          'Sending key ARROW DOWN to cell at row index ' +
            rowindex +
            ' and column index ' +
            columnIndex +
            ' should move focus to the next email'
        );
      }

      // Send ARROW DOWN to last row
      await sendKeyToGridcellAndWait(
        t,
        emailRows.length - 1,
        columnIndex,
        Key.ARROW_DOWN
      );
      t.true(
        await checkFocusOnGridcell(t, emailRows.length - 1, columnIndex),
        'Sending key ARROW DOWN to the cell at column index ' +
          columnIndex +
          ' in the last row should not move focus'
      );
    }
  }
);

ariaTest(
  'Navigating through rows with up arrow',
  exampleFile,
  'key-up-arrow',
  async (t) => {
    await openAllThreads(t);

    const emailRows = await t.context.queryElements(t, ex.emailRowSelector);
    for (let index = emailRows.length - 1; index > 0; index--) {
      // Send ARROW UP to email rows
      await emailRows[index].sendKeys(Key.ARROW_UP);
      t.true(
        await checkFocus(t, ex.emailRowSelector, index - 1),
        'Sending key ARROW UP to email at index ' +
          index +
          ' should move focus to the previous email'
      );
    }

    // Send ARROW UP to first email
    await emailRows[0].sendKeys(Key.ARROW_UP);
    t.true(
      await checkFocus(t, ex.emailRowSelector, 0),
      'Sending key ARROW UP to first email should not move focus'
    );
  }
);

ariaTest(
  'Navigating through gridcells with up arrow',
  exampleFile,
  'key-up-arrow',
  async (t) => {
    await openAllThreads(t);
    const emailRows = await t.context.queryElements(t, ex.emailRowSelector);

    for (let columnIndex = 0; columnIndex < 3; columnIndex++) {
      await putFocusOnLastRowGridcell(t, columnIndex);

      for (let rowindex = emailRows.length - 1; rowindex > 0; rowindex--) {
        // Send ARROW UP to gridcell
        await sendKeyToGridcellAndWait(t, rowindex, columnIndex, Key.ARROW_UP);
        t.true(
          await checkFocusOnGridcell(t, rowindex - 1, columnIndex),
          'Sending key ARROW UP to cell at row index ' +
            rowindex +
            ' and column index ' +
            columnIndex +
            ' should move focus to the previous email'
        );
      }

      // Send ARROW UP to first row
      await sendKeyToGridcellAndWait(t, 0, columnIndex, Key.ARROW_UP);
      t.true(
        await checkFocusOnGridcell(t, 0, columnIndex),
        'Sending key ARROW UUP to the cell at column index ' +
          columnIndex +
          ' in the first row should not move focus'
      );
    }
  }
);

ariaTest(
  'TAB moves focus from active row to widgets in row',
  exampleFile,
  'key-tab',
  async (t) => {
    // Send tab to the first row:
    await sendKeyToRowAndWait(t, 0, Key.TAB);

    t.true(
      await checkFocusOnGridcell(t, 0, 2),
      'Sending TAB to the first row on page load will send the focus to the first interactive widget in the row, which should be the email link in the last column.'
    );
  }
);

ariaTest(
  'SHIFT+TAB moves focus from widgets in row to row',
  exampleFile,
  'key-shift-tab',
  async (t) => {
    await putFocusOnRow1Gridcell(t, 2);

    // Send shift tab to the link in the last gridcell of the first row
    await sendKeyToGridcellAndWait(t, 0, 2, Key.chord(Key.SHIFT, Key.TAB));

    t.true(
      await checkFocus(t, ex.emailRowSelector, 0),
      'Sending SHIFT+TAB to the interactive widget in the last cell of the first row should move focus to the first row.'
    );
  }
);

ariaTest('HOME moves focus', exampleFile, 'key-home', async (t) => {
  await openAllThreads(t);
  const emailRows = await t.context.queryElements(t, ex.emailRowSelector);

  // Send HOME to the second row
  await emailRows[1].sendKeys(Key.HOME);
  t.true(
    await checkFocus(t, ex.emailRowSelector, 0),
    'Sending HOME to second row should result on focus on first row'
  );

  // Send HOME to second gridcell
  await putFocusOnRow1Gridcell(t, 1);
  await sendKeyToGridcellAndWait(t, 0, 1, Key.HOME);
  t.true(
    await checkFocusOnGridcell(t, 0, 0),
    "Sending HOME to first row's second gridcell should move focus to first row's first gridcell"
  );
});

ariaTest('END moves focus', exampleFile, 'key-end', async (t) => {
  await openAllThreads(t);
  const emailRows = await t.context.queryElements(t, ex.emailRowSelector);

  // Send END to the first row
  await emailRows[0].sendKeys(Key.END);

  t.true(
    await checkFocus(t, ex.emailRowSelector, ex.lastRowIndex),
    'Sending END to first row should result on focus on last row'
  );

  // Send HOME to first gridcell
  await putFocusOnRow1Gridcell(t, 0);
  await sendKeyToGridcellAndWait(t, 0, 0, Key.END);
  t.true(
    await checkFocusOnGridcell(t, 0, 2),
    "Sending HOME to first row's first gridcell should move focus to first row's last gridcell"
  );
});

ariaTest(
  'CTRL+HOME moves focus',
  exampleFile,
  'key-control-home',
  async (t) => {
    await openAllThreads(t);
    const emailRows = await t.context.queryElements(t, ex.emailRowSelector);

    // Send CTRL+HOME to the second row
    await emailRows[1].sendKeys(Key.chord(Key.CONTROL, Key.HOME));
    t.true(
      await checkFocus(t, ex.emailRowSelector, 0),
      'Sending CTRL+HOME to second row should result on focus on first row'
    );

    // Send CTRL+HOME to last row first gridcell
    await putFocusOnLastRowGridcell(t, 0);
    await sendKeyToGridcellAndWait(
      t,
      ex.lastRowIndex,
      0,
      Key.chord(Key.CONTROL, Key.HOME)
    );
    t.true(
      await checkFocusOnGridcell(t, 0, 0),
      "Sending CTRL+HOME to last row's first gridcell should move focus to first row's first gridcell"
    );
  }
);

ariaTest('CTRL+END moves focus', exampleFile, 'key-control-end', async (t) => {
  await openAllThreads(t);
  const emailRows = await t.context.queryElements(t, ex.emailRowSelector);

  // Send CTRL+END to the first row
  await emailRows[0].sendKeys(Key.chord(Key.CONTROL, Key.END));
  t.true(
    await checkFocus(t, ex.emailRowSelector, ex.lastRowIndex),
    'Sending CTRL+END to first row should result on focus on last row'
  );

  // Sending CTRL+END to the first gridcell
  await putFocusOnRow1Gridcell(t, 0);
  await sendKeyToGridcellAndWait(t, 0, 0, Key.chord(Key.CONTROL, Key.END));
  t.true(
    await checkFocusOnGridcell(t, ex.lastRowIndex, 0),
    "Sending CTRL+END to first row's first gridcell should move focus to last row's first gridcell"
  );
});

// This test fails due to: https://github.com/w3c/aria-practices/issues/790#issuecomment-422079276
ariaTest.failing(
  'ENTER actives interactive items item',
  exampleFile,
  'key-enter',
  async (t) => {
    // INTERACTIVE ITEM 1: Enter sent while focus is on email row should open email alert

    const email = await t.context.session.findElement(
      By.css(ex.emailRowSelector)
    );

    await email.sendKeys(Key.ENTER);

    const alert = await t.context.session.wait(
      until.alertIsPresent(),
      t.context.waitTime
    );
    t.truthy(
      await alert.getText(),
      'Sending "enter" to any email row should open alert with the rest of the email'
    );
    await alert.accept();

    // INTERACTIVE ITEM 1: Enter sent while focus is email gridcell should trigger link

    const selector = '#ex1 [role="row"]:nth-of-type(1) a';
    const newUrl = t.context.url + '#test-url-change';

    // Reset the href to not be an email link in order to test
    await t.context.session.executeScript(
      function () {
        let [selector, newUrl] = arguments;
        document.querySelector(selector).href = newUrl;
      },
      selector,
      newUrl
    );

    await t.context.session.findElement(By.css(selector)).sendKeys(Key.ENTER);

    // Test that the URL is updated.
    t.is(
      await t.context.session.getCurrentUrl(),
      newUrl,
      'Sending "enter" to a link within the gridcell should activate the link'
    );
  }
);
