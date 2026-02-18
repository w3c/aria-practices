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
    this.listboxOptionArray = Array.from(
      this.listboxActionsNode.querySelectorAll('[role="option"]')
    );
    this.handleItemChange = function () { };
    this.listboxItemCurrent = null;
    this.listboxActiveOption = null;
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
    let selectionCheckbox = this.listboxActionsNode.querySelectorAll(
      '.js-selection'
    );
    for (let i = 0; i < selectionCheckbox.length; i++) {
      selectionCheckbox[i].addEventListener('click', (event) => {
        event.currentTarget.closest('[role="option"]').click();
      });
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
   *  Updates necessary attributes to ensure the up does not appear if an option is the first in the list.
   *  Updates necessary attributes to ensure the down does not appear if an option is the last in the list.
   */
  updateArrowUpDownItems() {
    this.listboxOptionArray = Array.from(
      this.listboxActionsNode.querySelectorAll('[role="option"]')
    );
    for (let i = 0;i < this.listboxOptionArray.length;i++) {
      let option = this.listboxOptionArray[i];
      if (this.listboxOptionArray.indexOf(option) == this.listboxOptionArray.length-1) {
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
        this.setActiveDescendant(this.listboxItemsWithAriaActionsArray[0]);
        this.Listbox.focusItem(this.listboxOptionArray[0]);
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
        this.Listbox.handleItemChange(
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
        this.Listbox.moveUpItems();
        this.updateArrowUpDownItems();
        break;
      case 'downarrow':
        this.Listbox.moveDownItems();
        this.updateArrowUpDownItems();
        break;
    }
    this.Listbox.updateScroll();
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
    if (this.listboxItemCurrent) {
      this.listboxCurrentItemActionsButtons = Array.from(
        this.listboxItemCurrent.querySelectorAll(
          'button:not(.hide-actions-button)'
        )
      );
    }
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
        this.populateDetails(this.listboxItemCurrent);
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
        if (this.Listbox.activeDescendant != listboxOptionCurrent.id) {
          this.Listbox.defocusItem(listboxOptionCurrent);
        }
      }
    }
    this.populateDetails(event.target);
  }
};
window.addEventListener('load', function () {
  new aria.ListboxActions(
    new aria.Listbox(document.getElementById('ss_elem_list'))
  );
});
