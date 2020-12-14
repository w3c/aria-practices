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
var SliderMultithumb = function (domNode)  {

  this.domNode = domNode;
  this.railNode = domNode.querySelector('.rail');

  this.minInputNode = domNode.querySelector('.input-minimum');
  this.maxInputNode = domNode.querySelector('.input-maximum');

  if (this.minInputNode) {
    this.minInputNode.addEventListener('keydown',   this.onInputKeydown.bind(this));
    this.minInputNode.addEventListener('keyup',   this.onInputKeyup.bind(this));
    this.minInputNode.addEventListener('blur',   this.onInputBlur.bind(this));
  }

  if (this.maxInputNode) {
    this.maxInputNode.addEventListener('keydown',   this.onInputKeydown.bind(this));
    this.maxInputNode.addEventListener('keyup',   this.onInputKeyup.bind(this));
    this.maxInputNode.addEventListener('blur',   this.onInputBlur.bind(this));
  }

  this.minSliderNode = domNode.querySelector('.slider-minimum');
  this.maxSliderNode = domNode.querySelector('.slider-maximum');

  this.minSliderValueNode = this.minSliderNode.querySelector('.slider-value');
  this.maxSliderValueNode = this.maxSliderNode.querySelector('.slider-value');

  this.thumbWidth = this.minSliderNode.getBoundingClientRect().width;
  this.thumbHeight = this.minSliderNode.getBoundingClientRect().height;
  this.railWidth = this.railNode.getBoundingClientRect().width - (2 * (this.thumbWidth - 2));
  this.railLeft = this.railNode.getBoundingClientRect().left;

  this.railMin = this.getValueMin(this.minSliderNode);
  this.railMax = this.getValueMax(this.maxSliderNode);

  this.minSliderNode.addEventListener('keydown',   this.onSliderKeydown.bind(this));
  this.minSliderNode.addEventListener('mousedown', this.onSliderMousedown.bind(this));
  this.minSliderNode.addEventListener('focus',     this.onSliderFocus.bind(this));
  this.minSliderNode.addEventListener('blur',      this.onSliderBlur.bind(this));

  this.maxSliderNode.addEventListener('keydown',   this.onSliderKeydown.bind(this));
  this.maxSliderNode.addEventListener('mousedown', this.onSliderMousedown.bind(this));
  this.maxSliderNode.addEventListener('focus',     this.onSliderFocus.bind(this));
  this.maxSliderNode.addEventListener('blur',      this.onSliderBlur.bind(this));

  this.moveSliderTo(this.minSliderNode, this.getValue(this.minSliderNode));

  this.moveSliderTo(this.maxSliderNode, this.getValue(this.maxSliderNode));

};

SliderMultithumb.prototype.getValue = function (sliderNode){
  return parseInt(sliderNode.getAttribute('aria-valuenow'));
};

SliderMultithumb.prototype.getValueMin = function (sliderNode){
  return parseInt(sliderNode.getAttribute('aria-valuemin'));
};

SliderMultithumb.prototype.getValueMax = function (sliderNode){
  return parseInt(sliderNode.getAttribute('aria-valuemax'));
};

SliderMultithumb.prototype.isMinSlider = function(sliderNode) {
  return this.minSliderNode === sliderNode;
}

SliderMultithumb.prototype.isMinInput = function(inputNode) {
  return this.minInputNode === inputNode;
}

SliderMultithumb.prototype.isInRange = function(sliderNode, value) {
  let valueMin = this.getValueMin(sliderNode);
  let valueMax = this.getValueMax(sliderNode);

  return (value <= valueMax) && (value >= valueMin);
}

SliderMultithumb.prototype.isOutOfRange = function(value) {
  let valueMin = this.getValueMin(this.minSliderNode);
  let valueMax = this.getValueMax(this.maxSliderNode);

  return (value > valueMax) || (value < valueMin);
}

SliderMultithumb.prototype.moveSliderTo = function (sliderNode, value) {
  var valueMax;
  var valueMin;

  if(this.isMinSlider(sliderNode)){
    valueMin = this.getValueMin(this.minSliderNode);
    valueMax = this.getValueMax(this.minSliderNode);
  }
  else{
    valueMin = this.getValueMin(this.maxSliderNode);
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

  var pos = Math.round((value * this.railWidth) / (this.railMax - this.railMin));

  if (this.isMinSlider(sliderNode)) {
    sliderNode.style.left = pos + 'px';
    this.minSliderValueNode.textContent = dollarValue;
    this.maxSliderNode.setAttribute('aria-valuemin', value);
    if (this.minInputNode) {
      this.minInputNode.value = dollarValue;
    }
  }
  else {
    sliderNode.style.left = (this.thumbWidth + pos) + 'px';
    this.maxSliderValueNode.textContent = dollarValue;
    this.minSliderNode.setAttribute('aria-valuemax', value);
    if (this.maxInputNode) {
      this.maxInputNode.value = dollarValue;
    }
  }
};


SliderMultithumb.prototype.onSliderKeydown = function (event) {

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

    case 'PageDown':
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

SliderMultithumb.prototype.onSliderFocus = function (event) {
  this.domNode.classList.add('focus');};

SliderMultithumb.prototype.onSliderBlur = function (event) {
  this.domNode.classList.remove('focus');
};

SliderMultithumb.prototype.onSliderMousedown = function (event) {
  console.log('[onMouseDown]');

  var sliderNode = event.currentTarget;
  var isMinSlider = this.isMinSlider(sliderNode);
  var self = this;

  var onMousemove = function (event) {

    var diffX = event.pageX - self.railLeft;

    if (isMinSlider) {
      diffX -= self.thumbWidth / 2;
    } else {
      diffX -= (3 * self.thumbWidth) / 2;
    }

    var value = parseInt(((self.railMax - self.railMin) * diffX) / self.railWidth);

    self.moveSliderTo(sliderNode, value);

    event.preventDefault();
    event.stopPropagation();
  };

  var onMouseup = function () {
    document.removeEventListener('mousemove', onMousemove);
    document.removeEventListener('mouseup', onMouseup);
  };

  // bind a mousemove event handler to move pointer
  document.addEventListener('mousemove', onMousemove);

  // bind a mouseup event handler to stop tracking mouse movements
  document.addEventListener('mouseup', onMouseup);

  event.preventDefault();
  event.stopPropagation();

  // Set focus to the clicked handle
  sliderNode.focus();

};

SliderMultithumb.prototype.onInputKeydown = function (event){
  var tgt = event.currentTarget,
      key = event.key,
      value = tgt.value;

  if (key < '0' || key > '9') {
    if (key.length == 1) {
      event.preventDefault();
      event.stopPropagation();
    }
  }
};

SliderMultithumb.prototype.onInputKeyup = function (event){
  var tgt = event.currentTarget,
      key = event.key,
      value = tgt.value;

  if (key.length === 1) {
    value = parseInt(value.replace('$', ''));

    if (this.isMinInput(tgt)) {
      if (this.isInRange(this.minSliderNode, value)) {
        this.moveSliderTo(this.minSliderNode, value);
      } else {
        tgt.value = tgt.value.slice(0, -1);
      }
    } else {
      if (this.isInRange(this.maxSliderNode, value)) {
        this.moveSliderTo(this.maxSliderNode, value);
      } else {
        tgt.value = tgt.value.slice(0, -1);
      }
    }
  }
};

SliderMultithumb.prototype.onInputBlur = function (event){
  var tgt = event.currentTarget,
      key = event.key,
      value = tgt.value;
  console.log('[handleInputBlur] '+ tgt.value );

  if (this.isMinInput(tgt)) {
    tgt.value = this.minSliderValueNode.textContent;
  } else {
    tgt.value = this.maxSliderValueNode.textContent;
  }
};

// Initialize Multithumb Slider widgets on the page
window.addEventListener('load', function () {

  var slidersMultithumb = document.querySelectorAll('.slider-multithumb');

  for (let i = 0; i < slidersMultithumb.length; i++) {
    new SliderMultithumb(slidersMultithumb[i]);
  }
});
