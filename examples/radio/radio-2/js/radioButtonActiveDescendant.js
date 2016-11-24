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
*   File:   RadioButtonActiveDescendant.js
*
*   Desc:   RadioButtonActiveDescendant widget that implements ARIA Authoring Practices
*
*   Author: Jon Gunderson, Ku Ja Eun, Nicholas Hoyt, and Brian Loh
*/

/*
*   @constructor RadioButtonActiveDescendantActiveDescendant
*
*   
*/
var RadioButtonActiveDescendant= function (domNode, groupObj) {

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

RadioButtonActiveDescendant.prototype.init = function () {
  this.domNode.setAttribute('aria-checked', 'false');
  this.domNode.addEventListener('click',      this.handleClick.bind(this) );
 
};

/* EVENT HANDLERS */

RadioButtonActiveDescendant.prototype.handleClick = function (event) {
  console.log('click')
  this.radioGroup.setChecked(this);
};
