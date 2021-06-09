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

    this.inputEventCount = 0;
    this.pointermoveEventCount = 0;

    this.domNode = domNode;
    this.rangeNode = domNode.querySelector('input[type="range"]');
    this.valueNode = domNode.querySelector('.range-value');
    this.rangeNode.addEventListener('input', this.onInput.bind(this));
    /*    this.rangeNode.addEventListener(
      'pointermove',
      this.onPointermove.bind(this)
    );
*/
  }

  onInput(event) {
    this.inputEventCount += 1;
    document.getElementById('id-input').value = this.inputEventCount;
    this.onRangeChange(event);
  }

  onPointermove(event) {
    this.pointermoveEventCount += 1;
    document.getElementById(
      'id-pointermove'
    ).value = this.pointermoveEventCount;
    this.onRangeChange(event);
  }

  onRangeChange(event) {
    if (this.domNode.contains(event.currentTarget)) {
      let valuetext =
        parseFloat(this.rangeNode.value).toFixed(1) + this.labelCelsiusAbbrev;
      this.valueNode.textContent = valuetext;
      this.rangeNode.setAttribute('aria-valuetext', valuetext);
    }
  }
}

// Initialize range temperature controls
window.addEventListener('load', function () {
  var rangesTemp = document.querySelectorAll('.range-temperature');

  for (let i = 0; i < rangesTemp.length; i++) {
    new RangeTemperature(rangesTemp[i]);
  }
});
