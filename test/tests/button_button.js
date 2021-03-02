const { ariaTest } = require('..');
const { By, Key } = require('selenium-webdriver');

const exampleFile = 'button/button.html';

const ex = {
  buttons: [
    {
      id: 'action',
      tag: 'div',
    },
    {
      id: 'toggle',
      tag: 'a',
    },
  ],
  buttonSelector: '#example [role="button"]',
};

// Attributes

ariaTest(
  'Example elements should have role="button" set',
  exampleFile,
  'button-role',
  async (t) => {
    for (let button of ex.buttons) {
      let buttonEl = await t.context.session.findElement(By.id(button.id));

      t.is(
        await buttonEl.getAttribute('role'),
        'button',
        'Role on button example #' + button.id + ' should have role "button"'
      );

      t.is(
        await buttonEl.getTagName(),
        button.tag,
        'Tag on button example #' +
          button.id +
          ' should have tag: ' +
          button.tag
      );
    }
  }
);

ariaTest(
  'Button examples should have tabindex="0"',
  exampleFile,
  'button-tabindex',
  async (t) => {
    for (let button of ex.buttons) {
      let buttonEl = await t.context.session.findElement(By.id(button.id));

      t.is(
        await buttonEl.getAttribute('tabindex'),
        '0',
        'tabindex should be set to "0" on button example: #' + button.id
      );
    }
  }
);

ariaTest(
  '"aria-pressed" reflects button state',
  exampleFile,
  'button-aria-pressed',
  async (t) => {
    let toggleButtonSelector = '#' + ex.buttons[1].id;

    let ariaPressedExists = await t.context.session.executeScript(
      async function () {
        const selector = arguments[0];
        let el = document.querySelector(selector);
        return el.hasAttribute('aria-pressed');
      },
      toggleButtonSelector
    );

    t.is(
      ariaPressedExists,
      true,
      'aria-pressed attribute should exist on example: ' + toggleButtonSelector
    );

    let toggleButtonEl = await t.context.session.findElement(
      By.css(toggleButtonSelector)
    );
    t.is(
      await toggleButtonEl.getAttribute('aria-pressed'),
      'false',
      'aria-pressed should be set to "false" by default on example: #' +
        toggleButtonSelector
    );

    // Click and wait for change of 'aria-pressed'
    await toggleButtonEl.click();
    await t.context.session.wait(
      async function () {
        return toggleButtonEl.getAttribute('aria-pressed') !== 'true';
      },
      t.context.waitTime,
      'Timeout waiting for aria-pressed to change from "true"'
    );

    t.is(
      await toggleButtonEl.getAttribute('aria-pressed'),
      'true',
      'aria-pressed should be set to "false" after clicking on example: #' +
        toggleButtonSelector
    );
  }
);

ariaTest('key ENTER activates button', exampleFile, 'key-enter', async (t) => {
  let toggleButtonSelector = '#' + ex.buttons[1].id;
  let toggleButtonEl = await t.context.session.findElement(
    By.css(toggleButtonSelector)
  );

  // Send ENTER and wait for change of 'aria-pressed'
  await toggleButtonEl.sendKeys(Key.ENTER);
  await t.context.session.wait(
    async function () {
      return toggleButtonEl.getAttribute('aria-pressed') !== 'true';
    },
    t.context.waitTime,
    'Timeout waiting for aria-pressed to change from "true"'
  );

  t.is(
    await toggleButtonEl.getAttribute('aria-pressed'),
    'true',
    'aria-pressed should be set to "false" after sending enter to example: ' +
      toggleButtonSelector
  );

  // Send ENTER again and wait for change of 'aria-pressed'
  await toggleButtonEl.sendKeys(Key.ENTER);
  await t.context.session.wait(
    async function () {
      return toggleButtonEl.getAttribute('aria-pressed') !== 'false';
    },
    t.context.waitTime,
    'Timeout waiting for aria-pressed to change from "false"'
  );

  t.is(
    await toggleButtonEl.getAttribute('aria-pressed'),
    'false',
    'aria-pressed should be set to "false" after sending enter to example: ' +
      toggleButtonSelector
  );

  let actionButtonSelector = '#' + ex.buttons[0].id;
  let actionButtonEl = await t.context.session.findElement(
    By.css(actionButtonSelector)
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
    actionButtonSelector,
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
      actionButtonSelector
  );
});

ariaTest('key SPACE activates button', exampleFile, 'key-space', async (t) => {
  let toggleButtonSelector = '#' + ex.buttons[1].id;
  let toggleButtonEl = await t.context.session.findElement(
    By.css(toggleButtonSelector)
  );

  // Send SPACE and wait for change of 'aria-pressed'
  await toggleButtonEl.sendKeys(Key.SPACE);
  await t.context.session.wait(
    async function () {
      return toggleButtonEl.getAttribute('aria-pressed') !== 'true';
    },
    t.context.waitTime,
    'Timeout waiting for aria-pressed to change from "true"'
  );

  t.is(
    await toggleButtonEl.getAttribute('aria-pressed'),
    'true',
    'aria-pressed should be set to "false" after sending space to example: ' +
      toggleButtonSelector
  );

  // Send SPACE again and wait for change of 'aria-pressed'
  await toggleButtonEl.sendKeys(Key.SPACE);
  await t.context.session.wait(
    async function () {
      return toggleButtonEl.getAttribute('aria-pressed') !== 'false';
    },
    t.context.waitTime,
    'Timeout waiting for aria-pressed to change from "false"'
  );

  t.is(
    await toggleButtonEl.getAttribute('aria-pressed'),
    'false',
    'aria-pressed should be set to "false" after sending space to example: ' +
      toggleButtonSelector
  );

  let actionButtonSelector = '#' + ex.buttons[0].id;
  let actionButtonEl = await t.context.session.findElement(
    By.css(actionButtonSelector)
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
    actionButtonSelector,
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
      actionButtonSelector
  );
});
