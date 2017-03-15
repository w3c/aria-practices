/**
 * @namespace aria
 */
var aria = aria || {};

/**
 * @constructor
 *
 * @desc
 *  Listbox object representing the state and interactions for a listbox widget
 *
 * @param listboxNode
 *  The DOM node pointing to the listbox
 */
aria.Listbox = function (listboxNode) {
  this.listboxNode = listboxNode;
  this.activeDescendant = this.listboxNode.getAttribute('aria-activedescendant');
  this.multiselectable = this.listboxNode.hasAttribute('aria-multiselectable');
  this.moveUpDownEnabled = false;
  this.siblingList = null;
  this.upButton = null;
  this.downButton = null;
  this.deleteButton = null;

  this.registerEvents();
};

/**
 * @desc
 *  Register events for the listbox interactions
 */
aria.Listbox.prototype.registerEvents = function () {
  this.listboxNode.addEventListener('focus', this.setupFocus.bind(this));
  this.listboxNode.addEventListener('keydown', this.checkKeyPress.bind(this));
  this.listboxNode.addEventListener('click', this.checkClickItem.bind(this));
};

/**
 * @desc
 *  If there is no activeDescendant, focus on the first option
 */
aria.Listbox.prototype.setupFocus = function () {
  if (this.activeDescendant) {
    return;
  }

  this.focusFirstItem();
};

/**
 * @desc
 *  Focus on the first option
 */
aria.Listbox.prototype.focusFirstItem = function () {
  var firstItem;

  firstItem = this.listboxNode.querySelector('[role="option"]');

  if (firstItem) {
    this.focusItem(firstItem);
  }
};

/**
 * @desc
 *  Focus on the last option
 */
aria.Listbox.prototype.focusLastItem = function () {
  var itemList = this.listboxNode.querySelectorAll('[role="option"]');

  if (itemList.length) {
    this.focusItem(itemList[itemList.length - 1]);
  }
};

/**
 * @desc
 *  Handle various keyboard controls; UP/DOWN will shift focus; SPACE selects
 *  an item.
 *
 * @param evt
 *  The keydown event object
 */
aria.Listbox.prototype.checkKeyPress = function (evt) {
  var key = evt.which || evt.keyCode;
  var nextItem = document.getElementById(this.activeDescendant);

  if (!nextItem) {
    return;
  }

  switch (key) {
    case aria.KeyCode.PAGE_UP:
    case aria.KeyCode.PAGE_DOWN:
      if (this.moveUpDownEnabled) {
        evt.preventDefault();

        if (key === aria.KeyCode.PAGE_UP) {
          this.moveUpItems();
        }
        else {
          this.moveDownItems();
        }
      }

      break;
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
    case aria.KeyCode.HOME:
      evt.preventDefault();
      this.focusFirstItem();
      break;
    case aria.KeyCode.END:
      evt.preventDefault();
      this.focusLastItem();
      break;
    case aria.KeyCode.SPACE:
      evt.preventDefault();
      this.toggleSelectItem(nextItem);
      break;
    case aria.KeyCode.BACKSPACE:
    case aria.KeyCode.DELETE:
      evt.preventDefault();

      if (nextItem.nextElementSibling) {
        nextItem = nextItem.nextElementSibling;
      }
      else {
        nextItem = nextItem.previousElementSibling;
      }

      this.shiftItems();

      if (!this.activeDescendant && nextItem) {
        this.focusItem(nextItem);
      }
      break;
  }
};

/**
 * @desc
 *  Check if an item is clicked on. If so, focus on it and select it.
 *
 * @param evt
 *  The click event object
 */
aria.Listbox.prototype.checkClickItem = function (evt) {
  if (evt.target.getAttribute('role') === 'option') {
    this.focusItem(evt.target);
    this.toggleSelectItem(evt.target);
  }
};

/**
 * @desc
 *  Toggle the aria-selected value
 *
 * @param element
 *  The element to select
 */
aria.Listbox.prototype.toggleSelectItem = function (element) {
  if (this.multiselectable) {
    element.setAttribute(
      'aria-selected',
      element.getAttribute('aria-selected') === 'true' ? 'false' : 'true'
    );

    if (this.deleteButton) {
      if (this.listboxNode.querySelector('[aria-selected="true"]')) {
        this.deleteButton.setAttribute('aria-disabled', 'false');
      }
      else {
        this.deleteButton.setAttribute('aria-disabled', 'true');
      }
    }
  }
};

/**
 * @desc
 *  Defocus the specified item
 *
 * @param element
 *  The element to defocus
 */
aria.Listbox.prototype.defocusItem = function (element) {
  if (!element) {
    return;
  }

  aria.Utils.removeClass(element, 'focused');
};

/**
 * @desc
 *  Focus on the specified item
 *
 * @param element
 *  The element to focus
 */
aria.Listbox.prototype.focusItem = function (element) {
  this.defocusItem(document.getElementById(this.activeDescendant));
  aria.Utils.addClass(element, 'focused');
  this.listboxNode.setAttribute('aria-activedescendant', element.id);
  this.activeDescendant = element.id;

  if (this.listboxNode.scrollHeight > this.listboxNode.clientHeight) {
    var scrollBottom = this.listboxNode.clientHeight + this.listboxNode.scrollTop;
    var elementBottom = element.offsetTop + element.offsetHeight;
    if (elementBottom > scrollBottom) {
      this.listboxNode.scrollTop = elementBottom - this.listboxNode.clientHeight;
    }
    else if (element.offsetTop < this.listboxNode.scrollTop) {
      this.listboxNode.scrollTop = element.offsetTop;
    }
  }

  if (!this.multiselectable && this.deleteButton) {
    this.deleteButton.setAttribute('aria-disabled', false);
  }

  this.checkUpDownButtons();
};

/**
 * @desc
 *  Enable/disable the up/down arrows based on the activeDescendant.
 */
aria.Listbox.prototype.checkUpDownButtons = function () {
  var activeElement = document.getElementById(this.activeDescendant);

  if (!this.moveUpDownEnabled) {
    return false;
  }

  if (!activeElement) {
    this.upButton.setAttribute('aria-disabled', 'true');
    this.downButton.setAttribute('aria-disabled', 'true');
    return;
  }

  if (this.upButton) {
    if (activeElement.previousElementSibling) {
      this.upButton.setAttribute('aria-disabled', false);
    }
    else {
      this.upButton.setAttribute('aria-disabled', 'true');
    }
  }

  if (this.downButton) {
    if (activeElement.nextElementSibling) {
      this.downButton.setAttribute('aria-disabled', false);
    }
    else {
      this.downButton.setAttribute('aria-disabled', 'true');
    }
  }
};

/**
 * @desc
 *  Add the specified items to the listbox. Assumes items are valid options.
 *
 * @param items
 *  An array of items to add to the listbox
 */
aria.Listbox.prototype.addItems = function (items) {
  if (!items || !items.length) {
    return false;
  }

  items.forEach((function (item) {
    this.defocusItem(item);
    this.toggleSelectItem(item);
    this.listboxNode.append(item);
  }).bind(this));

  if (!this.activeDescendant) {
    this.focusItem(items[0]);
  }
};

/**
 * @desc
 *  Remove all of the selected items from the listbox; Removes the focused items
 *  in a single select listbox and the items with aria-selected in a multi
 *  select listbox.
 *
 * @returns items
 *  An array of items that were removed from the listbox
 */
aria.Listbox.prototype.deleteItems = function () {
  var itemsToDelete;

  if (this.multiselectable) {
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
      this.clearActiveDescendant();
    }
  }).bind(this));

  return itemsToDelete;
};

aria.Listbox.prototype.clearActiveDescendant = function () {
  this.activeDescendant = null;
  this.listboxNode.setAttribute('aria-activedescendant', null);

  if (this.deleteButton) {
    this.deleteButton.setAttribute('aria-disabled', 'true');
  }

  this.checkUpDownButtons();
};

/**
 * @desc
 *  Shifts the currently focused item up on the list. No shifting occurs if the
 *  item is already at the top of the list.
 */
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

  this.checkUpDownButtons();
};

/**
 * @desc
 *  Shifts the currently focused item down on the list. No shifting occurs if
 *  the item is already at the end of the list.
 */
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

  this.checkUpDownButtons();
};

/**
 * @desc
 *  Delete the currently selected items and add them to the sibling list.
 */
aria.Listbox.prototype.shiftItems = function () {
  if (!this.siblingList) {
    return;
  }

  var itemsToMove = this.deleteItems();
  this.siblingList.addItems(itemsToMove);
};

/**
 * @desc
 *  Enable Up/Down controls to shift items up and down.
 *
 * @param upButton
 *   Up button to trigger up shift
 *
 * @param downButton
 *   Down button to trigger down shift
 */
aria.Listbox.prototype.enableMoveUpDown = function (upButton, downButton) {
  this.moveUpDownEnabled = true;
  this.upButton = upButton;
  this.downButton = downButton;
  upButton.addEventListener('click', this.moveUpItems.bind(this));
  downButton.addEventListener('click', this.moveDownItems.bind(this));
};

/**
 * @desc
 *  Enable Delete controls. Deleting removes selected items from the current
 *  list and adds them to the sibling list.
 *
 * @param button
 *   Delete button to trigger delete
 *
 * @param siblingList
 *   Listbox to add deleted items to
 */
aria.Listbox.prototype.setupDelete = function (button, siblingList) {
  this.siblingList = siblingList;
  this.deleteButton = button;
  button.addEventListener('click', this.shiftItems.bind(this));
};
