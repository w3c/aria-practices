/*
*   This content is licensed according to the W3C Software License at
*   https://www.w3.org/Consortium/Legal/2015/copyright-software-and-document
*
*   File:   Option.js
*
*   Desc:   Popup Menu Menuitem widget that implements ARIA Authoring Practices
*
*   Author: Jon Gunderson, Ku Ja Eun, Nicholas Hoyt and Brian Loh
*/

/*
*   @constructor Option
*
*   @desc
*       Wrapper object for a simple.listbox.item in a popup menu
*
*   @param domNode
*       The DOM element node that serves as the.listbox.item container.
*       The.listbox.bj PopupMenu is responsible for checking that it has
*       requisite metadata, e.g. role=.listbox.tem".
*
*   @param.listbox.bj
*       The object that is a wrapper for the PopupMenu DOM element that
*       contains the.listbox.item DOM element. See PopupMenuAction.js
*/
var Option = function (domNode, listboxObj) {

  this.domNode = domNode;
  this.listbox = listboxObj;
  this.textContent     = domNode.textContent;
  this.textComparision = domNode.textContent.toLowerCase();

  this.keyCode = Object.freeze({
    'BACKSPACE':  8,
    'TAB':        9,
    'RETURN':    13,
    'ESC':       27,
    'SPACE':     32,
    'PAGEUP':    33,
    'PAGEDOWN':  34,
    'END':       35,
    'HOME':      36,
    'LEFT':      37,
    'UP':        38,
    'RIGHT':     39,
    'DOWN':      40,
    'DELETE':    46
  });
};

Option.prototype.init = function () {
  this.domNode.tabIndex = -1;

  if (!this.domNode.getAttribute('role')) {
    this.domNode.setAttribute('role', 'option');
  }

  this.domNode.addEventListener('keydown',    this.handleKeydown.bind(this));
  this.domNode.addEventListener('click',      this.handleClick.bind(this));
  this.domNode.addEventListener('focus',      this.handleFocus.bind(this));
  this.domNode.addEventListener('blur',       this.handleBlur.bind(this));
  this.domNode.addEventListener('mouseover',  this.handleMouseover.bind(this));
  this.domNode.addEventListener('mouseout',   this.handleMouseout.bind(this));

};

/* EVENT HANDLERS */

Option.prototype.handleKeydown = function (event) {
  var tgt = event.currentTarget,
    flag = false,
    char = event.key;

  function isPrintableCharacter (str) {
    return str.length === 1 && str.match(/\S/);
  }

  if (event.ctrlKey || event.altKey  || event.metaKey) {
    return;
  }

  if (event.shiftKey) {
    if (isPrintableCharacter(char)) {
      this.listbox.setFocusByFirstCharacter(this, char);
    }
  }
  else {

    switch (event.keyCode) {
      case this.keyCode.SPACE:
      case this.keyCode.RETURN:
        this.handleClick();
        flag = true;
        break;

      case this.keyCode.BACKSPACE:
      case this.keyCode.DELETE:
      case this.keyCode.ESC:
        this.listbox.restoreValue();
        this.listbox.setFocusToController();
        this.listbox.close(true);
        flag = true;
        break;

      case this.keyCode.UP:
        this.listbox.setFocusToPreviousItem(this);
        flag = true;
        break;

      case this.keyCode.DOWN:
        this.listbox.setFocusToNextItem(this);
        flag = true;
        break;

      case this.keyCode.HOME:
      case this.keyCode.PAGEUP:
        this.listbox.setFocusToFirstItem();
        flag = true;
        break;

      case this.keyCode.END:
      case this.keyCode.PAGEDOWN:
        this.listbox.setFocusToLastItem();
        flag = true;
        break;

      case this.keyCode.TAB:
        this.listbox.restoreValue();
        break;


      default:
        if (isPrintableCharacter(char)) {
          this.listbox.setFocusByFirstCharacter(this, char);
        }
        break;
    }
  }

  if (flag) {
    event.stopPropagation();
    event.preventDefault();
  }
};

Option.prototype.handleClick = function (event) {
  this.listbox.setValue(this.textContent);
  this.listbox.setFocusToController();
  this.listbox.close(true);
};

Option.prototype.handleFocus = function (event) {
  this.listbox.hasFocus = true;
};

Option.prototype.handleBlur = function (event) {
  this.listbox.hasFocus = false;
  setTimeout(this.listbox.close.bind(this.listbox, false), 300);
};

Option.prototype.handleMouseover = function (event) {
  this.listbox.hasHover = true;
  this.listbox.open();

};

Option.prototype.handleMouseout = function (event) {
  this.listbox.hasHover = false;
  setTimeout(this.listbox.close.bind(this.listbox, false), 300);
};
