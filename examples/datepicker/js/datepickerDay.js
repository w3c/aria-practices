var DatePickerDay = function (domNode, datepicker, index, row, column) {

  this.index = index;
  this.row = row;
  this.column = column;

  this.year = -1;
  this.month = -1;
  this.day = -1;

  this.domNode = domNode;
  this.datepicker = datepicker;

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

DatePickerDay.prototype.init = function () {
  this.domNode.setAttribute('tabindex', '-1');
  this.domNode.addEventListener('click', this.handleClick.bind(this));
  this.domNode.addEventListener('keydown', this.handleKeyDown.bind(this));

  this.domNode.innerHTML = '-1';

};

DatePickerDay.prototype.isDisabled = function () {
  return this.domNode.disabled;
};

DatePickerDay.prototype.updateDay = function (disable, year, month, day) {

  this.domNode.disabled = disable;

  this.year = year;
  this.month = month;
  this.day = day;

  this.domNode.innerHTML = day + 1;
  this.domNode.setAttribute('tabindex', '-1');
  this.domNode.removeAttribute('aria-selected');

};

DatePickerDay.prototype.handleKeyDown = function (event) {
  var flag = false;
  var onFirstRow = this.datepicker.onFirstRow();
  var onLastRow = this.datepicker.onLastRow();

  switch (event.keyCode) {

    case this.keyCode.ESC:
      this.datepicker.close();
      break;

    case this.keyCode.TAB:
      this.datepicker.cancelButtonNode.focus();
      if (event.shiftKey) {
        this.datepicker.nextYearNode.focus();
      }
      flag = true;
      break;

    case this.keyCode.RETURN:
    case this.keyCode.SPACE:
      this.datepicker.setTextboxDate();
      this.datepicker.close();
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
      this.datepicker.adjustCurrentDay(onFirstRow, onLastRow);
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
      this.datepicker.adjustCurrentDay(onFirstRow, onLastRow);
      this.datepicker.setFocusDay();
      flag = true;
      break;
  }

  if (flag) {
    event.stopPropagation();
    event.preventDefault();
  }

};

DatePickerDay.prototype.handleClick = function (event) {
  this.datepicker.day = this.day;
  this.datepicker.setFocusDay();

  event.stopPropagation();
  event.preventDefault();

};
