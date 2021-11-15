const { ariaTest } = require('..');
const { By, Key } = require('selenium-webdriver');
const assertAttributeValues = require('../util/assertAttributeValues');
const assertAriaLabelledby = require('../util/assertAriaLabelledby');
const assertAriaRoles = require('../util/assertAriaRoles');
const assertAriaSelectedAndActivedescendant = require('../util/assertAriaSelectedAndActivedescendant');
const assertAttributeDNE = require('../util/assertAttributeDNE');

const exampleFile = 'listbox/listbox-grouped.html';

const ex = {
  listboxSelector: '#ex [role="listbox"]',
  optionSelector: '#ex [role="option"]',
  optionIdBase: '#ss_elem_',
};

// Attributes

ariaTest(
  'role="listbox" on ul element',
  exampleFile,
  'listbox-role',
  async (t) => {
    await assertAriaRoles(t, 'ex', 'listbox', 1, 'div');
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
    await t.context.session.findElement(By.css(`${ex.optionIdBase}1`)).click();

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
  'role="group" on ul elements',
  exampleFile,
  'group-role',
  async (t) => {
    await assertAriaRoles(t, 'ex', 'group', 3, 'ul');
  }
);

ariaTest(
  '"aria-labelledby" on group elements',
  exampleFile,
  'group-aria-labelledby',
  async (t) => {
    await assertAriaLabelledby(t, `${ex.listboxSelector} [role="group"]`);
  }
);

ariaTest(
  'role="option" on li elements',
  exampleFile,
  'option-role',
  async (t) => {
    await assertAriaRoles(t, 'ex', 'option', 11, 'li');
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
    await t.context.session.findElement(By.css(`${ex.optionIdBase}1`)).click();

    await assertAttributeValues(
      t,
      `${ex.optionIdBase}1`,
      'aria-selected',
      'true'
    );
  }
);

// Keys

ariaTest('DOWN ARROW moves focus', exampleFile, 'key-down-arrow', async (t) => {
  // Click the second option
  await t.context.session.findElement(By.css(`${ex.optionIdBase}2`)).click();

  // Sending the key down arrow will put focus on the item at index 2 (the third option)
  const listbox = await t.context.session.findElement(
    By.css(ex.listboxSelector)
  );
  await listbox.sendKeys(Key.ARROW_DOWN);

  await assertAriaSelectedAndActivedescendant(
    t,
    ex.listboxSelector,
    ex.optionSelector,
    2
  );
});

ariaTest(
  'DOWN ARROW does not wrap to top of listbox',
  exampleFile,
  'key-down-arrow',
  async (t) => {
    const listbox = await t.context.session.findElement(
      By.css(ex.listboxSelector)
    );
    const options = await t.context.queryElements(t, ex.optionSelector);

    // click the last option
    await options[options.length - 1].click();

    // arrow down
    await listbox.sendKeys(Key.ARROW_DOWN);

    await assertAriaSelectedAndActivedescendant(
      t,
      ex.listboxSelector,
      ex.optionSelector,
      options.length - 1
    );
  }
);

ariaTest(
  'DOWN ARROW sends initial focus to the first option',
  exampleFile,
  'key-down-arrow',
  async (t) => {
    // Sending the key down arrow will put focus on the first option if no options are focused
    const listbox = await t.context.session.findElement(
      By.css(ex.listboxSelector)
    );
    await listbox.sendKeys(Key.ARROW_DOWN);

    await assertAriaSelectedAndActivedescendant(
      t,
      ex.listboxSelector,
      ex.optionSelector,
      0
    );
  }
);

ariaTest(
  'DOWN ARROW moves through groups',
  exampleFile,
  'key-down-arrow',
  async (t) => {
    // Sending the key down arrow will put focus on the first option if no options are focused
    const listbox = await t.context.session.findElement(
      By.css(ex.listboxSelector)
    );
    const group1 = await listbox.findElement(By.css('[role="group"]'));
    const groupOptions = await t.context.queryElements(
      t,
      '[role="option"]',
      group1
    );

    // click last option in group
    await groupOptions[groupOptions.length - 1].click();

    await listbox.sendKeys(Key.ARROW_DOWN);

    // focus should be on the first option in the second group; i.e. index === groupOptions.length
    await assertAriaSelectedAndActivedescendant(
      t,
      ex.listboxSelector,
      ex.optionSelector,
      groupOptions.length
    );
  }
);

ariaTest(
  'UP ARROW sends initial focus to the first option',
  exampleFile,
  'key-up-arrow',
  async (t) => {
    // Sending the key up arrow will put focus on the first option, if no options are focused
    const listbox = await t.context.session.findElement(
      By.css(ex.listboxSelector)
    );
    await listbox.sendKeys(Key.ARROW_UP);

    await assertAriaSelectedAndActivedescendant(
      t,
      ex.listboxSelector,
      ex.optionSelector,
      0
    );
  }
);

ariaTest('END moves focus', exampleFile, 'key-end', async (t) => {
  const listbox = await t.context.session.findElement(
    By.css(ex.listboxSelector)
  );
  const options = await t.context.queryElements(t, ex.optionSelector);

  // Sending key end should put focus on the last item
  await listbox.sendKeys(Key.END);
  await assertAriaSelectedAndActivedescendant(
    t,
    ex.listboxSelector,
    ex.optionSelector,
    options.length - 1
  );

  // Sending key end twice should put focus on the last item
  await listbox.sendKeys(Key.END);
  await assertAriaSelectedAndActivedescendant(
    t,
    ex.listboxSelector,
    ex.optionSelector,
    options.length - 1
  );
});

ariaTest('UP ARROW moves focus', exampleFile, 'key-up-arrow', async (t) => {
  const listbox = await t.context.session.findElement(
    By.css(ex.listboxSelector)
  );

  // Click the second option
  await t.context.session.findElement(By.css(`${ex.optionIdBase}2`)).click();

  // Sending the key up arrow will put focus on the first option
  await listbox.sendKeys(Key.ARROW_UP);
  await assertAriaSelectedAndActivedescendant(
    t,
    ex.listboxSelector,
    ex.optionSelector,
    0
  );
});

ariaTest(
  'UP ARROW does not wrap to bottom of listbox',
  exampleFile,
  'key-up-arrow',
  async (t) => {
    const listbox = await t.context.session.findElement(
      By.css(ex.listboxSelector)
    );

    // click the first option
    await t.context.session.findElement(By.css(`${ex.optionIdBase}1`)).click();

    // arrow up
    await listbox.sendKeys(Key.ARROW_UP);

    await assertAriaSelectedAndActivedescendant(
      t,
      ex.listboxSelector,
      ex.optionSelector,
      0
    );
  }
);

ariaTest(
  'UP ARROW moves through groups',
  exampleFile,
  'key-up-arrow',
  async (t) => {
    // Sending the key down arrow will put focus on the first option if no options are focused
    const listbox = await t.context.session.findElement(
      By.css(ex.listboxSelector)
    );
    const group1 = await listbox.findElement(By.css('[role="group"]'));
    const groupOptions = await t.context.queryElements(
      t,
      '[role="option"]',
      group1
    );

    // click first option in second group
    await t.context.session
      .findElement(By.css(`${ex.optionIdBase}${groupOptions.length + 1}`))
      .click();

    await listbox.sendKeys(Key.ARROW_UP);

    // focus should be on the last option in the first group
    await assertAriaSelectedAndActivedescendant(
      t,
      ex.listboxSelector,
      ex.optionSelector,
      groupOptions.length - 1
    );
  }
);

ariaTest('HOME moves focus', exampleFile, 'key-home', async (t) => {
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
  'END scrolls listbox option into view',
  exampleFile,
  'key-end',
  async (t) => {
    const listbox = await t.context.session.findElement(
      By.css(ex.listboxSelector)
    );
    const options = await t.context.queryElements(t, ex.optionSelector);

    let listboxBounds = await listbox.getRect();
    let optionBounds = await options[options.length - 1].getRect();

    t.true(
      listboxBounds.y + listboxBounds.height - optionBounds.y < 0,
      'last option is not initially displayed'
    );

    await listbox.sendKeys(Key.END);
    listboxBounds = await listbox.getRect();
    optionBounds = await options[options.length - 1].getRect();

    t.true(
      listboxBounds.y + listboxBounds.height - optionBounds.y >= 0,
      'last option is in view after end key'
    );
  }
);

ariaTest(
  'Click scrolls listbox option into view',
  exampleFile,
  'key-end',
  async (t) => {
    const listbox = await t.context.session.findElement(
      By.css(ex.listboxSelector)
    );
    const options = await t.context.queryElements(t, ex.optionSelector);

    let listboxBounds = await listbox.getRect();
    let optionBounds = await options[options.length - 1].getRect();

    t.true(
      listboxBounds.y + listboxBounds.height - optionBounds.y < 0,
      'last option is not initially displayed'
    );

    await options[options.length - 1].click();
    listboxBounds = await listbox.getRect();
    optionBounds = await options[options.length - 1].getRect();

    t.true(
      listboxBounds.y + listboxBounds.height - optionBounds.y >= 0,
      'last option is in view after click'
    );
  }
);
