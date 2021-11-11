const { ariaTest } = require('..');
const assertAriaDescribedby = require('../util/assertAriaDescribedby');
const assertAriaLabelExists = require('../util/assertAriaLabelExists');
const assertAriaRoles = require('../util/assertAriaRoles');

const exampleFile = 'table/table.html';

const ex = {
  tableSelector: '#ex1 [role="table"]',
  numRowgroups: 2,
  numRows: 5,
  numColumnHeaders: 4,
  numCells: 16,
};

// Attributes

ariaTest(
  'role="table" element exists',
  exampleFile,
  'table-role',
  async (t) => {
    await assertAriaRoles(t, 'ex1', 'table', 1, 'div');
  }
);

ariaTest(
  '"aria-label" attribute on table element',
  exampleFile,
  'table-aria-label',
  async (t) => {
    await assertAriaLabelExists(t, ex.tableSelector);
  }
);

ariaTest(
  '"aria-describedby" attribute on table element',
  exampleFile,
  'table-aria-describedby',
  async (t) => {
    await assertAriaDescribedby(t, ex.tableSelector);
  }
);

ariaTest('role="rowgroup" exists', exampleFile, 'rowgroup-role', async (t) => {
  const rowgroups = await t.context.queryElements(
    t,
    ex.tableSelector + ' [role="rowgroup"]'
  );

  t.is(
    rowgroups.length,
    ex.numRowgroups,
    ex.numRowgroups +
      ' role="rowgroup" elements should be found within the table element'
  );
});

ariaTest('role="row" exists', exampleFile, 'row-role', async (t) => {
  const rows = await t.context.queryElements(
    t,
    ex.tableSelector + ' [role="rowgroup"] [role="row"]'
  );

  t.is(
    rows.length,
    ex.numRows,
    ex.numRows +
      ' role="row" elements should be found nested within the table element and rowgroup elements'
  );
});

ariaTest(
  'role="columnheader" exists',
  exampleFile,
  'columnheader-role',
  async (t) => {
    const columnHeaders = await t.context.queryElements(
      t,
      ex.tableSelector + ' [role="rowgroup"] [role="row"] [role="columnheader"]'
    );

    t.is(
      columnHeaders.length,
      ex.numColumnHeaders,
      ex.numColumnHeaders +
        ' role="columnheader" elements should be found nested within the table element, rowgroup element and row element.'
    );
  }
);

ariaTest('role="cell" exists', exampleFile, 'cell-role', async (t) => {
  const cells = await t.context.queryElements(
    t,
    ex.tableSelector + ' [role="rowgroup"] [role="row"] [role="cell"]'
  );

  t.is(
    cells.length,
    ex.numCells,
    ex.numCells +
      ' role="cell" elements should be found nested within the table element, rowgroup element and row element.'
  );
});
