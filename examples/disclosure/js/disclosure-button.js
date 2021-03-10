/*
 *   This content is licensed according to the W3C Software License at
 *   https://www.w3.org/Consortium/Legal/2015/copyright-software-and-document
 *
 *   File:   disclosure-button.js
 *
 *   Desc:   Disclosure button widget that implements ARIA Authoring Best Practices
 */

'use strict';

/*
 *   @constructorDisclosureButton
 *
 *
 */
class DisclosureButton {
  constructor(domNode) {
    this.domNode = domNode;
    this.controlledNode = false;

    var id = this.domNode.getAttribute('aria-controls');

    if (id) {
      this.controlledNode = document.getElementById(id);
    }

    this.domNode.setAttribute('aria-expanded', 'false');
    this.hideContent();

    this.domNode.addEventListener('keydown', this.onKeydown.bind(this));
    this.domNode.addEventListener('click', this.onClick.bind(this));
    this.domNode.addEventListener('focus', this.onFocus.bind(this));
    this.domNode.addEventListener('blur', this.onBlur.bind(this));
  }

  showContent() {
    if (this.controlledNode) {
      this.controlledNode.style.display = 'block';
    }
  }

  hideContent() {
    if (this.controlledNode) {
      this.controlledNode.style.display = 'none';
    }
  }

  toggleExpand() {
    if (this.domNode.getAttribute('aria-expanded') === 'true') {
      this.domNode.setAttribute('aria-expanded', 'false');
      this.hideContent();
    } else {
      this.domNode.setAttribute('aria-expanded', 'true');
      this.showContent();
    }
  }

/* EVENT HANDLERS */

  onKeydown(event) {
    switch (event.keyCode) {
      case this.keyCode.RETURN:
        this.toggleExpand();

        event.stopPropagation();
        event.preventDefault();
        break;

      default:
        break;
    }
  }

  onClick() {
    this.toggleExpand();
  }

  onFocus() {
    this.domNode.classList.add('focus');
  }

  onBlur() {
    this.domNode.classList.remove('focus');
  }
}

/* Initialize Hide/Show Buttons */

window.addEventListener(
  'load',
  function () {
    var buttons = document.querySelectorAll(
      'button[aria-expanded][aria-controls]'
    );

    for (var i = 0; i < buttons.length; i++) {
      new DisclosureButton(buttons[i]);
    }
  },
  false
);
