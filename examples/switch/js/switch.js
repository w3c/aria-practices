// Run the load function after all resources are loaded.
window.onload = load;

function load() {
  // Create an array of all the switches on the page.
  // The query looks for elements with a role attribute that starts with "switch".
  let HTMLSwitches = [].slice.call(document.querySelectorAll('[role^=switch]'));

  // Add an event listener to all the switches.
  for (let HTMLSwitch of HTMLSwitches) {
    HTMLSwitch.addEventListener('click', activateSwitch);
  }
}

function activateSwitch (event) {
  let switchEl = this;
  // Get the current state for the switch.
  let currentState = switchEl.getAttribute('aria-checked');
  // Invert the state.
  let newState = (currentState === "false" ? "true" : "false");

  // Set the new state.
  switchEl.setAttribute('aria-checked', newState);
}