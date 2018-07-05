'use strict';

const { ariaTest } = require('..');
const { By } = require('selenium-webdriver');

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

const checkActiveElement = function(/* gridcellsSelector, index */) {
  let gridcellsSelector = arguments[0];
  let index = arguments[1];
  let gridcells = document.querySelectorAll(gridcellsSelector);
  let gridcell = gridcells[index];
  return (document.activeElement === gridcell) || gridcell.contains(document.activeElement);
};

const findFocusable = function(/* selector */) {
  const selector = arguments[0];
  const original = document.activeElement;
  const focusable = Array.from(document.querySelectorAll(selector))
      .map((parent) => {
        const candidates = [parent, ...parent.querySelectorAll('*')];
        for (let candidate of candidates) {

          candidate.focus();
          if (document.activeElement === candidate) {
            return candidate;
          }
        }
      }).filter((el) => !!el);;

  original.focus();

  return focusable;
};

const focusWithin = function(/* element */) {
  // Assumption: `element is` focusable or contains only one focusable element.
  let element = arguments[0];
  let candidates = [element, ...element.querySelectorAll('*')];

  for (let candidate of candidates) {
    candidate.focus();

    if (document.activeElement === candidate) {
      return candidate;
    }
  }
};

let pageExamples = {
  'ex1': {
    gridSelector: '#ex1 [role="grid"]'
  },
  'ex2': {
    gridSelector: '#ex2 [role="grid"]'
  },
  'ex3': {
    gridSelector: '#ex3 [role="grid"]'
  }
};

// Attributes

ariaTest('Test "role=grid" attribute exists',
         'grid/LayoutGrids.html', 'grid-role', async (t) => {

  t.plan(3);

  for (let exId in pageExamples) {
    let ex = pageExamples[exId];
    let gridLocator = t.context.By.css(ex.gridSelector);

    t.is(
      (await t.context.session.findElements(gridLocator)).length,
      1,
      'One "role=grid" element should be found by selector: ' + ex.gridSelector
    );
  }
});

ariaTest('Test "aria-labelledby" attribute exists',
         'grid/LayoutGrids.html', 'aria-labelledby', async (t) => {

  t.plan(6);

  for (let exId in pageExamples) {
    let ex = pageExamples[exId];
    let gridLocator = t.context.By.css(ex.gridSelector);
    let labelId = await t.context.session
        .findElement(gridLocator)
        .getAttribute('aria-labelledby');

    t.truthy(
      labelId,
      '"aria-labelledby" attribute should exist on element selected by: ' + ex.gridSelector
    );

    let exLocator = t.context.By.id(exId);
    let labelLocator = t.context.By.id(labelId);
    let labelElement = await t.context.session
        .findElement(exLocator)
        .findElement(labelLocator);

    t.truthy(
      await labelElement.getText(),
      'Element with id "' + labelId + '" should contain text that labels the grid'
    );
  }
});

ariaTest('Test "aria-rowcount" attribute exists',
         'grid/LayoutGrids.html', 'aria-rowcount', async (t) => {

  t.plan(2);

  // This test only applies to example 3
  let gridSelector = '#ex3 [role="grid"]'
  let gridLocator = t.context.By.css(gridSelector);
  let rowCount = await t.context.session
      .findElement(gridLocator)
      .getAttribute('aria-rowcount');

  t.truthy(
    rowCount,
    '"aria-rowcount" attribute should exist on element selected by: ' + gridSelector
  );

  let rowLocator = t.context.By.css('[role="row"]');
  let rowElements = await t.context.session
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
    let ex = pageExamples[exId];

    let gridLocator = t.context.By.css(ex.gridSelector);
    let rowLocator = t.context.By.css('div[role="row"]');
    let rowElements = await t.context.session
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
  let exId = 'ex3';
  let gridSelector = '#ex3 [role="grid"]';
  let gridLocator = t.context.By.css(gridSelector);

  let rowLocator = t.context.By.css('[role="row"]');
  let rowElements = await t.context.session
      .findElement(gridLocator)
      .findElements(rowLocator);

  for (let i = 0; i < rowElements.length; i++) {
    let value = (i+1).toString();
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
    let ex = pageExamples[exId];
    let gridLocator = t.context.By.css(ex.gridSelector);

    let gridcellLocator = t.context.By.css('[role="gridcell"]');
    let gridcellElements = await t.context.session
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

  // TODO: Wait on script load -- answer q: how to decide widget is initialized?
  await new Promise((resolve) => setTimeout(resolve, 100));

  // This test ASSUMES the grid/LayoutGrids example widgets use on the following two
  // types of focusable widgets within gridcells
  let focusableWidget = [
    t.context.By.css('a'),
    t.context.By.css('[role="button"]')
  ];

  for (let exId in pageExamples) {
    let ex = pageExamples[exId];
    let gridLocator = t.context.By.css(ex.gridSelector);

    let gridcellLocator = t.context.By.css('[role="gridcell"]');
    let gridcellElements = await t.context.session
        .findElement(gridLocator)
        .findElements(gridcellLocator);

    for (let el = 0; el < gridcellElements.length; el++) {
      let elementTabindex = await (await gridcellElements[el]).getAttribute('tabindex');

      // The first gridcell element will have tabindex=0
      let tabindex = el ? '-1' : '0';

      // If attribute "tabindex" has been set, there must be no focusable widgets within the
      // gridcell div or span
      if (elementTabindex != null) {

        t.is(
          elementTabindex,
          tabindex,
          '"[role=gridcell]" should have tabindex="-1": ' + ex.gridSelector
        );

        // Look for a focusable widget
        let focusableEl = await gridcellElements[el].findElement(focusableWidget[0]).catch(() => {})
            || await gridcellElements[el].findElement(focusableWidget[1]).catch(() => {});

        t.falsy(
          focusableEl,
          '"[role=gridcell]" with tabindex="-1" should not contain focusable widgets: ' + ex.gridSelector
        );
      }

      // If attribute "tabindex" has not been set, there must be a focusable widgets
      // within the gridcell div or span with tabindex appropriately set
      else {

        // Find the focusable widget
        let widgetElement = await gridcellElements[el].findElement(focusableWidget[0]).catch(() => {})
          || await gridcellElements[el].findElement(focusableWidget[1]).catch(() => {});

        t.truthy(
          widgetElement,
          '["role=gridcell]" without tabindex set must contain a focusable widget: ' + ex.gridSelector
        );

        t.is(
          await widgetElement.getAttribute('tabindex'),
          tabindex,
          'Widget within element "[role=gridcell]" must have tabindex set in example: ' + ex.gridSelector
        );
      }
    }
  }
});


// Keys

ariaTest('Right arrow key moves focus', 'grid/LayoutGrids.html', 'key-right-arrow', async (t) => {
  t.plan(67);

  const cellSelectors = {
    ex1: '#ex1 [role="gridcell"]',
    ex2: '#ex2 [role="row"] [role="gridcell"]',
    ex3: '#ex3 [role="row"] [role="gridcell"]'
  };

  for (let [exId, selector] of Object.entries(cellSelectors)) {
    let gridcellElements = await t.context.session.findElements(
      t.context.By.css(selector)
    );

    // Find the first focusable element
    let activeElement = await t.context.session.executeScript(focusWithin, gridcellElements[0]);
    if (!activeElement) {
      throw new Error('Could not focus on element or any decendent in the first gridcell: ' + selector);
    }

    // Test focus moves to next element on arrow key

    for (let index = 1; index < gridcellElements.length; index++) {

      await activeElement.sendKeys(t.context.Key.ARROW_RIGHT);
      let correctActiveElement = await t.context.session.executeScript(checkActiveElement, selector, index);

      t.truthy(
        correctActiveElement,
        'Example ' + exId + ': gridcell `' + (await gridcellElements[index].getText()) + '` should receive focus after arrow right'
      );

      activeElement = await t.context.session.executeScript(() => {
        return document.activeElement;
      });
    }

    // Test arrow key on final element

    await activeElement.sendKeys(t.context.Key.ARROW_RIGHT);
    let correctActiveElement = await t.context.session.executeScript(checkActiveElement, selector, gridcellElements.length-1);
    t.truthy(
      correctActiveElement,
      'Example ' + exId + ': Right Arrow sent to final gridcell should not move focus.'
    );
  }
});

ariaTest('Left arrow key moves focus', 'grid/LayoutGrids.html', 'key-left-arrow', async (t) => {
  t.plan(25);

  const cellSelectors = {
    ex1: '#ex1 [role="gridcell"]',
    ex2: '#ex2 [role="row"] [role="gridcell"]',
    ex3: '#ex3 [role="row"] [role="gridcell"]'
  };

  for (let [exId, selector] of Object.entries(cellSelectors)) {
    let gridcellElements = await t.context.session.executeScript(findFocusable, selector);

    // Find the first focusable element
    let activeElement = await t.context.session.executeScript(focusWithin, gridcellElements[gridcellElements.length - 1]);
    if (!activeElement) {
      throw new Error('Could not focus on element or any decendent in the first gridcell: ' + selector);
    }

    // Test focus moves to next element on arrow key

    for (let index = gridcellElements.length - 2; index > -1; index--) {

      await activeElement.sendKeys(t.context.Key.ARROW_LEFT);
      let correctActiveElement = await t.context.session.executeScript(checkActiveElement, selector, index);

      t.truthy(
        correctActiveElement,
        'Example ' + exId + ': gridcell `' + (await gridcellElements[index].getText()) + '` should receive focus after arrow left'
      );

      activeElement = await t.context.session.executeScript(() => {
        return document.activeElement;
      });
    }

    // Test arrow key on final element

    await activeElement.sendKeys(t.context.Key.ARROW_LEFT);
    let correctActiveElement = await t.context.session.executeScript(checkActiveElement, selector, 0);
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
    let gridcellElements = await t.context.session.findElements(
      t.context.By.css(selector)
    );

    // Find the first focusable element
    let activeElement = await t.context.session.executeScript(focusWithin, gridcellElements[0]);
    if (!activeElement) {
      throw new Error('Could not focus on element or any decendent in the first gridcell: ' + selector);
    }

    // Test focus moves to next element on arrow key

    for (let index = 1; index < gridcellElements.length; index++) {

      await activeElement.sendKeys(t.context.Key.ARROW_DOWN);
      let correctActiveElement = await t.context.session.executeScript(checkActiveElement, selector, index);

      t.truthy(
        correctActiveElement,
        'Example ' + exId + ': gridcell `' + (await gridcellElements[index].getText()) + '` should receive focus after arrow down'
      );

      activeElement = await t.context.session.executeScript(() => {
        return document.activeElement;
      });
    }

    // Test arrow key on final element

    await activeElement.sendKeys(t.context.Key.ARROW_DOWN);
    let correctActiveElement = await t.context.session.executeScript(checkActiveElement, selector, gridcellElements.length-1);
    t.truthy(
      correctActiveElement,
      'Example ' + exId + ': Down Arrow sent to final gridcell should not move focus.'
    );
  }
});

ariaTest('Up arrow key moves focus', 'grid/LayoutGrids.html', 'key-up-arrow', async (t) => {
  t.plan(13);

  const cellSelectors = {
    ex1: '#ex1 [role="gridcell"]',
    ex2: '#ex2 [role="row"] [role="gridcell"]:first-of-type',
    ex3: '#ex3 [role="row"] [role="gridcell"]:first-child'
  };

  for (let [exId, selector] of Object.entries(cellSelectors)) {
    let gridcellElements = await t.context.session.executeScript(findFocusable, selector);

    // Find the first focusable element
    let activeElement = await t.context.session.executeScript(focusWithin, gridcellElements[gridcellElements.length - 1]);
    if (!activeElement) {
      throw new Error('Could not focus on element or any decendent in the first gridcell: ' + selector);
    }

    // Test focus moves to next element on arrow key

    for (let index = gridcellElements.length - 2; index > -1; index--) {

      await activeElement.sendKeys(t.context.Key.ARROW_UP);
      let correctActiveElement = await t.context.session.executeScript(checkActiveElement, selector, index);

      t.truthy(
        correctActiveElement,
        'Example ' + exId + ': gridcell `' + (await gridcellElements[index].getText()) + '` should receive focus after arrow up'
      );

      activeElement = await t.context.session.executeScript(() => {
        return document.activeElement;
      });
    }

    // Test arrow key on final element

    await activeElement.sendKeys(t.context.Key.ARROW_UP);
    let correctActiveElement = await t.context.session.executeScript(checkActiveElement, selector, 0);
    t.truthy(
      correctActiveElement,
      'Example ' + exId + ': Up Arrow sent to fist gridcell should not move focus.'
    );
  }
});

ariaTest('PageDown key moves focus', 'grid/LayoutGrids.html', 'key-page-down', async (t) => {
  t.plan(12);

  const cellSelectors = {
    first: '#ex3 [role="row"] [role="gridcell"]:nth-child(1)',
    second: '#ex3 [role="row"] [role="gridcell"]:nth-child(2)',
    third: '#ex3 [role="row"] [role="gridcell"]:nth-child(3)'
  };
  const jumpBy = 5;

  for (let [initialCell, selector] of Object.entries(cellSelectors)) {
    await reload(t.context.session);

    let finalIndex;
    let gridcellElements = (await t.context.session.findElements(
      t.context.By.css(selector)
    ));

    // Find the first focusable element
    let activeElement = await t.context.session.executeScript(focusWithin, gridcellElements[0]);
    if (!activeElement) {
      throw new Error('Could not focus on element or any decendent in the first gridcell: ' + selector);
    }

    // Test focus moves to next element on paging key

    for (let index = jumpBy; index < gridcellElements.length; index += jumpBy) {
      await activeElement.sendKeys(t.context.Key.PAGE_DOWN);
      let correctActiveElement = await t.context.session.executeScript(checkActiveElement, selector, index);

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

    await activeElement.sendKeys(t.context.Key.PAGE_DOWN);
    let correctActiveElement = await t.context.session.executeScript(checkActiveElement, selector, finalIndex);
    t.truthy(
      correctActiveElement,
      initialCell + ' cell in row: Page Down sent to final gridcell should not move focus.'
    );
  }
});

ariaTest('PageUp key moves focus', 'grid/LayoutGrids.html', 'key-page-up', async (t) => {
  t.plan(12);

  const cellSelectors = {
    first: '#ex3 [role="row"] [role="gridcell"]:nth-child(1)',
    second: '#ex3 [role="row"] [role="gridcell"]:nth-child(2)',
    third: '#ex3 [role="row"] [role="gridcell"]:nth-child(3)'
  };
  const jumpBy = 5;

  for (let [initialCell, selector] of Object.entries(cellSelectors)) {
    await reload(t.context.session);
    // This test depends on the "page down" button which is not specified by
    // the widget's description. It does this to avoid relying on behaviors
    // that are tested elsewhere.
    await clickUntilDisabled(t.context.session, '#ex3_pagedown_button');

    let finalIndex;
    let gridcellElements = (await t.context.session.findElements(
      t.context.By.css(selector)
    ));

    // Find the first focusable element
    let activeElement = await t.context.session.executeScript(focusWithin, gridcellElements[gridcellElements.length - 1]);
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
      await activeElement.sendKeys(t.context.Key.PAGE_UP);
      let correctActiveElement = await t.context.session.executeScript(checkActiveElement, selector, index);

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

    await activeElement.sendKeys(t.context.Key.PAGE_UP);
    let correctActiveElement = await t.context.session.executeScript(checkActiveElement, selector, finalIndex);
    t.truthy(
      correctActiveElement,
      initialCell + ' cell in row: Page Up sent to first gridcell should not move focus.'
    );
  }
});
