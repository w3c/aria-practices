/*! skipto - v4.2.0 - 2022-06-16
 * https://github.com/paypal/skipto
 * Copyright (c) 2022 Jon Gunderson; Licensed BSD
 * Copyright (c) 2021 PayPal Accessibility Team and University of Illinois; Licensed BSD */
/*@cc_on @*/
/*@if (@_jscript_version >= es6) @*/
/* ========================================================================
 * Copyright (c) <2022> (ver 4.2) Jon Gunderson
 * Copyright (c) <2021> PayPal and University of Illinois
 * All rights reserved.
 * Redistribution and use in source and binary forms, with or without modification, are permitted provided that the following conditions are met:
 * Redistributions of source code must retain the above copyright notice, this list of conditions and the following disclaimer.
 * Redistributions in binary form must reproduce the above copyright notice, this list of conditions and the following disclaimer in the documentation and/or other materials provided with the distribution.
 * Neither the name of PayPal or any of its subsidiaries or affiliates, nor the name of the University of Illinois, nor the names of any other contributors contributors may be used to endorse or promote products derived from this software without specific prior written permission.
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 * ======================================================================== */

(function () {
  'use strict';
  const SkipTo = {
    skipToId: 'id-skip-to-js-50',
    skipToMenuId: 'id-skip-to-menu-50',
    domNode: null,
    buttonNode: null,
    menuNode: null,
    menuitemNodes: [],
    firstMenuitem: false,
    lastMenuitem: false,
    firstChars: [],
    headingLevels: [],
    skipToIdIndex: 1,
    showAllLandmarksSelector:
      'main, [role=main], [role=search], nav, [role=navigation], section[aria-label], section[aria-labelledby], section[title], [role=region][aria-label], [role=region][aria-labelledby], [role=region][title], form[aria-label], form[aria-labelledby], aside, [role=complementary], body > header, [role=banner], body > footer, [role=contentinfo]',
    showAllHeadingsSelector: 'h1, h2, h3, h4, h5, h6',
    // Default configuration values
    config: {
      // Feature switches
      enableActions: false,
      enableMofN: true,
      enableHeadingLevelShortcuts: true,

      // Customization of button and menu
      altShortcut: '0', // default shortcut key is the number zero
      optionShortcut: 'º', // default shortcut key character associated with option+0 on mac
      attachElement: 'body',
      displayOption: 'static', // options: static (default), popup
      // container element, use containerClass for custom styling
      containerElement: 'div',
      containerRole: '',
      customClass: '',

      // Button labels and messages
      buttonLabel: 'Skip To Content',
      altLabel: 'Alt',
      optionLabel: 'Option',
      buttonShortcut: ' ($modifier+$key)',
      altButtonAriaLabel: 'Skip To Content, shortcut Alt plus $key',
      optionButtonAriaLabel: 'Skip To Content, shortcut Option plus $key',

      // Menu labels and messages
      menuLabel: 'Landmarks and Headings',
      landmarkGroupLabel: 'Landmarks',
      headingGroupLabel: 'Headings',
      mofnGroupLabel: ' ($m of $n)',
      headingLevelLabel: 'Heading level',
      mainLabel: 'main',
      searchLabel: 'search',
      navLabel: 'navigation',
      regionLabel: 'region',
      asideLabel: 'complementary',
      footerLabel: 'contentinfo',
      headerLabel: 'banner',
      formLabel: 'form',
      msgNoLandmarksFound: 'No landmarks found',
      msgNoHeadingsFound: 'No headings found',

      // Action labels and messages
      actionGroupLabel: 'Actions',
      actionShowHeadingsHelp:
        'Toggles between showing "All" and "Selected" Headings.',
      actionShowSelectedHeadingsLabel: 'Show Selected Headings ($num)',
      actionShowAllHeadingsLabel: 'Show All Headings ($num)',
      actionShowLandmarksHelp:
        'Toggles between showing "All" and "Selected" Landmarks.',
      actionShowSelectedLandmarksLabel: 'Show Selected Landmarks ($num)',
      actionShowAllLandmarksLabel: 'Show All Landmarks ($num)',

      actionShowSelectedHeadingsAriaLabel: 'Show $num selected headings',
      actionShowAllHeadingsAriaLabel: 'Show all $num headings',
      actionShowSelectedLandmarksAriaLabel: 'Show $num selected landmarks',
      actionShowAllLandmarksAriaLabel: 'Show all $num landmarks',

      // Selectors for landmark and headings sections
      landmarks:
        'main, [role="main"], [role="search"], nav, [role="navigation"], aside, [role="complementary"]',
      headings: 'main h1, [role="main"] h1, main h2, [role="main"] h2',

      // Custom CSS position and colors
      colorTheme: '',
      fontFamily: '',
      fontSize: '',
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
        fontFamily:
          'Noto Sans, Trebuchet MS, Helvetica Neue, Arial, sans-serif',
        fontSize: '14px',
        positionLeft: 'unset',
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
      '.skip-to.popup{position:absolute;top:-30em;left:0}.skip-to,.skip-to.popup.focus{position:absolute;top:0;left:$positionLeft;font-family:$fontFamily;font-size:$fontSize}.skip-to.fixed{position:fixed}.skip-to button{position:relative;margin:0;padding:6px 8px 6px 8px;border-width:0 1px 1px 1px;border-style:solid;border-radius:0 0 6px 6px;border-color:$buttonBackgroundColor;color:$menuTextColor;background-color:$buttonBackgroundColor;z-index:100000!important;font-family:$fontFamily;font-size:$fontSize}.skip-to [role=menu]{position:absolute;min-width:17em;display:none;margin:0;padding:.25rem;background-color:$menuBackgroundColor;border-width:2px;border-style:solid;border-color:$focusBorderColor;border-radius:5px;z-index:100000!important;overflow-x:hidden}.skip-to [role=group]{display:grid;grid-auto-rows:min-content;grid-row-gap:1px}.skip-to [role=separator]:first-child{border-radius:5px 5px 0 0}.skip-to [role=menuitem]{padding:3px;width:auto;border-width:0;border-style:solid;color:$menuTextColor;background-color:$menuBackgroundColor;z-index:100000!important;display:grid;overflow-y:clip;grid-template-columns:repeat(6,1.2rem) 1fr;grid-column-gap:2px;font-size:1em}.skip-to [role=menuitem] .label,.skip-to [role=menuitem] .level{font-size:100%;font-weight:400;color:$menuTextColor;display:inline-block;background-color:$menuBackgroundColor;line-height:inherit;display:inline-block}.skip-to [role=menuitem] .level{text-align:right;padding-right:4px}.skip-to [role=menuitem] .label{text-align:left;margin:0;padding:0;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.skip-to [role=menuitem] .label:first-letter,.skip-to [role=menuitem] .level:first-letter{text-decoration:underline;text-transform:uppercase}.skip-to [role=menuitem].skip-to-h1 .level{grid-column:1}.skip-to [role=menuitem].skip-to-h2 .level{grid-column:2}.skip-to [role=menuitem].skip-to-h3 .level{grid-column:3}.skip-to [role=menuitem].skip-to-h4 .level{grid-column:4}.skip-to [role=menuitem].skip-to-h5 .level{grid-column:5}.skip-to [role=menuitem].skip-to-h6 .level{grid-column:8}.skip-to [role=menuitem].skip-to-h1 .label{grid-column:2/8}.skip-to [role=menuitem].skip-to-h2 .label{grid-column:3/8}.skip-to [role=menuitem].skip-to-h3 .label{grid-column:4/8}.skip-to [role=menuitem].skip-to-h4 .label{grid-column:5/8}.skip-to [role=menuitem].skip-to-h5 .label{grid-column:6/8}.skip-to [role=menuitem].skip-to-h6 .label{grid-column:7/8}.skip-to [role=menuitem].skip-to-h1.no-level .label{grid-column:1/8}.skip-to [role=menuitem].skip-to-h2.no-level .label{grid-column:2/8}.skip-to [role=menuitem].skip-to-h3.no-level .label{grid-column:3/8}.skip-to [role=menuitem].skip-to-h4.no-level .label{grid-column:4/8}.skip-to [role=menuitem].skip-to-h5.no-level .label{grid-column:5/8}.skip-to [role=menuitem].skip-to-h6.no-level .label{grid-column:6/8}.skip-to [role=menuitem].skip-to-nesting-level-1 .nesting{grid-column:1}.skip-to [role=menuitem].skip-to-nesting-level-2 .nesting{grid-column:2}.skip-to [role=menuitem].skip-to-nesting-level-3 .nesting{grid-column:3}.skip-to [role=menuitem].skip-to-nesting-level-0 .label{grid-column:1/8}.skip-to [role=menuitem].skip-to-nesting-level-1 .label{grid-column:2/8}.skip-to [role=menuitem].skip-to-nesting-level-2 .label{grid-column:3/8}.skip-to [role=menuitem].skip-to-nesting-level-3 .label{grid-column:4/8}.skip-to [role=menuitem].action .label,.skip-to [role=menuitem].no-items .label{grid-column:1/8}.skip-to [role=separator]{margin:1px 0 1px 0;padding:3px;display:block;width:auto;font-weight:700;border-bottom-width:1px;border-bottom-style:solid;border-bottom-color:$menuTextColor;background-color:$menuBackgroundColor;color:$menuTextColor;z-index:100000!important}.skip-to [role=separator] .mofn{font-weight:400;font-size:85%}.skip-to [role=separator]:first-child{border-radius:5px 5px 0 0}.skip-to [role=menuitem].last{border-radius:0 0 5px 5px}.skip-to.focus{display:block}.skip-to button:focus,.skip-to button:hover{background-color:$menuBackgroundColor;color:$menuTextColor;outline:0}.skip-to button:focus{padding:6px 7px 5px 7px;border-width:0 2px 2px 2px;border-color:$focusBorderColor}.skip-to [role=menuitem]:focus{padding:1px;border-width:2px;border-style:solid;border-color:$focusBorderColor;background-color:$menuitemFocusBackgroundColor;color:$menuitemFocusTextColor;outline:0}.skip-to [role=menuitem]:focus .label,.skip-to [role=menuitem]:focus .level{background-color:$menuitemFocusBackgroundColor;color:$menuitemFocusTextColor}',

    //
    // Functions related to configuring the features
    // of skipTo
    //
    isNotEmptyString: function (str) {
      return (
        typeof str === 'string' && str.length && str.trim() && str !== '&nbsp;'
      );
    },
    isEmptyString: function (str) {
      return typeof str !== 'string' || (str.length === 0 && !str.trim());
    },
    init: function (config) {
      let node;
      let buttonVisibleLabel;
      let buttonAriaLabel;

      // Check if skipto is already loaded

      if (document.querySelector('style#' + this.skipToId)) {
        return;
      }

      let attachElement = document.body;
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
      this.domNode.classList.add('skip-to');
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

      // Menu button
      [buttonVisibleLabel, buttonAriaLabel] = this.getBrowserSpecificShortcut();

      this.buttonNode = document.createElement('button');
      this.buttonNode.textContent = buttonVisibleLabel;
      this.buttonNode.setAttribute('aria-label', buttonAriaLabel);
      this.buttonNode.setAttribute('aria-haspopup', 'true');
      this.buttonNode.setAttribute('aria-expanded', 'false');
      this.buttonNode.setAttribute('aria-controls', this.skipToMenuId);

      this.buttonNode.addEventListener(
        'keydown',
        this.handleButtonKeydown.bind(this)
      );
      this.buttonNode.addEventListener(
        'click',
        this.handleButtonClick.bind(this)
      );

      this.domNode.appendChild(this.buttonNode);

      this.menuNode = document.createElement('div');
      this.menuNode.setAttribute('role', 'menu');
      this.menuNode.setAttribute('aria-busy', 'true');
      this.menuNode.setAttribute('id', this.skipToMenuId);

      this.domNode.appendChild(this.menuNode);
      this.domNode.addEventListener('focusin', this.handleFocusin.bind(this));
      this.domNode.addEventListener('focusout', this.handleFocusout.bind(this));
      window.addEventListener(
        'pointerdown',
        this.handleBackgroundPointerdown.bind(this),
        true
      );

      if (this.usesAltKey || this.usesOptionKey) {
        document.addEventListener(
          'keydown',
          this.handleDocumentKeydown.bind(this)
        );
      }
    },

    updateStyle: function (stylePlaceholder, value, defaultValue) {
      if (typeof value !== 'string' || value.length === 0) {
        value = defaultValue;
      }
      let index1 = this.defaultCSS.indexOf(stylePlaceholder);
      let index2 = index1 + stylePlaceholder.length;
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
      let theme = this.colorThemes['default'];
      if (typeof this.colorThemes[this.config.colorTheme] === 'object') {
        theme = this.colorThemes[this.config.colorTheme];
      }
      this.updateStyle('$fontFamily', this.config.fontFamily, theme.fontFamily);
      this.updateStyle('$fontSize', this.config.fontSize, theme.fontSize);

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

    getBrowserSpecificShortcut: function () {
      const platform = navigator.platform.toLowerCase();
      const userAgent = navigator.userAgent.toLowerCase();

      const hasWin = platform.indexOf('win') >= 0;
      const hasMac = platform.indexOf('mac') >= 0;
      const hasLinux =
        platform.indexOf('linux') >= 0 || platform.indexOf('bsd') >= 0;
      const hasAndroid = userAgent.indexOf('android') >= 0;

      this.usesAltKey = hasWin || (hasLinux && !hasAndroid);
      this.usesOptionKey = hasMac;

      let label = this.config.buttonLabel;
      let ariaLabel = this.config.buttonLabel;
      let buttonShortcut;

      // Check to make sure a shortcut key is defined
      if (this.config.altShortcut && this.config.optionShortcut) {
        if (this.usesAltKey || this.usesOptionKey) {
          buttonShortcut = this.config.buttonShortcut.replace(
            '$key',
            this.config.altShortcut
          );
        }
        if (this.usesAltKey) {
          buttonShortcut = buttonShortcut.replace(
            '$modifier',
            this.config.altLabel
          );
          label = label + buttonShortcut;
          ariaLabel = this.config.altButtonAriaLabel.replace(
            '$key',
            this.config.altShortcut
          );
        }

        if (this.usesOptionKey) {
          buttonShortcut = buttonShortcut.replace(
            '$modifier',
            this.config.optionLabel
          );
          label = label + buttonShortcut;
          ariaLabel = this.config.optionButtonAriaLabel.replace(
            '$key',
            this.config.altShortcut
          );
        }
      }
      return [label, ariaLabel];
    },
    setUpConfig: function (appConfig) {
      let localConfig = this.config,
        name,
        appConfigSettings =
          typeof appConfig.settings !== 'undefined'
            ? appConfig.settings.skipTo
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
            '** SkipTo Problem with user configuration option "' + name + '".'
          );
        }
      }
    },
    renderStyleElement: function (cssString) {
      const styleNode = document.createElement('style');
      const headNode = document.getElementsByTagName('head')[0];
      const css = document.createTextNode(cssString);

      styleNode.setAttribute('type', 'text/css');
      // ID is used to test whether skipto is already loaded
      styleNode.id = this.skipToId;
      styleNode.appendChild(css);
      headNode.appendChild(styleNode);
    },

    //
    // Functions related to creating and populating the
    // the popup menu
    //

    getFirstChar: function (menuitem) {
      const label = menuitem.querySelector('.label');
      if (label && this.isNotEmptyString(label.textContent)) {
        return label.textContent.trim()[0].toLowerCase();
      }
      return '';
    },

    getHeadingLevelFromAttribute: function (menuitem) {
      if (menuitem.hasAttribute('data-level')) {
        return menuitem.getAttribute('data-level');
      }
      return '';
    },

    updateKeyboardShortCuts: function () {
      let mi;
      this.firstChars = [];
      this.headingLevels = [];

      for (let i = 0; i < this.menuitemNodes.length; i += 1) {
        mi = this.menuitemNodes[i];
        this.firstChars.push(this.getFirstChar(mi));
        this.headingLevels.push(this.getHeadingLevelFromAttribute(mi));
      }
    },

    updateMenuitems: function () {
      let menuitemNodes = this.menuNode.querySelectorAll('[role=menuitem');

      this.menuitemNodes = [];
      for (let i = 0; i < menuitemNodes.length; i += 1) {
        this.menuitemNodes.push(menuitemNodes[i]);
      }

      this.firstMenuitem = this.menuitemNodes[0];
      this.lastMenuitem = this.menuitemNodes[this.menuitemNodes.length - 1];
      this.lastMenuitem.classList.add('last');
      this.updateKeyboardShortCuts();
    },

    renderMenuitemToGroup: function (groupNode, mi) {
      let tagNode, tagNodeChild, labelNode, nestingNode;

      let menuitemNode = document.createElement('div');
      menuitemNode.setAttribute('role', 'menuitem');
      menuitemNode.classList.add(mi.class);
      if (this.isNotEmptyString(mi.tagName)) {
        menuitemNode.classList.add('skip-to-' + mi.tagName.toLowerCase());
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
          menuitemNode.classList.add('skip-to-' + mi.tagName);
        }
      }

      // add nesting level for landmarks
      if (mi.class.includes('landmark')) {
        menuitemNode.setAttribute('data-nesting', mi.nestingLevel);
        menuitemNode.classList.add('skip-to-nesting-level-' + mi.nestingLevel);

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

    renderGroupLabel: function (groupLabelId, title, m, n) {
      let titleNode, mofnNode, s;
      let groupLabelNode = document.getElementById(groupLabelId);

      titleNode = groupLabelNode.querySelector('.title');
      mofnNode = groupLabelNode.querySelector('.mofn');

      titleNode.textContent = title;

      if (this.config.enableActions && this.config.enableMofN) {
        if (typeof m === 'number' && typeof n === 'number') {
          s = this.config.mofnGroupLabel;
          s = s.replace('$m', m);
          s = s.replace('$n', n);
          mofnNode.textContent = s;
        }
      }
    },

    renderMenuitemGroup: function (groupId, title) {
      let labelNode, groupNode, spanNode;
      let menuNode = this.menuNode;
      if (this.isNotEmptyString(title)) {
        labelNode = document.createElement('div');
        labelNode.id = groupId + '-label';
        labelNode.setAttribute('role', 'separator');
        menuNode.appendChild(labelNode);

        spanNode = document.createElement('span');
        spanNode.classList.add('title');
        spanNode.textContent = title;
        labelNode.append(spanNode);

        spanNode = document.createElement('span');
        spanNode.classList.add('mofn');
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
      let node = document.getElementById(groupId);
      this.menuNode.removeChild(node);
      node = document.getElementById(groupId + '-label');
      this.menuNode.removeChild(node);
    },

    renderMenuitemsToGroup: function (groupNode, menuitems, msgNoItemsFound) {
      groupNode.innerHTML = '';
      this.lastNestingLevel = 0;

      if (menuitems.length === 0) {
        const item = {};
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

    getShowMoreHeadingsSelector: function (option) {
      if (option === 'all') {
        return this.showAllHeadingsSelector;
      }
      return this.config.headings;
    },

    getShowMoreHeadingsLabel: function (option, n) {
      let label = this.config.actionShowSelectedHeadingsLabel;
      if (option === 'all') {
        label = this.config.actionShowAllHeadingsLabel;
      }
      return label.replace('$num', n);
    },

    getShowMoreHeadingsAriaLabel: function (option, n) {
      let label = this.config.actionShowSelectedHeadingsAriaLabel;

      if (option === 'all') {
        label = this.config.actionShowAllHeadingsAriaLabel;
      }

      return label.replace('$num', n);
    },

    renderActionMoreHeadings: function (groupNode) {
      let item, menuitemNode;
      let option = 'all';

      let selectedHeadingsLen = this.getHeadings(
        this.getShowMoreHeadingsSelector('selected')
      ).length;
      let allHeadingsLen = this.getHeadings(
        this.getShowMoreHeadingsSelector('all')
      ).length;
      let noAction = selectedHeadingsLen === allHeadingsLen;
      let headingsLen = allHeadingsLen;

      if (option !== 'all') {
        headingsLen = selectedHeadingsLen;
      }

      if (!noAction) {
        item = {};
        item.tagName = '';
        item.role = 'menuitem';
        item.class = 'action';
        item.dataId = 'skip-to-more-headings';
        item.name = this.getShowMoreHeadingsLabel(option, headingsLen);
        item.ariaLabel = this.getShowMoreHeadingsAriaLabel(option, headingsLen);

        menuitemNode = this.renderMenuitemToGroup(groupNode, item);
        menuitemNode.setAttribute('data-show-heading-option', option);
        menuitemNode.title = this.config.actionShowHeadingsHelp;
      }
      return noAction;
    },

    updateHeadingGroupMenuitems: function (option) {
      let headings, headingsLen, labelNode, groupNode;

      const selectedHeadings = this.getHeadings(
        this.getShowMoreHeadingsSelector('selected')
      );
      const selectedHeadingsLen = selectedHeadings.length;
      const allHeadings = this.getHeadings(
        this.getShowMoreHeadingsSelector('all')
      );
      const allHeadingsLen = allHeadings.length;

      // Update list of headings
      if (option === 'all') {
        headings = allHeadings;
      } else {
        headings = selectedHeadings;
      }

      this.renderGroupLabel(
        'id-skip-to-group-headings-label',
        this.config.headingGroupLabel,
        headings.length,
        allHeadings.length
      );

      groupNode = document.getElementById('id-skip-to-group-headings');
      this.renderMenuitemsToGroup(
        groupNode,
        headings,
        this.config.msgNoHeadingsFound
      );
      this.updateMenuitems();

      // Move focus to first heading menuitem
      if (groupNode.firstElementChild) {
        groupNode.firstElementChild.focus();
      }

      // Update heading action menuitem
      if (option === 'all') {
        option = 'selected';
        headingsLen = selectedHeadingsLen;
      } else {
        option = 'all';
        headingsLen = allHeadingsLen;
      }

      const menuitemNode = this.menuNode.querySelector(
        '[data-id=skip-to-more-headings]'
      );
      menuitemNode.setAttribute('data-show-heading-option', option);
      menuitemNode.setAttribute(
        'aria-label',
        this.getShowMoreHeadingsAriaLabel(option, headingsLen)
      );

      labelNode = menuitemNode.querySelector('span.label');
      labelNode.textContent = this.getShowMoreHeadingsLabel(
        option,
        headingsLen
      );
    },

    getShowMoreLandmarksSelector: function (option) {
      if (option === 'all') {
        return this.showAllLandmarksSelector;
      }
      return this.config.landmarks;
    },

    getShowMoreLandmarksLabel: function (option, n) {
      let label = this.config.actionShowSelectedLandmarksLabel;

      if (option === 'all') {
        label = this.config.actionShowAllLandmarksLabel;
      }
      return label.replace('$num', n);
    },

    getShowMoreLandmarksAriaLabel: function (option, n) {
      let label = this.config.actionShowSelectedLandmarksAriaLabel;

      if (option === 'all') {
        label = this.config.actionShowAllLandmarksAriaLabel;
      }

      return label.replace('$num', n);
    },

    renderActionMoreLandmarks: function (groupNode) {
      let item, menuitemNode;
      let option = 'all';

      const selectedLandmarksLen = this.getLandmarks(
        this.getShowMoreLandmarksSelector('selected')
      ).length;
      const allLandmarksLen = this.getLandmarks(
        this.getShowMoreLandmarksSelector('all')
      ).length;
      const noAction = selectedLandmarksLen === allLandmarksLen;
      let landmarksLen = allLandmarksLen;

      if (option !== 'all') {
        landmarksLen = selectedLandmarksLen;
      }

      if (!noAction) {
        item = {};
        item.tagName = '';
        item.role = 'menuitem';
        item.class = 'action';
        item.dataId = 'skip-to-more-landmarks';
        item.name = this.getShowMoreLandmarksLabel(option, landmarksLen);
        item.ariaLabel = this.getShowMoreLandmarksAriaLabel(
          option,
          landmarksLen
        );

        menuitemNode = this.renderMenuitemToGroup(groupNode, item);

        menuitemNode.setAttribute('data-show-landmark-option', option);
        menuitemNode.title = this.config.actionShowLandmarksHelp;
      }
      return noAction;
    },

    updateLandmarksGroupMenuitems: function (option) {
      let landmarks, landmarksLen, labelNode, groupNode;

      const selectedLandmarks = this.getLandmarks(
        this.getShowMoreLandmarksSelector('selected')
      );
      const selectedLandmarksLen = selectedLandmarks.length;
      const allLandmarks = this.getLandmarks(
        this.getShowMoreLandmarksSelector('all'),
        true
      );
      const allLandmarksLen = allLandmarks.length;

      // Update landmark menu items
      if (option === 'all') {
        landmarks = allLandmarks;
      } else {
        landmarks = selectedLandmarks;
      }

      this.renderGroupLabel(
        'id-skip-to-group-landmarks-label',
        this.config.landmarkGroupLabel,
        landmarks.length,
        allLandmarks.length
      );

      groupNode = document.getElementById('id-skip-to-group-landmarks');
      this.renderMenuitemsToGroup(
        groupNode,
        landmarks,
        this.config.msgNoLandmarksFound
      );
      this.updateMenuitems();

      // Move focus to first landmark menuitem
      if (groupNode.firstElementChild) {
        groupNode.firstElementChild.focus();
      }

      // Update landmark action menuitem
      if (option === 'all') {
        option = 'selected';
        landmarksLen = selectedLandmarksLen;
      } else {
        option = 'all';
        landmarksLen = allLandmarksLen;
      }

      const menuitemNode = this.menuNode.querySelector(
        '[data-id=skip-to-more-landmarks]'
      );
      menuitemNode.setAttribute('data-show-landmark-option', option);
      menuitemNode.setAttribute(
        'aria-label',
        this.getShowMoreLandmarksAriaLabel(option, landmarksLen)
      );

      labelNode = menuitemNode.querySelector('span.label');
      labelNode.textContent = this.getShowMoreLandmarksLabel(
        option,
        landmarksLen
      );
    },

    renderMenu: function () {
      let groupNode,
        selectedLandmarks,
        allLandmarks,
        landmarkElements,
        selectedHeadings,
        allHeadings,
        headingElements,
        selector,
        option,
        hasNoAction1,
        hasNoAction2;
      // remove current menu items from menu
      while (this.menuNode.lastElementChild) {
        this.menuNode.removeChild(this.menuNode.lastElementChild);
      }

      option = 'selected';
      // Create landmarks group
      selector = this.getShowMoreLandmarksSelector('all');
      allLandmarks = this.getLandmarks(selector, true);
      selector = this.getShowMoreLandmarksSelector('selected');
      selectedLandmarks = this.getLandmarks(selector);
      landmarkElements = selectedLandmarks;

      if (option === 'all') {
        landmarkElements = allLandmarks;
      }

      groupNode = this.renderMenuitemGroup(
        'id-skip-to-group-landmarks',
        this.config.landmarkGroupLabel
      );
      this.renderMenuitemsToGroup(
        groupNode,
        landmarkElements,
        this.config.msgNoLandmarksFound
      );
      this.renderGroupLabel(
        'id-skip-to-group-landmarks-label',
        this.config.landmarkGroupLabel,
        landmarkElements.length,
        allLandmarks.length
      );

      // Create headings group
      selector = this.getShowMoreHeadingsSelector('all');
      allHeadings = this.getHeadings(selector);
      selector = this.getShowMoreHeadingsSelector('selected');
      selectedHeadings = this.getHeadings(selector);
      headingElements = selectedHeadings;

      if (option === 'all') {
        headingElements = allHeadings;
      }

      groupNode = this.renderMenuitemGroup(
        'id-skip-to-group-headings',
        this.config.headingGroupLabel
      );
      this.renderMenuitemsToGroup(
        groupNode,
        headingElements,
        this.config.msgNoHeadingsFound
      );
      this.renderGroupLabel(
        'id-skip-to-group-headings-label',
        this.config.headingGroupLabel,
        headingElements.length,
        allHeadings.length
      );

      // Create actions, if enabled
      if (this.config.enableActions) {
        groupNode = this.renderMenuitemGroup(
          'id-skip-to-group-actions',
          this.config.actionGroupLabel
        );
        hasNoAction1 = this.renderActionMoreLandmarks(groupNode);
        hasNoAction2 = this.renderActionMoreHeadings(groupNode);
        // Remove action label if no actions are available
        if (hasNoAction1 && hasNoAction2) {
          this.removeMenuitemGroup('id-skip-to-group-actions');
        }
      }

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
      let newMenuitem, index;
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
      let newMenuitem, index;
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
      let start, index;
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
      for (let i = startIndex; i < this.firstChars.length; i += 1) {
        if (char === this.firstChars[i]) {
          return i;
        }
      }
      return -1;
    },
    // Popup menu methods
    openPopup: function () {
      this.menuNode.setAttribute('aria-busy', 'true');
      const h = (80 * window.innerHeight) / 100;
      this.menuNode.style.maxHeight = h + 'px';
      this.renderMenu();
      this.menuNode.style.display = 'block';
      this.menuNode.removeAttribute('aria-busy');
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
    handleButtonKeydown: function (event) {
      let key = event.key,
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
      let key = event.key,
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
        (optionPressed && this.config.optionShortcut === key) ||
        (altPressed && this.config.altShortcut === key)
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
    skipToElement: function (menuitem) {
      const isVisible = this.isVisible;
      let focusNode = false;
      let scrollNode = false;
      let elem;

      function findVisibleElement(e, selectors) {
        if (e) {
          for (let j = 0; j < selectors.length; j += 1) {
            const elems = e.querySelectorAll(selectors[j]);
            for (let i = 0; i < elems.length; i += 1) {
              if (isVisible(elems[i])) {
                return elems[i];
              }
            }
          }
        }
        return e;
      }

      const searchSelectors = [
        'input',
        'button',
        'input[type=button]',
        'input[type=submit]',
        'a',
      ];
      const navigationSelectors = [
        'a',
        'input',
        'button',
        'input[type=button]',
        'input[type=submit]',
      ];
      const landmarkSelectors = [
        'h1',
        'h2',
        'h3',
        'h4',
        'h5',
        'h6',
        'section',
        'article',
        'p',
        'li',
        'a',
      ];

      const isLandmark = menuitem.classList.contains('landmark');
      const isSearch = menuitem.classList.contains('skip-to-search');
      const isNav = menuitem.classList.contains('skip-to-nav');

      elem = document.querySelector(
        '[data-skip-to-id="' + menuitem.getAttribute('data-id') + '"]'
      );

      if (elem) {
        if (isSearch) {
          focusNode = findVisibleElement(elem, searchSelectors);
        }
        if (isNav) {
          focusNode = findVisibleElement(elem, navigationSelectors);
        }
        if (focusNode && this.isVisible(focusNode)) {
          focusNode.focus();
          focusNode.scrollIntoView({ block: 'nearest' });
        } else {
          if (isLandmark) {
            scrollNode = findVisibleElement(elem, landmarkSelectors);
            if (scrollNode) {
              elem = scrollNode;
            }
          }
          elem.tabIndex = -1;
          elem.focus();
          elem.scrollIntoView({ block: 'center' });
        }
      }
    },
    handleMenuitemAction: function (tgt) {
      let option;
      switch (tgt.getAttribute('data-id')) {
        case '':
          // this means there were no headings or landmarks in the list
          break;

        case 'skip-to-more-headings':
          option = tgt.getAttribute('data-show-heading-option');
          this.updateHeadingGroupMenuitems(option);
          break;

        case 'skip-to-more-landmarks':
          option = tgt.getAttribute('data-show-landmark-option');
          this.updateLandmarksGroupMenuitems(option);
          break;

        default:
          this.closePopup();
          this.skipToElement(tgt);
          break;
      }
    },
    handleMenuitemKeydown: function (event) {
      let tgt = event.currentTarget,
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
      let tgt = event.currentTarget;
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
            let tagName = e.tagName.toLowerCase();
            if (tagName === 'img' || tagName === 'area') {
              if (e.alt) {
                strings.push(e.alt);
              }
            } else {
              let c = e.firstChild;
              while (c) {
                getText(c, strings);
                c = c.nextSibling;
              } // end loop
            }
          }
        }
      } // end function getStrings
      // Create return object
      let str = 'Test',
        strings = [];
      getText(elem, strings);
      if (strings.length) str = strings.join(' ');
      return str;
    },
    getAccessibleName: function (elem) {
      let labelledbyIds = elem.getAttribute('aria-labelledby'),
        label = elem.getAttribute('aria-label'),
        title = elem.getAttribute('title'),
        name = '';
      if (labelledbyIds && labelledbyIds.length) {
        let str,
          strings = [],
          ids = labelledbyIds.split(' ');
        if (!ids.length) ids = [labelledbyIds];
        for (let i = 0, l = ids.length; i < l; i += 1) {
          let e = document.getElementById(ids[i]);
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
        if (el.parentNode.nodeType !== 1 || el.parentNode.tagName === 'BODY') {
          return true;
        }
        const computedStyle = window.getComputedStyle(el);
        const display = computedStyle.getPropertyValue('display');
        const visibility = computedStyle.getPropertyValue('visibility');
        const hidden = el.getAttribute('hidden');
        if (display === 'none' || visibility === 'hidden' || hidden !== null) {
          return false;
        }
        const isVis = isVisibleRec(el.parentNode);
        return isVis;
      }

      return isVisibleRec(element);
    },
    getHeadings: function (targets) {
      let dataId, level;
      if (typeof targets !== 'string') {
        targets = this.config.headings;
      }
      let headingElementsArr = [];
      if (typeof targets !== 'string' || targets.length === 0) return;
      const headings = document.querySelectorAll(targets);
      for (let i = 0, len = headings.length; i < len; i += 1) {
        let heading = headings[i];
        let role = heading.getAttribute('role');
        if (typeof role === 'string' && role === 'presentation') continue;
        if (
          this.isVisible(heading) &&
          this.isNotEmptyString(heading.innerHTML)
        ) {
          if (heading.hasAttribute('data-skip-to-id')) {
            dataId = heading.getAttribute('data-skip-to-id');
          } else {
            heading.setAttribute('data-skip-to-id', this.skipToIdIndex);
            dataId = this.skipToIdIndex;
          }
          level = heading.tagName.substring(1);
          const headingItem = {};
          headingItem.dataId = dataId.toString();
          headingItem.class = 'heading';
          headingItem.name = this.getTextContent(heading);
          headingItem.ariaLabel = headingItem.name + ', ';
          headingItem.ariaLabel += this.config.headingLevelLabel + ' ' + level;
          headingItem.tagName = heading.tagName.toLowerCase();
          headingItem.role = 'heading';
          headingItem.level = level;
          headingElementsArr.push(headingItem);
          this.skipToIdIndex += 1;
        }
      }
      return headingElementsArr;
    },
    getLocalizedLandmarkName: function (tagName, name) {
      let n;
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
        case 'section':
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
      let nestingLevel = 0;
      let parentNode = landmark.parentNode;
      while (parentNode) {
        for (let i = 0; i < landmarks.length; i += 1) {
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
      let landmarks = document.querySelectorAll(targets);
      let mainElements = [];
      let searchElements = [];
      let navElements = [];
      let asideElements = [];
      let footerElements = [];
      let regionElements = [];
      let otherElements = [];
      let allLandmarks = [];
      let dataId = '';
      for (let i = 0, len = landmarks.length; i < len; i += 1) {
        let landmark = landmarks[i];
        // if skipto is a landmark don't include it in the list
        if (landmark === this.domNode) {
          continue;
        }
        let role = landmark.getAttribute('role');
        let tagName = landmark.tagName.toLowerCase();
        if (typeof role === 'string' && role === 'presentation') continue;
        if (this.isVisible(landmark)) {
          if (!role) role = tagName;
          let name = this.getAccessibleName(landmark);
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
            case 'region':
              tagName = 'section';
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
              'section',
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
          if (landmark.hasAttribute('data-skip-to-id')) {
            dataId = landmark.getAttribute('data-skip-to-id');
          } else {
            landmark.setAttribute('data-skip-to-id', this.skipToIdIndex);
            dataId = this.skipToIdIndex;
          }
          const landmarkItem = {};
          landmarkItem.dataId = dataId.toString();
          landmarkItem.class = 'landmark';
          landmarkItem.hasName = name.length > 0;
          landmarkItem.name = this.getLocalizedLandmarkName(tagName, name);
          landmarkItem.tagName = tagName;
          landmarkItem.nestingLevel = 0;
          if (allFlag) {
            landmarkItem.nestingLevel = this.getNestingLevel(
              landmark,
              landmarks
            );
          }
          this.skipToIdIndex += 1;
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
            case 'section':
              // Regions must have accessible name to be included
              if (landmarkItem.hasName) {
                regionElements.push(landmarkItem);
              }
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
        searchElements,
        navElements,
        asideElements,
        regionElements,
        footerElements,
        otherElements
      );
    },
  };
  // Initialize skipto menu button with onload event
  window.addEventListener('load', function () {
    SkipTo.init(
      window.SkipToConfig ||
        (typeof window.Joomla === 'object' &&
        typeof window.Joomla.getOptions === 'function'
          ? window.Joomla.getOptions('skipto-settings', {})
          : {})
    );
  });
})();
/*@end @*/
