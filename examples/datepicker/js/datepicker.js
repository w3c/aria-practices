
window.addEventListener('load' , function(){
  var ex = new DatePicker(document.querySelector('.header'));
  ex.init();
});

const months =  ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

var DatePicker = function (domNode) {
    this.domNode = domNode;
    this.monthIndex = null;
    this.month = months[this.monthIndex];
    this.year = new Date().getUTCFullYear();
    this.prev=domNode.children[0];
    this.next=domNode.children[2];
    this.datesInMonth =[31, (((this.year%4===0)&&(this.year%100!==0)&&(this.year%400===0))?29:28), 31, 30, 31, 30, 31, 31, 30 ,31, 30, 31];
    this.dates= this.datesInMonth[this.monthIndex];    
    
}
DatePicker.prototype.init = function () {
    this.monthIndex = new Date().getUTCMonth();

    this.prev.addEventListener('click',this.handlePrevClick.bind(this));
    this.next.addEventListener('click',this.handleNextClick.bind(this));
    
    this.updateDatePicker();
}

DatePicker.prototype.handleNextClick = function (){
    this.monthIndex++;
    if(this.monthIndex > 11) {
        this.monthIndex = 0;
        this.year++;
    }
    this.updateDatePicker();
}
DatePicker.prototype.handlePrevClick = function (){
    
    this.monthIndex--;
    if(this.monthIndex < 0) {
        this.monthIndex = 11;
        this.year--;
    }
    this.updateDatePicker();
}

DatePicker.prototype.updateDatePicker = function() {
    this.datesInMonth =[31, (((this.year%4===0)&&(this.year%100!==0)&&(this.year%400===0))?29:28), 31, 30, 31, 30, 31, 31, 30 ,31, 30, 31];
    this.month = months[this.monthIndex];
    this.dates= this.datesInMonth[this.monthIndex];
    this.firstDateOfMonth = new Date(this.year, this.monthIndex, 1);
    
    var startDay =this.firstDateOfMonth.getDay();

    document.getElementById('label').innerHTML = this.month +' '+ this.year;


    var table = document.querySelector('.curr');
    table.innerHTML = "";
    for(var i=0; i<6;i++) {
        var row = table.insertRow(i);
        row.classList.add('dateRow'); 
    }

    var tableRow = document.getElementsByClassName('dateRow');
    for(var i=0; i<tableRow.length;i++){
        for(var j=0;j<7; j++){
            var cell = tableRow[i].insertCell(j);
            cell.classList.add('dateCell');
            cell.setAttribute('tabIndex', 0);
        }
    }

    var dateCell = document.querySelectorAll('.dateCell');
    for(var i in dateCell){
        dateCell[i].innerHTML="";
    }
    for(var i=1;i<=this.dates;i++) {
        dateCell[startDay].innerHTML = i;
        startDay++;
    }

    if(table.rows[tableRow.length-1].cells[0].innerHTML === ""){
        table.deleteRow(tableRow.length-1);
    }

    for(var i=0;i<dateCell.length;i++){
      this.dates = new DateAction(dateCell[i], this.monthIndex+1, this.year);
      this.dates.init();
    }
}

