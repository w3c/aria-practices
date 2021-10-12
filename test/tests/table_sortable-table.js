const { ariaTest } = require('..');
// const { By, Key } = require('selenium-webdriver');
const assertAttributeValues = require('../util/assertAttributeValues');

const exampleFile = 'table/sortable-table.html';

const ex = {
  ariaSortSelector: '#ex1 table th[aria-sort]',
  buttonSelector: '#ex1 table th button',
  spanSelector: '#ex1 table th[aria-sort] button span',
};

// Attributes

ariaTest('key ENTER activates button', exampleFile, 'table-aria-sort', async (t) => {
  await assertAttributeValues(t, ex.spanSelector, 'aria-hidden', 'true');
});

