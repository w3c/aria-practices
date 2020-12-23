const { ariaTest } = require('..');
const { By, Key } = require('selenium-webdriver');
const assertAriaControls = require('../util/assertAriaControls');
const assertAriaLabelExists = require('../util/assertAriaLabelExists');
const assertAriaRoles = require('../util/assertAriaRoles');
const assertAttributeDNE = require('../util/assertAttributeDNE');
const assertAttributeValues = require('../util/assertAttributeValues');
const assertRovingTabindex = require('../util/assertRovingTabindex');
const assertHasFocus = require('../util/assertHasFocus');
const assertNoElements = require('../util/assertNoElements');
const assertAttributeCanBeToggled = require('../util/assertAttributeCanBeToggled');

const exampleFile = 'toolbar/toolbar.html';

const ex = {
  buttonIconSelector: '#ex1 button span.fas',
  styleButtonsSelector: '#ex1 .group:nth-child(1) button',
  alignmentGroupSelector: '#ex1 [role="radiogroup"]',
  alignmentButtonsSelector: '#ex1 .group:nth-child(2) button',
  textEditButtonsSelector: '#ex1 .group:nth-child(3) button',
  fontFamilyButtonSelector: '#ex1 .group:nth-child(4) button',
  fontFamilyMenuitemSelector: '#ex1 [role="menuitemradio"]',
  menuSelector: '#ex1 [role="menu"]',
  spinSelector: '#ex1 [role="spinbutton"]',
  spinUpSelector: '#ex1 [role="spinbutton"] .increase',
  spinDownSelector: '#ex1 [role="spinbutton"] .decrease',
  spinTextSelector: '#ex1 [role="spinbutton"] .value',
  itemSelector: '#ex1 .item',
  itemSelectors: {
    first: '#ex1 .item:first-child',
    second: '#ex1 .item:nth-child(2)',
    last: '#ex1 #link',
  },
  radioButtons: {
    first: '#ex1 [role="radio"]:nth-child(1)',
    second: '#ex1 [role="radio"]:nth-child(2)',
    last: '#ex1 [role="radio"]:nth-child(3)',
  },
  tabbableItemAfterToolbarSelector: '#textarea1',
  tabbableItemBeforeToolbarSelector: 'body > main > p > a:last-of-type',
  toolbarSelector: '#ex1 [role="toolbar"]',
};

const clickAndWait = async function (t, selector) {
  let element = await t.context.session.findElement(By.css(selector));
  await element.click();

  return await t.context.session
    .wait(
      async function () {
        let tabindex = await element.getAttribute('tabindex');
        return tabindex === '0';
      },
      t.context.waitTime,
      'Timeout waiting for click to set tabindex="0" on: ' + selector
    )
    .catch((err) => {
      return err;
    });
};

const sendKeyAndAssertSelectorIsHidden = async function (
  t,
  key,
  selector,
  selectorToBeHidden
) {
  await t.context.session.findElement(By.css(selector)).sendKeys(key);
  await assertNoElements(t, selectorToBeHidden);
};

/**
 * Toolbar
 */

ariaTest(
  'Toolbar element has role="toolbar"',
  exampleFile,
  'toolbar-role',
  async (t) => {
    await assertAriaRoles(t, 'ex1', 'toolbar', '1', 'div');
  }
);

ariaTest(
  'Toolbar element has "aria-label"',
  exampleFile,
  'toolbar-aria-label',
  async (t) => {
    await assertAriaLabelExists(t, ex.toolbarSelector);
  }
);

ariaTest(
  'Toolbar element has "aria-controls"',
  exampleFile,
  'toolbar-aria-controls',
  async (t) => {
    await assertAriaControls(t, ex.toolbarSelector);
  }
);

ariaTest(
  'Toolbar items support roving tabindex on toolbar items (Part 1)',
  exampleFile,
  'toolbar-item-tabindex',
  async (t) => {
    // Test all the toolbar items with roving tab index
    await assertRovingTabindex(t, ex.itemSelector, Key.ARROW_RIGHT);
  }
);

ariaTest(
  'Toolbar buttons have aria-pressed',
  exampleFile,
  'toolbar-button-aria-pressed',
  async (t) => {
    await assertAttributeValues(
      t,
      ex.styleButtonsSelector,
      'aria-pressed',
      'false'
    );

    let buttons = await t.context.queryElements(t, ex.styleButtonsSelector);
    for (let button of buttons) {
      await button.click();
    }

    await assertAttributeValues(
      t,
      ex.styleButtonsSelector,
      'aria-pressed',
      'true'
    );
  }
);

ariaTest(
  'All toolbar images have aria-hidden',
  exampleFile,
  'toolbar-aria-hidden',
  async (t) => {
    await assertAttributeValues(
      t,
      ex.buttonIconSelector,
      'aria-hidden',
      'true'
    );
  }
);

ariaTest(
  'Div has "radiogroup" role',
  exampleFile,
  'toolbar-radiogroup-role',
  async (t) => {
    await assertAriaRoles(t, 'ex1', 'radiogroup', '1', 'div');
  }
);

ariaTest(
  'Radiogroup has aria-label',
  exampleFile,
  'toolbar-radiogroup-aria-label',
  async (t) => {
    await assertAriaLabelExists(t, ex.alignmentGroupSelector);
  }
);

ariaTest(
  'Radio buttons have radio role',
  exampleFile,
  'toolbar-radio-role',
  async (t) => {
    await assertAriaRoles(t, 'ex1', 'radio', '3', 'button');
  }
);

ariaTest(
  'Radio buttons had aria-checked',
  exampleFile,
  'toolbar-radio-aria-checked',
  async (t) => {
    let buttons = await t.context.queryElements(t, ex.alignmentButtonsSelector);

    for (let i = 0; i < buttons.length; i++) {
      await buttons[i].click();
      for (let j = 0; j < buttons.length; j++) {
        let value = j === i ? 'true' : 'false';
        t.is(
          await buttons[j].getAttribute('aria-checked'),
          value,
          'Only alignment button ' +
            i +
            ' should have aria-checked set after clicking alignment button ' +
            i
        );
      }
    }
  }
);

ariaTest(
  'Text edit buttons have aria-disabled set to true by default',
  exampleFile,
  'toolbar-button-aria-disabled',
  async (t) => {
    await assertAttributeValues(
      t,
      ex.textEditButtonsSelector,
      'aria-disabled',
      'true'
    );
  }
);

ariaTest(
  'Font family button has aria-label',
  exampleFile,
  'toolbar-menubutton-aria-label',
  async (t) => {
    await assertAriaLabelExists(t, ex.fontFamilyButtonSelector);
  }
);

ariaTest(
  'Font family button has aria-haspopup',
  exampleFile,
  'toolbar-menubutton-aria-haspopup',
  async (t) => {
    await assertAttributeValues(
      t,
      ex.fontFamilyButtonSelector,
      'aria-haspopup',
      'true'
    );
  }
);

ariaTest(
  'Font family button has aria-controls',
  exampleFile,
  'toolbar-menubutton-aria-controls',
  async (t) => {
    await assertAriaControls(t, ex.fontFamilyButtonSelector);
  }
);

ariaTest(
  'Font family button has aria-expanded',
  exampleFile,
  'toolbar-menubutton-aria-expanded',
  async (t) => {
    await assertAttributeDNE(t, ex.fontFamilyButtonSelector, 'aria-expanded');

    await (
      await t.context.session.findElement(By.css(ex.fontFamilyButtonSelector))
    ).click();

    await assertAttributeValues(
      t,
      ex.fontFamilyButtonSelector,
      'aria-expanded',
      'true'
    );
  }
);

ariaTest(
  'Font family menu has menu role',
  exampleFile,
  'toolbar-menu-role',
  async (t) => {
    await assertAriaRoles(t, 'ex1', 'menu', '1', 'ul');
  }
);

ariaTest(
  'Font family menu has aria-label',
  exampleFile,
  'toolbar-menu-aria-label',
  async (t) => {
    await assertAriaLabelExists(t, ex.menuSelector);
  }
);

ariaTest(
  'Menuitemradio role',
  exampleFile,
  'toolbar-menuitemradio-role',
  async (t) => {
    await assertAriaRoles(t, 'ex1', 'menuitemradio', '5', 'li');
  }
);

ariaTest(
  'menuitemradio elements have aria-checked set',
  exampleFile,
  'toolbar-menuitemradio-aria-checked',
  async (t) => {
    let menuButton = await t.context.session.findElement(
      By.css(ex.fontFamilyButtonSelector)
    );
    let menuItems = await t.context.queryElements(
      t,
      ex.fontFamilyMenuitemSelector
    );

    for (let i = 0; i < menuItems.length; i++) {
      await menuButton.click();
      await menuItems[i].click();
      await menuButton.click();
      for (let j = 0; j < menuItems.length; j++) {
        let value = j === i ? 'true' : 'false';
        t.is(
          await menuItems[j].getAttribute('aria-checked'),
          value,
          'Only alignment button ' +
            i +
            ' should have aria-checked set after clicking alignment button ' +
            i
        );
      }
    }
  }
);

ariaTest(
  'menuitemradio elements have tabindex set to -1',
  exampleFile,
  'toolbar-menuitemradio-tabindex',
  async (t) => {
    await (
      await t.context.session.findElement(By.css(ex.fontFamilyButtonSelector))
    ).click();

    await assertAttributeValues(
      t,
      ex.fontFamilyMenuitemSelector,
      'tabindex',
      '-1'
    );
  }
);

ariaTest(
  'Spinbutton has aria-label',
  exampleFile,
  'toolbar-spinbutton-aria-label',
  async (t) => {
    await assertAriaLabelExists(t, ex.spinSelector);
  }
);

ariaTest(
  'Spinbutton has aria-valuenow',
  exampleFile,
  'toolbar-spinbutton-aria-valuenow',
  async (t) => {
    await assertAttributeValues(t, ex.spinSelector, 'aria-valuenow', '14');

    await (
      await t.context.session.findElement(By.css(ex.spinUpSelector))
    ).click();
    await assertAttributeValues(t, ex.spinSelector, 'aria-valuenow', '15');

    await (
      await t.context.session.findElement(By.css(ex.spinDownSelector))
    ).click();
    await assertAttributeValues(t, ex.spinSelector, 'aria-valuenow', '14');
  }
);

ariaTest(
  'Spin button had valuetext',
  exampleFile,
  'toolbar-spinbutton-aria-valuetext',
  async (t) => {
    await assertAttributeValues(
      t,
      ex.spinSelector,
      'aria-valuetext',
      '14 Point'
    );

    t.is(
      await (
        await t.context.session.findElement(By.css(ex.spinSelector))
      ).getAttribute('aria-valuetext'),
      await (
        await t.context.session.findElement(By.css(ex.spinTextSelector))
      ).getText(),
      'The spin buttons aria-valuetext attribute should match the text on the spin button'
    );

    await (
      await t.context.session.findElement(By.css(ex.spinUpSelector))
    ).click();
    await assertAttributeValues(
      t,
      ex.spinSelector,
      'aria-valuetext',
      '15 Point'
    );

    t.is(
      await (
        await t.context.session.findElement(By.css(ex.spinSelector))
      ).getAttribute('aria-valuetext'),
      await (
        await t.context.session.findElement(By.css(ex.spinTextSelector))
      ).getText(),
      'The spin buttons aria-valuetext attribute should match the text on the spin button'
    );

    await (
      await t.context.session.findElement(By.css(ex.spinDownSelector))
    ).click();
    await assertAttributeValues(
      t,
      ex.spinSelector,
      'aria-valuetext',
      '14 Point'
    );

    t.is(
      await (
        await t.context.session.findElement(By.css(ex.spinSelector))
      ).getAttribute('aria-valuetext'),
      await (
        await t.context.session.findElement(By.css(ex.spinTextSelector))
      ).getText(),
      'The spin buttons aria-valuetext attribute should match the text on the spin button'
    );
  }
);

ariaTest(
  'Spin button has valuemin',
  exampleFile,
  'toolbar-spinbutton-aria-valuemin',
  async (t) => {
    await assertAttributeValues(t, ex.spinSelector, 'aria-valuemin', '8');
  }
);

ariaTest('', exampleFile, 'toolbar-spinbutton-aria-valuemax', async (t) => {
  await assertAttributeValues(t, ex.spinSelector, 'aria-valuemax', '40');
});

ariaTest(
  'ARROW_LEFT: If the first control has focus, focus moves to the last control.',
  exampleFile,
  'toolbar-left-arrow',
  async (t) => {
    await t.context.session
      .findElement(By.css(ex.itemSelectors.first))
      .sendKeys(Key.ARROW_LEFT);
    await assertHasFocus(t, ex.itemSelectors.last);
  }
);

ariaTest(
  'ARROW_LEFT: Moves focus to the previous control.',
  exampleFile,
  'toolbar-left-arrow',
  async (t) => {
    await t.context.session
      .findElement(By.css(ex.itemSelectors.second))
      .sendKeys(Key.ARROW_LEFT);
    await assertHasFocus(t, ex.itemSelectors.first);
  }
);

ariaTest(
  'ARROW_RIGHT: If the last control has focus, focus moves to the last control.',
  exampleFile,
  'toolbar-right-arrow',
  async (t) => {
    await t.context.session
      .findElement(By.css(ex.itemSelectors.last))
      .sendKeys(Key.ARROW_RIGHT);
    await assertHasFocus(t, ex.itemSelectors.first);
  }
);

ariaTest(
  'ARROW_RIGHT: Moves focus to the next control.',
  exampleFile,
  'toolbar-right-arrow',
  async (t) => {
    await t.context.session
      .findElement(By.css(ex.itemSelectors.first))
      .sendKeys(Key.ARROW_RIGHT);
    await assertHasFocus(t, ex.itemSelectors.second);
  }
);

ariaTest(
  'CLICK events on toolbar send focus to .item[tabindex="0"]',
  exampleFile,
  'toolbar-item-tabindex',
  async (t) => {
    let element = await t.context.session.findElement(By.css(ex.itemSelector));
    await element.click();
    await assertHasFocus(t, ex.itemSelector);
  }
);

ariaTest(
  'END: Moves focus to the last control.',
  exampleFile,
  'toolbar-home',
  async (t) => {
    await t.context.session
      .findElement(By.css(ex.itemSelectors.first))
      .sendKeys(Key.END);
    await assertHasFocus(t, ex.itemSelectors.last);
  }
);

ariaTest(
  'ESCAPE: Escape key hides any .popup-label',
  exampleFile,
  'toolbar-toggle-esc',
  async (t) => {
    await t.context.session.findElement(By.css(ex.itemSelectors.first)).click();
    await sendKeyAndAssertSelectorIsHidden(
      t,
      Key.ESCAPE,
      ex.itemSelectors.first,
      '.popup-label.show'
    );
  }
);

ariaTest(
  'HOME: Moves focus to the first control.',
  exampleFile,
  'toolbar-home',
  async (t) => {
    await t.context.session
      .findElement(By.css(ex.itemSelectors.last))
      .sendKeys(Key.HOME);
    await assertHasFocus(t, ex.itemSelectors.first);
  }
);

ariaTest(
  'TAB: Moves focus into the toolbar, to the first menu item',
  exampleFile,
  'toolbar-tab',
  async (t) => {
    let tabTarget = ex.tabbableItemBeforeToolbarSelector;
    await t.context.session.findElement(By.css(tabTarget)).sendKeys(Key.TAB);
    await assertHasFocus(t, ex.itemSelector);
  }
);

ariaTest(
  'TAB: Moves focus out of the toolbar, to the next control',
  exampleFile,
  'toolbar-tab',
  async (t) => {
    await t.context.session
      .findElement(By.css(ex.itemSelector))
      .sendKeys(Key.TAB);
    await assertHasFocus(t, ex.tabbableItemAfterToolbarSelector);
  }
);

/**
 * Radio Group
 */

ariaTest(
  'ENTER: Toggle the pressed state of the button.',
  exampleFile,
  'toolbar-toggle-enter-or-space',
  async (t) => {
    // Move focus to 'Bold' togglable button
    await assertAttributeCanBeToggled(
      t,
      ex.itemSelector,
      'aria-pressed',
      Key.ENTER
    );
  }
);

ariaTest(
  'ENTER: If the focused radio button is checked, do nothing.',
  exampleFile,
  'toolbar-radio-enter-or-space',
  async (t) => {
    await assertAttributeValues(
      t,
      ex.radioButtons.second,
      'aria-checked',
      'false'
    );
    await t.context.session
      .findElement(By.css(ex.radioButtons.second))
      .sendKeys(Key.ENTER);
    await assertAttributeValues(
      t,
      ex.radioButtons.second,
      'aria-checked',
      'true'
    );
    await t.context.session
      .findElement(By.css(ex.radioButtons.second))
      .sendKeys(Key.ENTER);
    await assertAttributeValues(
      t,
      ex.radioButtons.second,
      'aria-checked',
      'true'
    );
  }
);

ariaTest(
  'ENTER: Otherwise, uncheck the currently checked radio button and check the radio button that has focus.',
  exampleFile,
  'toolbar-radio-enter-or-space',
  async (t) => {
    await assertAttributeValues(
      t,
      ex.radioButtons.second,
      'aria-checked',
      'false'
    );
    await t.context.session
      .findElement(By.css(ex.radioButtons.second))
      .sendKeys(Key.ENTER);
    await assertAttributeValues(
      t,
      ex.radioButtons.second,
      'aria-checked',
      'true'
    );
    await t.context.session
      .findElement(By.css(ex.radioButtons.first))
      .sendKeys(Key.ENTER);
    await assertAttributeValues(
      t,
      ex.radioButtons.first,
      'aria-checked',
      'true'
    );
    await assertAttributeValues(
      t,
      ex.radioButtons.second,
      'aria-checked',
      'false'
    );
  }
);

ariaTest(
  'SPACE: Toggle the pressed state of the button.',
  exampleFile,
  'toolbar-toggle-enter-or-space',
  async (t) => {
    await assertAttributeCanBeToggled(
      t,
      ex.itemSelector,
      'aria-pressed',
      Key.SPACE
    );
  }
);

ariaTest(
  'SPACE: If the focused radio button is checked, do nothing.',
  exampleFile,
  'toolbar-radio-enter-or-space',
  async (t) => {
    await assertAttributeValues(
      t,
      ex.radioButtons.second,
      'aria-checked',
      'false'
    );
    await t.context.session
      .findElement(By.css(ex.radioButtons.second))
      .sendKeys(Key.SPACE);
    await assertAttributeValues(
      t,
      ex.radioButtons.second,
      'aria-checked',
      'true'
    );
    await t.context.session
      .findElement(By.css(ex.radioButtons.second))
      .sendKeys(Key.SPACE);
    await assertAttributeValues(
      t,
      ex.radioButtons.second,
      'aria-checked',
      'true'
    );
  }
);

ariaTest(
  'SPACE: Otherwise, uncheck the currently checked radio button and check the radio button that has focus.',
  exampleFile,
  'toolbar-radio-enter-or-space',
  async (t) => {
    await assertAttributeValues(
      t,
      ex.radioButtons.second,
      'aria-checked',
      'false'
    );
    await t.context.session
      .findElement(By.css(ex.radioButtons.second))
      .sendKeys(Key.SPACE);
    await assertAttributeValues(
      t,
      ex.radioButtons.second,
      'aria-checked',
      'true'
    );
    await t.context.session
      .findElement(By.css(ex.radioButtons.first))
      .sendKeys(Key.SPACE);
    await assertAttributeValues(
      t,
      ex.radioButtons.first,
      'aria-checked',
      'true'
    );
    await assertAttributeValues(
      t,
      ex.radioButtons.second,
      'aria-checked',
      'false'
    );
  }
);

ariaTest(
  'DOWN: Moves focus to the next radio button.',
  exampleFile,
  'toolbar-radio-down-arrow',
  async (t) => {
    await t.context.session
      .findElement(By.css(ex.radioButtons.first))
      .sendKeys(Key.DOWN);
    await assertHasFocus(t, ex.radioButtons.second);
  }
);

ariaTest(
  'DOWN: If the last radio button has focus, focus moves to the first radio button.',
  exampleFile,
  'toolbar-radio-down-arrow',
  async (t) => {
    await t.context.session
      .findElement(By.css(ex.radioButtons.last))
      .sendKeys(Key.DOWN);
    await assertHasFocus(t, ex.radioButtons.first);
  }
);

ariaTest(
  'UP: Moves focus to the next radio button.',
  exampleFile,
  'toolbar-radio-up-arrow',
  async (t) => {
    await t.context.session
      .findElement(By.css(ex.radioButtons.last))
      .sendKeys(Key.UP);
    await assertHasFocus(t, ex.radioButtons.second);
  }
);

ariaTest(
  'UP: If the first radio button has focus, focus moves to the last radio button.',
  exampleFile,
  'toolbar-radio-up-arrow',
  async (t) => {
    await t.context.session
      .findElement(By.css(ex.radioButtons.first))
      .sendKeys(Key.UP);
    await assertHasFocus(t, ex.radioButtons.last);
  }
);
