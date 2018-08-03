var months =  ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

var DatePicker = function (firstChild, domNode) {
  this.firstChild = firstChild;
  this.domNode = domNode;
  this.monthIndex = null;
  this.month = null;
  this.year = null;
  this.today = null;

  this.prevYear = firstChild.children[0];
  this.prevMonth = firstChild.children[1];
  this.nextMonth = firstChild.children[3];
  this.nextYear = firstChild.children[4];

  this.datesInMonth = null;
  this.dates = null;

  this.datesArray = [];
  this.datesArrayDOM = [];


  this.headerButton;

  this.selectDate = null;

  this.dateInput = document.getElementsByClassName('dateInput');
  this.dateInputArr = [];

  this.dateButton = document.getElementsByClassName('dateButton');

};
DatePicker.prototype.init = function () {

  this.monthIndex = new Date().getMonth();
  this.year = new Date().getFullYear();
  this.today = new Date().getDate();
  this.datesInMonth = [31, (((this.year % 4 === 0) && (this.year % 100 !== 0) && (this.year % 400 === 0)) ? 29 : 28), 31, 30, 31, 30, 31, 31, 30 ,31, 30, 31];

  this.month = months[this.monthIndex];
  this.dates = this.datesInMonth[this.monthIndex];


  var dateInput = document.getElementsByClassName('dateInput');

  for (var i = 0; i < dateInput.length; i++) {
    var di = new DateInput(dateInput[i], this);
    di.init();
    this.dateInputArr.push(di);
  }


  for (var i = 0; i < this.dateButton.length; i++) {
    this.dateButton[i].addEventListener('click', this.handleButtonClick.bind(this));
    this.dateButton[i].addEventListener('keydown', this.handleButtonKeyDown.bind(this));
  }

  this.prevMonth.addEventListener('click',this.handlePrevMonthButton.bind(this));
  this.nextMonth.addEventListener('click',this.handleNextMonthButton.bind(this));
  this.prevYear.addEventListener('click',this.handlePrevYearButton.bind(this));
  this.nextYear.addEventListener('click',this.handleNextYearButton.bind(this));

  this.prevMonth.addEventListener('keydown',this.handlePrevMonthButton.bind(this));
  this.nextMonth.addEventListener('keydown',this.handleNextMonthButton.bind(this));
  this.prevYear.addEventListener('keydown', this.handlePrevYearButton.bind(this));
  this.nextYear.addEventListener('keydown', this.handleNextYearButton.bind(this));


  this.updateCalendar(this.month, this.year);
  for (var i = 0;i < this.datesArray.length;i++) {
    var dc = new DatePickerDay(this.datesArray[i], this);
    dc.init();
    this.datesArrayDOM.push(dc);
  }
};

DatePicker.prototype.handleButtonClick = function () {
    if (this.dateInput[0].hasAttribute('aria-expanded')) {
      this.close(this.dateInput[0]);
    }
    else {
      this.open(this.dateInput[0]);
    }
};
DatePicker.prototype.handleButtonKeyDown = function(event) {
  var tgt = event.currentTarget,
  char = event.key,
  flag = false;
  function isPrintableCharacter (str) {
    return str.length === 1 && str.match(/\S/);
  }

  if(event.keyCode === 13 || event.keyCode === 32) {
    this.handleButtonClick();
    flag = true;
  } 
  if (flag) {
    event.stopPropagation();
    event.preventDefault();
  }
}; 

DatePicker.prototype.open = function (node) {
  this.domNode.style.display = 'block';
  node.setAttribute('aria-expanded', 'true');
  this.prevYear.focus();
};

DatePicker.prototype.close = function (node) {
  this.domNode.style.display = 'none';
  node.removeAttribute('aria-expanded');
  node.focus();
};

DatePicker.prototype.handleNextYearButton = function (event) {
  var type = event.type;
  if (type === 'keydown') {
    if (event.keyCode === 13 || event.keyCode === 32) {
      this.moveToNextYear();
    } else if (event.keyCode === 27){
      this.close(this.dateInput[0]);
    }
  }
  else if (type === 'click') {
    this.moveToNextYear();
  }
};
DatePicker.prototype.handlePrevYearButton = function (event) {
  var type = event.type;
  if (type === 'keydown') {
    if (event.keyCode === 13 || event.keyCode === 32) {
      this.moveToPrevYear();
    } else if (event.keyCode === 27){
      this.close(this.dateInput[0]);
    }
  }
  else if (type === 'click') {
    this.moveToPrevYear();
  }
};
DatePicker.prototype.handleNextMonthButton = function (event) {
  var type = event.type;
  if (type === 'keydown') {
    if (event.keyCode === 13 || event.keyCode === 32) {
      this.moveToNextMonth();
    } else if (event.keyCode === 27){
      this.close(this.dateInput[0]);
    }
  }
  else if (type === 'click') {
    this.moveToNextMonth();
  }
};
DatePicker.prototype.handlePrevMonthButton = function (event) {
  var type = event.type;
  if (type === 'keydown') {
    if (event.keyCode === 13 || event.keyCode === 32) {
      this.moveToPrevMonth();
    } else if (event.keyCode === 27){
      this.close(this.dateInput[0]);
    }
  }
  else if (type === 'click') {
    this.moveToPrevMonth();
  }
};
DatePicker.prototype.moveToNextYear = function () {
  this.year++;
  this.headerButton = true;
  this.updateDates();
  if (this.selectDate === null) {
    this.datesArray[0].focus();
  }
  else {
    this.datesArray[parseInt(this.selectDate) - 1].focus();
  }
};
DatePicker.prototype.moveToPrevYear = function () {
  this.year--;
  this.headerButton = true;
  this.updateDates();
  if (this.selectDate == null) {
    this.datesArray[0].focus();
  }
  else {
    this.datesArray[parseInt(this.selectDate) - 1].focus();
  }
};
DatePicker.prototype.moveToPrevMonth = function () {
  this.monthIndex--;
  if (this.monthIndex < 0) {
    this.monthIndex = 11;
    this.year--;
  }
  this.headerButton = true;
  this.updateDates();
};
DatePicker.prototype.moveToNextMonth = function () {
  this.monthIndex++;
  if (this.monthIndex > 11) {
    this.monthIndex = 0;
    this.year++;
  }
  this.headerButton = true;
  this.updateDates();
};


DatePicker.prototype.setSelectDate = function (dateCell) {
  for (var i = 0;i < this.datesArrayDOM.length;i++) {
    this.datesArrayDOM[i].domNode.setAttribute('aria-selected', 'false');
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

  this.close(this.dateInput[0]);
};


DatePicker.prototype.setFocusDate = function (node) {
  console.log(this.datesArrayDOM);
  console.log(node);
  for (var i = 0; i < this.datesArrayDOM.length;i++) {
    if (this.datesArrayDOM[i].domNode === node) {
      this.datesArrayDOM[i].domNode.focus();
    }
  }
  if(this.prevYear === node ){ 
    this.prevYear.focus();
  }
};

DatePicker.prototype.setFocusToRight = function (dateCell) {
  var nextDate = false;
  var nextIndex = this.datesArray.indexOf(dateCell.domNode) + 1;
  if (nextIndex > this.datesArray.length - 1) {
    console.log('hi');
    this.moveToNextMonth();
    nextIndex = 0;
  }
  nextDate = this.datesArray[nextIndex];

  this.setFocusDate(nextDate);
};

DatePicker.prototype.setFocusToDown = function (dateCell) {
  var downDate = false;
  var downIndex = this.datesArray.indexOf(dateCell.domNode) + 7;
  if (downIndex > this.datesArray.length - 1) {
    this.moveToNextMonth();
    downIndex = 0;
  }
  downDate = this.datesArray[downIndex];
  this.setFocusDate(downDate);
};
DatePicker.prototype.setFocusToUp = function (dateCell) {
  var upDate = false;
  var upIndex = this.datesArray.indexOf(dateCell.domNode) - 7;
  if (upIndex < 0) {
    this.moveToPrevMonth();
    upIndex = this.datesArray.length - 1;
  }
  upDate = this.datesArray[upIndex];
  this.setFocusDate(upDate);
};
DatePicker.prototype.setFocusToLeft = function (dateCell) {
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


  this.datesInMonth[1] = (((this.year % 4 === 0) && (this.year % 100 !== 0) && (this.year % 400 === 0)) ? 29 : 28);
  this.month = months[this.monthIndex]; // show the string of the month
  this.dates = this.datesInMonth[this.monthIndex]; // show the number of dates in that month
  this.datesArray = [];
  this.datesArrayDOM = [];

  this.updateCalendar(this.month, this.year);
};
DatePicker.prototype.updateCalendar = function (month, year) {

  document.querySelector('.month-year-label').innerHTML = month + ' ' + year;
  var firstDateOfMonth = new Date(this.year, this.monthIndex, 1);
  var startDay = firstDateOfMonth.getDay();

  var tbody = document.querySelector('.curr');
  tbody.innerHTML = '';
  for (var i = 0; i < 6;i++) {
    var row = tbody.insertRow(i);
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
      cell.classList.add('cell');
    }
  }
  var dateCells = document.querySelectorAll('.dateCell');
  var cells = document.querySelectorAll('.cell');
  
  var lastMonthDate = this.datesInMonth[this.monthIndex-1];
  for(var i=startDay-1; i >= 0; i--) {
    dateCells[i].innerHTML = lastMonthDate;
    dateCells[i].setAttribute('value', "0");
    lastMonthDate--;
  }
  for (var i = 1;i <= this.dates;i++) {
    dateCells[startDay].innerHTML = i;
    dateCells[startDay].setAttribute('value', i);
    startDay++;
  }
  if (tbody.rows[tableRow.length - 1].cells[0].querySelector('button').innerHTML === '') {
    tbody.deleteRow(tableRow.length - 1);
  }
  var j = 1;
  for(var i = startDay; i< dateCells.length; i++){
    dateCells[i].innerHTML = j;
    dateCells[i].setAttribute('value', '0');
    j++;
  }
 


  for (var i = 0;i < dateCells.length;i++) {
    if (dateCells[i].getAttribute('value') === "0") {
      dateCells[i].disabled = true;
      dateCells[i].setAttribute('tabIndex', '1');
      cells[i].classList.add('disabled');
    }
    else {
      this.datesArray.push(dateCells[i]);
    }
  }

  if (this.headerButton) { // if the calendar toggled to previous month/year
    for (var i = 0;i < this.datesArray.length;i++) {
      var dc = new DatePickerDay(this.datesArray[i], this);
      dc.init();
      this.datesArrayDOM.push(dc);
    }
    this.datesArrayDOM[0].domNode.focus();
  }
  this.headerButton = false;
  return true;
};


