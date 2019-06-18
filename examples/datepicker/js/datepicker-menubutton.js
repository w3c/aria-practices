/*
*   This content is licensed according to the W3C Software License at
*   https://www.w3.org/Consortium/Legal/2015/copyright-software-and-document
*
*   File:   datepicker-menubutton.js
*/

var MenuButtonInput = function (inputNode, buttonNode, messageNode, datepicker) {
  this.inputNode    = inputNode;
  this.buttonNode   = buttonNode;
  this.messageNode  = messageNode;
  this.imageNode    = false;

  this.datepicker = datepicker;

  this.ignoreFocusEvent = false;
  this.ignoreBlurEvent = false;

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

MenuButtonInput.prototype.init = function () {

  this.buttonNode.addEventListener('click', this.handleButtonClick.bind(this));
  this.buttonNode.addEventListener('touchstart', this.handleTouchStart.bind(this));
  this.buttonNode.addEventListener('keydown', this.handleKeyDown.bind(this));

  this.setMessage('');
};

MenuButtonInput.prototype.handleKeyDown = function (event) {
  var flag = false;

  switch (event.keyCode) {

    case this.keyCode.DOWN:
    case this.keyCode.RETURN:
      this.datepicker.show();
      this.ignoreBlurEvent = true;
      this.datepicker.setFocusDay();
      flag = true;
      break;

    case this.keyCode.ESC:
      this.datepicker.hide(false);
      flag = true;
      break;

    default:
      break;
  }

  if (flag) {
    event.stopPropagation();
    event.preventDefault();
  }
};

MenuButtonInput.prototype.handleTouchStart = function (event) {

  if (event.targetTouches.length === 1) {
    console.log('[handleTouchStart][tagName]: ' + event.targetTouches[0].target.tagName);
    if (this.comboboxNode.contains(event.targetTouches[0].target)) {
      if (this.isCollapsed()) {
        this.datepicker.show();
        event.stopPropagation();
        event.preventDefault();
        return false;
      }
    }
  }
};

MenuButtonInput.prototype.handleFocus = function () {
  console.log('[MenuButtonInput][handleFocus]')
  if (!this.ignoreFocusEvent && this.isCollapsed()) {
    this.setMessage('Use the down arrow key or the following change date button to move focus to the datepicker grid.');
  }

  this.hasFocusFlag = true;
  this.ignoreFocusEvent = false;

};


MenuButtonInput.prototype.handleBlur = function () {
  if (!this.ignoreBlurEvent) {
    this.setMessage('');
  }
  this.hasFocusFlag = false;
  this.ignoreBlurEvent = false;
};

MenuButtonInput.prototype.handleClick = function (event) {
  console.log('[MenuButtonInput][handleClick]: ' + event.target.tagName);

  if (this.isCollapsed()) {
    this.datepicker.show();
  }
  else {
    this.ignoreFocusEvent = true;
    this.datepicker.hide();
  }

};

MenuButtonInput.prototype.handleButtonClick = function (event) {
  this.ignoreBlurEvent = true;
  this.datepicker.show();
  this.datepicker.setFocusDay();

  if (event) {
    event.stopPropagation();
    event.preventDefault();
  }
};


MenuButtonInput.prototype.setFocus = function () {
  this.inputNode.focus();
};

MenuButtonInput.prototype.setAriaExpanded = function (flag) {

  if (flag) {
    if (this.comboboxNode) {
      this.comboboxNode.setAttribute('aria-expanded', 'true');
    }
    this.buttonNode.setAttribute('aria-expanded', 'true');
  }
  else {
    if (this.comboboxNode) {
      this.comboboxNode.setAttribute('aria-expanded', 'false');
    }
    this.buttonNode.setAttribute('aria-expanded', 'false');
  }

};

MenuButtonInput.prototype.getAriaExpanded = function () {
  if (this.comboboxNode) {
    return this.comboboxNode.getAttribute('aria-expanded') === 'true';
  }
   return this.buttonNode.getAttribute('aria-expanded') === 'true';
};

MenuButtonInput.prototype.isCollapsed = function () {
  return this.inputNode.getAttribute('aria-expanded') !== 'true';
};

MenuButtonInput.prototype.setDate = function (month, day, year) {
  this.inputNode.value = (month + 1) + '/' + (day + 1) + '/' + year;
};

MenuButtonInput.prototype.getDate = function () {
  return this.inputNode.value;
};

MenuButtonInput.prototype.setMessage = function (str) {
  return this.messageNode.textContent = str;
};

MenuButtonInput.prototype.hasFocus = function () {
  return this.hasFocusflag;
};

// Initialize menu button date picker

window.addEventListener('load' , function () {

  var datePickers = document.querySelectorAll('.datepicker');

  datePickers.forEach(function (dp) {
    var inputNode   = dp.querySelector('input');
    var buttonNode  = dp.querySelector('button');
    var messageNode = dp.querySelector('.message');
    var dialogNode  = dp.querySelector('[role=dialog]');

    var datePicker = new DatePicker(null, inputNode, buttonNode, messageNode, dialogNode);
    datePicker.init();
  });

});
