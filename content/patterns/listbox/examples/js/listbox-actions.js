/*
 *   This content is licensed according to the W3C Software License at
 *   https://www.w3.org/Consortium/Legal/2015/copyright-software-and-document
 */

'use strict';

/**
 * @namespace aria
 * @description
 * The aria namespace is used to support sharing class definitions between example files
 * without causing eslint errors for undefined classes
 */
var aria = aria || {};

/**
 * @class
 * @description
 *  ListboxActions object representing the state and interactions for a listbox with action items widget
 * @param listboxActionsObject
 *  Instantiation of the Listbox
 */

aria.ListboxActions = class ListboxActions {
  constructor(listboxActionsObject) {
    this.listboxActionsNode = listboxActionsObject;
    this.activeDescendant = this.listboxActionsNode.getAttribute(
      'aria-activedescendant'
    );
    this.listboxOptionArray = Array.from(
      this.listboxActionsNode.querySelectorAll('[role="option"]')
    );
    this.listboxItemCurrent = null;
    this.listboxActiveOption = null;
    this.activeDescendant = null;
    this.listboxCurrentItemActionsButtons = [];
    this.listboxCurrentOptionIndex = -1;
    this.listboxItemsWithAriaActionsArray = [];
    this.registerActionsEvents();
  }

  registerActionsEvents() {
    this.listboxActionsNode.addEventListener(
      'keydown',
      this.onCheckKeyPressActions.bind(this)
    );
    this.listboxActionsNode.addEventListener(
      'click',
      this.onSetCurrentActiveOptionForListbox.bind(this)
    );
    let actionButtons = this.listboxActionsNode.querySelectorAll(
      'button:not(.hide-actions-button),.js-favorite'
    );
    for (let i = 0; i < actionButtons.length; i++) {
      actionButtons[i].addEventListener(
        'click',
        this.onCheckClickItemActions.bind(this)
      );
    }
  }
  handleItemChange (event, item) {
    var updateText = '';
    switch (event) {
      case 'removed':
        updateText = 'Deleted ' + item.innerText;
        break;
      case 'moved_up':
      case 'moved_down':
        var pos = Array.prototype.indexOf.call(
          this.listboxActionsNode.children,
          item
        );
        pos++;
        updateText = 'Moved to position ' + pos;
        break;
      case 'favorite':
        updateText = 'Favorited ' + item.innerText;
        break;
      case 'unfavorited':
        updateText = 'Unfavorited ' + item.innerText;
        break;
    }
    if (updateText) {
      var ex1LiveRegion = document.getElementById('ss_live_region');
      ex1LiveRegion.innerHTML = updateText;
    }
  }
  /* Return the next listbox option, if it exists; otherwise, returns null */
  findNextOption(currentOption) {
    const allOptions = Array.prototype.slice.call(
      this.listboxActionsNode.querySelectorAll('[role="option"]')
    ); // get options array
    const currentOptionIndex = allOptions.indexOf(currentOption);
    let nextOption = null;

    if (currentOptionIndex > -1 && currentOptionIndex < allOptions.length - 1) {
      nextOption = allOptions[currentOptionIndex + 1];
    }

    return nextOption;
  }

  /* Return the previous listbox option, if it exists; otherwise, returns null */
  findPreviousOption(currentOption) {
    const allOptions = Array.prototype.slice.call(
      this.listboxActionsNode.querySelectorAll('[role="option"]')
    ); // get options array
    const currentOptionIndex = allOptions.indexOf(currentOption);
    let previousOption = null;

    if (currentOptionIndex > -1 && currentOptionIndex > 0) {
      previousOption = allOptions[currentOptionIndex - 1];
    }

    return previousOption;
  }
  /**
   * @description
   *  Remove all of the selected items from the listbox; Removes the focused items
   *  in a single select listbox and the items with aria-selected in a multi
   *  select listbox.
   * @returns {Array}
   *  An array of items that were removed from the listbox
   */
  deleteItems() {
    let itemToDelete = document.getElementById(this.activeDescendant);

    itemToDelete.remove();

    this.handleItemChange('removed', itemToDelete);
  }
  /**
   * @description
   *  Focus on the specified item
   * @param element
   *  The element to focus
   */
  focusItem(element) {
    element.classList.add('focused');
    this.listboxActionsNode.setAttribute('aria-activedescendant', element.id);
    this.activeDescendant = element.id;
  }
  /**
   * @description
   *  Defocus the specified item
   * @param element
   *  The element to defocus
   */
  defocusItem(element) {
   if (element) {
    element.classList.remove('focused');
   }
  }
  /**
   * @description
   *  Focus on the specified item
   * @param element
   *  The element to focus
   */
  selectItem(element) {
    for (let i = 0;i < this.listboxOptionArray.length;i++) {
      this.deselectItem(this.listboxOptionArray[i]);
      this.defocusItem(this.listboxOptionArray[i]);
    }
    element.setAttribute('aria-selected',true);
    this.focusItem(element);
    this.populateDetails(element);
    this.listboxActionsNode.setAttribute('aria-activedescendant', element.id);
    this.activeDescendant = element.id;
  }
  /**
   * @description
   *  Defocus the specified item
   * @param element
   *  The element to defocus
   */
  deselectItem(element) {
    if (!element) {
      return;
    }
    if (!this.multiselectable) {
      element.removeAttribute('aria-selected');
    }
  }
  /**
   * @description
   *  Enable/disable the up/down arrows based on the activeDescendant.
   */
  checkUpDownButtons() {
    const activeElement = document.getElementById(this.activeDescendant);

    if (!this.moveUpDownEnabled) {
      return;
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
  }
  /**
   * @description
   *  Shifts the currently focused item up on the list. No shifting occurs if the
   *  item is already at the top of the list.
   */
  moveUpItems() {
    if (!this.activeDescendant) {
      return;
    }

    const currentItem = document.getElementById(this.activeDescendant);
    const previousItem = currentItem.previousElementSibling;

    if (previousItem) {
      this.listboxActionsNode.insertBefore(currentItem, previousItem);
      this.handleItemChange('moved_up', currentItem);
    }

    this.checkUpDownButtons();
  }

  /**
   * @description
   *  Shifts the currently focused item down on the list. No shifting occurs if
   *  the item is already at the end of the list.
   */
  moveDownItems() {
    if (!this.activeDescendant) {
      return;
    }

    var currentItem = document.getElementById(this.activeDescendant);
    var nextItem = currentItem.nextElementSibling;

    if (nextItem) {
      this.listboxActionsNode.insertBefore(nextItem, currentItem);
      this.handleItemChange('moved_down', currentItem);
    }

    this.checkUpDownButtons();
  }

  /**
   * @description
   *  Defocus the specified item
   * @param element
   *  The element to defocus
   */
  defocusActionsItem(element) {
    if (!element) {
      return;
    }
    element.classList.remove('focusedActionButton');
  }
  /**
   * @description
   *  set aria-activedescendant attribute
   * @param element
   *  The activedescendant element
   */
  setActiveDescendant(element) {
    if (!element) {
      return;
    }
    this.listboxActionsNode.setAttribute('aria-activedescendant', element.id);
    this.activeDescendant = element.id;
    this.listboxCurrentOptionIndex = this.listboxOptionArray.indexOf(element);
  }
  /**
   * @description
   *  Sets aria-actions on the current option
   * @param item
   * @param actions
   *  The item to update and the action IDREF to update
   */
  setAriaActions(item, actions) {
    if (item) {
      item.setAttribute('aria-actions', actions);
    }
  }
  /**
   * @description
   *  Focus on the specified item
   * @param element
   *  The element to focus
   */
  focusActionsItem(element) {
    element.classList.add('focusedActionButton');
    this.setActiveDescendant(element);
  }
  /**
   * @description
   *  Updates necessary attributes to ensure the up does not appear if an option is the first in the list.
   *  Updates necessary attributes to ensure the down does not appear if an option is the last in the list.
   */
  updateArrowUpDownItems() {
    this.listboxOptionArray = Array.from(
      this.listboxActionsNode.querySelectorAll('[role="option"]')
    );
    for (let i = 0; i < this.listboxOptionArray.length; i++) {
      let option = this.listboxOptionArray[i];
      if (this.listboxOptionArray.indexOf(option) == this.listboxOptionArray.length - 1) {
        option
          .querySelector('.downarrow')
          .classList.remove('focusedActionButton');
        option
          .querySelector('.downarrow')
          .classList.add('hide-actions-button');
      } else if (this.listboxOptionArray.indexOf(option) == 0) {
        option
          .querySelector('.uparrow')
          .classList.remove('focusedActionButton');
        option
          .querySelector('.uparrow')
          .classList.add('hide-actions-button');
      } else {
        option
          .querySelector('.downarrow')
          .classList.remove('hide-actions-button');
        option
          .querySelector('.uparrow')
          .classList.remove('hide-actions-button');
      }
    }
  }
  /**
   * @description
   *  Key press listener
   *  Updates the details panel when listbox selection is made
   * @param currentOption
   */
  populateDetails(currentOption) {
    if (currentOption.role == "option") {
      let detailPanels = document.querySelectorAll('.js-detailPanel');
      for (let i = 0; i < detailPanels.length; i++) {
        if (!detailPanels[i].classList.contains('is-hidden')) {
          detailPanels[i].classList.add('is-hidden');
        }
      }
      let detailPanel = document.querySelector('#' + currentOption.id + '_detail_panel');
      detailPanel.classList.toggle('is-hidden');
    }
  }

  /**
   * @description
   *  Key press listener
   *  Delete, Move or Favorite the currently selected item.
   * @param event
   * @param activeButton
   */
  doActionButtonEvents(event, activeButton) {
    let activeButtonClasslist = Array.from(activeButton.classList);
    let activeOption = activeButton.closest('[role=option]');
    const index = activeButtonClasslist.indexOf('focusedActionButton');
    if (index > -1) {
      activeButtonClasslist.splice(index, 1);
    }
    this.listboxOptionArray = Array.from(
      this.listboxActionsNode.querySelectorAll('[role="option"]')
    );
    let optionIndex = this.listboxOptionArray.findIndex(
      (elem) => elem.id === this.listboxItemCurrent.id
    );
    this.activeDescendant = this.listboxOptionArray[optionIndex].id;

    switch (activeButtonClasslist[0]) {
      case 'delete':
        this.listboxItemCurrent.classList.remove('focused');
        this.deleteItems();
        for (let i = 0; i < this.listboxCurrentItemActionsButtons.length; i++) {
          this.defocusActionsItem(this.listboxCurrentItemActionsButtons[i]);
        }
        for (let i = 0; i < this.listboxItemsWithAriaActionsArray.length; i++) {
          this.setActiveDescendant(
            this.listboxItemsWithAriaActionsArray[i],
            ''
          );
        }
        this.setActiveDescendant(this.listboxItemsWithAriaActionsArray[0]);
        this.updateArrowUpDownItems();
        break;
      case 'js-favorite':
      case 'favorite':
        //If the favorite icon was clicked and is the activeButton instead of the action button,
        //convert the activeButton to the action button and continue processing
        if (activeButton.classList.contains('js-favorite')) {
          activeButton = activeButton.closest('[role="option"]').querySelector('.favorite');
        }
        activeButton.setAttribute(
          'aria-pressed',
          activeButton.ariaPressed && activeButton.ariaPressed == 'true'
            ? 'false'
            : 'true'
        );
        this.handleItemChange(
          activeButton.ariaPressed == 'true' ? 'favorite' : 'unfavorited',
          [activeOption]
        );
        activeOption.classList.toggle('js-favoriteIndication');
        if (activeOption.classList.contains('js-favoriteIndication')) {
          activeOption.querySelector('.offscreen').innerText =
            activeButton.ariaPressed == 'true' ? 'Favorite' : '';
        }
        break;
      case 'uparrow':
        this.moveUpItems();
        this.updateArrowUpDownItems();
        break;
      case 'downarrow':
        this.moveDownItems();
        this.updateArrowUpDownItems();
        break;
      default:
        this.selectItem(event.currentTarget.querySelector('.focused'));
    }
  }
  /**
   * @description
   *  Handles the action buttons key press events 
   * @param event
   *  The key press event
   */
  onCheckKeyPressActions(event) {
    let listitemCurrentItemActionsButtonPosition,
      listboxCurrentItemActionsButton;
    this.listboxItemCurrent = this.listboxActionsNode.querySelector('.focused');
    this.listboxCurrentOptionIndex = this.listboxOptionArray.indexOf(this.listboxItemCurrent);
    this.activeDescendant = this.listboxActionsNode.getAttribute(
      'aria-activedescendant'
    );
    this.listboxActiveOption =
      this.listboxActionsNode.querySelector('.focused');
    this.listboxItemsWithAriaActionsArray =
      event.currentTarget.querySelectorAll('[aria-actions]');
    switch (event.key) {
      case 'ArrowUp':
      case 'ArrowDown':
        event.preventDefault();
        for (let i = 0; i < this.listboxCurrentItemActionsButtons.length; i++) {
          this.defocusActionsItem(this.listboxCurrentItemActionsButtons[i]);
        }
        for (let i = 0; i < this.listboxItemsWithAriaActionsArray.length; i++) {
          this.setAriaActions(this.listboxItemsWithAriaActionsArray[i], ' ');
        }
        this.defocusItem(this.listboxItemCurrent);
        if (event.key === 'ArrowUp') {
          this.listboxItemCurrent = this.findPreviousOption(this.listboxItemCurrent);
        } else {
          let next = this.findNextOption(this.listboxItemCurrent);
          if (next) {
            this.listboxItemCurrent = this.findNextOption(this.listboxItemCurrent);
          } else {
            this.listboxItemCurrent = this.listboxOptionArray[0];
          }
        }
        if (this.listboxItemCurrent && this.multiselectable && event.shiftKey) {
          this.selectRange(this.startRangeIndex, this.listboxItemCurrent);
        }

        if (this.listboxItemCurrent) {
          this.focusItem(this.listboxItemCurrent);
        }
        this.listboxCurrentItemActionsButtons = Array.from(
          this.listboxItemCurrent.querySelectorAll(
            'button:not(.hide-actions-button),[role="button"]:not(.hide-actions-button)'
          )
        );
        this.setAriaActions(
          this.listboxItemCurrent,
          this.listboxCurrentItemActionsButtons.map((node) => node.id).join(' ')
        );
        break;
      case 'ArrowLeft':
      case 'ArrowRight':
        event.preventDefault();
        for (let i = 0; i < this.listboxCurrentItemActionsButtons.length; i++) {
          this.defocusActionsItem(this.listboxCurrentItemActionsButtons[i]);
        }
        listboxCurrentItemActionsButton = this.listboxActionsNode.querySelector(
          '#' + this.activeDescendant
        );
        if (
          listboxCurrentItemActionsButton &&
          this.listboxCurrentItemActionsButtons.find(
            (elem) => elem.id === this.activeDescendant
          )
        ) {
          listitemCurrentItemActionsButtonPosition =
            this.listboxCurrentItemActionsButtons.findIndex(
              (elem) => elem.id === this.activeDescendant
            );
        } else {
          listitemCurrentItemActionsButtonPosition = -1;
        }
        if (event.key == 'ArrowLeft') {
          if (listitemCurrentItemActionsButtonPosition > 0) {
            this.focusActionsItem(
              this.listboxCurrentItemActionsButtons[
              listitemCurrentItemActionsButtonPosition - 1
              ]
            );
          } else {
            this.defocusActionsItem(
              this.listboxCurrentItemActionsButtons[
              listitemCurrentItemActionsButtonPosition
              ]
            );
            this.setActiveDescendant(this.listboxItemCurrent);
          }
        } else if (event.key == 'ArrowRight') {
          if (listitemCurrentItemActionsButtonPosition < 0) {
            this.focusActionsItem(this.listboxCurrentItemActionsButtons[0]);
          } else if (
            listitemCurrentItemActionsButtonPosition <
            this.listboxCurrentItemActionsButtons.length - 1
          ) {
            this.focusActionsItem(
              this.listboxCurrentItemActionsButtons[
              listitemCurrentItemActionsButtonPosition + 1
              ]
            );
          } else {
            this.focusActionsItem(
              this.listboxCurrentItemActionsButtons[
              listitemCurrentItemActionsButtonPosition
              ]
            );
          }
        }
        break;
      case 'Enter':
      case ' ':
        event.preventDefault();
        this.doActionButtonEvents(
          event,
          event.currentTarget.ariaActiveDescendantElement
            ? event.currentTarget.ariaActiveDescendantElement
            : event.currentTarget
        );
        break;
    }
  }
  /**
   * @description
   *  Prepares action item click events to be passed on to the key press listener
   * @param event
   *  The click event
   */
  onCheckClickItemActions(event) {
    event.stopImmediatePropagation();
    event.key = 'Enter';
    let previousFocus = this.listboxActionsNode.querySelectorAll('.focused');
    let prev;
    for (let i = 0; i < previousFocus.length; i++) {
      prev = previousFocus[i];
      prev.classList.remove('focused');
    }
    let newFocus = event.srcElement.closest('[role="option"]');
    newFocus.classList.add('focused');
    this.onCheckKeyPressActions(event);
  }
  /**
   * @description
   *  Helps the Listbox by removing the selection indication from anything that is not activeDescendant
   *  Needed when clicking action buttons sets activeDescendant before clicking an option
   * @param event
   *  The click event
   */
  onSetCurrentActiveOptionForListbox(event) {
    if (event.srcElement.localName != 'button') {
      for (let i = 0; i < this.listboxOptionArray.length; i++) {
        let listboxOptionCurrent = this.listboxOptionArray[i];
        if (this.activeDescendant != listboxOptionCurrent.id) {
          this.defocusItem(listboxOptionCurrent);
        }
      }
    }
    let target = event.target.role == 'option'? event.target:event.target.closest('[role="option"]');
    this.selectItem(target);
    this.populateDetails(target);
  }
};
window.addEventListener('load', function () {
  new aria.ListboxActions(document.getElementById('ss_elem_list'));
});
