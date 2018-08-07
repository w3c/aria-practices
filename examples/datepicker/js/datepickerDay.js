var DatePickerDay = function (domNode,dates) {

  this.domNode = domNode;
  this.dates = dates;

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
      this.dates.close(this.dates.dateInput[0]);
      break;
    case this.keyCode.TAB:
      this.dates.dialogButton[0].focus();
      if (event.shiftKey) {
        this.dates.nextYear.focus();
      }
      flag = true;
      break;
    case this.keyCode.RETURN:
    case this.keyCode.SPACE:
      this.dates.setSelectDate(this);
      flag = true;
      break;
    case this.keyCode.RIGHT:
      this.dates.setFocusToNextDay(this);
      flag = true;
      break;
    case this.keyCode.LEFT:
      this.dates.setFocusToPrevDay(this);
      flag = true;
      break;
    case this.keyCode.UP:
      this.dates.setFocusToPrevWeek(this);
      flag = true;
      break;
    case this.keyCode.DOWN:
      this.dates.setFocusToNextWeek(this);
      flag = true;
      break;
    case this.keyCode.PAGEUP:
      this.dates.moveToPrevYear();
      flag = true;
      break;
    case this.keyCode.PAGEDOWN:
      this.dates.moveToNextYear();
      flag = true;
      break;
  }

  if (flag) {
    event.stopPropagation();
    event.preventDefault();
  }

};
DatePickerDay.prototype.handleClick = function (event) {
  this.dates.setSelectDate(this);
  event.stopPropagation();
  event.preventDefault();

};
