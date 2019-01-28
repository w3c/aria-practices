/*
*   File:   CarouselItem.js
*
*   Desc:   Carousel Tab widget that implements ARIA Authoring Practices
*/

/*
*   @constructor CarouselItem
*
*
*/
var CarouselItem = function (domNode, carouselObj) {
  this.domNode = domNode;
  this.carousel = carouselObj;
};

CarouselItem.prototype.init = function () {
  this.domNode.addEventListener('focusin', this.handleFocusIn.bind(this));
  this.domNode.addEventListener('focusout', this.handleFocusOut.bind(this));
};

CarouselItem.prototype.hide = function () {
  this.domNode.classList.remove('active');
};

CarouselItem.prototype.show = function () {
  this.domNode.classList.add('active');
};

/* EVENT HANDLERS */

CarouselItem.prototype.handleFocusIn = function (event) {
  this.domNode.classList.add('focus');
  this.carousel.hasFocus = true;
  this.carousel.stopRotation();
};

CarouselItem.prototype.handleFocusOut = function (event) {
  this.domNode.classList.remove('focus');
  this.carousel.hasFocus = false;
  this.carousel.startRotation();
};
