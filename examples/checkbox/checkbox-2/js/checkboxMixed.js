/*
 *   This content is licensed according to the W3C Software License at
 *   https://www.w3.org/Consortium/Legal/2015/copyright-software-and-document
 *
 *   File:   CheckboxMixed.js
 *
 *   Desc:   CheckboxMixed widget that implements ARIA Authoring Practices
 *           for a menu of links
 */

'use strict';

/*
 *   @constructor CheckboxMixed
 *
 *
 */
var CheckboxMixed = function (domNode) {
  this.domNode = domNode;

  this.controlledCheckboxes = [];

  this.keyCode = Object.freeze({
    RETURN: 13,
    SPACE: 32,
  });
};

CheckboxMixed.prototype.init = function () {
  this.domNode.tabIndex = 0;

  var ids = this.domNode.getAttribute('aria-controls').split(' ');

  for (var i = 0; i < ids.length; i++) {
    var node = document.getElementById(ids[i]);
    var ccb = new ControlledCheckbox(node, this);
    ccb.init();
    this.controlledCheckboxes.push(ccb);
  }

  this.domNode.addEventListener('keydown', this.handleKeydown.bind(this));
  this.domNode.addEventListener('click', this.handleClick.bind(this));
  this.domNode.addEventListener('focus', this.handleFocus.bind(this));
  this.domNode.addEventListener('blur', this.handleBlur.bind(this));

  this.updateCheckboxMixed();
};

CheckboxMixed.prototype.updateCheckboxMixed = function () {
  var count = 0;

  for (var i = 0; i < this.controlledCheckboxes.length; i++) {
    if (this.controlledCheckboxes[i].isChecked()) {
      count++;
    }
  }

  if (count === 0) {
    this.domNode.setAttribute('aria-checked', 'false');
  } else {
    if (count === this.controlledCheckboxes.length) {
      this.domNode.setAttribute('aria-checked', 'true');
    } else {
      this.domNode.setAttribute('aria-checked', 'mixed');
      this.updateControlledStates();
    }
  }
};

CheckboxMixed.prototype.updateControlledStates = function () {
  for (var i = 0; i < this.controlledCheckboxes.length; i++) {
    this.controlledCheckboxes[i].lastState = this.controlledCheckboxes[
      i
    ].isChecked();
  }
};

CheckboxMixed.prototype.anyLastChecked = function () {
  var count = 0;

  for (var i = 0; i < this.controlledCheckboxes.length; i++) {
    if (this.controlledCheckboxes[i].lastState) {
      count++;
    }
  }

  return count > 0;
};

CheckboxMixed.prototype.setControlledCheckboxes = function (value) {
  for (var i = 0; i < this.controlledCheckboxes.length; i++) {
    this.controlledCheckboxes[i].setChecked(value);
  }

  this.updateCheckboxMixed();
};

CheckboxMixed.prototype.toggleCheckboxMixed = function () {
  var state = this.domNode.getAttribute('aria-checked');

  if (state === 'false') {
    if (this.anyLastChecked()) {
      this.setControlledCheckboxes('last');
    } else {
      this.setControlledCheckboxes('true');
    }
  } else {
    if (state === 'mixed') {
      this.setControlledCheckboxes('true');
    } else {
      this.setControlledCheckboxes('false');
    }
  }

  this.updateCheckboxMixed();
};

/* EVENT HANDLERS */

CheckboxMixed.prototype.handleKeydown = function (event) {
  var flag = false;

  switch (event.keyCode) {
    case this.keyCode.SPACE:
      this.toggleCheckboxMixed();
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

CheckboxMixed.prototype.handleClick = function (event) {
  this.toggleCheckboxMixed();
};

CheckboxMixed.prototype.handleFocus = function (event) {
  this.domNode.classList.add('focus');
};

CheckboxMixed.prototype.handleBlur = function (event) {
  this.domNode.classList.remove('focus');
};
