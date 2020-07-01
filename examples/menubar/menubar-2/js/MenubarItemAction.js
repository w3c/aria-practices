/*
*   This content is licensed according to the W3C Software License at
*   https://www.w3.org/Consortium/Legal/2015/copyright-software-and-document
*
*   File:   MenubarItemAction.js
*
*   Desc:   Menubar Menuitem widget that implements ARIA Authoring Practices
*/

'use strict';

/*
*   @constructor MenubarItemAction
*
*   @desc
*       Object that configures menubar item elements by setting tabIndex
*       and registering itself to handle pertinent events.
*
*   @param domNode
*       The DOM element node that serves as the menubar item container.
*       The menubarObj is responsible for checking that it has
*       requisite metadata, e.g. role="menuitem".
*
*   @param menubarObj
*       The MenubarAction object that is a delegate for the menubar DOM element
*       that contains the menubar item element.
*/
var MenubarItemAction = function (domNode, menubarObj) {

  this.menubar = menubarObj;
  this.domNode = domNode;
  this.popupMenu = false;

  this.keyCode = Object.freeze({
    'TAB': 9,
    'RETURN': 13,
    'ESC': 27,
    'SPACE': 32,
    'PAGEUP': 33,
    'PAGEDOWN': 34,
    'END': 35,
    'HOME': 36,
    'LEFT': 37,
    'UP': 38,
    'RIGHT': 39,
    'DOWN': 40
  });
};

MenubarItemAction.prototype.init = function () {
  this.domNode.tabIndex = -1;

  this.domNode.addEventListener('keydown', this.handleKeydown.bind(this));
  this.domNode.addEventListener('click', this.handleClick.bind(this));
  this.domNode.addEventListener('mouseover', this.handleMouseover.bind(this));

  // initialize pop up menus

  var nextElement = this.domNode.nextElementSibling;

  if (nextElement && nextElement.tagName === 'UL') {
    this.popupMenu = new PopupMenuAction(nextElement, this, this.menubar.actionManager);
    this.popupMenu.init();
  }

};

MenubarItemAction.prototype.handleKeydown = function (event) {
  var tgt = event.currentTarget,
    char = event.key,
    flag = false;

  function isPrintableCharacter (str) {
    return str.length === 1 && str.match(/\S/);
  }

  switch (event.keyCode) {
    case this.keyCode.SPACE:
    case this.keyCode.RETURN:
    case this.keyCode.DOWN:
      if (this.popupMenu) {
        this.popupMenu.open();
        this.popupMenu.setFocusToFirstItem();
        flag = true;
      }
      break;

    case this.keyCode.ESC:
      if (this.popupMenu) {
        this.popupMenu.close();
      }
      flag = true;
      break;

    case this.keyCode.LEFT:
      this.menubar.setFocusToPreviousItem(this);
      flag = true;
      break;

    case this.keyCode.RIGHT:
      this.menubar.setFocusToNextItem(this);
      flag = true;
      break;

    case this.keyCode.UP:
      if (this.popupMenu) {
        this.popupMenu.open();
        this.popupMenu.setFocusToLastItem();
        flag = true;
      }
      break;

    case this.keyCode.HOME:
    case this.keyCode.PAGEUP:
      this.menubar.setFocusToFirstItem();
      if (this.popupMenu) {
        this.popupMenu.close();
      }
      flag = true;
      break;

    case this.keyCode.END:
    case this.keyCode.PAGEDOWN:
      this.menubar.setFocusToLastItem();
      if (this.popupMenu) {
        this.popupMenu.close();
      }
      flag = true;
      break;

    default:
      if (isPrintableCharacter(char)) {
        this.menubar.setFocusByFirstCharacter(this, char);
        flag = true;
      }
      break;
  }

  if (flag) {
    event.stopPropagation();
    event.preventDefault();
  }
};

MenubarItemAction.prototype.handleClick = function (event) {
  if (this.popupMenu) {
    if (!this.popupMenu.isOpen()) {
      // clicking on menubar item opens menu (closes open menu first)
      for (var i = 0; i < this.menubar.menubarItems.length; i++) {
        var mbi = this.menubar.menubarItems[i];
        if (mbi.popupMenu && mbi.popupMenu.isOpen()) {
          mbi.popupMenu.close();
          break;
        }
      }
      this.popupMenu.open();
    }
    else {
      // clicking again on same menubar item closes menu
      this.popupMenu.close();
    }
    // prevent scroll to top of page when anchor element is clicked
    event.preventDefault();
  }
};

MenubarItemAction.prototype.handleMouseover = function (event) {
  this.menubar.setFocusToItem(this, true);
};
