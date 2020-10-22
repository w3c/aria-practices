/*
 *   This content is licensed according to the W3C Software License at
 *   https://www.w3.org/Consortium/Legal/2015/copyright-software-and-document
 *
 *   File:   vertical-slider.js
 *
 *   Desc:   Vertical slider widget that implements ARIA Authoring Practices
 */

'use strict';

// Create Vertical Slider that contains value, valuemin, valuemax, and valuenow
var VSlider = function (domNode) {
  this.domNode = domNode;
  this.railDomNode = domNode.parentNode;

  this.valueDomNode = false;

  this.valueMin = 0;
  this.valueMax = 100;
  this.valueNow = 50;

  this.railHeight = 0;

  this.thumbWidth = 28;
  this.thumbHeight = 8;

  this.keyCode = Object.freeze({
    left: 37,
    up: 38,
    right: 39,
    down: 40,
    pageUp: 33,
    pageDown: 34,
    end: 35,
    home: 36,
  });
};

// Initialize vertical slider
VSlider.prototype.init = function () {
  this.domNode.setAttribute('aria-orientation', 'vertical');

  if (this.domNode.getAttribute('aria-valuemin')) {
    this.valueMin = parseInt(this.domNode.getAttribute('aria-valuemin'));
  }
  if (this.domNode.getAttribute('aria-valuemax')) {
    this.valueMax = parseInt(this.domNode.getAttribute('aria-valuemax'));
  }
  if (this.domNode.getAttribute('aria-valuenow')) {
    this.valueNow = parseInt(this.domNode.getAttribute('aria-valuenow'));
  }

  this.railHeight = parseInt(this.railDomNode.style.height.slice(0, -2));

  this.valueDomNode = this.railDomNode.previousElementSibling;

  if (this.valueDomNode) {
    this.valueDomNode.style.position = 'relative';
  }

  if (this.domNode.tabIndex != 0) {
    this.domNode.tabIndex = 0;
  }

  this.domNode.style.width = this.thumbWidth + 'px';
  this.domNode.style.height = this.thumbHeight + 'px';
  this.domNode.style.left = this.thumbWidth / -2 + 'px';

  this.domNode.addEventListener('keydown', this.handleKeyDown.bind(this));
  // add onmousedown, move, and onmouseup
  this.domNode.addEventListener('mousedown', this.handleMouseDown.bind(this));

  this.domNode.addEventListener('focus', this.handleFocus.bind(this));
  this.domNode.addEventListener('blur', this.handleBlur.bind(this));

  this.railDomNode.addEventListener('click', this.handleClick.bind(this));

  this.moveVSliderTo(this.valueNow);
};

VSlider.prototype.moveVSliderTo = function (value) {
  if (value > this.valueMax) {
    value = this.valueMax;
  }

  if (value < this.valueMin) {
    value = this.valueMin;
  }

  this.valueNow = value;

  this.domNode.setAttribute('aria-valuenow', this.valueNow);
  this.domNode.setAttribute('aria-valuetext', this.valueNow + ' degrees');

  var pos =
    Math.round(
      ((this.valueMax - this.valueNow) * this.railHeight) /
        (this.valueMax - this.valueMin)
    ) -
    this.thumbHeight / 2;

  this.domNode.style.top = pos + 'px';

  if (this.valueDomNode) {
    this.valueDomNode.innerHTML = this.valueNow.toString();
    this.valueDomNode.style.left = this.railDomNode.offsetWidth / 2 - 2 + 'px';
    console.log(this.valueDomNode.style.left);
  }
};

VSlider.prototype.handleKeyDown = function (event) {
  var flag = false;

  switch (event.keyCode) {
    case this.keyCode.left:
    case this.keyCode.down:
      this.moveVSliderTo(this.valueNow - 1);
      flag = true;
      break;

    case this.keyCode.right:
    case this.keyCode.up:
      this.moveVSliderTo(this.valueNow + 1);
      flag = true;
      break;

    case this.keyCode.pageDown:
      this.moveVSliderTo(this.valueNow - 10);
      flag = true;
      break;

    case this.keyCode.pageUp:
      this.moveVSliderTo(this.valueNow + 10);
      flag = true;
      break;

    case this.keyCode.home:
      this.moveVSliderTo(this.valueMin);
      flag = true;
      break;

    case this.keyCode.end:
      this.moveVSliderTo(this.valueMax);
      flag = true;
      break;

    default:
      break;
  }

  if (flag) {
    event.preventDefault();
    event.stopPropagation();
  }
};

VSlider.prototype.handleFocus = function (event) {
  this.domNode.classList.add('focus');
  this.railDomNode.classList.add('focus');
};

VSlider.prototype.handleBlur = function (event) {
  this.domNode.classList.remove('focus');
  this.railDomNode.classList.remove('focus');
};

VSlider.prototype.handleMouseDown = function (event) {
  var self = this;

  var handleMouseMove = function (event) {
    var diffY = event.pageY - self.railDomNode.offsetTop;
    self.valueNow =
      self.valueMax -
      parseInt(((self.valueMax - self.valueMin) * diffY) / self.railHeight);
    self.moveVSliderTo(self.valueNow);

    event.preventDefault();
    event.stopPropagation();
  };

  var handleMouseUp = function (event) {
    document.removeEventListener('mousemove', handleMouseMove);
    document.removeEventListener('mouseup', handleMouseUp);
  };

  // bind a mousemove event handler to move pointer
  document.addEventListener('mousemove', handleMouseMove);

  // bind a mouseup event handler to stop tracking mouse movements
  document.addEventListener('mouseup', handleMouseUp);

  event.preventDefault();
  event.stopPropagation();

  // Set focus to the clicked handle
  this.domNode.focus();
};

// handleMouseMove has the same functionality as we need for handleMouseClick on the rail
VSlider.prototype.handleClick = function (event) {
  var diffY = event.pageY - this.railDomNode.offsetTop;
  this.valueNow =
    this.valueMax -
    parseInt(((this.valueMax - this.valueMin) * diffY) / this.railHeight);
  this.moveVSliderTo(this.valueNow);

  event.preventDefault();
  event.stopPropagation();
};

// Initialise VSliders on the page
window.addEventListener('load', function () {
  var sliders = document.querySelectorAll(
    '.aria-widget-vertical-slider [role=slider]'
  );

  for (var i = 0; i < sliders.length; i++) {
    var s = new VSlider(sliders[i]);
    s.init();
  }
});
