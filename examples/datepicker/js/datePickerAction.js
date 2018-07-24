var DateCell = function (domNode,dates) {

    this.currElement=domNode;
    this.dates = dates;
    this.selectDate = null;
    this.selectMonth = dates.month;
    this.selectYear = dates.year;

    this.dates.datesArray = dates.datesArray;

    this.nextIndex = this.dates.datesArray.indexOf(this.currElement) + 1;
    this.currElement.nextDate = this.dates.datesArray[this.nextIndex];


    this.prevIndex = this.dates.datesArray.indexOf(this.currElement) - 1;
    this.currElement.prevDate = this.dates.datesArray[this.prevIndex];

    this.aboveIndex = this.dates.datesArray.indexOf(this.currElement) + 7;
    this.currElement.aboveDate = this.dates.datesArray[this.aboveIndex];

    this.belowIndex = this.dates.datesArray.indexOf(this.currElement) + 7;
    this.currElement.belowDate = this.dates.datesArray[this.aboveIndex];

    console.log(this.currElement.prevDate);
    console.log(this.currElement.nextDate);


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

DateCell.prototype.init = function(){

  for(var i=0; i<this.dates.datesArray.length;i++){

    this.dates.datesArray[i].addEventListener('click', this.handleClick.bind(this));
    this.dates.datesArray[i].addEventListener('keydown', this.handleKeyDown.bind(this));

  }


};

DateCell.prototype.handleKeyDown = function(event) {
    var tgt = event.currenttarget,
    char = event.key,
    flag = false;
    function isPrintableCharacter (str) {
        return str.length === 1 && str.match(/\S/);
      }
      switch (event.keyCode) {
        case this.keyCode.RETURN:
        case this.keyCode.SPACE:
          this.setSelectDate(this.domNode);
          flag = true;
          break;
        case this.keyCode.RIGHT:
          this.setFocusToRight();
          flag = true;
          break;
        case this.keyCode.LEFT:
          this.setFocusToLeft();
          flag = true;
          break;
        case this.keyCode.UP:
          this.setFocusToUp();
          flag = true;
          break;
        case this.keyCode.DOWN:
          this.setFocusToDown();
          flag = true;
          break;
      }

      if (flag) {
        event.stopPropagation();
        event.preventDefault();
      }

};
DateCell.prototype.handleClick = function(){
    console.log(this.currElement);
    this.setSelectDate(this.currElement);
};
DateCell.prototype.setSelectDate = function () {
    if(this.currElement.innerHTML === ""){
        return;
    };
    this.selectDate = this.currElement.innerHTML;
    document.getElementById('id-date-1').value = this.selectMonth + '/' + this.selectDate + '/' + this.selectYear;
    this.currElement.setAttribute('tabindex', '0');
};
DateCell.prototype.setFocusDate = function (element) {
    for(var i= 0; i<this.dates.datesArray.length;i++){
        this.dates.datesArray[i].setAttribute("tabIndex","-1");
    }

    element.setAttribute("tabIndex","0");
    element.focus();

};

DateCell.prototype.setFocusToRight = function (){
  if(this.currElement.nextDate){
    var pointer = this.currElement;
    this.currElement = this.currElement.nextDate;

    this.nextIndex = this.dates.datesArray.indexOf(this.currElement) + 1;
    this.currElement.nextDate = this.dates.datesArray[this.nextIndex];

    this.aboveIndex = this.dates.datesArray.indexOf(this.currElement) - 7;
    this.currElement.aboveDate = this.dates.datesArray[this.aboveIndex];

    this.belowIndex = this.dates.datesArray.indexOf(this.currElement) + 7;
    this.currElement.belowDate = this.dates.datesArray[this.belowIndex];

    this.currElement.prevDate = pointer;
  }
  else {
      this.dates.toggleNextMonthButton();
      this.dates.datesArray = this.dates.datesArray;

      this.nextIndex = this.dates.datesArray.indexOf(this.currElement) + 1;
      this.currElement.nextDate = this.dates.datesArray[this.nextIndex];

  }


  this.setFocusDate(this.currElement);
}

DateCell.prototype.setFocusToLeft = function () {

  if(this.currElement.prevDate){
    var pointer = this.currElement;

    this.currElement = this.currElement.prevDate;

    this.prevIndex = this.dates.datesArray.indexOf(this.currElement) - 1;
    this.currElement.prevDate = this.dates.datesArray[this.prevIndex];

    this.aboveIndex = this.dates.datesArray.indexOf(this.currElement) - 7;
    this.currElement.aboveDate = this.dates.datesArray[this.aboveIndex];

    this.belowIndex = this.dates.datesArray.indexOf(this.currElement) + 7;
    this.currElement.belowDate = this.dates.datesArray[this.belowIndex];

    this.currElement.nextDate = pointer;
  }
  else {
      this.dates.togglePrevMonthButton();
      this.dates.datesArray = this.dates.datesArray;
      this.currElement = this.dates.datesArray[this.dates.datesArray.length-1];
      this.prevIndex = this.dates.datesArray.indexOf(this.currElement) - 1;
      this.currElement.prevDate = this.dates.datesArray[this.prevIndex];
  }

  this.setFocusDate(this.currElement);
}

DateCell.prototype.setFocusToDown = function () {
  if(this.currElement.belowDate){
    var pointer = this.currElement;

    this.currElement = this.currElement.belowDate;

    this.nextIndex = this.dates.datesArray.indexOf(this.currElement) + 1;
    this.currElement.nextDate = this.dates.datesArray[this.nextIndex];

    this.prevIndex = this.dates.datesArray.indexOf(this.currElement) - 1;
    this.currElement.prevDate = this.dates.datesArray[this.prevIndex];

    this.belowIndex = this.dates.datesArray.indexOf(this.currElement) + 7;
    this.currElement.belowDate = this.dates.datesArray[this.belowIndex];

    this.currElement.aboveDate = pointer;
  }
  else {
      this.dates.toggleNextMonthButton();
      this.dates.datesArray = this.dates.datesArray;

      this.nextIndex = this.dates.datesArray.indexOf(this.currElement) + 1;
      this.currElement.nextDate = this.dates.datesArray[this.nextIndex];

  }

  this.setFocusDate(this.currElement);
}
DateCell.prototype.setFocusToUp = function() {
  if(this.currElement.aboveDate){
    var pointer = this.currElement;
    this.currElement = this.currElement.aboveDate;

    this.prevIndex = this.dates.datesArray.indexOf(this.currElement) - 1;
    this.currElement.prevDate = this.dates.datesArray[this.prevIndex];

    this.nextIndex = this.dates.datesArray.indexOf(this.currElement) + 1;
    this.currElement.nextDate = this.dates.datesArray[this.nextIndex];
    this.currElement.belowDate = pointer;

    this.aboveIndex = this.dates.datesArray.indexOf(this.currElement) - 7;
    this.currElement.aboveDate = this.dates.datesArray[this.aboveIndex];
  }
  else {
      this.dates.togglePrevMonthButton();
      this.dates.datesArray = this.dates.datesArray;
      this.currElement = this.dates.datesArray[this.dates.datesArray.length-1];
      this.prevIndex = this.dates.datesArray.indexOf(this.currElement) - 1;
      this.currElement.prevDate = this.dates.datesArray[this.prevIndex];
  }

  this.setFocusDate(this.currElement);
}
