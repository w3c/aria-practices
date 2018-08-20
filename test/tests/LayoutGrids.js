'use strict';

const { ariaTest } = require('..');
const { By, Key } = require('selenium-webdriver');

const assertAriaLabelledby = require('../util/assertAriaLabelledby');

const reload = async (session) => {
  return session.get(await session.getCurrentUrl());
};

const clickUntilDisabled = async (session, selector) => {
  const el = await session.findElement(By.css(selector));
  await el.click();

  if (await el.isEnabled()) {
    return clickUntilDisabled(session, selector);
  }
};

const checkActiveElement = async function (t, gridcellsSelector, index) {
  return t.context.session.executeScript(function () {

    const gridcellsSelector = arguments[0];
    const index = arguments[1];
    const gridcells = document.querySelectorAll(gridcellsSelector);
    const gridcell = gridcells[index];
    return (document.activeElement === gridcell) || gridcell.contains(document.activeElement);

  }, gridcellsSelector, index);
};

const focusOnOrInCell = async function (t, cellElement, focusable) {
  return t.context.session.executeScript(function () {
    const [cellElement, focusable] = arguments;

    if (focusable == 'gridcell') {
      cellElement.focus();
      if (document.activeElement === cellElement) {
        return cellElement;
      }
    }

    let focusableEl = cellElement.querySelector(focusable);
    focusableEl.focus();
    if (document.activeElement === focusableEl) {
      return focusableEl;
    }

  }, cellElement, focusable);
};

const findColIndex = function () {
  const el = document.activeElement;
  while (!el.hasAttribute('aria-colindex')) {
    el = el.parent;
  }
  return el.attribute('aria-colindex');
};


const pageExamples = {
  'ex1': {
    gridSelector: '#ex1 [role="grid"]',
    gridcellSelector: '#ex1 [role="gridcell"]',
    focusableElements: [
      'a', 'a', 'a', 'a', 'a', 'a' // row 1
    ]
  },
  'ex2': {
    gridSelector: '#ex2 [role="grid"]',
    gridcellSelector: '#ex2 [role="gridcell"]',
    focusableElements: [
      'a', 'span[role="button"]', // row 1
      'a', 'span[role="button"]'  // row 2
    ]
  },
  'ex3': {
    gridSelector: '#ex3 [role="grid"]',
    gridcellSelector: '#ex3 [role="gridcell"]',
    focusableElements: [
      'a', 'gridcell', 'gridcell',  // row 1
      'a', 'gridcell', 'gridcell',  // row 2
      'a', 'gridcell', 'gridcell',  // row 3
      'a', 'gridcell', 'gridcell',  // row 4
      'a', 'gridcell', 'gridcell',  // row 5
      'a', 'gridcell', 'gridcell',  // row 6
      'a', 'gridcell', 'gridcell',  // row 7
      'a', 'gridcell', 'gridcell',  // row 8
      'a', 'gridcell', 'gridcell',  // row 9
      'a', 'gridcell', 'gridcell',  // row 10
      'a', 'gridcell', 'gridcell',  // row 11
      'a', 'gridcell', 'gridcell',  // row 12
      'a', 'gridcell', 'gridcell',  // row 13
      'a', 'gridcell', 'gridcell',  // row 14
      'a', 'gridcell', 'gridcell',  // row 15
      'a', 'gridcell', 'gridcell',  // row 16
      'a', 'gridcell', 'gridcell',  // row 17
      'a', 'gridcell', 'gridcell',  // row 18
      'a', 'gridcell', 'gridcell'   // row 19
    ]
  }
};

const exampleInitialized = async function (t, exId) {
  const initializedSelector = '#' + exId + ' [role="grid"] [tabindex="0"]';

  await t.context.session.wait(async function () {
    const els = await t.context.session.findElements(By.css(initializedSelector));
    return els.length === 1;
  }, 500);
};

// Attributes

ariaTest('Test "role=grid" attribute exists',
  'grid/LayoutGrids.html', 'grid-role', async (t) => {

    t.plan(3);

    for (let exId in pageExamples) {
      const ex = pageExamples[exId];
      const gridLocator = By.css(ex.gridSelector);

      t.is(
        (await t.context.session.findElements(gridLocator)).length,
        1,
        'One "role=grid" element should be found by selector: ' + ex.gridSelector
      );
    }
  });

ariaTest('Test "aria-labelledby" attribute exists',
  'grid/LayoutGrids.html', 'aria-labelledby', async (t) => {

    t.plan(3);

    for (let exId in pageExamples) {
      const ex = pageExamples[exId];

      await assertAriaLabelledby(t, exId, ex.gridSelector);
    }
  });

ariaTest('Test "aria-rowcount" attribute exists',
  'grid/LayoutGrids.html', 'aria-rowcount', async (t) => {

    t.plan(2);

    // This test only applies to example 3
    const gridSelector = '#ex3 [role="grid"]';
    const gridLocator = By.css(gridSelector);
    const rowCount = await t.context.session
      .findElement(gridLocator)
      .getAttribute('aria-rowcount');

    t.truthy(
      rowCount,
      '"aria-rowcount" attribute should exist on element selected by: ' + gridSelector
    );

    const rowLocator = By.css('[role="row"]');
    const rowElements = await t.context.session
      .findElement(gridLocator)
      .findElements(rowLocator);

    t.is(
      rowElements.length,
      Number(rowCount),
      '"aria-rowcount" attribute should match the number of [role="row"] divs in example: ' + gridSelector
    );
  });

ariaTest('Test "role=row" attribute exists',
  'grid/LayoutGrids.html', 'row-role', async (t) => {

    t.plan(3);

    for (let exId in pageExamples) {
      const ex = pageExamples[exId];

      const gridLocator = By.css(ex.gridSelector);
      const rowLocator = By.css('div[role="row"]');
      const rowElements = await t.context.session
        .findElement(gridLocator)
        .findElements(rowLocator);

      t.truthy(
        rowElements.length,
        '"role=row" elements should exist in example: ' + ex.gridSelector
      );
    }
  });

ariaTest('test "aria-rowindex" attribute exists',
  'grid/LayoutGrids.html', 'aria-rowindex', async (t) => {

    t.plan(19);

    // This test only applies to example 3
    const exId = 'ex3';
    const gridSelector = '#ex3 [role="grid"]';
    const gridLocator = By.css(gridSelector);

    const rowLocator = By.css('[role="row"]');
    const rowElements = await t.context.session
      .findElement(gridLocator)
      .findElements(rowLocator);

    for (let i = 0; i < rowElements.length; i++) {
      const value = (i + 1).toString();
      t.is(
        await rowElements[i].getAttribute('aria-rowindex'),
        value,
        '[aria-rowindex="' + value + '"] attribute added to role="row" elements in: ' + gridSelector
      );
    }

  });

ariaTest('Test "role=gridcell" attribute exists',
  'grid/LayoutGrids.html', 'gridcell-role', async (t) => {

    t.plan(3);

    for (let exId in pageExamples) {
      const ex = pageExamples[exId];
      const gridLocator = By.css(ex.gridSelector);

      const gridcellLocator = By.css('[role="gridcell"]');
      const gridcellElements = await t.context.session
        .findElement(gridLocator)
        .findElements(gridcellLocator);

      t.truthy(
        gridcellElements.length,
        '["role=gridcell]" elements should exist in example: ' + ex.gridSelector
      );
    }
  });


ariaTest('Test "tabindex" appropriately set',
  'grid/LayoutGrids.html', 'tabindex', async (t) => {

    for (let exId in pageExamples) {
      const ex = pageExamples[exId];

      // Wait for the javascript to run before testing example
      await exampleInitialized(t, exId);

      const gridcellElements = await t.context.session.findElements(By.css(ex.gridcellSelector));

      for (let el = 0; el < gridcellElements.length; el++) {

        // The first gridcell element will have tabindex=0
        const tabindex = el === 0 ? '0' : '-1';

        // Find which part of the gridcell should have focus
        const focusableElementSelector = ex.focusableElements[el];

        // If it is the gridcell itself
        if (focusableElementSelector == 'gridcell') {
          t.is(
            await gridcellElements[el].getAttribute('tabindex'),
            tabindex,
            'gridcell at index ' + el + 'in ' + exId + ' grid should have tabindex=' + tabindex
          );
        }
        // If it is not the gridcell, it is an element within it
        else {
          t.is(
            await gridcellElements[el].getAttribute('tabindex'),
            null,
            'gridcell at index ' + el + 'in ' + exId + ' grid should not have tabindex'
          );

          t.is(
            await gridcellElements[el]
              .findElement(By.css(focusableElementSelector))
              .getAttribute('tabindex'),
            tabindex,
            'element "' + focusableElementSelector + '" in gridcell index ' +
              el + 'in ' + exId + ' grid should have tabindex=' + tabindex
          );

        }

      }
    }
  });


// Keys

ariaTest('Right arrow key moves focus', 'grid/LayoutGrids.html', 'key-right-arrow', async (t) => {
  t.plan(67);

  for (let [exId, ex] of Object.entries(pageExamples)) {
    const gridcellElements = await t.context.session.findElements(
      By.css(ex.gridcellSelector)
    );

    // Find the first focusable element
    let activeElement = await focusOnOrInCell(t, gridcellElements[0], ex.focusableElements[0]);
    if (!activeElement) {
      throw new Error('Could not focus on element or any decendent in the first gridcell: ' + ex.gridcellSelector);
    }

    // Test focus moves to next element on arrow right

    for (let index = 1; index < gridcellElements.length; index++) {

      await activeElement.sendKeys(Key.ARROW_RIGHT);
      const correctActiveElement = checkActiveElement(t, ex.gridcellSelector, index);

      t.truthy(
        correctActiveElement,
        'Example ' + exId + ': gridcell `' + (await gridcellElements[index].getText()) + '` should receive focus after arrow right'
      );

      activeElement = await t.context.session.executeScript(() => {
        return document.activeElement;
      });
    }

    // Test arrow key on final element

    await activeElement.sendKeys(Key.ARROW_RIGHT);
    const correctActiveElement = checkActiveElement(t, ex.gridcellSelector, gridcellElements.length - 1);
    t.truthy(
      correctActiveElement,
      'Example ' + exId + ': Right Arrow sent to final gridcell should not move focus.'
    );
  }
});

ariaTest('Left arrow key moves focus', 'grid/LayoutGrids.html', 'key-left-arrow', async (t) => {
  t.plan(67);

  for (let [exId, ex] of Object.entries(pageExamples)) {

    if (exId == 'ex3') {
      // This test depends on the "page down" button which is not specified by
      // the widget's description. It does this to avoid relying on behaviors
      // that are tested elsewhere.
      await clickUntilDisabled(t.context.session, '#ex3_pagedown_button');
    }

    const gridcellElements = await t.context.session.findElements(By.css(ex.gridcellSelector));
    const lastCellIndex = gridcellElements.length - 1;

    // Find the last focusable element
    let activeElement = await focusOnOrInCell(t, gridcellElements[lastCellIndex], ex.focusableElements[lastCellIndex]);

    if (!activeElement) {
      throw new Error('Could not focus on element or any decendent in the last gridcell: ' + ex.gridcellSelector);
    }

    // Test focus moves to preivous cell after arrow left

    for (let index = gridcellElements.length - 2; index > -1; index--) {

      await activeElement.sendKeys(Key.ARROW_LEFT);
      const correctActiveElement = checkActiveElement(t, ex.gridcellSelector, index);

      t.truthy(
        correctActiveElement,
        'Example ' + exId + ': gridcell `' + (await gridcellElements[index].getText()) + '` should receive focus after arrow left'
      );

      activeElement = await t.context.session.executeScript(() => {
        return document.activeElement;
      });
    }

    // Test arrow left on the first cell

    await activeElement.sendKeys(Key.ARROW_LEFT);
    const correctActiveElement = checkActiveElement(t, ex.gridcellSelector, 0);
    t.truthy(
      correctActiveElement,
      'Example ' + exId + ': Left Arrow sent to fist gridcell should not move focus.'
    );
  }
});

ariaTest('Down arrow key moves focus', 'grid/LayoutGrids.html', 'key-down-arrow', async (t) => {
  t.plan(27);

  const cellSelectors = {
    ex1: '#ex1 [role="gridcell"]',
    ex2: '#ex2 [role="row"] [role="gridcell"]:first-of-type',
    ex3: '#ex3 [role="row"] [role="gridcell"]:first-child'
  };

  for (let [exId, selector] of Object.entries(cellSelectors)) {
    const ex = pageExamples[exId];

    const gridcellElements = await t.context.session.findElements(
      By.css(selector)
    );

    // Find the first focusable element
    let activeElement = await focusOnOrInCell(t, gridcellElements[0], ex.focusableElements[0]);
    if (!activeElement) {
      throw new Error('Could not focus on element or any decendent in the first gridcell: ' + selector);
    }

    // Test focus moves to next row on down arroq

    for (let index = 1; index < gridcellElements.length; index++) {

      await activeElement.sendKeys(Key.ARROW_DOWN);
      const correctActiveElement = checkActiveElement(t, selector, index);

      t.truthy(
        correctActiveElement,
        'Example ' + exId + ': gridcell `' + (await gridcellElements[index].getText()) + '` should receive focus after arrow down'
      );

      activeElement = await t.context.session.executeScript(() => {
        return document.activeElement;
      });
    }

    // Test arrow key on final row

    await activeElement.sendKeys(Key.ARROW_DOWN);
    const correctActiveElement = checkActiveElement(t, selector, gridcellElements.length - 1);
    t.truthy(
      correctActiveElement,
      'Example ' + exId + ': Down Arrow sent to final gridcell should not move focus.'
    );
  }
});

ariaTest('Up arrow key moves focus', 'grid/LayoutGrids.html', 'key-up-arrow', async (t) => {
  t.plan(27);

  const cellSelectors = [
    ['ex1', '#ex1 [role="gridcell"]', 'a'],
    ['ex2', '#ex2 [role="row"] [role="gridcell"]:first-of-type', 'a'],
    ['ex3', '#ex3 [role="row"] [role="gridcell"]:first-child', 'a']
  ];

  for (let [exId, selector, focusableElement] of cellSelectors) {
    const ex = pageExamples[exId];

    if (exId == 'ex3') {
      // This test depends on the "page down" button which is not specified by
      // the widget's description. It does this to avoid relying on behaviors
      // that are tested elsewhere.
      await clickUntilDisabled(t.context.session, '#ex3_pagedown_button');
    }

    const gridcellElements = await t.context.session.findElements(By.css(selector));
    const lastCellIndex = gridcellElements.length - 1;

    // Find the last focusable element
    let activeElement = await focusOnOrInCell(t, gridcellElements[lastCellIndex], focusableElement);

    if (!activeElement) {
      throw new Error('Could not focus on element or any decendent in the last gridcell: ' + selector);
    }

    // Test focus moves to previous row on up arrow

    for (let index = gridcellElements.length - 2; index > -1; index--) {

      await activeElement.sendKeys(Key.ARROW_UP);
      const correctActiveElement = checkActiveElement(t, selector, index);

      t.truthy(
        correctActiveElement,
        'Example ' + exId + ': gridcell `' + (await gridcellElements[index].getText()) + '` should receive focus after arrow up'
      );

      activeElement = await t.context.session.executeScript(() => {
        return document.activeElement;
      });
    }

    // Test up arrow on first row

    await activeElement.sendKeys(Key.ARROW_UP);
    const correctActiveElement = checkActiveElement(t, selector, 0);
    t.truthy(
      correctActiveElement,
      'Example ' + exId + ': Up Arrow sent to fist gridcell should not move focus.'
    );
  }
});

ariaTest('PageDown key moves focus', 'grid/LayoutGrids.html', 'key-page-down', async (t) => {
  t.plan(12);

  const ex = pageExamples.ex3;
  const cellSelectors = [
    ['first', '#ex3 [role="row"] [role="gridcell"]:nth-child(1)', 'a'],
    ['second', '#ex3 [role="row"] [role="gridcell"]:nth-child(2)', 'gridcell'],
    ['third', '#ex3 [role="row"] [role="gridcell"]:nth-child(3)', 'gridcell']
  ];
  const jumpBy = Number(await t.context.session
    .findElement(By.css('#ex3 [role="grid"]'))
    .getAttribute('data-per-page'));

  for (let [initialCell, selector, focusableElement] of cellSelectors) {

    await reload(t.context.session);

    let finalIndex;
    const gridcellElements = (await t.context.session.findElements(
      By.css(selector)
    ));

    // Find the first focusable element

    let activeElement = await focusOnOrInCell(t, gridcellElements[0], focusableElement);
    if (!activeElement) {
      throw new Error('Could not focus on element or any decendent in the first gridcell: ' + selector);
    }

    // Test focus moves to next element on paging key

    for (let index = jumpBy; index < gridcellElements.length; index += jumpBy) {

      await activeElement.sendKeys(Key.PAGE_DOWN);
      const correctActiveElement = checkActiveElement(t, selector, index);

      t.truthy(
        correctActiveElement,
        initialCell + ' cell in row: gridcell `' + (await gridcellElements[index].getText()) + '` should receive focus after page down'
      );

      activeElement = await t.context.session.executeScript(() => {
        return document.activeElement;
      });
      finalIndex = index;
    }

    // Test paging key on final element

    await activeElement.sendKeys(Key.PAGE_DOWN);
    const correctActiveElement = checkActiveElement(t, selector, finalIndex);
    t.truthy(
      correctActiveElement,
      initialCell + ' cell in row: Page Down sent to final gridcell should not move focus.'
    );
  }
});

ariaTest('PageUp key moves focus', 'grid/LayoutGrids.html', 'key-page-up', async (t) => {
  t.plan(12);

  const ex = pageExamples.ex3;
  const cellSelectors = [
    ['first', '#ex3 [role="row"] [role="gridcell"]:nth-child(1)', 'a'],
    ['second', '#ex3 [role="row"] [role="gridcell"]:nth-child(2)', 'gridcell'],
    ['third', '#ex3 [role="row"] [role="gridcell"]:nth-child(3)', 'gridcell']
  ];
  const jumpBy = Number(await t.context.session
    .findElement(By.css('#ex3 [role="grid"]'))
    .getAttribute('data-per-page'));

  for (let [initialCell, selector, focusableElement] of cellSelectors) {

    await reload(t.context.session);
    // This test depends on the "page down" button which is not specified by
    // the widget's description. It does this to avoid relying on behaviors
    // that are tested elsewhere.
    await clickUntilDisabled(t.context.session, '#ex3_pagedown_button');

    let finalIndex;
    const gridcellElements = (await t.context.session.findElements(
      By.css(selector)
    ));

    const lastCellIndex = gridcellElements.length - 1;

    // Find the last focusable element
    let activeElement = await focusOnOrInCell(t, gridcellElements[lastCellIndex], focusableElement);
    if (!activeElement) {
      throw new Error('Could not focus on element or any decendent in the final gridcell: ' + selector);
    }

    // Test focus moves to next element on paging key

    // The final "page" of rows may not contain the maxmium number of rows. In
    // this case, the first "Page Up" keypress will involve traversing fewer
    // rows than subsequent kepresses.
    const finalPageLength = (gridcellElements.length % jumpBy) || jumpBy;
    const penultimate = gridcellElements.length - 1 - finalPageLength;
    for (let index = penultimate; index > -1; index -= jumpBy) {
      await activeElement.sendKeys(Key.PAGE_UP);
      const correctActiveElement = checkActiveElement(t, selector, index);

      t.truthy(
        correctActiveElement,
        initialCell + ' cell in row: gridcell `' + (await gridcellElements[index].getText()) + '` should receive focus after page up'
      );

      activeElement = await t.context.session.executeScript(() => {
        return document.activeElement;
      });
      finalIndex = index;
    }

    // Test paging key on final element

    await activeElement.sendKeys(Key.PAGE_UP);
    const correctActiveElement = checkActiveElement(t, selector, finalIndex);
    t.truthy(
      correctActiveElement,
      initialCell + ' cell in row: Page Up sent to first gridcell should not move focus.'
    );
  }
});

ariaTest('Home key moves focus', 'grid/LayoutGrids.html', 'key-home', async (t) => {
  t.plan(3);

  const firstElementInFirstRowText = {
    ex1: 'ARIA 1.1 Specification',
    ex2: 'Recipient Name 1',
    ex3: 'WAI-ARIA Overview Web Accessibility Initiative W3C'
  };

  for (let [exId, ex] of Object.entries(pageExamples)) {

    const gridcellElements = await t.context.session.findElements(
      By.css(ex.gridcellSelector)
    );

    // Find the first focusable element
    let activeElement = await focusOnOrInCell(t, gridcellElements[0], ex.focusableElements[0]);
    if (!activeElement) {
      throw new Error('Could not focus on element or any decendent in the first gridcell: ' + ex.gridcellSelector);
    }

    // Move the focused element off the first element in the row
    await activeElement.sendKeys(Key.ARROW_RIGHT);
    activeElement = await t.context.session.executeScript(() => {
      return document.activeElement;
    });

    // Test focus moves back to the first element in the row after sending key HOME
    await activeElement.sendKeys(Key.HOME);
    activeElement = await t.context.session.executeScript(() => {
      return document.activeElement;
    });

    t.is(
      await activeElement.getText(),
      firstElementInFirstRowText[exId],
      'Example ' + exId + ': home should move focus to first element in the row'
    );

  }
});

ariaTest('End key moves focus', 'grid/LayoutGrids.html', 'key-end', async (t) => {
  t.plan(3);

  const lastElementInFirstRowText = {
    ex1: 'SVG 2 Specification',
    ex2: 'X',
    ex3: 'WAI-ARIA, the Accessible Rich Internet Applications Suite, defines a way to make Web content and Web applications more accessible to people with disabilities.'
  };

  for (let [exId, ex] of Object.entries(pageExamples)) {

    const gridcellElements = await t.context.session.findElements(
      By.css(ex.gridcellSelector)
    );

    // Find the first focusable element
    let activeElement = await focusOnOrInCell(t, gridcellElements[0], ex.focusableElements[0]);
    if (!activeElement) {
      throw new Error('Could not focus on element or any decendent in the first gridcell: ' + ex.gridcellSelector);
    }

    // Test focus to last element in row using key END
    await activeElement.sendKeys(Key.END);
    activeElement = await t.context.session.executeScript(() => {
      return document.activeElement;
    });

    t.is(
      await activeElement.getText(),
      lastElementInFirstRowText[exId],
      'Example ' + exId + ': END should move focus to last element in the row'
    );
  }
});

ariaTest('control+home keys moves focus', 'grid/LayoutGrids.html', 'key-control-home', async (t) => {
  t.plan(3);

  const firstElementInFirstRowText = {
    ex1: 'ARIA 1.1 Specification',
    ex2: 'Recipient Name 1',
    ex3: 'WAI-ARIA Overview Web Accessibility Initiative W3C'
  };

  for (let [exId, ex] of Object.entries(pageExamples)) {

    const gridcellElements = await t.context.session.findElements(
      By.css(ex.gridcellSelector)
    );

    // Find the first focusable element
    let activeElement = await focusOnOrInCell(t, gridcellElements[0], ex.focusableElements[0]);
    if (!activeElement) {
      throw new Error('Could not focus on element or any decendent in the first gridcell: ' + ex.gridcellSelector);
    }

    // Move the focused element off the first element in the row
    await activeElement.sendKeys(Key.ARROW_RIGHT);
    activeElement = await t.context.session.executeScript(() => {
      return document.activeElement;
    });

    // Test focus to last element in row using key chord CONTROL+HOME
    await activeElement.sendKeys(Key.chord(Key.CONTROL, Key.HOME));
    activeElement = await t.context.session.executeScript(() => {
      return document.activeElement;
    });

    t.is(
      await activeElement.getText(),
      firstElementInFirstRowText[exId],
      'Example ' + exId + ': CONTROL+HOME should move focus to first element in the first row'
    );
  }
});


ariaTest('Control+end keys moves focus', 'grid/LayoutGrids.html', 'key-control-end', async (t) => {
  t.plan(3);

  const lastElementInFirstRowText = {
    ex1: 'SVG 2 Specification',
    ex2: 'X',
    ex3: 'Jan 3, 2014 - NVDA 2 supports all landmarks except it will not support navigation to “application”; Window Eyes as of V.7 does not support ARIA landmarks.'
  };

  for (let [exId, ex] of Object.entries(pageExamples)) {

    const gridcellElements = await t.context.session.findElements(
      By.css(ex.gridcellSelector)
    );

    // Find the first focusable element
    let activeElement = await focusOnOrInCell(t, gridcellElements[0], ex.focusableElements[0]);
    if (!activeElement) {
      throw new Error('Could not focus on element or any decendent in the first gridcell: ' + ex.gridcellSelector);
    }

    // Test focus to last element in row using key CONTROL+END
    await activeElement.sendKeys(Key.chord(Key.CONTROL, Key.END));
    activeElement = await t.context.session.executeScript(() => {
      return document.activeElement;
    });

    t.is(
      await activeElement.getText(),
      lastElementInFirstRowText[exId],
      'Example ' + exId + ': CONTROL+END should move focus to last element in the last row'
    );
  }
});

