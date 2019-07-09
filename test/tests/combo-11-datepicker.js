'use strict';

const { ariaTest } = require('..');
const { By, Key } = require('selenium-webdriver');
const assertAttributeValues = require('../util/assertAttributeValues');
const assertAriaControls = require('../util/assertAriaControls');
const assertAriaLabelledby = require('../util/assertAriaLabelledby');
const assertAriaDescribedby = require('../util/assertAriaDescribedby');
const assertAriaLabelExists = require('../util/assertAriaLabelExists');
const assertAriaRoles = require('../util/assertAriaRoles');
const assertTabOrder = require('../util/assertTabOrder');

const exampleFile = 'combobox/aria1.1pattern/combo-11-datepicker.html';

const ex = {
  comboboxSelector: '#myDatepicker',
  dialogSelector: '#myDatepickerDialog',
  gridSelector: '#myDatepickerGrid'
};


// Attributes

ariaTest('Combobox: has role', exampleFile, 'combobox-role', async (t) => {
  t.plan(1);
  await assertAriaRoles(t, 'example', 'combobox', 1, 'div');
});

ariaTest('Combobox: has aria-labelledby', exampleFile, 'combobox-aria-labelledby', async (t) => {
  t.plan(1);
  await assertAriaLabelledby(t, ex.comboboxSelector);
});

ariaTest('Combobox: has aria-haspopup set to "dialog"', exampleFile, 'combobox-aria-haspopup', async (t) => {
  t.plan(1);
  await assertAttributeValues(t, ex.comboboxSelector, 'aria-haspopup', 'dialog');
});

ariaTest('Combobox: has aria-owns set to "myDatepickerDialog"', exampleFile, 'combobox-aria-owns', async (t) => {
  t.plan(1);
  await assertAttributeValues(t, ex.comboboxSelector, 'aria-owns', 'myDatepickerDialog');
});

ariaTest('Combobox: has aria-labelledby set to "id-label-1"', exampleFile, 'combobox-aria-labelledby', async (t) => {
  t.plan(1);
  await assertAttributeValues(t, ex.comboboxSelector, 'aria-labelledby', 'id-label-1');
});

ariaTest('Combobox: Initially aria-expanded set to "false"', exampleFile, 'combobox-aria-expanded', async (t) => {
  t.plan(1);
  await assertAttributeValues(t, ex.comboboxSelector, 'aria-expanded', 'false');
});

