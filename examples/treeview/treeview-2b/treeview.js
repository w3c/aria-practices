

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


window.addEventListener('load', function () {

  var trees = document.querySelectorAll('[role="tree"]');

  for (var i = 0; i <trees.length; i++) {
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
    'TAB' :  9,
    'RETURN' : 13,
    'ESC' : 27,
    'SPACE' : 32,
    'PAGEUP' : 33,
    'PAGEDOWN' : 34,
    'END' : 35,
    'HOME' : 36,
    'LEFT' : 37,
    'UP' : 38,
    'RIGHT' : 39,
    'DOWN' : 40
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

  this.initTreeitems(this.treeNode);


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
      ti.addEventListener('click', function (event) {
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
*       Finds all the descendant treeitems of the node
*
*   @param node
*       DOM node to start looking for descendant treeitems
*
*   @returns
*       Array of DOM nodes with role=treeitem 
*/

Tree.prototype.getTreeitems = function (node) {

  var n = node.firstElementChild;
  var ti = [];

  while (n) {

    if (n.getAttribute('role') === 'treeitem') {
      ti.push(n);
    }

    if (n.firstElementChild) ti = ti.concat(this.getTreeitems(n));

    n = n.nextElementSibling;
  }

  return ti;

};

/*
*   @desc
*       Defines parent/child/sibling relationships between treeitems
*
*   @param node
*       DOM node to start looking for descendant treeitems
*
*   @param previous
*       Previous treeitem
*
*   @param parent
*       Parent treeitem
*
*   @returns
*       Last treeitem node 
*/

Tree.prototype.initTreeitems = function (node, previous, parent) {

  var n = node.firstElementChild;
 
  while (n) {

    if (n.getAttribute('role') === 'treeitem') {
      n.parentTreeitem = parent;
      n.previousTreeitem = previous;
      n.nextTreeitem = false;
      if (previous) previous.nextTreeitem = n;
      previous = n;
    }

    if (n.firstElementChild) {
      if (n.getAttribute('role') === 'treeitem' && 
          typeof n.getAttribute('aria-expanded') === 'string') previous = this.initTreeitems(n, n, n);
      else previous = this.initTreeitems(n, previous, parent);
    }
      
    n = n.nextElementSibling;
  }

  return previous;

};

/*
*   @desc
*       Finds all the child treeitems of the node
*
*   @param treeitem
*       treeitem DOM node to start looking for child treeitems
*
*   @returns
*       Array of treeitem DOM nodes 
*/

Tree.prototype.getChildTreeitems = function (treeitem) {

  var ti = treeitem.nextTreeitem;
  var children = [];

  while (ti) {
    if (ti.parentTreeitem === treeitem) {
      children.push(ti);
    }
    ti = ti.nextTreeitem;
  }

  return children;

};

/*
*   @desc
*       Returns True if the treeitem is expandable and has children
*
*   @param treeitem
*       treeitem DOM node to start looking for previous sibling
*
*   @returns
*       True or False 
*/

Tree.prototype.isExpandable = function (treeitem) {

  if (treeitem.getAttribute('aria-expanded')  &&
     treeitem.nextTreeitem &&
     treeitem.nextTreeitem.parentTreeitem === treeitem) return true;

  return false;  

};

/*
*   @desc
*       Returns True if the treeitem is expandable, is expanded and has children
*
*   @param treeitem
*       treeitem DOM node to start looking for previous sibling
*
*   @returns
*       True or False 
*/

Tree.prototype.isExpanded = function (treeitem) {

  if (treeitem.getAttribute('aria-expanded') && 
     (treeitem.getAttribute('aria-expanded') === 'true') &&
     treeitem.nextTreeitem &&
     treeitem.nextTreeitem.parentTreeitem === treeitem) return true;

  return false;  

};


/*
*   @desc
*       Get next sibling treeitem, if exists
*
*   @param treeitem
*       treeitem DOM node to start looking for next sibling
*
*   @returns
*       treeitem DOM node or False 
*/

Tree.prototype.getNextSiblingTreeitem = function (treeitem) {

  var ti = treeitem.nextTreeitem;

  while (ti) {
    if (ti.parentTreeitem === treeitem.parentTreeitem) return ti;
    ti = ti.nextTreeitem;
  } 

  return false;
};

/*
*   @desc
*       Get first sibling treeitem, if first return false
*
*   @param treeitem
*       treeitem DOM node
*
*   @returns
*       treeitem DOM node of treeitem or False 
*/

Tree.prototype.getFirstSiblingTreeitem = function (treeitem) {

  var ti = treeitem.previousTreeitem;
  var first = false;

  while (ti && ti.parentTreeitem === treeitem.parentTreeitem) {
    first = ti;
    ti = ti.previousTreeitem;
  }

  return first;
};

/*
*   @desc
*       Get last visible treeitem
*
*   @returns
*       treeitem DOM node or False 
*/

Tree.prototype.getLastVisibleTreeitem = function () {

  var ti = this.topTreeitem;

  while(this.getNextVisibleTreeitem(ti)) ti = this.getNextVisibleTreeitem(ti);

  return ti;
};


/*
*   @desc
*       Returns the previous visible treeitem, unless at first treeitem
*
*   @param treeitem
*       treeitem DOM node
*
*   @returns
*       treeitem DOM node or False 
*/

Tree.prototype.getPreviousVisibleTreeitem = function (treeitem) {

  var ti = treeitem.previousTreeitem;

  while (ti && 
         ti.parentTreeitem &&
         ti.parentTreeitem.getAttribute('aria-expanded') === 'false') {
    ti = ti.previousTreeitem;
  }

  return ti;

};

/*
*   @desc
*       Returns the next visible treeitem, unless at last treeitem
*
*   @param treeitem
*       treeitem DOM node or false
*/

Tree.prototype.getNextVisibleTreeitem = function (treeitem) {

  var ti = treeitem.nextTreeitem;

  while (ti && 
         ti.parentTreeitem &&
         ti.parentTreeitem.getAttribute('aria-expanded') === 'false') {
    ti = ti.nextTreeitem;
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

  if ('abcdefghijklmnopqrstuvABCDEFGHIJKLMNOPQRSTUVWXYZ'.indexOf(char) >= 0) {
    this.moveFocusToTreeitemUsingFirstChar(ct, char);
    flag = true;
  }

  if ('*'.indexOf(char) === 0) {
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

  if (event.target.tagName.toLowerCase() === 'span') {

    var ct = event.currentTarget;
    var expanded = ct.getAttribute('aria-expanded'); 

    if (expanded === 'true') {
      ct.setAttribute('aria-expanded', 'false')
      this.hideChildTreeitems(ct);
    }
    else {
      ct.setAttribute('aria-expanded', 'true')
      this.showChildTreeitems(ct);
    }

    event.stopPropagation();
    event.preventDefault();      

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

  for (var i = 0; i < treeitems.length; i++) {
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

  for (var i = 0; i < treeitems.length; i++) {
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

  var p = treeitem.parentTreeitem;

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

  var ti = this.getPreviousVisibleTreeitem(treeitem);

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

  var ti = this.getNextVisibleTreeitem(treeitem);

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

Tree.prototype.moveFocusToTreeitemUsingFirstChar = function (treeitem, char) {
  var ti = this.getNextVisibleTreeitem(treeitem);
  if (!ti) ti = this.topTreeitem;

  while (ti && (treeitem !== ti)) {
    if (this.compareFirstChar(ti, char)) break;
    ti = this.getNextVisibleTreeitem(ti);
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

Tree.prototype.expandSiblingTreeitems = function (treeitem) {

  var ti = this.getFirstSiblingTreeitem(treeitem);
  if (!ti) ti = treeitem;

  while (ti) {
    console.log('TREEITEM: ' + ti + ' ' + ti.nextTreeitem);
    if (this.isExpandable(ti)) this.showChildTreeitems(ti);
    ti = this.getNextSiblingTreeitem(ti);
  }

};
