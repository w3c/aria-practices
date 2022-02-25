const { ariaTest } = require('..');
const { By, Key } = require('selenium-webdriver');
const assertAttributeValues = require('../util/assertAttributeValues');
const assertAriaLabelExists = require('../util/assertAriaLabelExists');
const assertAriaRoles = require('../util/assertAriaRoles');
const assertRovingTabindex = require('../util/assertRovingTabindex');

const exampleFile = 'menubar/menubar-editor.html';

const ex = {
  textareaSelector: '#ex1 textarea',
  menubarSelector: '#ex1 [role="menubar"]',
  menubarMenuitemSelector: '#ex1 span[role="menuitem"]',
  submenuMenuitemSelector: '#ex1 li[role="menuitem"]',
  submenuSelector: '#ex1 [role="menu"]',
  menuitemcheckboxSelector: '#ex1 [role="menuitemcheckbox"]',
  groupSelector: '#ex1 [role="group"]',
  menuitemradioSelector: '#ex1 [role="menuitemradio"]',
  ariaHiddenSpanSelector: '#ex1 [aria-hidden]',
  numMenus: 4,
  numSubmenuItems: [4, 10, 4, 7],
  allSubmenuItems: [
    '#ex1 [role="menu"][aria-label="Font"] li[role="menuitemradio"]',
    '#ex1 [role="menu"][aria-label="Style/Color"] li[role="menuitemradio"],#ex1 [role="menu"][aria-label="Style/Color"] li[role="menuitemcheckbox"]',
    '#ex1 [role="menu"][aria-label="Text Align"] li[role="menuitemradio"]',
    '#ex1 [role="menu"][aria-label="Size"] li[role="menuitem"],#ex1 [role="menu"][aria-label="Size"] li[role="menuitemradio"]',
  ],
  radioItemGroupings: [
    {
      menuIndex: 0,
      itemsSelector:
        '#ex1 [role="menu"][aria-label="Font"] [role="menuitemradio"]',
      defaultSelectedIndex: 0,
    },
    {
      menuIndex: 1,
      itemsSelector:
        '#ex1 [role="group"][aria-label="Text Color"] [role="menuitemradio"]',
      defaultSelectedIndex: 0,
    },
    {
      menuIndex: 1,
      itemsSelector:
        '#ex1 [role="group"][aria-label="Text Decoration"] [role="menuitemradio"]',
      defaultSelectedIndex: 0,
    },
    {
      menuIndex: 2,
      itemsSelector:
        '#ex1 [role="menu"][aria-label="Text Align"] [role="menuitemradio"]',
      defaultSelectedIndex: 0,
    },
    {
      menuIndex: 3,
      itemsSelector:
        '#ex1 [role="group"][aria-label="Font Sizes"] [role="menuitemradio"]',
      defaultSelectedIndex: 2,
    },
  ],
};

const exampleInitialized = async function (t) {
  const initializedSelector = ex.menubarMenuitemSelector + '[tabindex="0"]';

  await t.context.session.wait(
    async function () {
      const els = await t.context.queryElements(t, initializedSelector);
      return els.length === 1;
    },
    t.context.waitTime,
    'Timeout waiting for example to initialize'
  );
};

const checkmarkVisible = async function (t, selector, index) {
  return await t.context.session.executeScript(
    function () {
      const [selector, index] = arguments;
      const checkmarkContent = window
        .getComputedStyle(
          document.querySelectorAll(`${selector} > [aria-hidden]`)[index],
          ':before'
        )
        .getPropertyValue('content');
      if (checkmarkContent == 'none') {
        return false;
      }
      return true;
    },
    selector,
    index
  );
};

const checkFocus = async function (t, selector, index) {
  return await t.context.session.executeScript(
    function () {
      const [selector, index] = arguments;
      const items = document.querySelectorAll(selector);
      return items[index] === document.activeElement;
    },
    selector,
    index
  );
};

// Attributes

ariaTest(
  'Test aria-label on textarea',
  exampleFile,
  'textarea-aria-label',
  async (t) => {
    t.plan(1);
    await assertAriaLabelExists(t, ex.textareaSelector);
  }
);

ariaTest(
  'Test for role="menubar" on ul',
  exampleFile,
  'menubar-role',
  async (t) => {
    const menubars = await t.context.queryElements(t, ex.menubarSelector);

    t.is(
      menubars.length,
      1,
      'One "role=menubar" element should be found by selector: ' +
        ex.menubarSelector
    );

    t.is(
      await menubars[0].getTagName(),
      'ul',
      '"role=menubar" should be found on a "ul"'
    );
  }
);

ariaTest(
  'Test aria-label on menubar',
  exampleFile,
  'menubar-aria-label',
  async (t) => {
    await assertAriaLabelExists(t, ex.menubarSelector);
  }
);

ariaTest(
  'Test for role="menuitem" on li',
  exampleFile,
  'menubar-menuitem-role',
  async (t) => {
    const menuitems = await t.context.queryElements(
      t,
      ex.menubarMenuitemSelector
    );

    t.is(
      menuitems.length,
      4,
      '"role=menuitem" elements should be found by selector: ' +
        ex.menubarMenuitemSelector
    );

    for (let menuitem of menuitems) {
      t.truthy(
        await menuitem.getText(),
        '"role=menuitem" elements should all have accessible text content: ' +
          ex.menubarMenuitemSelector
      );
    }
  }
);

ariaTest(
  'Test roving tabindex',
  exampleFile,
  'menubar-menuitem-tabindex',
  async (t) => {
    // Wait for roving tabindex to be initialized by the javascript
    await exampleInitialized(t);

    await assertRovingTabindex(t, ex.menubarMenuitemSelector, Key.ARROW_RIGHT);
  }
);

ariaTest(
  'Test aria-haspopup set to true on menuitems',
  exampleFile,
  'menubar-menuitem-aria-haspopup',
  async (t) => {
    await assertAttributeValues(
      t,
      ex.menubarMenuitemSelector,
      'aria-haspopup',
      'true'
    );
  }
);

ariaTest(
  '"aria-expanded" attribute on menubar menuitem',
  exampleFile,
  'menubar-menuitem-aria-expanded',
  async (t) => {
    // Before interacting with page, make sure aria-expanded is set to false
    await assertAttributeValues(
      t,
      ex.menubarMenuitemSelector,
      'aria-expanded',
      'false'
    );

    // AND make sure no submenus are visible
    const submenus = await t.context.queryElements(t, ex.submenuSelector);
    for (let submenu of submenus) {
      t.false(
        await submenu.isDisplayed(),
        'No submenus (found by selector: ' +
          ex.submenuSelector +
          ') should be displayed on load'
      );
    }

    const menuitems = await t.context.queryElements(
      t,
      ex.menubarMenuitemSelector
    );

    for (let menuIndex = 0; menuIndex < menuitems.length; menuIndex++) {
      // Send ARROW_DOWN to open submenu
      await menuitems[menuIndex].sendKeys(Key.ARROW_DOWN);

      for (let item = 0; item < menuitems.length; item++) {
        // Test attribute "aria-expanded" is only set for the opened submenu
        const displayed = menuIndex === item ? true : false;
        t.is(
          await menuitems[item].getAttribute('aria-expanded'),
          displayed.toString(),
          'focus is on element ' +
            menuIndex +
            ' of elements "' +
            ex.menubarMenuitemSelector +
            '", therefore "aria-expanded" on menuitem ' +
            item +
            ' should be ' +
            displayed
        );

        // Test the submenu is indeed displayed
        t.is(
          await submenus[item].isDisplayed(),
          displayed,
          'focus is on element ' +
            menuIndex +
            ' of elements "' +
            ex.menubarMenuitemSelector +
            '", therefore isDisplay of submenu ' +
            item +
            ' should return ' +
            displayed
        );
      }

      // Send the ESCAPE to close submenu
      await menuitems[menuIndex].sendKeys(Key.ESCAPE);
    }
  }
);

ariaTest(
  'Visual character entities to show expanded state on role="menuitem" is hidden from assistive technology',
  exampleFile,
  'menubar-menuitem-aria-hidden',
  async (t) => {
    await assertAttributeValues(
      t,
      ex.ariaHiddenSpanSelector,
      'aria-hidden',
      'true'
    );
  }
);

ariaTest('Test for role="menu" on ul', exampleFile, 'menu-role', async (t) => {
  const submenus = await t.context.queryElements(t, ex.submenuSelector);

  // Test elements with role="menu" exist
  t.is(
    submenus.length,
    4,
    'Four role="menu" elements should be found by selector: ' +
      ex.submenuSelector
  );

  // Test the role="menu" elements are all on "ul" items
  for (let submenu of submenus) {
    t.is(
      await submenu.getTagName(),
      'ul',
      '"role=menu" should be found on a "ul"'
    );
  }

  await assertAttributeValues(t, ex.submenuSelector, 'tabindex', '-1');
});

ariaTest(
  'Test for aria-label on role="menu"',
  exampleFile,
  'menu-aria-label',
  async (t) => {
    const submenusSelectors = [
      '#ex1 li:nth-of-type(1) [role="menu"]',
      '#ex1 li:nth-of-type(2) [role="menu"]',
      '#ex1 li:nth-of-type(3) [role="menu"]',
      '#ex1 li:nth-of-type(4) [role="menu"]',
    ];

    for (let submenuSelector of submenusSelectors) {
      await assertAriaLabelExists(t, submenuSelector);
    }
  }
);

ariaTest(
  'Test for submenu menuitems with accessible names',
  exampleFile,
  'submenu-menuitem-role',
  async (t) => {
    const menuitems = await t.context.queryElements(
      t,
      ex.submenuMenuitemSelector
    );

    t.truthy(
      menuitems.length,
      '"role=menuitem" elements should be found by selector: ' +
        ex.submenuMenuitemSelector
    );

    // Test the accessible name of each menuitem

    for (let menuitem of menuitems) {
      // The menuitem is not visible, so we cannot use selenium's "getText" function
      const menuText = await t.context.session.executeScript(function () {
        const el = arguments[0];
        return el.innerHTML;
      }, menuitem);

      t.truthy(
        menuText,
        '"role=menuitem" elements should all have accessible text content: ' +
          ex.submenuMenuitemSelector
      );
    }
  }
);

ariaTest(
  'Test tabindex="-1" for all submenu role="menuitem"s',
  exampleFile,
  'submenu-menuitem-tabindex',
  async (t) => {
    await assertAttributeValues(
      t,
      ex.submenuMenuitemSelector,
      'tabindex',
      '-1'
    );
  }
);

ariaTest(
  'Test aria-disabled="false" for all submenu role="menuitem"s',
  exampleFile,
  'submenu-menuitem-aria-disabled',
  async (t) => {
    // "aria-disable" should be set to false by default
    await assertAttributeValues(
      t,
      ex.submenuMenuitemSelector,
      'aria-disabled',
      'false'
    );

    const menus = await t.context.queryElements(t, ex.menubarMenuitemSelector);
    const sizeMenu = await t.context.session.findElement(
      By.css('[aria-label="Size"]')
    );
    const menuitems = await t.context.queryElements(
      t,
      '[role="menuitem"]',
      sizeMenu
    );
    const menuItemRadios = await t.context.queryElements(
      t,
      '[role="menuitemradio"]',
      sizeMenu
    );

    // select X-Small size
    await menus[3].sendKeys(Key.ARROW_DOWN);
    await menuItemRadios[0].sendKeys(Key.ENTER);

    const disabledFirstItem = await menuitems[0].getAttribute('aria-disabled');

    // Test that the item was successfully disabled
    t.true(
      disabledFirstItem === 'true',
      'The first menuitem in the last dropdown should become disabled after X-Small is selected'
    );

    // Select the X-Large size
    await menus[3].sendKeys(Key.ARROW_DOWN);
    await menuItemRadios[menuItemRadios.length - 1].sendKeys(Key.ENTER);

    const disabledSecondItem = await menuitems[1].getAttribute('aria-disabled');

    // Test that the item was successfully disabled
    t.true(
      disabledSecondItem === 'true',
      'The second menuitem in the last dropdown should become disabled after X-Large is selected'
    );
  }
);

ariaTest(
  'Test for role="menuitemcheckbox" on li',
  exampleFile,
  'menuitemcheckbox-role',
  async (t) => {
    const checkboxes = await t.context.queryElements(
      t,
      ex.menuitemcheckboxSelector
    );

    t.truthy(
      checkboxes.length,
      '"role=menuitemcheckbox" elements should be found by selector: ' +
        ex.menuitemcheckboxSelector
    );

    // Test the accessible name of each menuitem

    for (let checkbox of checkboxes) {
      // The menuitem is not visible, so we cannot use selenium's "getText" function
      const text = await t.context.session.executeScript(function () {
        const el = arguments[0];
        return el.innerHTML;
      }, checkbox);

      t.truthy(
        text,
        '"role=menuitemcheckbox" elements should all have accessible text content: ' +
          ex.menuitemcheckboxSelector
      );
    }
  }
);

ariaTest(
  'Test tabindex="-1" for role="menuitemcheckbox"',
  exampleFile,
  'menuitemcheckbox-tabindex',
  async (t) => {
    await assertAttributeValues(
      t,
      ex.menuitemcheckboxSelector,
      'tabindex',
      '-1'
    );
  }
);

ariaTest(
  'Test "aria-checked" attribute on role="menuitemcheckbox"',
  exampleFile,
  'menuitemcheckbox-aria-checked',
  async (t) => {
    const menus = await t.context.queryElements(t, ex.menubarMenuitemSelector);

    // Reveal the menuitemcheckbox elements in the second dropdown
    await menus[1].sendKeys(Key.ARROW_DOWN);

    // Confirm aria-checked is set to false by default
    await assertAttributeValues(
      t,
      ex.menuitemcheckboxSelector,
      'aria-checked',
      'false'
    );

    // And correspondingly, neither item should have a visible checkmark
    for (let checkIndex = 0; checkIndex < 2; checkIndex++) {
      const checkmark = await checkmarkVisible(
        t,
        ex.menuitemcheckboxSelector,
        checkIndex
      );
      t.false(
        checkmark,
        'All menuitemcheckbox items should not have checkmark prepended'
      );
    }

    // Select both menuitems
    const checkboxes = await t.context.queryElements(
      t,
      ex.menuitemcheckboxSelector
    );
    await checkboxes[0].sendKeys(Key.ENTER);
    await menus[1].sendKeys(Key.ARROW_DOWN);
    await checkboxes[1].sendKeys(Key.ENTER);
    await menus[1].sendKeys(Key.ARROW_DOWN);

    // Confirm aria-checked is set to true
    await assertAttributeValues(
      t,
      ex.menuitemcheckboxSelector,
      'aria-checked',
      'true'
    );

    // And correspondingly, both items should have a visible checkmark
    for (let checkIndex = 0; checkIndex < 2; checkIndex++) {
      const checkmark = await checkmarkVisible(
        t,
        ex.menuitemcheckboxSelector,
        checkIndex
      );
      t.true(
        checkmark,
        'All menuitemcheckbox items should have checkmark prepended'
      );
    }
  }
);

ariaTest(
  'Visual character entities to show checked state on role="menuitemcheckbox" is hidden from assistive technology',
  exampleFile,
  'menuitemcheckbox-aria-hidden',
  async (t) => {
    await assertAttributeValues(
      t,
      ex.ariaHiddenSpanSelector,
      'aria-hidden',
      'true'
    );
  }
);

ariaTest(
  'Test role="separator" exists',
  exampleFile,
  'separator-role',
  async (t) => {
    await assertAriaRoles(t, 'ex1', 'separator', 3, 'li');
  }
);

ariaTest('Test role="group" exists', exampleFile, 'group-role', async (t) => {
  await assertAriaRoles(t, 'ex1', 'group', 4, 'ul');
});

ariaTest(
  'Test aria-label on group',
  exampleFile,
  'group-aria-label',
  async (t) => {
    await assertAriaLabelExists(t, ex.groupSelector);
  }
);

ariaTest(
  'Test role="menuitemradio" exists with accessible name',
  exampleFile,
  'menuitemradio-role',
  async (t) => {
    const items = await t.context.queryElements(t, ex.menuitemradioSelector);

    // Test that the elements exist
    t.truthy(
      items.length,
      '"role=menuitemradio" elements should be found by selector: ' +
        ex.menuitemradioSelector
    );

    // Test for accessible name

    for (let item of items) {
      // The menuitem is not visible, so we cannot use selenium's "getText" function
      const text = await t.context.session.executeScript(function () {
        const el = arguments[0];
        return el.innerHTML;
      }, item);

      t.truthy(
        text,
        '"role=menuitemradio" elements should all have accessible text content: ' +
          ex.menuitemradio
      );
    }
  }
);

ariaTest(
  'Test tabindex="-1" on role="menuitemradio"',
  exampleFile,
  'menuitemradio-tabindex',
  async (t) => {
    await assertAttributeValues(t, ex.menuitemradioSelector, 'tabindex', '-1');
  }
);

ariaTest(
  'Text "aria-checked" appropriately set on role="menuitemradio"',
  exampleFile,
  'menuitemradio-aria-checked',
  async (t) => {
    const menus = await t.context.queryElements(t, ex.menubarMenuitemSelector);

    for (let grouping of ex.radioItemGroupings) {
      // Reveal the elements in the dropdown
      await menus[grouping.menuIndex].sendKeys(Key.ARROW_DOWN);

      const items = await t.context.queryElements(t, grouping.itemsSelector);

      // Test for the initial state of checked/not checked for all radio menuitems

      for (let itemIndex = 0; itemIndex < items.length; itemIndex++) {
        const selected =
          itemIndex === grouping.defaultSelectedIndex ? true : false;

        t.is(
          await items[itemIndex].getAttribute('aria-checked'),
          selected.toString(),
          'Only item ' +
            grouping.defaultSelectedIndex +
            ' should have aria-select="true" in menu dropdown items: ' +
            grouping.itemsSelector
        );

        const checkmark = await checkmarkVisible(
          t,
          grouping.itemsSelector,
          itemIndex
        );
        t.is(
          checkmark,
          selected,
          'Only item ' +
            grouping.defaultSelectedIndex +
            ' should be selected in menu dropdown items: ' +
            grouping.itemsSelector
        );
      }
    }
  }
);

ariaTest(
  'Visual character entities to show checked state on role="menuitemradio" is hidden from assistive technology',
  exampleFile,
  'menuitemradio-aria-hidden',
  async (t) => {
    await assertAttributeValues(
      t,
      ex.ariaHiddenSpanSelector,
      'aria-hidden',
      'true'
    );
  }
);

// KEYS

ariaTest(
  'Key ENTER open submenu',
  exampleFile,
  'menubar-key-space-and-enter',
  async (t) => {
    const menuitems = await t.context.queryElements(
      t,
      ex.menubarMenuitemSelector
    );
    const submenus = await t.context.queryElements(t, ex.submenuSelector);
    for (let menuIndex = 0; menuIndex < ex.numMenus; menuIndex++) {
      // Send the ENTER key
      await menuitems[menuIndex].sendKeys(Key.ENTER);

      // Test that the submenu is displayed
      t.true(
        await submenus[menuIndex].isDisplayed(),
        'Sending key "ENTER" to menuitem ' +
          menuIndex +
          ' in menubar should display submenu'
      );

      t.true(
        await checkFocus(t, ex.allSubmenuItems[menuIndex], 0),
        'Sending key "ENTER" to menuitem ' +
          menuIndex +
          ' in menubar should send focus to the first element in the submenu'
      );
    }
  }
);

ariaTest(
  'Key SPACE open submenu',
  exampleFile,
  'menubar-key-space-and-enter',
  async (t) => {
    const menuitems = await t.context.queryElements(
      t,
      ex.menubarMenuitemSelector
    );
    const submenus = await t.context.queryElements(t, ex.submenuSelector);
    for (let menuIndex = 0; menuIndex < ex.numMenus; menuIndex++) {
      // Send the SPACE key
      await menuitems[menuIndex].sendKeys(' ');

      // Test that the submenu is displayed
      t.true(
        await submenus[menuIndex].isDisplayed(),
        'Sending key "SPACE" to menuitem ' +
          menuIndex +
          ' in menubar should display submenu'
      );

      t.true(
        await checkFocus(t, ex.allSubmenuItems[menuIndex], 0),
        'Sending key "SPACE" to menuitem ' +
          menuIndex +
          ' in menubar should send focus to the first element in the submenu'
      );
    }
  }
);

ariaTest(
  'Key ESCAPE closes menubar',
  exampleFile,
  'menubar-key-escape',
  async (t) => {
    const menuitems = await t.context.queryElements(
      t,
      ex.menubarMenuitemSelector
    );
    const submenus = await t.context.queryElements(t, ex.submenuSelector);
    for (let menuIndex = 0; menuIndex < ex.numMenus; menuIndex++) {
      // Send the ENTER key, then the ESCAPE
      await menuitems[menuIndex].sendKeys(Key.ENTER, Key.ESCAPE);

      // Test that the submenu is not displayed
      t.false(
        await submenus[menuIndex].isDisplayed(),
        'Sending key "ESCAPE" to menuitem ' +
          menuIndex +
          ' in menubar should close the open submenu'
      );
    }
  }
);

ariaTest(
  'Key ARROW_RIGHT moves focus to next menubar item',
  exampleFile,
  'menubar-key-right-arrow',
  async (t) => {
    const menuitems = await t.context.queryElements(
      t,
      ex.menubarMenuitemSelector
    );

    for (let menuIndex = 0; menuIndex < ex.numMenus + 1; menuIndex++) {
      const currentIndex = menuIndex % ex.numMenus;
      const nextIndex = (menuIndex + 1) % ex.numMenus;

      // Send the ARROW_RIGHT key
      await menuitems[currentIndex].sendKeys(Key.ARROW_RIGHT);

      // Test the focus is on the next item mod the number of items to account for wrapping
      t.true(
        await checkFocus(t, ex.menubarMenuitemSelector, nextIndex),
        'Sending key "ARROW_RIGHT" to menuitem ' +
          currentIndex +
          ' should move focus to menuitem ' +
          nextIndex
      );
    }
  }
);

ariaTest(
  'Key ARROW_RIGHT moves focus to next menubar item',
  exampleFile,
  'menubar-key-left-arrow',
  async (t) => {
    const menuitems = await t.context.queryElements(
      t,
      ex.menubarMenuitemSelector
    );

    // Send the ARROW_LEFT key to the first menuitem
    await menuitems[0].sendKeys(Key.ARROW_LEFT);

    // Test the focus is on the last menu item
    t.true(
      await checkFocus(t, ex.menubarMenuitemSelector, ex.numMenus - 1),
      'Sending key "ARROW_LEFT" to menuitem 0 will change focus to menu item 3'
    );

    for (let menuIndex = ex.numMenus - 1; menuIndex > 0; menuIndex--) {
      // Send the ARROW_LEFT key
      await menuitems[menuIndex].sendKeys(Key.ARROW_LEFT);

      // Test the focus is on the previous menuitem
      t.true(
        await checkFocus(t, ex.menubarMenuitemSelector, menuIndex - 1),
        'Sending key "ARROW_RIGHT" to menuitem ' +
          menuIndex +
          ' should move focus to menuitem ' +
          (menuIndex - 1)
      );
    }
  }
);

ariaTest(
  'Key ARROW_UP opens submenu, focus on last item',
  exampleFile,
  'menubar-key-up-arrow',
  async (t) => {
    const menuitems = await t.context.queryElements(
      t,
      ex.menubarMenuitemSelector
    );
    const submenus = await t.context.queryElements(t, ex.submenuSelector);
    for (let menuIndex = 0; menuIndex < ex.numMenus; menuIndex++) {
      // Send the ENTER key
      await menuitems[menuIndex].sendKeys(Key.UP);

      // Test that the submenu is displayed
      t.true(
        await submenus[menuIndex].isDisplayed(),
        'Sending key "ENTER" to menuitem ' +
          menuIndex +
          ' in menubar should display submenu'
      );

      const numSubItems = (
        await t.context.queryElements(t, ex.allSubmenuItems[menuIndex])
      ).length;

      // Test that the focus is on the last item in the list
      t.true(
        await checkFocus(t, ex.allSubmenuItems[menuIndex], numSubItems - 1),
        'Sending key "ENTER" to menuitem ' +
          menuIndex +
          ' in menubar should send focus to the first element in the submenu'
      );
    }
  }
);

ariaTest(
  'Key ARROW_DOWN opens submenu, focus on first item',
  exampleFile,
  'menubar-key-down-arrow',
  async (t) => {
    const menuitems = await t.context.queryElements(
      t,
      ex.menubarMenuitemSelector
    );
    const submenus = await t.context.queryElements(t, ex.submenuSelector);
    for (let menuIndex = 0; menuIndex < ex.numMenus; menuIndex++) {
      // Send the ENTER key
      await menuitems[menuIndex].sendKeys(Key.DOWN);

      // Test that the submenu is displayed
      t.true(
        await submenus[menuIndex].isDisplayed(),
        'Sending key "ENTER" to menuitem ' +
          menuIndex +
          ' in menubar should display submenu'
      );

      // Test that the focus is on the first item in the list
      t.true(
        await checkFocus(t, ex.allSubmenuItems[menuIndex], 0),
        'Sending key "ENTER" to menuitem ' +
          menuIndex +
          ' in menubar should send focus to the first element in the submenu'
      );
    }
  }
);

ariaTest(
  'Key HOME goes to first item in menubar',
  exampleFile,
  'menubar-key-home',
  async (t) => {
    const menuitems = await t.context.queryElements(
      t,
      ex.menubarMenuitemSelector
    );
    for (let menuIndex = 0; menuIndex < ex.numMenus; menuIndex++) {
      // Send the ARROW_RIGHT key to move the focus to later menu item for every test
      for (let i = 0; i < menuIndex; i++) {
        await menuitems[i].sendKeys(Key.ARROW_RIGHT);
      }

      // Send the key HOME
      await menuitems[menuIndex].sendKeys(Key.HOME);

      // Test that the focus is on the first item in the list
      t.true(
        await checkFocus(t, ex.menubarMenuitemSelector, 0),
        'Sending key "HOME" to menuitem ' +
          menuIndex +
          ' in menubar should move the focus to the first menuitem'
      );
    }
  }
);

ariaTest(
  'Key END goes to last item in menubar',
  exampleFile,
  'menubar-key-end',
  async (t) => {
    const menuitems = await t.context.queryElements(
      t,
      ex.menubarMenuitemSelector
    );
    for (let menuIndex = 0; menuIndex < ex.numMenus; menuIndex++) {
      // Send the ARROW_RIGHT key to move the focus to later menu item for every test
      for (let i = 0; i < menuIndex; i++) {
        await menuitems[i].sendKeys(Key.ARROW_RIGHT);
      }

      // Send the key END
      await menuitems[menuIndex].sendKeys(Key.END);

      // Test that the focus is on the last item in the list
      t.true(
        await checkFocus(t, ex.menubarMenuitemSelector, ex.numMenus - 1),
        'Sending key "END" to menuitem ' +
          menuIndex +
          ' in menubar should move the focus to the last menuitem'
      );
    }
  }
);

ariaTest(
  'Character sends to menubar changes focus in menubar',
  exampleFile,
  'menubar-key-character',
  async (t) => {
    const charIndexTest = [
      { sendChar: 'f', sendIndex: 0, endIndex: 0 },
      { sendChar: 's', sendIndex: 0, endIndex: 1 },
      { sendChar: 't', sendIndex: 0, endIndex: 2 },
      { sendChar: 'f', sendIndex: 1, endIndex: 0 },
      { sendChar: 's', sendIndex: 1, endIndex: 3 },
      { sendChar: 'z', sendIndex: 0, endIndex: 0 },
      { sendChar: 'z', sendIndex: 3, endIndex: 3 },
    ];

    const menuitems = await t.context.queryElements(
      t,
      ex.menubarMenuitemSelector
    );
    for (let test of charIndexTest) {
      // Send character to menuitem
      await menuitems[test.sendIndex].sendKeys(test.sendChar);

      // Test that the focus switches to the appropriate menuitem
      t.true(
        await checkFocus(t, ex.menubarMenuitemSelector, test.endIndex),
        'Sending character ' +
          test.sendChar +
          ' to menuitem ' +
          test.sendIndex +
          ' in menubar should move the focus to menuitem ' +
          test.endIndex
      );
    }
  }
);

ariaTest(
  'ENTER in submenu selects item',
  exampleFile,
  'submenu-enter',
  async (t) => {
    const menuitems = await t.context.queryElements(
      t,
      ex.menubarMenuitemSelector
    );
    const submenus = await t.context.queryElements(t, ex.submenuSelector);

    for (let menuIndex = 0; menuIndex < ex.numMenus; menuIndex++) {
      for (
        let itemIndex = 0;
        itemIndex < ex.numSubmenuItems[menuIndex];
        itemIndex++
      ) {
        // Open the submenu
        await menuitems[menuIndex].sendKeys(Key.ENTER);
        const items = await t.context.queryElements(
          t,
          ex.allSubmenuItems[menuIndex]
        );
        const item = items[itemIndex];
        const itemText = await item.getText();

        // Get the current style attribute on the "Text Sample"
        const originalStyle = await t.context.session
          .findElement(By.css(ex.textareaSelector))
          .getAttribute('style');

        // send ENTER to the item
        await item.sendKeys(Key.ENTER);

        // Test that the submenu is closed
        t.false(
          await submenus[menuIndex].isDisplayed(),
          'Sending key "ENTER" to submenu item "' +
            itemText +
            '" should close list'
        );

        // Test that the focus is back on the menuitem in the menubar
        t.true(
          await checkFocus(t, ex.menubarMenuitemSelector, menuIndex),
          'Sending key "ENTER" to submenu item "' +
            itemText +
            '" should change the focus to menuitem ' +
            menuIndex +
            ' in the menubar'
        );

        let changedStyle = true;
        if (itemIndex === 0 && menuIndex === 0) {
          // Only when selecting the first (selected by default) font option will the style not change.
          changedStyle = false;
        }

        // Get the current style attribute on the "Text Sample"
        const currentStyle = await t.context.session
          .findElement(By.css(ex.textareaSelector))
          .getAttribute('style');

        t.is(
          currentStyle != originalStyle,
          changedStyle,
          'Sending key "ENTER" to submenu item "' +
            itemText +
            '" should change the style attribute on the Text Sample.'
        );
      }
    }
  }
);

ariaTest(
  'ESCAPE to submenu closes submenu',
  exampleFile,
  'submenu-escape',
  async (t) => {
    const menuitems = await t.context.queryElements(
      t,
      ex.menubarMenuitemSelector
    );
    const submenus = await t.context.queryElements(t, ex.submenuSelector);

    for (let menuIndex = 0; menuIndex < ex.numMenus; menuIndex++) {
      for (
        let itemIndex = 0;
        itemIndex < ex.numSubmenuItems[menuIndex];
        itemIndex++
      ) {
        // Open the submenu
        await menuitems[menuIndex].sendKeys(Key.ENTER);

        const items = await t.context.queryElements(
          t,
          ex.allSubmenuItems[menuIndex]
        );
        const item = items[itemIndex];
        const itemText = await item.getText();

        // send escape to the item
        await item.sendKeys(Key.ESCAPE);

        // make sure focus is on the menuitem and the popup is submenu is closed
        t.false(
          await submenus[menuIndex].isDisplayed(),
          'Sending key "ESCAPE" to submenu item "' +
            itemText +
            '" should close list'
        );

        // Test that the focus is back on the menuitem in the menubar
        t.true(
          await checkFocus(t, ex.menubarMenuitemSelector, menuIndex),
          'Sending key "ESCAPE" to submenu item "' +
            itemText +
            '" should change the focus to menuitem ' +
            menuIndex +
            ' in the menubar'
        );
      }
    }
  }
);

ariaTest(
  'ARROW_RIGHT to submenu closes submenu and opens next',
  exampleFile,
  'submenu-right-arrow',
  async (t) => {
    const menuitems = await t.context.queryElements(
      t,
      ex.menubarMenuitemSelector
    );
    const submenus = await t.context.queryElements(t, ex.submenuSelector);

    for (let menuIndex = 0; menuIndex < ex.numMenus; menuIndex++) {
      for (
        let itemIndex = 0;
        itemIndex < ex.numSubmenuItems[menuIndex];
        itemIndex++
      ) {
        // Open the submenu
        await menuitems[menuIndex].sendKeys(Key.ENTER);

        const items = await t.context.queryElements(
          t,
          ex.allSubmenuItems[menuIndex]
        );
        const item = items[itemIndex];
        const itemText = await item.getText();
        const nextMenuIndex = (menuIndex + 1) % ex.numMenus;

        // send RIGHT to the item
        await item.sendKeys(Key.ARROW_RIGHT);

        // Test that the submenu is closed
        t.false(
          await submenus[menuIndex].isDisplayed(),
          'Sending key "ARROW_RIGHT" to submenu item "' +
            itemText +
            '" should close list'
        );

        // Test that the next submenu is open
        t.true(
          await submenus[nextMenuIndex].isDisplayed(),
          'Sending key "ARROW_RIGHT" to submenu item "' +
            itemText +
            '" should open submenu ' +
            nextMenuIndex
        );

        // Test that the focus is on the menuitem in the menubar
        t.true(
          await checkFocus(t, ex.menubarMenuitemSelector, nextMenuIndex),
          'Sending key "ARROW_RIGHT" to submenu item "' +
            itemText +
            '" should send focus to menuitem' +
            nextMenuIndex +
            ' in the menubar'
        );
      }
    }
  }
);

ariaTest(
  'ARROW_RIGHT to submenu closes submenu and opens next',
  exampleFile,
  'submenu-left-arrow',
  async (t) => {
    const menuitems = await t.context.queryElements(
      t,
      ex.menubarMenuitemSelector
    );
    const submenus = await t.context.queryElements(t, ex.submenuSelector);

    for (let menuIndex = 0; menuIndex < ex.numMenus; menuIndex++) {
      for (
        let itemIndex = 0;
        itemIndex < ex.numSubmenuItems[menuIndex];
        itemIndex++
      ) {
        // Open the submenu
        await menuitems[menuIndex].sendKeys(Key.ENTER);

        const items = await t.context.queryElements(
          t,
          ex.allSubmenuItems[menuIndex]
        );
        const item = items[itemIndex];
        const itemText = await item.getText();
        // Account for wrapping (index 0 should go to 3)
        const nextMenuIndex = menuIndex === 0 ? 3 : menuIndex - 1;

        // send LEFT to the item
        await item.sendKeys(Key.ARROW_LEFT);

        // Test that the submenu is closed
        t.false(
          await submenus[menuIndex].isDisplayed(),
          'Sending key "ARROW_LEFT" to submenu item "' +
            itemText +
            '" should close list'
        );

        // Test that the next submenu is open
        t.true(
          await submenus[nextMenuIndex].isDisplayed(),
          'Sending key "ARROW_LEFT" to submenu item "' +
            itemText +
            '" should open submenu ' +
            nextMenuIndex
        );

        // Test that the focus is on the menuitem in the menubar
        t.true(
          await checkFocus(t, ex.menubarMenuitemSelector, nextMenuIndex),
          'Sending key "ARROW_LEFT" to submenu item "' +
            itemText +
            '" should send focus to menuitem' +
            nextMenuIndex +
            ' in the menubar'
        );
      }
    }
  }
);

ariaTest(
  'ARROW_DOWN moves focus to next item',
  exampleFile,
  'submenu-down-arrow',
  async (t) => {
    const menuitems = await t.context.queryElements(
      t,
      ex.menubarMenuitemSelector
    );

    for (let menuIndex = 0; menuIndex < ex.numMenus; menuIndex++) {
      // Open the submenu
      await menuitems[menuIndex].sendKeys(Key.ARROW_DOWN);
      const items = await t.context.queryElements(
        t,
        ex.allSubmenuItems[menuIndex]
      );

      for (
        let itemIndex = 0;
        itemIndex < ex.numSubmenuItems[menuIndex];
        itemIndex++
      ) {
        const item = items[itemIndex];
        const itemText = await item.getText();
        const nextItemIndex = (itemIndex + 1) % ex.numSubmenuItems[menuIndex];

        // send DOWN to the item
        await item.sendKeys(Key.ARROW_DOWN);

        // Test that the focus is on the next item
        t.true(
          await checkFocus(t, ex.allSubmenuItems[menuIndex], nextItemIndex),
          'Sending key "ARROW_DOWN" to submenu item "' +
            itemText +
            '" should send focus to next submenu item.'
        );
      }
    }
  }
);

ariaTest(
  'ARROW_DOWN moves focus to previous item',
  exampleFile,
  'submenu-up-arrow',
  async (t) => {
    const menuitems = await t.context.queryElements(
      t,
      ex.menubarMenuitemSelector
    );

    for (let menuIndex = 0; menuIndex < ex.numMenus; menuIndex++) {
      // Open the submenu
      await menuitems[menuIndex].sendKeys(Key.ARROW_DOWN);
      const items = await t.context.queryElements(
        t,
        ex.allSubmenuItems[menuIndex]
      );

      for (
        let itemIndex = 0;
        itemIndex < ex.numSubmenuItems[menuIndex];
        itemIndex++
      ) {
        const item = items[itemIndex];
        const itemText = await item.getText();
        // Account for wrapping
        const nextItemIndex =
          itemIndex === 0 ? ex.numSubmenuItems[menuIndex] - 1 : itemIndex - 1;

        // Send UP to the item
        await item.sendKeys(Key.ARROW_UP);

        // Test that the focus is on the previous item
        t.true(
          await checkFocus(t, ex.allSubmenuItems[menuIndex], nextItemIndex),
          'Sending key "ARROW_UP" to submenu item "' +
            itemText +
            '" should send focus to next submenu item.'
        );
      }
    }
  }
);

ariaTest(
  'HOME moves focus to first item',
  exampleFile,
  'submenu-home',
  async (t) => {
    const menuitems = await t.context.queryElements(
      t,
      ex.menubarMenuitemSelector
    );

    for (let menuIndex = 0; menuIndex < ex.numMenus; menuIndex++) {
      // Open the submenu
      await menuitems[menuIndex].sendKeys(Key.ARROW_DOWN);
      const items = await t.context.queryElements(
        t,
        ex.allSubmenuItems[menuIndex]
      );

      for (
        let itemIndex = 0;
        itemIndex < ex.numSubmenuItems[menuIndex];
        itemIndex++
      ) {
        const item = items[itemIndex];
        const itemText = await item.getText();

        // Send UP to the item
        await item.sendKeys(Key.HOME);

        // Test that the focus is on the first item
        t.true(
          await checkFocus(t, ex.allSubmenuItems[menuIndex], 0),
          'Sending key "HOME" to submenu item "' +
            itemText +
            '" should send focus to first submenu item.'
        );
      }
    }
  }
);

ariaTest(
  'END moves focus to last item',
  exampleFile,
  'submenu-end',
  async (t) => {
    const menuitems = await t.context.queryElements(
      t,
      ex.menubarMenuitemSelector
    );

    for (let menuIndex = 0; menuIndex < ex.numMenus; menuIndex++) {
      // Open the submenu
      await menuitems[menuIndex].sendKeys(Key.ARROW_DOWN);
      const items = await t.context.queryElements(
        t,
        ex.allSubmenuItems[menuIndex]
      );
      const lastIndex = items.length - 1;

      for (
        let itemIndex = 0;
        itemIndex < ex.numSubmenuItems[menuIndex];
        itemIndex++
      ) {
        const item = items[itemIndex];
        const itemText = await item.getText();

        // Send UP to the item
        await item.sendKeys(Key.END);

        // Test that the focus is on the first item
        t.true(
          await checkFocus(t, ex.allSubmenuItems[menuIndex], lastIndex),
          'Sending key "END" to submenu item "' +
            itemText +
            '" should send focus to last submenu item.'
        );
      }
    }
  }
);

ariaTest(
  'Character sends to menubar changes focus in menubar',
  exampleFile,
  'submenu-character',
  async (t) => {
    const charIndexTest = [
      [
        // Tests for menu dropdown 0
        { sendChar: 's', sendIndex: 0, endIndex: 1 },
        { sendChar: 's', sendIndex: 1, endIndex: 0 },
        { sendChar: 'x', sendIndex: 0, endIndex: 0 },
      ],
      [
        // Tests for menu dropdown 1
        { sendChar: 'u', sendIndex: 0, endIndex: 9 },
        { sendChar: 'y', sendIndex: 9, endIndex: 9 },
      ],
      [
        // Tests for menu dropdown 2
        { sendChar: 'r', sendIndex: 0, endIndex: 2 },
        { sendChar: 'z', sendIndex: 2, endIndex: 2 },
      ],
      [
        // Tests for menu dropdown 3
        { sendChar: 'x', sendIndex: 0, endIndex: 2 },
        { sendChar: 'x', sendIndex: 2, endIndex: 6 },
      ],
    ];

    const menuitems = await t.context.queryElements(
      t,
      ex.menubarMenuitemSelector
    );
    for (let menuIndex = 0; menuIndex < ex.numMenus; menuIndex++) {
      // Open the dropdown
      await menuitems[menuIndex].sendKeys(Key.ARROW_DOWN);
      const items = await t.context.queryElements(
        t,
        ex.allSubmenuItems[menuIndex]
      );

      for (let test of charIndexTest[menuIndex]) {
        // Send character to menuitem
        const itemText = await items[test.sendIndex].getText();
        await items[test.sendIndex].sendKeys(test.sendChar);

        // Test that the focus switches to the appropriate menuitem
        t.true(
          await checkFocus(t, ex.allSubmenuItems[menuIndex], test.endIndex),
          'Sending character ' +
            test.sendChar +
            ' to menuitem ' +
            itemText +
            ' should move the focus to menuitem ' +
            test.endIndex
        );
      }
    }
  }
);
