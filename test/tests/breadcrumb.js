'use strict';

const { ariaTest } = require('..');
const { By, Key } = require('selenium-webdriver');

const exampleFile = 'breadcrumb/index.html';

const ex = {
  breadcrumbSelector: '#ex1 nav'
};

// Attributes

ariaTest('aria-label attribute on nav element', exampleFile, 'aria-label', async (t) => {
  t.plan(2);

  let ariaLabelExists = await t.context.session.executeScript(async function () {
    const [ selector ] = arguments;
    let el = document.querySelector(selector);
    return el.hasAttribute('aria-label');
  }, ex.breadcrumbSelector);

  t.true(
    ariaLabelExists,
    '"aria-label" attribute should exist on element: ' + ex.breadcrumbSelector
  );

  let ariaLabel = await t.context.session.findElement(By.css(ex.breadcrumbSelector))
    .getAttribute('aria-label');

  t.truthy(
    ariaLabel,
    '"aria-label" attribute should have value on element: ' + ex.breadcrumbSelector
  );
});

ariaTest('aria-current element should exist on relevent link', exampleFile, 'aria-current', async (t) => {
  t.plan(2);

  let navElement = await t.context.session.findElement(By.css(ex.breadcrumbSelector));
  let currentElement = await navElement.findElements(By.css('[aria-current]'));

  t.is(
    currentElement.length,
    1,
    'Only one element in the nav should have attribute "aria-current"'
  );

  t.is(
    await currentElement[0].getTagName(),
    'a',
    'attribute "aria-current" should be found on a link'
  );
});


