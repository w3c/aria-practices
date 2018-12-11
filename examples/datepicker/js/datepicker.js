

var months =  ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];


var DatePicker = function (comboboxNode, inputNode,buttonNode,dialogNode) {
  this.body = document;
  this.comboboxNode = comboboxNode;
  this.inputNode = inputNode;
  this.buttonNode = buttonNode;
  this.dialogNode = dialogNode;

  this.MonthYearNode = dialogNode.querySelector('.monthYear');

  this.prevYearNode = dialogNode.querySelector('.prevYear');
  this.prevMonthNode = dialogNode.querySelector('.prevMonth');
  this.nextMonthNode = dialogNode.querySelector('.nextMonth');
  this.nextYearNode = dialogNode.querySelector('.nextYear');

  this.tbodyNode = dialogNode.querySelector('table.dates tbody');

  this.monthIndex = null;
  this.month = null;
  this.year = null;
  this.lastMonthDates = null;
  this.today = null;

  this.datesInMonth = null;
  this.dates = null;

  this.datesArray = [];
  this.datesArrayDOM = [];

  this.headerButtonClicked = false;

  this.selectDate = null;

  this.dialogButton = document.getElementsByClassName('dialogButton');
  var today = new Date();
  this.today = today.getDate();
  this.lastFocused = null;


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
DatePicker.prototype.init = function () {

  this.monthIndex = new Date().getMonth();
  this.year = new Date().getFullYear();
  this.today = new Date().getDate();
  this.datesInMonth = [31, (((this.year % 4 === 0) && (this.year % 100 !== 0) && (this.year % 400 === 0)) ? 29 : 28), 31, 30, 31, 30, 31, 31, 30 ,31, 30, 31];
  this.lastMonthDates = this.datesInMonth[this.monthIndex - 1];
  this.month = months[this.monthIndex];
  this.dates = this.datesInMonth[this.monthIndex];

  this.body.addEventListener('click', this.handleBodyClick.bind(this));


  var di = new DateInput(this.inputNode, this.buttonNode, this);
  di.init();


  for (var i = 0; i < this.dialogButton.length; i++) {
    this.dialogButton[i].addEventListener('click', this.handleDialogButton.bind(this));
    this.dialogButton[i].addEventListener('keydown', this.handleDialogButton.bind(this));
  }

  this.prevMonthNode.addEventListener('click',this.handlePrevMonthButton.bind(this));
  this.nextMonthNode.addEventListener('click',this.handleNextMonthButton.bind(this));
  this.prevYearNode.addEventListener('click',this.handlePrevYearButton.bind(this));
  this.nextYearNode.addEventListener('click',this.handleNextYearButton.bind(this));

  this.prevMonthNode.addEventListener('keydown',this.handlePrevMonthButton.bind(this));
  this.nextMonthNode.addEventListener('keydown',this.handleNextMonthButton.bind(this));
  this.prevYearNode.addEventListener('keydown', this.handlePrevYearButton.bind(this));
  this.nextYearNode.addEventListener('keydown', this.handleNextYearButton.bind(this));


  this.updateCalendar(this.month, this.year);
  for (var i = 0; i < this.datesArray.length; i++) {
    var dc = new DatePickerDay(this.datesArray[i], this);
    dc.init();
    this.datesArrayDOM.push(dc);
  }

  this.lastFocused = this.datesArray[this.today - 1];
};

DatePicker.prototype.handleBodyClick = function () {
  if (this.inputNode.hasAttribute('aria-expanded')) {
    if (this.lastFocused) {
      this.lastFocused.focus();
      this.lastFocused.tabIndex = 0;
    }
    else {
      this.datesArray[this.today - 1].focus();
      this.datesArray[this.today - 1].tabIndex = 0;
    }
  }
};

DatePicker.prototype.open = function () {
  this.dialogNode.style.display = 'block';
  this.comboboxNode.setAttribute('aria-expanded', 'true');
  if (this.lastFocused) {
    this.lastFocused.focus();
    this.lastFocused.tabIndex = 0;
  }
  else {
    this.datesArray[this.today - 1].focus();
    this.datesArray[this.today - 1].tabIndex = 0;
  }


};

DatePicker.prototype.close = function (node) {
  this.dialogNode.style.display = 'none';
  this.comboboxNode.setAttribute('aria-expanded','false');
  this.buttonNode.focus();
};

DatePicker.prototype.handleDialogButton = function (event) {
  var tgt = event.currentTarget;
  var flag = false;
  if (event.type === 'keydown') {
    function isPrintableCharacter (str) {
      return str.length === 1 && str.match(/\S/);
    }
    switch (event.keyCode) {
      case this.keyCode.TAB:
        if (tgt.value === 'ok') {
          this.prevYearNode.focus();
          if (event.shiftKey) {
            this.dialogButton[0].focus();
          }
        }
        else if (tgt.value === 'cancel') {
          this.dialogButton[1].focus();
          if (event.shiftKey) {
            if (this.lastFocused) {
              this.lastFocused.focus();
            }
            else {
              this.datesArray[this.today - 1].focus();
            }
          }
        }
        flag = true;
        break;
      case this.keyCode.RETURN:
      case this.keyCode.SPACE:
        if (tgt.value === 'ok') {
          for (var i = 0; i < this.datesArrayDOM.length; i++) {
            if (this.datesArrayDOM[i].domNode.classList.contains('lastFocused')) {
              this.setSelectDate(this.datesArrayDOM[i]);
            }
          }
        }
        else if (tgt.value === 'cancel') {
          this.close();
        }
      case this.keyCode.ESC:
        this.close();
        flag = true;
        break;
    }
  }
  else if (event.type === 'click') {
    this.close();
    flag = true;
  }
  if (flag) {
    event.stopPropagation();
    event.preventDefault();
  }
};
DatePicker.prototype.handleNextYearButton = function (event) {
  var type = event.type;
  if (type === 'keydown') {
    var tgt = event.currentTarget,
      char = event.key,
      flag = false;
    function isPrintableCharacter (str) {
      return str.length === 1 && str.match(/\S/);
    }
    switch (event.keyCode) {
      case this.keyCode.ESC:
        this.close();
        flag = true;
        break;
      case this.keyCode.TAB:
        if (event.shiftKey) {
          this.nextMonthNode.focus();
        }
        else {
          this.lastFocused ? this.lastFocused.focus() : this.datesArray[this.today - 1].focus();
        }
        flag = true;

        break;
      case this.keyCode.RETURN:
      case this.keyCode.SPACE:
        this.moveToNextYear();
        flag = true;
        break;
    }
  }
  else if (type === 'click') {
    this.moveToNextYear();
  }
  if (flag) {
    event.stopPropagation();
    event.preventDefault();
  }
};
DatePicker.prototype.handlePrevYearButton = function (event) {
  var type = event.type;
  if (type === 'keydown') {
    var tgt = event.currentTarget,
      char = event.key,
      flag = false;
    function isPrintableCharacter (str) {
      return str.length === 1 && str.match(/\S/);
    }
    switch (event.keyCode) {
      case this.keyCode.ESC:
        this.close();
        flag = true;
        break;
      case this.keyCode.TAB:
        if (event.shiftKey) {
          this.dialogButton[1].focus();
        }
        else {
          this.prevMonthNode.focus();
        }
        flag = true;
        break;
      case this.keyCode.RETURN:
      case this.keyCode.SPACE:
        this.moveToPrevYear();
        flag = true;
        break;
    }
  }
  else if (type === 'click') {
    this.moveToPrevYear();
    flag = true;
  }

  if (flag) {
    event.stopPropagation();
    event.preventDefault();
  }
};
DatePicker.prototype.handleNextMonthButton = function (event) {
  var type = event.type;
  if (type === 'keydown') {
    var tgt = event.currentTarget,
      char = event.key,
      flag = false;
    function isPrintableCharacter (str) {
      return str.length === 1 && str.match(/\S/);
    }
    switch (event.keyCode) {
      case this.keyCode.ESC:
        this.close();
        flag = true;
        break;
      case this.keyCode.RETURN:
      case this.keyCode.SPACE:
        this.moveToNextMonth();
        flag = true;
        break;
    }
  }
  else if (type === 'click') {
    this.moveToNextMonth();
    flag = true;
  }
  if (flag) {
    event.stopPropagation();
    event.preventDefault();
  }
};
DatePicker.prototype.handlePrevMonthButton = function (event) {
  var type = event.type;
  if (type === 'keydown') {
    var tgt = event.currentTarget,
      char = event.key,
      flag = false;
    function isPrintableCharacter (str) {
      return str.length === 1 && str.match(/\S/);
    }
    switch (event.keyCode) {
      case this.keyCode.ESC:
        this.close();
        flag = true;
        break;
      case this.keyCode.RETURN:
      case this.keyCode.SPACE:
        this.moveToPrevMonth();
        flag = true;
        break;
    }
  }
  else if (type === 'click') {
    this.moveToPrevMonth();
    flag = true;
  }
  if (flag) {
    event.stopPropagation();
    event.preventDefault();
  }
};
DatePicker.prototype.moveToNextYear = function (dateCell) {

  this.year++;
  this.headerButtonClicked = true;
  this.updateDates();
  if (this.selectDate === null) {
    this.datesArray[0].focus();
  }
  else {
    this.datesArray[parseInt(this.selectDate) - 1].focus();
  }
};


DatePicker.prototype.moveToPrevYear = function (dateCell) {

  this.year--;
  this.headerButtonClicked = true;
  this.updateDates();
  if (this.selectDate == null) {
    this.datesArray[0].focus();
  }
  else {
    this.datesArray[parseInt(this.selectDate) - 1].focus();
  }

};
DatePicker.prototype.moveToPrevMonth = function (dateCell) {

  this.monthIndex--;
  if (this.monthIndex < 0) {
    this.monthIndex = 11;
    this.year--;
  }
  this.headerButtonClicked = true;
  this.updateDates();
  if (this.selectDate == null) {
    this.datesArray[0].focus();
  }
  else {
    this.datesArray[parseInt(this.selectDate) - 1].focus();
  }

};
DatePicker.prototype.moveToNextMonth = function (dateCell) {

  this.monthIndex++;
  if (this.monthIndex > 11) {
    this.monthIndex = 0;
    this.year++;
  }
  this.headerButtonClicked = true;
  this.updateDates();
  if (this.selectDate == null) {
    this.datesArray[0].focus();
  }
  else {
    this.datesArray[parseInt(this.selectDate) - 1].focus();
  }

};

DatePicker.prototype.setFocusToNewMonthYear = function (row, cellPos) {
  if (row[cellPos[0]].children[cellPos[1]] === undefined || row[cellPos[0]].children[cellPos[1]].classList.contains('disabled') || row[cellPos[0]].innerHTML === '') {
    if (cellPos[0] < 1) {
      this.setFocusDate(row[cellPos[0] + 1].children[cellPos[1]].children[0]);
    }
    else {
      cellPos[0]--;
      console.log(cellPos);
      this.setFocusDate(row[cellPos[0]].children[cellPos[1]].children[0]);
    }
  }
  else {
    this.setFocusDate(row[cellPos[0]].children[cellPos[1]].children[0]);
  }
};
DatePicker.prototype.setUpForNewMonthYear = function (row, dateCell) {
  var weekNum, dayNum, cell;
  for (var i = 0; i < row.length;i++) {
    for (var j = 0; j < 7; j++) {
      if (row[i].children[j] === undefined) {
        break;
      }
      else {
        if (row[i].children[j].children[0] === this.lastFocused) {
          weekNum = i;
          dayNum = j;
          break;
        }
      }
    }
  }
  cell = [weekNum, dayNum];
  return cell;
};


DatePicker.prototype.setSelectDate = function (dateCell) {
  for (var i = 0;i < this.datesArrayDOM.length;i++) {
    this.datesArrayDOM[i].domNode.removeAttribute('aria-selected');
    this.datesArrayDOM[i].domNode.tabIndex = '-1';
    if (this.datesArrayDOM[i] === dateCell) {
      this.datesArrayDOM[i].domNode.tabIndex = '0';
      this.datesArrayDOM[i].domNode.focus();
      this.datesArrayDOM[i].domNode.setAttribute('aria-selected','true');
    }
  }
  this.selectDate = dateCell.domNode.innerHTML;

  var numberOfMonth = null;
  var numberOfDate = null;
  if ((this.monthIndex + 1).toString().length === 1) {
    numberOfMonth = '0' + (this.monthIndex + 1);
  }
  else {
    numberOfMonth = this.monthIndex + 1;
  }

  if (this.selectDate.length === 1) {
    numberOfDate = '0' + this.selectDate;
  }
  else {
    numberOfDate = this.selectDate;
  }
  document.getElementById('id-date-1').value = numberOfMonth + '/' + numberOfDate + '/' + this.year;
  this.buttonNode.setAttribute('aria-label', this.month + ' ' + numberOfDate + ' ' + this.year);
  this.close();
};


DatePicker.prototype.setFocusDate = function (button) {
  for (var i = 0; i < this.datesArray.length; i++) {
    var dc = this.datesArray[i];
    if (dc === button) {
      dc.tabIndex = 0;
      dc.focus();
      this.lastFocused = dc;
    }
    else {
      dc.tabIndex = -1;
    }
  }
};

DatePicker.prototype.setFocusToNextDay = function (dateCell) {
  var nextDate = false;
  var nextIndex = this.datesArray.indexOf(dateCell.domNode) + 1;
  if (nextIndex > this.datesArray.length - 1) {
    this.moveToNextMonth();
    nextIndex = 0;
  }
  nextDate = this.datesArray[nextIndex];

  this.setFocusDate(nextDate);
};

DatePicker.prototype.setFocusToNextWeek = function (dateCell) {
  var downDate = false;
  var downIndex = this.datesArray.indexOf(dateCell.domNode) + 7;
  if (downIndex > this.datesArray.length - 1) {
    this.moveToNextMonth();
    downIndex = 0;
  }
  downDate = this.datesArray[downIndex];
  this.setFocusDate(downDate);
};
DatePicker.prototype.setFocusToPrevWeek = function (dateCell) {
  var upDate = false;
  var upIndex = this.datesArray.indexOf(dateCell.domNode) - 7;
  if (upIndex < 0) {
    this.moveToPrevMonth();
    upIndex = this.datesArray.length - 1;
  }
  upDate = this.datesArray[upIndex];
  this.setFocusDate(upDate);
};
DatePicker.prototype.setFocusToPrevDay = function (dateCell) {
  var prevDate = false;
  prevIndex = this.datesArray.indexOf(dateCell.domNode) - 1;

  if (prevIndex < 0) {
    this.moveToPrevMonth();
    prevIndex = this.datesArray.length - 1;
  }
  prevDate = this.datesArray[prevIndex];
  this.setFocusDate(prevDate);
};

DatePicker.prototype.updateDates = function () {

  this.lastMonthDates = this.dates;
  this.datesInMonth[1] = (((this.year % 4 === 0) && (this.year % 100 !== 0) && (this.year % 400 === 0)) ? 29 : 28);
  this.month = months[this.monthIndex]; // show the string of the month
  this.dates = this.datesInMonth[this.monthIndex]; // show the number of dates in that month
  this.datesArray = [];
  this.datesArrayDOM = [];

  this.updateCalendar(this.month, this.year);
};
DatePicker.prototype.updateCalendar = function (month, year) {

  this.MonthYearNode.innerHTML = month + ' ' + year;
  var firstDateOfMonth = new Date(this.year, this.monthIndex, 1);
  var startDay = firstDateOfMonth.getDay();

  this.tbodyNode.innerHTML = '';
  for (var i = 0; i < 6;i++) {
    var row = this.tbodyNode.insertRow(i);
    row.classList.add('dateRow');
  }

  var tableRow = document.getElementsByClassName('dateRow');
  for (var i = 0; i < tableRow.length;i++) {
    for (var j = 0;j < 7; j++) {
      var cell = document.createElement('td');
      var cellButton = document.createElement('button');
      cell.appendChild(cellButton);
      tableRow[i].appendChild(cell);
      cellButton.classList.add('dateCell');
      cell.classList.add('date');
    }
  }
  var dateCells = document.querySelectorAll('.dateCell');
  var cells = document.querySelectorAll('.date');


  for (var i = startDay - 1; i >= 0; i--) {
    dateCells[i].innerHTML = this.lastMonthDates;
    dateCells[i].setAttribute('value', '0');
    this.lastMonthDates--;
  }

  for (var i = 1;i <= this.dates;i++) {
    dateCells[startDay].innerHTML = i;
    dateCells[startDay].setAttribute('value', i);
    startDay++;
  }

  if (this.tbodyNode.rows[tableRow.length - 1].cells[0].querySelector('button').innerHTML === '') {
    this.tbodyNode.rows[tableRow.length - 1].innerHTML = '';
    this.tbodyNode.rows[tableRow.length - 1].style.height = '40px';
  }
  var j = 1;
  for (var i = startDay; i < dateCells.length; i++) {
    dateCells[i].innerHTML = j;
    dateCells[i].setAttribute('value', '0');
    j++;
  }


  for (var i = 0;i < dateCells.length;i++) {
    if (dateCells[i].getAttribute('value') === '0') {
      dateCells[i].disabled = true;
      dateCells[i].setAttribute('tabIndex', '1');
      cells[i].classList.add('disabled');
    }
    else {
      this.datesArray.push(dateCells[i]);
    }
  }

  if (this.headerButtonClicked) { // if the calendar toggled to previous month/year
    for (var i = 0;i < this.datesArray.length;i++) {
      var dc = new DatePickerDay(this.datesArray[i], this);
      dc.init();
      this.datesArrayDOM.push(dc);
    }
  }
  this.headerButtonClicked = false;
  return true;
};

// Initialize date picker

window.addEventListener('load' , function () {

  var datePickers = document.querySelectorAll('.datepicker');

  datePickers.forEach( function (dp) {
      var dpInput    = dp.querySelector('input');
      var dpButton   = dp.querySelector('button');
      var dpDialog   = document.getElementById(dp.getAttribute('aria-owns'));
      var datePicker = new DatePicker(dp, dpInput, dpButton, dpDialog);
      datePicker.init();
    }
  );

});

