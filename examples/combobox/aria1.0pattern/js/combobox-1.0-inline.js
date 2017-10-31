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
*   @constructor ComboboxInline
*
*   @desc
*       Wrapper object for a listbox
*
*   @param domNode
*       The DOM element node that serves as the listbox container. Each
*       child element of domNode that represents a option must have a
*       'role' attribute with value 'option'.
*/
var ComboboxInline = function (domNode, options) {

  this.domNode  = domNode;
  this.options  = options;

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

ComboboxInline.prototype.init = function () {

  this.domNode.addEventListener('keydown', this.handleKeydown.bind(this));
  this.domNode.addEventListener('keyup',   this.handleKeyup.bind(this));
  this.domNode.addEventListener('focus',   this.handleFocus.bind(this));
  this.domNode.addEventListener('blur',    this.handleBlur.bind(this));

};

ComboboxInline.prototype.setValue = function (value) {
  console.log('[ComboboxInline][setValue][value]: ' + value);
  this.filter = value;
  this.domNode.value = this.filter;
  this.domNode.setSelectionRange(this.filter.length, this.filter.length);
};

/* Event Handlers */

ComboboxInline.prototype.handleKeydown = function (event) {
  var tgt = event.currentTarget,
    flag = false,
    char = event.key,
    shiftKey = event.shiftKey,
    ctrlKey  = event.ctrlKey,
    altKey   = event.altKey;

  switch (event.keyCode) {

    case this.keyCode.RETURN:
      this.setValue(this.domNode.value);
      flag = true;
      break;

    case this.keyCode.TAB:
      this.setValue(this.filter);
      break;

    default:
      break;
  }

  if (flag) {
    event.stopPropagation();
    event.preventDefault();
  }
};

ComboboxInline.prototype.handleKeyup = function (event) {
  var tgt = event.currentTarget,
    flag = false,
    char = event.key,
    shiftKey = event.shiftKey,
    ctrlKey  = event.ctrlKey,
    altKey   = event.altKey;

  function isPrintableCharacter (str) {
    return str.length === 1 && str.match(/\S/);
  }

  if (isPrintableCharacter(char)) {
    console.log('[ComboboxInline][handleKeyup][char]: ' + char);
    this.filter = this.domNode.value.substring(0,this.domNode.selectionEnd);

    for (var i = 0; i < this.options.length; i++) {
      var option = this.options[i].toLowerCase();
      if (option.indexOf(this.filter.toLowerCase()) === 0) {
        this.domNode.value = this.options[i];
        this.domNode.setSelectionRange(this.filter.length, option.length);
        break;
      }
    }
  }

};

ComboboxInline.prototype.handleFocus = function (event) {
};

ComboboxInline.prototype.handleBlur = function (event) {

};

