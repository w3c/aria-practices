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


const exampleFile = 'datepicker/datepicker.html';

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

ariaTest('Combobox: has aria-label', exampleFile, 'combobox-aria-label', async (t) => {
  t.plan(1);
  await assertAriaLabelExists(t, ex.comboboxSelector);
});


