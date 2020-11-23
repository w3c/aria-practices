/*
 *   This content is licensed according to the W3C Software License at
 *   https://www.w3.org/Consortium/Legal/2015/copyright-software-and-document
 *
 *   File:   menubar-navigation.js
 *
 *   Desc:   Creates a menubar of hierarchical set of links
 */

'use strict';

var MenubarNavigation = function (domNode) {
  this.domNode = domNode;

  this.popups = [];
  this.menuitemGroups = {};
  this.menuOrientation = {};
  this.isPopup = {};
  this.isPopout = {};
  this.openPopups = false;

  this.firstChars = {}; // see Menubar init method
  this.firstMenuitem = {}; // see Menubar init method
  this.lastMenuitem = {}; // see Menubar init method

  this.initMenu(domNode, 0);

  domNode.addEventListener('focusin', this.handleMenubarFocusin.bind(this));
  domNode.addEventListener('focusout', this.handleMenubarFocusout.bind(this));

  window.addEventListener(
    'mousedown',
    this.handleBackgroundMousedown.bind(this),
    true
  );
};

MenubarNavigation.prototype.getMenuitems = function (domNode, depth) {
  var nodes = [];

  var initMenu = this.initMenu.bind(this);
  var menuitemGroups = this.menuitemGroups;
  var popups = this.popups;

  function findMenuitems(node) {
    var role, flag;

    while (node) {
      flag = true;
      role = node.getAttribute('role');

      if (role) {
        role = role.trim().toLowerCase();
      }

      switch (role) {
        case 'menu':
          node.tabIndex = -1;
          initMenu(node, depth + 1);
          flag = false;
          break;

        case 'menuitem':
          if (node.getAttribute('aria-haspopup') === 'true') {
            popups.push(node);
          }
          nodes.push(node);
          break;

        default:
          break;
      }

      if (
        flag &&
        node.firstElementChild &&
        node.firstElementChild.tagName !== 'svg'
      ) {
        findMenuitems(node.firstElementChild);
      }

      node = node.nextElementSibling;
    }
  }

  findMenuitems(domNode.firstElementChild);

  return nodes;
};

MenubarNavigation.prototype.initMenu = function (menu, depth) {
  var menuitems, menuitem, role, nextElement;

  var menuId = this.getMenuId(menu);

  menuitems = this.getMenuitems(menu, depth);
  this.menuOrientation[menuId] = this.getMenuOrientation(menu);

  this.isPopup[menuId] = menu.getAttribute('role') === 'menu' && depth === 1;
  this.isPopout[menuId] = menu.getAttribute('role') === 'menu' && depth > 1;

  this.menuitemGroups[menuId] = [];
  this.firstChars[menuId] = [];
  this.firstMenuitem[menuId] = null;
  this.lastMenuitem[menuId] = null;

  for (var i = 0; i < menuitems.length; i++) {
    menuitem = menuitems[i];
    role = menuitem.getAttribute('role');

    if (role.indexOf('menuitem') < 0) {
      continue;
    }

    menuitem.tabIndex = -1;
    this.menuitemGroups[menuId].push(menuitem);
    this.firstChars[menuId].push(menuitem.textContent.trim().toLowerCase()[0]);

    menuitem.addEventListener('keydown', this.handleKeydown.bind(this));
    menuitem.addEventListener('click', this.handleMenuitemClick.bind(this));

    menuitem.addEventListener(
      'mouseover',
      this.handleMenuitemMouseover.bind(this)
    );

    if (!this.firstMenuitem[menuId]) {
      if (this.hasPopup(menuitem)) {
        menuitem.tabIndex = 0;
      }
      this.firstMenuitem[menuId] = menuitem;
    }
    this.lastMenuitem[menuId] = menuitem;
  }
};

MenubarNavigation.prototype.setFocusToMenuitem = function (
  menuId,
  newMenuitem
) {
  this.closePopupAll(newMenuitem);

  if (this.menuitemGroups[menuId]) {
    this.menuitemGroups[menuId].forEach(function (item) {
      if (item === newMenuitem) {
        item.tabIndex = 0;
        newMenuitem.focus();
      } else {
        item.tabIndex = -1;
      }
    });
  }
};

MenubarNavigation.prototype.setFocusToFirstMenuitem = function (
  menuId,
  currentMenuitem
) {
  this.setFocusToMenuitem(menuId, this.firstMenuitem[menuId]);
};

MenubarNavigation.prototype.setFocusToLastMenuitem = function (
  menuId,
  currentMenuitem
) {
  this.setFocusToMenuitem(menuId, this.lastMenuitem[menuId]);
};

MenubarNavigation.prototype.setFocusToPreviousMenuitem = function (
  menuId,
  currentMenuitem
) {
  var newMenuitem, index;

  if (currentMenuitem === this.firstMenuitem[menuId]) {
    newMenuitem = this.lastMenuitem[menuId];
  } else {
    index = this.menuitemGroups[menuId].indexOf(currentMenuitem);
    newMenuitem = this.menuitemGroups[menuId][index - 1];
  }

  this.setFocusToMenuitem(menuId, newMenuitem);

  return newMenuitem;
};

MenubarNavigation.prototype.setFocusToNextMenuitem = function (
  menuId,
  currentMenuitem
) {
  var newMenuitem, index;

  if (currentMenuitem === this.lastMenuitem[menuId]) {
    newMenuitem = this.firstMenuitem[menuId];
  } else {
    index = this.menuitemGroups[menuId].indexOf(currentMenuitem);
    newMenuitem = this.menuitemGroups[menuId][index + 1];
  }
  this.setFocusToMenuitem(menuId, newMenuitem);

  return newMenuitem;
};

MenubarNavigation.prototype.setFocusByFirstCharacter = function (
  menuId,
  currentMenuitem,
  char
) {
  var start, index;

  char = char.toLowerCase();

  // Get start index for search based on position of currentItem
  start = this.menuitemGroups[menuId].indexOf(currentMenuitem) + 1;
  if (start >= this.menuitemGroups[menuId].length) {
    start = 0;
  }

  // Check remaining slots in the menu
  index = this.getIndexFirstChars(menuId, start, char);

  // If not found in remaining slots, check from beginning
  if (index === -1) {
    index = this.getIndexFirstChars(menuId, 0, char);
  }

  // If match was found...
  if (index > -1) {
    this.setFocusToMenuitem(menuId, this.menuitemGroups[menuId][index]);
  }
};

// Utilities

MenubarNavigation.prototype.getIndexFirstChars = function (
  menuId,
  startIndex,
  char
) {
  for (var i = startIndex; i < this.firstChars[menuId].length; i++) {
    if (char === this.firstChars[menuId][i]) {
      return i;
    }
  }
  return -1;
};

MenubarNavigation.prototype.isPrintableCharacter = function (str) {
  return str.length === 1 && str.match(/\S/);
};

MenubarNavigation.prototype.getIdFromAriaLabel = function (node) {
  var id = node.getAttribute('aria-label');
  if (id) {
    id = id.trim().toLowerCase().replace(' ', '-').replace('/', '-');
  }
  return id;
};

MenubarNavigation.prototype.getMenuOrientation = function (node) {
  var orientation = node.getAttribute('aria-orientation');

  if (!orientation) {
    var role = node.getAttribute('role');

    switch (role) {
      case 'menubar':
        orientation = 'horizontal';
        break;

      case 'menu':
        orientation = 'vertical';
        break;

      default:
        break;
    }
  }

  return orientation;
};

MenubarNavigation.prototype.getMenuId = function (node) {
  var id = false;
  var role = node.getAttribute('role');

  while (node && role !== 'menu' && role !== 'menubar') {
    node = node.parentNode;
    if (node) {
      role = node.getAttribute('role');
    }
  }

  if (node) {
    id = role + '-' + this.getIdFromAriaLabel(node);
  }

  return id;
};

MenubarNavigation.prototype.getMenu = function (menuitem) {
  var id = false;
  var menu = menuitem;
  var role = menuitem.getAttribute('role');

  while (menu && role !== 'menu' && role !== 'menubar') {
    menu = menu.parentNode;
    if (menu) {
      role = menu.getAttribute('role');
    }
  }

  return menu;
};

// Popup menu methods

MenubarNavigation.prototype.isAnyPopupOpen = function () {
  for (var i = 0; i < this.popups.length; i++) {
    if (this.popups[i].getAttribute('aria-expanded') === 'true') {
      return true;
    }
  }
  return false;
};

MenubarNavigation.prototype.openPopup = function (menuId, menuitem) {
  // set aria-expanded attribute
  var popupMenu = menuitem.nextElementSibling;

  var rect = menuitem.getBoundingClientRect();

  // Set CSS properties
  if (this.isPopup[menuId]) {
    popupMenu.parentNode.style.position = 'relative';
    popupMenu.style.display = 'block';
    popupMenu.style.position = 'absolute';
    popupMenu.style.left = rect.width + 6 + 'px';
    popupMenu.style.top = '0px';
    popupMenu.style.zIndex = 100;
  } else {
    popupMenu.style.display = 'block';
    popupMenu.style.position = 'absolute';
    popupMenu.style.left = '0px';
    popupMenu.style.top = rect.height + 8 + 'px';
    popupMenu.style.zIndex = 100;
  }

  menuitem.setAttribute('aria-expanded', 'true');

  return this.getMenuId(popupMenu);
};

MenubarNavigation.prototype.closePopout = function (menuitem) {
  var menu,
    menuId = this.getMenuId(menuitem),
    cmi = menuitem;

  while (this.isPopup[menuId] || this.isPopout[menuId]) {
    menu = this.getMenu(cmi);
    cmi = menu.previousElementSibling;
    menuId = this.getMenuId(cmi);
    cmi.setAttribute('aria-expanded', 'false');
    menu.style.display = 'none';
  }
  cmi.focus();
  return cmi;
};

MenubarNavigation.prototype.closePopup = function (menuitem) {
  var menu,
    menuId = this.getMenuId(menuitem),
    cmi = menuitem;

  if (this.isMenubar(menuId)) {
    if (this.isOpen(menuitem)) {
      menuitem.setAttribute('aria-expanded', 'false');
      menuitem.nextElementSibling.style.display = 'none';
    }
  } else {
    menu = this.getMenu(menuitem);
    cmi = menu.previousElementSibling;
    cmi.setAttribute('aria-expanded', 'false');
    cmi.focus();
    menu.style.display = 'none';
  }

  return cmi;
};

MenubarNavigation.prototype.doesNotContain = function (popup, menuitem) {
  if (menuitem) {
    return !popup.nextElementSibling.contains(menuitem);
  }
  return true;
};

MenubarNavigation.prototype.closePopupAll = function (menuitem) {
  if (typeof menuitem !== 'object') {
    menuitem = false;
  }
  for (var i = 0; i < this.popups.length; i++) {
    var popup = this.popups[i];
    if (this.doesNotContain(popup, menuitem) && this.isOpen(popup)) {
      var cmi = popup.nextElementSibling;
      if (cmi) {
        popup.setAttribute('aria-expanded', 'false');
        cmi.style.display = 'none';
      }
    }
  }
};

MenubarNavigation.prototype.hasPopup = function (menuitem) {
  return menuitem.getAttribute('aria-haspopup') === 'true';
};

MenubarNavigation.prototype.isOpen = function (menuitem) {
  return menuitem.getAttribute('aria-expanded') === 'true';
};

MenubarNavigation.prototype.isMenubar = function (menuId) {
  return !this.isPopup[menuId] && !this.isPopout[menuId];
};

MenubarNavigation.prototype.isMenuHorizontal = function (menuitem) {
  return this.menuOrientation[menuitem] === 'horizontal';
};

MenubarNavigation.prototype.hasFocus = function () {
  return this.domNode.classList.contains('focus');
};

// Menu event handlers

MenubarNavigation.prototype.handleMenubarFocusin = function (event) {
  // if the menubar or any of its menus has focus, add styling hook for hover
  this.domNode.classList.add('focus');
};

MenubarNavigation.prototype.handleMenubarFocusout = function (event) {
  // remove styling hook for hover on menubar item
  this.domNode.classList.remove('focus');
};

MenubarNavigation.prototype.handleKeydown = function (event) {
  var tgt = event.currentTarget,
    key = event.key,
    flag = false,
    menuId = this.getMenuId(tgt),
    id,
    popupMenuId,
    mi,
    role,
    option,
    value;

  var isAnyPopupOpen = this.isAnyPopupOpen();

  switch (key) {
    case ' ':
    case 'Enter':
      if (this.hasPopup(tgt)) {
        this.openPopups = true;
        popupMenuId = this.openPopup(menuId, tgt);
        this.setFocusToFirstMenuitem(popupMenuId);
      } else {
        if (tgt.href !== '#') {
          this.closePopupAll();
          window.location.href = tgt.href;
        }
      }
      flag = true;
      break;

    case 'Esc':
    case 'Escape':
      this.openPopups = false;
      this.closePopup(tgt);
      flag = true;
      break;

    case 'Up':
    case 'ArrowUp':
      if (this.isMenuHorizontal(menuId)) {
        if (this.hasPopup(tgt)) {
          this.openPopups = true;
          popupMenuId = this.openPopup(menuId, tgt);
          this.setFocusToLastMenuitem(popupMenuId);
        }
      } else {
        this.setFocusToPreviousMenuitem(menuId, tgt);
      }
      flag = true;
      break;

    case 'ArrowDown':
    case 'Down':
      if (this.isMenuHorizontal(menuId)) {
        if (this.hasPopup(tgt)) {
          this.openPopups = true;
          popupMenuId = this.openPopup(menuId, tgt);
          this.setFocusToFirstMenuitem(popupMenuId);
        }
      } else {
        this.setFocusToNextMenuitem(menuId, tgt);
      }
      flag = true;
      break;

    case 'Left':
    case 'ArrowLeft':
      if (this.isMenuHorizontal(menuId)) {
        mi = this.setFocusToPreviousMenuitem(menuId, tgt);
        if (isAnyPopupOpen) {
          this.openPopup(menuId, mi);
        }
      } else {
        if (this.isPopout[menuId]) {
          mi = this.closePopup(tgt);
          id = this.getMenuId(mi);
          mi = this.setFocusToMenuitem(id, mi);
        } else {
          mi = this.closePopup(tgt);
          id = this.getMenuId(mi);
          mi = this.setFocusToPreviousMenuitem(id, mi);
          this.openPopup(id, mi);
        }
      }
      flag = true;
      break;

    case 'Right':
    case 'ArrowRight':
      if (this.isMenuHorizontal(menuId)) {
        mi = this.setFocusToNextMenuitem(menuId, tgt);
        if (isAnyPopupOpen) {
          this.openPopup(menuId, mi);
        }
      } else {
        if (this.hasPopup(tgt)) {
          popupMenuId = this.openPopup(menuId, tgt);
          this.setFocusToFirstMenuitem(popupMenuId);
        } else {
          mi = this.closePopout(tgt);
          id = this.getMenuId(mi);
          mi = this.setFocusToNextMenuitem(id, mi);
          this.openPopup(id, mi);
        }
      }
      flag = true;
      break;

    case 'Home':
    case 'PageUp':
      this.setFocusToFirstMenuitem(menuId, tgt);
      flag = true;
      break;

    case 'End':
    case 'PageDown':
      this.setFocusToLastMenuitem(menuId, tgt);
      flag = true;
      break;

    case 'Tab':
      this.openPopups = false;
      this.closePopup(tgt);
      break;

    default:
      if (this.isPrintableCharacter(key)) {
        this.setFocusByFirstCharacter(menuId, tgt, key);
        flag = true;
      }
      break;
  }

  if (flag) {
    event.stopPropagation();
    event.preventDefault();
  }
};

MenubarNavigation.prototype.handleMenuitemClick = function (event) {
  var tgt = event.currentTarget;
  var menuId = this.getMenuId(tgt);

  if (this.hasPopup(tgt)) {
    if (this.isOpen(tgt)) {
      this.closePopup(tgt);
    } else {
      this.closePopupAll(tgt);
      this.openPopup(menuId, tgt);
    }
    event.stopPropagation();
    event.preventDefault();
  }
};

MenubarNavigation.prototype.handleMenuitemMouseover = function (event) {
  var tgt = event.currentTarget;
  var menuId = this.getMenuId(tgt);

  if (this.hasFocus()) {
    this.setFocusToMenuitem(menuId, tgt);
  }

  if (this.isAnyPopupOpen() || this.hasFocus()) {
    this.closePopupAll(tgt);
    if (this.hasPopup(tgt)) {
      this.openPopup(menuId, tgt);
    }
  }
};

MenubarNavigation.prototype.handleBackgroundMousedown = function (event) {
  if (!this.domNode.contains(event.target)) {
    this.closePopupAll();
  }
};

// Initialize menubar editor

window.addEventListener('load', function () {
  var menubarNavs = document.querySelectorAll('.menubar-navigation');
  for (var i = 0; i < menubarNavs.length; i++) {
    var menubarNav = new MenubarNavigation(menubarNavs[i]);
  }
});
