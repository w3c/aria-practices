/*
 *   This content is licensed according to the W3C Software License at
 *   https://www.w3.org/Consortium/Legal/2015/copyright-software-and-document
 *
 *   File:   MenuItemLinks.js
 *
 *   Desc:   Popup Menu Menuitem widget that implements ARIA Authoring Practices
 */

'use strict';

/*
 *   @constructor MenuItemLinks
 *
 *   @desc
 *       Wrapper object for a simple menu item in a popup menu
 *
 *   @param domNode
 *       The DOM element node that serves as the menu item container.
 *       The menuObj PopupMenu is responsible for checking that it has
 *       requisite metadata, e.g. role="menuitem".
 *
 *   @param menuObj
 *       The object that is a wrapper for the PopupMenu DOM element that
 *       contains the menu item DOM element. See PopupMenu.js
 */
var MenuItemLinks = function (domNode, menuObj) {
  this.domNode = domNode;
  this.menu = menuObj;

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

MenuItemLinks.prototype.init = function () {
  this.domNode.tabIndex = -1;

  if (!this.domNode.getAttribute('role')) {
    this.domNode.setAttribute('role', 'menuitem');
  }

  this.domNode.addEventListener('keydown', this.handleKeydown.bind(this));
  this.domNode.addEventListener('click', this.handleClick.bind(this));
  this.domNode.addEventListener('focus', this.handleFocus.bind(this));
  this.domNode.addEventListener('blur', this.handleBlur.bind(this));
  this.domNode.addEventListener('mouseover', this.handleMouseover.bind(this));
  this.domNode.addEventListener('mouseout', this.handleMouseout.bind(this));
};

/* EVENT HANDLERS */

MenuItemLinks.prototype.handleKeydown = function (event) {
  var flag = false,
    char = event.key;

  function isPrintableCharacter(str) {
    return str.length === 1 && str.match(/\S/);
  }

  if (
    event.ctrlKey ||
    event.altKey ||
    event.metaKey ||
    event.keyCode === this.keyCode.SPACE ||
    event.keyCode === this.keyCode.RETURN
  ) {
    return;
  }

  if (event.shiftKey) {
    if (isPrintableCharacter(char)) {
      this.menu.setFocusByFirstCharacter(this, char);
      flag = true;
    }

    if (event.keyCode === this.keyCode.TAB) {
      this.menu.setFocusToController();
      this.menu.close(true);
    }
  } else {
    switch (event.keyCode) {
      case this.keyCode.ESC:
        this.menu.setFocusToController();
        this.menu.close(true);
        flag = true;
        break;

      case this.keyCode.UP:
        this.menu.setFocusToPreviousItem(this);
        flag = true;
        break;

      case this.keyCode.DOWN:
        this.menu.setFocusToNextItem(this);
        flag = true;
        break;

      case this.keyCode.HOME:
      case this.keyCode.PAGEUP:
        this.menu.setFocusToFirstItem();
        flag = true;
        break;

      case this.keyCode.END:
      case this.keyCode.PAGEDOWN:
        this.menu.setFocusToLastItem();
        flag = true;
        break;

      case this.keyCode.TAB:
        this.menu.setFocusToController();
        this.menu.close(true);
        break;

      default:
        if (isPrintableCharacter(char)) {
          this.menu.setFocusByFirstCharacter(this, char);
        }
        break;
    }
  }

  if (flag) {
    event.stopPropagation();
    event.preventDefault();
  }
};

MenuItemLinks.prototype.handleClick = function (event) {
  this.menu.setFocusToController();
  this.menu.close(true);
};

MenuItemLinks.prototype.handleFocus = function (event) {
  this.menu.hasFocus = true;
};

MenuItemLinks.prototype.handleBlur = function (event) {
  this.menu.hasFocus = false;
  setTimeout(this.menu.close.bind(this.menu, false), 300);
};

MenuItemLinks.prototype.handleMouseover = function (event) {
  this.menu.hasHover = true;
  this.menu.open();
};

MenuItemLinks.prototype.handleMouseout = function (event) {
  this.menu.hasHover = false;
  setTimeout(this.menu.close.bind(this.menu, false), 300);
};
