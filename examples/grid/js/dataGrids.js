/*
 *   This content is licensed according to the W3C Software License at
 *   https://www.w3.org/Consortium/Legal/2015/copyright-software-and-document
 */

'use strict';

/**
 * ARIA Grid Examples
 * @function onload
 * @desc Initialize the grid examples once the page has loaded
 */

window.addEventListener('load', function () {
  var ex1 = document.getElementById('ex1');
  var ex1Grid = new aria.Grid(ex1.querySelector('[role="grid"]'));

  var ex2 = document.getElementById('ex2');
  var ex2Grid = new aria.Grid(ex2.querySelector('[role="grid"]'));

  var ex3 = document.getElementById('ex3');
  var ex3Grid = new aria.Grid(ex3.querySelector('[role="grid"]'));
  var toggleButton = document.getElementById('toggle_column_btn');
  var toggledOn = true;

  toggleButton.addEventListener('click', function (event) {
    toggledOn = !toggledOn;

    ex3Grid.toggleColumn(2, toggledOn);
    ex3Grid.toggleColumn(4, toggledOn);

    if (toggledOn) {
      toggleButton.innerText = 'Hide Type and Category';
    } else {
      toggleButton.innerText = 'Show Type and Category';
    }
  });
});
