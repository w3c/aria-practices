const { ariaTest } = require('..');
// const { By, Key } = require('selenium-webdriver');
const assertAriaDescribedby = require('../util/assertAriaDescribedby');
const assertAttributeValues = require('../util/assertAttributeValues');

const exampleFile = 'table/sortable-table.html';

const ex = {
  ariaSortSelector: '#ex1 table th[aria-sort]',
  buttonSelector: '#ex1 table th button',
  spanSelector: '#ex1 table th button span',
};

// Attributes

ariaTest(
  'Button elements should have aria-describedby',
  exampleFile,
  'button-aria-describedby',
  async (t) => {
    await assertAriaDescribedby(t, ex.buttonSelector);
  }
);

ariaTest(
  'Span used for sorting icons are hidden using aria-hidden',
  exampleFile,
  'span-aria-hidden',
  async (t) => {
    await assertAttributeValues(t, ex.spanSelector, 'aria-hidden', 'true');
  }
);

/*
ariaTest('key ENTER activates button', exampleFile, 'table-aria-sort', async (t) => {



});

*/
