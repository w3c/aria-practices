/*
*   File:   pasueButton.js
*
*   Desc:   Implements the pause button for the carousel widget
*
*/

var PauseButton = function (domNode, carouselObj) {
  this.domNode = domNode;

  this.carousel = carouselObj;
};

var StartButton = function (domNode, carouselObj) {
  this.domNode = domNode;

  this.carousel = carouselObj;
};

PauseButton.prototype.init = function () {
  this.domNode.addEventListener('click', this.handleClick.bind(this));
  this.domNode.addEventListener('focus', this.handleFocus.bind(this));
  this.domNode.addEventListener('blur', this.handleBlur.bind(this));
};

/* EVENT HANDLERS */

PauseButton.prototype.handleClick = function (event) {
  this.carousel.toggleRotation();
};

PauseButton.prototype.handleFocus = function (event) {
  this.domNode.classList.add('focus');
};

PauseButton.prototype.handleBlur = function (event) {
  this.domNode.classList.remove('focus');
};
