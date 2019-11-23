/*
*   This content is licensed according to the W3C Software License at
*   https://www.w3.org/Consortium/Legal/2015/copyright-software-and-document
*
*   File:   datepicker-combobox-day.js
*/

var DatepickerComboboxDay = function (domNode, datepicker) {

  this.day = new Date();

  this.domNode = domNode;
  this.datepicker = datepicker;

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

DatepickerComboboxDay.prototype.init = function () {
  this.domNode.setAttribute('tabindex', '-1');
  this.domNode.addEventListener('mousedown', this.handleMouseDown.bind(this));
  this.domNode.addEventListener('keydown', this.handleKeyDown.bind(this));
  this.domNode.addEventListener('focus', this.handleFocus.bind(this));

  this.domNode.innerHTML = '-1';

};

DatepickerComboboxDay.prototype.isDisabled = function () {
  return this.domNode.classList.contains('disabled');
};

DatepickerComboboxDay.prototype.updateDay = function (disable, day, selected) {

  this.day = new Date(day);
  var d = this.day.getDate().toString();
  if (this.day.getDate() < 10) {
    d = '0' + d;
  }

  var m = this.day.getMonth() + 1;
  if (this.day.getMonth() < 9) {
    m = '0' + m;
  }
  this.domNode.innerHTML = this.day.getDate();
  this.domNode.setAttribute('data-date', this.day.getFullYear() + '-' + m + '-' + d);
  this.domNode.setAttribute('tabindex', '-1');
  this.domNode.removeAttribute('aria-selected');

  if (disable) {
    this.domNode.classList.add('disabled');
  }
  else {
    this.domNode.classList.remove('disabled');
    if (selected) {
      this.domNode.setAttribute('aria-selected', 'true');
      this.domNode.setAttribute('tabindex', '0');
    }
  }
};

DatepickerComboboxDay.prototype.handleKeyDown = function (event) {
  var flag = false;

  switch (event.keyCode) {

    case this.keyCode.ESC:
      this.datepicker.hide();
      break;

    case this.keyCode.TAB:
      this.datepicker.cancelButtonNode.focus();
      if (event.shiftKey) {
        this.datepicker.nextYearNode.focus();
      }

      this.datepicker.setMessage('');

      flag = true;
      break;

    case this.keyCode.ENTER:
    case this.keyCode.SPACE:
      this.datepicker.setTextboxDate();
      this.datepicker.hide();
      flag = true;
      break;

    case this.keyCode.RIGHT:
      this.datepicker.moveFocusToNextDay();
      flag = true;
      break;

    case this.keyCode.LEFT:
      this.datepicker.moveFocusToPreviousDay();
      flag = true;
      break;

    case this.keyCode.DOWN:
      this.datepicker.moveFocusToNextWeek();
      flag = true;
      break;

    case this.keyCode.UP:
      this.datepicker.moveFocusToPreviousWeek();
      flag = true;
      break;

    case this.keyCode.PAGEUP:
      if (event.shiftKey) {
        this.datepicker.moveToPreviousYear();
      }
      else {
        this.datepicker.moveToPreviousMonth();
      }
      this.datepicker.setFocusDay();
      flag = true;
      break;

    case this.keyCode.PAGEDOWN:
      if (event.shiftKey) {
        this.datepicker.moveToNextYear();
      }
      else {
        this.datepicker.moveToNextMonth();
      }
      this.datepicker.setFocusDay();
      flag = true;
      break;

    case this.keyCode.HOME:
      this.datepicker.moveFocusToFirstDayOfWeek();
      flag = true;
      break;

    case this.keyCode.END:
      this.datepicker.moveFocusToLastDayOfWeek();
      flag = true;
      break;

  }

  if (flag) {
    event.stopPropagation();
    event.preventDefault();
  }

};

DatepickerComboboxDay.prototype.handleMouseDown = function (event) {
  this.datepicker.day = this.day;

  if (!this.isDisabled()) {
    this.datepicker.setTextboxDate(this.day);
    this.datepicker.hide();
  }

  event.stopPropagation();
  event.preventDefault();

};

DatepickerComboboxDay.prototype.handleFocus = function () {
  this.datepicker.setMessage(this.datepicker.messageCursorKeys);
};
