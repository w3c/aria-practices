const { ariaTest } = require('..');
const { By, Key } = require('selenium-webdriver');
const assert = require('assert');
const assertAttributeValues = require('../util/assertAttributeValues');
const assertAriaLabelExists = require('../util/assertAriaLabelExists');
const assertAriaLabelledby = require('../util/assertAriaLabelledby');
const assertAriaRoles = require('../util/assertAriaRoles');
const assertRovingTabindex = require('../util/assertRovingTabindex');
const assertAriaOwns = require('../util/assertAriaOwns');

const exampleFile = 'menubar/menubar-navigation.html';

const ex = {
  // landmark selectors
  bannerSelector: '#ex1 header',
  navigationSelector: '#ex1 nav',
  regionSelector: '#ex1 section',
  contentinfoSelector: '#ex1 footer',

  // Title selector
  titleSelector: '#id-page-title',

  // menubar selector
  menubarSelector: '#ex1 [role="menubar"]',
  numberOfMenuitems: 31,

  // menu selectors
  anyMenuSelector: '#ex1 [role="menu"]',
  submenuExpandableMenuitemsSelector:
    '#ex1 [role="menubar"]>li>[role="menu"]>li>[aria-expanded]',

  // Menubar menuitem selectors
  menubarMenuitemSelector: '#ex1 [role="menubar"]>li>[role="menuitem"]',
  menubarMenuitemWithPopupSelector: '#ex1 [role="menubar"]>li>[aria-haspopup]',
  menubarMenuitemWithExpandedSelector:
    '#ex1 [role="menubar"]>li>[aria-expanded]',
  menubarMenuitemWithOwnsSelector: '#ex1 [role="menubar"]>li>[aria-owns]',

  // Menuitem selectors
  anyMenuitemSelector: '#ex1 [role="menubar"] [role="menuitem"]',

  // Menu menuitem selectors
  anyMenuMenuitemSelector: '#ex1 [role="menu"]>li>[role="menuitem"]',
  menuMenuitemSelectors: [
    '#ex1 [role="menubar"]>li:nth-of-type(0)>[role="menu"]>li>[role="menuitem"]',
    '#ex1 [role="menubar"]>li:nth-of-type(1)>[role="menu"]>li>[role="menuitem"]',
    '#ex1 [role="menubar"]>li:nth-of-type(2)>[role="menu"]>li>[role="menuitem"]',
    '#ex1 [role="menubar"]>li:nth-of-type(3)>[role="menu"]>li>[role="menuitem"]',
  ],

  // Submenu item selectors
  submenuMenuitemsWithOwns: '#ex1 [role="menu"] [role="menuitem"][aria-owns]',
  submenuMenuitemsWithHasPopup:
    '#ex1 [role="menu"] [role="menuitem"][aria-haspopup]',
  submenuMenuitemsWithExpanded:
    '#ex1 [role="menu"] [role="menuitem"][aria-expanded]',

  // Selectors for testing expandable menus in submenus
  groupSelector: '#ex1 [role="group"]',
  numMenubarMenuitems: 4,
  numMenus: 3,
  numSubmenus: 3,
  numTotalMenus: 6,
  menuLocations: [1, 2, 3],
  submenuLocations: [
    // [<index of top level menu>, <index of item in top level menu>]
    [1, 2],
    [1, 3],
    [2, 1],
  ],
  numMenuMenuitems: [0, 4, 6, 8],
};

// Returns specified submenu
const getSubmenuSelector = function (menuIndex, menuitemIndex) {
  return (
    '#ex1 [role="menubar"]>li:nth-of-type(' +
    (menuIndex + 1) +
    ')>[role="menu"]>li:nth-of-type(' +
    (menuitemIndex + 1) +
    ')>[role="menu"]'
  );
};

// Returns the menuitems of a specified submenu
const getSubmenuMenuitemSelector = function (menuIndex, menuitemIndex) {
  return (
    '#ex1 [role="menubar"]>li:nth-of-type(' +
    (menuIndex + 1) +
    ')>[role="menu"]>li:nth-of-type(' +
    (menuitemIndex + 1) +
    ')>[role="menu"] [role="menuitem"]'
  );
};

// await new Promise(resolve => setTimeout(resolve, 3000));

const openSubmenu = async function (t, menuIndex, menuitemIndex) {
  // Send ARROW_DOWN to open menu
  const menubaritems = await t.context.queryElements(
    t,
    ex.menubarMenuitemSelector
  );
  await menubaritems[menuIndex].sendKeys(Key.ARROW_DOWN);

  // Get the menuitems for that menu and send ARROW_RIGHT to open the submenu
  const menuitems = await t.context.queryElements(
    t,
    ex.menuMenuitemSelectors[menuIndex]
  );
  await menuitems[menuitemIndex].sendKeys(Key.ARROW_RIGHT);
  return;
};

const compareText = async function (t, selector, text) {
  return t.context.session.executeScript(
    function () {
      const [selector, text] = arguments;
      const item = document.querySelector(selector);
      return (
        item.textContent.trim().toLowerCase() === text.trim().toLowerCase()
      );
    },
    selector,
    text
  );
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

const checkFocus = async function (t, selector, index) {
  return t.context.session.executeScript(
    function () {
      const [selector, index] = arguments;
      const items = document.querySelectorAll(selector);
      return items[index] === document.activeElement;
    },
    selector,
    index
  );
};

const doesMenuitemHaveSubmenu = function (menuIndex, menuitemIndex) {
  for (let submenuLocation of ex.submenuLocations) {
    if (
      submenuLocation[0] === menuIndex &&
      submenuLocation[1] === menuitemIndex
    ) {
      return true;
    }
  }
  return false;
};

// Tests for landmark roles in example

ariaTest(
  'role="banner" on header element',
  exampleFile,
  'banner-role',
  async (t) => {
    const banners = await t.context.queryElements(t, ex.bannerSelector);

    t.is(
      banners.length,
      1,
      'One "role=banner" element should be found by selector: ' +
        ex.bannerSelector
    );

    t.is(
      await banners[0].getTagName(),
      'header',
      'role="banner" should be found on a "header"'
    );
  }
);

ariaTest(
  'nav element identifies navigation landmark',
  exampleFile,
  'navigation-role',
  async (t) => {
    const navs = await t.context.queryElements(t, ex.navigationSelector);

    t.is(
      navs.length,
      1,
      'One nav element should be found by selector: ' + ex.navigationSelector
    );
  }
);

ariaTest(
  'aria-label on nav element',
  exampleFile,
  'navigation-aria-label',
  async (t) => {
    await assertAriaLabelExists(t, ex.navigationSelector);
  }
);

ariaTest(
  'section element identifies region landmark',
  exampleFile,
  'region-role',
  async (t) => {
    const regions = await t.context.queryElements(t, ex.regionSelector);

    t.is(
      regions.length,
      1,
      'One section element should be found by selector: ' + ex.regionSelector
    );
  }
);

ariaTest(
  'aria-labelledby on section element',
  exampleFile,
  'region-aria-labelledby',
  async (t) => {
    await assertAriaLabelledby(t, ex.regionSelector);
  }
);

ariaTest(
  'role="contentinfo" on footer element',
  exampleFile,
  'contentinfo-role',
  async (t) => {
    const contentinfos = await t.context.queryElements(
      t,
      ex.contentinfoSelector
    );

    t.is(
      contentinfos.length,
      1,
      'One "role=contentinfo" element should be found by selector: ' +
        ex.contentinfoSelector
    );

    t.is(
      await contentinfos[0].getTagName(),
      'footer',
      'role="contentinfo" should be found on a "footer"'
    );
  }
);

// Attributes

ariaTest(
  'Test for role="menubar" on ul',
  exampleFile,
  'menubar-role',
  async (t) => {
    await assertAriaRoles(t, 'ex1', 'menubar', 1, 'ul');
  }
);

ariaTest(
  'Test for role="menuitem" on a elements',
  exampleFile,
  'menuitem-role',
  async (t) => {
    await assertAriaRoles(t, 'ex1', 'menuitem', ex.numberOfMenuitems, 'a');
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
  'Test aria-haspopup set to true on menuitems with popup menus',
  exampleFile,
  'menubar-menuitem-aria-haspopup',
  async (t) => {
    const menuitems = await t.context.queryElements(
      t,
      ex.menubarMenuitemSelector
    );
    for (let i = 0; i < ex.menuLocations.length; i++) {
      let menuitem = menuitems[ex.menuLocations[i]];
      assert.strictEqual(
        await menuitem.getAttribute('aria-haspopup'),
        'true',
        'Attribute "aria-haspopup" with value "true" should be found on element with label "' +
          menuitem.getText() +
          '"'
      );
    }
    t.pass();
  }
);

ariaTest(
  'Test aria-owns exists on menubar menuitems with popup menus',
  exampleFile,
  'menubar-menuitem-aria-owns',
  async (t) => {
    const menuitems = await t.context.queryElements(
      t,
      ex.menubarMenuitemSelector
    );
    for (let i = 0; i < ex.menuLocations.length; i++) {
      let menuitem = menuitems[ex.menuLocations[i]];
      t.truthy(
        await menuitem.getAttribute('aria-owns'),
        'Attribute "aria-owns" should be found on element with label "' +
          menuitem.getText() +
          '"'
      );
    }
  }
);

ariaTest(
  'Test aria-expanded on menubar menuitems set to false when popup is closed',
  exampleFile,
  'menubar-menuitem-aria-expanded-false',
  async (t) => {
    const menuitems = await t.context.queryElements(
      t,
      ex.menubarMenuitemSelector
    );
    for (let i = 0; i < ex.menuLocations.length; i++) {
      let menuitem = menuitems[ex.menuLocations[i]];
      assert.strictEqual(
        await menuitem.getAttribute('aria-expanded'),
        'false',
        'Attribute "aria-expanded" with value "false" should be found on element with label "' +
          menuitem.getText() +
          '"'
      );
    }
    t.pass();
  }
);

ariaTest(
  'Test aria-expanded on menubar menuitems set to true when popup is open',
  exampleFile,
  'menubar-menuitem-aria-expanded-true',
  async (t) => {
    const menubaritems = await t.context.queryElements(
      t,
      ex.menubarMenuitemWithPopupSelector
    );

    for (let i = 0; i < menubaritems.length; i++) {
      const menubaritem = menubaritems[i];
      await menubaritem.sendKeys(Key.ARROW_DOWN);

      assert.strictEqual(
        await menubaritem.getAttribute('aria-expanded'),
        'true',
        'aria-expanded should be "true" for "' + menubaritem.getText() + '"'
      );
      t.pass();
    }
  }
);

ariaTest(
  'Test aria-haspopup set to true on sub menu menuitems with popups',
  exampleFile,
  'menu-menuitem-aria-haspopup',
  async (t) => {
    await assertAttributeValues(
      t,
      ex.submenuMenuitemsWithOwns,
      'aria-haspopup',
      'true'
    );

    await assertAttributeValues(
      t,
      ex.submenuMenuitemsWithExpanded,
      'aria-haspopup',
      'true'
    );

    await assertAttributeValues(
      t,
      ex.submenuMenuitemsWithHasPopup,
      'aria-haspopup',
      'true'
    );
  }
);

ariaTest(
  '"aria-expanded" attribute on sub-menu menuitem',
  exampleFile,
  'menu-menuitem-aria-expanded-false',
  async (t) => {
    // Before interacting with page, make sure aria-expanded is set to false
    await assertAttributeValues(
      t,
      ex.submenuMenuitemsWithExpanded,
      'aria-expanded',
      'false'
    );

    // AND make sure no submenus are visible
    const submenus = await t.context.queryElements(
      t,
      ex.submenuMenuitemsWithExpanded
    );
    for (let submenu of submenus) {
      const menuId = await submenu.getAttribute('aria-owns');
      const menuSelector = '#' + menuId;
      const menuElement = await t.context.queryElement(t, menuSelector);

      t.false(
        await menuElement.isDisplayed(),
        'Submenu with ID "' + menuId + ' should NOT be displayed on load'
      );
    }
  }
);

ariaTest(
  '"aria-expanded" attribute on sub-menu menuitem',
  exampleFile,
  'menu-menuitem-aria-expanded-true',
  async (t) => {
    const menubarMenuitems = await t.context.queryElements(
      t,
      ex.menubarMenuitemSelector
    );

    for (let menubarMenuitem of menubarMenuitems) {
      const menuId = await menubarMenuitem.getAttribute('aria-owns');

      if (menuId) {
        const menuSelector = '#' + menuId;
        const menuElement = await t.context.queryElement(t, menuSelector);

        await menubarMenuitem.sendKeys(Key.ARROW_DOWN);

        t.true(
          (await await menubarMenuitem.getAttribute('aria-expanded')) ===
            'true',
          'Submenu "' +
            menubarMenuitem.getText() +
            '" aria-expanded must be "true"'
        );

        t.true(
          await menuElement.isDisplayed(),
          'Submenu with ID "' +
            menuId +
            '" should be displayed when menu is expanded'
        );

        const expandableMenuitems = await t.context.queryElements(
          t,
          '[aria-expanded]',
          menuElement,
          true
        );

        for (let expandableMenuitem of expandableMenuitems) {
          const submenuId = await expandableMenuitem.getAttribute('aria-owns');

          if (submenuId) {
            const submenuSelector = '#' + submenuId;
            const submenuElement = await t.context.queryElement(
              t,
              submenuSelector
            );

            await expandableMenuitem.sendKeys(Key.ARROW_RIGHT);

            t.true(
              (await await expandableMenuitem.getAttribute('aria-expanded')) ===
                'true',
              'Submenu "' + submenuId + '" aria-expanded must be "true"'
            );

            t.true(
              await submenuElement.isDisplayed(),
              'Submenu with ID "' +
                submenuId +
                '" should be displayed when sub menu is expanded'
            );
          }
        }
      }
    }
  }
);

ariaTest(
  'Test for role="none" on menubar li',
  exampleFile,
  'menubar-role-none',
  async (t) => {
    const liElements = await t.context.queryElements(
      t,
      ex.menubarSelector + '>li'
    );

    for (let liElement of liElements) {
      t.is(
        await liElement.getAttribute('role'),
        'none',
        '"role=none" should be found on all list elements that are immediate descendants of: ' +
          ex.menubarSelector
      );
    }
  }
);

ariaTest(
  'Test for role="none" on menu li',
  exampleFile,
  'menu-role-none',
  async (t) => {
    const liElements = await t.context.queryElements(
      t,
      ex.anyMenuSelector + '>li'
    );

    for (let liElement of liElements) {
      var isSeparator =
        (await await liElement.getAttribute('role')) == 'separator';
      if (!isSeparator) {
        t.is(
          await liElement.getAttribute('role'),
          'none',
          '"role=none" should be found on all list elements that are immediate descendants of: ' +
            ex.anyMenuSelector
        );
      }
    }
  }
);

ariaTest('Test for role="menu" on ul', exampleFile, 'menu-role', async (t) => {
  await assertAriaRoles(t, 'ex1', 'menu', ex.numTotalMenus, 'ul');
});

ariaTest(
  'Test for aria-label on role="menu"',
  exampleFile,
  'menu-aria-label',
  async (t) => {
    await assertAriaLabelExists(t, ex.anyMenuSelector);
  }
);

ariaTest(
  'Test for submenu role="menuitem"s with accessible names',
  exampleFile,
  'menu-menuitem-role',
  async (t) => {
    const menuitems = await t.context.queryElements(
      t,
      ex.anyMenuMenuitemSelector
    );

    let count = 0;

    for (let item of menuitems) {
      const isSeparator =
        (await await item.getAttribute('role')) === 'separator';
      if (!isSeparator) {
        count += 1;
      }
    }

    t.truthy(
      count,
      '"role=menuitem" elements should be found by selector: ' +
        ex.anyMenuMenuitemSelector
    );
  }
);

ariaTest(
  'Test tabindex="-1" on submenu role="menuitem"s',
  exampleFile,
  'menu-menuitem-tabindex',
  async (t) => {
    await assertAttributeValues(
      t,
      ex.anyMenuMenuitemSelector,
      'tabindex',
      '-1'
    );
  }
);

// await new Promise(resolve => setTimeout(resolve, 3000));
// KEYS
ariaTest(
  'Key ENTER open submenu',
  exampleFile,
  'menubar-space-or-enter',
  async (t) => {
    const keys = ['ENTER', 'SPACE'];
    const keyCodes = { ENTER: Key.ENTER, SPACE: ' ' };
    // Indexes are to menuitems in the menubar
    const menubarIndexes = [1, 2, 3];
    const menuIndexes = [0, 3, 5];
    const menuitemIndexes = [2, 13, 23];

    for (let j = 0; j < keys.length; j++) {
      const key = keys[j];
      const keyCode = keyCodes[key];

      for (let i = 0; i < menubarIndexes.length; i++) {
        const menubaritems = await t.context.queryElements(
          t,
          ex.menubarMenuitemSelector
        );

        const menubarIndex = menubarIndexes[i];
        await menubaritems[menubarIndex].sendKeys(keyCode);

        const menus = await t.context.queryElements(t, ex.anyMenuSelector);

        const menuElement = menus[menuIndexes[i]];
        const menuId = await menuElement.getAttribute('id');

        // Test that the submenu is displayed
        t.true(
          await menuElement.isDisplayed(),
          'Sending key "' +
            key +
            '" to menuitem referencing menu with id="' +
            menuId +
            '" in menubar should display submenu'
        );

        // Check that focus is on first menuitem
        t.true(
          await checkFocus(t, ex.anyMenuitemSelector, menuitemIndexes[i]),
          'Sending key "' +
            key +
            '" to menubar item index "' +
            menubarIndexes[i] +
            '" in menubar should send focus to menuitem index "' +
            menuitemIndexes[i] +
            '" the first element in the submenu'
        );
      }
    }
  }
);

ariaTest(
  'Key ARROW_RIGHT moves focus to next menubar item',
  exampleFile,
  'menubar-right-arrow',
  async (t) => {
    const menubaritems = await t.context.queryElements(
      t,
      ex.menubarMenuitemSelector
    );

    const numMenuitems = menubaritems.length;

    for (let menuIndex = 0; menuIndex < numMenuitems + 1; menuIndex++) {
      const currentIndex = menuIndex % numMenuitems;
      const nextIndex = (menuIndex + 1) % numMenuitems;

      // Send the ARROW_RIGHT key
      await menubaritems[currentIndex].sendKeys(Key.ARROW_RIGHT);

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
  'Key ARROW_LEFT moves focus to next menubar item',
  exampleFile,
  'menubar-left-arrow',
  async (t) => {
    const menubaritems = await t.context.queryElements(
      t,
      ex.menubarMenuitemSelector
    );

    const numMenuitems = menubaritems.length;

    // Send the ARROW_LEFT key to the first menuitem
    await menubaritems[0].sendKeys(Key.ARROW_LEFT);

    // Test the focus is on the last menu item
    t.true(
      await checkFocus(t, ex.menubarMenuitemSelector, numMenuitems - 1),
      'Sending key "ARROW_LEFT" to menuitem 0 will change focus to menu item 3'
    );

    for (let menuIndex = numMenuitems - 1; menuIndex > 0; menuIndex--) {
      // Send the ARROW_LEFT key
      await menubaritems[menuIndex].sendKeys(Key.ARROW_LEFT);

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
  'menubar-up-arrow',
  async (t) => {
    const menubarIndexes = [1, 2, 3];
    const menuIndexes = [0, 3, 5];
    const menuitemIndexes = [8, 21, 30];

    for (let i = 0; i < menubarIndexes.length; i++) {
      const menubaritems = await t.context.queryElements(
        t,
        ex.menubarMenuitemSelector
      );

      const menubarIndex = menubarIndexes[i];
      await menubaritems[menubarIndex].sendKeys(Key.UP);

      const menus = await t.context.queryElements(t, ex.anyMenuSelector);

      const menuElement = menus[menuIndexes[i]];
      const menuId = await menuElement.getAttribute('id');

      // Test that the submenu is displayed
      t.true(
        await menuElement.isDisplayed(),
        'Sending key ARROW_UP to menuitem referencing menu with id="' +
          menuId +
          '" in menubar should display submenu'
      );

      // Check that focus is on first menuitem
      t.true(
        await checkFocus(t, ex.anyMenuitemSelector, menuitemIndexes[i]),
        'Sending key ARROW_UP to menubar item index "' +
          menubarIndexes[i] +
          '" in menubar should send focus to menuitem index "' +
          menuitemIndexes[i] +
          '" the last element in the submenu'
      );
    }
  }
);

ariaTest(
  'Key ARROW_DOWN opens submenu, focus on first item',
  exampleFile,
  'menubar-down-arrow',
  async (t) => {
    const menubarIndexes = [1, 2, 3];
    const menuIndexes = [0, 3, 5];
    const menuitemIndexes = [2, 13, 23];

    for (let i = 0; i < menubarIndexes.length; i++) {
      const menubaritems = await t.context.queryElements(
        t,
        ex.menubarMenuitemSelector
      );

      const menubarIndex = menubarIndexes[i];
      await menubaritems[menubarIndex].sendKeys(Key.DOWN);

      const menus = await t.context.queryElements(t, ex.anyMenuSelector);

      const menuElement = menus[menuIndexes[i]];
      const menuId = await menuElement.getAttribute('id');

      // Test that the submenu is displayed
      t.true(
        await menuElement.isDisplayed(),
        'Sending key ARROW_DOWN to menuitem referencing menu with id="' +
          menuId +
          '" in menubar should display submenu'
      );

      // Check that focus is on first menuitem
      t.true(
        await checkFocus(t, ex.anyMenuitemSelector, menuitemIndexes[i]),
        'Sending key ARROW_DOWN to menubar item index "' +
          menubarIndexes[i] +
          '" in menubar should send focus to menuitem index "' +
          menuitemIndexes[i] +
          '" the last element in the submenu'
      );
    }
  }
);

ariaTest(
  'Key HOME goes to first item in menubar',
  exampleFile,
  'menubar-home',
  async (t) => {
    const menubaritems = await t.context.queryElements(
      t,
      ex.menubarMenuitemSelector
    );

    const numMenubaritems = menubaritems.length;

    for (let menuIndex = 0; menuIndex < numMenubaritems; menuIndex++) {
      // Send the ARROW_RIGHT key to move the focus to later menu item for every test
      for (let i = 0; i < menuIndex; i++) {
        await menubaritems[i].sendKeys(Key.ARROW_RIGHT);
      }

      // Send the key HOME
      await menubaritems[menuIndex].sendKeys(Key.HOME);

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
  'menubar-end',
  async (t) => {
    const menubaritems = await t.context.queryElements(
      t,
      ex.menubarMenuitemSelector
    );

    const numMenubaritems = menubaritems.length;

    for (let menuIndex = 0; menuIndex < numMenubaritems; menuIndex++) {
      // Send the ARROW_RIGHT key to move the focus to later menu item for every test
      for (let i = 0; i < menuIndex; i++) {
        await menubaritems[i].sendKeys(Key.ARROW_RIGHT);
      }

      // Send the key END
      await menubaritems[menuIndex].sendKeys(Key.END);

      // Test that the focus is on the last item in the list
      t.true(
        await checkFocus(t, ex.menubarMenuitemSelector, numMenubaritems - 1),
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
  'menubar-character',
  async (t) => {
    const charIndexTest = [
      { sendChar: 'z', sendIndex: 0, endIndex: 0 },
      { sendChar: 'a', sendIndex: 0, endIndex: 1 },
      { sendChar: 'a', sendIndex: 1, endIndex: 2 },
      { sendChar: 'a', sendIndex: 2, endIndex: 3 },
      { sendChar: 'a', sendIndex: 3, endIndex: 1 },
    ];

    const menubaritems = await t.context.queryElements(
      t,
      ex.menubarMenuitemSelector
    );
    for (let test of charIndexTest) {
      // Send character to menuitem
      await menubaritems[test.sendIndex].sendKeys(test.sendChar);

      // Test that the focus switches to the appropriate menuitem
      t.true(
        await checkFocus(t, ex.menubarMenuitemSelector, test.endIndex),
        'Sending characther ' +
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
  'submenu-space-or-enter',
  async (t) => {
    // Indexes to menuitems in the test
    // first number is the menuitem to test
    // second number is the index to ta menuitem that must be open
    //  if number is -1 that means that menu does not need
    //  to be open
    // third number is the index to a menuitem that must be open
    //  if number is -1 that means that menu does not need
    //  to be open
    // The text string is what the title should be when the link is
    //   activated
    const testMenuitems = [
      [0, -1, -1, 'Home'],
      [2, 1, -1, 'Overview'],
      [3, 1, -1, 'Administration'],
      [5, 1, 4, 'History'],
      [6, 1, 4, 'Current Statistics'],
      [7, 1, 4, 'Awards'],
      [9, 1, 8, 'For prospective students'],
      [10, 1, 8, 'For alumni'],
      [11, 1, 8, 'For visitors'],
      [13, 12, -1, 'Apply'],
      [15, 12, 14, 'Undergraduate'],
      [16, 12, 14, 'Graduate'],
      [17, 12, 14, 'Professional Schools'],
      [18, 12, -1, 'Sign Up'],
      [19, 12, -1, 'Visit'],
      [20, 12, -1, 'Photo Tour'],
      [21, 12, -1, 'Connect'],
      [23, 22, -1, 'Colleges & Schools'],
      [24, 22, -1, 'Programs of Study'],
      [25, 22, -1, 'Honors Programs'],
      [26, 22, -1, 'Online Courses'],
      [27, 22, -1, 'Course Explorer'],
      [28, 22, -1, 'Register for Class'],
      [29, 22, -1, 'Academic Calendar'],
      [30, 22, -1, 'Transcripts'],
    ];

    const numTests = testMenuitems.length;

    const keys = ['ENTER', 'SPACE'];
    const keyCodes = { ENTER: Key.ENTER, SPACE: ' ' };

    for (let j = 0; j < keys.length; j++) {
      const key = keys[j];
      const keyCode = keyCodes[key];

      for (let i = 0; i < numTests; i++) {
        const testMenuitem = testMenuitems[i];
        const indexMenuitem = testMenuitem[0];
        const indexMenubarOpen = testMenuitem[1];
        const indexSubmenuOpen = testMenuitem[2];
        const menuitemText = testMenuitem[3];

        let menuitems = await t.context.queryElements(
          t,
          ex.anyMenuitemSelector
        );

        // Open up menubar menu if needed
        if (indexMenubarOpen >= 0) {
          await menuitems[indexMenubarOpen].sendKeys(Key.ENTER);

          menuitems = await t.context.queryElements(t, ex.anyMenuitemSelector);
        }

        // Open up submenu if needed
        if (indexSubmenuOpen >= 0) {
          await menuitems[indexSubmenuOpen].sendKeys(Key.ENTER);

          menuitems = await t.context.queryElements(t, ex.anyMenuitemSelector);
        }

        await menuitems[indexMenuitem].sendKeys(keyCode);

        t.true(
          await compareText(t, ex.titleSelector, menuitemText),
          'Sending key "' +
            key +
            '" to menuitem "' +
            menuitemText +
            '" should update the content title.'
        );

        // Test that the focus switches to the title
        t.true(
          await checkFocus(t, ex.titleSelector, 0),
          'Sending key "' +
            key +
            '" to menuitem "' +
            '" the focus should be on the content title.'
        );
      }
    }
  }
);

/*
ariaTest(
  'ESCAPE to submenu closes submenu',
  exampleFile,
  'submenu-escape',
  async (t) => {
    const menubaritems = await t.context.queryElements(
      t,
      ex.menubarMenuitemWithPopupSelector
    );

    const numMenubaritems = menubaritems.length;

    const menus = await t.context.queryElements(t, ex.menuSelector);

    // Test all the level one menuitems

    for (let menuIndex = 0; menuIndex < numMenubaritems; menuIndex++) {
      for (
        let itemIndex = 0;
        itemIndex < ex.numMenuMenuitems[menuIndex];
        itemIndex++
      ) {
        // Open the submenu
        await menubaritems[menuIndex].sendKeys(Key.ENTER);

        const items = await t.context.queryElements(
          t,
          ex.menuMenuitemSelectors[menuIndex]
        );
        const itemText = await items[itemIndex].getText();

        // send ESCAPE to the item
        await items[itemIndex].sendKeys(Key.ESCAPE);

        t.false(
          await menus[menuIndex].isDisplayed(),
          'Sending key "ESCAPE" to submenuitem "' +
            itemText +
            '" should close the menu'
        );
        t.true(
          await checkFocus(t, ex.menubarMenuitemSelector, menuIndex),
          'Sending key "ESCAPE" to submenuitem "' +
            itemText +
            '" should change the focus to menuitem ' +
            menuIndex +
            ' in the menubar'
        );
      }
    }

    // Test all the submenu menuitems

    for (let submenuLocation of ex.submenuLocations) {
      const [menuIndex, menuitemIndex] = submenuLocation;

      // Get the submenu items we are testing
      let submenuMenuitemSelector = getSubmenuMenuitemSelector(
        menuIndex,
        menuitemIndex
      );
      const items = await t.context.queryElements(t, submenuMenuitemSelector);
      const numItems = items.length;
    }
  }
);

/*
ariaTest.failing(
  'ARROW_RIGHT to submenu closes submenu and opens next',
  exampleFile,
  'submenu-right-arrow',
  async (t) => {
    const menubaritems = await t.context.queryElements(
      t,
      ex.menubarMenuitemSelector
    );
    const menus = await t.context.queryElements(t, ex.menuSelector);

    // Test all the level one menuitems

    for (let menuIndex = 0; menuIndex < ex.numMenus; menuIndex++) {
      for (
        let itemIndex = 0;
        itemIndex < ex.numMenuMenuitems[menuIndex];
        itemIndex++
      ) {
        // Open the submenu
        await menubaritems[menuIndex].sendKeys(Key.ENTER);

        const items = await t.context.queryElements(
          t,
          ex.menuMenuitemSelectors[menuIndex]
        );
        const itemText = await items[itemIndex].getText();
        const hasSubmenu = await items[itemIndex].getAttribute('aria-haspopup');

        // send ARROW_RIGHT to the item
        await items[itemIndex].sendKeys(Key.ARROW_RIGHT);

        if (hasSubmenu) {
          const submenuSelector = getSubmenuSelector(menuIndex, itemIndex);
          const submenuMenuitemSelector = getSubmenuMenuitemSelector(
            menuIndex,
            itemIndex
          );

          t.true(
            await t.context.session
              .findElement(By.css(submenuSelector))
              .isDisplayed(),
            'Sending key "ARROW_RIGHT" to menuitem "' +
              itemText +
              '" should open the submenu: ' +
              submenuSelector
          );
          t.true(
            await checkFocus(t, submenuMenuitemSelector, 0),
            'Sending key "ARROW_RIGHT" to menuitem "' +
              itemIndex +
              '" should put focus on first item in submenu: ' +
              submenuSelector
          );
        } else {
          // Account for wrapping (index 0 should go to 3)
          const nextMenuIndex = menuIndex === 2 ? 0 : menuIndex + 1;

          // Test that the submenu is closed
          t.false(
            await menus[menuIndex].isDisplayed(),
            'Sending key "ARROW_RIGHT" to submenuitem "' +
              itemText +
              '" should close list'
          );

          // Test that the focus is on the menuitem in the menubar
          t.true(
            await checkFocus(t, ex.menubarMenuitemSelector, nextMenuIndex),
            'Sending key "ARROW_RIGHT" to submenuitem "' +
              itemText +
              '" should send focus to menuitem' +
              nextMenuIndex +
              ' in the menubar'
          );
        }
      }
    }
  }
);

ariaTest.failing(
  'ARROW_RIGHT to submenu closes submenu and opens next',
  exampleFile,
  'submenu-right-arrow',
  async (t) => {
    const menubaritems = await t.context.queryElements(t, ex.menubarMenuitemSelector);
    const menus = await t.context.queryElements(t, ex.menuSelector);

    // Test all the level one menuitems

    for (let menuIndex = 0; menuIndex < ex.numMenus; menuIndex++) {
      for (let itemIndex = 0; itemIndex < ex.numMenuMenuitems[menuIndex]; itemIndex++) {

        // Open the submenu
        await menubaritems[menuIndex].sendKeys(Key.ENTER);

        // Test all the submenu menuitems
        for (let submenuLocation of ex.submenuLocations) {
          const [menuIndex, menuitemIndex] = submenuLocation;

          // Get the submenu items we are testing
          const submenuMenuitemSelector = getSubmenuMenuitemSelector(
            menuIndex,
            menuitemIndex
          );
          const items = await t.context.queryElements(t, submenuMenuitemSelector);
          const numItems = items.length;

          for (let itemIndex = 0; itemIndex < numItems; itemIndex++) {
            await openSubmenu(t, ...submenuLocation);

            // send ARROW_RIGHT to the item
            const itemText = await items[itemIndex].getText();
            await items[itemIndex].sendKeys(Key.ARROW_RIGHT);

            // Account for wrapping (index 0 should go to 3)
            const nextMenuIndex = menuIndex === 2 ? 0 : menuIndex + 1;

            // Test that the submenu is closed
            t.false(
              await menus[menuIndex].isDisplayed(),
              'Sending key "ARROW_RIGHT" to submenuitem "' +
                itemText +
                '" should close list'
            );

            // Test that the focus is on the menuitem in the menubar
            t.true(
              await checkFocus(t, ex.menubarMenuitemSelector, nextMenuIndex),
              'Sending key "ARROW_RIGHT" to submenuitem "' +
                itemText +
                '" should send focus to menuitem' +
                nextMenuIndex +
                ' in the menubar'
            );
          }
        }
      }
    }
  }
);

ariaTest.failing(
  'ARROW_LEFT to submenu closes submenu and opens next',
  exampleFile,
  'submenu-left-arrow',
  async (t) => {
    const menubaritems = await t.context.queryElements(
      t,
      ex.menubarMenuitemSelector
    );
    const menus = await t.context.queryElements(t, ex.menuSelector);

    // Test all the level one menuitems

    for (let menuIndex = 0; menuIndex < ex.numMenus; menuIndex++) {
      for (
        let itemIndex = 0;
        itemIndex < ex.numMenuMenuitems[menuIndex];
        itemIndex++
      ) {
        // Open the submenu
        await menubaritems[menuIndex].sendKeys(Key.ENTER);

        const items = await t.context.queryElements(
          t,
          ex.menuMenuitemSelectors[menuIndex]
        );
        const itemText = await items[itemIndex].getText();

        // send ARROW_LEFT to the item
        await items[itemIndex].sendKeys(Key.ARROW_LEFT);

        // Account for wrapping (index 0 should go to 3)
        const nextMenuIndex = menuIndex === 0 ? 2 : menuIndex - 1;

        // Test that the submenu is closed
        t.false(
          await menus[menuIndex].isDisplayed(),
          'Sending key "ARROW_LEFT" to submenuitem "' +
            itemText +
            '" should close list'
        );

        // Test that the focus is on the menuitem in the menubar
        t.true(
          await checkFocus(t, ex.menubarMenuitemSelector, nextMenuIndex),
          'Sending key "ARROW_LEFT" to submenuitem "' +
            itemText +
            '" should send focus to menuitem' +
            nextMenuIndex +
            ' in the menubar'
        );
      }
    }
  }
);

ariaTest.failing(
  'ARROW_LEFT to submenu closes submenu and opens next',
  exampleFile,
  'submenu-left-arrow',
  async (t) => {
    const menubaritems = await t.context.queryElements(t, ex.menubarMenuitemSelector);
    const menus = await t.context.queryElements(t, ex.menuSelector);

    // Test all the submenu menuitems
    for (let submenuLocation of ex.submenuLocations) {
      const [menuIndex, menuitemIndex] = submenuLocation;

      // Get the submenu items we are testing
      const submenuMenuitemSelector = getSubmenuMenuitemSelector(
        menuIndex,
        menuitemIndex
      );
      const items = await t.context.queryElements(t, submenuMenuitemSelector);
      const numItems = items.length;

      for (let itemIndex = 0; itemIndex < numItems; itemIndex++) {
        await openSubmenu(t, ...submenuLocation);

        // send ARROW_LEFT to the item
        const itemText = await items[itemIndex].getText();
        await items[itemIndex].sendKeys(Key.ARROW_LEFT);

        const submenuSelector = getSubmenuSelector(...submenuLocation);
        t.false(
          await t.context.session
            .findElement(By.css(submenuSelector))
            .isDisplayed(),
          'Sending key "ARROW_LEFT" to submenuitem "' +
            itemText +
            '" should close the menu'
        );

        t.true(
          await checkFocus(
            t,
            ex.menuMenuitemSelectors[menuIndex],
            menuitemIndex
          ),
          'Sending key "ARROW_LEFT" to submenuitem "' +
            itemText +
            '" should send focus to menuitem ' +
            menuitemIndex +
            ' in the parent menu'
        );
      }
    }
  }
);

ariaTest.failing(
  'ARROW_DOWN moves focus in menu',
  exampleFile,
  'submenu-down-arrow',
  async (t) => {
    const menubaritems = await t.context.queryElements(
      t,
      ex.menubarMenuitemSelector
    );
    const menus = await t.context.queryElements(t, ex.menuSelector);

    // Test all the level one menuitems

    for (let menuIndex = 0; menuIndex < ex.numMenus; menuIndex++) {
      for (
        let itemIndex = 0;
        itemIndex < ex.numMenuMenuitems[menuIndex];
        itemIndex++
      ) {
        // Open the submenu
        await menubaritems[menuIndex].sendKeys(Key.ENTER);

        const items = await t.context.queryElements(
          t,
          ex.menuMenuitemSelectors[menuIndex]
        );
        const itemText = await items[itemIndex].getText();

        // send ARROW_DOWN to the item
        await items[itemIndex].sendKeys(Key.ARROW_DOWN);

        // Account for wrapping (last item should move to first item)
        const nextItemIndex =
          itemIndex === ex.numMenuMenuitems[menuIndex] - 1 ? 0 : itemIndex + 1;

        // Test that the focus is on the menuitem in the menubar
        t.true(
          await checkFocus(
            t,
            ex.menuMenuitemSelectors[menuIndex],
            nextItemIndex
          ),
          'Sending key "ARROW_DOWN" to submenuitem "' +
            itemText +
            '" should send focus to menuitem' +
            nextItemIndex +
            ' in the same menu'
        );
      }
    }

    // Test all the submenu menuitems
    for (let submenuLocation of ex.submenuLocations) {
      const [menuIndex, menuitemIndex] = submenuLocation;

      // Get the submenu items we are testing
      const submenuMenuitemSelector = getSubmenuMenuitemSelector(
        menuIndex,
        menuitemIndex
      );
      const items = await t.context.queryElements(t, submenuMenuitemSelector);
      const numItems = items.length;

      for (let itemIndex = 0; itemIndex < numItems; itemIndex++) {
        await openSubmenu(t, ...submenuLocation);

        // send ARROW_DOWN to the item
        const itemText = await items[itemIndex].getText();
        await items[itemIndex].sendKeys(Key.ARROW_DOWN);

        // Account for wrapping (last item should move to first item)
        const nextItemIndex = itemIndex === numItems - 1 ? 0 : itemIndex + 1;

        // Test that the focus is on the menuitem in the menubar
        t.true(
          await checkFocus(t, submenuMenuitemSelector, nextItemIndex),
          'Sending key "ARROW_DOWN" to submenuitem "' +
            itemText +
            '" should send focus to menuitem' +
            nextItemIndex +
            ' in the same menu'
        );
      }
    }
  }
);

ariaTest.failing(
  'ARROW_UP moves focus in menu',
  exampleFile,
  'submenu-up-arrow',
  async (t) => {
    const menubaritems = await t.context.queryElements(
      t,
      ex.menubarMenuitemSelector
    );
    const menus = await t.context.queryElements(t, ex.menuSelector);

    // Test all the level one menuitems

    for (let menuIndex = 0; menuIndex < ex.numMenus; menuIndex++) {
      for (
        let itemIndex = 0;
        itemIndex < ex.numMenuMenuitems[menuIndex];
        itemIndex++
      ) {
        // Open the submenu
        await menubaritems[menuIndex].sendKeys(Key.ENTER);

        const items = await t.context.queryElements(
          t,
          ex.menuMenuitemSelectors[menuIndex]
        );
        const itemText = await items[itemIndex].getText();

        // send ARROW_UP to the item
        await items[itemIndex].sendKeys(Key.ARROW_UP);

        // Account for wrapping (last item should move to first item)
        const nextItemIndex =
          itemIndex === 0 ? ex.numMenuMenuitems[menuIndex] - 1 : itemIndex - 1;

        // Test that the focus is on the menuitem in the menubar
        t.true(
          await checkFocus(
            t,
            ex.menuMenuitemSelectors[menuIndex],
            nextItemIndex
          ),
          'Sending key "ARROW_UP" to submenuitem "' +
            itemText +
            '" should send focus to menuitem' +
            nextItemIndex +
            ' in the same menu'
        );
      }
    }

    // Test all the submenu menuitems
    for (let submenuLocation of ex.submenuLocations) {
      const [menuIndex, menuitemIndex] = submenuLocation;

      // Get the submenu items we are testing
      const submenuMenuitemSelector = getSubmenuMenuitemSelector(
        menuIndex,
        menuitemIndex
      );
      const items = await t.context.queryElements(t, submenuMenuitemSelector);
      const numItems = items.length;

      for (let itemIndex = 0; itemIndex < numItems; itemIndex++) {
        await openSubmenu(t, ...submenuLocation);

        // send ARROW_UP to the item
        const itemText = await items[itemIndex].getText();
        await items[itemIndex].sendKeys(Key.ARROW_UP);

        // Account for wrapping (last item should move to first item)
        const nextItemIndex = itemIndex === 0 ? numItems - 1 : itemIndex - 1;

        // Test that the focus is on the menuitem in the menubar
        t.true(
          await checkFocus(t, submenuMenuitemSelector, nextItemIndex),
          'Sending key "ARROW_UP" to submenuitem "' +
            itemText +
            '" should send focus to menuitem' +
            nextItemIndex +
            ' in the same menu'
        );
      }
    }
  }
);

ariaTest.failing('HOME moves focus in menu', exampleFile, 'submenu-home', async (t) => {
  const menubaritems = await t.context.queryElements(
    t,
    ex.menubarMenuitemSelector
  );
  const menus = await t.context.queryElements(t, ex.menuSelector);

  // Test all the level one menuitems

  for (let menuIndex = 0; menuIndex < ex.numMenus; menuIndex++) {
    for (
      let itemIndex = 0;
      itemIndex < ex.numMenuMenuitems[menuIndex];
      itemIndex++
    ) {
      // Open the submenu
      await menubaritems[menuIndex].sendKeys(Key.ENTER);

      const items = await t.context.queryElements(
        t,
        ex.menuMenuitemSelectors[menuIndex]
      );
      const itemText = await items[itemIndex].getText();

      // send HOME to the item
      await items[itemIndex].sendKeys(Key.HOME);

      // Test that the focus is on the menuitem in the menubar
      t.true(
        await checkFocus(t, ex.menuMenuitemSelectors[menuIndex], 0),
        'Sending key "HOME" to submenuitem "' +
          itemText +
          '" should send focus to first  menuitem in the same menu'
      );
    }
  }

  // Test all the submenu menuitems
  for (let submenuLocation of ex.submenuLocations) {
    const [menuIndex, menuitemIndex] = submenuLocation;

    // Get the submenu items we are testing
    const submenuMenuitemSelector = getSubmenuMenuitemSelector(
      menuIndex,
      menuitemIndex
    );
    const items = await t.context.queryElements(t, submenuMenuitemSelector);
    const numItems = items.length;

    for (let itemIndex = 0; itemIndex < numItems; itemIndex++) {
      await openSubmenu(t, ...submenuLocation);

      // send HOME to the item
      const itemText = await items[itemIndex].getText();
      await items[itemIndex].sendKeys(Key.HOME);

      t.true(
        await checkFocus(t, submenuMenuitemSelector, 0),
        'Sending key "HOME" to submenuitem "' +
          itemText +
          '" should send focus to the first menuitem in the same menu'
      );
    }
  }
});

ariaTest.failing('END moves focus in menu', exampleFile, 'submenu-end', async (t) => {
  const menubaritems = await t.context.queryElements(
    t,
    ex.menubarMenuitemSelector
  );
  const menus = await t.context.queryElements(t, ex.menuSelector);

  // Test all the level one menuitems

  for (let menuIndex = 0; menuIndex < ex.numMenus; menuIndex++) {
    for (
      let itemIndex = 0;
      itemIndex < ex.numMenuMenuitems[menuIndex];
      itemIndex++
    ) {
      // Open the submenu
      await menubaritems[menuIndex].sendKeys(Key.ENTER);

      const items = await t.context.queryElements(
        t,
        ex.menuMenuitemSelectors[menuIndex]
      );
      const itemText = await items[itemIndex].getText();

      // send END to the item
      await items[itemIndex].sendKeys(Key.END);

      // Test that the focus is on the menuitem in the menubar
      t.true(
        await checkFocus(
          t,
          ex.menuMenuitemSelectors[menuIndex],
          ex.numMenuMenuitems[menuIndex] - 1
        ),
        'Sending key "END" to submenuitem "' +
          itemText +
          '" should send focus to last menuitem in the same menu'
      );
    }
  }

  // Test all the submenu menuitems
  for (let submenuLocation of ex.submenuLocations) {
    const [menuIndex, menuitemIndex] = submenuLocation;

    // Get the submenu items we are testing
    const submenuMenuitemSelector = getSubmenuMenuitemSelector(
      menuIndex,
      menuitemIndex
    );
    const items = await t.context.queryElements(t, submenuMenuitemSelector);
    const numItems = items.length;

    for (let itemIndex = 0; itemIndex < numItems; itemIndex++) {
      await openSubmenu(t, ...submenuLocation);

      // send END to the item
      const itemText = await items[itemIndex].getText();
      await items[itemIndex].sendKeys(Key.END);

      t.true(
        await checkFocus(t, submenuMenuitemSelector, numItems - 1),
        'Sending key "END" to submenuitem "' +
          itemText +
          '" should send focus to the last menuitem in the same menu'
      );
    }
  }
});

ariaTest.failing(
  'Character sends to menubar changes focus in menubar',
  exampleFile,
  'submenu-character',
  async (t) => {

    const charIndexTest = [
      [ // Tests for menu dropdown 0
        { sendChar: 'a', sendIndex: 0, endIndex: 1 },
        { sendChar: 'x', sendIndex: 1, endIndex: 1 },
        { sendChar: 'o', sendIndex: 1, endIndex: 0 }
      ],
      [ // Tests for menu dropdown 1
        { sendChar: 'c', sendIndex: 0, endIndex: 5 },
        { sendChar: 'y', sendIndex: 5, endIndex: 5 }
      ],
      [ // Tests for menu dropdown 2
        { sendChar: 'c', sendIndex: 0, endIndex: 4 },
        { sendChar: 'r', sendIndex: 4, endIndex: 5 },
        { sendChar: 'z', sendIndex: 5, endIndex: 5 }
      ]
    ];

    const menubaritems = await t.context.queryElements(t, ex.menubarMenuitemSelector);
    for (let menuIndex = 0; menuIndex < ex.numMenus; menuIndex++) {

      // Open the dropdown
      await menubaritems[menuIndex].sendKeys(Key.ARROW_DOWN);
      const items = await t.context.queryElements(t, ex.menuMenuitemSelectors[menuIndex]);

      for (let test of charIndexTest[menuIndex]) {
        // Send character to menuitem
        const itemText = await items[test.sendIndex].getText();
        await items[test.sendIndex].sendKeys(test.sendChar);

        // Test that the focus switches to the appropriate menuitem
        t.true(
          await checkFocus(
            t,
            ex.menuMenuitemSelectors[menuIndex],
            test.endIndex
          ),
          'Sending characther ' +
            test.sendChar +
            ' to menuitem ' +
            itemText +
            ' should move the focus to menuitem ' +
            test.endIndex
        );
      }

      const subCharIndexTest = [
        [
          // Tests for menu dropdown 0
          { sendChar: 'c', sendIndex: 0, endIndex: 1 },
          { sendChar: 'h', sendIndex: 1, endIndex: 0 },
          { sendChar: 'x', sendIndex: 0, endIndex: 0 },
        ],
        [
          // Tests for menu dropdown 1
          { sendChar: 'f', sendIndex: 0, endIndex: 1 },
          { sendChar: 'f', sendIndex: 1, endIndex: 2 },
        ],
        [
          // Tests for menu dropdown 2
          { sendChar: 'p', sendIndex: 0, endIndex: 2 },
          { sendChar: 'z', sendIndex: 2, endIndex: 2 },
        ],
      ];

      let testIndex = 0;

      // Test all the submenu menuitems
      for (let submenuLocation of ex.submenuLocations) {
        const [menuIndex, menuitemIndex] = submenuLocation;

        await openSubmenu(t, ...submenuLocation);

        // Get the submenu items we are testing
        const submenuMenuitemSelector = getSubmenuMenuitemSelector(
          menuIndex,
          menuitemIndex
        );
        const items = await t.context.queryElements(t, submenuMenuitemSelector);

        for (let test of subCharIndexTest[testIndex]) {
          // Send character to menuitem
          const itemText = await items[test.sendIndex].getText();
          await items[test.sendIndex].sendKeys(test.sendChar);

          // Test that the focus switches to the appropriate menuitem
          t.true(
            await checkFocus(t, submenuMenuitemSelector, test.endIndex),
            'Sending characther ' +
              test.sendChar +
              ' to menuitem ' +
              itemText +
              ' should move the focus to menuitem ' +
              test.endIndex
          );
        }

        testIndex++;
      }
    }
  }
);
*/
