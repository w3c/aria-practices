/*
*   File:   carousel-tablist.js
*
*   Desc:   Carousel Tablist widget that implements ARIA Authoring Practices
*
*/

class CarouselTablist {
  domNode = null;

  tabNodes = [];
  tabpanelNodes = [];

  firstTabNode = null;
  lastTabNode = null;
  currentTabNode = null;

  liveRegionNode = null;
  pauseButton = null;

  playLabel = 'Start automatic slide show';
  pauseLabel = 'Stop automatic slide show';

  rotate = true;
  hasFocus = false;
  hasHover = false;
  isStopped = false;
  timeInterval = 5000;

  constructor (node) {

    this.domNode = node;

    this.liveRegionNode = this.domNode.querySelector('.carousel-items');

    // initialize tabs

    var nodes = node.querySelectorAll('[role="tab"]');
    console.log(this.tabNodes.length);

    for(let i = 0; i < nodes.length; i++) {
      var node = nodes[i];
      console.log(node.tagName);

      this.tabNodes.push(node);

      if (!this.firstTabNode) {
        this.firstTabNode = node;
        this.currentTabNode = node;
      }

      this.lastTabNode = node;

      node.addEventListener('keydown', this.handleTabKeydown.bind(this));
      node.addEventListener('click', this.handleTabClick.bind(this));
      node.addEventListener('focus', this.handleTabFocus.bind(this));
      node.addEventListener('blur', this.handleTabBlur.bind(this));

      // initialize tabpanels

      var tabpanelNode = document.getElementById(node.getAttribute('aria-controls'));

      console.log(tabpanelNode.tagName);

      if (tabpanelNode) {
        this.tabpanelNodes.push(tabpanelNode);

        tabpanelNode.addEventListener('focusin', this.handleTabpanelFocusIn.bind(this));
        tabpanelNode.addEventListener('focusout', this.handleTabpanelFocusOut.bind(this));

        var imageLink = tabpanelDomNode.querySelector('.carousel-image a');

        if (imageLink) {
          imageLink.addEventListener('focus', this.handleImageLinkFocus.bind(this));
          imageLink.addEventListener('blur', this.handleImageLinkBlur.bind(this));
        }

      }
      else {
        this.tabpanelNodes.push(null);
        console.log('ERROR: missing tabpanel')
      }

    }

    // Pause Button

    var elem = document.querySelector('.carouselTablist .controls button.rotation');
    if (elem) {
      this.pauseButton = elem;
      this.pauseButton.classList.add('pause');
      this.pauseButton.setAttribute('aria-label', this.pauseLabel);
      this.pauseButton.addEventListener('click', this.handlePauseButtonClick.bind(this));
    }

    this.domNode.addEventListener('mouseover', this.handleMouseOver.bind(this));
    this.domNode.addEventListener('mouseout', this.handleMouseOut.bind(this));

    // Start rotation
    setTimeout(this.rotateSlides.bind(this), this.timeInterval);

  }

  getTabpanelNode(tabNode) {
    var index = this.tabNodes.indexOf(tabNode);
    return this.tabpanelNodes[index];
  }

  hideTabpanel = function (tabNode) {
    tabNode.setAttribute('aria-selected', 'false');
    tabNode.setAttribute('tabindex', '-1');

    var tabpanelNode = this.getTabpanelNode(tabNode);

    if (tabpanelNode) {
      tabpanelNode.classList.remove('active');
      tabpanelNode.removeAttribute('tabindex');
    }
  }

  showTabpanel = function (tabNode, moveFocus) {
    if (typeof moveFocus !== 'boolean') {
      moveFocus = false;
    }

    tabNode.setAttribute('aria-selected', 'true');
    tabNode.removeAttribute('tabindex');

    var tabpanelNode = this.getTabpanelNode(tabNode);

    if (tabpanelNode) {
      tabpanelNode.classList.add('active');
      tabpanelNode.setAttribute('tabindex', '0');
    }

    if (moveFocus) {
      tabNode.focus();
    }
  }

  setSelectedTab = function (newTab, moveFocus) {
    if (typeof moveFocus != 'boolean') {
      moveFocus = false;
    }

    for (let i = 0; i < this.tabNodes.length; i++ ) {
      this.hideTabpanel(this.tabNodes[i]);
    };

    this.currentTabNode = newTab;
    this.showTabpanel(newTab, moveFocus);
  };

  setSelectedToPreviousTab = function (currentTabNode, moveFocus) {
    if (typeof moveFocus != 'boolean') {
      moveFocus = false;
    }

    var index;

    if (typeof currentTabNode !== 'object') {
      currentTabNode = this.currentTabNode;
    }

    if (currentTabNode === this.firstTabNode) {
      this.setSelectedTab(this.lastTabNode, moveFocus);
    }
    else {
      index = this.tabNodes.indexOf(currentTabNode);
      this.setSelectedTab(this.tabNodes[index - 1], moveFocus);
    }
  };

  setSelectedToNextTab = function (currentTabNode, moveFocus) {
    if (typeof moveFocus != 'boolean') {
      moveFocus = false;
    }

    var index;

    if (typeof currentTabNode !== 'object') {
      currentTabNode = this.currentTabNode;
    }

    if (currentTabNode === this.lastTabNode) {
      this.setSelectedTab(this.firstTabNode, moveFocus);
    }
    else {
      index = this.tabNodes.indexOf(currentTabNode);
      this.setSelectedTab(this.tabNodes[index + 1], moveFocus);
    }
  };

  setSelectedTofirstTabNode = function (moveFocus) {
    if (typeof moveFocus != 'boolean') {
      moveFocus = false;
    }
    this.setSelectedTab(this.firstTabNode, moveFocus);
  };

  setSelectedTolastTabNode = function (moveFocus) {
    if (typeof moveFocus != 'boolean') {
      moveFocus = false;
    }
    this.setSelectedTab(this.lastTabNode, moveFocus);
  };

  rotateSlides = function () {
    if (this.rotate) {
      this.setSelectedToNextTab();
    }
    setTimeout(this.rotateSlides.bind(this), this.timeInterval);
  };

  updateRotation = function () {

    // Pause rotation when keyboard focus enters the carousel
    if (this.hasFocus) {
      this.isStopped = true;
    }

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

  toggleRotation = function () {
    if (this.isStopped) {
      if (!this.hasHover && !this.hasFocus) {
        this.isStopped = false;
      }
    }
    else {
      this.isStopped = true;
    }

    this.updateRotation();

  }

  /* Event Handlers */

  handleImageLinkFocus = function () {
    this.liveRegionNode.classList.add('focus');
  }

  handleImageLinkBlur = function () {
    this.liveRegionNode.classList.remove('focus');
  }

  handleMouseOver = function (event) {
    if (!this.pauseButton.contains(event.target)) {
      this.hasHover = true;
    }
    this.updateRotation();
  }

  handleMouseOut = function () {
    this.hasHover = false;
    this.updateRotation();
  }

  /* EVENT HANDLERS */

  handlePauseButtonClick = function () {
    this.toggleRotation();
  }

  /* Event Handlers for Tabs*/

  handleTabKeydown = function (event) {
    var flag = false;

    switch (event.key) {

      case 'ArrowRight':
        this.setSelectedToNextTab(event.currentTarget, true);
        flag = true;
        break;

      case 'ArrowLeft':
        this.setSelectedToPreviousTab(event.currentTarget, true);
        flag = true;
        break;

      case 'Home':
        this.setSelectedTofirstTabNode(true);
        flag = true;
        break;

      case 'End':
        this.setSelectedTolastTabNode(true);
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

  handleTabClick = function (event) {
    this.setSelectedTab(event.currentTarget, true);
  }

  handleTabFocus = function (event) {
    event.currentTarget.parentNode.classList.add('focus');
    this.hasFocus = true;
    this.updateRotation();
  }

  handleTabBlur = function (event) {
    event.currentTarget.parentNode.classList.remove('focus');
    this.hasFocus = false;

    this.updateRotation();
  }


  /* Event Handlers for Tabpanels*/

  handleTabpanelFocusIn = function (event) {
    event.currentTarget.classList.add('focus');
    this.hasFocus = true;
    this.updateRotation();
  }

  handleTabpanelFocusOut = function (event) {
    event.currentTarget.classList.remove('focus');
    this.hasFocus = false;
    this.updateRotation();
  }

}


/* Iniitalize Carousel Tablists */


window.addEventListener('load', function () {
  var carousels = document.querySelectorAll('.carouselTablist');

  carousels.forEach(function(node) {
    var c = new CarouselTablist(node);
  });
}, false);

