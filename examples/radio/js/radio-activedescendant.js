/*
 *   This content is licensed according to the W3C Software License at
 *   https://www.w3.org/Consortium/Legal/2015/copyright-software-and-document
 *
 *   File:  radio-activedescendant.js
 *
 *   Desc:  Radio group widget using aria-activedescendant that implements ARIA Authoring Practices
 */

'use strict';

var RadioGroupActiveDescendant = function (groupNode) {
  this.groupNode = groupNode;

  this.radioButtons = [];

  this.firstRadioButton = null;
  this.lastRadioButton = null;

  this.groupNode.addEventListener('keydown', this.handleKeydown.bind(this));
  this.groupNode.addEventListener('focus', this.handleFocus.bind(this));
  this.groupNode.addEventListener('blur', this.handleBlur.bind(this));

  // initialize
  if (!this.groupNode.getAttribute('role')) {
    this.groupNode.setAttribute('role', 'radiogroup');
  }

  var rbs = this.groupNode.querySelectorAll('[role=radio]');

  for (var i = 0; i < rbs.length; i++) {
    var rb = rbs[i];
    rb.addEventListener('click', this.handleClick.bind(this));
    this.radioButtons.push(rb);
    if (!this.firstRadioButton) {
      this.firstRadioButton = rb;
    }
    this.lastRadioButton = rb;
  }
  this.groupNode.tabIndex = 0;
};

RadioGroupActiveDescendant.prototype.setChecked = function (currentItem) {
  for (var i = 0; i < this.radioButtons.length; i++) {
    var rb = this.radioButtons[i];
    rb.setAttribute('aria-checked', 'false');
    rb.classList.remove('focus');
  }
  currentItem.setAttribute('aria-checked', 'true');
  currentItem.classList.add('focus');
  this.groupNode.setAttribute('aria-activedescendant', currentItem.id);
  this.groupNode.focus();
};

RadioGroupActiveDescendant.prototype.setCheckedToPreviousItem = function (
  currentItem
) {
  var index;

  if (currentItem === this.firstRadioButton) {
    this.setChecked(this.lastRadioButton);
  } else {
    index = this.radioButtons.indexOf(currentItem);
    this.setChecked(this.radioButtons[index - 1]);
  }
};

RadioGroupActiveDescendant.prototype.setCheckedToNextItem = function (
  currentItem
) {
  var index;

  if (currentItem === this.lastRadioButton) {
    this.setChecked(this.firstRadioButton);
  } else {
    index = this.radioButtons.indexOf(currentItem);
    this.setChecked(this.radioButtons[index + 1]);
  }
};

RadioGroupActiveDescendant.prototype.getCurrentRadioButton = function () {
  var id = this.groupNode.getAttribute('aria-activedescendant');
  if (!id) {
    this.groupNode.setAttribute(
      'aria-activedescendant',
      this.firstRadioButton.id
    );
    return this.firstRadioButton;
  }
  for (var i = 0; i < this.radioButtons.length; i++) {
    var rb = this.radioButtons[i];
    if (rb.id === id) {
      return rb;
    }
  }
  this.groupNode.setAttribute(
    'aria-activedescendant',
    this.firstRadioButton.id
  );
  return this.firstRadioButton;
};

// Event Handlers

RadioGroupActiveDescendant.prototype.handleKeydown = function (event) {
  var flag = false;

  var currentItem = this.getCurrentRadioButton();
  switch (event.key) {
    case ' ':
    case 'Enter':
      this.setChecked(currentItem);
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

RadioGroupActiveDescendant.prototype.handleClick = function (event) {
  this.setChecked(event.currentTarget);
};

RadioGroupActiveDescendant.prototype.handleFocus = function () {
  var currentItem = this.getCurrentRadioButton();
  currentItem.classList.add('focus');
};

RadioGroupActiveDescendant.prototype.handleBlur = function () {
  var currentItem = this.getCurrentRadioButton();
  currentItem.classList.remove('focus');
};

// Initialize radio button group using aria-activedescendant

window.addEventListener('load', function () {
  var rgs = document.querySelectorAll('.radiogroup-activedescendant');
  for (var i = 0; i < rgs.length; i++) {
    new RadioGroupActiveDescendant(rgs[i]);
  }
});
