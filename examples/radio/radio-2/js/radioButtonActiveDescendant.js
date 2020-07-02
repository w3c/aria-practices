/*
*   This content is licensed according to the W3C Software License at
*   https://www.w3.org/Consortium/Legal/2015/copyright-software-and-document
*
*   File:   RadioButtonActiveDescendant.js
*
*   Desc:   Radio widget using aria-activedescendant that implements ARIA Authoring Practices
*/

'use strict';

/*
*   @constructor RadioButtonActiveDescendantActiveDescendant
*
*
*/
var RadioButtonActiveDescendant = function (domNode, groupObj) {
  this.domNode = domNode;
  this.radioGroup = groupObj;
};

RadioButtonActiveDescendant.prototype.init = function () {
  this.domNode.setAttribute('aria-checked', 'false');
  this.domNode.addEventListener('click', this.handleClick.bind(this));

};

/* EVENT HANDLERS */

RadioButtonActiveDescendant.prototype.handleClick = function () {
  this.radioGroup.setChecked(this);
};
