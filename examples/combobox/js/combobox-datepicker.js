/*
*   This content is licensed according to the W3C Software License at
*   https://www.w3.org/Consortium/Legal/2015/copyright-software-and-document
*
*   File:   ComboboxDatePicker.js
*/

var ComboboxDatePickerDay = ComboboxDatePickerDay || {};

var ComboboxDatePicker = function (cdp) {
  this.dayLabels = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  this.monthLabels = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

  this.messageCursorKeys = 'Cursor keys can navigate dates';
  this.lastMessage = '';

  this.comboboxNode   = cdp.querySelector('input[type="text"');
  this.buttonNode     = cdp.querySelector('.group button');
  this.dialogNode     = cdp.querySelector('[role="dialog"]');
  this.messageNode    = this.dialogNode.querySelector('.dialog-message');

  this.monthYearNode = this.dialogNode.querySelector('.month-year');

  this.prevYearNode  = this.dialogNode.querySelector('.prev-year');
  this.prevMonthNode = this.dialogNode.querySelector('.prev-month');
  this.nextMonthNode = this.dialogNode.querySelector('.next-month');
  this.nextYearNode  = this.dialogNode.querySelector('.next-year');

  this.okButtonNode     = this.dialogNode.querySelector('button[value="ok"]');
  this.cancelButtonNode = this.dialogNode.querySelector('button[value="cancel"]');

  this.tbodyNode = this.dialogNode.querySelector('table.dates tbody');

  this.lastRowNode = null;

  this.days = [];

  this.focusDay = new Date();
  this.selectedDay = new Date(0,0,1);

  this.isMouseDownOnBackground = false;

  this.comboboxHasFocus = false;
  this.dialogHasFocus = false;

};

ComboboxDatePicker.prototype.init = function () {

  this.comboboxNode.addEventListener('keydown', this.handleComboboxKeyDown.bind(this));
  this.comboboxNode.addEventListener('keyup',   this.handleComboboxKeyUp.bind(this));
  this.comboboxNode.addEventListener('click',   this.handleComboboxClick.bind(this));
  this.comboboxNode.addEventListener('focus',   this.handleComboboxFocus.bind(this));
  this.comboboxNode.addEventListener('blur',    this.handleComboboxBlur.bind(this));

  this.buttonNode.addEventListener('click',   this.handleButtonClick.bind(this));

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
  for (var i = 0; i < 6; i++) {
    var row = this.tbodyNode.insertRow(i);
    this.lastRowNode = row;
    for (var j = 0; j < 7; j++) {
      var cell = document.createElement('td');
      var cellButton = document.createElement('button');
      cellButton.setAttribute('type', 'button');
      cell.appendChild(cellButton);
      row.appendChild(cell);
      var dpDay = new ComboboxDatePickerDay(cellButton, this);
      dpDay.init();
      this.days.push(dpDay);
    }
  }

  this.updateGrid();
  this.close();
};

ComboboxDatePicker.prototype.isSameDay = function (day1, day2) {
  return (day1.getFullYear() == day2.getFullYear()) &&
        (day1.getMonth() == day2.getMonth()) &&
        (day1.getDate() == day2.getDate());
};

ComboboxDatePicker.prototype.isNotSameMonth = function (day1, day2) {
  return (day1.getFullYear() != day2.getFullYear()) ||
        (day1.getMonth() != day2.getMonth());
};

ComboboxDatePicker.prototype.updateGrid = function () {

  var i, flag;
  var fd = this.focusDay;

  this.monthYearNode.innerHTML = this.monthLabels[fd.getMonth()] + ' ' + fd.getFullYear();

  var firstDayOfMonth = new Date(fd.getFullYear(), fd.getMonth(), 1);
  var dayOfWeek = firstDayOfMonth.getDay();

  firstDayOfMonth.setDate(firstDayOfMonth.getDate() - dayOfWeek);

  var d = new Date(firstDayOfMonth);

  for (i = 0; i < this.days.length; i++) {
    flag = d.getMonth() != fd.getMonth();
    this.days[i].updateDay(flag, d, this.isSameDay(d, this.selectedDay));
    d.setDate(d.getDate() + 1);
  }
};

ComboboxDatePicker.prototype.setFocusDay = function (flag) {

  if (typeof flag !== 'boolean') {
    flag = true;
  }

  var fd = this.focusDay;

  function checkDay (d) {

    d.domNode.setAttribute('tabindex', '-1');
    if (this.isSameDay(d.day, fd)) {
      d.domNode.setAttribute('tabindex', '0');
      if (flag) {
        d.domNode.focus();
        this.dialogHasFocus = true;
      }
    }
  }


  this.days.forEach(checkDay.bind(this));

};

ComboboxDatePicker.prototype.updateDay = function (day) {
  var d = this.focusDay;
  this.focusDay = day;
  if (this.isNotSameMonth(d, day)) {
    this.updateGrid();
    this.setFocusDay();
  }
};

ComboboxDatePicker.prototype.open = function () {

  this.dialogNode.style.display = 'block';
  this.dialogNode.style.zIndex = 2;

  this.comboboxNode.setAttribute('aria-expanded', 'true')
  this.buttonNode.setAttribute('aria-expanded', 'true')
  this.getDateFromCombobox();
  this.updateGrid();
};

ComboboxDatePicker.prototype.isOpen = function () {
  return window.getComputedStyle(this.dialogNode).display !== 'none';
};

ComboboxDatePicker.prototype.close = function (flag) {

  console.log('[close][            flag]: ' + flag);
  console.log('[close][comboboxHasFocus]: ' + this.comboboxHasFocus);
  console.log('[close][  dialogHasFocus]: ' + this.dialogHasFocus);

  if (typeof flag !== 'boolean') {
    // Default is to move focus to combobox
    flag = true;
  }

  this.setMessage('');
  this.dialogNode.style.display = 'none';
  this.dialogHasFocus = false;
  this.comboboxNode.setAttribute('aria-expanded', 'false')
  this.buttonNode.setAttribute('aria-expanded', 'flase')

  if (flag) {
    this.comboboxNode.focus();
  }
};

ComboboxDatePicker.prototype.handleBackgroundMouseDown = function (event) {

  if (!this.comboboxNode.contains(event.target) &&
      !this.buttonNode.contains(event.target) &&
      !this.dialogNode.contains(event.target)) {

    this.isMouseDownOnBackground = true;

    if (this.isOpen()) {
      this.close(false);
      event.stopPropagation();
      event.preventDefault();
    }
  }
};

ComboboxDatePicker.prototype.handleBackgroundMouseUp = function () {
  this.isMouseDownOnBackground = false;
};


ComboboxDatePicker.prototype.handleOkButton = function (event) {
  var flag = false;

  switch (event.type) {
    case 'keydown':

      switch (event.key) {
        case "Tab":
          if (!event.shiftKey) {
            this.prevYearNode.focus();
            flag = true;
          }
          break;

        case "Esc":
        case "Escape":
          this.close();
          flag = true;
          break;

        default:
          break;

      }
      break;

    case 'click':
      this.setComboboxDate();
      this.close();
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

ComboboxDatePicker.prototype.handleCancelButton = function (event) {
  var flag = false;

  switch (event.type) {
    case 'keydown':

      switch (event.key) {

        case "Esc":
        case "Escape":
          this.close();
          flag = true;
          break;

        default:
          break;

      }
      break;

    case 'click':
      this.close();
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

ComboboxDatePicker.prototype.handleNextYearButton = function (event) {
  var flag = false;

  switch (event.type) {

    case 'keydown':

      switch (event.key) {
        case "Esc":
        case "Escape":
          this.close();
          flag = true;
          break;

        case "Enter":
          this.moveToNextYear();
          this.setFocusDay(false);
          flag = true;
          break;
      }

      break;

    case 'click':
      this.moveToNextYear();
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

ComboboxDatePicker.prototype.handlePreviousYearButton = function (event) {
  var flag = false;

  switch (event.type) {

    case 'keydown':

      switch (event.key) {

        case "Enter":
          this.moveToPreviousYear();
          this.setFocusDay(false);
          flag = true;
          break;

        case "Tab":
          if (event.shiftKey) {
            this.okButtonNode.focus();
            flag = true;
          }
          break;

        case "Esc":
        case "Escape":
          this.close();
          flag = true;
          break;

        default:
          break;
      }

      break;

    case 'click':
      this.moveToPreviousYear();
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

ComboboxDatePicker.prototype.handleNextMonthButton = function (event) {
  var flag = false;

  switch (event.type) {

    case 'keydown':

      switch (event.key) {
        case "Esc":
        case "Escape":
          this.close();
          flag = true;
          break;

        case "Enter":
          this.moveToNextMonth();
          this.setFocusDay(false);
          flag = true;
          break;
      }

      break;

    case 'click':
      this.moveToNextMonth();
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

ComboboxDatePicker.prototype.handlePreviousMonthButton = function (event) {
  var flag = false;

  switch (event.type) {

    case 'keydown':

      switch (event.key) {
        case "Esc":
        case "Escape":
          this.close();
          flag = true;
          break;

        case "Enter":
          this.moveToPreviousMonth();
          this.setFocusDay(false);
          flag = true;
          break;
      }

      break;

    case 'click':
      this.moveToPreviousMonth();
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

ComboboxDatePicker.prototype.moveFocusToDay = function (day) {
  var d = this.focusDay;

  this.focusDay = day;

  if ((d.getMonth() != this.focusDay.getMonth()) ||
      (d.getYear() != this.focusDay.getYear())) {
    this.updateGrid();
  }
  this.setFocusDay();
};


ComboboxDatePicker.prototype.moveToNextYear = function () {
  this.focusDay.setFullYear(this.focusDay.getFullYear() + 1);
  this.updateGrid();
};

ComboboxDatePicker.prototype.moveToPreviousYear = function () {
  this.focusDay.setFullYear(this.focusDay.getFullYear() - 1);
  this.updateGrid();
};

ComboboxDatePicker.prototype.moveToNextMonth = function () {
  this.focusDay.setMonth(this.focusDay.getMonth() + 1);
  this.updateGrid();
};

ComboboxDatePicker.prototype.moveToPreviousMonth = function () {
  this.focusDay.setMonth(this.focusDay.getMonth() - 1);
  this.updateGrid();
};

ComboboxDatePicker.prototype.moveFocusToNextDay = function () {
  var d = new Date(this.focusDay);
  d.setDate(d.getDate() + 1);
  this.moveFocusToDay(d);
};

ComboboxDatePicker.prototype.moveFocusToNextWeek = function () {
  var d = new Date(this.focusDay);
  d.setDate(d.getDate() + 7);
  this.moveFocusToDay(d);
};

ComboboxDatePicker.prototype.moveFocusToPreviousDay = function () {
  var d = new Date(this.focusDay);
  d.setDate(d.getDate() - 1);
  this.moveFocusToDay(d);
};

ComboboxDatePicker.prototype.moveFocusToPreviousWeek = function () {
  var d = new Date(this.focusDay);
  d.setDate(d.getDate() - 7);
  this.moveFocusToDay(d);
};

ComboboxDatePicker.prototype.moveFocusToFirstDayOfWeek = function () {
  var d = new Date(this.focusDay);
  d.setDate(d.getDate() - d.getDay());
  this.moveFocusToDay(d);
};

ComboboxDatePicker.prototype.moveFocusToLastDayOfWeek = function () {
  var d = new Date(this.focusDay);
  d.setDate(d.getDate() + (6 - d.getDay()));
  this.moveFocusToDay(d);
};

ComboboxDatePicker.prototype.setComboboxDate = function (day) {

  var d = '0-0-0';

  if (day) {
    d = day.domNode.getAttribute('data-date');
  }
  else {
    d = this.focusDay.domNode.getAttribute('data-date');
  }

  var parts = d.split('-');

  this.comboboxNode.value = parts[1] + '/' + parts[2] + '/' + parts[0];

};

ComboboxDatePicker.prototype.getDateFromCombobox = function () {

  var parts = this.comboboxNode.value.split('/');

  if ((parts.length === 3) &&
      Number.isInteger(parseInt(parts[0])) &&
      Number.isInteger(parseInt(parts[1])) &&
      Number.isInteger(parseInt(parts[2]))) {
    this.focusDay = new Date(parseInt(parts[2]), parseInt(parts[0]) - 1, parseInt(parts[1]));
    this.selectedDay = new Date(this.focusDay);
  }
  else {
    // If not a valid date (MM/DD/YY) initialize with todays date
    this.focusDay = new Date();
    this.selectedDay = new Date(0,0,1);
  }

};

ComboboxDatePicker.prototype.getDateForButtonLabel = function (year, month, day) {
  if (typeof year !== 'number' || typeof month !== 'number' || typeof day !== 'number') {
    this.selectedDay = this.focusDay;
  }
  else {
    this.selectedDay = new Date(year, month, day);
  }

  var label = this.dayLabels[this.selectedDay.getDay()];
  label += ' ' + this.monthLabels[this.selectedDay.getMonth()];
  label += ' ' + (this.selectedDay.getDate());
  label += ', ' + this.selectedDay.getFullYear();
  return label;
};

ComboboxDatePicker.prototype.setMessage = function (str) {

  function setMessageDelayed () {
    this.messageNode.textContent = str;
  }

  if (str !== this.lastMessage) {
    setTimeout(setMessageDelayed.bind(this), 200);
    this.lastMessage = str;
  }
};

ComboboxDatePicker.prototype.setFocusCombobox = function () {
  this.dialogHasFocus = false;
  this.comboboxNode.focus();
};

ComboboxDatePicker.prototype.handleComboboxKeyDown = function (event) {
  console.log('[handleComboboxKeyDown]');
  var flag = false,
    char = event.key,
    altKey   = event.altKey;

  if (event.ctrlKey || event.shiftKey) {
    return;
  }

  switch (event.key) {

    case "Enter":
    case "Down":
    case "ArrowDown":
      this.open();
      this.setFocusDay();
      flag = true;
      break;

    case "Esc":
    case "Escape":
      if (this.isOpen()) {
        this.close(false);
      }
      else {
        this.comboboxNode.value = '';
      }
      this.option = null;
      flag = true;
      break;

    case "Tab":
      this.close(false);
      break;


    default:
      break;
  }

  if (flag) {
    event.stopPropagation();
    event.preventDefault();
  }

};

ComboboxDatePicker.prototype.handleComboboxKeyUp = function (event) {
  var flag = false,
    option = null,
    char = event.key;

  if (event.key === "Escape" || event.key === "Esc") {
    return;
  }

  switch (event.key) {

    case "Enter":
    case "Left":
    case "ArrowLeft":
    case "Right":
    case "ArrowRight":
    case "Home":
    case "End":
      break;

    default:
      break;
  }

  if (flag) {
    event.stopPropagation();
    event.preventDefault();
  }

};

ComboboxDatePicker.prototype.handleComboboxClick = function (event) {
  console.log('[handleComboboxClick]');
  if (this.isOpen()) {
    this.close(false);
  }
  else {
    this.open();
  }
};

ComboboxDatePicker.prototype.handleComboboxFocus = function (event) {
  this.comboboxHasFocus = true;
};

ComboboxDatePicker.prototype.handleComboboxBlur = function (event) {
  this.comboboxHasFocus = false;
};

ComboboxDatePicker.prototype.handleButtonClick = function (event) {
  if (this.isOpen()) {
    this.close();
  }
  else {
    this.open();
    this.setFocusCombobox();
  }
};



// Initialize menu button date picker

window.addEventListener('load' , function () {

  var comboboxDatePickers = document.querySelectorAll('.combobox-datepicker');

  comboboxDatePickers.forEach(function (dp) {
    var datePicker = new ComboboxDatePicker(dp);
    datePicker.init();
  });

});
