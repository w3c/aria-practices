/*
 *   This content is licensed according to the W3C Software License at
 *   https://www.w3.org/Consortium/Legal/2015/copyright-software-and-document
 *
 *   File:   range-temperature.js
 *
 *   Desc:   Vertical range widget that uses aria-valuetext and aria-orientation
 */

'use strict';

class RangeTemperature {
  constructor(domNode) {
    this.labelCelsiusAbbrev = '°C';
    this.labelCelsius = ' degrees Celsius';

    this.domNode = domNode;

    this.rangeNode = domNode.querySelector('input[type="range"]');

    // The input elements are optional to support mobile devices,
    // when a keyboard is not present
    this.valueNode = domNode.querySelector('.range-value');

    // bind a pointermove event handler to move pointer
    this.rangeNode.addEventListener('change', this.onRangeChange.bind(this));
    this.rangeNode.addEventListener('keydown', this.onRangeChange.bind(this));
    this.rangeNode.addEventListener(
      'pointermove',
      this.onRangeChange.bind(this)
    );
  }

  onRangeChange() {
    let valuetext =
      parseFloat(this.rangeNode.value).toFixed(1) + this.labelCelsiusAbbrev;
    this.valueNode.textContent = valuetext;
    this.rangeNode.setAttribute('aria-valuetext', valuetext);
  }
}

// Initialize range temperature controls
window.addEventListener('load', function () {
  var rangesTemp = document.querySelectorAll('.range-temperature');

  for (let i = 0; i < rangesTemp.length; i++) {
    new RangeTemperature(rangesTemp[i]);
  }
});
