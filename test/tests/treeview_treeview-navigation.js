'use strict';

const { ariaTest } = require('..');
const { Key } = require('selenium-webdriver');
const assertAttributeValues = require('../util/assertAttributeValues');
const assertAriaLabelExists = require('../util/assertAriaLabelExists');
const assertRovingTabindex = require('../util/assertRovingTabindex');
const assertAriaOwns = require('../util/assertAriaOwns');

const exampleFile = 'treeview/treeview-navigation.html';

const ex = {
  treeSelector: '#ex1 [role="tree"]',
  treeitemSelector: '#ex1 [role="treeitem"]',
  groupSelector: '#ex1 [role="group"]',
  expandableSelector: '#ex1 [role="treeitem"][aria-expanded]',
  topLevelFolderSelector: '#ex1 [role="tree"] > li > [role="treeitem"]',
  nextLevelFolderSelector: '[role="group"] > li > [role="treeitem"][aria-expanded]',
  linkSelector: '#ex1 a[role="treeitem"]'
};

const openAllFolders = async function (t) {
  const closedFoldersSelector = ex.treeitemSelector + '[aria-expanded="false"] span.minus';
  let closedFolders = await t.context.queryElements(t, closedFoldersSelector);

  // Going through all closed expandable tree elements in dom order will open parent
  // folders first, therefore all child folders will be visible before clicked
  for (let folder of closedFolders) {
    await folder.click();
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

const getOwnedElement = async function (t, el) {
  return t.context.session.executeScript(function () {
    const el = arguments[0];
    return document.getElementById(el.getAttribute('aria-owns'));
  }, el);
};


const isFolderTreeitem = async function (el) {
  return (await el.getTagName()) === 'li';
};

const isOpenedFolderTreeitem =  async function (el) {
  return await el.getAttribute('aria-expanded') === 'true';
};

const isClosedFolderTreeitem =  async function (el) {
  return await el.getAttribute('aria-expanded') === 'false';
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

ariaTest('aria-label on role="tree" element', exampleFile, 'tree-aria-label', async (t) => {
  await assertAriaLabelExists(t, ex.treeSelector);
});

ariaTest('role="treeitem" on "a" element', exampleFile, 'treeitem-role', async (t) => {


  // Get all the list items in the tree structure
  const listitems = await t.context.queryElements(t, '#ex1 [role="tree"] a');

  // Check the role "treeitem" is on each a element
  for (let item of listitems) {

    const hasAriaExpanded = await hasAriaExpandedAttribute(t, item);

    t.is(
      await item.getAttribute('role'),
      'treeitem',
      'role="treeitem" should be found on a "a" items that have attribute "aria-expanded"'
    );
  }
});

ariaTest('aria-owns on expandable treeitems', exampleFile, 'treeitem-aria-owns', async (t) => {
    await assertAriaOwns(t, ex.expandableSelector);
});

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

ariaTest('treeitem tabindex set by roving tabindex', exampleFile, 'treeitem-tabindex', async (t) => {
  await openAllFolders(t);
  await assertRovingTabindex(t, ex.treeitemSelector, Key.ARROW_DOWN);
});

ariaTest('role="group" on "ul" elements', exampleFile, 'group-role', async (t) => {
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
});


ariaTest('aria-expanded attribute on treeitem matches dom', exampleFile, 'treeitem-aria-expanded', async (t) => {
  const expandableTreeitems = await t.context.queryElements(t, ex.expandableSelector);

  for (let treeitem of expandableTreeitems) {

    // If the folder is displayed
    if (await treeitem.isDisplayed()) {

      const treeitemText = await treeitem.getText();

      // By default, all expandable treeitems  will be closed
      t.is(
        await treeitem.getAttribute('aria-expanded'),
        'false'
      );
      t.is(
        await (await getOwnedElement(t, treeitem)).isDisplayed(),
        false
      );

      // Send enter to the folder
      await treeitem.sendKeys(Key.ARROW_RIGHT);

      // After click, it should be open
      t.is(
        await treeitem.getAttribute('aria-expanded'),
        'true'
      );
      t.is(
        await (await getOwnedElement(t, treeitem)).isDisplayed(),
        true
      );
    }
  }

  for (let i = (expandableTreeitems.length - 1); i >= 0; i--) {

    // If the folder is displayed
    if (await expandableTreeitems[i].isDisplayed()) {

      const treeitemText = await expandableTreeitems[i].getText();

      // Send enter to the expandale treeitem
      await expandableTreeitems[i].sendKeys(Key.ARROW_LEFT);

      // After sending enter, it should be closed
      t.is(
        await expandableTreeitems[i].getAttribute('aria-expanded'),
        'false',
        treeitemText
      );
      t.is(
        await (await getOwnedElement(t, expandableTreeitems[i])).isDisplayed(),
        false,
        treeitemText
      );
    }
  }
});

