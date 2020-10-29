/*
 *   This content is licensed according to the W3C Software License at
 *   https://www.w3.org/Consortium/Legal/2015/copyright-software-and-document
 */

'use strict';

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
  this.activeDescendant = this.listboxNode.getAttribute(
    'aria-activedescendant'
  );
  this.multiselectable = this.listboxNode.hasAttribute('aria-multiselectable');
  this.moveUpDownEnabled = false;
  this.siblingList = null;
  this.startRangeIndex = 0;
  this.upButton = null;
  this.downButton = null;
  this.moveButton = null;
  this.keysSoFar = '';
  this.handleFocusChange = function () {};
  this.handleItemChange = function (event, items) {};
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

  if (this.multiselectable) {
    this.listboxNode.addEventListener(
      'mousedown',
      this.checkMouseDown.bind(this)
    );
  }
};

/**
 * @desc
 *  If there is no activeDescendant, focus on the first option
 */
aria.Listbox.prototype.setupFocus = function () {
  if (this.activeDescendant) {
    return;
  }
};

/**
 * @desc
 *  Focus on the first option
 */
aria.Listbox.prototype.focusFirstItem = function () {
  var firstItem = this.listboxNode.querySelector('[role="option"]');

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
  var lastActiveId = this.activeDescendant;
  var allOptions = this.listboxNode.querySelectorAll('[role="option"]');
  var currentItem =
    document.getElementById(this.activeDescendant) || allOptions[0];
  var nextItem = currentItem;

  if (!currentItem) {
    return;
  }

  switch (key) {
    case aria.KeyCode.PAGE_UP:
    case aria.KeyCode.PAGE_DOWN:
      if (this.moveUpDownEnabled) {
        evt.preventDefault();

        if (key === aria.KeyCode.PAGE_UP) {
          this.moveUpItems();
        } else {
          this.moveDownItems();
        }
      }

      break;
    case aria.KeyCode.UP:
    case aria.KeyCode.DOWN:
      if (!this.activeDescendant) {
        // focus first option if no option was previously focused, and perform no other actions
        this.focusItem(currentItem);
        break;
      }

      if (this.moveUpDownEnabled && evt.altKey) {
        evt.preventDefault();
        if (key === aria.KeyCode.UP) {
          this.moveUpItems();
        } else {
          this.moveDownItems();
        }
        return;
      }

      if (key === aria.KeyCode.UP) {
        nextItem = this.findPreviousOption(currentItem);
      } else {
        nextItem = this.findNextOption(currentItem);
      }

      if (nextItem && this.multiselectable && event.shiftKey) {
        this.selectRange(this.startRangeIndex, nextItem);
      }

      if (nextItem) {
        this.focusItem(nextItem);
        evt.preventDefault();
      }

      break;
    case aria.KeyCode.HOME:
      evt.preventDefault();
      this.focusFirstItem();

      if (this.multiselectable && evt.shiftKey && evt.ctrlKey) {
        this.selectRange(this.startRangeIndex, 0);
      }
      break;
    case aria.KeyCode.END:
      evt.preventDefault();
      this.focusLastItem();

      if (this.multiselectable && evt.shiftKey && evt.ctrlKey) {
        var startItem = allOptions[this.startRangeIndex];
        this.selectRange(this.startRangeIndex, allOptions.length - 1);
      }
      break;
    case aria.KeyCode.SHIFT:
      this.startRangeIndex = this.getElementIndex(currentItem, allOptions);
      break;
    case aria.KeyCode.SPACE:
      evt.preventDefault();
      this.toggleSelectItem(nextItem);
      break;
    case aria.KeyCode.BACKSPACE:
    case aria.KeyCode.DELETE:
    case aria.KeyCode.RETURN:
      if (!this.moveButton) {
        return;
      }

      var keyshortcuts = this.moveButton.getAttribute('aria-keyshortcuts');
      if (key === aria.KeyCode.RETURN && keyshortcuts.indexOf('Enter') === -1) {
        return;
      }
      if (
        (key === aria.KeyCode.BACKSPACE || key === aria.KeyCode.DELETE) &&
        keyshortcuts.indexOf('Delete') === -1
      ) {
        return;
      }

      evt.preventDefault();

      var nextUnselected = nextItem.nextElementSibling;
      while (nextUnselected) {
        if (nextUnselected.getAttribute('aria-selected') != 'true') {
          break;
        }
        nextUnselected = nextUnselected.nextElementSibling;
      }
      if (!nextUnselected) {
        nextUnselected = nextItem.previousElementSibling;
        while (nextUnselected) {
          if (nextUnselected.getAttribute('aria-selected') != 'true') {
            break;
          }
          nextUnselected = nextUnselected.previousElementSibling;
        }
      }

      this.moveItems();

      if (!this.activeDescendant && nextUnselected) {
        this.focusItem(nextUnselected);
      }
      break;
    case 65:
      // handle control + A
      if (this.multiselectable && (evt.ctrlKey || evt.metaKey)) {
        evt.preventDefault();
        this.selectRange(0, allOptions.length - 1);
        break;
      }
    // fall through
    default:
      var itemToFocus = this.findItemToFocus(key);
      if (itemToFocus) {
        this.focusItem(itemToFocus);
      }
      break;
  }

  if (this.activeDescendant !== lastActiveId) {
    this.updateScroll();
  }
};

aria.Listbox.prototype.findItemToFocus = function (key) {
  var itemList = this.listboxNode.querySelectorAll('[role="option"]');
  var character = String.fromCharCode(key);
  var searchIndex = 0;

  if (!this.keysSoFar) {
    for (var i = 0; i < itemList.length; i++) {
      if (itemList[i].getAttribute('id') == this.activeDescendant) {
        searchIndex = i;
      }
    }
  }
  this.keysSoFar += character;
  this.clearKeysSoFarAfterDelay();

  var nextMatch = this.findMatchInRange(
    itemList,
    searchIndex + 1,
    itemList.length
  );
  if (!nextMatch) {
    nextMatch = this.findMatchInRange(itemList, 0, searchIndex);
  }
  return nextMatch;
};

/* Return the index of the passed element within the passed array, or null if not found */
aria.Listbox.prototype.getElementIndex = function (option, options) {
  var allOptions = Array.prototype.slice.call(options); // convert to array
  var optionIndex = allOptions.indexOf(option);

  return typeof optionIndex === 'number' ? optionIndex : null;
};

/* Return the next listbox option, if it exists; otherwise, returns null */
aria.Listbox.prototype.findNextOption = function (currentOption) {
  var allOptions = Array.prototype.slice.call(
    this.listboxNode.querySelectorAll('[role="option"]')
  ); // get options array
  var currentOptionIndex = allOptions.indexOf(currentOption);
  var nextOption = null;

  if (currentOptionIndex > -1 && currentOptionIndex < allOptions.length - 1) {
    nextOption = allOptions[currentOptionIndex + 1];
  }

  return nextOption;
};

/* Return the previous listbox option, if it exists; otherwise, returns null */
aria.Listbox.prototype.findPreviousOption = function (currentOption) {
  var allOptions = Array.prototype.slice.call(
    this.listboxNode.querySelectorAll('[role="option"]')
  ); // get options array
  var currentOptionIndex = allOptions.indexOf(currentOption);
  var previousOption = null;

  if (currentOptionIndex > -1 && currentOptionIndex > 0) {
    previousOption = allOptions[currentOptionIndex - 1];
  }

  return previousOption;
};

aria.Listbox.prototype.clearKeysSoFarAfterDelay = function () {
  if (this.keyClear) {
    clearTimeout(this.keyClear);
    this.keyClear = null;
  }
  this.keyClear = setTimeout(
    function () {
      this.keysSoFar = '';
      this.keyClear = null;
    }.bind(this),
    500
  );
};

aria.Listbox.prototype.findMatchInRange = function (
  list,
  startIndex,
  endIndex
) {
  // Find the first item starting with the keysSoFar substring, searching in
  // the specified range of items
  for (var n = startIndex; n < endIndex; n++) {
    var label = list[n].innerText;
    if (label && label.toUpperCase().indexOf(this.keysSoFar) === 0) {
      return list[n];
    }
  }
  return null;
};

/**
 * @desc
 *  Check if an item is clicked on. If so, focus on it and select it.
 *
 * @param evt
 *  The click event object
 */
aria.Listbox.prototype.checkClickItem = function (evt) {
  if (evt.target.getAttribute('role') !== 'option') {
    return;
  }

  this.focusItem(evt.target);
  this.toggleSelectItem(evt.target);
  this.updateScroll();

  if (this.multiselectable && evt.shiftKey) {
    this.selectRange(this.startRangeIndex, evt.target);
  }
};

/**
 * Prevent text selection on shift + click for multiselect listboxes
 */
aria.Listbox.prototype.checkMouseDown = function (evt) {
  if (
    this.multiselectable &&
    evt.shiftKey &&
    evt.target.getAttribute('role') === 'option'
  ) {
    evt.preventDefault();
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

    this.updateMoveButton();
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
  if (!this.multiselectable) {
    element.removeAttribute('aria-selected');
  }
  element.classList.remove('focused');
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
  if (!this.multiselectable) {
    element.setAttribute('aria-selected', 'true');
  }
  element.classList.add('focused');
  this.listboxNode.setAttribute('aria-activedescendant', element.id);
  this.activeDescendant = element.id;

  if (!this.multiselectable) {
    this.updateMoveButton();
  }

  this.checkUpDownButtons();
  this.handleFocusChange(element);
};

/**
 * Helper function to check if a number is within a range; no side effects.
 */
aria.Listbox.prototype.checkInRange = function (index, start, end) {
  var rangeStart = start < end ? start : end;
  var rangeEnd = start < end ? end : start;

  return index >= rangeStart && index <= rangeEnd;
};

/**
 * Select a range of options
 */
aria.Listbox.prototype.selectRange = function (start, end) {
  // get start/end indices
  var allOptions = this.listboxNode.querySelectorAll('[role="option"]');
  var startIndex =
    typeof start === 'number' ? start : this.getElementIndex(start, allOptions);
  var endIndex =
    typeof end === 'number' ? end : this.getElementIndex(end, allOptions);

  for (var index = 0; index < allOptions.length; index++) {
    var selected = this.checkInRange(index, startIndex, endIndex);
    allOptions[index].setAttribute('aria-selected', selected + '');
  }

  this.updateMoveButton();
};

/**
 * Check for selected options and update moveButton, if applicable
 */
aria.Listbox.prototype.updateMoveButton = function () {
  if (!this.moveButton) {
    return;
  }

  if (this.listboxNode.querySelector('[aria-selected="true"]')) {
    this.moveButton.setAttribute('aria-disabled', 'false');
  } else {
    this.moveButton.setAttribute('aria-disabled', 'true');
  }
};

/**
 * Check if the selected option is in view, and scroll if not
 */
aria.Listbox.prototype.updateScroll = function () {
  var selectedOption = document.getElementById(this.activeDescendant);
  if (
    selectedOption &&
    this.listboxNode.scrollHeight > this.listboxNode.clientHeight
  ) {
    var scrollBottom =
      this.listboxNode.clientHeight + this.listboxNode.scrollTop;
    var elementBottom = selectedOption.offsetTop + selectedOption.offsetHeight;
    if (elementBottom > scrollBottom) {
      this.listboxNode.scrollTop =
        elementBottom - this.listboxNode.clientHeight;
    } else if (selectedOption.offsetTop < this.listboxNode.scrollTop) {
      this.listboxNode.scrollTop = selectedOption.offsetTop;
    }
  }
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
    } else {
      this.upButton.setAttribute('aria-disabled', 'true');
    }
  }

  if (this.downButton) {
    if (activeElement.nextElementSibling) {
      this.downButton.setAttribute('aria-disabled', false);
    } else {
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

  items.forEach(
    function (item) {
      this.defocusItem(item);
      this.toggleSelectItem(item);
      this.listboxNode.append(item);
    }.bind(this)
  );

  if (!this.activeDescendant) {
    this.focusItem(items[0]);
  }

  this.handleItemChange('added', items);
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
  } else if (this.activeDescendant) {
    itemsToDelete = [document.getElementById(this.activeDescendant)];
  }

  if (!itemsToDelete || !itemsToDelete.length) {
    return [];
  }

  itemsToDelete.forEach(
    function (item) {
      item.remove();

      if (item.id === this.activeDescendant) {
        this.clearActiveDescendant();
      }
    }.bind(this)
  );

  this.handleItemChange('removed', itemsToDelete);

  return itemsToDelete;
};

aria.Listbox.prototype.clearActiveDescendant = function () {
  this.activeDescendant = null;
  this.listboxNode.setAttribute('aria-activedescendant', null);

  this.updateMoveButton();
  this.checkUpDownButtons();
};

/**
 * @desc
 *  Shifts the currently focused item up on the list. No shifting occurs if the
 *  item is already at the top of the list.
 */
aria.Listbox.prototype.moveUpItems = function () {
  if (!this.activeDescendant) {
    return;
  }

  var currentItem = document.getElementById(this.activeDescendant);
  var previousItem = currentItem.previousElementSibling;

  if (previousItem) {
    this.listboxNode.insertBefore(currentItem, previousItem);
    this.handleItemChange('moved_up', [currentItem]);
  }

  this.checkUpDownButtons();
};

/**
 * @desc
 *  Shifts the currently focused item down on the list. No shifting occurs if
 *  the item is already at the end of the list.
 */
aria.Listbox.prototype.moveDownItems = function () {
  if (!this.activeDescendant) {
    return;
  }

  var currentItem = document.getElementById(this.activeDescendant);
  var nextItem = currentItem.nextElementSibling;

  if (nextItem) {
    this.listboxNode.insertBefore(nextItem, currentItem);
    this.handleItemChange('moved_down', [currentItem]);
  }

  this.checkUpDownButtons();
};

/**
 * @desc
 *  Delete the currently selected items and add them to the sibling list.
 */
aria.Listbox.prototype.moveItems = function () {
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
 *  Enable Move controls. Moving removes selected items from the current
 *  list and adds them to the sibling list.
 *
 * @param button
 *   Move button to trigger delete
 *
 * @param siblingList
 *   Listbox to move items to
 */
aria.Listbox.prototype.setupMove = function (button, siblingList) {
  this.siblingList = siblingList;
  this.moveButton = button;
  button.addEventListener('click', this.moveItems.bind(this));
};

aria.Listbox.prototype.setHandleItemChange = function (handlerFn) {
  this.handleItemChange = handlerFn;
};

aria.Listbox.prototype.setHandleFocusChange = function (focusChangeHandler) {
  this.handleFocusChange = focusChangeHandler;
};
