/*
*   This content is licensed according to the W3C Software License at
*   https://www.w3.org/Consortium/Legal/2015/copyright-software-and-document
*
*   File:   radioGroup.js
*
*   Desc:   Radio group widget that implements ARIA Authoring Practices
*/

/*
*   @constructor radioGroup
*
*
*/
var RadioGroup = function (domNode) {

  this.domNode   = domNode;

  this.radioButtons = [];

  this.firstRadioButton  = null;
  this.lastRadioButton   = null;

};

RadioGroup.prototype.init = function () {

  // initialize pop up menus
  if (!this.domNode.getAttribute('role')) {
    this.domNode.setAttribute('role', 'radiogroup');
  }

  var rbs = this.domNode.querySelectorAll('[role=radio]');

  for (var i = 0; i < rbs.length; i++) {
    var rb = new RadioButton(rbs[i], this);
    rb.init();
    this.radioButtons.push(rb);

    console.log(rb);

    if (!this.firstRadioButton) {
      this.firstRadioButton = rb;
    }
    this.lastRadioButton = rb;
  }
  this.firstRadioButton.domNode.tabIndex = 0;
};

RadioGroup.prototype.setChecked  = function (currentItem) {
  for (var i = 0; i < this.radioButtons.length; i++) {
    var rb = this.radioButtons[i];
    rb.domNode.setAttribute('aria-checked', 'false');
    rb.domNode.tabIndex = -1;
  }
  currentItem.domNode.setAttribute('aria-checked', 'true');
  currentItem.domNode.tabIndex = 0;
  currentItem.domNode.focus();
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
