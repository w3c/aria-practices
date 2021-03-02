const { ariaTest } = require('..');
const { By, Key } = require('selenium-webdriver');
const assertAttributeValues = require('../util/assertAttributeValues');
const assertAriaLabelledby = require('../util/assertAriaLabelledby');
const assertAriaRoles = require('../util/assertAriaRoles');

const exampleFile = 'combobox/combobox-select-only.html';

const ex = {
  comboSelector: '#combo1',
  listboxSelector: '#listbox1',
};

// Attributes
ariaTest('role="combobox"', exampleFile, 'combobox-role', async (t) => {
  await assertAriaRoles(t, 'ex1', 'combobox', '1', 'div');
});

ariaTest('role="listbox"', exampleFile, 'listbox-role', async (t) => {
  await assertAriaRoles(t, 'ex1', 'listbox', '1', 'div');
});

ariaTest('role "option"', exampleFile, 'option-role', async (t) => {
  // open combo
  await t.context.session.findElement(By.css(ex.comboSelector)).click();

  // query listbox children
  const options = await t.context.queryElements(
    t,
    `${ex.listboxSelector} > div`
  );
  await Promise.all(
    options.map(async (option) => {
      const role = await option.getAttribute('role');
      t.is(
        role,
        'option',
        'Immediate descendants of the listbox should have role="option"'
      );
    })
  );
});

ariaTest(
  'aria-labelledby on combobox',
  exampleFile,
  'combobox-aria-labelledby',
  async (t) => {
    await assertAriaLabelledby(t, ex.comboSelector);
  }
);

ariaTest(
  'aria-controls on combobox',
  exampleFile,
  'combobox-aria-controls',
  async (t) => {
    const controlledId = await t.context.session
      .findElement(By.css(ex.comboSelector))
      .getAttribute('aria-controls');

    t.truthy(controlledId, '"aria-controls" should exist on the combobox');

    const controlledRole = await t.context.session
      .findElement(By.id(controlledId))
      .getAttribute('role');

    t.is(
      controlledRole,
      'listbox',
      "The combobox's aria-controls attribute should point to a listbox"
    );
  }
);

ariaTest(
  'aria-expanded="false" when closed',
  exampleFile,
  'combobox-aria-expanded',
  async (t) => {
    const expanded = await t.context.session
      .findElement(By.css(ex.comboSelector))
      .getAttribute('aria-expanded');

    t.is(expanded, 'false', 'aria-expanded should be false by default');
  }
);

ariaTest(
  'click opens combobox and sets aria-expanded="true"',
  exampleFile,
  'combobox-aria-expanded',
  async (t) => {
    const combobox = await t.context.session.findElement(
      By.css(ex.comboSelector)
    );

    await combobox.click();
    const expanded = await combobox.getAttribute('aria-expanded');
    const popupDisplayed = await t.context.session
      .findElement(By.css(ex.listboxSelector))
      .isDisplayed();

    t.is(expanded, 'true', 'aria-expanded should be true when opened');
    t.true(popupDisplayed, 'listbox should be present after click');
  }
);

ariaTest(
  '"aria-activedescendant" on combobox element',
  exampleFile,
  'combobox-aria-activedescendant',
  async (t) => {
    const combobox = await t.context.session.findElement(
      By.css(ex.comboSelector)
    );
    const firstOption = await t.context.session.findElement(
      By.css(`${ex.listboxSelector} [role=option]`)
    );
    const optionId = await firstOption.getAttribute('id');

    await combobox.click();

    await assertAttributeValues(
      t,
      ex.comboSelector,
      'aria-activedescendant',
      optionId
    );
  }
);

ariaTest(
  '"aria-selected" attribute on first option',
  exampleFile,
  'option-aria-selected',
  async (t) => {
    const firstOption = await t.context.session.findElement(
      By.css(`${ex.listboxSelector} [role=option]`)
    );
    const secondOption = await t.context.session.findElement(
      By.css(`${ex.listboxSelector} [role=option]:nth-child(2)`)
    );

    t.is(
      await firstOption.getAttribute('aria-selected'),
      'true',
      'the first option is selected by default'
    );
    t.is(
      await secondOption.getAttribute('aria-selected'),
      'false',
      'other options have aria-selected set to false'
    );
  }
);

// Behavior

// Open listbox
ariaTest(
  'Alt + down arrow opens listbox',
  exampleFile,
  'combobox-key-alt-down-arrow',
  async (t) => {
    const combobox = await t.context.session.findElement(
      By.css(ex.comboSelector)
    );
    const listbox = await t.context.session.findElement(
      By.css(ex.listboxSelector)
    );
    const firstOptionId = await t.context.session
      .findElement(By.css(`${ex.listboxSelector} [role=option]`))
      .getAttribute('id');

    // listbox starts collapsed
    t.false(await listbox.isDisplayed(), 'Listbox should be hidden on load');

    // Send ALT + ARROW_DOWN to the combo
    await combobox.sendKeys(Key.chord(Key.ALT, Key.ARROW_DOWN));

    // Check that the listbox is displayed
    t.true(await listbox.isDisplayed(), 'alt + down should show the listbox');
    t.is(
      await combobox.getAttribute('aria-expanded'),
      'true',
      'aria-expanded should be true when opened'
    );

    // the first option should be selected
    t.is(
      await combobox.getAttribute('aria-activedescendant'),
      firstOptionId,
      'Alt + Down should highlight the first option'
    );
  }
);

ariaTest(
  'Up arrow opens listbox',
  exampleFile,
  'combobox-key-up-arrow',
  async (t) => {
    const combobox = await t.context.session.findElement(
      By.css(ex.comboSelector)
    );
    const listbox = await t.context.session.findElement(
      By.css(ex.listboxSelector)
    );
    const firstOptionId = await t.context.session
      .findElement(By.css(`${ex.listboxSelector} [role=option]`))
      .getAttribute('id');

    // listbox starts collapsed
    t.false(await listbox.isDisplayed(), 'Listbox should be hidden on load');

    // Send ARROW_UP to the combo
    await combobox.sendKeys(Key.ARROW_UP);

    // Check that the listbox is displayed
    t.true(await listbox.isDisplayed(), 'arrow up should show the listbox');
    t.is(
      await combobox.getAttribute('aria-expanded'),
      'true',
      'aria-expanded should be true when opened'
    );

    // the first option should be selected
    t.is(
      await combobox.getAttribute('aria-activedescendant'),
      firstOptionId,
      'arrow up should highlight the first option'
    );
  }
);

ariaTest(
  ' arrow opens listbox',
  exampleFile,
  'combobox-key-down-arrow',
  async (t) => {
    const combobox = await t.context.session.findElement(
      By.css(ex.comboSelector)
    );
    const listbox = await t.context.session.findElement(
      By.css(ex.listboxSelector)
    );
    const firstOptionId = await t.context.session
      .findElement(By.css(`${ex.listboxSelector} [role=option]`))
      .getAttribute('id');

    // listbox starts collapsed
    t.false(await listbox.isDisplayed(), 'Listbox should be hidden on load');

    // Send ARROW_DOWN to the combo
    await combobox.sendKeys(Key.ARROW_DOWN);

    // Check that the listbox is displayed
    t.true(await listbox.isDisplayed(), 'alt + down should show the listbox');
    t.is(
      await combobox.getAttribute('aria-expanded'),
      'true',
      'aria-expanded should be true when opened'
    );

    // the first option should be selected
    t.is(
      await combobox.getAttribute('aria-activedescendant'),
      firstOptionId,
      'Down arrow should highlight the first option'
    );
  }
);

ariaTest(
  'Enter opens listbox',
  exampleFile,
  'combobox-key-enter',
  async (t) => {
    const combobox = await t.context.session.findElement(
      By.css(ex.comboSelector)
    );
    const listbox = await t.context.session.findElement(
      By.css(ex.listboxSelector)
    );
    const firstOptionId = await t.context.session
      .findElement(By.css(`${ex.listboxSelector} [role=option]`))
      .getAttribute('id');

    // listbox starts collapsed
    t.false(await listbox.isDisplayed(), 'Listbox should be hidden on load');

    // Send ENTER to the combo
    await combobox.sendKeys(Key.ENTER);

    // Check that the listbox is displayed
    t.true(await listbox.isDisplayed(), 'enter should show the listbox');

    // the first option should be selected
    t.is(
      await combobox.getAttribute('aria-activedescendant'),
      firstOptionId,
      'enter should highlight the first option'
    );
  }
);

ariaTest(
  'Space opens listbox',
  exampleFile,
  'combobox-key-space',
  async (t) => {
    const combobox = await t.context.session.findElement(
      By.css(ex.comboSelector)
    );
    const listbox = await t.context.session.findElement(
      By.css(ex.listboxSelector)
    );
    const firstOptionId = await t.context.session
      .findElement(By.css(`${ex.listboxSelector} [role=option]`))
      .getAttribute('id');

    // listbox starts collapsed
    t.false(await listbox.isDisplayed(), 'Listbox should be hidden on load');

    // Send space to the combo
    await combobox.sendKeys(' ');

    // Check that the listbox is displayed
    t.true(await listbox.isDisplayed(), 'space should show the listbox');

    // the first option should be selected
    t.is(
      await combobox.getAttribute('aria-activedescendant'),
      firstOptionId,
      'space should highlight the first option'
    );
  }
);

ariaTest(
  'combobox opens on last highlighted option',
  exampleFile,
  'combobox-key-down-arrow',
  async (t) => {
    const combobox = await t.context.session.findElement(
      By.css(ex.comboSelector)
    );
    const listbox = await t.context.session.findElement(
      By.css(ex.listboxSelector)
    );
    const secondOptionId = await t.context.session
      .findElement(By.css(`${ex.listboxSelector} [role=option]:nth-child(2)`))
      .getAttribute('id');

    // Open, select second option, close
    await combobox.sendKeys(' ');
    await combobox.sendKeys(Key.ARROW_DOWN);
    await combobox.sendKeys(Key.ESCAPE);

    // Open again
    await combobox.sendKeys(' ');

    // Check that the listbox is displayed and second option is highlighted
    t.true(await listbox.isDisplayed(), 'space should show the listbox');
    t.is(
      await combobox.getAttribute('aria-activedescendant'),
      secondOptionId,
      'second option should be highlighted'
    );
  }
);

ariaTest(
  'Home opens listbox to first option',
  exampleFile,
  'combobox-key-home',
  async (t) => {
    const combobox = await t.context.session.findElement(
      By.css(ex.comboSelector)
    );
    const listbox = await t.context.session.findElement(
      By.css(ex.listboxSelector)
    );
    const firstOptionId = await t.context.session
      .findElement(By.css(`${ex.listboxSelector} [role=option]`))
      .getAttribute('id');

    // Open, select second option, close
    await combobox.sendKeys(' ');
    await combobox.sendKeys(Key.ARROW_DOWN);
    await combobox.sendKeys(Key.ESCAPE);

    // listbox is collapsed
    t.false(await listbox.isDisplayed(), 'Listbox should be hidden');

    // Send home key to the combo
    await combobox.sendKeys(Key.HOME);

    // Check that the listbox is displayed and first option is highlighted
    t.true(await listbox.isDisplayed(), 'home should show the listbox');
    t.is(
      await combobox.getAttribute('aria-activedescendant'),
      firstOptionId,
      'home should always highlight the first option'
    );
  }
);

ariaTest(
  'End opens listbox to last option',
  exampleFile,
  'combobox-key-end',
  async (t) => {
    const combobox = await t.context.session.findElement(
      By.css(ex.comboSelector)
    );
    const listbox = await t.context.session.findElement(
      By.css(ex.listboxSelector)
    );
    const options = await t.context.queryElements(
      t,
      `${ex.listboxSelector} [role=option]`
    );
    const lastOptionId = await options[options.length - 1].getAttribute('id');

    // Send end key to the combo
    await combobox.sendKeys(Key.END);

    // Check that the listbox is displayed and first option is highlighted
    t.true(await listbox.isDisplayed(), 'end should show the listbox');
    t.is(
      await combobox.getAttribute('aria-activedescendant'),
      lastOptionId,
      'end should always highlight the last option'
    );
  }
);

ariaTest(
  'character keys open listbox to matching option',
  exampleFile,
  'printable-chars',
  async (t) => {
    const combobox = await t.context.session.findElement(
      By.css(ex.comboSelector)
    );
    const listbox = await t.context.session.findElement(
      By.css(ex.listboxSelector)
    );
    const secondOptionId = await t.context.session
      .findElement(By.css(`${ex.listboxSelector} [role=option]:nth-child(2)`))
      .getAttribute('id');

    // type "a"
    await combobox.sendKeys('a');

    // Check that the listbox is displayed and the second option is highlighted
    // bit of hard-coding here; we know that the second option begins with "a", since the first is a placeholder
    t.true(
      await listbox.isDisplayed(),
      'character key should show the listbox'
    );
    t.is(
      await combobox.getAttribute('aria-activedescendant'),
      secondOptionId,
      'typing "a" should highlight the first option beginning with "a"'
    );
  }
);

// Close listbox
ariaTest(
  'click opens and closes listbox',
  exampleFile,
  'test-additional-behavior',
  async (t) => {
    const combobox = await t.context.session.findElement(
      By.css(ex.comboSelector)
    );
    const listbox = await t.context.session.findElement(
      By.css(ex.listboxSelector)
    );

    await combobox.click();
    t.true(
      await listbox.isDisplayed(),
      'listbox should be present after click'
    );

    await combobox.click();
    t.false(await listbox.isDisplayed(), 'second click should close listbox');
    t.is(
      await combobox.getAttribute('aria-expanded'),
      'false',
      'aria-expanded should be set to false after second click'
    );
  }
);

ariaTest(
  'clicking an option selects and closes',
  exampleFile,
  'test-additional-behavior',
  async (t) => {
    const combobox = await t.context.session.findElement(
      By.css(ex.comboSelector)
    );
    const listbox = await t.context.session.findElement(
      By.css(ex.listboxSelector)
    );
    const fourthOption = await t.context.session.findElement(
      By.css(`${ex.listboxSelector} [role=option]:nth-child(4)`)
    );

    await combobox.click();
    const fourthOptionText = await fourthOption.getText();
    t.true(
      await listbox.isDisplayed(),
      'listbox should be present after click'
    );

    await fourthOption.click();
    t.false(await listbox.isDisplayed(), 'option click should close listbox');
    t.is(
      await combobox.getText(),
      fourthOptionText,
      'Combobox inner text should match the clicked option'
    );
    t.is(
      await fourthOption.getAttribute('aria-selected'),
      'true',
      'Clicked option has aria-selected set to true'
    );
  }
);

ariaTest(
  'Enter closes listbox and selects option',
  exampleFile,
  'listbox-key-enter',
  async (t) => {
    const combobox = await t.context.session.findElement(
      By.css(ex.comboSelector)
    );
    const listbox = await t.context.session.findElement(
      By.css(ex.listboxSelector)
    );
    const thirdOption = await t.context.session.findElement(
      By.css(`${ex.listboxSelector} [role=option]:nth-child(3)`)
    );

    // Open, move to third option, hit enter
    await combobox.sendKeys(Key.ENTER, Key.ARROW_DOWN, Key.ARROW_DOWN);
    const thirdOptionText = await thirdOption.getText();
    await combobox.sendKeys(Key.ENTER);

    // listbox is collapsed and the value is set to the third option
    t.false(await listbox.isDisplayed(), 'Listbox should be hidden');
    t.is(
      await combobox.getAttribute('aria-expanded'),
      'false',
      'test aria-expanded on combo'
    );
    t.is(
      await combobox.getText(),
      thirdOptionText,
      'Combobox inner text should match the third option'
    );
    t.is(
      await thirdOption.getAttribute('aria-selected'),
      'true',
      'Third option has aria-selected set to true'
    );
  }
);

ariaTest(
  'Space closes listbox and selects option',
  exampleFile,
  'listbox-key-space',
  async (t) => {
    const combobox = await t.context.session.findElement(
      By.css(ex.comboSelector)
    );
    const listbox = await t.context.session.findElement(
      By.css(ex.listboxSelector)
    );
    const secondOption = await t.context.session.findElement(
      By.css(`${ex.listboxSelector} [role=option]:nth-child(2)`)
    );

    // Open, move to third option, hit space
    await combobox.sendKeys(Key.ENTER, Key.ARROW_DOWN);
    const secondOptionText = await secondOption.getText();
    await combobox.sendKeys(' ');

    // listbox is collapsed and the value is set to the third option
    t.false(await listbox.isDisplayed(), 'Listbox should be hidden');
    t.is(
      await combobox.getText(),
      secondOptionText,
      'Combobox inner text should match the second option'
    );
    t.is(
      await secondOption.getAttribute('aria-selected'),
      'true',
      'Second option has aria-selected set to true'
    );
  }
);

ariaTest(
  'Space closes listbox and selects option',
  exampleFile,
  'listbox-key-alt-up-arrow',
  async (t) => {
    const combobox = await t.context.session.findElement(
      By.css(ex.comboSelector)
    );
    const listbox = await t.context.session.findElement(
      By.css(ex.listboxSelector)
    );
    const secondOption = await t.context.session.findElement(
      By.css(`${ex.listboxSelector} [role=option]:nth-child(2)`)
    );

    // Open, move to third option, send ALT+UP ARROW
    await combobox.sendKeys(Key.ENTER, Key.ARROW_DOWN);
    const secondOptionText = await secondOption.getText();
    await combobox.sendKeys(Key.chord(Key.ALT, Key.ARROW_UP));

    // listbox is collapsed and the value is set to the third option
    t.false(await listbox.isDisplayed(), 'Listbox should be hidden');
    t.is(
      await combobox.getText(),
      secondOptionText,
      'Combobox inner text should match the second option'
    );
    t.is(
      await secondOption.getAttribute('aria-selected'),
      'true',
      'Second option has aria-selected set to true'
    );
  }
);

ariaTest(
  'Escape closes listbox without selecting option',
  exampleFile,
  'listbox-key-escape',
  async (t) => {
    const combobox = await t.context.session.findElement(
      By.css(ex.comboSelector)
    );
    const listbox = await t.context.session.findElement(
      By.css(ex.listboxSelector)
    );

    // Open, move to third option, hit enter
    await combobox.sendKeys(Key.ENTER, Key.ARROW_DOWN, Key.ARROW_DOWN);
    const firstOptionText = await t.context.session
      .findElement(By.css(`${ex.listboxSelector} [role=option]`))
      .getText();
    await combobox.sendKeys(Key.ESCAPE);

    // listbox is collapsed and the value is still set to the first option
    t.false(await listbox.isDisplayed(), 'Listbox should be hidden');
    t.is(
      await combobox.getText(),
      firstOptionText,
      'Combobox inner text should match the first option'
    );
  }
);

ariaTest(
  'Tab closes listbox and selects option',
  exampleFile,
  'listbox-key-tab',
  async (t) => {
    const combobox = await t.context.session.findElement(
      By.css(ex.comboSelector)
    );
    const listbox = await t.context.session.findElement(
      By.css(ex.listboxSelector)
    );
    const fourthOption = await t.context.session.findElement(
      By.css(`${ex.listboxSelector} [role=option]:nth-child(4)`)
    );

    // Open, move to fourth option, hit tab
    await combobox.sendKeys(
      Key.ENTER,
      Key.ARROW_DOWN,
      Key.ARROW_DOWN,
      Key.ARROW_DOWN
    );
    const fourthOptionText = await fourthOption.getText();
    await combobox.sendKeys(Key.TAB);

    // listbox is collapsed and the value is set to the fourth option
    t.false(await listbox.isDisplayed(), 'Listbox should be hidden');
    t.is(
      await combobox.getText(),
      fourthOptionText,
      'Combobox inner text should match the second option'
    );
    t.is(
      await fourthOption.getAttribute('aria-selected'),
      'true',
      'Fourth option has aria-selected set to true'
    );
  }
);

// Changing options
ariaTest(
  'Down arrow moves to next option',
  exampleFile,
  'listbox-key-down-arrow',
  async (t) => {
    const combobox = await t.context.session.findElement(
      By.css(ex.comboSelector)
    );
    const thirdOptionId = await t.context.session
      .findElement(By.css(`${ex.listboxSelector} [role=option]:nth-child(3)`))
      .getAttribute('id');

    // Open, press down arrow
    await combobox.click();
    await combobox.sendKeys(Key.ARROW_DOWN, Key.ARROW_DOWN);

    // Second option is highlighted
    t.is(
      await combobox.getAttribute('aria-activedescendant'),
      thirdOptionId,
      'aria-activedescendant points to the third option after two down arrows'
    );
  }
);

ariaTest(
  'Down arrow does not wrap after last option',
  exampleFile,
  'listbox-key-down-arrow',
  async (t) => {
    const combobox = await t.context.session.findElement(
      By.css(ex.comboSelector)
    );
    const lastOptionId = await t.context.session
      .findElement(By.css(`${ex.listboxSelector} [role=option]:last-child`))
      .getAttribute('id');

    // Open, press end, press down arrow
    await combobox.click();
    await combobox.sendKeys(Key.END, Key.ARROW_DOWN);

    // last option is highlighted
    t.is(
      await combobox.getAttribute('aria-activedescendant'),
      lastOptionId,
      'aria-activedescendant points to the last option after end + down arrow'
    );
  }
);

ariaTest(
  'Up arrow does not wrap from first option',
  exampleFile,
  'listbox-key-up-arrow',
  async (t) => {
    const combobox = await t.context.session.findElement(
      By.css(ex.comboSelector)
    );
    const firstOptionId = await t.context.session
      .findElement(By.css(`${ex.listboxSelector} [role=option]:first-child`))
      .getAttribute('id');

    // Open, press up arrow
    await combobox.click();
    await combobox.sendKeys(Key.ARROW_UP);

    // first option is highlighted
    t.is(
      await combobox.getAttribute('aria-activedescendant'),
      firstOptionId,
      'aria-activedescendant points to the first option after up arrow'
    );
  }
);

ariaTest(
  'Up arrow moves to previous option',
  exampleFile,
  'listbox-key-up-arrow',
  async (t) => {
    const combobox = await t.context.session.findElement(
      By.css(ex.comboSelector)
    );
    const options = await t.context.queryElements(
      t,
      `${ex.listboxSelector} [role=option]`
    );
    const optionId = await options[options.length - 2].getAttribute('id');

    // Open, press end + up arrow
    await combobox.click();
    await combobox.sendKeys(Key.END, Key.ARROW_UP);

    // second to last option is highlighted
    t.is(
      await combobox.getAttribute('aria-activedescendant'),
      optionId,
      'aria-activedescendant points to the second-to-last option after end + up arrow'
    );
  }
);

ariaTest(
  'End moves to last option',
  exampleFile,
  'listbox-key-end',
  async (t) => {
    const combobox = await t.context.session.findElement(
      By.css(ex.comboSelector)
    );
    const lastOptionId = await t.context.session
      .findElement(By.css(`${ex.listboxSelector} [role=option]:last-child`))
      .getAttribute('id');

    // Open, press end
    await combobox.click();
    await combobox.sendKeys(Key.END);

    // last option is highlighted
    t.is(
      await combobox.getAttribute('aria-activedescendant'),
      lastOptionId,
      'aria-activedescendant points to the last option after end'
    );
  }
);

ariaTest(
  'End scrolls last option into view',
  exampleFile,
  'test-additional-behavior',
  async (t) => {
    const combobox = await t.context.session.findElement(
      By.css(ex.comboSelector)
    );
    const listbox = await t.context.session.findElement(
      By.css(ex.listboxSelector)
    );
    const options = await t.context.queryElements(
      t,
      `${ex.listboxSelector} [role=option]`
    );

    await combobox.click();

    let listboxBounds = await listbox.getRect();
    let optionBounds = await options[options.length - 1].getRect();

    t.true(
      listboxBounds.y + listboxBounds.height - optionBounds.y < 0,
      'last option is not initially displayed'
    );

    await combobox.sendKeys(Key.END);
    listboxBounds = await listbox.getRect();
    optionBounds = await options[options.length - 1].getRect();

    t.true(
      listboxBounds.y + listboxBounds.height - optionBounds.y >= 0,
      'last option is in view after end key'
    );
  }
);

ariaTest(
  'Home moves to first option',
  exampleFile,
  'listbox-key-home',
  async (t) => {
    const combobox = await t.context.session.findElement(
      By.css(ex.comboSelector)
    );
    const firstOptionId = await t.context.session
      .findElement(By.css(`${ex.listboxSelector} [role=option]:first-child`))
      .getAttribute('id');

    // Open, press down a couple times, then home
    await combobox.click();
    await combobox.sendKeys(Key.ARROW_DOWN, Key.ARROW_DOWN, Key.HOME);

    // first option is highlighted
    t.is(
      await combobox.getAttribute('aria-activedescendant'),
      firstOptionId,
      'aria-activedescendant points to the first option after home'
    );
  }
);

ariaTest(
  'PageDown moves 10 options, and does not wrap',
  exampleFile,
  'listbox-key-pagedown',
  async (t) => {
    const combobox = await t.context.session.findElement(
      By.css(ex.comboSelector)
    );
    const options = await t.context.queryElements(
      t,
      `${ex.listboxSelector} [role=option]`
    );

    // Open, press page down
    await combobox.click();
    await combobox.sendKeys(Key.PAGE_DOWN);

    // 11th option is highlighted
    let optionId = await options[10].getAttribute('id');
    t.is(
      await combobox.getAttribute('aria-activedescendant'),
      optionId,
      'aria-activedescendant points to the 10th option after pagedown'
    );

    // last option is highlighted
    await combobox.sendKeys(Key.PAGE_DOWN);
    optionId = await options[options.length - 1].getAttribute('id');
    t.is(
      await combobox.getAttribute('aria-activedescendant'),
      optionId,
      'aria-activedescendant points to the last option after second pagedown'
    );
  }
);

ariaTest(
  'PageUp moves up 10 options, and does not wrap',
  exampleFile,
  'listbox-key-pageup',
  async (t) => {
    const combobox = await t.context.session.findElement(
      By.css(ex.comboSelector)
    );
    const options = await t.context.queryElements(
      t,
      `${ex.listboxSelector} [role=option]`
    );

    // Open, press end then page up
    await combobox.click();
    await combobox.sendKeys(Key.END, Key.PAGE_UP);

    // 11th-from-last option is highlighted
    let optionId = await options[options.length - 11].getAttribute('id');
    t.is(
      await combobox.getAttribute('aria-activedescendant'),
      optionId,
      'aria-activedescendant points to the 10th-from-last option after end + pageup'
    );

    // first option is highlighted
    await combobox.sendKeys(Key.PAGE_UP);
    optionId = await options[0].getAttribute('id');
    t.is(
      await combobox.getAttribute('aria-activedescendant'),
      optionId,
      'aria-activedescendant points to the first option after second pageup'
    );
  }
);

ariaTest(
  'Multiple single-character presses cycle through options',
  exampleFile,
  'printable-chars',
  async (t) => {
    const combobox = await t.context.session.findElement(
      By.css(ex.comboSelector)
    );
    const options = await t.context.queryElements(
      t,
      `${ex.listboxSelector} [role=option]`
    );

    // Open, then type "a"
    await combobox.click();

    // get indices of matching options
    const optionNames = await Promise.all(
      options.map(async (option) => {
        return await option.getText();
      })
    );
    const matchingOps = optionNames
      .filter((name) => name[0].toLowerCase() === 'b')
      .map((name) => optionNames.indexOf(name));

    // type b, check first matching op is highlighted
    await combobox.sendKeys('b');
    let matchingId = await options[matchingOps[0]].getAttribute('id');
    t.is(
      await combobox.getAttribute('aria-activedescendant'),
      `${matchingId}`,
      'aria-activedescendant points to the first option beginning with "b"'
    );

    // type b again, second matching option is highlighted
    await combobox.sendKeys('b');
    matchingId = await options[matchingOps[1]].getAttribute('id');
    t.is(
      await combobox.getAttribute('aria-activedescendant'),
      `${matchingId}`,
      'aria-activedescendant points to the second option beginning with "b"'
    );

    // type "b" as many times as there are matching options
    // focus should wrap and end up on second option again
    const keys = matchingOps.map(() => 'b');
    await combobox.sendKeys(...keys);
    matchingId = await options[matchingOps[1]].getAttribute('id');
    t.is(
      await combobox.getAttribute('aria-activedescendant'),
      `${matchingId}`,
      'aria-activedescendant points to the second option beginning with "b"'
    );
  }
);

ariaTest(
  'Typing multiple characters refines search',
  exampleFile,
  'printable-chars',
  async (t) => {
    const combobox = await t.context.session.findElement(
      By.css(ex.comboSelector)
    );
    const options = await t.context.queryElements(
      t,
      `${ex.listboxSelector} [role=option]`
    );

    await combobox.click();

    // get info about the fourth option
    const fourthName = await options[3].getText();
    const fourthId = await options[3].getAttribute('id');

    // type first letter
    await combobox.sendKeys(fourthName[0]);

    // fourth op should not be highlighted after only first letter
    t.not(
      await combobox.getAttribute('aria-activedescendant'),
      fourthId,
      'The fourth option is not highlighted after typing only the first letter'
    );

    // type more letters
    await combobox.sendKeys(...fourthName.slice(1, 4).split(''));

    // now fourth option should be highlighted
    t.is(
      await combobox.getAttribute('aria-activedescendant'),
      fourthId,
      'The fourth option is highlighted after typing multiple letters'
    );
  }
);
