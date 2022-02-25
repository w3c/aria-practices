const { ariaTest } = require('..');
const { Key } = require('selenium-webdriver');
const assertAttributeValues = require('../util/assertAttributeValues');
const assertAriaLabelExists = require('../util/assertAriaLabelExists');
const assertAriaLabelledby = require('../util/assertAriaLabelledby');
const assertRovingTabindex = require('../util/assertRovingTabindex');
const assertAriaOwns = require('../util/assertAriaOwns');

const exampleFile = 'treeview/treeview-navigation.html';

const ex = {
  bannerSelector: '#ex1 header',
  navigationSelector: '#ex1 nav',
  regionSelector: '#ex1 section',
  contentinfoSelector: '#ex1 footer',
  treeSelector: '#ex1 [role="tree"]',
  treeitemSelector: '#ex1 [role="treeitem"]',
  tabIndexZeroSelector: '#ex1 [tabindex="0"]',
  groupSelector: '#ex1 [role="group"]',
  expandableSelector: '#ex1 [role="treeitem"][aria-expanded]',
  topLevelTreeitemsSelector: '#ex1 [role="tree"] > li > [role="treeitem"]',
  nextLevelTreeitemsSelector:
    '#ex1 [role="tree"] > li > [role="group"] > li > [role="treeitem"]',
  topLevelExpandableTreeitemsSelector:
    '#ex1 [role="tree"] > li > [role="treeitem"][aria-expanded]',
  nextLevelExpandableTreeitemsSelector:
    '#ex1 [role="tree"] > li > [role="group"] > li > [role="treeitem"][aria-expanded]',
  aboutChildTreeitemsSelector: '#id-about-subtree > li > [role="treeitem"]',
  aboutChildExpandableTreeitemsSelector:
    '#id-about-subtree > li > [role="treeitem"][aria-expanded]',
  admissionsChildTreeitemsSelector:
    '#id-admissions-subtree > li > [role="treeitem"]',
  admissionsChildExpandableTreeitemsSelector:
    '#id-admissions-subtree > li > [role="treeitem"][aria-expanded]',
  linkSelector: '#ex1 a[role="treeitem"]',
  h1Selector: '#ex1 .page h1',
};

const openAllExpandableTreeitems = async function (t) {
  const closedExpandableTreeitemsSelector =
    ex.treeitemSelector + '[aria-expanded="false"] span.icon';
  let closedTreeitems = await t.context.queryElements(
    t,
    closedExpandableTreeitemsSelector
  );

  // Going through all closed expandable tree elements in dom order will open parent
  // treeitems first, therefore all child treeitems will be visible before clicked
  for (let treeitem of closedTreeitems) {
    await treeitem.click();
  }
};

const closeAllTopLevelExpandableTreeitems = async function (t) {
  const openExpandableTreeitemsSelector =
    ex.topLevelExpandableTreeitemsSelector + '[aria-expanded="true"] span.icon';

  let openTreeitems = await t.context.queryElements(
    t,
    openExpandableTreeitemsSelector
  );

  // Going through all open expandable tree elements in dom order will close parent
  // treeitems first, therefore all child treeitems will be invisible
  for (let treeitem of openTreeitems) {
    await treeitem.click();
  }
};

const checkFocus = async function (t, selector, index) {
  return t.context.session.executeScript(
    function (/* selector, index*/) {
      const [selector, index] = arguments;
      const items = document.querySelectorAll(selector);
      return items[index] === document.activeElement;
    },
    selector,
    index
  );
};

const checkFocusOnParentTreeitem = async function (t, el) {
  return t.context.session.executeScript(function () {
    const el = arguments[0];
    return (
      document.activeElement ===
      el.parentElement.parentElement.previousElementSibling
    );
  }, el);
};

const isTopLevelTreeitem = async function (t, el) {
  return t.context.session.executeScript(function () {
    const el = arguments[0];
    return el.parentElement.parentElement.getAttribute('role') === 'tree';
  }, el);
};

const getOwnedElement = async function (t, el) {
  return t.context.session.executeScript(function () {
    const el = arguments[0];
    return document.getElementById(el.getAttribute('aria-owns'));
  }, el);
};

const isExpandableTreeitem = async function (el) {
  return typeof (await el.getAttribute('aria-owns')) === 'string';
};

const isOpenedExpandableTreeitem = async function (el) {
  return (await el.getAttribute('aria-expanded')) === 'true';
};

const isClosedExpandableTreeitem = async function (el) {
  return (await el.getAttribute('aria-expanded')) === 'false';
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

// Tests for treeview widget roles, properties and states

ariaTest('role="tree" on ul element', exampleFile, 'tree-role', async (t) => {
  const trees = await t.context.queryElements(t, ex.treeSelector);

  t.is(
    trees.length,
    1,
    'One "role=tree" element should be found by selector: ' + ex.treeSelector
  );

  t.is(
    await trees[0].getTagName(),
    'ul',
    'role="tree" should be found on a "ul"'
  );
});

ariaTest(
  'aria-label on role="tree" element',
  exampleFile,
  'tree-aria-label',
  async (t) => {
    await assertAriaLabelExists(t, ex.treeSelector);
  }
);

ariaTest(
  'role="treeitem" on "a" element',
  exampleFile,
  'treeitem-role',
  async (t) => {
    // Get all the list items in the tree structure
    const listitems = await t.context.queryElements(t, '#ex1 [role="tree"] a');

    // Check the role "treeitem" is on each a element
    for (let item of listitems) {
      t.is(
        await item.getAttribute('role'),
        'treeitem',
        'role="treeitem" should be found on a "a" items that have attribute "aria-expanded"'
      );
    }
  }
);

// We do not want roving tabindex anymore
ariaTest.failing(
  'treeitem tabindex set by roving tabindex',
  exampleFile,
  'treeitem-tabindex',
  async (t) => {
    await openAllExpandableTreeitems(t);
    await assertRovingTabindex(t, ex.treeitemSelector, Key.ARROW_DOWN);
  }
);

ariaTest(
  'treeitem aria-current="page" on item with tabindex="0"',
  exampleFile,
  'treeitem-aria-current',
  async (t) => {
    await assertAttributeValues(
      t,
      ex.tabIndexZeroSelector,
      'aria-current',
      'page'
    );
  }
);

ariaTest(
  'treeitem aria-current="page" is visible after focus leaves treeview widget',
  exampleFile,
  'treeitem-aria-current',
  async (t) => {
    const nextLevelExpandableTreeitems = await t.context.queryElements(
      t,
      ex.nextLevelExpandableTreeitemsSelector
    );

    const h1Element = await t.context.queryElement(t, ex.h1Selector);

    for (let i = 0; i < nextLevelExpandableTreeitems.length; i++) {
      // select activate link to move aria-current to a lower level page
      await openAllExpandableTreeitems(t);
      await nextLevelExpandableTreeitems[i].sendKeys(Key.ENTER);

      // Close parent treeview items so link with aria-current is not visible
      await closeAllTopLevelExpandableTreeitems(t);

      // Move focus to the main content area
      await h1Element.click();

      // Check is menuitem with aria-current is visible

      t.true(
        await nextLevelExpandableTreeitems[i].isDisplayed(),
        'After moving focus the link index ' +
          i +
          ' with aria-current should be visible.'
      );
    }
  }
);

ariaTest(
  'aria-expanded attribute on treeitem matches dom',
  exampleFile,
  'treeitem-aria-expanded',
  async (t) => {
    const expandableTreeitems = await t.context.queryElements(
      t,
      ex.expandableSelector
    );

    for (let treeitem of expandableTreeitems) {
      // If the treeitem is displayed
      if (await treeitem.isDisplayed()) {
        // By default, all expandable treeitems  will be closed
        t.is(await treeitem.getAttribute('aria-expanded'), 'false');
        t.is(await (await getOwnedElement(t, treeitem)).isDisplayed(), false);

        // Send enter to the treeitem
        await treeitem.sendKeys(Key.ARROW_RIGHT);

        // After keypress, it should be open
        t.is(await treeitem.getAttribute('aria-expanded'), 'true');
        t.is(await (await getOwnedElement(t, treeitem)).isDisplayed(), true);
      }
    }

    for (let i = expandableTreeitems.length - 1; i >= 0; i--) {
      // If the treeitem is displayed
      if (await expandableTreeitems[i].isDisplayed()) {
        const treeitemText = await expandableTreeitems[i].getText();

        // Send enter to the expandable treeitem
        await expandableTreeitems[i].sendKeys(Key.ARROW_LEFT);

        // After sending enter, it should be closed
        t.is(
          await expandableTreeitems[i].getAttribute('aria-expanded'),
          'false',
          treeitemText
        );
        t.is(
          await (
            await getOwnedElement(t, expandableTreeitems[i])
          ).isDisplayed(),
          false,
          treeitemText
        );
      }
    }
  }
);

ariaTest(
  'aria-owns on expandable treeitems',
  exampleFile,
  'treeitem-aria-owns',
  async (t) => {
    await assertAriaOwns(t, ex.expandableSelector);
  }
);

ariaTest(
  'role="group" on "ul" elements',
  exampleFile,
  'group-role',
  async (t) => {
    const groups = await t.context.queryElements(t, ex.groupSelector);

    t.truthy(
      groups.length,
      'role="group" elements should be found by selector: ' + ex.groupSelector
    );

    for (let group of groups) {
      t.is(
        await group.getTagName(),
        'ul',
        'role="group" should be found on a "ul"'
      );
    }
  }
);

ariaTest('role="none" on "li" element', exampleFile, 'none-role', async (t) => {
  // Get all the list items in the tree structure
  const listitems = await t.context.queryElements(t, '#ex1 [role="tree"] li');

  for (let item of listitems) {
    t.is(
      await item.getAttribute('role'),
      'none',
      'role="none" should be found on a "li" items'
    );
  }
});

// Keys

ariaTest(
  'Key enter changes title',
  exampleFile,
  'key-enter-or-space',
  async (t) => {
    await openAllExpandableTreeitems(t);

    const items = await t.context.queryElements(t, ex.treeitemSelector);

    for (let item of items) {
      const itemText = await item.getText();

      // Send enter to the treeitem
      await item.sendKeys(Key.ENTER);

      const h1Element = await t.context.queryElement(t, ex.h1Selector);
      const h1Text = await h1Element.getText();

      t.is(
        h1Text,
        itemText,
        'Sending ENTER key to link "' +
          itemText +
          '" should be the h1 element content'
      );
    }
  }
);

ariaTest(
  'Key space opens treeitem',
  exampleFile,
  'key-enter-or-space',
  async (t) => {
    await openAllExpandableTreeitems(t);

    const items = await t.context.queryElements(t, ex.treeitemSelector);

    for (let item of items) {
      const itemText = await item.getText();

      // Send enter to the treeitem
      await item.sendKeys(Key.ENTER);

      const h1Element = await t.context.queryElement(t, ex.h1Selector);
      const h1Text = await h1Element.getText();

      t.is(
        h1Text,
        itemText,
        'Sending SPACE key to link "' +
          itemText +
          '" should be the h1 element content'
      );
    }
  }
);

ariaTest(
  'key down arrow moves focus',
  exampleFile,
  'key-down-arrow',
  async (t) => {
    // Check that the down arrow does not open treeitems
    const topLevelTreeitems = await t.context.queryElements(
      t,
      ex.topLevelTreeitemsSelector
    );

    for (let i = 0; i < topLevelTreeitems.length; i++) {
      await topLevelTreeitems[i].sendKeys(Key.ARROW_DOWN);

      // If we are on the last top level treeitem, the focus will not move
      const nextIndex = i === topLevelTreeitems.length - 1 ? i : i + 1;

      t.true(
        await checkFocus(t, ex.topLevelTreeitemsSelector, nextIndex),
        'Sending key ARROW_DOWN to top level treeitem at index ' +
          i +
          ' will move focus to ' +
          nextIndex
      );

      const isExpandable = await topLevelTreeitems[i].getAttribute('aria-owns');

      if (isExpandable) {
        const expandedState = await topLevelTreeitems[i].getAttribute(
          'aria-expanded'
        );

        t.is(
          expandedState,
          'false',
          'Sending key ARROW_DOWN to top level treeitem at index ' +
            i +
            ' should not expand the treeitem'
        );
      }
    }

    // Reload page
    await t.context.session.get(t.context.url);

    // Open all treeitems
    await openAllExpandableTreeitems(t);

    const items = await t.context.queryElements(t, ex.treeitemSelector);

    for (let i = 0; i < items.length; i++) {
      await items[i].sendKeys(Key.ARROW_DOWN);

      // If we are on the last item, the focus will not move
      const nextIndex = i === items.length - 1 ? i : i + 1;

      t.true(
        await checkFocus(t, ex.treeitemSelector, nextIndex),
        'Sending key ARROW_DOWN to treeitem at index ' +
          i +
          ' will move focus to ' +
          nextIndex
      );
    }
  }
);

ariaTest('key up arrow moves focus', exampleFile, 'key-up-arrow', async (t) => {
  // Check that the up arrow does not open treeitems
  const topLevelTreeitems = await t.context.queryElements(
    t,
    ex.topLevelTreeitemsSelector
  );

  for (let i = topLevelTreeitems.length - 1; i >= 0; i--) {
    await topLevelTreeitems[i].sendKeys(Key.ARROW_UP);

    // If we are on the last top level treeitem, the focus will not move
    const nextIndex = i === 0 ? i : i - 1;

    t.true(
      await checkFocus(t, ex.topLevelTreeitemsSelector, nextIndex),
      'Sending key ARROW_UP to top level treeitem at index ' +
        i +
        ' will move focus to ' +
        nextIndex
    );

    const isExpandable = await topLevelTreeitems[i].getAttribute('aria-owns');

    if (isExpandable) {
      t.is(
        await topLevelTreeitems[i].getAttribute('aria-expanded'),
        'false',
        'Sending key ARROW_UP to top level expandable treeitem at index ' +
          i +
          ' should not expand the treeitem'
      );
    }
  }

  // Reload page
  await t.context.session.get(t.context.url);

  // Open all treeitems
  await openAllExpandableTreeitems(t);

  const items = await t.context.queryElements(t, ex.treeitemSelector);

  for (let i = items.length - 1; i >= 0; i--) {
    await items[i].sendKeys(Key.ARROW_UP);

    // If we are on the last item, the focus will not move
    const nextIndex = i === 0 ? i : i - 1;

    t.true(
      await checkFocus(t, ex.treeitemSelector, nextIndex),
      'Sending key ARROW_UP to item at index ' +
        i +
        ' will move focus to ' +
        nextIndex
    );
  }
});

ariaTest(
  'key right arrow opens treeitems and moves focus',
  exampleFile,
  'key-right-arrow',
  async (t) => {
    const items = await t.context.queryElements(t, ex.treeitemSelector);

    let i = 0;
    while (i < items.length) {
      const isExpandable = await isExpandableTreeitem(items[i]);
      const isClosed = await isClosedExpandableTreeitem(items[i]);

      await items[i].sendKeys(Key.ARROW_RIGHT);

      // If the item is a treeitem and it was originally closed
      if (isExpandable && isClosed) {
        t.is(
          await items[i].getAttribute('aria-expanded'),
          'true',
          'Sending key ARROW_RIGHT to treeitem at treeitem index ' +
            i +
            ' when the treeitem is closed should open the treeitem'
        );

        t.true(
          await checkFocus(t, ex.treeitemSelector, i),
          'Sending key ARROW_RIGHT to treeitem at treeitem index ' +
            i +
            ' when the treeitem was closed should not move the focus'
        );
        continue;
      }

      // If the treeitem is an open treeitem, the focus will move
      else if (isExpandable) {
        t.true(
          await checkFocus(t, ex.treeitemSelector, i + 1),
          'Sending key ARROW_RIGHT to open treeitem at treeitem index ' +
            i +
            ' should move focus to item ' +
            (i + 1)
        );
      }

      // If we are a document, the focus will not move
      else {
        t.true(
          await checkFocus(t, ex.treeitemSelector, i),
          'Sending key ARROW_RIGHT to document item at treeitem index ' +
            i +
            ' should not move focus'
        );
      }
      i++;
    }
  }
);

ariaTest(
  'key left arrow closes treeitems and moves focus',
  exampleFile,
  'key-left-arrow',
  async (t) => {
    // Open all treeitems
    await openAllExpandableTreeitems(t);

    const items = await t.context.queryElements(t, ex.treeitemSelector);

    let i = items.length - 1;
    while (i > 0) {
      const isExpandable = await isExpandableTreeitem(items[i]);
      const isOpened = await isOpenedExpandableTreeitem(items[i]);
      const isTopLevel = isExpandableTreeitem
        ? await isTopLevelTreeitem(t, items[i])
        : false;

      await items[i].sendKeys(Key.ARROW_LEFT);

      // If the item is a treeitem and the treeitem was opened, arrow will close treeitem
      if (isExpandable && isOpened) {
        t.is(
          await items[i].getAttribute('aria-expanded'),
          'false',
          'Sending key ARROW_LEFT to expandable treeitem at index ' +
            i +
            ' when the expandable treeitem is opened should close the treeitem'
        );

        t.true(
          await checkFocus(t, ex.treeitemSelector, i),
          'Sending key ARROW_LEFT to expandable treeitem index ' +
            i +
            ' when the expandable treeitem is opened should not move the focus'
        );
        // Send one more arrow key to the treeitem that is now closed
        continue;
      }

      // If the item is a top level treeitem and closed, arrow will do nothing
      else if (isTopLevel) {
        t.true(
          await checkFocus(t, ex.treeitemSelector, i),
          'Sending key ARROW_LEFT to document in top level treeitem at treeitem index ' +
            i +
            ' should not move focus'
        );
      }

      // If the item is treeitem, or a closed treeitem, arrow will move up a treeitem
      else {
        t.true(
          await checkFocusOnParentTreeitem(t, items[i]),
          'Sending key ARROW_LEFT to document in treeitem at treeitem index ' +
            i +
            ' should move focus to parent treeitem'
        );

        t.is(
          await items[i].isDisplayed(),
          true,
          'Sending key ARROW_LEFT to document in expandable treeitem at index ' +
            i +
            ' should not close the treeitem it is in'
        );
      }

      i--;
    }
  }
);

ariaTest('key home moves focus', exampleFile, 'key-home', async (t) => {
  // Test that key "home" works when no treeitem is open
  const topLevelTreeitems = await t.context.queryElements(
    t,
    ex.topLevelTreeitemsSelector
  );

  for (let i = topLevelTreeitems.length - 1; i >= 0; i--) {
    await topLevelTreeitems[i].sendKeys(Key.HOME);

    t.true(
      await checkFocus(t, ex.topLevelTreeitemsSelector, 0),
      'Sending key HOME to top level treeitem at index ' +
        i +
        ' should move focus to first top level treeitem'
    );

    if (await isExpandableTreeitem(topLevelTreeitems[i])) {
      t.is(
        await topLevelTreeitems[i].getAttribute('aria-expanded'),
        'false',
        'Sending key HOME to top level treeitem at index ' +
          i +
          ' should not expand the treeitem'
      );
    }
  }

  // Reload page
  await t.context.session.get(t.context.url);

  // Open all treeitems
  await openAllExpandableTreeitems(t);

  const items = await t.context.queryElements(t, ex.treeitemSelector);

  for (let i = items.length - 1; i >= 0; i--) {
    await items[i].sendKeys(Key.HOME);

    t.true(
      await checkFocus(t, ex.treeitemSelector, 0),
      'Sending key HOME to treeitem at index ' +
        i +
        ' will move focus to the first treeitem'
    );
  }
});

ariaTest('key end moves focus', exampleFile, 'key-end', async (t) => {
  // Test that key "end" works when no treeitem is open
  const topLevelTreeitems = await t.context.queryElements(
    t,
    ex.topLevelTreeitemsSelector
  );

  for (let i = topLevelTreeitems.length - 1; i >= 0; i--) {
    await topLevelTreeitems[i].sendKeys(Key.END);

    t.true(
      await checkFocus(
        t,
        ex.topLevelTreeitemsSelector,
        topLevelTreeitems.length - 1
      ),
      'Sending key END to top level treeitem at index ' +
        i +
        ' should move focus to last top level treeitem'
    );

    if (await isExpandableTreeitem(topLevelTreeitems[i])) {
      t.is(
        await topLevelTreeitems[i].getAttribute('aria-expanded'),
        'false',
        'Sending key END to top level treeitem at index ' +
          i +
          ' should not expand the treeitem'
      );
    }
  }

  // Reload page
  await t.context.session.get(t.context.url);

  // Open all expandable treeitems
  await openAllExpandableTreeitems(t);

  const items = await t.context.queryElements(t, ex.treeitemSelector);

  for (let i = items.length - 1; i >= 0; i--) {
    await items[i].sendKeys(Key.END);

    t.true(
      await checkFocus(t, ex.treeitemSelector, items.length - 1),
      'Sending key END to treeitem at index ' +
        i +
        ' will move focus to the last item in the last opened treeitem'
    );
  }
});

ariaTest('characters move focus', exampleFile, 'key-character', async (t) => {
  const charIndexTestClosed = [
    { sendChar: 'p', sendIndex: 0, endIndex: 0 },
    { sendChar: 'A', sendIndex: 0, endIndex: 1 },
    { sendChar: 'H', sendIndex: 1, endIndex: 0 },
  ];

  const charIndexTestOpened = [
    { sendChar: 'f', sendIndex: 0, endIndex: 4 },
    { sendChar: 'h', sendIndex: 0, endIndex: 5 },
    { sendChar: 'u', sendIndex: 2, endIndex: 15 },
    { sendChar: 'u', sendIndex: 15, endIndex: 15 },
    { sendChar: 'c', sendIndex: 15, endIndex: 21 },
    { sendChar: 'r', sendIndex: 21, endIndex: 28 },
    { sendChar: 'f', sendIndex: 28, endIndex: 4 },
    { sendChar: 'g', sendIndex: 3, endIndex: 16 },
    { sendChar: 'f', sendIndex: 10, endIndex: 11 },
  ];

  const topLevelTreeitems = await t.context.queryElements(
    t,
    ex.topLevelTreeitemsSelector
  );

  for (let test of charIndexTestClosed) {
    // Send character to treeitem
    await topLevelTreeitems[test.sendIndex].sendKeys(test.sendChar);

    // Test that the focus switches to the appropriate item
    t.true(
      await checkFocus(t, ex.topLevelTreeitemsSelector, test.endIndex),
      'Sending character ' +
        test.sendChar +
        ' to treeitem ' +
        test.sendIndex +
        ' should move the focus to treeitem ' +
        test.endIndex
    );
  }

  // Reload page
  await t.context.session.get(t.context.url);

  // Open all treeitems
  await openAllExpandableTreeitems(t);

  const items = await t.context.queryElements(t, ex.treeitemSelector);

  for (let test of charIndexTestOpened) {
    // Send character to treeitem
    await items[test.sendIndex].sendKeys(test.sendChar);

    // Test that the focus switches to the appropriate treeitem
    t.true(
      await checkFocus(t, ex.treeitemSelector, test.endIndex),
      'Sending character ' +
        test.sendChar +
        ' to treeitem ' +
        test.sendIndex +
        ' should move the focus to treeitem ' +
        test.endIndex
    );
  }
});

ariaTest(
  'asterisk key opens expandable treeitems',
  exampleFile,
  'key-asterisk',
  async (t) => {
    // Test that "*" ONLY opens all top level nodes and no other treeitems

    const topLevelTreeitems = await t.context.queryElements(
      t,
      ex.topLevelExpandableTreeitemsSelector
    );

    // Send Key
    await topLevelTreeitems[0].sendKeys('*');

    await assertAttributeValues(
      t,
      ex.topLevelExpandableTreeitemsSelector,
      'aria-expanded',
      'true'
    );
    await assertAttributeValues(
      t,
      ex.nextLevelExpandableTreeitemsSelector,
      'aria-expanded',
      'false'
    );

    // Test that "*" on "about" child treeitems on that level

    const aboutChildTreeitems = await t.context.queryElements(
      t,
      ex.aboutChildTreeitemsSelector
    );

    const aboutChildExpandableTreeitems = await t.context.queryElements(
      t,
      ex.aboutChildExpandableTreeitemsSelector
    );

    // Send key

    await aboutChildTreeitems[0].sendKeys('*');

    // The child expandable treeitems of "About" top level treeitem should all be open

    for (let el of aboutChildExpandableTreeitems) {
      t.true(
        (await el.getAttribute('aria-expanded')) === 'true',
        'Sibling "' +
          (await el.getText()) +
          '" treeitem of "' +
          (await aboutChildTreeitems[0].getText()) +
          '" treeitem should all be opened after sending one "*" to the treeitem.'
      );
    }

    // Test that "*" on "admissions" child treeitems on that level

    const admissionsChildTreeitems = await t.context.queryElements(
      t,
      ex.admissionsChildTreeitemsSelector
    );

    const admissionsChildExpandableTreeitems = await t.context.queryElements(
      t,
      ex.admissionsChildExpandableTreeitemsSelector
    );

    // Send key

    await admissionsChildTreeitems[0].sendKeys('*');

    // The child expandable treeitems of "admissions" top level treeitem should all be open

    for (let el of admissionsChildExpandableTreeitems) {
      t.true(
        (await el.getAttribute('aria-expanded')) === 'true',
        'Sibling "' +
          (await el.getText()) +
          '" treeitem of "' +
          (await admissionsChildTreeitems[0].getText()) +
          '" treeitem should all be opened after sending one "*" to the treeitem.'
      );
    }
  }
);
