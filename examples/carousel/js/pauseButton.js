/*
*   File:   pasueButton.js
*
*   Desc:   Implements the pause button for the carousel widget
*
*/

'use strict';

var PauseButton = function (domNode, carouselObj) {
  this.domNode = domNode;

  this.carousel = carouselObj;
};

PauseButton.prototype.init = function () {
  this.domNode.addEventListener('click', this.handleClick.bind(this));
};

/* EVENT HANDLERS */

PauseButton.prototype.handleClick = function () {
  this.carousel.toggleRotation();
};
