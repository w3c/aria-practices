/*
*   This content is licensed according to the W3C Software License at
*   https://www.w3.org/Consortium/Legal/2015/copyright-software-and-document
*
*   File:   datepicker-combobox.js
*/

var ComboboxInput = function (comboboxNode, inputNode, buttonNode, messageNode, datepicker) {
  this.comboboxNode = comboboxNode;
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

ComboboxInput.prototype.init = function () {
  this.inputNode.addEventListener('keydown', this.handleKeyDown.bind(this));
  this.inputNode.addEventListener('focus', this.handleFocus.bind(this));
  this.inputNode.addEventListener('blur', this.handleBlur.bind(this));
  this.inputNode.addEventListener('click', this.handleClick.bind(this));

  this.buttonNode.addEventListener('click', this.handleButtonClick.bind(this));
  this.buttonNode.addEventListener('touchstart', this.handleTouchStart.bind(this));
  this.buttonNode.addEventListener('keydown', this.handleButtonKeyDown.bind(this));

  if (this.buttonNode.nextElementSibling &&
      this.button Node.nextElementSibling.classList.contains('arrow')) {
    this.imageNode = this.inputNode.nextElementSibling;
  }

  if (this.imageNode) {
    this.imageNode.addEventListener('click', this.handleClick.bind(this));
  }

  this.setMessage('');
};

ComboboxInput.prototype.handleKeyDown = function (event) {
  var flag = false;

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

ComboboxInput.prototype.handleTouchStart = function (event) {
  console.log('[handleTouchStart][length]: ' + event.targetTouches.length);

  if (event.targetTouches.length === 1) {
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

ComboboxInput.prototype.handleFocus = function () {
  console.log('[ComboboxInput][handleFocus][hasFocus]: ' + this.hasFocusFlag);
  if (!this.ignoreFocusEvent && this.isCollapsed()) {
    setTimeout(this.datepicker.show.bind(this.datepicker), 100);
    this.setMessage('Use the down arrow key to move focus to the datepicker grid.');
  }

  this.hasFocusFlag = true;
  this.ignoreFocusEvent = false;

};

ComboboxInput.prototype.handleBlur = function () {
  console.log('[ComboboxInput][handleBlur]');
  if (!this.ignoreBlurEvent) {
    this.datepicker.hide(false);
    this.setMessage('');
  }

  this.hasFocusFlag = false;
  this.ignoreBlurEvent = false;
};

ComboboxInput.prototype.handleClick = function (event) {
  console.log('[ComboboxInput][handleClick]: ' + event.target.tagName);
  console.log('[ComboboxInput][handleClick][hasFocus]: ' + this.hasFocus());
  console.log('[ComboboxInput][handleClick][isCollapsed]: ' + this.isCollapsed());

  if (this.isCollapsed()) {
    this.datepicker.show();
  }
  else {
    this.ignoreFocusEvent = true;
    this.datepicker.hide();
  }

  event.stopPropagation();
  event.preventDefault();

};

ComboboxInput.prototype.handleButtonClick = function (event) {
  this.ignoreBlurEvent = true;
  this.datepicker.show();
  this.datepicker.setFocusDay();

  if (event) {
    event.stopPropagation();
    event.preventDefault();
  }
};

ComboboxInput.prototype.handleButtonKeyDown = function (event) {

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

ComboboxInput.prototype.focus = function () {
  this.inputNode.focus();
};

ComboboxInput.prototype.setAriaExpanded = function (flag) {

  if (flag) {
    this.comboboxNode.setAttribute('aria-expanded', 'true');
    this.buttonNode.setAttribute('aria-expanded', 'true');
  }
  else {
    this.comboboxNode.setAttribute('aria-expanded', 'false');
    this.buttonNode.setAttribute('aria-expanded', 'false');
  }

};

ComboboxInput.prototype.getAriaExpanded = function () {
  return this.comboboxNode.getAttribute('aria-expanded') === 'true';
};

ComboboxInput.prototype.isCollapsed = function () {
  return this.comboboxNode.getAttribute('aria-expanded') !== 'true';
};

ComboboxInput.prototype.setDate = function (month, day, year) {
  this.inputNode.value = (month + 1) + '/' + (day + 1) + '/' + year;
};

ComboboxInput.prototype.getDate = function () {
  return this.inputNode.value;
};

ComboboxInput.prototype.setMessage = function (str) {
  return this.messageNode.textContent = str;
};

ComboboxInput.prototype.hasFocus = function () {
  return this.hasFocusFlag;
};

// Initialize combobox date picker

window.addEventListener('load' , function () {

  var datePickers = document.querySelectorAll('[role=combobox].datepicker');

  datePickers.forEach(function (dp) {
    var dpInput = dp.querySelector('input');
    var dpButton = dp.querySelector('button');
    var dpMessage = dp.querySelector('.message');
    var dpDialog = dp.querySelector('[role=dialog]');
    var datePicker = new DatePicker(dp, dpInput, dpButton, dpDialog, dpMessage);
    datePicker.init();
  });

});
