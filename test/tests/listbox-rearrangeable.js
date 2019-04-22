'use strict';

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
    lastOptionSelector: '#ex1 #ss_opt10'
  },
  2: {
    listboxSelector: '#ex2 [role="listbox"]',
    availableSelector: '#ex2 [role="listbox"]#ms_imp_list',
    optionSelector: '#ex2 [role="option"]',
    numOptions: 10,
    firstOptionSelector: '#ex2 #ms_opt1',
    lastOptionSelector: '#ex2 #ms_opt10'
  }
};

// Attributes

ariaTest('role="listbox" on ul element', exampleFile, 'listbox-role', async (t) => {
  t.plan(2);
  await assertAriaRoles(t, 'ex1', 'listbox', 2, 'ul');
  await assertAriaRoles(t, 'ex2', 'listbox', 2, 'ul');
});

ariaTest('"aria-labelledby" on listbox element', exampleFile, 'listbox-aria-labelledby', async (t) => {
  t.plan(2);
  await assertAriaLabelledby(t, ex[1].listboxSelector);
  await assertAriaLabelledby(t, ex[2].listboxSelector);
});

ariaTest('tabindex="0" on listbox element', exampleFile, 'listbox-tabindex', async (t) => {
  t.plan(2);
  await assertAttributeValues(t, ex[1].listboxSelector, 'tabindex', '0');
  await assertAttributeValues(t, ex[2].listboxSelector, 'tabindex', '0');
});

ariaTest('aria-multiselectable on listbox element', exampleFile, 'listbox-aria-multiselectable', async (t) => {
  t.plan(1);
  await assertAttributeValues(t, ex[2].listboxSelector, 'aria-multiselectable', 'true');
});


ariaTest('aria-activedescendant on listbox element', exampleFile, 'listbox-aria-activedescendant', async (t) => {
  t.plan(2);

  // Put the focus on the listbox. In this example, focusing on the listbox
  // will automatically select the first option.
  await t.context.session.findElement(By.css(ex[1].firstOptionSelector)).click();

  let options = await t.context.session.findElements(By.css(ex[1].optionSelector));
  let optionId = await options[0].getAttribute('id');

  t.is(
    await t.context.session
      .findElement(By.css(ex[1].listboxSelector))
      .getAttribute('aria-activedescendant'),
    optionId,
    'aria-activedescendant should be set to ' + optionId + ' for items: ' + ex.listboxSelector
  );

  // Put the focus on the listbox. In this example, focusing on the listbox
  // will automatically select the first option.
  await t.context.session.findElement(By.css(ex[2].firstOptionSelector)).click();

  options = await t.context.session.findElements(By.css(ex[2].optionSelector));
  optionId = await options[0].getAttribute('id');

  t.is(
    await t.context.session
      .findElement(By.css(ex[2].listboxSelector))
      .getAttribute('aria-activedescendant'),
    optionId,
    'aria-activedescendant should be set to ' + optionId + ' for items: ' + ex.listboxSelector
  );

});

ariaTest('role="option" on li elements', exampleFile, 'option-role', async (t) => {
  t.plan(2);
  await assertAriaRoles(t, 'ex1', 'option', 10, 'li');
  await assertAriaRoles(t, 'ex2', 'option', 10, 'li');
});

ariaTest('"aria-selected" on option elements', exampleFile, 'option-aria-selected', async (t) => {
  t.plan(4);

  await assertAttributeDNE(t, ex[1].optionSelector, 'aria-selected');
  await t.context.session.findElement(By.css(ex[1].firstOptionSelector)).click();
  await assertAttributeValues(t, ex[1].optionSelector + ':nth-child(1)', 'aria-selected', 'true');

  await assertAttributeValues(t, ex[2].optionSelector, 'aria-selected', 'false');
  await t.context.session.findElement(By.css(ex[2].firstOptionSelector)).click();
  await assertAttributeValues(t, ex[2].optionSelector + ':nth-child(1)', 'aria-selected', 'true');
});

// Keys

ariaTest('down arrow moves focus and selects', exampleFile, 'key-down-arrow', async (t) => {
  t.plan(28);

  // Example 1

  let listbox = (await t.context.session.findElements(By.css(ex[1].listboxSelector)))[0];
  let options = await t.context.session.findElements(By.css(ex[1].optionSelector));

  // Put the focus on the first item
  await t.context.session.findElement(By.css(ex[1].firstOptionSelector)).click();
  for (let index = 0; index < options.length - 1; index++) {
    await listbox.sendKeys(Key.ARROW_DOWN);
    await assertAriaSelectedAndActivedescendant(t, ex[1].importantSelector, ex[1].optionSelector, index + 1);
  }

  // Send down arrow to the last option, focus should not move
  await listbox.sendKeys(Key.ARROW_DOWN);
  let lastOption = options.length - 1;
  await assertAriaSelectedAndActivedescendant(t, ex[1].importantSelector, ex[1].optionSelector, lastOption);

  // Example 2

  listbox = (await t.context.session.findElements(By.css(ex[2].listboxSelector)))[0];
  options = await t.context.session.findElements(By.css(ex[2].optionSelector));

  // Put the focus on the first item, and selects item, so skip by sending down arrow once
  await t.context.session.findElement(By.css(ex[2].firstOptionSelector)).click();
  await listbox.sendKeys(Key.ARROW_DOWN);

  for (let index = 1; index < options.length - 1; index++) {
    await assertAriaActivedescendant(t, ex[2].availableSelector, ex[2].optionSelector, index);
    t.is(
      await(await t.context.session.findElements(By.css(ex[2].optionSelector)))[index]
        .getAttribute('aria-selected'),
      'false',
      'aria-selected is false when moving between options with down arrow in example 2'
    );
    await listbox.sendKeys(Key.ARROW_DOWN);
  }

  // Send down arrow to the last option, focus should not move
  await listbox.sendKeys(Key.ARROW_DOWN);
  lastOption = options.length - 1;
  await assertAriaActivedescendant(t, ex[2].availableSelector, ex[2].optionSelector, lastOption);
  t.is(
    await(await t.context.session.findElements(By.css(ex[2].optionSelector)))[lastOption]
      .getAttribute('aria-selected'),
    'false',
    'aria-selected is false when moving between options with down arrow in example 2'
  );
});

ariaTest('up arrow moves focus and selects', exampleFile, 'key-up-arrow', async (t) => {
  t.plan(28);

  // Example 1

  let listbox = (await t.context.session.findElements(By.css(ex[1].listboxSelector)))[0];
  let options = await t.context.session.findElements(By.css(ex[1].optionSelector));

  // Put the focus on the first item
  await t.context.session.findElement(By.css(ex[1].lastOptionSelector)).click();
  for (let index = options.length - 1; index > 0; index--) {
    await listbox.sendKeys(Key.ARROW_UP);
    await assertAriaSelectedAndActivedescendant(t, ex[1].importantSelector, ex[1].optionSelector, index - 1);
  }

  // Sending up arrow to first option, focus should not move
  await listbox.sendKeys(Key.ARROW_UP);
  await assertAriaSelectedAndActivedescendant(t, ex[1].importantSelector, ex[1].optionSelector, 0);

  // Example 2

  listbox = (await t.context.session.findElements(By.css(ex[2].listboxSelector)))[0];
  options = await t.context.session.findElements(By.css(ex[2].optionSelector));

  // Put the focus on the last item, and selects item, so skip by sending down arrow once
  await t.context.session.findElement(By.css(ex[2].lastOptionSelector)).click();
  await listbox.sendKeys(Key.ARROW_UP);

  for (let index = options.length - 2; index > 0; index--) {
    await assertAriaActivedescendant(t, ex[2].availableSelector, ex[2].optionSelector, index);
    t.is(
      await(await t.context.session.findElements(By.css(ex[2].optionSelector)))[index]
        .getAttribute('aria-selected'),
      'false',
      'aria-selected is false when moving between options with down arrow in example 2'
    );
    await listbox.sendKeys(Key.ARROW_UP);
  }

  // Send down arrow to the last option, focus should not move
  await listbox.sendKeys(Key.ARROW_UP);
  await assertAriaActivedescendant(t, ex[2].availableSelector, ex[2].optionSelector, 0);
  t.is(
    await(await t.context.session.findElements(By.css(ex[2].optionSelector)))[0]
      .getAttribute('aria-selected'),
    'false',
    'aria-selected is false when moving between options with down arrow in example 2'
  );
});

ariaTest('home moves focus and selects', exampleFile, 'key-home', async (t) => {
  t.plan(6);

  // Example 1

  let listbox = (await t.context.session.findElements(By.css(ex[1].listboxSelector)))[0];
  let options = await t.context.session.findElements(By.css(ex[1].optionSelector));

  // Put the focus on the second item
  await options[1].click();
  await listbox.sendKeys(Key.HOME);
  await assertAriaSelectedAndActivedescendant(t, ex[1].importantSelector, ex[1].optionSelector, 0);

  // Put the focus on the last item
  await options[options.length - 1].click();
  await listbox.sendKeys(Key.HOME);
  await assertAriaSelectedAndActivedescendant(t, ex[1].importantSelector, ex[1].optionSelector, 0);


  // Example 2

  listbox = (await t.context.session.findElements(By.css(ex[2].listboxSelector)))[0];
  options = await t.context.session.findElements(By.css(ex[2].optionSelector));

  // Put the focus on the second item
  await options[1].click();
  await listbox.sendKeys(Key.HOME);
  await assertAriaActivedescendant(t, ex[2].availableSelector, ex[2].optionSelector, 0);
  t.is(
    await(await t.context.session.findElements(By.css(ex[2].optionSelector)))[0]
      .getAttribute('aria-selected'),
    'false',
    'aria-selected is false when moving between options with HOME in example 2'
  );

  // Put the focus on the last item
  await options[options.length - 1].click();
  await listbox.sendKeys(Key.HOME);
  await assertAriaActivedescendant(t, ex[2].availableSelector, ex[2].optionSelector, 0);
  t.is(
    await(await t.context.session.findElements(By.css(ex[2].optionSelector)))[0]
      .getAttribute('aria-selected'),
    'false',
    'aria-selected is false when moving between options with HOME in example 2'
  );
});

ariaTest('end moves focus and selects', exampleFile, 'key-end', async (t) => {
  t.plan(6);

  // Example 1

  let listbox = (await t.context.session.findElements(By.css(ex[1].listboxSelector)))[0];
  let options = await t.context.session.findElements(By.css(ex[1].optionSelector));
  let lastOption = options.length - 1;

  // Put the focus on the second item
  await options[1].click();
  await listbox.sendKeys(Key.END);
  await assertAriaSelectedAndActivedescendant(t, ex[1].importantSelector, ex[1].optionSelector, lastOption);

  // Put the focus on the last item
  await options[lastOption - 1].click();
  await listbox.sendKeys(Key.END);
  await assertAriaSelectedAndActivedescendant(t, ex[1].importantSelector, ex[1].optionSelector, lastOption);


  // Example 2

  listbox = (await t.context.session.findElements(By.css(ex[2].listboxSelector)))[0];
  options = await t.context.session.findElements(By.css(ex[2].optionSelector));

  // Put the focus on the second item
  await options[1].click();
  await listbox.sendKeys(Key.END);
  await assertAriaActivedescendant(t, ex[2].availableSelector, ex[2].optionSelector, lastOption);
  t.is(
    await(await t.context.session.findElements(By.css(ex[2].optionSelector)))[lastOption]
      .getAttribute('aria-selected'),
    'false',
    'aria-selected is false when moving between options with END in example 2'
  );

  // Put the focus on the last item
  await options[lastOption - 1].click();
  await listbox.sendKeys(Key.END);
  await assertAriaActivedescendant(t, ex[2].availableSelector, ex[2].optionSelector, lastOption);
  t.is(
    await(await t.context.session.findElements(By.css(ex[2].optionSelector)))[lastOption]
      .getAttribute('aria-selected'),
    'false',
    'aria-selected is false when moving between options with END in example 2'
  );

});

ariaTest('key space selects', exampleFile, 'key-space', async (t) => {
  t.plan(19);

  const listbox = (await t.context.session.findElements(By.css(ex[2].listboxSelector)))[0];
  const options = await t.context.session.findElements(By.css(ex[2].optionSelector));

  // Put the focus on the first item, and selects item
  await t.context.session.findElement(By.css(ex[2].firstOptionSelector)).click();

  for (let index = 0; index < options.length - 1; index++) {
    await listbox.sendKeys(Key.ARROW_DOWN, Key.SPACE);
    t.is(
      await(await t.context.session.findElements(By.css(ex[2].optionSelector)))[index + 1]
        .getAttribute('aria-selected'),
      'true',
      'aria-selected is true when sending space key to item at index: ' + (index + 1)
    );
  }

  for (let index = options.length - 1; index >= 0 ; index--) {
    await listbox.sendKeys(Key.SPACE);
    t.is(
      await(await t.context.session.findElements(By.css(ex[2].optionSelector)))[index]
        .getAttribute('aria-selected'),
      'false',
      'aria-selected is true when sending space key to item at index: ' + (index)
    );
    await listbox.sendKeys(Key.ARROW_UP);
  }
});

// Bug: https://github.com/w3c/aria-practices/issues/919
ariaTest.failing('key shift+down arrow moves focus and selects', exampleFile, 'key-shift-down-arrow', async (t) => {
  t.plan(1);
  t.fail();
});

// Bug: https://github.com/w3c/aria-practices/issues/919
ariaTest.failing('key shift+up arrow moves focus and selects', exampleFile, 'key-shift-up-arrow', async (t) => {
  t.plan(1);
  t.fail();
});

// Bug: https://github.com/w3c/aria-practices/issues/919
ariaTest.failing('key control+shift+home moves focus and selects', exampleFile, 'key-control-shift-home', async (t) => {
  t.plan(1);
  t.fail();
});

// Bug: https://github.com/w3c/aria-practices/issues/919
ariaTest.failing('key control+shift+end moves focus and selects', exampleFile, 'key-control-shift-end', async (t) => {
  t.plan(1);
  t.fail();
});

// Bug: https://github.com/w3c/aria-practices/issues/919
ariaTest.failing('key control+A selects all options', exampleFile, 'key-control-a', async (t) => {
  t.plan(1);
  t.fail();
});
