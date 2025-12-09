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
    this.Listbox = listboxActionsObject;
    this.Listbox.setHandleItemChange(function (event, items) {
      var updateText = '';
      switch (event) {
        case 'removed':
          updateText = 'Deleted ' + items[0].innerText;
          break;
        case 'moved_up':
        case 'moved_down':
          var pos = Array.prototype.indexOf.call(
            this.listboxNode.children,
            items[0]
          );
          pos++;
          updateText = 'Moved to position ' + pos;
          break;
        case 'favorite':
          updateText = 'Favorited ' + items[0].innerText;
          break;
        case 'unfavorited':
          updateText = 'Unfavorited ' + items[0].innerText;
          break;
      }
      if (updateText) {
        var ex1LiveRegion = document.getElementById('ss_live_region');
        ex1LiveRegion.innerHTML = updateText;
      }
    });
    this.listboxActionsNode = this.Listbox.listboxNode;
    this.activeDescendant = this.listboxActionsNode.getAttribute(
      'aria-activedescendant'
    );
    this.registerActionsEvents();
    this.listboxOptionArray = Array.from(
      this.listboxActionsNode.querySelectorAll('[role="option"]')
    );
    this.handleItemChange = function () {};
    this.listboxItemCurrent = null;
    this.listboxActiveOption = null;
    this.listboxCurrentItemActionsButtons = [];
    this.listboxCurrentOptionIndex = -1;
    this.listboxItemsWithAriaActionsArray = [];
  }

  registerActionsEvents() {
    this.listboxActionsNode.addEventListener(
      'keydown',
      this.checkKeyPressActions.bind(this)
    );
    this.listboxActionsNode.addEventListener(
      'click',
      this.setCurrentActiveOptionForListbox.bind(this)
    );
    let actionButtons = this.listboxActionsNode.querySelectorAll(
      'button:not(.hide-actions-button)'
    );
    for (let i = 0; i < actionButtons.length; i++) {
      actionButtons[i].addEventListener(
        'click',
        this.checkClickItemActions.bind(this)
      );
    }
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
  }
  /**
   * @description
   *  Sets aria-actions on the current option
   * @param item
   * @param actions
   *  The item to update and the action IDREF to update
   */
  setAriaActions(item, actions) {
    item.setAttribute('aria-actions', actions);
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
   *  Updates necessary attributes to ensure the up arrow does not appear if the option is the first.
   *  Updates necessary attributes to ensure that the down arrow does not appear if the option is the last.
   */
  prepareToMoveUpItems() {
    if (!this.activeDescendant) {
      return;
    }
    const currentItem = this.listboxItemCurrent;
    const previousItem = currentItem.previousElementSibling;
    this.listboxOptionArray = Array.from(
      this.listboxActionsNode.querySelectorAll('[role="option"]')
    );
    if (previousItem) {
      /** Hides the down arrow for item moved to the end of list and shows arrow on item moved up from bottom */
      if (
        this.listboxOptionArray.indexOf(previousItem) ==
        this.listboxOptionArray.length - 2
      ) {
        currentItem
          .querySelector('.downarrow')
          .classList.remove('hide-actions-button');
        currentItem
          .querySelector('.downarrow')
          .classList.remove('focusedActionButton');
        previousItem
          .querySelector('.downarrow')
          .classList.add('hide-actions-button');
        this.activeDescendant = currentItem.id;
      }
      /** Hides the up arrow for item moved to the top of list and shows arrow on item moved down from top */
      if (this.listboxOptionArray.indexOf(previousItem) == 1) {
        currentItem
          .querySelector('.uparrow')
          .classList.add('hide-actions-button');
        currentItem
          .querySelector('.uparrow')
          .classList.remove('focusedActionButton');
        previousItem
          .querySelector('.uparrow')
          .classList.remove('hide-actions-button');
        this.setActiveDescendant(currentItem);
      }
    }
  }
  /**
   * @description
   *  Updates necessary attributes to ensure the down arrow does not appear if the option is the last option.
   *  Updates necessary attributes to ensure that the up arrow does not appear if the options is first option.
   */
  prepareToMoveDownItems() {
    if (!this.activeDescendant) {
      return;
    }
    var currentItem = this.listboxItemCurrent;
    var nextItem = currentItem.nextElementSibling;
    this.listboxOptionArray = Array.from(
      this.listboxActionsNode.querySelectorAll('[role="option"]')
    );
    if (nextItem) {
      /** Hides the down arrow for item moved to the end of list and shows arrow on item moved up from bottom */
      if (
        this.listboxOptionArray.indexOf(nextItem) ==
        this.listboxOptionArray.length - 1
      ) {
        currentItem
          .querySelector('.downarrow')
          .classList.add('hide-actions-button');
        currentItem
          .querySelector('.downarrow')
          .classList.remove('focusedActionButton');
        nextItem
          .querySelector('.downarrow')
          .classList.remove('hide-actions-button');
        this.setActiveDescendant(currentItem);
      }
      /** Hides the up arrow for item moved to the top of list and shows arrow on item moved down from top */
      if (this.listboxOptionArray.indexOf(nextItem) == 2) {
        currentItem
          .querySelector('.uparrow')
          .classList.remove('hide-actions-button');
        currentItem
          .querySelector('.uparrow')
          .classList.remove('focusedActionButton');
        nextItem.querySelector('.uparrow').classList.add('hide-actions-button');
        this.activeDescendant = currentItem.id;
      }
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
    this.Listbox.activeDescendant = this.listboxOptionArray[optionIndex].id;

    switch (activeButtonClasslist[0]) {
      case 'delete':
        this.listboxItemCurrent.classList.remove('focused');
        this.Listbox.deleteItems();
        for (let i = 0; i < this.listboxCurrentItemActionsButtons.length; i++) {
          this.defocusActionsItem(this.listboxCurrentItemActionsButtons[i]);
        }
        for (let i = 0; i < this.listboxItemsWithAriaActionsArray.length; i++) {
          this.setActiveDescendant(
            this.listboxItemsWithAriaActionsArray[i],
            ''
          );
        }
        break;
      case 'favorite':
        activeButton.setAttribute(
          'aria-pressed',
          activeButton.ariaPressed && activeButton.ariaPressed == 'true'
            ? 'false'
            : 'true'
        );
        this.Listbox.handleItemChange(
          activeButton.ariaPressed == 'true' ? 'favorite' : 'unfavorited',
          [activeOption]
        );
        if (activeOption.querySelector('.favoriteIndication')) {
          activeOption.querySelector('.favoriteIndication').innerText =
            activeButton.ariaPressed == 'true' ? 'Favorite' : '';
        }
        break;
      case 'uparrow':
        this.prepareToMoveUpItems();
        this.Listbox.moveUpItems();
        break;
      case 'downarrow':
        this.prepareToMoveDownItems();
        this.Listbox.moveDownItems();
        break;
    }
    this.Listbox.updateScroll();
  }
  checkKeyPressActions(event) {
    let listitemCurrentItemActionsButtonPosition,
      listboxCurrentItemActionsButton;
    this.listboxItemCurrent = this.listboxActionsNode.querySelector('.focused');
    this.activeDescendant = this.listboxActionsNode.getAttribute(
      'aria-activedescendant'
    );
    this.listboxActiveOption =
      this.listboxActionsNode.querySelector('.focused');
    this.listboxCurrentItemActionsButtons = Array.from(
      this.listboxItemCurrent.querySelectorAll(
        'button:not(.hide-actions-button)'
      )
    );
    this.listboxItemsWithAriaActionsArray =
      event.currentTarget.querySelectorAll('[aria-actions]');
    switch (event.key) {
      case 'ArrowUp':
      case 'ArrowDown':
        for (let i = 0; i < this.listboxCurrentItemActionsButtons.length; i++) {
          this.defocusActionsItem(this.listboxCurrentItemActionsButtons[i]);
        }
        for (let i = 0; i < this.listboxItemsWithAriaActionsArray.length; i++) {
          this.setAriaActions(this.listboxItemsWithAriaActionsArray[i], ' ');
        }
        this.setAriaActions(
          this.listboxItemCurrent,
          this.listboxCurrentItemActionsButtons.map((node) => node.id).join(' ')
        );
        break;
      case 'ArrowLeft':
      case 'ArrowRight':
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
        this.doActionButtonEvents(
          event,
          event.currentTarget.ariaActiveDescendantElement
            ? event.currentTarget.ariaActiveDescendantElement
            : event.currentTarget
        );
        break;
      default:
        break;
    }
  }
  /**
   * @description
   *  Prepares action item click events to be passed on to the key press listener
   * @param event
   *  The click event
   */
  checkClickItemActions(event) {
    event.preventDefault();
    event.key = 'Enter';
    let previousFocus = this.listboxActionsNode.querySelectorAll('.focused');
    let prev;
    for (let i = 0; i < previousFocus.length; i++) {
      prev = previousFocus[i];
      prev.classList.remove('focused');
    }
    let newFocus = event.srcElement.closest('[role="option"]');
    newFocus.classList.add('focused');
    this.checkKeyPressActions(event);
  }
  /**
   * @description
   *  Helps the Listbox by removing the selection indication from anything that is not activeDescendant
   *  Needed when clicking action buttons sets activeDescendant before clicking an option
   * @param event
   *  The click event
   */
  setCurrentActiveOptionForListbox(event) {
    if (event.srcElement.localName != 'button') {
      for (let i = 0; i < this.listboxOptionArray.length; i++) {
        let listboxOptionCurrent = this.listboxOptionArray[i];
        if (this.Listbox.activeDescendant != listboxOptionCurrent.id) {
          this.Listbox.defocusItem(listboxOptionCurrent);
        }
      }
    }
  }
};
window.addEventListener('load', function () {
  new aria.ListboxActions(
    new aria.Listbox(document.getElementById('ss_elem_list'))
  );
});
