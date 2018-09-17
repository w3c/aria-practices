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

aria.widget.ToolbarItem = function (domNode, toolbar) {
  this.domNode = domNode;
  this.toolbar = toolbar;
  this.buttonAction = 'none';
  this.value = '';


  this.keyCode = Object.freeze({
    'TAB': 9,
    'RETURN': 13,
    'ESC': 27,
    'SPACE': 32,
    'PAGEUP': 33,
    'PAGEDOWN': 34,
    'END': 35,
    'HOME': 36,
    'LEFT': 37,
    'UP': 38,
    'RIGHT': 39,
    'DOWN': 40
  });
};

aria.widget.ToolbarItem.prototype.init = function () {
  this.domNode.addEventListener('keydown', this.handleKeyDown.bind(this));
  this.domNode.addEventListener('click', this.handleClick.bind(this));
  this.domNode.addEventListener('focus', this.handleFocus.bind(this));
  this.domNode.addEventListener('blur', this.handleBlur.bind(this));

  if (this.domNode.classList.contains('bold')) {
    this.buttonAction = 'bold';
  }

  if (this.domNode.classList.contains('italic')) {
    this.buttonAction = 'italic';
  }

  if (this.domNode.classList.contains('underline')) {
    this.buttonAction = 'underline';
  }

  if (this.domNode.classList.contains('align-left')) {
    this.buttonAction = 'align';
    this.value = 'left';
    this.toolbar.alignItems.push(this);
  }

  if (this.domNode.classList.contains('align-center')) {
    this.buttonAction = 'align';
    this.value = 'center';
    this.toolbar.alignItems.push(this);
  }

  if (this.domNode.classList.contains('align-right')) {
    this.buttonAction = 'align';
    this.value = 'right';
    this.toolbar.alignItems.push(this);
  }

  if (this.domNode.classList.contains('font-larger')) {
    this.buttonAction = 'font';
    this.value = 'larger';
    this.toolbar.fontLargerItem = this;
  }

  if (this.domNode.classList.contains('font-smaller')) {
    this.buttonAction = 'font';
    this.value = 'smaller';
    this.toolbar.fontSmallerItem = this;
  }
};

aria.widget.ToolbarItem.prototype.setPressed = function () {
  this.domNode.setAttribute('aria-pressed', 'true');
};

aria.widget.ToolbarItem.prototype.resetPressed = function () {
  this.domNode.setAttribute('aria-pressed', 'false');
};

aria.widget.ToolbarItem.prototype.disable = function () {
  this.domNode.setAttribute('aria-disabled', 'true');
};

aria.widget.ToolbarItem.prototype.enable = function () {
  this.domNode.removeAttribute('aria-disabled');
};



aria.widget.ToolbarItem.prototype.handleBlur = function (event) {
  this.toolbar.domNode.classList.remove('focused');
};

aria.widget.ToolbarItem.prototype.handleFocus = function (event) {
  this.toolbar.domNode.classList.add('focused');
};

aria.widget.ToolbarItem.prototype.handleKeyDown = function (event) {

  switch (event.keyCode) {
    case this.keyCode.RETURN:
    case this.keyCode.SPACE:
      this.toolbar.activateItem(this);
      flag = true;
      break;

    case this.keyCode.RIGHT:
      this.toolbar.setFocusToNext(this);
      flag = true;
      break;

    case this.keyCode.LEFT:
      this.toolbar.setFocusToPrevious(this);
      flag = true;
      break;

    case this.keyCode.HOME:
      this.toolbar.setFocusToFirst(this);
      flag = true;
      break;

    case this.keyCode.END:
      this.toolbar.setFocusToLast(this);
      flag = true;
      break;
  }

  if (flag) {
    event.stopPropagation();
    event.preventDefault();
  }

};

aria.widget.ToolbarItem.prototype.handleClick = function () {
  this.toolbar.activateItem(this);
};
