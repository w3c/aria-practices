'use strict';
/*
*   This content is licensed according to the W3C Software License at
*   https://www.w3.org/Consortium/Legal/2015/copyright-software-and-document
*
*   File:   slider.js
*
*   Desc:   ColorPickerSliders widget that implements ARIA Authoring Practices
*/

// Create ColorPickerSliders that contains value, valuemin, valuemax, and valuenow
var ColorPickerSliders = function (domNode)  {

  this.domNode = domNode;

  this.sliders = {};

  this.initSliderRefs(this.sliders, 'red');
  this.initSliderRefs(this.sliders, 'green');
  this.initSliderRefs(this.sliders, 'blue');

  this.thumbWidth  = this.sliders.red.thumbNode.getBBox().width;
  this.railWidth = this.sliders.red.railNode.getBBox().width;
  this.offsetLeft = 6;

  this.colorBoxNode = domNode.querySelector('.color-box');
  this.colorValueHexNode = domNode.querySelector('input.color-value-hex');
  this.colorValueRGBNode = domNode.querySelector('input.color-value-rgb');

};

ColorPickerSliders.prototype.initSliderRefs = function (sliderRef, color) {
  sliderRef[color] = {};
  var n = this.domNode.querySelector('.color-group.' + color);
  sliderRef[color].groupNode  = n;
  sliderRef[color].sliderNode = n.querySelector('.color-slider');
  sliderRef[color].valueNode  = n.querySelector('.value');
  sliderRef[color].thumbNode  = n.querySelector('.thumb');
  sliderRef[color].railNode   = n.querySelector('.rail');
  sliderRef[color].fillNode   = n.querySelector('.fill');
  sliderRef[color].dec10Node  = n.querySelector('.dec10');
  sliderRef[color].decNode    = n.querySelector('.dec');
  sliderRef[color].incNode    = n.querySelector('.inc');
  sliderRef[color].inc10Node  = n.querySelector('.inc10');
};

// Initialize slider
ColorPickerSliders.prototype.init = function () {

  for (var slider in this.sliders) {

    console.log('[slider]: ' + slider);

    if (this.sliders[slider].sliderNode.tabIndex != 0) {
      this.sliders[slider].sliderNode.tabIndex = 0;
    }

    this.sliders[slider].railNode.addEventListener('click', this.handleRailClick.bind(this));

    this.sliders[slider].sliderNode.addEventListener('keydown', this.handleSliderKeyDown.bind(this));

    this.sliders[slider].sliderNode.addEventListener('mousedown',this.handleThumbMouseDown.bind(this));
    this.sliders[slider].sliderNode.addEventListener('focus', this.handleFocus.bind(this));
    this.sliders[slider].sliderNode.addEventListener('blur', this.handleBlur.bind(this));

    this.sliders[slider].dec10Node.addEventListener('click', this.handleDec10Click.bind(this));
    this.sliders[slider].dec10Node.addEventListener('focus', this.handleFocus.bind(this));
    this.sliders[slider].dec10Node.addEventListener('blur', this.handleBlur.bind(this));

    this.sliders[slider].decNode.addEventListener('click', this.handleDecClick.bind(this));
    this.sliders[slider].decNode.addEventListener('focus', this.handleFocus.bind(this));
    this.sliders[slider].decNode.addEventListener('blur', this.handleBlur.bind(this));

    this.sliders[slider].incNode.addEventListener('click', this.handleIncClick.bind(this));
    this.sliders[slider].incNode.addEventListener('focus', this.handleFocus.bind(this));
    this.sliders[slider].incNode.addEventListener('blur', this.handleBlur.bind(this));

    this.sliders[slider].inc10Node.addEventListener('click', this.handleInc10Click.bind(this));
    this.sliders[slider].inc10Node.addEventListener('focus', this.handleFocus.bind(this));
    this.sliders[slider].inc10Node.addEventListener('blur', this.handleBlur.bind(this));

    this.moveSliderTo(this.sliders[slider], this.getValueNow(this.sliders[slider]));

  }
};

ColorPickerSliders.prototype.getSlider = function (domNode) {

  if (!domNode.classList.contains('color-slider')) {
    if (domNode.tagName.toLowerCase() === 'rect') {
      domNode = domNode.parentNode.parentNode;
    }
    else {
      domNode = domNode.parentNode.querySelector('.color-slider');
    }
  }

  if (this.sliders.red.sliderNode === domNode) {
    return this.sliders.red;
  }

  if (this.sliders.green.sliderNode === domNode) {
    return this.sliders.green;
  }

  return this.sliders.blue;
};

ColorPickerSliders.prototype.getValueMin = function (slider) {
  return parseInt(slider.sliderNode.getAttribute('aria-valuemin'));
};

ColorPickerSliders.prototype.getValueNow = function (slider) {
  return parseInt(slider.sliderNode.getAttribute('aria-valuenow'));
};

ColorPickerSliders.prototype.getValueMax = function (slider) {
  return parseInt(slider.sliderNode.getAttribute('aria-valuemax'));
};

ColorPickerSliders.prototype.moveSliderTo = function (slider, value) {

  console.log('[moveSliderTo][slider]: ' + slider.sliderNode.classList);

  var valueMin = this.getValueMin(slider);
  var valueNow = this.getValueNow(slider);
  var valueMax = this.getValueMax(slider);

  if (value > valueMax) {
    value = valueMax;
  }

  if (value < valueMin) {
    value = valueMin;
  }

  valueNow = value;
  slider.sliderNode.setAttribute('aria-valuenow', value);

  slider.fillNode.setAttribute('width', valueNow + 2 * this.offsetLeft);

  var n = valueNow * this.railWidth;
  var d = valueMax - valueMin;
  var pos = Math.round((valueNow * (this.railWidth - this.thumbWidth)) / (valueMax - valueMin)) + this.offsetLeft;
  slider.thumbNode.setAttribute('x', pos);

  slider.valueNode.textContent = valueNow;
  var valueWidth = slider.valueNode.getBBox().width;
  slider.valueNode.setAttribute('x', pos - ((valueWidth + this.thumbWidth) / 2) + this.thumbWidth);

  this.updateColorBox();
};

ColorPickerSliders.prototype.handleSliderKeyDown = function (event) {

  var flag = false;

  var slider = this.getSlider(event.currentTarget);

  var valueMin = this.getValueMin(slider);
  var valueNow = this.getValueNow(slider);
  var valueMax = this.getValueMax(slider);

  switch (event.key) {
    case 'Left':
    case 'ArrowLeft':
    case 'Down':
    case 'ArrowDown':
      this.moveSliderTo(slider, valueNow - 1);
      flag = true;
      break;

    case 'Right':
    case 'ArrowRight':
    case 'Up':
    case 'ArrowUp':
      this.moveSliderTo(slider, valueNow + 1);
      flag = true;
      break;

    case 'PageDown':
      this.moveSliderTo(slider, valueNow - 10);
      flag = true;
      break;

    case 'PageUp':
      this.moveSliderTo(slider, valueNow + 10);
      flag = true;
      break;

    case 'Home':
      this.moveSliderTo(slider, valueMin);
      flag = true;
      break;

    case 'End':
      this.moveSliderTo(slider, valueMax);
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

ColorPickerSliders.prototype.handleThumbMouseDown = function (event) {

  var slider = this.getSlider(event.currentTarget);

  var valueMin = this.getValueMin(slider);
  var valueNow = this.getValueNow(slider);
  var valueMax = this.getValueMax(slider);

  var handleMouseMove = function (event) {
    var diffX = event.pageX - slider.sliderNode.offsetLeft - (this.thumbWidth / 2);
    valueNow = Math.round(((valueMax - valueMin) * diffX) / (this.railWidth - this.thumbWidth));
    this.moveSliderTo(slider, valueNow);
    event.preventDefault();
    event.stopPropagation();
  }.bind(this);

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
  slider.sliderNode.focus();

};

// handleMouseMove has the same functionality as we need for handleMouseClick on the rail
ColorPickerSliders.prototype.handleRailClick = function (event) {

  var slider = this.getSlider(event.currentTarget);

  var valueMin = this.getValueMin(slider);
  var valueNow = this.getValueNow(slider);
  var valueMax = this.getValueMax(slider);

  var diffX = event.pageX - slider.sliderNode.offsetLeft - (this.thumbWidth / 2);
  valueNow = Math.round(((valueMax - valueMin) * diffX) / (this.railWidth - this.thumbWidth));
  this.moveSliderTo(slider, valueNow);
  event.preventDefault();
  event.stopPropagation();

};

ColorPickerSliders.prototype.handleChangeClick = function (event, n) {
  var slider = this.getSlider(event.currentTarget);

  var valueMin = this.getValueMin(slider);
  var valueNow = this.getValueNow(slider);
  var valueMax = this.getValueMax(slider);

  valueNow = valueNow + n;
  this.moveSliderTo(slider, valueNow);
  event.preventDefault();
  event.stopPropagation();
};

ColorPickerSliders.prototype.handleDec10Click = function (event) {
  this.handleChangeClick(event, -10);
};

ColorPickerSliders.prototype.handleDecClick = function (event) {
  this.handleChangeClick(event, -1);
};

ColorPickerSliders.prototype.handleIncClick = function (event) {
  this.handleChangeClick(event, 1);
};

ColorPickerSliders.prototype.handleInc10Click = function (event) {
  this.handleChangeClick(event, 10);
};


ColorPickerSliders.prototype.handleFocus = function (event) {
  event.currentTarget.classList.add('focus');
  var slider = this.getSlider(event.currentTarget);
  slider.groupNode.classList.add('active');
};

ColorPickerSliders.prototype.handleBlur = function (event) {
  event.currentTarget.classList.remove('focus');
  var slider = this.getSlider(event.currentTarget);
  if (!slider.groupNode.querySelector('.focus')) {
    slider.groupNode.classList.remove('active');
  }
};

ColorPickerSliders.prototype.getColorHex = function () {
  var r = parseInt(this.sliders.red.sliderNode.getAttribute('aria-valuenow')).toString(16);
  var g = parseInt(this.sliders.green.sliderNode.getAttribute('aria-valuenow')).toString(16);
  var b = parseInt(this.sliders.blue.sliderNode.getAttribute('aria-valuenow')).toString(16);

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
};

ColorPickerSliders.prototype.getColorRGB = function () {
  var r = this.sliders.red.sliderNode.getAttribute('aria-valuenow');
  var g = this.sliders.green.sliderNode.getAttribute('aria-valuenow');
  var b = this.sliders.blue.sliderNode.getAttribute('aria-valuenow');

  return r + ', ' + g + ', ' + b;
};

ColorPickerSliders.prototype.updateColorBox = function () {

  if (this.colorBoxNode) {
    this.colorBoxNode.style.backgroundColor = this.getColorHex();
  }

  if (this.colorValueHexNode) {
    this.colorValueHexNode.value = this.getColorHex();
  }

  if (this.colorValueRGBNode) {
    this.colorValueRGBNode.value = this.getColorRGB();
  }
};

// Initialise ColorPickerSliderss on the page
window.addEventListener('load', function () {

  var sliders = document.querySelectorAll('.color-picker-sliders');

  for (var i = 0; i < sliders.length; i++) {
    var s = new ColorPickerSliders(sliders[i]);
    s.init();
  }

});
