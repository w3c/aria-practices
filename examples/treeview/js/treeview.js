

/*
 * Copyright 2011-2016 University of Illinois
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
 

/**
 * ARIA Treeview example
 * @function onload
 * @desc  after page has loaded initializ all treeitems based on the role=treeitem
 */


window.addEventListener('load', function() {

  var trees = document.querySelectorAll('[role="tree"]');

  for(var i = 0; i <trees.length; i++ ) {
    var t = new Tree(trees[i]);
    t.init();

  }

});

/*
*   @constructor 
*
*   @desc
*       Tree item object for representing the state and user interactions for a 
*       tree widget
*
*   @param node
*       An element with the role=tree attribute
*/

var Tree = function (node) {
  // Check whether node is a DOM element
  if (typeof node !== 'object') return;

  this.treeNode = node;

  this.keyCode = Object.freeze({
    'TAB'      :  9,
    'RETURN'   : 13,
    'ESC'      : 27,
    'SPACE'    : 32,
    'PAGEUP'   : 33,
    'PAGEDOWN' : 34,
    'END'      : 35,
    'HOME'     : 36,
    'LEFT'     : 37,
    'UP'       : 38,
    'RIGHT'    : 39,
    'DOWN'     : 40
  });
};

/*
*   @desc
*       Adds 'keydown', 'click', 'blur' and 'focus' event handlers to the treeitem in the tree
*       Set tabindex for each treeitemitem
*       Set the display of treeitems based on aria-expanded state
*/
Tree.prototype.init = function () {
  var that = this;

  var treeitems = this.getTreeitems(this.treeNode);

  var flag = true;

  this.topTreeitem = false;

  if (treeitems.length) this.topTreeitem =  treeitems[0];

  for (var i = 0; i < treeitems.length; i++) {
    var ti = treeitems[i];

    if(flag) {
      ti.tabIndex = 0;
      flag = false;
    }
    else {
      ti.tabIndex = -1;
    }  

    ti.addEventListener('keydown', function (event) {
      that.handleKeydown(event);
    });

    ti.addEventListener('keypress', function (event) {
      that.handleKeypress(event);
    });

    ti.addEventListener('focus', function (event) {
      that.handleFocus(event);
    });

    ti.addEventListener('blur', function (event) {
      that.handleBlur(event);
    });

    if (ti.getAttribute('aria-expanded')) {
      var label = this.getExpandableTreeitemLabel(ti);
      label.addEventListener('click', function (event) {
        that.handleClick(event);
      });
    }

    if (ti.getAttribute('aria-expanded') === 'false') {
      this.hideChildTreeitems(ti);
    }

    // if an treeitem contains a link set it's tabindex to -1
    var links = ti.getElementsByTagName('a');
    if (links.length) links[0].tabIndex = -1;

  }

};




/*
*   @desc
*       Finds the label text for the expandable treeitem
*
*   @param node
*       DOM node to start looking for label
*
*   @returns
*       DOM node of label 
*/

Tree.prototype.getExpandableTreeitemLabel = function(node) {

  var n = node.firstChild;
  while (n) {
    if (n.nodeType === Node.ELEMENT_NODE) return n;
    n = n.nextSibling;
  }
  return false;

};

/*
*   @desc
*       Finds all the descendant treeitems of the node
*
*   @param node
*       DOM node to start looking for descendant treeitems
*
*   @returns
*       Array of DOM nodes 
*/

Tree.prototype.getTreeitems = function(node) {

  var n = node.firstChild;
  var ti = [];

  while (n) {
    if (n.nodeType === Node.ELEMENT_NODE) {

      if (n.getAttribute('role') === 'treeitem') ti.push(n);

      if (n.firstChild) ti = ti.concat(this.getTreeitems(n));

    }
    n = n.nextSibling;
  }

  return ti;

};

/*
*   @desc
*       Finds all the child treeitems of the node
*
*   @param node
*       DOM node to start looking for child treeitems
*
*   @returns
*       Array of DOM nodes 
*/

Tree.prototype.getChildTreeitems = function(node) {

  var n = this.getFirstChildTreeitem(node);
  var ti = [];

  while (n) {
    if (n.nodeType === Node.ELEMENT_NODE && 
        n.getAttribute('role') === 'treeitem') {
        ti.push(n);
    }
    n = n.nextSibling;
  }

  return ti;

};

/*
*   @desc
*       Get first child treeitem, if exists
*
*   @param node
*       DOM node to start looking for previous sibling
*
*   @returns
*       DOM node or False 
*/

Tree.prototype.getFirstChildTreeitem = function(node) {

  var n = node.firstChild;

  while (n) {
    if (n.nodeType === Node.ELEMENT_NODE) {
      var flag = n.getAttribute('role')  === 'treeitem';
      if (flag) {
        return n;
      }
      else {
        n1 = this.getFirstChildTreeitem(n);
        if (n1) return n1;
      }  
    }
    n = n.nextSibling;
  }

  return false;
};


/*
*   @desc
*       Returns True if the treeitem is expandable and has children
*
*   @param node
*       DOM node to start looking for previous sibling
*
*   @returns
*       True or False 
*/

Tree.prototype.isExpandable = function(node) {

  if (node.getAttribute('aria-expanded') &&
     this.getFirstChildTreeitem(node)) return true;

  return false;  

};

/*
*   @desc
*       Returns True if the treeitem is expandable, is expanded and has children
*
*   @param node
*       DOM node to start looking for previous sibling
*
*   @returns
*       True or False 
*/

Tree.prototype.isExpanded = function(node) {

  if (node.getAttribute('aria-expanded') && 
     (node.getAttribute('aria-expanded') === 'true') &&
     this.getFirstChildTreeitem(node)) return true;

  return false;  

};


/*
*   @desc
*       Get previous sibling treeitem, if exists
*
*   @param node
*       DOM node to start looking for previous sibling
*
*   @returns
*       DOM node or False 
*/

Tree.prototype.getPreviousSiblingTreeitem = function(node) {

  var ti = node.previousElementSibling;

  while (ti) {
    if (ti.getAttribute('role')  === 'treeitem') {
      return ti;
    }
    ti = ti.previousElementSibling;
  }

  return false;
};

/*
*   @desc
*       Get previous sibling treeitem, if exists
*
*   @param node
*       DOM node to start looking for previous sibling
*
*   @returns
*       DOM node or False 
*/

Tree.prototype.getNextSiblingTreeitem = function(node) {

  var ti = node.nextElementSibling;

  while (ti) {
    if (ti.getAttribute('role')  === 'treeitem') {
      return ti;
    }
    ti = ti.nextElementSibling;
  }

  return false;
};

/*
*   @desc
*       Get first sibling treeitem
*
*   @returns
*       DOM node or False 
*/

Tree.prototype.getFirstSiblingTreeitem = function(node) {

  var ti = node;
  var first = false

  while (ti) {
    if (ti.getAttribute('role')  === 'treeitem') {
      first = ti;
    }
    ti = ti.previousElementSibling;
  }

  return first;
};


/*
*   @desc
*       Get last sibling treeitem
*
*   @returns
*       DOM node or False 
*/

Tree.prototype.getLastSiblingTreeitem = function(node) {

  var ti = node;
  var last = false

  while (ti) {
    if (ti.getAttribute('role')  === 'treeitem') {
      last = ti;
    }
    ti = ti.nextElementSibling;
  }

  return last;
};

/*
*   @desc
*       Get last visible treeitem
*
*   @returns
*       DOM node or False 
*/

Tree.prototype.getLastVisibleTreeitem = function() {

  var lastVisible = this.getLastSiblingTreeitem(this.topTreeitem);

  while (lastVisible.getAttribute('aria-expanded') === 'true') {
    var node = this.getFirstChildTreeitem(lastVisible);
    if (node) lastVisible = this.getLastSiblingTreeitem(node);
    else break;
  }
  return lastVisible;
};

/*
*   @desc
*       Get parent treeitem, unless top treeitem
*
*   @param node
*       DOM node to start looking for parent treeitem
*
*   @returns
*       DOM node or False 
*/

Tree.prototype.getParentTreeitem = function(node) {

  var ti = node.parentElement;

  while (ti) {
    if (ti.getAttribute('role') === 'treeitem') {
      return ti;
    }
    ti = ti.parentElement;
  }

  return false;
};


/*
*   @desc
*       Returns the next treeitem, unless at last treeitem
*
*   @param treeitem
*       False, or DOM node
*/

Tree.prototype.getNextTreeitem = function (node) {

  var ti = false;

  if (node) {
    // if treeitem is expanded 
    if (this.isExpanded(node)) {
      ti = this.getFirstChildTreeitem(node);
    }
    else {
      ti = this.getNextSiblingTreeitem(node);
      pi = this.getParentTreeitem(node);

      while (pi && !ti) {
        ti = this.getNextSiblingTreeitem(pi);
        pi = this.getParentTreeitem(pi);
      }  
    }
  }

  return ti;

};

/*
*   @desc
*       Test if first character of accessible name matches 
*
*   @param treeitem
*       True or False
*/

Tree.prototype.compareFirstChar = function (node, char) {

  function setFirstChar(name) {
    if ((typeof node.firstChar !== 'string') &&
        (typeof name === 'string')) {
      name = name.trim();
      if (name.length) node.firstChar = name[0].toLowerCase();
    }
  }  

  if (typeof node.firstChar !== 'string') {
    setFirstChar(node.getAttribute('aria-label'));
    setFirstChar(node.innerText);
    setFirstChar(node.getAttribute('title'));
  }  

  return node.firstChar === char.toLowerCase();

};


/*
*   @desc
*       Keydown event handler for treeitems
*       Handles cursor keys, enter key
*
*   @param event
*       DOM event object
*/

Tree.prototype.handleKeydown = function (event) {
  var ct = event.currentTarget,
      flag = false;

  switch (event.keyCode) {

    case this.keyCode.SPACE:
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
      catch(err) {
        if (document.createEvent) {
          // DOM Level 3 for IE 9+
          clickEvent = document.createEvent('MouseEvents');
          clickEvent.initEvent('click', true, true);
        }
      }
      // Id treeitem contains a link, dispatch the click event to the link
      var ce = ct.firstElementChild;
      if (ce && (ce.tagName.toLowerCase() === 'a')) ce.dispatchEvent(clickEvent);
      else ct.dispatchEvent(clickEvent);
      flag = true;
      break;

    case this.keyCode.UP:
      this.moveFocusToPreviousTreeitem(ct);
      flag = true;
      break;

    case this.keyCode.DOWN:
      this.moveFocusToNextTreeitem(ct);
      flag = true;
      break;

    case this.keyCode.LEFT:

      if (this.isExpandable(ct)) {
        if (this.isExpanded(ct)) this.hideChildTreeitems(ct);
        else this.moveFocusToParentTreeitem(ct);
      }
      else {
        this.moveFocusToParentTreeitem(ct);
      } 

      flag = true;
      break;

    case this.keyCode.RIGHT:

      if (this.isExpandable(ct)) {
        if (!this.isExpanded(ct)) this.showChildTreeitems(ct);
        else this.moveFocusToFirstChildTreeitem(ct);
      }

      flag = true;
      break;

    case this.keyCode.HOME:
      this.moveFocusToTopTreeitem(ct);
      flag = true;
      break;

    case this.keyCode.END:
      this.moveFocusToLastVisibleTreeitem(ct);
      flag = true;
      break;

    default:
      break;
  }

  if (flag) {
    event.stopPropagation();
    event.preventDefault();
  }
};

/*
*   @desc
*       Keypress event handler for treeitems
*       Used for letter keys and '*'
*
*   @param event
*       DOM event object
*/

Tree.prototype.handleKeypress = function (event) {

 var  ct = event.currentTarget,
      flag = false,
      char = event.key;
 
  if ((char >= 'A' && char <= 'Z') || 
      (char >= 'a' && char <= 'z')){
    this.moveFocusToTreeitemUsingFirstChar(ct, char);
    flag = true;
  }

  if (char === '*' ) {
    this.expandSiblingTreeitems(ct);
    flag = true;        
  }

  if (flag) {
    event.stopPropagation();
    event.preventDefault();
  }

};

/*
*   @desc
*       Click event handler for treeitems
*       Doesn't cancel click event, so that other onclick events on element
*       can be processed
*
*   @param event
*       DOM event object
*/

Tree.prototype.handleClick = function (event) {
  var ct = event.currentTarget.parentElement;

  var expanded = ct.getAttribute('aria-expanded'); 

  if (expanded === 'true') {
    ct.setAttribute('aria-expanded', 'false')
    this.hideChildTreeitems(ct);
  }
  else {
    ct.setAttribute('aria-expanded', 'true')
    this.showChildTreeitems(ct);
  }

};

/*
*   @desc
*       Styles focus of treeitem
*
*   @param event
*       DOM event object
*/

Tree.prototype.handleFocus = function (event) {
  var ct = event.currentTarget;
  var node = ct.firstElementChild;

  if (node && this.isExpandable(ct)) ct = node;

  ct.classList.add('focus'); 
};

/*
*   @desc
*       Styles blur of treeitem
*
*   @param event
*       DOM event object
*/

Tree.prototype.handleBlur = function (event) {
  var ct = event.currentTarget;
  var node = ct.firstElementChild;
  if (node && this.isExpandable(ct)) ct = node;
  ct.classList.remove('focus'); 
};


/*
*   @desc
*       Hides child treeitems if aria-expanded=true (e.g. children are visible)
*
*   @param treeitem
*       Treeitem with child treeitems 
*/

Tree.prototype.hideChildTreeitems = function (treeitem) {

  var treeitems = this.getChildTreeitems(treeitem);

  for(var i = 0; i < treeitems.length; i++) {
    treeitems[i].style.display = 'none';
  }
  treeitem.setAttribute('aria-expanded', 'false');

};

/*
*   @desc
*       Show child treeitems if aria-expanded=false (e.g. children are invisible)
*
*   @param treeitem
*       Treeitem with child treeitems 
*/

Tree.prototype.showChildTreeitems = function (treeitem) {

  var treeitems = this.getChildTreeitems(treeitem);

  for(var i = 0; i < treeitems.length; i++) {
    treeitems[i].style.display = 'block';
  }
  treeitem.setAttribute('aria-expanded', 'true');

};

/*
*   @desc
*       Moves focus to parent treeitem, if it exists
*
*   @param treeitem
*       Treeitem with current focus
*/

Tree.prototype.moveFocusToParentTreeitem = function (treeitem) {

  var p = this.getParentTreeitem(treeitem);

  if (p) {
    treeitem.tabIndex = -1;
    p.tabIndex = 0;
    p.focus();
  }

};

/*
*   @desc
*       Moves focus to first child treeitem, if it exists
*
*   @param treeitem
*       Treeitem with current focus
*/

Tree.prototype.moveFocusToFirstChildTreeitem = function (treeitem) {

  var treeitem = this.getFirstChildTreeitem(treeitem);

  if (treeitem) {
    treeitem.tabIndex = -1;
    var ti = treeitem;
    ti.tabIndex = 0;
    ti.focus();
  }

};


/*
*   @desc
*       Moves focus to previous sibling treeitem, if it exists
*
*   @param treeitem
*       Treeitem with current focus
*/

Tree.prototype.moveFocusToPreviousTreeitem = function (treeitem) {

  var ti = this.getPreviousSiblingTreeitem(treeitem);

  if (ti) {
    while (this.isExpanded(ti)) {
      ti = this.getLastSiblingTreeitem(this.getFirstChildTreeitem(ti))
    }
  }
  else {
    ti = this.getParentTreeitem(treeitem);
  }

  if (ti) {
    ti.focus();
    ti.tabIndex = 0;
    treeitem.tabIndex = -1;
  }
};

/*
*   @desc
*       Moves focus to next treeitem, unless at least treeitem
*
*   @param treeitem
*       Treeitem with current focus
*/

Tree.prototype.moveFocusToNextTreeitem = function (treeitem) {

  var ti = this.getNextTreeitem(treeitem);

  if (ti) {
    ti.focus();
    ti.tabIndex = 0;
    treeitem.tabIndex = -1;
    return;
  }

};

/*
*   @desc
*       Moves focus to top treeitem,
*
*   @param treeitem
*       Treeitem with current focus
*/

Tree.prototype.moveFocusToTopTreeitem = function (treeitem) {

  var ti = this.topTreeitem;

  if (ti) {
    ti.focus();
    ti.tabIndex = 0;
    treeitem.tabIndex = -1;
  }

};


/*
*   @desc
*       Moves focus to last visible treeitem,
*
*   @param treeitem
*       Treeitem with current focus
*/

Tree.prototype.moveFocusToLastVisibleTreeitem = function (treeitem) {

  var ti = this.getLastVisibleTreeitem();

  if (ti) {
    ti.focus();
    ti.tabIndex = 0;
    treeitem.tabIndex = -1;
  }

};

/*
*   @desc
*       Finds the next visible treeitem that starts with character
*
*   @param treeitem
*       DOM node to start looking for next treeitem
*
*   @returns
*       True or False 
*/

Tree.prototype.moveFocusToTreeitemUsingFirstChar = function(treeitem, char) {
  var ti = this.getNextTreeitem(treeitem);
  if (!ti) ti = this.topTreeitem;

  while (ti && (treeitem !== ti)) {
    if (this.compareFirstChar(ti, char)) break;
    ti = this.getNextTreeitem(ti);
    // if at last item, go to top of tree
    if (!ti) ti = this.topTreeitem;
  }

  if (ti) {
    ti.focus();
    ti.tabIndex = 0;
    treeitem.tabIndex = -1;
  }
};

/*
*   @desc
*       Expands all sibling treeitrems
*
*   @param treeitem
*       DOM node to start looking for next treeitem
*/

Tree.prototype.expandSiblingTreeitems = function(treeitem) {

  var ti = this.getFirstSiblingTreeitem(treeitem);
  if (!ti) ti = treeitem;

  while (ti) {
    if (this.isExpandable(ti)) this.showChildTreeitems(ti);
    ti = this.getNextSiblingTreeitem(ti);
  }

};
