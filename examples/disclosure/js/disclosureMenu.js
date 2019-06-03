/*
*   This content is licensed according to the W3C Software License at
*   https://www.w3.org/Consortium/Legal/2015/copyright-software-and-document
*
*   Supplemental JS for the disclosure menu keyboard behavior
*/


var DisclosureMenu = function(domNode) {
  this.rootNode = domNode;
  this.triggerNodes = [];
  this.controlledNodes = [];
  this.openIndex = null;
}

DisclosureMenu.prototype.init = function() {
  const buttons = this.rootNode.querySelectorAll('button[aria-expanded][aria-controls]');
  for (var i = 0; i < buttons.length; i++) {
    const button = buttons[i];
    const menu = button.parentNode.querySelector('ul');
    if (menu) {
      // save ref to button and controlled menu
      this.triggerNodes.push(button);
      this.controlledNodes.push(menu);

      // collapse menus
      button.setAttribute('aria-expanded', 'false');
      this.toggleMenu(menu, false);

      // attach event listeners
      menu.addEventListener('keydown', this.handleMenuKeyDown.bind(this));
      button.addEventListener('click', this.handleButtonClick.bind(this));
      button.addEventListener('keydown', this.handleButtonKeyDown.bind(this));
    }
  }

  this.rootNode.addEventListener('focusout', this.handleBlur.bind(this));
}

DisclosureMenu.prototype.toggleMenu = function(domNode, show) {
  if (domNode) {
    domNode.style.display = show ? 'block' : 'none';
  }
}

DisclosureMenu.prototype.toggleExpand = function(index, expanded) {
  // close open menu, if applicable
  if (this.openIndex !== index) {
    this.toggleExpand(this.openIndex, false);
  }

  // handle menu at called index
  if (this.triggerNodes[index]) {
    this.openIndex = expanded ? index : null;
    this.triggerNodes[index].setAttribute('aria-expanded', expanded);
    this.toggleMenu(this.controlledNodes[index], expanded);
  }
}

/* Event Handlers */
DisclosureMenu.prototype.handleBlur = function(event) {
  const menuContainsFocus = this.rootNode.contains(event.relatedTarget);
  if (!menuContainsFocus && this.openIndex !== null) {
    this.toggleExpand(this.openIndex, false);
  }
}

DisclosureMenu.prototype.handleButtonKeyDown = function(event) {
  switch (event.key) {
    case 'Escape':
      if (this.openIndex !== null) {
        this.toggleExpand(this.openIndex, false);
      }
      break;
    case 'ArrowUp':
    case 'ArrowLeft':
      event.preventDefault();
      const activeIndex = this.triggerNodes.indexOf(document.activeElement);
      if (activeIndex > -1) {
        const prevIndex = Math.max(0, activeIndex - 1);
        this.triggerNodes[prevIndex].focus();
      }
      break;
    case 'ArrowDown':
    case 'ArrowRight':
      event.preventDefault();
      const activeButtonIndex = this.triggerNodes.indexOf(document.activeElement);
      if (activeButtonIndex > -1) {
        const nextIndex = Math.min(this.triggerNodes.length - 1, activeButtonIndex + 1);
        this.triggerNodes[nextIndex].focus();
      }
      break;
    case 'Home':
      event.preventDefault();
      this.triggerNodes[0].focus();
      break;
    case 'End':
      event.preventDefault();
      this.triggerNodes[this.triggerNodes.length - 1].focus();
      break;
  }
}

DisclosureMenu.prototype.handleButtonClick = function(event) {
  const button = event.target;
  const buttonIndex = this.triggerNodes.indexOf(button);
  const buttonExpanded = button.getAttribute('aria-expanded') === 'true';
  this.toggleExpand(buttonIndex, !buttonExpanded);
}

DisclosureMenu.prototype.handleMenuKeyDown = function(event) {
  if (event.key === 'Escape' && this.openIndex !== null) {
    this.triggerNodes[this.openIndex].focus();
    this.toggleExpand(this.openIndex, false);
  }
}

/* Initialize Disclosure Menus */

window.addEventListener('load', function (event) {
  var menus =  document.querySelectorAll('.disclosure-nav');

  for (var i = 0; i < menus.length; i++) {
    var menu = new DisclosureMenu(menus[i]);
    menu.init();
  }
}, false);