/*
*   File:   carouselTab.js
*
*   Desc:   Carousel Tab widget that implements ARIA Authoring Practices
*/

/*
*   @constructor CarouselTab
*
*
*/
var CarouselTab = function (domNode, carouselObj, tabpanelObj) {
  this.domNode = domNode;
  this.carousel = carouselObj;
  this.tabpanel = tabpanelObj;

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

CarouselTab.prototype.init = function () {
  this.domNode.addEventListener('keydown', this.handleKeydown.bind(this));
  this.domNode.addEventListener('click', this.handleClick.bind(this));
  this.domNode.addEventListener('focus', this.handleFocus.bind(this));
  this.domNode.addEventListener('blur', this.handleBlur.bind(this));
};

CarouselTab.prototype.hideTabpanel = function () {
  this.domNode.setAttribute('aria-selected', 'false');
  this.tabpanel.hide();
  this.domNode.setAttribute('tabindex', '-1');
};

CarouselTab.prototype.showTabpanel = function (moveFocus) {
  if (typeof moveFocus !== 'boolean') {
    moveFocus = false;
  }

  this.domNode.setAttribute('aria-selected', 'true');
  this.domNode.removeAttribute('tabindex');
  this.tabpanel.show();
  if (moveFocus) {
    this.domNode.focus();
  }
};


/* EVENT HANDLERS */


CarouselTab.prototype.handleKeydown = function (event) {
  var flag = false;

  switch (event.keyCode) {

    case this.keyCode.RIGHT:
      this.carousel.setSelectedToNextTab(this, true);
      flag = true;
      break;

    case this.keyCode.LEFT:
      this.carousel.setSelectedToPreviousTab(this, true);
      flag = true;
      break;

    case this.keyCode.HOME:
      this.carousel.setSelectedToFirstTab(true);
      flag = true;
      break;

    case this.keyCode.END:
      this.carousel.setSelectedToLastTab(true);
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

CarouselTab.prototype.handleClick = function () {
  this.carousel.setSelectedTab(this, true);
};

CarouselTab.prototype.handleFocus = function () {
  this.carousel.hasFocus = true;
  this.domNode.parentNode.classList.add('focus');
  this.carousel.updateRotation();
};

CarouselTab.prototype.handleBlur = function () {
  this.carousel.hasFocus = false;
  this.domNode.parentNode.classList.remove('focus');
  this.carousel.updateRotation();
};
