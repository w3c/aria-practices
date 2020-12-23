/*
 *   This content is licensed according to the W3C Software License at
 *   https://www.w3.org/Consortium/Legal/2015/copyright-software-and-document
 *
 *   File:   slider-multithumb.js
 *
 *   Desc:   A dual slider widget that implements ARIA Authoring Practices
 */

'use strict';
class SliderMultithumb {
  constructor(domNode) {
    this.domNode = domNode;
    this.railNode = domNode.querySelector('.rail');

    this.minSliderNode = domNode.querySelector('[role=slider].minimum');
    this.maxSliderNode = domNode.querySelector('[role=slider].maximum');

    this.minSliderValueNode = this.minSliderNode.querySelector('.value');
    this.maxSliderValueNode = this.maxSliderNode.querySelector('.value');

    this.minSliderFocusNode = this.minSliderNode.querySelector('.focus');
    this.maxSliderFocusNode = this.maxSliderNode.querySelector('.focus');

    this.minSliderThumbNode = this.minSliderNode.querySelector('.thumb');
    this.maxSliderThumbNode = this.maxSliderNode.querySelector('.thumb');

    // The input elements are optional to support mobile devices,
    // when a keyboard is not present
    this.minInputNode = domNode.querySelector('.input-minimum input');
    this.maxInputNode = domNode.querySelector('.input-maximum input');

    if (this.minInputNode) {
      this.minInputNode.addEventListener(
        'change',
        this.onInputChange.bind(this)
      );
      this.minInputNode.addEventListener('blur', this.onInputChange.bind(this));
      this.minInputNode.addEventListener('blur', this.onSliderBlur.bind(this));
      this.minInputNode.addEventListener('focus', this.onSliderBlur.bind(this));
      this.minInputNode.min = this.getValueMin(this.minSliderNode);
      this.minInputNode.max = this.getValueMax(this.minSliderNode);
    }

    if (this.maxInputNode) {
      this.maxInputNode.addEventListener(
        'change',
        this.onInputChange.bind(this)
      );
      this.maxInputNode.addEventListener('blur', this.onInputChange.bind(this));
      this.maxInputNode.addEventListener('blur', this.onSliderBlur.bind(this));
      this.maxInputNode.addEventListener('focus', this.onSliderBlur.bind(this));
      this.maxInputNode.min = this.getValueMin(this.maxSliderNode);
      this.maxInputNode.max = this.getValueMax(this.maxSliderNode);
    }

    // Dimensions of the slider focus ring, thumb and rail

    this.valueTop = 12;

    this.railHeight = 6;
    this.railWidth = 300;
    this.railTop = 30;
    this.railLeft = 10;

    this.thumbWidth = 20;
    this.thumb2Width = 2 * this.thumbWidth;
    this.thumbHeight = 20;
    this.thumbTop = 23;

    this.focusRadius = 16;
    this.focusOffset = 8;

    this.thumbMiddle = this.thumbTop + this.thumbHeight / 2;
    this.thumbBottom = this.thumbTop + this.thumbHeight;
    this.minSliderValueNode.setAttribute('y', this.valueTop);
    this.maxSliderValueNode.setAttribute('y', this.valueTop);

    this.minSliderFocusNode.setAttribute('r', this.focusRadius);
    this.minSliderFocusNode.setAttribute('cy', this.thumbMiddle);
    this.maxSliderFocusNode.setAttribute('r', this.focusRadius);
    this.maxSliderFocusNode.setAttribute('cy', this.thumbMiddle);

    this.railNode.setAttribute('y', this.railTop);
    this.railNode.setAttribute('x', this.railLeft);
    this.railNode.setAttribute('height', this.railHeight);
    this.railNode.setAttribute('width', this.railWidth + this.thumbWidth);

    this.sliderMinValue = this.getValueMin(this.minSliderNode);
    this.sliderMaxValue = this.getValueMax(this.maxSliderNode);

    this.minSliderRight = 0;
    this.maxSliderLeft = this.railWidth;

    this.minSliderNode.addEventListener(
      'keydown',
      this.onSliderKeydown.bind(this)
    );
    this.minSliderNode.addEventListener(
      'mousedown',
      this.onSliderMousedown.bind(this)
    );
    this.minSliderNode.addEventListener('focus', this.onSliderFocus.bind(this));
    this.minSliderNode.addEventListener('blur', this.onSliderBlur.bind(this));

    this.maxSliderNode.addEventListener(
      'keydown',
      this.onSliderKeydown.bind(this)
    );
    this.maxSliderNode.addEventListener(
      'mousedown',
      this.onSliderMousedown.bind(this)
    );
    this.maxSliderNode.addEventListener('focus', this.onSliderFocus.bind(this));
    this.maxSliderNode.addEventListener('blur', this.onSliderBlur.bind(this));

    this.moveSliderTo(this.minSliderNode, this.getValue(this.minSliderNode));

    this.moveSliderTo(this.maxSliderNode, this.getValue(this.maxSliderNode));
  }

  getValue(sliderNode) {
    return parseInt(sliderNode.getAttribute('aria-valuenow'));
  }

  getValueMin(sliderNode) {
    return parseInt(sliderNode.getAttribute('aria-valuemin'));
  }

  getValueMax(sliderNode) {
    return parseInt(sliderNode.getAttribute('aria-valuemax'));
  }

  isMinSlider(sliderNode) {
    return this.minSliderNode === sliderNode;
  }

  isMinInput(inputNode) {
    return this.minInputNode === inputNode;
  }

  isInRange(sliderNode, value) {
    let valueMin = this.getValueMin(sliderNode);
    let valueMax = this.getValueMax(sliderNode);
    return value <= valueMax && value >= valueMin;
  }

  isOutOfRange(value) {
    let valueMin = this.getValueMin(this.minSliderNode);
    let valueMax = this.getValueMax(this.maxSliderNode);
    return value > valueMax || value < valueMin;
  }

  moveSliderTo(sliderNode, value) {
    var valueMax,
      valueMin,
      pos,
      cx,
      points = '',
      width;

    if (this.isMinSlider(sliderNode)) {
      valueMin = this.getValueMin(this.minSliderNode);
      valueMax = this.getValueMax(this.minSliderNode);
    } else {
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

    pos = this.railLeft;
    pos += Math.round(
      (value * (this.railWidth - this.thumbWidth)) /
        (this.sliderMaxValue - this.sliderMinValue)
    );

    if (this.isMinSlider(sliderNode)) {
      // update INPUT, label and ARIA attributes
      this.minSliderValueNode.textContent = dollarValue;
      this.maxSliderNode.setAttribute('aria-valuemin', value);

      if (this.maxInputNode && this.minInputNode) {
        this.maxInputNode.min = value;
        this.minInputNode.value = value;
      }

      // move the SVG focus ring and thumb elements
      cx = `${pos + this.focusOffset}`;
      this.minSliderFocusNode.setAttribute('cx', cx);

      points = `${pos},${this.thumbTop}`;
      points += ` ${pos + this.thumbWidth},${this.thumbMiddle}`;
      points += ` ${pos},${this.thumbBottom}`;
      this.minSliderThumbNode.setAttribute('points', points);

      // Position value
      width = this.minSliderValueNode.getBoundingClientRect().width;
      pos = pos + (this.thumbWidth - width) / 2;
      if (pos + width > this.maxSliderLeft - 2) {
        pos = this.maxSliderLeft - width - 2;
      }
      this.minSliderValueNode.setAttribute('x', pos);
      this.minSliderRight = pos;
    } else {
      // move the SVG focus ring and thumb elements
      cx = `${pos + 2 * this.thumbWidth - this.focusOffset + 1}`;
      this.maxSliderFocusNode.setAttribute('cx', cx);

      points = `${pos + this.thumbWidth},${this.thumbMiddle}`;
      points += ` ${pos + this.thumb2Width},${this.thumbTop}`;
      points += ` ${pos + this.thumb2Width},${this.thumbBottom}`;
      this.maxSliderThumbNode.setAttribute('points', points);

      width = this.maxSliderValueNode.getBoundingClientRect().width;
      pos = pos + this.thumbWidth + (this.thumbWidth - width) / 2;
      if (pos - width < this.minSliderRight + 2) {
        pos = this.minSliderRight + width + 2;
      }
      this.maxSliderValueNode.setAttribute('x', pos);
      this.maxSliderLeft = pos;

      // update INPUT, label and ARIA attributes
      this.maxSliderValueNode.textContent = dollarValue;
      this.minSliderNode.setAttribute('aria-valuemax', value);

      if (this.maxInputNode && this.minInputNode) {
        this.minInputNode.max = value;
        this.maxInputNode.value = value;
      }
    }
  }

  onSliderKeydown(event) {
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
  }

  onSliderFocus() {
    this.domNode.classList.add('focus');
  }

  onSliderBlur() {
    this.domNode.classList.remove('focus');
  }

  onSliderMousedown(event) {
    var onMousemove = function (e) {
      var diffX = e.pageX - self.railNode.getBoundingClientRect().left;

      if (isMinSlider) {
        diffX -= self.thumbWidth / 2;
      } else {
        diffX -= (3 * self.thumbWidth) / 2;
      }

      var value = parseInt(
        ((self.sliderMaxValue - self.sliderMinValue) * diffX) / self.railWidth
      );

      self.moveSliderTo(sliderNode, value);

      e.preventDefault();
      e.stopPropagation();
    };

    var onMouseup = function () {
      document.removeEventListener('mousemove', onMousemove);
      document.removeEventListener('mouseup', onMouseup);
    };

    var sliderNode = event.currentTarget;
    var isMinSlider = this.isMinSlider(sliderNode);
    var self = this;

    // bind a mousemove event handler to move pointer
    document.addEventListener('mousemove', onMousemove);

    // bind a mouseup event handler to stop tracking mouse movements
    document.addEventListener('mouseup', onMouseup);

    event.preventDefault();
    event.stopPropagation();

    // Set focus to the clicked handle
    sliderNode.focus();
  }

  onInputChange(event) {
    var tgt = event.currentTarget,
      value = tgt.value,
      isNumber = typeof parseInt(value) === 'number';

    if (this.isMinInput(tgt)) {
      if (value.length === 0) {
        tgt.value = this.getValue(this.minSliderNode);
      } else {
        if (isNumber && this.isInRange(this.minSliderNode, value)) {
          this.moveSliderTo(this.minSliderNode, value);
        } else {
          tgt.value = this.getValue(this.minSliderNode);
        }
      }
    } else {
      if (value.length === 0) {
        tgt.value = this.getValue(this.maxSliderNode);
      } else {
        if (isNumber && this.isInRange(this.maxSliderNode, value)) {
          this.moveSliderTo(this.maxSliderNode, value);
        } else {
          tgt.value = this.getValue(this.maxSliderNode);
        }
      }
    }
  }
}

// Initialize Multithumb Slider widgets on the page
window.addEventListener('load', function () {
  var slidersMultithumb = document.querySelectorAll('.slider-multithumb');

  for (let i = 0; i < slidersMultithumb.length; i++) {
    new SliderMultithumb(slidersMultithumb[i]);
  }
});
