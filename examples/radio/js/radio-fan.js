/*
 *   This content is licensed according to the W3C Software License at
 *   https://www.w3.org/Consortium/Legal/2015/copyright-software-and-document
 *
 *   File:   radio-rating.js
 *
 *   Desc:   Radio group widget that implements ARIA Authoring Practices
 */

'use strict';

class FanRadioGroup {
  constructor(domNode) {
    this.radiogroupNode = domNode;

    this.isMoving = false;

    this.svgNode = domNode.querySelector('svg');
    this.svgPoint = this.svgNode.createSVGPoint();

    this.railNode = domNode.querySelector('.rail');
    this.sliderNode = domNode.querySelector('.slider');
    this.sliderFocusNode = this.sliderNode.querySelector('.focus-ring');
    this.sliderThumbNode = this.sliderNode.querySelector('.thumb');

    this.radioNodes = domNode.querySelectorAll('[role="radio"]');
    this.valueLabelPadding = 4;

    // Dimensions of the slider focus ring, thumb and rail

    this.railHeight = parseInt(this.railNode.getAttribute('height'));
    this.railWidth = parseInt(this.railNode.getAttribute('width'));
    this.railY = parseInt(this.railNode.getAttribute('y'));
    this.railX = parseInt(this.railNode.getAttribute('x'));

    this.thumbWidth = parseInt(this.sliderThumbNode.getAttribute('width'));
    this.thumbHeight = parseInt(this.sliderThumbNode.getAttribute('height'));

    this.focusHeight = parseInt(this.sliderFocusNode.getAttribute('height'));
    this.focusWidth = parseInt(this.sliderFocusNode.getAttribute('width'));

    this.thumbY = this.railY + this.railHeight / 2 - this.thumbHeight / 2;
    this.sliderThumbNode.setAttribute('y', this.thumbY);

    this.focusY = this.railY + this.railHeight / 2 - this.focusHeight / 2;
    this.sliderFocusNode.setAttribute('y', this.focusY);

    this.railNode.setAttribute('y', this.railY);
    this.railNode.setAttribute('x', this.railX);
    this.railNode.setAttribute('height', this.railHeight);
    this.railNode.setAttribute('width', this.railWidth);

    // define possible slider positions

    this.railNode.addEventListener('click', this.onRailClick.bind(this));
    this.radiogroupNode.addEventListener('keydown', this.onKeydown.bind(this));

    this.sliderNode.addEventListener(
      'pointerdown',
      this.onSliderPointerDown.bind(this)
    );

    // bind a pointermove event handler to move pointer
    this.svgNode.addEventListener('pointermove', this.onPointerMove.bind(this));

    // bind a pointerup event handler to stop tracking pointer movements
    document.addEventListener('pointerup', this.onPointerUp.bind(this));

    let deltaPosition = this.railWidth / 3;

    let position = this.railY;

    this.positions = [];
    this.textValues = [];

    let maxTextWidth = this.getWidthFromLabelText();
    let textHeight = this.getHeightFromLabelText();

    for (let i = 0; i < this.radioNodes.length; i++) {
      let radioNode = this.radioNodes[i];
      radioNode.setAttribute('aria-checked', 'false');

      let rectNode = radioNode.querySelector('rect');
      let textNode = radioNode.querySelector('text');

      let w = maxTextWidth + 2 * this.valueLabelPadding;
      let h = textHeight + 2 * this.valueLabelPadding;
      let x = position - w / 2;
      let y = this.thumbY + this.thumbHeight + 2 * this.valueLabelPadding;

      rectNode.setAttribute('width', w);
      rectNode.setAttribute('height', h);
      rectNode.setAttribute('x', x);
      rectNode.setAttribute('y', y);

      x =
        x +
        this.valueLabelPadding +
        (maxTextWidth - textNode.getBoundingClientRect().width) / 2;
      y = y + textHeight + this.valueLabelPadding / 2;

      textNode.setAttribute('x', x);
      textNode.setAttribute('y', y);

      radioNode.addEventListener('click', this.onRadioClick.bind(this));

      this.positions.push(position);
      position += deltaPosition;
    }

    this.moveFanTo(this.getValue());
  }

  getWidthFromLabelText() {
    let width = 0;
    for (let i = 0; i < this.radioNodes.length; i++) {
      let textNode = this.radioNodes[i].querySelector('text');
      if (textNode) {
        width = Math.max(width, textNode.getBoundingClientRect().width);
      }
    }
    return width;
  }

  getHeightFromLabelText() {
    let height = 0;
    let textNode = this.radioNodes[0].querySelector('text');
    if (textNode) {
      height = textNode.getBoundingClientRect().height;
    }
    return height;
  }

  // Get point in global SVG space
  getSVGPoint(event) {
    this.svgPoint.x = event.clientX;
    this.svgPoint.y = event.clientY;
    return this.svgPoint.matrixTransform(this.svgNode.getScreenCTM().inverse());
  }

  getValue() {
    return parseInt(this.radiogroupNode.getAttribute('data-fan-value'));
  }

  getValueMin() {
    return 0;
  }

  getValueMax() {
    return 3;
  }

  isInRange(value) {
    let valueMin = this.getValueMin();
    let valueMax = this.getValueMax();
    return value <= valueMax && value >= valueMin;
  }

  moveFanTo(value) {
    var valueMax, valueMin, id;

    valueMin = this.getValueMin();
    valueMax = this.getValueMax();

    value = Math.min(Math.max(value, valueMin), valueMax);

    this.radiogroupNode.setAttribute('data-fan-value', value);

    for (var i = this.getValueMin(); i < this.getValueMax(); i++) {
      if (value === i) {
        this.radioNodes[i].setAttribute('aria-checked', 'true');
      } else {
        this.radioNodes[i].setAttribute('aria-checked', 'false');
      }
    }

    id = this.radioNodes[value].id;
    this.radiogroupNode.setAttribute('aria-activedescendant', id);

    // move the SVG focus ring and thumb elements
    this.sliderFocusNode.setAttribute(
      'x',
      this.positions[value] - this.focusWidth / 2
    );
    this.sliderThumbNode.setAttribute(
      'x',
      this.positions[value] - this.thumbWidth / 2
    );
  }

  onKeydown(event) {
    var flag = false;
    var value = this.getValue();

    switch (event.key) {
      case 'ArrowLeft':
      case 'ArrowDown':
        this.moveFanTo(value - 1);
        flag = true;
        break;

      case 'ArrowRight':
      case 'ArrowUp':
        this.moveFanTo(value + 1);
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

  onRailClick(event) {
    var x = this.getSVGPoint(event).x;
    var min = this.getValueMin();
    var max = this.getValueMax();
    var diffX = x - this.railX;
    var value = Math.round((diffX * (max - min)) / this.railWidth);
    this.moveFanTo(value);

    event.preventDefault();
    event.stopPropagation();

    // Set focus to the clicked handle
    this.radiogroupNode.focus();
  }

  onSliderPointerDown(event) {
    this.isMoving = true;

    event.preventDefault();
    event.stopPropagation();

    // Set focus to the clicked handle
    this.radiogroupNode.focus();
  }

  onPointerMove(event) {
    if (this.isMoving) {
      var x = this.getSVGPoint(event).x;
      var min = this.getValueMin();
      var max = this.getValueMax();
      var diffX = x - this.railX;
      var value = Math.round((diffX * (max - min)) / this.railWidth);
      this.moveFanTo(value);

      event.preventDefault();
      event.stopPropagation();
    }
  }

  onPointerUp() {
    this.isMoving = false;
  }

  onRadioClick(event) {
    var tgt = event.currentTarget;
    var value = parseInt(tgt.getAttribute('data-value'));
    this.moveFanTo(value);
    this.radiogroupNode.focus();
    event.preventDefault();
    event.stopPropagation();
  }
}
// Initialize radio button group

window.addEventListener('load', function () {
  var rrgs = document.querySelectorAll('.fan-radio');
  for (var i = 0; i < rrgs.length; i++) {
    new FanRadioGroup(rrgs[i]);
  }
});
