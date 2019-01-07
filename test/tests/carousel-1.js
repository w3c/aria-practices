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


const exampleFile = 'carousel/carousel-1/carousel-1.html';

const ex = {
  landmarkSelector: '#myCarousel',
  previousNextButtonSelector: '#ex1 .carousel-control',
  slideSelector: '#ex1 .carousel-item'
};


// Attributes

ariaTest('Carousel 1: section has aria-label', exampleFile, 'carousel-region-role', async (t) => {
  t.plan(1);
  await assertAriaLabelExists(t, ex.landmarkSelector);
});

ariaTest('Carousel 1: section has aria-roledescription set to carousel', exampleFile, 'carousel-region-aria-roledescription', async (t) => {
  t.plan(1);

  // check the aria-roledescrption set to carousel
  await assertAttributeValues(t, ex.landmarkSelector, 'aria-roledescription', 'carousel');
});

ariaTest('Carousel 1: previous and next buttons have role button', exampleFile, 'carousel-button-role-overrides-link', async (t) => {
  t.plan(1);
  await assertAriaRoles(t, 'myCarousel', 'button', 2, 'a');
});

ariaTest('Carousel 1: previous and next buttons have aria-label', exampleFile, 'carousel-aria-label-next-previous', async (t) => {
  t.plan(1);
  await assertAriaLabelExists(t, ex.previousNextButtonSelector);
});

ariaTest('Carousel 1: previous and next buttons have aria-controls', exampleFile, 'carousel-aria-controls', async (t) => {
  t.plan(1);
  await assertAriaControls(t, ex.previousNextButtonSelector);
});

ariaTest('Carousel 1: slide containers have role group', exampleFile, 'carousel-group-role', async (t) => {
  t.plan(1);
  await assertAriaRoles(t, 'myCarousel', 'group', 6, 'div');
});

ariaTest('Carousel 1: slide containers have aria-label', exampleFile, 'carousel-aria-label-number-of-slide', async (t) => {
  t.plan(1);
  await assertAriaLabelExists(t, ex.slideSelector);
});

ariaTest('Carousel 1: slide containers have aria-roledescription set to slide', exampleFile, 'carousel-aria-roledescription', async (t) => {
  t.plan(1);

  // check the aria-roledescrption set to carousel
  await assertAttributeValues(t, ex.slideSelector, 'aria-roledescription', 'slide');
});

ariaTest('Carousel 1: slide containers have aria-describedby', exampleFile, 'carousel-aria-describedby', async (t) => {
  t.plan(1);
  await assertAriaDescribedby(t, ex.slideSelector);
});
