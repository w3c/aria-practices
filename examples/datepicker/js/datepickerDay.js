var DatePickerDay = function (domNode,datepicker) {

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
  this.domNode.tabIndex = -1;
  this.domNode.addEventListener('click', this.handleClick.bind(this));
  this.domNode.addEventListener('keydown', this.handleKeyDown.bind(this));

};

DatePickerDay.prototype.handleKeyDown = function (event) {
  var tgt = event.currentTarget,
    char = event.key,
    flag = false,
    clickEvent;
  function isPrintableCharacter (str) {
    return str.length === 1 && str.match(/\S/);
  }
  switch (event.keyCode) {

    case this.keyCode.ESC:
      this.datepicker.close();
      break;

    case this.keyCode.TAB:
      this.datepicker.dialogButton[0].focus();
      if (event.shiftKey) {
        this.datepicker.nextYearNode.focus();
      }
      flag = true;
      break;
    case this.keyCode.RETURN:
    case this.keyCode.SPACE:
      this.datepicker.setSelectDate(this);
      flag = true;
      break;
    case this.keyCode.RIGHT:
      this.datepicker.setFocusToNextDay(this);
      flag = true;
      break;
    case this.keyCode.LEFT:
      this.datepicker.setFocusToPrevDay(this);
      flag = true;
      break;
    case this.keyCode.UP:
      this.datepicker.setFocusToPrevWeek(this);
      flag = true;
      break;
    case this.keyCode.DOWN:
      this.datepicker.setFocusToNextWeek(this);
      flag = true;
      break;
    case this.keyCode.PAGEUP:
      var row = document.getElementsByClassName('dateRow');
      var cell = this.datepicker.setUpForNewMonthYear(row, this);
      if (event.shiftKey) {
        this.datepicker.moveToPrevYear(this);
      }
      else {
        this.datepicker.moveToPrevMonth(this);
      }
      console.log(cell);
      var newRow = document.getElementsByClassName('dateRow');
      this.datepicker.setFocusToNewMonthYear(newRow, cell);
      console.log(cell);

      flag = true;
      break;
    case this.keyCode.PAGEDOWN:
      var row = document.getElementsByClassName('dateRow');
      var cell = this.datepicker.setUpForNewMonthYear(row, this);
      if (event.shiftKey) {
        this.datepicker.moveToNextYear(this);
      }
      else {
        this.datepicker.moveToNextMonth(this);
      }
      this.datepicker.setFocusToNewMonthYear(row, cell);
      flag = true;
      break;
  }

  if (flag) {
    event.stopPropagation();
    event.preventDefault();
  }

};
DatePickerDay.prototype.handleClick = function (event) {
  this.datepicker.setSelectDate(this);
  event.stopPropagation();
  event.preventDefault();

};
