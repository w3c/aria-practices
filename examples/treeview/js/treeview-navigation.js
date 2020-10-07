/*
*   This content is licensed according to the W3C Software License at
*   https://www.w3.org/Consortium/Legal/2015/copyright-software-and-document
*
*   File: treeview-navigation.js
*   Desc: Tree item object for representing the state and user interactions for a
*       tree widget for navigational links
*/

'use strict';

var TreeViewNavigation = function (node) {
  // Check whether node is a DOM element
  if (typeof node !== 'object') {
    return;
  }

  this.treeNode = node;

  this.treeitems = this.treeNode.querySelectorAll('[role="treeitem"');
  for (var i = 0; i < this.treeitems.length; i++) {
    var ti = this.treeitems[i];
    ti.tabIndex = -1;
    ti.addEventListener('keydown', this.handleKeydown.bind(this));
    ti.addEventListener('click', this.handleClick.bind(this));
    if (i == 0) {
      // first tree item is in tab sequence of page
      ti.tabIndex = 0;
    }
    var groupNode = this.getGroupNode(ti);
    if (groupNode) {
      var span = ti.querySelector('span');
      span.addEventListener('click', this.handleSpanClick.bind(this));
    }
  }
};

TreeViewNavigation.prototype.isVisible = function (treeitem) {
  var flag = true;
//  console.log('[isVisible]: ' + treeitem.textContent);
  if (this.isInSubtree(treeitem)) {
    treeitem = this.getParentTreeitem(treeitem);
    if (!treeitem || treeitem.getAttribute('aria-expanded') === 'false') {
      return false;
    }
  }
  return flag;
};

TreeViewNavigation.prototype.isInSubtree = function (treeitem) {
  return treeitem.parentNode.parentNode.getAttribute('role') === 'group';
};

TreeViewNavigation.prototype.isExpandable = function (treeitem) {
  return treeitem.hasAttribute('aria-expanded');
};

TreeViewNavigation.prototype.isExpanded = function (treeitem) {
  return treeitem.getAttribute('aria-expanded') === 'true';
};

TreeViewNavigation.prototype.getParentTreeitem = function (treeitem) {
  var node = treeitem.parentNode.parentNode.previousElementSibling;
  return node;
};

TreeViewNavigation.prototype.getGroupNode = function (treeitem) {
  var groupNode = false;
  var id = treeitem.getAttribute('aria-owns');
  if (id) {
    groupNode = document.getElementById(id);
  }
  return groupNode;
};

TreeViewNavigation.prototype.getVisibleTreeitems = function () {
  var items = [];
  for (var i = 0; i < this.treeitems.length; i++) {
    var ti = this.treeitems[i];
    if (this.isVisible(ti)) {
      items.push(ti)
    }
  }
  return items;
};

TreeViewNavigation.prototype.collapseTreeitem = function (treeitem) {
  if (treeitem.getAttribute('aria-owns')) {
    var groupNode = document.getElementById(treeitem.getAttribute('aria-owns'));
    if (groupNode) {
      treeitem.setAttribute('aria-expanded', 'false');
    }
  }
};

TreeViewNavigation.prototype.expandTreeitem = function (treeitem) {
  if (treeitem.getAttribute('aria-owns')) {
    var groupNode = document.getElementById(treeitem.getAttribute('aria-owns'));
    if (groupNode) {
      treeitem.setAttribute('aria-expanded', 'true');
    }
  }
};

TreeViewNavigation.prototype.expandAllSiblingTreeitems = function (treeitem) {
};

TreeViewNavigation.prototype.setFocusToTreeitem = function (treeitem) {
  this.treeitems.forEach(item => item.tabIndex = -1);
  treeitem.tabIndex = 0;
  treeitem.focus();
};

TreeViewNavigation.prototype.setFocusToNextTreeitem = function (treeitem) {

  var visibleTreeitems = this.getVisibleTreeitems();
  var nextItem = visibleTreeitems[0];

  for (var i = (visibleTreeitems.length - 1); i >= 0; i--) {
    var ti = visibleTreeitems[i];
    if (ti === treeitem) {
      break;
    }
    nextItem = ti;
  }
  if (nextItem) {
    this.setFocusToTreeitem(nextItem);
  }

};

TreeViewNavigation.prototype.setFocusToPreviousTreeitem = function (treeitem) {

  var visibleTreeitems = this.getVisibleTreeitems();
  var prevItem = visibleTreeitems[visibleTreeitems.length-1];

  for (var i = 0; i < visibleTreeitems.length; i++) {
    var ti = visibleTreeitems[i];
    if (ti === treeitem) {
      break;
    }
    prevItem = ti;
  }

  if (prevItem) {
    this.setFocusToTreeitem(prevItem);
  }
};

TreeViewNavigation.prototype.setFocusToParentTreeitem = function(treeitem) {
  var ti = treeitem.parentNode.previousElementSlibling;
  if (ti) {
    this.setFocusToTreeitem(ti);
  }
};

TreeViewNavigation.prototype.setFocusByFirstCharacter = function (treeitem, char) {
  var start, i, ti, index = -1;
  var visibleTreeitems = this.getVisibleTreeitems();
  char = char.toLowerCase();

  // Get start index for search based on position of treeitem
  start = visibleTreeitems.indexOf(treeitem) + 1;
  if (start >= visibleTreeitems.length) {
    start = 0;
  }

  // Check remaining items in the tree
  for (i = start; i < visibleTreeitems.length; i++) {
    ti = visibleTreeitems[i];
    if (char === ti.textContent.trim()[0].toLowerCase()) {
      index = i;
      break;
    }
  }

  // If not found in remaining slots, check from beginning
  if (index === -1) {
    for (i = 0; i < start; i++) {
      ti = visibleTreeitems[i];
      if (char === ti.textContent.trim()[0].toLowerCase()) {
        index = i;
        break;
      }
    }
  }

  // If match was found...
  if (index > -1) {
    this.setFocusToTreeitem(visibleTreeitems[index]);
  }
};

// Event handlers

TreeViewNavigation.prototype.handleSpanClick = function (event) {
  var tgt = event.currentTarget;

  if (this.isExpanded(tgt.parentNode)) {
    this.collapseTreeitem(tgt.parentNode);
  }
  else {
    this.expandTreeitem(tgt.parentNode);
  }

  event.preventDefault();
  event.stopPropagation();
};

TreeViewNavigation.prototype.handleKeydown = function (event) {
  var tgt = event.currentTarget,
    flag = false,
    key = event.key;

  function isPrintableCharacter (str) {
    return str.length === 1 && str.match(/\S/);
  }

  if (event.altKey || event.ctrlKey || event.metaKey) {
    return;
  }

  if (event.shift) {
    if (event.keyCode == this.keyCode.SPACE || event.keyCode == this.keyCode.RETURN) {
      event.stopPropagation();
    }
    else {
      if (isPrintableCharacter(key)) {
        if (key == '*') {
          this.expandAllSiblingTreeitems(tgt);
          flag = true;
        }
        else {
          this.setFocusByFirstCharacter(tgt, key);
        }
      }
    }
  }
  else {
    switch (key) {
      case ' ':
      case 'Enter':
        break;

      case 'Up':
      case 'ArrowUp':
        this.setFocusToPreviousTreeitem(tgt);
        flag = true;
        break;

      case 'Down':
      case 'ArrowDown':
        this.setFocusToNextTreeitem(tgt);
        flag = true;
        break;

      case 'Right':
      case 'ArrowRight':
        if (this.isExpandable(tgt)) {
          if (this.isExpanded(tgt)) {
            this.setFocusToNextTreeitem(tgt);
          }
          else {
            this.expandTreeitem(tgt);
          }
        }
        flag = true;
        break;

      case 'Left':
      case 'ArrowLeft':
        if (this.isExpandable(tgt) && this.isExpanded(tgt)) {
          this.collapseTreeitem(tgt);
          flag = true;
        }
        else {
          if (this.isInSubtree(tgt)) {
            this.setFocusToParentTreeitem(tgt);
            flag = true;
          }
        }
        break;

      case 'Home':
        this.setFocusToTreeItem(this.treeitems[0]);
        flag = true;
        break;

      case 'End':
        var visibleTreeitems = this.getVisibleTreeitems();
        this.setFocusToTreeitem(visibleTreeitems[visibleTreeitems.length-1]);
        flag = true;
        break;

      default:
        if (isPrintableCharacter(key)) {
          if (key == '*') {
            this.expandAllSiblingTreeitems(tgt);
            flag = true;
          }
          else {
            this.setFocusByFirstCharacter(tgt, key);
          }
        }
        break;
    }
  }

  if (flag) {
    event.stopPropagation();
    event.preventDefault();
  }
};

TreeViewNavigation.prototype.handleClick = function (event) {
  var tgt = event.currentTarget;

  var h1Node = document.querySelector('#ex1 .page h1');

  if (h1Node) {
    h1Node.textContent = tgt.textContent.trim();
  }

  var paraNodes = document.querySelectorAll('#ex1 .page p');
  var content = new NavigationContentGenerator();
  paraNodes.forEach(p => p.textContent = content.generate(100));

};


/**
 * ARIA Treeview example
 * @function onload
 * @desc  after page has loaded initialize all treeitems based on the role=treeitem
 */

window.addEventListener('load', function () {

  var trees = document.querySelectorAll('nav [role="tree"]');

  for (var i = 0; i < trees.length; i++) {
    new TreeViewNavigation(trees[i]);
  }

});
