var DateAction = function (domNode, month, year) {
    this.domNode=domNode;
    this.selectDate=null;
    this.selectMonth = month;
    this.selectYear = year; 
}

DateAction.prototype.init = function(){
    this.domNode.addEventListener('click', this.handleClick.bind(this));
}
DateAction.prototype.handleClick = function(domNode){
   this.selectDate = this.domNode.innerHTML;
   console.log(this.selectDate);
   document.getElementById('datepicker').value = this.selectMonth + '/' + this.selectDate + '/' + this.selectYear;
}