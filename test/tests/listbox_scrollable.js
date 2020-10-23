const { ariaTest } = require('..');
const { By, Key } = require('selenium-webdriver');
const assertAttributeValues = require('../util/assertAttributeValues');
const assertAriaLabelledby = require('../util/assertAriaLabelledby');
const assertAriaRoles = require('../util/assertAriaRoles');
const assertAriaSelectedAndActivedescendant = require('../util/assertAriaSelectedAndActivedescendant');
const assertAttributeDNE = require('../util/assertAttributeDNE');

const exampleFile = 'listbox/listbox-scrollable.html';

const ex = {
  listboxSelector: '#ex [role="listbox"]',
  optionSelector: '#ex [role="option"]',
  numOptions: 26,
  firstOptionSelector: '#ex #ss_elem_Np',
};

// Attributes

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
    await assertAttributeValues(t, ex.listboxSelector, 'tabindex', '0');
  }
);

ariaTest(
  'aria-activedescendant on listbox element',
  exampleFile,
  'listbox-aria-activedescendant',
  async (t) => {
    // Put the focus on the listbox. In this example, focusing on the listbox
    // will automatically select the first option.
    await t.context.session.findElement(By.css(ex.firstOptionSelector)).click();

    let options = await t.context.queryElements(t, ex.optionSelector);
    let optionId = await options[0].getAttribute('id');

    t.is(
      await t.context.session
        .findElement(By.css(ex.listboxSelector))
        .getAttribute('aria-activedescendant'),
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

    // Put the focus on the listbox. In this example, focusing on the listbox
    // will automatically select the first option.
    await t.context.session.findElement(By.css(ex.firstOptionSelector)).click();

    await assertAttributeValues(
      t,
      ex.optionSelector + ':nth-child(1)',
      'aria-selected',
      'true'
    );
  }
);

// Keys

ariaTest('DOWN ARROW moves focus', exampleFile, 'key-down-arrow', async (t) => {
  // Put the focus on the listbox. In this example, focusing on the listbox
  // will automatically select the first option.
  await t.context.session.findElement(By.css(ex.firstOptionSelector)).click();

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
});

ariaTest('END moves focus', exampleFile, 'key-end', async (t) => {
  t.pass(2);

  // Put the focus on the listbox. In this example, focusing on the listbox
  // will automatically select the first option.
  await t.context.session.findElement(By.css(ex.firstOptionSelector)).click();

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
  // Put the focus on the listbox. In this example, focusing on the listbox
  // will automatically select the first option.
  await t.context.session.findElement(By.css(ex.firstOptionSelector)).click();

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
  // Put the focus on the listbox. In this example, focusing on the listbox
  // will automatically select the first option.
  await t.context.session.findElement(By.css(ex.firstOptionSelector)).click();

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
