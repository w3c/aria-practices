/*
*   This content is licensed according to the W3C Software License at
*   https://www.w3.org/Consortium/Legal/2015/copyright-software-and-document
*
*   File:   TextStyling.js
*
*   Desc:   Styling functions for changing the style of an item
*
*   Author: Jon Gunderson and Ku Ja Eun
*/

var StyleManager = function(id) {
  this.node = document.getElementById(id);  
  this.fontSize = '';
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
    this.node.style.fontWeight = 'normal';
  }
  else {
    this.node.style.fontWeight = 'bold';
  }
};

StyleManager.prototype.setItalic = function(flag) {

  if (flag) {
    document.getElementById(id).style.fontStyle = 'normal';
  }
  else {
    document.getElementById(id).style.fontStyle = 'italic';
  }
};

StyleManager.prototype.isMinFontSize = function() {
  return this.fontSize === 'x-small';
};

StyleManager.prototype.isMaxFontSize = function() {
  return this.fontSize === 'x-large';  
};


StyleManager.prototype.styleManager = function(option, value) {

  if (typeof flag !== 'boolean') {
    flag = false;
  }  

  switch (option) {

    case 'font-bold':
      this.setItalic(value);
      break;

    case 'font-color':
      this.setColor(value);
      break;      

    case 'font-family':
      this.setFontFamily(value);
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
