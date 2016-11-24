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

var KEYCODE = {
    DOWN: 40,
    LEFT: 37,
    RIGHT: 39,
    SPACE: 32,
    UP: 38
}

window.addEventListener('load', function() {

  var radiobuttons = document.querySelectorAll('[role=radio]');
  var radiogroup = document.querySelectorAll('[role=radiogroup]');

  for(var i = 0; i < radiobuttons.length; i++ ) {
    var rb = radiobuttons[i];
    rb.addEventListener('click', clickRadioGroup);
  }

  for(var i = 0; i < radiogroup.length; i++){
    var rg = radiogroup[i];
    rg.addEventListener('keydown', keyDownRadioGroup);
    rg.addEventListener('focus', focusRadioButton);
    rg.addEventListener('blur', blurRadioButton);
  }

});

/**
* @function firstRadioButton
*
* @desc Returns the first radio button
*/

function firstRadioButton(node) {
  
  var first = node.parentNode.firstChild;
  
  while(first) {
    if (first.nodeType === Node.ELEMENT_NODE) {
      if (first.getAttribute("role") === 'radio') return first;
    }
    first = first.nextSibling;
  }
  
  return null;
}

/**
* @function lastRadioButton
*
* @desc Returns the last radio button
*/

function lastRadioButton(node) {
  
  var last = node.parentNode.lastChild;

  while(last) {
    if (last.nodeType === Node.ELEMENT_NODE) {
      if (last.getAttribute("role") === 'radio') return last;
    }
    last = last.previousSibling;
  }
  
  return last;
}

/**
* @function nextRadioButton
*
* @desc Returns the next radio button
*/

function nextRadioButton(node) {
  
  var next = node.nextSibling;
  
  while(next) {
    if (next.nodeType === Node.ELEMENT_NODE) {
      if (next.getAttribute("role") === 'radio') return next;
    }
    next = next.nextSibling;
  }
  
  return null;
}

/**
* @function previousRadioButton
*
* @desc Returns the previous radio button
*/

function previousRadioButton(node) {
  
  var prev = node.previousSibling;
  
  while(prev) {
    if (prev.nodeType === Node.ELEMENT_NODE) {
      if (prev.getAttribute("role") === 'radio') return prev;
    }
    prev = prev.previousSibling;
  }
  
  return null;
}

/**
* @function getImage
*
* @desc Gets the image for radio box
*/

function getImage(node) {
  
  var child = node.firstChild;
  
  while(child) {
    if (child.nodeType === Node.ELEMENT_NODE) {
      if (child.tagName === 'IMG') return child;
    }
    child = child.nextSibling;
  }
  
  return null;
}

/**
* @function setRadioButton
*
* @desc Toogles the state of a radio button
*/

function setRadioButton(node, state) {
  var image = getImage(node);

  if (state == 'true') {
    node.setAttribute('aria-checked', 'true');
    node.parentNode.setAttribute('aria-activedescendant', node.getAttribute('Id'));
    image.src = './images/radio-checked.png';
    node.className += ' focus';
  }
  else {
    node.setAttribute('aria-checked', 'false')
    image.src = './images/radio-unchecked.png';   
    node.className = node.className.replace(' focus','');
  }  
}

/**
* @function clickRadioGroup
*
* @desc activeates the clicked radio button and deactivates all others.
*/

function clickRadioGroup(event) {
  var type = event.type;
  
  if (type === 'click') {
    // If either enter or space is pressed, execute the funtion

    var node = event.currentTarget;
        
    var radioButton = firstRadioButton(node);

    while (radioButton) {
      setRadioButton(radioButton, "false");
      radioButton = nextRadioButton(radioButton);
    } 

    setRadioButton(node, "true");

    event.preventDefault();
    event.stopPropagation();
  }
}

/*
* @function keyDownRadioGroup
*
* @desc 
*
* @param   {Object}   node  -  DOM node of updated group radio buttons
*/

function keyDownRadioGroup(event) {
  var type = event.type;
  var next = false;
  
  if(type === "keydown"){
    var node = event.currentTarget;
    var activedescendant = node.getAttribute('aria-activedescendant');
    node = document.getElementById(activedescendant);
  
    switch (event.keyCode) {
      case KEYCODE.DOWN:
      case KEYCODE.RIGHT:
        var next = nextRadioButton(node);
        if (!next) next = firstRadioButton(node); //if node is the last node, node cycles to first.
        break;

      case KEYCODE.UP:
      case KEYCODE.LEFT:
        next = previousRadioButton(node);
        if (!next) next = lastRadioButton(node); //if node is the last node, node cycles to first.
        break;
        
      case KEYCODE.SPACE:
        next = document.getElementById(activedescendant);
        break;
    }
    
    if (next) {
      var radioButton = firstRadioButton(node);

      while (radioButton) {
        setRadioButton(radioButton, "false");
        radioButton = nextRadioButton(radioButton);
      } 
      
      setRadioButton(next, "true");

      event.preventDefault();
      event.stopPropagation();
    }
  }  
}

/*
* @function focusRadioButton
*
* @desc Adds focus styling to label element encapsulating standard radio button
*
* @param   {Object}  event  -  Standard W3C event object
*/

function focusRadioButton(event) {
  activedescendant = event.currentTarget.getAttribute('aria-activedescendant');
  document.getElementById(activedescendant).className += ' focus';
}

/*
* @function blurRadioButton
*
* @desc Adds focus styling to the label element encapsulating standard radio button
*
* @param   {Object}  event  -  Standard W3C event object
*/    

function blurRadioButton(event) {
  activedescendant = event.currentTarget.getAttribute('aria-activedescendant');
  document.getElementById(activedescendant).className = document.getElementById(activedescendant).className.replace(' focus','');
}
