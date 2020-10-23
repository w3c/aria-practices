const { ariaTest } = require('..');
const { By } = require('selenium-webdriver');
const assertAriaLabelExists = require('../util/assertAriaLabelExists');

const exampleFile = 'breadcrumb/index.html';

const ex = {
  breadcrumbSelector: '#ex1 nav',
};

// Attributes

ariaTest(
  'aria-label attribute on nav element',
  exampleFile,
  'aria-label',
  async (t) => {
    await assertAriaLabelExists(t, ex.breadcrumbSelector);
  }
);

ariaTest(
  'aria-current element should exist on relevant link',
  exampleFile,
  'aria-current',
  async (t) => {
    let navElement = await t.context.session.findElement(
      By.css(ex.breadcrumbSelector)
    );
    let currentElement = await t.context.queryElements(
      t,
      '[aria-current]',
      navElement
    );

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
  }
);
