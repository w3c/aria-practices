/*
*   This content is licensed according to the W3C Software License at
*   https://www.w3.org/Consortium/Legal/2015/copyright-software-and-document
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

  this.allOptions = [];

  this.options    = [];      // see PopupMenu init method

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
  var childElement, optionElement, optionElements, firstChildElement, option, textContent, numItems;

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

Listbox.prototype.filterOptions = function (filter, currentOption) {

  if (typeof filter !== 'string') {
    filter = '';
  }

  var firstMatch = false,
    i,
    option,
    textContent,
    numItems;

  filter = filter.toLowerCase();

  this.options    = [];
  this.firstChars = [];
  this.domNode.innerHTML = '';

  for (i = 0; i < this.allOptions.length; i++) {
    option = this.allOptions[i];
    if (filter.length === 0 || option.textComparison.indexOf(filter) === 0) {
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
    this.lastOption  = this.options[numItems - 1];

    if (currentOption && this.options.indexOf(currentOption) >= 0) {
      option = currentOption;
    }
    else {
      option = this.firstOption;
    }
  }
  else {
    this.firstOption = false;
    option = false;
    this.lastOption  = false;
  }

  return option;
};

Listbox.prototype.setCurrentOptionStyle = function (option) {

  for (var i = 0; i < this.options.length; i++) {
    var opt = this.options[i];
    if (opt === option) {
      opt.domNode.setAttribute('aria-selected', 'true');
      this.domNode.scrollTop = opt.domNode.offsetTop;
    }
    else {
      opt.domNode.removeAttribute('aria-selected');
    }
  }
};

Listbox.prototype.setOption = function (option) {
  if (option) {
    this.combobox.setOption(option);
    this.combobox.setValue(option.textContent);
  }
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


Listbox.prototype.getFirstItem = function () {
  return this.firstOption;
};

Listbox.prototype.getLastItem = function () {
  return this.lastOption;
};

Listbox.prototype.getPreviousItem = function (currentOption) {
  var index;

  if (currentOption !== this.firstOption) {
    index = this.options.indexOf(currentOption);
    return this.options[index - 1];
  }
  return this.lastOption;
};

Listbox.prototype.getNextItem = function (currentOption) {
  var index;

  if (currentOption !== this.lastOption) {
    index = this.options.indexOf(currentOption);
    return this.options[index + 1];
  }
  return this.firstOption;
};

/* MENU DISPLAY METHODS */

Listbox.prototype.isOpen = function () {
  return this.domNode.style.display === 'block';
};

Listbox.prototype.isClosed = function () {
  return this.domNode.style.display !== 'block';
};

Listbox.prototype.hasOptions = function () {
  return this.options.length;
};

Listbox.prototype.open = function () {
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
    this.setCurrentOptionStyle(false);
    this.domNode.style.display = 'none';
    this.combobox.domNode.setAttribute('aria-expanded', 'false');
    this.combobox.setActiveDescendant(false);
  }
};


