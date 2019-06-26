'use strict';

const { ariaTest } = require('..');
const { By, Key } = require('selenium-webdriver');
const assertAttributeValues = require('../util/assertAttributeValues');
const assertAriaLabelledby = require('../util/assertAriaLabelledby');
const assertAriaRoles = require('../util/assertAriaRoles');
const assertRovingTabindex = require('../util/assertRovingTabindex');
const assertTabOrder = require('../util/assertTabOrder');

const exampleFile = 'spinbutton/datepicker-spinbuttons.html';

const ex = {
  groupSelector: '#ex1 [role="group"]',
  spinbuttonSelector: '#ex1 [role="spinbutton"]'
};

const checkFocus = async function (t, selector, index) {
  return t.context.session.executeScript(function () {
    const [selector, index] = arguments;
    const items = document.querySelectorAll(selector);
    return items[index] === document.activeElement;
  }, selector, index);
};

// Attributes

ariaTest('role="group" on div element', exampleFile, 'group-role', async (t) => {
  t.plan(1);
  await assertAriaRoles(t, 'ex1', 'group', '1', 'div');
});

ariaTest('"aria-labelledby" attribute on group', exampleFile, 'group-aria-labelledby', async (t) => {
  t.plan(1);
  await assertAriaLabelledby(t,  ex.roupSelector);
});

ariaTest('role="spinbutton" on div element', exampleFile, 'spinbutton-role', async (t) => {
  t.plan(1);
  await assertAriaRoles(t, 'ex1', 'spinbutton', '3', 'div');
});

ariaTest('"aria-valuemin" set on role="spinbutton"', exampleFile, 'spinbutton-aria-valuemin', async (t) => {
  t.plan(3);
});
