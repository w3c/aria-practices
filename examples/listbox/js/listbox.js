/**
 * Rename this file to the name of the example, e.g., checkbox.js.
 */

var aria = aria || {};

aria.Listbox = function (listboxNode) {
  this.listboxNode = listboxNode;
  this.activeDescendant = this.listboxNode.getAttribute('aria-activedescendant');

  this.registerEvents();
};

aria.Listbox.prototype.registerEvents = function () {
  this.listboxNode.addEventListener('focus', this.setupFocus.bind(this));
  this.listboxNode.addEventListener('keydown', this.checkFocusChange.bind(this));
  this.listboxNode.addEventListener('click', this.checkClickItem.bind(this));
};

aria.Listbox.prototype.setupFocus = function () {
  var firstItem;

  if (this.activeDescendant) {
    return;
  }

  firstItem = this.listboxNode.querySelector('[role="option"]');

  if (firstItem) {
    this.focusItem(firstItem);
  }
};

aria.Listbox.prototype.checkFocusChange = function (evt) {
  var key = evt.which || evt.keyCode;
  var nextItem = document.getElementById(this.activeDescendant);

  if (!nextItem) {
    return;
  }

  switch (key) {
    case aria.KeyCode.UP:
    case aria.KeyCode.DOWN:
      evt.preventDefault();

      if (key === aria.KeyCode.UP) {
        nextItem = nextItem.previousElementSibling;
      }
      else {
        nextItem = nextItem.nextElementSibling;
      }

      if (nextItem) {
        this.focusItem(nextItem);
      }
      break;
    case aria.KeyCode.SPACE:
      evt.preventDefault();
      this.selectItem(nextItem);
      break;
  }
};

aria.Listbox.prototype.checkClickItem = function (evt) {
  if (evt.target.getAttribute('role') === 'option') {
    this.focusItem(evt.target);
    this.selectItem(evt.target);
  }
};

aria.Listbox.prototype.selectItem = function (element) {
  if (element.hasAttribute('aria-selected')) {
    element.setAttribute(
      'aria-selected',
      element.getAttribute('aria-selected') === 'false' ? 'true' : 'false'
    );
  }
};

aria.Listbox.prototype.defocusItem = function (element) {
  if (!element) {
    return;
  }

  aria.Utils.removeClass(element, 'focused');
};

aria.Listbox.prototype.focusItem = function (element) {
  this.defocusItem(document.getElementById(this.activeDescendant));
  aria.Utils.addClass(element, 'focused');
  this.listboxNode.setAttribute('aria-activedescendant', element.id);
  this.activeDescendant = element.id;
};

aria.Listbox.prototype.addItems = function (items) {
  if (!items || !items.length) {
    return false;
  }

  items.forEach((function (item) {
    this.defocusItem(item);
    this.listboxNode.append(item);
  }).bind(this));

  if (!this.activeDescendant) {
    this.focusItem(items[0]);
  }
};

aria.Listbox.prototype.deleteItems = function () {
  var itemsToDelete;

  if (this.listboxNode.getAttribute('aria-multiselectable')) {
    itemsToDelete = this.listboxNode.querySelectorAll('[aria-selected="true"]');
  }
  else if (this.activeDescendant) {
    itemsToDelete = [document.getElementById(this.activeDescendant)];
  }

  if (!itemsToDelete || !itemsToDelete.length) {
    return [];
  }

  itemsToDelete.forEach((function (item) {
    item.remove();

    if (item.id === this.activeDescendant) {
      this.activeDescendant = null;
    }
  }).bind(this));

  return itemsToDelete;
};

aria.Listbox.prototype.moveUpItems = function () {
  var previousItem;

  if (!this.activeDescendant) {
    return;
  }

  currentItem = document.getElementById(this.activeDescendant);
  previousItem = currentItem.previousElementSibling;

  if (previousItem) {
    this.listboxNode.insertBefore(currentItem, previousItem);
  }
};

aria.Listbox.prototype.moveDownItems = function () {
  var nextItem;

  if (!this.activeDescendant) {
    return;
  }

  currentItem = document.getElementById(this.activeDescendant);
  nextItem = currentItem.nextElementSibling;

  if (nextItem) {
    this.listboxNode.insertBefore(nextItem, currentItem);
  }
};
