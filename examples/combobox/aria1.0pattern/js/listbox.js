/*
*   This content is licensed according to the W3C Software License at
*   https://www.w3.org/Consortium/Legal/2015/copyright-software-and-document
*
*   File:   listbox.js
*
*   Desc:   Listbox widget that implements ARIA Authoring Practices
*
*   Author: Jon Gunderson and Nicholas Hoyt
*/

/*
*   @constructor Listbox
*
*   @desc
*       Wrapper object for a listbox
*
*   @param domNode
*       The DOM element node that serves as the listbox container. Each
*       child element of domNode that represents a option must have a
*       'role' attribute with value 'option'.
*
*   @param comboboxObj
*       The object that is a wrapper for the DOM element that controls the
*       menu, e.g. a button element, with an 'aria-controls' attribute that
*       references this menu's domNode. See MenuButton.js
*
*       The combobox object is expected to have the following properties:
*       1. domNode: The combobox object's DOM element node, needed for
*          retrieving positioning information.
*       2. hasHover: boolean that indicates whether the combobox object's
*          domNode has responded to a mouseover event with no subsequent
*          mouseout event having occurred.
*/
var Listbox = function (domNode, comboboxObj) {
  var elementChildren,
    msgPrefix = 'Listbox constructor argument domNode ';

  // Check whether domNode is a DOM element
  if (!domNode instanceof Element) {
    throw new TypeError(msgPrefix + 'is not a DOM Element.');
  }

  // Check whether domNode has child elements
  if (domNode.childElementCount === 0) {
    throw new Error(msgPrefix + 'has no element children.');
  }

  // Check whether domNode child elements are A elements
  var childElement = domNode.firstElementChild;
  while (childElement) {
    var option = childElement.firstElementChild;
    childElement = childElement.nextElementSibling;
  }

  this.domNode = domNode;
  this.combobox = comboboxObj;

  console.log('[Listbox][init][combobox]: ' + this.combobox);

  this.allOptions = [];

  this.options    = [];      // see PopupMenu init method
  this.firstChars = [];      // see PopupMenu init method

  this.firstOption  = null;    // see PopupMenu init method
  this.lastOption   = null;    // see PopupMenu init method

  this.hasFocus   = false;   // see MenuItem handleFocus, handleBlur
  this.hasHover   = false;   // see PopupMenu handleMouseover, handleMouseout
};

/*
*   @method Listbox.prototype.init
*
*   @desc
*       Add domNode event listeners for mouseover and mouseout. Traverse
*       domNode children to configure each option and populate.options
*       array. Initialize firstOption and lastOption properties.
*/
Listbox.prototype.init = function () {
  var childElement, optionElement, firstChildElement, option, textContent, numItems;

  // Configure the domNode itself
  this.domNode.tabIndex = -1;

  this.domNode.setAttribute('role', 'listbox');

  this.domNode.addEventListener('mouseover', this.handleMouseover.bind(this));
  this.domNode.addEventListener('mouseout',  this.handleMouseout.bind(this));

  // Traverse the element children of domNode: configure each with
  // option role behavior and store reference in.options array.
  optionElements = this.domNode.getElementsByTagName('LI');

  for (var i = 0; i < optionElements.length; i++) {

    optionElement = optionElements[i];

    if (!optionElement.firstElementChild && optionElement.getAttribute('role') != 'separator') {
      option = new Option(optionElement, this);
      option.init();
      this.allOptions.push(option);
    }
  }

  this.filterOptions('');

};

Listbox.prototype.filterOptions = function (filter) {

  if (typeof filter !== 'string') {
    filter = '';
  }

  var firstMatch = false,
    i,
    option,
    textContent,
    numItems;

  this.filter = filter;
  filter = filter.toLowerCase();

  this.options    = [];
  this.firstChars = [];
  this.domNode.innerHTML = '';

  for (i = 0; i < this.allOptions.length; i++) {
    option = this.allOptions[i];
    if (filter.length === 0 || option.textComparision.indexOf(filter) === 0) {
      this.options.push(option);
      textContent = option.textContent.trim();
      this.firstChars.push(textContent.substring(0, 1).toLowerCase());
      this.domNode.appendChild(option.domNode);
    }
  }

  // Use populated.options array to initialize firstOption and lastOption.
  numItems = this.options.length;
  if (numItems > 0) {
    this.firstOption = this.options[0];
    firstMatch = this.firstOption.textContent;
    this.lastOption  = this.options[numItems - 1];
  }
  else {
    this.firstOption = false;
    firstMatch = '';
    this.lastOption  = false;
  }


  return firstMatch;

};

Listbox.prototype.restoreValue = function () {
  this.combobox.updateValue(this.filter);
};

Listbox.prototype.updateValue = function (value) {
  this.combobox.updateValue(value);
};

Listbox.prototype.setValue = function (value) {
  this.combobox.setValue(value);
};

/* EVENT HANDLERS */

Listbox.prototype.handleMouseover = function (event) {
  this.hasHover = true;
};

Listbox.prototype.handleMouseout = function (event) {
  this.hasHover = false;
  setTimeout(this.close.bind(this, false), 300);
};

/* FOCUS MANAGEMENT METHODS */

Listbox.prototype.setFocusToController = function () {
  this.combobox.domNode.focus();
};

Listbox.prototype.setFocusToFirstItem = function () {
  this.firstOption.domNode.focus();
  this.updateValue(this.firstOption.textContent);
};

Listbox.prototype.setFocusToLastItem = function () {
  this.lastOption.domNode.focus();
  this.updateValue(this.lastOption.textContent);
};

Listbox.prototype.setFocusToPreviousItem = function (currentOption) {
  var index;

  if (currentOption !== this.firstOption) {
    index = this.options.indexOf(currentOption);
    this.options[index - 1].domNode.focus();
    this.updateValue(this.options[index - 1].textContent);
  }
};

Listbox.prototype.setFocusToNextItem = function (currentOption) {
  var index;

  if (currentOption !== this.lastOption) {
    index = this.options.indexOf(currentOption);
    this.options[index + 1].domNode.focus();
    this.updateValue(this.options[index + 1].textContent);
  }
};

Listbox.prototype.setFocusByFirstCharacter = function (currentOption, char) {
  var start, index, char = char.toLowerCase();

  // Get start index for search based on position of currentOption
  start = this.options.indexOf(currentOption) + 1;
  if (start === this.options.length) {
    start = 0;
  }

  // Check remaining slots in the menu
  index = this.getIndexFirstChars(start, char);

  // If not found in remaining slots, check from beginning
  if (index === -1) {
    index = this.getIndexFirstChars(0, char);
  }

  // If match was found...
  if (index > -1) {
    this.options[index].domNode.focus();
    this.updateValue(this.options[index].textContent);
  }
};

Listbox.prototype.getIndexFirstChars = function (startIndex, char) {
  for (var i = startIndex; i < this.firstChars.length; i++) {
    if (char === this.firstChars[i]) {
      return i;
    }
  }
  return -1;
};

/* MENU DISPLAY METHODS */

Listbox.prototype.open = function () {
  // get bounding rectangle of combobox object's DOM node
  var rect = this.combobox.domNode.getBoundingClientRect();

  // set CSS properties
  this.domNode.style.display = 'block';

  // set aria-expanded attribute
  this.combobox.domNode.setAttribute('aria-expanded', 'true');
};

Listbox.prototype.close = function (force) {

  if (typeof force !== 'boolean') {
    force = false;
  }

  if (force || (!this.hasFocus && !this.hasHover && !this.combobox.hasHover)) {
    this.domNode.style.display = 'none';
    this.combobox.domNode.removeAttribute('aria-expanded');
  }
};


