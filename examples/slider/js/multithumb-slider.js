/*
*   File:   slider.js
*
*   Desc:   Slider widget that implements ARIA Authoring Practices
*
*   Author(s): Jon Gunderson, Nicholas Hoyt, Brian Loh, and Mark McCarthy
*/

// Create Slider that contains value, valuemin, valuemax, and valuenow
var Slider = function (domNode)  {

  this.domNode = domNode;
  this.railDomNode = domNode.parentNode;

  this.valueDomNode = false;
  this.minDomNode = false;
  this.maxDomNode = false;

  this.valueNow = 50;

  this.railMin = 0;
  this.railMax = 100;
  this.railWidth = 0;

  this.thumbWidth  = 16;
  this.thumbHeight = 28;

  this.keyCode = Object.freeze({
    'left'     : 37,
    'up'       : 38,
    'right'    : 39,
    'down'     : 40,
    'pageUp'   : 33,
    'pageDown' : 34,
    'end'    : 35,
    'home'     : 36
  });
};

// Initialize slider
Slider.prototype.init = function () {

  if(this.domNode.previousElementSibling) {
    this.minDomNode = this.domNode.previousElementSibling;
    this.railMin = parseInt((this.minDomNode.getAttribute('aria-valuemin')));
  }
  else {
    this.railMin = parseInt((this.domNode.getAttribute('aria-valuemin')));
  };

  if (this.domNode.nextElementSibling) {
    this.maxDomNode = this.domNode.nextElementSibling;
    this.railMax = parseInt((this.maxDomNode.getAttribute('aria-valuemax')));
  }

  else {
    this.railMax = parseInt((this.domNode.getAttribute('aria-valuemax')));
  }

  this.valueNow = parseInt((this.domNode.getAttribute('aria-valuenow')));

  this.railWidth = parseInt(this.railDomNode.style.width.slice(0, -2));

  this.valueDomNode = document.getElementById(this.domNode.getAttribute('aria-controls'));

  if (this.valueDomNode) {
    this.valueDomNode.innerHTML = '0';
    this.valueDomNode.style.top = (this.railDomNode.offsetTop - 8) + 'px';
  }

  if (this.domNode.tabIndex != 0) {
    this.domNode.tabIndex = 0;
  }

  //this.domNode.style.width = this.thumbWidth + 'px';
  this.domNode.style.height = this.thumbHeight + 'px';
  //this.domNode.style.top = ((this.thumbHeight  / -2) - 15) + 'px';

  this.domNode.addEventListener('keydown',    this.handleKeyDown.bind(this));
  // add onmousedown, move, and onmouseup
  this.domNode.addEventListener('mousedown', this.handleMouseDown.bind(this));
  this.domNode.addEventListener('focus',      this.handleFocus.bind(this));
  this.domNode.addEventListener('blur',       this.handleBlur.bind(this));

  this.moveSliderTo(this.valueNow);

};

Slider.prototype.moveSliderTo = function (value) {
  var valueMax = parseInt(this.domNode.getAttribute('aria-valuemax'));
  var valueMin = parseInt(this.domNode.getAttribute('aria-valuemin'));

  if (value > valueMax) {
    value = valueMax;
  }

  if (value < valueMin) {
    value = valueMin;
  }

  this.valueNow = value;
  this.dolValueNow = "$" + value;

  this.domNode.setAttribute('aria-valuenow', this.valueNow);

  if (this.minDomNode) {
    this.minDomNode.setAttribute('aria-valuemax', this.valueNow);
  }

  if (this.maxDomNode) {
    this.maxDomNode.setAttribute('aria-valuemin', this.valueNow);
  }

  var pos = Math.round(
    ((this.valueNow - this.railMin) * this.railWidth) / (this.railMax - this.railMin)
  ) - (this.thumbWidth / 2);

  this.domNode.style.left = pos + 'px';

  if (this.valueDomNode) {
    this.valueDomNode.innerHTML = this.dolValueNow.toString();
    this.valueDomNode.style.left = (this.railDomNode.offsetLeft + this.railWidth + 10) + 'px';
    }
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
      this.moveSliderTo(this.railMin);
      flag = true;
      break;

    case this.keyCode.end:
      this.moveSliderTo(this.railMax);
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

Slider.prototype.handleMouseDown = function (event) {

    var self = this;

    var handleMouseMove = function (event) {

      var diffX = event.pageX - self.railDomNode.offsetLeft;
      self.valueNow = self.railMin + parseInt(((self.railMax - self.railMin) * diffX) / self.railWidth);
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
//Slider.prototype.handleClick = function (event) {

//  var diffX = event.pageX - this.railDomNode.offsetLeft;
//  this.valueNow = parseInt(((this.railMax - this.railMin) * diffX) / this.railWidth);
//  this.moveSliderTo(this.valueNow);

//  event.preventDefault();
//  event.stopPropagation();

//};

// Initialise Sliders on the page
window.addEventListener('load', function () {

  var sliders = document.querySelectorAll('[role=slider]');;

  for (var i = 0; i < sliders.length; i++) {
    var s = new Slider(sliders[i]);
    s.init();
  }

});
