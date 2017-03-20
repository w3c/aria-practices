/*
*   This content is licensed according to the W3C Software License at
*   https://www.w3.org/Consortium/Legal/2015/copyright-software-and-document
*
*   File:   button.js
*
*   Desc:   JS code for Button Design Pattersn
*
*   Author: Jon Gunderson
*/

var ICON_MUTE_URL  = 'images/mute.svg#icon-mute';
var ICON_SOUND_URL = 'images/mute.svg#icon-sound';

function init () {
  // Create variables for the various buttons
  var actionButton = document.getElementById('action');
  var toggleButton = document.getElementById('toggle');

  // Add event listeners to the various buttons
  actionButton.addEventListener('click', actionButtonEventHandler);
  actionButton.addEventListener('keydown', actionButtonEventHandler);

  toggleButton.addEventListener('click', toggleButtonEventHandler);
  toggleButton.addEventListener('keydown', toggleButtonEventHandler);

}

function actionButtonEventHandler (event) {
  var type = event.type;

  // Grab the keydown and click events
  if (type === 'keydown') {
    // If either enter or space is pressed, execute the funtion
    if (event.keyCode === 13 || event.keyCode === 32) {
      window.print();

      event.preventDefault();
    }
  }
  else if (type === 'click') {
    window.print();
  }
}

function toggleButtonEventHandler (event) {
  var type = event.type;

  // Grab the keydown and click events
  if (type === 'keydown') {
    // If either enter or space is pressed, execute the funtion
    if (event.keyCode === 13 || event.keyCode === 32) {
      toggleButtonState(event);

      event.preventDefault();
    }
  }
  else if (type === 'click') {
    // Only allow this event if either role is correctly set
    // or a correct element is used.
    if (event.target.getAttribute('role') === 'button' || event.target.tagName === 'button') {
      toggleButtonState(event);
    }
  }
}

function toggleButtonState (event) {
  var button = event.target;
  var currentState = button.getAttribute('aria-pressed');
  var newState = 'true';

  var icon = button.getElementsByTagName('use')[0];
  var currentIconState = icon.getAttribute('xlink:href');
  var newIconState = ICON_MUTE_URL;

  // If aria-pressed is set to true, set newState to false
  if (currentState === 'true') {
    newState = 'false';
    newIconState = ICON_SOUND_URL;
  }

  // Set the new aria-pressed state on the button
  button.setAttribute('aria-pressed', newState);
  icon.setAttribute('xlink:href', newIconState);
}

window.onload = init;
