/*
*   This content is licensed according to the W3C Software License at
*   https://www.w3.org/Consortium/Legal/2015/copyright-software-and-document
*
*   File:   MenuItem.js
*
*   Desc:   Popup Menu Menuitem widget that implements ARIA Authoring Practices
*
*   Author: Jon Gunderson, Ku Ja Eun and Nicholas Hoyt
*/

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
*       contains the menu item DOM element. See PopupMenu.js
*/
var MenuItem = function (domNode, menuObj) {

  this.domNode = domNode;
  this.menu = menuObj;

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

MenuItem.prototype.init = function () {
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

MenuItem.prototype.activateMenuitem = function (node) {

  var role  = node.getAttribute('role');
  var value = node.textContent;
  var option = node.getAttribute('rel');
  var item;
  // flag is used to signal whether a menu should close or not
  var flag = true;

  if (typeof option !== 'string') {
    option = node.parentNode.getAttribute('rel');
  }

  if (role === 'menuitem') {
    this.menu.actionManager.setOption(option, value);
  }
  else {
    if (role === 'menuitemcheckbox') {
      if (node.getAttribute('aria-checked') == 'true') {
        this.menu.actionManager.setOption(option, false);
        node.setAttribute('aria-checked', 'false');
      }
      else {
        this.menu.actionManager.setOption(option, true);
        node.setAttribute('aria-checked', 'true');
      }
      flag = false;
    }
    else {
      if (role === 'menuitemradio') {

        this.menu.actionManager.setOption(option, value);

        item = node.parentNode.firstElementChild;
        while (item) {
          if (item.getAttribute('role') === 'menuitemradio') {
            item.setAttribute('aria-checked', 'false');
          }
          item = item.nextElementSibling;
        }
        node.setAttribute('aria-checked', 'true');
        flag = false;
      }
    }
  }

  this.menu.updateMenuStates();

  return flag;

};

/* EVENT HANDLERS */

MenuItem.prototype.handleKeydown = function (event) {
  var tgt  = event.currentTarget,
      char = event.key,
      flag = false,
      clickEvent;

  function isPrintableCharacter (str) {
    return str.length === 1 && str.match(/\S/);
  }

  switch (event.keyCode) {
    case this.keyCode.SPACE:
    case this.keyCode.RETURN:
      if (this.activateMenuitem(tgt)) {
        this.menu.setFocusToController();
        this.menu.close(true);
      }
      flag = true;
      break;

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

    case this.keyCode.LEFT:
      this.menu.setFocusToController('previous');
      this.menu.close(true);
      flag = true;
      break;

    case this.keyCode.RIGHT:
      this.menu.setFocusToController('next');
      this.menu.close(true);
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
        flag = true;
      }
      break;
  }

  if (flag) {
    event.stopPropagation();
    event.preventDefault();
  }
};

MenuItem.prototype.handleClick = function (event) {
  this.activateMenuitem(event.currentTarget);
  this.menu.setFocusToController();
  this.menu.close(true);
};

MenuItem.prototype.handleFocus = function (event) {
  this.menu.hasFocus = true;
};

MenuItem.prototype.handleBlur = function (event) {
  this.menu.hasFocus = false;
  setTimeout(this.menu.close.bind(this.menu, false), 300);
};

MenuItem.prototype.handleMouseover = function (event) {
  this.menu.hasHover = true;
  this.menu.open();

};

MenuItem.prototype.handleMouseout = function (event) {
  this.menu.hasHover = false;
  setTimeout(this.menu.close.bind(this.menu, false), 300);
};
