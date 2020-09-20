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
var MultithumbSlider = function (domNode)  {

  this.domNode = domNode;
  this.railDomNode = domNode.querySelector('.rail');

  this.minLabelNode = domNode.querySelector('.rail-label.min');
  this.maxLabelNode = domNode.querySelector('.rail-label.max');
  this.minSliderNode = domNode.querySelector('.thumb.min');
  this.maxSliderNode = domNode.querySelector('.thumb.max');
  this.minSliderValueNode = this.minSliderNode.querySelector('.value');
  this.maxSliderValueNode = this.maxSliderNode.querySelector('.value');
  this.railMin = 0;
  this.railMax = 100;
  this.railWidth = 0;
  this.railBorderWidth = 1;

  this.thumbWidth = this.minSliderNode.getBoundingClientRect().width;
  this.thumbHeight = this.minSliderNode.getBoundingClientRect().height;

};

// Initialize slider
MultithumbSlider.prototype.init = function () {

  this.railMin = parseInt((this.minSliderNode.getAttribute('aria-valuemin')));
  this.railMax = parseInt((this.maxSliderNode.getAttribute('aria-valuemax')));
  this.railWidth = parseInt(this.railDomNode.style.width.slice(0, -2));

  this.minSliderNode.addEventListener('keydown',   this.handleKeyDown.bind(this));
  this.minSliderNode.addEventListener('mousedown', this.handleMouseDown.bind(this));
  this.minSliderNode.addEventListener('focus',     this.handleFocus.bind(this));
  this.minSliderNode.addEventListener('blur',      this.handleBlur.bind(this));

  this.maxSliderNode.addEventListener('keydown',   this.handleKeyDown.bind(this));
  this.maxSliderNode.addEventListener('mousedown', this.handleMouseDown.bind(this));
  this.maxSliderNode.addEventListener('focus',     this.handleFocus.bind(this));
  this.maxSliderNode.addEventListener('blur',      this.handleBlur.bind(this));

  this.moveSliderTo(this.minSliderNode, this.getValue(this.minSliderNode));

  this.moveSliderTo(this.maxSliderNode, this.getValue(this.maxSliderNode));
  var buttons = this.domNode.querySelectorAll('.change');
  for (var i = 0; i < buttons.length; i++) {
    buttons[i].addEventListener('click', this.handleButton.bind(this));
  }

};


MultithumbSlider.prototype.getValue = function (sliderNode){
  return parseInt(sliderNode.getAttribute('aria-valuenow'));
};

MultithumbSlider.prototype.getValueMin = function (sliderNode){
  return parseInt(sliderNode.getAttribute('aria-valuemin'));
};

MultithumbSlider.prototype.getValueMax = function (sliderNode){
  return parseInt(sliderNode.getAttribute('aria-valuemax'));
};

MultithumbSlider.prototype.isMinSlider = function(sliderNode) {
  return this.minSliderNode === sliderNode;
}


MultithumbSlider.prototype.moveSliderTo = function (sliderNode, value) {
  var valueMax;
  var valueMin;

  if(this.isMinSlider(sliderNode)){
    valueMin = this.getValueMin(this.minSliderNode);
    valueMax = this.getValue(this.maxSliderNode);

  }
  else{
    valueMin = this.getValue(this.minSliderNode);
    valueMax = this.getValueMax(this.maxSliderNode);
  }

  if (value > valueMax) {
    value = valueMax;
  }

  if (value < valueMin) {
    value = valueMin;
  }

  var dollarValue = '$' + value;
  sliderNode.setAttribute('aria-valuenow', value);
  sliderNode.setAttribute('aria-valuetext', dollarValue);

  var pos = Math.round(((value - this.railMin) * (this.railWidth - (2 * (this.thumbWidth - this.railBorderWidth)))) / (this.railMax - this.railMin));

  if (this.isMinSlider(sliderNode)) {
    sliderNode.style.left = pos + 'px';
    this.minSliderValueNode.textContent = dollarValue;
    this.maxSliderNode.setAttribute('aria-valuemin',value);
  }
  else {
    sliderNode.style.left = (this.thumbWidth + pos) + 'px';
    this.maxSliderValueNode.textContent = dollarValue;
    this.minSliderNode.setAttribute('aria-valuemax', value);
  }
};


MultithumbSlider.prototype.handleKeyDown = function (event) {

  var flag = false;
  var sliderNode = event.currentTarget;
  var value = this.getValue(sliderNode);
  var valueMin = this.getValueMin(sliderNode);
  var valueMax = this.getValueMax(sliderNode);

  switch (event.key) {
    case 'ArrowLeft':
    case 'ArrowDown':
      this.moveSliderTo(sliderNode, value - 1);
      flag = true;
      break;

    case 'ArrowRight':
    case 'ArrowUp':
      this.moveSliderTo(sliderNode, value + 1);
      flag = true;
      break;

    case 'Down':
      this.moveSliderTo(sliderNode, value - 10);
      flag = true;
      break;

    case 'PageUp':
      this.moveSliderTo(sliderNode, value + 10);
      flag = true;
      break;

    case 'Home':
      this.moveSliderTo(sliderNode, valueMin);
      flag = true;
      break;

    case 'End':
      this.moveSliderTo(sliderNode, valueMax);
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

MultithumbSlider.prototype.handleFocus = function (event) {
  this.domNode.classList.add('focus');
  this.railDomNode.classList.add('focus');
};

MultithumbSlider.prototype.handleBlur = function (event) {
  this.domNode.classList.remove('focus');
  this.railDomNode.classList.remove('focus');
};

MultithumbSlider.prototype.handleMouseDown = function (event) {

  var sliderNode = event.currentTarget;
  var self = this;

  var handleMouseMove = function (event) {

    var diffX = event.pageX - self.railDomNode.offsetLeft;
    var value = self.railMin + parseInt(((self.railMax - self.railMin) * diffX) / self.railWidth);

    self.moveSliderTo(sliderNode, value);

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

MultithumbSlider.prototype.handleButton = function (event){
  var tgt = event.currentTarget;
  console.log('[handleButton] '+ tgt.classList + ' ' + tgt.parentNode.classList);
  var slider = this.minSliderNode;
  if(tgt.classList.contains('max')){
    slider = this.maxSliderNode;
  }

  var value = this.getValue(slider);

  if(tgt.classList.contains('dec10')){
    this.moveSliderTo(slider,value - 10 );
  }
  else if (tgt.classList.contains('dec')){
    this.moveSliderTo(slider, value-1);
  }
  else if(tgt.classList.contains('inc10')){
    this.moveSliderTo(slider, value+10);
  }
  else if(tgt.classList.contains('inc')){
    this.moveSliderTo(slider, value+1);
  }
};

// handleMouseMove has the same functionality as we need for handleMouseClick on the rail
// Slider.prototype.handleClick = function (event) {

//  var diffX = event.pageX - this.railDomNode.offsetLeft;
//  this.valueNow = parseInt(((this.railMax - this.railMin) * diffX) / this.railWidth);
//  this.moveSliderTo(this.valueNow);

//  event.preventDefault();
//  event.stopPropagation();

// };

// Initialise Sliders on the page
window.addEventListener('load', function () {

  var multithumbSliders = document.querySelectorAll('.multithumb-slider');

  for (var i = 0; i < multithumbSliders.length; i++) {
    var ms = new MultithumbSlider(multithumbSliders[i]);
    ms.init();
  }
});
