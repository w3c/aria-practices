/*
*   File:   carousel-tablist.js
*
*   Desc:   Carousel Tablist widget that implements ARIA Authoring Practices
*
*/

class CarouselTablist {

  constructor (node) {

    this.domNode = node;

    this.tabNodes = [];
    this.tabpanelNodes = [];

    this.firstTabNode = null;
    this.lastTabNode = null;
    this.currentTabNode = null;

    this.liveRegionNode = null;
    this.pauseButton = null;

    this.playLabel = 'Start automatic slide show';
    this.pauseLabel = 'Stop automatic slide show';

    this.rotate = true;
    this.hasFocus = false;
    this.hasHover = false;
    this.isStopped = false;
    this.timeInterval = 5000;

    this.liveRegionNode = this.domNode.querySelector('.carousel-items');

    // initialize tabs

    var nodes = node.querySelectorAll('[role="tab"]');

    for (let i = 0; i < nodes.length; i++) {
      var n = nodes[i];

      this.tabNodes.push(n);

      if (!this.firstTabNode) {
        this.firstTabNode = n;
        this.currentTabNode = n;
      }

      this.lastTabNode = n;

      n.addEventListener('keydown', this.handleTabKeydown.bind(this));
      n.addEventListener('click', this.handleTabClick.bind(this));
      n.addEventListener('focus', this.handleTabFocus.bind(this));
      n.addEventListener('blur', this.handleTabBlur.bind(this));

      // initialize tabpanels

      var tabpanelNode = document.getElementById(n.getAttribute('aria-controls'));

      if (tabpanelNode) {
        this.tabpanelNodes.push(tabpanelNode);

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

  getTabpanelNode (tabNode) {
    var index = this.tabNodes.indexOf(tabNode);
    return this.tabpanelNodes[index];
  }

  hideTabpanel (tabNode) {
    tabNode.setAttribute('aria-selected', 'false');
    tabNode.setAttribute('tabindex', '-1');

    var tabpanelNode = this.getTabpanelNode(tabNode);

    if (tabpanelNode) {
      tabpanelNode.classList.remove('active');
      tabpanelNode.removeAttribute('tabindex');
    }
  }

  showTabpanel (tabNode, moveFocus) {
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

  setSelectedTab (newTab, moveFocus) {
    if (typeof moveFocus != 'boolean') {
      moveFocus = false;
    }

    for (let i = 0; i < this.tabNodes.length; i++) {
      this.hideTabpanel(this.tabNodes[i]);
    }

    this.currentTabNode = newTab;
    this.showTabpanel(newTab, moveFocus);
  }

  setSelectedToPreviousTab (currentTabNode, moveFocus) {
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
  }

  setSelectedToNextTab (currentTabNode, moveFocus) {
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
  }

  setSelectedTofirstTabNode (moveFocus) {
    if (typeof moveFocus != 'boolean') {
      moveFocus = false;
    }
    this.setSelectedTab(this.firstTabNode, moveFocus);
  }

  setSelectedTolastTabNode (moveFocus) {
    if (typeof moveFocus != 'boolean') {
      moveFocus = false;
    }
    this.setSelectedTab(this.lastTabNode, moveFocus);
  }

  rotateSlides () {
    if (this.rotate) {
      this.setSelectedToNextTab();
    }
    setTimeout(this.rotateSlides.bind(this), this.timeInterval);
  }

  updateRotation () {

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

  }

  toggleRotation () {
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

  handleImageLinkFocus () {
    this.liveRegionNode.classList.add('focus');
  }

  handleImageLinkBlur () {
    this.liveRegionNode.classList.remove('focus');
  }

  handleMouseOver (event) {
    if (!this.pauseButton.contains(event.target)) {
      this.hasHover = true;
    }
    this.updateRotation();
  }

  handleMouseOut () {
    this.hasHover = false;
    this.updateRotation();
  }

  /* EVENT HANDLERS */

  handlePauseButtonClick () {
    this.toggleRotation();
  }

  /* Event Handlers for Tabs*/

  handleTabKeydown (event) {
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

  handleTabClick (event) {
    this.setSelectedTab(event.currentTarget, true);
  }

  handleTabFocus (event) {
    event.currentTarget.parentNode.classList.add('focus');
    this.hasFocus = true;
    this.updateRotation();
  }

  handleTabBlur (event) {
    event.currentTarget.parentNode.classList.remove('focus');
    this.hasFocus = false;

    this.updateRotation();
  }


  /* Event Handlers for Tabpanels*/

  handleTabpanelFocusIn (event) {
    event.currentTarget.classList.add('focus');
    this.hasFocus = true;
    this.updateRotation();
  }

  handleTabpanelFocusOut (event) {
    event.currentTarget.classList.remove('focus');
    this.hasFocus = false;
    this.updateRotation();
  }

}


/* Iniitalize Carousel Tablists */


window.addEventListener('load', function () {
  var carousels = document.querySelectorAll('.carousel-tablist');

  carousels.forEach(function (node) {
    new CarouselTablist(node);
  });
}, false);

