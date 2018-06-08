/*
*   This content is licensed according to the W3C Software License at
*   https://www.w3.org/Consortium/Legal/2015/copyright-software-and-document
*
*   File:   tree-3b.js
*
*   Desc:   Tree widget that implements ARIA Authoring Practices
*           for a tree being used as a file selector
*/

/**
 * ARIA Treeview example
 * @function onload
 * @desc  after page has loaded initialize all treeitems based on the role=treeitem
 */

window.addEventListener('load', function () {

  var trees = document.querySelectorAll('[role="tree"]');

  for (var i = 0; i < trees.length; i++) {
    var t = new Tree(trees[i]);
    t.init();
  }

});

/*
*   @constructor
*
*   @desc
*       Tree item object for representing the state and user interactions for a
*       tree widget
*
*   @param node
*       An element with the role=tree attribute
*/

var Tree = function (node) {
  // Check whether node is a DOM element
  if (typeof node !== 'object') {
    return;
  }

  this.domNode = node;

  this.treeitems = [];
  this.firstChars = [];
  this.firstTreeitem = null;
  this.lastTreeitem = null;
};

Tree.prototype.init = function () {

  function findTreeitems (node, tree, group) {

    var elem = node.firstElementChild;
    var ti = group;

    while (elem) {

      if (elem.tagName.toLowerCase() === 'li') {
        ti = new TreeitemMultiSelect(elem, tree, group);
        ti.init();
        tree.treeitems.push(ti);
        tree.firstChars.push(ti.label.substring(0, 1).toLowerCase());
      }

      if (elem.firstElementChild) {
        findTreeitems(elem, tree, ti);
      }

      elem = elem.nextElementSibling;
    }
  }
  // initialize pop up menus
  if (!this.domNode.getAttribute('role')) {
    this.domNode.setAttribute('role', 'tree');
  }

  findTreeitems(this.domNode, this, false);

  this.updateVisibleTreeitems();

  this.firstTreeitem.domNode.tabIndex = 0;

  this.updateSelectedFilesInformation();
};

Tree.prototype.setFocusToItem = function (treeitem) {

  for (var i = 0; i < this.treeitems.length; i++) {
    var ti = this.treeitems[i];

    if (ti === treeitem) {
      ti.domNode.tabIndex = 0;
      ti.domNode.focus();
    }
    else {
      ti.domNode.tabIndex = -1;
    }
  }

};

Tree.prototype.updateSelectedFilesInformation = function () {
  var count = 0;
  var nodeFileInfo  = document.getElementById('id_selected_file_information');
  var nodeFileCount = document.getElementById('id_selected_file_count');

  nodeFileInfo.innerHTML = '';

  // update number of files selected
  for (var i = 0; i < this.treeitems.length; i++) {
    var ti = this.treeitems[i];
    if (ti.domNode.getAttribute('aria-selected') === 'true') {
      nodeFileInfo.innerHTML = nodeFileInfo.innerHTML + ti.label + '\n';
      count++;
    }
  }

  if (count == 0) {
    nodeFileCount.innerHTML = 'No Files Selected:';
  }
  else if (count == 1) {
    nodeFileCount.innerHTML = '1 File Selected:';
  }
  else {
    nodeFileCount.innerHTML = count + ' Files Selected:';
  }

};

Tree.prototype.setSelectToItem = function (treeitem) {

  for (var i = 0;i < this.treeitems.length;i++) {
    var ti = this.treeitems[i];
    if (ti === treeitem) {
      ti.domNode.tabIndex = 0;
      ti.domNode.focus();
      console.log(ti.domNode.className);
      if (ti.domNode.classList.contains('doc') && !ti.domNode.hasAttribute('aria-selected')) {
        console.log('selected');
        ti.domNode.setAttribute('aria-selected', true);
      }
      else if (ti.domNode.getAttribute('aria-selected') === 'true') {
        console.log('not selected');
        ti.domNode.removeAttribute('aria-selected');
      }
    }
    else {
      ti.domNode.tabIndex = -1;
    }
  }

  this.updateSelectedFilesInformation();

};

Tree.prototype.setSelectToNextItem = function (currentItem) {
  var nextItem = false;
  for (var i = (this.treeitems.length - 1); i >= 0;i--) {
    var ti = this.treeitems[i];
    if (ti === currentItem) {
      break;
    }
    if (ti.isVisible) {
      nextItem = ti;
    }
  }

  if (nextItem) {
    this.setSelectToItem(currentItem);
    this.setSelectToItem(nextItem);
  }

};

Tree.prototype.setSelectToPreviousItem = function (currentItem) {

  var prevItem = false;

  for (var i = 0; i < this.treeitems.length; i++) {
    var ti = this.treeitems[i];
    if (ti === currentItem) {
      break;
    }
    if (ti.isVisible) {
      prevItem = ti;
    }
  }

  if (prevItem) {
    this.setSelectToItem(currentItem);
    this.setSelectToItem(prevItem);
  }
};

Tree.prototype.selectContiguousKeys = function (currentItem) {
  var selectNode = false;
  var curPos;
  var selectPos;
  for (var i = 0; i < this.treeitems.length;i++) {
    var ti = this.treeitems[i];
    if (ti === currentItem) {
      curPos = i;
    }
  }
  for (var j = this.treeitems.length - 1;j > 0;j--) {
    var ti = this.treeitems[j];
    if (ti.domNode.getAttribute('aria-selected') === 'true' && ti.isVisible) {
      selectPos = j;
      break;
    }
  }
  console.log(selectPos);
  console.log(curPos);
  this.setSelectToItem(currentItem);
  if (selectPos > curPos) {
    for (var i = curPos;i < selectPos;i++) {
      this.setSelectToItem(this.treeitems[i]);
    }
  }
  else if (selectPos < curPos) {
    for (var i = curPos;i > selectPos;i--) {
      this.setSelectToItem(this.treeitems[i]);
    }
  }
};


Tree.prototype.selectAllTrue = function () {
  for (var i = 0;i < this.treeitems.length;i++) {
    var ti = this.treeitems[i];
    if (ti.domNode.classList.contains('doc')) {
      ti.domNode.setAttribute('aria-selected',true);
    }
  }
  this.updateSelectedFilesInformation();
};

Tree.prototype.selectAllFalse = function (treeitem) {
  for (var i = 0;i < this.treeitems.length;i++) {
    var ti = this.treeitems[i];
    ti.domNode.tabIndex = 0;
    ti.domNode.focus();
    if (ti.domNode.hasAttribute('aria-selected')) {
      ti.domNode.removeAttribute('aria-selected');
    }
  }
  this.updateSelectedFilesInformation();
};
Tree.prototype.selectAllTreeitem = function (currentItem) {

  var selectedFiles = [];
  var docList = [];
  var flag;
  for (var i = 0;i < this.treeitems.length;i++) {
    if (this.treeitems[i].domNode.hasAttribute('aria-selected')) {
      selectedFiles.push(this.treeitems[i].domNode.getAttribute('aria-selected'));
    }
    if (this.treeitems[i].domNode.classList.contains('doc')) {
      docList.push(this.treeitems[i]);
    }
  }
  if (selectedFiles.length !== docList.length) {
    this.selectAllTrue(currentItem);
  }
  else {
    this.selectAllFalse(currentItem);
  }
  currentItem.domNode.focus();
};
Tree.prototype.selectToFirst = function (currentItem) {
  var curPos;
  this.expandAllTreeitem(currentItem);
  for (var i = 0;i < this.treeitems.length;i++) {
    var ti = this.treeitems[i];
    if (ti === currentItem) {
      curPos = i;
    }
  }
  console.log(curPos);
  for (var j = curPos;j > 0;j--) {
    if (this.treeitems[j].domNode.className === 'doc') {
      this.setSelectToItem(this.treeitems[j]);
    }
  }
};
Tree.prototype.selectToLast = function (currentItem) {
  var curPos;
  this.expandAllTreeitem(currentItem);
  for (var i = 0;i < this.treeitems.length;i++) {
    var ti = this.treeitems[i];
    if (ti === currentItem) {
      curPos = i;
    }
  }
  for (var j = curPos;j < this.treeitems.length;j++) {
    if (this.treeitems[j].domNode.className === 'doc') {
      this.setSelectToItem(this.treeitems[j]);
    }
  }
};
// JZ
Tree.prototype.expandAllTreeitem = function (currentItem) {
  for (var i = 0;i < this.treeitems.length;i++) {
    var ti = this.treeitems[i];
    if (ti.isExpandable) {
      this.expandTreeitem(ti);
    }
  }
};

// ------------------------------------------------------********-------------------------------------------------
Tree.prototype.setFocusToNextItem = function (currentItem) {

  var nextItem = false;

  for (var i = (this.treeitems.length - 1); i >= 0; i--) {
    var ti = this.treeitems[i];
    if (ti === currentItem) {
      break;
    }
    if (ti.isVisible) {
      nextItem = ti;
    }
  }

  if (nextItem) {
    this.setFocusToItem(nextItem);
  }

};

Tree.prototype.setFocusToPreviousItem = function (currentItem) {

  var prevItem = false;

  for (var i = 0; i < this.treeitems.length; i++) {
    var ti = this.treeitems[i];
    if (ti === currentItem) {
      break;
    }
    if (ti.isVisible) {
      prevItem = ti;
    }
  }

  if (prevItem) {
    this.setFocusToItem(prevItem);
  }
};

Tree.prototype.setFocusToParentItem = function (currentItem) {

  if (currentItem.groupTreeitem) {
    this.setFocusToItem(currentItem.groupTreeitem);
  }
};

Tree.prototype.setFocusToFirstItem = function () {
  this.setFocusToItem(this.firstTreeitem);
};

Tree.prototype.setFocusToLastItem = function () {
  this.setFocusToItem(this.lastTreeitem);
};

Tree.prototype.expandTreeitem = function (currentItem) {

  if (currentItem.isExpandable) {
    currentItem.domNode.setAttribute('aria-expanded', true);
    this.updateVisibleTreeitems();
  }
};

Tree.prototype.expandAllSiblingItems = function (currentItem) {
  for (var i = 0; i < this.treeitems.length; i++) {
    var ti = this.treeitems[i];

    if ((ti.groupTreeitem === currentItem.groupTreeitem) && ti.isExpandable) {
      this.expandTreeitem(ti);
    }
  }

};

Tree.prototype.collapseTreeitem = function (currentItem) {

  var groupTreeitem = false;

  if (currentItem.isExpanded()) {
    groupTreeitem = currentItem;
  }
  else {
    groupTreeitem = currentItem.groupTreeitem;
  }

  if (groupTreeitem) {
    groupTreeitem.domNode.setAttribute('aria-expanded', false);
    this.updateVisibleTreeitems();
    this.setFocusToItem(groupTreeitem);
  }

};

Tree.prototype.updateVisibleTreeitems = function () {

  this.firstTreeitem = this.treeitems[0];

  for (var i = 0; i < this.treeitems.length; i++) {
    var ti = this.treeitems[i];

    var parent = ti.domNode.parentNode;

    ti.isVisible = true;

    while (parent && (parent !== this.domNode)) {

      if (parent.getAttribute('aria-expanded') == 'false') {
        ti.isVisible = false;
      }
      parent = parent.parentNode;
    }

    if (ti.isVisible) {
      this.lastTreeitem = ti;
    }
  }

};

Tree.prototype.setFocusByFirstCharacter = function (currentItem, char) {
  var start, index, char = char.toLowerCase();

  // Get start index for search based on position of currentItem
  start = this.treeitems.indexOf(currentItem) + 1;
  if (start === this.treeitems.length) {
    start = 0;
  }

  // Check remaining slots in the menu
  index = this.getIndexFirstChars(start, char);

  // If not found in remaining slots, check from beginning
  if (index === -1) {
    index = this.getIndexFirstChars(0, char);
  }

  // If match was found...
  if (index > -1) {
    this.setFocusToItem(this.treeitems[index]);
  }
};

Tree.prototype.getIndexFirstChars = function (startIndex, char) {
  for (var i = startIndex; i < this.firstChars.length; i++) {
    if (this.treeitems[i].isVisible) {
      if (char === this.firstChars[i]) {
        return i;
      }
    }
  }
  return -1;
};
