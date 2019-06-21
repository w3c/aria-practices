/*
*   This content is licensed according to the W3C Software License at
*   https://www.w3.org/Consortium/Legal/2015/copyright-software-and-document
*
*   File:   datepicker-combobox.js
*/

var ComboboxInput = function (comboboxNode, inputNode, buttonNode, messageNode, datepicker) {

  this.comboboxNode = comboboxNode;
  this.inputNode    = inputNode;
  this.buttonNode   = buttonNode;
  this.messageNode  = messageNode;

  this.arrowUpNode = comboboxNode.querySelector('.arrow.up');
  this.arrowDownNode = comboboxNode.querySelector('.arrow.down');

  this.datepicker = datepicker;

  this.ignoreFocusEvent = false;
  this.ignoreBlurEvent = false;

  this.hasFocusFlag = false;

  this.keyCode = Object.freeze({
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

ComboboxInput.prototype.init = function () {
  this.inputNode.addEventListener('keydown', this.handleKeyDown.bind(this));
  this.inputNode.addEventListener('focus', this.handleFocus.bind(this));
  this.inputNode.addEventListener('blur', this.handleBlur.bind(this));
  this.inputNode.addEventListener('mouseDown', this.handleMouseDown.bind(this));

  this.buttonNode.addEventListener('mousedown', this.handleButtonMouseDown.bind(this));
  this.buttonNode.addEventListener('mouseup', this.handleButtonMouseUp.bind(this));

  this.arrowUpNode.addEventListener('mousedown', this.handleButtonMouseDown.bind(this));
  this.arrowUpNode.addEventListener('mouseup', this.handleButtonMouseUp.bind(this));

  this.arrowDownNode.addEventListener('mousedown', this.handleButtonMouseDown.bind(this));
  this.arrowDownNode.addEventListener('mouseup', this.handleButtonMouseUp.bind(this));

  this.buttonNode.addEventListener('touchstart', this.handleTouchStart.bind(this));
  this.buttonNode.addEventListener('keydown', this.handleButtonKeyDown.bind(this));

  this.setMessage('');
};

ComboboxInput.prototype.handleKeyDown = function (event) {
  var flag = false;

  switch (event.keyCode) {

    case this.keyCode.DOWN:
    case this.keyCode.RETURN:
      this.datepicker.show();
      this.ignoreBlurEvent = true;
      this.datepicker.setFocusDay();
      flag = true;
      break;

    case this.keyCode.ESC:
      this.datepicker.hide(false);
      flag = true;
      break;

    case this.keyCode.TAB:
      this.ignoreBlurEvent = true;
      this.datepicker.hide(false);
      break;

    default:
      break;
  }

  if (flag) {
    event.stopPropagation();
    event.preventDefault();
  }
};

ComboboxInput.prototype.handleTouchStart = function (event) {
  if (event.targetTouches.length === 1) {
    if (this.comboboxNode.contains(event.targetTouches[0].target)) {
      if (this.isCollapsed()) {
        this.datepicker.show();
        event.stopPropagation();
        event.preventDefault();
        return false;
      }
    }
  }
};

ComboboxInput.prototype.handleFocus = function () {
  if (!this.datepicker.isMouseDownOnBackground &&
      !this.isMouseDownOnButton &&
      !this.ignoreFocusEvent &&
      this.isCollapsed()) {
    this.datepicker.show();
    this.setMessage('Use the down arrow key to move focus to the datepicker grid.');
  }

  this.hasFocusFlag = true;
  this.ignoreFocusEvent = false;

};

ComboboxInput.prototype.handleBlur = function () {
  if (!this.datepicker.isMouseDownOnBackground &&
      !this.isMouseDownOnButton &&
      !this.ignoreBlurEvent) {
    this.datepicker.hide(false);
    this.setMessage('');
  }

  this.hasFocusFlag = false;
  this.ignoreBlurEvent = false;
};

ComboboxInput.prototype.setFocus = function () {
  this.buttonNode.setAttribute('aria-label', 'Date, current date is ' + this.datepicker.getDateForButtonLabel())
  this.inputNode.focus();
};

ComboboxInput.prototype.hasFocus = function () {
  return this.hasFocusFlag;
};

ComboboxInput.prototype.handleMouseDown = function (event) {
  if (this.isCollapsed()) {
    this.datepicker.show();
  }
  else {
    this.ignoreFocusEvent = true;
    this.datepicker.hide();
  }

  event.stopPropagation();
  event.preventDefault();

};

ComboboxInput.prototype.handleButtonMouseDown = function (event) {
  this.isMouseDownOnButton = true;

  if (this.isCollapsed()) {

    if (this.hasFocusFlag) {
      this.ignoreBlurEvent = true;
    }

    this.datepicker.show();
    this.datepicker.setFocusDay();
  }
  else {
    this.ignoreFocusEvent = true;
    this.datepicker.hide();
  }

  event.stopPropagation();
  event.preventDefault();
};

ComboboxInput.prototype.handleButtonMouseUp = function (event) {
  console.log('[ComboboxInput][handleButtonMouseUp]');
  this.isMouseDownOnButton = false;

  event.stopPropagation();
  event.preventDefault();
};

ComboboxInput.prototype.handleButtonKeyDown = function (event) {

  switch (event.keyCode) {
    case this.keyCode.RETURN:
    case this.keyCode.SPACE:
      this.handleButtonClick();
      this.ignoreBlurEvent = true;
      this.setFocusDay();
      flag = true;
      break;
  }

  if (flag) {
    event.stopPropagation();
    event.preventDefault();
  }
};

ComboboxInput.prototype.setAriaExpanded = function (flag) {

  if (flag) {
    this.comboboxNode.setAttribute('aria-expanded', 'true');
    this.buttonNode.setAttribute('aria-expanded', 'true');
  }
  else {
    this.comboboxNode.setAttribute('aria-expanded', 'false');
    this.buttonNode.setAttribute('aria-expanded', 'false');
  }

};

ComboboxInput.prototype.getAriaExpanded = function () {
  return this.comboboxNode.getAttribute('aria-expanded') === 'true';
};

ComboboxInput.prototype.isCollapsed = function () {
  return this.comboboxNode.getAttribute('aria-expanded') !== 'true';
};

ComboboxInput.prototype.setDate = function (month, day, year) {
  this.inputNode.value = (month + 1) + '/' + (day + 1) + '/' + year;
};

ComboboxInput.prototype.getDate = function () {
  return this.inputNode.value;
};

ComboboxInput.prototype.setMessage = function (str) {
  return this.messageNode.textContent = str;
};

// Initialize combobox date picker

window.addEventListener('load' , function () {

  var datePickers = document.querySelectorAll('[role=combobox].datepicker');

  datePickers.forEach(function (dp) {
    var inputNode   = dp.querySelector('input');
    var buttonNode  = dp.querySelector('button');
    var messageNode = dp.querySelector('.message');
    var dialogNode  = dp.querySelector('[role=dialog]');

    var datePicker = new DatePicker(dp, inputNode, buttonNode, messageNode, dialogNode);
    datePicker.init();
  });

});
