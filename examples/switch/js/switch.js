let HTMLSwitches = [].slice.call(document.querySelectorAll('[role^switch]'));

for (HTMLSwitch in HTMLSwitches) {
    HTMLSwitch.addEventListener('click', activateSwitch);
}

function activateSwitch (event) {
    let switchEl = event.target;
    let currentState = switchEl.getAttribute('aria-checked');
    let newState = (currentState === "false" ? "true" : "false");

    switchEl.setAttribute('aria-checked', newState);
}