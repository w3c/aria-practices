/*
 *   This content is licensed according to the W3C Software License at
 *   https://www.w3.org/Consortium/Legal/2015/copyright-software-and-document
 *
 *   File:  jumpto.js
 *
 *   Desc:   Jump to provides keyboard navigation to document structure
 *           to support the bypass block requirement of WCAG 2.x
 *           This feature is based on the ARIA APG menu button example
 *           NOTE: This code has been contributed to the SkipTo.js project
 */

'use strict';

(function () {
  var JumpTo = {
    jumpToId: 'is-jump-to-js-1',
    domNode: null,
    buttonNode: null,
    menuNode: null,
    menuitemNodes: [],
    firstMenuitem: false,
    lastMenuitem: false,
    firstChars: [],
    headingLevels: [],
    jumpToIdIndex: 1,
    usesAltKey: false,
    usesOptionKey: false,
    contentSelector:
      'h1, h2, h3, h4, h5, h6, p, li, img, input, select, textarea',
    // Default configuration values
    config: {
      // Feature switches
      enableHeadingLevelShortcuts: true,
      enableHelp: true,
      // Customization of button and menu
      altAccesskey: '0', // default is the number zero
      optionAccesskey: 'º', // default is the character associated with option+0
      displayOption: 'static', // options: static (default), popup
      // container element, use containerClass for custom styling
      containerElement: 'div',
      containerRole: '',
      customClass: '',

      // Button labels and messages
      altLabel: 'Alt',
      optionLabel: 'Option',
      buttonShortcut: ' ($modifier+$key)',
      buttonLabel: 'Jump To Content',
      windowButtonAriaLabel: 'Jump To Content, shortcut Alt plus $key',
      macButtonAriaLabel: 'Jump To Content, shortcut Command plus $key',

      // Menu labels and messages
      menuLabel: 'Landmarks and Headings',
      landmarkGroupLabel: 'Landmarks',
      headingGroupLabel: 'Headings',
      headingLevelLabel: 'Heading level',
      mainLabel: 'main',
      searchLabel: 'search',
      navLabel: 'navigation',
      regionLabel: 'region',
      asideLabel: 'aside',
      footerLabel: 'footer',
      headerLabel: 'header',
      formLabel: 'form',
      msgNoLandmarksFound: 'No landmarks found',
      msgNoHeadingsFound: 'No headings found',

      // Selectors for landmark and headings sections
      landmarks: 'main, nav:first-of-type',
      headings: 'main h1, [role="main"] h1, main h2, [role="main"] h2',

      // Custom CSS position and colors
      colorTheme: '',
      positionLeft: '',
      menuTextColor: '',
      menuBackgroundColor: '',
      menuitemFocusTextColor: '',
      menuitemFocusBackgroundColor: '',
      focusBorderColor: '',
      buttonTextColor: '',
      buttonBackgroundColor: '',
    },
    colorThemes: {
      default: {
        positionLeft: '',
        menuTextColor: '#000',
        menuBackgroundColor: '#def',
        menuitemFocusTextColor: '#fff',
        menuitemFocusBackgroundColor: '#005a9c',
        focusBorderColor: '#005a9c',
        buttonTextColor: '#005a9c',
        buttonBackgroundColor: '#ddd',
      },
    },
    defaultCSS:
      'body nav:nth-child(2) {padding-top: 12px}.jump-to.popup{position:absolute;top:-30em;left:0}.jump-to,.jump-to.popup.focus{position:absolute;top:0;left:$positionLeft}.jump-to.fixed{position:fixed}.jump-to button{position:relative;margin:0;padding:6px 8px 6px 8px;border-width:0 1px 1px 1px;border-style:solid;border-radius:0 0 6px 6px;border-color:$buttonBackgroundColor;color:$menuTextColor;background-color:$buttonBackgroundColor;font-size: 14px; z-index:200}.jump-to [role=menu]{position:absolute;min-width:17em;display:none;margin:0;padding:.25rem;background-color:$menuBackgroundColor;border-width:2px;border-style:solid;border-color:$focusBorderColor;border-radius:5px;z-index:1000}.jump-to [role=group]{display:grid;grid-auto-rows:min-content;grid-row-gap:1px}.jump-to [role=separator]:first-child{border-radius:5px 5px 0 0}.jump-to [role=menuitem]{padding:3px;width:auto;border-width:0;border-style:solid;color:$menuTextColor;background-color:$menuBackgroundColor;z-index:1000;display:grid;overflow-y:auto;grid-template-columns:repeat(6,1.2rem) 1fr;grid-column-gap:2px;font-size:1em}.jump-to [role=menuitem] .label,.jump-to [role=menuitem] .level{font-size:90%;font-weight:400;color:$menuTextColor;display:inline-block;background-color:$menuBackgroundColor;line-height:inherit;display:inline-block}.jump-to [role=menuitem] .level{text-align:right;padding-right:4px}.jump-to [role=menuitem] .label{text-align:left;margin:0;padding:0;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.jump-to [role=menuitem] .label:first-letter,.jump-to [role=menuitem] .level:first-letter{text-decoration:underline;text-transform:uppercase}.jump-to [role=menuitem].jump-to-h1 .level{grid-column:1}.jump-to [role=menuitem].jump-to-h2 .level{grid-column:2}.jump-to [role=menuitem].jump-to-h3 .level{grid-column:3}.jump-to [role=menuitem].jump-to-h4 .level{grid-column:4}.jump-to [role=menuitem].jump-to-h5 .level{grid-column:5}.jump-to [role=menuitem].jump-to-h6 .level{grid-column:8}.jump-to [role=menuitem].jump-to-h1 .label{grid-column:2/8}.jump-to [role=menuitem].jump-to-h2 .label{grid-column:3/8}.jump-to [role=menuitem].jump-to-h3 .label{grid-column:4/8}.jump-to [role=menuitem].jump-to-h4 .label{grid-column:5/8}.jump-to [role=menuitem].jump-to-h5 .label{grid-column:6/8}.jump-to [role=menuitem].jump-to-h6 .label{grid-column:7/8}.jump-to [role=menuitem].jump-to-h1.no-level .label{grid-column:1/8}.jump-to [role=menuitem].jump-to-h2.no-level .label{grid-column:2/8}.jump-to [role=menuitem].jump-to-h3.no-level .label{grid-column:3/8}.jump-to [role=menuitem].jump-to-h4.no-level .label{grid-column:4/8}.jump-to [role=menuitem].jump-to-h5.no-level .label{grid-column:5/8}.jump-to [role=menuitem].jump-to-h6.no-level .label{grid-column:6/8}.jump-to [role=menuitem].jump-to-nesting-level-1 .nesting{grid-column:1}.jump-to [role=menuitem].jump-to-nesting-level-2 .nesting{grid-column:2}.jump-to [role=menuitem].jump-to-nesting-level-3 .nesting{grid-column:3}.jump-to [role=menuitem].jump-to-nesting-level-0 .label{grid-column:1/8}.jump-to [role=menuitem].jump-to-nesting-level-1 .label{grid-column:2/8}.jump-to [role=menuitem].jump-to-nesting-level-2 .label{grid-column:3/8}.jump-to [role=menuitem].jump-to-nesting-level-3 .label{grid-column:4/8}.jump-to [role=menuitem].action .label,.jump-to [role=menuitem].no-items .label{grid-column:1/8}.jump-to [role=separator]{margin:1px 0 1px 0;padding:3px;display:block;width:auto;font-weight:700;border-bottom-width:1px;border-bottom-style:solid;border-bottom-color:$menuTextColor;background-color:$menuBackgroundColor;color:$menuTextColor;z-index:1000}.jump-to [role=separator]:first-child{border-radius:5px 5px 0 0}.jump-to [role=menuitem].last{border-radius:0 0 5px 5px}.jump-to.focus{display:block}.jump-to button:focus,.jump-to button:hover{background-color:$menuBackgroundColor;color:$menuTextColor;outline:0}.jump-to button:focus,.jump-to button:hover{padding:4px 7px 5px 7px;border-width:2px;border-color:$focusBorderColor}.jump-to [role=menuitem]:focus{padding:1px;border-width:2px;border-style:solid;border-color:$focusBorderColor;background-color:$menuitemFocusBackgroundColor;color:$menuitemFocusTextColor;outline:0}.jump-to [role=menuitem]:focus .label,.jump-to [role=menuitem]:focus .level{background-color:$menuitemFocusBackgroundColor;color:$menuitemFocusTextColor}',

    //
    // Functions related to configuring the features
    // of jumpTo
    //
    isNotEmptyString: function (str) {
      return typeof str === 'string' && str.length;
    },
    isEmptyString: function (str) {
      return typeof str !== 'string' || str.length === 0;
    },
    init: function (config) {
      var node;

      let platform = navigator.platform.toLowerCase();
      let userAgent = navigator.userAgent.toLowerCase();

      let hasWin = platform.indexOf('win') >= 0;
      let hasMac = platform.indexOf('mac') >= 0;
      let hasLinux =
        platform.indexOf('linux') >= 0 || platform.indexOf('bsd') >= 0;

      let hasAndroid = userAgent.indexOf('android') >= 0;

      this.usesAltKey = hasWin || (hasLinux && !hasAndroid);
      this.usesOptionKey = hasMac;

      // Check if jumpto is already loaded
      if (document.querySelector('style#' + this.jumpToId)) {
        return;
      }

      var attachElement = document.body;
      if (config) {
        this.setUpConfig(config);
      }
      if (typeof this.config.attachElement === 'string') {
        node = document.querySelector(this.config.attachElement);
        if (node && node.nodeType === Node.ELEMENT_NODE) {
          attachElement = node;
        }
      }
      this.addCSSColors();
      this.renderStyleElement(this.defaultCSS);
      var elem = this.config.containerElement.toLowerCase().trim();
      if (!this.isNotEmptyString(elem)) {
        elem = 'div';
      }
      this.domNode = document.createElement(elem);
      this.domNode.classList.add('jump-to');
      if (this.isNotEmptyString(this.config.customClass)) {
        this.domNode.classList.add(this.config.customClass);
      }
      if (this.isNotEmptyString(this.config.containerRole)) {
        this.domNode.setAttribute('role', this.config.containerRole);
      }
      var displayOption = this.config.displayOption;
      if (typeof displayOption === 'string') {
        displayOption = displayOption.trim().toLowerCase();
        if (displayOption.length) {
          switch (this.config.displayOption) {
            case 'fixed':
              this.domNode.classList.add('fixed');
              break;
            case 'onfocus': // Legacy option
            case 'popup':
              this.domNode.classList.add('popup');
              break;
            default:
              break;
          }
        }
      }
      // Place skip to at the beginning of the document
      if (attachElement.firstElementChild) {
        attachElement.insertBefore(
          this.domNode,
          attachElement.firstElementChild
        );
      } else {
        attachElement.appendChild(this.domNode);
      }
      this.buttonNode = document.createElement('button');

      let label = this.config.buttonLabel;
      let buttonShortcut = '';
      let ariaLabel = '';

      if (this.usesAltKey || this.usesOptionKey) {
        buttonShortcut = this.config.buttonShortcut.replace(
          '$key',
          this.config.altAccesskey
        );
      }
      if (this.usesAltKey) {
        buttonShortcut = buttonShortcut.replace(
          '$modifier',
          this.config.altLabel
        );
        ariaLabel = this.config.windowButtonAriaLabel.replace(
          '$key',
          this.config.altAccesskey
        );
      }
      if (this.usesOptionKey) {
        buttonShortcut = buttonShortcut.replace(
          '$modifier',
          this.config.optionLabel
        );
        ariaLabel = this.config.macButtonAriaLabel.replace(
          '$key',
          this.config.altAccesskey
        );
      }
      this.buttonNode.textContent = label;
      if (ariaLabel.length) {
        this.buttonNode.textContent += buttonShortcut;
        this.buttonNode.setAttribute('aria-label', ariaLabel);
      }
      this.buttonNode.setAttribute('aria-haspopup', 'true');
      this.buttonNode.setAttribute('aria-expanded', 'false');

      this.domNode.appendChild(this.buttonNode);

      this.menuNode = document.createElement('div');
      this.domNode.appendChild(this.menuNode);
      this.buttonNode.addEventListener(
        'keydown',
        this.handleButtonKeydown.bind(this)
      );
      this.buttonNode.addEventListener(
        'click',
        this.handleButtonClick.bind(this)
      );
      // Support shortcut key
      if (this.usesAltKey || this.usesOptionKey) {
        document.addEventListener(
          'keydown',
          this.handleDocumentKeydown.bind(this)
        );
      }

      this.domNode.addEventListener('focusin', this.handleFocusin.bind(this));
      this.domNode.addEventListener('focusout', this.handleFocusout.bind(this));
      window.addEventListener(
        'pointerdown',
        this.handleBackgroundPointerdown.bind(this),
        true
      );
    },

    updateStyle: function (stylePlaceholder, value, defaultValue) {
      if (typeof value !== 'string' || value.length === 0) {
        value = defaultValue;
      }
      var index1 = this.defaultCSS.indexOf(stylePlaceholder);
      var index2 = index1 + stylePlaceholder.length;
      while (index1 >= 0 && index2 < this.defaultCSS.length) {
        this.defaultCSS =
          this.defaultCSS.substring(0, index1) +
          value +
          this.defaultCSS.substring(index2);
        index1 = this.defaultCSS.indexOf(stylePlaceholder, index2);
        index2 = index1 + stylePlaceholder.length;
      }
    },
    addCSSColors: function () {
      var theme = this.colorThemes['default'];
      if (typeof this.colorThemes[this.config.colorTheme] === 'object') {
        theme = this.colorThemes[this.config.colorTheme];
      }
      this.updateStyle(
        '$positionLeft',
        this.config.positionLeft,
        theme.positionLeft
      );

      this.updateStyle(
        '$menuTextColor',
        this.config.menuTextColor,
        theme.menuTextColor
      );
      this.updateStyle(
        '$menuBackgroundColor',
        this.config.menuBackgroundColor,
        theme.menuBackgroundColor
      );

      this.updateStyle(
        '$menuitemFocusTextColor',
        this.config.menuitemFocusTextColor,
        theme.menuitemFocusTextColor
      );
      this.updateStyle(
        '$menuitemFocusBackgroundColor',
        this.config.menuitemFocusBackgroundColor,
        theme.menuitemFocusBackgroundColor
      );

      this.updateStyle(
        '$focusBorderColor',
        this.config.focusBorderColor,
        theme.focusBorderColor
      );

      this.updateStyle(
        '$buttonTextColor',
        this.config.buttonTextColor,
        theme.buttonTextColor
      );
      this.updateStyle(
        '$buttonBackgroundColor',
        this.config.buttonBackgroundColor,
        theme.buttonBackgroundColor
      );
    },
    setUpConfig: function (appConfig) {
      var localConfig = this.config,
        name,
        appConfigSettings =
          typeof appConfig.settings !== 'undefined'
            ? appConfig.settings.jumpTo
            : {};
      for (name in appConfigSettings) {
        //overwrite values of our local config, based on the external config
        if (
          typeof localConfig[name] !== 'undefined' &&
          ((typeof appConfigSettings[name] === 'string' &&
            appConfigSettings[name].length > 0) ||
            typeof appConfigSettings[name] === 'boolean')
        ) {
          localConfig[name] = appConfigSettings[name];
        } else {
          throw new Error(
            '** JumpTo Problem with user configuration option "' + name + '".'
          );
        }
      }
    },
    renderStyleElement: function (cssString) {
      var styleNode = document.createElement('style');
      var headNode = document.getElementsByTagName('head')[0];
      var css = document.createTextNode(cssString);

      styleNode.setAttribute('type', 'text/css');
      // ID is used to test whether jumpto is already loaded
      styleNode.id = this.jumpToId;
      styleNode.appendChild(css);
      headNode.appendChild(styleNode);
    },

    //
    // Functions related to creating and populating the
    // the popup menu
    //

    getFirstChar: function (menuitem) {
      var c = '';
      var label = menuitem.querySelector('.label');
      if (label && this.isNotEmptyString(label.textContent)) {
        c = label.textContent.trim()[0].toLowerCase();
      }
      return c;
    },

    getHeadingLevelFromAttribute: function (menuitem) {
      var level = '';
      if (menuitem.hasAttribute('data-level')) {
        level = menuitem.getAttribute('data-level');
      }
      return level;
    },

    updateKeyboardShortCuts: function () {
      var mi;
      this.firstChars = [];
      this.headingLevels = [];

      for (var i = 0; i < this.menuitemNodes.length; i += 1) {
        mi = this.menuitemNodes[i];
        this.firstChars.push(this.getFirstChar(mi));
        this.headingLevels.push(this.getHeadingLevelFromAttribute(mi));
      }
    },

    updateMenuitems: function () {
      var menuitemNodes = this.menuNode.querySelectorAll('[role=menuitem');

      this.menuitemNodes = [];
      for (var i = 0; i < menuitemNodes.length; i += 1) {
        this.menuitemNodes.push(menuitemNodes[i]);
      }

      this.firstMenuitem = this.menuitemNodes[0];
      this.lastMenuitem = this.menuitemNodes[this.menuitemNodes.length - 1];
      this.lastMenuitem.classList.add('last');
      this.updateKeyboardShortCuts();
    },

    renderMenuitemToGroup: function (groupNode, mi) {
      var tagNode, tagNodeChild, labelNode, nestingNode;

      // only set role after menu button opens it to not interfere with regression tests
      this.menuNode.setAttribute('role', 'menu');

      var menuitemNode = document.createElement('div');
      menuitemNode.setAttribute('role', 'menuitem');
      menuitemNode.classList.add(mi.class);
      if (this.isNotEmptyString(mi.tagName)) {
        menuitemNode.classList.add('jump-to-' + mi.tagName.toLowerCase());
      }
      menuitemNode.setAttribute('data-id', mi.dataId);
      menuitemNode.tabIndex = -1;
      if (this.isNotEmptyString(mi.ariaLabel)) {
        menuitemNode.setAttribute('aria-label', mi.ariaLabel);
      }

      // add event handlers
      menuitemNode.addEventListener(
        'keydown',
        this.handleMenuitemKeydown.bind(this)
      );
      menuitemNode.addEventListener(
        'click',
        this.handleMenuitemClick.bind(this)
      );
      menuitemNode.addEventListener(
        'pointerenter',
        this.handleMenuitemPointerenter.bind(this)
      );

      groupNode.appendChild(menuitemNode);

      // add heading level and label
      if (mi.class.includes('heading')) {
        if (this.config.enableHeadingLevelShortcuts) {
          tagNode = document.createElement('span');
          tagNodeChild = document.createElement('span');
          tagNodeChild.appendChild(document.createTextNode(mi.level));
          tagNode.append(tagNodeChild);
          tagNode.appendChild(document.createTextNode(')'));
          tagNode.classList.add('level');
          menuitemNode.append(tagNode);
        } else {
          menuitemNode.classList.add('no-level');
        }
        menuitemNode.setAttribute('data-level', mi.level);
        if (this.isNotEmptyString(mi.tagName)) {
          menuitemNode.classList.add('jump-to-' + mi.tagName);
        }
      }

      // add nesting level for landmarks
      if (mi.class.includes('landmark')) {
        menuitemNode.setAttribute('data-nesting', mi.nestingLevel);
        menuitemNode.classList.add('jump-to-nesting-level-' + mi.nestingLevel);

        if (mi.nestingLevel > 0 && mi.nestingLevel > this.lastNestingLevel) {
          nestingNode = document.createElement('span');
          nestingNode.classList.add('nesting');
          menuitemNode.append(nestingNode);
        }
        this.lastNestingLevel = mi.nestingLevel;
      }

      labelNode = document.createElement('span');
      labelNode.appendChild(document.createTextNode(mi.name));
      labelNode.classList.add('label');
      menuitemNode.append(labelNode);

      return menuitemNode;
    },

    renderGroupLabel: function (groupLabelId, title) {
      var titleNode;
      var groupLabelNode = document.getElementById(groupLabelId);
      titleNode = groupLabelNode.querySelector('.title');
      titleNode.textContent = title;
    },

    renderMenuitemGroup: function (groupId, title) {
      var labelNode, groupNode, spanNode;
      var menuNode = this.menuNode;
      if (this.isNotEmptyString(title)) {
        labelNode = document.createElement('div');
        labelNode.id = groupId + '-label';
        labelNode.setAttribute('role', 'separator');
        menuNode.appendChild(labelNode);

        spanNode = document.createElement('span');
        spanNode.classList.add('title');
        spanNode.textContent = title;
        labelNode.append(spanNode);

        groupNode = document.createElement('div');
        groupNode.setAttribute('role', 'group');
        groupNode.setAttribute('aria-labelledby', labelNode.id);
        groupNode.id = groupId;
        menuNode.appendChild(groupNode);
        menuNode = groupNode;
      }
      return groupNode;
    },

    removeMenuitemGroup: function (groupId) {
      var node = document.getElementById(groupId);
      this.menuNode.removeChild(node);
      node = document.getElementById(groupId + '-label');
      this.menuNode.removeChild(node);
    },

    renderMenuitemsToGroup: function (groupNode, menuitems, msgNoItemsFound) {
      groupNode.innerHTML = '';
      this.lastNestingLevel = 0;

      if (menuitems.length === 0) {
        var item = {};
        item.name = msgNoItemsFound;
        item.tagName = '';
        item.class = 'no-items';
        item.dataId = '';
        this.renderMenuitemToGroup(groupNode, item);
      } else {
        for (var i = 0; i < menuitems.length; i += 1) {
          this.renderMenuitemToGroup(groupNode, menuitems[i]);
        }
      }
    },

    renderMenu: function () {
      var groupNode, landmarkElements, headingElements;
      // remove current menu items from menu
      while (this.menuNode.lastElementChild) {
        this.menuNode.removeChild(this.menuNode.lastElementChild);
      }

      // Create landmarks group
      landmarkElements = this.getLandmarks(this.config.landmarks);

      groupNode = this.renderMenuitemGroup(
        'id-jump-to-group-landmarks',
        this.config.landmarkGroupLabel
      );
      this.renderMenuitemsToGroup(
        groupNode,
        landmarkElements,
        this.config.msgNoLandmarksFound
      );
      this.renderGroupLabel(
        'id-jump-to-group-landmarks-label',
        this.config.landmarkGroupLabel
      );

      // Create headings group
      headingElements = this.getHeadings(this.config.headings);

      groupNode = this.renderMenuitemGroup(
        'id-jump-to-group-headings',
        this.config.headingGroupLabel
      );
      this.renderMenuitemsToGroup(
        groupNode,
        headingElements,
        this.config.msgNoHeadingsFound
      );
      this.renderGroupLabel(
        'id-jump-to-group-headings-label',
        this.config.headingGroupLabel
      );

      // Update list of menuitems
      this.updateMenuitems();
    },

    //
    // Menu scripting event functions and utilities
    //

    setFocusToMenuitem: function (menuitem) {
      if (menuitem) {
        menuitem.focus();
      }
    },

    setFocusToFirstMenuitem: function () {
      this.setFocusToMenuitem(this.firstMenuitem);
    },

    setFocusToLastMenuitem: function () {
      this.setFocusToMenuitem(this.lastMenuitem);
    },

    setFocusToPreviousMenuitem: function (menuitem) {
      var newMenuitem, index;
      if (menuitem === this.firstMenuitem) {
        newMenuitem = this.lastMenuitem;
      } else {
        index = this.menuitemNodes.indexOf(menuitem);
        newMenuitem = this.menuitemNodes[index - 1];
      }
      this.setFocusToMenuitem(newMenuitem);
      return newMenuitem;
    },

    setFocusToNextMenuitem: function (menuitem) {
      var newMenuitem, index;
      if (menuitem === this.lastMenuitem) {
        newMenuitem = this.firstMenuitem;
      } else {
        index = this.menuitemNodes.indexOf(menuitem);
        newMenuitem = this.menuitemNodes[index + 1];
      }
      this.setFocusToMenuitem(newMenuitem);
      return newMenuitem;
    },

    setFocusByFirstCharacter: function (menuitem, char) {
      var start, index;
      if (char.length > 1) {
        return;
      }
      char = char.toLowerCase();

      // Get start index for search based on position of currentItem
      start = this.menuitemNodes.indexOf(menuitem) + 1;
      if (start >= this.menuitemNodes.length) {
        start = 0;
      }

      // Check remaining items in the menu
      index = this.firstChars.indexOf(char, start);

      // If not found in remaining items, check headings
      if (index === -1) {
        index = this.headingLevels.indexOf(char, start);
      }

      // If not found in remaining items, check from beginning
      if (index === -1) {
        index = this.firstChars.indexOf(char, 0);
      }

      // If not found in remaining items, check headings from beginning
      if (index === -1) {
        index = this.headingLevels.indexOf(char, 0);
      }

      // If match was found...
      if (index > -1) {
        this.setFocusToMenuitem(this.menuitemNodes[index]);
      }
    },

    // Utilities
    getIndexFirstChars: function (startIndex, char) {
      for (var i = startIndex; i < this.firstChars.length; i += 1) {
        if (char === this.firstChars[i]) {
          return i;
        }
      }
      return -1;
    },
    // Popup menu methods
    openPopup: function () {
      this.renderMenu();
      this.menuNode.style.display = 'block';
      this.buttonNode.setAttribute('aria-expanded', 'true');
    },

    closePopup: function () {
      if (this.isOpen()) {
        this.buttonNode.setAttribute('aria-expanded', 'false');
        this.menuNode.style.display = 'none';
      }
    },
    isOpen: function () {
      return this.buttonNode.getAttribute('aria-expanded') === 'true';
    },
    // Menu event handlers
    handleFocusin: function () {
      this.domNode.classList.add('focus');
    },
    handleFocusout: function () {
      this.domNode.classList.remove('focus');
    },
    handleMenuitemAction: function (tgt) {
      switch (tgt.getAttribute('data-id')) {
        case '':
          // this means there were no headings or landmarks in the list
          break;

        default:
          this.closePopup();
          this.jumpToElement(tgt);
          break;
      }
    },
    handleButtonKeydown: function (event) {
      var key = event.key,
        flag = false;
      switch (key) {
        case ' ':
        case 'Enter':
        case 'ArrowDown':
        case 'Down':
          this.openPopup();
          this.setFocusToFirstMenuitem();
          flag = true;
          break;
        case 'Esc':
        case 'Escape':
          this.closePopup();
          this.buttonNode.focus();
          flag = true;
          break;
        case 'Up':
        case 'ArrowUp':
          this.openPopup();
          this.setFocusToLastMenuitem();
          flag = true;
          break;
        default:
          break;
      }
      if (flag) {
        event.stopPropagation();
        event.preventDefault();
      }
    },
    handleButtonClick: function (event) {
      if (this.isOpen()) {
        this.closePopup();
        this.buttonNode.focus();
      } else {
        this.openPopup();
        this.setFocusToFirstMenuitem();
      }
      event.stopPropagation();
      event.preventDefault();
    },
    handleDocumentKeydown: function (event) {
      var key = event.key,
        flag = false;

      let altPressed =
        this.usesAltKey &&
        event.altKey &&
        !event.ctrlKey &&
        !event.shiftKey &&
        !event.metaKey;

      let optionPressed =
        this.usesOptionKey &&
        event.altKey &&
        !event.ctrlKey &&
        !event.shiftKey &&
        !event.metaKey;

      if (
        (optionPressed && this.config.optionAccesskey === key) ||
        (altPressed && this.config.altAccesskey === key)
      ) {
        this.openPopup();
        this.setFocusToFirstMenuitem();
        flag = true;
      }
      if (flag) {
        event.stopPropagation();
        event.preventDefault();
      }
    },
    jumpToElement: function (menuitem) {
      var focusNode = false;
      var scrollNode = false;
      var isLandmark = menuitem.classList.contains('landmark');
      var isSearch = menuitem.classList.contains('jump-to-search');
      var isNav = menuitem.classList.contains('jump-to-nav');
      var node = document.querySelector(
        '[data-jump-to-id="' + menuitem.getAttribute('data-id') + '"]'
      );
      if (node) {
        if (isSearch) {
          focusNode = node.querySelector('input');
        }
        if (isNav) {
          focusNode = node.querySelector('a');
        }
        if (focusNode && this.isVisible(focusNode)) {
          focusNode.focus();
          focusNode.scrollIntoView({ block: 'nearest' });
        } else {
          if (isLandmark) {
            scrollNode = node.querySelector(this.contentSelector);
            if (scrollNode) {
              node = scrollNode;
            }
          }
          node.tabIndex = -1;
          node.focus();
          node.scrollIntoView({ block: 'center' });
        }
      }
    },
    handleMenuitemKeydown: function (event) {
      var tgt = event.currentTarget,
        key = event.key,
        flag = false;

      function isPrintableCharacter(str) {
        return str.length === 1 && str.match(/\S/);
      }
      if (event.ctrlKey || event.altKey || event.metaKey) {
        return;
      }
      if (event.shiftKey) {
        if (isPrintableCharacter(key)) {
          this.setFocusByFirstCharacter(tgt, key);
          flag = true;
        }
        if (event.key === 'Tab') {
          this.buttonNode.focus();
          this.closePopup();
          flag = true;
        }
      } else {
        switch (key) {
          case 'Enter':
          case ' ':
            this.handleMenuitemAction(tgt);
            flag = true;
            break;
          case 'Esc':
          case 'Escape':
            this.closePopup();
            this.buttonNode.focus();
            flag = true;
            break;
          case 'Up':
          case 'ArrowUp':
            this.setFocusToPreviousMenuitem(tgt);
            flag = true;
            break;
          case 'ArrowDown':
          case 'Down':
            this.setFocusToNextMenuitem(tgt);
            flag = true;
            break;
          case 'Home':
          case 'PageUp':
            this.setFocusToFirstMenuitem();
            flag = true;
            break;
          case 'End':
          case 'PageDown':
            this.setFocusToLastMenuitem();
            flag = true;
            break;
          case 'Tab':
            this.closePopup();
            break;
          default:
            if (isPrintableCharacter(key)) {
              this.setFocusByFirstCharacter(tgt, key);
              flag = true;
            }
            break;
        }
      }
      if (flag) {
        event.stopPropagation();
        event.preventDefault();
      }
    },
    handleMenuitemClick: function (event) {
      this.handleMenuitemAction(event.currentTarget);
      event.stopPropagation();
      event.preventDefault();
    },
    handleMenuitemPointerenter: function (event) {
      var tgt = event.currentTarget;
      tgt.focus();
    },
    handleBackgroundPointerdown: function (event) {
      if (!this.domNode.contains(event.target)) {
        if (this.isOpen()) {
          this.closePopup();
          this.buttonNode.focus();
        }
      }
    },
    // methods to extract landmarks, headings and ids
    normalizeName: function (name) {
      if (typeof name === 'string')
        return name.replace(/\w\S*/g, function (txt) {
          return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
        });
      return '';
    },
    getTextContent: function (elem) {
      function getText(e, strings) {
        // If text node get the text and return
        if (e.nodeType === Node.TEXT_NODE) {
          strings.push(e.data);
        } else {
          // if an element for through all the children elements looking for text
          if (e.nodeType === Node.ELEMENT_NODE) {
            // check to see if IMG or AREA element and to use ALT content if defined
            var tagName = e.tagName.toLowerCase();
            if (tagName === 'img' || tagName === 'area') {
              if (e.alt) {
                strings.push(e.alt);
              }
            } else {
              var c = e.firstChild;
              while (c) {
                getText(c, strings);
                c = c.nextSibling;
              } // end loop
            }
          }
        }
      } // end function getStrings
      // Create return object
      var str = 'Test',
        strings = [];
      getText(elem, strings);
      if (strings.length) str = strings.join(' ');
      return str;
    },
    getAccessibleName: function (elem) {
      var labelledbyIds = elem.getAttribute('aria-labelledby'),
        label = elem.getAttribute('aria-label'),
        title = elem.getAttribute('title'),
        name = '';
      if (labelledbyIds && labelledbyIds.length) {
        var str,
          strings = [],
          ids = labelledbyIds.split(' ');
        if (!ids.length) ids = [labelledbyIds];
        for (var i = 0, l = ids.length; i < l; i += 1) {
          var e = document.getElementById(ids[i]);
          if (e) str = this.getTextContent(e);
          if (str && str.length) strings.push(str);
        }
        name = strings.join(' ');
      } else {
        if (this.isNotEmptyString(label)) {
          name = label;
        } else {
          if (this.isNotEmptyString(title)) {
            name = title;
          }
        }
      }
      return name;
    },
    isVisible: function (element) {
      function isVisibleRec(el) {
        if (el.nodeType === 9)
          return true; /*IE8 does not support Node.DOCUMENT_NODE*/
        var computedStyle = window.getComputedStyle(el);
        var display = computedStyle.getPropertyValue('display');
        var visibility = computedStyle.getPropertyValue('visibility');
        var hidden = el.getAttribute('hidden');
        if (display === 'none' || visibility === 'hidden' || hidden !== null) {
          return false;
        }
        return isVisibleRec(el.parentNode);
      }
      return isVisibleRec(element);
    },
    getHeadings: function (targets) {
      var dataId, level;
      if (typeof targets !== 'string') {
        targets = this.config.headings;
      }
      var headingElementsArr = [];
      if (typeof targets !== 'string' || targets.length === 0) return;
      var headings = document.querySelectorAll(targets);
      for (var i = 0, len = headings.length; i < len; i += 1) {
        var heading = headings[i];
        var role = heading.getAttribute('role');
        if (typeof role === 'string' && role === 'presentation') continue;
        if (this.isVisible(heading)) {
          if (heading.hasAttribute('data-jump-to-id')) {
            dataId = heading.getAttribute('data-jump-to-id');
          } else {
            heading.setAttribute('data-jump-to-id', this.jumpToIdIndex);
            dataId = this.jumpToIdIndex;
          }
          level = heading.tagName.substring(1);
          var headingItem = {};
          headingItem.dataId = dataId.toString();
          headingItem.class = 'heading';
          headingItem.name = this.getTextContent(heading);
          headingItem.ariaLabel = headingItem.name + ', ';
          headingItem.ariaLabel += this.config.headingLevelLabel + ' ' + level;
          headingItem.tagName = heading.tagName.toLowerCase();
          headingItem.role = 'heading';
          headingItem.level = level;
          headingElementsArr.push(headingItem);
          this.jumpToIdIndex += 1;
        }
      }
      return headingElementsArr;
    },
    getLocalizedLandmarkName: function (tagName, name) {
      var n;
      switch (tagName) {
        case 'aside':
          n = this.config.asideLabel;
          break;
        case 'footer':
          n = this.config.footerLabel;
          break;
        case 'form':
          n = this.config.formLabel;
          break;
        case 'header':
          n = this.config.headerLabel;
          break;
        case 'main':
          n = this.config.mainLabel;
          break;
        case 'nav':
          n = this.config.navLabel;
          break;
        case 'region':
          n = this.config.regionLabel;
          break;
        case 'search':
          n = this.config.searchLabel;
          break;
        // When an ID is used as a selector, assume for main content
        default:
          n = tagName;
          break;
      }
      if (this.isNotEmptyString(name)) {
        n += ': ' + name;
      }
      return n;
    },
    getNestingLevel: function (landmark, landmarks) {
      var nestingLevel = 0;
      var parentNode = landmark.parentNode;
      while (parentNode) {
        for (var i = 0; i < landmarks.length; i += 1) {
          if (landmarks[i] === parentNode) {
            nestingLevel += 1;
            // no more than 3 levels of nesting supported
            if (nestingLevel === 3) {
              return 3;
            }
            continue;
          }
        }
        parentNode = parentNode.parentNode;
      }
      return nestingLevel;
    },
    getLandmarks: function (targets, allFlag) {
      if (typeof allFlag !== 'boolean') {
        allFlag = false;
      }
      if (typeof targets !== 'string') {
        targets = this.config.landmarks;
      }
      var landmarks = document.querySelectorAll(targets);
      var mainElements = [];
      var searchElements = [];
      var navElements = [];
      var asideElements = [];
      var footerElements = [];
      var regionElements = [];
      var otherElements = [];
      var allLandmarks = [];
      var dataId = '';
      for (var i = 0, len = landmarks.length; i < len; i += 1) {
        var landmark = landmarks[i];
        // if jumpto is a landmark don't include it in the list
        if (landmark === this.domNode) {
          continue;
        }
        var role = landmark.getAttribute('role');
        var tagName = landmark.tagName.toLowerCase();
        if (typeof role === 'string' && role === 'presentation') continue;
        if (this.isVisible(landmark)) {
          if (!role) role = tagName;
          var name = this.getAccessibleName(landmark);
          if (typeof name !== 'string') {
            name = '';
          }
          // normalize tagNames
          switch (role) {
            case 'banner':
              tagName = 'header';
              break;
            case 'complementary':
              tagName = 'aside';
              break;
            case 'contentinfo':
              tagName = 'footer';
              break;
            case 'form':
              tagName = 'form';
              break;
            case 'main':
              tagName = 'main';
              break;
            case 'navigation':
              tagName = 'nav';
              break;
            case 'section':
              tagName = 'region';
              break;
            case 'search':
              tagName = 'search';
              break;
            default:
              break;
          }
          // if using ID for selectQuery give tagName as main
          if (
            [
              'aside',
              'footer',
              'form',
              'header',
              'main',
              'nav',
              'region',
              'search',
            ].indexOf(tagName) < 0
          ) {
            tagName = 'main';
          }
          if (landmark.hasAttribute('aria-roledescription')) {
            tagName = landmark
              .getAttribute('aria-roledescription')
              .trim()
              .replace(' ', '-');
          }
          if (landmark.hasAttribute('data-jump-to-id')) {
            dataId = landmark.getAttribute('data-jump-to-id');
          } else {
            landmark.setAttribute('data-jump-to-id', this.jumpToIdIndex);
            dataId = this.jumpToIdIndex;
          }
          var landmarkItem = {};
          landmarkItem.dataId = dataId.toString();
          landmarkItem.class = 'landmark';
          landmarkItem.name = this.getLocalizedLandmarkName(tagName, name);
          landmarkItem.tagName = tagName;
          landmarkItem.nestingLevel = 0;
          if (allFlag) {
            landmarkItem.nestingLevel = this.getNestingLevel(
              landmark,
              landmarks
            );
          }
          this.jumpToIdIndex += 1;
          allLandmarks.push(landmarkItem);
          // For sorting landmarks into groups
          switch (tagName) {
            case 'main':
              mainElements.push(landmarkItem);
              break;
            case 'search':
              searchElements.push(landmarkItem);
              break;
            case 'nav':
              navElements.push(landmarkItem);
              break;
            case 'aside':
              asideElements.push(landmarkItem);
              break;
            case 'footer':
              footerElements.push(landmarkItem);
              break;
            case 'region':
              regionElements.push(landmarkItem);
              break;
            default:
              otherElements.push(landmarkItem);
              break;
          }
        }
      }
      if (allFlag) {
        return allLandmarks;
      }
      return [].concat(
        mainElements,
        regionElements,
        searchElements,
        navElements,
        asideElements,
        footerElements,
        otherElements
      );
    },
  };
  // Initialize jumpto menu button with onload event
  window.addEventListener('load', function () {
    JumpTo.init();
  });
})();
/*@end @*/
