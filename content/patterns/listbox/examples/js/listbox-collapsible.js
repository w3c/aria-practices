/*
 *   This content is licensed according to the W3C Software License at
 *   https://www.w3.org/Consortium/Legal/2015/copyright-software-and-document
 */

'use strict';

/**
 * ARIA Collapsible Dropdown Listbox Example
 *
 * @function onload
 * @description Initialize the listbox example once the page has loaded
 */

window.addEventListener('load', function () {
  const button = document.getElementById('exp_button');
  const exListbox = new Listbox(document.getElementById('exp_elem_list'));
  new ListboxButton(button, exListbox); /* eslint  no-undef: off */
});

class ListboxButton {
  constructor(button, listbox) {
    this.button = button;
    this.listbox = listbox;
    this.registerEvents();
  }

  registerEvents() {
    this.button.addEventListener('click', this.showListbox.bind(this));
    this.button.addEventListener('keyup', this.checkShow.bind(this));
    this.listbox.listboxNode.addEventListener(
      'blur',
      this.hideListbox.bind(this)
    );
    this.listbox.listboxNode.addEventListener(
      'keydown',
      this.checkHide.bind(this)
    );
    this.listbox.setHandleFocusChange(this.onFocusChange.bind(this));
  }

  checkShow(evt) {
    switch (evt.key) {
      case 'ArrowUp':
      case 'ArrowDown':
        evt.preventDefault();
        this.showListbox();
        this.listbox.checkKeyPress(evt);
        break;
    }
  }

  checkHide(evt) {
    switch (evt.key) {
      case 'Enter':
      case 'Escape':
        evt.preventDefault();
        this.hideListbox();
        this.button.focus();
        break;
    }
  }

  showListbox() {
    this.listbox.listboxNode.classList.remove('hidden');
    this.button.setAttribute('aria-expanded', 'true');
    this.listbox.listboxNode.focus();
  }

  hideListbox() {
    this.listbox.listboxNode.classList.add('hidden');
    this.button.removeAttribute('aria-expanded');
  }

  onFocusChange(focusedItem) {
    this.button.innerText = focusedItem.innerText;
  }
}
