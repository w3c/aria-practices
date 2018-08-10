/*
*   File:   carouselButton.js
*
*   Desc:   Carousel Button widget that implements ARIA Authoring Practices
*
*   Author(s): Jon Gunderson, Nicholas Hoyt, and Mark McCarthy
*/

/*
*   @constructor CarouselButton
*
*
*/
var CarouselButton = function (domNode, tablist) {
  this.domNode = domNode;

  this.tablist = tablist;

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
  this.domNode.addEventListener('keydown', this.handleKeydown.bind(this));
  this.domNode.addEventListener('click', this.handleClick.bind(this));
  this.domNode.addEventListener('focus', this.handleFocus.bind(this));
  this.domNode.addEventListener('blur', this.handleBlur.bind(this));
};

CarouselButton.prototype.changeTab = function () {
  if (this.direction === 'previous') {
    this.tablist.setSelectedToPreviousItem();
  }
  else {
    this.tablist.setSelectedToNextItem();
  }
};


/* EVENT HANDLERS */

CarouselButton.prototype.handleKeydown = function (event) {
  var flag = false;

  switch (event.keyCode) {
    case this.keyCode.SPACE:
    case this.keyCode.RETURN:
      this.changeTab();
      this.domNode.focus();
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

CarouselButton.prototype.handleClick = function (event) {
  this.changeTab();
};

CarouselButton.prototype.handleFocus = function (event) {
  this.domNode.classList.add('focus');
  this.tablist.toggleRotation(this);
};

CarouselButton.prototype.handleBlur = function (event) {
  this.domNode.classList.remove('focus');
};
