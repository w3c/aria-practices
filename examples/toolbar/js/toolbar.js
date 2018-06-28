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
  this.selectedItem = this.domNode.querySelector('.selected');
  this.firstItem = null; 
  this.lastItem = null; 
  this.toolbarItems = []; 
  console.log(this.domNode);
  console.log(this.items);
  // this.registerEvents();
};


aria.Toolbar.prototype.init = function() {
  var toolbarItem;
  e = this.domNode.firstElementChild; 
  console.log(e);
  while(e){
    var toolbarElement = e;
    console.log(toolbarElement);
    if(toolbarElement.classList.contains('toolbar-item')){
      toolbarItem = new ToolbarItem(toolbarElement, this);
      toolbarItem.init();
      this.toolbarItems.push(toolbarItem);
    }
    e = e.nextElementSibling;
  }
  if(this.items.length>0){
    this.firstItem = this.items[0];
    this.lastItem = this.items[this.items.length-1];
  }
};

// /**
//  * @desc
//  *  Register events for the toolbar interactions
//  */
// aria.Toolbar.prototype.registerEvents = function () {
//   this.toolbarNode.addEventListener('keydown', this.checkFocusChange.bind(this));
//   this.toolbarNode.addEventListener('click', this.checkClickItem.bind(this));
// };

// /**
//  * @desc
//  *  Handle various keyboard controls; LEFT/RIGHT will shift focus; DOWN
//  *  activates a menu button if it is the focused item.
//  *
//  * @param evt
//  *  The keydown event object
//  */
// aria.Toolbar.prototype.checkFocusChange = function (evt) {
//   var key = evt.which || evt.keyCode;
//   var nextIndex, nextItem;

//   switch (key) {
//     case aria.KeyCode.LEFT:
      
//     case aria.KeyCode.RIGHT:
//       // nextIndex = Array.prototype.indexOf.call(this.items, this.selectedItem);
//       // nextIndex = key === aria.KeyCode.LEFT ? nextIndex - 1 : nextIndex + 1;
//       // nextIndex = Math.max(Math.min(nextIndex, this.items.length - 1), 0);

//       // this.selectItem(nextItem);
//       this.focusItem(nextItem);
//       break;
//     case aria.KeyCode.DOWN:
//       // if selected item is menu button, pressing DOWN should act like a click
//       if (aria.Utils.hasClass(this.selectedItem, 'menu-button')) {
//         evt.preventDefault();
//         this.selectedItem.click();
//       }
//       break;
//     case aria.KeyCode.HOME:
//       this.setFocusToFirstItem();
//       break;
//     case aria.KeyCode.END:
//       this.setFocusToLast();
//       break;
//   }
// };

// /**
//  * @desc
//  *  Selects a toolbar item if it is clicked
//  *
//  * @param evt
//  *  The click event object
//  */
// aria.Toolbar.prototype.checkClickItem = function (evt) {
//   if (aria.Utils.hasClass(evt.target, 'toolbar-item')) {
//     this.selectItem(evt.target);
//   }
// };

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
  // aria.Utils.addClass(element, 'selected');
  element.classList.add('selected');
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
  console.log(this.items); 
  for(var i=0;i<this.items.length;i++){
    this.items[i].tabIndex = -1;
  }
  console.log(element);
  element.tabIndex = 0;
};
aria.Toolbar.prototype.setFocusToNext = function (currentItem) {
  console.log(currentItem);
  console.log(this.items);
    var index, newItem;
    if(currentItem === this.lastItem) {
      newItem = this.firstItem;
    }else{
      index = this.items.indexOf(currentItem);
      newItem = this.items[index+1];
    }
    this.setFocusToItem(newItem);
}
