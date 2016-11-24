/*
*   Copyright 2016 University of Illinois
*
*   Licensed under the Apache License, Version 2.0 (the "License");
*   you may not use this file except in compliance with the License.
*   You may obtain a copy of the License at
*
*       http://www.apache.org/licenses/LICENSE-2.0
*
*   Unless required by applicable law or agreed to in writing, software
*   distributed under the License is distributed on an "AS IS" BASIS,
*   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
*   See the License for the specific language governing permissions and
*   limitations under the License.
*
*   File:   radioGroup.js
*
*   Desc:   RadioGroup that implements ARIA Authoring Practices
*
*   Author: Jon Gunderson, Ku Ja Eun, Nicholas Hoyt, and Brian Loh
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

  this.keyCode = Object.freeze({
    'TAB'      :  9,
    'SPACE'    : 32,
    'END'      : 35,
    'HOME'     : 36,
    'LEFT'     : 37,
    'UP'       : 38,
    'RIGHT'    : 39,
    'DOWN'     : 40
  });
};

RadioGroup.prototype.init = function () {

  // initialize pop up menus
  if (!this.domNode.getAttribute('role')) {
    this.domNode.setAttribute('role', 'radiogroup');
  }

  var rbs = this.domNode.querySelectorAll("[role=radio]");

  for (var i = 0; i < rbs.length; i++) {
    var rb = new RadioButton(rbs[i], this);
    rb.init();
    this.radioButtons.push(rb);

    console.log(rb);

    if (!this.firstRadioButton) this.firstRadioButton = rb;
    this.lastRadioButton = rb;
  }
  this.firstRadioButton.domNode.tabIndex = 0;
};

RadioGroup.prototype.setChecked  = function(currentItem) {
  for(var i=0; i < this.radioButtons.length; i++){
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
