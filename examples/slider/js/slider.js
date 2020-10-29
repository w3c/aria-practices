/*
 *   This content is licensed according to the W3C Software License at
 *   https://www.w3.org/Consortium/Legal/2015/copyright-software-and-document
 *
 *   File:   slider.js
 *
 *   Desc:   Slider widget that implements ARIA Authoring Practices
 */

'use strict';

// Create Slider that contains value, valuemin, valuemax, and valuenow
var Slider = function (domNode) {
  this.domNode = domNode;
  this.railDomNode = domNode.parentNode;

  this.valueDomNode = false;

  this.valueMin = 0;
  this.valueMax = 100;
  this.valueNow = 50;

  this.railWidth = 0;

  this.thumbWidth = 8;
  this.thumbHeight = 28;

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

// Initialize slider
Slider.prototype.init = function () {
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

  this.valueDomNode = this.railDomNode.nextElementSibling;

  if (this.valueDomNode) {
    this.valueDomNode.innerHTML = '0';
    this.valueDomNode.style.left =
      this.railDomNode.offsetLeft + this.railWidth + 10 + 'px';
    this.valueDomNode.style.top = this.railDomNode.offsetTop - 8 + 'px';
  }

  if (this.domNode.tabIndex != 0) {
    this.domNode.tabIndex = 0;
  }

  this.domNode.style.width = this.thumbWidth + 'px';
  this.domNode.style.height = this.thumbHeight + 'px';
  this.domNode.style.top = this.thumbHeight / -2 + 'px';

  this.domNode.addEventListener('keydown', this.handleKeyDown.bind(this));
  // add onmousedown, move, and onmouseup
  this.domNode.addEventListener('mousedown', this.handleMouseDown.bind(this));

  this.domNode.addEventListener('focus', this.handleFocus.bind(this));
  this.domNode.addEventListener('blur', this.handleBlur.bind(this));

  this.railDomNode.addEventListener('click', this.handleClick.bind(this));

  this.moveSliderTo(this.valueNow);
};

Slider.prototype.moveSliderTo = function (value) {
  if (value > this.valueMax) {
    value = this.valueMax;
  }

  if (value < this.valueMin) {
    value = this.valueMin;
  }

  this.valueNow = value;

  this.domNode.setAttribute('aria-valuenow', this.valueNow);

  var pos =
    Math.round(
      (this.valueNow * this.railWidth) / (this.valueMax - this.valueMin)
    ) -
    this.thumbWidth / 2;

  this.domNode.style.left = pos + 'px';

  if (this.valueDomNode) {
    this.valueDomNode.innerHTML = this.valueNow.toString();
  }

  updateColorBox();
};

Slider.prototype.handleKeyDown = function (event) {
  var flag = false;

  switch (event.keyCode) {
    case this.keyCode.left:
    case this.keyCode.down:
      this.moveSliderTo(this.valueNow - 1);
      flag = true;
      break;

    case this.keyCode.right:
    case this.keyCode.up:
      this.moveSliderTo(this.valueNow + 1);
      flag = true;
      break;

    case this.keyCode.pageDown:
      this.moveSliderTo(this.valueNow - 10);
      flag = true;
      break;

    case this.keyCode.pageUp:
      this.moveSliderTo(this.valueNow + 10);
      flag = true;
      break;

    case this.keyCode.home:
      this.moveSliderTo(this.valueMin);
      flag = true;
      break;

    case this.keyCode.end:
      this.moveSliderTo(this.valueMax);
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

Slider.prototype.handleFocus = function (event) {
  this.domNode.classList.add('focus');
  this.railDomNode.classList.add('focus');
};

Slider.prototype.handleBlur = function (event) {
  this.domNode.classList.remove('focus');
  this.railDomNode.classList.remove('focus');
};

// Initialise Sliders on the page
window.addEventListener('load', function () {
  var sliders = document.querySelectorAll('[role=slider]');

  for (var i = 0; i < sliders.length; i++) {
    var s = new Slider(sliders[i]);
    s.init();
  }
});

Slider.prototype.handleMouseDown = function (event) {
  var self = this;

  var handleMouseMove = function (event) {
    var diffX = event.pageX - self.railDomNode.offsetLeft;
    self.valueNow = parseInt(
      ((self.valueMax - self.valueMin) * diffX) / self.railWidth
    );
    self.moveSliderTo(self.valueNow);

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
Slider.prototype.handleClick = function (event) {
  var diffX = event.pageX - this.railDomNode.offsetLeft;
  this.valueNow = parseInt(
    ((this.valueMax - this.valueMin) * diffX) / this.railWidth
  );
  this.moveSliderTo(this.valueNow);

  event.preventDefault();
  event.stopPropagation();
};

/* ---------------------------------------------------------------- */
/*                  Change color of the Box                         */
/* ---------------------------------------------------------------- */

function updateColorBox() {
  function getColorHex() {
    var r = parseInt(
      document.getElementById('idRedValue').getAttribute('aria-valuenow')
    ).toString(16);
    var g = parseInt(
      document.getElementById('idGreenValue').getAttribute('aria-valuenow')
    ).toString(16);
    var b = parseInt(
      document.getElementById('idBlueValue').getAttribute('aria-valuenow')
    ).toString(16);

    if (r.length === 1) {
      r = '0' + r;
    }
    if (g.length === 1) {
      g = '0' + g;
    }
    if (b.length === 1) {
      b = '0' + b;
    }

    return '#' + r + g + b;
  }

  function getColorRGB() {
    var r = document.getElementById('idRedValue').getAttribute('aria-valuenow');
    var g = document
      .getElementById('idGreenValue')
      .getAttribute('aria-valuenow');
    var b = document
      .getElementById('idBlueValue')
      .getAttribute('aria-valuenow');

    return r + ', ' + g + ', ' + b;
  }

  var node = document.getElementById('idColorBox');

  if (node) {
    var color = getColorHex();

    node.style.backgroundColor = color;

    node = document.getElementById('idColorValueHex');
    node.value = color;

    node = document.getElementById('idColorValueRGB');
    node.value = getColorRGB();
  }
}
