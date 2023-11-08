'use strict';
/*
 *   This content is licensed according to the W3C Software License at
 *   https://www.w3.org/Consortium/Legal/2015/copyright-software-and-document
 *
 *   File:   slider-rating.js
 *
 *   Desc:   RatingSlider widget that implements ARIA Authoring Practices
 */

const SELECTED_SIZE = 6;
const RAIL_LEFT = 13;
const RAIL_TOP = 35;
const RAIL_HEIGHT = 24;

class RatingSlider {
  constructor(domNode) {
    this.sliderNode = domNode;

    this.isMoving = false;

    this.svgNode = domNode.querySelector('svg');
    this.focusRect = domNode.querySelector('.focus-ring');

    this.ratingRects = Array.from(
      domNode.querySelectorAll('g.rating rect.value')
    );

    this.ratingRectLabels = Array.from(
      domNode.querySelectorAll('g.rating text.label')
    );

    [this.infoRatingRects, this.railWidth] = this.calcRatingRects();
    this.infoDefaultFocusRect = this.calcDefaultFocusRect();

    this.valueMin = this.getValueMin();
    this.valueMax = this.getValueMax();

    this.svgPoint = this.svgNode.createSVGPoint();

    // define possible slider positions

    this.sliderNode.addEventListener(
      'keydown',
      this.onSliderKeydown.bind(this)
    );

    this.svgNode.addEventListener('click', this.onRailClick.bind(this));
    this.svgNode.addEventListener(
      'pointerdown',
      this.onSliderPointerDown.bind(this)
    );

    // bind a pointermove event handler to move pointer
    this.svgNode.addEventListener('pointermove', this.onPointerMove.bind(this));

    // bind a pointerup event handler to stop tracking pointer movements
    document.addEventListener('pointerup', this.onPointerUp.bind(this));

    this.addTotalRectsToRatingLabel();
    this.sliderNode.addEventListener(
      'blur',
      this.addTotalRectsToRatingLabel.bind(this)
    );

    window.addEventListener('resize', this.onResize.bind(this));

    this.setFocusRing(0);
  }

  // Get point in global SVG space
  getSVGPoint(event) {
    this.svgPoint.x = event.clientX;
    this.svgPoint.y = event.clientY;
    return this.svgPoint.matrixTransform(this.svgNode.getScreenCTM().inverse());
  }

  getValue() {
    return parseFloat(this.sliderNode.getAttribute('aria-valuenow'));
  }

  getValueMin() {
    return parseFloat(this.sliderNode.getAttribute('aria-valuemin'));
  }

  getValueMax() {
    return parseFloat(this.sliderNode.getAttribute('aria-valuemax'));
  }

  getValueText(value) {
    switch (value) {
      case 0:
        return 'no satisfaction rating selected';

      case 1:
        return 'one, extremely dissatisfied';

      case 2:
        return 'two';

      case 3:
        return 'three';

      case 4:
        return 'four';

      case 5:
        return 'five';

      case 6:
        return 'six';

      case 7:
        return 'seven';

      case 8:
        return 'eight';

      case 9:
        return 'nine';

      case 10:
        return 'ten, extremely satisfied';

      default:
        break;
    }

    return 'Unexpected value: ' + value;
  }

  getValueTextWithMax(value) {
    switch (value) {
      case 0:
        return 'no rating on the 10 point satisfaction scale selected';

      case 1:
        return 'one, extremely unsatisfied, first value on ten point satisfaction scale';

      case 2:
        return 'two, second value on ten point satisfaction scale';

      case 3:
        return 'three, third value on ten point satisfaction scale';

      case 4:
        return 'four, fourth value on ten point satisfaction scale';

      case 5:
        return 'five, fifth value on ten point satisfaction scale';

      case 6:
        return 'six, sixth value on ten point satisfaction scale';

      case 7:
        return 'seven, seventh value on ten point satisfaction scale';

      case 8:
        return 'eight, eighth value on ten point satisfaction scale';

      case 9:
        return 'nine, ninth value on ten point satisfaction scale';

      case 10:
        return 'ten, extremely satisfied, tenth value on ten point satisfaction scale';

      default:
        break;
    }

    return 'Unexpected value: ' + value;
  }

  calcRatingRects() {
    let infoRatingRects = [];

    const railWidth = Math.min(
      Math.max(24, this.sliderNode.getBoundingClientRect().width),
      600
    );
    const rectWidth = (railWidth - RAIL_LEFT) / 10;

    let left = RAIL_LEFT;

    for (let i = 0; i < this.ratingRects.length; i += 1) {
      const rect = this.ratingRects[i];
      const label = this.ratingRectLabels[i];

      rect.setAttribute('x', left);
      rect.setAttribute('y', RAIL_TOP);
      rect.setAttribute('width', rectWidth);
      rect.setAttribute('height', RAIL_HEIGHT);
      rect.removeAttribute('rx');

      const labelWidth = label.getBoundingClientRect().width;
      const labelHeight = label.getBoundingClientRect().height;

      label.setAttribute('x', 2 + left + (rectWidth - labelWidth) / 2);
      label.setAttribute(
        'y',
        -2 + RAIL_TOP + RAIL_HEIGHT - (RAIL_HEIGHT - labelHeight + 4) / 2
      );

      const info = {
        x: left,
        y: RAIL_TOP,
        width: rectWidth,
        height: RAIL_HEIGHT,
        rx: 0,
      };

      infoRatingRects[i] = info;

      rect.parentNode.classList.remove('current');

      left += rectWidth;
    }

    // adjust extremely satisfied label position
    const descNodes = this.sliderNode.querySelectorAll('g.rating .description');
    let descX = RAIL_LEFT;
    descNodes[0].setAttribute('x', descX);

    descX = railWidth - descNodes[1].getBoundingClientRect().width + 5;
    descNodes[1].setAttribute('x', descX);

    return [infoRatingRects, railWidth];
  }

  calcDefaultFocusRect() {
    return {
      x: 2,
      y: 2,
      width: this.railWidth + SELECTED_SIZE,
      height: RAIL_TOP + RAIL_HEIGHT + SELECTED_SIZE,
      rx: SELECTED_SIZE,
    };
  }

  resetRects() {
    for (let i = 0; i < this.ratingRects.length; i += 1) {
      const rect = this.ratingRects[i];
      const infoRect = this.infoRatingRects[i];

      rect.setAttribute('x', infoRect.x);
      rect.setAttribute('y', infoRect.y);
      rect.setAttribute('width', infoRect.width);
      rect.setAttribute('height', infoRect.height);
      rect.removeAttribute('rx');

      rect.parentNode.classList.remove('current');
    }
  }

  setSelectedRatingRect(value) {
    let rect, info;

    const leftValue = value - 1;
    const rightValue = value + 1;

    if (value > 0) {
      rect = this.ratingRects[value - 1];
      info = this.infoRatingRects[value - 1];

      rect.setAttribute('x', info.x - SELECTED_SIZE);
      rect.setAttribute('y', info.y - SELECTED_SIZE);
      rect.setAttribute('width', info.width + 2 * SELECTED_SIZE);
      rect.setAttribute('height', info.height + 2 * SELECTED_SIZE);
      rect.setAttribute('rx', SELECTED_SIZE);

      rect.parentNode.classList.add('current');
    }

    if (leftValue > 0) {
      rect = this.ratingRects[leftValue - 1];
      info = this.infoRatingRects[leftValue - 1];

      rect.setAttribute('width', info.width - SELECTED_SIZE);
    }

    if (rightValue <= this.valueMax) {
      rect = this.ratingRects[rightValue - 1];
      info = this.infoRatingRects[rightValue - 1];

      rect.setAttribute('x', info.x + SELECTED_SIZE);
      rect.setAttribute('width', info.width - SELECTED_SIZE);
    }
  }

  setFocusRing(value) {
    const size = 2 * SELECTED_SIZE;

    if (value > 0 && value <= this.valueMax) {
      const info = this.infoRatingRects[value - 1];

      this.focusRect.setAttribute('x', info.x - size);
      this.focusRect.setAttribute('y', info.y - size);
      this.focusRect.setAttribute('width', info.width + 2 * size);
      this.focusRect.setAttribute('height', info.height + 2 * size);
      this.focusRect.setAttribute('rx', size);
    } else {
      // Set ring around entire control

      this.focusRect.setAttribute('x', this.infoDefaultFocusRect.x);
      this.focusRect.setAttribute('y', this.infoDefaultFocusRect.y);
      this.focusRect.setAttribute('width', this.infoDefaultFocusRect.width);
      this.focusRect.setAttribute('height', this.infoDefaultFocusRect.height);
      this.focusRect.setAttribute('rx', SELECTED_SIZE);
    }
  }

  moveSliderTo(value) {
    value = Math.min(Math.max(value, this.valueMin + 1), this.valueMax);
    this.sliderNode.setAttribute('aria-valuenow', value);
    this.sliderNode.setAttribute('aria-valuetext', this.getValueText(value));

    this.resetRects();
    this.setSelectedRatingRect(value);
    this.setFocusRing(value);
  }

  onSliderKeydown(event) {
    let flag = false;
    let value = this.getValue();

    switch (event.key) {
      case 'ArrowLeft':
      case 'ArrowDown':
        this.moveSliderTo(value - 1);
        flag = true;
        break;

      case 'ArrowRight':
      case 'ArrowUp':
        this.moveSliderTo(value + 1);
        flag = true;
        break;

      case 'PageDown':
        this.moveSliderTo(value - 2);
        flag = true;
        break;

      case 'PageUp':
        this.moveSliderTo(value + 2);
        flag = true;
        break;

      case 'Home':
        this.moveSliderTo(this.valueMin + 1);
        flag = true;
        break;

      case 'End':
        this.moveSliderTo(this.valueMax);
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

  addTotalRectsToRatingLabel() {
    let valuetext = this.getValueTextWithMax(this.getValue());
    this.sliderNode.setAttribute('aria-valuetext', valuetext);
  }

  onRailClick(event) {
    const x = this.getSVGPoint(event).x;
    const diffX = x - RAIL_LEFT;
    const rating = (diffX * this.valueMax) / this.railWidth;
    const value = Math.ceil(rating);

    this.moveSliderTo(value);

    event.preventDefault();
    event.stopPropagation();

    // Set focus to the clicked handle
    this.sliderNode.focus();
  }

  onSliderPointerDown(event) {
    this.isMoving = true;

    event.preventDefault();
    event.stopPropagation();

    // Set focus to the clicked handle
    this.sliderNode.focus();
  }

  onPointerMove(event) {
    if (this.isMoving) {
      const x = this.getSVGPoint(event).x;
      const diffX = x - RAIL_LEFT;
      const rating = (diffX * this.valueMax) / this.railWidth;
      const value = Math.ceil(rating);

      this.moveSliderTo(value);

      event.preventDefault();
      event.stopPropagation();
    }
  }

  onPointerUp() {
    this.isMoving = false;
  }

  onResize() {
    [this.infoRatingRects, this.railWidth] = this.calcRatingRects();
    this.infoDefaultFocusRect = this.calcDefaultFocusRect();
    this.setSelectedRatingRect(this.getValue());
    this.setFocusRing(this.getValue());
  }
}

// Initialize RatingSliders on the page
window.addEventListener('load', function () {
  var sliders = document.querySelectorAll('.rating-slider');
  for (let i = 0; i < sliders.length; i++) {
    new RatingSlider(sliders[i]);
  }
});
