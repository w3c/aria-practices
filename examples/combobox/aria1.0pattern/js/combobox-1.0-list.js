/*
*   This content is licensed according to the W3C Software License at
*   https://www.w3.org/Consortium/Legal/2015/copyright-software-and-document
*
*   File:   combobox-1.0.js
*
*   Desc:   Combobox widget that implements ARIA Authoring Practices for
*           ARIA 1.0 definition of combobox using a Listbox
*
*   Author: Jon Gunderson and Nicholas Hoyt
*/

/*
*   @constructor ComboboxList
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
var ComboboxList = function (domNode) {

  this.domNode  = domNode;
  this.listbox  = false;
  this.option   = false;

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

ComboboxList.prototype.init = function () {

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

ComboboxList.prototype.updateValue = function () {
  if (this.autocomplete === 'both') {

    if (this.filter.length && this.option && this.listbox.isOpen()) {
      this.domNode.value = this.option.textContent;
      this.domNode.setSelectionRange(this.filter.length,this.filter.length);
    }
    else {
      this.domNode.value = this.filter;
    }
  }
};

ComboboxList.prototype.setValue = function (value) {
  this.filter = value;
  this.domNode.value = this.filter;
  this.domNode.setSelectionRange(this.filter.length,this.filter.length);
  if (this.autocomplete !== 'none') {
    this.listbox.filterOptions(this.filter, this.option);
  }
};

ComboboxList.prototype.setOption = function (option) {
  if (option) {
    this.option = option;
    this.listbox.setFocusStyle(this.option);
    this.updateValue();
  }
};

/* Event Handlers */

ComboboxList.prototype.handleKeydown = function (event) {
  var tgt = event.currentTarget,
    flag = false,
    char = event.key,
    shiftKey = event.shiftKey,
    ctrlKey  = event.ctrlKey,
    altKey   = event.altKey;

  switch (event.keyCode) {

    case this.keyCode.RETURN:
      if (this.option) {
        this.setValue(this.option.textContent);
        this.listbox.close(true);
      }
      flag = true;
      break;

    case this.keyCode.DOWN:

      if (this.listbox.hasOptions()) {
        if (this.listbox.isOpen()) {
          this.setOption(this.listbox.getNextItem(this.option));
        }
        else {
          this.listbox.open();
          if (!altKey) {
            this.setOption(this.listbox.getFirstItem());
          }
        }
      }
      flag = true;
      break;

    case this.keyCode.UP:
      if (this.listbox.hasOptions()) {
        if (this.listbox.isOpen()) {
          this.setOption(this.listbox.getPreviousItem(this.option));
        }
        else {
          this.listbox.open();
          if (!altKey) {
            this.setOption(this.listbox.getLastItem());
          }
        }
      }
      flag = true;
      break;

    case this.keyCode.HOME:
    case this.keyCode.PAGEUP:
      if (this.listbox.hasOptions()) {
        if (this.listbox.isOpen()) {
          this.setOption(this.listbox.getFirstItem());
        }
      }
      flag = true;
      break;

    case this.keyCode.END:
    case this.keyCode.PAGEDOWN:
      if (this.listbox.hasOptions()) {
        if (this.listbox.isOpen()) {
          this.setOption(this.listbox.getLastItem());
        }
      }
      flag = true;
      break;

    case this.keyCode.ESC:
      if (this.listbox.isOpen()) {
        this.listbox.close(true);
      }
      this.setValue(this.filter);
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

ComboboxList.prototype.handleKeyup = function (event) {
  var tgt = event.currentTarget,
    flag = false,
    option = false,
    char = event.key;

  function isPrintableCharacter (str) {
    return str.length === 1 && str.match(/\S/);
  }

  this.filter = this.domNode.value.substring(0,this.domNode.selectionEnd);

  if (this.autocomplete !== 'none') {
    option = this.listbox.filterOptions(this.filter, this.option);
  }

  switch (event.keyCode) {

    case this.keyCode.BACKSPACE:
      if (this.autocomplete === 'both') {
        this.setValue(this.filter);
      }
      flag = true;
      break;

    case this.keyCode.LEFT:
    case this.keyCode.RIGHT:
      flag = true;
      break;

    default:

      if (isPrintableCharacter(char)) {
        if (option) {
          this.setOption(option);
        }
        else {
          this.setValue(this.filter);
        }
      }
      flag = true;
      break;
  }

  if (flag) {
    event.stopPropagation();
    event.preventDefault();
  }

};

ComboboxList.prototype.handleClick = function (event) {
  if (this.listbox.isOpen()) {
    this.listbox.close(true);
  }
  else {
    this.listbox.open();
  }
};

ComboboxList.prototype.handleFocus = function (event) {
  this.listbox.hasFocus = true;
};

ComboboxList.prototype.handleBlur = function (event) {
  this.listbox.hasFocus = false;
  setTimeout(this.listbox.close.bind(this.listbox, false), 300);

};

ComboboxList.prototype.handleButtonClick = function (event) {
  if (this.listbox.isOpen()) {
    this.listbox.close(true);
  }
  else {
    this.listbox.open();
  }
};


// Initialize comboboxes

window.addEventListener('load', function () {

  var comboboxes = document.querySelectorAll('.combobox-list [role="combobox"]');

  for (var i = 0; i < comboboxes.length; i++) {
    var combobox = new ComboboxList(comboboxes[i]);
    combobox.init();
  }

});
