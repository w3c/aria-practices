var DateCell = function (domNode,dates) {

    this.domNode=domNode;
    this.dates = dates;
   
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
 
    // console.log(this);
    this.domNode.addEventListener('click', this.handleClick.bind(this));
    this.domNode.addEventListener('keydown', this.handleKeyDown.bind(this));

};

DateCell.prototype.handleKeyDown = function(event) {
    var tgt = event.currentTarget,
    char = event.key,
    flag = false,
    clickEvent;
    function isPrintableCharacter (str) {
        return str.length === 1 && str.match(/\S/);
      }
      switch (event.keyCode) {
        case this.keyCode.RETURN:
        case this.keyCode.SPACE:
          console.log(this);
          this.dates.setSelectDate(this);
          flag = true;
          break;
        case this.keyCode.RIGHT:
          this.dates.setFocusToRight(this);
          flag = true;
          break;
        case this.keyCode.LEFT:
          console.log(this);
          this.dates.setFocusToLeft(this);
          flag = true;
          break;
        case this.keyCode.UP:
          this.dates.setFocusToUp(this);
          flag = true;
          break;
        case this.keyCode.DOWN:
          this.dates.setFocusToDown(this);
          flag = true;
          break;
      }

      if (flag) {
        event.stopPropagation();
        event.preventDefault();
      }

};
DateCell.prototype.handleClick = function(event){
    console.log(this.domNode);
    this.dates.setSelectDate(this);
    event.stopPropagation();
    event.preventDefault();

};
