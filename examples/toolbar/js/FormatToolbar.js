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
  this.textarea = null;

  this.copyButton = null;
  this.cutButton = null;

  this.start = null;
  this.end = null;
  this.ourClipboard = '';
  this.selected = null;
};

FormatToolbar.prototype.init = function () {
  var i, items, toolbarItem, menuButtons;

  this.textarea = document.getElementById(this.domNode.getAttribute('aria-controls'));
  this.textarea.addEventListener('mouseup', this.selectTextContent.bind(this));
  this.textarea.addEventListener('keyup', this.selectTextContent.bind(this));

  this.selected = this.textarea.selectText;

  this.copyButton  = this.domNode.querySelector('.copy');
  this.cutButton   = this.domNode.querySelector('.cut');
  this.pasteButton = this.domNode.querySelector('.paste');
  items            = this.domNode.querySelectorAll('.item');

  for (i = 0; i < items.length; i++) {

    toolbarItem = new FormatToolbarItem(items[i], this);
    toolbarItem.init();

    if (i === 0) {
      this.firstItem = toolbarItem;
    }
    this.lastItem = toolbarItem;
    this.toolbarItems.push(toolbarItem);
  }
  menuButtons = this.domNode.querySelectorAll('button[aria-haspopup="true"]');

  for (i = 0; i < menuButtons.length; i++) {
    toolbarItem = new FontMenuButton(menuButtons[i], this);
    toolbarItem.init();
  }

};

FormatToolbar.prototype.selectTextContent = function () {
  this.start = this.textarea.selectionStart;
  this.end = this.textarea.selectionEnd;
  this.selected = this.textarea.value.substring(this.start, this.end);
  this.updateDisable(this.copyButton, this.cutButton, this.pasteButton, this.selected);

};
FormatToolbar.prototype.updateDisable = function (copyButton, cutButton, pasteButton, selectedContent) {
  var start = this.textarea.selectionStart;
  var end = this.textarea.selectionEnd;
  if (start !== end) {
    copyButton.setAttribute('aria-disabled', false);
    cutButton.setAttribute('aria-disabled',  false);
  }
  else {
    copyButton.setAttribute('aria-disabled', true);
    cutButton.setAttribute('aria-disabled',  true);
  }
  if (this.ourClipboard.length > 0) {
    pasteButton.setAttribute('aria-disabled', false);
  }
};


FormatToolbar.prototype.selectText = function (start, end, textarea) {
  if (typeof(textarea.selectionStart != undefined)) {
    textarea.focus();
    textarea.selectionStart = start;
    textarea.selectionEnd = end;
    return true;
  }
};
FormatToolbar.prototype.copyTextContent = function (toolbarItem) {
  if (this.copyButton.getAttribute('aria-disabled') === 'true') {
    return;
  }
  this.selectText(this.start, this.end, this.textarea);
  this.ourClipboard = this.selected;
  this.updateDisable(this.copyButton, this.cutButton, this.pasteButton, this.selected);

};

FormatToolbar.prototype.cutTextContent = function (toolbarItem) {
  if (this.cutButton.getAttribute('aria-disabled') === 'true') {
    return;
  }
  this.copyTextContent(toolbarItem);
  var str = this.textarea.value;
  this.textarea.value = str.replace(str.substring(this.start, this.end),'');
  this.selected = '';
  this.updateDisable(this.copyButton, this.cutButton, this.pasteButton, this.selected);
};

FormatToolbar.prototype.pasteTextContent = function () {
  if (this.pasteButton.getAttribute('aria-disabled') === 'true') {
    return;
  }
  var str = this.textarea.value;
  this.textarea.value = str.slice(0,this.textarea.selectionStart) + this.ourClipboard + str.slice(this.textarea.selectionEnd);
  this.textarea.focus();
  this.updateDisable(this.copyButton, this.cutButton, this.pasteButton, this.selected);
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
      this.copyTextContent(toolbarItem);
      break;
    case 'cut':
      this.cutTextContent(toolbarItem);
      break;
    case 'paste':
      this.pasteTextContent(toolbarItem);
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
