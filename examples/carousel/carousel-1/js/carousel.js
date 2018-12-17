/*
*   File:   Carousel.js
*
*   Desc:   Carousel Tablist group widget that implements ARIA Authoring Practices
*
<<<<<<< HEAD
*/
=======
*   Author(s): Jon Gunderson, Nicholas Hoyt, and Mark McCarthy
*/

/*
*   @constructor CarouselTablist
*
*
*/
var Carousel = function (domNode) {
  this.domNode = domNode;

  this.items = [];

  this.firstItem = null;
  this.lastItem = null;
  this.currentDomNode = null;
  this.currentItem = null;
  this.pauseButton = null;

  this.rotate = true;
  this.hasFocus = null;
  this.timeInterval = 5000;
};

Carousel.prototype.init = function () {
  var items = this.domNode.querySelectorAll('.carousel-item');

  for (var i = 0; i < items.length; i++) {
    var item = new CarouselItem(items[i], this);

    console.log('[item]: ' + item.domNode);

    item.init();
    this.items.push(item);

    if (!this.firstItem) {
      this.firstItem = item;
      this.currentDomNode = item.domNode;
    }
    this.lastItem = item;
  }

  // Next Slide and Previous Slide Buttons

  var elems = document.querySelectorAll('.carousel a.carousel-control');

  for (var i = 0; i < elems.length; i++) {
    if (elems[i].tagName.toLowerCase() == 'a') {
      var button = new CarouselButton(elems[i], this);

      button.init();
    }
  }

  this.currentItem = this.firstItem;

  this.pauseButton = this.domNode.parentNode.parentNode.querySelector('button.pause');
  if (this.pauseButton) {
    var button = new PauseButton(this.pauseButton, this);

    button.init();
  }

  this.carouselContainer = this.domNode.parentNode.parentNode;
  this.carouselContainer.addEventListener('mouseover', this.handleMouseOver.bind(this));
  this.carouselContainer.addEventListener('mouseout', this.handleMouseOut.bind(this));

  // Start rotation
  setTimeout(this.rotateSlides.bind(this), this.timeInterval);
};

Carousel.prototype.setSelected = function (newItem, moveFocus) {
  if (typeof moveFocus != 'boolean') {
    moveFocus = false;
  }

  for (var i = 0; i < this.items.length; i++) {
    this.items[i].hide();
  }

  this.currentItem = newItem;
  this.currentItem.show();

  if (moveFocus) {
    this.currentItem.domNode.focus();
  }
};

Carousel.prototype.setSelectedToPreviousItem = function (currentItem, moveFocus) {
  if (typeof moveFocus != 'boolean') {
    moveFocus = false;
  }

  var index;

  if (typeof currentItem !== 'object') {
    currentItem = this.currentItem;
  }

  if (currentItem === this.firstItem) {
    this.setSelected(this.lastItem, moveFocus);
  }
  else {
    index = this.items.indexOf(currentItem);
    this.setSelected(this.items[index - 1], moveFocus);
  }
};

Carousel.prototype.setSelectedToNextItem = function (currentItem, moveFocus) {
  if (typeof moveFocus != 'boolean') {
    moveFocus = false;
  }

  var index;

  if (typeof currentItem !== 'object') {
    currentItem = this.currentItem;
  }

  if (currentItem === this.lastItem) {
    this.setSelected(this.firstItem, moveFocus);
  }
  else {
    index = this.items.indexOf(currentItem);
    this.setSelected(this.items[index + 1], moveFocus);
  }
};

Carousel.prototype.rotateSlides = function () {
  if (this.rotate) {
    this.setSelectedToNextItem();
  }
  setTimeout(this.rotateSlides.bind(this), this.timeInterval);
};

Carousel.prototype.startRotation = function (force) {
  if ((this.pauseButton.getAttribute('aria-pressed') === 'false') && !this.hasFocus && !this.hasHover) {
    this.rotate = true;
  }
  else {
    this.rotate = false;
  }
};

Carousel.prototype.stopRotation = function () {
  this.rotate = false;
};

Carousel.prototype.toggleRotation = function () {
  if ((this.pauseButton.getAttribute('aria-pressed') === 'false')) {
    this.pauseButton.setAttribute('aria-pressed', 'true');
    this.stopRotation();
  }
  else {
    this.pauseButton.setAttribute('aria-pressed', 'false');
    this.startRotation();
    this.hasFocus = false;
  }
};

Carousel.prototype.handleMouseOver = function () {
  this.stopRotation();
};

Carousel.prototype.handleMouseOut = function () {
  this.startRotation();
};

/* Initialize Carousel Tablists */

window.addEventListener('load', function (event) {
  var carousels = document.querySelectorAll('.carousel');

  for (var i = 0; i < carousels.length; i++) {
    console.log('[Carousel]: ' + carousels[i]);
    var carousel = new Carousel(carousels[i]);

    carousel.init();
  }
}, false);
>>>>>>> carousel-v2
