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

  // Menu menuitem selectors
  anyMenuMenuitemSelector: '#ex1 [role="menu"]>li>[role="menuitem"]',
  menuMenuitemSelectors: [
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
  numMenus: 4,
  numSubmenus: 3,
  numTotalMenus: 6,
  submenuLocations: [
    // [<index of top level menu>, <index of item in top level menu>]
    [1, 2],
    [1, 3],
    [2, 1],
  ],
  numMenuMenuitems: [1, 4, 6, 8],
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

const waitForUrlChange = async function (t) {
  return t.context.session
    .wait(() => {
      return t.context.session.getCurrentUrl().then((url) => {
        return url != t.context.url;
      });
    }, t.context.waitTime)
    .catch(() => {});
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
    await assertAttributeValues(
      t,
      ex.menubarMenuitemWithExpandedSelector,
      'aria-haspopup',
      'true'
    );
    await assertAttributeValues(
      t,
      ex.menubarMenuitemWithOwnsSelector,
      'aria-haspopup',
      'true'
    );
  }
);

ariaTest(
  'Test aria-owns exists on menubar menuitems with popup menus',
  exampleFile,
  'menubar-menuitem-aria-owns',
  async (t) => {
    await assertAriaOwns(t, ex.menubarMenuitemWithPopupSelector);
  }
);

ariaTest(
  'Test aria-expanded on menubar menuitems set to false when popup is closed',
  exampleFile,
  'menubar-menuitem-aria-expanded-false',
  async (t) => {
    await assertAttributeValues(
      t,
      ex.menubarMenuitemWithPopupSelector,
      'aria-expanded',
      'false'
    );
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

/*
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
  'sub-menuitem-role',
  async (t) => {
    const menuitems = await t.context.queryElements(
      t,
      ex.anyMenuMenuitemSelector
    );

    t.truthy(
      menuitems.length,
      '"role=menuitem" elements should be found by selector: ' +
        ex.anyMenuMenuitemSelector
    );

ariaTest.failing(
  'Test aria-haspopup on menuitems with submenus',
  exampleFile,
  'sub-menuitem-aria-haspopup',
  async (t) => {
    // Test the accessible name of each menuitem

    for (let menuitem of menuitems) {
      // The menuitem is not visible, so we cannot use selenium's "getText" function
      const menutext = await t.context.session.executeScript(function () {
        const el = arguments[0];
        return el.innerHTML;
      }, menuitem);

      t.truthy(
        menutext,
        '"role=menuitem" elements should all have accessible text content: ' +
          ex.anyMenuMenuitemSelector
      );
    }
  }
);

ariaTest(
  'Test tabindex="-1" on submenu role="menuitem"s',
  exampleFile,
  'sub-menuitem-tabindex',
  async (t) => {
    await assertAttributeValues(
      t,
      ex.anyMenuMenuitemSelector,
      'tabindex',
      '-1'
    );
  }
);

ariaTest(
  'Test aria-haspopup on menuitems with submenus',
  exampleFile,
  'sub-menuitem-aria-haspopup',
  async (t) => {
    const menubarMenuitems = await t.context.queryElements(
      t,
      ex.menubarMenuitemSelector
    );

    for (let menuIndex = 0; menuIndex < ex.numMenus; menuIndex++) {
      const menuItems = await t.context.queryElements(
        t,
        ex.menuMenuitemSelectors[menuIndex]
      );

      for (
        let menuitemIndex = 0;
        menuitemIndex < menuItems.length;
        menuitemIndex++
      ) {
        const menuitemHasSubmenu = doesMenuitemHaveSubmenu(
          menuIndex,
          menuitemIndex
        );

        const ariaPopup = menuitemHasSubmenu ? 'true' : null;
        const hasAriaPopupMsg = menuitemHasSubmenu
          ? 'aria-haspop set to "true".'
          : 'no aria-haspop attribute.';

        t.is(
          await menuItems[menuitemIndex].getAttribute('aria-haspopup'),
          ariaPopup,
          'menuitem at index ' +
            menuitemIndex +
            ' in menu at index ' +
            menuIndex +
            ' is expected ' +
            'to have ' +
            hasAriaPopupMsg
        );
      }
    }
  }
);

ariaTest(
  'Test aria-expanded on menuitems with submenus',
  exampleFile,
  'sub-menuitem-aria-expanded',
  async (t) => {
    const menubarMenuitems = await t.context.queryElements(
      t,
      ex.menubarMenuitemSelector
    );

    for (let submenuLocation of ex.submenuLocations) {
      const [menuIndex, menuitemIndex] = submenuLocation;

      // Send ARROW_DOWN to open menu
      await menubarMenuitems[menuIndex].sendKeys(Key.ARROW_DOWN);

      // Get the menuitems for that menu
      const menuitems = await t.context.queryElements(
        t,
        ex.menuMenuitemSelectors[menuIndex]
      );

      // Get the submenu associate with the menuitem we are testing
      const submenuSelector = getSubmenuSelector(menuIndex, menuitemIndex);

      t.is(
        await menuitems[menuitemIndex].getAttribute('aria-expanded'),
        'false',
        'menuitem at index ' +
          menuitemIndex +
          ' in menu at index ' +
          menuIndex +
          ' is expected ' +
          'to have aria-expanded="false" after opening the menu that contains it'
      );
      t.false(
        await t.context.session
          .findElement(By.css(submenuSelector))
          .isDisplayed(),
        'submenu attached to menuitem at index ' +
          menuitemIndex +
          ' in menu at index ' +
          menuIndex +
          ' is expected to not be displayed after opening the menu that contains the menuitem'
      );

      // Send ARROW_RIGHT to the menuitem we are testing
      await menuitems[menuitemIndex].sendKeys(Key.ARROW_RIGHT);

      t.is(
        await menuitems[menuitemIndex].getAttribute('aria-expanded'),
        'true',
        'menuitem at index ' +
          menuitemIndex +
          ' in menu at index ' +
          menuIndex +
          ' is expected ' +
          'to have aria-expanded="true" after sending right arrow to it'
      );
      t.true(
        await t.context.session
          .findElement(By.css(submenuSelector))
          .isDisplayed(),
        'submenu attached to menuitem at index ' +
          menuitemIndex +
          ' in menu at index ' +
          menuIndex +
          ' is expected to be displayed after sending left arrow to associated menuitem'
      );
    }
  }
});

// KEYS
ariaTest.failing(
  'Key ENTER open submenu',
  exampleFile,
  'menubar-space-or-enter',
  async (t) => {
    const menuitems = await t.context.queryElements(
      t,
      ex.menubarMenuitemSelector
    );
    const menus = await t.context.queryElements(t, ex.menuSelector);
    for (let menuIndex = 0; menuIndex < ex.numMenus; menuIndex++) {
      // Send the ENTER key
      await menuitems[menuIndex].sendKeys(Key.ENTER);

      // Test that the submenu is displayed
      t.true(
        await menus[menuIndex].isDisplayed(),
        'Sending key "ENTER" to menuitem ' +
          menuIndex +
          ' in menubar should display submenu'
      );

      t.true(
        await checkFocus(t, ex.menuMenuitemSelectors[menuIndex], 0),
        'Sending key "ENTER" to menuitem ' +
          menuIndex +
          ' in menubar should send focus to the first element in the submenu'
      );
    }
  }
);

ariaTest.failing(
  'Key SPACE open submenu',
  exampleFile,
  'menubar-space-or-enter',
  async (t) => {
    const menubaritems = await t.context.queryElements(
      t,
      ex.menubarMenuitemSelector
    );
    const menus = await t.context.queryElements(t, ex.menuSelector);
    for (let menuIndex = 0; menuIndex < ex.numMenus; menuIndex++) {
      // Send the SPACE key
      await menubaritems[menuIndex].sendKeys(' ');

      // Test that the submenu is displayed
      t.true(
        await menus[menuIndex].isDisplayed(),
        'Sending key "SPACE" to menuitem ' +
          menuIndex +
          ' in menubar should display submenu'
      );

      t.true(
        await checkFocus(t, ex.menuMenuitemSelectors[menuIndex], 0),
        'Sending key "SPACE" to menuitem ' +
          menuIndex +
          ' in menubar should send focus to the first element in the submenu'
      );
    }
  }
);

ariaTest.failing(
  'Key ARROW_RIGHT moves focus to next menubar item',
  exampleFile,
  'menubar-right-arrow',
  async (t) => {
    const menubaritems = await t.context.queryElements(
      t,
      ex.menubarMenuitemSelector
    );

    for (let menuIndex = 0; menuIndex < ex.numMenus + 1; menuIndex++) {
      const currentIndex = menuIndex % ex.numMenus;
      const nextIndex = (menuIndex + 1) % ex.numMenus;

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

ariaTest.failing(
  'Key ARROW_RIGHT moves focus to next menubar item',
  exampleFile,
  'menubar-left-arrow',
  async (t) => {
    const menubaritems = await t.context.queryElements(
      t,
      ex.menubarMenuitemSelector
    );

    // Send the ARROW_LEFT key to the first menuitem
    await menubaritems[0].sendKeys(Key.ARROW_LEFT);

    // Test the focus is on the last menu item
    t.true(
      await checkFocus(t, ex.menubarMenuitemSelector, ex.numMenus - 1),
      'Sending key "ARROW_LEFT" to menuitem 0 will change focus to menu item 3'
    );

    for (let menuIndex = ex.numMenus - 1; menuIndex > 0; menuIndex--) {
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

ariaTest.failing(
  'Key ARROW_UP opens submenu, focus on last item',
  exampleFile,
  'menubar-up-arrow',
  async (t) => {
    const menubaritems = await t.context.queryElements(
      t,
      ex.menubarMenuitemSelector
    );
    const menus = await t.context.queryElements(t, ex.menuSelector);
    for (let menuIndex = 0; menuIndex < ex.numMenus; menuIndex++) {
      // Send the ENTER key
      await menubaritems[menuIndex].sendKeys(Key.UP);

      // Test that the submenu is displayed
      t.true(
        await menus[menuIndex].isDisplayed(),
        'Sending key "ENTER" to menuitem ' +
          menuIndex +
          ' in menubar should display submenu'
      );

      const numSubItems = (
        await t.context.queryElements(t, ex.menuMenuitemSelectors[menuIndex])
      ).length;

      // Test that the focus is on the last item in the list
      t.true(
        await checkFocus(
          t,
          ex.menuMenuitemSelectors[menuIndex],
          numSubItems - 1
        ),
        'Sending key "ENTER" to menuitem ' +
          menuIndex +
          ' in menubar should send focus to the first element in the submenu'
      );
    }
  }
);

ariaTest.failing(
  'Key ARROW_DOWN opens submenu, focus on first item',
  exampleFile,
  'menubar-down-arrow',
  async (t) => {

    const menubaritems = await t.context.queryElements(
      t,
      ex.menubarMenuitemSelector
    );

    const menus = await t.context.queryElements(t, ex.menuSelector);
    for (let menuIndex = 0; menuIndex < ex.numMenus; menuIndex++) {
      // Send the ENTER key
      await menubaritems[menuIndex].sendKeys(Key.DOWN);

      // Test that the submenu is displayed
      t.true(
        await menus[menuIndex].isDisplayed(),
        'Sending key "ENTER" to menuitem ' +
          menuIndex +
          ' in menubar should display submenu'
      );

      // Test that the focus is on the first item in the list
      t.true(
        await checkFocus(t, ex.menuMenuitemSelectors[menuIndex], 0),
        'Sending key "ENTER" to menuitem ' +
          menuIndex +
          ' in menubar should send focus to the first element in the submenu'
      );
    }
  }
);

ariaTest.failing(
  'Key HOME goes to first item in menubar',
  exampleFile,
  'menubar-home',
  async (t) => {
    const menubaritems = await t.context.queryElements(
      t,
      ex.menubarMenuitemSelector
    );
    for (let menuIndex = 0; menuIndex < ex.numMenus; menuIndex++) {
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

ariaTest.failing(
  'Key END goes to last item in menubar',
  exampleFile,
  'menubar-end',
  async (t) => {
    const menubaritems = await t.context.queryElements(
      t,
      ex.menubarMenuitemSelector
    );
    for (let menuIndex = 0; menuIndex < ex.numMenus; menuIndex++) {
      // Send the ARROW_RIGHT key to move the focus to later menu item for every test
      for (let i = 0; i < menuIndex; i++) {
        await menubaritems[i].sendKeys(Key.ARROW_RIGHT);
      }

      // Send the key END
      await menubaritems[menuIndex].sendKeys(Key.END);

      // Test that the focus is on the last item in the list
      t.true(
        await checkFocus(t, ex.menubarMenuitemSelector, ex.numMenus - 1),
        'Sending key "END" to menuitem ' +
          menuIndex +
          ' in menubar should move the focus to the last menuitem'
      );
    }
  }
});

ariaTest.failing(
  'Character sends to menubar changes focus in menubar',
  exampleFile,
  'menubar-character',
  async (t) => {
    const charIndexTest = [
      { sendChar: 'z', sendIndex: 0, endIndex: 0 },
      { sendChar: 'a', sendIndex: 0, endIndex: 1 },
      { sendChar: 'a', sendIndex: 1, endIndex: 2 },
      { sendChar: 'a', sendIndex: 2, endIndex: 0 },
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

// This test is failing due to a bug reported in issue: https://github.com/w3c/aria-practices/issues/907
ariaTest.failing(
  'ENTER in submenu selects item',
  exampleFile,
  'submenu-space-or-enter',
  async (t) => {
    // Test all the level one menuitems

    for (let menuIndex = 0; menuIndex < ex.numMenus; menuIndex++) {
      for (
        let itemIndex = 0;
        itemIndex < ex.numMenuMenuitems[menuIndex];
        itemIndex++
      ) {
        await t.context.session.get(t.context.url);

        const menubaritems = await t.context.queryElements(
          t,
          ex.menubarMenuitemSelector
        );

        // Open the submenu
        await menubaritems[menuIndex].sendKeys(Key.ENTER);
        const items = await t.context.queryElements(
          t,
          ex.menuMenuitemSelectors[menuIndex]
        );
        const itemText = await items[itemIndex].getText();

        // send ENTER to the item
        await items[itemIndex].sendKeys(Key.ENTER);
        await waitForUrlChange(t);

        t.not(
          await t.context.session.getCurrentUrl(),
          t.context.url,
          'Sending key "ENTER" to menuitem "' +
            itemText +
            '" should navigate to a new webpage.'
        );
      }
    }

    // Test all the submenu menuitems

    for (let submenuLocation of ex.submenuLocations) {
      const [menuIndex, menuitemIndex] = submenuLocation;

      // Get the submenu associate with the menuitem we are testing
      const submenuMenuitemSelector = getSubmenuMenuitemSelector(
        menuIndex,
        menuitemIndex
      );
      const numItems = (
        await t.context.queryElements(t, submenuMenuitemSelector)
      ).length;

      // Test all the items in the submenu
      for (let itemIndex = 0; itemIndex < numItems; itemIndex++) {
        await openSubmenu(t, ...submenuLocation);

        // send ENTER to the item we are testing
        const items = await t.context.queryElements(t, submenuMenuitemSelector);
        const itemText = await items[itemIndex].getText();
        await items[itemIndex].sendKeys(Key.ENTER);
        await waitForUrlChange(t);

        t.not(
          await t.context.session.getCurrentUrl(),
          t.context.url,
          'Sending key "ENTER" to menuitem ' +
            itemText +
            '" should navigate to a new webpage.'
        );

        await t.context.session.get(t.context.url);
      }
    }
  }
);

// This test is failing due to a bug reported in issue: https://github.com/w3c/aria-practices/issues/907
ariaTest.failing(
  'SPACE in submenu selects item',
  exampleFile,
  'submenu-space-or-enter',
  async (t) => {
    // Test all the level one menuitems

    for (let menuIndex = 0; menuIndex < ex.numMenus; menuIndex++) {
      for (
        let itemIndex = 0;
        itemIndex < ex.numMenuMenuitems[menuIndex];
        itemIndex++
      ) {
        await t.context.session.get(t.context.url);

        const menubaritems = await t.context.queryElements(
          t,
          ex.menubarMenuitemSelector
        );

        // Open the submenu
        await menubaritems[menuIndex].sendKeys(Key.ENTER);
        const items = await t.context.queryElements(
          t,
          ex.menuMenuitemSelectors[menuIndex]
        );
        const itemText = await items[itemIndex].getText();

        // send SPACE to the item
        await items[itemIndex].sendKeys(' ');
        await waitForUrlChange(t);

        t.not(
          await t.context.session.getCurrentUrl(),
          t.context.url,
          'Sending key "SPACE" to menuitem "' +
            itemText +
            '" should navigate to a new webpage.'
        );
      }
    }

    // Test all the submenu menuitems

    for (let submenuLocation of ex.submenuLocations) {
      const [menuIndex, menuitemIndex] = submenuLocation;

      // Get the submenu associate with the menuitem we are testing
      const submenuMenuitemSelector = getSubmenuMenuitemSelector(
        menuIndex,
        menuitemIndex
      );
      const numItems = (
        await t.context.queryElements(t, submenuMenuitemSelector)
      ).length;

      // Test all the items in the submenu
      for (let itemIndex = 0; itemIndex < numItems; itemIndex++) {
        await openSubmenu(t, ...submenuLocation);

        // send SPACE to the item we are testing
        const items = await t.context.queryElements(t, submenuMenuitemSelector);
        const itemText = await items[itemIndex].getText();
        await items[itemIndex].sendKeys(' ');
        await waitForUrlChange(t);

        t.not(
          await t.context.session.getCurrentUrl(),
          t.context.url,
          'Sending key "SPACE" to menuitem ' +
            itemText +
            '" should navigate to a new webpage.'
        );

        await t.context.session.get(t.context.url);
      }
    }
  }
);

ariaTest.failing(
  'ESCAPE to submenu closes submenu',
  exampleFile,
  'submenu-escape',
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

        // send ARROW_RIGHT to the item
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
