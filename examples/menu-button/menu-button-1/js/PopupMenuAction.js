/*
*   This content is licensed according to the W3C Software License at
*   https://www.w3.org/Consortium/Legal/2015/copyright-software-and-document
*
*   File:   PopupMenuAction.js
*
*   Desc:   Popup menu widget that implements ARIA Authoring Practices
*
*   Author: Jon Gunderson, Ku Ja Eun, Nicholas Hoyt and Brian Loh
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
*       2. hasHover: boolean that indicates whether the controller object's
*          domNode has responded to a mouseover event with no subsequent
*          mouseout event having occurred.
*/
var PopupMenuAction = function (domNode, controllerObj) {
  var elementChildren,
      msgPrefix = 'PopupMenu constructor argument domNode ';

  // Check whether domNode is a DOM element
  if (!domNode instanceof Element) {
    throw new TypeError(msgPrefix + 'is not a DOM Element.');
  }

  // Check whether domNode has child elements
  if (domNode.childElementCount === 0) {
    throw new Error(msgPrefix + 'has no element children.');
  }

  // Check whether domNode child elements are A elements
  var childElement = domNode.firstElementChild;
  while (childElement) {
    var menuitem = childElement.firstElementChild;
    if (menuitem && menuitem === 'A') {
      throw new Error(msgPrefix + 'Cannot have descendant elements are A elements.');
    }
    childElement = childElement.nextElementSibling;
  }

  this.domNode = domNode;
  this.controller = controllerObj;

  this.menuitems  = [];      // see PopupMenu init method
  this.firstChars = [];      // see PopupMenu init method

  this.firstItem  = null;    // see PopupMenu init method
  this.lastItem   = null;    // see PopupMenu init method

  this.hasFocus   = false;   // see MenuItem handleFocus, handleBlur
  this.hasHover   = false;   // see PopupMenu handleMouseover, handleMouseout
};

/*
*   @method PopupMenuAction.prototype.init
*
*   @desc
*       Add domNode event listeners for mouseover and mouseout. Traverse
*       domNode children to configure each menuitem and populate menuitems
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

  this.domNode.addEventListener('mouseover', this.handleMouseover.bind(this));
  this.domNode.addEventListener('mouseout',  this.handleMouseout.bind(this));

  // Traverse the element children of domNode: configure each with
  // menuitem role behavior and store reference in menuitems array.
  menuElements = this.domNode.getElementsByTagName('LI');

  for (var i = 0; i < menuElements.length; i++) {

    menuElement = menuElements[i];

    if (!menuElement.firstElementChild && menuElement.getAttribute('role') != 'separator') {
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
    this.lastItem  = this.menuitems[numItems - 1];
  }
};

/* EVENT HANDLERS */

PopupMenuAction.prototype.handleMouseover = function (event) {
  this.hasHover = true;
};

PopupMenuAction.prototype.handleMouseout = function (event) {
  this.hasHover = false;
  setTimeout(this.close.bind(this, false), 300);
};

/* FOCUS MANAGEMENT METHODS */

PopupMenuAction.prototype.setFocusToController = function (command) {
  if (typeof command !== 'string') {
    command = '';
  }

  if (command === 'previous') {
    this.controller.menubutton.setFocusToPreviousItem(this.controller);
  }
  else {
    if (command === 'next') {
      this.controller.menubutton.setFocusToNextItem(this.controller);
    }
    else {
      this.controller.domNode.focus();
    }
  }
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
  var start, index, char = char.toLowerCase();

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
  // get bounding rectangle of controller object's DOM node
  var rect = this.controller.domNode.getBoundingClientRect();

  // set CSS properties
  this.domNode.style.display = 'block';
  this.domNode.style.position = 'absolute';
  this.domNode.style.top  = rect.height + 'px';
  this.domNode.style.left = '0px';

  // set aria-expanded attribute
  this.controller.domNode.setAttribute('aria-expanded', 'true');
};

PopupMenuAction.prototype.close = function (force) {

  if (typeof force !== 'boolean') {
    force = false;
  }

  if (force || (!this.hasFocus && !this.hasHover && !this.controller.hasHover)) {
    this.domNode.style.display = 'none';
    this.controller.domNode.setAttribute('aria-expanded', 'false');
  }
};
