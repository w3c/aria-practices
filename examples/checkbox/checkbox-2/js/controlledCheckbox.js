/*
 *   This content is licensed according to the W3C Software License at
 *   https://www.w3.org/Consortium/Legal/2015/copyright-software-and-document
 *
 *   File:   controlledCheckbox.js
 *
 *   Desc:   ControlledCheckbox widget that implements ARIA Authoring Practices
 *           for a mixed checkbox
 */

'use strict';

/*
 *   @constructor ControlledCheckbox
 *
 *
 */
var ControlledCheckbox = function (domNode, controllerObj) {
  this.domNode = domNode;
  this.controller = controllerObj;
  this.lastState = false;
};

ControlledCheckbox.prototype.init = function () {
  this.lastState = this.isChecked();

  console.log(this.lastState);

  this.domNode.addEventListener('change', this.handleChange.bind(this));

  this.domNode.addEventListener('keydown', this.handleKeyup.bind(this), true);
  this.domNode.addEventListener('click', this.handleClick.bind(this), true);
};

ControlledCheckbox.prototype.isChecked = function () {
  // if standard input[type=checkbox]
  if (typeof this.domNode.checked === 'boolean') {
    return this.domNode.checked;
  }

  // If ARIA checkbox widget
  return this.domNode.getAttribute('aria-checked') === 'true';
};

ControlledCheckbox.prototype.setChecked = function (value) {
  // if standard input[type=checkbox]
  if (typeof this.domNode.checked === 'boolean') {
    switch (value) {
      case 'true':
        this.domNode.checked = true;
        break;

      case 'false':
        this.domNode.checked = false;
        break;

      case 'last':
        this.domNode.checked = this.lastState;
        break;

      default:
        break;
    }
  }

  // If ARIA checkbox widget
  if (typeof this.domNode.getAttribute('aria-checked') === 'string') {
    switch (value) {
      case 'true':
      case 'false':
        this.domNode.setAttribute('aria-checked', value);
        break;

      case 'last':
        if (this.lastState) {
          this.domNode.setAttribute('aria-checked', 'true');
        } else {
          this.domNode.setAttribute('aria-checked', 'false');
        }
        break;

      default:
        break;
    }
  }
};

/* EVENT HANDLERS */

ControlledCheckbox.prototype.handleChange = function (event) {
  this.controller.updateCheckboxMixed();
};

ControlledCheckbox.prototype.handleKeyup = function (event) {
  this.lastState = this.isChecked();
};

ControlledCheckbox.prototype.handleClick = function (event) {
  this.lastState = this.isChecked();
};
