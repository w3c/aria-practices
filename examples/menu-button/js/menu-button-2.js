/*
 * Copyright 2011-2014 OpenAjax Alliance
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
 * ARIA Menu Button example
 * @function onload
 * @desc  after page has loaded initializ all menu buttons based on the selector "[aria-haspopup][aria-controls]"
 */

window.addEventListener('load', function () {

  var menuButtons = document.querySelectorAll('[aria-haspopup][aria-controls]');

  [].forEach.call(menuButtons, function (menuButton) {
      if (menuButton &&
          (menuButton.tagName.toLowerCase() === 'button') || (menuButton.getAttribute('role').toLowerCase() === 'button')) {
      var mb = new aria.widget.MenuButton(menuButton);
      mb.initMenuButton();
    }
  });
});

/**
 * @namespace aria
 */

  var aria = aria || {};

/* ---------------------------------------------------------------- */
/*                  ARIA Utils Namespace                        */
/* ---------------------------------------------------------------- */

/**
 * @constructor Menu
 *
 * @memberOf aria.Utils
 *
 * @desc  Computes absolute position of an element
 */

aria.Utils = aria.Utils || {};

aria.Utils.findPos = function (element) {
    var xPosition = 0;
    var yPosition = 0;

    while(element) {
        xPosition += (element.offsetLeft - element.scrollLeft + element.clientLeft);
        yPosition += (element.offsetTop - element.scrollTop + element.clientTop);
        element = element.offsetParent;
    }
    return { x: xPosition, y: yPosition };
};


/* ---------------------------------------------------------------- */
/*                  ARIA Widget Namespace                        */
/* ---------------------------------------------------------------- */

aria.widget = aria.widget || {};


/* ---------------------------------------------------------------- */
/*                  Menu Button Widget                           */
/* ---------------------------------------------------------------- */

/**
 * @constructor Menu
 *
 * @memberOf aria.Widget
 *
 * @desc  Creates a Menu Button widget using ARIA
 */

aria.widget.Menu = function (node, menuButton) {

   this.keyCode = Object.freeze({
     'TAB' : 9,
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

  // Check fo DOM element node
  if (typeof node !== 'object' || !node.getElementsByClassName) return false;

  this.menuNode   = node;
  node.tabIndex = -1;

  this.menuButton = menuButton;

  this.firstMenuItem = false;
  this.lastMenuItem = false;

};

/**
 * @method initMenu
 *
 * @memberOf aria.widget.Menu
 *
 * @desc  Adds event listeners to menu elements
 */

aria.widget.Menu.prototype.initMenu = function () {

    var menu = this;
    var eventMouseOver = function (event) {
      menu.eventMouseOver(event, menu);
      };
    this.menuNode.addEventListener('mouseover',   eventMouseOver);

    var eventMouseOut = function (event) {
      menu.eventMouseOut(event, menu);
    };
    this.menuNode.addEventListener('mouseout',   eventMouseOut);

    var cn = this.menuNode.firstChild;

    while (cn) {
      if (cn.nodeType === Node.ELEMENT_NODE) {
        if (cn.getAttribute('role')  === 'menuitem') {
          cn.tabIndex = -1;
          if (!this.firstMenuItem) this.firstMenuItem = cn;
          this.lastMenuItem = cn;

          var eventKeyDown = function (event) {
            menu.eventKeyDown(event, menu);
          };
          cn.addEventListener('keydown', eventKeyDown);
        }
      }
      cn = cn.nextSibling;
    }


};

/**
 * @method nextMenuItem
 *
 * @memberOf aria.widget.Menu
 *
 * @desc  Moves focus to next menuItem
 */

aria.widget.Menu.prototype.nextMenuItem = function (currentMenuItem) {

  var mi = currentMenuItem.nextSibling;

  console.log('[MENU][nextMenuItem]: ' + mi);

  while (mi) {
    if ((mi.nodeType === Node.ELEMENT_NODE) &&
      (mi.getAttribute('role')  === 'menuitem')) {
      mi.focus();
      break;
    }
    mi = mi.nextSibling;
  }

  if (!mi && this.firstMenuItem) {
    this.firstMenuItem.focus();
  }
};

/**
 * @method previousMenuItem
 *
 * @memberOf aria.widget.Menu
 *
 * @desc  Moves focus to previous menuItem
 */

aria.widget.Menu.prototype.previousMenuItem = function (currentMenuItem) {

  var mi = currentMenuItem.previousSibling;

  while (mi) {
    if (mi.nodeType === Node.ELEMENT_NODE && mi.getAttribute('role')  === 'menuitem') {
      mi.focus();
      break;
    }
    mi = mi.previousSibling;
  }

  if (!mi && this.lastMenuItem) {
    this.lastMenuItem.focus();
  }
};


/**
 * @method eventKeyDown
 *
 * @memberOf aria.widget.Menu
 *
 * @desc  Keydown event handler for Menu Object
 *        NOTE: The menu parameter is needed to provide a reference to the specific
 *               menu
 */

aria.widget.Menu.prototype.eventKeyDown = function (event, menu) {

  var ct = event.currentTarget;
  var flag = false;

  switch(event.keyCode) {

  case menu.keyCode.SPACE:
  case menu.keyCode.RETURN:
      var click_event = new MouseEvent('click', {
        'view': window,
        'bubbles': true,
        'cancelable': true
      });
      ct.dispatchEvent(click_event);
    menu.menuButton.closeMenu();
    flag = true;
    break;

  case menu.keyCode.ESC:
    menu.menuButton.closeMenu();
    menu.menuButton.buttonNode.focus();
    flag = true;
    break;

  case menu.keyCode.UP:
  case menu.keyCode.LEFT:
    menu.previousMenuItem(ct);
    flag = true;
    break;

  case menu.keyCode.DOWN:
  case menu.keyCode.RIGHT:
    menu.nextMenuItem(ct);
    flag = true;
    break;

  case menu.keyCode.TAB:
    menu.menuButton.closeMenu();
    break;

  default:
    break;
  }


  if (flag) {
    event.stopPropagation();
    event.preventDefault();
  }

};

/**
 * @method eventMouseOver
 *
 * @memberOf aria.widget.Menu
 *
 * @desc  Opens the menu on mouseover
 *        NOTE: The menu parameter is needed to provide a reference to the specific
 *               menu
 */

aria.widget.Menu.prototype.eventMouseOver = function (event, menu) {

  menu.mouseInMenu = true;
  menu.menuButton.openMenu();

};

/**
 * @method eventMouseOut
 *
 * @memberOf aria.widget.Menu
 *
 * @desc  Closes the menu on mouseout
 *        NOTE: The menu parameter is needed to provide a reference to the specific
 *               menu
 */

aria.widget.Menu.prototype.eventMouseOut = function (event, menu) {

  menu.mouseInMenu = false;
  setTimeout(function () { menu.menuButton.closeMenu() }, 500);

};

/* ---------------------------------------------------------------- */
/*                  Menu Button Widget                           */
/* ---------------------------------------------------------------- */

/**
 * @constructor Menu Button
 *
 * @memberOf aria.Widget
 *
 * @desc  Creates a Menu Button widget using ARIA
 */

aria.widget.MenuButton = function (node) {

  this.keyCode = Object.freeze({
     'TAB' : 9,
     'RETURN' : 13,
     'ESC' : 27,
     'SPACE' : 32,
     'UP' : 38,
     'DOWN' : 40
  });

  // Check fo DOM element node
  if (typeof node !== 'object' || !node.getElementsByClassName) return false;

  this.done = true;
  this.mouseInMouseButton = false;
  this.buttonNode = node;
  this.isLink = false;

  if (node.tagName.toLowerCase() === 'a') {
    var url = node.getAttribute('href');
    if (url && url.length && (url.length > 0)) {
      this.isLink = true;
    }
  }

};

/**
 * @method initMenuButton
 *
 * @memberOf aria.widget.MenuButton
 *
 * @desc  Adds event handlers to button elements
 */

aria.widget.MenuButton.prototype.initMenuButton = function () {

  var id = this.buttonNode.getAttribute('aria-controls');

  if (id) {
    this.menuNode = document.getElementById(id);

    if (this.menuNode) {
      this.menu = new aria.widget.Menu(this.menuNode, this);
        this.menu.initMenu();
    }
  }


  this.closeMenu();

    var menuButton = this;
    var eventKeyDown = function (event) {
      menuButton.eventKeyDown(event, menuButton);
    };
    this.buttonNode.addEventListener('keydown',   eventKeyDown);

    var eventMouseOver = function (event) {
      menuButton.eventMouseOver(event, menuButton);
    };
    this.buttonNode.addEventListener('mouseover',   eventMouseOver);

    var eventMouseOut = function (event) {
      menuButton.eventMouseOut(event, menuButton);
    };
    this.buttonNode.addEventListener('mouseout',   eventMouseOut);
};

/**
 * @method openMenu
 *
 * @memberOf aria.widget.MenuButton
 *
 * @desc  Opens the menu
 */

aria.widget.MenuButton.prototype.openMenu = function () {

  if (this.menuNode) {
    var pos = aria.Utils.findPos(this.buttonNode);
    var br = this.buttonNode.getBoundingClientRect();

    this.menuNode.style.display = 'block';
    this.menuNode.style.position = 'absolute';
    this.menuNode.style.top  = (pos.y + br.height) + 'px';
    this.menuNode.style.left = pos.x + 'px'; ;
  }
};

/**
 * @method closeMenu
 *
 * @memberOf aria.widget.MenuButton
 *
 * @desc  Close the menu
 */

aria.widget.MenuButton.prototype.closeMenu = function () {

  if (!this.mouseInMenuButton &&
    !this.menu.mouseInMenu &&
    this.menuNode) {
      this.menuNode.style.display = 'none';
      this.buttonNode.focus();
  }

};

/**
 * @method toggleMenu
 *
 * @memberOf aria.widget.MenuButton
 *
 * @desc  Close or open the menu depending on current state
 */

aria.widget.MenuButton.prototype.toggleMenu = function () {

  if (this.menuNode) {
    if (this.menuNode.style.display === 'block') this.menuNode.style.display = 'none';
    else this.menuNode.style.display = 'block';
  }

};

/**
 * @method moveFocusToFirstMenuItem
 *
 * @memberOf aria.widget.MenuButton
 *
 * @desc  Move keyboard focus to first menu item
 */

aria.widget.MenuButton.prototype.moveFocusToFirstMenuItem = function () {

  if (this.menu.firstMenuItem) {
    this.openMenu();
    this.menu.firstMenuItem.focus();
  }

};

/**
 * @method moveFocusToLastMenuItem
 *
 * @memberOf aria.widget.MenuButton
 *
 * @desc  Move keyboard focus to first menu item
 */

aria.widget.MenuButton.prototype.moveFocusToLastMenuItem = function () {

  if (this.menu.lastMenuItem) {
    this.openMenu();
    this.menu.lastMenuItem.focus();
  }

};

/**
 * @method eventKeyDown
 *
 * @memberOf aria.widget.MenuButton
 *
 * @desc  Keydown event handler for MenuButton Object
 *        NOTE: The menuButton parameter is needed to provide a reference to the specific
 *               menuButton
 */

aria.widget.MenuButton.prototype.eventKeyDown = function (event, menuButton) {

  var flag = false;

  switch(event.keyCode) {

  case menuButton.keyCode.SPACE:
    menuButton.moveFocusToFirstMenuItem();
    flag = true;
    break;

  case menuButton.keyCode.RETURN:
    menuButton.moveFocusToFirstMenuItem();
      flag = true;
    break;

  case menuButton.keyCode.UP:
    menuButton.moveFocusToLastMenuItem();
    flag = true;
    break;

  case menuButton.keyCode.DOWN:
    menuButton.moveFocusToFirstMenuItem();
    flag = true;
    break;

  case menuButton.keyCode.TAB:
    menuButton.closeMenu();
    break;

  default:
      break;
    }

  if (flag) {
    event.stopPropagation();
    event.preventDefault();
  }

};

/**
 * @method eventMouseOver
 *
 * @memberOf aria.widget.MenuButton
 *
 * @desc  Opens the menu on mouseover
 *        NOTE: The menuButton parameter is needed to provide a reference to the specific
 *               menuButton
 */

aria.widget.MenuButton.prototype.eventMouseOver = function (event, menuButton) {

  menuButton.mouseInMenuButton = true;
  menuButton.openMenu();

};

/**
 * @method eventMouseOut
 *
 * @memberOf aria.widget.MenuButton
 *
 * @desc  Closes the menu on mouseout
 *        NOTE: The menuButton parameter is needed to provide a reference to the specific
 *               menuButton
 */

aria.widget.MenuButton.prototype.eventMouseOut = function (event, menuButton) {

  menuButton.mouseInMenuButton = false;
  setTimeout(function () { menuButton.closeMenu() }, 500);

};
