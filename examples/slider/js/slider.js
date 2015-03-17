/*
 * Copyright 2011-2014 OpenAjax Alliance
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
 
/*
 * ARIA Slider example
 * @function onload
 * @desc 
 */
 
window.addEventListener('load', function () {

  var sliders = document.getElementsByClassName('aria-widget-slider');
  
  [].forEach.call(sliders, function(slider) {
    if (slider && !slider.done) {
      var s = new aria.widget.slider(slider);
      s.initSlider();
    }  
  });

});


/** 
 * @namespace aria
 */

var aria = aria || {};


/* ---------------------------------------------------------------- */
/*                  ARIA Widget Namespace                        */ 
/* ---------------------------------------------------------------- */

aria.widget = aria.widget || {};

/* ---------------------------------------------------------------- */
/*                  Simple  Slider Widget                           */
/* ---------------------------------------------------------------- */

/**
 * @constructor Slider
 *
 * @memberOf aria.Widget
 *
 * @desc  Creates a slider widget using ARIA 
 *
 * @param  node    DOM node  -  DOM node object
 * @param  inc     Integer   -  inc is the increment value for the slider (default 1)
 * @param  jump    Integer   -  jump is the large increment value for the slider (default 10)
 * @param  width   Integer   -  jump is the large increment value for the slider (default 100)
 *
 * @property  keyCode      Object    -  Object containing the keyCodes used by the slider widget
 *
 * @property  node         Object    -  JQuery node object
 * @property  siderHeight  Integer  - height of the slider in pixels
 * @property  siderWidth   Integer  - width of the slider in pixels
 *
 * @property  valueInc   Integer  - small slider increment value
 * @property  valueJump  Integer  - large slider increment value
 *
 * @property  valueMin  Integer  - Minimum value of the slider
 * @property  valueMax  Integer  - Maximum value of the slider
 * @property  valueNow  Integer  - Current value of the slider
 */

aria.widget.slider = function(node, inc, jump, width) {

   this.keyCode = Object.freeze({
     "backspace" : 8,
     "tab" : 9,
     "enter" : 13,
     "esc" : 27,

     "space" : 32,
     "pageUp" : 33,
     "pageDown" : 34,
     "end" : 35,
     "home" : 36,

     "left" : 37,
     "up" : 38,
     "right" : 39,
     "down" : 40
  });
  
  this.done = true;
  
  // Check fo DOM element node
  if (typeof node !== 'object' || !node.getElementsByClassName) return false;

  this.container = node;

  var rails = node.getElementsByClassName('rail');
  if (rails) this.rail = rails[0];
  else return false;

  var thumbs = node.getElementsByClassName('thumb');
  if (thumbs) this.thumb = thumbs[0];
  else return false;
  
  var values = node.getElementsByClassName('value');
  if (values) this.value = values[0];
  else return false;
  this.value.innerHTML = "0";

  this.thumbHeight  = 28;
  this.thumbWidth   = 8;
  
  if (typeof width !== 'number') {
    width = window.getComputedStyle(this.rail).getPropertyValue("width");
    if ((typeof width === 'string') && (width.length > 2)) {
      width = parseInt(width.slice(0,-2));
    }
  }

  if (typeof width === 'number') this.sliderWidth = width;
  else this.sliderWidth = 200;

  if (this.sliderWidth < 50) {
    this.sliderWidth  = 50;
  }  
  
  if (typeof inc !== 'number') inc = 1;
  if (typeof jump !== 'number') jump = 10;

  this.valueInc  = inc;
  this.valueJump = jump;
  
  if (typeof height === 'Number') this.sliderHeight = height;
  if (typeof width  === 'Number') this.sliderWidth  = width;
  
  this.valueMin = parseInt(this.thumb.getAttribute('aria-valuemin'));
  if (isNaN(this.valueMin)) this.valueMin = 0;
  
  this.valueMax = parseInt(this.thumb.getAttribute('aria-valuemax'));
  if (isNaN(this.valueMax)) this.valueMax = 100;

  this.valueNow = parseInt(this.thumb.getAttribute('aria-valuenow'));
  if (isNaN(this.valueNow)) this.valueNow = Math.round((this.valueMax - this.valueMin) / 2);

<<<<<<< HEAD
  this.thumb.setAttribute('role', 'slider');
=======
>>>>>>> origin/master
  this.thumb.setAttribute('aria-valuenow', this.valueNow);
  this.thumb.setAttribute('aria-valuemin', this.valueMin);
  this.thumb.setAttribute('aria-valuemax', this.valueMax);
  
  this.thumb.tabIndex = 0;
  this.thumb.innerHTML = "";
  
};

/**
 * @method initSlider
 *
 * @memberOf aria.widget.slider
 *
 * @desc  Creates the HTML for the slider 
 */

aria.widget.slider.prototype.initSlider = function() {

  this.rail.style.height = "1px";
  this.rail.style.width = this.sliderWidth + "px";

  this.thumb.style.height = this.thumbHeight + "px";
  this.thumb.style.width  = this.thumbWidth + "px";
  this.thumb.style.top    = (-1 * this.thumbHeight/2) + "px";
  
  this.value.style.top    = (this.rail.offsetTop - (this.value.offsetHeight / 2) + 2) + "px";
  this.value.style.left   = (this.rail.offsetLeft + this.rail.offsetWidth + 5) + "px";

  this.rangeLeftPos =  this.rail.offsetLeft;
  
  var slider = this;
  
  var eventKeyDown = function (event) {
    slider.eventKeyDown(event, slider);
  };

  var eventMouseDown = function (event) {
    slider.eventMouseDown(event, slider);
  };
  
  var eventClick = function (event) {
    slider.eventClick(event, slider);
  };
  
  this.thumb.addEventListener('keydown', eventKeyDown);
  this.thumb.addEventListener('mousedown', eventMouseDown);
  this.container.addEventListener('click', eventClick);
  
  this.updateThumbPosition();

};

/**
 * @method updateThumbPosition
 *
 * @memberOf aria.widget.slider
 *
 * @desc  Updates thumb position in slider div and aria-valuenow property
 */

aria.widget.slider.prototype.updateThumbPosition = function() {

  if (this.valueNow > this.valueMax) this.valueNow = this.valueMax;
  if (this.valueNow < this.valueMin) this.valueNow = this.valueMin;

  this.thumb.setAttribute('aria-valuenow', this.valueNow);   
  
  var pos = Math.round((this.valueNow * this.sliderWidth) / (this.valueMax - this.valueMin)) - (this.thumbWidth/2);
  
  this.thumb.style.left = pos + "px";
  
  this.value.innerHTML = this.valueNow.toString();
  
};

/**
 * @method eventKeyDown
 *
 * @memberOf aria.widget.slider
 *
 * @desc  Keydown event handler for slider Object
 *        NOTE: The slider parameter is needed to provide a reference to the specific
 *               slider to change the value on
 */

aria.widget.slider.prototype.eventKeyDown = function(event, slider) {

  function updateValue(value) {
    slider.valueNow = value;
    slider.updateThumbPosition();
    
    event.preventDefault();
    event.stopPropagation();
  }

  switch(event.keyCode) {
  
  case slider.keyCode.left:
  case slider.keyCode.down:
    updateValue(slider.valueNow-slider.valueInc);
    break;
  
  case slider.keyCode.right:
  case slider.keyCode.up:
    updateValue(slider.valueNow+slider.valueInc);
    break;

  case slider.keyCode.pageDown:
    updateValue(slider.valueNow-slider.valueJump);
    break;

  case slider.keyCode.pageUp:
    updateValue(slider.valueNow+slider.valueJump);
    break;
  
  default:
    break;
  }
  
  
};

/**
 * @method eventMouseDown
 *
 * @memberOf aria.widget.slider
 *
 * @desc  MouseDown event handler for slider Object
 *        NOTE: The slider parameter is needed to provide a reference to the specific
 *               slider to change the value on
 */

aria.widget.slider.prototype.eventMouseDown = function(event, slider) {

  if (event.target === slider.thumb) {
  
    // Set focus to the clicked handle
    event.target.focus();
  
    var mouseMove = function (event) {
      slider.eventMouseMove(event, slider);
    }

    slider.mouseMove = mouseMove;

    var mouseUp = function (event) {
      slider.eventMouseUp(event, slider);
    }

    slider.mouseUp = mouseUp;

    // bind a mousemove event handler to move pointer
    document.addEventListener('mousemove', slider.mouseMove);

    // bind a mouseup event handler to stop tracking mouse movements
    document.addEventListener('mouseup', slider.mouseUp);
  
    event.preventDefault();
    event.stopPropagation();
  }  

};

/**
 * @method eventMouseMove
 *
 * @memberOf aria.widget.slider
 *
 * @desc  MouseMove event handler for slider Object
 *        NOTE: The slider parameter is needed to provide a reference to the specific
 *               slider to change the value on
 */

aria.widget.slider.prototype.eventMouseMove = function(event, slider) {

  var diffX = event.pageX - slider.rail.offsetLeft;
  slider.valueNow = parseInt(((slider.valueMax - slider.valueMin) * diffX) / slider.sliderWidth);
  slider.updateThumbPosition();
  
  event.preventDefault();
  event.stopPropagation();
  
};

/**
 * @method eventMouseUp
 *
 * @memberOf aria.widget.slider
 *
 * @desc  MouseUp event handler for slider Object
 *        NOTE: The slider parameter is needed to provide a reference to the specific
 *               slider to change the value on
 */

aria.widget.slider.prototype.eventMouseUp = function(event, slider) {

  document.removeEventListener('mousemove', slider.mouseMove);
  document.removeEventListener('mouseup',   slider.mouseUp);

  event.preventDefault();
  event.stopPropagation();
  
};

/**
 * @method eventClick
 *
 * @memberOf aria.widget.slider
 *
 * @desc  Click event handler for slider Object
 *        NOTE: The slider parameter is needed to provide a reference to the specific
 *               slider to change the value on
 */

aria.widget.slider.prototype.eventClick = function(event, slider) {

  if (event.target === slider.thumb) return;
  
  var diffX = event.pageX - slider.rail.offsetLeft;
  slider.valueNow = parseInt(((slider.valueMax - slider.valueMin) * diffX) / slider.sliderWidth);
  slider.updateThumbPosition();
  
  event.preventDefault();
  event.stopPropagation();
  
};
