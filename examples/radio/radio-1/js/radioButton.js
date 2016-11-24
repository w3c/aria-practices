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
*   File:   RadioButton.js
*
*   Desc:   RadioButton widget that implements ARIA Authoring Practices
*
*   Author: Jon Gunderson, Ku Ja Eun, Nicholas Hoyt, and Brian Loh
*/

/*
*   @constructor RadioButton
*
*   
*/
var RadioButton= function (domNode, groupObj) {

  this.domNode = domNode;
  this.radioGroup = groupObj;

  this.keyCode = Object.freeze({
    'TAB'      :  9,
    'RETURN'   : 13,
    'ESC'      : 27,
    'SPACE'    : 32,
    'PAGEUP'   : 33,
    'PAGEDOWN' : 34,
    'END'      : 35,
    'HOME'     : 36,
    'LEFT'     : 37,
    'UP'       : 38,
    'RIGHT'    : 39,
    'DOWN'     : 40
  });
};

RadioButton.prototype.init = function () {
  this.domNode.tabIndex = -1;
  this.domNode.setAttribute('aria-checked', 'false');

  this.domNode.addEventListener('keydown',    this.handleKeydown.bind(this) );
  this.domNode.addEventListener('click',      this.handleClick.bind(this) );
  this.domNode.addEventListener('focus',      this.handleFocus.bind(this) );
  this.domNode.addEventListener('blur',       this.handleBlur.bind(this) );
 
};

/* EVENT HANDLERS */

RadioButton.prototype.handleKeydown = function (event) {
  var tgt = event.currentTarget,
      flag = false, clickEvent;

//  console.log("[RadioButton][handleKeydown]: " + event.keyCode + " " + this.radioGroup)

  switch (event.keyCode) {
    case this.keyCode.SPACE:
    case this.keyCode.RETURN:
      this.radioGroup.setChecked(this);  
      flag = true;
      break;

    case this.keyCode.UP:
      this.radioGroup.setCheckedToPreviousItem(this);
      flag = true;
      break;

    case this.keyCode.DOWN:
      this.radioGroup.setCheckedToNextItem(this);
      flag = true;
      break;

    case this.keyCode.LEFT:
      this.radioGroup.setCheckedToPreviousItem(this);
      flag = true;
      break;

    case this.keyCode.RIGHT:
      this.radioGroup.setCheckedToNextItem(this);
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


RadioButton.prototype.handleClick = function (event) {
  this.radioGroup.setChecked(this);
};

RadioButton.prototype.handleFocus = function (event) {
  this.domNode.classList.add('focus');
};

RadioButton.prototype.handleBlur = function (event) {
  this.domNode.classList.remove('focus');
};
