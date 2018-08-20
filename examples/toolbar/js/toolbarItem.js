var ToolbarItem = function (domNode, toolObj) {
  this.toolbar = toolObj;
  this.domNode = domNode;


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

ToolbarItem.prototype.init = function () {
  this.domNode.addEventListener('keydown', this.handleKeyDown.bind(this));
  this.domNode.addEventListener('click', this.handleClick.bind(this));
  this.domNode.addEventListener('focus', this.handleFocus.bind(this));
  this.domNode.addEventListener('blur', this.handleBlur.bind(this));
};
ToolbarItem.prototype.handleBlur = function (event) {
  this.toolbar.domNode.classList.remove('focused');
};
ToolbarItem.prototype.handleFocus = function (event) {
  this.toolbar.domNode.classList.add('focused');
};
ToolbarItem.prototype.handleKeyDown = function (event) {
  var tgt = event.currenttarget,
    char = event.key,
    flag = false,
    clickEvent;
  function isPrintableCharacter (str) {
    return str.length === 1 && str.match(/\S/);
  }
  switch (event.keyCode) {
    case this.keyCode.RETURN:
    case this.keyCode.SPACE:
      this.toolbar.selectItem(this.domNode);
      flag = true;
      break;
    case this.keyCode.RIGHT:
      this.toolbar.setFocusToNext(this);
      flag = true;
      break;
    case this.keyCode.LEFT:
      this.toolbar.setFocusToPrevious(this);
      flag = true;
      break;
    case this.keyCode.HOME:
      this.toolbar.setFocusToFirst(this);
      flag = true;
      break;
    case this.keyCode.END:
      this.toolbar.setFocusToLast(this);
      flag = true;
      break;
  }

  if (flag) {
    event.stopPropagation();
    event.preventDefault();
  }

};

ToolbarItem.prototype.handleClick = function () {
  this.toolbar.selectItem(this.domNode);
};
