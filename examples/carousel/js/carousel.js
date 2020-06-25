/*
*   File:   Carousel.js
*
*   Desc:   Carousel widget that implements ARIA Authoring Practices
*
*/

'use strict';

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
  this.liveRegionNode = null;
  this.currentItem = null;
  this.pauseButton = null;

  this.playLabel = 'Start automatic slide show';
  this.pauseLabel = 'Stop automatic slide show';

  this.rotate = true;
  this.hasFocus = false;
  this.hasHover = false;
  this.isStopped = false;
  this.timeInterval = 5000;
};

Carousel.prototype.init = function () {

  var elems, elem, button, items, item, imageLinks, i;

  this.liveRegionNode = this.domNode.querySelector('.carousel-items');

  items = this.domNode.querySelectorAll('.carousel-item');

  for (i = 0; i < items.length; i++) {
    item = new CarouselItem(items[i], this);

    item.init();
    this.items.push(item);

    if (!this.firstItem) {
      this.firstItem = item;
      this.currentDomNode = item.domNode;
    }
    this.lastItem = item;

    imageLinks = items[i].querySelectorAll('.carousel-image a');

    if (imageLinks && imageLinks[0]) {
      imageLinks[0].addEventListener('focus', this.handleImageLinkFocus.bind(this));
      imageLinks[0].addEventListener('blur', this.handleImageLinkBlur.bind(this));
    }

  }

  // Pause, Next Slide and Previous Slide Buttons

  elems = document.querySelectorAll('.carousel .controls button');

  for (i = 0; i < elems.length; i++) {
    elem = elems[i];

    if (elem.classList.contains('rotation')) {
      button = new PauseButton(elem, this);
      this.pauseButton = elem;
      this.pauseButton.classList.add('pause');
      this.pauseButton.setAttribute('aria-label', this.pauseLabel);
    }
    else {
      button = new CarouselButton(elem, this);
    }

    button.init();
  }

  this.currentItem = this.firstItem;

  this.domNode.addEventListener('mouseover', this.handleMouseOver.bind(this));
  this.domNode.addEventListener('mouseout', this.handleMouseOut.bind(this));

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

Carousel.prototype.updateRotation = function () {

  if (!this.hasHover && !this.hasFocus && !this.isStopped) {
    this.rotate = true;
    this.liveRegionNode.setAttribute('aria-live', 'off');
  }
  else {
    this.rotate = false;
    this.liveRegionNode.setAttribute('aria-live', 'polite');
  }

  if (this.isStopped) {
    this.pauseButton.setAttribute('aria-label', this.playLabel);
    this.pauseButton.classList.remove('pause');
    this.pauseButton.classList.add('play');
  }
  else {
    this.pauseButton.setAttribute('aria-label', this.pauseLabel);
    this.pauseButton.classList.remove('play');
    this.pauseButton.classList.add('pause');
  }

};

Carousel.prototype.toggleRotation = function () {
  if (this.isStopped) {
    if (!this.hasHover && !this.hasFocus) {
      this.isStopped = false;
    }
  }
  else {
    this.isStopped = true;
  }

  this.updateRotation();

};

Carousel.prototype.handleImageLinkFocus = function () {
  this.liveRegionNode.classList.add('focus');
};

Carousel.prototype.handleImageLinkBlur = function () {
  this.liveRegionNode.classList.remove('focus');
};

Carousel.prototype.handleMouseOver = function (event) {
  if (!this.pauseButton.contains(event.target)) {
    this.hasHover = true;
  }
  this.updateRotation();
};

Carousel.prototype.handleMouseOut = function () {
  this.hasHover = false;
  this.updateRotation();
};

/* Initialize Carousel Tablists */

window.addEventListener('load', function () {
  var carousels = document.querySelectorAll('.carousel');

  for (var i = 0; i < carousels.length; i++) {
    var carousel = new Carousel(carousels[i]);
    carousel.init();
  }
}, false);
