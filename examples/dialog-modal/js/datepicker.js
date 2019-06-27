/*
*   This content is licensed according to the W3C Software License at
*   https://www.w3.org/Consortium/Legal/2015/copyright-software-and-document
*
*   File:   datepicker.js
*/

var CalendarButtonInput = CalendarButtonInput || {};
var DatePickerDay = DatePickerDay || {};

var DatePicker = function (inputNode, buttonNode, messageNode, dialogNode) {
  this.dayLabels = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  this.monthLabels = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

  this.inputNode   = inputNode;
  this.buttonNode  = buttonNode;
  this.messageNode = messageNode;
  this.dialogNode  = dialogNode;

  this.dateInput = new CalendarButtonInput(this.inputNode, this.buttonNode, this.messageNode, this);

  this.MonthYearNode = this.dialogNode.querySelector('.monthYear');

  this.prevYearNode = this.dialogNode.querySelector('.prevYear');
  this.prevMonthNode = this.dialogNode.querySelector('.prevMonth');
  this.nextMonthNode = this.dialogNode.querySelector('.nextMonth');
  this.nextYearNode = this.dialogNode.querySelector('.nextYear');

  this.okButtonNode = this.dialogNode.querySelector('button[value="ok"]');
  this.cancelButtonNode = this.dialogNode.querySelector('button[value="cancel"]');

  this.tbodyNode = this.dialogNode.querySelector('table.dates tbody');

  this.lastRowNode = null;

  var date = new Date();

  this.year = date.getFullYear();
  this.month = date.getMonth();
  this.day = date.getDate() - 1;

  this.daysInCurrentMonth = this.getDaysInMonth();
  this.daysInLastMonth = this.getDaysInLastMonth();

  this.days = [];

  this.selectedDay = new Date(this.year, this.month, this.day);

  this.currentDay = null;

  this.hasFocusFlag = false;
  this.isMouseDownOnBackground = false;

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

DatePicker.prototype.init = function () {

  this.dateInput.init();

  this.okButtonNode.addEventListener('click', this.handleOkButton.bind(this));
  this.okButtonNode.addEventListener('keydown', this.handleOkButton.bind(this));

  this.cancelButtonNode.addEventListener('click', this.handleCancelButton.bind(this));
  this.cancelButtonNode.addEventListener('keydown', this.handleCancelButton.bind(this));

  this.prevMonthNode.addEventListener('click', this.handlePreviousMonthButton.bind(this));
  this.nextMonthNode.addEventListener('click', this.handleNextMonthButton.bind(this));
  this.prevYearNode.addEventListener('click', this.handlePreviousYearButton.bind(this));
  this.nextYearNode.addEventListener('click', this.handleNextYearButton.bind(this));

  this.prevMonthNode.addEventListener('keydown', this.handlePreviousMonthButton.bind(this));
  this.nextMonthNode.addEventListener('keydown', this.handleNextMonthButton.bind(this));
  this.prevYearNode.addEventListener('keydown', this.handlePreviousYearButton.bind(this));

  this.nextYearNode.addEventListener('keydown', this.handleNextYearButton.bind(this));

  document.body.addEventListener('mousedown', this.handleBackgroundMouseDown.bind(this), true);
  document.body.addEventListener('mouseup', this.handleBackgroundMouseUp.bind(this), true);

  // Create Grid of Dates

  this.tbodyNode.innerHTML = '';
  var index = 0;
  for (var i = 0; i < 6;i++) {
    var row = this.tbodyNode.insertRow(i);
    this.lastRowNode = row;
    row.classList.add('dateRow');
    for (var j = 0;j < 7; j++) {
      var cell = document.createElement('td');
      cell.classList.add('dateCell');
      var cellButton = document.createElement('button');
      cellButton.classList.add('dateButton');
      cell.appendChild(cellButton);
      row.appendChild(cell);
      var dpDay = new DatePickerDay(cellButton, this, index, i, j);
      dpDay.init();
      this.days.push(dpDay);
      index++;
    }
  }

  this.updateGrid();
  this.setFocusDay();
};

DatePicker.prototype.updateGrid = function (year, month) {

  var i;

  if (typeof year !== 'number') {
    year = this.year;
  }

  if (typeof month !== 'number') {
    month = this.month;
  }

  this.MonthYearNode.innerHTML = this.monthLabels[month] + ' ' + year;

  this.daysInCurrentMonth = this.getDaysInMonth(year, month);

  var lastMonth = month - 1;
  var lastYear = year;
  if (lastMonth < 0) {
    lastMonth = 11;
    lastYear = year - 1;
  }

  var daysInLastMonth = this.getDaysInMonth(lastYear, lastMonth);
  this.daysInLastMonth = daysInLastMonth;

  var nextMonth = month + 1;
  var nextYear = year;
  if (nextMonth > 11) {
    nextMonth = 1;
    nextYear = year + 1;
  }

  var firstDayOfMonth = new Date(year, month, 1);
  var dayOfWeek = firstDayOfMonth.getDay();

  for (i = dayOfWeek - 1; i >= 0; i--) {
    daysInLastMonth--;
    this.days[i].updateDay(true, lastYear, lastMonth, daysInLastMonth);
  }

  for (i = 0; i < this.daysInCurrentMonth; i++) {
    var dpDay = this.days[dayOfWeek + i];
    dpDay.updateDay(false, year, month, i);
    if ((this.selectedDay.getFullYear() === year) &&
        (this.selectedDay.getMonth() === month) &&
        (this.selectedDay.getDate() === i)) {
      dpDay.domNode.setAttribute('aria-selected', 'true');
    }
  }

  var remainingButtons = 42 - this.daysInCurrentMonth - dayOfWeek;

  if (remainingButtons >= 7) {
    remainingButtons = remainingButtons - 7;
    this.hideLastRow();
  }
  else {
    this.showLastRow();
  }

  for (i = 0; i < remainingButtons; i++) {
    this.days[dayOfWeek + this.daysInCurrentMonth + i].updateDay(true, nextYear, nextMonth, i);
  }

};

DatePicker.prototype.onFirstRow = function () {
  var cd = this.currentDay;
  var flag = cd.row === 0;
  flag = flag || ((cd.row === 1) && this.days[cd.index - 7].isDisabled());
  return flag;
};

DatePicker.prototype.onLastRow = function () {
  var cd = this.currentDay;
  var flag = cd.row === 5;
  flag = flag || ((cd.row === 3) && this.days[cd.index + 7].isDisabled());
  flag = flag || ((cd.row === 4) && this.days[cd.index + 7].isDisabled());
  return flag;
};


// If after updating the grid the current day is on a disabled button move it to an enabled button in the same column
DatePicker.prototype.adjustCurrentDay = function (onFirstRow, onLastRow) {
  var cd = this.currentDay;

  if (typeof onFirstRow !== 'boolean') {
    onFirstRow = false;
  }

  if (typeof onLastRow !== 'boolean') {
    onLastRow = false;
  }

  if (cd.isDisabled()) {
    if (cd.row === 0) {
      this.day = this.days[cd.index + 7].day;
    }
    else {
      if (this.days[cd.index - 7].isDisabled()) {
        this.day = this.days[cd.index - 14].day;
      }
      else {
        this.day = this.days[cd.index - 7].day;
      }
    }
  }
  else {
    if (onFirstRow && (cd.row === 1) && (!this.days[cd.index - 7].isDisabled())) {
      this.day = this.days[cd.index - 7].day;
    }
    else {
      if (onLastRow &&
          ((cd.row === 3) || (cd.row === 4)) &&
          (!this.days[cd.index + 7].isDisabled())) {
        this.day = this.days[cd.index + 7].day;
      }
      else {
        this.day = cd.day;
      }
    }
  }
};

DatePicker.prototype.hideLastRow = function () {
  this.lastRowNode.style.visibility = 'hidden';
};

DatePicker.prototype.showLastRow = function () {
  this.lastRowNode.style.visibility = 'visible';
};

DatePicker.prototype.setFocusDay = function (flag) {

  if (typeof flag !== 'boolean') {
    flag = true;
  }

  this.dateInput.setMessage('');

  function checkDay (d) {
    d.domNode.setAttribute('tabindex', '-1');
    if ((d.day == this.day) &&
        (d.month == this.month)) {
      this.currentDay = d;
      d.domNode.setAttribute('tabindex', '0');

      if (flag) {
        if (!this.hasFocusFlag) {
          this.dateInput.setMessage('Use the cursor keys to navigate the date picker grid.');
        }

        this.hasFocusFlag = true;
        d.domNode.focus();
      }
    }
  }

  this.days.forEach(checkDay.bind(this));
};

DatePicker.prototype.updateDate = function (year, month, day) {
  this.year = year;
  this.month = month;
  this.day = day;
};

DatePicker.prototype.getDaysInLastMonth = function (year, month) {

  if (typeof year !== 'number') {
    year = this.year;
  }

  if (typeof month !== 'number') {
    month = this.month;
  }

  var lastMonth = month - 1;
  var lastYear = year;
  if (lastMonth < 0) {
    lastMonth = 11;
    lastYear = year - 1;
  }

  return this.getDaysInMonth(lastYear, lastMonth);

};

DatePicker.prototype.getDaysInMonth = function (year, month) {

  if (typeof year !== 'number') {
    year = this.year;
  }

  if (typeof month !== 'number') {
    month = this.month;
  }

  switch (month) {

    case 0:
    case 2:
    case 4:
    case 6:
    case 7:
    case 9:
    case 11:
      return 31;

    case 1:
      return (((this.yearIndex % 4 === 0) && (this.yearIndex % 100 !== 0) && (this.yearIndex % 400 === 0)) ? 29 : 28);

    case 3:
    case 5:
    case 8:
    case 10:
      return 30;

    default:
      break;

  }

  return -1;

};

DatePicker.prototype.show = function () {

  this.dialogNode.style.display = 'block';
  this.dialogNode.style.zIndex = 2;

  this.dateInput.setAriaExpanded(true);
  this.getDateInput();
  this.updateGrid();

  return this.hasFocusFlag;
};

DatePicker.prototype.isOpen = function () {
  return this.dateInput.getAriaExpanded();
};

DatePicker.prototype.hide = function (ignore) {

  if (typeof ignore !== 'boolean') {
    ignore = true;
  }

  this.dialogNode.style.display = 'none';
  this.dateInput.setAriaExpanded(false);

  this.hasFocusFlag = false;
  this.dateInput.ignoreFocusEvent = ignore;
  this.dateInput.setFocus();
};

DatePicker.prototype.handleBackgroundMouseDown = function (event) {
  if (!this.inputNode.parentNode.contains(event.target) &&
      !this.dialogNode.contains(event.target)) {

    this.isMouseDownOnBackground = true;

    if (this.isOpen()) {
      this.hide();
      event.stopPropagation();
      event.preventDefault();
    }
  }
};

DatePicker.prototype.handleBackgroundMouseUp = function () {
  this.isMouseDownOnBackground = false;
};


DatePicker.prototype.handleOkButton = function (event) {
  var flag = false;

  switch (event.type) {
    case 'keydown':

      switch (event.keyCode) {
        case this.keyCode.ENTER:
        case this.keyCode.SPACE:

          this.setTextboxDate();

          this.hide();
          flag = true;
          break;

        case this.keyCode.TAB:
          if (!event.shiftKey) {
            this.prevYearNode.focus();
            flag = true;
          }
          break;

        case this.keyCode.ESC:
          this.hide();
          flag = true;
          break;

        default:
          break;

      }
      break;

    case 'click':
      this.setTextboxDate();
      this.hide();
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

DatePicker.prototype.handleCancelButton = function (event) {
  var flag = false;

  switch (event.type) {
    case 'keydown':

      switch (event.keyCode) {
        case this.keyCode.ENTER:
        case this.keyCode.SPACE:
          this.hide();
          flag = true;
          break;

        case this.keyCode.ESC:
          this.hide();
          flag = true;
          break;

        default:
          break;

      }
      break;

    case 'click':
      this.hide();
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

DatePicker.prototype.handleNextYearButton = function (event) {
  var flag = false;
  var onFirstRow = this.onFirstRow();
  var onLastRow = this.onLastRow();

  switch (event.type) {

    case 'keydown':

      switch (event.keyCode) {
        case this.keyCode.ESC:
          this.hide();
          flag = true;
          break;

        case this.keyCode.ENTER:
        case this.keyCode.SPACE:
          this.moveToNextYear();
          this.adjustCurrentDay(onFirstRow, onLastRow);
          this.setFocusDay(false);
          flag = true;
          break;
      }

      break;

    case 'click':
      if (!this.hasFocusFlag) {
        this.dateInput.ignoreBlurEvent = true;
      }
      this.moveToNextYear();
      this.adjustCurrentDay(onFirstRow, onLastRow);
      this.setFocusDay(false);
      break;

    default:
      break;
  }

  if (flag) {
    event.stopPropagation();
    event.preventDefault();
  }
};

DatePicker.prototype.handlePreviousYearButton = function (event) {
  var flag = false;
  var onFirstRow = this.onFirstRow();
  var onLastRow = this.onLastRow();

  switch (event.type) {

    case 'keydown':

      switch (event.keyCode) {

        case this.keyCode.ENTER:
        case this.keyCode.SPACE:
          this.moveToPreviousYear();
          this.adjustCurrentDay(onFirstRow, onLastRow);
          this.setFocusDay(false);
          flag = true;
          break;

        case this.keyCode.TAB:
          if (event.shiftKey) {
            this.okButtonNode.focus();
            flag = true;
          }
          break;

        case this.keyCode.ESC:
          this.hide();
          flag = true;
          break;

        default:
          break;
      }

      break;

    case 'click':
      if (!this.hasFocusFlag) {
        this.dateInput.ignoreBlurEvent = true;
      }
      this.moveToPreviousYear();
      this.adjustCurrentDay(onFirstRow, onLastRow);
      this.setFocusDay(false);
      break;

    default:
      break;
  }

  if (flag) {
    event.stopPropagation();
    event.preventDefault();
  }
};

DatePicker.prototype.handleNextMonthButton = function (event) {
  var flag = false;
  var onFirstRow = this.onFirstRow();
  var onLastRow = this.onLastRow();

  switch (event.type) {

    case 'keydown':

      switch (event.keyCode) {
        case this.keyCode.ESC:
          this.hide();
          flag = true;
          break;

        case this.keyCode.ENTER:
        case this.keyCode.SPACE:
          this.moveToNextMonth();
          this.adjustCurrentDay(onFirstRow, onLastRow);
          this.setFocusDay(false);
          flag = true;
          break;
      }

      break;

    case 'click':
      if (!this.hasFocusFlag) {
        this.dateInput.ignoreBlurEvent = true;
      }
      this.moveToNextMonth();
      this.adjustCurrentDay(onFirstRow, onLastRow);
      this.setFocusDay(false);
      break;

    default:
      break;
  }

  if (flag) {
    event.stopPropagation();
    event.preventDefault();
  }
};

DatePicker.prototype.handlePreviousMonthButton = function (event) {
  var flag = false;
  var onFirstRow = this.onFirstRow();
  var onLastRow = this.onLastRow();

  switch (event.type) {

    case 'keydown':

      switch (event.keyCode) {
        case this.keyCode.ESC:
          this.hide();
          flag = true;
          break;

        case this.keyCode.ENTER:
        case this.keyCode.SPACE:
          this.moveToPreviousMonth();
          this.adjustCurrentDay(onFirstRow, onLastRow);
          this.setFocusDay(false);
          flag = true;
          break;
      }

      break;

    case 'click':
      if (!this.hasFocusFlag) {
        this.dateInput.ignoreBlurEvent = true;
      }
      this.moveToPreviousMonth();
      this.adjustCurrentDay(onFirstRow, onLastRow);
      this.setFocusDay(false);
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

DatePicker.prototype.moveToNextYear = function () {
  this.year++;
  this.updateGrid();
};

DatePicker.prototype.moveToPreviousYear = function () {
  this.year--;
  this.updateGrid();
};

DatePicker.prototype.moveToPreviousMonth = function () {
  this.month--;
  if (this.month < 0) {
    this.month = 11;
    this.year--;
  }
  this.updateGrid();
};

DatePicker.prototype.moveToNextMonth = function () {
  this.month++;
  if (this.month > 11) {
    this.month = 0;
    this.year++;
  }
  this.updateGrid();
};

DatePicker.prototype.moveToDay = function (day, month, year) {
  this.day   = day;
  this.month = month;
  this.year  = year;
  this.updateGrid();
  this.setFocusDay();
};

DatePicker.prototype.moveFocusToNextDay = function () {

  this.day++;
  if (this.daysInCurrentMonth <= this.day) {
    this.day = 0;
    this.moveToNextMonth();
  }
  this.setFocusDay();
};

DatePicker.prototype.moveFocusToNextWeek = function () {

  this.day += 7;
  if (this.daysInCurrentMonth <= this.day) {
    this.day = this.day - this.daysInCurrentMonth;
    this.moveToNextMonth();
  }
  this.setFocusDay();
};

DatePicker.prototype.moveFocusToPreviousDay = function () {

  this.day--;
  if (this.day < 0) {
    this.moveToPreviousMonth();
    this.day = this.daysInCurrentMonth - 1;
  }
  this.setFocusDay();
};

DatePicker.prototype.moveFocusToPreviousWeek = function () {
  this.day -= 7;
  if (this.day < 0) {
    this.day = this.daysInLastMonth + this.day;
    this.moveToPreviousMonth();
  }
  this.setFocusDay();
};

DatePicker.prototype.moveFocusToFirstDayOfWeek = function () {

  this.day = this.day - this.currentDay.column;

  if (this.day < 0) {
    this.day = this.daysInLastMonth + this.day;
    this.moveToPreviousMonth();
  }
  this.setFocusDay();

};

DatePicker.prototype.moveFocusToLastDayOfWeek = function () {

  this.day = this.day + (6 - this.currentDay.column);

  if (this.daysInCurrentMonth <= this.day) {
    this.day = this.day - this.daysInCurrentMonth;
    this.moveToNextMonth();
  }
  this.setFocusDay();

};

DatePicker.prototype.setTextboxDate = function () {
  this.dateInput.setDate(this.month, this.day, this.year);
};

DatePicker.prototype.getDateInput = function () {

  var parts = this.dateInput.getDate().split('/');

  if ((parts.length === 3) &&
      Number.isInteger(parseInt(parts[0])) &&
      Number.isInteger(parseInt(parts[1])) &&
      Number.isInteger(parseInt(parts[2]))) {
    this.month = parseInt(parts[0]) - 1;
    this.day = parseInt(parts[1]) - 1;
    this.year = parseInt(parts[2]);
  }
  else {
    // If not a valid date (MM/DD/YY) initialize with todays date
    var date = new Date();

    this.year = date.getFullYear();
    this.month = date.getMonth();
    this.day = date.getDate() - 1;
  }

  this.daysInCurrentMonth = this.getDaysInMonth();
  this.daysInLastMonth = this.getDaysInLastMonth();

  this.selectedDay = new Date(this.year, this.month, this.day);

};

DatePicker.prototype.getDateForButtonLabel = function () {
  this.selectedDay = new Date(this.year, this.month, this.day + 1);
  var label = this.dayLabels[this.selectedDay.getDay()];
  label += ' ' + this.monthLabels[this.selectedDay.getMonth()];
  label += ' ' + (this.selectedDay.getDate());
  label += ', ' + this.selectedDay.getFullYear();
  return label;
};

