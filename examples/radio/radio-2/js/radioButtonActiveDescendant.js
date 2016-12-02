/*
*   File:   RadioButtonActiveDescendant.js
*
*   Desc:   Radio widget using aria-activedescendant that implements ARIA Authoring Practices
*
*   Author(s): Jon Gunderson, Ku Ja Eun, Nicholas Hoyt, and Brian Loh
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
