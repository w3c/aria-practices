'use strict';

const { ariaTest } = require('..');
const { By, Key } = require('selenium-webdriver');
const assertAriaDescribedby = require('../util/assertAriaDescribedby');
const assertAriaLabelExists = require('../util/assertAriaLabelExists');
const assertAriaRoles = require('../util/assertAriaRoles');

const exampleFile = 'table/table.html';

const ex = {
  tableSelector: '#ex1 [role="table"]',
  numRowgroups: 2,
  numRows: 5,
  numColumnheaders: 4,
  numCells: 16
};

// Attributes

ariaTest('role="table" element exists', exampleFile, 'table-role', async (t) => {
  t.plan(1);
  await assertAriaRoles(t, 'ex1', 'table', 1, 'div');
});

ariaTest('"aria-label" attribute on table element', exampleFile, 'table-aria-label', async (t) => {
  t.plan(1);
  await assertAriaLabelExists(t, ex.tableSelector);
});

ariaTest('"aria-describedby" attribute on table element', exampleFile, 'table-aria-describedby', async (t) => {
  t.plan(1);
  await assertAriaDescribedby(t, ex.tableSelector);
});


ariaTest('role="rowgroup" exists', exampleFile, 'rowgroup-role', async (t) => {
  t.plan(1);

  const rowgroups = await t.context.session.findElements(By.css(
    ex.tableSelector + ' [role="rowgroup"]'
  ));

  t.is(
    rowgroups.length,
    ex.numRowgroups,
    ex.numRowgroups + ' role="rowgroup" elements should be found within the table element'
  );
});


ariaTest('role="row" exists', exampleFile, 'row-role', async (t) => {
  t.plan(1);

  const rows = await t.context.session.findElements(By.css(
    ex.tableSelector + ' [role="rowgroup"] [role="row"]'
  ));

  t.is(
    rows.length,
    ex.numRows,
    ex.numRows + ' role="row" elements should be found nested within the table element and rowgroup elements'
  );
});


ariaTest('role="columnheader" exists', exampleFile, 'columnheader-role', async (t) => {
  t.plan(1);

  const columnheaders = await t.context.session.findElements(By.css(
    ex.tableSelector + ' [role="rowgroup"] [role="row"] [role="columnheader"]'
  ));

  t.is(
    columnheaders.length,
    ex.numColumnheaders,
    ex.numColumnheaders + ' role="columnheader" elements should be found nested within the table element, rowgroup element and row element.'
  );

});

ariaTest('role="cell" exists', exampleFile, 'cell-role', async (t) => {
  t.plan(1);

  const cells = await t.context.session.findElements(By.css(
    ex.tableSelector + ' [role="rowgroup"] [role="row"] [role="cell"]'
  ));

  t.is(
    cells.length,
    ex.numCells,
    ex.numCells + ' role="cell" elements should be found nested within the table element, rowgroup element and row element.'
  );
});
