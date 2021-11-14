const { ariaTest } = require('..');
const { By, Key } = require('selenium-webdriver');
const assertAttributeValues = require('../util/assertAttributeValues');
const assertAriaControls = require('../util/assertAriaControls');
const assertAriaLabelExists = require('../util/assertAriaLabelExists');
const assertAriaRoles = require('../util/assertAriaRoles');
const assertTabOrder = require('../util/assertTabOrder');

const exampleFile = 'carousel/carousel-1-prev-next.html';

const ex = {
  landmarkSelector: '#myCarousel',
  buttonSelector: '#ex1 button',
  pausePlayButtonSelector: '#ex1 button:first-of-type',
  previousButtonSelector: '#ex1 .previous',
  nextButtonSelector: '#ex1 .next',
  slideContainerSelector: '#ex1 .carousel-items',
  slideSelector: '#ex1 .carousel-item',
  allFocusableItems: [
    '#ex1 button:first-of-type',
    '#ex1 .previous',
    '#ex1 .next',
    '#ex1 .active .carousel-image a',
    '#ex1 .active .carousel-caption a',
  ],
  activeCarouselItem: '#ex1 .active',
};

// Attributes

ariaTest(
  'section element used to contain slider',
  exampleFile,
  'carousel-region-role',
  async (t) => {
    // This test primarily tests that the ex.landmarkSelector points to a `section` element
    const landmarkEl = await t.context.session.findElement(
      By.css(ex.landmarkSelector)
    );
    t.is(
      await landmarkEl.getTagName(),
      'section',
      ex.landmarkSelector + ' selector should select `section` element'
    );
  }
);

ariaTest(
  'section has aria-roledescription set to carousel',
  exampleFile,
  'carousel-region-aria-roledescription',
  async (t) => {
    // check the aria-roledescription set to carousel
    await assertAttributeValues(
      t,
      ex.landmarkSelector,
      'aria-roledescription',
      'carousel'
    );
  }
);

ariaTest(
  'section has aria-label',
  exampleFile,
  'carousel-region-aria-label',
  async (t) => {
    await assertAriaLabelExists(t, ex.landmarkSelector);
  }
);

ariaTest(
  'slide container have aria-live initially set to off',
  exampleFile,
  'carousel-aria-live',
  async (t) => {
    // On page load, `aria-level` is `off`
    await assertAttributeValues(
      t,
      ex.slideContainerSelector,
      'aria-live',
      'off'
    );

    // Focus on the widget, and aria-live should change to 'polite'
    await t.context.session
      .findElement(By.css(ex.nextButtonSelector))
      .sendKeys(Key.ENTER);

    await assertAttributeValues(
      t,
      ex.slideContainerSelector,
      'aria-live',
      'polite'
    );

    // Move focus off the widget, and the aria-selected should change to 'off' again
    await t.context.session
      .findElement(By.css(ex.nextButtonSelector))
      .sendKeys(Key.chord(Key.SHIFT, Key.TAB));
    await t.context.session
      .findElement(By.css(ex.pausePlayButtonSelector))
      .sendKeys(Key.chord(Key.SHIFT, Key.TAB));
    await assertAttributeValues(
      t,
      ex.slideContainerSelector,
      'aria-live',
      'off'
    );

    // Click the pause button, and the aria-selected should change to 'polite' again
    await t.context.session
      .findElement(By.css(ex.pausePlayButtonSelector))
      .click();
    await assertAttributeValues(
      t,
      ex.slideContainerSelector,
      'aria-live',
      'polite'
    );
  }
);

ariaTest(
  'pause, previous and next buttons have aria-label',
  exampleFile,
  'carousel-button-aria-label',
  async (t) => {
    await assertAriaLabelExists(t, ex.buttonSelector);
  }
);

ariaTest(
  'previous and next buttons have aria-controls',
  exampleFile,
  'carousel-button-aria-controls',
  async (t) => {
    await assertAriaControls(t, ex.previousButtonSelector);
    await assertAriaControls(t, ex.nextButtonSelector);
  }
);

ariaTest(
  'slides have role group',
  exampleFile,
  'carousel-group-role',
  async (t) => {
    await assertAriaRoles(t, 'myCarousel', 'group', 6, 'div');
  }
);

ariaTest(
  'slides have aria-label',
  exampleFile,
  'carousel-group-aria-label',
  async (t) => {
    await assertAriaLabelExists(t, ex.slideSelector);
  }
);

ariaTest(
  'slides have aria-roledescription set to slide',
  exampleFile,
  'carousel-group-aria-roledescription',
  async (t) => {
    // check the aria-roledescription set to carousel
    await assertAttributeValues(
      t,
      ex.slideSelector,
      'aria-roledescription',
      'slide'
    );
  }
);

// Keyboard interaction

ariaTest(
  'TAB moves key through buttons',
  exampleFile,
  'carousel-key-tab',
  async (t) => {
    await assertTabOrder(t, ex.allFocusableItems);
  }
);

ariaTest(
  'ENTER pause and start carousel motion',
  exampleFile,
  'carousel-enter-or-space-toggle',
  async (t) => {
    let activeElement = await t.context.session
      .findElement(By.css(ex.activeCarouselItem))
      .getAttribute('aria-label');

    await t.context.session
      .findElement(By.css(ex.pausePlayButtonSelector))
      .sendKeys(Key.ENTER);
    // Move focus from widget
    await t.context.session
      .findElement(By.css(ex.pausePlayButtonSelector))
      .sendKeys(Key.chord(Key.SHIFT, Key.TAB));

    let compareWithNextElement = await t.context.session.wait(
      async function () {
        let newActiveElement = await t.context.session
          .findElement(By.css(ex.activeCarouselItem))
          .getAttribute('aria-label');
        return activeElement === newActiveElement;
      },
      t.context.WaitTime
    );

    t.true(
      compareWithNextElement,
      'The active elements should stay the same when the pause button has been sent ENTER'
    );

    await t.context.session
      .findElement(By.css(ex.pausePlayButtonSelector))
      .sendKeys(Key.ENTER);
    // Move focus from widget
    await t.context.session
      .findElement(By.css(ex.pausePlayButtonSelector))
      .sendKeys(Key.chord(Key.SHIFT, Key.TAB));

    compareWithNextElement = await t.context.session.wait(async function () {
      let newActiveElement = await t.context.session
        .findElement(By.css(ex.activeCarouselItem))
        .getAttribute('aria-label');
      return activeElement !== newActiveElement;
    }, t.context.WaitTime);

    t.true(
      compareWithNextElement,
      'The active elements should change when the play button has been sent ENTER'
    );
  }
);

ariaTest(
  'SPACE pause and start carousel motion',
  exampleFile,
  'carousel-enter-or-space-toggle',
  async (t) => {
    let activeElement = await t.context.session
      .findElement(By.css(ex.activeCarouselItem))
      .getAttribute('aria-label');

    await t.context.session
      .findElement(By.css(ex.pausePlayButtonSelector))
      .sendKeys(Key.SPACE);
    // Move focus from widget
    await t.context.session
      .findElement(By.css(ex.pausePlayButtonSelector))
      .sendKeys(Key.chord(Key.SHIFT, Key.TAB));

    let compareWithNextElement = await t.context.session.wait(
      async function () {
        let newActiveElement = await t.context.session
          .findElement(By.css(ex.activeCarouselItem))
          .getAttribute('aria-label');
        return activeElement === newActiveElement;
      },
      t.context.WaitTime
    );

    t.true(
      compareWithNextElement,
      'The active elements should stay the same when the pause button has been sent SPACE'
    );

    await t.context.session
      .findElement(By.css(ex.pausePlayButtonSelector))
      .sendKeys(Key.SPACE);
    // Move focus from widget
    await t.context.session
      .findElement(By.css(ex.pausePlayButtonSelector))
      .sendKeys(Key.chord(Key.SHIFT, Key.TAB));

    compareWithNextElement = await t.context.session.wait(async function () {
      let newActiveElement = await t.context.session
        .findElement(By.css(ex.activeCarouselItem))
        .getAttribute('aria-label');
      return activeElement !== newActiveElement;
    }, t.context.WaitTime);

    t.true(
      compareWithNextElement,
      'The active elements should change when the play button has been sent SPACE'
    );
  }
);

ariaTest(
  'SPACE on previous and next',
  exampleFile,
  'carousel-key-enter-or-space-move',
  async (t) => {
    let activeElement = await t.context.session
      .findElement(By.css(ex.activeCarouselItem))
      .getAttribute('aria-label');

    await t.context.session
      .findElement(By.css(ex.previousButtonSelector))
      .sendKeys(Key.SPACE);

    let compareWithNextElement = await t.context.session.wait(
      async function () {
        let newActiveElement = await t.context.session
          .findElement(By.css(ex.activeCarouselItem))
          .getAttribute('aria-label');
        return activeElement !== newActiveElement;
      },
      t.context.WaitTime
    );

    t.true(
      compareWithNextElement,
      'After sending SPACE to previous button, the carousel should show a different element'
    );

    await t.context.session
      .findElement(By.css(ex.nextButtonSelector))
      .sendKeys(Key.SPACE);

    compareWithNextElement = await t.context.session.wait(async function () {
      let newActiveElement = await t.context.session
        .findElement(By.css(ex.activeCarouselItem))
        .getAttribute('aria-label');
      return activeElement === newActiveElement;
    }, t.context.WaitTime);

    t.true(
      compareWithNextElement,
      'After sending SPACE to previous button then SPACE to next button, the carousel should show the first carousel item'
    );
  }
);

ariaTest(
  'ENTER on previous and next',
  exampleFile,
  'carousel-key-enter-or-space-move',
  async (t) => {
    let activeElement = await t.context.session
      .findElement(By.css(ex.activeCarouselItem))
      .getAttribute('aria-label');

    await t.context.session
      .findElement(By.css(ex.previousButtonSelector))
      .sendKeys(Key.ENTER);

    let compareWithNextElement = await t.context.session.wait(
      async function () {
        let newActiveElement = await t.context.session
          .findElement(By.css(ex.activeCarouselItem))
          .getAttribute('aria-label');
        return activeElement !== newActiveElement;
      },
      t.context.WaitTime
    );

    t.true(
      compareWithNextElement,
      'After sending ENTER to previous button, the carousel should show a different element'
    );

    await t.context.session
      .findElement(By.css(ex.nextButtonSelector))
      .sendKeys(Key.ENTER);

    compareWithNextElement = await t.context.session.wait(async function () {
      let newActiveElement = await t.context.session
        .findElement(By.css(ex.activeCarouselItem))
        .getAttribute('aria-label');
      return activeElement === newActiveElement;
    }, t.context.WaitTime);

    t.true(
      compareWithNextElement,
      'After sending ENTER to previous button then ENTER to next button, the carousel should show the first carousel item'
    );
  }
);
