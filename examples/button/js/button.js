function init() {
  // Create variables for the various buttons
  var printButton = document.getElementById('print');
  var toggleButton = document.getElementById('toggle');
  var alert1Button =  document.getElementById('alert1');
  var alert2Button =  document.getElementById('alert2');

  // Add event listeners to the various buttons
  printButton.addEventListener('click', printButtonEventHandler);
  printButton.addEventListener('keydown', printButtonEventHandler);

  toggleButton.addEventListener('click', toggleButtonEventHandler);
  toggleButton.addEventListener('keydown', toggleButtonEventHandler);

  alert1Button.addEventListener('click', alertButtonEventHandler);
  alert1Button.addEventListener('keydown', alertButtonEventHandler);

  alert2Button.addEventListener('click', alertButtonEventHandler);
  alert2Button.addEventListener('keydown', alertButtonEventHandler);

  
}

function printButtonEventHandler(event) {
  var type = event.type;

  // Grab the keydown and click events
  if (type === 'keydown') {
    // If either enter or space is pressed, execute the funtion
    if (event.keyCode === 13 || event.keyCode === 32) {
      window.print();

      event.preventDefault();
    }
  } else if (type === 'click') {
    window.print();
  }
}

function alertButtonEventHandler(event) {
  var type = event.type;
  var message = 'Hej, hello, ciao, こんにちは';

  // Grab the keydown and click events
  if (type === 'keydown') {
    // If either enter or space is pressed, execute the funtion
    if (event.keyCode === 13 || event.keyCode === 32) {
      alert(message);

      event.preventDefault();
    }
  } else if (type === 'click') {
    alert(message);
  }
}

function toggleButtonEventHandler(event) {
  var type = event.type;

  // Grab the keydown and click events
  if (type === 'keydown') {
    // If either enter or space is pressed, execute the funtion
    if (event.keyCode === 13 || event.keyCode === 32) {
      toggleButtonState(event);

      event.preventDefault();
    }
  } else if (type === 'click') {
    toggleButtonState(event);
  }
}

function toggleButtonState(event) {
  var button = event.target;
  var currentState = button.getAttribute('aria-pressed');
  var newState = 'true';

  // If aria-pressed is set to true, set newState to false
  if (currentState === 'true') {
    newState = 'false';
  }

  // Set the new aria-pressed state on the button
  button.setAttribute('aria-pressed', newState);
}

window.onload = init;
