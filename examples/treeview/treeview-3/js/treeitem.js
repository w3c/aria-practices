/*
*   This content is licensed according to the W3C Software License at
*   https://www.w3.org/Consortium/Legal/2015/copyright-software-and-document
*
*   File:   Treeitem.js
*
*   Desc:   Treeitem widget that implements ARIA Authoring Practices
*           for a tree being used as a file viewer
*/

/*
*   @constructor
*
*   @desc
*       Treeitem object for representing the state and user interactions for a
*       treeItem widget
*
*   @param node
*       An element with the role=tree attribute
*/

var TreeitemMultiSelect = function (node, treeObj, group) {

  // Check whether node is a DOM element
  if (typeof node !== 'object') {
    return;
  }

  node.tabIndex = -1;
  this.tree = treeObj;
  this.groupTreeitem = group;
  this.domNode = node;
  this.label = node.textContent.trim();

  if (node.getAttribute('aria-label')) {
    this.label = node.getAttribute('aria-label').trim();
  }

  this.isExpandable = false;
  this.isSelectable = false; //JZ
  this.isVisible = false;
  this.inGroup = false;

  if (group) {
    this.inGroup = true;
  }

  var elem = node.firstElementChild;

  while (elem) {

    if (elem.tagName.toLowerCase() == 'ul') {
      elem.setAttribute('role', 'group');
      this.isExpandable = true;
      break;
    }
    //JZ
    if(elem.tagName.toLowerCase()=='li' && elem.hasAttribute("aria-selected")){
      this.isSelectable = true;
    }
    //JZ
    elem = elem.nextElementSibling;
  }

  this.keyCode = Object.freeze({
    RETURN: 13,
    SPACE: 32,
    PAGEUP: 33,
    PAGEDOWN: 34,
    END: 35,
    HOME: 36,
    LEFT: 37,
    UP: 38,
    RIGHT: 39,
    DOWN: 40,
    A: 65,
  });
};

TreeitemMultiSelect.prototype.init = function () {
  this.domNode.tabIndex = -1;

  if (!this.domNode.getAttribute('role')) {
    this.domNode.setAttribute('role', 'treeitem');
  }

  this.domNode.addEventListener('keydown', this.handleKeydown.bind(this));
  this.domNode.addEventListener('click', this.handleClick.bind(this));
  this.domNode.addEventListener('focus', this.handleFocus.bind(this));
  this.domNode.addEventListener('blur', this.handleBlur.bind(this));

  if (!this.isExpandable) {
    this.domNode.addEventListener('mouseover', this.handleMouseOver.bind(this));
    this.domNode.addEventListener('mouseout', this.handleMouseOut.bind(this));
  }
};

TreeitemMultiSelect.prototype.isExpanded = function () {

  if (this.isExpandable) {
    return this.domNode.getAttribute('aria-expanded') === 'true';
  }

  return false;

};
//JZ
TreeitemMultiSelect.prototype.isSelected = function(){
  if(this.isSelectable){
    return this.domNode.getAttribute("aria-selected")==='true';
  }
  return false;
};
//JZ
/* EVENT HANDLERS */

TreeitemMultiSelect.prototype.handleKeydown = function (event) {

  var tgt = event.currentTarget,
    flag = false,
    char = event.key,
    clickEvent;

  function isPrintableCharacter (str) {
    return str.length === 1 && str.match(/\S/);
  }

  function printableCharacter (item) {
    if (char == '*') {
      item.tree.expandAllSiblingItems(item);
      flag = true;
    }
    else {
      if (isPrintableCharacter(char)) {
        item.tree.setFocusByFirstCharacter(item, char);
        flag = true;
      }
    }
  }

  if (event.altKey || event.ctrlKey || event.metaKey) {
    console.log("hello");
  }

  if (event.shift) {
    if (isPrintableCharacter(char)) {
      printableCharacter(this);
    }
  }
  else {
    switch (event.keyCode) {
      case this.keyCode.SPACE:
        if(event.shiftKey){
          this.tree.selectContiguousKeys(this);
        }
      case this.keyCode.RETURN:
        // Create simulated mouse event to mimic the behavior of ATs
        // and let the event handler handleClick do the housekeeping.
        try {
          clickEvent = new MouseEvent('click', {
            'view': window,
            'bubbles': true,
            'cancelable': true
          });
        }
        catch (err) {
          if (document.createEvent) {
            // DOM Level 3 for IE 9+
            clickEvent = document.createEvent('MouseEvents');
            clickEvent.initEvent('click', true, true);
          }
        }
        tgt.dispatchEvent(clickEvent);
        flag = true;
        break;

      case this.keyCode.UP:
        this.tree.setFocusToPreviousItem(this);
        if(event.shiftKey){
          this.tree.setSelectToPreviousItem(this);
        }
        flag = true;
        break;

      case this.keyCode.DOWN:
        this.tree.setFocusToNextItem(this);
        if(event.shiftKey){
          this.tree.setSelectToNextItem(this);
        }
        flag = true;
        break;
      case this.keyCode.A:
        if(event.ctrlKey){
          this.tree.selectAllTreeitem(this);
        }
        flag = true;
        break;
      case this.keyCode.RIGHT:
        if (this.isExpandable) {
          if (this.isExpanded()) {
            this.tree.setFocusToNextItem(this);
          }
          else {
            this.tree.expandTreeitem(this);
          }
        }
        flag = true;
        break;

      case this.keyCode.LEFT:
        if (this.isExpandable && this.isExpanded()) {
          this.tree.collapseTreeitem(this);
          flag = true;
        }
        else {
          if (this.inGroup) {
            this.tree.setFocusToParentItem(this);
            flag = true;
          }
        }
        break;

      case this.keyCode.HOME:
        this.tree.setFocusToFirstItem();
        if(event.shiftKey){
          if(event.ctrlKey){
            this.tree.selectToFirst(this);
          }
        }
        flag = true;
        break;

      case this.keyCode.END:
        this.tree.setFocusToLastItem();
        if(event.shiftKey){
          if(event.ctrlKey){
            this.tree.selectToLast(this);
          }
        }
        flag = true;
        break;

      default:
        if (isPrintableCharacter(char)) {
          printableCharacter(this);
        }
        break;
    }

  }

  if (flag) {
    event.stopPropagation();
    event.preventDefault();
  }
};

TreeitemMultiSelect.prototype.handleClick = function (event) {
  if (this.isExpandable) {
    if (this.isExpanded()) {
      this.tree.collapseTreeitem(this);
    }
    else {
      this.tree.expandTreeitem(this);
    }
    event.stopPropagation();
  }
  else {
    this.tree.setFocusToItem(this);
  }
  //------------------------------------------------------********-------------------------------------------------
  //new added for selection state when click
  var selectState=event.currentTarget.getAttribute('aria-selected');
  if(selectState==='false'){
    event.currentTarget.setAttribute("aria-selected", true);
  }else if(selectState==="true"){
    event.currentTarget.setAttribute("aria-selected", false);
  }
  //
};

TreeitemMultiSelect.prototype.handleFocus = function (event) {
  var node = this.domNode;
  if (this.isExpandable) {
    node = node.firstElementChild;
  }
  node.classList.add('focus');
};

TreeitemMultiSelect.prototype.handleBlur = function (event) {
  var node = this.domNode;
  if (this.isExpandable) {
    node = node.firstElementChild;
  }
  node.classList.remove('focus');
};

TreeitemMultiSelect.prototype.handleMouseOver = function (event) {
  event.currentTarget.classList.add('hover');
};

TreeitemMultiSelect.prototype.handleMouseOut = function (event) {
  event.currentTarget.classList.remove('hover');
};
