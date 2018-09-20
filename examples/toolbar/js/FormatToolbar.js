/*
*   This content is licensed according to the W3C Software License at
*   https://www.w3.org/Consortium/Legal/2015/copyright-software-and-document
*/

/**
 * @constructor
 *
 * @desc
 *  Format Toolbar object representing the state and interactions for a toolbar widget
 *  to format the text in a textarea element
 *
 * @param domNode
 *  The DOM node pointing to the element with the toolbar tole
 */
FormatToolbar = function (domNode) {
  this.domNode = domNode;
  this.firstItem = null;
  this.lastItem = null;

  this.toolbarItems = [];
  this.alignItems = [];

  this.fontSmallerItem = null;
  this.fontLargerItem = null;
};

FormatToolbar.prototype.init = function () {
  var i, items, toolbarItem, menuButtons;

  this.textarea = document.getElementById(this.domNode.getAttribute('aria-controls'));

  items = this.domNode.querySelectorAll('.item');

  for (i = 0; i < items.length; i++) {

    toolbarItem = new FormatToolbarItem(items[i], this);
    toolbarItem.init();

    if (i === 0) {
      this.firstItem = toolbarItem;
    }
    this.lastItem = toolbarItem;
    this.toolbarItems.push(toolbarItem);
  }
  console.log(this.toolbarItems);
  menuButtons = this.domNode.querySelectorAll('[role="button"][aria-haspopup="true"]');

  for (i = 0; i < menuButtons.length; i++) {
    toolbarItem = new FontMenuButton(menuButtons[i], this);
    toolbarItem.init();
  }
};

FormatToolbar.prototype.toggleBold = function (toolbarItem) {
  if (this.textarea.style.fontWeight === 'bold') {
    this.textarea.style.fontWeight = 'normal';
    toolbarItem.resetPressed();
  }
  else {
    this.textarea.style.fontWeight = 'bold';
    toolbarItem.setPressed();
  }
};

FormatToolbar.prototype.toggleUnderline = function (toolbarItem) {
  if (this.textarea.style.textDecoration === 'underline') {
    this.textarea.style.textDecoration = 'none';
    toolbarItem.resetPressed();
  }
  else {
    this.textarea.style.textDecoration = 'underline';
    toolbarItem.setPressed();
  }
};

FormatToolbar.prototype.toggleItalic = function (toolbarItem) {
  if (this.textarea.style.fontStyle === 'italic') {
    this.textarea.style.fontStyle = 'normal';
    toolbarItem.resetPressed();
  }
  else {
    this.textarea.style.fontStyle = 'italic';
    toolbarItem.setPressed();
  }
};

FormatToolbar.prototype.setAlignment = function (toolbarItem) {
  for (var i = 0; i < this.alignItems.length; i++) {
    this.alignItems[i].resetPressed();
  }

  switch (toolbarItem.value) {
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

FormatToolbar.prototype.copyTextContent = function () {
  console.log(this.textarea.value);
  this.textarea.select();
  document.execCommand('copy');
};

FormatToolbar.prototype.pasteTextContent = function() {
  // let paste = window.clipboardData.getData('text');

  console.log(window.clipboardData);
}

FormatToolbar.prototype.setFontFamily = function (font) {
  this.textarea.style.fontFamily = font;
};

FormatToolbar.prototype.activateItem = function (toolbarItem) {
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
    case 'copy':
      this.copyTextContent();
      break;
    case 'paste':
      this.pasteTextContent();
      break;
    case 'font-family':
      this.setFontFamily(toolbarItem.value);
      break;

    default:
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
FormatToolbar.prototype.setFocusItem = function (item) {
  for (var i = 0; i < this.toolbarItems.length; i++) {
    this.toolbarItems[i].domNode.setAttribute('tabindex', '-1');
  }

  item.domNode.setAttribute('tabindex', '0');
  item.domNode.focus();
};

FormatToolbar.prototype.setFocusToNext = function (currentItem) {
  var index, newItem;

  if (currentItem === this.lastItem) {
    newItem = this.firstItem;
  }
  else {
    index = this.toolbarItems.indexOf(currentItem);
    newItem = this.toolbarItems[index + 1];
  }
  this.setFocusItem(newItem);
};

FormatToolbar.prototype.setFocusToPrevious = function (currentItem) {
  var index, newItem;

  if (currentItem === this.firstItem) {
    newItem = this.lastItem;
  }
  else {
    index = this.toolbarItems.indexOf(currentItem);
    newItem = this.toolbarItems[index - 1];
  }
  this.setFocusItem(newItem);
};

FormatToolbar.prototype.setFocusToFirst = function (currentItem) {
  this.setFocusItem(this.firstItem);
};

FormatToolbar.prototype.setFocusToLast = function (currentItem) {
  this.setFocusItem(this.lastItem);
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
  var toolbars = document.querySelectorAll('[role="toolbar"].format');

  for (var i = 0; i < toolbars.length; i++) {
    var toolbar = new FormatToolbar(toolbars[i]);

    toolbar.init();
  }
});
