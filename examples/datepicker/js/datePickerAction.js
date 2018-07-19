var DateAction = function (domNode, month, year) {
    this.domNode=domNode;
    this.selectDate = null;
    this.selectMonth = month;
    this.selectYear = year; 
}

DateAction.prototype.init = function(){
    this.domNode.addEventListener('click', this.handleClick.bind(this));
}
DateAction.prototype.handleClick = function(domNode){
    if(this.domNode.innerHTML === ""){
        return;
    };
    this.selectDate = this.domNode.innerHTML;
   document.getElementById('datepicker').value = this.selectMonth + '/' + this.selectDate + '/' + this.selectYear;
}