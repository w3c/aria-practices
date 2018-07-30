
window.addEventListener('load' , function(){
  var button = document.getElementsByClassName('dateButton')[0];
  button.addEventListener('click', function(){
      var val = button.getAttribute('aria-expanded');
      if(val === "false"){
        document.getElementsByClassName('datepicker')[0].style.display= 'block';
        button.setAttribute('aria-expanded', 'true');
        var ex = new Dates(document.querySelector('.header'));
        ex.init();
      } else {
        document.getElementsByClassName('datepicker')[0].style.display= 'none';
        button.setAttribute('aria-expanded', 'false');
      }
    });
});

const months =  ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

var Dates = function (domNode) {
    this.domNode = domNode;
    this.monthIndex = null;
    this.month = null;
    this.year = null;

    this.prevYear=domNode.children[0];
    this.prevMonth=domNode.children[1];
    this.nextMonth=domNode.children[3];
    this.nextYear=domNode.children[4];

    this.datesInMonth =null;
    this.dates=null;

    this.dateCells=[];

    this.datesArray=[];
    this.datesArrayDOM = [];

    this.date = null;


    this.prev = false;
    this.next = false;

    this.selectDate = null;

}
Dates.prototype.init = function () {

    this.monthIndex = new Date().getUTCMonth();
    this.year = new Date().getUTCFullYear();
    this.datesInMonth =[31, (((this.year%4===0)&&(this.year%100!==0)&&(this.year%400===0))?29:28), 31, 30, 31, 30, 31, 31, 30 ,31, 30, 31];

    this.month = months[this.monthIndex];
    this.dates = this.datesInMonth[this.monthIndex];


    this.prevMonth.addEventListener('click',this.handlePrevMonthButton.bind(this));
    this.nextMonth.addEventListener('click',this.handleNextMonthButton.bind(this));
    this.prevYear.addEventListener('click',this.handlePrevYearButton.bind(this));
    this.nextYear.addEventListener('click',this.handleNextYearButton.bind(this));

    this.prevMonth.addEventListener('keydown',this.handlePrevMonthButton.bind(this));
    this.nextMonth.addEventListener('keydown',this.handleNextMonthButton.bind(this));
    this.prevYear.addEventListener('keydown', this.handlePrevYearButton.bind(this));
    this.nextYear.addEventListener('keydown', this.handleNextYearButton.bind(this));



    this.updateCalendar(this.month, this.year);
    for(var i=0;i<this.datesArray.length;i++){
        var dc = new DateCell(this.datesArray[i], this);
        dc.init();
        this.datesArrayDOM.push(dc);
    }
    this.datesArray[0].focus();
}

Dates.prototype.handleNextYearButton = function (event){
    var type = event.type;
    if(type==='keydonw'){
        if(event.keyCode === 13 || event.keyCode=== 32) {
            this.toggleNextYearButton();
        }
    } else if(type==='click') {
        this.toggleNextYearButton();
    }
}
Dates.prototype.handlePrevYearButton = function(event) {
    var type = event.type;
    if(type==='keydonw'){
        if(event.keyCode === 13 || event.keyCode=== 32) {
            this.togglePrevYearButton();
        }
    } else if(type==='click') {
        this.togglePrevYearButton();
    }
}
Dates.prototype.handleNextMonthButton = function (event){
    var type = event.type;
    if(type==='keydonw'){
        if(event.keyCode === 13 || event.keyCode=== 32) {
            this.toggleNextMonthButton();
        }
    } else if(type==='click') {
        this.toggleNextMonthButton();
    }
}
Dates.prototype.handlePrevMonthButton = function (event){
    var type = event.type;
    if(type==='keydonw'){
        if(event.keyCode === 13 || event.keyCode=== 32) {
            this.togglePrevMonthButton();
        }
    } else if(type==='click') {
        this.togglePrevMonthButton();
    }
}




Dates.prototype.toggleNextYearButton = function(){
    this.year++;
    this.updateDates();
}
Dates.prototype.togglePrevYearButton = function(){
    this.year--;
    this.updateDates();
}
Dates.prototype.togglePrevMonthButton = function (){
    this.monthIndex--;
    if(this.monthIndex < 0) {
        this.monthIndex = 11;
        this.year--;
    }
    this.prev = true;
    this.updateDates();
}
Dates.prototype.toggleNextMonthButton = function (){
    this.monthIndex++;
    if(this.monthIndex > 11) {
        this.monthIndex = 0;
        this.year++;
    }
    this.next = true;
    this.updateDates();
}


Dates.prototype.setSelectDate = function(dateCell){
    for(var i=0;i<this.datesArrayDOM.length;i++){
        this.datesArrayDOM[i].domNode.setAttribute("aria-selected", "false");
        if(this.datesArrayDOM[i] === dateCell){
            this.datesArrayDOM[i].domNode.tabIndex = '0';
            this.datesArrayDOM[i].domNode.focus();
            this.datesArrayDOM[i].domNode.setAttribute("aria-selected","true");
        }
    }
    console.log(dateCell);
    this.selectDate = dateCell.domNode.innerHTML;
    document.getElementById('id-date-1').value = this.month + '/' + this.selectDate + '/' + this.year;
}
Dates.prototype.setFocusDate = function(node) { 
    console.log(this.datesArrayDOM); 
    console.log(node);
    for(var i=0; i<this.datesArrayDOM.length;i++){
        if(this.datesArrayDOM[i].domNode === node){
            console.log('---');
            this.datesArrayDOM[i].domNode.setAttribute("tabIndex", "0");
            console.log('----');
            this.datesArrayDOM[i].domNode.focus();
        } else {
            this.datesArrayDOM[i].domNode.setAttribute("tabIndex", "-1");
        }
    }
}

Dates.prototype.setFocusToRight = function (dateCell){
    var nextDate = false;
    var nextIndex = this.datesArray.indexOf(dateCell.domNode) + 1;
    if(nextIndex > this.datesArray.length-1) {
        console.log('hi'); 
        this.toggleNextMonthButton();
        nextIndex = 0;
    }
    nextDate = this.datesArray[nextIndex];
 
    this.setFocusDate(nextDate);
  }

Dates.prototype.setFocusToDown = function (dateCell) {
    var downDate = false;
    var downIndex = this.datesArray.indexOf(dateCell.domNode) + 7;
    if(downIndex > this.datesArray.length - 1){
        this.toggleNextMonthButton();
        downIndex = 0;
    }
    downDate = this.datesArray[downIndex];
    this.setFocusDate(downDate);
}
Dates.prototype.setFocusToUp = function (dateCell){
    var upDate = false;
    var upIndex = this.datesArray.indexOf(dateCell.domNode) - 7;
    if(upIndex < 0) {
        this.togglePrevMonthButton();
        upIndex = this.datesArray.length - 1;
    }
    upDate = this.datesArray[upIndex];
    this.setFocusDate(upDate);
}
  Dates.prototype.setFocusToLeft = function (dateCell) {
    var prevDate = false;
    prevIndex = this.datesArray.indexOf(dateCell.domNode) - 1;

    if(prevIndex < 0) {
        this.togglePrevMonthButton();
        prevIndex = this.datesArray.length-1;
    }
    prevDate = this.datesArray[prevIndex];

    console.log(prevDate);
    this.setFocusDate(prevDate);
  }

Dates.prototype.updateDates = function() {


    this.datesInMonth[1] =(((this.year%4===0)&&(this.year%100!==0)&&(this.year%400===0))?29:28);
    this.month = months[this.monthIndex]; // show the string of the month
    this.dates= this.datesInMonth[this.monthIndex]; // show the number of dates in that month
    this.datesArray=[];
    this.datesArrayDOM=[];
    this.tempYear = this.year;

    this.updateCalendar(this.month, this.year);
};
Dates.prototype.updateCalendar = function(month, year) {
  document.querySelector('.month-year-label').innerHTML = month +' '+ year;
  var firstDateOfMonth = new Date(this.year, this.monthIndex, 1);
  var startDay =firstDateOfMonth.getDay();

  var tbody = document.querySelector('.curr');
  tbody.innerHTML = "";
  for(var i=0; i<6;i++) {
      var row = tbody.insertRow(i);
      row.classList.add('dateRow');
  }
  var tableRow = document.getElementsByClassName('dateRow');
  for(var i=0; i<tableRow.length;i++){
      for(var j=0;j<7; j++){
          var cell = document.createElement('td');
          var cellButton = document.createElement('button');
          cell.appendChild(cellButton);
          tableRow[i].appendChild(cell);
          cellButton.classList.add('dateCell');
      }
  }
  this.dateCells = document.querySelectorAll('.dateCell');
  for(var i in this.dateCells){
      this.dateCells[i].innerHTML="";
  }
  for(var i = 1;i<=this.dates;i++) {
      this.dateCells[startDay].innerHTML = i;
      this.dateCells[startDay].setAttribute('value', i);
      startDay++;
  }
  if(tbody.rows[tableRow.length-1].cells[0].querySelector('button').innerHTML === ""){
      tbody.deleteRow(tableRow.length-1);
  }


  for(var i=0;i<this.dateCells.length;i++){
    if(this.dateCells[i].innerHTML===""){
        this.dateCells[i].disabled = true;
        this.dateCells[i].setAttribute('tabIndex', "-1");
    } else {
      this.datesArray.push(this.dateCells[i]);
    }
  }


  if(this.prev) { // if the calendar toggled to previous month/year
    for(var i=0;i<this.datesArray.length;i++){
        var dc = new DateCell(this.datesArray[i], this);
        dc.init();
        this.datesArrayDOM.push(dc);
    }
    this.datesArrayDOM[this.datesArrayDOM.length-1].domNode.focus();
  } else if (this.next) {
    for(var i=0;i<this.datesArray.length;i++){
        var dc = new DateCell(this.datesArray[i], this);
        dc.init();
        this.datesArrayDOM.push(dc);
    }
   
    this.datesArrayDOM[0].domNode.focus();
  }
  this.prev = false;
  this.next = false;
  return true;
}
