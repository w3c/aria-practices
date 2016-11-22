/*
*   Copyright 2016 University of Illinois
*
*   Licensed under the Apache License, Version 2.0 (the "License");
*   you may not use this file except in compliance with the License.
*   You may obtain a copy of the License at
*
*       http://www.apache.org/licenses/LICENSE-2.0
*
*   Unless required by applicable law or agreed to in writing, software
*   distributed under the License is distributed on an "AS IS" BASIS,
*   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
*   See the License for the specific language governing permissions and
*   limitations under the License.
*
*   File:   MenuItemLinks.js
*
*   Desc:   Popup Menu Menuitem widget that implements ARIA Authoring Practices
*
*   Author: Jon Gunderson, Ku Ja Eun and Nicholas Hoyt
*/

/*
*   @constructor MenuItemLinks
*
*   @desc
*       Wrapper object for a simple menu item in a popup menu
*
*   @param domNode
*       The DOM element node that serves as the menu item container.
*       The menuObj PopupMenu is responsible for checking that it has
*       requisite metadata, e.g. role="menuitem".
*
*   @param menuObj
*       The object that is a wrapper for the PopupMenu DOM element that
*       contains the menu item DOM element. See PopupMenu.js
*/
var MenuItemLinks = function( domNode, menuObj ) {

  this.domNode = domNode;
  this.menu = menuObj;

  this.keyCode = Object.freeze( {
    "TAB":  9,
    "RETURN": 13,
    "ESC": 27,
    "SPACE": 32,
    "PAGEUP": 33,
    "PAGEDOWN": 34,
    "END": 35,
    "HOME": 36,
    "LEFT": 37,
    "UP": 38,
    "RIGHT": 39,
    "DOWN": 40
  } );
};

MenuItemLinks.prototype.init = function() {
  this.domNode.tabIndex = -1;

  if ( !this.domNode.getAttribute( "role" ) ) {
    this.domNode.setAttribute( "role", "menuitem" );
  }

  this.domNode.addEventListener( "keydown",    this.handleKeydown.bind( this ) );
  this.domNode.addEventListener( "keypress",   this.handleKeypress.bind( this ) );
  this.domNode.addEventListener( "click",      this.handleClick.bind( this ) );
  this.domNode.addEventListener( "focus",      this.handleFocus.bind( this ) );
  this.domNode.addEventListener( "blur",       this.handleBlur.bind( this ) );
  this.domNode.addEventListener( "mouseover",  this.handleMouseover.bind( this ) );
  this.domNode.addEventListener( "mouseout",   this.handleMouseout.bind( this ) );

};

/* EVENT HANDLERS */

MenuItemLinks.prototype.handleKeydown = function( event ) {
  var tgt = event.currentTarget,
      flag = false, clickEvent;

//  Console.log("[MenuItemLinks][handleKeydown]: " + event.keyCode + " " + this.menu)

  switch ( event.keyCode ) {
    case this.keyCode.SPACE:
    case this.keyCode.RETURN:
      // Create simulated mouse event to mimic the behavior of ATs
      // and let the event handler handleClick do the housekeeping.
      try {
        clickEvent = new MouseEvent( "click", {
          "view": window,
          "bubbles": true,
          "cancelable": true
        } );
      }
      catch ( err ) {
        if ( document.createEvent ) {
          // DOM Level 3 for IE 9+
          clickEvent = document.createEvent( "MouseEvents" );
          clickEvent.initEvent( "click", true, true );
        }
      }
      tgt.dispatchEvent( clickEvent );
      flag = true;
      break;

    case this.keyCode.ESC:
      this.menu.setFocusToController();
      this.menu.close( true );
      flag = true;
      break;

    case this.keyCode.UP:
      this.menu.setFocusToPreviousItem( this );
      flag = true;
      break;

    case this.keyCode.DOWN:
      this.menu.setFocusToNextItem( this );
      flag = true;
      break;

    case this.keyCode.LEFT:
      this.menu.setFocusToController( "previous" );
      this.menu.close( true );
      flag = true;
      break;

    case this.keyCode.RIGHT:
      this.menu.setFocusToController( "next" );
      this.menu.close( true );
      flag = true;
      break;

    case this.keyCode.HOME:
    case this.keyCode.PAGEUP:
      this.menu.setFocusToFirstItem();
      flag = true;
      break;

    case this.keyCode.END:
    case this.keyCode.PAGEDOWN:
      this.menu.setFocusToLastItem();
      flag = true;
      break;

    case this.keyCode.TAB:
      this.menu.setFocusToController();
      this.menu.close( true );
      break;

    default:
      break;
  }

  if ( flag ) {
    event.stopPropagation();
    event.preventDefault();
  }
};

MenuItemLinks.prototype.handleKeypress = function( event ) {
  var char = String.fromCharCode( event.charCode );

  function isPrintableCharacter ( str ) {
    return str.length === 1 && str.match( /\S/ );
  }

  if ( isPrintableCharacter( char ) ) {
    this.menu.setFocusByFirstCharacter( this, char );
  }
};

MenuItemLinks.prototype.handleClick = function( event ) {
  this.menu.setFocusToController();
  this.menu.close( true );
};

MenuItemLinks.prototype.handleFocus = function( event ) {
  this.menu.hasFocus = true;
};

MenuItemLinks.prototype.handleBlur = function( event ) {
  this.menu.hasFocus = false;
  setTimeout( this.menu.close.bind( this.menu, false ), 300 );
};

MenuItemLinks.prototype.handleMouseover = function( event ) {
  this.menu.hasHover = true;
  this.menu.open();

};

MenuItemLinks.prototype.handleMouseout = function( event ) {
  this.menu.hasHover = false;
  setTimeout( this.menu.close.bind( this.menu, false ), 300 );
};
