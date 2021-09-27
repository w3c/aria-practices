const { ariaTest } = require('..');
// const { By, Key } = require('selenium-webdriver');
const assertAriaLabelExists = require('../util/assertAriaLabelExists');

const exampleFile = 'table/sortable-table.html';

const ex = {
  ariaSortSelector: '#ex1 table th[aria-sort]',
  buttonSelector: '#ex1 table th button',
};

// Attributes

ariaTest(
  'Button elements should have aria-label',
  exampleFile,
  'button-aria-label',
  async (t) => {
    await assertAriaLabelExists(t, ex.buttonSelector);
  }
);

/*
ariaTest('key ENTER activates button', exampleFile, 'table-aria-sort', async (t) => {



});

*/
