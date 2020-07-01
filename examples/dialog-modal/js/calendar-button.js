/*
*   This content is licensed according to the W3C Software License at
*   https://www.w3.org/Consortium/Legal/2015/copyright-software-and-document
*
*   File:   calendar-button.js
*/

'use strict';

var DatePicker = DatePicker || {};

var CalendarButtonInput = function (inputNode, buttonNode, datepicker) {
  this.inputNode    = inputNode;
  this.buttonNode   = buttonNode;
  this.imageNode    = false;

  this.datepicker = datepicker;

  this.defaultLabel = 'Choose Date';

  this.keyCode = Object.freeze({
    'ENTER': 13,
    'SPACE': 32
  });
};

CalendarButtonInput.prototype.init = function () {
  this.buttonNode.addEventListener('click', this.handleClick.bind(this));
  this.buttonNode.addEventListener('focus', this.handleFocus.bind(this));
};

CalendarButtonInput.prototype.handleClick = function () {
  if (!this.datepicker.isOpen()) {
    this.datepicker.show();
    this.datepicker.setFocusDay();
  }
  else {
    this.datepicker.hide();
  }

  event.stopPropagation();
  event.preventDefault();

};

CalendarButtonInput.prototype.setLabel = function (str) {
  if (typeof str === 'string' && str.length) {
    str = ', ' + str;
  }
  this.buttonNode.setAttribute('aria-label', this.defaultLabel + str);
};

CalendarButtonInput.prototype.setFocus = function () {
  this.buttonNode.focus();
};

CalendarButtonInput.prototype.setDate = function (day) {
  this.inputNode.value = (day.getMonth() + 1) + '/' + day.getDate() + '/' + day.getFullYear();
};

CalendarButtonInput.prototype.getDate = function () {
  return this.inputNode.value;
};

CalendarButtonInput.prototype.getDateLabel = function () {
  var label = '';

  var parts = this.inputNode.value.split('/');

  if ((parts.length === 3) &&
      Number.isInteger(parseInt(parts[0])) &&
      Number.isInteger(parseInt(parts[1])) &&
      Number.isInteger(parseInt(parts[2]))) {
    var month = parseInt(parts[0]) - 1;
    var day = parseInt(parts[1]);
    var year = parseInt(parts[2]);

    label = this.datepicker.getDateForButtonLabel(year, month, day);
  }

  return label;
};

CalendarButtonInput.prototype.handleFocus = function () {
  var dateLabel = this.getDateLabel();

  if (dateLabel) {
    this.setLabel('selected date is ' + dateLabel);
  }
  else {
    this.setLabel('');
  }
};

// Initialize menu button date picker

window.addEventListener('load' , function () {

  var datePickers = document.querySelectorAll('.datepicker');

  datePickers.forEach(function (dp) {
    var inputNode   = dp.querySelector('input');
    var buttonNode  = dp.querySelector('button');
    var dialogNode  = dp.querySelector('[role=dialog]');

    var datePicker = new DatePicker(inputNode, buttonNode, dialogNode);
    datePicker.init();
  });

});


