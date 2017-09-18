/*
 * Copyright 2011-2014 University of Illinois
 * Authors: Thomas Foltz and Jon Gunderson
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
 * ARIA combobox example
 * @function 
 *     onload
 * @desc
 *     After page has loaded initialize all comboboxes based on the selector "div.comboBox"
 */

window.addEventListener('load', function(){

  var comboBoxes = document.querySelectorAll('div.combobox');

  [].forEach.call(comboBoxes, function(comboBox){
    if (comboBox){
      var mb = new aria.widget.ComboBoxInput(comboBox)
      mb.initComboBox();
    }  
  });
});

/** 
 * @namespace aria
 */

var aria = aria ||{};

/* ---------------------------------------------------------------- */
/*                  ARIA Utils Namespace                        */ 
/* ---------------------------------------------------------------- */

/**
 * @desc  
 *     Computes absolute position of an element
 *
 * @param element
 *     DOM node object
 *
 * @returns
 *     Object contains left and top position
 */

aria.Utils = aria.Utils ||{};

aria.Utils.findPos = function(element){
    var xPosition = 0;
    var yPosition = 0;
  
    while(element){
        xPosition += (element.offsetLeft - element.scrollLeft + element.clientLeft);
        yPosition += (element.offsetTop - element.scrollTop + element.clientTop);
        element = element.offsetParent;
    }
    return{ x: xPosition, y: yPosition };
};


/* ---------------------------------------------------------------- */
/*                  ARIA Widget Namespace                        */ 
/* ---------------------------------------------------------------- */

aria.widget = aria.widget ||{};


/* ---------------------------------------------------------------- */
/*                        List Box Widget                           */
/* ---------------------------------------------------------------- */

/**
 * @constructor ComboBoxInput
 *
 * @desc  
 *     Object containing the information and events for a ARIA ComboBox widget  
 *
 * @param  combobox
 *     DOM node of element with class=combobox
 */

aria.widget.ListBox = function(comboBox){

  this.keyCode = Object.freeze({
    "TAB"      : 9,
    "RETURN"   : 13,
    "ESC"    : 27,
    "SPACE"    : 32,
    "ALT"      :18,

    "PAGEUP"    : 33,
    "PAGEDOWN" : 34,
    "END"      : 35,
    "HOME"     : 36,

    "LEFT"  : 37,
    "UP"    : 38,
    "RIGHT" : 39,
    "DOWN"  : 40,
  });

  this.comboBox = comboBox;
  this.firstComboItem = false;
  this.lastComboItem = false;
  this.selectedItem = false;
  this.tabDistance = 0;
};

/**
 * @method aria.widget.ListBox.prototype.initListBox
 *
 * @desc
 *     Add event listeners to all listbox elements 
 */

aria.widget.ListBox.prototype.initListBox = function(){

  var listBox = this;
  var cn = this.comboBox.listBoxNode.firstChild;
  var numItems = 0;
  
  while (cn){
    if (cn.nodeType === Node.ELEMENT_NODE){
      if (cn.getAttribute('role')  === 'option'){
        numItems += 1;
        cn.tabIndex = -1;
        if (!this.firstComboItem) this.firstComboItem = cn; 
        this.lastComboItem = cn;

        var eventKeyDown = function (event){
          listBox.eventKeyDown(event, listBox);
        };

        cn.addEventListener('keydown', eventKeyDown);

        var eventClick = function (event){
          listBox.eventClick(event, listBox);
        };

        cn.addEventListener('click', eventClick);
        cn.addEventListener('touchstart', eventClick);
      }
    }
    cn = cn.nextSibling;
  }
  listBox.calcTabDistance(numItems);
  
};

/**
 * @method aria.widget.ListBox.prototype.calcTabDistance
 *
 * @desc
 *     calculates the number of items to skip for quick scrolling.
 *
 * @param numItems
 *     The number of listbox items
 */
 
aria.widget.ListBox.prototype.calcTabDistance = function(numItems){

  if(numItems){
    this.tabDistance = numItems/10;
    if(this.tabDistance < 5)this.tabDistance = 5;
    if(this.tabDistance > 15) this.tabDistance = 15;
  }
}

/**
 * @method aria.widget.ListBox.prototype.nextComboItem
 *
 * @desc
 *     Moves focus to next item
 *
 * @param ci
 *     The current item with focus
 */

aria.widget.ListBox.prototype.nextComboItem = function(ci){

  var mi = ci.nextSibling;

  while (mi){
    if ((mi.nodeType === Node.ELEMENT_NODE) && 
      (mi.getAttribute('role')  === 'option')){
      this.selectedItem = mi;
      break;
    }
    mi = mi.nextSibling;
  }

  if (!mi && this.firstComboItem){
    mi = this.firstComboItem;
    this.selectedItem = mi;
  }

  return mi;
};

/**
 * @method aria.widget.ListBox.prototype.moveToNextComboItem
 *
 * @desc  
 *     Moves focus down the item list n items.
 *
 * @param ci, n
 *     The current item with focus and n the distance down the list to travel
 */

aria.widget.ListBox.prototype.moveToNextComboItem = function(ci , n){

  var mi = ci;
  for( var i = 0; i < n; i++){
    mi = mi.nextSibling.nextSibling;
    if(!mi)break;
    if(mi.nodeType === Node.ELEMENT_NODE &&
      (mi.getAttribute('role')  === 'option')){
      this.selectedItem = mi;
    }
  }
  if (!mi && this.lastComboItem){
    mi = this.lastComboItem;
    this.selectedItem = mi;
  }

  return mi;
};


/**
 * @method previousComboItem
 *
 * @desc  
 *     Moves focus to previous item
 *
 * @param ci
 *     The current item with focus
 */

aria.widget.ListBox.prototype.previousComboItem = function(ci){

  var mi = ci.previousSibling;

  while (mi){
    if(mi.nodeType === Node.ELEMENT_NODE &&
      (mi.getAttribute('role')  === 'option')){
      this.selectedItem = mi;
      break;
    }
    mi = mi.previousSibling;
  }

  if (!mi && this.lastComboItem){
    mi = this.lastComboItem;
    this.selectedItem = mi;
  }
  
  return mi;
};

/**
 * @method aria.widget.ListBox.prototype.moveToPreviousComboItem
 *
 * @desc  
 *     Moves focus up the item list n items.
 *
 * @param ci, n
 *     The current item with focus and n the distance up the list to travel
 */

aria.widget.ListBox.prototype.moveToPreviousComboItem = function(ci, n){

  var mi = ci;
  for( var i = 0; i < n; i++){
    mi = mi.previousSibling.previousSibling;
    if(!mi)break;
    if(mi.nodeType === Node.ELEMENT_NODE &&
      (mi.getAttribute('role')  === 'option')){
      this.selectedItem = mi;
      }
  }
  if (!mi && this.firstComboItem){
    mi = this.firstComboItem;
    this.selectedItem = mi;
  }

  return mi;
};

/**
 * @method aria.widget.ListBox.prototype.setInput
 *
 * @desc
 *     Set the text of the input field.
 *
 * @param ci
 *     The current item with focus
 */

aria.widget.ListBox.prototype.setInput = function(ci){
  
  this.comboBox.inputNode.value = ci.childNodes[0].nodeValue;
};


/**
 * @method aria.widget.ListBox.prototype.activateSelectedItem
 *
 * @desc
 *     Makes sure that only the selected item has aria-selected='true'
 *     and focuses the selected item
 *
 */
 
aria.widget.ListBox.prototype.activateSelectedItem = function(){
  var cn = this.comboBox.listBoxNode.firstChild;
  while(cn){
    if (cn.nodeType === Node.ELEMENT_NODE){
      if (cn.getAttribute('role')  === 'option'){
        cn.setAttribute('aria-selected', 'false');
      }
    }
    cn = cn.nextSibling;
  }
  this.comboBox.inputNode.setAttribute('aria-activedescendant',this.selectedItem.id)
  this.selectedItem.setAttribute('aria-selected', 'true');
  this.setInput(this.selectedItem)
  
}

/**
 * @method aria.widget.ListBox.prototype.nextAlphaComboItem
 *
 * @desc
 *     Find the next instance of a combo item matching the key pressed.
 *
 * @param event
 *     DOM event object
 */
aria.widget.ListBox.prototype.nextAlphaComboItem = function(event){

  var keyCode = String.fromCharCode(event.keyCode).toLowerCase();
  var flag = false;
  
  if (keyCode >= '0' && keyCode <= 'z'){
    cn = this.selectedItem.nextSibling;
    while(cn){
      if (cn.nodeType === Node.ELEMENT_NODE){
        if (cn.getAttribute('role')  === 'option'){
          if (cn.childNodes[0].nodeValue.charAt(0).toLowerCase() === keyCode){
            this.selectedItem = cn;
            flag = true;
            break;
          }
        }
      }
      cn = cn.nextSibling;
    }
    if(!flag){
      cn = this.comboBox.listBoxNode.firstChild.nextSibling
      while(cn){
        if (cn.nodeType === Node.ELEMENT_NODE){
          if (cn.getAttribute('role')  === 'option'){
            if (cn.childNodes[0].nodeValue.charAt(0).toLowerCase() === keyCode){
              this.selectedItem = cn;
              flag = true;
              break;
            }
          }
        }
      cn = cn.nextSibling;
      }
    }
    if(flag)return cn;
    return false;
  }
}

/**
 * @method aria.widget.ListBox.prototype.eventKeyDown
 *
 * @desc
 *     Keydown event handler for ListBox Object
 *     NOTE: The listBox parameter is needed to provide a reference to the specific
 *           listBox
 *
 * @param event, listBox
 *     DOM event object and listBox object
 *
 */

aria.widget.ListBox.prototype.eventKeyDown = function(event, listBox){

  var ct = event.currentTarget;
  var nt = false;
  
  var flag = false;

  switch(event.keyCode){
  
  case listBox.keyCode.RETURN:
  case listBox.keyCode.ESC:
    listBox.comboBox.closeListBox();
    listBox.comboBox.inputNode.focus();  
    flag = true;
    break;

  case listBox.keyCode.UP:
    if (event.altKey){
      listBox.comboBox.toggleListBox();
      listBox.comboBox.inputNode.focus();
      flag = true;
      break;
    }
    nt = listBox.previousComboItem(ct);
    flag = true;
    break;
  
  case listBox.keyCode.LEFT:
    nt = listBox.previousComboItem(ct);
    flag = true;
    break;

  case listBox.keyCode.DOWN:
    if (event.altKey){
      listBox.comboBox.toggleListBox();
      listBox.comboBox.inputNode.focus();
      flag = true;  
      break;
    }
    nt = listBox.nextComboItem(ct);
    flag = true;
    break;
    
  case listBox.keyCode.RIGHT:
    nt = listBox.nextComboItem(ct);
    flag = true;
    break;

  case listBox.keyCode.TAB:
    listBox.comboBox.closeListBox();
    break;
  
  case listBox.keyCode.PAGEUP:
    nt = listBox.moveToPreviousComboItem(ct, listBox.tabDistance);
    flag = true;  
    break;
    
  case listBox.keyCode.PAGEDOWN:
    nt = listBox.moveToNextComboItem(ct, listBox.tabDistance);
    flag = true;  
    break;

  default:
    nt = listBox.nextAlphaComboItem(event);
    if(nt) flag = true;
    break;
  }

  if (flag){
    if(nt){listBox.activateSelectedItem()}
    event.stopPropagation();
    event.preventDefault();
  }  
  
};

/**
 * @method aria.widget.ListBox.prototype.eventClick
 *
 * @desc
 *     Keydown event handler for ListBox Object
 *     NOTE: The listBox parameter is needed to provide a reference to the specific
 *           listBox
 *
 * @param event, listBox
 *     DOM event object and listBox object
 *
 */

aria.widget.ListBox.prototype.eventClick = function(event, listBox){
  var ct = event.currentTarget;
  listBox.selectedItem = ct;
  listBox.activateSelectedItem();
  listBox.comboBox.toggleListBox();
  
  event.stopPropagation();
  event.preventDefault();
}


/* ---------------------------------------------------------------- */
/*                  ComboBox Input Widget                           */
/* ---------------------------------------------------------------- */

/**
 * @constructor aria.widget.ComboBoxInput
 *
 * @desc  Creates a combo box input widget using ARIA 
 *
 * @param node
 *     DOM node object
 *
 */


aria.widget.ComboBoxInput = function(node){
  this.keyCode = Object.freeze({
     "TAB"    : 9,
     "RETURN" : 13,
     "ESC"    : 27,
     "SPACE"  : 32,
     "ALT"    : 18,

     "UP"    : 38,
     "DOWN"  : 40
  });
  if (typeof node !== 'object' || !node.getElementsByClassName) return false;
  
  var inputs = node.getElementsByTagName('input');
  if (inputs && inputs[0]) this.inputNode = inputs[0];
  
  var buttons = node.getElementsByTagName('button');
  if (buttons && buttons[0]){
    this.buttonNode = buttons[0];
    this.buttonNode.tabIndex = "-1";
  }
  var bodyNodes = document.getElementsByTagName("body");
  if (bodyNodes && bodyNodes[0]){
    this.bodyNode = bodyNodes[0]
  }
};

/**
 * @method aria.widget.ComboBoxInput.prototype.initComboBox
 *
 * @desc
 *     Adds event handlers to input element 
 */

aria.widget.ComboBoxInput.prototype.initComboBox = function(){
  
  var comboBox = this;
  var id = this.inputNode.getAttribute('aria-owns');
  
  if (id){
    this.listBoxNode = document.getElementById(id);

    if (this.listBoxNode){
      this.listBox = new aria.widget.ListBox(this);
        this.listBox.initListBox();
    }
  }
  var eventClick = function (event){
    comboBox.eventClick(event, comboBox);
    };
  this.body = new aria.widget.Body(this);
  this.body.initBody();
  
  this.button = new aria.widget.Button(this);
  this.button.initButton();
  
  var eventKeyDown = function (event){
    comboBox.eventKeyDown(event, comboBox);
  };
  comboBox.inputNode.addEventListener('keydown',   eventKeyDown);
  comboBox.inputNode.addEventListener('click', eventClick);
  comboBox.inputNode.addEventListener('touchstart', eventClick); //support for touch users

  this.closeListBox();

};

/**
 * @method aria.widget.ComboBoxInput.prototype.openListBox
 *
 * @desc
 *     Opens the listBox
 */

aria.widget.ComboBoxInput.prototype.openListBox = function(){

  if (this.listBoxNode){
    var pos = aria.Utils.findPos(this.inputNode);
    var br = this.inputNode.getBoundingClientRect();

    this.listBoxNode.style.display = 'block';
    this.listBoxNode.style.position = 'absolute';
    this.listBoxNode.style.top  = (pos.y + br.height) + "px"; 
    this.listBoxNode.style.left = pos.x + "px"; ;
    
    this.inputNode.setAttribute('aria-expanded', 'true');
    
    this.button.highlightButton();
  }  
};


/**
 * @method aria.widget.ComboBoxInput.prototype.closeListBox
 *
 * @desc
 *     Close the listBox
 */

aria.widget.ComboBoxInput.prototype.closeListBox = function(){

  if(this.listBoxNode){
    this.listBoxNode.style.display = 'none';
    this.inputNode.setAttribute('aria-expanded', 'false');
    this.button.unHighlightButton();
  }

};

/**
 * @method aria.widget.ComboBoxInput.prototype.toggleListBox
 *
 * @desc
 *     Close or open the listBox depending on current state
 */

aria.widget.ComboBoxInput.prototype.toggleListBox = function(){
  
  this.button.toggleHighlightButton();
  
  if (this.listBoxNode){
    if (this.listBoxNode.style.display === 'block'){
      this.listBoxNode.style.display = 'none';
      this.inputNode.focus();
      this.inputNode.setAttribute('aria-expanded', 'false');
    }
    else{
      this.listBoxNode.style.display = 'block';
      if(this.listBox.selectedItem)this.listBox.activateSelectedItem();
      this.inputNode.setAttribute('aria-expanded', 'true');
    }
  }

};

/**
 * @method moveFocusToFirstListBoxItem
 *
 * @desc
 *     Move keyboard focus to first listBox item
 *
 * @param resetSelectedItem
 *     A true false indicator of whether or not the selected item needs to be reset
 */

aria.widget.ComboBoxInput.prototype.moveFocusToFirstListBoxItem = function(resetSelectedItem){

  if ((this.listBox.firstComboItem && !this.listBox.selectedItem) ||
      (this.listBox.firstComboItem && resetSelectedItem)){//if resetSelectedItem is true, first item is focused and activated
    this.openListBox();
    this.listBox.selectedItem = this.listBox.firstComboItem;
    this.listBox.activateSelectedItem();
    
  }else{
    this.listBox.activateSelectedItem();
  }

};

/**
 * @method moveFocusToLastListBoxItem
 *
 * @desc
 *     Move keyboard focus to last listBox item
 *
 * @param resetSelectedItem
 *     A true false indicator of whether or not the selected item needs to be reset
 */

aria.widget.ComboBoxInput.prototype.moveFocusToLastListBoxItem = function(resetSelectedItem){

  if ((this.listBox.lastComboItem && !this.listBox.selectedItem) ||
      (this.listBox.lastComboItem && resetSelectedItem)){//if resetSelectedItem is true, last item is focused and activated
    this.openListBox();
    this.listBox.selectedItem = this.listBox.lastComboItem;
    this.listBox.activateSelectedItem();
  }else{
    this.listBox.activateSelectedItem();
  }

};

/**
 * @method aria.widget.ComboBoxInput.prototype.nextAlphaComboItem
 *
 * @desc
 *     Find the next instance of a combo item matching the key pressed.
 *
 * @param event
 *     DOM event object
 */

aria.widget.ComboBoxInput.prototype.nextAlphaComboItem = function(event){

  var keyCode = String.fromCharCode(event.keyCode).toLowerCase();
  var flag = false;
  
  if (keyCode >= '0' && keyCode <= 'z'){
    this.openListBox();
    cn = this.listBox.selectedItem.nextSibling;
    while(cn){
      if (cn.nodeType === Node.ELEMENT_NODE){
        if (cn.getAttribute('role')  === 'option'){
          if (cn.childNodes[0].nodeValue.charAt(0).toLowerCase() === keyCode){
            this.listBox.selectedItem = cn;
            flag = true;
            break;
          }
        }
      }
      cn = cn.nextSibling;
    }
    if(!flag){
      cn = this.listBoxNode.firstChild.nextSibling
      while(cn){
        if (cn.nodeType === Node.ELEMENT_NODE){
          if (cn.getAttribute('role')  === 'option'){
            if (cn.childNodes[0].nodeValue.charAt(0).toLowerCase() === keyCode){
              this.listBox.selectedItem = cn;
              flag = true;
              break;
            }
          }
        }
      cn = cn.nextSibling;
      }
    }
    if(flag)return cn;
    return false;
  }
}


/**
 * @method aria.widget.ComboBoxInput.prototype.eventKeyDown
 *
 * @desc
 *     Keydown event handler for ComboBoxInput Object
 *     NOTE: The comboBox parameter is needed to provide a reference to the specific
 *           comboBox
 *
 * @param event, combobox
 *     DOM event object and combobox object
 */

aria.widget.ComboBoxInput.prototype.eventKeyDown = function(event, comboBox){

  var flag = false;
  var overwriteSelectedItem = false;
  
  ct = comboBox.listBox.selectedItem;
  nt = false;
  
  switch(event.keyCode){
    case comboBox.keyCode.UP:
      if (event.altKey){
        comboBox.toggleListBox();
        flag = true;
        comboBox.moveFocusToLastListBoxItem(overwriteSelectedItem);
        nt = comboBox.listBox.selectedItem
        break;
      }
      flag = true;
      nt = comboBox.listBox.previousComboItem(ct);
      break;
      
    case comboBox.keyCode.DOWN:
      if (event.altKey){
        comboBox.toggleListBox();
        flag = true;
        comboBox.moveFocusToFirstListBoxItem(overwriteSelectedItem);
        nt = comboBox.listBox.selectedItem
        break;
      }
      flag = true;
      nt = comboBox.listBox.nextComboItem(ct);
      break;
    
    case comboBox.keyCode.RETURN:
    case comboBox.keyCode.ESC:
      comboBox.closeListBox();
      flag = true;
      break;

    case comboBox.keyCode.TAB:
      comboBox.closeListBox();
      break;

    default:
      nt = comboBox.nextAlphaComboItem(event);
      if(nt) flag = true;
      break;
    }
  
  if (flag){
    if(nt){comboBox.listBox.activateSelectedItem()}
    event.stopPropagation();
    event.preventDefault();
  }  

};



/**
 * @method aria.widget.ComboBoxInput.prototype.eventClick
 *
 * @desc
 *     click event handler for combobox input
 *
 * @param event, combobox
 *     DOM event object and combobox object
 */

aria.widget.ComboBoxInput.prototype.eventClick = function(event, comboBox){

  var type = event.type;

  if (type === 'click' || type === 'touchstart'){
    this.toggleListBox();
    if(!this.listBox.selectedItem){
      this.listBox.selectedItem = this.listBox.firstComboItem
      this.listBox.activateSelectedItem()
    }
    event.stopPropagation();
    event.preventDefault();
  }
}
/* ---------------------------------------------------------------- */
/*                          Button Widget                           */
/* ---------------------------------------------------------------- */

/**
 * @constructor aria.widget.Button
 *
 * @desc  Creates a Button widget using ARIA 
 *
 * @param combobox
 *     combobox object
 */

aria.widget.Button = function(comboBox){
  this.comboBox = comboBox;  
};

/**
 * @method aria.widget.Button.prototype.initButton
 *
 * @desc
 *     Adds event handlers to button element 
 */

aria.widget.Button.prototype.initButton = function(){

  var button = this;
  var eventClick = function (event){
    button.eventClick(event, button.comboBox);
    };
  this.comboBox.buttonNode.addEventListener('click', eventClick);
  this.comboBox.buttonNode.addEventListener('touchstart', eventClick);
  


};

/**
 * @method aria.widget.Button.prototype.highlightButton
 *
 * @desc
 *     Highlights the button element 
 */

aria.widget.Button.prototype.highlightButton = function(){

  var img = this.comboBox.buttonNode.firstChild;

  while(img) {
    if (img.nodeType === Node.ELEMENT_NODE) {
      if (img.tagName === 'IMG') break;
    }
    img = img.nextSibling;
  }
  if(img){
    img.src = "./images/button-arrow-down-hl.png";
  }
}

/**
 * @method aria.widget.Button.prototype.unHighlightButton
 *
 * @desc
 *     Unhighlights the button element 
 */

aria.widget.Button.prototype.unHighlightButton = function(){

  var img = this.comboBox.buttonNode.firstChild;

  while(img) {
    if (img.nodeType === Node.ELEMENT_NODE) {
      if (img.tagName === 'IMG') break;
    }
    img = img.nextSibling;
  }
  if(img){
    img.src = "./images/button-arrow-down.png";
  }
}

/**
 * @method aria.widget.Button.prototype.toggleHighlightButton
 *
 * @desc
 *     If the button is highlighted it unhighlights it and vice versa.
 */

aria.widget.Button.prototype.toggleHighlightButton = function(){

  var img = this.comboBox.buttonNode.firstChild;

  while(img) {
    if (img.nodeType === Node.ELEMENT_NODE) {
      if (img.tagName === 'IMG') break;
    }
    img = img.nextSibling;
  }
  if(img.src.indexOf('button-arrow-down.png') > 0){
    img.src = "./images/button-arrow-down-hl.png";
  }
  else{
    img.src = "./images/button-arrow-down.png";
  }
}


/**
 * @method eventClick
 *
 * @desc
 *     Click event handler for button object
 *     NOTE: The comboBox parameter is needed to provide a reference to the specific
 *           comboBox
 *
 * @param event, combobox
 *     DOM event object and combobox object
 */

aria.widget.Button.prototype.eventClick = function(event, comboBox){

  var type = event.type;

  if (type === 'click' || type === 'touchstart'){
    this.comboBox.toggleListBox();
    if(!this.comboBox.listBox.selectedItem){
      this.comboBox.listBox.selectedItem = this.comboBox.listBox.firstComboItem
      this.comboBox.listBox.activateSelectedItem()
    }
    event.stopPropagation();
    event.preventDefault();
  }
}


/* ---------------------------------------------------------------- */
/*                          Body Widget                           */
/* ---------------------------------------------------------------- */

/**
 * @constructor aria.widget.Body
 *
 * @desc  Creates a Body widget using ARIA 
 *
 * @param combobox
 *     combobox object
 */

aria.widget.Body = function(comboBox){

  this.comboBox = comboBox;  
};

/**
 * @method aria.widget.Body.prototype.initBody
 *
 * @desc
 *     Adds event handlers to body element 
 */

aria.widget.Body.prototype.initBody = function(){

  var body = this;

  var eventClick = function (event){
    body.eventClick(event, body.comboBox);
    };
  this.comboBox.bodyNode.addEventListener('click', eventClick);
  this.comboBox.bodyNode.addEventListener('touchstart', eventClick);

};


/**
 * @method aria.widget.Body.prototype.eventClick
 *
 * @desc
 *     Click event handler for body object
 *     NOTE: The comboBox parameter is needed to provide a reference to the specific
 *           comboBox
 *
 * @param event, combobox
 *     DOM event object and combobox object
 */
aria.widget.Body.prototype.eventClick = function(event, comboBox){

  var type = event.type;

  if (type === 'click' || type === 'touchstart'){
    this.comboBox.closeListBox();
  }
}