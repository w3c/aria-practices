/*
*   This content is licensed according to the W3C Software License at
*   https://www.w3.org/Consortium/Legal/2015/copyright-software-and-document
*
*   File:   combobox-1.0.js
*
*   Desc:   Combobox widget that implements ARIA Authoring Practices for
*           ARIA 1.0 definition of combobox
*
*   Author: Jon Gunderson and Nicholas Hoyt
*/

/*
*   @constructor Combobox10
*
*   @desc
*       Wrapper object for a listbox
*
*   @param domNode
*       The DOM element node that serves as the listbox container. Each
*       child element of domNode that represents a option must have a
*       'role' attribute with value 'option'.
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
var Combobox10 = function (domNode) {

  this.domNode   = domNode;
  this.listbox = false;

  this.hasFocus = false;
  this.hasHover = false;

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

Combobox10.prototype.init = function () {

  this.domNode.setAttribute('aria-haspopup', 'true');

  this.domNode.addEventListener('keydown', this.handleKeydown.bind(this));
  this.domNode.addEventListener('click', this.handleClick.bind(this));
  this.domNode.addEventListener('focus', this.handleFocus.bind(this));
  this.domNode.addEventListener('blur', this.handleBlur.bind(this));
  this.domNode.addEventListener('mouseover', this.handleMouseover.bind(this));
  this.domNode.addEventListener('mouseout', this.handleMouseout.bind(this));

  // initialize pop up menus

  var listbox = document.getElementById(this.domNode.getAttribute('aria-owns'));

  if (listbox) {
    this.listbox = new Listbox(listbox, this);
    this.listbox.init();
  }

};

Combobox10.prototype.handleKeydown = function (event) {
  var tgt = event.currentTarget,
    flag = false,
    clickEvent;

  console.log('[Combobox10][handleKeydown]: ' + event.keyCode);

  switch (event.keyCode) {
    case this.keyCode.SPACE:
    case this.keyCode.RETURN:
    case this.keyCode.DOWN:
      if (this.listbox) {
        this.listbox.open();
        this.listbox.setFocusToFirstItem();
      }
      flag = true;
      break;

    case this.keyCode.UP:
      if (this.listbox) {
        this.listbox.open();
        this.listbox.setFocusToLastItem();
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

Combobox10.prototype.handleClick = function (event) {
  if (this.domNode.getAttribute('aria-expanded') == 'true') {
    this.listbox.close(true);
  }
  else {
    this.listbox.open();
    this.listbox.setFocusToFirstItem();
  }
};

Combobox10.prototype.handleFocus = function (event) {
  this.listbox.hasFocus = true;
};

Combobox10.prototype.handleBlur = function (event) {
  this.listbox.hasFocus = false;
  setTimeout(this.listbox.close.bind(this.listbox, false), 300);

};

Combobox10.prototype.handleMouseover = function (event) {
  this.hasHover = true;
  this.listbox.open();
};

Combobox10.prototype.handleMouseout = function (event) {
  this.hasHover = false;
  setTimeout(this.listbox.close.bind(this.listbox, false), 300);
};

// Initialize comboboxes

window.addEventListener('load', function () {

  var comboboxes = document.querySelectorAll('[role="combobox"]');

  for (var i = 0; i < comboboxes.length; i++) {
    var combobox = new Combobox10(comboboxes[i]);
    combobox.init();
  }

});
