const { ariaTest } = require('..');
const { By, Key } = require('selenium-webdriver');
const assertAttributeValues = require('../util/assertAttributeValues');
const assertAriaLabelledby = require('../util/assertAriaLabelledby');
const assertAriaRoles = require('../util/assertAriaRoles');
const assertAriaSelectedAndActivedescendant = require('../util/assertAriaSelectedAndActivedescendant');
const assertAriaActivedescendant = require('../util/assertAriaActivedescendant');
const assertAttributeDNE = require('../util/assertAttributeDNE');

const exampleFile = 'listbox/listbox-rearrangeable.html';

const ex = {
  1: {
    listboxSelector: '#ex1 [role="listbox"]',
    importantSelector: '#ex1 [role="listbox"]#ss_imp_list',
    optionSelector: '#ex1 [role="option"]',
    numOptions: 10,
    firstOptionSelector: '#ex1 #ss_opt1',
    lastOptionSelector: '#ex1 #ss_opt10',
  },
  2: {
    listboxSelector: '#ex2 [role="listbox"]',
    availableSelector: '#ex2 [role="listbox"]#ms_imp_list',
    optionSelector: '#ex2 [role="option"]',
    numOptions: 10,
    firstOptionSelector: '#ex2 #ms_opt1',
    lastOptionSelector: '#ex2 #ms_opt10',
  },
};

// Attributes

ariaTest(
  'role="listbox" on ul element',
  exampleFile,
  'listbox-role',
  async (t) => {
    await assertAriaRoles(t, 'ex1', 'listbox', 2, 'ul');
    await assertAriaRoles(t, 'ex2', 'listbox', 2, 'ul');
  }
);

ariaTest(
  '"aria-labelledby" on listbox element',
  exampleFile,
  'listbox-aria-labelledby',
  async (t) => {
    await assertAriaLabelledby(t, ex[1].listboxSelector);
    await assertAriaLabelledby(t, ex[2].listboxSelector);
  }
);

ariaTest(
  'tabindex="0" on listbox element',
  exampleFile,
  'listbox-tabindex',
  async (t) => {
    await assertAttributeValues(t, ex[1].listboxSelector, 'tabindex', '0');
    await assertAttributeValues(t, ex[2].listboxSelector, 'tabindex', '0');
  }
);

ariaTest(
  'aria-multiselectable on listbox element',
  exampleFile,
  'listbox-aria-multiselectable',
  async (t) => {
    await assertAttributeValues(
      t,
      ex[2].listboxSelector,
      'aria-multiselectable',
      'true'
    );
  }
);

ariaTest(
  'aria-activedescendant on listbox element',
  exampleFile,
  'listbox-aria-activedescendant',
  async (t) => {
    // Put the focus on the listbox. In this example, focusing on the listbox
    // will automatically select the first option.
    await t.context.session
      .findElement(By.css(ex[1].firstOptionSelector))
      .click();

    let options = await t.context.queryElements(t, ex[1].optionSelector);
    let optionId = await options[0].getAttribute('id');

    t.is(
      await t.context.session
        .findElement(By.css(ex[1].listboxSelector))
        .getAttribute('aria-activedescendant'),
      optionId,
      'aria-activedescendant should be set to ' +
        optionId +
        ' for items: ' +
        ex.listboxSelector
    );

    // Put the focus on the listbox. In this example, focusing on the listbox
    // will automatically select the first option.
    await t.context.session
      .findElement(By.css(ex[2].firstOptionSelector))
      .click();

    options = await t.context.queryElements(t, ex[2].optionSelector);
    optionId = await options[0].getAttribute('id');

    t.is(
      await t.context.session
        .findElement(By.css(ex[2].listboxSelector))
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
    await assertAriaRoles(t, 'ex1', 'option', 10, 'li');
    await assertAriaRoles(t, 'ex2', 'option', 10, 'li');
  }
);

ariaTest(
  '"aria-selected" on option elements',
  exampleFile,
  'option-aria-selected',
  async (t) => {
    await assertAttributeDNE(t, ex[1].optionSelector, 'aria-selected');
    await t.context.session
      .findElement(By.css(ex[1].firstOptionSelector))
      .click();
    await assertAttributeValues(
      t,
      ex[1].optionSelector + ':nth-child(1)',
      'aria-selected',
      'true'
    );

    await assertAttributeValues(
      t,
      ex[2].optionSelector,
      'aria-selected',
      'false'
    );
    await t.context.session
      .findElement(By.css(ex[2].firstOptionSelector))
      .click();
    await assertAttributeValues(
      t,
      ex[2].optionSelector + ':nth-child(1)',
      'aria-selected',
      'true'
    );
  }
);

// Keys

ariaTest(
  'down arrow moves focus and selects',
  exampleFile,
  'key-down-arrow',
  async (t) => {
    // Example 1

    let listbox = (await t.context.queryElements(t, ex[1].listboxSelector))[0];
    let options = await t.context.queryElements(t, ex[1].optionSelector);

    // Put the focus on the first item
    await t.context.session
      .findElement(By.css(ex[1].firstOptionSelector))
      .click();
    for (let index = 0; index < options.length - 1; index++) {
      await listbox.sendKeys(Key.ARROW_DOWN);
      await assertAriaSelectedAndActivedescendant(
        t,
        ex[1].importantSelector,
        ex[1].optionSelector,
        index + 1
      );
    }

    // Send down arrow to the last option, focus should not move
    await listbox.sendKeys(Key.ARROW_DOWN);
    let lastOption = options.length - 1;
    await assertAriaSelectedAndActivedescendant(
      t,
      ex[1].importantSelector,
      ex[1].optionSelector,
      lastOption
    );

    // Example 2

    listbox = (await t.context.queryElements(t, ex[2].listboxSelector))[0];
    options = await t.context.queryElements(t, ex[2].optionSelector);

    // Put the focus on the first item, and selects item, so skip by sending down arrow once
    await t.context.session
      .findElement(By.css(ex[2].firstOptionSelector))
      .click();
    await listbox.sendKeys(Key.ARROW_DOWN);

    for (let index = 1; index < options.length - 1; index++) {
      await assertAriaActivedescendant(
        t,
        ex[2].availableSelector,
        ex[2].optionSelector,
        index
      );
      t.is(
        await (
          await t.context.queryElements(t, ex[2].optionSelector)
        )[index].getAttribute('aria-selected'),
        'false',
        'aria-selected is false when moving between options with down arrow in example 2'
      );
      await listbox.sendKeys(Key.ARROW_DOWN);
    }

    // Send down arrow to the last option, focus should not move
    await listbox.sendKeys(Key.ARROW_DOWN);
    lastOption = options.length - 1;
    await assertAriaActivedescendant(
      t,
      ex[2].availableSelector,
      ex[2].optionSelector,
      lastOption
    );
    t.is(
      await (
        await t.context.queryElements(t, ex[2].optionSelector)
      )[lastOption].getAttribute('aria-selected'),
      'false',
      'aria-selected is false when moving between options with down arrow in example 2'
    );
  }
);

ariaTest(
  'up arrow moves focus and selects',
  exampleFile,
  'key-up-arrow',
  async (t) => {
    // Example 1

    let listbox = (await t.context.queryElements(t, ex[1].listboxSelector))[0];
    let options = await t.context.queryElements(t, ex[1].optionSelector);

    // Put the focus on the first item
    await t.context.session
      .findElement(By.css(ex[1].lastOptionSelector))
      .click();
    for (let index = options.length - 1; index > 0; index--) {
      await listbox.sendKeys(Key.ARROW_UP);
      await assertAriaSelectedAndActivedescendant(
        t,
        ex[1].importantSelector,
        ex[1].optionSelector,
        index - 1
      );
    }

    // Sending up arrow to first option, focus should not move
    await listbox.sendKeys(Key.ARROW_UP);
    await assertAriaSelectedAndActivedescendant(
      t,
      ex[1].importantSelector,
      ex[1].optionSelector,
      0
    );

    // Example 2

    listbox = (await t.context.queryElements(t, ex[2].listboxSelector))[0];
    options = await t.context.queryElements(t, ex[2].optionSelector);

    // Put the focus on the last item, and selects item, so skip by sending down arrow once
    await t.context.session
      .findElement(By.css(ex[2].lastOptionSelector))
      .click();
    await listbox.sendKeys(Key.ARROW_UP);

    for (let index = options.length - 2; index > 0; index--) {
      await assertAriaActivedescendant(
        t,
        ex[2].availableSelector,
        ex[2].optionSelector,
        index
      );
      t.is(
        await (
          await t.context.queryElements(t, ex[2].optionSelector)
        )[index].getAttribute('aria-selected'),
        'false',
        'aria-selected is false when moving between options with down arrow in example 2'
      );
      await listbox.sendKeys(Key.ARROW_UP);
    }

    // Send down arrow to the last option, focus should not move
    await listbox.sendKeys(Key.ARROW_UP);
    await assertAriaActivedescendant(
      t,
      ex[2].availableSelector,
      ex[2].optionSelector,
      0
    );
    t.is(
      await (
        await t.context.queryElements(t, ex[2].optionSelector)
      )[0].getAttribute('aria-selected'),
      'false',
      'aria-selected is false when moving between options with down arrow in example 2'
    );
  }
);

ariaTest('home moves focus and selects', exampleFile, 'key-home', async (t) => {
  // Example 1

  let listbox = (await t.context.queryElements(t, ex[1].listboxSelector))[0];
  let options = await t.context.queryElements(t, ex[1].optionSelector);

  // Put the focus on the second item
  await options[1].click();
  await listbox.sendKeys(Key.HOME);
  await assertAriaSelectedAndActivedescendant(
    t,
    ex[1].importantSelector,
    ex[1].optionSelector,
    0
  );

  // Put the focus on the last item
  await options[options.length - 1].click();
  await listbox.sendKeys(Key.HOME);
  await assertAriaSelectedAndActivedescendant(
    t,
    ex[1].importantSelector,
    ex[1].optionSelector,
    0
  );

  // Example 2

  listbox = (await t.context.queryElements(t, ex[2].listboxSelector))[0];
  options = await t.context.queryElements(t, ex[2].optionSelector);

  // Put the focus on the second item
  await options[1].click();
  await listbox.sendKeys(Key.HOME);
  await assertAriaActivedescendant(
    t,
    ex[2].availableSelector,
    ex[2].optionSelector,
    0
  );
  t.is(
    await (
      await t.context.queryElements(t, ex[2].optionSelector)
    )[0].getAttribute('aria-selected'),
    'false',
    'aria-selected is false when moving between options with HOME in example 2'
  );

  // Put the focus on the last item
  await options[options.length - 1].click();
  await listbox.sendKeys(Key.HOME);
  await assertAriaActivedescendant(
    t,
    ex[2].availableSelector,
    ex[2].optionSelector,
    0
  );
  t.is(
    await (
      await t.context.queryElements(t, ex[2].optionSelector)
    )[0].getAttribute('aria-selected'),
    'false',
    'aria-selected is false when moving between options with HOME in example 2'
  );
});

ariaTest('end moves focus and selects', exampleFile, 'key-end', async (t) => {
  // Example 1

  let listbox = (await t.context.queryElements(t, ex[1].listboxSelector))[0];
  let options = await t.context.queryElements(t, ex[1].optionSelector);
  let lastOption = options.length - 1;

  // Put the focus on the second item
  await options[1].click();
  await listbox.sendKeys(Key.END);
  await assertAriaSelectedAndActivedescendant(
    t,
    ex[1].importantSelector,
    ex[1].optionSelector,
    lastOption
  );

  // Put the focus on the last item
  await options[lastOption - 1].click();
  await listbox.sendKeys(Key.END);
  await assertAriaSelectedAndActivedescendant(
    t,
    ex[1].importantSelector,
    ex[1].optionSelector,
    lastOption
  );

  // Example 2

  listbox = (await t.context.queryElements(t, ex[2].listboxSelector))[0];
  options = await t.context.queryElements(t, ex[2].optionSelector);

  // Put the focus on the second item
  await options[1].click();
  await listbox.sendKeys(Key.END);
  await assertAriaActivedescendant(
    t,
    ex[2].availableSelector,
    ex[2].optionSelector,
    lastOption
  );
  t.is(
    await (
      await t.context.queryElements(t, ex[2].optionSelector)
    )[lastOption].getAttribute('aria-selected'),
    'false',
    'aria-selected is false when moving between options with END in example 2'
  );

  // Put the focus on the last item
  await options[lastOption - 1].click();
  await listbox.sendKeys(Key.END);
  await assertAriaActivedescendant(
    t,
    ex[2].availableSelector,
    ex[2].optionSelector,
    lastOption
  );
  t.is(
    await (
      await t.context.queryElements(t, ex[2].optionSelector)
    )[lastOption].getAttribute('aria-selected'),
    'false',
    'aria-selected is false when moving between options with END in example 2'
  );
});

ariaTest('key space selects', exampleFile, 'key-space', async (t) => {
  const listbox = (await t.context.queryElements(t, ex[2].listboxSelector))[0];
  const options = await t.context.queryElements(t, ex[2].optionSelector);

  // Put the focus on the first item, and selects item
  await t.context.session
    .findElement(By.css(ex[2].firstOptionSelector))
    .click();

  for (let index = 0; index < options.length - 1; index++) {
    await listbox.sendKeys(Key.ARROW_DOWN, Key.SPACE);
    t.is(
      await (
        await t.context.queryElements(t, ex[2].optionSelector)
      )[index + 1].getAttribute('aria-selected'),
      'true',
      'aria-selected is true when sending space key to item at index: ' +
        (index + 1)
    );
  }

  for (let index = options.length - 1; index >= 0; index--) {
    await listbox.sendKeys(Key.SPACE);
    t.is(
      await (
        await t.context.queryElements(t, ex[2].optionSelector)
      )[index].getAttribute('aria-selected'),
      'false',
      'aria-selected is true when sending space key to item at index: ' + index
    );
    await listbox.sendKeys(Key.ARROW_UP);
  }
});

ariaTest(
  'shift + click selects multiple options',
  exampleFile,
  'key-shift-up-arrow',
  async (t) => {
    const options = await t.context.queryElements(t, ex[2].optionSelector);

    // Put the focus on the fourth item, and selects item
    await options[3].click();

    // send shift + click to first option
    const actions = t.context.session.actions();
    await actions
      .keyDown(Key.SHIFT)
      .click(options[0])
      .keyUp(Key.SHIFT)
      .perform();

    // expect first through fourth option to be selected
    for (let index = options.length - 1; index >= 0; index--) {
      const selected = await options[index].getAttribute('aria-selected');
      const shouldBeSelected = index < 4;
      t.is(
        selected,
        `${shouldBeSelected}`,
        `aria-selected should be ${shouldBeSelected} for option ${
          index + 1
        } after using shift + click`
      );
    }
  }
);

ariaTest(
  'key shift+down arrow moves focus and selects',
  exampleFile,
  'key-shift-down-arrow',
  async (t) => {
    const listbox = await t.context.session.findElement(
      By.css(ex[2].listboxSelector)
    );
    const options = await t.context.queryElements(t, ex[2].optionSelector);

    // Put the focus on the first item, and selects item
    await t.context.session
      .findElement(By.css(ex[2].firstOptionSelector))
      .click();
    listbox.sendKeys(Key.chord(Key.SHIFT, Key.ARROW_DOWN));

    // expect first two items to be selected
    for (let index = options.length - 1; index >= 0; index--) {
      const selected = await options[index].getAttribute('aria-selected');
      const shouldBeSelected = index < 2;
      t.is(
        selected,
        `${shouldBeSelected}`,
        `aria-selected should be ${shouldBeSelected} for option ${
          index + 1
        } after using shift + down arrow to select first and second options`
      );
    }
  }
);

ariaTest(
  'key shift+down arrow overwrites previous selection',
  exampleFile,
  'key-shift-down-arrow',
  async (t) => {
    const listbox = await t.context.session.findElement(
      By.css(ex[2].listboxSelector)
    );
    const options = await t.context.queryElements(t, ex[2].optionSelector);

    // Select first item
    await t.context.session
      .findElement(By.css(ex[2].firstOptionSelector))
      .click();

    // set focus to 3rd item and select
    await t.context.session
      .findElement(By.css(`${ex[2].optionSelector}:nth-child(3)`))
      .click();
    listbox.sendKeys(Key.chord(Key.SHIFT, Key.ARROW_DOWN));

    // expect only third and fourth items to be selected
    for (let index = options.length - 1; index >= 0; index--) {
      const selected = await options[index].getAttribute('aria-selected');
      const shouldBeSelected = index === 2 || index === 3;
      t.is(
        selected,
        `${shouldBeSelected}`,
        `aria-selected should be ${shouldBeSelected} for option ${
          index + 1
        } after using shift + down arrow to select first and second options`
      );
    }
  }
);

ariaTest(
  'key shift+down arrow cannot move past last option',
  exampleFile,
  'key-shift-down-arrow',
  async (t) => {
    const listbox = await t.context.session.findElement(
      By.css(ex[2].listboxSelector)
    );
    const options = await t.context.queryElements(t, ex[2].optionSelector);

    // Put the focus on the second to last item, and select item
    await t.context.session
      .findElement(
        By.css(`${ex[2].optionSelector}:nth-child(${options.length - 1})`)
      )
      .click();
    await listbox.sendKeys(Key.chord(Key.SHIFT, Key.ARROW_DOWN));
    await listbox.sendKeys(Key.chord(Key.SHIFT, Key.ARROW_DOWN));

    // expect first two items to be selected
    for (let index = options.length - 1; index >= 0; index--) {
      const selected = await options[index].getAttribute('aria-selected');
      const shouldBeSelected = index >= options.length - 2;
      t.is(
        selected,
        `${shouldBeSelected}`,
        `aria-selected should be ${shouldBeSelected} for option ${
          index + 1
        } after using shift + down arrow to select past last option`
      );
    }
  }
);

ariaTest(
  'key shift+up arrow moves focus and selects',
  exampleFile,
  'key-shift-up-arrow',
  async (t) => {
    const listbox = await t.context.session.findElement(
      By.css(ex[2].listboxSelector)
    );
    const options = await t.context.queryElements(t, ex[2].optionSelector);

    // Put the focus on the last item, and selects item
    await t.context.session
      .findElement(By.css(ex[2].lastOptionSelector))
      .click();
    listbox.sendKeys(Key.chord(Key.SHIFT, Key.ARROW_UP));

    // expect last two items to be selected
    for (let index = options.length - 1; index >= 0; index--) {
      const selected = await options[index].getAttribute('aria-selected');
      const shouldBeSelected = index >= options.length - 2;
      t.is(
        selected,
        `${shouldBeSelected}`,
        `aria-selected should be ${shouldBeSelected} for option ${
          index + 1
        } after using shift + up arrow to select last and second-to-last options`
      );
    }
  }
);

ariaTest(
  'key shift+up arrow resets previous selection',
  exampleFile,
  'key-shift-up-arrow',
  async (t) => {
    const listbox = await t.context.session.findElement(
      By.css(ex[2].listboxSelector)
    );
    const options = await t.context.queryElements(t, ex[2].optionSelector);

    // Select first item
    await t.context.session
      .findElement(By.css(ex[2].firstOptionSelector))
      .click();

    // set focus to 3rd item and select
    await t.context.session
      .findElement(By.css(`${ex[2].optionSelector}:nth-child(3)`))
      .click();
    listbox.sendKeys(Key.chord(Key.SHIFT, Key.ARROW_UP));

    // expect only second and third items to be selected
    for (let index = options.length - 1; index >= 0; index--) {
      const selected = await options[index].getAttribute('aria-selected');
      const shouldBeSelected = index === 1 || index === 2;
      t.is(
        selected,
        `${shouldBeSelected}`,
        `aria-selected should be ${shouldBeSelected} for option ${
          index + 1
        } after using shift + up arrow to select third and second options`
      );
    }
  }
);

ariaTest(
  'key shift+up arrow cannot move past first option',
  exampleFile,
  'key-shift-up-arrow',
  async (t) => {
    const listbox = await t.context.session.findElement(
      By.css(ex[2].listboxSelector)
    );
    const options = await t.context.queryElements(t, ex[2].optionSelector);

    // Put the focus on the second item, and select item
    await t.context.session
      .findElement(By.css(`${ex[2].optionSelector}:nth-child(2)`))
      .click();
    await listbox.sendKeys(Key.chord(Key.SHIFT, Key.ARROW_UP));
    await listbox.sendKeys(Key.chord(Key.SHIFT, Key.ARROW_UP));

    // expect first two items to be selected
    for (let index = options.length - 1; index >= 0; index--) {
      const selected = await options[index].getAttribute('aria-selected');
      const shouldBeSelected = index <= 1;
      t.is(
        selected,
        `${shouldBeSelected}`,
        `aria-selected should be ${shouldBeSelected} for option ${
          index + 1
        } after using shift + up arrow to select first and second`
      );
    }
  }
);

ariaTest(
  'key control+shift+home moves focus and selects all options',
  exampleFile,
  'key-control-shift-home',
  async (t) => {
    const listbox = await t.context.session.findElement(
      By.css(ex[2].listboxSelector)
    );
    const options = await t.context.queryElements(t, ex[2].optionSelector);

    // Put the focus on the last item, and selects item
    await t.context.session
      .findElement(By.css(ex[2].lastOptionSelector))
      .click();
    listbox.sendKeys(Key.chord(Key.SHIFT, Key.CONTROL, Key.HOME));

    for (let index = options.length - 1; index >= 0; index--) {
      const selected = await options[index].getAttribute('aria-selected');
      t.is(
        selected,
        'true',
        'aria-selected should be true for all options after using shift + control + home from last option'
      );
    }
  }
);

ariaTest(
  'key control+shift+home moves focus and selects some options',
  exampleFile,
  'key-control-shift-home',
  async (t) => {
    const listbox = await t.context.session.findElement(
      By.css(ex[2].listboxSelector)
    );
    const options = await t.context.queryElements(t, ex[2].optionSelector);

    // Put the focus on the 5th option, arrow up, then do home
    await t.context.session
      .findElement(By.css(`${ex[2].optionSelector}:nth-child(5)`))
      .click();
    await listbox.sendKeys(Key.ARROW_UP);
    await listbox.sendKeys(Key.chord(Key.SHIFT, Key.CONTROL, Key.HOME));

    // expect 1st-4th options to be selected
    for (let index = options.length - 1; index >= 0; index--) {
      const selected = await options[index].getAttribute('aria-selected');
      const shouldBeSelected = index < 4;
      t.is(
        selected,
        `${shouldBeSelected}`,
        'aria-selected should be true for first through fourth options'
      );
    }
  }
);

ariaTest(
  'key shift+home does not change selection',
  exampleFile,
  'key-control-shift-home',
  async (t) => {
    const listbox = await t.context.session.findElement(
      By.css(ex[2].listboxSelector)
    );
    const options = await t.context.queryElements(t, ex[2].optionSelector);

    // Put the focus on the last option and select it
    await t.context.session
      .findElement(By.css(ex[2].lastOptionSelector))
      .click();
    await listbox.sendKeys(Key.chord(Key.SHIFT, Key.HOME));

    // expect only last item
    for (let index = options.length - 1; index >= 0; index--) {
      const selected = await options[index].getAttribute('aria-selected');
      const shouldBeSelected = index === options.length - 1;
      t.is(
        selected,
        `${shouldBeSelected}`,
        'aria-selected should only be true for last option'
      );
    }
  }
);

ariaTest(
  'key control+shift+end moves focus and selects all options',
  exampleFile,
  'key-control-shift-end',
  async (t) => {
    const listbox = await t.context.session.findElement(
      By.css(ex[2].listboxSelector)
    );
    const options = await t.context.queryElements(t, ex[2].optionSelector);

    // Put the focus on the first item, and selects item
    await t.context.session
      .findElement(By.css(ex[2].firstOptionSelector))
      .click();
    await listbox.sendKeys(Key.chord(Key.SHIFT, Key.CONTROL, Key.END));

    for (let index = options.length - 1; index >= 0; index--) {
      const selected = await options[index].getAttribute('aria-selected');
      t.is(
        selected,
        'true',
        'aria-selected should be true for all options after using shift + control + end from first option'
      );
    }
  }
);

ariaTest(
  'key control+shift+end moves focus and selects some options',
  exampleFile,
  'key-control-shift-end',
  async (t) => {
    const listbox = await t.context.session.findElement(
      By.css(ex[2].listboxSelector)
    );
    const options = await t.context.queryElements(t, ex[2].optionSelector);

    // Put the focus on the 3rd option, arrow down, then do end
    await t.context.session
      .findElement(By.css(`${ex[2].optionSelector}:nth-child(3)`))
      .click();
    await listbox.sendKeys(Key.ARROW_DOWN);
    await listbox.sendKeys(Key.chord(Key.SHIFT, Key.CONTROL, Key.END));

    // expect 4th - last options to be selected
    for (let index = options.length - 1; index >= 0; index--) {
      const selected = await options[index].getAttribute('aria-selected');
      const shouldBeSelected = index >= 3;
      t.is(
        selected,
        `${shouldBeSelected}`,
        'aria-selected should be true for fourth through last options'
      );
    }
  }
);

ariaTest(
  'key shift+end does not change selection',
  exampleFile,
  'key-control-shift-end',
  async (t) => {
    const listbox = await t.context.session.findElement(
      By.css(ex[2].listboxSelector)
    );
    const options = await t.context.queryElements(t, ex[2].optionSelector);

    // Put the focus on the first option and select it
    await t.context.session
      .findElement(By.css(ex[2].firstOptionSelector))
      .click();
    await listbox.sendKeys(Key.chord(Key.SHIFT, Key.END));

    // expect only first item to be selected
    for (let index = options.length - 1; index >= 0; index--) {
      const selected = await options[index].getAttribute('aria-selected');
      const shouldBeSelected = index === 0;
      t.is(
        selected,
        `${shouldBeSelected}`,
        'aria-selected should only be true for first option'
      );
    }
  }
);

ariaTest(
  'key control+A selects all options',
  exampleFile,
  'key-control-a',
  async (t) => {
    const listbox = await t.context.session.findElement(
      By.css(ex[2].listboxSelector)
    );
    const options = await t.context.queryElements(t, ex[2].optionSelector);

    // click inside listbox
    await t.context.session
      .findElement(By.css(`${ex[2].optionSelector}:nth-child(2)`))
      .click();
    await listbox.sendKeys(Key.chord(Key.CONTROL, 'a'));

    // expect all items to be selected
    for (let index = options.length - 1; index >= 0; index--) {
      const selected = await options[index].getAttribute('aria-selected');
      t.is(
        selected,
        'true',
        'all options should be selected after using control + a'
      );
    }
  }
);

ariaTest(
  'A without control performs default focus move',
  exampleFile,
  'key-control-a',
  async (t) => {
    const listbox = await t.context.session.findElement(
      By.css(ex[2].listboxSelector)
    );
    const options = await t.context.queryElements(t, ex[2].optionSelector);

    // get index of first option that begin with a
    const matchingOptions = [];
    for (let index = 0; index < options.length; index++) {
      const optionText = await options[index].getText();
      if (optionText && optionText[0].toLowerCase() === 'a') {
        matchingOptions.push(options[index]);
      }
    }
    const matchingIndex = matchingOptions.length
      ? options.indexOf(matchingOptions[0])
      : null;

    // click inside listbox
    await t.context.session
      .findElement(By.css(ex[2].firstOptionSelector))
      .click();
    await listbox.sendKeys('a');

    await assertAriaActivedescendant(
      t,
      ex[2].listboxSelector,
      ex[2].optionSelector,
      matchingIndex
    );

    // expect only first item to be selected
    for (let index = options.length - 1; index >= 1; index--) {
      const selected = await options[index].getAttribute('aria-selected');
      t.is(selected, 'false', 'a character alone should not select options');
    }
  }
);

ariaTest(
  'Control + A performs no action on single select listbox',
  exampleFile,
  'key-control-a',
  async (t) => {
    const listbox = await t.context.session.findElement(
      By.css(ex[1].listboxSelector)
    );
    const options = await t.context.queryElements(t, ex[1].optionSelector);

    // click inside listbox
    await t.context.session
      .findElement(By.css(ex[1].firstOptionSelector))
      .click();
    await listbox.sendKeys(Key.chord(Key.CONTROL, 'a'));

    await assertAriaActivedescendant(
      t,
      ex[1].listboxSelector,
      ex[1].optionSelector,
      0
    );

    // expect only first item to be selected
    for (let index = options.length - 1; index >= 1; index--) {
      const selected = await options[index].getAttribute('aria-selected');
      t.is(
        selected,
        null,
        'control + a should not affect single select listbox'
      );
    }
  }
);
