/*
 *   This content is licensed according to the W3C Software License at
 *   https://www.w3.org/Consortium/Legal/2015/copyright-software-and-document
 *
 *   File:   PopupMenuActionActivedescendant.js
 *
 *   Desc:   Popup menu widget that implements ARIA Authoring Practices
 */

'use strict';

/*
 *   @constructor PopupMenuActionActivedescendant
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
var PopupMenuActionActivedescendant = function (domNode, controllerObj) {
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

  // Check whether domNode child elements are A elements
  var childElement = domNode.firstElementChild;
  while (childElement) {
    var menuitem = childElement.firstElementChild;
    if (menuitem && menuitem === 'A') {
      throw new Error(
        msgPrefix + 'Cannot have descendant elements are A elements.'
      );
    }
    childElement = childElement.nextElementSibling;
  }

  this.currentItem;

  this.domNode = domNode;
  this.controller = controllerObj;

  this.menuitems = []; // see PopupMenu init method
  this.firstChars = []; // see PopupMenu init method

  this.firstItem = null; // see PopupMenu init method
  this.lastItem = null; // see PopupMenu init method

  this.hasFocus = false; // see MenuItem handleFocus, handleBlur
  this.hasHover = false; // see PopupMenu handleMouseover, handleMouseout

  this.keyCode = Object.freeze({
    TAB: 9,
    RETURN: 13,
    ESC: 27,
    SPACE: 32,
    PAGEUP: 33,
    PAGEDOWN: 34,
    END: 35,
    HOME: 36,
    LEFT: 37,
    UP: 38,
    RIGHT: 39,
    DOWN: 40,
  });
};

/*
 *   @method PopupMenuActionActivedescendant.prototype.init
 *
 *   @desc
 *       Add domNode event listeners for mouseover and mouseout. Traverse
 *       domNode children to configure each menuitem and populate menuitems
 *       array. Initialize firstItem and lastItem properties.
 */
PopupMenuActionActivedescendant.prototype.init = function () {
  var childElement,
    menuElement,
    firstChildElement,
    menuItem,
    textContent,
    label;

  // Configure the domNode itself
  this.domNode.tabIndex = 0;

  this.domNode.setAttribute('role', 'menu');

  if (
    !this.domNode.getAttribute('aria-labelledby') &&
    !this.domNode.getAttribute('aria-label') &&
    !this.domNode.getAttribute('title')
  ) {
    label = this.controller.domNode.innerHTML;
    this.domNode.setAttribute('aria-label', label);
  }
  this.domNode.addEventListener('keydown', this.handleKeydown.bind(this));
  this.domNode.addEventListener('mouseover', this.handleMouseover.bind(this));
  this.domNode.addEventListener('mouseout', this.handleMouseout.bind(this));
  this.domNode.addEventListener('blur', this.handleBlur.bind(this));

  // Traverse the element children of domNode: configure each with
  // menuitem role behavior and store reference in menuitems array.
  var menuElements = this.domNode.getElementsByTagName('LI');

  for (var i = 0; i < menuElements.length; i++) {
    menuElement = menuElements[i];
    if (
      !menuElement.firstElementChild &&
      menuElement.getAttribute('role') != 'separator'
    ) {
      menuItem = new MenuItem(menuElement, this);
      menuItem.init();
      this.menuitems.push(menuItem);
      textContent = menuElement.textContent.trim();
      this.firstChars.push(textContent.substring(0, 1).toLowerCase());
    }
  }

  // Use populated menuitems array to initialize firstItem and lastItem.
  if (this.menuitems.length > 0) {
    this.firstItem = this.menuitems[0];
    this.currentItem = this.firstItem;
    this.lastItem = this.menuitems[this.menuitems.length - 1];
  }
};
PopupMenuActionActivedescendant.prototype.handleKeydown = function (event) {
  var flag = false,
    char = event.key,
    clickEvent;

  function isPrintableCharacter(str) {
    return str.length === 1 && str.match(/\S/);
  }

  if (event.ctrlKey || event.altKey || event.metaKey) {
    return;
  }

  if (event.shiftKey) {
    if (isPrintableCharacter(char)) {
      this.setFocusByFirstCharacter(char);
    }
  } else {
    switch (event.keyCode) {
      case this.keyCode.SPACE:
        flag = true;
        break;

      case this.keyCode.RETURN:
        // Create simulated mouse event to mimic the behavior of ATs
        // and let the event handler handleClick do the housekeeping.
        try {
          clickEvent = new MouseEvent('click', {
            view: window,
            bubbles: true,
            cancelable: true,
          });
        } catch (err) {
          if (document.createEvent) {
            // DOM Level 3 for IE 9+
            clickEvent = document.createEvent('MouseEvents');
            clickEvent.initEvent('click', true, true);
          }
        }
        this.currentItem.domNode.dispatchEvent(clickEvent);
        flag = true;
        break;

      case this.keyCode.ESC:
        this.close(true);
        this.setFocusToController();
        flag = true;
        break;

      case this.keyCode.UP:
        this.setFocusToPreviousItem();
        flag = true;
        break;

      case this.keyCode.DOWN:
        this.setFocusToNextItem();
        flag = true;
        break;

      case this.keyCode.HOME:
      case this.keyCode.PAGEUP:
        this.setFocusToFirstItem();
        flag = true;
        break;

      case this.keyCode.END:
      case this.keyCode.PAGEDOWN:
        this.setFocusToLastItem();
        flag = true;
        break;

      case this.keyCode.TAB:
        this.setFocusToController();
        this.hasFocus = false;
        this.close(true);
        break;

      default:
        if (isPrintableCharacter(char)) {
          this.setFocusByFirstCharacter(char);
        }
        break;
    }
  }

  if (flag) {
    event.stopPropagation();
    event.preventDefault();
  }
};

/* EVENT HANDLERS */
PopupMenuActionActivedescendant.prototype.handleBlur = function (event) {
  this.close();
};

PopupMenuActionActivedescendant.prototype.handleMouseover = function (event) {
  this.hasHover = true;
};

PopupMenuActionActivedescendant.prototype.handleMouseout = function (event) {
  this.hasHover = false;
  setTimeout(this.close.bind(this, false), 300);
};

/* FOCUS MANAGEMENT METHODS */
PopupMenuActionActivedescendant.prototype.setFocus = function (item) {
  for (var i = 0; i < this.menuitems.length; i++) {
    var mi = this.menuitems[i];
    mi.domNode.classList.remove('focus');
  }
  item.domNode.classList.add('focus');
  this.domNode.setAttribute('aria-activedescendant', item.domNode.id);
  this.currentItem = item;
};

PopupMenuActionActivedescendant.prototype.setFocusToFirstItem = function () {
  this.setFocus(this.firstItem);
};

PopupMenuActionActivedescendant.prototype.setFocusToLastItem = function () {
  this.setFocus(this.lastItem);
};

PopupMenuActionActivedescendant.prototype.setFocusToPreviousItem = function () {
  var index;

  if (this.currentItem === this.firstItem) {
    this.setFocusToLastItem();
  } else {
    index = this.menuitems.indexOf(this.currentItem);
    this.setFocus(this.menuitems[index - 1]);
  }
};

PopupMenuActionActivedescendant.prototype.setFocusToNextItem = function () {
  var index;

  if (this.currentItem === this.lastItem) {
    this.setFocusToFirstItem();
  } else {
    index = this.menuitems.indexOf(this.currentItem);
    this.setFocus(this.menuitems[index + 1]);
  }
};

PopupMenuActionActivedescendant.prototype.setFocusByFirstCharacter = function (
  char
) {
  var start, index;

  char = char.toLowerCase();

  // Get start index for search based on position of currentItem
  start = this.menuitems.indexOf(this.currentItem) + 1;
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
    this.setFocus(this.menuitems[index]);
  }
};

PopupMenuActionActivedescendant.prototype.getIndexFirstChars = function (
  startIndex,
  char
) {
  for (var i = startIndex; i < this.firstChars.length; i++) {
    if (char === this.firstChars[i]) {
      return i;
    }
  }
  return -1;
};

PopupMenuActionActivedescendant.prototype.getCurrentItem = function () {
  var id = this.domNode.getAttribute('aria-activedescendant');
  if (!id) {
    this.domNode.setAttribute(
      'aria-activedescendant',
      this.firstItem.domNode.id
    );
    return this.firstItem;
  }
  for (var i = 0; i < this.menuitems.length; i++) {
    var mi = this.menuitems[i];
    if (mi.domNode.id == id) {
      return mi;
    }
  }
  this.domNode.setAttribute('aria-activedescendant', this.firstItem.domNode.id);
  return this.firstItem;
};

/* MENU DISPLAY METHODS */

PopupMenuActionActivedescendant.prototype.open = function () {
  // get bounding rectangle of controller object's DOM node
  var rect = this.controller.domNode.getBoundingClientRect();

  // set CSS properties
  this.domNode.style.display = 'block';
  this.domNode.style.position = 'absolute';
  this.domNode.style.top = rect.height + 'px';
  this.domNode.style.left = '0px';

  this.hasFocus = true;
  this.domNode.focus();

  // set aria-expanded attribute
  this.controller.domNode.setAttribute('aria-expanded', 'true');
};

PopupMenuActionActivedescendant.prototype.close = function (force) {
  if (typeof force !== 'boolean') {
    force = false;
  }

  if (force || (this.hasFocus && !this.hasHover && !this.controller.hasHover)) {
    this.domNode.style.display = 'none';
    this.controller.domNode.removeAttribute('aria-expanded');
  }
};

PopupMenuActionActivedescendant.prototype.setFocusToController = function () {
  this.controller.domNode.focus();
};
