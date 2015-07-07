function init() {
  var printButton = document.getElementById('print');
  var toggleButton = document.getElementById('toggle');
  
  printButton.addEventListener('click', printButtonEventHandler);
  printButton.addEventListener('keydown', printButtonEventHandler);
  
  toggleButton.addEventListener('click', toggleButtonEventHandler);
  toggleButton.addEventListener('keydown', toggleButtonEventHandler);
}

function printButtonEventHandler(event) {
  var type = event.type;
  
  if (type === 'keydown') {
    if (event.keyCode === 13 || event.keyCode === 32) {
      window.print();
      
      event.preventDefault();
    }
  } else if (type === 'click') {
    window.print();
  }
}

function toggleButtonEventHandler(event) {
  var type = event.type;
  
  if (type === 'keydown') {
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
  
  if (currentState === 'true') {
    newState = 'false';
  }
  
  button.setAttribute('aria-pressed', newState);
}

window.onload = init;
