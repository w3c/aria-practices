var DateInput = function (domNode, dates) {
  this.domNode = domNode;
  this.dates = dates;
};

DateInput.prototype.init = function () {
  console.log(this.domNode);
  console.log(document.activeElement);
  this.domNode.addEventListener('keydown', this.handleKeyDown.bind(this));

};
DateInput.prototype.handleKeyDown = function (event) {
  var tgt = event.currentTarget,
  char = event.key,
  flag = false;
  if(event.keyCode === 40){
    this.dates.open(this.dates.dateInput[0]);
    flag = true;
  }
  if(flag) {
    event.stopPropagation(); 
    event.preventDefault();
  }
};

