
window.addEventListener('load' , function(){
  var ex = new Dates(document.querySelector('.header'));
  ex.init();
});

const months =  ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

var Dates = function (domNode) {
    this.domNode = domNode;
    this.monthIndex = null;
    this.month = months[this.monthIndex];
    this.year = new Date().getUTCFullYear();


    this.prevYear=domNode.children[0];
    this.prevMonth=domNode.children[1];
    this.nextMonth=domNode.children[3];
    this.nextYear=domNode.children[4];


    this.datesInMonth =[31, (((this.year%4===0)&&(this.year%100!==0)&&(this.year%400===0))?29:28), 31, 30, 31, 30, 31, 31, 30 ,31, 30, 31];
    this.dates= this.datesInMonth[this.monthIndex];    
    
}
Dates.prototype.init = function () {
    console.log(this.domNode.children);
    this.monthIndex = new Date().getUTCMonth();
    console.log(this.nextMonth);
    this.prevMonth.addEventListener('click',this.handlePrevClick.bind(this));
    this.nextMonth.addEventListener('click',this.handleNextClick.bind(this));
    
    this.updateDates();
}

Dates.prototype.handleNextClick = function (){
    console.log('hii');
    this.monthIndex++;
    if(this.monthIndex > 11) {
        this.monthIndex = 0;
        this.year++;
    }
    this.updateDates();
}
Dates.prototype.handlePrevClick = function (){
    this.monthIndex--;
    if(this.monthIndex < 0) {
        this.monthIndex = 11;
        this.year--;
    }
    this.updateDates();
}

Dates.prototype.updateDates = function() {
    this.datesInMonth[1] =(((this.year%4===0)&&(this.year%100!==0)&&(this.year%400===0))?29:28);
    this.month = months[this.monthIndex];
    this.dates= this.datesInMonth[this.monthIndex];
    this.firstDateOfMonth = new Date(this.year, this.monthIndex, 1);
    
    var startDay =this.firstDateOfMonth.getDay();


    document.querySelector('.month-year-label').innerHTML = this.month +' '+ this.year;


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

    var dateCell = document.querySelectorAll('.dateCell');
    for(var i in dateCell){
        dateCell[i].innerHTML="";
    }
    for(var i = 1;i<=this.dates;i++) {
        dateCell[startDay].innerHTML = i;
        startDay++;
    }
    if(tbody.rows[tableRow.length-1].cells[0].querySelector('button').innerHTML === ""){
        tbody.deleteRow(tableRow.length-1);
    }

    for(var i=0;i<dateCell.length;i++){
      if(dateCell[i].innerHTML===""){
          dateCell[i].disabled = true;
      }
      this.dates = new DateCell(dateCell[i], this.monthIndex+1, this.year);
      this.dates.init();
    }
}

