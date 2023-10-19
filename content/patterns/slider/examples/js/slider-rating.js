'use strict';
/*
 *   This content is licensed according to the W3C Software License at
 *   https://www.w3.org/Consortium/Legal/2015/copyright-software-and-document
 *
 *   File:   slider-rating.js
 *
 *   Desc:   RatingSlider widget that implements ARIA Authoring Practices
 */

const OFFSET_SIZE = 4;

class RatingSlider {
  constructor(domNode) {
    this.sliderNode = domNode;

    this.isMoving = false;

    this.svgNode = domNode.querySelector('svg');

    this.ratingRects = Array.from(
      domNode.querySelectorAll('g.rating rect.value')
    );
    this.infoRatingRects = [];

    this.ratingRects.forEach((r) => {
      const info = {
        x: parseInt(r.getAttribute('x')),
        y: parseInt(r.getAttribute('y')),
        width: parseInt(r.getAttribute('width')),
        height: parseInt(r.getAttribute('height')),
        rx: 0,
      };
      this.infoRatingRects.push(info);
    });

    const infoFirstRect = this.infoRatingRects[0];
    const infoLastRect = this.infoRatingRects[this.infoRatingRects.length - 1];

    this.railOffset = infoFirstRect.x;
    this.railWidth = infoLastRect.x + infoLastRect.width - infoFirstRect.x;

    this.focusRect = domNode.querySelector('.focus-ring');

    this.infoDefaultFocus = {
      x: OFFSET_SIZE,
      y: OFFSET_SIZE,
      width: infoLastRect.x + infoLastRect.width + OFFSET_SIZE,
      height: infoFirstRect.y + infoLastRect.height + OFFSET_SIZE,
      rx: OFFSET_SIZE,
    };

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

  resetRects() {
    for (let i = 0; i < this.ratingRects.length; i += 1) {
      const rect = this.ratingRects[i];
      const info = this.infoRatingRects[i];

      rect.setAttribute('x', info.x);
      rect.setAttribute('y', info.y);
      rect.setAttribute('width', info.width);
      rect.setAttribute('height', info.height);
      rect.setAttribute('rx', info.rx);

      rect.parentNode.classList.remove('current');
    }
  }

  setSelectedRating(value) {
    let rect, info;

    const leftValue = value - 1;
    const rightValue = value + 1;

    if (value > 0) {
      rect = this.ratingRects[value - 1];
      info = this.infoRatingRects[value - 1];

      rect.setAttribute('x', info.x - OFFSET_SIZE);
      rect.setAttribute('y', info.y - OFFSET_SIZE);
      rect.setAttribute('width', info.width + 2 * OFFSET_SIZE);
      rect.setAttribute('height', info.height + 2 * OFFSET_SIZE);
      rect.setAttribute('rx', OFFSET_SIZE);

      rect.parentNode.classList.add('current');
    }

    if (leftValue > 0) {
      rect = this.ratingRects[leftValue - 1];
      info = this.infoRatingRects[leftValue - 1];

      rect.setAttribute('width', info.width - OFFSET_SIZE);
    }

    if (rightValue <= this.valueMax) {
      rect = this.ratingRects[rightValue - 1];
      info = this.infoRatingRects[rightValue - 1];

      rect.setAttribute('x', info.x + OFFSET_SIZE);
      rect.setAttribute('width', info.width - OFFSET_SIZE);
    }
  }

  setFocusRing(value) {
    const size = 2 * OFFSET_SIZE;

    if (value > 0 && value <= this.valueMax) {
      const info = this.infoRatingRects[value - 1];

      this.focusRect.setAttribute('x', info.x - size);
      this.focusRect.setAttribute('y', info.y - size);
      this.focusRect.setAttribute('width', info.width + 2 * size);
      this.focusRect.setAttribute('height', info.height + 2 * size);
      this.focusRect.setAttribute('rx', size);
    } else {
      // Set ring around entire control

      this.focusRect.setAttribute('x', this.infoDefaultFocus.x);
      this.focusRect.setAttribute('y', this.infoDefaultFocus.y);
      this.focusRect.setAttribute('width', this.infoDefaultFocus.width);
      this.focusRect.setAttribute('height', this.infoDefaultFocus.height);
      this.focusRect.setAttribute('rx', this.infoDefaultFocus.rx);
    }
  }

  moveSliderTo(value) {
    value = Math.min(Math.max(value, this.valueMin + 1), this.valueMax);
    this.sliderNode.setAttribute('aria-valuenow', value);
    this.sliderNode.setAttribute('aria-valuetext', this.getValueText(value));

    this.resetRects();
    this.setSelectedRating(value);
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

  addTotalCirclesToRatingLabel() {
    let valuetext = this.getValueTextWithMax(this.getValue());
    this.sliderNode.setAttribute('aria-valuetext', valuetext);
  }

  onRailClick(event) {
    const x = this.getSVGPoint(event).x;
    const diffX = x - this.railOffset;
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
      const diffX = x - this.railOffset;
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
}

// Initialize RatingSliders on the page
window.addEventListener('load', function () {
  var sliders = document.querySelectorAll('.rating-slider');
  for (let i = 0; i < sliders.length; i++) {
    new RatingSlider(sliders[i]);
  }
});
