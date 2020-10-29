/*
 *   This content is licensed according to the W3C Software License at
 *   https://www.w3.org/Consortium/Legal/2015/copyright-software-and-document
 *
 *   File:   Menubutton.js
 *
 *   Desc:   Menubutton widget that implements ARIA Authoring Practices
 */

'use strict';

/*
 *   @constructor MenuButton
 *
 *   @desc
 *       Object that configures menu item elements by setting tabIndex
 *       and registering itself to handle pertinent events.
 *
 *       While menuitem elements handle many keydown events, as well as
 *       focus and blur events, they do not maintain any state variables,
 *       delegating those responsibilities to its associated menu object.
 *
 *       Consequently, it is only necessary to create one instance of
 *       MenubuttonItem from within the menu object; its configure method
 *       can then be called on each menuitem element.
 *
 *   @param domNode
 *       The DOM element node that serves as the menu item container.
 *       The menuObj PopupMenu is responsible for checking that it has
 *       requisite metadata, e.g. role="menuitem".
 *
 *
 */
var Menubutton = function (domNode) {
  this.domNode = domNode;
  this.popupMenu = false;

  this.hasFocus = false;
  this.hasHover = false;

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

Menubutton.prototype.init = function () {
  this.domNode.setAttribute('aria-haspopup', 'true');

  this.domNode.addEventListener('keydown', this.handleKeydown.bind(this));
  this.domNode.addEventListener('click', this.handleClick.bind(this));
  this.domNode.addEventListener('focus', this.handleFocus.bind(this));
  this.domNode.addEventListener('blur', this.handleBlur.bind(this));
  this.domNode.addEventListener('mouseover', this.handleMouseover.bind(this));
  this.domNode.addEventListener('mouseout', this.handleMouseout.bind(this));

  // initialize pop up menus

  var popupMenu = document.getElementById(
    this.domNode.getAttribute('aria-controls')
  );

  if (popupMenu) {
    if (popupMenu.getAttribute('aria-activedescendant')) {
      this.popupMenu = new PopupMenuActionActivedescendant(popupMenu, this);
      this.popupMenu.init();
    } else {
      this.popupMenu = new PopupMenuAction(popupMenu, this);
      this.popupMenu.init();
    }
  }
};

Menubutton.prototype.handleKeydown = function (event) {
  var flag = false;

  switch (event.keyCode) {
    case this.keyCode.SPACE:
    case this.keyCode.RETURN:
    case this.keyCode.DOWN:
      if (this.popupMenu) {
        this.popupMenu.open();
        this.popupMenu.setFocusToFirstItem();
      }
      flag = true;
      break;

    case this.keyCode.UP:
      if (this.popupMenu) {
        this.popupMenu.open();
        this.popupMenu.setFocusToLastItem();
        flag = true;
      }
      break;

    default:
      break;
  }

  if (flag) {
    event.stopPropagation();
    event.preventDefault();
  }
};

Menubutton.prototype.handleClick = function (event) {
  if (this.domNode.getAttribute('aria-expanded') == 'true') {
    this.popupMenu.close(true);
  } else {
    this.popupMenu.open();
    this.popupMenu.setFocusToFirstItem();
  }
};

Menubutton.prototype.handleFocus = function (event) {
  this.popupMenu.hasFocus = true;
};

Menubutton.prototype.handleBlur = function (event) {
  this.popupMenu.hasFocus = false;
  setTimeout(this.popupMenu.close.bind(this.popupMenu, false), 300);
};

Menubutton.prototype.handleMouseover = function (event) {
  this.hasHover = true;
  this.popupMenu.open();
};

Menubutton.prototype.handleMouseout = function (event) {
  this.hasHover = false;
  setTimeout(this.popupMenu.close.bind(this.popupMenu, false), 300);
};
