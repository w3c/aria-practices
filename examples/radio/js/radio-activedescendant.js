/*
*   This content is licensed according to the W3C Software License at
*   https://www.w3.org/Consortium/Legal/2015/copyright-software-and-document
*
*   File:   radio-activedescendant.js
*
*   Desc:   Radio group widget using aria-activedescendant that implements ARIA Authoring Practices
*/

'use strict';

/*
*   @constructor radioGroupActiveDescendent
*
*   @desc
*       Wrapper for ARIA radiogroup control using ARIA active-descendant.  Any descendant
*       element with role=radio will be included in this radiogroup as a radiobutton2.
*
*   @param domNode
*       The DOM element node that serves as the radiogroup container.
*/
var RadioGroupActiveDescendant = function (domNode) {

  this.domNode   = domNode;

  this.radioButtons = [];

  this.firstRadioButton  = null;
  this.lastRadioButton   = null;
  this.hasChecked = false;

  this.domNode.addEventListener('keydown',    this.handleKeydown.bind(this));
  this.domNode.addEventListener('focus',      this.handleFocus.bind(this));
  this.domNode.addEventListener('blur',       this.handleBlur.bind(this));

  // initialize
  if (!this.domNode.getAttribute('role')) {
    this.domNode.setAttribute('role', 'radiogroup');
  }

  var rbs = this.domNode.querySelectorAll('[role=radio]');

  for (var i = 0; i < rbs.length; i++) {
    var rb = rbs[i];
    if (rb.getAttribute('aria-checked') === 'true') {
      this.hasChecked = true;
    }
    rb.addEventListener('click',       this.handleClick.bind(this));
    this.radioButtons.push(rb);
    if (!this.firstRadioButton) {
      this.firstRadioButton = rb;
    }
    this.lastRadioButton = rb;
  }
  this.domNode.tabIndex = 0;
};

RadioGroupActiveDescendant.prototype.setChecked  = function (currentItem, flag) {
  if (typeof flag !== 'boolean') {
    flag = false;
  }

  for (var i = 0; i < this.radioButtons.length; i++) {
    var rb = this.radioButtons[i];
    rb.setAttribute('aria-checked', 'false');
    rb.classList.remove('focus');
  }
  currentItem.classList.add('focus');
  this.domNode.setAttribute('aria-activedescendant', currentItem.id);
  if (this.hasChecked || flag) {
    currentItem.setAttribute('aria-checked', 'true');
    this.hasChecked = true;
  }
  this.domNode.focus();
};

RadioGroupActiveDescendant.prototype.setCheckedToPreviousItem = function (currentItem) {
  var index;

  if (currentItem === this.firstRadioButton) {
    this.setChecked(this.lastRadioButton);
  }
  else {
    index = this.radioButtons.indexOf(currentItem);
    this.setChecked(this.radioButtons[index - 1]);
  }
};

RadioGroupActiveDescendant.prototype.setCheckedToNextItem = function (currentItem) {
  var index;

  if (currentItem === this.lastRadioButton) {
    this.setChecked(this.firstRadioButton);
  }
  else {
    index = this.radioButtons.indexOf(currentItem);
    this.setChecked(this.radioButtons[index + 1]);
  }
};

RadioGroupActiveDescendant.prototype.getCurrentRadioButton = function () {
  var id = this.domNode.getAttribute('aria-activedescendant');
  if (!id) {
    this.domNode.setAttribute('aria-activedescendant', this.firstRadioButton.id);
    return this.firstRadioButton;
  }
  for (var i = 0; i < this.radioButtons.length; i++) {
    var rb = this.radioButtons[i];
    if (rb.id === id) {
      return rb;
    }
  }
  this.domNode.setAttribute('aria-activedescendant', this.firstRadioButton.id);
  return this.firstRadioButton;
};

// Event Handlers

RadioGroupActiveDescendant.prototype.handleKeydown = function (event) {
  var flag = false;

  var currentItem = this.getCurrentRadioButton();
  switch (event.key) {
    case ' ':
    case 'Enter':
      this.setChecked(currentItem, true);
      flag = true;
      break;

    case 'Up':
    case 'ArrowUp':
    case 'Left':
    case 'ArrowLeft':
      this.setCheckedToPreviousItem(currentItem);
      flag = true;
      break;

    case 'Down':
    case 'ArrowDown':
    case 'Right':
    case 'ArrowRight':
      this.setCheckedToNextItem(currentItem);
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

RadioGroupActiveDescendant.prototype.handleFocus = function () {
  var currentItem = this.getCurrentRadioButton();
  currentItem.classList.add('focus');
};

RadioGroupActiveDescendant.prototype.handleBlur = function () {
  var currentItem = this.getCurrentRadioButton();
  currentItem.classList.remove('focus');
};

RadioGroupActiveDescendant.prototype.handleClick = function (event) {
  this.setChecked(event.currentTarget, true);
};


// Initialize radio button group using aria-activedescendant

window.addEventListener('load', function () {
  var rgs = document.querySelectorAll('.radiogroup-activedescendant');
  for(var i=0; i < rgs.length; i++) {
    new RadioGroupActiveDescendant(rgs[i]);
  }
});
