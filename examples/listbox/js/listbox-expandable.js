/**
 * ARIA Expandable Dropdown Listbox Example
 * @function onload
 * @desc Initialize the listbox example once the page has loaded
 */

window.addEventListener('load', function () {
  var button = document.getElementById('exp_button');
  var exListbox = new aria.Listbox(document.getElementById('exp_elem_list'));
  var listboxButton = new aria.ListboxButton(button, exListbox);
});

var aria = aria || {};

aria.ListboxButton = function (button, listbox) {
  this.button = button;
  this.listbox = listbox;
  this.registerEvents();
};

aria.ListboxButton.prototype.registerEvents = function () {
  this.button.addEventListener('click', this.showListbox.bind(this));
  this.button.addEventListener('keyup', this.checkShow.bind(this));
  this.listbox.listboxNode.addEventListener('blur', this.hideListbox.bind(this));
  this.listbox.listboxNode.addEventListener('keyup', this.checkHide.bind(this));
  this.listbox.setHandleFocusChange(this.onFocusChange.bind(this));
};

aria.ListboxButton.prototype.checkShow = function (evt) {
  var key = evt.which || evt.keyCode;

  switch (key) {
    case aria.KeyCode.UP:
    case aria.KeyCode.DOWN:
      evt.preventDefault();
      this.showListbox();
      this.listbox.checkKeyPress(evt);
      break;
  }
};

aria.ListboxButton.prototype.checkHide = function (evt) {
  var key = evt.which || evt.keyCode;

  switch (key) {
    case aria.KeyCode.ESC:
      evt.preventDefault();
      this.hideListbox();
      this.button.focus();
      break;
  }
};

aria.ListboxButton.prototype.showListbox = function () {
  aria.Utils.removeClass(this.listbox.listboxNode, 'hidden');
  this.listbox.listboxNode.focus();
};

aria.ListboxButton.prototype.hideListbox = function () {
  aria.Utils.addClass(this.listbox.listboxNode, 'hidden');
};

aria.ListboxButton.prototype.onFocusChange = function (focusedItem) {
  this.button.innerText = focusedItem.innerText;
};
