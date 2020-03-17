/*
*   File:   carousel-tablist.js
*
*   Desc:   Carousel Tablist widget that implements ARIA Authoring Practices
*
*/

var CarouselTablist = function (node) {

  /* DOM properties */
  this.domNode = node;

  this.tablistNode = node.querySelector('[role=tablist]');
  this.containerNode = node.querySelector('.carousel-items');

  this.tabNodes = [];
  this.tabpanelNodes = [];

  this.liveRegionNode = node.querySelector('.carousel-items');
  this.pauseButtonNode = null;

  this.playLabel = 'Start automatic slide show';
  this.pauseLabel = 'Stop automatic slide show';

  /* State properties */
  this.forcePlay = false; // set once the user activates the play/pause button
  this.playState = true; // state of the play/pause button
  this.rotate = true; // state of rotation
  this.timeInterval = 1000; // length of slide rotation in ms
  this.currentIndex = 0; // index of current slide
  this.slideTimeout = null; // save reference to setTimeout

  // initialize Centering of tab controls

  // initialize tabs

  this.tablistNode.addEventListener('focusin', this.handleTabFocus.bind(this));
  this.tablistNode.addEventListener('focusout', this.handleTabBlur.bind(this));

  var nodes = node.querySelectorAll('[role="tab"]');

  for (var i = 0; i < nodes.length; i++) {
    var n = nodes[i];

    this.tabNodes.push(n);

    n.addEventListener('keydown', this.handleTabKeydown.bind(this));
    n.addEventListener('click', this.handleTabClick.bind(this));

    // initialize tabpanels

    var tabpanelNode = document.getElementById(n.getAttribute('aria-controls'));

    if (tabpanelNode) {
      this.tabpanelNodes.push(tabpanelNode);

      // support stopping rotation when any element receives focus in the tabpanel
      tabpanelNode.addEventListener('focusin', this.handleTabpanelFocusIn.bind(this));
      tabpanelNode.addEventListener('focusout', this.handleTabpanelFocusOut.bind(this));

      var imageLink = tabpanelNode.querySelector('.carousel-image a');

      if (imageLink) {
        imageLink.addEventListener('focus', this.handleImageLinkFocus.bind(this));
        imageLink.addEventListener('blur', this.handleImageLinkBlur.bind(this));
      }

    }
    else {
      this.tabpanelNodes.push(null);
    }

  }

  // Pause Button

  var elem = document.querySelector('.carousel-tablist .controls button.rotation');
  if (elem) {
    this.pauseButtonNode = elem;
    this.pauseButtonNode.classList.add('pause');
    this.pauseButtonNode.setAttribute('aria-label', this.pauseLabel);
    this.pauseButtonNode.addEventListener('click', this.handlePauseButtonClick.bind(this));
  }

  this.domNode.addEventListener('mouseover', this.handleMouseOver.bind(this));
  this.domNode.addEventListener('mouseout', this.handleMouseOut.bind(this));

  // Start rotation
  this.rotateSlides(false);

  // If URL contains text "paused", carousel is initially paused
  if (location.href.toLowerCase().indexOf('paused') > 0) {
    this.playState = false;
    this.updateRotation();
    this.updatePlayState(false);
  }

  // If URL contains text "noplay", carousel is disabled from autorotation
  if (location.href.toLowerCase().indexOf('noplay') > 0) {
    this.playState = false;
    this.updateRotation();
    this.updatePlayState(false);
    this.pauseButtonNode.hidden = true;
  }

  // Center Tablist Controls

  if (this.tablistNode.style.textAlign != 'center') {
    this.centerTablistControls();
    window.addEventListener('resize', this.centerTablistControls.bind(this));
  }

}

CarouselTablist.prototype.centerTablistControls = function () {
  var width1 = this.tablistNode.getBoundingClientRect().width;
  var width2 = this.containerNode.getBoundingClientRect().width;
  var width3 = this.pauseButtonNode.getBoundingClientRect().width;
  this.tablistNode.style.left = (((width2-width1)/2) - (3*width3/2)) +'px';
}

CarouselTablist.prototype.hideTabpanel = function (index) {
  var tabNode = this.tabNodes[index];
  var panelNode = this.tabpanelNodes[index];

  tabNode.setAttribute('aria-selected', 'false');
  tabNode.setAttribute('tabindex', '-1');

  if (panelNode) {
    panelNode.classList.remove('active');
  }
}

CarouselTablist.prototype.showTabpanel = function (index, moveFocus = false) {
  var tabNode = this.tabNodes[index];
  var panelNode = this.tabpanelNodes[index];

  tabNode.setAttribute('aria-selected', 'true');
  tabNode.removeAttribute('tabindex');

  if (panelNode) {
    panelNode.classList.add('active');
  }

  if (moveFocus) {
    tabNode.focus();
  }
}

CarouselTablist.prototype.setSelectedTab = function (index, moveFocus) {
  if (index === this.currentIndex) {
    return;
  }
  this.currentIndex = index;

  for (var i = 0; i < this.tabNodes.length; i++) {
    this.hideTabpanel(i);
  }

  this.showTabpanel(index, moveFocus);
}

CarouselTablist.prototype.setSelectedToPreviousTab = function (moveFocus) {
  var nextIndex = this.currentIndex - 1;

  if (nextIndex < 0) {
    nextIndex = this.tabNodes.length - 1;
  }

  this.setSelectedTab(nextIndex, moveFocus);
}

CarouselTablist.prototype.setSelectedToNextTab = function (moveFocus) {
  var nextIndex = this.currentIndex + 1;

  if (nextIndex >= this.tabNodes.length) {
    nextIndex = 0;
  }

  this.setSelectedTab(nextIndex, moveFocus);
}

CarouselTablist.prototype.rotateSlides = function (changeSlide = true) {
  if (changeSlide) {
    this.setSelectedToNextTab();
  }

  this.slideTimeout = setTimeout(this.rotateSlides.bind(this), this.timeInterval);
}

CarouselTablist.prototype.resetTimeout = function() {
  clearTimeout(this.slideTimeout);
  this.rotate = false;
  this.updateRotation();
}

CarouselTablist.prototype.updateRotation = function() {
  var shouldRotate = !this.hasFocus && !this.hasHover && this.playState;
  if (shouldRotate === this.rotate) {
    return;
  }

  this.rotate = shouldRotate;

  if (shouldRotate) {
    this.rotateSlides(false);
  }
  else {
    clearTimeout(this.slideTimeout);
  }
}

CarouselTablist.prototype.updatePlayState = function (play) {
  this.playState = play;
  this.updateRotation();

  if (!play) {
    this.pauseButtonNode.setAttribute('aria-label', this.playLabel);
    this.pauseButtonNode.classList.remove('pause');
    this.pauseButtonNode.classList.add('play');
    this.liveRegionNode.setAttribute('aria-live', 'polite');
  }
  else {
    this.pauseButtonNode.setAttribute('aria-label', this.pauseLabel);
    this.pauseButtonNode.classList.remove('play');
    this.pauseButtonNode.classList.add('pause');
    this.liveRegionNode.setAttribute('aria-live', 'off');
  }
}

  /* Event Handlers */

CarouselTablist.prototype.handleImageLinkFocus = function () {
  this.liveRegionNode.classList.add('focus');
}

CarouselTablist.prototype.handleImageLinkBlur = function () {
  this.liveRegionNode.classList.remove('focus');
}

CarouselTablist.prototype.handleMouseOver = function (event) {
  if (!this.forcePlay) {
    if (!this.pauseButtonNode.contains(event.target)) {
      this.hasHover = true;
    }
    this.updateRotation();
  }
}

CarouselTablist.prototype.handleMouseOut = function () {
  if (!this.forcePlay) {
    this.hasHover = false;
    this.updateRotation();
  }
}

  /* EVENT HANDLERS */

CarouselTablist.prototype.handlePauseButtonClick = function () {
  this.forcePlay = true;
  this.updatePlayState(!this.playState);
}

  /* Event Handlers for Tabs*/

CarouselTablist.prototype.handleTabKeydown = function (event) {
  var flag = false;

  switch (event.key) {

    case 'ArrowRight':
      this.setSelectedToNextTab(true);
      this.resetTimeout();
      flag = true;
      break;

    case 'ArrowLeft':
      this.setSelectedToPreviousTab(true);
      this.resetTimeout();
      flag = true;
      break;

    case 'Home':
      this.setSelectedTab(0, true);
      this.resetTimeout();
      flag = true;
      break;

    case 'End':
      this.setSelectedTab(this.tabNodes.length - 1, true);
      this.resetTimeout();
      flag = true;
      break;

    default:
      break;
  }

  if (flag) {
    event.stopPropagation();
    event.preventDefault();
  }
}

CarouselTablist.prototype.handleTabClick = function (event) {
  var index = this.tabNodes.indexOf(event.currentTarget);
  this.setSelectedTab(index, true);
  this.resetTimeout();
}

CarouselTablist.prototype.handleTabFocus = function () {
  this.tablistNode.classList.add('focus');

  if (!this.forcePlay) {
    this.hasFocus = true;
    this.updateRotation();
  }
}

CarouselTablist.prototype.handleTabBlur = function () {
  this.tablistNode.classList.remove('focus');

  if (!this.forcePlay) {
    this.hasFocus = false;
    this.updateRotation();
  }
}


  /* Event Handlers for Tabpanels*/

CarouselTablist.prototype.handleTabpanelFocusIn = function () {
  this.hasFocus = true;
  this.updateRotation();
}

CarouselTablist.prototype.handleTabpanelFocusOut = function () {
  this.hasFocus = false;
  this.updateRotation();
}

/* Iniitalize Carousel Tablists */

window.addEventListener('load', function () {
  var carousels = document.querySelectorAll('.carousel-tablist');

  carousels.forEach(function (node) {
    new CarouselTablist(node);
  });
}, false);

