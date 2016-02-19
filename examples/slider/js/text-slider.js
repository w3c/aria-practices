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

  var sliders = document.getElementsByClassName('aria-widget-text-slider');
  
  [].forEach.call(sliders, function(tslider) {
    if (tslider && !tslider.done) {
      var s = new aria.widget.tslider(tslider);
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
 * @constructor tslider
 *
 * @memberOf aria.Widget
 *
 * @desc  Creates a slider widget using ARIA 
 *
 * @param  node    DOM node  -  DOM node object
 * @param  options Array     - List of text values for the slider
 * @param  width   Integer   -  jump is the large increment value for the slider (default 100)
 *
 * @property  keyCode      Object    -  Object containing the keyCodes used by the slider widget
 *
 * @property  node         Object    -  JQuery node object
 * @property  siderHeight  Integer  - height of the slider in pixels
 * @property  siderWidth   Integer  - width of the slider in pixels
 *
 * @property  valueMin  Integer  - Minimum value of the slider (e.g. 0)
 * @property  valueMax  Integer  - Maximum value of the slider (e.g number of options)
 * @property  valueNow  Integer  - Current value of the slider (e.g. current option)
 */

aria.widget.tslider = function(node, options, width) {

   this.keyCode = Object.freeze({
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
  
  if (typeof height === 'Number') this.sliderHeight = height;
  if (typeof width  === 'Number') this.sliderWidth  = width;

  this.values      = [];
  this.value_nodes = node.getElementsByClassName('value');
  for (var i = 0; this.value_nodes[i]; i++) {
    this.values.push(this.value_nodes[i].innerHTML);
  }

  this.valueMin = 0;
  this.valueMax = (this.values.length-1);

  this.valueNow = 0;
  this.valueText = parseInt(this.values[this.valueNow]);
  this.valueInc = 1;
  
  this.thumb.setAttribute('role', 'slider');
  this.thumb.setAttribute('aria-valuetext', this.valueText);
  this.thumb.setAttribute('aria-valuenow', this.valueNow);
  this.thumb.setAttribute('aria-valuemin', this.valueMin);
  this.thumb.setAttribute('aria-valuemax', this.valueMax);
  
  this.thumb.tabIndex = 0;
  this.thumb.innerHTML = "";
  
};

/**
 * @method initSlider
 *
 * @memberOf aria.widget.tslider
 *
 * @desc  Creates the HTML for the slider 
 */

aria.widget.tslider.prototype.initSlider = function() {

  this.rail.style.height = "1px";
  this.rail.style.width = this.sliderWidth + "px";

  this.thumb.style.height = this.thumbHeight + "px";
  this.thumb.style.width  = this.thumbWidth + "px";
  this.thumb.style.top    = (-1 * this.thumbHeight/2) + "px";
  
  this.rangeLeftPos =  this.rail.offsetLeft;
  
  var pos = 0;
  var diff = this.sliderWidth / (this.value_nodes.length - 1)
  for (var i = 0; this.value_nodes[i]; i++) {
    
    this.value_nodes[i].style.left = (pos - (this.value_nodes[i].offsetWidth/2))  + "px";
    pos = pos + diff;
  }
  
  var slider = this;
  
  var eventKeyDown = function (event) {
    slider.eventKeyDown(event, slider);
  };

  var eventMouseDown = function (event) {
    slider.eventMouseDown(event, slider);
  };
  
  var eventFocus = function (event) {
    slider.eventFocus(event, slider);
  };
  
  var eventBlur = function (event) {
    slider.eventBlur(event, slider);
  };
  
  this.thumb.addEventListener('keydown',   eventKeyDown);
  this.thumb.addEventListener('mousedown', eventMouseDown);
  this.thumb.addEventListener('focus', eventFocus);
  this.thumb.addEventListener('blur',  eventBlur);
  
  var eventClick = function (event) {
    slider.eventClick(event, slider);
  };

  this.rail.addEventListener('click', eventClick);

  this.updateThumbPosition();

};

/**
 * @method updateThumbPosition
 *
 * @memberOf aria.widget.tslider
 *
 * @desc  Updates thumb position in slider div and aria-valuenow property
 */

aria.widget.tslider.prototype.updateThumbPosition = function() {

  if (this.valueNow > this.valueMax) this.valueNow = this.valueMax;
  if (this.valueNow < this.valueMin) this.valueNow = this.valueMin;

  this.thumb.setAttribute('aria-valuenow', this.valueNow);   
  this.thumb.setAttribute('aria-valuetext', this.values[this.valueNow]);   
  
  var pos = Math.round((this.valueNow * this.sliderWidth) / (this.valueMax - this.valueMin)) - (this.thumbWidth/2);
  
  this.thumb.style.left = pos + "px";
};

/**
 * @method eventKeyDown
 *
 * @memberOf aria.widget.tslider
 *
 * @desc  Keydown event handler for slider Object
 *        NOTE: The slider parameter is needed to provide a reference to the specific
 *               slider to change the value on
 */

aria.widget.tslider.prototype.eventKeyDown = function(event, slider) {

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

  case slider.keyCode.home:
    updateValue(slider.valueMin);
    break;

  case slider.keyCode.end:
    updateValue(slider.valueMax);
    break;

  default:
    break;
  }
  
  
};

/**
 * @method eventMouseDown
 *
 * @memberOf aria.widget.tslider
 *
 * @desc  MouseDown event handler for slider Object
 *        NOTE: The slider parameter is needed to provide a reference to the specific
 *               slider to change the value on
 */

aria.widget.tslider.prototype.eventMouseDown = function(event, slider) {

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
 * @memberOf aria.widget.tslider
 *
 * @desc  MouseMove event handler for slider Object
 *        NOTE: The slider parameter is needed to provide a reference to the specific
 *               slider to change the value on
 */

aria.widget.tslider.prototype.eventMouseMove = function(event, slider) {

  var diffX = event.pageX - slider.rail.offsetLeft;
  slider.valueNow = parseInt(((slider.valueMax - slider.valueMin) * diffX) / slider.sliderWidth);
  slider.updateThumbPosition();
  
  event.preventDefault();
  event.stopPropagation();
  
};

/**
 * @method eventMouseUp
 *
 * @memberOf aria.widget.tslider
 *
 * @desc  MouseUp event handler for slider Object
 *        NOTE: The slider parameter is needed to provide a reference to the specific
 *               slider to change the value on
 */

aria.widget.tslider.prototype.eventMouseUp = function(event, slider) {

  document.removeEventListener('mousemove', slider.mouseMove);
  document.removeEventListener('mouseup',   slider.mouseUp);

  event.preventDefault();
  event.stopPropagation();
  
};

/**
 * @method eventClick
 *
 * @memberOf aria.widget.tslider
 *
 * @desc  Click event handler for slider Object
 *        NOTE: The slider parameter is needed to provide a reference to the specific
 *               slider to change the value on
 */

aria.widget.tslider.prototype.eventClick = function(event, slider) {

  if (event.target === slider.thumb) return;
  
  var diffX = event.pageX - slider.rail.offsetLeft;
  slider.valueNow = parseInt(((slider.valueMax - slider.valueMin) * diffX) / slider.sliderWidth);
  slider.updateThumbPosition();
  
  event.preventDefault();
  event.stopPropagation();
  
};


/**
 * @method eventFocus
 *
 * @memberOf aria.widget.tslider
 *
 * @desc  Focus event handler for slider Object
 *        NOTE: The slider parameter is needed to provide a reference to the specific
 *               slider to change the value on
 */

aria.widget.tslider.prototype.eventFocus = function(event, slider) {

  slider.container.className = "aria-widget-text-slider focus";
  
  event.preventDefault();
  event.stopPropagation();
  
};

/**
 * @method eventBlur
 *
 * @memberOf aria.widget.tslider
 *
 * @desc  Focus event handler for slider Object
 *        NOTE: The slider parameter is needed to provide a reference to the specific
 *               slider to change the value on
 */

aria.widget.tslider.prototype.eventBlur = function(event, slider) {

  slider.container.className = "aria-widget-text-slider";
  
  event.preventDefault();
  event.stopPropagation();
  
};

