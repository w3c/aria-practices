/**
 * Rename this file to the name of the example, e.g., checkbox.js.
 */

var aria = aria || {};

aria.Toolbar = function (toolbarNode) {
  this.toolbarNode = toolbarNode;
  this.items = this.toolbarNode.querySelectorAll('.toolbar-item');
  this.selectedItem = this.toolbarNode.querySelector('.selected');
  this.registerEvents();
};

aria.Toolbar.prototype.registerEvents = function () {
  this.toolbarNode.addEventListener('keydown', this.checkFocusChange.bind(this));
  this.toolbarNode.addEventListener('click', this.checkClickItem.bind(this));
};

aria.Toolbar.prototype.checkFocusChange = function (evt) {
  var key = evt.which || evt.keyCode;
  var nextIndex, nextItem;

  switch (key) {
    case aria.KeyCode.LEFT:
    case aria.KeyCode.RIGHT:
      nextIndex = Array.prototype.indexOf.call(this.items, this.selectedItem);
      nextIndex = key === aria.KeyCode.LEFT ? nextIndex - 1 : nextIndex + 1;
      nextIndex = Math.max(Math.min(nextIndex, this.items.length - 1), 0);

      nextItem = this.items[nextIndex];
      this.selectItem(nextItem);
      this.focusItem(nextItem);
      break;
    case aria.KeyCode.DOWN:
      // if selected item is menu button, pressing DOWN should act like a click
      if (aria.Utils.hasClass(this.selectedItem, 'menu-button')) {
        evt.preventDefault();
        this.selectedItem.click();
      }
      break;
  }
};

aria.Toolbar.prototype.checkClickItem = function (evt) {
  if (aria.Utils.hasClass(evt.target, 'toolbar-item')) {
    this.selectItem(evt.target);
  }
};

aria.Toolbar.prototype.deselectItem = function (element) {
  aria.Utils.removeClass(element, 'selected');
  element.setAttribute('aria-selected', 'false');
  element.setAttribute('tabindex', '-1');
};

aria.Toolbar.prototype.selectItem = function (element) {
  this.deselectItem(this.selectedItem);
  aria.Utils.addClass(element, 'selected');
  element.setAttribute('aria-selected', 'true');
  element.setAttribute('tabindex', '0');
  this.selectedItem = element;
};

aria.Toolbar.prototype.focusItem = function (element) {
  element.focus();
};
