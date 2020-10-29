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
 *  Toolbar object representing the state and interactions for a toolbar widget
 *
 * @param toolbarNode
 *  The DOM node pointing to the toolbar
 */
aria.Toolbar = function (toolbarNode) {
  this.toolbarNode = toolbarNode;
  this.items = this.toolbarNode.querySelectorAll('.toolbar-item');
  this.selectedItem = this.toolbarNode.querySelector('.selected');
  this.registerEvents();
};

/**
 * @desc
 *  Register events for the toolbar interactions
 */
aria.Toolbar.prototype.registerEvents = function () {
  this.toolbarNode.addEventListener(
    'keydown',
    this.checkFocusChange.bind(this)
  );
  this.toolbarNode.addEventListener('click', this.checkClickItem.bind(this));
};

/**
 * @desc
 *  Handle various keyboard controls; LEFT/RIGHT will shift focus; DOWN
 *  activates a menu button if it is the focused item.
 *
 * @param evt
 *  The keydown event object
 */
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

/**
 * @desc
 *  Selects a toolbar item if it is clicked
 *
 * @param evt
 *  The click event object
 */
aria.Toolbar.prototype.checkClickItem = function (evt) {
  if (aria.Utils.hasClass(evt.target, 'toolbar-item')) {
    this.selectItem(evt.target);
  }
};

/**
 * @desc
 *  Deselect the specified item
 *
 * @param element
 *  The item to deselect
 */
aria.Toolbar.prototype.deselectItem = function (element) {
  aria.Utils.removeClass(element, 'selected');
  element.setAttribute('aria-selected', 'false');
  element.setAttribute('tabindex', '-1');
};

/**
 * @desc
 *  Deselect the currently selected item and select the specified item
 *
 * @param element
 *  The item to select
 */
aria.Toolbar.prototype.selectItem = function (element) {
  this.deselectItem(this.selectedItem);
  aria.Utils.addClass(element, 'selected');
  element.setAttribute('aria-selected', 'true');
  element.setAttribute('tabindex', '0');
  this.selectedItem = element;
};

/**
 * @desc
 *  Focus on the specified item
 *
 * @param element
 *  The item to focus on
 */
aria.Toolbar.prototype.focusItem = function (element) {
  element.focus();
};
