/*
*   This content is licensed according to the W3C Software License at
*   https://www.w3.org/Consortium/Legal/2015/copyright-software-and-document
*
*   File:   calendar-button.js
*/

var DatePicker = DatePicker || {};

var CalendarButtonInput = function (inputNode, buttonNode, messageNode, datepicker) {
  this.inputNode    = inputNode;
  this.buttonNode   = buttonNode;
  this.messageNode  = messageNode;
  this.imageNode    = false;

  this.datepicker = datepicker;

  this.ignoreFocusEvent = false;
  this.ignoreBlurEvent = false;

  this.hasFocusFlag = false;

  this.keyCode = Object.freeze({
    'TAB': 9,
    'ENTER': 13,
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

CalendarButtonInput.prototype.init = function () {

  this.buttonNode.addEventListener('click', this.handleClick.bind(this));
  this.buttonNode.addEventListener('keydown', this.handleKeyDown.bind(this));

  this.buttonNode.addEventListener('focus', this.handleFocus.bind(this));
  this.buttonNode.addEventListener('blur', this.handleBlur.bind(this));

  this.setMessage('');
};

CalendarButtonInput.prototype.handleKeyDown = function (event) {
  var flag = false;

  switch (event.keyCode) {

    case this.keyCode.DOWN:
    case this.keyCode.ENTER:
      this.datepicker.show();
      this.datepicker.setFocusDay();
      flag = true;
      break;

    case this.keyCode.ESC:
      this.datepicker.hide(false);
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

CalendarButtonInput.prototype.handleFocus = function () {
  if (this.isCollapsed()) {
    this.setMessage('Use the down arrow key or the following change date button to move focus to the datepicker grid.');
  }
};

CalendarButtonInput.prototype.handleBlur = function () {
  this.setMessage('');
};

CalendarButtonInput.prototype.handleClick = function () {
  if (this.isCollapsed()) {
    this.datepicker.show();
  }
  else {
    this.datepicker.hide();
  }

  event.stopPropagation();
  event.preventDefault();

};


CalendarButtonInput.prototype.setFocus = function () {
  this.buttonNode.setAttribute('aria-label', 'Calendar, current date is ' + this.datepicker.getDateForButtonLabel());
  this.buttonNode.focus();
};

CalendarButtonInput.prototype.setAriaExpanded = function (flag) {
  if (flag) {
    this.buttonNode.setAttribute('aria-expanded', 'true');
  }
  else {
    this.buttonNode.setAttribute('aria-expanded', 'false');
  }
};

CalendarButtonInput.prototype.getAriaExpanded = function () {
  return this.buttonNode.getAttribute('aria-expanded') === 'true';
};

CalendarButtonInput.prototype.isCollapsed = function () {
  return this.inputNode.getAttribute('aria-expanded') !== 'true';
};

CalendarButtonInput.prototype.setDate = function (month, day, year) {
  this.inputNode.value = (month + 1) + '/' + (day + 1) + '/' + year;
};

CalendarButtonInput.prototype.getDate = function () {
  return this.inputNode.value;
};

CalendarButtonInput.prototype.setMessage = function (str) {
  return this.messageNode.textContent = str;
};

CalendarButtonInput.prototype.hasFocus = function () {
  return this.hasFocusflag;
};

// Initialize menu button date picker

window.addEventListener('load' , function () {

  var datePickers = document.querySelectorAll('.datepicker');

  datePickers.forEach(function (dp) {
    var inputNode   = dp.querySelector('input');
    var buttonNode  = dp.querySelector('button');
    var messageNode = dp.querySelector('.message');
    var dialogNode  = dp.querySelector('[role=dialog]');

    var datePicker = new DatePicker(inputNode, buttonNode, messageNode, dialogNode);
    datePicker.init();
  });

});


