const { ariaTest } = require('..');
const { By, Key } = require('selenium-webdriver');
const assertAttributeValues = require('../util/assertAttributeValues');
const assertAriaLabelledby = require('../util/assertAriaLabelledby');
const assertRovingTabindex = require('../util/assertRovingTabindex');

const exampleFile = 'treeview/treeview-1/treeview-1b.html';

const ex = {
  treeSelector: '#ex1 [role="tree"]',
  treeitemSelector: '#ex1 [role="treeitem"]',
  groupSelector: '#ex1 [role="group"]',
  folderSelector: '#ex1 [role="treeitem"][aria-expanded]',
  topLevelFolderSelector: '#ex1 [role="tree"] > [role="treeitem"]',
  nextLevelFolderSelector: '[role="group"] > [role="treeitem"][aria-expanded]',
  docSelector: '#ex1 .doc[role="treeitem"]',
  textboxSelector: '#ex1 #last_action',
  treeitemGroupSelectors: {
    1: [
      // Top level folders
      '[role="tree"]>[role="treeitem"]',
    ],
    2: [
      // Content of first top level folder
      '[role="tree"]>[role="treeitem"]:nth-of-type(1)>[role="group"]>[role="treeitem"]',

      // Content of second top level folder
      '[role="tree"]>[role="treeitem"]:nth-of-type(2)>[role="group"]>[role="treeitem"]',

      // Content of third top level folder
      '[role="tree"]>[role="treeitem"]:nth-of-type(3)>[role="group"]>[role="treeitem"]',
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
  return !(await el.getAttribute('class')).includes('doc');
};

const isOpenedFolderTreeitem = async function (el) {
  return (await el.getAttribute('aria-expanded')) === 'true';
};

const isClosedFolderTreeitem = async function (el) {
  return (await el.getAttribute('aria-expanded')) === 'false';
};

ariaTest(
  'aria-selected attribute on treeitem initial value',
  exampleFile,
  'treeitem-aria-selected',
  async (t) => {
    const treeitems = await t.context.queryElements(t, ex.treeitemSelector);

    for (let treeitem of treeitems) {
      t.is(
        await treeitem.getAttribute('aria-selected'),
        'false',
        'treeitem should initially have aria-selected="false"'
      );
    }
  }
);

ariaTest(
  'aria-selected attribute on treeitem on down arrow, right arrow and enter',
  exampleFile,
  'treeitem-aria-selected',
  async (t) => {
    const items = await t.context.queryElements(t, ex.treeitemSelector);

    for (let i = 0; i < items.length - 1; i++) {
      await items[i].sendKeys(Key.ARROW_DOWN);
      const nextItem = await t.context.queryElement(
        t,
        ex.treeitemSelector + '[tabindex="0"]'
      );
      const focusMoved = items[i] !== nextItem;
      if (focusMoved) {
        t.is(
          await nextItem.getAttribute('aria-selected'),
          'false',
          'treeitem should have aria-selected="false" after focus by sending key ARROW_DOWN'
        );
        // move focus back to the previous item
        await nextItem.sendKeys(Key.ARROW_UP);
      }
      await items[i].sendKeys(Key.ARROW_RIGHT);
      t.is(
        await items[i].getAttribute('aria-selected'),
        'false',
        'treeitem should have aria-selected="false" after expanding by sending key ARROW_RIGHT'
      );
      await items[i].sendKeys(Key.ENTER);
      t.is(
        await items[i].getAttribute('aria-selected'),
        'true',
        'treeitem should have aria-selected="true" after selecting by sending key ENTER'
      );
      // move focus to the next item
      await items[i].sendKeys(Key.ARROW_DOWN);
    }
    // Cleanup: reload page
    await t.context.session.get(await t.context.session.getCurrentUrl());
  }
);

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
  'role="treeitem" on "ul" element',
  exampleFile,
  'treeitem-role',
  async (t) => {
    const treeitems = await t.context.queryElements(t, ex.treeitemSelector);

    t.truthy(
      treeitems.length,
      'role="treeitem" elements should be found by selector: ' +
        ex.treeitemSelector
    );

    for (let treeitem of treeitems) {
      t.is(
        await treeitem.getTagName(),
        'li',
        'role="treeitem" should be found on a "li"'
      );
    }
  }
);

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
  '"aria-setsize" attribute on treeitem',
  exampleFile,
  'treeitem-aria-setsize',
  async (t) => {
    for (const [, levelSelectors] of Object.entries(
      ex.treeitemGroupSelectors
    )) {
      for (const selector of levelSelectors) {
        const treeitems = await t.context.queryElements(t, selector);
        const setsize = treeitems.length;

        for (const treeitem of treeitems) {
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
);

ariaTest(
  '"aria-posinset" attribute on treeitem',
  exampleFile,
  'treeitem-aria-posinset',
  async (t) => {
    for (const [, levelSelectors] of Object.entries(
      ex.treeitemGroupSelectors
    )) {
      for (const selector of levelSelectors) {
        const treeitems = await t.context.queryElements(t, selector);
        let pos = 0;
        for (const treeitem of treeitems) {
          pos++;
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
);

ariaTest(
  '"aria-level" attribute on treeitem',
  exampleFile,
  'treeitem-aria-level',
  async (t) => {
    for (const [level, levelSelectors] of Object.entries(
      ex.treeitemGroupSelectors
    )) {
      for (const selector of levelSelectors) {
        const treeitems = await t.context.queryElements(t, selector);
        for (const treeitem of treeitems) {
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
        // By default, all folders will be closed
        t.is(await folder.getAttribute('aria-expanded'), 'false');
        t.is(
          await (
            await t.context.queryElement(t, '[role="treeitem"]', folder)
          ).isDisplayed(),
          false
        );

        // Send arrow right to the folder
        await folder.sendKeys(Key.ARROW_RIGHT);

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

        // Send arrow left to collapse the folder
        await folders[i].sendKeys(Key.ARROW_LEFT);

        // After sending arrow left, it should be closed
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
  'role="group" on "ul" elements',
  exampleFile,
  'role-group',
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

ariaTest('Key enter selects file', exampleFile, 'key-enter', async (t) => {
  await openAllFolders(t);

  const items = await t.context.queryElements(t, ex.docSelector);

  for (let item of items) {
    const itemText = await item.getText();

    // Send enter to the folder
    await item.sendKeys(Key.ENTER);

    const boxText = await t.context.session
      .findElement(By.css(ex.textboxSelector))
      .getAttribute('value');
    t.is(
      boxText,
      itemText,
      'Sending enter to doc "' +
        itemText +
        '" should update the value in the textbox'
    );
  }
});

ariaTest('Key space selects file', exampleFile, 'key-space', async (t) => {
  await openAllFolders(t);

  const items = await t.context.queryElements(t, ex.docSelector);

  for (let item of items) {
    const itemText = await item.getText();

    // Send space to the folder
    await item.sendKeys(Key.SPACE);

    const boxText = await t.context.session
      .findElement(By.css(ex.textboxSelector))
      .getAttribute('value');
    t.is(
      boxText,
      itemText,
      'Sending space to doc "' +
        itemText +
        '" should update the value in the textbox'
    );
  }
});

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
        'Sending key ARROW_DOWN to top level folder/item at index ' +
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
      'Sending key ARROW_UP to top level folder/item at index ' +
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
          'Sending key ARROW_LEFT to document in top level folder at treeitem index ' +
            i +
            ' should not move focus'
        );
      }

      // If the item is a document in folder, or a closed folder, arrow will move up a folder
      else {
        t.true(
          await checkFocusOnParentFolder(t, items[i]),
          'Sending key ARROW_LEFT to document in folder at treeitem index ' +
            i +
            ' should move focus to parent folder'
        );

        t.is(
          await items[i].isDisplayed(),
          true,
          'Sending key ARROW_LEFT to document in folder at treeitem index ' +
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
    { sendChar: 'p', sendIndex: 0, endIndex: 0 },
    { sendChar: 'r', sendIndex: 0, endIndex: 1 },
    { sendChar: 'l', sendIndex: 1, endIndex: 2 },
  ];

  const charIndexTestOpened = [
    { sendChar: 'x', sendIndex: 0, endIndex: 0 },
    { sendChar: 'p', sendIndex: 0, endIndex: 1 },
    { sendChar: 'p', sendIndex: 1, endIndex: 2 },
    { sendChar: 'p', sendIndex: 2, endIndex: 3 },
    { sendChar: 'x', sendIndex: 3, endIndex: 3 },
    { sendChar: 'r', sendIndex: 3, endIndex: 15 },
    { sendChar: 'r', sendIndex: 15, endIndex: 16 },
    { sendChar: 'l', sendIndex: 3, endIndex: 30 },
    { sendChar: 'l', sendIndex: 30, endIndex: 31 },
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
