/*
*   This content is licensed according to the W3C Software License at
*   https://www.w3.org/Consortium/Legal/2015/copyright-software-and-document
*
*   File:   radioGroup.js
*
*   Desc:   Radio group widget using aria-activedescendant that implements ARIA Authoring Practices
*/

/*
*   @constructor radioGroupActiveDescendent
*
*   @desc
*       Wrapper for ARIA radiogroup control using ARIA active-descendant.  Any descendant
*       element with role=radio will be included in this radiogroup as a radiobutton2.
*
*   @param domNode
*       The DOM element node that serves as the radiogroup container.
*/
var RadioGroup = function (domNode) {

  this.domNode   = domNode;

  this.radioButtons = [];

  this.firstRadioButton  = null;
  this.lastRadioButton   = null;

  this.keyCode = Object.freeze({
    'TAB': 9,
    'SPACE': 32,
    'LEFT': 37,
    'UP': 38,
    'RIGHT': 39,
    'DOWN': 40
  });
};

RadioGroup.prototype.init = function () {

  this.domNode.addEventListener('keydown',    this.handleKeydown.bind(this));
  this.domNode.addEventListener('focus',      this.handleFocus.bind(this));
  this.domNode.addEventListener('blur',       this.handleBlur.bind(this));
  // initialize
  if (!this.domNode.getAttribute('role')) {
    this.domNode.setAttribute('role', 'radiogroup');
  }

  var rbs = this.domNode.querySelectorAll('[role=radio]');

  for (var i = 0; i < rbs.length; i++) {
    var rb = new RadioButtonActiveDescendant(rbs[i], this);
    rb.init();
    this.radioButtons.push(rb);

    console.log(rb);

    if (!this.firstRadioButton) {
      this.firstRadioButton = rb;
    }
    this.lastRadioButton = rb;
  }
  this.domNode.tabIndex = 0;
};

RadioGroup.prototype.setChecked  = function (currentItem) {
  for (var i = 0; i < this.radioButtons.length; i++) {
    var rb = this.radioButtons[i];
    rb.domNode.setAttribute('aria-checked', 'false');
    rb.domNode.classList.remove('focus');
  }
  currentItem.domNode.setAttribute('aria-checked', 'true');
  currentItem.domNode.classList.add('focus');
  this.domNode.setAttribute('aria-activedescendant', currentItem.domNode.id);
  this.domNode.focus();
};

RadioGroup.prototype.setCheckedToPreviousItem = function (currentItem) {
  var index;

  if (currentItem === this.firstRadioButton) {
    this.setChecked(this.lastRadioButton);
  }
  else {
    index = this.radioButtons.indexOf(currentItem);
    this.setChecked(this.radioButtons[index - 1]);
  }
};

RadioGroup.prototype.setCheckedToNextItem = function (currentItem) {
  var index;

  if (currentItem === this.lastRadioButton) {
    this.setChecked(this.firstRadioButton);
  }
  else {
    index = this.radioButtons.indexOf(currentItem);
    this.setChecked(this.radioButtons[index + 1]);
  }
};

RadioGroup.prototype.getCurrentRadioButton = function () {
  var id = this.domNode.getAttribute('aria-activedescendant');
  if (!id) {
    this.domNode.setAttribute('aria-activedescendant', this.firstRadioButton.domNode.id);
    return this.firstRadioButton;
  }
  for (var i = 0; i < this.radioButtons.length; i++) {
    var rb = this.radioButtons[i];
    if (rb.domNode.id === id) {
      return rb;
    }
  }
  this.domNode.setAttribute('aria-activedescendant', this.firstRadioButton.domNode.id);
  return this.firstRadioButton;
};

// Event Handlers

RadioGroup.prototype.handleKeydown = function (event) {
  var tgt = event.currentTarget,
    flag = false,
    clickEvent;

  var currentItem = this.getCurrentRadioButton();
  switch (event.keyCode) {
    case this.keyCode.SPACE:
    case this.keyCode.RETURN:
      this.setChecked(currentItem);
      flag = true;
      break;

    case this.keyCode.UP:
      this.setCheckedToPreviousItem(currentItem);
      flag = true;
      break;

    case this.keyCode.DOWN:
      this.setCheckedToNextItem(currentItem);
      flag = true;
      break;

    case this.keyCode.LEFT:
      this.setCheckedToPreviousItem(currentItem);
      flag = true;
      break;

    case this.keyCode.RIGHT:
      this.setCheckedToNextItem(currentItem);
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

RadioGroup.prototype.handleFocus = function (event) {
  var currentItem = this.getCurrentRadioButton();
  currentItem.domNode.classList.add('focus');
};

RadioGroup.prototype.handleBlur = function (event) {
  var currentItem = this.getCurrentRadioButton();
  currentItem.domNode.classList.remove('focus');
};
