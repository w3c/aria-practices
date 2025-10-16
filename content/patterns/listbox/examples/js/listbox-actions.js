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
 *  ListboxActions object representing the state and interactions for a listbox widget
 * @param listboxActionsNode
 *  The DOM node pointing to the listbox
 */

aria.ListboxActions = class ListboxActions {
  constructor(listboxActionsNode) {
    this.listboxActionsNode = listboxActionsNode;
    this.activeDescendant = this.listboxActionsNode.getAttribute(
      'aria-activedescendant'
    );
    this.registerActionsEvents();
    this.listboxOptionArray = Array.from(this.listboxActionsNode.querySelectorAll('[role="option"]'));
    this.handleItemChange = function () {};
    this.listboxItemCurrent = null;
    this.activeDescendant = null;
    this.listboxActiveOption = null;
    this.listboxCurrentItemActionsButtons = [];
    this.listboxCurrentOptionIndex = -1;
    this.listboxItemsWithAriaActionsArray = [];
    
  }

  registerActionsEvents() {
    this.listboxActionsNode.addEventListener('keydown', this.checkKeyPressActions.bind(this));
    let buttons = this.listboxActionsNode.querySelectorAll('[role="button"]:not(.hide-actions-button)');
    for (let i = 0;i < buttons.length;i++) {
      buttons[i].addEventListener('click', this.checkClickItemActions.bind(this));
    }
  }
  /**
   * Check if the selected option is in view, and scroll if not
   */
  updateScroll() {
    const selectedOption = document.getElementById(this.activeDescendant);
    if (selectedOption) {
      const scrollBottom =
        this.listboxActionsNode.clientHeight + this.listboxActionsNode.scrollTop;
      const elementBottom =
        selectedOption.offsetTop + selectedOption.offsetHeight;
      if (elementBottom > scrollBottom) {
        this.listboxActionsNode.scrollTop =
          elementBottom - this.listboxActionsNode.clientHeight;
      } else if (selectedOption.offsetTop < this.listboxActionsNode.scrollTop) {
        this.listboxActionsNode.scrollTop = selectedOption.offsetTop;
      }
      selectedOption.scrollIntoView({ block: 'nearest', inline: 'nearest' });
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
   *  set aria-activedescendant attribute and at listbox
   * @param element
   *  The element to defocus
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
   *  Shifts the currently focused item up on the list. No shifting occurs if the
   *  item is already at the top of the list.
   */
  moveUpItems() {
    if (!this.activeDescendant) {
      return;
    }
    const currentItem = document.getElementById(this.activeDescendant).closest('[role="option"]');
    const previousItem = currentItem.previousElementSibling;
    this.listboxOptionArray = Array.from(this.listboxActionsNode.querySelectorAll('[role="option"]'));
    if (previousItem) {
      this.listboxActionsNode.insertBefore(currentItem, previousItem);
      this.handleItemChange('moved_up', [currentItem]);
      /** Hides the down arrow for item moved to the end of list and shows arrow on item moved up from bottom */
      if (this.listboxOptionArray.indexOf(previousItem) == this.listboxOptionArray.length-2) {
        currentItem.querySelector('.downarrow').classList.remove('hide-actions-button');
        currentItem.querySelector('.downarrow').classList.remove('focusedActionButton');
        previousItem.querySelector('.downarrow').classList.add('hide-actions-button');
        this.activeDescendant = currentItem.id;
      }
      /** Hides the up arrow for item moved to the top of list and shows arrow on item moved down from top */
      if (this.listboxOptionArray.indexOf(previousItem) == 1) {
        currentItem.querySelector('.uparrow').classList.add('hide-actions-button');
        currentItem.querySelector('.uparrow').classList.remove('focusedActionButton');
        previousItem.querySelector('.uparrow').classList.remove('hide-actions-button');
        this.setActiveDescendant(currentItem);
      }
    }
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
    var currentItem = document.getElementById(this.activeDescendant).closest('[role="option"]');
    var nextItem = currentItem.nextElementSibling;
    this.listboxOptionArray = Array.from(this.listboxActionsNode.querySelectorAll('[role="option"]'));
    if (nextItem) {
      this.listboxActionsNode.insertBefore(nextItem, currentItem);
      this.handleItemChange('moved_down', [currentItem]);
      /** Hides the down arrow for item moved to the end of list and shows arrow on item moved up from bottom */
      if (this.listboxOptionArray.indexOf(nextItem) == this.listboxOptionArray.length-1) {
        currentItem.querySelector('.downarrow').classList.add('hide-actions-button');
        currentItem.querySelector('.downarrow').classList.remove('focusedActionButton');
        nextItem.querySelector('.downarrow').classList.remove('hide-actions-button');
        this.setActiveDescendant(currentItem);
      }
      /** Hides the up arrow for item moved to the top of list and shows arrow on item moved down from top */
      if (this.listboxOptionArray.indexOf(nextItem) == 2) {
        currentItem.querySelector('.uparrow').classList.remove('hide-actions-button');
        currentItem.querySelector('.uparrow').classList.remove('focusedActionButton');
        nextItem.querySelector('.uparrow').classList.add('hide-actions-button');
        this.activeDescendant = currentItem.id;
      }
    }
  }

  /**
   * @description
   *  Delete, Move or Favorite the currently selected items.
   * @param event
   * @param activeButton
   */
  doActionButtonEvents (event, activeButton) {
    let activeButtonClasslist = Array.from(activeButton.classList);
    const index = activeButtonClasslist.indexOf('focusedActionButton');
    if (index > -1) { 
      activeButtonClasslist.splice(index, 1); 
    } 
    switch(activeButtonClasslist[0]) {
      case 'delete':
        this.listboxItemCurrent.remove();    
        for (let i = 0;i < this.listboxCurrentItemActionsButtons.length;i++) {
          this.defocusActionsItem(this.listboxCurrentItemActionsButtons[i]);
        }
        for (let i = 0;i < this.listboxItemsWithAriaActionsArray.length; i++) {
            this.listboxItemsWithAriaActionsArray[i].setAttribute('aria-actions','');
        }        
        break;
      case 'favorite':
          activeButton.setAttribute('aria-pressed',(activeButton.ariaPressed && activeButton.ariaPressed == 'true'?'false':'true'));
        break;
      case 'uparrow':
        this.moveUpItems();
        break;
      case 'downarrow':
        this.moveDownItems();
        break;
    }
    this.updateScroll();
  }
  checkKeyPressActions(evt) {
    let listitemCurrentItemActionsButtonPosition, listboxCurrentItemActionsButton;
    this.listboxItemCurrent = this.listboxActionsNode.querySelector('.focused');
    this.activeDescendant = this.listboxActionsNode.getAttribute('aria-activedescendant');
    this.listboxActiveOption = this.listboxActionsNode.querySelector('.focused');
    this.listboxCurrentItemActionsButtons = Array.from(this.listboxItemCurrent.querySelectorAll('[role="button"]:not(.hide-actions-button)'));
    this.listboxItemsWithAriaActionsArray = evt.currentTarget.querySelectorAll('[aria-actions]');
    switch (evt.key) {
      case 'ArrowUp':
      case 'ArrowDown':
        for (let i = 0;i < this.listboxCurrentItemActionsButtons.length;i++) {
          this.defocusActionsItem(this.listboxCurrentItemActionsButtons[i]);
        }
        for (let i = 0;i < this.listboxItemsWithAriaActionsArray.length; i++) {
            this.listboxItemsWithAriaActionsArray[i].setAttribute('aria-actions','');
        }
        this.listboxItemCurrent.setAttribute('aria-actions',this.listboxCurrentItemActionsButtons.map(node => node.id).join(' '));
        break;
      case 'ArrowLeft':
      case 'ArrowRight':
        for (let i = 0;i < this.listboxCurrentItemActionsButtons.length;i++) {
          this.defocusActionsItem(this.listboxCurrentItemActionsButtons[i]);
        }
        listboxCurrentItemActionsButton = this.listboxActionsNode.querySelector('#'+this.activeDescendant);
        if (listboxCurrentItemActionsButton && this.listboxCurrentItemActionsButtons.find(elem => elem.id === this.activeDescendant)) {
            listitemCurrentItemActionsButtonPosition = this.listboxCurrentItemActionsButtons.findIndex(elem => elem.id === this.activeDescendant);
        } else {
            listitemCurrentItemActionsButtonPosition = -1;
        }
        if (evt.key == 'ArrowLeft') {
            if (listitemCurrentItemActionsButtonPosition > 0) {
              this.focusActionsItem(this.listboxCurrentItemActionsButtons[listitemCurrentItemActionsButtonPosition-1]);
            }
        } else if (evt.key == 'ArrowRight') {
            if (listitemCurrentItemActionsButtonPosition < 0) {
                this.focusActionsItem(this.listboxCurrentItemActionsButtons[0]);
            } else if (listitemCurrentItemActionsButtonPosition < (this.listboxCurrentItemActionsButtons.length-1)) {
                this.focusActionsItem(this.listboxCurrentItemActionsButtons[listitemCurrentItemActionsButtonPosition+1]);
            }
        }
        break;
      case 'Enter':
        this.doActionButtonEvents(evt, evt.currentTarget.ariaActiveDescendantElement?evt.currentTarget.ariaActiveDescendantElement:evt.currentTarget);
        break;
      default:
        break;
    }
  }
  checkClickItemActions(evt) {
    evt.preventDefault();
    let button = evt.currentTarget;
    if (button.role == 'button') {
      evt.key = 'Enter';
      this.setActiveDescendant(evt.srcElement);
      let previousFocus = this.listboxActionsNode.querySelectorAll('.focused');
      let prev;
      for (let i = 0;i < previousFocus.length; i++){
        prev = previousFocus[i];
        prev.classList.remove('focused');
      }
      let newFocus = evt.srcElement.closest('[role="option"]');
      newFocus.classList.add('focused');
      this.checkKeyPressActions(evt);
    } else {
      let listboxNode = evt.srcElement.closest('[role="option"]');
      listboxNode.click();
    }
    
  }
};
window.addEventListener('load', function () {
    new aria.ListboxActions(document.getElementById('ss_elem_list'));
});