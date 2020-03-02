/*
*   This content is licensed according to the W3C Software License at
*   https://www.w3.org/Consortium/Legal/2015/copyright-software-and-document
*
*   File:   ComboboxDatePickerDay.js
*/

var ComboboxDatePickerDay = function (domNode, datepicker) {

  this.day = new Date();

  this.domNode = domNode;
  this.datepicker = datepicker;

};

ComboboxDatePickerDay.prototype.init = function () {
  this.domNode.setAttribute('tabindex', '-1');
  this.domNode.addEventListener('click', this.handleClick.bind(this));
  this.domNode.addEventListener('keydown', this.handleKeyDown.bind(this));
  this.domNode.addEventListener('focus', this.handleFocus.bind(this));

  this.domNode.innerHTML = '-1';

};

ComboboxDatePickerDay.prototype.isDisabled = function () {
  return this.domNode.classList.contains('disabled');
};

ComboboxDatePickerDay.prototype.updateDay = function (disable, day, selected) {

  this.day = new Date(day);

  var d = this.day.getDate().toString();
  if (this.day.getDate() <= 9) {
    d = '0' + d;
  }

  var m = this.day.getMonth() + 1;
  if (this.day.getMonth() < 9) {
    m = '0' + m;
  }

  this.domNode.setAttribute('tabindex', '-1');
  this.domNode.removeAttribute('aria-selected');
  this.domNode.setAttribute('data-date', this.day.getFullYear() + '-' + m + '-' + d);

  if (disable) {
    this.domNode.classList.add('disabled');
    this.domNode.innerHTML = '';
  }
  else {
    this.domNode.classList.remove('disabled');
    this.domNode.innerHTML = this.day.getDate();
    if (selected) {
      this.domNode.setAttribute('aria-selected', 'true');
      this.domNode.setAttribute('tabindex', '0');
    }
  }

};

ComboboxDatePickerDay.prototype.handleKeyDown = function (event) {
  var flag = false;

  switch (event.key) {

    case "Esc":
    case "Escape":
      this.datepicker.close();
      break;

    case "Tab":
      this.datepicker.cancelButtonNode.focus();
      if (event.shiftKey) {
        this.datepicker.nextYearNode.focus();
      }
      this.datepicker.setMessage('');
      flag = true;
      break;

    case "Right":
    case "ArrowRight":
      this.datepicker.moveFocusToNextDay();
      flag = true;
      break;

    case "Left":
    case "ArrowLeft":
      this.datepicker.moveFocusToPreviousDay();
      flag = true;
      break;

    case "Down":
    case "ArrowDown":
      this.datepicker.moveFocusToNextWeek();
      flag = true;
      break;

    case "Up":
    case "ArrowUp":
      this.datepicker.moveFocusToPreviousWeek();
      flag = true;
      break;

    case "PageUp":
      if (event.shiftKey) {
        this.datepicker.moveToPreviousYear();
      }
      else {
        this.datepicker.moveToPreviousMonth();
      }
      this.datepicker.setFocusDay();
      flag = true;
      break;

    case "PageDown":
      if (event.shiftKey) {
        this.datepicker.moveToNextYear();
      }
      else {
        this.datepicker.moveToNextMonth();
      }
      this.datepicker.setFocusDay();
      flag = true;
      break;

    case "Home":
      this.datepicker.moveFocusToFirstDayOfWeek();
      flag = true;
      break;

    case "End":
      this.datepicker.moveFocusToLastDayOfWeek();
      flag = true;
      break;
  }

  if (flag) {
    event.stopPropagation();
    event.preventDefault();
  }
};

ComboboxDatePickerDay.prototype.handleClick = function (event) {

  if (!this.isDisabled()) {
    this.datepicker.setComboboxDate(this);
    this.datepicker.close();
  }

  event.stopPropagation();
  event.preventDefault();

};

ComboboxDatePickerDay.prototype.handleFocus = function () {
  this.datepicker.setMessage(this.datepicker.messageCursorKeys);
};

