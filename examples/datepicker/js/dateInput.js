var DateInput = function (domNode,buttonNode, datepicker) {
  this.domNode = domNode;
  this.buttonNode = buttonNode;
  this.datepicker = datepicker;

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

DateInput.prototype.init = function () {
  this.domNode.addEventListener('keydown', this.handleKeyDown.bind(this));
  this.buttonNode.addEventListener('click', this.handleButtonClick.bind(this));
  this.buttonNode.addEventListener('keydown', this.handleButtonKeyDown.bind(this));
};


DateInput.prototype.handleKeyDown = function (event) {
  var tgt = event.currentTarget,
    char = event.key,
    flag = false;
  function isPrintableCharacter (str) {
    return str.length === 1 && str.match(/\S/);
  }
  switch (event.keyCode) {
    case this.keyCode.DOWN:
      this.datepicker.open();
      flag = true;
      break;
    case this.keyCode.ESC:
      this.datepicker.close();
  }
  if (flag) {
    event.stopPropagation();
    event.preventDefault();
  }
};

DateInput.prototype.handleButtonClick = function () {
  if (this.domNode.getAttribute('aria-expanded') === 'true') {
    this.datepicker.close();
  }
  else {
    this.datepicker.open();
  }
};

DateInput.prototype.handleButtonKeyDown = function (event) {
  var tgt = event.currentTarget,
    char = event.key,
    flag = false;
  function isPrintableCharacter (str) {
    return str.length === 1 && str.match(/\S/);
  }
  switch (event.keyCode) {
    case this.keyCode.RETURN:
    case this.keyCode.SPACE:
      this.handleButtonClick();
      flag = true;
      break;
  }
  if (flag) {
    event.stopPropagation();
    event.preventDefault();
  }

};
