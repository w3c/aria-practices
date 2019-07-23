/*
*   File:   CarouselTablist.js
*
*   Desc:   CarouselTablist widget that implements ARIA Authoring Practices
*
*/

var CarouselTabpanel = CarouselTabpanel || {};
var CarouselTab = CarouselTab || {};
var PauseButton = PauseButton || {};

/*
*   @constructor CarouselTablist
*
*
*/
var CarouselTablist = function (domNode) {
  this.domNode = domNode;

  this.tabs = [];

  this.firstTab = null;
  this.lastTab = null;
  this.currentTab = null;

  this.liveRegionNode = null;
  this.pauseButton = null;

  this.playLabel = 'Start automatic slide show';
  this.pauseLabel = 'Stop automatic slide show';

  this.rotate = true;
  this.hasFocus = false;
  this.hasHover = false;
  this.isStopped = false;
  this.timeInterval = 5000;
};

CarouselTablist.prototype.init = function () {

  var elem, button, tabs, tab, tabpanel, tabpanelDomNode, imageLinks, i;

  this.liveRegionNode = this.domNode.querySelector('.carousel-items');

  tabs = this.domNode.querySelectorAll('[role="tab"]');

  for (i = 0; i < tabs.length; i++) {

    tabpanelDomNode = document.getElementById(tabs[i].getAttribute('aria-controls'));

    tabpanel = new CarouselTabpanel(tabpanelDomNode, this);
    tabpanel.init();

    tab = new CarouselTab(tabs[i], this, tabpanel);
    tab.init();

    this.tabs.push(tab);

    if (!this.firstTab) {
      this.firstTab = tab;
    }
    this.lastTab = tab;

    imageLinks = tabpanelDomNode.querySelectorAll('.carousel-image a');

    if (imageLinks && imageLinks[0]) {
      imageLinks[0].addEventListener('focus', this.handleImageLinkFocus.bind(this));
      imageLinks[0].addEventListener('blur', this.handleImageLinkBlur.bind(this));
    }

  }

  // Pause Button

  elem = document.querySelector('.carouselTablist .controls button.rotation');
  if (elem) {
    button = new PauseButton(elem, this);
    this.pauseButton = elem;
    this.pauseButton.classList.add('pause');
    this.pauseButton.setAttribute('aria-label', this.pauseLabel);
    button.init();
  }

  this.currentItem = this.firstItem;

  this.domNode.addEventListener('mouseover', this.handleMouseOver.bind(this));
  this.domNode.addEventListener('mouseout', this.handleMouseOut.bind(this));

  // Start rotation
  setTimeout(this.rotateSlides.bind(this), this.timeInterval);
};

CarouselTablist.prototype.setSelectedTab = function (newTab, moveFocus) {
  if (typeof moveFocus != 'boolean') {
    moveFocus = false;
  }

  for (var i = 0; i < this.tabs.length; i++) {
    this.tabs[i].hideTabpanel();
  }

  this.currentTab = newTab;
  this.currentTab.showTabpanel(moveFocus);
};

CarouselTablist.prototype.setSelectedToPreviousTab = function (currentTab, moveFocus) {
  if (typeof moveFocus != 'boolean') {
    moveFocus = false;
  }

  var index;

  if (typeof currentTab !== 'object') {
    currentTab = this.currentTab;
  }

  if (currentTab === this.firstTab) {
    this.setSelectedTab(this.lastTab, moveFocus);
  }
  else {
    index = this.tabs.indexOf(currentTab);
    this.setSelectedTab(this.tabs[index - 1], moveFocus);
  }
};

CarouselTablist.prototype.setSelectedToNextTab = function (currentTab, moveFocus) {
  if (typeof moveFocus != 'boolean') {
    moveFocus = false;
  }

  var index;

  if (typeof currentTab !== 'object') {
    currentTab = this.currentTab;
  }

  if (currentTab === this.lastTab) {
    this.setSelectedTab(this.firstTab, moveFocus);
  }
  else {
    index = this.tabs.indexOf(currentTab);
    this.setSelectedTab(this.tabs[index + 1], moveFocus);
  }
};

CarouselTablist.prototype.setSelectedToFirstTab = function (moveFocus) {
  if (typeof moveFocus != 'boolean') {
    moveFocus = false;
  }
  this.setSelectedTab(this.firstTab, moveFocus);
};

CarouselTablist.prototype.setSelectedToLastTab = function (moveFocus) {
  if (typeof moveFocus != 'boolean') {
    moveFocus = false;
  }
  this.setSelectedTab(this.lastTab, moveFocus);
};

CarouselTablist.prototype.rotateSlides = function () {
  if (this.rotate) {
    this.setSelectedToNextTab();
  }
  setTimeout(this.rotateSlides.bind(this), this.timeInterval);
};

CarouselTablist.prototype.updateRotation = function () {

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

CarouselTablist.prototype.toggleRotation = function () {
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

CarouselTablist.prototype.handleImageLinkFocus = function () {
  this.liveRegionNode.classList.add('focus');
};

CarouselTablist.prototype.handleImageLinkBlur = function () {
  this.liveRegionNode.classList.remove('focus');
};

CarouselTablist.prototype.handleMouseOver = function (event) {
  if (!this.pauseButton.contains(event.target)) {
    this.hasHover = true;
  }
  this.updateRotation();
};

CarouselTablist.prototype.handleMouseOut = function () {
  this.hasHover = false;
  this.updateRotation();
};

/* Initialize Carousel Tablists */

window.addEventListener('load', function () {
  var carousels = document.querySelectorAll('.carouselTablist');

  for (var i = 0; i < carousels.length; i++) {
    var carousel = new CarouselTablist(carousels[i]);
    carousel.init();
  }
}, false);

