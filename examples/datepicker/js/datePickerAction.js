var DateCell = function (domNode, month, year) {
    this.domNode=domNode;
    this.selectDate = null;
    this.selectMonth = month;
    this.selectYear = year; 
}

DateCell.prototype.init = function(){
    this.domNode.addEventListener('click', this.handleClick.bind(this));
}
DateCell.prototype.handleClick = function(domNode){
    console.log(this.domNode.innerHTML);
    if(this.domNode.innerHTML === ""){
        return;
    };
    this.selectDate = this.domNode.innerHTML;
   document.getElementById('id-date-1').value = this.selectMonth + '/' + this.selectDate + '/' + this.selectYear;
}