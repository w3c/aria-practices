const { ariaTest } = require('..');
const { By, Key } = require('selenium-webdriver');
const assertAttributeValues = require('../util/assertAttributeValues');
const assertAttributeDNE = require('../util/assertAttributeDNE');
const assertAriaRoles = require('../util/assertAriaRoles');
const assertAriaLabelledby = require('../util/assertAriaLabelledby');
const assertAriaSelectedAndActivedescendant = require('../util/assertAriaSelectedAndActivedescendant');

const exampleFile = 'listbox/listbox-collapsible.html';

const ex = {
  buttonSelector: '#ex button',
  listboxSelector: '#ex [role="listbox"]',
  optionSelector: '#ex [role="option"]',
  numOptions: 26,
};

const checkFocus = async function (t, selector) {
  return await t.context.session.wait(
    async function () {
      return t.context.session.executeScript(function () {
        const [selector] = arguments;
        const items = document.querySelector(selector);
        return items === document.activeElement;
      }, selector);
    },
    t.context.waitTime,
    'Timeout waiting for dom focus on element:' + selector
  );
};

ariaTest(
  '"aria-labelledby" on button element',
  exampleFile,
  'button-aria-labelledby',
  async (t) => {
    await assertAriaLabelledby(t, ex.buttonSelector);
  }
);

ariaTest(
  '"aria-haspopup" on button element',
  exampleFile,
  'button-aria-haspopup',
  async (t) => {
    await assertAttributeValues(
      t,
      ex.buttonSelector,
      'aria-haspopup',
      'listbox'
    );
  }
);

ariaTest(
  '"aria-expanded" on button element',
  exampleFile,
  'button-aria-expanded',
  async (t) => {
    const button = await t.context.session.findElement(
      By.css(ex.buttonSelector)
    );

    // Check that aria-expanded is not set and the listbox is not visible before interacting

    await assertAttributeDNE(t, ex.buttonSelector, 'aria-expanded');

    t.false(
      await t.context.session
        .findElement(By.css(ex.listboxSelector))
        .isDisplayed(),
      "listbox element should not be displayed when 'aria-expanded' does not exist"
    );

    // click button
    await t.context.session.findElement(By.css(ex.buttonSelector)).click();

    // Check that aria-expanded is true and the listbox is visible

    t.is(
      await button.getAttribute('aria-expanded'),
      'true',
      'button element should have attribute "aria-expanded" set to true clicking.'
    );

    t.true(
      await t.context.session
        .findElement(By.css(ex.listboxSelector))
        .isDisplayed(),
      "listbox element should be displayed when 'aria-expanded' is true"
    );
  }
);

ariaTest(
  'role="listbox" on ul element',
  exampleFile,
  'listbox-role',
  async (t) => {
    await assertAriaRoles(t, 'ex', 'listbox', 1, 'ul');
  }
);

ariaTest(
  '"aria-labelledby" on listbox element',
  exampleFile,
  'listbox-aria-labelledby',
  async (t) => {
    await assertAriaLabelledby(t, ex.listboxSelector);
  }
);

ariaTest(
  'tabindex="0" on listbox element',
  exampleFile,
  'listbox-tabindex',
  async (t) => {
    await assertAttributeValues(t, ex.listboxSelector, 'tabindex', '-1');
  }
);

ariaTest(
  'aria-activedescendant on listbox element',
  exampleFile,
  'listbox-aria-activedescendant',
  async (t) => {
    // Put the focus on the listbox by clicking the button
    await t.context.session.findElement(By.css(ex.buttonSelector)).click();

    const listbox = await t.context.session.findElement(
      By.css(ex.listboxSelector)
    );
    const options = await t.context.queryElements(t, ex.optionSelector);
    const optionId = await options[0].getAttribute('id');

    // no active descendant is expected until arrow keys are used
    t.is(
      await listbox.getAttribute('aria-activedescendant'),
      null,
      'activedescendant not set on open click'
    );

    // active descendant set to first item on down arrow
    await listbox.sendKeys(Key.DOWN);

    t.is(
      await listbox.getAttribute('aria-activedescendant'),
      optionId,
      'aria-activedescendant should be set to ' +
        optionId +
        ' for items: ' +
        ex.listboxSelector
    );
  }
);

ariaTest(
  'role="option" on li elements',
  exampleFile,
  'option-role',
  async (t) => {
    await assertAriaRoles(t, 'ex', 'option', 26, 'li');
  }
);

ariaTest(
  '"aria-selected" on option elements',
  exampleFile,
  'option-aria-selected',
  async (t) => {
    await assertAttributeDNE(t, ex.optionSelector, 'aria-selected');

    // Put the focus on the listbox with arrow down
    await t.context.session
      .findElement(By.css(ex.buttonSelector))
      .sendKeys(Key.DOWN);

    await assertAttributeValues(
      t,
      ex.optionSelector + ':nth-child(1)',
      'aria-selected',
      'true'
    );
  }
);

// Keys

ariaTest(
  'ENTER opens and closes listbox',
  exampleFile,
  'key-enter',
  async (t) => {
    let button = await t.context.session.findElement(By.css(ex.buttonSelector));
    let listbox = await t.context.session.findElement(
      By.css(ex.listboxSelector)
    );

    await button.sendKeys(Key.ENTER);

    t.true(
      await listbox.isDisplayed(),
      'After sending ENTER to the button element, the listbox should open'
    );

    // Send down arrow to change the selection
    await listbox.sendKeys(Key.ARROW_DOWN);
    await listbox.sendKeys(Key.ARROW_DOWN);

    let newSelectedText = await t.context.session
      .findElement(By.css(ex.optionSelector + '[aria-selected="true"]'))
      .getText();

    // Send ENTER to the listbox
    await listbox.sendKeys(Key.ENTER);

    // And focus should be on the element with the corresponding text in on button
    t.false(
      await listbox.isDisplayed(),
      'After sending ENTER to the listbox element, the listbox should closed'
    );

    t.is(
      await button.getText(),
      newSelectedText,
      'The button text should match the newly selected option in the listbox'
    );
  }
);

ariaTest('ESCAPE closes listbox', exampleFile, 'key-escape', async (t) => {
  let button = await t.context.session.findElement(By.css(ex.buttonSelector));
  let listbox = await t.context.session.findElement(By.css(ex.listboxSelector));

  await button.click();

  // Send down arrow to change the selection
  await listbox.sendKeys(Key.ARROW_DOWN);

  let newSelectedText = await t.context.session
    .findElement(By.css(ex.optionSelector + '[aria-selected="true"]'))
    .getText();

  // Send ESCAPE to the listbox
  await listbox.sendKeys(Key.ESCAPE);

  // And focus should be on the element with the corresponding text in on button
  t.false(
    await listbox.isDisplayed(),
    'After sending ENTER to the listbox element, the listbox should closed'
  );

  t.is(
    await button.getText(),
    newSelectedText,
    'The button text should match the newly selected option in the listbox'
  );

  let focusOnButton = await t.context.session.executeScript(function () {
    const [selector] = arguments;
    return document.querySelector(selector) === document.activeElement;
  }, ex.buttonSelector);

  t.true(
    focusOnButton,
    'After sending escape to the listbox, the focus should be on the button'
  );
});

ariaTest(
  'DOWN ARROW opens listbox and moves focus',
  exampleFile,
  'key-down-arrow',
  async (t) => {
    // Send DOWN ARROW to button should open listbox
    await t.context.session
      .findElement(By.css(ex.buttonSelector))
      .sendKeys(Key.ARROW_DOWN);

    // Confirm the listbox is open and in focus
    t.true(
      await t.context.session
        .findElement(By.css(ex.listboxSelector))
        .isDisplayed(),
      'listbox element should be displayed after sending DOWN ARROW to button'
    );
    t.true(
      await checkFocus(t, ex.listboxSelector),
      'listbox element should have focus after sending DOWN ARROW to button'
    );

    // Confirm first option is selected
    await assertAriaSelectedAndActivedescendant(
      t,
      ex.listboxSelector,
      ex.optionSelector,
      0
    );

    // Sending the key down arrow will put focus on the item at index 1
    const listbox = await t.context.session.findElement(
      By.css(ex.listboxSelector)
    );
    await listbox.sendKeys(Key.ARROW_DOWN);

    await assertAriaSelectedAndActivedescendant(
      t,
      ex.listboxSelector,
      ex.optionSelector,
      1
    );

    // The selection does not wrap to beginning of list if keydown arrow is sent more times
    // then their are options
    for (let i = 0; i < ex.numOptions + 1; i++) {
      await listbox.sendKeys(Key.ARROW_DOWN);
    }
    await assertAriaSelectedAndActivedescendant(
      t,
      ex.listboxSelector,
      ex.optionSelector,
      ex.numOptions - 1
    );
  }
);

ariaTest('END moves focus', exampleFile, 'key-end', async (t) => {
  t.pass(2);

  // Put the focus on the listbox by clicking the button
  await t.context.session.findElement(By.css(ex.buttonSelector)).click();

  const listbox = await t.context.session.findElement(
    By.css(ex.listboxSelector)
  );

  // Sending key end should put focus on the last item
  await listbox.sendKeys(Key.END);
  await assertAriaSelectedAndActivedescendant(
    t,
    ex.listboxSelector,
    ex.optionSelector,
    ex.numOptions - 1
  );

  // Sending key end twice should put focus on the last item
  await listbox.sendKeys(Key.END);
  await assertAriaSelectedAndActivedescendant(
    t,
    ex.listboxSelector,
    ex.optionSelector,
    ex.numOptions - 1
  );
});

ariaTest('UP ARROW moves focus', exampleFile, 'key-up-arrow', async (t) => {
  // Send UP ARROW to button should open listbox
  await t.context.session
    .findElement(By.css(ex.buttonSelector))
    .sendKeys(Key.ARROW_UP);

  // Confirm the listbox is open and in focus
  t.true(
    await t.context.session
      .findElement(By.css(ex.listboxSelector))
      .isDisplayed(),
    'listbox element should be displayed after sending UP ARROW to button'
  );
  t.true(
    await checkFocus(t, ex.listboxSelector),
    'listbox element should have focus after sending UP ARROW to button'
  );
  await assertAriaSelectedAndActivedescendant(
    t,
    ex.listboxSelector,
    ex.optionSelector,
    0
  );

  const listbox = await t.context.session.findElement(
    By.css(ex.listboxSelector)
  );

  // Sending key end should put focus on the last item
  await listbox.sendKeys(Key.END);

  // Sending the key up arrow will put focus on the item at index numOptions-2
  await listbox.sendKeys(Key.ARROW_UP);
  await assertAriaSelectedAndActivedescendant(
    t,
    ex.listboxSelector,
    ex.optionSelector,
    ex.numOptions - 2
  );

  // The selection does not wrap to the bottom of list if key up arrow is sent more times
  // then their are options
  for (let i = 0; i < ex.numOptions + 1; i++) {
    await listbox.sendKeys(Key.ARROW_UP);
  }
  await assertAriaSelectedAndActivedescendant(
    t,
    ex.listboxSelector,
    ex.optionSelector,
    0
  );
});

ariaTest('HOME moves focus', exampleFile, 'key-home', async (t) => {
  // Put the focus on the listbox by clicking the button
  await t.context.session.findElement(By.css(ex.buttonSelector)).click();

  const listbox = await t.context.session.findElement(
    By.css(ex.listboxSelector)
  );
  await listbox.sendKeys(Key.ARROW_DOWN, Key.ARROW_DOWN);

  // Sending key home should always put focus on the first item
  await listbox.sendKeys(Key.HOME);
  await assertAriaSelectedAndActivedescendant(
    t,
    ex.listboxSelector,
    ex.optionSelector,
    0
  );

  // Sending key home twice should always put focus on the first item
  await listbox.sendKeys(Key.HOME);
  await assertAriaSelectedAndActivedescendant(
    t,
    ex.listboxSelector,
    ex.optionSelector,
    0
  );
});

ariaTest(
  'Character keys moves focus',
  exampleFile,
  'key-character',
  async (t) => {
    // Put the focus on the listbox. In this example, focusing on the listbox
    // will automatically select the first option.
    await t.context.session.findElement(By.css(ex.buttonSelector)).click();

    // The third item is 'Americium'
    let listbox = await t.context.session.findElement(
      By.css(ex.listboxSelector)
    );
    await listbox.sendKeys('a');
    await assertAriaSelectedAndActivedescendant(
      t,
      ex.listboxSelector,
      ex.optionSelector,
      2
    );

    // Reload page
    await t.context.session.get(t.context.url);

    // Put the focus on the listbox. In this example, focusing on the listbox
    // will automatically select the first option.
    await t.context.session.findElement(By.css(ex.buttonSelector)).click();

    // Keys in rapid session will treat characters like first few characters of item
    // In this cae, 'Curium' at index 3 will be skipped for 'Californium' at index 5
    listbox = await t.context.session.findElement(By.css(ex.listboxSelector));
    await listbox.sendKeys('c', 'a');
    await assertAriaSelectedAndActivedescendant(
      t,
      ex.listboxSelector,
      ex.optionSelector,
      5
    );

    // Reload page
    await t.context.session.get(t.context.url);

    // Put the focus on the listbox. In this example, focusing on the listbox
    // will automatically select the first option.
    await t.context.session.findElement(By.css(ex.buttonSelector)).click();

    listbox = await t.context.session.findElement(By.css(ex.listboxSelector));

    // With a break, sending on 'b' will land us on 'Berkelium' at index 4
    await listbox.sendKeys('b');
    await assertAriaSelectedAndActivedescendant(
      t,
      ex.listboxSelector,
      ex.optionSelector,
      4
    );

    // Wait for half a second before sending second 'b'
    await new Promise((resolve) => setTimeout(resolve, 500));

    // A second 'b' should land us on 'Bohrium' at index 14
    await listbox.sendKeys('b');
    await assertAriaSelectedAndActivedescendant(
      t,
      ex.listboxSelector,
      ex.optionSelector,
      14
    );
  }
);
