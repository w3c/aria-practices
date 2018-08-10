/*
*   File:   carouselTablist.js
*
*   Desc:   Carousel Tablist group widget that implements ARIA Authoring Practices
*
*   Author(s): Jon Gunderson, Nicholas Hoyt, and Mark McCarthy
*/

/*
*   @constructor CarouselTablist
*
*
*/
var CarouselTablist = function (domNode) {

  this.domNode   = domNode;

  this.tabs = [];

  this.firstTab  = null;
  this.lastTab   = null;
  this.currentDomNode = null;
  this.currentTab = null;
  this.rotationButton = null;

  this.rotate=false;
  this.enableRotation=true;
  this.hasFocus=null;
  this.timeInterval = 5000;

};

CarouselTablist.prototype.init = function () {
  // initialize pop up menus
  if (!this.domNode.getAttribute('role')) {
    this.domNode.setAttribute('role', 'tablists');
  }

  var tabs = this.domNode.querySelectorAll('.carousel [role=tab]');

  for (var i = 0; i < tabs.length; i++) {
    var tab = new CarouselTab(tabs[i], this);
    tab.init();
    this.tabs.push(tab);

    if (!this.firstTab) {
      this.firstTab = tab;
      this.currentDomNode = tab.domNode;
    }
    this.lastTab = tab;
  }
  this.firstTab.domNode.tabIndex = 0;

  // Next Slide and Previous Slide Buttons

  var elems = document.querySelectorAll('.carousel a.carousel-control');
  for (var i = 0; i < elems.length; i++) {
    if (elems[i].tagName.toLowerCase() == 'a') {
        var button = new CarouselButton(elems[i], this);
        button.init();
    }
  }

  this.currentTab = this.firstTab;

  this.rotationButton = this.domNode.parentNode.parentNode.querySelector('button.rotator');
  this.carouselContainer = this.domNode.parentNode.parentNode;
  if (this.rotationButton){
    var button = new PauseButton(this.rotationButton, this);
    button.init();
  }
  this.carouselContainer.addEventListener('mouseover', this.handleMouseOver.bind(this));
  this.carouselContainer.addEventListener('mouseout', this.handleMouseOut.bind(this));

  // start rotation
  setTimeout(this.rotateSlides.bind(this), this.timeInterval);

};

CarouselTablist.prototype.rotateSlides = function (){
  if (!this.rotate) {
    this.setSelectedToNextItem();
  }
  setTimeout(this.rotateSlides.bind(this), this.timeInterval);
};


CarouselTablist.prototype.setSelected  = function (currentTab, moveFocus) {
  if (typeof moveFocus != 'boolean'){
    moveFocus=false;
  }
  for (var i = 0; i < this.tabs.length; i++) {
    var tab = this.tabs[i];
    tab.domNode.setAttribute('aria-selected', 'false');
    tab.domNode.tabIndex = -1;
    this.currentTab.hideTabPanel();
    }

  this.currentTab = currentTab;

  this.currentTab.domNode.setAttribute('aria-selected', 'true');
  this.currentTab.domNode.tabIndex = 0;
  if (moveFocus){
    this.currentTab.domNode.focus();
}

  if (this.currentTab.domNode.getAttribute('aria-selected') === 'true'){
    this.currentTab.showTabPanel();
  }
};

CarouselTablist.prototype.setSelectedToPreviousItem = function (currentTab, moveFocus) {
  if (typeof moveFocus != 'boolean'){
    moveFocus=false;
  }

  var index;

  if (typeof currentTab !== 'object'){
    currentTab = this.currentTab;
  }

  if (currentTab === this.firstTab) {
    this.setSelected(this.lastTab, moveFocus);
  }
  else {
    index = this.tabs.indexOf(currentTab);
    this.setSelected(this.tabs[index - 1], moveFocus);
  }
};

CarouselTablist.prototype.setSelectedToNextItem = function (currentTab, moveFocus) {
  if (typeof moveFocus != 'boolean'){
    moveFocus=false;
  }

  var index;

  if (typeof currentTab !== 'object'){
    currentTab = this.currentTab;
  }

  if (currentTab === this.lastTab) {
    this.setSelected(this.firstTab, moveFocus);
  }
  else {
    index = this.tabs.indexOf(currentTab);
    this.setSelected(this.tabs[index + 1], moveFocus);
  }
};

CarouselTablist.prototype.startRotation = function(){
  if (this.enableRotation && !this.hasFocus && !this.hasHover) {
    this.rotate = false;
  }
  else {
    this.rotate = true;
}
}

CarouselTablist.prototype.stopRotation = function(){
  this.rotate = true;
}

CarouselTablist.prototype.toggleRotation = function(){

  if (this.enableRotation){
    this.enableRotation=false;
    this.stopRotation();
    this.rotationButton.innerHTML='Start Carousel';
    console.log("rotation is "+this.enableRotation);
  }
  else {
    this.enableRotation = true;
    this.startRotation();
    this.hasFocus=false;
    this.rotationButton.innerHTML='Pause Carousel';
    console.log("rotation is "+this.enableRotation);
  }

};

CarouselTablist.prototype.handleMouseOver = function(){
  this.stopRotation();
};
CarouselTablist.prototype.handleMouseOut = function(){
    this.startRotation();
};

/* Initialize Carousel Tablists */


window.addEventListener('load', function (event) {

  var carouselTablists =  document.querySelectorAll('.carousel .carousel-indicators');

  for (var i = 0; i < carouselTablists.length; i++) {

    var ctl = new CarouselTablist(carouselTablists[i]);
    ctl.init();
  }

}, false);
