/*
*   This content is licensed according to the W3C Software License at
*   https://www.w3.org/Consortium/Legal/2015/copyright-software-and-document
*
*   File:   combobox-1.0.js
*
*   Desc:   Combobox widget that implements ARIA Authoring Practices for
*           ARIA 1.0 definition of combobox using a Listbox
*/

/*
*   @constructor ComboboxListbox
*
*   @desc
*       Wrapper object for a combobox with a listbox option
*
*   @param domNode
*       The DOM element node that serves as the listbox container. Each
*       child element of domNode that represents a option must have a
*       'role' attribute with value 'option'.
*
*/
var ComboboxListbox = function (domNode) {

  this.domNode      = domNode;
  this.listbox      = false;

  this.hasFocus = false;
  this.hasHover = false;
  this.filter   = '';

  this.keyCode = Object.freeze({
    'BACKSPACE': 8,
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

ComboboxListbox.prototype.init = function () {

  this.domNode.setAttribute('aria-haspopup', 'true');

  this.autocomplete = this.domNode.getAttribute('aria-autocomplete');

  if (this.autocomplete) {
    this.autocomplete = this.autocomplete.toLowerCase();
  }

  this.domNode.addEventListener('keydown', this.handleKeydown.bind(this));
  this.domNode.addEventListener('keyup',   this.handleKeyup.bind(this));
  this.domNode.addEventListener('click',   this.handleClick.bind(this));
  this.domNode.addEventListener('focus',   this.handleFocus.bind(this));
  this.domNode.addEventListener('blur',    this.handleBlur.bind(this));

  // initialize pop up menus

  var listbox = document.getElementById(this.domNode.getAttribute('aria-owns'));

  if (listbox) {
    this.listbox = new Listbox(listbox, this);
    this.listbox.init();
  }

  // Open Button

  var button = this.domNode.nextElementSibling;

  if (button && button.tagName === 'BUTTON') {
    button.addEventListener('click',   this.handleButtonClick.bind(this));
  }

};

ComboboxListbox.prototype.updateValue = function (value) {
  if (this.domNode.getAttribute('aria-autocomplete') === 'both') {
    this.domNode.value = value;
    this.domNode.setSelectionRange(this.filter.length,this.filter.length);
  }
};

ComboboxListbox.prototype.setValue = function (value) {
  this.domNode.value = value;
};

/* Event Handlers */

ComboboxListbox.prototype.handleKeydown = function (event) {
  var tgt = event.currentTarget,
    flag = false,
    char = event.key,
    shiftKey = event.shiftKey,
    ctrlKey  = event.ctrlKey,
    altKey   = event.altKey;

  switch (event.keyCode) {

    case this.keyCode.DOWN:
      if (this.listbox) {
        this.listbox.filterOptions(this.filter);
        this.listbox.open();
        if (!altKey) {
          this.listbox.setFocusToFirstItem();
        }
      }
      flag = true;
      break;

    case this.keyCode.UP:
      if (this.listbox) {
        this.listbox.filterOptions(this.filter);
        this.listbox.open();
        if (!altKey) {
          this.listbox.setFocusToLastItem();
        }
        flag = true;
      }
      break;

    case this.keyCode.ESC:
      this.listbox.close(true);
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

ComboboxListbox.prototype.handleKeyup = function (event) {
  var tgt = event.currentTarget,
    flag = false,
    char = event.key;

  if (this.autocomplete !== 'none') {
    this.filter = this.domNode.value.substring(0,this.domNode.selectionEnd);
    this.option = this.listbox.filterOptions(this.filter);
  }

};

ComboboxListbox.prototype.handleClick = function (event) {
  if (this.domNode.getAttribute('aria-expanded') == 'true') {
    this.listbox.close(true);
  }
  else {
    this.listbox.open();
    this.listbox.setFocusToFirstItem();
  }
};

ComboboxListbox.prototype.handleFocus = function (event) {
  this.listbox.hasFocus = true;
};

ComboboxListbox.prototype.handleBlur = function (event) {
  this.listbox.hasFocus = false;
  setTimeout(this.listbox.close.bind(this.listbox, false), 300);

};

ComboboxListbox.prototype.handleButtonClick = function (event) {
  if (this.domNode.getAttribute('aria-expanded') == 'true') {
    this.listbox.close(true);
  }
  else {
    this.listbox.open();
    this.listbox.setFocusToFirstItem();
  }
};


// Initialize comboboxes

window.addEventListener('load', function () {

  var comboboxes = document.querySelectorAll('.combobox-listbox [role="combobox"]');

  for (var i = 0; i < comboboxes.length; i++) {
    var combobox = new ComboboxListbox(comboboxes[i]);
    combobox.init();
  }

});
