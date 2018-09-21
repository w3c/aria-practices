'use strict';

const { ariaTest } = require('..');
const { By, Key } = require('selenium-webdriver');
const assertAttributeValues = require('../util/assertAttributeValues');
const assertAriaLabelExists = require('../util/assertAriaLabelExists');
const assertAriaLabelledby = require('../util/assertAriaLabelledby');
const assertAriaRoles = require('../util/assertAriaRoles');
const assertRovingTabindex = require('../util/assertRovingTabindex');

const exampleFile = 'toolbar/toolbar.html';

const ex = {
  toolbarSelector: '#ex1 [role="toolbar"]',
  toolbarLabel: 'Example Toolbar',
  toolSelector: '#ex1 [role="button"]',
  menuSelector: '#ex1 button',
  allToolSelectors: [
    '#ex1 [role="button"]:nth-of-type(1)',
    '#ex1 [role="button"]:nth-of-type(2)',
    '#ex1 [role="button"]:nth-of-type(3)',
    '#ex1 [role="button"]:nth-of-type(4)',
    '#ex1 [role="button"]:nth-of-type(5)',
    '#ex1 button'
  ],
  tabbaleItemBeforeToolbarSelector: '[href="../../#toolbar"]',
  tabbaleItemAfterToolbarSelector: '[href="../../#kbd_roving_tabindex"]'
};

const clickAndWait = async function (t, selector) {
  let element = await t.context.session.findElement(By.css(selector));
  await element.click();

  return await t.context.session.wait(
    async function () {
      let tabindex = await element.getAttribute('tabindex');
      return tabindex === '0';
    },
    t.context.waitTime,
    'Timeout waiting for click to set tabindex="0" on: ' + selector
  ).catch((err) => { return err; });
};

const waitAndCheckFocus = async function (t, selector) {
  return t.context.session.wait(
    async function () {
      return t.context.session.executeScript(function () {
        const [selector, index] = arguments;
        let item = document.querySelector(selector);
        return item === document.activeElement;
      }, selector);
    },
    t.context.waitTime,
    'Timeout waiting for activeElement to become: ' + selector,
  ).catch((err) => { return err; });
};

const waitAndCheckTabindex = async function (t, selector) {
  return t.context.session.wait(
    async function () {
      let item = await t.context.session.findElement(By.css(selector));
      return (await item.getAttribute('tabindex')) === '0';
    },
    600,
    'Timeout waiting for tabindex to set to "0" for: ' + selector
  ).catch((err) => { return err; });
};

// Attributes

ariaTest('role="toolbar" element', exampleFile, 'toolbar-role', async (t) => {
  t.plan(1);
  await assertAriaRoles(t, 'ex1', 'toolbar', '1', 'div');
});

// Test fails from bug in example: fix in issue 847 on w3c/aria-practices

// ariaTest('"aria-label" on toolbar element', exampleFile, 'toolbar-aria-label', async (t) => {
//   t.plan(1);
//   await assertAriaLabelExists(t, ex.toolbarSelector);
// });

ariaTest('role="button elements', exampleFile, 'button-role', async (t) => {
  t.plan(1);
  await assertAriaRoles(t, 'ex1', 'button', '5', 'div');
});

ariaTest('roving tabindex on button elements', exampleFile, 'button-tabindex', async (t) => {
  t.plan(3);

  // Test all the role="button" elements with roving tab index
  await assertRovingTabindex(t, ex.toolSelector, Key.ARROW_RIGHT);

  // Test the last element in the toolbox, which is a native "button" element
  await clickAndWait(t, ex.menuSelector);

  await assertAttributeValues(t, ex.toolSelector, 'tabindex', '-1');
  await assertAttributeValues(t, ex.menuSelector, 'tabindex', '0');
});

// Test pending fix bug in example: fix in issue 847 on w3c/aria-practices

// ariaTest('"aria-disabled" on button elements', exampleFile, 'button-aria-disabled', async (t) => {
//   t.pass();
// });


// Keys

ariaTest('key TAB moves focus', exampleFile, 'key-tab', async (t) => {
  t.plan(6);

  let numTools = ex.allToolSelectors.length;

  for (let index = 0; index < numTools; index++) {
    let toolSelector = ex.allToolSelectors[index];

    // Click on element to set focus
    await clickAndWait(t, toolSelector);

    // Send tab key to element
    await t.context.session.findElement(By.css(toolSelector))
      .sendKeys(Key.TAB);

    t.true(
      await waitAndCheckFocus(t, ex.tabbaleItemAfterToolbarSelector, index),
      'Sending TAB to: ' + toolSelector + ' should move focus off toolbar'
    );
  }
});

// The following tests fail from bug in example: fix in issue 847 on w3c/aria-practices

// ariaTest('key LEFT ARROW moves focus', exampleFile, 'key-left-arrow', async (t) => {
//   t.plan(12);

//   // Put focus on the first item in the list
//   await clickAndWait(t, ex.allToolSelectors[0]);

//   let numTools = ex.allToolSelectors.length;
//   let toolSelector = ex.allToolSelectors[0];
//   let nextToolSelector = ex.allToolSelectors[numTools - 1];

//   // Send ARROW LEFT key to the first item
//   await t.context.session.findElement(By.css(toolSelector))
//     .sendKeys(Key.ARROW_LEFT);

//   // Focus should now be on last item
//   t.true(
//     await waitAndCheckFocus(t, nextToolSelector),
//     'Sending ARROW_RIGHT to tool "' + toolSelector + '" should move focus to "' +
//       nextToolSelector + '"'
//   );

//   t.true(
//     await waitAndCheckTabindex(t, nextToolSelector),
//     'Sending ARROW_RIGHT to tool "' + toolSelector + '" should set tabindex on "' +
//       nextToolSelector + '"'
//   );


//   // Confirm right arrow moves focus to the previous item
//   for (let index = numTools - 1; index > 0; index--) {
//     let toolSelector = ex.allToolSelectors[index];
//     let nextToolSelector = ex.allToolSelectors[index + 1];

//     // Send ARROW LEFT key
//     await t.context.session.findElement(By.css(toolSelector))
//       .sendKeys(Key.ARROW_LEFT);

//     t.true(
//       await waitAndCheckFocus(t, nextToolSelector),
//       'Sending ARROW_RIGHT to tool "' + toolSelector + '" should move focus to "' +
//         nextToolSelector + '"'
//     );

//     t.true(
//       await waitAndCheckTabindex(t, nextToolSelector),
//       'Sending ARROW_RIGHT to tool "' + toolSelector + '" should set tabindex on "' +
//         nextToolSelector + '"'
//     );
//   }

// });

// ariaTest('key RIGHT ARROW moves focus', exampleFile, 'key-right-arrow', async (t) => {
//   t.plan(12);

//   // Put focus on the first item in the list
//   await clickAndWait(t, ex.allToolSelectors[0]);

//   let numTools = ex.allToolSelectors.length;

//   // Confirm right arrow moves focus to the next item
//   for (let index = 0; index < numTools - 1; index++) {
//     let toolSelector = ex.allToolSelectors[index];
//     let nextToolSelector = ex.allToolSelectors[index + 1];

//     // Send ARROW RIGHT key
//     await t.context.session.findElement(By.css(toolSelector))
//       .sendKeys(Key.ARROW_RIGHT);

//     t.true(
//       await waitAndCheckFocus(t, nextToolSelector),
//       'Sending ARROW_RIGHT to tool "' + toolSelector + '" should move focus to "' +
//         nextToolSelector + '"'
//     );

//     t.true(
//       await waitAndCheckTabindex(t, nextToolSelector),
//       'Sending ARROW_RIGHT to tool "' + toolSelector + '" should set tabindex on "' +
//         nextToolSelector + '"'
//     );
//   }

//   let toolSelector = ex.allToolSelectors[numTools - 1];
//   let nextToolSelector = ex.allToolSelectors[0];

//   // Send ARROW RIGHT key to the last item
//   await t.context.session.findElement(By.css(toolSelector))
//     .sendKeys(Key.ARROW_RIGHT);

//   // Focus should now be on first item
//   t.true(
//     await waitAndCheckFocus(t, nextToolSelector),
//     'Sending ARROW_RIGHT to tool "' + toolSelector + '" should move focus to "' +
//       nextToolSelector + '"'
//   );

//   t.true(
//     await waitAndCheckTabindex(t, nextToolSelector),
//     'Sending ARROW_RIGHT to tool "' + toolSelector + '" should set tabindex on "' +
//       nextToolSelector + '"'
//   );
// });

// ariaTest('key HOME moves focus', exampleFile, 'key-home', async (t) => {
//   t.plan(6);

//   let numTools = ex.allToolSelectors.length;

//   // Confirm right moves HOME focus to first item
//   for (let index = 0; index < numTools - 1; index++) {
//     let toolSelector = ex.allToolSelectors[index];

//     // Click on element to focus
//     await clickAndWait(t, toolSelector);

//     // Send HOME key to the last item
//     await t.context.session.findElement(By.css(toolSelector))
//       .sendKeys(Key.HOME);

//     t.true(
//       await waitAndCheckFocus(t, ex.allToolSelectors[0], index),
//       'Sending HOME to tool "' + toolSelector + '" should move focus to first tool'
//     );
//   }
// });

// ariaTest('key END moves focus', exampleFile, 'key-end', async (t) => {
//   t.plan(6)

//   let numTools = ex.allToolSelectors.length;

//   // Confirm right moves HOME focus to first item
//   for (let index = 0; index < numTools - 1; index++) {
//     let toolSelector = ex.allToolSelectors[index];

//     // Click on element to focus
//     await clickAndWait(t, toolSelector);

//     // Send HOME key to the last item
//     await t.context.session.findElement(By.css(toolSelector))
//       .sendKeys(Key.HOME);

//     t.true(
//       await waitAndCheckFocus(t, ex.allToolSelectors[0], index),
//       'Sending HOME to tool "' + toolSelector + '" should move focus to first tool'
//     );
//   }
// });
