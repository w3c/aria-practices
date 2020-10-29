/*
 *   This content is licensed according to the W3C Software License at
 *   https://www.w3.org/Consortium/Legal/2015/copyright-software-and-document
 *
 *   File:   text-slider.js
 *
 *   Desc:   Text slider widget that implements ARIA Authoring Practices
 */

'use strict';

// Create Text Slider that contains value, valuemin, valuemax, and valuenow

var TSlider = function (domNode) {
  this.domNode = domNode;
  this.railDomNode = domNode.parentNode;

  this.valueDomNode = false;

  this.values = [];
  this.valueNodes = this.railDomNode.getElementsByClassName('value');
  for (var i = 0; this.valueNodes[i]; i++) {
    this.values.push(this.valueNodes[i].innerHTML);
  }
  this.valueMin = 0;
  this.valueMax = this.values.length - 1;
  this.valueNow = 0;
  this.valueText = parseInt(this.values[this.valueNow]);
  this.valueInc = 1;

  this.railWidth = 0;

  this.thumbWidth = 8;
  this.thumbHeight = 28;

  this.keyCode = Object.freeze({
    left: 37,
    up: 38,
    right: 39,
    down: 40,
    end: 35,
    home: 36,
  });
};

// Initialize text slider
TSlider.prototype.init = function () {
  if (this.domNode.getAttribute('aria-valuemin')) {
    this.valueMin = parseInt(this.domNode.getAttribute('aria-valuemin'));
  }
  if (this.domNode.getAttribute('aria-valuemax')) {
    this.valueMax = parseInt(this.domNode.getAttribute('aria-valuemax'));
  }
  if (this.domNode.getAttribute('aria-valuenow')) {
    this.valueNow = parseInt(this.domNode.getAttribute('aria-valuenow'));
  }

  this.railWidth = parseInt(this.railDomNode.style.width.slice(0, -2));

  if (this.domNode.tabIndex != 0) {
    this.domNode.tabIndex = 0;
  }

  this.domNode.style.width = this.thumbWidth + 'px';
  this.domNode.style.height = this.thumbHeight + 'px';
  this.domNode.style.top = this.thumbHeight / -2 + 'px';

  var pos = 0;
  var diff = this.railWidth / (this.valueNodes.length - 1);
  for (var i = 0; this.valueNodes[i]; i++) {
    this.valueNodes[i].style.left =
      pos - this.valueNodes[i].offsetWidth / 2 + 'px';
    pos = pos + diff;
  }

  this.domNode.addEventListener('keydown', this.handleKeyDown.bind(this));
  // add onmousedown, move, and onmouseup
  this.domNode.addEventListener('mousedown', this.handleMouseDown.bind(this));

  this.domNode.addEventListener('focus', this.handleFocus.bind(this));
  this.domNode.addEventListener('blur', this.handleBlur.bind(this));

  this.railDomNode.addEventListener('click', this.handleClick.bind(this));

  this.moveTSliderTo(this.valueNow);
};

TSlider.prototype.moveTSliderTo = function (value) {
  if (value > this.valueMax) {
    value = this.valueMax;
  }

  if (value < this.valueMin) {
    value = this.valueMin;
  }

  this.valueNow = value;

  this.domNode.setAttribute('aria-valuenow', this.valueNow);
  this.domNode.setAttribute('aria-valuetext', this.values[this.valueNow]);

  var pos =
    Math.round(
      (this.valueNow * this.railWidth) / (this.valueMax - this.valueMin)
    ) -
    this.thumbWidth / 2;

  this.domNode.style.left = pos + 'px';
};

TSlider.prototype.handleKeyDown = function (event) {
  var flag = false;

  switch (event.keyCode) {
    case this.keyCode.left:
    case this.keyCode.down:
      this.moveTSliderTo(this.valueNow - 1);
      flag = true;
      break;

    case this.keyCode.right:
    case this.keyCode.up:
      this.moveTSliderTo(this.valueNow + 1);
      flag = true;
      break;

    case this.keyCode.home:
      this.moveTSliderTo(this.valueMin);
      flag = true;
      break;

    case this.keyCode.end:
      this.moveTSliderTo(this.valueMax);
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

TSlider.prototype.handleFocus = function (event) {
  this.domNode.classList.add('focus');
  this.railDomNode.classList.add('focus');
};

TSlider.prototype.handleBlur = function (event) {
  this.domNode.classList.remove('focus');
  this.railDomNode.classList.remove('focus');
};

TSlider.prototype.handleMouseDown = function (event) {
  var self = this;

  var handleMouseMove = function (event) {
    var diffX = event.pageX - self.railDomNode.offsetLeft;
    self.valueNow = parseInt(
      ((self.valueMax - self.valueMin) * diffX) / self.railWidth
    );
    self.moveTSliderTo(self.valueNow);

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
TSlider.prototype.handleClick = function (event) {
  var diffX = event.pageX - this.railDomNode.offsetLeft;
  this.valueNow = parseInt(
    ((this.valueMax - this.valueMin) * diffX) / this.railWidth
  );
  this.moveTSliderTo(this.valueNow);

  event.preventDefault();
  event.stopPropagation();
};

// Initialise TSliders on the page
window.addEventListener('load', function () {
  var sliders = document.querySelectorAll(
    '.aria-widget-text-slider [role=slider]'
  );

  for (var i = 0; i < sliders.length; i++) {
    var s = new TSlider(sliders[i]);
    s.init();
  }
});
