'use strict';
/*
 *   This content is licensed according to the W3C Software License at
 *   https://www.w3.org/Consortium/Legal/2015/copyright-software-and-document
 *
 *   File:   slider-rating.js
 *
 *   Desc:   RatingSlider widget that implements ARIA Authoring Practices
 */

class RatingSlider {
  constructor(domNode) {
    this.sliderNode = domNode;

    this.isMoving = false;

    this.svgNode = domNode.querySelector('svg');

    // Inherit system text colors
    //    var  color = getComputedStyle(this.sliderNode).color;
    //    this.svgNode.setAttribute('color', color);

    this.railWidth = 360;
    this.railOffset = 20;

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

    this.addTotalCirclesToRatingLabel();
    this.sliderNode.addEventListener(
      'blur',
      this.addTotalCirclesToRatingLabel.bind(this)
    );
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
      case -1:
        return 'no rating selected';

      case 0:
        return 'Unacceptable';

      case 1:
        return 'Extremely dissatisfied';

      case 2:
        return 'Strongly dissatisfied';

      case 3:
        return 'dissatisfied';

      case 4:
        return 'Slightly dissatisfied';

      case 5:
        return 'Neither satisfied or dissatisfied';

      case 6:
        return 'Slightly satisfied';

      case 7:
        return 'Satisfied';

      case 8:
        return 'Strongly satisfied';

      case 9:
        return 'Extremely satisfied';

      case 10:
        return 'Completely satisfied';

      default:
        break;
    }

    return 'Unexpected value: ' + value;
  }

  getValueTextWithMax(value) {
    switch (value) {
      case -1:
        return 'no rating on the 11 point rating scale selected';

      case 0:
        return 'Unacceptable, first of eleven point rating scale';

      case 1:
        return 'Extremely dissatisfied, second of eleven point rating scale';

      case 2:
        return 'Strongly dissatisfied, third of eleven point rating scale';

      case 3:
        return 'dissatisfied, fourth of eleven point rating scale';

      case 4:
        return 'Slightly dissatisfied, fifth of eleven point rating scale';

      case 5:
        return 'Neither satisfied or dissatisfied, sixth of eleven point rating scale';

      case 6:
        return 'Slightly satisfied, seventh of eleven point rating scale';

      case 7:
        return 'Satisfied, eighth of eleven point rating scale';

      case 8:
        return 'Strongly satisfied, ninth of eleven point rating scale';

      case 9:
        return 'Extremely satisfied, tenth of eleven point rating scale';

      case 10:
        return 'Completely satisfied, eleventh of eleven point rating scale';

      default:
        break;
    }

    return 'Unexpected value: ' + value;
  }

  moveSliderTo(value) {
    value = Math.min(Math.max(value, this.valueMin + 1), this.valueMax);
    this.sliderNode.setAttribute('aria-valuenow', value);
    this.sliderNode.setAttribute('aria-valuetext', this.getValueText(value));
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

  addTotalCirclesToRatingLabel() {
    let valuetext = this.getValueTextWithMax(this.getValue());
    this.sliderNode.setAttribute('aria-valuetext', valuetext);
  }

  onRailClick(event) {
    const x = this.getSVGPoint(event).x;
    const diffX = x - this.railOffset;
    const rating =
      0.5 + (diffX * (this.valueMax - this.valueMin)) / this.railWidth;
    const value = Math.round(rating);

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
      const diffX = x - this.railOffset;
      const rating =
        0.5 + (diffX * (this.valueMax - this.valueMin)) / this.railWidth;
      const value = Math.round(rating);

      this.moveSliderTo(value);

      event.preventDefault();
      event.stopPropagation();
    }
  }

  onPointerUp() {
    this.isMoving = false;
  }
}

// Initialize RatingSliders on the page
window.addEventListener('load', function () {
  var sliders = document.querySelectorAll('.rating-slider');
  for (let i = 0; i < sliders.length; i++) {
    new RatingSlider(sliders[i]);
  }
});
