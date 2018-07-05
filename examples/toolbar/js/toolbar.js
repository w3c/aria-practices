/*
*   This content is licensed according to the W3C Software License at
*   https://www.w3.org/Consortium/Legal/2015/copyright-software-and-document
*/
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
 * @param domNode
 *  The DOM node pointing to the toolbar
 */
aria.Toolbar = function (domNode) {
  this.domNode = domNode;
  this.items = this.domNode.querySelectorAll('.toolbar-item');
  // this.selectedItem = this.domNode.querySelector('.selected');
  this.selectedItem = [];
  this.firstItem = null; 
  this.lastItem = null; 
  this.toolbarItems = []; 
  this.toolbarGroups = [];
  this.popupMenu = false;
  // this.registerEvents();
};


aria.Toolbar.prototype.init = function() {
  var toolbarItem;
  e = this.domNode.firstElementChild; 
  console.log(e);
  while(e){
    var toolbarGroup = e; 
    if(toolbarGroup.classList.contains('group')){
      this.toolbarGroups.push(toolbarGroup);
    }
    e = e.nextElementSibling;
    console.log(e);
  }
  console.log(this.toolbarGroups);
  for(var i=0; i<this.toolbarGroups.length;i++) {
    var j = this.toolbarGroups[i].firstElementChild; 
    while(j){
      var toolbarElement = j; 
      console.log(toolbarElement);
      if(toolbarElement.classList.contains('toolbar-item') || toolbarElement.classList.contains('menu-wrapper')){
        toolbarItem = new ToolbarItem(toolbarElement, this);
        toolbarItem.init();
        this.toolbarItems.push(toolbarItem);
      }
      j= j.nextElementSibling;
    }
  }
  if(this.toolbarItems.length>0){
    this.firstItem = this.toolbarItems[0];
    this.lastItem = this.toolbarItems[this.toolbarItems.length-1];
  }
  console.log(this.toolbarItems);
};

/**
 * @desc
 *  Deselect the specified item
 *
 * @param element
 *  The item to deselect
 */
aria.Toolbar.prototype.deselectItem = function (element) {
  // aria.Utils.removeClass(element, 'selected');
  element.classList.remove('selected');
  element.setAttribute('aria-pressed', false);
  element.setAttribute('tabindex', '-1');
};

/**
 * @desc
 *  Deselect the currently selected item and select the specified item
 *
 * @param element
 *  The item to select
 */
aria.Toolbar.prototype.styleManage = function (element) {
  var textContent = document.getElementById('textarea1');
  console.log(textContent);
  if(element.classList.contains('selected')) {
    if(element.classList.contains('bold')){
      element.setAttribute('aria-pressed', true);
      textContent.style.fontWeight = 'bold';
    } else if (element.classList.contains('italic')) {
      textContent.style.fontStyle = 'italic';
      element.setAttribute('aria-pressed', true);
    } else if (element.classList.contains('underline')) {
      textContent.style.textDecoration = 'underline';
      element.setAttribute('aria-pressed', true);
    }
  } else {
    if(element.classList.contains('bold')){
      textContent.style.fontWeight = 'normal';
      element.setAttribute('aria-pressed', false);
    } else if (element.classList.contains('italic')) {
      textContent.style.fontStyle = 'normal';
      element.setAttribute('aria-pressed', false);
    } else if (element.classList.contains('underline')) {
      textContent.style.textDecoration = 'none';
      element.setAttribute('aria-pressed', false);
    }
  }
  if (element.classList.contains('size')) {
    if(element.getAttribute('value') === 'smaller'){ // fontSmaller
        this.fontSmaller(textContent);
        element.setAttribute('aria-pressed', true);
        setTimeout(function(){
          element.setAttribute('aria-pressed',false);
        },100);
    } else {
      this.fontLarger(textContent);
      element.setAttribute('aria-pressed', true);
      setTimeout(function(){
        element.setAttribute('aria-pressed',false);
      },100);
    }
  }
  if (element.classList.contains('textAlign')){
    var textAlignElem = [].slice.call(document.querySelectorAll('.textAlign'));
    console.log(element);
    for(var elem in textAlignElem){
      console.log(textAlignElem[elem].getAttribute('aria-pressed')); 
      textAlignElem[elem].setAttribute('aria-pressed', false);
    }
    element.setAttribute('aria-pressed', true);
    this.setTextAlign(textContent, element.getAttribute('value'));
  }
};
aria.Toolbar.prototype.setTextAlign = function (content, value){
  content.style.textAlign = value;
}
aria.Toolbar.prototype.isMaxFontSize = function (content) { 
  return content.style.fontSize === 'x-large';
}
aria.Toolbar.prototype.isMinFontSize = function (content) { 
  return content.style.fontSize === 'x-small';
}
aria.Toolbar.prototype.setFontSize = function (content, value) {
  content.style.fontSize = value;
};
aria.Toolbar.prototype.fontSmaller = function (content) {
  switch (content.style.fontSize) {
    case 'small' :
      this.setFontSize(content, 'x-small');
      break;
    case 'medium' : 
      this.setFontSize(content, 'small'); 
      break;
    case 'large' :
      this.setFontSize(content, 'medium'); 
      break; 
      case 'x-large':
      this.setFontSize(content, 'large');
      break;

    default:
      break;

  }
};
aria.Toolbar.prototype.fontLarger = function (content) {
  switch (content.style.fontSize) {
    case 'x-small':
      this.setFontSize(content, 'small');
      break;

    case 'small':
      this.setFontSize(content, 'medium');
      break;

    case 'medium':
      this.setFontSize(content, 'large');
      break;

    case 'large':
      this.setFontSize(content, 'x-large');
      break;

    default:
      break;

  }
};
aria.Toolbar.prototype.selectItem = function (element) {  
  if(element.classList.contains('selected')) {
    this.deselectItem(element);
  } else {
    element.classList.add('selected');
    element.setAttribute('tabindex', '0');
    this.selectedItem.push(element);
  }
  
  this.styleManage(element);
};

/**
 * @desc
 *  Focus on the specified item
 *
 * @param element
 *  The item to focus on
 */
aria.Toolbar.prototype.setFocusItem = function (element) {
  console.log(element);
  for(var i=0;i<this.toolbarItems.length;i++){
    this.toolbarItems[i].tabIndex = -1;
  }
    element.tabIndex = 0;
    element.focus();
};
aria.Toolbar.prototype.setFocusToNext = function (currentItem) {
    console.log(this.toolbarItems);
    var index, newItem;
    if(currentItem === this.lastItem) {
      newItem = this.toolbarItems[0];
    }else{
      index = this.toolbarItems.indexOf(currentItem);
      newItem = this.toolbarItems[index+1];
    }
    this.setFocusItem(newItem.domNode);
};

aria.Toolbar.prototype.setFocusToPrevious = function (currentItem) {
 
  var index, newItem;
  if(currentItem === this.firstItem) {
    newItem = this.toolbarItems[this.toolbarItems.length-1];
  }else{
    index = this.toolbarItems.indexOf(currentItem);
    newItem = this.toolbarItems[index-1];
  }
  this.setFocusItem(newItem.domNode);
};
aria.Toolbar.prototype.setFocusToFirst = function (currentItem) {
  this.setFocusItem(this.firstItem.domNode); 
};
aria.Toolbar.prototype.setFocusToLast = function (currentItem) {
  this.setFocusItem(this.lastItem.domNode);
};