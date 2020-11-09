const { ariaTest } = require('..');
const { By, Key } = require('selenium-webdriver');
const assertAttributeValues = require('../util/assertAttributeValues');
const assertAriaLabelledby = require('../util/assertAriaLabelledby');
const assertRovingTabindex = require('../util/assertRovingTabindex');
const replaceExternalLink = require('../util/replaceExternalLink');

const exampleFile = 'treeview/treeview-2/treeview-2b.html';

const ex = {
  treeSelector: '#ex1 [role="tree"]',
  treeitemSelector: '#ex1 [role="treeitem"]',
  groupSelector: '#ex1 [role="group"]',
  folderSelector: '#ex1 [role="treeitem"][aria-expanded]',
  topLevelFolderSelector: '#ex1 [role="tree"] > [role="treeitem"]',
  nextLevelFolderSelector: '[role="group"] > [role="treeitem"][aria-expanded]',
  linkSelector: '#ex1 a[role="treeitem"]',
  groupItemSelectors: {
    1: [
      // Top level folders
      '[role="tree"]>[role="treeitem"]',
    ],
    2: [
      // Content of first top level folder
      '[role="tree"]>[role="treeitem"]:nth-of-type(1)>[role="group"]>li',

      // Content of second top level folder
      '[role="tree"]>[role="treeitem"]:nth-of-type(2)>[role="group"]>li',

      // Content of third top level folder
      '[role="tree"]>[role="treeitem"]:nth-of-type(3)>[role="group"]>li',
    ],

    3: [
      // Content of subfolders of first top level folder
      '[role="tree"]>[role="treeitem"]:nth-of-type(1)>[role="group"]>[role="treeitem"]:nth-of-type(3) [role="treeitem"]',
      '[role="tree"]>[role="treeitem"]:nth-of-type(1)>[role="group"]>[role="treeitem"]:nth-of-type(5) [role="treeitem"]',

      // Content of subfolders of second top level folder
      '[role="tree"]>[role="treeitem"]:nth-of-type(2)>[role="group"]>[role="treeitem"]:nth-of-type(1) [role="treeitem"]',
      '[role="tree"]>[role="treeitem"]:nth-of-type(2)>[role="group"]>[role="treeitem"]:nth-of-type(2) [role="treeitem"]',
      '[role="tree"]>[role="treeitem"]:nth-of-type(2)>[role="group"]>[role="treeitem"]:nth-of-type(3) [role="treeitem"]',

      // Content of subfolders of third top level folder
      '[role="tree"]>[role="treeitem"]:nth-of-type(3)>[role="group"]>[role="treeitem"]:nth-of-type(1) [role="treeitem"]',
      '[role="tree"]>[role="treeitem"]:nth-of-type(3)>[role="group"]>[role="treeitem"]:nth-of-type(2) [role="treeitem"]',
      '[role="tree"]>[role="treeitem"]:nth-of-type(3)>[role="group"]>[role="treeitem"]:nth-of-type(3) [role="treeitem"]',
    ],
  },
};

const openAllFolders = async function (t) {
  const closedFoldersSelector = ex.treeitemSelector + '[aria-expanded="false"]';
  let closedFolders = await t.context.queryElements(t, closedFoldersSelector);

  // Going through all closed folder elements in dom order will open parent
  // folders first, therefore all child folders will be visible before clicked
  for (let folder of closedFolders) {
    await folder.click();
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

const checkFocusOnParentFolder = async function (t, el) {
  return t.context.session.executeScript(function () {
    const el = arguments[0];

    // the element is a folder
    if (el.hasAttribute('aria-expanded')) {
      return (
        document.activeElement ===
        el.parentElement.closest('[role="treeitem"][aria-expanded]')
      );
    }
    // the element is a folder
    else {
      return (
        document.activeElement ===
        el.closest('[role="treeitem"][aria-expanded]')
      );
    }
  }, el);
};

const isTopLevelFolder = async function (t, el) {
  return t.context.session.executeScript(function () {
    const el = arguments[0];
    return el.parentElement.getAttribute('role') === 'tree';
  }, el);
};

const isFolderTreeitem = async function (el) {
  return (await el.getTagName()) === 'li';
};

const isOpenedFolderTreeitem = async function (el) {
  return (await el.getAttribute('aria-expanded')) === 'true';
};

const isClosedFolderTreeitem = async function (el) {
  return (await el.getAttribute('aria-expanded')) === 'false';
};

const hasAriaExpandedAttribute = async function (t, el) {
  return t.context.session.executeScript(async function () {
    const el = arguments[0];
    return el.hasAttribute('aria-expanded');
  }, el);
};

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
  'aria-labelledby on role="tree" element',
  exampleFile,
  'tree-aria-labelledby',
  async (t) => {
    await assertAriaLabelledby(t, ex.treeSelector);
  }
);

ariaTest(
  'role="treeitem" on "li" or "a" element',
  exampleFile,
  'treeitem-role',
  async (t) => {
    // Get all the list items in the tree structure
    const listitems = await t.context.queryElements(t, '#ex1 [role="tree"] li');

    // Check the role "treeitem" is on the list item (in the case of a directory) or contained link
    for (let item of listitems) {
      const hasAriaExpanded = await hasAriaExpandedAttribute(t, item);

      // if "aria-expanded" is contained on the list item, it is a directory
      if (hasAriaExpanded) {
        t.is(
          await item.getAttribute('role'),
          'treeitem',
          'role="treeitem" should be found on a "li" items that have attribute "aria-expanded"'
        );
      } else {
        const links = await t.context.queryElements(t, 'a', item);
        t.is(
          await links[0].getAttribute('role'),
          'treeitem',
          'role="treeitem" should be found on focusable "a" elements within tree structure'
        );
      }
    }
  }
);

ariaTest('role="none" on "li" element', exampleFile, 'none-role', async (t) => {
  // Get all the list items in the tree structure
  const listitems = await t.context.queryElements(t, '#ex1 [role="tree"] li');

  for (let item of listitems) {
    const hasAriaExpanded = await hasAriaExpandedAttribute(t, item);

    // if "aria-expanded" is not on the list item, it is a leaf node
    if (!hasAriaExpanded) {
      t.is(
        await item.getAttribute('role'),
        'none',
        'role="none" should be found on a "li" items that do not have attribute "aria-expanded", or, are leaf nodes'
      );
    }
  }
});

ariaTest(
  'treeitem tabindex set by roving tabindex',
  exampleFile,
  'treeitem-tabindex',
  async (t) => {
    await openAllFolders(t);

    await assertRovingTabindex(t, ex.treeitemSelector, Key.ARROW_DOWN);
  }
);

ariaTest(
  'aria-expanded attribute on treeitem matches dom',
  exampleFile,
  'treeitem-aria-expanded',
  async (t) => {
    const folders = await t.context.queryElements(t, ex.folderSelector);

    for (let folder of folders) {
      // If the folder is displayed
      if (await folder.isDisplayed()) {
        const folderText = await folder.getText();

        // By default, all folders will be closed
        t.is(await folder.getAttribute('aria-expanded'), 'false');
        t.is(
          await (
            await t.context.queryElement(t, '[role="treeitem"]', folder)
          ).isDisplayed(),
          false
        );

        // Send enter to the folder
        await folder.sendKeys(Key.ENTER);

        // After click, it should be open
        t.is(await folder.getAttribute('aria-expanded'), 'true');
        t.is(
          await (
            await t.context.queryElement(t, '[role="treeitem"]', folder)
          ).isDisplayed(),
          true
        );
      }
    }

    for (let i = folders.length - 1; i >= 0; i--) {
      // If the folder is displayed
      if (await folders[i].isDisplayed()) {
        const folderText = await folders[i].getText();

        // Send enter to the folder
        await folders[i].sendKeys(Key.ENTER);

        // After sending enter, it should be closed
        t.is(
          await folders[i].getAttribute('aria-expanded'),
          'false',
          folderText
        );
        t.is(
          await (
            await t.context.queryElement(t, '[role="treeitem"]', folders[i])
          ).isDisplayed(),
          false,
          folderText
        );
      }
    }
  }
);

ariaTest(
  '"aria-setsize" attribute on treeitem',
  exampleFile,
  'treeitem-aria-setsize',
  async (t) => {
    for (const [level, levelSelectors] of Object.entries(
      ex.groupItemSelectors
    )) {
      for (const selector of levelSelectors) {
        const items = await t.context.queryElements(t, selector);
        const setsize = items.length;

        for (const item of items) {
          // The item is a folder with "treeitem" role and "aria-setsize" set
          if ((await item.getAttribute('role')) === 'treeitem') {
            t.is(
              await item.getAttribute('aria-setsize'),
              setsize.toString(),
              '"aria-setsize" attribute should be set to group size (' +
                setsize +
                ') in group "' +
                selector +
                '"'
            );
          }

          // The item is a li that contains a link the "treeitem" role and "aria-setsize" set
          else {
            let treeitem = item.findElement(By.css('[role="treeitem"]'));
            t.is(
              await treeitem.getAttribute('aria-setsize'),
              setsize.toString(),
              '"aria-setsize" attribute should be set to group size (' +
                setsize +
                ') in group "' +
                selector +
                '"'
            );
          }
        }
      }
    }
  }
);

ariaTest(
  '"aria-posinset" attribute on treeitem',
  exampleFile,
  'treeitem-aria-posinset',
  async (t) => {
    for (const [level, levelSelectors] of Object.entries(
      ex.groupItemSelectors
    )) {
      for (const selector of levelSelectors) {
        const items = await t.context.queryElements(t, selector);
        let pos = 0;

        for (const item of items) {
          pos++;

          // The item is a folder with "treeitem" role and "aria-posinset" set
          if ((await item.getAttribute('role')) === 'treeitem') {
            t.is(
              await item.getAttribute('aria-posinset'),
              pos.toString(),
              '"aria-posinset" attribute should be set to "' +
                pos +
                '" for treeitem in group "' +
                selector +
                '"'
            );
          }

          // The item is a li that contains a link the "treeitem" role and "aria-posinset" set
          else {
            let treeitem = item.findElement(By.css('[role="treeitem"]'));
            t.is(
              await treeitem.getAttribute('aria-posinset'),
              pos.toString(),
              '"aria-posinset" attribute should be set to "' +
                pos +
                '" for treeitem in group "' +
                selector +
                '"'
            );
          }
        }
      }
    }
  }
);

ariaTest(
  '"aria-level" attribute on treeitem',
  exampleFile,
  'treeitem-aria-level',
  async (t) => {
    for (const [level, levelSelectors] of Object.entries(
      ex.groupItemSelectors
    )) {
      for (const selector of levelSelectors) {
        const items = await t.context.queryElements(t, selector);
        for (const item of items) {
          // The item is a folder with "treeitem" role and "aria-level" set
          if ((await item.getAttribute('role')) === 'treeitem') {
            t.is(
              await item.getAttribute('aria-level'),
              level.toString(),
              '"aria-level" attribute should be set to level "' +
                level +
                '" in group "' +
                selector +
                '"'
            );
          }

          // The item is a li that contains a link the "treeitem" role and "aria-level" set
          else {
            let treeitem = item.findElement(By.css('[role="treeitem"]'));
            t.is(
              await treeitem.getAttribute('aria-level'),
              level.toString(),
              '"aria-level" attribute should be set to level "' +
                level +
                '" in group "' +
                selector +
                '"'
            );
          }
        }
      }
    }
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

// Keys

ariaTest(
  'Key enter opens folder and activates link',
  exampleFile,
  'key-enter-or-space',
  async (t) => {
    let folders = await t.context.queryElements(t, ex.folderSelector);

    // Going through all closed folder elements in dom order will open parent
    // folders first, therefore all child folders will be visible before sending "enter"
    for (let folder of folders) {
      await folder.sendKeys(Key.ENTER);
    }

    // Assert that the attribute value "aria-expanded" on all folders is "true"
    await assertAttributeValues(t, ex.folderSelector, 'aria-expanded', 'true');

    // Update url to remove external reference for dependable testing
    const newUrl = t.context.url + '#test-url-change';
    await replaceExternalLink(t, newUrl, ex.linkSelector, 0);

    // Test a leaf node
    let leafnodes = await t.context.queryElements(t, ex.linkSelector);
    await leafnodes[0].sendKeys(Key.ENTER);

    t.is(
      await t.context.session.getCurrentUrl(),
      newUrl,
      'ENTER key on first element found by selector "' +
        ex.linkSelector +
        '" should activate link.'
    );
  }
);

// This test fails due to bug #869.
ariaTest.failing(
  'Key space opens folder and activates link',
  exampleFile,
  'key-enter-or-space',
  async (t) => {
    let folders = await t.context.queryElements(t, ex.folderSelector);

    // Going through all closed folder elements in dom order will open parent
    // folders first, therefore all child folders will be visible before sending "space"
    for (let folder of folders) {
      await folder.sendKeys(Key.SPACE);
    }

    // Assert that the attribute value "aria-expanded" on all folders is "true"
    await assertAttributeValues(t, ex.folderSelector, 'aria-expanded', 'true');

    // Update url to remove external reference for dependable testing
    const newUrl = t.context.url + '#test-url-change';
    await replaceExternalLink(t, newUrl, ex.linkSelector, 0);

    // Test a leaf node
    let leafnodes = await t.context.queryElements(t, ex.linkSelector);
    await leafnodes[0].sendKeys(Key.SPACE);

    t.is(
      await t.context.session.getCurrentUrl(),
      newUrl,
      'SPACE key on first element found by selector "' +
        ex.linkSelector +
        '" should activate link.'
    );
  }
);

ariaTest(
  'key down arrow moves focus',
  exampleFile,
  'key-down-arrow',
  async (t) => {
    // Check that the down arrow does not open folders
    const topLevelFolders = await t.context.queryElements(
      t,
      ex.topLevelFolderSelector
    );

    for (let i = 0; i < topLevelFolders.length; i++) {
      await topLevelFolders[i].sendKeys(Key.ARROW_DOWN);

      // If we are on the last top level folder, the focus will not move
      const nextIndex = i === topLevelFolders.length - 1 ? i : i + 1;

      t.true(
        await checkFocus(t, ex.topLevelFolderSelector, nextIndex),
        'Sending key ARROW_DOWN to top level folder at index ' +
          i +
          ' will move focus to ' +
          nextIndex
      );

      t.is(
        await topLevelFolders[i].getAttribute('aria-expanded'),
        'false',
        'Sending key ARROW_DOWN to top level folder at index ' +
          i +
          ' should not expand the folder'
      );
    }

    // Reload page
    await t.context.session.get(await t.context.session.getCurrentUrl());

    // Open all folders
    await openAllFolders(t);

    const items = await t.context.queryElements(t, ex.treeitemSelector);

    for (let i = 0; i < items.length; i++) {
      await items[i].sendKeys(Key.ARROW_DOWN);

      // If we are on the last item, the focus will not move
      const nextIndex = i === items.length - 1 ? i : i + 1;

      t.true(
        await checkFocus(t, ex.treeitemSelector, nextIndex),
        'Sending key ARROW_DOWN to folder/item at index ' +
          i +
          ' will move focus to ' +
          nextIndex
      );
    }
  }
);

ariaTest('key up arrow moves focus', exampleFile, 'key-up-arrow', async (t) => {
  // Check that the down arrow does not open folders
  const topLevelFolders = await t.context.queryElements(
    t,
    ex.topLevelFolderSelector
  );

  for (let i = topLevelFolders.length - 1; i >= 0; i--) {
    await topLevelFolders[i].sendKeys(Key.ARROW_UP);

    // If we are on the last top level folder, the focus will not move
    const nextIndex = i === 0 ? i : i - 1;

    t.true(
      await checkFocus(t, ex.topLevelFolderSelector, nextIndex),
      'Sending key ARROW_UP to top level folder at index ' +
        i +
        ' will move focus to ' +
        nextIndex
    );

    t.is(
      await topLevelFolders[i].getAttribute('aria-expanded'),
      'false',
      'Sending key ARROW_UP to top level folder at index ' +
        i +
        ' should not expand the folder'
    );
  }

  // Reload page
  await t.context.session.get(await t.context.session.getCurrentUrl());

  // Open all folders
  await openAllFolders(t);

  const items = await t.context.queryElements(t, ex.treeitemSelector);

  for (let i = items.length - 1; i >= 0; i--) {
    await items[i].sendKeys(Key.ARROW_UP);

    // If we are on the last item, the focus will not move
    const nextIndex = i === 0 ? i : i - 1;

    t.true(
      await checkFocus(t, ex.treeitemSelector, nextIndex),
      'Sending key ARROW_UP to folder/item at index ' +
        i +
        ' will move focus to ' +
        nextIndex
    );
  }
});

ariaTest(
  'key right arrow opens folders and moves focus',
  exampleFile,
  'key-right-arrow',
  async (t) => {
    const items = await t.context.queryElements(t, ex.treeitemSelector);

    let i = 0;
    while (i < items.length) {
      const isFolder = await isFolderTreeitem(items[i]);
      const isClosed = await isClosedFolderTreeitem(items[i]);

      await items[i].sendKeys(Key.ARROW_RIGHT);

      // If the item is a folder and it was originally closed
      if (isFolder && isClosed) {
        t.is(
          await items[i].getAttribute('aria-expanded'),
          'true',
          'Sending key ARROW_RIGHT to folder at treeitem index ' +
            i +
            ' when the folder is closed should open the folder'
        );

        t.true(
          await checkFocus(t, ex.treeitemSelector, i),
          'Sending key ARROW_RIGHT to folder at treeitem index ' +
            i +
            ' when the folder was closed should not move the focus'
        );
        continue;
      }

      // If the folder is an open folder, the focus will move
      else if (isFolder) {
        t.true(
          await checkFocus(t, ex.treeitemSelector, i + 1),
          'Sending key ARROW_RIGHT to folder at treeitem index ' +
            i +
            ' should move focus to item ' +
            (i + 1)
        );
      }

      // If we are a link, the focus will not move
      else {
        t.true(
          await checkFocus(t, ex.treeitemSelector, i),
          'Sending key ARROW_RIGHT to link item at treeitem index ' +
            i +
            ' should not move focus'
        );
      }
      i++;
    }
  }
);

// This test fails due to bug #866.
ariaTest.failing(
  'key left arrow closes folders and moves focus',
  exampleFile,
  'key-left-arrow',
  async (t) => {
    // Open all folders
    await openAllFolders(t);

    const items = await t.context.queryElements(t, ex.treeitemSelector);

    let i = items.length - 1;
    while (i > 0) {
      const isFolder = await isFolderTreeitem(items[i]);
      const isOpened = await isOpenedFolderTreeitem(items[i]);
      const isTopLevel = isFolder ? await isTopLevelFolder(t, items[i]) : false;

      await items[i].sendKeys(Key.ARROW_LEFT);

      // If the item is a folder and the folder was opened, arrow will close folder
      if (isFolder && isOpened) {
        t.is(
          await items[i].getAttribute('aria-expanded'),
          'false',
          'Sending key ARROW_LEFT to folder at treeitem index ' +
            i +
            ' when the folder is opened should close the folder'
        );

        t.true(
          await checkFocus(t, ex.treeitemSelector, i),
          'Sending key ARROW_LEFT to folder at treeitem index ' +
            i +
            ' when the folder is opened should not move the focus'
        );
        // Send one more arrow key to the folder that is now closed
        continue;
      }

      // If the item is a top level folder and closed, arrow will do nothing
      else if (isTopLevel) {
        t.true(
          await checkFocus(t, ex.treeitemSelector, i),
          'Sending key ARROW_LEFT to link in top level folder at treeitem index ' +
            i +
            ' should not move focus'
        );
      }

      // If the item is a link in folder, or a closed folder, arrow will move up a folder
      else {
        t.true(
          await checkFocusOnParentFolder(t, items[i]),
          'Sending key ARROW_LEFT to link in folder at treeitem index ' +
            i +
            ' should move focus to parent folder'
        );

        t.is(
          await items[i].isDisplayed(),
          true,
          'Sending key ARROW_LEFT to link in folder at treeitem index ' +
            i +
            ' should not close the folder it is in'
        );
      }

      i--;
    }
  }
);

ariaTest('key home moves focus', exampleFile, 'key-home', async (t) => {
  // Test that key "home" works when no folder is open
  const topLevelFolders = await t.context.queryElements(
    t,
    ex.topLevelFolderSelector
  );

  for (let i = topLevelFolders.length - 1; i >= 0; i--) {
    await topLevelFolders[i].sendKeys(Key.HOME);

    t.true(
      await checkFocus(t, ex.topLevelFolderSelector, 0),
      'Sending key HOME to top level folder at index ' +
        i +
        ' should move focus to first top level folder'
    );

    t.is(
      await topLevelFolders[i].getAttribute('aria-expanded'),
      'false',
      'Sending key HOME to top level folder at index ' +
        i +
        ' should not expand the folder'
    );
  }

  // Reload page
  await t.context.session.get(await t.context.session.getCurrentUrl());

  // Open all folders
  await openAllFolders(t);

  const items = await t.context.queryElements(t, ex.treeitemSelector);

  for (let i = items.length - 1; i >= 0; i--) {
    await items[i].sendKeys(Key.HOME);

    t.true(
      await checkFocus(t, ex.treeitemSelector, 0),
      'Sending key HOME to top level folder/item at index ' +
        i +
        ' will move focus to the first item'
    );
  }
});

ariaTest('key end moves focus', exampleFile, 'key-end', async (t) => {
  // Test that key "end" works when no folder is open
  const topLevelFolders = await t.context.queryElements(
    t,
    ex.topLevelFolderSelector
  );

  for (let i = topLevelFolders.length - 1; i >= 0; i--) {
    await topLevelFolders[i].sendKeys(Key.END);

    t.true(
      await checkFocus(
        t,
        ex.topLevelFolderSelector,
        topLevelFolders.length - 1
      ),
      'Sending key END to top level folder at index ' +
        i +
        ' should move focus to last top level folder'
    );

    t.is(
      await topLevelFolders[i].getAttribute('aria-expanded'),
      'false',
      'Sending key END to top level folder at index ' +
        i +
        ' should not expand the folder'
    );
  }

  // Reload page
  await t.context.session.get(await t.context.session.getCurrentUrl());

  // Open all folders
  await openAllFolders(t);

  const items = await t.context.queryElements(t, ex.treeitemSelector);

  for (let i = items.length - 1; i >= 0; i--) {
    await items[i].sendKeys(Key.END);

    t.true(
      await checkFocus(t, ex.treeitemSelector, items.length - 1),
      'Sending key END to top level folder/item at index ' +
        i +
        ' will move focus to the last item in the last opened folder'
    );
  }
});

ariaTest('characters move focus', exampleFile, 'key-character', async (t) => {
  const charIndexTestClosed = [
    { sendChar: 'g', sendIndex: 0, endIndex: 2 },
    { sendChar: 'f', sendIndex: 2, endIndex: 0 },
    { sendChar: 'v', sendIndex: 0, endIndex: 1 },
  ];

  const charIndexTestOpened = [
    { sendChar: 'a', sendIndex: 0, endIndex: 3 },
    { sendChar: 'a', sendIndex: 3, endIndex: 9 },
    { sendChar: 'v', sendIndex: 9, endIndex: 15 },
    { sendChar: 'v', sendIndex: 15, endIndex: 15 },
    { sendChar: 'i', sendIndex: 15, endIndex: 41 },
    { sendChar: 'o', sendIndex: 41, endIndex: 1 },
  ];

  const topLevelFolders = await t.context.queryElements(
    t,
    ex.topLevelFolderSelector
  );

  for (let test of charIndexTestClosed) {
    // Send character to treeitem
    await topLevelFolders[test.sendIndex].sendKeys(test.sendChar);

    // Test that the focus switches to the appropriate item
    t.true(
      await checkFocus(t, ex.topLevelFolderSelector, test.endIndex),
      'Sending character ' +
        test.sendChar +
        ' to treeitem ' +
        test.sendIndex +
        ' should move the focus to treeitem ' +
        test.endIndex
    );

    await assertAttributeValues(
      t,
      ex.topLevelFolderSelector,
      'aria-expanded',
      'false'
    );
  }

  // Reload page
  await t.context.session.get(await t.context.session.getCurrentUrl());

  // Open all folders
  await openAllFolders(t);

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
  'asterisk key opens folders',
  exampleFile,
  'key-asterisk',
  async (t) => {
    /* Test that "*" ONLY opens all top level nodes and no other folders */

    const topLevelFolders = await t.context.queryElements(
      t,
      ex.topLevelFolderSelector
    );
    const nextLevelFolders = await t.context.queryElements(
      t,
      ex.nextLevelFolderSelector
    );

    // Send Key
    await topLevelFolders[0].sendKeys('*');

    await assertAttributeValues(
      t,
      ex.topLevelFolderSelector,
      'aria-expanded',
      'true'
    );
    await assertAttributeValues(
      t,
      ex.nextLevelFolderSelector,
      'aria-expanded',
      'false'
    );

    /* Test that "*" ONLY opens sibling folders at that level */

    // Send key
    await nextLevelFolders[0].sendKeys('*');

    // The subfolders of first top level folder should all be open

    const subFoldersOfFirstFolder = await t.context.queryElements(
      t,
      ex.nextLevelFolderSelector,
      topLevelFolders[0]
    );
    for (let el of subFoldersOfFirstFolder) {
      t.true(
        (await el.getAttribute('aria-expanded')) === 'true',
        'Subfolders under the first top level folder should all be opened after sending one "*" to subfolder under first top level folder'
      );
    }

    // The subfolders of second top level folder should all be closed

    const subFoldersOfSecondFolder = await t.context.queryElements(
      t,
      ex.nextLevelFolderSelector,
      topLevelFolders[1]
    );
    for (let el of subFoldersOfSecondFolder) {
      t.true(
        (await el.getAttribute('aria-expanded')) === 'false',
        'Subfolders under the second top level folder should all be closed after sending one "*" to subfolder under first top level folder'
      );
    }

    // The subfolders of third top level folder should all be closed

    const subFoldersOfThirdFolder = await t.context.queryElements(
      t,
      ex.nextLevelFolderSelector,
      topLevelFolders[2]
    );
    for (let el of subFoldersOfThirdFolder) {
      t.true(
        (await el.getAttribute('aria-expanded')) === 'false',
        'Subfolders under the third top level folder should all be closed after sending one "*" to subfolder under first top level folder'
      );
    }
  }
);
