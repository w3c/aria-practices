'use strict';

const { ariaTest } = require('..');
const { By, Key } = require('selenium-webdriver');
const assertAttributeValues = require('../util/assertAttributeValues');
const assertAriaLabelledby = require('../util/assertAriaLabelledby');
const assertRovingTabindex = require('../util/assertRovingTabindex');

const exampleFile = 'treeview/treeview-1/treeview-1a.html';

const ex = {
  treeSelector: '#ex1 [role="tree"]',
  treeitemSelector: '#ex1 [role="treeitem"]',
  groupSelector: '#ex1 [role="group"]',
  folderSelector: '#ex1 [role="treeitem"][aria-expanded]',
  topLevelFolderSelector: '#ex1 [role="tree"] > [role="treeitem"]',
  nextLevelFolderSelector: '[role="group"] > [role="treeitem"][aria-expanded]',
  docSelector: '#ex1 .doc[role="treeitem"]',
  textboxSelector: '#ex1 #last_action'
};

const openAllFolders = async function (t) {
  const closedFoldersSelector = ex.treeitemSelector + '[aria-expanded="false"]';
  let closedFolders = await t.context.session.findElements(By.css(closedFoldersSelector));

  // While there are closed folders
  while (closedFolders.length > 0) {

    // Find the first visible closed folder and click it
    await closedFolders[0].click();

    // Get the updated list of closed folders (as opening one folder may have revealled
    // more folders)
    closedFolders = await t.context.session.findElements(By.css(closedFoldersSelector));
  }
};

const checkFocus = async function (t, selector, index) {
  return t.context.session.executeScript(function (/* selector, index*/) {
    const [selector, index] = arguments;
    const items = document.querySelectorAll(selector);
    return items[index] === document.activeElement;
  }, selector, index);
};

const checkFocusOnParentFolder = async function (t, el) {
  return t.context.session.executeScript(function () {
    const el = arguments[0];

    // the element is a folder
    if (el.hasAttribute('aria-expanded')) {
      return document.activeElement === el.parentElement.closest('[role="treeitem"][aria-expanded]');
    }
    // the element is a folder
    else {
      return document.activeElement === el.closest('[role="treeitem"][aria-expanded]');
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

const isOpenedFolderTreeitem =  async function (el) {
  return await el.getAttribute('aria-expanded') === 'true';
};

const isClosedFolderTreeitem =  async function (el) {
  return await el.getAttribute('aria-expanded') === 'false';
};

ariaTest('role="tree" on ul element', exampleFile, 'tree-role', async (t) => {

  t.plan(2);

  const trees = await t.context.session.findElements(By.css(ex.treeSelector));

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

ariaTest('aria-labelledby on role="tree" element', exampleFile, 'tree-aria-labelledby', async (t) => {

  t.plan(1);

  await assertAriaLabelledby(t, 'ex1', ex.treeSelector);
});

ariaTest('role="treeitem" on "ul" element', exampleFile, 'treeitem-role', async (t) => {

  t.plan(46);

  const treeitems = await t.context.session.findElements(By.css(ex.treeitemSelector));

  t.truthy(
    treeitems.length,
    'role="treeitem" elements should be found by selector: ' + ex.treeitemSelector
  );

  for (let treeitem of treeitems) {
    t.is(
      await treeitem.getTagName(),
      'li',
      'role="treeitem" should be found on a "li"'
    );
  }
});

ariaTest('treeitem tabindex set by roving tabindex', exampleFile, 'treeitem-tabindex', async (t) => {
  await openAllFolders(t);

  await assertRovingTabindex(t, ex.treeitemSelector, Key.ARROW_DOWN);
});

ariaTest('aria-expanded attribute on treeitem matches dom', exampleFile, 'treeitem-ariaexpanded', async (t) => {

  t.plan(66);

  const folders = await t.context.session.findElements(By.css(ex.folderSelector));

  for (let folder of folders) {

    // If the folder is displayed
    if (await folder.isDisplayed()) {

      const folderText = await folder.getText();

      // By default, all folders will be closed
      t.is(
        await folder.getAttribute('aria-expanded'),
        'false'
      );
      t.is(
        await(await folder.findElements(By.css('[role="treeitem"]')))[0].isDisplayed(),
        false
      );

      // Send enter to the folder
      await folder.sendKeys(Key.ENTER);

      // After click, it should be open
      t.is(
        await folder.getAttribute('aria-expanded'),
        'true'
      );
      t.is(
        await(await folder.findElements(By.css('[role="treeitem"]')))[0].isDisplayed(),
        true
      );
    }
  }

  for (let i = (folders.length - 1); i >= 0; i--) {

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
        await(await folders[i].findElements(By.css('[role="treeitem"]')))[0].isDisplayed(),
        false,
        folderText
      );
    }
  }

});

ariaTest('role="group" on "ul" elements', exampleFile, 'group-role', async (t) => {

  t.plan(12);

  const groups = await t.context.session.findElements(By.css(ex.groupSelector));

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
});

// Keys

ariaTest('Key enter opens folder', exampleFile, 'key-enter-or-space', async (t) => {
  t.plan(34);

  await openAllFolders(t);

  const items = await t.context.session.findElements(By.css(ex.docSelector));

  for (let item of items) {

    const itemText = await item.getText();

    // Send enter to the folder
    await item.sendKeys(Key.ENTER);

    const boxText = await t.context.session.findElement(By.css(ex.textboxSelector)).getAttribute('value');
    t.is(
      boxText,
      itemText,
      'Sending enter to doc "' + itemText + '" should update the value in the textbox'
    );
  }

});

ariaTest('Key space opens folder', exampleFile, 'key-enter-or-space', async (t) => {
  t.plan(34);

  await openAllFolders(t);

  const items = await t.context.session.findElements(By.css(ex.docSelector));

  for (let item of items) {

    const itemText = await item.getText();

    // Send enter to the folder
    await item.sendKeys(Key.SPACE);

    const boxText = await t.context.session.findElement(By.css(ex.textboxSelector)).getAttribute('value');
    t.is(
      boxText,
      itemText,
      'Sending space to doc "' + itemText + '" should update the value in the textbox'
    );
  }

});

ariaTest('key down arrow moves focus', exampleFile, 'key-down-arrow', async (t) => {
  t.plan(51);

  // Check that the down arrow does not open folders
  const topLevelFolders = await t.context.session.findElements(By.css(ex.topLevelFolderSelector));

  for (let i = 0; i < topLevelFolders.length; i++) {
    await topLevelFolders[i].sendKeys(Key.ARROW_DOWN);

    // If we are on the last top level folder, the focus will not move
    const nextIndex = i === topLevelFolders.length - 1 ?
      i :
      i + 1;

    t.true(
      await checkFocus(t, ex.topLevelFolderSelector, nextIndex),
      'Sending key ARROW_DOWN to top level folder at index ' + i + ' will move focus to ' + nextIndex
    );

    t.is(
      await topLevelFolders[i].getAttribute('aria-expanded'),
      'false',
      'Sending key ARROW_DOWN to top level folder at index ' + i + ' should not expand the folder'
    );
  }

  // Reload page
  await t.context.session.get(await t.context.session.getCurrentUrl());

  // Open all folders
  await openAllFolders(t);

  const items = await t.context.session.findElements(By.css(ex.treeitemSelector));

  for (let i = 0; i < items.length; i++) {
    await items[i].sendKeys(Key.ARROW_DOWN);

    // If we are on the last item, the focus will not move
    const nextIndex = i === items.length - 1 ?
      i :
      i + 1;

    t.true(
      await checkFocus(t,  ex.treeitemSelector, nextIndex),
      'Sending key ARROW_DOWN to top level folder/item at index ' + i + ' will move focus to ' + nextIndex
    );
  }
});

ariaTest('key up arrow moves focus', exampleFile, 'key-up-arrow', async (t) => {
  t.plan(51);

  // Check that the down arrow does not open folders
  const topLevelFolders = await t.context.session.findElements(By.css(ex.topLevelFolderSelector));

  for (let i = topLevelFolders.length - 1; i >= 0 ; i--) {
    await topLevelFolders[i].sendKeys(Key.ARROW_UP);

    // If we are on the last top level folder, the focus will not move
    const nextIndex = i === 0 ?
      i :
      i - 1;

    t.true(
      await checkFocus(t,  ex.topLevelFolderSelector, nextIndex),
      'Sending key ARROW_UP to top level folder at index ' + i + ' will move focus to ' + nextIndex
    );

    t.is(
      await topLevelFolders[i].getAttribute('aria-expanded'),
      'false',
      'Sending key ARROW_UP to top level folder at index ' + i + ' should not expand the folder'
    );
  }

  // Reload page
  await t.context.session.get(await t.context.session.getCurrentUrl());

  // Open all folders
  await openAllFolders(t);

  const items = await t.context.session.findElements(By.css(ex.treeitemSelector));

  for (let i = items.length - 1; i >= 0 ; i--) {
    await items[i].sendKeys(Key.ARROW_UP);

    // If we are on the last item, the focus will not move
    const nextIndex = i === 0 ?
      i :
      i - 1;

    t.true(
      await checkFocus(t,  ex.treeitemSelector, nextIndex),
      'Sending key ARROW_UP to top level folder/item at index ' + i + ' will move focus to ' + nextIndex
    );
  }
});

ariaTest('key right arrow opens folders and moves focus', exampleFile, 'key-right-arrow', async (t) => {
  t.plan(67);

  const items = await t.context.session.findElements(By.css(ex.treeitemSelector));

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
        'Sending key ARROW_RIGHT to folder at treeitem index ' + i +
          ' when the folder is closed should open the folder'
      );

      t.true(
        await checkFocus(t,  ex.treeitemSelector, i),
        'Sending key ARROW_RIGHT to folder at treeitem index ' + i +
          ' when the folder was closed should not move the focus'
      );
      continue;
    }

    // If the folder is an open folder, the focus will move
    else if (isFolder) {
      t.true(
        await checkFocus(t,  ex.treeitemSelector, i + 1),
        'Sending key ARROW_RIGHT to folder at treeitem index ' + i +
          ' should move focus to item ' + (i + 1)
      );
    }

    // If we are a document, the focus will not move
    else {
      t.true(
        await checkFocus(t,  ex.treeitemSelector, i),
        'Sending key ARROW_RIGHT to document item at treeitem index ' + i + ' should not move focus'
      );

    }
    i++;
  }
});

ariaTest('key left arrow closes folders and moves focus', exampleFile, 'key-left-arrow', async (t) => {
  t.plan(106);

  // Open all folders
  await openAllFolders(t);

  const items = await t.context.session.findElements(By.css(ex.treeitemSelector));

  let i = items.length - 1;
  while (i > 0) {

    const isFolder = await isFolderTreeitem(items[i]);
    const isOpened = await isOpenedFolderTreeitem(items[i]);
    const isTopLevel = isFolder ?
      await isTopLevelFolder(t, items[i]) :
      false;

    await items[i].sendKeys(Key.ARROW_LEFT);

    // If the item is a folder and the folder was opened, arrow will close folder
    if (isFolder && isOpened) {
      t.is(
        await items[i].getAttribute('aria-expanded'),
        'false',
        'Sending key ARROW_LEFT to folder at treeitem index ' + i +
          ' when the folder is opened should close the folder'
      );

      t.true(
        await checkFocus(t,  ex.treeitemSelector, i),
        'Sending key ARROW_LEFT to folder at treeitem index ' + i +
          ' when the folder is opened should not move the focus'
      );
      // Send one more arrow key to the folder that is now closed
      continue;
    }

    // If the item is a top level folder and closed, arrow will do nothing
    else if (isTopLevel) {
      t.true(
        await checkFocus(t,  ex.treeitemSelector, i),
        'Sending key ARROW_LEFT to document in top level folder at treeitem index ' + i +
          ' should not move focu'
      );
    }

    // If the item is a document in folder, or a closed folder, arrow will move up a folder
    else {
      t.true(
        await checkFocusOnParentFolder(t, items[i]),
        'Sending key ARROW_LEFT to document in folder at treeitem index ' + i +
          ' should move focus to parent folder'
      );

      t.is(
        await items[i].isDisplayed(),
        true,
        'Sending key ARROW_LEFT to document in folder at treeitem index ' + i +
          ' should not close the folder it is in'
      );
    }

    i--;
  }
});

ariaTest('key home moves focus', exampleFile, 'key-home', async (t) => {
  t.plan(51);

  // Test that key "home" works when no folder is open
  const topLevelFolders = await t.context.session.findElements(By.css(ex.topLevelFolderSelector));

  for (let i = topLevelFolders.length - 1; i >= 0 ; i--) {
    await topLevelFolders[i].sendKeys(Key.HOME);

    t.true(
      await checkFocus(t,  ex.topLevelFolderSelector, 0),
      'Sending key HOME to top level folder at index ' + i + ' should move focus to first top level folder'
    );

    t.is(
      await topLevelFolders[i].getAttribute('aria-expanded'),
      'false',
      'Sending key HOME to top level folder at index ' + i + ' should not expand the folder'
    );
  }


  // Reload page
  await t.context.session.get(await t.context.session.getCurrentUrl());

  // Open all folders
  await openAllFolders(t);

  const items = await t.context.session.findElements(By.css(ex.treeitemSelector));

  for (let i = items.length - 1; i >= 0 ; i--) {
    await items[i].sendKeys(Key.HOME);

    t.true(
      await checkFocus(t,  ex.treeitemSelector, 0),
      'Sending key HOME to top level folder/item at index ' + i + ' will move focus to the first item'
    );
  }
});

ariaTest('key end moves focus', exampleFile, 'key-end', async (t) => {
  t.plan(51);

  // Test that key "end" works when no folder is open
  const topLevelFolders = await t.context.session.findElements(By.css(ex.topLevelFolderSelector));

  for (let i = topLevelFolders.length - 1; i >= 0 ; i--) {
    await topLevelFolders[i].sendKeys(Key.END);

    t.true(
      await checkFocus(t,  ex.topLevelFolderSelector, topLevelFolders.length - 1),
      'Sending key END to top level folder at index ' + i + ' should move focus to last top level folder'
    );

    t.is(
      await topLevelFolders[i].getAttribute('aria-expanded'),
      'false',
      'Sending key END to top level folder at index ' + i + ' should not expand the folder'
    );
  }


  // Reload page
  await t.context.session.get(await t.context.session.getCurrentUrl());

  // Open all folders
  await openAllFolders(t);

  const items = await t.context.session.findElements(By.css(ex.treeitemSelector));

  for (let i = items.length - 1; i >= 0 ; i--) {
    await items[i].sendKeys(Key.END);

    t.true(
      await checkFocus(t,  ex.treeitemSelector, (items.length - 1)),
      'Sending key END to top level folder/item at index ' + i +
        ' will move focus to the last item in the last opened folder'
    );
  }
});

ariaTest('characters move focus', exampleFile, 'key-character', async (t) => {
  t.plan(15);

  const charIndexTestClosed = [
    { sendChar: 'p', sendIndex: 0, endIndex: 0 },
    { sendChar: 'r', sendIndex: 0, endIndex: 1 },
    { sendChar: 'l', sendIndex: 1, endIndex: 2 }
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
    { sendChar: 'l', sendIndex: 30, endIndex: 31 }
  ];

  const topLevelFolders = await t.context.session.findElements(By.css(ex.topLevelFolderSelector));

  for (let test of charIndexTestClosed) {

    // Send character to treeitem
    await topLevelFolders[test.sendIndex].sendKeys(test.sendChar);

    // Test that the focus switches to the appropriate item
    t.true(
      await checkFocus(t, ex.topLevelFolderSelector, test.endIndex),
      'Sending characther ' + test.sendChar + ' to treeitem ' + test.sendIndex + ' should move the foucs to treeitem ' + test.endIndex
    );

    await assertAttributeValues(t, ex.topLevelFolderSelector, 'aria-expanded', 'false');
  }

  // Reload page
  await t.context.session.get(await t.context.session.getCurrentUrl());

  // Open all folders
  await openAllFolders(t);

  const items = await t.context.session.findElements(By.css(ex.treeitemSelector));

  for (let test of charIndexTestOpened) {

    // Send character to treeitem
    await items[test.sendIndex].sendKeys(test.sendChar);

    // Test that the focus switches to the appropriate treeitem
    t.true(
      await checkFocus(t, ex.treeitemSelector, test.endIndex),
      'Sending characther ' + test.sendChar + ' to treeitem ' + test.sendIndex + ' should move the foucs to treeitem ' + test.endIndex
    );
  }
});

ariaTest('asterisk key opens folders', exampleFile, 'key-asterisk', async (t) => {
  t.plan(10);

  /* Test that "*" ONLY opens all top level nodes and no other folders */

  const topLevelFolders = await t.context.session.findElements(By.css(ex.topLevelFolderSelector));
  const nextLevelFolders = await t.context.session.findElements(By.css(ex.nextLevelFolderSelector));

  // Send Key
  await topLevelFolders[0].sendKeys('*');

  await assertAttributeValues(t, ex.topLevelFolderSelector, 'aria-expanded', 'true');
  await assertAttributeValues(t, ex.nextLevelFolderSelector, 'aria-expanded', 'false');

  /* Test that "*" ONLY opens sibling folders at that level */

  // Send key
  await nextLevelFolders[0].sendKeys('*');

  // The subfolders of first top level folder should all be open

  const subFoldersOfFirstFolder = await topLevelFolders[0]
    .findElements(By.css(ex.nextLevelFolderSelector));
  for (let el of subFoldersOfFirstFolder) {
    t.true(
      await el.getAttribute('aria-expanded') === 'true',
      'Subfolders under the first top level folder should all be opened after sending one "*" to subfolder under first top level folder'
    );
  }

  // The subfolders of second top level folder should all be closed

  const subFoldersOfSecondFolder = await topLevelFolders[1]
    .findElements(By.css(ex.nextLevelFolderSelector));
  for (let el of subFoldersOfSecondFolder) {
    t.true(
      await el.getAttribute('aria-expanded') === 'false',
      'Subfolders under the second top level folder should all be closed after sending one "*" to subfolder under first top level folder'
    );
  }

  // The subfolders of third top level folder should all be closed

  const subFoldersOfThirdFolder = await topLevelFolders[2]
    .findElements(By.css(ex.nextLevelFolderSelector));
  for (let el of subFoldersOfThirdFolder) {
    t.true(
      await el.getAttribute('aria-expanded') === 'false',
      'Subfolders under the third top level folder should all be closed after sending one "*" to subfolder under first top level folder'
    );
  }

});
