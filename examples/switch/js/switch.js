class Switch {
  constructor (element) {
    this.element = element
    this.bindEvents()
    console.log('switch')
  }

  bindEvents () {
    this.element.addEventListener('click', () => this.toggleStatus())
    this.element.addEventListener('keydown', event => this.onKeydown(event))
  }

  onKeydown(event) {
    // Only do something when space or return is pressed
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      this.toggleStatus()
    }
  }

  // Switch state of a switch, hah, see what I did there, right…
  toggleStatus() {
    const currentState = this.element.getAttribute('aria-checked') === 'true'
    const newState = String(!currentState)

    this.element.setAttribute('aria-checked', newState)
  }
}

// Initialize the Switch component on all matching DOM nodes
Array.from(document.querySelectorAll('[role^=switch]'))
    .forEach(element => new Switch(element))
