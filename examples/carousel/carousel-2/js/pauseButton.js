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

PauseButton.prototype.init = function () {
  this.domNode.addEventListener('click', this.handleClick.bind(this));
};

/* EVENT HANDLERS */

PauseButton.prototype.handleClick = function (event) {
  console.log('handleClick');
  this.carousel.toggleRotation();
};

