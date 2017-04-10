/*
*   This content is licensed according to the W3C Software License at
*   https://www.w3.org/Consortium/Legal/2015/copyright-software-and-document
*
*   File:   MenubarAction.js
*
*   Desc:   Menubar widget that implements ARIA Authoring Practices
*
*   Author: Jon Gunderson, Ku Ja Eun and Nicholas Hoyt
*/

/*
*   @constructor MenubarAction
*
*   @desc
*       Wrapper object for a menubar (with nested submenus of links)
*
*   @param domNode
*       The DOM element node that serves as the menubar container. Each
*       child element of menubarNode that represents a menubaritem must
*       be an A element
*/
var MenubarAction = function (domNode) {
  var elementChildren,
      msgPrefix = 'Menubar constructor argument menubarNode ';

  // Check whether menubarNode is a DOM element
  if (!domNode instanceof Element) {
    throw new TypeError(msgPrefix + 'is not a DOM Element.');
  }

  // Check whether menubarNode has descendant elements
  if (domNode.childElementCount === 0) {
    throw new Error(msgPrefix + 'has no element children.');
  }
  // Check whether menubarNode has SPAN elements
  e = domNode.firstElementChild;
  while (e) {
    var menubarItem = e.firstElementChild;
    if (e && menubarItem && menubarItem.tagName !== 'SPAN') {
      throw new Error(msgPrefix + 'has child elements are not SPAN elements.');
    }
    e = e.nextElementSibling;
  }

  this.domNode = domNode;

  this.menubarItems = []; // see Menubar init method
  this.firstChars = []; // see Menubar init method

  this.firstItem = null; // see Menubar init method
  this.lastItem = null; // see Menubar init method

  this.hasFocus = false; // see MenubarItem handleFocus, handleBlur
  this.hasHover = false; // see Menubar handleMouseover, handleMouseout
};

/*
*   @method MenubarAction.prototype.init
*
*   @desc
*       Adds ARIA role to the menubar node
*       Traverse menubar children for A elements to configure each A element as a ARIA menuitem
*       and populate menuitems array. Initialize firstItem and lastItem properties.
*/
MenubarAction.prototype.init = function (actionManager) {
  var menubarItem, childElement, menuElement, textContent, numItems;

  this.actionManager = actionManager;

  this.domNode.setAttribute('role', 'menubar');

  // Traverse the element children of menubarNode: configure each with
  // menuitem role behavior and store reference in menuitems array.
  e = this.domNode.firstElementChild;

  while (e) {
    var menuElement = e.firstElementChild;

    if (e && menuElement && menuElement.tagName === 'SPAN') {
      menubarItem = new MenubarItemAction(menuElement, this);
      menubarItem.init();
      this.menubarItems.push(menubarItem);
      textContent = menuElement.textContent.trim();
      this.firstChars.push(textContent.substring(0, 1).toLowerCase());
    }

    e = e.nextElementSibling;
  }

  // Use populated menuitems array to initialize firstItem and lastItem.
  numItems = this.menubarItems.length;
  if (numItems > 0) {
    this.firstItem = this.menubarItems[0];
    this.lastItem = this.menubarItems[numItems - 1];
  }
  this.firstItem.domNode.tabIndex = 0;
};

/* FOCUS MANAGEMENT METHODS */

MenubarAction.prototype.setFocusToItem = function (newItem) {
  var flag = false;
  var newItem;
  for (var i = 0; i < this.menubarItems.length; i++) {
    var mbi = this.menubarItems[i];
    if (mbi.domNode.tabIndex == 0) {
      flag = mbi.domNode.getAttribute('aria-expanded') === 'true';}
    mbi.domNode.tabIndex = -1;
    if (mbi.popupMenu) {
      mbi.popupMenu.close();
    }
  }
  newItem.domNode.focus();
  newItem.domNode.tabIndex = 0;
  if (flag && newItem.popupMenu) {
    newItem.popupMenu.open();
  }
};
MenubarAction.prototype.setFocusToFirstItem = function (flag) {
  this.setFocusToItem(this.firstItem);
};
MenubarAction.prototype.setFocusToLastItem = function (flag) {
  this.setFocusToItem(this.lastItem);
};

MenubarAction.prototype.setFocusToPreviousItem = function (currentItem) {

  var index;

  if (currentItem === this.firstItem) {
    newItem = this.lastItem;
  }
  else {
    index = this.menubarItems.indexOf(currentItem);
    newItem = this.menubarItems[ index - 1 ];
  }

  this.setFocusToItem(newItem);

};

MenubarAction.prototype.setFocusToNextItem = function (currentItem) {
  var index;

  if (currentItem === this.lastItem) {
    newItem = this.firstItem;
  }
  else {
    index = this.menubarItems.indexOf(currentItem);
    newItem = this.menubarItems[ index + 1 ];
  }
  this.setFocusToItem(newItem);

};

MenubarAction.prototype.setFocusByFirstCharacter = function (currentItem, char) {
  var start, index, char = char.toLowerCase();

  // Get start index for search based on position of currentItem
  start = this.menubarItems.indexOf(currentItem) + 1;
  if (start === this.menubarItems.length) {
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
    this.menubarItems[index].domNode.focus();
    this.menubarItems[index].domNode.tabIndex = 0;
    currentItem.tabIndex = -1;
  }
};

MenubarAction.prototype.getIndexFirstChars = function (startIndex, char) {
  for (var i = startIndex; i < this.firstChars.length; i++) {
    if (char === this.firstChars[i]) {
      return i;
    }
  }
  return -1;
};

