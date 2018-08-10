/*
*   File:   carouselButton.js
*
*   Desc:   Carousel Button widget that implements ARIA Authoring Practices
*
*   Author(s): Jon Gunderson, Nicholas Hoyt, and Mark McCarthy
*/

/*
*   @constructor PauseButton
*
*
*/
var PauseButton = function (domNode, tablist) {

  this.domNode   = domNode;

  this.tablist = tablist;
};

var StartButton = function (domNode, tablist) {

  this.domNode   = domNode;

  this.tablist = tablist;
};

PauseButton.prototype.init = function () {

  this.domNode.addEventListener('click',      this.handleClick.bind(this));
  this.domNode.addEventListener('focus',      this.handleFocus.bind(this));
  this.domNode.addEventListener('blur',       this.handleBlur.bind(this));
};



/* EVENT HANDLERS */

  //  console.log("[PauseButton][handleKeydown]: " + event.keyCode + " " + this.tablist)


PauseButton.prototype.handleClick = function (event) {
  this.tablist.toggleRotation();
  this.tablist.rotationButtonState = this.tablist.rotate;
};

PauseButton.prototype.handleFocus = function (event) {
  this.domNode.classList.add('focus');
};

PauseButton.prototype.handleBlur = function (event) {
  this.domNode.classList.remove('focus');
};
