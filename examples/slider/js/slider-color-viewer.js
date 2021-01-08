'use strict';
/*
 *   This content is licensed according to the W3C Software License at
 *   https://www.w3.org/Consortium/Legal/2015/copyright-software-and-document
 *
 *   File:   slider-color-viewer.js
 *
 *   Desc:   ColorViewerSliders widget that implements ARIA Authoring Practices
 */

// Create ColorViewerSliders that contains value, valuemin, valuemax, and valuenow
class ColorViewerSliders {
  constructor(domNode) {
    this.domNode = domNode;

    this.sliders = {};

    this.svgWidth = 310;
    this.svgHeight = 50;
    this.borderWidth = 2;

    this.valueY = 22;

    this.railX = 15;
    this.railY = 26;
    this.railWidth = 275;
    this.railHeight = 14;

    this.thumbHeight = this.railHeight;
    this.thumbWidth = this.thumbHeight;
    this.rectRadius = this.railHeight / 4;

    this.focusY = this.borderWidth;
    this.focusWidth = 36;
    this.focusHeight = 48;

    this.initSliderRefs(this.sliders, 'red');
    this.initSliderRefs(this.sliders, 'green');
    this.initSliderRefs(this.sliders, 'blue');

    this.colorBoxNode = domNode.querySelector('.color-box');
    this.colorValueHexNode = domNode.querySelector('input.color-value-hex');
    this.colorValueRGBNode = domNode.querySelector('input.color-value-rgb');
  }

  initSliderRefs(sliderRef, color) {
    sliderRef[color] = {};
    var n = this.domNode.querySelector('.color-group.' + color);
    sliderRef[color].groupNode = n;
    sliderRef[color].sliderNode = n.querySelector('.color-slider');

    sliderRef[color].svgNode = n.querySelector('.color-slider svg');
    sliderRef[color].svgNode.setAttribute('width', this.svgWidth);
    sliderRef[color].svgNode.setAttribute('height', this.svgHeight);
    sliderRef[color].svgPoint = sliderRef[color].svgNode.createSVGPoint();

    sliderRef[color].valueNode = n.querySelector('.color-slider .value');
    sliderRef[color].valueNode.setAttribute('y', this.valueY);

    sliderRef[color].thumbNode = n.querySelector('.color-slider .thumb');
    sliderRef[color].thumbNode.setAttribute('width', this.thumbWidth);
    sliderRef[color].thumbNode.setAttribute('height', this.thumbHeight);
    sliderRef[color].thumbNode.setAttribute('y', this.railY);
    sliderRef[color].thumbNode.setAttribute('rx', this.rectRadius);

    sliderRef[color].focusNode = n.querySelector('.color-slider .focus');
    sliderRef[color].focusNode.setAttribute(
      'width',
      this.focusWidth - this.borderWidth
    );
    sliderRef[color].focusNode.setAttribute(
      'height',
      this.focusHeight - this.borderWidth
    );
    sliderRef[color].focusNode.setAttribute('y', this.focusY);
    sliderRef[color].focusNode.setAttribute('rx', this.rectRadius);

    sliderRef[color].railNode = n.querySelector('.color-slider .rail');
    sliderRef[color].railNode.setAttribute('x', this.railX);
    sliderRef[color].railNode.setAttribute('y', this.railY);
    sliderRef[color].railNode.setAttribute('width', this.railWidth);
    sliderRef[color].railNode.setAttribute('height', this.railHeight);
    sliderRef[color].railNode.setAttribute('rx', this.rectRadius);

    sliderRef[color].fillNode = n.querySelector('.color-slider .fill');
    sliderRef[color].fillNode.setAttribute('x', this.railX);
    sliderRef[color].fillNode.setAttribute('y', this.railY);
    sliderRef[color].fillNode.setAttribute('width', this.railWidth);
    sliderRef[color].fillNode.setAttribute('height', this.railHeight);
    sliderRef[color].fillNode.setAttribute('rx', this.rectRadius);

    // Increment and decrement buttons are optional for
    // mobile support
    sliderRef[color].dec10Node = n.querySelector('.dec10');
    if (sliderRef[color].dec10Node) {
      this.renderButton(sliderRef[color].dec10Node, 'dec10');
    }

    sliderRef[color].decNode = n.querySelector('.dec');
    if (sliderRef[color].decNode) {
      this.renderButton(sliderRef[color].decNode, 'dec');
    }

    sliderRef[color].incNode = n.querySelector('.inc');
    if (sliderRef[color].incNode) {
      this.renderButton(sliderRef[color].incNode, 'inc');
    }

    sliderRef[color].inc10Node = n.querySelector('.inc10');
    if (sliderRef[color].inc10Node) {
      this.renderButton(sliderRef[color].inc10Node, 'inc10');
    }
  }

  renderButton(node, option) {
    let x, y;
    let buttonSVGWidth = 39;
    let buttonSVGHeight = 39;

    let buttonCircleX = 19;
    let buttonCircleY = 21;
    let buttonCircleR = 12;

    let lineLen = (2 * buttonCircleR) / 3;

    let svgNode = node.querySelector('svg');
    svgNode.setAttribute('width', buttonSVGWidth);
    svgNode.setAttribute('height', buttonSVGHeight);

    let backgroundNode = svgNode.querySelector('.background');
    backgroundNode.setAttribute('cx', buttonCircleX);
    backgroundNode.setAttribute('cy', buttonCircleY);
    backgroundNode.setAttribute('r', buttonCircleR);

    let hcBackgroundNode = svgNode.querySelector('.focus');
    hcBackgroundNode.setAttribute('cx', buttonCircleX);
    hcBackgroundNode.setAttribute('cy', buttonCircleY);
    hcBackgroundNode.setAttribute('r', buttonCircleR + 2 * this.borderWidth);

    var lines = svgNode.querySelectorAll('line');
    if (option.indexOf('10') > 0) {
      x = buttonCircleX - lineLen - 1;
      lines[0].setAttribute('x1', x);
      lines[0].setAttribute('y1', buttonCircleY);
      x = x + lineLen;
      lines[0].setAttribute('x2', x);
      lines[0].setAttribute('y2', buttonCircleY);
      x = x + 2;
      lines[1].setAttribute('x1', x);
      lines[1].setAttribute('y1', buttonCircleY);
      x = x + lineLen;
      lines[1].setAttribute('x2', x);
      lines[1].setAttribute('y2', buttonCircleY);
    } else {
      x = buttonCircleX - lineLen / 2;
      lines[0].setAttribute('x1', x);
      lines[0].setAttribute('y1', buttonCircleY);
      x = x + lineLen;
      lines[0].setAttribute('x2', x);
      lines[0].setAttribute('y2', buttonCircleY);
    }

    if (option.indexOf('inc') >= 0) {
      if (option.indexOf('10') > 0) {
        x = buttonCircleX - lineLen / 2 - 1;
        y = buttonCircleY - lineLen / 2;
        lines[2].setAttribute('x1', x);
        lines[2].setAttribute('y1', y);
        y = y + lineLen;
        lines[2].setAttribute('x2', x);
        lines[2].setAttribute('y2', y);

        x = buttonCircleX + lineLen / 2 + 1;
        y = buttonCircleY - lineLen / 2;
        lines[3].setAttribute('x1', x);
        lines[3].setAttribute('y1', y);
        y = y + lineLen;
        lines[3].setAttribute('x2', x);
        lines[3].setAttribute('y2', y);
      } else {
        y = buttonCircleY - lineLen / 2;
        lines[1].setAttribute('x1', buttonCircleX);
        lines[1].setAttribute('y1', y);
        y = y + lineLen;
        lines[1].setAttribute('x2', buttonCircleX);
        lines[1].setAttribute('y2', y);
      }
    }
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

      // Increment and decrement buttons are optional for
      // mobile support
      if (this.sliders[slider].dec10Node) {
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
      }

      if (this.sliders[slider].decNode) {
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
      }

      if (this.sliders[slider].incNode) {
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
      }

      if (this.sliders[slider].inc10Node) {
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
      }

      this.moveSliderTo(
        this.sliders[slider],
        this.getValueNow(this.sliders[slider])
      );
    }
  }

  // Get point in global SVG space
  getSVGPoint(slider, event) {
    slider.svgPoint.x = event.clientX;
    slider.svgPoint.y = event.clientY;
    return slider.svgPoint.matrixTransform(
      slider.svgNode.getScreenCTM().inverse()
    );
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
    var pos, offsetX, valueWidth;
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

    offsetX = Math.round(
      (valueNow * (this.railWidth - this.thumbWidth)) / (valueMax - valueMin)
    );

    pos = this.railX + offsetX;

    slider.thumbNode.setAttribute('x', pos);
    slider.fillNode.setAttribute('width', offsetX + this.rectRadius);

    slider.valueNode.textContent = valueNow;
    valueWidth = slider.valueNode.getBBox().width;

    pos = this.railX + offsetX - (valueWidth - this.thumbWidth) / 2;
    slider.valueNode.setAttribute('x', pos);

    pos = this.railX + offsetX - (this.focusWidth - this.thumbWidth) / 2;
    slider.focusNode.setAttribute('x', pos);

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
    let slider = this.getSlider(event.currentTarget);

    var onMouseMove = function (event) {
      let x = this.getSVGPoint(slider, event).x;
      let min = this.getValueMin(slider);
      let max = this.getValueMax(slider);
      let diffX = x - this.railX;
      let value = Math.round((diffX * (max - min)) / this.railWidth);
      this.moveSliderTo(slider, value);

      event.preventDefault();
      event.stopPropagation();
    }.bind(this);

    var onMouseUp = function () {
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

    var x = this.getSVGPoint(slider, event).x;
    var min = this.getValueMin(slider);
    var max = this.getValueMax(slider);
    var diffX = x - this.railX;
    var value = Math.round((diffX * (max - min)) / this.railWidth);
    this.moveSliderTo(slider, value);

    event.preventDefault();
    event.stopPropagation();

    // Set focus to the clicked handle
    slider.sliderNode.focus();
  }

  onChangeClick(event, n) {
    var slider = this.getSlider(event.currentTarget);

    var valueNow = this.getValueNow(slider);

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
    let slider = this.getSlider(event.currentTarget);
    slider.groupNode.classList.add('focus');
  }

  onBlur(event) {
    let slider = this.getSlider(event.currentTarget);
    slider.groupNode.classList.remove('focus');
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
  var cps = document.querySelectorAll('.color-viewer-sliders');
  for (let i = 0; i < cps.length; i++) {
    let s = new ColorViewerSliders(cps[i]);
    s.init();
  }
});
