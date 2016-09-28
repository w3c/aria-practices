/*
*   Copyright 2016 University of Illinois
*
*   Licensed under the Apache License, Version 2.0 (the "License");
*   you may not use this file except in compliance with the License.
*   You may obtain a copy of the License at
*
*       http://www.apache.org/licenses/LICENSE-2.0
*
*   Unless required by applicable law or agreed to in writing, software
*   distributed under the License is distributed on an "AS IS" BASIS,
*   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
*   See the License for the specific language governing permissions and
*   limitations under the License.
*
*   File:   MenubarItemAction.js
*
*   Desc:   Menubar Menuitem widget that implements ARIA Authoring Practices
*
*   Author: Jon Gunderson, Ku Ja Eun and Nicholas Hoyt
*/

/*
*   @constructor MenubarItem
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
*       MenubarItem from within the menu object; its configure method
*       can then be called on each menuitem element.
*
*   @param domNode
*       The DOM element node that serves as the menu item container.
*       The menuObj PopupMenu is responsible for checking that it has
*       requisite metadata, e.g. role="menuitem".
*
*   @param menuObj
*       The PopupMenu object that is a delegate for the menu DOM element
*       that contains the menuitem element.
*/
var MenubarItemAction = function (domNode, menuObj) {

  this.menubar   = menuObj;
  this.domNode   = domNode;
  this.popupMenu = false;

  this.hasFocus = false;
  this.hasHover = false;

  this.keyCode = Object.freeze({
    'TAB'      :  9,
    'RETURN'   : 13,
    'ESC'      : 27,
    'SPACE'    : 32,
    'PAGEUP'   : 33,
    'PAGEDOWN' : 34,
    'END'      : 35,
    'HOME'     : 36,
    'LEFT'     : 37,
    'UP'       : 38,
    'RIGHT'    : 39,
    'DOWN'     : 40
  });
};

MenubarItemAction.prototype.init = function () {
  this.domNode.tabIndex = -1;

  this.domNode.setAttribute('role', 'menuitem');
  this.domNode.setAttribute('aria-haspopup', 'true');
  this.domNode.setAttribute('aria-expanded', 'false');
  this.domNode.tabIndex = -1;


  this.domNode.addEventListener('keydown',    this.handleKeydown.bind(this) );
  this.domNode.addEventListener('keypress',   this.handleKeypress.bind(this) );
  this.domNode.addEventListener('click',      this.handleClick.bind(this) );
  this.domNode.addEventListener('focus',      this.handleFocus.bind(this) );
  this.domNode.addEventListener('blur',       this.handleBlur.bind(this) );
  this.domNode.addEventListener('mouseover',  this.handleMouseover.bind(this) );
  this.domNode.addEventListener('mouseout',   this.handleMouseout.bind(this) );

  // initialize pop up menus

  var nextElement = this.domNode.nextElementSibling;

  if (nextElement && nextElement.tagName === 'UL') {
    this.popupMenu = new PopupMenuAction(nextElement, this);
    this.popupMenu.init();
  }

};


MenubarItemAction.prototype.handleKeydown = function (event) {
  var tgt = event.currentTarget,
      flag = false, clickEvent;

  switch (event.keyCode) {
    case this.keyCode.SPACE:
    case this.keyCode.RETURN:
      if (tgt.getAttribute('aria-expanded') === 'true' && this.popupMenu) {
        this.popupMenu.close();
      }
      else {
        this.popupMenu.open();
      }  
      flag = true;
      break;

    case this.keyCode.LEFT:
      this.menubar.setFocusToPreviousItem(this);
      if (this.popupMenu) this.popupMenu.close();
      flag = true;
      break;

    case this.keyCode.RIGHT:
      this.menubar.setFocusToNextItem(this);
      if (this.popupMenu) this.popupMenu.close();
      flag = true;
      break;

    case this.keyCode.UP:
      if (this.popupMenu) {
        this.popupMenu.open();
        this.popupMenu.setFocusToLastItem();
        flag = true;
      }
      break;

    case this.keyCode.DOWN:
      if (this.popupMenu) {
        this.popupMenu.open();
        this.popupMenu.setFocusToFirstItem();
        flag = true;        
      }
      break;      

    case this.keyCode.HOME:
    case this.keyCode.PAGEUP:
      this.menubar.setFocusToFirstItem();
      if (this.popupMenu) this.popupMenu.close();
      flag = true;
      break;

    case this.keyCode.END:
    case this.keyCode.PAGEDOWN:
      this.menubar.setFocusToLastItem();
      if (this.popupMenu) this.popupMenu.close();
      flag = true;
      break;

    default:
      break;
  }

  if (flag) {
    event.stopPropagation();
    event.preventDefault();
  }
};

MenubarItemAction.prototype.handleKeypress = function (event) {
  var char = String.fromCharCode(event.charCode);

  function isPrintableCharacter (str) {
    return str.length === 1 && str.match(/\S/);
  }

  if (isPrintableCharacter(char)) {
    this.menubar.setFocusByFirstCharacter(this, char);
  }
};

MenubarItemAction.prototype.handleClick = function (event) {
};

MenubarItemAction.prototype.handleFocus = function (event) {
  this.menubar.hasFocus = true;
};

MenubarItemAction.prototype.handleBlur = function (event) {
  this.menubar.hasFocus = false;
};

MenubarItemAction.prototype.handleMouseover = function (event) {
  this.hasHover = true;
  this.popupMenu.open();
};

MenubarItemAction.prototype.handleMouseout = function (event) {
  this.hasHover = false;
  setTimeout(this.popupMenu.close.bind(this.popupMenu, false), 300);
};
