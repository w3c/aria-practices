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

    this.targetRects = Array.from(
      domNode.querySelectorAll('g.rating rect.target')
    );

    this.labelTexts = Array.from(
      domNode.querySelectorAll('g.rating text.label')
    );

    [this.infoTargetRects, this.railWidth] = this.calcRatingRects();
    this.infoDefaultFocusRect = this.calcDefaultFocusRect();

    this.valueMin = this.getValueMin();
    this.valueMax = this.getValueMax();

    this.sliderNode.addEventListener(
      'keydown',
      this.onSliderKeydown.bind(this)
    );

    this.labelTexts.forEach((lt) => {
      lt.addEventListener('click', this.onTargetClick.bind(this));
    });

    this.targetRects.forEach((tr) => {
      tr.addEventListener('click', this.onTargetClick.bind(this));
      tr.addEventListener('pointerdown', this.onSliderPointerDown.bind(this));
      tr.addEventListener('pointermove', this.onPointerMove.bind(this));
    });

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
      Math.max(260, this.sliderNode.getBoundingClientRect().width),
      600
    );
    const rectWidth = Math.round((railWidth - RAIL_LEFT) / 10);

    let left = RAIL_LEFT;

    for (let i = 0; i < this.targetRects.length; i += 1) {
      const targetNode = this.targetRects[i];
      const labelNode = this.labelTexts[i];

      targetNode.setAttribute('x', left);
      targetNode.setAttribute('y', RAIL_TOP);
      targetNode.setAttribute('width', rectWidth);
      targetNode.setAttribute('height', RAIL_HEIGHT);
      targetNode.removeAttribute('rx');

      this.setLabelPosition(labelNode, left, rectWidth);

      const infoTarget = {
        x: left,
        y: RAIL_TOP,
        width: rectWidth,
        height: RAIL_HEIGHT,
        rx: 0,
      };

      infoRatingRects[i] = infoTarget;

      targetNode.parentNode.classList.remove('current');

      left += rectWidth;
    }

    // adjust extremely satisfied label position
    const descNodes = this.sliderNode.querySelectorAll('g.rating .description');
    let descX = RAIL_LEFT;
    descNodes[0].setAttribute('x', descX);

    descX = Math.round(railWidth - descNodes[1].getBBox().width + 2);
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
    for (let i = 0; i < this.targetRects.length; i += 1) {
      const targetNode = this.targetRects[i];
      const infoTarget = this.infoTargetRects[i];
      const labelNode = this.labelTexts[i];

      targetNode.setAttribute('x', infoTarget.x);
      targetNode.setAttribute('y', infoTarget.y);
      targetNode.setAttribute('width', infoTarget.width);
      targetNode.setAttribute('height', infoTarget.height);
      targetNode.removeAttribute('rx');

      this.setLabelPosition(labelNode, infoTarget.x, infoTarget.width);

      targetNode.parentNode.classList.remove('current');
    }
  }

  setSelectedRatingRect(value) {
    let labelNode, targetNode, infoTarget;

    const leftValue = value - 1;
    const rightValue = value + 1;

    if (value > 0) {
      targetNode = this.targetRects[value - 1];
      infoTarget = this.infoTargetRects[value - 1];
      labelNode = this.labelTexts[value - 1];

      targetNode.parentNode.classList.add('current');

      const rectWidth = infoTarget.width + 2 * SELECTED_SIZE;
      const x = infoTarget.x - SELECTED_SIZE;

      targetNode.setAttribute('x', x);
      targetNode.setAttribute('y', infoTarget.y - SELECTED_SIZE);
      targetNode.setAttribute('width', rectWidth);
      targetNode.setAttribute('height', infoTarget.height + 2 * SELECTED_SIZE);
      targetNode.setAttribute('rx', SELECTED_SIZE);

      this.setLabelPosition(labelNode, x, rectWidth, '120%');
    }

    if (leftValue > 0) {
      targetNode = this.targetRects[leftValue - 1];
      infoTarget = this.infoTargetRects[leftValue - 1];

      targetNode.setAttribute('width', infoTarget.width - SELECTED_SIZE);
    }

    if (rightValue <= this.valueMax && value > 0) {
      targetNode = this.targetRects[rightValue - 1];
      infoTarget = this.infoTargetRects[rightValue - 1];

      targetNode.setAttribute('x', infoTarget.x + SELECTED_SIZE);
      targetNode.setAttribute('width', infoTarget.width - SELECTED_SIZE);
    }
  }

  setLabelPosition(labelNode, x, rectWidth, fontSize = '95%') {
    labelNode.setAttribute('style', `font-size: ${fontSize}`);

    const labelWidth = Math.round(labelNode.getBBox().width);
    const labelHeight = Math.round(labelNode.getBBox().height);

    labelNode.setAttribute(
      'x',
      2 + x + Math.round((rectWidth - labelWidth) / 2)
    );
    labelNode.setAttribute(
      'y',
      -1 +
        RAIL_TOP +
        RAIL_HEIGHT -
        Math.round((RAIL_HEIGHT - labelHeight + 4) / 2)
    );
  }

  setFocusRing(value) {
    const size = 2 * SELECTED_SIZE;

    if (value > 0 && value <= this.valueMax) {
      const infoTarget = this.infoTargetRects[value - 1];

      this.focusRect.setAttribute('x', infoTarget.x - size);
      this.focusRect.setAttribute('y', infoTarget.y - size);
      this.focusRect.setAttribute('width', infoTarget.width + 2 * size);
      this.focusRect.setAttribute('height', infoTarget.height + 2 * size);
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

  onTargetClick(event) {
    this.moveSliderTo(
      event.currentTarget.parentNode.getAttribute('data-value')
    );

    event.preventDefault();
    event.stopPropagation();

    // Set focus to the clicked handle
    this.sliderNode.focus();
  }

  onSliderPointerDown(event) {
    if (!this.isMoving) {
      this.isMoving = true;
    }
    event.preventDefault();
    event.stopPropagation();
  }

  onPointerMove(event) {
    if (this.isMoving) {
      this.moveSliderTo(
        event.currentTarget.parentNode.getAttribute('data-value')
      );
      event.preventDefault();
      event.stopPropagation();
    }
  }

  onPointerUp() {
    if (this.isMoving) {
      this.isMoving = false;
      // Set focus to the clicked handle
      this.sliderNode.focus();
    }
  }

  onResize() {
    [this.infoTargetRects, this.railWidth] = this.calcRatingRects();
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
