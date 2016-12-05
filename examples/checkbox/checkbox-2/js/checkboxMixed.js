/*
*   This content is licensed according to the W3C Software License at
*   https://www.w3.org/Consortium/Legal/2015/copyright-software-and-document
*
*   File:   CheckboxMixed.js
*
*   Desc:   CheckboxMixed widget that implements ARIA Authoring Practices
*           for a menu of links
*
*   Author: Jon Gunderson and Nicholas Hoyt
*/

/*
*   @constructor CheckboxMixed
*
*
*/
var CheckboxMixed = function (domNode) {

  this.domNode = domNode;

  this.keyCode = Object.freeze({
    'RETURN'   : 13,
    'SPACE'    : 32,
  });
};

CheckboxMixed.prototype.init = function () {
  this.domNode.tabIndex = 0;

  if (!this.domNode.getAttribute('aria-checked')) {
    this.domNode.setAttribute('aria-checked', 'false');
  }

  this.domNode.addEventListener('keydown',    this.handleKeydown.bind(this));
  this.domNode.addEventListener('click',      this.handleClick.bind(this));
  this.domNode.addEventListener('focus',      this.handleFocus.bind(this));
  this.domNode.addEventListener('blur',       this.handleBlur.bind(this));

};

CheckboxMixed.prototype.toggleCheckboxMixed = function() {

  if (this.domNode.getAttribute('aria-checked') === 'true') {
    this.domNode.setAttribute('aria-checked', 'false');
  }
  else {
    this.domNode.setAttribute('aria-checked', 'true');
  }

}

/* EVENT HANDLERS */

CheckboxMixed.prototype.handleKeydown = function (event) {
  var flag = false;

  switch (event.keyCode) {
    case this.keyCode.SPACE:
    case this.keyCode.RETURN:
      this.toggleCheckboxMixed()
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

CheckboxMixed.prototype.handleClick = function (event) {
  this.toggleCheckboxMixed();
};

CheckboxMixed.prototype.handleFocus = function (event) {
  this.domNode.classList.add('focus');
};

CheckboxMixed.prototype.handleBlur = function (event) {
  this.domNode.classList.remove('focus');
};

