/*
*   File:   CarouselTabpanel.js
*
*   Desc:   Carousel Tab widget that implements ARIA Authoring Practices
*/

/*
*   @constructor CarouselTabpanelpanel
*
*
*/
var CarouselTabpanel = function (domNode, carouselObj) {
  this.domNode = domNode;
  this.carousel = carouselObj;
};

CarouselTabpanel.prototype.init = function () {
  this.domNode.addEventListener('focusin', this.handleFocusIn.bind(this));
  this.domNode.addEventListener('focusout', this.handleFocusOut.bind(this));
};

CarouselTabpanel.prototype.hide = function () {
  this.domNode.classList.remove('active');
  this.domNode.removeAttribute('tabindex');
};

CarouselTabpanel.prototype.show = function () {
  this.domNode.classList.add('active');
  this.domNode.setAttribute('tabindex', '0');
};

/* EVENT HANDLERS */

CarouselTabpanel.prototype.handleFocusIn = function () {
  this.domNode.classList.add('focus');
  this.carousel.hasFocus = true;
  this.carousel.updateRotation();
};

CarouselTabpanel.prototype.handleFocusOut = function () {
  this.domNode.classList.remove('focus');
  this.carousel.hasFocus = false;
  this.carousel.updateRotation();
};
