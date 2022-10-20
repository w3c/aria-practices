const { ariaTest } = require('..');
const { By, Key } = require('selenium-webdriver');
const assertAttributeValues = require('../util/assertAttributeValues');
const assertAriaLabelledby = require('../util/assertAriaLabelledby');
const assertAriaDescribedby = require('../util/assertAriaDescribedby');
const assert = require('assert');

const exampleFile = 'content/patterns/alertdialog/examples/alertdialog.html';

const ex = {
  alertdialogSelector: '[role="alertdialog"]',
  alertdialogFocusableElements: ['#notes_cancel', '#notes_confirm'],
  textarea: '#notes',
  saveButton: '#notes_save',
  discardButton: '#notes_discard',
  alertSelector: '[role="alert"]',
};

const openDialog = async function (t) {
  // Click the discard button to open the alertdialog
  await t.context.session.findElement(By.css(ex.discardButton)).click();

  // Make sure the alertdialog is open
  const alertdialog = await t.context.session.findElement(
    By.css(ex.alertdialogSelector)
  );
  assert(
    await alertdialog.isDisplayed(),
    'alertdialog should have successfully opened'
  );
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

const sendEscapeToSelector = async function (t, selector) {
  let el = await t.context.session.findElement(By.css(selector));
  await el.sendKeys(Key.ESCAPE);
};

// Attributes

ariaTest(
  'role="alertdialog" on div element',
  exampleFile,
  'alertdialog-role',
  async (t) => {
    const alertdialogs = await t.context.queryElements(
      t,
      ex.alertdialogSelector
    );

    t.is(
      alertdialogs.length,
      1,
      'One div with role alertdialog should be found by selector: ' +
        ex.alertdialogSelector
    );

    const alertdialog = alertdialogs[0];

    t.is(
      await alertdialog.getTagName(),
      'div',
      '"role=alertdialog" should be found on a "div" element'
    );
  }
);

ariaTest(
  '"aria-labelledby" attribute on role="alertdialog"',
  exampleFile,
  'aria-labelledby',
  async (t) => {
    await assertAriaLabelledby(t, ex.alertdialogSelector);
  }
);

ariaTest(
  '"aria-describedby" attribute on role="alertdialog"',
  exampleFile,
  'aria-describedby',
  async (t) => {
    await assertAriaDescribedby(t, ex.alertdialogSelector);
  }
);

ariaTest(
  '"aria-modal" attribute on role="alertdialog"',
  exampleFile,
  'aria-modal',
  async (t) => {
    await assertAttributeValues(
      t,
      ex.alertdialogSelector,
      'aria-modal',
      'true'
    );
  }
);

ariaTest(
  'role="alert" on div element',
  exampleFile,
  'alert-role',
  async (t) => {
    const alerts = await t.context.queryElements(t, ex.alertSelector);

    t.is(
      alerts.length,
      1,
      `One div with role alert should be found by selector: ${ex.alertSelector}`
    );

    const alert = alerts[0];

    t.is(
      await alert.getTagName(),
      'div',
      '"role=alert" should be found on a "div" element'
    );
  }
);

// Keys

ariaTest(
  'tab changes focus within alertdialog',
  exampleFile,
  'key-tab',
  async (t) => {
    await openDialog(t);

    // Loop through the focusable elements (focus is on first focusable element on popup)
    for (let i = 0; i < ex.alertdialogFocusableElements.length; i += 1) {
      const alertdialogFocusableElement = ex.alertdialogFocusableElements[i];

      t.true(
        await checkFocus(t, alertdialogFocusableElement),
        `Focus should be on "${alertdialogFocusableElement}" after ` +
          `${i} tabs have been sent to alertdialog`
      );

      await sendTabToSelector(t, alertdialogFocusableElement);
    }

    // Check that the focus returns to the first focusable element
    let totalTabs = ex.alertdialogFocusableElements.length;
    t.true(
      await checkFocus(t, ex.alertdialogFocusableElements[0]),
      `Focus should return to "${ex.alertdialogFocusableElements[0]}" after ` +
        `${totalTabs} tabs have been sent to alertdialog`
    );
  }
);

ariaTest('escape closes alertdialog', exampleFile, 'key-escape', async (t) => {
  await openDialog(t);

  await sendEscapeToSelector(t, ex.alertdialogFocusableElements[0]);

  const alertdialog = await t.context.session.findElement(
    By.css(ex.alertdialogSelector)
  );

  t.false(
    await alertdialog.isDisplayed(),
    'alertdialog should have closed when escape was pressed'
  );
});

ariaTest('save button saves note', exampleFile, 'save-button', async (t) => {
  const saveButton = await t.context.session.findElement(By.css(ex.saveButton));
  saveButton.click();

  await t.context.session.wait(
    async function () {
      return (await saveButton.getAttribute('aria-disabled')) === 'true';
    },
    t.context.waitTime,
    'Timeout waiting for note to be saved'
  );

  await assertAttributeValues(t, ex.saveButton, 'aria-disabled', 'true');
});

ariaTest('control-s saves note', exampleFile, 'key-control-s', async (t) => {
  const textarea = await t.context.session.findElement(By.css(ex.textarea));
  const saveButton = await t.context.session.findElement(By.css(ex.saveButton));

  textarea.sendKeys(Key.chord(Key.CONTROL, 's'));
  textarea.sendKeys(Key.chord(Key.COMMAND, 's')); // macOS

  await t.context.session.wait(
    async function () {
      return (await saveButton.getAttribute('aria-disabled')) === 'true';
    },
    t.context.waitTime,
    'Timeout waiting for note to be saved'
  );

  await assertAttributeValues(t, ex.saveButton, 'aria-disabled', 'true');
});
