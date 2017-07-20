// Run the load function after all resources are loaded.
window.onload = load;

const keys = {
  enter: 13,
  space: 32
};

function load() {
  // Create an array of all the switches on the page.
  // The query looks for elements with a role attribute that starts with "switch".
  let HTMLSwitches = [].slice.call(document.querySelectorAll('[role^=switch]'));

  // Add an event listener to all the switches.
  for (let HTMLSwitch of HTMLSwitches) {
    HTMLSwitch.addEventListener('click', activateSwitch);
    HTMLSwitch.addEventListener('keydown', HTMLSwitchKeyHandler);
  }
};

function HTMLSwitchKeyHandler (event) {
  let switchEl = this;
  let key = event.keyCode;

  // If either enter or space is pressed activate the switch.
  if (key === keys.enter || key === keys.space) {
    event.preventDefault();
    activateSwitch(event, this);
  }
};

function activateSwitch (event, eventTarget) {
  let switchEl = eventTarget;

  // If no element is provided set it 'this'.
  if (eventTarget === undefined) {
    switchEl = this;
  }
  
  // Get the current state for the switch.
  let currentState = switchEl.getAttribute('aria-checked');
  // Invert the state.
  let newState = (currentState === "false" ? "true" : "false");

  // Set the new state.
  switchEl.setAttribute('aria-checked', newState);
};