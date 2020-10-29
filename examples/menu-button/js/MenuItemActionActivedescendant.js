/*
 *   This content is licensed according to the W3C Software License at
 *   https://www.w3.org/Consortium/Legal/2015/copyright-software-and-document
 *
 *   File:   MenuItem.js
 *
 *   Desc:   Popup Menu Menuitem widget that implements ARIA Authoring Practices
 */

'use strict';

/*
 *   @constructor MenuItem
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
 *       contains the menu item DOM element. See PopupMenuAction.js
 */
var MenuItem = function (domNode, menuObj) {
  this.domNode = domNode;
  this.menu = menuObj;
};

MenuItem.prototype.init = function () {
  this.domNode.tabIndex = -1;

  if (!this.domNode.getAttribute('role')) {
    this.domNode.setAttribute('role', 'menuitem');
  }

  this.domNode.addEventListener('click', this.handleClick.bind(this));
  this.domNode.addEventListener('mouseover', this.handleMouseover.bind(this));
  this.domNode.addEventListener('mouseout', this.handleMouseout.bind(this));
};

/* EVENT HANDLERS */

MenuItem.prototype.handleClick = function (event) {
  this.menu.setFocusToController();
  this.menu.close(true);
};

MenuItem.prototype.handleMouseover = function (event) {
  this.menu.hasHover = true;
  this.menu.open();
};

MenuItem.prototype.handleMouseout = function (event) {
  this.menu.hasHover = false;
  setTimeout(this.menu.close.bind(this.menu, false), 300);
};
