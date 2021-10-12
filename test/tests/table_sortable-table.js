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

ariaTest(
  'Visual character entity for the sort order is hidden from AT',
  exampleFile,
  'span-aria-hidden',
  async (t) => {
    await assertAttributeValues(t, ex.spanSelector, 'aria-hidden', 'true');
  }
);

ariaTest(
  'Initial value of aria-sort is ascending',
  exampleFile,
  'th-aria-sort',
  async (t) => {
    await assertAttributeValues(
      t,
      ex.ariaSortSelector,
      'aria-sort',
      'ascending'
    );
  }
);
