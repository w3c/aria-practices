/*
 *   This content is licensed according to the W3C Software License at
 *   https://www.w3.org/Consortium/Legal/2015/copyright-software-and-document
 *
 *   File:   Checkbox.js
 *
 *   Desc:   Checkbox widget that implements ARIA Authoring Practices
 *           for a menu of links
 *
 */

'use strict';

/*
 *   @constructor Checkbox
 *
 *
 */
var Checkbox = function (domNode) {
  this.domNode = domNode;

  this.keyCode = Object.freeze({
    RETURN: 13,
    SPACE: 32,
  });
};

Checkbox.prototype.init = function () {
  this.domNode.tabIndex = 0;

  if (!this.domNode.getAttribute('aria-checked')) {
    this.domNode.setAttribute('aria-checked', 'false');
  }

  this.domNode.addEventListener('keydown', this.handleKeydown.bind(this));
  this.domNode.addEventListener('click', this.handleClick.bind(this));
  this.domNode.addEventListener('focus', this.handleFocus.bind(this));
  this.domNode.addEventListener('blur', this.handleBlur.bind(this));
};

Checkbox.prototype.toggleCheckbox = function () {
  if (this.domNode.getAttribute('aria-checked') === 'true') {
    this.domNode.setAttribute('aria-checked', 'false');
  } else {
    this.domNode.setAttribute('aria-checked', 'true');
  }
};

/* EVENT HANDLERS */

Checkbox.prototype.handleKeydown = function (event) {
  var flag = false;

  switch (event.keyCode) {
    case this.keyCode.SPACE:
      this.toggleCheckbox();
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

Checkbox.prototype.handleClick = function (event) {
  this.toggleCheckbox();
};

Checkbox.prototype.handleFocus = function (event) {
  this.domNode.classList.add('focus');
};

Checkbox.prototype.handleBlur = function (event) {
  this.domNode.classList.remove('focus');
};
