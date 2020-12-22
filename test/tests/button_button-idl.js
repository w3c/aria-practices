const { ariaTest } = require('..');
const { By, Key } = require('selenium-webdriver');

const exampleFile = 'button/button_idl.html';
const assertDotValue = require('../util/assertDotValue');
const assertAttributeValues = require('../util/assertAttributeValues');

const ex = {
  printSelector: '#action',
  toggleSelector: '#toggle',
  svgSelector: '#example a svg',
};

// Attributes

ariaTest(
  'Example elements should have role="button" set',
  exampleFile,
  'button-role',
  async (t) => {
    await assertDotValue(t, ex.printSelector, 'role', 'button');
    await assertDotValue(t, ex.toggleSelector, 'role', 'button');
  }
);

ariaTest(
  'Button examples should have tabindex="0"',
  exampleFile,
  'button-tabindex',
  async (t) => {
    let printEl = await t.context.session.findElement(By.css(ex.printSelector));

    t.is(
      await printEl.getAttribute('tabindex'),
      '0',
      'tabindex should be set to "0" on button example: ' + ex.printSelector
    );

    let toggleEl = await t.context.session.findElement(
      By.css(ex.toggleSelector)
    );

    t.is(
      await toggleEl.getAttribute('tabindex'),
      '0',
      'tabindex should be set to "0" on button example: ' + ex.toggleSelector
    );
  }
);

ariaTest(
  '"aria-pressed" reflects button state',
  exampleFile,
  'button-aria-pressed',
  async (t) => {
    await assertDotValue(t, ex.toggleSelector, 'ariaPressed', 'false');
    let toggleButtonEl = await t.context.session.findElement(
      By.css(ex.toggleSelector)
    );
    await toggleButtonEl.click();
    await assertDotValue(t, ex.toggleSelector, 'ariaPressed', 'true');
    await toggleButtonEl.click();
    await assertDotValue(t, ex.toggleSelector, 'ariaPressed', 'false');
  }
);

ariaTest(
  '"aria-hidden" set on SVG',
  exampleFile,
  'svg-aria-hidden',
  async (t) => {
    await assertAttributeValues(t, ex.svgSelector, 'aria-hidden', 'true');
  }
);

ariaTest('key ENTER activates button', exampleFile, 'key-enter', async (t) => {
  let toggleButtonEl = await t.context.session.findElement(
    By.css(ex.toggleSelector)
  );

  // Send ENTER and wait for change of 'aria-pressed'
  await toggleButtonEl.sendKeys(Key.ENTER);
  await assertDotValue(t, ex.toggleSelector, 'ariaPressed', 'true');
  await toggleButtonEl.sendKeys(Key.ENTER);
  await assertDotValue(t, ex.toggleSelector, 'ariaPressed', 'false');

  let actionButtonEl = await t.context.session.findElement(
    By.css(ex.printSelector)
  );
  let oldText = await actionButtonEl.getText();
  let newText = oldText + ' - Printed!';

  await t.context.session.executeScript(
    function () {
      let [selector, newText] = arguments;
      window.print = function () {
        document.querySelector(selector).innerText = newText;
      };
    },
    ex.printSelector,
    newText
  );

  // Send ENTER and wait for change of 'aria-pressed'
  await actionButtonEl.sendKeys(Key.ENTER);

  await t.context.session.wait(
    async function () {
      return actionButtonEl.getText('') !== oldText;
    },
    t.context.waitTime,
    'window.print was not executed'
  );

  t.is(
    await actionButtonEl.getText(),
    newText,
    'window.print should have been triggered after sending ENTER to example: ' +
      ex.printSelector
  );
});

ariaTest('key SPACE activates button', exampleFile, 'key-space', async (t) => {
  let toggleButtonEl = await t.context.session.findElement(
    By.css(ex.toggleSelector)
  );

  // Send SPACE and wait for change of 'aria-pressed'
  await toggleButtonEl.sendKeys(Key.SPACE);
  await assertDotValue(t, ex.toggleSelector, 'ariaPressed', 'true');
  await toggleButtonEl.sendKeys(Key.SPACE);
  await assertDotValue(t, ex.toggleSelector, 'ariaPressed', 'false');

  let actionButtonEl = await t.context.session.findElement(
    By.css(ex.printSelector)
  );
  let oldText = await actionButtonEl.getText();
  let newText = oldText + ' - Printed!';

  await t.context.session.executeScript(
    function () {
      let [selector, newText] = arguments;
      window.print = function () {
        document.querySelector(selector).innerText = newText;
      };
    },
    ex.printSelector,
    newText
  );

  // Send SPACE and wait for change of 'aria-pressed'
  await actionButtonEl.sendKeys(Key.SPACE);

  await t.context.session.wait(
    async function () {
      return actionButtonEl.getText('') !== oldText;
    },
    t.context.waitTime,
    'window.print was not executed'
  );

  t.is(
    await actionButtonEl.getText(),
    newText,
    'window.print should have been triggered after sending SPACE to example: ' +
      ex.printSelector
  );
});
