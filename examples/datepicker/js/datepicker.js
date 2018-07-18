
window.addEventListener('load' , function(){
  var tableRow = document.getElementsByClassName('dateRow');
  for(var i=0; i<tableRow.length;i++){
      for(var j=0;j<7; j++){
          var colum = document.createElement('td');
          colum.classList.add('dateColum');
          colum.setAttribute('tabIndex', 0);
          tableRow[i].appendChild(colum);
      }
  }

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
    document.getElementById('label').innerHTML = this.month +' '+ this.year;
    this.firstDateOfMonth = new Date(this.year, this.monthIndex, 1);
    
    var startDay =this.firstDateOfMonth.getDay();

    var dateColum = document.querySelectorAll('.dateColum');
    for(var i in dateColum){
        dateColum[i].innerHTML="";
    }
    for(var i=1;i<=this.dates;i++) {
        dateColum[startDay].innerHTML = i;
        startDay++;
    }

    for(var i=0;i<dateColum.length;i++) {
        if(dateColum[i].innerHTML=== ""){
            dateColum[i].classList.add('null');
            dateColum[i].classList.remove('date');

        } else {
            dateColum[i].classList.remove('null');
            dateColum[i].classList.add('date');
        }
    }


    var dates = document.querySelectorAll('.date')
    for(var i=0;i<dates.length;i++){
      this.dates = new DateAction(dates[i], this.monthIndex+1, this.year);
      this.dates.init();
    }
}

