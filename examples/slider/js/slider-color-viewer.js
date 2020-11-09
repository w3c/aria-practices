'use strict';
/*
 *   This content is licensed according to the W3C Software License at
 *   https://www.w3.org/Consortium/Legal/2015/copyright-software-and-document
 *
 *   File:   slider.js
 *
 *   Desc:   ColorViewerSliders widget that implements ARIA Authoring Practices
 */

// Create ColorViewerSliders that contains value, valuemin, valuemax, and valuenow
class ColorViewerSliders {
  constructor(domNode) {
    this.domNode = domNode;

    this.sliders = {};

    this.initSliderRefs(this.sliders, 'red');
    this.initSliderRefs(this.sliders, 'green');
    this.initSliderRefs(this.sliders, 'blue');

    this.thumbWidth = this.sliders.red.thumbNode.getBBox().width;
    this.railWidth = this.sliders.red.railNode.getBBox().width;
    this.offsetLeft = 6;

    this.colorBoxNode = domNode.querySelector('.color-box');
    this.colorValueHexNode = domNode.querySelector('input.color-value-hex');
    this.colorValueRGBNode = domNode.querySelector('input.color-value-rgb');
  }

  initSliderRefs(sliderRef, color) {
    sliderRef[color] = {};
    var n = this.domNode.querySelector('.color-group.' + color);
    sliderRef[color].groupNode = n;
    sliderRef[color].sliderNode = n.querySelector('.color-slider');
    sliderRef[color].valueNode = n.querySelector('.value');
    sliderRef[color].thumbNode = n.querySelector('.thumb');
    sliderRef[color].railNode = n.querySelector('.rail');
    sliderRef[color].fillNode = n.querySelector('.fill');
    sliderRef[color].dec10Node = n.querySelector('.dec10');
    sliderRef[color].decNode = n.querySelector('.dec');
    sliderRef[color].incNode = n.querySelector('.inc');
    sliderRef[color].inc10Node = n.querySelector('.inc10');
  }

  // Initialize slider
  init() {
    for (var slider in this.sliders) {
      if (this.sliders[slider].sliderNode.tabIndex != 0) {
        this.sliders[slider].sliderNode.tabIndex = 0;
      }

      this.sliders[slider].railNode.addEventListener(
        'click',
        this.onRailClick.bind(this)
      );

      this.sliders[slider].sliderNode.addEventListener(
        'keydown',
        this.onSliderKeyDown.bind(this)
      );

      this.sliders[slider].sliderNode.addEventListener(
        'mousedown',
        this.onThumbMouseDown.bind(this)
      );
      this.sliders[slider].sliderNode.addEventListener(
        'focus',
        this.onFocus.bind(this)
      );
      this.sliders[slider].sliderNode.addEventListener(
        'blur',
        this.onBlur.bind(this)
      );

      this.sliders[slider].dec10Node.addEventListener(
        'click',
        this.onDec10Click.bind(this)
      );
      this.sliders[slider].dec10Node.addEventListener(
        'focus',
        this.onFocus.bind(this)
      );
      this.sliders[slider].dec10Node.addEventListener(
        'blur',
        this.onBlur.bind(this)
      );

      this.sliders[slider].decNode.addEventListener(
        'click',
        this.onDecClick.bind(this)
      );
      this.sliders[slider].decNode.addEventListener(
        'focus',
        this.onFocus.bind(this)
      );
      this.sliders[slider].decNode.addEventListener(
        'blur',
        this.onBlur.bind(this)
      );

      this.sliders[slider].incNode.addEventListener(
        'click',
        this.onIncClick.bind(this)
      );
      this.sliders[slider].incNode.addEventListener(
        'focus',
        this.onFocus.bind(this)
      );
      this.sliders[slider].incNode.addEventListener(
        'blur',
        this.onBlur.bind(this)
      );

      this.sliders[slider].inc10Node.addEventListener(
        'click',
        this.onInc10Click.bind(this)
      );
      this.sliders[slider].inc10Node.addEventListener(
        'focus',
        this.onFocus.bind(this)
      );
      this.sliders[slider].inc10Node.addEventListener(
        'blur',
        this.onBlur.bind(this)
      );

      this.moveSliderTo(
        this.sliders[slider],
        this.getValueNow(this.sliders[slider])
      );
    }
  }

  getSlider(domNode) {
    if (!domNode.classList.contains('color-slider')) {
      if (domNode.tagName.toLowerCase() === 'rect') {
        domNode = domNode.parentNode.parentNode;
      } else {
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
  }

  getValueMin(slider) {
    return parseInt(slider.sliderNode.getAttribute('aria-valuemin'));
  }

  getValueNow(slider) {
    return parseInt(slider.sliderNode.getAttribute('aria-valuenow'));
  }

  getValueMax(slider) {
    return parseInt(slider.sliderNode.getAttribute('aria-valuemax'));
  }

  moveSliderTo(slider, value) {
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
    var pos =
      Math.round(
        (valueNow * (this.railWidth - this.thumbWidth)) / (valueMax - valueMin)
      ) + this.offsetLeft;
    slider.thumbNode.setAttribute('x', pos);

    slider.valueNode.textContent = valueNow;
    var valueWidth = slider.valueNode.getBBox().width;
    slider.valueNode.setAttribute(
      'x',
      pos - (valueWidth + this.thumbWidth) / 2 + this.thumbWidth
    );

    this.updateColorBox();
  }

  onSliderKeyDown(event) {
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
  }

  onThumbMouseDown(event) {
    var slider = this.getSlider(event.currentTarget);

    var valueMin = this.getValueMin(slider);
    var valueNow = this.getValueNow(slider);
    var valueMax = this.getValueMax(slider);

    var onMouseMove = function (event) {
      var diffX =
        event.pageX - slider.sliderNode.offsetLeft - this.thumbWidth / 2;
      valueNow = Math.round(
        ((valueMax - valueMin) * diffX) / (this.railWidth - this.thumbWidth)
      );
      this.moveSliderTo(slider, valueNow);
      event.preventDefault();
      event.stopPropagation();
    }.bind(this);

    var onMouseUp = function (event) {
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
    };

    // bind a mousemove event handler to move pointer
    document.addEventListener('mousemove', onMouseMove);

    // bind a mouseup event handler to stop tracking mouse movements
    document.addEventListener('mouseup', onMouseUp);

    event.preventDefault();
    event.stopPropagation();

    // Set focus to the clicked on
    slider.sliderNode.focus();
  }

  // handleMouseMove has the same functionality as we need for handleMouseClick on the rail
  onRailClick(event) {
    var slider = this.getSlider(event.currentTarget);

    var valueMin = this.getValueMin(slider);
    var valueNow = this.getValueNow(slider);
    var valueMax = this.getValueMax(slider);

    var diffX =
      event.pageX - slider.sliderNode.offsetLeft - this.thumbWidth / 2;
    valueNow = Math.round(
      ((valueMax - valueMin) * diffX) / (this.railWidth - this.thumbWidth)
    );
    this.moveSliderTo(slider, valueNow);
    event.preventDefault();
    event.stopPropagation();
  }

  onChangeClick(event, n) {
    var slider = this.getSlider(event.currentTarget);

    var valueMin = this.getValueMin(slider);
    var valueNow = this.getValueNow(slider);
    var valueMax = this.getValueMax(slider);

    valueNow = valueNow + n;
    this.moveSliderTo(slider, valueNow);
    event.preventDefault();
    event.stopPropagation();
  }

  onDec10Click(event) {
    this.onChangeClick(event, -10);
  }

  onDecClick(event) {
    this.onChangeClick(event, -1);
  }

  onIncClick(event) {
    this.onChangeClick(event, 1);
  }

  onInc10Click(event) {
    this.onChangeClick(event, 10);
  }

  onFocus(event) {
    event.currentTarget.classList.add('focus');
    var slider = this.getSlider(event.currentTarget);
    slider.groupNode.classList.add('active');
  }

  onBlur(event) {
    event.currentTarget.classList.remove('focus');
    var slider = this.getSlider(event.currentTarget);
    if (!slider.groupNode.querySelector('.focus')) {
      slider.groupNode.classList.remove('active');
    }
  }

  getColorHex() {
    var r = parseInt(
      this.sliders.red.sliderNode.getAttribute('aria-valuenow')
    ).toString(16);
    var g = parseInt(
      this.sliders.green.sliderNode.getAttribute('aria-valuenow')
    ).toString(16);
    var b = parseInt(
      this.sliders.blue.sliderNode.getAttribute('aria-valuenow')
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

  getColorRGB() {
    var r = this.sliders.red.sliderNode.getAttribute('aria-valuenow');
    var g = this.sliders.green.sliderNode.getAttribute('aria-valuenow');
    var b = this.sliders.blue.sliderNode.getAttribute('aria-valuenow');

    return r + ', ' + g + ', ' + b;
  }

  updateColorBox() {
    if (this.colorBoxNode) {
      this.colorBoxNode.style.backgroundColor = this.getColorHex();
    }

    if (this.colorValueHexNode) {
      this.colorValueHexNode.value = this.getColorHex();
    }

    if (this.colorValueRGBNode) {
      this.colorValueRGBNode.value = this.getColorRGB();
    }
  }
}

// Initialize ColorViewerSliders on the page
window.addEventListener('load', function () {
  var cps = document.querySelectorAll('.color-picker-sliders');
  for (let i = 0; i < cps.length; i++) {
    let s = new ColorViewerSliders(cps[i]);
    s.init();
  }
});
