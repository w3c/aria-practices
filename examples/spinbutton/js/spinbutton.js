/*
*   This content is licensed according to the W3C Software License at
*   https://www.w3.org/Consortium/Legal/2015/copyright-software-and-document
*
*   Simple spinbutton pattern example
*/

'use strict';

Array.prototype.slice.call(document.querySelectorAll('.Spinbutton')).forEach(function (spinbutton) {

  spinbutton.addEventListener('keydown', function (event) {
    var target = event.target;

    if (event.key.match(/[\d]|Backspace/)) {
      // updateValueNow(target,);
    }
    else {
      event.preventDefault();
    }

    switch (event.key) {
      case 'ArrowDown': // decrement
        event.preventDefault();
        decrementCount(target);
        break;
      case 'ArrowUp': // increment
        event.preventDefault();
        incrementCount(target);
        break;
    }
  });


  spinbutton.addEventListener('click', function (event) {
    var target = event.target;
    var classList = target.classList;

    if (classList.contains('Spinbutton-button--increment')) {
      incrementCount(target.previousElementSibling);
    }
    else if (classList.contains('Spinbutton-button--decrement')) {
      decrementCount(target.nextElementSibling);
    }
  });
});

var incrementCount = function incrementCount (spinner) {
  var currentValue = +spinner.value || 0;
  var minValue = +spinner.getAttribute('aria-valuemin');
  var maxValue = +spinner.getAttribute('aria-valuemax');

  if (currentValue < maxValue) {
    currentValue++;
  }

  spinner.value = currentValue;
  updateValueNow(spinner);
};

var decrementCount = function decrementCount (spinner) {
  var currentValue = +spinner.value || 0;
  var minValue = +spinner.getAttribute('aria-valuemin');
  var maxValue = +spinner.getAttribute('aria-valuemax');

  if (currentValue > minValue) {
    currentValue--;
  }

  spinner.value = currentValue;
  updateValueNow(spinner);
};

var updateValueNow = function updateValueNow (spinner, value) {
  spinner.setAttribute('aria-valuenow', value || spinner.value);

};
