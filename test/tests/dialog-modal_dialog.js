const { ariaTest } = require('..');
const { By, Key } = require('selenium-webdriver');
const assertAttributeValues = require('../util/assertAttributeValues');
const assertAriaLabelledby = require('../util/assertAriaLabelledby');
const assertAriaDescribedby = require('../util/assertAriaDescribedby');
const assert = require('assert');

const exampleFile = 'dialog-modal/dialog.html';

const ex = {
  dialogSelector: '[role="dialog"]',
  dialog1Selector: '#dialog1',
  dialog2Selector: '#dialog2',
  dialog3Selector: '#dialog3',
  dialog4Selector: '#dialog4',
  dialogsWithDescribedbySelector:
    '#dialog2[role="dialog"],#dialog3[role="dialog"],#dialog4[role="dialog"]',
  dialog1ButtonSelector: '#ex1 button',
  dialog2FromDialog1ButtonSelector:
    '#dialog1 .dialog_form_actions button:nth-child(1)',
  dialog3FromDialog1ButtonSelector:
    '#dialog1 .dialog_form_actions button:nth-child(2)',
  dialog4FromDialog2ButtonSelector:
    '#dialog2 .dialog_form_actions button:nth-child(2)',
  dialog1FocusableEls: [
    '#dialog1 .dialog_form_item:nth-child(1) input',
    '#dialog1 .dialog_form_item:nth-child(2) input',
    '#dialog1 .dialog_form_item:nth-child(3) input',
    '#dialog1 .dialog_form_item:nth-child(4) input',
    '#dialog1 .dialog_form_item:nth-child(5) input',
    '#dialog1 button:nth-child(1)',
    '#dialog1 button:nth-child(2)',
    '#dialog1 button:nth-child(3)',
  ],
  dialog2FocusableEls: [
    '#dialog2 a',
    '#dialog2 button:nth-child(2)',
    '#dialog2 button:nth-child(3)',
  ],
  dialog3FocusableEls: ['#dialog3 button', '#dialog3 a'],
  dialog4FocusableEls: ['#dialog4 button'],
  dialog2FirstFocusedEl: '#dialog2_para1',
};

const openDialog1 = async function (t) {
  // Click the button to open the address form dialog
  await t.context.session.findElement(By.css(ex.dialog1ButtonSelector)).click();

  // Make sure the appropriate dialog is open
  const dialog = await t.context.session.findElement(By.css('#dialog1'));
  assert(await dialog.isDisplayed(), 'dialog1 should have successfully opened');
};

const openDialog2 = async function (t) {
  // Click the button to open the "address form" dialog
  await t.context.session.findElement(By.css(ex.dialog1ButtonSelector)).click();

  // Click the button to open the "verify form" dialog
  await t.context.session
    .findElement(By.css(ex.dialog2FromDialog1ButtonSelector))
    .click();

  // Make sure the appropriate dialog is open
  const dialog = await t.context.session.findElement(By.css('#dialog2'));
  assert(await dialog.isDisplayed(), 'dialog2 should have successfully opened');
};

const openDialog3 = async function (t) {
  // Click the button to open the "address form" dialog
  await t.context.session.findElement(By.css(ex.dialog1ButtonSelector)).click();

  // Click the button to open the "add" dialog
  await t.context.session
    .findElement(By.css(ex.dialog3FromDialog1ButtonSelector))
    .click();

  // Make sure the appropriate dialog is open
  const dialog = await t.context.session.findElement(By.css('#dialog3'));
  assert(await dialog.isDisplayed(), 'dialog3 should have successfully opened');
};

const openDialog4 = async function (t) {
  // Click the button to open the "address form" dialog
  await t.context.session.findElement(By.css(ex.dialog1ButtonSelector)).click();

  // Click the button to open the "verify form" dialog
  await t.context.session
    .findElement(By.css(ex.dialog2FromDialog1ButtonSelector))
    .click();

  // Click the button to open the "accepting an alternative form" dialog
  await t.context.session
    .findElement(By.css(ex.dialog4FromDialog2ButtonSelector))
    .click();

  // Make sure the appropriate dialog is open
  const dialog = await t.context.session.findElement(By.css('#dialog2'));
  assert(await dialog.isDisplayed(), 'dialog4 should have successfully opened');
};

const reload = async (t) => {
  return t.context.session.get(t.context.url);
};

const checkFocus = async function (t, selector) {
  return t.context.session.wait(
    t.context.session.executeScript(function () {
      const [selector] = arguments;
      const items = document.querySelector(selector);
      return items === document.activeElement;
    }, selector),
    t.context.waitTime
  );
};

const sendTabToSelector = async function (t, selector) {
  let el = await t.context.session.findElement(By.css(selector));
  await el.sendKeys(Key.TAB);

  // await for focus change before returning
  await t.context.session.wait(
    async function () {
      return t.context.session.executeScript(function () {
        let selector = arguments[0];
        return document.activeElement !== document.querySelector(selector);
      }, selector);
    },
    t.context.waitTime,
    'Timeout waiting for focus to move after TAB sent to: ' + selector
  );
};

const sendShiftTabToSelector = async function (t, selector) {
  let el = await t.context.session.findElement(By.css(selector));
  await el.sendKeys(Key.chord(Key.SHIFT, Key.TAB));

  // await for focus change before returning
  await t.context.session.wait(
    async function () {
      return t.context.session.executeScript(function () {
        let selector = arguments[0];
        return document.activeElement !== document.querySelector(selector);
      }, selector);
    },
    t.context.waitTime,
    'Timeout waiting for focus to move after SHIFT TAB sent to: ' + selector
  );
};

const sendEscapeTo = async function (t, selector) {
  const el = await t.context.session.findElement(By.css(selector));
  await el.sendKeys(Key.ESCAPE);
};

// Attributes

ariaTest(
  'role="dialog" on div element',
  exampleFile,
  'dialog-role',
  async (t) => {
    const dialogs = await t.context.queryElements(t, ex.dialogSelector);

    t.is(
      dialogs.length,
      4,
      'Four role="dialog" elements should be found by selector: ' +
        ex.dialogSelector
    );

    for (let dialog of dialogs) {
      t.is(
        await dialog.getTagName(),
        'div',
        '"role=dialog" should be found on a "div" element'
      );
    }
  }
);

ariaTest(
  '"aria-labelledby" attribute on role="dialog"',
  exampleFile,
  'aria-labelledby',
  async (t) => {
    await assertAriaLabelledby(t, ex.dialogSelector);
  }
);

ariaTest('', exampleFile, 'aria-describedby', async (t) => {
  await assertAriaDescribedby(t, ex.dialogsWithDescribedbySelector);
});

ariaTest(
  '"aria-modal" attribute on role="dialog"',
  exampleFile,
  'aria-modal',
  async (t) => {
    await assertAttributeValues(t, ex.dialogSelector, 'aria-modal', 'true');
  }
);

// Keys

ariaTest(
  'tab changes focus within dialog',
  exampleFile,
  'key-tab',
  async (t) => {
    /* DIALOG 1 */

    await openDialog1(t);

    // Loop through the focusable elements (focus is on first focusable element on popup)
    for (let i = 0; i < ex.dialog1FocusableEls.length; i++) {
      t.true(
        await checkFocus(t, ex.dialog1FocusableEls[i]),
        'Focus should be on "' +
          ex.dialog1FocusableEls[i] +
          '" after ' +
          i +
          ' tabs have been sent to dialog 1'
      );

      await sendTabToSelector(t, ex.dialog1FocusableEls[i]);
    }

    // Check that the focus returns to the first focusable element
    let totalTabs = ex.dialog1FocusableEls.length;
    t.true(
      await checkFocus(t, ex.dialog1FocusableEls[0]),
      'Focus should be on "' +
        ex.dialog1FocusableEls[0] +
        '" after ' +
        totalTabs +
        ' tabs have been sent to dialog 1'
    );

    /* DIALOG 2 */

    await reload(t);
    await openDialog2(t);

    // Loop through the focusable elements
    // focus is not first focusable element on popup -- send tab to start
    await sendTabToSelector(t, ex.dialog2FirstFocusedEl);

    for (let i = 0; i < ex.dialog2FocusableEls.length; i++) {
      t.true(
        await checkFocus(t, ex.dialog2FocusableEls[i]),
        'Focus should be on "' +
          ex.dialog2FocusableEls[i] +
          '" after ' +
          (i + 1) +
          ' tabs have been sent to dialog 2'
      );

      await sendTabToSelector(t, ex.dialog2FocusableEls[i]);
    }

    // Check that the focus returns to the first focusable element
    totalTabs = ex.dialog2FocusableEls.length + 1;
    t.true(
      await checkFocus(t, ex.dialog2FocusableEls[0]),
      'Focus should be on "' +
        ex.dialog2FocusableEls[0] +
        '" after ' +
        totalTabs +
        ' tabs have been sent to dialog 1'
    );

    /* DIALOG 3 */

    await reload(t);
    await openDialog3(t);

    // Loop through the focusable elements
    for (let i = 0; i < ex.dialog3FocusableEls.length; i++) {
      t.true(
        await checkFocus(t, ex.dialog3FocusableEls[i]),
        'Focus should be on item "' +
          ex.dialog3FocusableEls[i] +
          '" after ' +
          (i + 1) +
          ' tabs have been sent to dialog 3'
      );

      await sendTabToSelector(t, ex.dialog3FocusableEls[i]);
    }

    // Check that the focus returns to the first focusable element
    totalTabs = ex.dialog3FocusableEls.length + 1;
    t.true(
      await checkFocus(t, ex.dialog3FocusableEls[0]),
      'Focus should be on "' +
        ex.dialog3FocusableEls[0] +
        '" after ' +
        totalTabs +
        ' tabs have been sent to dialog 3'
    );

    /* DIALOG 4 */

    await reload(t);
    await openDialog4(t);

    // There is only one button on dialog 4
    t.true(
      await checkFocus(t, ex.dialog4FocusableEls[0]),
      'Focus should be on item "' +
        ex.dialog4FocusableEls[0] +
        '" when dialog 4 is opened'
    );

    // Make focus does not change
    let el = await t.context.session.findElement(
      By.css(ex.dialog4FocusableEls[0])
    );
    await el.sendKeys(Key.TAB);
    t.true(
      await checkFocus(t, ex.dialog4FocusableEls[0]),
      'Focus should remain on: "' +
        ex.dialog4FocusableEls[0] +
        '" after tabs in dialog 4'
    );
  }
);

ariaTest(
  'shift tab changes focus within dialog',
  exampleFile,
  'key-shift-tab',
  async (t) => {
    /* DIALOG 1 */

    await openDialog1(t);

    // Loop through the focusable elements backwards (focus is on first focusable element on popup)
    await sendShiftTabToSelector(t, ex.dialog1FocusableEls[0]);
    let shiftTabCount = 1;

    for (let i = ex.dialog1FocusableEls.length - 1; i >= 0; i--) {
      t.true(
        await checkFocus(t, ex.dialog1FocusableEls[i]),
        'Focus should be on item "' +
          ex.dialog1FocusableEls[i] +
          '" after ' +
          shiftTabCount +
          ' shift tabs have been sent to dialog 1'
      );

      await sendShiftTabToSelector(t, ex.dialog1FocusableEls[i]);
      shiftTabCount++;
    }

    // Check that the focus returns to the last focusable element
    let totalTabs = ex.dialog1FocusableEls.length + 1;
    let lastIndex = ex.dialog1FocusableEls.length - 1;
    t.true(
      await checkFocus(t, ex.dialog1FocusableEls[lastIndex]),
      'Focus should be on "' +
        ex.dialog1FocusableEls[lastIndex] +
        '" after ' +
        totalTabs +
        ' tabs have been sent to dialog 1'
    );

    /* DIALOG 2 */

    await reload(t);
    await openDialog2(t);

    // Set up:
    // First, focus will be on a div, send SHIFT+TAB
    await sendShiftTabToSelector(t, ex.dialog2FirstFocusedEl);
    // Second, focus will be on the first focusable element second, send SHIFT+TAB
    await sendShiftTabToSelector(t, ex.dialog2FocusableEls[0]);

    shiftTabCount = 2;

    // Loop through all focusable elements backward
    for (let i = ex.dialog2FocusableEls.length - 1; i >= 0; i--) {
      t.true(
        await checkFocus(t, ex.dialog2FocusableEls[i]),
        'Focus should be on item "' +
          ex.dialog2FocusableEls[i] +
          '" after ' +
          shiftTabCount +
          ' shift tabs have been sent to dialog 2'
      );
      await sendShiftTabToSelector(t, ex.dialog2FocusableEls[i]);
      shiftTabCount++;
    }

    // Check that the focus returns to the last focusable element
    totalTabs = ex.dialog2FocusableEls.length + 2;
    lastIndex = ex.dialog2FocusableEls.length - 1;
    t.true(
      await checkFocus(t, ex.dialog2FocusableEls[lastIndex]),
      'Focus should be on "' +
        ex.dialog2FocusableEls[lastIndex] +
        '" after ' +
        totalTabs +
        ' tabs have been sent to dialog 1'
    );

    /* DIALOG 3 */

    await reload(t);
    await openDialog3(t);

    // Loop through the focusable elements backwards (focus is on first focusable element on popup)
    await sendShiftTabToSelector(t, ex.dialog3FocusableEls[0]);
    shiftTabCount = 1;

    for (let i = ex.dialog3FocusableEls.length - 1; i >= 0; i--) {
      t.true(
        await checkFocus(t, ex.dialog3FocusableEls[i]),
        'Focus should be on item "' +
          ex.dialog3FocusableEls[i] +
          '" after ' +
          shiftTabCount +
          ' shift tabs have been sent to dialog 3'
      );

      await sendShiftTabToSelector(t, ex.dialog3FocusableEls[i]);
      shiftTabCount++;
    }

    // Check that the focus returns to the first focusable element
    totalTabs = ex.dialog3FocusableEls.length + 1;
    lastIndex = ex.dialog3FocusableEls.length - 1;
    t.true(
      await checkFocus(t, ex.dialog3FocusableEls[lastIndex]),
      'Focus should be on "' +
        ex.dialog3FocusableEls[lastIndex] +
        '" after ' +
        totalTabs +
        ' tabs have been sent to dialog 3'
    );

    /* DIALOG 4 */

    await reload(t);
    await openDialog4(t);

    // There is only one button on dialog 4
    t.true(
      await checkFocus(t, ex.dialog4FocusableEls[0]),
      'Focus should be on item "' +
        ex.dialog4FocusableEls[0] +
        '" when dialog 4 is opened'
    );

    // Make focus does not change
    let el = await t.context.session.findElement(
      By.css(ex.dialog4FocusableEls[0])
    );
    await el.sendKeys(Key.chord(Key.SHIFT, Key.TAB));
    t.true(
      await checkFocus(t, ex.dialog4FocusableEls[0]),
      'Focus should remain on: "' +
        ex.dialog4FocusableEls[0] +
        '" after tabs in dialog 4'
    );
  }
);

ariaTest('escape closes dialog', exampleFile, 'key-escape', async (t) => {
  /* DIALOG 1 */

  for (let selector of ex.dialog1FocusableEls) {
    await openDialog1(t);
    await sendEscapeTo(t, selector);

    const modalEl = await t.context.session.findElement(
      By.css(ex.dialog1Selector)
    );
    t.false(
      await modalEl.isDisplayed(),
      'Modal 1 should not be displayed after sending escape to element: ' +
        selector
    );

    await reload(t);
  }

  /* DIALOG 2 */

  for (let selector of ex.dialog2FocusableEls) {
    await openDialog2(t);
    await sendEscapeTo(t, selector);

    const modalEl = await t.context.session.findElement(
      By.css(ex.dialog2Selector)
    );
    t.false(
      await modalEl.isDisplayed(),
      'Modal 2 should not be displayed after sending escape to element: ' +
        selector
    );

    await reload(t);
  }

  /* DIALOG 3 */

  for (let selector of ex.dialog3FocusableEls) {
    await openDialog3(t);
    await sendEscapeTo(t, selector);

    const modalEl = await t.context.session.findElement(
      By.css(ex.dialog3Selector)
    );
    t.false(
      await modalEl.isDisplayed(),
      'Modal 3 should not be displayed after sending escape to element: ' +
        selector
    );

    await reload(t);
  }

  /* DIALOG 4 */

  await openDialog4(t);
  await sendEscapeTo(t, ex.dialog4FocusableEls[0]);

  const modalEl = await t.context.session.findElement(
    By.css(ex.dialog4Selector)
  );
  t.false(
    await modalEl.isDisplayed(),
    'Modal 4 should not be displayed after sending escape to element: ' +
      ex.dialog4FocusableEls[0]
  );
});
