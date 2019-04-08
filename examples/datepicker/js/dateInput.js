var DateInput = function (comboboxNode, inputNode, buttonNode, messageNode, datepicker) {
  this.comboboxNode = comboboxNode;
  this.inputNode    = inputNode;
  this.buttonNode   = buttonNode;
  this.messageNode  = messageNode;
  this.imageNode    = false;

  this.datepicker = datepicker;

  this.ignoreFocusEvent = false;
  this.ignoreBlurEvent = false;
  this.lastEventFocus = false;

  this.hasFocusFlag = false;

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
  this.inputNode.addEventListener('keydown', this.handleKeyDown.bind(this));
  this.inputNode.addEventListener('focus', this.handleFocus.bind(this));
  this.inputNode.addEventListener('blur', this.handleBlur.bind(this));
  this.inputNode.addEventListener('click', this.handleClick.bind(this));

  var downArrowNode = this.inputNode.nextElementSibling;

  if (downArrowNode) {
    downArrowNode.addEventListener('click', this.handleClick.bind(this));
  }

  this.buttonNode.addEventListener('click', this.handleButtonClick.bind(this));
  this.buttonNode.addEventListener('touchstart', this.handleTouchStart.bind(this));
  this.buttonNode.addEventListener('keydown', this.handleButtonKeyDown.bind(this));

  if (this.inputNode.nextElementSibling &&
      this.inputNode.nextElementSibling.tagName.toLowerCase() == 'img') {
    this.imageNode = this.inputNode.nextElementSibling;
  }

  if (this.imageNode) {
    this.imageNode.addEventListener('click', this.handleClick.bind(this));
  }

  this.setMessage('');
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
      this.datepicker.show();
      this.ignoreBlurEvent = true;
      this.datepicker.setFocusDay();
      flag = true;
      break;

    case this.keyCode.ESC:
      this.datepicker.hide(false);
      flag = true;
      break;

    case this.keyCode.TAB:
      this.ignoreBlurEvent = true;
      this.datepicker.hide(false);
      break;

    default:
      break;
  }

  if (flag) {
    event.stopPropagation();
    event.preventDefault();
  }
};

DateInput.prototype.handleTouchStart = function (event) {
  if (this.isCollapsed()) {
    this.showDownArrow();
    this.datepicker.show();
    event.stopPropagation();
    event.preventDefault();
    return false;
  }
};

DateInput.prototype.handleFocus = function (event) {
  if (!this.ignoreFocusEvent && this.isCollapsed()) {
    this.datepicker.show();
    this.setMessage('Use the down arrow key to move focus to the datepicker grid.');
  }
  this.showDownArrow();

  this.lastEventFocus = true;
  this.hasFocusFlag = true;
  this.ignoreFocusEvent = false;

};


DateInput.prototype.handleBlur = function () {
  console.log('[DateInput][handleBlur]');
  if (!this.ignoreBlurEvent) {
    this.datepicker.hide(false);
    this.setMessage('');
  }
  this.hideDownArrow();

  this.lastEventFocus = false;
  this.hasFocusFlag = false;
  this.ignoreBlurEvent = false;
};

DateInput.prototype.handleClick = function (event) {
  console.log('[DateInput][handleClick]');
  if (this.lastEventFocus) {
    this.lastEventFocus = false;
    return;
  }

  if (this.isCollapsed()) {
    this.datepicker.show();
  }
  else {
    this.ignoreFocusEvent = true;
    this.datepicker.hide();
  }

  this.lastEventFocus = false;

};

DateInput.prototype.handleButtonClick = function (event) {
  this.ignoreBlurEvent = true;
  this.datepicker.show();
  this.datepicker.setFocusDay();
  event.stopPropagation();
  event.preventDefault();
};

DateInput.prototype.handleButtonKeyDown = function (event) {
  var tgt = event.currentTarget,
    char = event.key,
    flag = false;

  switch (event.keyCode) {
    case this.keyCode.RETURN:
    case this.keyCode.SPACE:
      this.handleButtonClick();
      this.ignoreBlurEvent = true;
      this.setFocusDay();
      flag = true;
      break;
  }

  if (flag) {
    event.stopPropagation();
    event.preventDefault();
  }

};

DateInput.prototype.focus = function () {
  this.inputNode.focus();
};

DateInput.prototype.setAriaExpanded = function (flag) {

  if (flag) {
    this.comboboxNode.setAttribute('aria-expanded', 'true');
    this.inputNode.setAttribute('aria-expanded', 'true');
    this.buttonNode.setAttribute('aria-expanded', 'true');
  }
  else {
    this.comboboxNode.setAttribute('aria-expanded', 'false');
    this.inputNode.setAttribute('aria-expanded', 'false');
    this.buttonNode.setAttribute('aria-expanded', 'false');
  }

};

DateInput.prototype.isCollapsed = function () {
  return this.inputNode.getAttribute('aria-expanded') !== 'true';
};

DateInput.prototype.setDate = function (month, day, year) {
  this.inputNode.value = (month + 1) + '/' + (day + 1) + '/' + year;
};

DateInput.prototype.getDate = function () {
  return this.inputNode.value;
};

DateInput.prototype.setMessage = function (str) {
  return this.messageNode.textContent = str;
};

DateInput.prototype.hasFocus = function () {
  return this.hasFocusflag;
};

DateInput.prototype.showDownArrow = function () {
  console.log('[showDownArrow]: ' + this.imageNode);
  if (this.imageNode) {
    this.imageNode.style.visibility = 'visible';
  }
};

DateInput.prototype.hideDownArrow = function () {
  console.log('[hideDownArrow]: ' + this.imageNode);
  if (this.imageNode) {
    this.imageNode.style.visibility = 'hidden';
  }
};
