'use strict';

const { ariaTest } = require('..');
const { By, Key } = require('selenium-webdriver');
const assertAttributeValues = require('../util/assertAttributeValues');
const assertAriaLabelledby = require('../util/assertAriaLabelledby');
const assertAriaSelectedAndActivedescendant = require('../util/assertAriaSelectedAndActivedescendant');

const exampleFile = 'combobox/aria1.1pattern/listbox-combo.html';

const pageExamples = {
  'ex1': {
    comboboxSelector: '#ex1 [role="combobox"]',
    textboxSelector: '#ex1 input[type="text"]',
    listboxSelector: '#ex1 [role="listbox"]',
    optionsSelector: '#ex1 [role="option"]'
  },
  'ex2': {
    comboboxSelector: '#ex2 [role="combobox"]',
    textboxSelector: '#ex2 input[type="text"]',
    listboxSelector: '#ex2 [role="listbox"]',
    optionsSelector: '#ex2 [role="option"]'
  },
  'ex3': {
    comboboxSelector: '#ex3 [role="combobox"]',
    textboxSelector: '#ex3 input[type="text"]',
    listboxSelector: '#ex3 [role="listbox"]',
    optionsSelector: '#ex3 [role="option"]'
  }
};

const reload = async (session) => {
  return session.get(await session.getCurrentUrl());
};

const waitForFocusChange = async (t, textboxSelector, originalFocus) => {
  await t.context.session.wait(async function () {
    let newfocus = t.context.session
      .findElement(By.css(textboxSelector))
      .getAttribute('aria-activedescendant');
    return newfocus != originalFocus;
  }, 200);
};


// Attributes

ariaTest('Test for role="combobox"', exampleFile, 'combobox-role', async (t) => {

  t.plan(6);

  for (let exId in pageExamples) {
    let ex =  pageExamples[exId];
    const comboboxLocator = By.css(ex.comboboxSelector);
    const comboboxes = await t.context.session.findElements(comboboxLocator);
    t.is(
      comboboxes.length,
      1,
      'One "role=combobox" element should be found by selector: ' + ex.gridSelector
    );

    t.is(
      await comboboxes[0].getTagName(),
      'div',
      '"role=combobox" should be found on a "div": ' + ex.gridSelector
    );
  }
});

ariaTest('Test aria-haspopup="listbox" on combobox',
  exampleFile, 'aria-haspopup', async (t) => {

    t.plan(3);

    for (let exId in pageExamples) {
      let ex =  pageExamples[exId];
      await assertAttributeValues(
        t, ex.comboboxSelector, 'aria-haspopup', 'listbox');
    }

  });

ariaTest('Test "aria-owns" attributes on combobox',
  exampleFile, 'aria-owns', async (t) => {

    t.plan(6);

    for (let exId in pageExamples) {
      let ex =  pageExamples[exId];

      const popupId = await t.context.session
        .findElement(By.css(ex.comboboxSelector))
        .getAttribute('aria-owns');

      t.truthy(
        popupId,
        '"aria-owns" attribute should exist on: ' + ex.comboboxSelector
      );

      const popupElement = await t.context.session
        .findElement(By.id(exId))
        .findElement(By.id(popupId));

      t.is(
        await popupElement.getAttribute('role'),
        'listbox',
        'Element with id "' + popupId + '" should have role="listbox"'
      );
    }

  });

ariaTest('Test aria-expanded on listbox correlates with listbox',
  exampleFile, 'aria-expanded', async (t) => {

    t.plan(12);

    for (let exId in pageExamples) {
      let ex =  pageExamples[exId];
      const comboboxLocator = By.css(ex.comboboxSelector);
      const combobox = await t.context.session.findElement(comboboxLocator);

      // Check that aria-expanded is false and the listbox is not visible before interacting

      t.is(
        await combobox.getAttribute('aria-expanded'),
        'false',
        'combobox element should have attribute "aria-expand" set to false by default.'
      );

      const popupId = await t.context.session
        .findElement(By.css(ex.comboboxSelector))
        .getAttribute('aria-owns');

      const popupElement = await t.context.session
        .findElement(By.id(exId))
        .findElement(By.id(popupId));

      t.false(
        await popupElement.isDisplayed(),
        'Popup element should not be displayed when \'aria-expanded\' is false\''
      );

      // Send key "a" to textbox

      await t.context.session
        .findElement(By.css(ex.textboxSelector))
        .sendKeys('a');

      // Check that aria-expanded is true and the listbox is visible

      t.is(
        await combobox.getAttribute('aria-expanded'),
        'true',
        'combobox element should have attribute "aria-expand" set to true after typing.'
      );

      t.true(
        await popupElement.isDisplayed(),
        'Popup element should be displayed when \'aria-expanded\' is true\''
      );

    }
  });

ariaTest('Test id attribute on textbox referred to by label element',
  exampleFile, 'textbox-id', async (t) => {

    t.plan(9);

    for (let exId in pageExamples) {
      let ex =  pageExamples[exId];

      const labelEl = await t.context.session.findElement(By.css('#' + exId + ' label'));
      const textboxEl = await t.context.session.findElement(By.css(ex.textboxSelector));

      t.truthy(
        await labelEl.getAttribute('for'),
        'Attribute "for" should exist on label element in example: ' + exId
      );

      t.truthy(
        await textboxEl.getAttribute('id'),
        'Attribute "id" should exist on textbox element: ' + exId
      );

      t.true(
        await labelEl.getAttribute('for') === await textboxEl.getAttribute('id'),
        'Attribute "for" on label element should match the "id" on the textbox element in example:' + exId
      );
    }
  });

ariaTest('Test aria-autocomplete="list" attribute on textbox',
  exampleFile, 'aria-autocomplete-list', async (t) => {

    t.plan(4);

    for (let exId of ['ex1', 'ex2']) {
      let ex =  pageExamples[exId];

      await assertAttributeValues(t, ex.textboxSelector, 'aria-autocomplete', 'list');

      // Send key

      const character = 'a';
      await t.context.session
        .findElement(By.css(ex.textboxSelector))
        .sendKeys(character);

      // check that there is no autocompletion in text box

      const newTextboxValue = await t.context.session
        .findElement(By.css(ex.textboxSelector))
        .getAttribute('value');

      t.is(
        newTextboxValue,
        character,
        'Example ' + exId + ' with aria-autocomplete="list" should not autocomplete word in textbox'
      );

      // TODO: can we test that only the "relevent" data is shown, per the example page description?
    }


  });


ariaTest('Test aria-autocomplete="both" attribute on textbox',
  exampleFile, 'aria-autocomplete-both', async (t) => {

    t.plan(2);

    const exId = 'ex3';
    let ex =  pageExamples[exId];

    await assertAttributeValues(t, ex.textboxSelector, 'aria-autocomplete', 'both');

    // Send key

    const character = 'a';
    await t.context.session
      .findElement(By.css(ex.textboxSelector))
      .sendKeys(character);

    // Check that there is autocompconstion in text box

    const newTextboxValue = await t.context.session
      .findElement(By.css(ex.textboxSelector))
      .getAttribute('value');

    t.true(
      newTextboxValue.length > character.length,
      'Example ' + exId + ' with aria-autocomplete="list" should autocomplete word in textbox'
    );

    // TODO: can we test that only the "relevent" data is shown, per the example page description?

  });


ariaTest('Test aria-controls attribute on textbox',
  exampleFile, 'textbox-aria-controls', async (t) => {

    t.plan(6);

    for (let exId in pageExamples) {
      let ex =  pageExamples[exId];

      const popupId = await t.context.session
        .findElement(By.css(ex.textboxSelector))
        .getAttribute('aria-controls');

      t.truthy(
        popupId,
        '"aria-controls" attribute should exist on: ' + ex.textboxSelector
      );

      const popupElement = await t.context.session
        .findElement(By.id(exId))
        .findElement(By.id(popupId));

      t.is(
        await popupElement.getAttribute('role'),
        'listbox',
        'Element with id "' + popupId + '" should have role="listbox"'
      );
    }
  });

ariaTest('Test initial aria-activedescendant value on textbox',
  exampleFile, 'textbox-aria-activedescendant', async (t) => {

    t.plan(3);

    for (let exId in pageExamples) {
      let ex =  pageExamples[exId];

      await assertAttributeValues(t, ex.textboxSelector, 'aria-activedescendant', null);
    }
  });


ariaTest('Test for role="listbox"',
  exampleFile, 'listbox-role', async (t) => {

    t.plan(6);

    for (let exId in pageExamples) {
      let ex =  pageExamples[exId];
      const listboxLocator = By.css(ex.listboxSelector);
      const listboxes = await t.context.session.findElements(listboxLocator);
      t.is(
        listboxes.length,
        1,
        'One "role=listbox" element should be found by selector: ' + ex.gridSelector
      );

      t.is(
        await listboxes[0].getTagName(),
        'ul',
        '"role=listbox" should be found on a "ul": ' + ex.gridSelector
      );
    }
  });


ariaTest('Test aria-labelledby attribute on listbox',
  exampleFile, 'listbox-aria-labelledby', async (t) => {

    t.plan(3);

    for (let exId in pageExamples) {
      let ex =  pageExamples[exId];
      await assertAriaLabelledby(t, exId, ex.listboxSelector);
    }

  });

ariaTest('Test for role="option" on li',
  exampleFile, 'option-role', async (t) => {

    t.plan(12);

    for (let exId in pageExamples) {
      let ex =  pageExamples[exId];

      // Send key "a" to trigger listbox

      await t.context.session
        .findElement(By.css(ex.textboxSelector))
        .sendKeys('a');

      // Check for existence of role="option" elements

      const listbox = await t.context.session
        .findElement(By.css(ex.listboxSelector));

      const options = await listbox.findElements(By.css('[role="option"]'));

      t.truthy(
        options.length,
        'Elements with [option="role"] should appear after sending key "a" to element: ' + ex.listboxSelector
      );

      for (let option of options) {
        t.is(
          await option.getTagName(),
          'li',
          '"role=option" should be found on a "li": ' + ex.gridSelector
        );
      }
    }
  });

ariaTest('Test for aria-selected on option element',
  exampleFile, 'option-aria-selected', async (t) => {

    t.plan(3);

    /* Example 1 */

    let ex =  pageExamples.ex1;

    // Send key "a" to textbox

    await t.context.session
      .findElement(By.css(ex.textboxSelector))
      .sendKeys('a');

    // Check that no role="option" element has aria-select="true"

    let listbox = await t.context.session
      .findElement(By.css(ex.listboxSelector));

    let options = await listbox.findElements(By.css('[role="option"][aria-selected="true"]'));

    t.is(
      options.length,
      0,
      'In example ex1, no element with role="option" should have aria-select="true" by default'
    );

    /* Example 2 and 3 */

    for (let exId of ['ex2', 'ex3']) {
      ex = pageExamples[exId];

      // Send key "a" to textbox

      await t.context.session
        .findElement(By.css(ex.textboxSelector))
        .sendKeys('a');

      // Check that the first role="option" element has aria-select="true"

      listbox = await t.context.session
        .findElement(By.css(ex.listboxSelector));

      options = await listbox.findElements(By.css('[role="option"][aria-selected="true"]'));

      t.is(
        options.length,
        1,
        'In example "' + exId + '" one element with role="option" should have aria-selected="true"'
      );
    }

  });


// Keys

ariaTest('Test down key press with focus on textbox',
  exampleFile, 'textbox-key-down-arrow', async (t) => {

    t.plan(7);

    // Test assumptions: the number of options in the listbox after typing "a"
    const numOptions = 3;

    /* Example 1 */

    let ex =  pageExamples.ex1;

    // Send ARROW_DOWN to textbox
    await t.context.session
      .findElement(By.css(ex.textboxSelector))
      .sendKeys(Key.ARROW_DOWN);

    // Check that the listbox is not displayed
    t.falsy(
      await t.context.session.findElement(By.css(ex.listboxSelector)).isDisplayed(),
      'In example ex1 listbox should not display after ARROW_DOWN keypress'
    );

    await reload(t.context.session);

    // Send 'a' to text box, then send ARROW_DOWN to text box
    await t.context.session
      .findElement(By.css(ex.textboxSelector))
      .sendKeys('a', Key.ARROW_DOWN);

    // Check that the active descendent focus is correct
    await assertAriaSelectedAndActivedescendant(t, ex.textboxSelector, ex.optionsSelector, 0);

    /* Example 2 */

    ex = pageExamples.ex2;

    // Send ARROW_DOWN to the textbox
    await t.context.session
      .findElement(By.css(ex.textboxSelector))
      .sendKeys(Key.ARROW_DOWN);

    // Check that the listbox is not displayed
    t.falsy(
      await t.context.session.findElement(By.css(ex.listboxSelector)).isDisplayed(),
      'In example ex2 listbox should not display after ARROW_DOWN keypress'
    );

    await reload(t.context.session);

    // Send 'a' to text box, then send ARROW_DOWN to text box
    await t.context.session
      .findElement(By.css(ex.textboxSelector))
      .sendKeys('a', Key.ARROW_DOWN);

    // Check that the active descendent focus is correct
    await assertAriaSelectedAndActivedescendant(t, ex.textboxSelector, ex.optionsSelector, 1);

    /* Example 3 */

    ex = pageExamples.ex3;

    // Send ARROW_DOWN to the textbox
    await t.context.session
      .findElement(By.css(ex.textboxSelector))
      .sendKeys(Key.ARROW_DOWN);

    // Check that the listbox is displayed
    t.truthy(
      await t.context.session.findElement(By.css(ex.listboxSelector)).isDisplayed(),
      'In example ex3 listbox should display after ARROW_DOWN keypress'
    );

    // Check that the active descendent focus is correct
    await assertAriaSelectedAndActivedescendant(t, ex.textboxSelector, ex.optionsSelector, 0);

    await reload(t.context.session);

    // Send 'a' to text box, then send ARROW_DOWN to text box
    await t.context.session
      .findElement(By.css(ex.textboxSelector))
      .sendKeys('a', Key.ARROW_DOWN);

    // Check that the active descendent focus is correct
    await assertAriaSelectedAndActivedescendant(t, ex.textboxSelector, ex.optionsSelector, 1);

  });

ariaTest('Test down key press with focus on list',
  exampleFile, 'listbox-key-down-arrow', async (t) => {

    t.plan(7);

    // Test assumptions: the number of options in the listbox after typing "a"
    const numOptions = 3;

    /* Example 1 */

    let ex =  pageExamples.ex1;

    // Send 'a' to text box, then send ARROW_DOWN to textbox to set focus on listbox
    await t.context.session
      .findElement(By.css(ex.textboxSelector))
      .sendKeys('a', Key.ARROW_DOWN);

    // Test that ARROW_DOWN moves active descendant focus on item in listbox
    for (let i = 1; i < numOptions + 1; i++) {
      let oldfocus = t.context.session
        .findElement(By.css(ex.textboxSelector))
        .getAttribute('aria-activedescendant');

      await t.context.session
        .findElement(By.css(ex.textboxSelector))
        .sendKeys(Key.ARROW_DOWN);

      // Account for race condition
      await waitForFocusChange(t, ex.textboxSelector, oldfocus);

      await assertAriaSelectedAndActivedescendant(t, ex.textboxSelector, ex.optionsSelector, i % numOptions);
    }

    /* Example 2 */

    ex = pageExamples.ex2;

    // Send 'a' to text box, then send ARROW_DOWN to textbox to set focus on listbox
    await t.context.session
      .findElement(By.css(ex.textboxSelector))
      .sendKeys('a', Key.ARROW_DOWN);

    // Test that ARROW_DOWN moves active descendant focus on item in listbox
    for (let i = 2; i < numOptions + 1; i++) {
      let oldfocus = t.context.session
        .findElement(By.css(ex.textboxSelector))
        .getAttribute('aria-activedescendant');

      await t.context.session
        .findElement(By.css(ex.textboxSelector))
        .sendKeys(Key.ARROW_DOWN);

      // Account for race condition
      await waitForFocusChange(t, ex.textboxSelector, oldfocus);

      await assertAriaSelectedAndActivedescendant(t, ex.textboxSelector, ex.optionsSelector, i % numOptions);
    }

    /* Example 3 */

    ex = pageExamples.ex3;

    // Send 'a' to text box, then send ARROW_DOWN to textbox to set focus on listbox
    await t.context.session
      .findElement(By.css(ex.textboxSelector))
      .sendKeys('a', Key.ARROW_DOWN);

    // Test that ARROW_DOWN moves active descendant focus on item in listbox
    for (let i = 2; i < numOptions + 1; i++) {
      let oldfocus = t.context.session
        .findElement(By.css(ex.textboxSelector))
        .getAttribute('aria-activedescendant');

      await t.context.session
        .findElement(By.css(ex.textboxSelector))
        .sendKeys(Key.ARROW_DOWN);

      // Account for race condition
      await waitForFocusChange(t, ex.textboxSelector, oldfocus);

      await assertAriaSelectedAndActivedescendant(t, ex.textboxSelector, ex.optionsSelector, i % numOptions);
    }

  });


ariaTest('Test up key press with focus on textbox',
  exampleFile, 'textbox-key-up-arrow', async (t) => {

    t.plan(7);

    /* Example 1 */

    let ex =  pageExamples.ex1;

    // Send ARROW_UP to textbox
    await t.context.session
      .findElement(By.css(ex.textboxSelector))
      .sendKeys(Key.ARROW_UP);

    // Check that the listbox is not displayed
    t.falsy(
      await t.context.session.findElement(By.css(ex.listboxSelector)).isDisplayed(),
      'In example ex1 listbox should not display after ARROW_UP keypress'
    );

    await reload(t.context.session);

    // Send 'a' to text box, then send ARROW_UP to text box
    await t.context.session
      .findElement(By.css(ex.textboxSelector))
      .sendKeys('a', Key.ARROW_UP);

    // Check that the active descendent focus is correct
    let numOptions = (await t.context.session.findElements(By.css(ex.optionsSelector))).length;
    await assertAriaSelectedAndActivedescendant(t, ex.textboxSelector, ex.optionsSelector, numOptions - 1);

    /* Example 2 */

    ex = pageExamples.ex2;

    // Send ARROW_UP to the textbox
    await t.context.session
      .findElement(By.css(ex.textboxSelector))
      .sendKeys(Key.ARROW_UP);

    // Check that the listbox is not displayed
    t.falsy(
      await t.context.session.findElement(By.css(ex.listboxSelector)).isDisplayed(),
      'In example ex2 listbox should not display after ARROW_UP keypress'
    );

    await reload(t.context.session);

    // Send 'a' to text box, then send ARROW_UP to text box
    await t.context.session
      .findElement(By.css(ex.textboxSelector))
      .sendKeys('a', Key.ARROW_UP);

    // Check that the active descendent focus is correct
    numOptions = (await t.context.session.findElements(By.css(ex.optionsSelector))).length;
    await assertAriaSelectedAndActivedescendant(t, ex.textboxSelector, ex.optionsSelector, numOptions - 1);

    /* Example 3 */

    ex = pageExamples.ex3;

    // Send ARROW_UP to the textbox
    await t.context.session
      .findElement(By.css(ex.textboxSelector))
      .sendKeys(Key.ARROW_UP);

    // Check that the listbox is displayed
    t.truthy(
      await t.context.session.findElement(By.css(ex.listboxSelector)).isDisplayed(),
      'In example ex3 listbox should display after ARROW_UP keypress'
    );

    // Check that the active descendent focus is correct
    numOptions = (await t.context.session.findElements(By.css(ex.optionsSelector))).length;
    await assertAriaSelectedAndActivedescendant(t, ex.textboxSelector, ex.optionsSelector, numOptions - 1);

    await reload(t.context.session);

    // Send 'a' to text box, then send ARROW_UP to text box
    await t.context.session
      .findElement(By.css(ex.textboxSelector))
      .sendKeys('a', Key.ARROW_UP);

    // Check that the active descendent focus is correct
    numOptions = (await t.context.session.findElements(By.css(ex.optionsSelector))).length;
    await assertAriaSelectedAndActivedescendant(t, ex.textboxSelector, ex.optionsSelector, numOptions - 1);

  });


ariaTest('Test up key press with focus on listbox',
  exampleFile, 'listbox-key-up-arrow', async (t) => {

    t.plan(9);

    /* Example 1 */

    let ex =  pageExamples.ex1;

    // Send 'a' to text box, then send ARROW_UP to textbox to put focus in textbox
    await t.context.session
      .findElement(By.css(ex.textboxSelector))
      .sendKeys('a', Key.ARROW_UP);

    // Test that ARROW_UP moves active descendant focus on item in listbox
    let numOptions = (await t.context.session.findElements(By.css(ex.optionsSelector))).length;
    for (let i = 1; i < numOptions + 1; i++) {
      let oldfocus = t.context.session
        .findElement(By.css(ex.textboxSelector))
        .getAttribute('aria-activedescendant');

      await t.context.session
        .findElement(By.css(ex.textboxSelector))
        .sendKeys(Key.ARROW_UP);

      // Account for race conditon
      await waitForFocusChange(t, ex.textboxSelector, oldfocus);

      const index = numOptions - 1 - (i % numOptions);
      await assertAriaSelectedAndActivedescendant(t, ex.textboxSelector, ex.optionsSelector, index);
    }

    /* Example 2 */

    ex = pageExamples.ex2;

    // Send 'a' to text box, then send ARROW_UP to textbox to textbox to put focus in textbox
    await t.context.session
      .findElement(By.css(ex.textboxSelector))
      .sendKeys('a', Key.ARROW_UP);

    // Test that ARROW_UP moves active descendant focus on item in listbox
    numOptions = (await t.context.session.findElements(By.css(ex.optionsSelector))).length;
    for (let i = 1; i < numOptions + 1; i++) {
      let oldfocus = t.context.session
        .findElement(By.css(ex.textboxSelector))
        .getAttribute('aria-activedescendant');

      // Send Key
      await t.context.session
        .findElement(By.css(ex.textboxSelector))
        .sendKeys(Key.ARROW_UP);

      // Account for race condition
      await waitForFocusChange(t, ex.textboxSelector, oldfocus);

      const index = numOptions - 1 - (i % numOptions);
      await assertAriaSelectedAndActivedescendant(t, ex.textboxSelector, ex.optionsSelector, index);
    }

    /* Example 3 */

    ex = pageExamples.ex3;

    // Send 'a' to text box, then send ARROW_UP to textbox to textbox to put focus in textbox
    await t.context.session
      .findElement(By.css(ex.textboxSelector))
      .sendKeys('a', Key.ARROW_UP);

    // Test that ARROW_UP moves active descendant focus on item in listbox
    numOptions = (await t.context.session.findElements(By.css(ex.optionsSelector))).length;
    for (let i = 1; i < numOptions + 1; i++) {
      let oldfocus = t.context.session
        .findElement(By.css(ex.textboxSelector))
        .getAttribute('aria-activedescendant');

      // Send Key
      await t.context.session
        .findElement(By.css(ex.textboxSelector))
        .sendKeys(Key.ARROW_UP);

      // Account for race condition
      await waitForFocusChange(t, ex.textboxSelector, oldfocus);

      const index = numOptions - 1 - (i % numOptions);
      await assertAriaSelectedAndActivedescendant(t, ex.textboxSelector, ex.optionsSelector, index);
    }
  });

ariaTest('Test enter key press with focus on textbox',
  exampleFile, 'key-enter', async (t) => {

    t.plan(6);

    /* Example 1 */

    let ex =  pageExamples.ex1;

    // Send key "a", then key ENTER to textbox

    await t.context.session
      .findElement(By.css(ex.textboxSelector))
      .sendKeys('a', Key.ENTER);

    // Confirm that the listbox is still open

    await assertAttributeValues(t, ex.comboboxSelector, 'aria-expanded', 'true');

    // Confirm that the value in the textbox is the same

    t.is(
      await t.context.session
        .findElement(By.css(ex.textboxSelector))
        .getAttribute('value'),
      'a',
      'In ex1 textbox, key press "ENTER" should have no effect on value in textbox'
    );

    /* Example 2 and 3 */

    for (let exId of ['ex2', 'ex3']) {
      ex = pageExamples[exId];

      // Send key "a" to the textbox

      await t.context.session
        .findElement(By.css(ex.textboxSelector))
        .sendKeys('a');

      // Get the value of the first option in the listbox

      const firstOption = await t.context.session.findElement(By.css(ex.optionsSelector)).getText();

      // Send key ENTER

      await t.context.session
        .findElement(By.css(ex.textboxSelector))
        .sendKeys(Key.ENTER);

      // Confirm that the listbox is still open

      await assertAttributeValues(t, ex.comboboxSelector, 'aria-expanded', 'false');

      // Confirm that the value of the textbox is now set to the first option

      t.is(
        await t.context.session
          .findElement(By.css(ex.textboxSelector))
          .getAttribute('value'),
        firstOption,
        'In ' + exId + 'textbox,  key press "ENTER" should result in first option in textbox'
      );
    }
  });

ariaTest('Test escape key press with focus on textbox',
  exampleFile, 'textbox-key-escape', async (t) => {

    for (let exId in pageExamples) {
      let ex =  pageExamples[exId];

      // Send key "a", then key ESCAPE to the textbox

      await t.context.session
        .findElement(By.css(ex.textboxSelector))
        .sendKeys('a', Key.ESCAPE);

      // Confirm the listbox is closed and the textboxed is clearedx

      await assertAttributeValues(t, ex.comboboxSelector, 'aria-expanded', 'false');
      t.is(
        await t.context.session
          .findElement(By.css(ex.textboxSelector))
          .getAttribute('value'),
        '',
        'In ' + exId + 'textbox,  key press "ENTER" should result in first option in textbox'
      );
    }

  });

ariaTest('Test escape key press with focus on textbox',
  exampleFile, 'listbox-key-escape', async (t) => {

    for (let exId in pageExamples) {
      let ex =  pageExamples[exId];

      // Send key "a" then key "ARROW_DOWN to put the focus on the listbox,
      // then key ESCAPE to the textbox

      await t.context.session
        .findElement(By.css(ex.textboxSelector))
        .sendKeys('a', Key.ARROW_DOWN, Key.ESCAPE);

      // Confirm the listbox is closed and the textboxed is cleared

      await assertAttributeValues(t, ex.comboboxSelector, 'aria-expanded', 'false');
      t.is(
        await t.context.session
          .findElement(By.css(ex.textboxSelector))
          .getAttribute('value'),
        '',
        'In ' + exId + 'textbox,  key press "ENTER" should result in first option in textbox'
      );
    }

  });
