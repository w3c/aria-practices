/*
*   This content is licensed according to the W3C Software License at
*   https://www.w3.org/Consortium/Legal/2015/copyright-software-and-document
*
*   File:   PopupMenuAction.js
*
*   Desc:   Popup menu widget that implements ARIA Authoring Practices
*/

/*
*   @constructor PopupMenuAction
*
*   @desc
*       Wrapper object for a simple popup menu (without nested submenus)
*
*   @param domNode
*       The DOM element node that serves as the popup menu container. Each
*       child element of domNode that represents a menuitem must have a
*       'role' attribute with value 'menuitem'.
*
*   @param controllerObj
*       The object that is a wrapper for the DOM element that controls the
*       menu, e.g. a button element, with an 'aria-controls' attribute that
*       references this menu's domNode. See MenuButton.js
*
*       The controller object is expected to have the following properties:
*       1. domNode: The controller object's DOM element node, needed for
*          retrieving positioning information.
*/
var PopupMenuAction = function (domNode, controllerObj, actionManager) {
  var elementChildren,
    msgPrefix = 'PopupMenu constructor argument domNode ';

  // Check whether domNode is a DOM element
  if (!(domNode instanceof Element)) {
    throw new TypeError(msgPrefix + 'is not a DOM Element.');
  }

  // Check whether domNode has child elements
  if (domNode.childElementCount === 0) {
    throw new Error(msgPrefix + 'has no element children.');
  }

  this.domNode = domNode;
  this.controller = controllerObj;
  this.actionManager = actionManager;

  this.menuitems = []; // see PopupMenu init method
  this.firstChars = []; // see PopupMenu init method

  this.firstItem = null; // see PopupMenu init method
  this.lastItem = null; // see PopupMenu init method
};

/*
*   @method PopupMenuAction.prototype.init
*
*   @desc
*       Traverse domNode children to configure each menuitem and populate menuitems
*       array. Initialize firstItem and lastItem properties.
*/
PopupMenuAction.prototype.init = function () {
  var childElement, menuElement, firstChildElement, menuItem, textContent, numItems, label;

  // Configure the domNode itself
  this.domNode.tabIndex = -1;

  this.domNode.setAttribute('role', 'menu');

  if (!this.domNode.getAttribute('aria-labelledby') && !this.domNode.getAttribute('aria-label') && !this.domNode.getAttribute('title')) {
    label = this.controller.domNode.innerHTML;
    this.domNode.setAttribute('aria-label', label);
  }

  // Traverse the element children of domNode: configure each with
  // menuitem role behavior and store reference in menuitems array.
  menuElements = this.domNode.getElementsByTagName('LI');

  for (var i = 0; i < menuElements.length; i++) {

    menuElement = menuElements[i];

    if (!menuElement.firstElementChild && menuElement.getAttribute('role') !== 'separator') {
      menuItem = new MenuItem(menuElement, this);
      menuItem.init();
      this.menuitems.push(menuItem);
      textContent = menuElement.textContent.trim();
      this.firstChars.push(textContent.substring(0, 1).toLowerCase());
    }

  }

  // Use populated menuitems array to initialize firstItem and lastItem.
  numItems = this.menuitems.length;
  if (numItems > 0) {
    this.firstItem = this.menuitems[0];
    this.lastItem = this.menuitems[numItems - 1];
  }
};

PopupMenuAction.prototype.updateMenuStates = function () {

  var item = this.domNode.querySelector('[data-option="font-larger"]');
  if (item) {
    if (this.actionManager.isMaxFontSize()) {
      item.setAttribute('aria-disabled', 'true');
    }
    else {
      item.setAttribute('aria-disabled', 'false');
    }
  }

  item = this.domNode.querySelector('[data-option="font-smaller"]');
  if (item) {
    if (this.actionManager.isMinFontSize()) {
      item.setAttribute('aria-disabled', 'true');
    }
    else {
      item.setAttribute('aria-disabled', 'false');
    }
  }

  // Update the radio buttons for font, in case they were updated using the larger
  // smaller font menu items

  var rbs = this.domNode.querySelectorAll('[data-option="font-size"] [role=menuitemradio]');

  for (var i = 0; i < rbs.length; i++) {
    var rb = rbs[i];

    if (this.actionManager.fontSize === rb.textContent.toLowerCase()) {
      rb.setAttribute('aria-checked', 'true');
    }
    else {
      rb.setAttribute('aria-checked', 'false');
    }
  }

};

/* FOCUS MANAGEMENT METHODS */

PopupMenuAction.prototype.setFocusToController = function (command) {
  if (typeof command !== 'string') {
    command = '';
  }
  if (command === 'previous') {
    this.controller.menubar.setFocusToPreviousItem(this.controller);
  }
  else if (command === 'next') {
    this.controller.menubar.setFocusToNextItem(this.controller);
  }
  else {
    this.controller.domNode.focus();
  }
};

PopupMenuAction.prototype.setFocusToItem = function (item) {
  item.domNode.focus();
};

PopupMenuAction.prototype.setFocusToFirstItem = function () {
  this.firstItem.domNode.focus();
};

PopupMenuAction.prototype.setFocusToLastItem = function () {
  this.lastItem.domNode.focus();
};

PopupMenuAction.prototype.setFocusToPreviousItem = function (currentItem) {
  var index;

  if (currentItem === this.firstItem) {
    this.lastItem.domNode.focus();
  }
  else {
    index = this.menuitems.indexOf(currentItem);
    this.menuitems[index - 1].domNode.focus();
  }
};

PopupMenuAction.prototype.setFocusToNextItem = function (currentItem) {
  var index;

  if (currentItem === this.lastItem) {
    this.firstItem.domNode.focus();
  }
  else {
    index = this.menuitems.indexOf(currentItem);
    this.menuitems[index + 1].domNode.focus();
  }
};

PopupMenuAction.prototype.setFocusByFirstCharacter = function (currentItem, char) {
  var start, index;

  char = char.toLowerCase();

  // Get start index for search based on position of currentItem
  start = this.menuitems.indexOf(currentItem) + 1;
  if (start === this.menuitems.length) {
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
    this.menuitems[index].domNode.focus();
  }
};

PopupMenuAction.prototype.getIndexFirstChars = function (startIndex, char) {
  for (var i = startIndex; i < this.firstChars.length; i++) {
    if (char === this.firstChars[i]) {
      return i;
    }
  }
  return -1;
};

/* MENU DISPLAY METHODS */

PopupMenuAction.prototype.open = function () {
  // get position and bounding rectangle of controller object's DOM node
  var rect = this.controller.domNode.getBoundingClientRect();

  // set CSS properties
  this.domNode.style.position = 'absolute';
  this.domNode.style.top = (rect.height - 1) + 'px';
  this.domNode.style.left = '0px';
  this.domNode.style.zIndex = 100;
  this.domNode.style.display = 'block';

  // set aria-expanded attribute
  this.controller.domNode.setAttribute('aria-expanded', 'true');
};

PopupMenuAction.prototype.isOpen = function () {
  return this.controller.domNode.getAttribute('aria-expanded') === 'true';
};

PopupMenuAction.prototype.close = function () {
  this.domNode.style.display = 'none';
  this.domNode.style.zIndex = 0;
  this.controller.domNode.setAttribute('aria-expanded', 'false');
};
