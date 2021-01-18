const { ariaTest } = require('..');
const { By, Key } = require('selenium-webdriver');
const assertAriaLabelledby = require('../util/assertAriaLabelledby');
const assertAttributeValues = require('../util/assertAttributeValues');
const assertAriaRoles = require('../util/assertAriaRoles');

const exampleFile = 'grid/dataGrids.html';

const ex = {
  1: {
    gridSelector: '#ex1 [role="grid"]',
    rowSelector: '#ex1 tr',
    lastColumn: 5,
    lastRow: 7,
    firstInteractiveRow: 2,
  },
  2: {
    gridSelector: '#ex2 [role="grid"]',
    rowSelector: '#ex2 tr',
    dateHeaderSelector: '#ex2 tr:nth-of-type(1) th:nth-of-type(1)',
    amountHeaderSelector: '#ex2 tr:nth-of-type(1) th:nth-of-type(5)',
    lastColumn: 6,
    lastRow: 8,
    firstInteractiveRow: 1,
  },
  3: {
    gridSelector: '#ex3 [role="grid"]',
    rowSelector: '#ex3 tr',
    hideButtonSelector: '#ex3 #toggle_column_btn',
    lastColumn: 6,
    lastRow: 16,
    firstInteractiveRow: 2,
  },
};

const checkFocusOnOrInCell = async function (
  t,
  gridSelector,
  rowIndex,
  columnIndex
) {
  return t.context.session.executeScript(
    function () {
      const [gridSelector, rowIndex, columnIndex] = arguments;

      let selector =
        gridSelector +
        ' tr:nth-of-type(' +
        rowIndex +
        ') td:nth-of-type(' +
        columnIndex +
        ')';

      // If rowIndex === 1, then focus will be on a th element
      if (rowIndex === 1) {
        selector =
          gridSelector +
          ' tr:nth-of-type(' +
          rowIndex +
          ') th:nth-of-type(' +
          columnIndex +
          ')';
      }

      // If the element has "tabindex", it is the candidate for focus
      const cellElement = document.querySelector(selector);
      if (cellElement.hasAttribute('tabindex')) {
        return document.activeElement === cellElement;
      }

      // Look for an interactive element in the gridcell to find candidate for focus
      const interactiveElement = cellElement.querySelector('[tabindex]');
      return document.activeElement === interactiveElement;
    },
    gridSelector,
    rowIndex,
    columnIndex
  );
};

const sendKeyToGridcell = async function (
  t,
  gridSelector,
  rowIndex,
  columnIndex,
  key
) {
  let selector =
    gridSelector +
    ' tr:nth-of-type(' +
    rowIndex +
    ') td:nth-of-type(' +
    columnIndex +
    ')';

  // If the element has "tabindex", send KEY here
  const cellElement = await t.context.session.findElement(By.css(selector));
  if ((await cellElement.getAttribute('tabindex')) !== null) {
    return await cellElement.sendKeys(key);
  }

  // Look for an interactive element in the gridcell to send KEY
  const interactiveElement = await cellElement.findElement(
    By.css('[tabindex]')
  );
  return await interactiveElement.sendKeys(key);
};

const scrollToEndOfExample3 = async function (t) {
  await sendKeyToGridcell(t, ex[3].gridSelector, 2, 1, Key.PAGE_DOWN);
  await sendKeyToGridcell(t, ex[3].gridSelector, 7, 1, Key.PAGE_DOWN);
};

// Attributes

ariaTest('Test for role="grid"', exampleFile, 'grid-role', async (t) => {
  await assertAriaRoles(t, 'ex1', 'grid', '1', 'table');
  await assertAriaRoles(t, 'ex2', 'grid', '1', 'table');
  await assertAriaRoles(t, 'ex3', 'grid', '1', 'table');
});

ariaTest(
  'aria-labelledby attribute on all examples',
  exampleFile,
  'aria-labelledby',
  async (t) => {
    await assertAriaLabelledby(t, ex[1].gridSelector);
    await assertAriaLabelledby(t, ex[2].gridSelector);
    await assertAriaLabelledby(t, ex[3].gridSelector);
  }
);

ariaTest(
  'aria-rowcount attribute in example 3',
  exampleFile,
  'aria-rowcount',
  async (t) => {
    await assertAttributeValues(t, ex[3].gridSelector, 'aria-rowcount', '16');
  }
);

ariaTest(
  'aria-colcount attribute in example 3',
  exampleFile,
  'aria-colcount',
  async (t) => {
    await assertAttributeValues(t, ex[3].gridSelector, 'aria-colcount', '6');
  }
);

ariaTest(
  'aria-rowindex attribute in example 3',
  exampleFile,
  'aria-rowindex',
  async (t) => {
    let rows = await t.context.queryElements(t, ex[3].rowSelector);

    let index = 1;
    for (let row of rows) {
      t.is(
        await row.getAttribute('aria-rowindex'),
        index.toString(),
        'In example 3, tr element at index ' +
          index +
          ' should have aria-rowindex value: ' +
          index
      );
      index++;
    }
  }
);

ariaTest(
  'aria-colindex attribute in example 3',
  exampleFile,
  'aria-colindex',
  async (t) => {
    let rows = await t.context.queryElements(t, ex[3].rowSelector);

    // Check all the headers
    let items = await t.context.queryElements(t, 'th', rows.shift());
    let index = 1;
    for (let item of items) {
      t.is(
        await item.getAttribute('aria-colindex'),
        index.toString(),
        'In example 3, th element at column index ' +
          index +
          ' should have aria-colindex value: ' +
          index
      );
      index++;
    }

    // Check all the grid items
    for (let row of rows) {
      let items = await t.context.queryElements(t, 'td', row);

      let index = 1;
      for (let item of items) {
        t.is(
          await item.getAttribute('aria-colindex'),
          index.toString(),
          'In example 3, td elements at column index ' +
            index +
            ' should have aria-colindex value: ' +
            index
        );
        index++;
      }
    }
  }
);

ariaTest(
  'aria-sort set appropriately in example 2',
  exampleFile,
  'aria-sort',
  async (t) => {
    let dateHeader = await t.context.session.findElement(
      By.css(ex[2].dateHeaderSelector)
    );
    let dateButton = dateHeader.findElement(By.css('[role="button"]'));

    let amountHeader = await t.context.session.findElement(
      By.css(ex[2].amountHeaderSelector)
    );
    let amountButton = amountHeader.findElement(By.css('[role="button"]'));

    // By default, the rows are sorted by date ascending
    t.is(
      await dateHeader.getAttribute('aria-sort'),
      'ascending',
      'On page load, date header should reflect rows are sorted date ascending'
    );
    t.is(
      await amountHeader.getAttribute('aria-sort'),
      'none',
      'On page load, amount header should reflect rows are not sorted by amount'
    );

    await dateButton.click();

    t.is(
      await dateHeader.getAttribute('aria-sort'),
      'descending',
      'After clicking date header, date header should reflect rows are sorted date descending'
    );
    t.is(
      await amountHeader.getAttribute('aria-sort'),
      'none',
      'After clicking date header, amount header should reflect rows are not sorted by amount'
    );

    await amountButton.click();

    t.is(
      await dateHeader.getAttribute('aria-sort'),
      'none',
      'After clicking amount header, date header should reflect rows are not sorted by date'
    );
    t.is(
      await amountHeader.getAttribute('aria-sort'),
      'ascending',
      'After clicking amount header, amount header should reflect rows are sorted by amount ascending'
    );

    await amountButton.click();

    t.is(
      await dateHeader.getAttribute('aria-sort'),
      'none',
      'After clicking amount header twice, date header should reflect rows are not sorted by date'
    );
    t.is(
      await amountHeader.getAttribute('aria-sort'),
      'descending',
      'After clicking amount header twice, amount header should reflect rows are sorted by amount descending'
    );
  }
);

// Keys

ariaTest(
  'Right arrow moves focus, example 1 and 2',
  exampleFile,
  'key-right-arrow',
  async (t) => {
    // Examples 1 and 2
    for (let example of [1, 2]) {
      const gridSelector = ex[example].gridSelector;
      const lastColumn = ex[example].lastColumn;
      const lastRow = ex[example].lastRow;

      // Index starts at 2 to skip header
      for (let rowIndex = 2; rowIndex <= lastRow; rowIndex++) {
        // Test focus moves right
        await sendKeyToGridcell(t, gridSelector, rowIndex, 1, Key.ARROW_RIGHT);
        t.true(
          await checkFocusOnOrInCell(t, gridSelector, rowIndex, 2),
          'After sending ARROW RIGHT to element at column index 1 in row ' +
            rowIndex +
            ' focus should be on element at column index 2'
        );

        await sendKeyToGridcell(t, gridSelector, rowIndex, 2, Key.ARROW_RIGHT);
        t.true(
          await checkFocusOnOrInCell(t, gridSelector, rowIndex, 3),
          'After sending ARROW RIGHT to element at column index 2 in row ' +
            rowIndex +
            ' focus should be on element at column index 3'
        );

        // Test focus does not wrap
        await sendKeyToGridcell(
          t,
          gridSelector,
          rowIndex,
          lastColumn,
          Key.ARROW_RIGHT
        );
        t.true(
          await checkFocusOnOrInCell(t, gridSelector, rowIndex, lastColumn),
          'After sending ARROW RIGHT to the last item in row ' +
            rowIndex +
            ' focus should remain on the last item (' +
            lastColumn +
            ')'
        );
      }
    }
  }
);

ariaTest(
  'Right arrow moves focus, example 3',
  exampleFile,
  'key-right-arrow',
  async (t) => {
    let gridSelector = ex[3].gridSelector;
    let lastColumn = ex[3].lastColumn;
    let lastRow = ex[3].lastRow;
    let rowSelector = ex[3].rowSelector;

    // Index starts at 2 to skip header
    for (let rowIndex = 2; rowIndex <= lastRow; rowIndex++) {
      // If the row is not displayed, send page down to the last rows first element
      let rows = await t.context.queryElements(t, rowSelector);
      if (!(await rows[rowIndex - 1].isDisplayed())) {
        let previousRowCell = rows[rowIndex - 2].findElement(By.css('td'));
        await previousRowCell.sendKeys(Key.PAGE_DOWN);
      }

      // Test focus moves right
      await sendKeyToGridcell(t, gridSelector, rowIndex, 1, Key.ARROW_RIGHT);
      t.true(
        await checkFocusOnOrInCell(t, gridSelector, rowIndex, 2),
        'After sending ARROW RIGHT to element at column index 1 in row ' +
          rowIndex +
          ' focus should be on element at column index 2'
      );

      await sendKeyToGridcell(t, gridSelector, rowIndex, 2, Key.ARROW_RIGHT);
      t.true(
        await checkFocusOnOrInCell(t, gridSelector, rowIndex, 3),
        'After sending ARROW RIGHT to element at column index 2 in row ' +
          rowIndex +
          ' focus should be on element at column index 3'
      );

      // Test focus does not wrap
      await sendKeyToGridcell(
        t,
        gridSelector,
        rowIndex,
        lastColumn,
        Key.ARROW_RIGHT
      );
      t.true(
        await checkFocusOnOrInCell(t, gridSelector, rowIndex, lastColumn),
        'After sending ARROW RIGHT to the last item in row ' +
          rowIndex +
          ' focus should remain on the last item (' +
          lastColumn +
          ')'
      );
    }

    await t.context.session.get(t.context.url);

    // click the hide columns button
    await t.context.session
      .findElement(By.css(ex[3].hideButtonSelector))
      .click();

    // Index starts at 2 to skip header
    for (let rowIndex = 2; rowIndex <= lastRow; rowIndex++) {
      // If the row is not displayed, send page down to the last rows first element
      let rows = await t.context.queryElements(t, rowSelector);
      if (!(await rows[rowIndex - 1].isDisplayed())) {
        let previousRowCell = rows[rowIndex - 2].findElement(By.css('td'));
        await previousRowCell.sendKeys(Key.PAGE_DOWN);
      }

      // Test focus moves right
      await sendKeyToGridcell(t, gridSelector, rowIndex, 1, Key.ARROW_RIGHT);
      t.true(
        await checkFocusOnOrInCell(t, gridSelector, rowIndex, 3),
        'After sending ARROW RIGHT to element at column index 1 in row ' +
          rowIndex +
          ' focus should be on element at column index 2'
      );

      await sendKeyToGridcell(t, gridSelector, rowIndex, 3, Key.ARROW_RIGHT);
      t.true(
        await checkFocusOnOrInCell(t, gridSelector, rowIndex, 5),
        'After sending ARROW RIGHT to element at column index 2 in row ' +
          rowIndex +
          ' focus should be on element at column index 3'
      );

      // Test focus does not wrap
      await sendKeyToGridcell(
        t,
        gridSelector,
        rowIndex,
        lastColumn,
        Key.ARROW_RIGHT
      );
      t.true(
        await checkFocusOnOrInCell(t, gridSelector, rowIndex, lastColumn),
        'After sending ARROW RIGHT to the last item in row ' +
          rowIndex +
          ' focus should remain on the last item (' +
          lastColumn +
          ')'
      );
    }
  }
);

ariaTest(
  'Left arrow moves focus, example 1 and 2',
  exampleFile,
  'key-left-arrow',
  async (t) => {
    // Examples 1 and 2
    for (let example of [1, 2]) {
      const gridSelector = ex[example].gridSelector;
      const lastRow = ex[example].lastRow;

      // Index starts at 2 to skip header
      for (let rowIndex = 2; rowIndex <= lastRow; rowIndex++) {
        // Test focus moves left
        await sendKeyToGridcell(t, gridSelector, rowIndex, 4, Key.ARROW_LEFT);
        t.true(
          await checkFocusOnOrInCell(t, gridSelector, rowIndex, 3),
          'After sending ARROW LEFT to element at column index 4 in row ' +
            rowIndex +
            ' focus should be on element at column index 3'
        );

        await sendKeyToGridcell(t, gridSelector, rowIndex, 3, Key.ARROW_LEFT);
        t.true(
          await checkFocusOnOrInCell(t, gridSelector, rowIndex, 2),
          'After sending ARROW LEFT to element at column index 3 in row ' +
            rowIndex +
            ' focus should be on element at column index 2'
        );

        // Test focus does not wrap
        await sendKeyToGridcell(t, gridSelector, rowIndex, 1, Key.ARROW_LEFT);
        t.true(
          await checkFocusOnOrInCell(t, gridSelector, rowIndex, 1),
          'After sending ARROW LEFT to the first item in row ' +
            rowIndex +
            ' focus should remain on the first item'
        );
      }
    }
  }
);

ariaTest(
  'left arrow moves focus, example 3',
  exampleFile,
  'key-left-arrow',
  async (t) => {
    let gridSelector = ex[3].gridSelector;
    let lastRow = ex[3].lastRow;
    let rowSelector = ex[3].rowSelector;

    // Index starts at 2 to skip header
    for (let rowIndex = 2; rowIndex <= lastRow; rowIndex++) {
      // If the row is not displayed, send page down to the last rows first element
      let rows = await t.context.queryElements(t, rowSelector);
      if (!(await rows[rowIndex - 1].isDisplayed())) {
        let previousRowCell = rows[rowIndex - 2].findElement(By.css('td'));
        await previousRowCell.sendKeys(Key.PAGE_DOWN);
      }

      // Test focus moves left
      await sendKeyToGridcell(t, gridSelector, rowIndex, 4, Key.ARROW_LEFT);
      t.true(
        await checkFocusOnOrInCell(t, gridSelector, rowIndex, 3),
        'After sending ARROW LEFT to element at column index 4 in row ' +
          rowIndex +
          ' focus should be on element at column index 3'
      );

      await sendKeyToGridcell(t, gridSelector, rowIndex, 3, Key.ARROW_LEFT);
      t.true(
        await checkFocusOnOrInCell(t, gridSelector, rowIndex, 2),
        'After sending ARROW LEFT to element at column index 3 in row ' +
          rowIndex +
          ' focus should be on element at column index 2'
      );

      // Test focus does not wrap
      await sendKeyToGridcell(t, gridSelector, rowIndex, 1, Key.ARROW_LEFT);
      t.true(
        await checkFocusOnOrInCell(t, gridSelector, rowIndex, 1),
        'After sending ARROW LEFT to the first item in row ' +
          rowIndex +
          ' focus should remain on the first item'
      );
    }

    await t.context.session.get(t.context.url);

    // click the hide columns button
    await t.context.session
      .findElement(By.css(ex[3].hideButtonSelector))
      .click();

    // Index starts at 2 to skip header
    for (let rowIndex = 2; rowIndex <= lastRow; rowIndex++) {
      // If the row is not displayed, send page down to the last rows first element
      let rows = await t.context.queryElements(t, rowSelector);
      if (!(await rows[rowIndex - 1].isDisplayed())) {
        let previousRowCell = rows[rowIndex - 2].findElement(By.css('td'));
        await previousRowCell.sendKeys(Key.PAGE_DOWN);
      }

      // Test focus moves left (skipping invisible columns)
      await sendKeyToGridcell(t, gridSelector, rowIndex, 5, Key.ARROW_LEFT);
      t.true(
        await checkFocusOnOrInCell(t, gridSelector, rowIndex, 3),
        'After sending ARROW LEFT to element at column index 5 in row ' +
          rowIndex +
          ' focus should be on element at column index 3 (skipping invisible columns)'
      );

      await sendKeyToGridcell(t, gridSelector, rowIndex, 3, Key.ARROW_LEFT);
      t.true(
        await checkFocusOnOrInCell(t, gridSelector, rowIndex, 1),
        'After sending ARROW LEFT to element at column index 3 in row ' +
          rowIndex +
          ' focus should be on element at column index 1 (skipping invisible columns)'
      );

      // Test focus does not wrap
      await sendKeyToGridcell(t, gridSelector, rowIndex, 1, Key.ARROW_LEFT);
      t.true(
        await checkFocusOnOrInCell(t, gridSelector, rowIndex, 1),
        'After sending ARROW LEFT to the first item in row ' +
          rowIndex +
          ' focus should remain on the first item'
      );
    }
  }
);

ariaTest(
  'Key down moves focus, examples 1,2,3',
  exampleFile,
  'key-down-arrow',
  async (t) => {
    // Examples 1 and 2 and 3
    for (let example of [1, 2, 3]) {
      const gridSelector = ex[example].gridSelector;
      const lastColumn = ex[example].lastColumn;
      const lastRow = ex[example].lastRow;

      let columnIndex = 1;

      // Index starts at 2 to skip header
      for (let rowIndex = 2; rowIndex <= lastRow - 1; rowIndex++) {
        // Test focus moves down
        await sendKeyToGridcell(
          t,
          gridSelector,
          rowIndex,
          columnIndex,
          Key.ARROW_DOWN
        );
        t.true(
          await checkFocusOnOrInCell(
            t,
            gridSelector,
            rowIndex + 1,
            columnIndex
          ),
          'After sending ARROW DOWN to element in row ' +
            rowIndex +
            ' at column ' +
            columnIndex +
            ' focus should be on element in row ' +
            (rowIndex + 1) +
            ' at column ' +
            columnIndex +
            ' in example: ' +
            example
        );

        // Switch the column every time
        columnIndex++;
        if (columnIndex > lastColumn) {
          columnIndex = 1;
        }
      }

      // Test focus does not move on last row
      await sendKeyToGridcell(t, gridSelector, lastRow, 1, Key.ARROW_DOWN);
      t.true(
        await checkFocusOnOrInCell(t, gridSelector, lastRow, 1),
        'After sending ARROW DOWN to element the last row (' +
          lastRow +
          ') at column 1 the focus should not move in example: ' +
          example
      );
    }
  }
);

ariaTest(
  'Key up moves focus, examples 1,2,3',
  exampleFile,
  'key-up-arrow',
  async (t) => {
    // Examples 1 and 2 and 3
    for (let example of [1, 2, 3]) {
      const gridSelector = ex[example].gridSelector;
      const lastColumn = ex[example].lastColumn;
      const lastRow = ex[example].lastRow;

      if (example === 3) {
        await scrollToEndOfExample3(t);
      }

      let columnIndex = 1;

      // Index starts at 2 to skip header
      for (let rowIndex = lastRow; rowIndex > 2; rowIndex--) {
        // Test focus moves down
        await sendKeyToGridcell(
          t,
          gridSelector,
          rowIndex,
          columnIndex,
          Key.ARROW_UP
        );
        t.true(
          await checkFocusOnOrInCell(
            t,
            gridSelector,
            rowIndex - 1,
            columnIndex
          ),
          'After sending ARROW DOWN to element in row ' +
            rowIndex +
            ' at column ' +
            columnIndex +
            ' focus should be on element in row ' +
            (rowIndex - 1) +
            ' at column ' +
            columnIndex +
            ' in example: ' +
            example
        );

        // Switch the column every time
        columnIndex++;
        if (columnIndex > lastColumn) {
          columnIndex = 1;
        }
      }

      // Test focus does not move on first row
      if (example === 1 || example === 3) {
        await sendKeyToGridcell(t, gridSelector, 2, 1, Key.ARROW_UP);
        t.true(
          await checkFocusOnOrInCell(t, gridSelector, 2, 1),
          'After sending ARROW UP to element the first data row (2) at column 1 the focus should not move in example: ' +
            example
        );
      }

      // In example 2, focus moves to the header
      if (example === 2) {
        await sendKeyToGridcell(t, gridSelector, 2, 1, Key.ARROW_UP);
        t.true(
          await checkFocusOnOrInCell(t, gridSelector, 1, 1),
          'After sending ARROW UP to element the first data row (2) at column 1 the focus should move to the header row (which is interactive) in example: ' +
            example
        );
      }
    }
  }
);

ariaTest(
  'Page down moves focus in example 3',
  exampleFile,
  'key-page-down',
  async (t) => {
    t.pass(3);

    const gridSelector = ex[3].gridSelector;

    // Test focus moves focus and reveal hidden rows
    await sendKeyToGridcell(t, gridSelector, 2, 1, Key.PAGE_DOWN);
    t.true(
      await checkFocusOnOrInCell(t, gridSelector, 7, 1),
      'After sending PAGE DOWN to element at row 2 column 1, the focus should be on row 7, column 1'
    );

    await sendKeyToGridcell(t, gridSelector, 7, 3, Key.PAGE_DOWN);
    t.true(
      await checkFocusOnOrInCell(t, gridSelector, 12, 3),
      'After sending PAGE DOWN to element at row 7 column 3, the focus should be on row 12, column 3'
    );

    // Test focus does not wrap
    await sendKeyToGridcell(t, gridSelector, 12, 4, Key.PAGE_DOWN);
    t.true(
      await checkFocusOnOrInCell(t, gridSelector, 12, 4),
      'After sending PAGE DOWN to element at row 7 column 4, the focus should note move, because there are no more hidden rows'
    );
  }
);

ariaTest(
  'Page up moves focus in example 3',
  exampleFile,
  'key-page-up',
  async (t) => {
    t.pass(3);

    const gridSelector = ex[3].gridSelector;
    await scrollToEndOfExample3(t);

    // Test focus moves left
    await sendKeyToGridcell(t, gridSelector, 12, 1, Key.PAGE_UP);
    t.true(
      await checkFocusOnOrInCell(t, gridSelector, 11, 1),
      'After sending PAGE UP to element at row 12 column 1, the focus should be on row 11, column 1'
    );

    await sendKeyToGridcell(t, gridSelector, 11, 3, Key.PAGE_UP);
    t.true(
      await checkFocusOnOrInCell(t, gridSelector, 6, 3),
      'After sending PAGE UP to element at row 11 column 3, the focus should be on row 6, column 3'
    );

    // Test focus does not wrap
    await sendKeyToGridcell(t, gridSelector, 6, 4, Key.PAGE_UP);
    t.true(
      await checkFocusOnOrInCell(t, gridSelector, 6, 4),
      'After sending PAGE UP to element at row 6 column 4, the focus should note move, because there are no more hidden rows'
    );
  }
);

ariaTest('Home key moves focus', exampleFile, 'key-home', async (t) => {
  // Examples 1 and 2 and 3
  for (let example of [1, 2, 3]) {
    const gridSelector = ex[example].gridSelector;
    const rowSelector = ex[example].rowSelector;
    const lastColumn = ex[example].lastColumn;
    const lastRow = ex[example].lastRow;

    let columnIndex = 1;

    // Index starts at 2 to skip header
    for (let rowIndex = 2; rowIndex <= lastRow; rowIndex++) {
      // If the row is not displayed, send page down to the last rows first element
      if (example === 3) {
        let rows = await t.context.queryElements(t, rowSelector);
        if (!(await rows[rowIndex - 1].isDisplayed())) {
          let previousRowCell = rows[rowIndex - 2].findElement(By.css('td'));
          await previousRowCell.sendKeys(Key.PAGE_DOWN);
        }
      }

      // Test focus moves down
      await sendKeyToGridcell(t, gridSelector, rowIndex, columnIndex, Key.HOME);
      t.true(
        await checkFocusOnOrInCell(t, gridSelector, rowIndex, 1),
        'After sending END to element in row ' +
          rowIndex +
          ' column ' +
          columnIndex +
          ', focus should be on element in row ' +
          rowIndex +
          ' column 1 for example: ' +
          example
      );

      // Switch the column every time
      columnIndex++;
      if (columnIndex > lastColumn) {
        columnIndex = 1;
      }
    }
  }
});

ariaTest('End key moves focus', exampleFile, 'key-end', async (t) => {
  // Examples 1 and 2 and 3
  for (let example of [1, 2, 3]) {
    const gridSelector = ex[example].gridSelector;
    const rowSelector = ex[example].rowSelector;
    const lastColumn = ex[example].lastColumn;
    const lastRow = ex[example].lastRow;

    let columnIndex = 1;

    // Index starts at 2 to skip header
    for (let rowIndex = 2; rowIndex <= lastRow; rowIndex++) {
      // If the row is not displayed, send page down to the last rows first element
      if (example === 3) {
        let rows = await t.context.queryElements(t, rowSelector);
        if (!(await rows[rowIndex - 1].isDisplayed())) {
          let previousRowCell = rows[rowIndex - 2].findElement(By.css('td'));
          await previousRowCell.sendKeys(Key.PAGE_DOWN);
        }
      }

      // Test focus moves down
      await sendKeyToGridcell(t, gridSelector, rowIndex, columnIndex, Key.END);
      t.true(
        await checkFocusOnOrInCell(t, gridSelector, rowIndex, lastColumn),
        'After sending END to element in row ' +
          rowIndex +
          ' column ' +
          columnIndex +
          ', focus should be on element in row ' +
          rowIndex +
          ' column ' +
          lastColumn +
          ' for example: ' +
          example
      );

      // Switch the column every time
      columnIndex++;
      if (columnIndex > lastColumn) {
        columnIndex = 1;
      }
    }
  }
});

ariaTest(
  'Control+home moves focus',
  exampleFile,
  'key-control-home',
  async (t) => {
    // Examples 1, 2, and 3
    for (let example of [1, 2, 3]) {
      const gridSelector = ex[example].gridSelector;
      const lastColumn = ex[example].lastColumn;
      const lastRow = ex[example].lastRow;
      const firstInteractiveRow = ex[example].firstInteractiveRow;

      let columnIndex = 1;

      // Index starts at 2 to skip header
      for (let rowIndex = 2; rowIndex <= lastRow; rowIndex++) {
        // If the row is not displayed, send page down to display gridcells
        if (example === 3) {
          if (rowIndex >= 7) {
            await sendKeyToGridcell(t, gridSelector, 2, 1, Key.PAGE_DOWN);
          }
          if (rowIndex >= 12) {
            await sendKeyToGridcell(t, gridSelector, 7, 1, Key.PAGE_DOWN);
          }
        }

        // Test focus moves down
        await sendKeyToGridcell(
          t,
          gridSelector,
          rowIndex,
          columnIndex,
          Key.chord(Key.CONTROL, Key.HOME)
        );
        t.true(
          await checkFocusOnOrInCell(t, gridSelector, firstInteractiveRow, 1),
          'After sending CONTROL+HOME to element in row ' +
            rowIndex +
            ' column ' +
            columnIndex +
            ', focus should be on element in row ' +
            firstInteractiveRow +
            ' column 1 for example: ' +
            example
        );

        // Switch the column every time
        columnIndex++;
        if (columnIndex > lastColumn) {
          columnIndex = 1;
        }
      }
    }
  }
);

ariaTest(
  'Control+end moves focus',
  exampleFile,
  'key-control-end',
  async (t) => {
    // Examples 1, 2, and 3
    for (let example of [1, 2, 3]) {
      const gridSelector = ex[example].gridSelector;
      const lastColumn = ex[example].lastColumn;
      const lastRow = ex[example].lastRow;

      let columnIndex = 1;

      // Index starts at 2 to skip header
      for (let rowIndex = 2; rowIndex <= lastRow; rowIndex++) {
        // If the row is not displayed, send page up to display gridcells
        // This will happen after the first iteration of this loop because in the
        // last round the focus end on the last row
        if (example === 3 && rowIndex !== 2) {
          if (rowIndex < 12) {
            await sendKeyToGridcell(t, gridSelector, 12, 1, Key.PAGE_UP);
          }
          if (rowIndex < 7) {
            await sendKeyToGridcell(t, gridSelector, 7, 1, Key.PAGE_UP);
          }
        }

        // Test focus moves down
        await sendKeyToGridcell(
          t,
          gridSelector,
          rowIndex,
          columnIndex,
          Key.chord(Key.CONTROL, Key.END)
        );
        t.true(
          await checkFocusOnOrInCell(t, gridSelector, lastRow, lastColumn),
          'After sending CONTROL+END to element in row ' +
            rowIndex +
            ' column ' +
            columnIndex +
            ', focus should be on element in row ' +
            lastRow +
            ' column ' +
            lastColumn +
            ' for example: ' +
            example
        );

        // Switch the column every time
        columnIndex++;
        if (columnIndex > lastColumn) {
          columnIndex = 1;
        }
      }
    }
  }
);
