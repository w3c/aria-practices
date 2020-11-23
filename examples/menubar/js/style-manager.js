/*
 *   This content is licensed according to the W3C Software License at
 *   https://www.w3.org/Consortium/Legal/2015/copyright-software-and-document
 *
 *   File:   TextStyling.js
 *
 *   Desc:   Styling functions for changing the style of an item
 */

'use strict';

var StyleManager = function (node) {
  this.node = node;
  this.fontSize = 'medium';
};

StyleManager.prototype.setFontFamily = function (value) {
  this.node.style.fontFamily = value;
};

StyleManager.prototype.setTextDecoration = function (value) {
  this.node.style.textDecoration = value;
};

StyleManager.prototype.setTextAlign = function (value) {
  this.node.style.textAlign = value;
};

StyleManager.prototype.setFontSize = function (value) {
  this.fontSize = value;
  this.node.style.fontSize = value;
};

StyleManager.prototype.setColor = function (value) {
  this.node.style.color = value;
};

StyleManager.prototype.setBold = function (flag) {
  if (flag) {
    this.node.style.fontWeight = 'bold';
  } else {
    this.node.style.fontWeight = 'normal';
  }
};

StyleManager.prototype.setItalic = function (flag) {
  if (flag) {
    this.node.style.fontStyle = 'italic';
  } else {
    this.node.style.fontStyle = 'normal';
  }
};

StyleManager.prototype.fontSmaller = function () {
  switch (this.fontSize) {
    case 'small':
      this.setFontSize('x-small');
      break;

    case 'medium':
      this.setFontSize('small');
      break;

    case 'large':
      this.setFontSize('medium');
      break;

    case 'x-large':
      this.setFontSize('large');
      break;

    default:
      break;
  } // end switch
};

StyleManager.prototype.fontLarger = function () {
  switch (this.fontSize) {
    case 'x-small':
      this.setFontSize('small');
      break;

    case 'small':
      this.setFontSize('medium');
      break;

    case 'medium':
      this.setFontSize('large');
      break;

    case 'large':
      this.setFontSize('x-large');
      break;

    default:
      break;
  } // end switch
};

StyleManager.prototype.isMinFontSize = function () {
  return this.fontSize === 'x-small';
};

StyleManager.prototype.isMaxFontSize = function () {
  return this.fontSize === 'x-large';
};

StyleManager.prototype.getFontSize = function () {
  return this.fontSize;
};

StyleManager.prototype.setOption = function (option, value) {
  option = option.toLowerCase();
  if (typeof value === 'string') {
    value = value.toLowerCase();
  }

  switch (option) {
    case 'font-bold':
      this.setBold(value);
      break;

    case 'font-color':
      this.setColor(value);
      break;

    case 'font-family':
      this.setFontFamily(value);
      break;

    case 'font-smaller':
      this.fontSmaller();
      break;

    case 'font-larger':
      this.fontLarger();
      break;

    case 'font-size':
      this.setFontSize(value);
      break;

    case 'font-italic':
      this.setItalic(value);
      break;

    case 'text-align':
      this.setTextAlign(value);
      break;

    case 'text-decoration':
      this.setTextDecoration(value);
      break;

    default:
      break;
  } // end switch
};
