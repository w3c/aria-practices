/*
*   File:   carouselButton.js
*
*   Desc:   Carousel Button widget that implements ARIA Authoring Practices
*/

'use strict';

/*
*   @constructor CarouselButton
*
*
*/
var CarouselButton = function (domNode, carouselObj) {
  this.domNode = domNode;

  this.carousel = carouselObj;

  this.direction = 'previous';

  if (this.domNode.classList.contains('next')) {
    this.direction = 'next';
  }

  this.keyCode = Object.freeze({
    'RETURN': 13,
    'SPACE': 32,
    'END': 35,
    'HOME': 36,
    'LEFT': 37,
    'UP': 38,
    'RIGHT': 39,
    'DOWN': 40
  });
};

CarouselButton.prototype.init = function () {
  this.domNode.addEventListener('click', this.handleClick.bind(this));
  this.domNode.addEventListener('focus', this.handleFocus.bind(this));
  this.domNode.addEventListener('blur', this.handleBlur.bind(this));
};

CarouselButton.prototype.changeItem = function () {
  if (this.direction === 'previous') {
    this.carousel.setSelectedToPreviousItem();
  }
  else {
    this.carousel.setSelectedToNextItem();
  }
};


/* EVENT HANDLERS */


CarouselButton.prototype.handleClick = function (event) {
  this.changeItem();
};

CarouselButton.prototype.handleFocus = function (event) {
  this.carousel.hasFocus = true;
  this.domNode.classList.add('focus');
  this.carousel.updateRotation();
};

CarouselButton.prototype.handleBlur = function (event) {
  this.carousel.hasFocus = false;
  this.domNode.classList.remove('focus');
  this.carousel.updateRotation();
};
