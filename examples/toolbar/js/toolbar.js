/*
*   This content is licensed according to the W3C Software License at
*   https://www.w3.org/Consortium/Legal/2015/copyright-software-and-document
*/

/**
 * @namespace aria
 */

var aria = aria || {};

/* ---------------------------------------------------------------- */
/*                  ARIA Widget Namespace                        */
/* ---------------------------------------------------------------- */

aria.widget = aria.widget || {};

/**
 * @constructor
 *
 * @desc
 *  Toolbar object representing the state and interactions for a toolbar widget
 *
 * @param domNode
 *  The DOM node pointing to the toolbar
 */
aria.widget.Toolbar = function (domNode) {
  this.domNode   = domNode;
  this.firstItem = null;
  this.lastItem  = null;

  this.toolbarItems = [];
  this.alignItems   = [];

  this.fontSmallerItem = null;
  this.fontLargerItem = null;
};

aria.widget.Toolbar.prototype.init = function () {

  this.textarea = document.getElementById(this.domNode.getAttribute('aria-controls'));

  var buttons = this.domNode.querySelectorAll('[role="button"]');

  for (let i = 0; i < buttons.length; i++) {
    var toolbarItem = new aria.widget.ToolbarItem(buttons[i], this);
    toolbarItem.init();
    if (i === 0) {
      this.firstItem = toolbarItem;
    }
    this.lastItem = toolbarItem;
    this.toolbarItems.push(toolbarItem);
  }
};

aria.widget.Toolbar.prototype.toggleBold = function (toolbarItem) {
  if (this.textarea.style.fontWeight === 'bold') {
    this.textarea.style.fontWeight = 'normal';
    toolbarItem.resetPressed();
  }
  else {
    this.textarea.style.fontWeight = 'bold';
    toolbarItem.setPressed();
  }
};

aria.widget.Toolbar.prototype.toggleUnderline = function (toolbarItem) {
  if (this.textarea.style.textDecoration === 'underline') {
    this.textarea.style.textDecoration = 'none';
    toolbarItem.resetPressed();
  }
  else {
    this.textarea.style.textDecoration = 'underline';
    toolbarItem.setPressed();
  }
};

aria.widget.Toolbar.prototype.toggleItalic = function (toolbarItem) {
  if (this.textarea.style.fontStyle === 'italic') {
    this.textarea.style.fontStyle = 'normal';
    toolbarItem.resetPressed();
  }
  else {
    this.textarea.style.fontStyle = 'italic';
    toolbarItem.setPressed();
  }
};

aria.widget.Toolbar.prototype.setAlignment = function (toolbarItem) {

  for (let i = 0; i < this.alignItems.length; i++) {
    this.alignItems[i].resetPressed();
  }

  switch(toolbarItem.value) {

    case 'left':
      this.textarea.style.textAlign = 'left';
      toolbarItem.setPressed();
      break;

    case 'center':
      this.textarea.style.textAlign = 'center';
      toolbarItem.setPressed();
      break;

    case 'right':
      this.textarea.style.textAlign = 'right';
      toolbarItem.setPressed();
      break;

    default:
      break;
  }

};

aria.widget.Toolbar.prototype.fontSmaller = function () {

  switch (this.textarea.style.fontSize) {
    case 'small' :
      this.textarea.style.fontSize = 'x-small';
      this.fontLargerItem.enable();
      break;

    case 'medium' :
      this.textarea.style.fontSize = 'small';
      this.fontLargerItem.enable();
      break;

    case 'large' :
      this.textarea.style.fontSize = 'medium';
      this.fontLargerItem.enable();
      break;

    case 'x-large':
      this.textarea.style.fontSize = 'large';
      this.fontLargerItem.enable();
      break;

    default:
      this.fontSmallerItem.disable();
      break;

  }
};

aria.widget.Toolbar.prototype.fontLarger = function () {

  switch (this.textarea.style.fontSize) {
    case 'x-small':
      this.textarea.style.fontSize = 'small';
      this.fontSmallerItem.enable();
      break;
    case 'small':
      this.textarea.style.fontSize = 'medium';
      this.fontSmallerItem.enable();
      break;
    case 'medium':
      this.textarea.style.fontSize = 'large';
      this.fontSmallerItem.enable();
      break;
    case 'large':
      this.textarea.style.fontSize = 'x-large';
      this.fontSmallerItem.enable();
      break;

    default:
      this.fontLargerItem.disable();
      break;

  }
};

aria.widget.Toolbar.prototype.activateItem = function (toolbarItem) {

  console.log(toolbarItem.buttonAction);

  switch (toolbarItem.buttonAction) {
    case 'bold':
      this.toggleBold(toolbarItem);
      break;

    case 'underline':
      this.toggleUnderline(toolbarItem);
      break;

    case 'italic':
      this.toggleItalic(toolbarItem);
      break;

    case 'align':
      this.setAlignment(toolbarItem);
      break;

    case 'font':
      if (toolbarItem.value === 'larger') {
        this.fontLarger()
      }
      else {
        this.fontSmaller()
      }
      break;

  }


};

/**
 * @desc
 *  Focus on the specified item
 *
 * @param element
 *  The item to focus on
 */
aria.widget.Toolbar.prototype.setFocusItem = function (element) {
  for (var i = 0; i < this.toolbarItems.length; i++) {
    this.toolbarItems[i].domNode.setAttribute('tabindex', '-1');
  }
  element.setAttribute('tabindex', '0');
  element.focus();
};
aria.widget.Toolbar.prototype.setFocusToNext = function (currentItem) {
  var index, newItem;

  if (currentItem === this.lastItem) {
    newItem = this.toolbarItems[0];
  }
  else {
    index = this.toolbarItems.indexOf(currentItem);
    newItem = this.toolbarItems[index + 1];
    if (newItem.domNode.getAttribute('aria-disabled') === 'true') {
      newItem = this.toolbarItems[index + 2];
    }
  }
  this.setFocusItem(newItem.domNode);
};

aria.widget.Toolbar.prototype.setFocusToPrevious = function (currentItem) {
  var index, newItem;

  if (currentItem === this.firstItem) {
    newItem = this.toolbarItems[this.toolbarItems.length - 1];
  }
  else {
    index = this.toolbarItems.indexOf(currentItem);
    newItem = this.toolbarItems[index - 1];
    if (newItem.domNode.getAttribute('aria-disabled') === 'true') {
      newItem = this.toolbarItems[index - 2];
    }
  }
  this.setFocusItem(newItem.domNode);
};
aria.widget.Toolbar.prototype.setFocusToFirst = function (currentItem) {
  this.setFocusItem(this.firstItem.domNode);
};
aria.widget.Toolbar.prototype.setFocusToLast = function (currentItem) {
  this.setFocusItem(this.lastItem.domNode);
};

// Initialize toolbars

/*
*   This content is licensed according to the W3C Software License at
*   https://www.w3.org/Consortium/Legal/2015/copyright-software-and-document
*
* ARIA Toolbar Examples
* @function onload
* @desc Initialize the toolbar example once the page has loaded
*/

window.addEventListener('load', function () {
  var toolbars = document.querySelectorAll('[role="toolbar"]');
  for (let i = 0; i < toolbars.length; i++) {
    var toolbar = new aria.widget.Toolbar(toolbars[i]);
    toolbar.init();
  }
});
