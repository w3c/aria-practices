/*
*   File:   carousel-tablist.js
*
*   Desc:   Carousel Tablist widget that implements ARIA Authoring Practices
*
*/

// takes options object: { accessibleCaptions: boolean, autoplay: boolean, playButton: boolean }
// defaults are: { accessibleCaptions: true, autoplay: false, playButton: true }

var CarouselTablist = function (node, options) {
  // merge passed options with defaults
  options = Object.assign({ moreaccessible: false, paused: false, norotate: false }, (options || {}));

  // a prefers-reduced-motion user setting must always override autoplay
  var hasReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  if (hasReducedMotion.matches) {
    options.paused = true;
  }

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
  this.playState = !options.paused; // state of the play/pause button
  this.rotate = !options.paused; // state of rotation
  this.timeInterval = 5000; // length of slide rotation in ms
  this.currentIndex = 0; // index of current slide
  this.slideTimeout = null; // save reference to setTimeout

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
    this.pauseButtonNode.addEventListener('click', this.handlePauseButtonClick.bind(this));
  }

  // initialize behavior based on options

  this.updatePlayState(this.rotate && !options.norotate);

  if (this.rotate && !options.norotate) {
    this.rotateSlides(false);
  }

  if (options.norotate) {
    this.disableRotation(true);
  }

  this.setAccessibleStyling(options.moreaccessible);

  this.domNode.addEventListener('mouseover', this.handleMouseOver.bind(this));
  this.domNode.addEventListener('mouseout', this.handleMouseOut.bind(this));

}

/* Public function to disable or enable rotation */
CarouselTablist.prototype.disableRotation = function(disable) {
  if (disable) {
    this.updatePlayState(false);
  }
  this.pauseButtonNode.hidden = disable;
}

/* Public function to update controls/caption styling */
CarouselTablist.prototype.setAccessibleStyling = function(accessible) {
  if (accessible) {
    this.domNode.classList.add('carousel-tablist-moreaccessible');
  }
  else {
    this.domNode.classList.remove('carousel-tablist-moreaccessible');
  }
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

CarouselTablist.prototype.showTabpanel = function (index, moveFocus) {
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

CarouselTablist.prototype.rotateSlides = function (changeSlide) {
  if (changeSlide !== false) {
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
  this.liveRegionNode.setAttribute('aria-live', 'polite');

  if (!this.forcePlay) {
    this.hasFocus = true;
    this.updateRotation();
  }
}

CarouselTablist.prototype.handleTabBlur = function () {
  this.tablistNode.classList.remove('focus');
  if (this.playState) {
    this.liveRegionNode.setAttribute('aria-live', 'off');
  }

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

/* Iniitalize Carousel Tablists and options */

window.addEventListener('load', function () {
  var carouselEls = document.querySelectorAll('.carousel-tablist');
  var carousels = [];

  // set example behavior based on
  // default setting of the checkboxes and the parameters in the URL
  // update checkboxes based on any corresponding URL parameters
  var checkboxes = document.querySelectorAll('.carousel-options input[type=checkbox]');
  var urlParams = new URLSearchParams(location.search);
  var carouselOptions = {};

  // initialize example features based on
  // default setting of the checkboxes and the parameters in the URL
  // update checkboxes based on any corresponding URL parameters
  checkboxes.forEach(function(checkbox) {
    var checked = checkbox.checked;

    if (urlParams.has(checkbox.value)) {
      var urlParam = urlParams.get(checkbox.value);
      if (typeof urlParam === 'string') {
        checked = urlParam === 'true';
        checkbox.checked = checked;
      }
    }

    carouselOptions[checkbox.value] = checkbox.checked;
  });

  carouselEls.forEach(function (node) {
    carousels.push(new CarouselTablist(node, carouselOptions));
  });

  // add change event to checkboxes
  checkboxes.forEach(function(checkbox) {
    var updateEvent;
    switch(checkbox.value) {
      case 'moreaccessible':
        updateEvent = 'setAccessibleStyling';
        break;
      case 'norotate':
        updateEvent = 'disableRotation';
        break;
    }

    // update the carousel behavior and URL when a checkbox state changes
    checkbox.addEventListener('change', function(event) {
      urlParams.set(event.target.value, event.target.checked + '');
      window.history.replaceState(null, '', window.location.pathname + '?' + urlParams);

      if (updateEvent) {
        carousels.forEach(function (carousel) {
          carousel[updateEvent](event.target.checked);
        });
      }
    });
  });
}, false);

