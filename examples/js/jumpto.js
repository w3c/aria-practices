/*
 *   This content is licensed according to the W3C Software License at
 *   https://www.w3.org/Consortium/Legal/2015/copyright-software-and-document
 *
 *   File:   jumpto.js
 *
 *   Desc:   Jump to provides keyboard navigation to document structure
 *           This feature is based on the ARIA APG menu button example
 *           NOTE: This code has been contributed to the SkipTo project
 */

'use strict';

(function () {
  var JumpTo = {
    domNode: null,
    buttonNode: null,
    menuNode: null,
    menuitemNodes: [],
    firstMenuitem: false,
    lastMenuitem: false,
    firstChars: [],
    headingLevels: [],
    JumpToIdIndex: 1,
    showAllLandmarksSelector:
      'main, [role=main], [role=search], nav, [role=navigation], section[aria-label], section[aria-labelledby], section[title], [role=region][aria-label], [role=region][aria-labelledby], [role=region][title], form[aria-label], form[aria-labelledby], aside, [role=complementary], body > header, [role=banner], body > footer, [role=contentinfo]',
    showAllHeadingsSelector: 'h1, h2, h3, h4, h5, h6',
    // Default configuration values
    config: {
      // Feature switches
      enableActions: true,
      enableHeadingLevelShortcuts: true,
      enableHelp: true,
      // Customization of button and menu
      accesskey: '0', // default is the number zero
      attachElement: 'header',
      displayOption: 'static', // options: static (default), popup
      // container element, use containerClass for custom styling
      containerElement: 'div',
      containerRole: '',
      customClass: '',

      // Button labels and messages
      accesskeyNotSupported: ' is not supported on this browser.',
      buttonTitle: 'Keyboard Navigation',
      buttonTitleWithAccesskey: 'Keyboard Navigation\nAccesskey is "$key"',
      buttonLabel: 'Jump To Content',

      // Menu labels and messages
      menuLabel: 'Landmarks and Headings',
      landmarkSelectedGroupLabel: 'Landmarks',
      landmarkAllGroupLabel: 'Landmarks',
      headingSelectedGroupLabel: 'Headings',
      headingAllGroupLabel: 'Headings',
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
      positionLeft: '',
      buttonColor: '',
      buttonBackgroundColor: '',
      buttonBorderColor: '',
      buttonColorFocus: '',
      buttonFocusBackgroundColor: '',
      buttonFocusBorderColor: '',
      menuBackgroundColor: '',
      menuitemColor: '',
      menuitemBackgroundColor: '',
      menuitemFocusColor: '',
      menuitemFocusBackgroundColor: '',
      menuitemFocusBorderColor: '',
    },
    colorThemes: {
      default: {
        positionLeft: '',
        buttonColor: '#005a9c;',
        buttonBackgroundColor: '#def',
        buttonBorderColor: '#def',
        buttonFocusColor: '#fff',
        buttonFocusBackgroundColor: '#005a9c',
        buttonFocusBorderColor: '#005a9c;',
        menuBackgroundColor: '#def',
        menuBorderColor: '#005a9c',
        menuitemColor: '#000',
        menuitemBackgroundColor: '#def',
        menuitemFocusColor: '#fff',
        menuitemFocusBackgroundColor: '#005a9c',
        menuitemFocusBorderColor: '#005a9c',
      },
    },
    defaultCSS:
      '.jump-to.popup{position:absolute;top:-30em;left:-3000em}.jump-to,.jump-to.popup.focus{position:absolute;top:0;left:$positionLeft}.jump-to button{position:relative;margin:0;padding:6px 8px 6px 8px;border-width:0 1px 1px 1px;border-style:solid;border-radius:0 0 6px 6px;background-color:$buttonBackgroundColor;border-color:$buttonBorderColor;color:$buttonColor;z-index:1000}.jump-to [role=menu]{position:absolute;min-width:17em;display:none;margin:0;padding:.25rem;background-color:$menuBackgroundColor;border-width:2px;border-style:solid;border-color:$menuBorderColor;border-radius:5px;z-index:1000}.jump-to [role=group]{display:grid;grid-auto-rows:min-content;grid-row-gap:1px}.jump-to [role=separator]:first-child{border-radius:5px 5px 0 0}.jump-to [role=menuitem]{padding:3px;display:block;width:auto;border-width:0;border-style:solid;color:$menuitemColor;background-color:$menuitemBackgroundColor;z-index:1000;display:grid;overflow-y:auto;grid-template-columns:repeat(6,1.2rem) 1fr;grid-column-gap:2px;font-size:1em}.jump-to [role=menuitem] .label:first-letter,.jump-to [role=menuitem] .level:first-letter{text-decoration:underline;text-transform:uppercase}.jump-to [role=menuitem] .level{text-align:right;padding-right:4px}.jump-to [role=menuitem] .label{margin:0;padding:0;display:inline-block;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.jump-to [role=menuitem].jump-to-h1 .level{grid-column:1}.jump-to [role=menuitem].jump-to-h2 .level{grid-column:2}.jump-to [role=menuitem].jump-to-h3 .level{grid-column:3}.jump-to [role=menuitem].jump-to-h4 .level{grid-column:4}.jump-to [role=menuitem].jump-to-h5 .level{grid-column:5}.jump-to [role=menuitem].jump-to-h6 .level{grid-column:8}.jump-to [role=menuitem].jump-to-h1 .label{grid-column:2/8}.jump-to [role=menuitem].jump-to-h2 .label{grid-column:3/8}.jump-to [role=menuitem].jump-to-h3 .label{grid-column:4/8}.jump-to [role=menuitem].jump-to-h4 .label{grid-column:5/8}.jump-to [role=menuitem].jump-to-h5 .label{grid-column:6/8}.jump-to [role=menuitem].jump-to-h6 .label{grid-column:7/8}.jump-to [role=menuitem].jump-to-h1.no-level .label{grid-column:1/8}.jump-to [role=menuitem].jump-to-h2.no-level .label{grid-column:2/8}.jump-to [role=menuitem].jump-to-h3.no-level .label{grid-column:3/8}.jump-to [role=menuitem].jump-to-h4.no-level .label{grid-column:4/8}.jump-to [role=menuitem].jump-to-h5.no-level .label{grid-column:5/8}.jump-to [role=menuitem].jump-to-h6.no-level .label{grid-column:6/8}.jump-to [role=menuitem].jump-to-nesting-level-1 .nesting{grid-column:1}.jump-to [role=menuitem].jump-to-nesting-level-2 .nesting{grid-column:2}.jump-to [role=menuitem].jump-to-nesting-level-3 .nesting{grid-column:3}.jump-to [role=menuitem].jump-to-nesting-level-0 .label{grid-column:1/8}.jump-to [role=menuitem].jump-to-nesting-level-1 .label{grid-column:2/8}.jump-to [role=menuitem].jump-to-nesting-level-2 .label{grid-column:3/8}.jump-to [role=menuitem].jump-to-nesting-level-3 .label{grid-column:4/8}.jump-to [role=menuitem].action .label,.jump-to [role=menuitem].no-items .label{grid-column:1/8}.jump-to [role=separator]{margin:1px 0 1px 0;padding:3px;display:block;width:auto;font-weight:700;text-align:left;border-bottom-width:1px;border-bottom-style:solid;border-bottom-color:$menuitemColor;background-color:$menuitemBackgroundColor;color:$menuitemColor;z-index:1000}.jump-to [role=separator]:first-child{border-radius:5px 5px 0 0}.jump-to [role=menuitem].last{border-radius:0 0 5px 5px}.jump-to.focus{display:block}.jump-to button:focus,.jump-to button:hover{background-color:$buttonFocusBackgroundColor;color:$buttonFocusColor;outline:0}.jump-to button:focus{padding:4px 7px 5px 7px;border-width:2px 2px 2px 2px;border-color:$buttonFocusBorderColor}.jump-to [role=menuitem]:focus{padding:1px;border-width:2px;border-style:solid;border-color:$menuitemFocusBorderColor;background-color:$menuitemFocusBackgroundColor;color:$menuitemFocusColor;outline:0}',

    //
    // Functions related to configuring the features
    // of JumpTo
    //

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
        '$buttonColor',
        this.config.buttonColor,
        theme.buttonColor
      );
      this.updateStyle(
        '$buttonBackgroundColor',
        this.config.buttonBackgroundColor,
        theme.buttonBackgroundColor
      );
      this.updateStyle(
        '$buttonBorderColor',
        this.config.buttonBorderColor,
        theme.buttonBorderColor
      );
      this.updateStyle(
        '$buttonFocusColor',
        this.config.buttonFocusColor,
        theme.buttonFocusColor
      );
      this.updateStyle(
        '$buttonFocusBackgroundColor',
        this.config.buttonFocusBackgroundColor,
        theme.buttonFocusBackgroundColor
      );
      this.updateStyle(
        '$buttonFocusBorderColor',
        this.config.buttonFocusBorderColor,
        theme.buttonFocusBorderColor
      );
      this.updateStyle(
        '$menuBackgroundColor',
        this.config.menuBackgroundColor,
        theme.menuBackgroundColor
      );
      this.updateStyle(
        '$menuBorderColor',
        this.config.menuBorderColor,
        theme.menuBorderColor
      );
      this.updateStyle(
        '$menuitemColor',
        this.config.menuitemColor,
        theme.menuitemColor
      );
      this.updateStyle(
        '$menuitemBackgroundColor',
        this.config.menuitemBackgroundColor,
        theme.menuitemBackgroundColor
      );
      this.updateStyle(
        '$menuitemFocusColor',
        this.config.menuitemFocusColor,
        theme.menuitemFocusColor
      );
      this.updateStyle(
        '$menuitemFocusBackgroundColor',
        this.config.menuitemFocusBackgroundColor,
        theme.menuitemFocusBackgroundColor
      );
      this.updateStyle(
        '$menuitemFocusBorderColor',
        this.config.menuitemFocusBorderColor,
        theme.menuitemFocusBorderColor
      );
    },
    isNotEmptyString: function (str) {
      return typeof str === 'string' && str.length;
    },
    getBrowserSpecificAccesskey: function (accesskey) {
      var userAgent = navigator.userAgent.toLowerCase();
      var platform = navigator.platform.toLowerCase();

      var hasWin = platform.indexOf('win') >= 0;
      var hasMac = platform.indexOf('mac') >= 0;
      var hasLinux =
        platform.indexOf('linux') >= 0 || platform.indexOf('bsd') >= 0;

      var hasFirefox = userAgent.indexOf('firefox') >= 0;
      var hasChrome = userAgent.indexOf('chrome') >= 0;
      var hasOpera = userAgent.indexOf('opr') >= 0;

      if (hasWin || hasLinux) {
        if (hasFirefox) {
          return 'Shift+Alt+' + accesskey;
        } else {
          if (hasChrome || hasOpera) {
            return 'Alt+' + accesskey;
          }
        }
      }

      if (hasMac) {
        return 'Control+Option+' + accesskey;
      }

      return accesskey + this.config.accesskeyNotSupported;
    },
    init: function () {
      var attachElement = document.body;
      if (typeof this.config.attachElement === 'string') {
        var node = document.querySelector(this.config.attachElement);
        if (node && node.nodeType === Node.ELEMENT_NODE) {
          attachElement = node;
        }
      }
      this.addCSSColors();
      this.renderStyleElement(this.defaultCSS);
      this.domNode = document.createElement(this.config.containerElement);
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
            case 'onfocus': // Legacy option
            case 'popup':
              this.domNode.classList.add('popup');
              break;
            default:
              break;
          }
        }
      }
      // Place jump to at the beginning of the document
      if (attachElement.firstElementChild) {
        attachElement.insertBefore(
          this.domNode,
          attachElement.firstElementChild
        );
      } else {
        attachElement.appendChild(this.domNode);
      }
      this.buttonNode = document.createElement('button');
      this.buttonNode.textContent = this.config.buttonLabel;
      this.buttonNode.setAttribute('aria-haspopup', 'true');
      this.buttonNode.setAttribute('aria-expanded', 'false');
      this.buttonNode.setAttribute('accesskey', this.config.accesskey);

      if (
        this.isNotEmptyString(this.config.buttonTitleWithAccesskey) &&
        this.config.accesskey.length === 1
      ) {
        var title = this.config.buttonTitleWithAccesskey.replace(
          '$key',
          this.getBrowserSpecificAccesskey(this.config.accesskey)
        );
        this.buttonNode.setAttribute('title', title);
      } else {
        if (this.isNotEmptyString(this.config.buttonTitle)) {
          this.buttonNode.setAttribute('title', this.config.buttonTitle);
        }
      }

      this.domNode.appendChild(this.buttonNode);
      this.menuNode = document.createElement('div');
      this.menuNode.setAttribute('role', 'menu');
      this.domNode.appendChild(this.menuNode);
      this.buttonNode.addEventListener(
        'keydown',
        this.handleButtonKeydown.bind(this)
      );
      this.buttonNode.addEventListener(
        'click',
        this.handleButtonClick.bind(this)
      );
      this.domNode.addEventListener('focusin', this.handleFocusin.bind(this));
      this.domNode.addEventListener('focusout', this.handleFocusout.bind(this));
      window.addEventListener(
        'mousedown',
        this.handleBackgroundMousedown.bind(this),
        true
      );
    },
    renderStyleElement: function (cssString) {
      var styleNode = document.createElement('style');
      var headNode = document.getElementsByTagName('head')[0];
      var css = document.createTextNode(cssString);

      styleNode.setAttribute('type', 'text/css');
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
      if (label && label.textContent.length) {
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

      var menuitemNode = document.createElement('div');
      menuitemNode.setAttribute('role', 'menuitem');
      menuitemNode.classList.add(mi.class);
      menuitemNode.setAttribute('data-id', mi.dataId);
      menuitemNode.tabIndex = -1;
      if (mi.ariaLabel) {
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
        'mouseover',
        this.handleMenuitemMouseover.bind(this)
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
        if (mi.tagName && mi.tagName.length) {
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

    renderMenuitemGroup: function (groupId, title) {
      var labelNode, groupNode;
      var menuNode = this.menuNode;
      if (title) {
        labelNode = document.createElement('div');
        labelNode.id = groupId + '-label';
        labelNode.setAttribute('role', 'separator');
        labelNode.textContent = title;
        menuNode.appendChild(labelNode);
        groupNode = document.createElement('div');
        groupNode.setAttribute('role', 'group');
        groupNode.setAttribute('aria-labelledby', labelNode.id);
        groupNode.id = groupId;
        menuNode.appendChild(groupNode);
        menuNode = groupNode;
      }
      return groupNode;
    },

    renderMenuitemsToGroup: function (groupNode, menuitems, msgNoItemsFound) {
      groupNode.innerHTML = '';
      this.lastNestingLevel = 0;

      if (menuitems.length === 0) {
        var item = {};
        item.name = msgNoItemsFound;
        item.tagName = 'no tag';
        item.class = 'no-items';
        item.dataId = '';
        this.renderMenuitemToGroup(groupNode, item);
      } else {
        for (var i = 0; i < menuitems.length; i += 1) {
          this.renderMenuitemToGroup(groupNode, menuitems[i]);
        }
      }
    },

    getHeadingsGroupLabel: function (option) {
      if (option === 'all') {
        return this.config.headingAllGroupLabel;
      }
      return this.config.headingSelectedGroupLabel;
    },

    getShowMoreHeadingsSelector: function (option) {
      if (option === 'all') {
        return this.showAllHeadingsSelector;
      }
      return this.config.headings;
    },

    getShowMoreHeadingsLabel: function (option) {
      var label, n;

      label = this.config.actionShowSelectedHeadingsLabel;

      if (option === 'all') {
        label = this.config.actionShowAllHeadingsLabel;
      }
      n = this.getHeadings(this.getShowMoreHeadingsSelector(option));
      if (n && n.length) {
        n = n.length;
      } else {
        n = '0';
      }

      return label.replace('$num', n);
    },

    getShowMoreHeadingsAriaLabel: function (option) {
      var label, n;

      label = this.config.actionShowSelectedHeadingsAriaLabel;

      if (option === 'all') {
        label = this.config.actionShowAllHeadingsAriaLabel;
      }
      n = this.getHeadings(this.getShowMoreHeadingsSelector(option));
      if (n && n.length) {
        n = n.length;
      } else {
        n = '0';
      }

      return label.replace('$num', n);
    },

    renderActionMoreHeadings: function (groupNode) {
      var item = {};
      item.name = this.getShowMoreHeadingsLabel('all');
      item.ariaLabel = this.getShowMoreHeadingsAriaLabel('all');
      item.tagName = 'action';
      item.role = 'menuitem';
      item.class = 'action';
      item.dataId = 'jump-to-more-headings';
      var menuitemNode = this.renderMenuitemToGroup(groupNode, item);
      menuitemNode.setAttribute('data-show-heading-option', 'all');
      menuitemNode.title = this.config.actionShowHeadingsHelp;
    },

    updateHeadingGroupMenuitems: function (option) {
      var selector = this.getShowMoreHeadingsSelector(option);
      var headings = this.getHeadings(selector);
      var groupNode = document.getElementById('id-jump-to-group-headings');
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

      var labelNode = this.menuNode.querySelector(
        '#id-jump-to-group-headings-label'
      );
      labelNode.textContent = this.getHeadingsGroupLabel(option);

      if (option === 'all') {
        option = 'selected';
      } else {
        option = 'all';
      }

      var menuitemNode = this.menuNode.querySelector(
        '[data-id=jump-to-more-headings]'
      );
      menuitemNode.setAttribute('data-show-heading-option', option);
      menuitemNode.setAttribute(
        'aria-label',
        this.getShowMoreHeadingsAriaLabel(option)
      );

      labelNode = menuitemNode.querySelector('span.label');
      labelNode.textContent = this.getShowMoreHeadingsLabel(option);
    },

    getLandmarksGroupLabel: function (option) {
      if (option === 'all') {
        return this.config.landmarkAllGroupLabel;
      }
      return this.config.landmarkSelectedGroupLabel;
    },

    getShowMoreLandmarksSelector: function (option) {
      if (option === 'all') {
        return this.showAllLandmarksSelector;
      }
      return this.config.landmarks;
    },

    getShowMoreLandmarksLabel: function (option) {
      var label, n;

      if (option === 'all') {
        label = this.config.actionShowAllLandmarksLabel;
      } else {
        label = this.config.actionShowSelectedLandmarksLabel;
      }

      n = this.getLandmarks(this.getShowMoreLandmarksSelector(option));
      if (n && n.length) {
        n = n.length;
      } else {
        n = '0';
      }

      return label.replace('$num', n);
    },

    getShowMoreLandmarksAriaLabel: function (option) {
      var label, n;

      if (option === 'all') {
        label = this.config.actionShowAllLandmarksAriaLabel;
      } else {
        label = this.config.actionShowSelectedLandmarksAriaLabel;
      }

      n = this.getLandmarks(this.getShowMoreLandmarksSelector(option));
      if (n && n.length) {
        n = n.length;
      } else {
        n = '0';
      }

      return label.replace('$num', n);
    },

    renderActionMoreLandmarks: function (groupNode) {
      var item = {};
      item.name = this.getShowMoreLandmarksLabel('all');
      item.ariaLabel = this.getShowMoreLandmarksAriaLabel('all');
      item.tagName = 'action';
      item.role = 'menuitem';
      item.class = 'action';
      item.dataId = 'jump-to-more-landmarks';
      var menuitemNode = this.renderMenuitemToGroup(groupNode, item);
      menuitemNode.setAttribute('data-show-landmark-option', 'all');
      menuitemNode.title = this.config.actionShowLandmarksHelp;
    },

    updateLandmarksGroupMenuitems: function (option) {
      var selector = this.getShowMoreLandmarksSelector(option);
      var landmarks = this.getLandmarks(selector, option === 'all');
      var groupNode = document.getElementById('id-jump-to-group-landmarks');
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

      var labelNode = this.menuNode.querySelector(
        '#id-jump-to-group-landmarks-label'
      );
      labelNode.textContent = this.getLandmarksGroupLabel(option);

      if (option === 'all') {
        option = 'selected';
      } else {
        option = 'all';
      }

      var menuitemNode = this.menuNode.querySelector(
        '[data-id=jump-to-more-landmarks]'
      );
      menuitemNode.setAttribute('data-show-landmark-option', option);
      menuitemNode.setAttribute(
        'aria-label',
        this.getShowMoreLandmarksAriaLabel(option)
      );

      labelNode = menuitemNode.querySelector('span.label');
      labelNode.textContent = this.getShowMoreLandmarksLabel(option);
    },

    renderMenu: function () {
      var groupNode, landmarkElements, headingElements;
      // remove current menu items from menu
      while (this.menuNode.lastElementChild) {
        this.menuNode.removeChild(this.menuNode.lastElementChild);
      }

      // Create landmarks group
      landmarkElements = this.getLandmarks();
      groupNode = this.renderMenuitemGroup(
        'id-jump-to-group-landmarks',
        this.config.landmarkSelectedGroupLabel
      );
      this.renderMenuitemsToGroup(
        groupNode,
        landmarkElements,
        this.config.msgNoLandmarksFound
      );

      // Create headings group
      headingElements = this.getHeadings();
      groupNode = this.renderMenuitemGroup(
        'id-jump-to-group-headings',
        this.config.headingSelectedGroupLabel
      );
      this.renderMenuitemsToGroup(
        groupNode,
        headingElements,
        this.config.msgNoHeadingsFound
      );

      // Create actions, if enabled
      if (this.config.enableActions) {
        groupNode = this.renderMenuitemGroup(
          'id-jump-to-group-actions',
          this.config.actionGroupLabel
        );
        this.renderActionMoreLandmarks(groupNode);
        this.renderActionMoreHeadings(groupNode);
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
    JumpToElement: function (menuitem) {
      var inputNode = false;
      var isSearch = menuitem.classList.contains('jump-to-search');
      var node = document.querySelector(
        '[data-jump-to-id="' + menuitem.getAttribute('data-id') + '"]'
      );
      if (node) {
        if (isSearch) {
          inputNode = node.querySelector('input');
        }
        if (inputNode && this.isVisible(inputNode)) {
          inputNode.focus();
        } else {
          node.tabIndex = -1;
          node.focus();
          node.scrollIntoView({ block: 'center' });
        }
      }
    },
    handleMenuitemAction: function (tgt) {
      var option;
      switch (tgt.getAttribute('data-id')) {
        case '':
          // this means there were no headings or landmarks in the list
          break;

        case 'jump-to-more-headings':
          option = tgt.getAttribute('data-show-heading-option');
          this.updateHeadingGroupMenuitems(option);
          break;

        case 'jump-to-more-landmarks':
          option = tgt.getAttribute('data-show-landmark-option');
          this.updateLandmarksGroupMenuitems(option);
          break;

        default:
          this.closePopup();
          this.JumpToElement(tgt);
          break;
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
    handleMenuitemMouseover: function (event) {
      var tgt = event.currentTarget;
      tgt.focus();
    },
    handleBackgroundMousedown: function (event) {
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
          if (str.length) strings.push(str);
        }
        name = strings.join(' ');
      } else {
        if (label && label.length) {
          name = label;
        } else {
          if (title && title.length) {
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
            heading.setAttribute('data-jump-to-id', this.JumpToIdIndex);
            dataId = this.JumpToIdIndex;
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
          this.JumpToIdIndex += 1;
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
        // if JumpTo is a landmark don't include it in the list
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
            tagName = landmark.getAttribute('aria-roledescription');
          }
          if (landmark.hasAttribute('data-jump-to-id')) {
            dataId = landmark.getAttribute('data-jump-to-id');
          } else {
            landmark.setAttribute('data-jump-to-id', this.JumpToIdIndex);
            dataId = this.JumpToIdIndex;
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
          this.JumpToIdIndex += 1;
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

  window.addEventListener('load', function () {
    JumpTo.init();
  });
})();
