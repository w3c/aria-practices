const { ariaTest } = require('..');
const { Key } = require('selenium-webdriver');
const assert = require('assert');
const assertAttributeValues = require('../util/assertAttributeValues');
const assertAriaLabelExists = require('../util/assertAriaLabelExists');
const assertAriaLabelledby = require('../util/assertAriaLabelledby');
const assertAriaRoles = require('../util/assertAriaRoles');
const assertRovingTabindex = require('../util/assertRovingTabindex');

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

  // Menubar menuitem selectors
  menubarMenuitemSelector: '#ex1 [role="menubar"]>li>[role="menuitem"]',
  menubarMenuitemWithPopupSelector: '#ex1 [role="menubar"]>li>[aria-haspopup]',

  // Menuitem selectors
  anyMenuitemSelector: '#ex1 [role="menubar"] [role="menuitem"]',
  anyExpandableMenuitemSelector:
    '#ex1 [role="menubar"] [role="menuitem"][aria-expanded]',

  // Menu menuitem selectors
  anyMenuMenuitemSelector: '#ex1 [role="menu"]>li>[role="menuitem"]',

  // Submenu item selectors
  submenuMenuitemsWithHasPopup:
    '#ex1 [role="menu"] [role="menuitem"][aria-haspopup]',
  submenuMenuitemsWithExpanded:
    '#ex1 [role="menu"] [role="menuitem"][aria-expanded]',

  // Selectors for testing expandable menus in submenus
  numTotalMenus: 6,
  menuLocations: [1, 2, 3],
  // Numbers are the index of the menuitems in the entire menubar
  // including submenus
  keyboardTestMenuitems: [
    [1, -1, [2, 3, 4, 8]],
    [1, 4, [5, 6, 7]],
    [1, 8, [9, 10, 11]],
    [12, -1, [13, 14, 18, 19, 20, 21]],
    [12, 14, [15, 16, 17]],
    [22, -1, [23, 24, 25, 26, 27, 28, 29, 30]],
  ],
};

// await new Promise(resolve => setTimeout(resolve, 3000));

const openMenus = async function (t, menuIndex, menuitemIndex) {
  // Send ENTER to open menu
  if (menuIndex >= 0) {
    if (await isExpandable(t, ex.anyMenuitemSelector, menuIndex)) {
      const menubarItems = await t.context.queryElements(
        t,
        ex.anyMenuitemSelector
      );
      await menubarItems[menuIndex].sendKeys(Key.ENTER);
    }
  }

  // Get the menuitems for that menu and send ENTER to open the submenu
  if (menuitemIndex >= 0) {
    if (await isExpandable(t, ex.anyMenuitemSelector, menuitemIndex)) {
      const menuitems = await t.context.queryElements(
        t,
        ex.anyMenuitemSelector
      );
      await menuitems[menuitemIndex].sendKeys(Key.ENTER);
    }
  }
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

const isExpandable = async function (t, selector, index) {
  return t.context.session.executeScript(
    function () {
      const [selector, index] = arguments;
      const items = document.querySelectorAll(selector);
      return items[index].hasAttribute('aria-expanded');
    },
    selector,
    index
  );
};

const checkOpen = async function (t, selector, index) {
  return t.context.session.executeScript(
    function () {
      const [selector, index] = arguments;
      const items = document.querySelectorAll(selector);
      const test1 = items[index].getAttribute('aria-expanded') === 'true';
      const menu = items[index].nextElementSibling;
      const test2 = menu.style.display != 'none';
      return test1 && test2;
    },
    selector,
    index
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
    const menubarItems = await t.context.queryElements(
      t,
      ex.menubarMenuitemWithPopupSelector
    );

    for (let i = 0; i < menubarItems.length; i++) {
      const menubarItem = menubarItems[i];
      await menubarItem.sendKeys(Key.ARROW_DOWN);

      assert.strictEqual(
        await menubarItem.getAttribute('aria-expanded'),
        'true',
        'aria-expanded should be "true" for "' + menubarItem.getText() + '"'
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

    for (let i = 0; i < submenus.length; i++) {
      t.false(
        await checkOpen(t, ex.submenuMenuitemsWithExpanded, i),
        'Submenu with index "' + i + ' should NOT be displayed on load'
      );
    }
  }
);

ariaTest(
  '"aria-expanded" attribute on sub-menu menuitem',
  exampleFile,
  'menu-menuitem-aria-expanded-true',
  async (t) => {
    const testMenuitems = [
      [1, 4],
      [1, 8],
      [12, 14],
    ];

    for (let i = 0; i < testMenuitems.length; i++) {
      const testMenuitem = testMenuitems[i];
      const indexMenubarOpen = testMenuitem[0];
      const indexSendArrowRight = testMenuitem[1];

      await openMenus(t, indexMenubarOpen, -1);

      let menuitems = await t.context.queryElements(t, ex.anyMenuitemSelector);
      await menuitems[indexSendArrowRight].sendKeys(Key.ARROW_RIGHT);

      t.true(
        await checkOpen(t, ex.anyMenuitemSelector, indexSendArrowRight),
        'Menuitem with index "' +
          indexSendArrowRight +
          '"" should be displayed on load'
      );
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
        const menubarItems = await t.context.queryElements(
          t,
          ex.menubarMenuitemSelector
        );

        const menubarIndex = menubarIndexes[i];
        await menubarItems[menubarIndex].sendKeys(keyCode);

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
    const menubarItems = await t.context.queryElements(
      t,
      ex.menubarMenuitemSelector
    );

    const numMenuitems = menubarItems.length;

    for (let menuIndex = 0; menuIndex < numMenuitems + 1; menuIndex++) {
      const currentIndex = menuIndex % numMenuitems;
      const nextIndex = (menuIndex + 1) % numMenuitems;

      // Send the ARROW_RIGHT key
      await menubarItems[currentIndex].sendKeys(Key.ARROW_RIGHT);

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
    const menubarItems = await t.context.queryElements(
      t,
      ex.menubarMenuitemSelector
    );

    const numMenuitems = menubarItems.length;

    // Send the ARROW_LEFT key to the first menuitem
    await menubarItems[0].sendKeys(Key.ARROW_LEFT);

    // Test the focus is on the last menu item
    t.true(
      await checkFocus(t, ex.menubarMenuitemSelector, numMenuitems - 1),
      'Sending key "ARROW_LEFT" to menuitem 0 will change focus to menu item 3'
    );

    for (let menuIndex = numMenuitems - 1; menuIndex > 0; menuIndex--) {
      // Send the ARROW_LEFT key
      await menubarItems[menuIndex].sendKeys(Key.ARROW_LEFT);

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
      const menubarItems = await t.context.queryElements(
        t,
        ex.menubarMenuitemSelector
      );

      const menubarIndex = menubarIndexes[i];
      await menubarItems[menubarIndex].sendKeys(Key.UP);

      const menus = await t.context.queryElements(t, ex.anyMenuSelector);

      const menuElement = menus[menuIndexes[i]];
      const menuId = await menuElement.getAttribute('id');

      // Test that the submenu is displayed
      t.true(
        await menuElement.isDisplayed(),
        'Sending key ARROW_UP to menuitem referencing menu with id="' +
          menuId +
          '" in menubar should display submenu.'
      );

      // Check that focus is on first menuitem
      t.true(
        await checkFocus(t, ex.anyMenuitemSelector, menuitemIndexes[i]),
        'Sending key ARROW_UP to menubar item index "' +
          menubarIndexes[i] +
          '" in menubar should send focus to menuitem index "' +
          menuitemIndexes[i] +
          '" the last element in the submenu.'
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
      const menubarItems = await t.context.queryElements(
        t,
        ex.menubarMenuitemSelector
      );

      const menubarIndex = menubarIndexes[i];
      await menubarItems[menubarIndex].sendKeys(Key.DOWN);

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
    const menubarItems = await t.context.queryElements(
      t,
      ex.menubarMenuitemSelector
    );

    const numMenubarItems = menubarItems.length;

    for (let menuIndex = 0; menuIndex < numMenubarItems; menuIndex++) {
      // Send the ARROW_RIGHT key to move the focus to later menu item for every test
      for (let i = 0; i < menuIndex; i++) {
        await menubarItems[i].sendKeys(Key.ARROW_RIGHT);
      }

      // Send the key HOME
      await menubarItems[menuIndex].sendKeys(Key.HOME);

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
    const menubarItems = await t.context.queryElements(
      t,
      ex.menubarMenuitemSelector
    );

    const numMenubarItems = menubarItems.length;

    for (let menuIndex = 0; menuIndex < numMenubarItems; menuIndex++) {
      // Send the ARROW_RIGHT key to move the focus to later menu item for every test
      for (let i = 0; i < menuIndex; i++) {
        await menubarItems[i].sendKeys(Key.ARROW_RIGHT);
      }

      // Send the key END
      await menubarItems[menuIndex].sendKeys(Key.END);

      // Test that the focus is on the last item in the list
      t.true(
        await checkFocus(t, ex.menubarMenuitemSelector, numMenubarItems - 1),
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

    const menubarItems = await t.context.queryElements(
      t,
      ex.menubarMenuitemSelector
    );
    for (let test of charIndexTest) {
      // Send character to menuitem
      await menubarItems[test.sendIndex].sendKeys(test.sendChar);

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

        await openMenus(t, indexMenubarOpen, indexSubmenuOpen);

        let menuitems = await t.context.queryElements(
          t,
          ex.anyMenuitemSelector
        );

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

ariaTest(
  'ESCAPE to submenu closes submenu',
  exampleFile,
  'submenu-escape',
  async (t) => {
    const testMenuitems = [
      [1, -1, 2],
      [1, -1, 3],
      [1, -1, 4],
      [1, -1, 8],
      [1, 4, 5],
      [1, 4, 6],
      [1, 4, 7],
      [1, 8, 9],
      [1, 8, 10],
      [1, 8, 11],
      [12, -1, 13],
      [12, -1, 14],
      [12, -1, 18],
      [12, -1, 19],
      [12, -1, 20],
      [12, -1, 21],
      [12, 14, 15],
      [12, 14, 16],
      [12, 14, 17],
      [22, -1, 23],
      [22, -1, 24],
      [22, -1, 25],
      [22, -1, 26],
      [22, -1, 27],
      [22, -1, 28],
      [22, -1, 29],
      [22, -1, 30],
    ];

    for (let i = 0; i < testMenuitems.length; i++) {
      const testMenuitem = testMenuitems[i];
      const indexMenubarOpen = testMenuitem[0];
      const indexSubmenuOpen = testMenuitem[1];
      const menuitemSendEscape = testMenuitem[2];

      let indexMenuitem = indexMenubarOpen;
      if (indexSubmenuOpen >= 0) {
        indexMenuitem = indexSubmenuOpen;
      }

      await openMenus(t, indexMenubarOpen, indexSubmenuOpen);

      let menuitems = await t.context.queryElements(t, ex.anyMenuitemSelector);
      await menuitems[menuitemSendEscape].sendKeys(Key.ESCAPE);

      t.true(
        await checkFocus(t, ex.anyMenuitemSelector, indexMenuitem),
        'Sending key ESCAPE to menuitem "' +
          menuitemSendEscape +
          '" the focus should be on menuitem "' +
          indexMenuitem +
          '".'
      );
    }
  }
);

ariaTest(
  'ARROW_RIGHT to submenu closes submenu and opens next',
  exampleFile,
  'submenu-right-arrow',
  async (t) => {
    const testMenuitems = [
      [1, -1, 2, 12],
      [1, -1, 3, 12],
      [1, 4, 5, 12],
      [1, 4, 6, 12],
      [1, 4, 7, 12],
      [1, 8, 9, 12],
      [1, 8, 10, 12],
      [1, 8, 11, 12],
      [12, -1, 13, 22],
      [12, -1, 18, 22],
      [12, -1, 19, 22],
      [12, -1, 20, 22],
      [12, -1, 21, 22],
      [12, 14, 15, 22],
      [12, 14, 16, 22],
      [12, 14, 17, 22],
      [22, -1, 23, 0],
      [22, -1, 24, 0],
      [22, -1, 25, 0],
      [22, -1, 26, 0],
      [22, -1, 27, 0],
      [22, -1, 28, 0],
      [22, -1, 29, 0],
      [22, -1, 30, 0],
      [0, -1, 0, 1],
    ];

    for (let i = 0; i < testMenuitems.length; i++) {
      const testMenuitem = testMenuitems[i];
      const indexMenubarOpen = testMenuitem[0];
      const indexSubmenuOpen = testMenuitem[1];
      const indexSendArrowRight = testMenuitem[2];
      const indexIsOpen = testMenuitem[3];

      await openMenus(t, indexMenubarOpen, indexSubmenuOpen);

      let menuitems = await t.context.queryElements(t, ex.anyMenuitemSelector);
      await menuitems[indexSendArrowRight].sendKeys(Key.ARROW_RIGHT);

      t.true(
        await checkFocus(t, ex.anyMenuitemSelector, indexIsOpen),
        'Sending key ARROW_RIGHT to menuitem "' +
          indexSendArrowRight +
          '" the focus should be on menuitem "' +
          indexIsOpen +
          '".'
      );

      if (await isExpandable(t, ex.anyMenuitemSelector, indexMenubarOpen)) {
        t.false(
          await checkOpen(t, ex.anyMenuitemSelector, indexMenubarOpen),
          'Sending key ARROW_RIGHT to menuitem "' +
            indexSendArrowRight +
            '" the menubar menuitem "' +
            indexMenubarOpen +
            '" should be closed.'
        );
      }

      if (await isExpandable(t, ex.anyMenuitemSelector, indexIsOpen)) {
        t.true(
          await checkOpen(t, ex.anyMenuitemSelector, indexIsOpen),
          'Sending key ARROW_RIGHT to menuitem "' +
            indexSendArrowRight +
            '" the menubar menuitem "' +
            indexIsOpen +
            '" should be open.'
        );
      }
    }
  }
);

ariaTest(
  'ARROW_RIGHT to expandable submenu opens popout menu',
  exampleFile,
  'submenu-right-arrow',
  async (t) => {
    const testMenuitems = [
      [1, 4, 5],
      [1, 8, 9],
      [12, 14, 15],
    ];

    for (let i = 0; i < testMenuitems.length; i++) {
      const testMenuitem = testMenuitems[i];
      const indexMenubarOpen = testMenuitem[0];
      const indexSendArrowRight = testMenuitem[1];
      const indexHasFocus = testMenuitem[2];

      await openMenus(t, indexMenubarOpen, -1);

      let menuitems = await t.context.queryElements(t, ex.anyMenuitemSelector);
      await menuitems[indexSendArrowRight].sendKeys(Key.ARROW_RIGHT);

      t.true(
        await checkFocus(t, ex.anyMenuitemSelector, indexHasFocus),
        'Sending key ARROW_RIGHT to menuitem "' +
          indexSendArrowRight +
          '" the focus should be on menuitem "' +
          indexHasFocus +
          '".'
      );

      t.true(
        await checkOpen(t, ex.anyMenuitemSelector, indexSendArrowRight),
        'Sending key ARROW_RIGHT to menuitem "' +
          indexSendArrowRight +
          '" should open the popout menu.'
      );
    }
  }
);

ariaTest(
  'ARROW_LEFT to submenu closes submenu and opens next',
  exampleFile,
  'submenu-left-arrow',
  async (t) => {
    const testMenuitems = [
      [22, -1, 23, 12],
      [22, -1, 24, 12],
      [22, -1, 25, 12],
      [22, -1, 26, 12],
      [22, -1, 27, 12],
      [22, -1, 28, 12],
      [22, -1, 29, 12],
      [22, -1, 30, 12],
      [12, -1, 13, 1],
      [12, -1, 14, 1],
      [12, -1, 18, 1],
      [12, -1, 19, 1],
      [12, -1, 20, 1],
      [12, -1, 21, 1],
      [1, -1, 2, 0],
      [1, -1, 3, 0],
      [1, -1, 4, 0],
      [1, -1, 8, 0],
      [0, -1, 0, 22],
    ];

    for (let i = 0; i < testMenuitems.length; i++) {
      const testMenuitem = testMenuitems[i];
      const indexMenubarOpen = testMenuitem[0];
      const indexSubmenuOpen = testMenuitem[1];
      const indexSendArrowLeft = testMenuitem[2];
      const indexIsOpen = testMenuitem[3];

      await openMenus(t, indexMenubarOpen, indexSubmenuOpen);

      let menuitems = await t.context.queryElements(t, ex.anyMenuitemSelector);
      await menuitems[indexSendArrowLeft].sendKeys(Key.ARROW_LEFT);

      t.true(
        await checkFocus(t, ex.anyMenuitemSelector, indexIsOpen),
        'Sending key ARROW_LEFT to menuitem "' +
          indexSendArrowLeft +
          '" the focus should be on menuitem "' +
          indexIsOpen +
          '".'
      );

      if (await isExpandable(t, ex.anyMenuitemSelector, indexMenubarOpen)) {
        t.false(
          await checkOpen(t, ex.anyMenuitemSelector, indexMenubarOpen),
          'Sending key ARROW_LEFT to menuitem "' +
            indexSendArrowLeft +
            '" the menubar menuitem "' +
            indexMenubarOpen +
            '" should be closed.'
        );
      }

      if (await isExpandable(t, ex.anyMenuitemSelector, indexIsOpen)) {
        t.true(
          await checkOpen(t, ex.anyMenuitemSelector, indexIsOpen),
          'Sending key ARROW_LEFT to menuitem "' +
            indexSendArrowLeft +
            '" the menubar menuitem "' +
            indexIsOpen +
            '" should be open.'
        );
      }
    }
  }
);

ariaTest(
  'ARROW_LEFT to popout menu closes popout and moves focus to submenu',
  exampleFile,
  'submenu-left-arrow',
  async (t) => {
    const testMenuitems = [
      [12, 14, 15],
      [12, 14, 16],
      [12, 14, 17],
    ];

    for (let i = 0; i < testMenuitems.length; i++) {
      const testMenuitem = testMenuitems[i];
      const indexMenubarOpen = testMenuitem[0];
      const indexSubmenuOpen = testMenuitem[1];
      const indexSendArrowLeft = testMenuitem[2];

      await openMenus(t, indexMenubarOpen, indexSubmenuOpen);

      let menuitems = await t.context.queryElements(t, ex.anyMenuitemSelector);
      await menuitems[indexSendArrowLeft].sendKeys(Key.ARROW_LEFT);

      t.true(
        await checkFocus(t, ex.anyMenuitemSelector, indexSubmenuOpen),
        'Sending key ARROW_LEFT to menuitem "' +
          indexSendArrowLeft +
          '" the focus should be on menuitem "' +
          indexSubmenuOpen +
          '".'
      );

      t.false(
        await checkOpen(t, ex.anyMenuitemSelector, indexSubmenuOpen),
        'Sending key ARROW_LEFT to menuitem "' +
          indexSendArrowLeft +
          '" the menubar menuitem "' +
          indexSubmenuOpen +
          '" should be closed.'
      );
    }
  }
);

ariaTest(
  'ARROW_DOWN moves focus in menu',
  exampleFile,
  'submenu-down-arrow',
  async (t) => {
    for (let i = 0; i < ex.keyboardTestMenuitems.length; i++) {
      const testMenuitem = ex.keyboardTestMenuitems[i];
      const indexMenubarOpen = testMenuitem[0];
      const indexSubmenuOpen = testMenuitem[1];
      const menuitemIndexes = testMenuitem[2];

      await openMenus(t, indexMenubarOpen, indexSubmenuOpen);

      const len = menuitemIndexes.length;

      for (let i = 0; i < len; i++) {
        const indexSendArrowDown = menuitemIndexes[i];
        const indexHasFocus = menuitemIndexes[(i + 1) % len];

        let menuitems = await t.context.queryElements(
          t,
          ex.anyMenuitemSelector
        );
        await menuitems[indexSendArrowDown].sendKeys(Key.ARROW_DOWN);

        t.true(
          await checkFocus(t, ex.anyMenuitemSelector, indexHasFocus),
          'Sending key ARROW_DOWN to menuitem "' +
            indexSendArrowDown +
            '" the focus should be on menuitem "' +
            indexHasFocus +
            '".'
        );
      }
    }
  }
);

ariaTest(
  'ARROW_UP moves focus in menu',
  exampleFile,
  'submenu-up-arrow',
  async (t) => {
    for (let i = 0; i < ex.keyboardTestMenuitems.length; i++) {
      const testMenuitem = ex.keyboardTestMenuitems[i];
      const indexMenubarOpen = testMenuitem[0];
      const indexSubmenuOpen = testMenuitem[1];
      const menuitemIndexes = testMenuitem[2];

      await openMenus(t, indexMenubarOpen, indexSubmenuOpen);

      const len = menuitemIndexes.length;

      for (let i = 1; i <= len; i++) {
        const indexSendArrowUp = menuitemIndexes[i % len];
        const indexHasFocus = menuitemIndexes[i - 1];

        let menuitems = await t.context.queryElements(
          t,
          ex.anyMenuitemSelector
        );
        await menuitems[indexSendArrowUp].sendKeys(Key.ARROW_UP);

        t.true(
          await checkFocus(t, ex.anyMenuitemSelector, indexHasFocus),
          'Sending key ARROW_UP to menuitem "' +
            indexSendArrowUp +
            '" the focus should be on menuitem "' +
            indexHasFocus +
            '".'
        );
      }
    }
  }
);

ariaTest(
  'HOME moves focus to first item in menu',
  exampleFile,
  'submenu-home',
  async (t) => {
    for (let i = 0; i < ex.keyboardTestMenuitems.length; i++) {
      const testMenuitem = ex.keyboardTestMenuitems[i];
      const indexMenubarOpen = testMenuitem[0];
      const indexSubmenuOpen = testMenuitem[1];
      const menuitemIndexes = testMenuitem[2];

      await openMenus(t, indexMenubarOpen, indexSubmenuOpen);

      const len = menuitemIndexes.length;

      for (let i = 0; i < len; i++) {
        const indexSendHome = menuitemIndexes[i];
        const indexHasFocus = menuitemIndexes[0];

        let menuitems = await t.context.queryElements(
          t,
          ex.anyMenuitemSelector
        );
        await menuitems[indexSendHome].sendKeys(Key.HOME);

        t.true(
          await checkFocus(t, ex.anyMenuitemSelector, indexHasFocus),
          'Sending key HOME to menuitem "' +
            indexSendHome +
            '" the focus should be on menuitem "' +
            indexHasFocus +
            '".'
        );
      }
    }
  }
);

ariaTest(
  'END moves focus to lest menuitem in the menu',
  exampleFile,
  'submenu-end',
  async (t) => {
    for (let i = 0; i < ex.keyboardTestMenuitems.length; i++) {
      const testMenuitem = ex.keyboardTestMenuitems[i];
      const indexMenubarOpen = testMenuitem[0];
      const indexSubmenuOpen = testMenuitem[1];
      const menuitemIndexes = testMenuitem[2];

      await openMenus(t, indexMenubarOpen, indexSubmenuOpen);

      const len = menuitemIndexes.length;

      for (let i = 0; i < len; i++) {
        const indexSendEnd = menuitemIndexes[i];
        const indexHasFocus = menuitemIndexes[len - 1];

        let menuitems = await t.context.queryElements(
          t,
          ex.anyMenuitemSelector
        );
        await menuitems[indexSendEnd].sendKeys(Key.END);

        t.true(
          await checkFocus(t, ex.anyMenuitemSelector, indexHasFocus),
          'Sending key END to menuitem "' +
            indexSendEnd +
            '" the focus should be on menuitem "' +
            indexHasFocus +
            '".'
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
    const testMenuitems = [
      [2, 1, -1, 'z', 2],
      [2, 1, -1, 'a', 3],
      [3, 1, -1, 'c', 8],
      [4, 1, -1, 'o', 2],
      [5, 1, 4, 'a', 7],
      [6, 1, 4, 'h', 5],
      [7, 1, 4, 'z', 7],
      [8, 1, -1, 'z', 8],
      [9, 1, 8, 'f', 10],
      [10, 1, 8, 'f', 11],
      [11, 1, 8, 'f', 9],
      [13, 12, -1, 'a', 13],
      [13, 12, -1, 'v', 19],
      [14, 12, -1, 'a', 13],
      [15, 12, 14, 'p', 17],
      [16, 12, 14, 'u', 15],
      [17, 12, 14, 'g', 16],
      [18, 12, -1, 't', 14],
      [19, 12, -1, 'v', 19],
      [20, 12, -1, 'v', 19],
      [21, 12, -1, 'p', 20],
      [23, 22, -1, 'h', 25],
      [24, 22, -1, 'r', 28],
      [25, 22, -1, '1', 25],
      [26, 22, -1, 'c', 27],
      [27, 22, -1, 'c', 23],
      [28, 22, -1, 'p', 24],
      [29, 22, -1, 'o', 26],
      [30, 22, -1, 't', 30],
    ];

    for (let i = 0; i < testMenuitems.length; i++) {
      const testMenuitem = testMenuitems[i];

      const indexMenuitem = testMenuitem[0];
      const indexMenubarOpen = testMenuitem[1];
      const indexSubmenuOpen = testMenuitem[2];
      const testChar = testMenuitem[3];
      const indexHasFocus = testMenuitem[4];

      await openMenus(t, indexMenubarOpen, indexSubmenuOpen);

      let menuitems = await t.context.queryElements(t, ex.anyMenuitemSelector);

      await menuitems[indexMenuitem].sendKeys(testChar);

      t.true(
        await checkFocus(t, ex.anyMenuitemSelector, indexHasFocus),
        'Sending "' +
          testChar +
          '" to menuitem "' +
          indexMenuitem +
          '" the focus should be on menuitem "' +
          indexHasFocus +
          '".'
      );
    }
  }
);
