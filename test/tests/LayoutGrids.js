'use strict';

const { ariaTest } = require('..');


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

const checkActiveElement = function(/* gridcellsSelector, index */) {
  let gridcellsSelector = arguments[0];
  let index = arguments[1];
  let gridcells = document.querySelectorAll(gridcellsSelector);
  let gridcell = gridcells[index];
  return (document.activeElement === gridcell) || gridcell.contains(document.activeElement);
};

const findAndFocus = function(/* element */) {
  // Assumption: element is focusable or contains only one focusable element.
  let element = arguments[0];
  let candidates = [element, ...element.querySelectorAll('*')];
  for (let candidate of candidates) {
    candidate.focus();
    if (document.activeElement === candidate) {
      return candidate;
    }
  }
}

ariaTest('Right arrow key moves focus',
         'grid/LayoutGrids.html', 'key-right-arrow', async (t) => {

  t.plan(67);

  for (let exId in pageExamples) {
    let ex = pageExamples[exId];
    let gridcellsSelector = ex.gridSelector + ' [role="gridcell"]';
    let gridcellElements = await t.context.session.findElements(
      t.context.By.css(gridcellsSelector)
    );

    // Find the first focusable element
    let activeElement = await t.context.session.executeScript(findAndFocus, gridcellElements[0]);
    if (!activeElement) {
      throw new Error("Could not focus on element or any decendent in the first gridcell: " + gridcellsSelector);
    }

    // Test focus moves to next element on arrow key

    for (let index = 1; index < gridcellElements.length; index++) {

      await activeElement.sendKeys(t.context.Key.ARROW_RIGHT);
      let correctActiveElement = await t.context.session.executeScript(checkActiveElement, gridcellsSelector, index);

      t.truthy(
        correctActiveElement,
        'Example ' + exId + ': gridcell ' + index + ' should receive focus after arrow right'
      );

      activeElement = await t.context.session.executeScript(() => {
        return document.activeElement;
      });
    }

    // Test arrow key on final element

    await activeElement.sendKeys(t.context.Key.ARROW_RIGHT);
    let correctActiveElement = await t.context.session.executeScript(checkActiveElement, gridcellsSelector, gridcellElements.length-1);
    t.truthy(
      correctActiveElement,
      'Example ' + exId + ': Right Arrow sent to final gridcell should not move focus.'
    );
  }
});

ariaTest('Left arrow key moves focus', 'grid/LayoutGrids.html', 'key-left-arrow', async (t) => {

  t.plan(22);

  for (let exId in pageExamples) {
    let ex = pageExamples[exId];
    let gridcellsSelector = ex.gridSelector + ' [role="gridcell"]';
    let allGridcellElements = await t.context.session.findElements(
      t.context.By.css(gridcellsSelector)
    );

    // Not all gridcell elements are initially visible. First find all focusable elements.

    let gridcellElements = [];
    for (let el of allGridcellElements) {
      if (!await t.context.session.executeScript(findAndFocus, el)) {
        break;
      }
      gridcellElements.push(el);
    }

    let activeElement = await t.context.session.executeScript(function () {
      return document.activeElement;
    });
    if (!activeElement) {
      throw new Error("Could not focus on element or any decendent in the final gridcell: " + gridcellsSelector);
    }

    // Test focus moves to next element on arrow key
    for (let index = gridcellElements.length - 1; index > 0; index--) {
      await activeElement.sendKeys(t.context.Key.ARROW_LEFT);
      let correctActiveElement = await t.context.session.executeScript(checkActiveElement, gridcellsSelector, index);

      t.truthy(
        correctActiveElement,
        'Example ' + exId + ': gridcell ' + index + ' should receive focus after arrow left'
      );

      activeElement = await t.context.session.executeScript(() => {
        return document.activeElement;
      });
    }

    // Test arrow key on final element

    await activeElement.sendKeys(t.context.Key.ARROW_LEFT);
    let correctActiveElement = await t.context.session.executeScript(checkActiveElement, gridcellsSelector, 0);
    t.truthy(
      correctActiveElement,
      'Example ' + exId + ': Left Arrow sent to first gridcell should not move focus. Focus is on element'
    );
  }

});

// ariaTest('grid/LayoutGrids.html', 'key-down-arrow', async (t) => {
//   await new Promise((resolve) => setTimeout(resolve, 10));
//   t.pass();
// });

// ariaTest('grid/LayoutGrids.html', 'key-up-arrow', async (t) => {
//   await new Promise((resolve) => setTimeout(resolve, 10));
//   t.pass();
// });

// ariaTest('grid/LayoutGrids.html', 'key-page-down', async (t) => {
//   await new Promise((resolve) => setTimeout(resolve, 10));
//   t.pass();
// });

// ariaTest('grid/LayoutGrids.html', 'key-page-up', async (t) => {
//   await new Promise((resolve) => setTimeout(resolve, 10));
//   t.pass();
// });

// ariaTest('grid/LayoutGrids.html', 'key-home', async (t) => {
//   await new Promise((resolve) => setTimeout(resolve, 10));
//   t.pass();
// });

// ariaTest('grid/LayoutGrids.html', 'key-end', async (t) => {
//   await new Promise((resolve) => setTimeout(resolve, 10));
//   t.pass();
// });

// ariaTest('grid/LayoutGrids.html', 'key-control-home', async (t) => {
//   await new Promise((resolve) => setTimeout(resolve, 10));
//   t.pass();
// });

// ariaTest('grid/LayoutGrids.html', 'key-control-end', async (t) => {
//   await new Promise((resolve) => setTimeout(resolve, 10));
//   t.pass();
// });
