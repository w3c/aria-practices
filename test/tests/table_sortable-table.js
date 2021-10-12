const { ariaTest } = require('..');
// const { By, Key } = require('selenium-webdriver');
const assertAttributeValues = require('../util/assertAttributeValues');

const exampleFile = 'table/sortable-table.html';

const ex = {
  ariaSortSelector: '#ex1 table th[aria-sort]',
  sortableColumnHeaderSelectors: [
    '#ex1 table th:nth-of-type(1)',
    '#ex1 table th:nth-of-type(2)',
    '#ex1 table th:nth-of-type(3)',
    '#ex1 table th:nth-of-type(5)',
  ],
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
  'aria-sort  value is updated when button is activated',
  exampleFile,
  'th-aria-sort',
  async (t) => {
    for (let index = 0; index < 2; index++) {
      const headerSelector = ex.sortableColumnHeaderSelectors[index];
      const buttonSelector = headerSelector + ' button';

      const button = await t.context.queryElement(t, buttonSelector);
      await button.click();

      await assertAttributeValues(t, headerSelector, 'aria-sort', 'descending');

      await button.click();

      await assertAttributeValues(t, headerSelector, 'aria-sort', 'ascending');
    }
  }
);
