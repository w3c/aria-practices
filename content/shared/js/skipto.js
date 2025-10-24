/* ========================================================================
 * Version: 5.9.2
 * Copyright (c) 2022, 2023, 2024, 2025 Jon Gunderson; Licensed BSD
 * Copyright (c) 2021 PayPal Accessibility Team and University of Illinois; Licensed BSD
 * All rights reserved.
 * Redistribution and use in source and binary forms, with or without modification, are permitted provided that the following conditions are met:
 * Redistributions of source code must retain the above copyright notice, this list of conditions and the following disclaimer.
 * Redistributions in binary form must reproduce the above copyright notice, this list of conditions and the following disclaimer in the documentation and/or other materials provided with the distribution.
 * Neither the name of PayPal or any of its subsidiaries or affiliates, nor the name of the University of Illinois, nor the names of any other contributors contributors may be used to endorse or promote products derived from this software without specific prior written permission.
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 *
 * CDN: https://skipto-landmarks-headings.github.io/page-script-5/dist/skipto.min.js
 * Documentation: https://skipto-landmarks-headings.github.io/page-script-5
 * Code: https://github.com/skipto-landmarks-headings/page-script-5
 * Report Issues: https://github.com/skipto-landmarks-headings/page-script-5/issues
 * ======================================================================== */

(function () {
  'use strict';

  /* colorThemes */

  const colorThemes = {
    'default': {

      fontFamily: 'inherit',
      fontSize: 'inherit',
      positionLeft: '46%',
      smallBreakPoint: '580',
      mediumBreakPoint: '992',
      buttonTextColor: 'hsl(216, 60%, 18%)',
      buttonTextDarkColor: 'hsl(216, 60%, 72%)',
      buttonBackgroundColor: 'hsl(0, 0%, 87%)',
      buttonBackgroundDarkColor: 'hsl(0, 0%, 13%)',
      focusBorderColor: 'hsl(358, 95%, 40%)',
      focusBorderDarkColor: 'hsl(358, 95%, 60%)',
      menuTextColor: 'hsl(216, 60%, 18%)',
      menuTextDarkColor: 'hsl(216, 60%, 72%)',
      menuBackgroundColor: 'hsl(0, 0%, 87%)',
      menuBackgroundDarkColor: 'hsl(0, 0%, 13%)',
      menuitemFocusTextColor: 'hsl(0, 0%, 87%)',
      menuitemFocusTextDarkColor: 'hsl(0, 0%, 13%)',
      menuitemFocusBackgroundColor: 'hsl(216, 60%, 18%)',
      menuitemFocusBackgroundDarkColor: 'hsl(216, 60%, 72%)',
      zIndex: '2000000',
      displayOption: 'fixed',
      highlightTarget: 'instant',
      highlightBorderSize: 'small',
      highlightBorderStyle: 'solid'
    },
    'aria': {
      hostnameSelector: 'w3.org',
      pathnameSelector: 'ARIA/apg',
      fontFamily: 'sans-serif',
      fontSize: '10pt',
      positionLeft: '7%',
      menuTextColor: 'hsl(0, 0%, 0%)',
      menuTextDarkColor: 'hsl(0, 0%, 100%)',
      menuBackgroundColor: 'hsl(210, 100%, 93%)',
      menuBackgroundDarkColor: 'hsl(210, 100%, 07%)',
      menuitemFocusTextColor: 'hsl(0, 0%, 100%)',
      menuitemFocusTextDarkColor: 'hsl(0, 0%, 0%)',
      menuitemFocusBackgroundColor: 'hsl(205, 100%, 31%)',
      menuitemFocusBackgroundDarkColor: 'hsl(205, 100%, 69%)',
      focusBorderColor: 'hsl(205, 100%, 31%)',
      focusBorderDarkColor: 'hsl(205, 100%, 69%)',
      buttonTextColor: 'hsl(205, 100%, 31%)',
      buttonTextDarkColor: 'hsl(205, 100%, 69%)',
      buttonBackgroundColor: 'hsl(0, 0%, 87%)',
      buttonBackgroundDarkColor: 'hsl(0, 0%, 13%)'
    },
    'illinois': {
      hostnameSelector: 'illinois.edu',
      menuTextColor: 'hsl(214, 100%, 9%)',
      menuTextDarkColor: 'hsl(214, 100%, 91%)',
      menuBackgroundColor: 'hsl(216, 54%, 86%)',
      menuBackgroundDarkColor: 'hsl(216, 54%, 14%)',
      menuitemFocusTextColor: 'hsl(0, 0%, 93%)',
      menuitemFocusTextDarkColor: 'hsl(0, 0%, 7%)',
      menuitemFocusBackgroundColor: 'hsl(214, 100%, 9%)',
      menuitemFocusBackgroundDarkColor: 'hsl(214, 100%, 91%)',
      focusBorderColor: 'hsl(11, 100%, 59%)',
      focusBorderDarkColor: 'hsl(11, 100%, 41%)',
      buttonTextColor: 'hsl(0, 0%, 27%)',
      buttonTextDarkColor: 'hsl(0, 0%, 73%)',
      buttonBackgroundColor: 'hsl(180, 1%, 87%)',
      buttonBackgroundDarkColor: 'hsl(180, 1%, 13%)',
      highlightTarget: 'disabled'
    },
    'openweba11y': {
      hostnameSelector: 'openweba11y.com',
      buttonTextColor: 'hsl(216, 60%, 18%)',
      buttonTextDarkColor: 'hsl(216, 60%, 82%)',
      buttonBackgroundColor: 'hsl(0, 0%, 87%)',
      buttonBackgroundDarkColor: 'hsl(0, 0%, 13%)',
      focusBorderColor: 'hsl(358, 95%, 40%)',
      focusBorderDarkColor: 'hsl(358, 95%, 60%)',
      menuTextColor: 'hsl(216, 60%, 18%)',
      menuTextDarkColor: 'hsl(216, 60%, 82%)',
      menuBackgroundColor: 'hsl(0, 0%, 87%)',
      menuBackgroundDarkColor: 'hsl(0, 0%, 13%)',
      menuitemFocusTextColor: 'hsl(0, 0%, 87%)',
      menuitemFocusTextDarkColor: 'hsl(0, 0%, 13%)',
      menuitemFocusBackgroundColor: ' hsl(216, 60%, 18%)',
      menuitemFocusBackgroundDarkColor: ' hsl(216, 60%, 82%)',
      fontSize: '90%'
    },
    'skipto': {
      hostnameSelector: 'skipto-landmarks-headings.github.io',
      positionLeft: '25%',
      fontSize: '14px',
      menuTextColor: 'hsl(214, 100%, 9%)',
      menuTextDarkColor: 'hsl(214, 100%, 91%)',
      menuBackgroundColor: 'hsl(216, 54%, 86%)',
      menuBackgroundDarkColor: 'hsl(216, 54%, 14%)',
      menuitemFocusTextColor: 'hsl(0, 0%, 93%)',
      menuitemFocusTextDarkColor: 'hsl(0, 0%, 7%)',
      menuitemFocusBackgroundColor: 'hsl(214, 100%, 9%)',
      menuitemFocusBackgroundDarkColor: 'hsl(214, 100%, 91%)',
      focusBorderColor: 'hsl(11, 100%, 59%)',
      focusBorderDarkColor: 'hsl(11, 100%, 41%)',
      buttonTextColor: 'hsl(0, 0%, 27%)',
      buttonTextDarkColor: 'hsl(0, 0%, 73%)',
      buttonBackgroundColor: 'hsl(180, 1%, 87%)',
      buttonBackgroundDarkColor: 'hsl(180, 1%, 13%)',
    },
    'uic': {
      hostnameSelector: 'uic.edu',
      menuTextColor: 'hsl(222, 100%, 19%)',
      menuTextDarkColor: 'hsl(222, 100%, 81%)',
      menuBackgroundColor: 'hsl(0, 0%, 97%)',
      menuBackgroundDarkColor: 'hsl(0, 0%, 3%)',
      menuitemFocusTextColor: 'hsl(0, 0%, 100%)',
      menuitemFocusTextDarkColor: 'hsl(0, 0%, 0%)',
      menuitemFocusBackgroundColor: 'hsl(222, 100%, 19%)',
      menuitemFocusBackgroundDarkColor: 'hsl(222, 100%, 81%)',
      focusBorderColor: 'hsl(346, 100%, 42%)',
      focusBorderDarkColor: 'hsl(346, 100%, 58%)',
      buttonTextColor: 'hsl(0, 0%, 100%)',
      buttonTextDarkColor: 'hsl(0, 0%, 0%)',
      buttonBackgroundColor: 'hsl(222, 100%, 19%)',
      buttonBackgroundDarkColor: 'hsl(222, 100%, 81%)'
    },
    'uillinois': {
      hostnameSelector: 'uillinois.edu',
      menuTextColor: 'hsl(222, 100%, 19%)',
      menuTextDarkColor: 'hsl(222, 100%, 81%)',
      menuBackgroundColor: 'hsl(210, 5%, 91%)',
      menuBackgroundDarkColor: 'hsl(210, 5%, 9%)',
      menuitemFocusTextColor: 'hsl(0, 0%, 97%)',
      menuitemFocusTextDarkColor: 'hsl(0, 0%, 3%)',
      menuitemFocusBackgroundColor: 'hsl(216, 60%, 18%)',
      menuitemFocusBackgroundDarkColor: 'hsl(216, 60%, 82%)',
      focusBorderColor: 'hsl(13, 97%, 44%)',
      focusBorderDarkColor: 'hsl(13, 97%, 56%)',
      buttonTextColor: 'hsl(210, 5%, 91%)',
      buttonTextDarkColor: 'hsl(210, 5%, 9%)',
      buttonBackgroundColor: 'hsl(216, 60%, 18%)',
      buttonBackgroundDarkColor: 'hsl(216, 60%, 82%)',
      highlightTarget: 'disabled'
    },
    'uis': {
      hostnameSelector: 'uis.edu',
      menuTextColor: 'hsl(210, 100%, 20%)',
      menuTextDarkColor: 'hsl(210, 100%, 80%)',
      menuBackgroundColor: 'hsl(0, 0%, 100%)',
      menuBackgroundDarkColor: 'hsl(0, 0%, 0%)',
      menuitemFocusTextColor: 'hsl(0, 0%, 100%)',
      menuitemFocusTextDarkColor: 'hsl(0, 0%, 0%)',
      menuitemFocusBackgroundColor: 'hsl(210, 100%, 20%)',
      menuitemFocusBackgroundDarkColor: 'hsl(210, 100%, 80%)',
      focusBorderColor: 'hsl(354, 71%, 54%)',
      focusBorderDarkColor: 'hsl(354, 71%, 46%)',
      buttonTextColor: 'hsl(0, 0%, 100%)',
      buttonTextDarkColor: 'hsl(0, 0%, 0%)',
      buttonBackgroundColor: 'hsl(210, 100%, 20%)',
      buttonBackgroundDarkColor: 'hsl(210, 100%, 80%)',
    },
    'walmart': {
      hostnameSelector: 'walmart.com',
      buttonTextColor: 'hsl(0, 0%, 100%)',
      buttonTextDarkColor: 'hsl(0, 0%, 0%)',
      buttonBackgroundColor: 'hsl(215, 100%, 30%)',
      buttonBackgroundDarkColor: 'hsl(215, 100%, 70%)',
      focusBorderColor: 'hsl(44, 100%, 56%)',
      focusBorderDarkColor: 'hsl(44, 100%, 44%)',
      menuTextColor: 'hsl(0, 0%, 100%)',
      menuTextDarkColor: 'hsl(0, 0%, 0%)',
      menuBackgroundColor: 'hsl(209, 100%, 43%)',
      menuBackgroundDarkColor: 'hsl(209, 100%, 57%)',
      menuitemFocusTextColor: 'hsl(215, 100%, 30%)',
      menuitemFocusTextDarkColor: 'hsl(215, 100%, 70%)',
      menuitemFocusBackgroundColor: 'hsl(0, 0%, 100%)',
      menuitemFocusBackgroundDarkColor: 'hsl(0, 0%, 0%)',
    }
  };

  /*
  *   debug.js
  *
  *   Usage
  *     import DebugLogging from './debug.js';
  *     const debug = new DebugLogging('myLabel', true); // e.g. 'myModule'
  *     ...
  *     if (debug.flag) debug.log('myMessage');
  *
  *   Notes
  *     new DebugLogging() - calling the constructor with no arguments results
  *                   in debug.flag set to false and debug.label set to 'debug';
  *                   constructor accepts 0, 1 or 2 arguments in any order
  *                   @param flag [optional] {boolean} - sets debug.flag
  *                   @param label [optional] {string} - sets debug.label
  *   Properties
  *     debug.flag    {boolean} allows you to switch debug logging on or off;
  *                   default value is false
  *     debug.label   {string} rendered as a prefix to each log message;
  *                   default value is 'debug'
  *   Methods
  *     debug.log        calls console.log with label prefix and message
  *                      @param message {object} - console.log calls toString()
  *                      @param spaceAbove [optional] {boolean}
  *
  *     debug.tag        outputs tagName and textContent of DOM element
  *                      @param node {DOM node reference} - usually an HTMLElement
  *                      @param spaceAbove [optional] {boolean}
  *
  *     debug.separator  outputs only debug.label and a series of hyphens
  *                      @param spaceAbove [optional] {boolean}
  */

  class DebugLogging {
    constructor (...args) {
      // Default values for cases where fewer than two arguments are provided
      this._flag = false;
      this._label = 'debug';

      // The constructor may be called with zero, one or two arguments. If two
      // arguments, they can be in any order: one is assumed to be the boolean
      // value for '_flag' and the other one the string value for '_label'.
      for (const [index, arg] of args.entries()) {
        if (index < 2) {
          switch (typeof arg) {
            case 'boolean':
              this._flag = arg;
              break;
            case 'string':
              this._label = arg;
              break;
          }
        }
      }
    }

    get flag () { return this._flag; }

    set flag (value) {
      if (typeof value === 'boolean') {
        this._flag = value;
      }
    }

    get label () { return this._label; }

    set label (value) {
      if (typeof value === 'string') {
        this._label = value;
      }
    }

    log (message, spaceAbove) {
      const newline = spaceAbove ? '\n' : '';
      console.log(`${newline}[${this._label}] ${message}`);
    }

    tag (node, spaceAbove) {
      if (node && node.tagName) {
        const text = node.textContent.trim().replace(/\s+/g, ' ');
        this.log(`[${node.tagName}]: ${text.substring(0, 40)}`, spaceAbove);
      }
    }

    separator (spaceAbove) {
      this.log('-----------------------------', spaceAbove);
    }

  }

  /* constants.js */

  // Numbers

  const REQUIRE_ACCESSIBLE_NAME_COUNT = 3;

  // Element IDs

  const SKIP_TO_ID            = 'id-skip-to-ver-5';

  const SCRIPT_EXTENSION_ID   = `id-skip-to-extension`;
  const SCRIPT_BOOKMARKLET_ID = `id-skip-to-bookmarklet`;


  const MENU_LANDMARK_GROUP_ID        = 'id-skip-to-landmark-group';
  const MENU_LANDMARK_GROUP_LABEL_ID  = 'id-skip-to-landmark-group-label';

  const MENU_HEADINGS_GROUP_ID        = 'id-skip-to-heading-group';
  const MENU_HEADINGS_GROUP_LABEL_ID  = 'id-skip-to-heading-group-label';

  const MENU_SHORTCUTS_GROUP_ID       = 'id-skip-to-shortcuts-group';
  const MENU_SHORTCUTS_GROUP_LABEL_ID = 'id-skip-to-shortcuts-group-label';

  const MENU_ABOUT_ID     = 'id-skip-to-about';

  const BUTTON_ID         = 'id-skip-to-button';
  const MENU_ID           = 'id-skip-to-menu';
  const DIALOG_ID         = 'id-skip-to-dialog';
  const MESSAGE_ID        = 'id-skip-to-message';
  const HIGHLIGHT_ID      = 'id-skip-to-highlight-overlay';
  const HIDDEN_ELEMENT_ID = 'id-skip-to-hidden-element';


  // Custom element names

  const PAGE_SCRIPT_ELEMENT_NAME = 'skip-to-content';
  const BOOKMARKLET_ELEMENT_NAME = 'skip-to-content-bookmarklet';
  const EXTENSION_ELEMENT_NAME   = 'skip-to-content-extension';

  // Attributes

  const ATTR_SKIP_TO_DATA = 'data-skipto';

  // URLs to more information

  const MORE_ABOUT_INFO_URL    ='https://skipto-landmarks-headings.github.io/page-script-5/';
  const MORE_SHORTCUT_INFO_URL ='https://skipto-landmarks-headings.github.io/page-script-5/shortcuts.html';

  /* utils.js */

  /* Constants */
  const debug$c = new DebugLogging('Utils', false);
  debug$c.flag = false;

  /*
   * @function getHighlightInfo
   *
   * @desc Returns an array of sizes and fonts for highlighting elements
   *
   * @param   {String}   size  : Highlight border size 'small', 'medium', 'large' or 'x-large'
   *
   * @returns [borderWidth, shadowWidth, offset, fontSize]
   */
  function getHighlightInfo (size) {

    let borderWidth, shadowWidth, offset, fontSize;

    const highlightBorderSize =  size ?
                                 size :
                                 'small';

    switch (highlightBorderSize) {
      case 'small':
        borderWidth = 2;
        shadowWidth = 1;
        offset = 4;
        fontSize = '12pt';
        break;

      case 'medium':
        borderWidth = 3;
        shadowWidth = 2;
        offset = 4;
        fontSize = '13pt';
        break;

      case 'large':
        borderWidth = 4;
        shadowWidth = 3;
        offset = 6;
        fontSize = '14pt';
       break;

      case 'x-large':
        borderWidth = 6;
        shadowWidth = 3;
        offset = 8;
        fontSize = '16pt';
        break;

      default:
        borderWidth = 2;
        shadowWidth = 1;
        offset = 4;
        fontSize = '12pt';
        break;
    }
    return [borderWidth, shadowWidth, offset, fontSize];
  }

  /*
   * @function getAttributeValue
   * 
   * @desc Return attribute value if present on element,
   *       otherwise return empty string.
   *
   * @returns {String} see @desc
   */
  function getAttributeValue (element, attribute) {
    let value = element.getAttribute(attribute);
    return (value === null) ? '' : normalize(value);
  }

  /*
   * @function normalize
   *
   * @desc Trim leading and trailing whitespace and condense all
   *       internal sequences of whitespace to a single space. Adapted from
   *       Mozilla documentation on String.prototype.trim polyfill. Handles
   *       BOM and NBSP characters.
   *
   * @return {String}  see @desc
   */
  function normalize (s) {
    let rtrim = /^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g;
    return s.replace(rtrim, '').replace(/\s+/g, ' ');
  }

  /**
   * @fuction isNotEmptyString
   *
   * @desc Returns true if the string has content, otherwise false
   *
   * @param {Boolean}  see @desc
   */
  function isNotEmptyString (str) {
    return (typeof str === 'string') && str.length && str.trim() && str !== "&nbsp;";
  }

  /**
   * @fuction isVisible
   *
   * @desc Returns true if the element is visible in the graphical rendering 
   *
   * @param {node}  elem  - DOM element node of a labelable element
   */
  function isVisible (element) {

    function isDisplayNone(el) {
      if (!el || (el.nodeType !== Node.ELEMENT_NODE)) {
        return false;
      }

      if (el.hasAttribute('hidden')) {
        return true;
      }

      const style = window.getComputedStyle(el, null);
      const display = style.getPropertyValue("display");
      if (display === 'none') { 
        return true;
      }

      // check ancestors for display none
      if (el.parentNode) {
        return isDisplayNone(el.parentNode);
      }

      return false;
    }

    const computedStyle = window.getComputedStyle(element);
    let visibility = computedStyle.getPropertyValue('visibility');
    if ((visibility === 'hidden') || (visibility === 'collapse')) {
      return false;
    }

    return !isDisplayNone(element);
  }

  /**
   * @function isIOS
   *
   * @desc  Returns true if operating system is iOS
   *
   * @return  {Boolean}  see @desc
   */
  function isIOS() {
    return (/(iPad|iPhone|iPod)/g.test(navigator.userAgent) && navigator.maxTouchPoints);
  }

  /* style.js */

  /* Constants */
  const debug$b = new DebugLogging('style', false);
  debug$b.flag = false;



  const cssStyleTemplate = document.createElement('template');
  cssStyleTemplate.textContent = `
.container {
  color-scheme: light dark;

  --skipto-popup-offset: -36px;
  --skipto-show-border-offset: -28px;
  --skipto-menu-offset: 36px;

  --skipto-font-family: 'inherit';
  --skipto-font-size: 'inherit';
  --skipto-position-left: '46%';
  --skipto-small-break-point: '580px';
  --skipto-medium-break-point: '992px';

  --skipto-button-text-color: '#13294b';
  --skipto-button-text-dark-color: '#ffffff';

  --skipto-button-background-color: '#dddddd';
  --skipto-button-background-dark-color: '#013c93';

  --skipto-focus-border-color: '#c5050c';
  --skipto-focus-border-dark-color: '#ffffff';

  --skipto-menu-text-color: '#13294b';
  --skipto-menu-text-dark-color: '#ffffff';

  --skipto-menu-background-color: '#dddddd';
  --skipto-menu-background-dark-color: '#000000';

  --skipto-menuitem-focus-text-color: '#dddddd';
  --skipto-menuitem-focus-text-dark-color: '#ffffff';

  --skipto-menuitem-focus-background-color: '#13294b';
  --skipto-menuitem-focus-background-dark-color: '#013c93';

  --skipto-dialog-text-color: '#000000';
  --skipto-dialog-text-dark-color: '#ffffff';

  --skipto-dialog-background-color: '#ffffff';
  --skipto-dialog-background-dark-color: '#000000';

  --skipto-dialog-background-title-color: '#eeeeee';
  --skipto-dialog-background-title-dark-color: '#013c93';

  --skipto-z-index-1: '2000001';
  --skipto-z-index-2: '20000002';
  --skipto-z-index-highlight: '1999900';

  --skipto-highlight-offset: '6px';
  --skipto-highlight-border-width: '4px':
  --skipto-highlight-font-size: '14pt':
  --skipto-highlight-shadow-border-width: '10px';
  --skipto-highlight-border-style: 'dashed';

  --skipto-hidden-text-color: '#000000';
  --skipto-hidden-text-dark-color: '#0000000';
  --skipto-hidden-background-color: '#ffcc00';
  --skipto-hidden-background-dark-color: '#ffcc00';

}

.container {
  display: block;
  z-index: var(--skipto-z-index-1);
}

.menu-button.popup {
  transform: translateY(var(--skipto-popup-offset));
  transition: top 0.35s ease;
}

.menu-button.popup.show-border {
  transform: translateY(var(--skipto-show-border-offset));
/* top: var(--skipto-show-border-offset); */
  transition: top 0.35s ease;
}

.menu-button.popup.ios button {
  display: none;
}

.menu-button button .skipto-text {
  padding: 6px 8px 6px 8px;
  display: inline-block;
}

.menu-button button .skipto-small {
  padding: 6px 8px 6px 8px;
  display: none;
}

.menu-button button .skipto-medium {
  padding: 6px 8px 6px 8px;
  display: none;
}

.menu-button {
  position: fixed;
  left: var(--skipto-position-left);
  z-index: var(--skipto-z-index-1) !important;
}

.menu-button button {
  margin: 0;
  padding: 0;
  border-width: 0px 1px 1px 1px;
  border-style: solid;
  border-radius: 0px 0px 6px 6px;
  border-color: light-dark(var(--skipto-button-background-color), var(--skipto-button-background-dark-color));
  color: light-dark(var(--skipto-button-text-color), var(--skipto-button-text-dark-color));
  background-color: light-dark(var(--skipto-button-background-color), var(--skipto-button-background-dark-color));
  font-size: var(--skipto-font-size);
  font-family: var(--skipto-font-family);
}

@media screen and (max-width: var(--skipto-small-break-point)) {
  .menu-button:not(.popup) button .skipto-small {
    transition: top 0.35s ease;
    display: inline-block;
  }

  .menu-button:not(.popup) button .skipto-text,
  .menu-button:not(.popup) button .skipto-medium {
    transition: top 0.35s ease;
    display: none;
  }

  .menu-button:not(.popup) button:focus .skipto-text {
    transition: top 0.35s ease;
    display: inline-block;
  }

  .menu-button:not(.popup) button:focus .skipto-small,
  .menu-button:not(.popup) button:focus .skipto-medium {
    transition: top 0.35s ease;
    display: none;
  }
}

@media screen and (min-width: var(--skipto-small-break-point)) and (max-width: var(--skipto-medium-break-point)) {
  .menu-button:not(.popup) button .skipto-medium {
    transition: top 0.35s ease;
    display: inline-block;
  }

  .menu-button:not(.popup) button .skipto-text,
  .menu-button:not(.popup) button .skipto-small {
    transition: top 0.35s ease;
    display: none;
  }

  .menu-button:not(.popup) button:focus .skipto-text {
    transition: top 0.35s ease;
    display: inline-block;
  }

  .menu-button:not(.popup) button:focus .skipto-small,
  .menu-button:not(.popup) button:focus .skipto-medium {
    transition: top 0.35s ease;
    display: none;
  }
}

.menu-button.static {
  position: absolute !important;
}

.menu-button [role="menu"] {
  min-width: 16em;
  display: none;
  margin: 0;
  padding: 0.25rem;
  background-color: light-dark(var(--skipto-menu-background-color), var(--skipto-menu-background-dark-color));
  border-width: 2px;
  border-style: solid;
  border-color: light-dark(var(--skipto-focus-border-color), var(--skipto-focus-border-dark-color));
  border-radius: 5px;
  z-index: var(--skipto-z-index-1) !important;
  touch-action: none;
  font-size: var(--skipto-font-size);
  font-family: var(--skipto-font-family);
}

.menu-button [role="group"] {
  display: grid;
  grid-auto-rows: min-content;
  grid-row-gap: 1px;
}

.menu-button [role="group"].overflow {
  overflow-x: hidden;
  overflow-y: scroll;
}

.menu-button [role="separator"]:first-child {
  border-radius: 5px 5px 0 0;
}

.menu-button [role="menuitem"] {
  padding: 3px;
  width: auto;
  border-width: 0px;
  border-style: solid;
  color: light-dark(var(--skipto-menu-text-color), var(--skipto-menu-text-dark-color));
  background-color: light-dark(var(--skipto-menu-background-color), var(--skipto-menu-background-dark-color));
  display: grid;
  overflow-y: clip;
  grid-template-columns: repeat(6, 1.2rem) 1fr;
  grid-column-gap: 2px;
  z-index: var(--skipto-z-index-1);
}

.menu-button [role="menuitem"].shortcuts,
.menu-button [role="menuitem"].about {
  z-index: var(--skipto-z-index-2);
}


.menu-button [role="menuitem"] .level,
.menu-button [role="menuitem"] .label {
  font-size: 100%;
  font-weight: normal;
  color: light-dark(var(--skipto-menu-text-color), var(--skipto-menu-text-dark-color));
  background-color: light-dark(var(--skipto-menu-background-color), var(--skipto-menu-background-dark-color));
  display: inline-block;
  line-height: inherit;
  display: inline-block;
  white-space: nowrap;
  border: none;
}

.menu-button [role="menuitem"] .level {
  text-align: right;
  padding-right: 4px;
}

.menu-button [role="menuitem"] .label {
  text-align: left;
  margin: 0;
  padding: 0;
  overflow: hidden;
  text-overflow: ellipsis;
}

.menu-button [role="menuitem"] .level:first-letter,
.menu-button [role="menuitem"] .label:first-letter {
  text-decoration: underline;
  text-transform: uppercase;
}


.menu-button [role="menuitem"].skip-to-h1 .level { grid-column: 1; }
.menu-button [role="menuitem"].skip-to-h2 .level { grid-column: 2; }
.menu-button [role="menuitem"].skip-to-h3 .level { grid-column: 3; }
.menu-button [role="menuitem"].skip-to-h4 .level { grid-column: 4; }
.menu-button [role="menuitem"].skip-to-h5 .level { grid-column: 5; }
.menu-button [role="menuitem"].skip-to-h6 .level { grid-column: 6;}

.menu-button [role="menuitem"].skip-to-h1 .label { grid-column: 2 / 8; }
.menu-button [role="menuitem"].skip-to-h2 .label { grid-column: 3 / 8; }
.menu-button [role="menuitem"].skip-to-h3 .label { grid-column: 4 / 8; }
.menu-button [role="menuitem"].skip-to-h4 .label { grid-column: 5 / 8; }
.menu-button [role="menuitem"].skip-to-h5 .label { grid-column: 6 / 8; }
.menu-button [role="menuitem"].skip-to-h6 .label { grid-column: 7 / 8;}

.menu-button [role="menuitem"].skip-to-h1.no-level .label { grid-column: 1 / 8; }
.menu-button [role="menuitem"].skip-to-h2.no-level .label { grid-column: 2 / 8; }
.menu-button [role="menuitem"].skip-to-h3.no-level .label { grid-column: 3 / 8; }
.menu-button [role="menuitem"].skip-to-h4.no-level .label { grid-column: 4 / 8; }
.menu-button [role="menuitem"].skip-to-h5.no-level .label { grid-column: 5 / 8; }
.menu-button [role="menuitem"].skip-to-h6.no-level .label { grid-column: 6 / 8; }

.menu-button [role="menuitem"].skip-to-nesting-level-1 .nesting { grid-column: 1; }
.menu-button [role="menuitem"].skip-to-nesting-level-2 .nesting { grid-column: 2; }
.menu-button [role="menuitem"].skip-to-nesting-level-3 .nesting { grid-column: 3; }

.menu-button [role="menuitem"].skip-to-nesting-level-0 .label { grid-column: 1 / 8; }
.menu-button [role="menuitem"].skip-to-nesting-level-1 .label { grid-column: 2 / 8; }
.menu-button [role="menuitem"].skip-to-nesting-level-2 .label { grid-column: 3 / 8; }
.menu-button [role="menuitem"].skip-to-nesting-level-3 .label { grid-column: 4 / 8; }

.menu-button [role="menuitem"].no-items .label,
.menu-button [role="menuitem"].action .label {
  grid-column: 1 / 8;
}

.menu-button [role="separator"] {
  margin: 1px 0px 1px 0px;
  padding: 3px;
  display: block;
  width: auto;
  font-weight: bold;
  border-bottom-width: 1px;
  border-bottom-style: solid;
  border-bottom-color: light-dark(var(--skipto-menu-text-color), var(--skipto-menu-text-dark-color));
  background-color: light-dark(var(--skipto-menu-background-color), var(--skipto-menu-background-dark-color));
  color: light-dark(var(--skipto-menu-text-color), var(--skipto-menu-text-dark-color));
  z-index: var(--skipto-z-index-1) !important;
}

.menu-button [role="separator"] .mofn {
  font-weight: normal;
  font-size: 85%;
}

.menu-button [role="separator"]:first-child {
  border-radius: 5px 5px 0 0;
}

.menu-button [role="menuitem"].last {
  border-radius: 0 0 5px 5px;
}

/* focus styling */

.menu-button button:focus,
.menu-button button:hover {
  background-color: light-dark(var(--skipto-menu-background-color), var(--skipto-menu-background-dark-color));
  color: light-dark(var(--skipto-menu-text-color), var(--skipto-menu-text-dark-color));
  outline: none;
  border-width: 0px 2px 2px 2px;
  border-color: light-dark(var(--skipto-focus-border-color), var(--skipto-focus-border-dark-color));
}

.menu-button.popup.focus,
.menu-button.popup.menu,
.menu-button.popup:hover {
  transform: translateY(0);
  display: block;
  transition: left 1s ease;
  z-index: var(--skipto-z-index-1) !important;
}

.menu-button.popup.ios.focus button {
  display: block;
}

.menu-button button:focus .skipto-text,
.menu-button button:hover .skipto-text,
.menu-button button:focus .skipto-small,
.menu-button button:hover .skipto-small,
.menu-button button:focus .skipto-medium,
.menu-button button:hover .skipto-medium {
  padding: 6px 7px 5px 7px;
}

.menu-button [role="menuitem"]:focus {
  padding: 1px;
  border-width: 2px;
  border-style: solid;
  border-color: light-dark(var(--skipto-focus-border-color), var(--skipto-focus-border-dark-color));
  outline: none;
}

.menu-button [role="menuitem"].hover,
.menu-button [role="menuitem"].hover .level,
.menu-button [role="menuitem"].hover .label {
  background-color: light-dark(var(--skipto-menuitem-focus-background-color), var(--skipto-menuitem-focus-background-dark-color));
  color: light-dark(var(--skipto-menuitem-focus-text-color), var(--skipto-menuitem-focus-text-dark-color));
}

.menu-button [role="separator"].shortcuts-disabled,
.menu-button [role="menuitem"].shortcuts-disabled {
  display: none;
}


@media (forced-colors: active) {

  .menu-button button {
    border-color: ButtonBorder;
    color: ButtonText;
    background-color: ButtonFace;
  }

  .menu-button [role="menu"] {
    background-color: ButtonFace;
    border-color: ButtonText;
  }

  .menu-button [role="menuitem"] {
    color: ButtonText;
    background-color: ButtonFace;
  }

  .menu-button [role="menuitem"] .level,
  .menu-button [role="menuitem"] .label {
    color: ButtonText;
    background-color: ButtonFace;
  }

  .menu-button [role="separator"] {
    border-bottom-color: ButtonBorder;
    background-color: ButtonFace;
    color: ButtonText;
    z-index: var(--skipto-z-index-1) !important;
  }

  .menu-button button:focus,
  .menu-button button:hover {
    background-color: ButtonFace;
    color: ButtonText;
    border-color: ButtonBorder;
  }

  .menu-button [role="menuitem"]:focus {
    background-color: ButtonText;
    color: ButtonFace;
    border-color: ButtonBorder;
  }

  .menu-button [role="menuitem"].hover,
  .menu-button [role="menuitem"].hover .level,
  .menu-button [role="menuitem"].hover .label {
    background-color: ButtonText;
    color: ButtonFace;
  }
}

/* Dialog Styling */

dialog {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%,-50%);
  font-family: var(--skipto-font-family);
  font-size: var(--skipto-font-size);
  max-width: 70%;
  margin: 0;
  padding: 0;
  background-color: light-dark(var(--skipto-dialog-background-color), var(--skipto-dialog-background-dark-color));
  color: light-dark(var(--skipto-dialog-text-color), var(--skipto-dialog-text-dark-color));
  border-width: 2px;
  border-style: solid;
  border-color: light-dark(var(--skipto-focus-border-color), --skipto-focus-border-dark-color));
  border-radius: 5px;
  z-index: 2000001;
}

dialog .header {
  margin: 0;
  margin-bottom: 0.5em;
  padding: 4px;
  border-width: 0;
  border-bottom-width: 1px;
  border-style: solid;
  border-color: light-dark(--skipto-focus-border-color), --skipto-focus-border-dark-color));
  border-top-left-radius: 5px;
  border-top-right-radius: 5px;
  font-weight:  bold;
  background-color: light-dark(var(--skipto-dialog-background-title-color), var(--skipto-dialog-background-title-dark-color));
  color: light-dark(var(--skipto-dialog-text-color), var(--skipto-dialog-text-dark-color));
  position: relative;
  font-size: 100%;
}

dialog .header h2 {
  margin: 0;
  padding: 0;
  font-size: 1em;
}

dialog .header button {
  position: absolute;
  top: 4px;
  right: 2px;
  border: none;
  background: transparent;
  font-weight: bold;
  color: light-dark(var(--skipto-dialog-text-color), var(--skipto-dialog-text-dark-color));
  font-family: var(--skipto-font-family);
  font-size: var(--skipto-font-size);
}

dialog .content {
  margin-left: 2em;
  margin-right: 2em;
  margin-top: 0;
  margin-bottom: 2em;
}

dialog .content .desc {
  margin: 0.25em;
  text-align: center;
}

dialog .content .privacy-label {
  margin: 0;
  margin-top: 1em;
  text-align: center;
  font-weight: bold;
}

dialog .content .privacy {
  text-align: center;
  margin-bottom: 1em;
}

dialog .content .happy {
  text-align: center;
  font-family: 'Brush Script MT', cursive;
  font-size: 200%;
  letter-spacing: 0.05em;
}

dialog .content .version,
dialog .content .copyright {
  margin-top: 0.5em;
  text-align: center;
}

dialog .content table {
  width: auto;
  border-collapse: collapse;
}

dialog .content caption {
  margin: 0;
  padding: 0;
  margin-top: 1em;
  text-align: left;
  font-weight: bold;
  font-size: 110%;
}

dialog .content th {
  margin: 0;
  padding: 0;
  padding-top: 0.125em;
  padding-bottom: 0.125em;
  text-align: left;
  font-weight: bold;
  font-size: 100%;
}

dialog .content th {
  border-bottom-width: 1px;
  border-bottom-style: solid;
  border-bottom-color: light-dark(#999999, #777777);
}

dialog .content td.shortcut,
dialog .content td.desc {
  margin: 0;
  padding-left: 0.25em;
  padding-right: 0.25em;
  padding-top: 0.125em;
  padding-bottom: 0.125em;
  text-align: left;
  font-size: 100%;
}

dialog .content th.shortcut {
  text-align: left;
  width: 3em;
}

dialog .content th.desc {
  text-align: left;
  width: 12em;
}

dialog .content table tr:nth-child(even) {
  background-color: light-dark(#eeeeee, #111111);
}

dialog .buttons {
  float: right;
  margin-right: 0.5em;
  margin-bottom: 0.5em;
}

dialog .buttons button {
  margin: 6px;
  min-width: 5em;
  font-family: var(--skipto-font-family);
  font-size: var(--skipto-font-size);
}

dialog button:focus {
  outline: 2px solid currentColor;
  outline-offset: 2px;
}

dialog button:hover {
  cursor: pointer;
}

/* Navigation Messages */

#${MESSAGE_ID} {
  position: fixed;
  display: block;
  opacity: 1;
  top: 50%;
  left: 50%;
  transform: translate(-50%,-50%);

  font-family: $fontFamily;
  font-size: $fontSize;
  max-width: 70%;
  margin: 0;
  padding: 0;
  background-color: light-dark(var(--skipto-dialog-background-color), var(--skipto-dialog-background-dark-color));
  border: 2px solid light-dark(var(--skipto-focus-border-color), var(--skipto-focus-border-dark-color));
  border-radius: 5px;
  color: light-dark(var(--skipto-dialog-text-color), var(--skipto-dialog-text-dark-color));
  z-index: 2000001;
  opacity: 1;
}

#${MESSAGE_ID} .header {
  margin: 0;
  padding: 4px;
  border-bottom: 1px solid light-dark(var(--skipto-focus-border-color), var(--skipto-focus-border-dark-color));
  border-top-left-radius: 5px;
  border-top-right-radius: 5px;
  font-weight:  bold;
  background-color: light-dark(var(--skipto-dialog-background-title-color), var(--skipto-dialog-background-title-dark-color));
  color light-dark(var(--skipto-dialog-text-color), var(--skipto-dialog-text-dark-color));
  font-size: 100%;
}

#${MESSAGE_ID} .content {
  margin-left: 2em;
  margin-right: 2em;
  margin-top: 2em;
  margin-bottom: 2em;
  background-color: light-dark(var(--skipto-dialog-background-color), var(--skipto-dialog-background-dark-color));
  color: light-dark(var(--skipto-dialog-text-color), var(--skipto-dialog-text-dark-color));
  font-size: 110%;
  text-algin: center;
}

#${MESSAGE_ID}.hidden {
  display: none;
}

#${MESSAGE_ID}.fade {
  opacity: 0;
  transition: visibility 0s 1s, opacity 1s linear;
}

@media (forced-colors: active) {

  #${MESSAGE_ID} {
    background-color: Canvas;
    color CanvasText;
    border-color: AccentColor;
  }

  #${MESSAGE_ID} .header {
    background-color: Canvas;
    color CanvasText;
  }

  #${MESSAGE_ID} .content {
    background-color: Canvas;
    color: CanvasText;
  }
}

#${HIGHLIGHT_ID} {
  margin: 0;
  padding: 0;
  position: absolute;
  border-radius: var(--skipto-highlight-offset);
  border-width: var(--skipto-highlight-shadow-border-width);
  border-style: solid;
  border-color: light-dark(var(--skipto-menu-background-color), var(--skipto-menu-background-dark-color));
  box-sizing: border-box;
  pointer-events:none;
  z-index: var(--skipto-z-index-highlight);
}

#${HIGHLIGHT_ID} .overlay-border {
  margin: 0;
  padding: 0;
  position: relative;
  border-radius: var(--skipto-highlight-offset);
  border-width: var(--skipto-highlight-border-width);
  border-style: var(--skipto-highlight-border-style);
  border-color: light-dark(var(--skipto-focus-border-color), var(--skipto-focus-border-dark-color));
  z-index: var(--skipto-z-index-1);
  box-sizing: border-box;
  pointer-events:none;
  background: transparent;
}


@keyframes fadeIn {
  0% { opacity: 0; }
  100% { opacity: 1; }
}

#${HIDDEN_ELEMENT_ID} {
  position: absolute;
  margin: 0;
  padding: .25em;
  background-color: light-dark(var(--skipto-hidden-background-color), var(--skipto-hidden-background-dark-color));
  color: light-dark(var(--skipto-hidden-text-color), var(--skipto-hidden-text-dark-color));
  font-family: var(--skipto-font-family);
  font-size: var(--skipto-highlight-font-size);
  font-style: italic;
  font-weight: bold;
  text-align: center;
  animation: fadeIn 1.5s;
  z-index: var(--skipto-z-index-1);
}

#${HIGHLIGHT_ID} .overlay-info {
  margin: 0;
  padding: 2px;
  position: relative;
  text-align: left;
  font-size: $fontSize;
  font-family: $fontFamily;
  border: var(--skipto-highlight-border-width) solid light-dark($menuBackgroundColor, $menuBackgroundDarkColor);
  background-color: light-dark(var(--skipto-menu-background-color), var(--skipto-menu-background-dark-color));
  color: light-dark(var(--skipto-menu-text-color), var(--skipto-menu-text-dark-color));
  z-index: var(--skipto-z-index-1);
  overflow: hidden;
  text-overflow: ellipsis;
  pointer-events:none;
}

#${HIGHLIGHT_ID} .overlay-info.hasInfoTop {
  border-radius: var(--skipto-highlight-offset) var(--skipto-highlight-offset) 0 0;
}

#${HIGHLIGHT_ID} .overlay-info.hasInfoBottom {
  border-radius: 0 0 var(--skipto-highlight-offset) var(--skipto-highlight-offset);
}

@media (forced-colors: active) {

  #${HIGHLIGHT_ID} {
    border-color: ButtonBorder;
  }

  #${HIGHLIGHT_ID} .overlay-border {
    border-color: ButtonBorder;
  }

  #${HIGHLIGHT_ID} .overlay-border.skip-to-hidden {
    background-color: ButtonFace;
    color: ButtonText;
  }

  #${HIGHLIGHT_ID} .overlay-info {
    border-color: ButtonBorder;
    background-color: ButtonFace;
    color: ButtonText;
  }

}

`;

  /*
   *   @function getTheme
   *
   *   @desc Returns
   *
   *   @param  {String}  colorTheme   -  A string identifying a color theme  
   *
   *   @returns {Object}  see @desc
   */
  function getTheme(colorTheme) {
    if (typeof colorThemes[colorTheme] === 'object') {
      return colorThemes[colorTheme];
    }
    // if no theme defined, use urlSelectors
    let hostnameMatch = '';
    let pathnameMatch = '';
    let hostandpathnameMatch = '';

    const locationURL = new URL(location.href);
    const hostname = locationURL.hostname;
    const pathname = location.pathname;

    for (let item in colorThemes) {
      const hostnameSelector = colorThemes[item].hostnameSelector;
      const pathnameSelector = colorThemes[item].pathnameSelector;
      let hostnameFlag = false; 
      let pathnameFlag = false; 

      if (hostnameSelector) {
        if (hostname.indexOf(hostnameSelector) >= 0) {
          if (!hostnameMatch || 
              (colorThemes[hostnameMatch].hostnameSelector.length < hostnameSelector.length)) {
            hostnameMatch = item;
            hostnameFlag = true; 
            pathnameMatch = '';
          }
          else {
            // if the same hostname is used in another theme, set the hostnameFlas in case the pathname
            // matches
            if (colorThemes[hostnameMatch].hostnameSelector.length === hostnameSelector.length) {
              hostnameFlag = true;
            }
          }
        }
      }

      if (pathnameSelector) {
        if (pathname.indexOf(pathnameSelector) >= 0) {
          if (!pathnameMatch || 
              (colorThemes[pathnameMatch].pathnameSelector.length < pathnameSelector.length)) {
            pathnameMatch = item;
            pathnameFlag = true; 
          }
        }
      }

      if (hostnameFlag && pathnameFlag) {
        hostandpathnameMatch = item;
      }
    }

    if (hostandpathnameMatch) {
      return colorThemes[hostandpathnameMatch];      
    }
    else {
      if (hostnameMatch) {
        return colorThemes[hostnameMatch];      
      } else {
        if (pathnameMatch) {
          return colorThemes[pathnameMatch];      
        }
      }
    }

    // if no other theme is found use default theme
    return colorThemes['default'];
  }

  /*
   *   @function updateStyle
   *
   *   @desc  Updates the value of a css variable
   *
   *   @param  {string} cssVariable -
   *   @param  {string} configValue -
   *   @param  {string} themeValue  -
   */
  function updateStyle(containerNode, cssVariable, configValue, themeValue, defaultValue) {
    let value = '';
    if (typeof configValue === 'string' && configValue) {
      value = configValue;
    } else {
      if (typeof themeValue === 'string' && themeValue) {
        value = themeValue;
      }
      else {
        value = defaultValue;
      }
    }

    if ((typeof value === 'string') && value.length) {
      containerNode.style.setProperty(cssVariable, value);
    }
  }

  /*
   * @function addCSSColors
   *
   * @desc Updates the styling for the menu and highlight information
   *       and returns the updated strings
   *
   * @param  {Object}  config        -  SkipTo.js configuration information object
   * @param  {Boolean} useURLTheme   -  When true use the theme associated with the URL
   *
   * @returns. see @desc
   */
  function updateCSS (containerNode, config, useURLTheme=false) {
    const d = colorThemes['default'];
    const theme = useURLTheme ? getTheme(config.colorTheme) : {};

    // Check for display option in theme
    if ((typeof config.displayOption === 'string') &&
        (['popup-border', 'fixed', 'popup', 'static'].includes(config.displayOption.toLowerCase()) < 0)) {

      if ((typeof theme.displayOption === 'string') &&
          (['popup-border', 'fixed', 'popup', 'static'].includes(theme.displayOption.toLowerCase())>= 0)) {
        config.displayOption = theme.displayOption;
      }
      else {
        config.displayOption = 'popup';
      }
    }

    updateStyle(containerNode, '--skipto-font-family', config.fontFamily, theme.fontFamily, d.fontFamily);
    updateStyle(containerNode, '--skipto-font-size',   config.fontSize,   theme.fontSize,   d.fontSize);

    updateStyle(containerNode, '--skipto-position-left',      config.positionLeft,     theme.positionLeft,     d.positionLeft);
    updateStyle(containerNode, '--skipto-small-break-point',  config.smallBreakPoint,  theme.smallBreakPoint,  d.smallBreakPoint);
    updateStyle(containerNode, '--skipto-medium-break-point', config.mediumBreakPoint, theme.mediumBreakPoint, d.mediumBreakPoint);

    updateStyle(containerNode, '--skipto-menu-text-color',            config.menuTextColor,           theme.menuTextColor,           d.menuTextColor);
    updateStyle(containerNode, '--skipto-menu-text-dark-color',       config.menuTextDarkColor,       theme.menuTextDarkColor,       d.menuTextDarkColor);
    updateStyle(containerNode, '--skipto-menu-background-color',      config.menuBackgroundColor,     theme.menuBackgroundColor,     d.menuTextDarkColor);
    updateStyle(containerNode, '--skipto-menu-background-dark-color', config.menuBackgroundDarkColor, theme.menuBackgroundDarkColor, d.menuBackgroundDarkColor);

    updateStyle(containerNode, '--skipto-menuitem-focus-text-color',            config.menuitemFocusTextColor,           theme.menuitemFocusTextColor,           d.menuitemFocusTextColor);
    updateStyle(containerNode, '--skipto-menuitem-focus-text-dark-color',       config.menuitemFocusTextDarkColor,       theme.menuitemFocusTextDarkColor,       d.menuitemFocusTextDarkColor);
    updateStyle(containerNode, '--skipto-menuitem-focus-background-color',      config.menuitemFocusBackgroundColor,     theme.menuitemFocusBackgroundColor,     d.menuitemFocusBackgroundColor);
    updateStyle(containerNode, '--skipto-menuitem-focus-background-dark-color', config.menuitemFocusBackgroundDarkColor, theme.menuitemFocusBackgroundDarkColor, d.menuitemFocusBackgroundDarkColor);

    updateStyle(containerNode, '--skipto-focus-border-color',      config.focusBorderColor,     theme.focusBorderColor,     d.focusBorderColor);
    updateStyle(containerNode, '--skipto-focus-border-dark-color', config.focusBorderDarkColor, theme.focusBorderDarkColor, d.focusBorderDarkColor);

    updateStyle(containerNode, '--skipto-button-text-color',            config.buttonTextColor,           theme.buttonTextColor,           d.buttonTextColor);
    updateStyle(containerNode, '--skipto-button-text-dark-color',       config.buttonTextDarkColor,       theme.buttonTextDarkColor,       d.buttonTextDarkColor);
    updateStyle(containerNode, '--skipto-button-background-color',      config.buttonBackgroundColor,     theme.buttonBackgroundColor,     d.buttonBackgroundColor);
    updateStyle(containerNode, '--skipto-button-background-dark-color', config.buttonBackgroundDarkColor, theme.buttonBackgroundDarkColor, d.buttonBackgroundDarkColor);

    updateStyle(containerNode, '--skipto-dialog-text-color',                  config.dialogTextColor,                theme.dialogTextColorr,               d.dialogTextColor);
    updateStyle(containerNode, '--skipto-dialog-text-dark-color',             config.dialogTextDarkColor,            theme.dialogTextDarkColor,            d.dialogTextDarkColor);
    updateStyle(containerNode, '--skipto-dialog-background-color',            config.dialogBackgroundColor,          theme.dialogBackgroundColor,          d.dialogBackgroundColor);
    updateStyle(containerNode, '--skipto-dialog-background-dark-color',       config.dialogBackgroundDarkColor,      theme.dialogBackgroundDarkColor,      d.dialogBackgroundDarkColor);
    updateStyle(containerNode, '--skipto-dialog-background-title-color',      config.dialogBackgroundTitleColor,     theme.dialogBackgroundTitleColor,     d.dialogBackgroundTitleColor);
    updateStyle(containerNode, '--skipto-dialog-background-title-dark-color', config.dialogBackgroundTitleDarkColor, theme.dialogBackgroundTitleDarkColor, d.dialogBackgroundTitleDarkColor);

    let borderWidth, shadowWidth, offset, fontSize;

    [borderWidth, shadowWidth, offset, fontSize] = getHighlightInfo(config.highlightBorderSize);

    const shadowBorderWidth = borderWidth + 2 * shadowWidth;

    updateStyle(containerNode, '--skipto-highlight-offset',              `${offset}px`,               '', '');
    updateStyle(containerNode, '--skipto-highlight-border-width',        `${borderWidth}px`,          '', '');
    updateStyle(containerNode, '--skipto-highlight-font-size',           fontSize,                    '', '');
    updateStyle(containerNode, '--skipto-highlight-shadow-border-width', `${shadowBorderWidth}px`,    '', '');
    updateStyle(containerNode, '--skipto-highlight-border-style',        config.highlightBorderStyle, '', '');

    updateStyle(containerNode, '--skipto-hidden-text-color',            config.hiddenTextColor,           '', d.hiddenTextColor);
    updateStyle(containerNode, '--skipto-hidden-text-dark-color',       config.hiddenTextDarkColor,       '', d.hiddenTextDarkColor);
    updateStyle(containerNode, '--skipto-hidden-background-color',      config.hiddenBackgroundColor,     '', d.hiddenBackgroundColor);
    updateStyle(containerNode, '--skipto-hidden-background-dark-color', config.hiddenBackgroundDarkColor, '', d.hiddenBackgroundDarkColor);

    updateStyle(containerNode, '--skipto-z-index-1', config.zIndex, theme.zIndex, d.zIndex);


    const menuButtonNode = containerNode.querySelector('.menu-button');
    const buttonNode = containerNode.querySelector('button');
    const rect = buttonNode.getBoundingClientRect();
    if (menuButtonNode.classList.contains('show-border')) {
      const borderOffset = -1 * rect.height + 3 + 'px';
      containerNode.style.setProperty('--skipto-show-border-offset', borderOffset);
    }
    else {
      if (menuButtonNode.classList.contains('popup')) {
        const popupOffset = -1 * rect.height + 'px';
        containerNode.style.setProperty('--skipto-popup-offset', popupOffset);
      }
    }
    containerNode.style.setProperty('--skipto-menu-offset', rect.height + 'px');

    const zIndex2 = config.zIndex ?
                    (parseInt(config.zIndex) + 1).toString() :
                    '2000001';

    updateStyle(containerNode, '--skipto-z-index-2', zIndex2, '');

    const zIndexHighlight = config.zIndex ?
                    (parseInt(config.zIndex) - 1).toString() :
                    '199999';

    updateStyle(containerNode, '--skipto-z-index-highlight', zIndexHighlight, '');

    // Special case for theme configuration used in Illinois theme
    if (typeof theme.highlightTarget === 'string') {
      config.highlightTarget = theme.highlightTarget;
    }

  }

  /*
   *   @function renderStyleElement
   *
   *   @desc  Updates the style sheet template and then attaches it to the document
   *
   * @param  {Object}  attachNode      - DOM element node to attach button and menu container element
   * @param  {Object}  config          -  Configuration information object
   * @param  {Boolean} useURLTheme     - When true use the theme associated with the URL
   */
  function renderStyleElement (attachNode, config, useURLTheme=false) {
    let styleNode = attachNode.querySelector(`style`);
    if (!styleNode) {
      styleNode = document.createElement('style');
      attachNode.appendChild(styleNode);
      styleNode.textContent = cssStyleTemplate.textContent;
    }

    const containerNode = attachNode.querySelector('.container');

    updateCSS(containerNode, config, useURLTheme);

  }

  /* shortcutInfoDialog.js */

  /* Constants */
  const debug$a = new DebugLogging('[shortcutsInfoDialog]', false);
  debug$a.flag = false;

  const templateInfoDialog = document.createElement('template');
  templateInfoDialog.innerHTML = `
  <dialog id="${DIALOG_ID}">
    <div class="header">
      <h2>Keyboard Shortcuts</h2>
      <button>✕</button>
    </div>

    <div class="content shortcuts">
       <table>
          <caption>Landmark Regions</caption>
          <thead>
             <tr>
                <th class="shortcut">Key</th>
                <th class="desc">Description</th>
             </tr>
          </thead>
          <tbody>
             <tr>
                <td class="shortcut">r</td>
                <td class="desc">Next region</td>
             </tr>
             <tr>
                <td class="shortcut">R</td>
                <td class="desc">Previous region</td>
             </tr>
             <tr>
                <td class="shortcut">m</td>
                <td class="desc">Main regions</td>
             </tr>
             <tr>
                <td class="shortcut">n</td>
                <td class="desc">Navigation regions</td>
             </tr>
             <tr>
                <td class="shortcut">c</td>
                <td class="desc">Complementary regions</td>
             </tr>
          </tbody>
       </table>
       <table>
          <caption>Headings</caption>
          <thead>
             <tr>
                <th class="shortcut">Key</th>
                <th class="desc">Description</th>
             </tr>
          </thead>
          <tbody>
             <tr>
                <td class="shortcut">h</td>
                <td class="desc">Next heading</td>
             </tr>
             <tr>
                <td class="shortcut">H</td>
                <td class="desc">Previous heading</td>
             </tr>
             <tr>
                <td class="shortcut">1</td>
                <td class="desc">Level 1 headings</td>
             </tr>
             <tr>
                <td class="shortcut">2</td>
                <td class="desc">Level 2 headings</td>
             </tr>
             <tr>
                <td class="shortcut">3</td>
                <td class="desc">Level 3 headings</td>
             </tr>
             <tr>
                <td class="shortcut">4</td>
                <td class="desc">Level 4 headings</td>
             </tr>
             <tr>
                <td class="shortcut">5</td>
                <td class="desc">Level 5 headings</td>
             </tr>
             <tr>
                <td class="shortcut">6</td>
                <td class="desc">Level 6 headings</td>
             </tr>
          </tbody>
       </table>
    </div>

    <div class="content about">
      <div class="desc">
        SkipTo.js is a free and open source utility to support the WCAG 2.4.1 Bypass Block requirement.
      </div>
      <div class="privacy-label">
        Privacy
      </div>
      <div class="privacy">
        SkipTo.js does not collect or store any information about users or work with any other parties to collect or share user browsing information.
      </div>
      <div class="happy">
        Happy Skipping!
      </div>
      <div class="version">
        Version 5.9.1
      </div>
      <div class="copyright">
        BSD License, Copyright 2021-2025
      </div>
    </div>

    <div class="buttons">
      <button class="more">
        More Information
      </button>
      <button class="close">
        Close
      </button>
    </div>

  </dialog>
`;

  /*
   *
   *
   */

  class SkipToContentInfoDialog {
    constructor (attachElem) {

      // Get references

      attachElem.appendChild(templateInfoDialog.content.cloneNode(true));

      this.dialogElem = attachElem.querySelector('dialog');

      this.closeButtonElem1  = attachElem.querySelector('.header button');
      this.closeButtonElem1.addEventListener('click', this.onCloseButtonClick.bind(this));
      this.closeButtonElem1.addEventListener('keydown', this.onKeyDown.bind(this));

      this.shortcutContentElem = attachElem.querySelector('.content.shortcuts');
      this.aboutContentElem    = attachElem.querySelector('.content.about');

      const moreInfoButtonElem = attachElem.querySelector('.buttons button.more');
      moreInfoButtonElem.addEventListener('click', this.onMoreInfoClick.bind(this));

      this.closeButtonElem2  = attachElem.querySelector('.buttons button.close');
      this.closeButtonElem2.addEventListener('click', this.onCloseButtonClick.bind(this));
      this.closeButtonElem2.addEventListener('keydown', this.onKeyDown.bind(this));

      return this;
    }

    onCloseButtonClick () {
      this.dialogElem.close();
    }

    openDialog (content) {
      this.content = content;

      if (content === 'shortcuts') {
        this.aboutContentElem.style.display = 'none';
        this.shortcutContentElem.style.display = 'block';
      }
      else {
        this.shortcutContentElem.style.display = 'none';
        this.aboutContentElem.style.display = 'block';
      }
      this.dialogElem.showModal();
      this.closeButtonElem2.focus();
    }

    onMoreInfoClick () {
      const url = this.content === 'shortcut' ?
                                    MORE_SHORTCUT_INFO_URL :
                                    MORE_ABOUT_INFO_URL;
      if (url) {
        window.open(url, '_blank').focus();
      }
    }

    onKeyDown (event) {

      if ((event.key === "Tab") &&
          !event.altKey &&
          !event.ctlKey &&
          !event.metaKey) {

        if (event.shiftKey &&
            (event.currentTarget === this.closeButtonElem1)) {
          this.closeButtonElem2.focus();
          event.preventDefault();
          event.stopPropagation();
        }

        if (!event.shiftKey &&
            (event.currentTarget === this.closeButtonElem2)) {
          this.closeButtonElem1.focus();
          event.preventDefault();
          event.stopPropagation();
        }
      }
    }
  }

  /* shortcutsMessage.js */

  /* Constants */
  const debug$9 = new DebugLogging('[shortcutsMessage]', false);
  debug$9.flag = false;

  const templateMessage = document.createElement('template');
  templateMessage.innerHTML = `
  <div id="${MESSAGE_ID}" class="hidden">
    <div class="header">
      SkipTo.js Message
    </div>
    <div class="content">
    </div>
  </div>
`;


  class ShortcutsMessage {
    constructor (attachElem) {

      attachElem.appendChild(templateMessage.content.cloneNode(true));

      // Get references

      this.messageElem  = attachElem.querySelector(`#${MESSAGE_ID}`);

      this.contentElem  = this.messageElem.querySelector(`.content`);

      this.timeoutShowID = false;
      this.timeoutFadeID = false;

      return this;
    }

    close() {
      this.messageElem.classList.remove('show');
      this.messageElem.classList.remove('fade');
      this.messageElem.classList.add('hidden');
    }

    open(message) {
      clearInterval(this.timeoutFadeID);
      clearInterval(this.timeoutShowID);
      this.messageElem.classList.remove('hidden');
      this.messageElem.classList.remove('fade');
      this.messageElem.classList.add('show');
      this.contentElem.textContent = message;

      const msg = this;

      this.timeoutFadeID = setTimeout( () => {
        msg.messageElem.classList.add('fade');
        msg.messageElem.classList.remove('show');
      }, 3000);

      this.timeoutShowID = setTimeout( () => {
        msg.close();
      }, 4000);

    }

  }

  /* highlight.js */

  /* Constants */
  const debug$8 = new DebugLogging('highlight', false);
  debug$8.flag = false;

  const minWidth = 68;
  const minHeight = 27;

  /*
   *   @class HighlightElement
   *
   */

  class HighlightElement {

    constructor(attachElem) {

      // Get references

      this.overlayElem  = document.createElement('div');
      this.overlayElem.id = HIGHLIGHT_ID;
      attachElem.appendChild(this.overlayElem);
      this.overlayElem.style.display = 'none';

      this.borderElem = document.createElement('div');
      this.borderElem.className = 'overlay-border';
      this.overlayElem.appendChild(this.borderElem);

      this.infoElem = document.createElement('div');
      this.infoElem.className = 'overlay-info';
      this.overlayElem.appendChild(this.infoElem);

      this.hiddenElem = document.createElement('div');
      this.hiddenElem.id = HIDDEN_ELEMENT_ID;
      attachElem.appendChild(this.hiddenElem);
      this.hiddenElem.style.display = 'none';

      this.borderWidth    = 0;
      this.shadowWidth = 0;
      this.offset         = 0;

      this.msgHeadingIsHidden = '';

      this.configureMessageSizes();

    }

    /*
     *   @method configureMessageSizes
     *
     *   @desc  Updates stylesheet for styling the highlight information
     *
     *   @param {Object} config : color and font information
     */

    configureMessageSizes(config={}) {

      // Get i18n Messages

      this.msgHeadingIsHidden = typeof config.msgHeadingIsHidden === 'string' ?
                              config.msgHeadingIsHidden :
                              'Heading is hidden';

      this.msgRegionIsHidden = typeof config.msgRegionIsHidden === 'string' ?
                              config.msgRegionIsHidden :
                              'Region is hidden';

      this.msgElementIsHidden = typeof config.msgElementIsHidden === 'string' ?
                              config.msgElemenIsHidden :
                              'Element is hidden';

      [this.borderWidth, this.shadowWidth, this.offset, this.fontSize] = getHighlightInfo(config.highlightBorderSize);

    }

    /*
     *   @method highlight
     *
     *   @desc  Highlights the element on the page when highlighting
     *          is enabled (NOTE: Highlight is enabled by default)
     *
     *   @param {Object}  elem            : DOM node of element to highlight
     *   @param {String}  highlightTarget : value of highlight target
     *   @param {String}  info            : Information about target
     *   @param {Boolean} force           : If true override isRduced
     */

    highlight(elem, highlightTarget='instant', info='', force=false) {
      let scrollElement;
      const mediaQuery = window.matchMedia(`(prefers-reduced-motion: reduce)`);
      const isReduced = !mediaQuery || mediaQuery.matches;

      if (elem && highlightTarget) {

        const rect = elem.getBoundingClientRect();

        // If target element is hidden create a visible element
        debug$8.flag && debug$8.log(`[    info]: ${info}`);
        debug$8.flag && debug$8.log(`[    rect]: Left: ${rect.left} Top: ${rect.top} Width: ${rect.width} height: ${rect.height}`);
        debug$8.flag && debug$8.log(`[isHidden]: ${this.isElementHidden(elem)}`);

        if (this.isElementHidden(elem)) {
          // If element is hidden make hidden element message visible
          // and use for highlighing
          this.hiddenElem.textContent = this.getHiddenMessage(elem);
          this.hiddenElem.style.display = 'block';

          const left = rect.left > 0 ? rect.left + window.scrollX : this.offset;
          const top  = rect.top > 0 ? rect.top + window.scrollY : this.offset;

          this.hiddenElem.style.left = left + 'px';
          this.hiddenElem.style.top = top + 'px';
          scrollElement = this.updateHighlightElement(this.hiddenElem,
                                                      info,
                                                      0,
                                                      this.borderWidth,
                                                      this.shadowWidth);
        }
        else {
          this.hiddenElem.style.display = 'none';
          scrollElement = this.updateHighlightElement(elem,
                                                      info,
                                                      this.offset,
                                                      this.borderWidth,
                                                      this.shadowWidth);
        }

        if (this.isElementInHeightLarge(elem)) {
          if (!this.isElementStartInViewport(elem) && (!isReduced || force)) {
            scrollElement.scrollIntoView({ behavior: highlightTarget, block: 'start', inline: 'nearest' });
          }
        }
        else {
          if (!this.isElementInViewport(elem)  && (!isReduced || force)) {
            scrollElement.scrollIntoView({ behavior: highlightTarget, block: 'center', inline: 'nearest' });
          }
        }
      }
    }

    /*
     *  @method  updateHighlightElement
     *
     *  @desc  Create an overlay element and set its position on the page.
     *
     *  @param  {Object}  elem          -  DOM element node to highlight
     *  @param  {String}  info          -  Description of the element
     *  @param  {Number}  offset        -  Number of pixels for offset
     *  @param  {Number}  borderWidth   -  Number of pixels for border width
     *  @param  {Number}  shadowWidth   -  Number of pixels to provide border contrast
     *
     */

     updateHighlightElement (elem, info, offset, borderWidth, shadowWidth) {

      const adjRect = this.getAdjustedRect(elem, offset, borderWidth, shadowWidth);

      const borderElemOffset = -1 * (this.borderWidth + this.shadowWidth);

      this.overlayElem.style.left   = adjRect.left   + 'px';
      this.overlayElem.style.top    = adjRect.top    + 'px';
      this.borderElem.style.left    = borderElemOffset + 'px';
      this.borderElem.style.top     = borderElemOffset + 'px';

      this.overlayElem.style.width  = adjRect.width  + 'px';
      this.overlayElem.style.height = adjRect.height + 'px';
      this.borderElem.style.width   = (adjRect.width - (2 * shadowWidth)) + 'px';
      this.borderElem.style.height  = (adjRect.height - (2 * shadowWidth)) + 'px';

      this.overlayElem.style.display = 'block';

      if (info) {

        this.infoElem.style.display = 'inline-block';
        this.infoElem.textContent   = info;

        const infoElemOffsetLeft = -1 * (borderWidth + 2 * shadowWidth);
        this.infoElem.style.left = infoElemOffsetLeft + 'px';

        const infoElemRect    = this.infoElem.getBoundingClientRect();

        // Is info displayed above or below the highlighted element
        if (adjRect.top >= infoElemRect.height) {
          // Info is displayed above the highlighted element (e.g. most of the time)
          this.overlayElem.classList.remove('hasInfoBottom');
          this.borderElem.classList.remove('hasInfoBottom');
          this.infoElem.classList.remove('hasInfoBottom');
          this.overlayElem.classList.add('hasInfoTop');
          this.borderElem.classList.add('hasInfoTop');
          this.infoElem.classList.add('hasInfoTop');
          this.infoElem.style.top =  (-1 * (adjRect.height +
                                           infoElemRect.height +
                                           borderWidth))  + 'px';
        }
        else {
          // Info is displayed below the highlighted element when it is at the top of
          // the window

          const infoElemOffsetTop  = -1 * (borderWidth + shadowWidth);

          this.overlayElem.classList.remove('hasInfoTop');
          this.borderElem.classList.remove('hasInfoTop');
          this.infoElem.classList.remove('hasInfoTop');
          this.overlayElem.classList.add('hasInfoBottom');
          this.borderElem.classList.add('hasInfoBottom');
          this.infoElem.classList.add('hasInfoBottom');
          this.infoElem.style.top  = infoElemOffsetTop + 'px';
        }
        return this.infoElem;
      }
      else {
        this.overlayElem.classList.remove('hasInfoTop');
        this.overlayElem.classList.remove('hasInfoBottom');
        this.borderElem.classList.remove('hasInfoTop');
        this.borderElem.classList.remove('hasInfoBottom');
        this.infoElem.style.display = 'none';
        return this.overlayElem;
      }
    }


    /*
     *   @method getAdjustedRect
     *
     *   @desc  Returns a object with dimensions adjusted for highlighting element
     *
     *  @param  {Object}  elem            -  DOM node of element to be highlighted
     *  @param  {Number}  offset          -  Number of pixels for offset
     *  @param  {Number}  borderWidth     -  Number of pixels for border width
     *  @param  {Number}  shadowWidth  -  Number of pixels to provide border contrast
     *
     *   @returns see @desc
     */

     getAdjustedRect(elem, offset, borderWidth, shadowWidth) {

      const rect  = elem.getBoundingClientRect();

      const adjRect = {
        left: 0,
        top: 0,
        width: 0,
        height: 0
      };

      const offsetBorder = offset + borderWidth + 2 * shadowWidth;

      adjRect.left    = rect.left > offset ?
                        Math.round(rect.left + (-1 * offsetBorder) + window.scrollX) :
                        Math.round(rect.left + window.scrollX);

      adjRect.width   = rect.left > offset ?
                        Math.max(rect.width  + (2 * offsetBorder), minWidth) :
                        Math.max(rect.width, minWidth);


      adjRect.top     = rect.top > offset ?
                        Math.round(rect.top  + (-1 * offsetBorder) + window.scrollY) :
                        Math.round(rect.top + window.scrollY);

      adjRect.height  = rect.top > offset ?
                        Math.max(rect.height + (2 * offsetBorder), minHeight) :
                        Math.max(rect.height, minHeight);

      if ((adjRect.top < 0) || (adjRect.left < 0)) {
      // Element is near top or left side of screen
        adjRect.left = this.offset;
        adjRect.top = this.offset;
      }

      return adjRect;
    }

    /*
     *   @method isElementInViewport
     *
     *   @desc  Returns true if element is already visible in view port,
     *          otheriwse false
     *
     *   @param {Object} elem : DOM node of element to highlight
     *
     *   @returns see @desc
     */

    isElementInViewport(elem) {
      const rect = elem.getBoundingClientRect();
      return (
        rect.top >= window.screenY &&
        rect.left >= window.screenX &&
        rect.bottom <= ((window.screenY + window.innerHeight) ||
                        (window.screenY + document.documentElement.clientHeight)) &&
        rect.right <= ((window.screenX + window.innerWidth) ||
                       (window.screenX + document.documentElement.clientWidth)));
    }

    /*
     *   @method isElementStartInViewport
     *
     *   @desc  Returns true if start of the element is already visible in view port,
     *          otherwise false
     *
     *   @param {Object} elem : DOM node of element to highlight
     *
     *   @returns see @desc
     */

    isElementStartInViewport(elem) {
      const rect = elem.getBoundingClientRect();
      return (
          rect.top >= window.screenY &&
          rect.top <= ((window.screenY + window.innerHeight) ||
                       (window.screenY + document.documentElement.clientHeight)) &&
          rect.left >= window.screenX &&
          rect.left <= ((window.screenX + window.innerWidth) ||
                       (window.screenX + document.documentElement.clientWidth)));
    }


    /*
     *   @method isElementHeightLarge
     *
     *   @desc  Returns true if element client height is larger than clientHeight,
     *          otheriwse false
     *
     *   @param {Object} elem : DOM node of element to highlight
     *
     *   @returns see @desc
     */

    isElementInHeightLarge(elem) {
      var rect = elem.getBoundingClientRect();
      return (1.2 * rect.height) > (window.innerHeight || document.documentElement.clientHeight);
    }

    /*
     *   @method isElementHidden
     *
     *   @desc  Returns true if the element is hidden on the
     *          graphical rendering
     *
     *   @param  {Object}  elem   : DOM node
     *
     *   @returns see @desc
     */
    isElementHidden(elem) {
      const rect = elem.getBoundingClientRect();
      return (rect.height < 3) ||
             (rect.width  < 3) ||
             ((rect.left + rect.width)  < (rect.width / 2)) ||
             ((rect.top  + rect.height) < (rect.height / 2));
    }

    /*
     *   @method getHiddenMessage
     *
     *   @desc  Returns string describing the hidden element
     *
     *   @param  {Object}  elem   : DOM node
     *
     *   @returns see @desc
     */
    getHiddenMessage(elem) {
      if (elem.hasAttribute('data-skip-to-info')) {
        const info = elem.getAttribute('data-skip-to-info');

        if (info.includes('heading')) {
          return this.msgHeadingIsHidden;
        }

        if (info.includes('landmark')) {
          return this.msgRegionIsHidden;
        }
      }

      return this.msgElementIsHidden;
    }

    /*
     *   @method removeHighlight
     *
     *   @desc  Hides the highlight element on the page
     */
    removeHighlight() {
      if (this.overlayElem) {
        this.overlayElem.style.display = 'none';
      }
      if (this.hiddenElem) {
        this.hiddenElem.style.display = 'none';
      }
    }

  }

  /*
  *   namefrom.js
  */

  /* constants */

  const debug$7 = new DebugLogging('nameFrom', false);
  debug$7.flag = false;

  //
  // LOW-LEVEL HELPER FUNCTIONS (NOT EXPORTED)

  /*
  *   @function  isDisplayNone 
  *
  *   @desc Returns true if the element or parent element has set the CSS
  *         display property to none or has the hidden attribute,
  *         otherwise false
  *
  *   @param  {Object}  node  - a DOM node
  *
  *   @returns  {Boolean} see @desc 
  */

  function isDisplayNone (node) {

    if (!node) {
      return false;
    }

    if (node.nodeType === Node.TEXT_NODE) {
        node = node.parentNode;
    }

    if (node.nodeType === Node.ELEMENT_NODE) {

      if (node.hasAttribute('hidden')) {
        return true;
      }

      // aria-hidden attribute with the value "true" is an same as 
      // setting the hidden attribute for name calcuation
      if (node.hasAttribute('aria-hidden')) {
        if (node.getAttribute('aria-hidden').toLowerCase()  === 'true') {
          return true;
        }
      }

      const style = window.getComputedStyle(node, null);

      const display = style.getPropertyValue("display");

      if (display) {
        return display === 'none';
      }
    }
    return false;
  }

  /*
  *   @function isVisibilityHidden 
  *   
  *   @desc Returns true if the node (or it's parrent) has the CSS visibility 
  *         property set to "hidden" or "collapse", otherwise false
  *
  *   @param  {Object}   node  -  DOM node
  *
  *   @return  see @desc
  */

  function isVisibilityHidden(node) {

    if (!node) {
      return false;
    }

    if (node.nodeType === Node.TEXT_NODE) {
      node = node.parentNode;
    }

    if (node.nodeType === Node.ELEMENT_NODE) {
      const style = window.getComputedStyle(node, null);

      const visibility = style.getPropertyValue("visibility");
      if (visibility) {
        return (visibility === 'hidden') || (visibility === 'collapse');
      }
    }
    return false;
  }

  /*
  *   @function isAriaHiddenFalse 
  *   
  *   @desc Returns true if the node has the aria-hidden property set to
  *         "false", otherwise false.  
  *         NOTE: This function is important in the accessible namce 
  *               calculation, since content hidden with a CSS technique 
  *               can be included in the accessible name calculation when 
  *               aria-hidden is set to false
  *
  *   @param  {Object}   node  -  DOM node
  *
  *   @return  see @desc
  */

  function isAriaHIddenFalse(node) {

    if (!node) {
      return false;
    }

    if (node.nodeType === Node.TEXT_NODE) {
        node = node.parentNode;
    }

    if (node.nodeType === Node.ELEMENT_NODE) {
      return (node.hasAttribute('aria-hidden') && 
          (node.getAttribute('aria-hidden').toLowerCase() === 'false'));
    }

    return false;
  }

  /*
  *   @function includeContentInName 
  *   
  *   @desc Checks the CSS display and hidden properties, and
  *         the aria-hidden property to see if the content
  *         should be included in the accessible name
  *        calculation.  Returns true if it should be 
  *         included, otherwise false
  *
  *   @param  {Object}   node  -  DOM node
  *
  *   @return  see @desc
  */

  function includeContentInName(node) {
    const flag = isAriaHIddenFalse(node) || 
      (!isVisibilityHidden(node) && 
      !isDisplayNone(node));
    return flag;
  }

  /*
  *   @function getNodeContents
  *
  *   @desc  Recursively process element and text nodes by aggregating
  *          their text values for an ARIA accessible name or description
  *          calculation.
  *
  *          NOTE: This includes special handling of elements with 'alt' 
  *                text and embedded controls.
  *  
  *  @param {Object}  node  - A DOM node
  * 
  *  @return {String}  The text content for an accessible name or description
  */
  function getNodeContents (node) {
    let contents = '';
    let nc;
    let arr = [];

    switch (node.nodeType) {
      case Node.ELEMENT_NODE:
        // If aria-label is present, node recursion stops and
        // aria-label value is returned
        if (node.hasAttribute('aria-label')) {
          if (includeContentInName(node)) {
            contents = node.getAttribute('aria-label');
          }
        }
        else {
          if (node instanceof HTMLSlotElement) {
            // if no slotted elements, check for default slotted content
            const assignedNodes = Array.from(node.assignedNodes({ flatten: true }));
            assignedNodes.forEach( assignedNode => {
              nc = getNodeContents(assignedNode);
              if (nc.length) arr.push(nc);
            });
            contents = (arr.length) ? arr.join(' ') : '';
          } else {
            if (couldHaveAltText(node) && includeContentInName(node)) {
              contents = getAttributeValue(node, 'alt');
            }
            else {
              if (node.hasChildNodes()) {
                let children = Array.from(node.childNodes);
                children.forEach( child => {
                  nc = getNodeContents(child);
                  if (nc.length) arr.push(nc);
                });
                contents = (arr.length) ? arr.join(' ') : '';
              }
            }
            // For all branches of the ELEMENT_NODE case...
          }
        }
        contents = addCssGeneratedContent(node, contents);
        break;

      case Node.TEXT_NODE:
        if (includeContentInName(node)) {
          contents = normalize(node.textContent);
        }
        break;
    }
    return normalize(contents);
  }

  /*
  *   @function couldHaveAltText
  *   
  *   @desc  Based on HTML5 specification, returns true if 
  *          the element could have an 'alt' attribute,
  *          otherwise false.
  * 
  *   @param  {Object}  element  - DOM eleemnt node
  *
  *   @return {Boolean}  see @desc
  */
  function couldHaveAltText (element) {
    let tagName = element.tagName.toLowerCase();

    switch (tagName) {
      case 'img':
      case 'area':
        return true;
      case 'input':
        return (element.type && element.type === 'image');
    }

    return false;
  }

  /*
  *   @function addCssGeneratedContent
  *
  *   @desc Adds CSS-generated content for pseudo-elements
  *         :before and :after. According to the CSS spec, test that content 
  *         value is other than the default computed value of 'none'.
  * 
  *         Note: Even if an author specifies content: 'none', because browsers 
  *               add the double-quote character to the beginning and end of 
  *               computed string values, the result cannot and will not be 
  *               equal to 'none'.
  *
  *
  *   @param {Object}  element   - DOM node element
  *   @param {String}  contents  - Text content for DOM node
  *
  *   @returns  {String}  see @desc
  *
  */

  function addCssGeneratedContent (element, contents) {

    function isVisible (style) {

      let flag = true;

      const display = style.getPropertyValue("display");
      if (display) {
        flag = flag && display !== 'none';
      }

      const visibility = style.getPropertyValue("visibility");
      if (visibility) {
        flag = flag && (visibility !== 'hidden') && (visibility !== 'collapse');
      }
      return flag;
    }

    let result = contents;
    const styleBefore = getComputedStyle(element, ':before');
    const styleAfter  = getComputedStyle(element, ':after');

    const beforeVisible = isVisible(styleBefore);
    const afterVisible  = isVisible(styleAfter);

    const prefix = beforeVisible ?
                   styleBefore.content :
                   '';

    const suffix = afterVisible ?
                   styleAfter.content :
                   '';

    if ((prefix[0] === '"') && !prefix.toLowerCase().includes('moz-')) {
      result = prefix.substring(1, (prefix.length-1)) + result;
    }

    if ((suffix[0] === '"') && !suffix.toLowerCase().includes('moz-')) {
      result = result + suffix.substring(1, (suffix.length-1)) ;
    }

    return result;
  }

  /* accName.js */

  /* Constants */
  const debug$6 = new DebugLogging('accName', false);
  debug$6.flag = false;

  /**
   *   @fuction getAccessibleName
   *
   *   @desc Returns the accessible name for an heading or landmark
   *
   *   @paramn {Object}   dom      - Document of the current element
   *   @param  {node}     element  - DOM element node for either a heading or
   *                               landmark
   *   @param  {Boolean}  fromContent  - if true will compute name from content
   * 
   *   @return {String} The accessible name for the landmark or heading element
   */

  function getAccessibleName (doc, element, fromContent=false) {
    let accName = '';

    accName = nameFromAttributeIdRefs(doc, element, 'aria-labelledby');

    if (accName === '' && element.hasAttribute('aria-label')) {
      accName =  element.getAttribute('aria-label').trim();
    }

    if (accName === '' && fromContent) {
      accName =  getNodeContents(element);
    }

    if (accName === '' && element.title.trim() !== '') {
      accName = element.title.trim();
    }

    return accName;
  }

  /*
  *   @function nameFromAttributeIdRefs
  *
  *   @desc Get the value of attrName on element (a space-
  *         separated list of IDREFs), visit each referenced element in the order it
  *         appears in the list and obtain its accessible name (skipping recursive
  *         aria-labelledby or aria-describedby calculations), and return an object
  *         with name property set to a string that is a space-separated concatena-
  *         tion of those results if any, otherwise return empty string.
  *
  *   @param {Object}  doc       -  Browser document object
  *   @param {Object}  element   -  DOM element node
  *   @param {String}  attribute -  Attribute name (e.g. "aria-labelledby", "aria-describedby",
  *                                 or "aria-errormessage")
  *
  *   @returns {String} see @desc 
  */
  function nameFromAttributeIdRefs (doc, element, attribute) {
    const value = getAttributeValue(element, attribute);
    const arr = [];

    if (value.length) {
      const idRefs = value.split(' ');

      for (let i = 0; i < idRefs.length; i++) {
        const refElement = doc.getElementById(idRefs[i]);
        if (refElement) {
          const accName = getNodeContents(refElement);
          if (accName && accName.length) arr.push(accName);
        }
      }
    }

    if (arr.length) {
      return arr.join(' ');
    }

    return '';
  }

  /* landmarksHeadings.js */

  /* Constants */
  const debug$5 = new DebugLogging('landmarksHeadings', false);
  debug$5.flag = false;


  const skipableElements = [
    'base',
    'content',
    'frame',
    'iframe',
    'input[type=hidden]',
    'link',
    'meta',
    'noscript',
    'script',
    'style',
    'template',
    'shadow',
    'title',
    PAGE_SCRIPT_ELEMENT_NAME,
    BOOKMARKLET_ELEMENT_NAME,
    EXTENSION_ELEMENT_NAME
  ];

  const allowedLandmarkSelectors = [
  'banner',
  'complementary',
  'contentinfo',
  'form',
  'main',
  'navigation',
  'region',
  'search'
  ];

  const higherLevelElements = [
  'article',
  'aside',
  'footer',
  'header',
  'main',
  'nav',
  'region',
  'section'
  ];

  const headingTags = [
    'h1',
    'h2',
    'h3',
    'h4',
    'h5',
    'h6'
  ];

  let idIndex = 0;

  /*
   *   @function getSkipToIdIndex
   *
   *   @desc  Returns the current skipto index used for generating
   *          id for target elements
   *
   *   @returns  {Number} see @desc
   */ 
  function getSkipToIdIndex () {
    return idIndex;
  }

  /*
   *   @function incSkipToIdIndex
   *
   *   @desc  Adds one to the skipto index
   */ 
  function incSkipToIdIndex () {
    idIndex += 1;
  }

  /*
   *   @function isSkipableElement
   *
   *   @desc Returns true if the element is skipable, otherwise false
   *
   *   @param  {Object}  element  - DOM element node
   *
   *   @returns {Boolean}  see @desc
   */ 
  function isSkipableElement(element) {
      const tagName = element.tagName.toLowerCase();
      const type    = element.hasAttribute('type') ? element.getAttribute('type') : '';
      const elemSelector = (tagName === 'input') && type.length ? 
                              `${tagName}[type=${type}]` :
                              tagName;
      return skipableElements.includes(elemSelector);
  }

  /*
   *   @function isCustomElement
   *
   *   @desc  Reuturns true if the element is a custom element, otherwise
   *          false
   *
   *   @param  {Object}  element  - DOM element node
   *
   *   @returns {Boolean}  see @desc
   */ 
  function isCustomElement(element) {
    return element.tagName.indexOf('-') >= 0;
  }

  /*
   *   @function sSlotElement
   *
   *   @desc  Reuturns true if the element is a slot element, otherwise
   *          false
   *
   *   @param  {Object}  element  - DOM element node
   *
   *   @returns {Boolean}  see @desc
   */ 
  function isSlotElement(node) {
    return (node instanceof HTMLSlotElement);
  }

  /**
  *   @function isTopLevel
  *
  *   @desc Tests the node to see if it is in the content of any other
  *         elements with default landmark roles or is the descendant
  *         of an element with a defined landmark role
  *
  *   @param  {Object}  node  - Element node from a berowser DOM
  * 
  *   @reutrn {Boolean} Returns true if top level landmark, otherwise false
  */

  function isTopLevel (node) {
    node = node && node.parentNode;
    while (node && (node.nodeType === Node.ELEMENT_NODE)) {
      const tagName = node.tagName.toLowerCase();
      let role = node.getAttribute('role');
      if (role) {
        role = role.toLowerCase();
      }

      if (higherLevelElements.includes(tagName) ||
          allowedLandmarkSelectors.includes(role)) {
        return false;
      }
      node = node.parentNode;
    }
    return true;
  }  

  /*
   *   @function checkForLandmarkRole
   *
   *   @desc  Returns the type of landmark region,
   *          otherwise an empty string
   *
   *   @param  {Object}  element  - DOM element node
   *
   *   @returns {String}  see @desc
   */ 
  function checkForLandmarkRole (element) {
    if (element.hasAttribute('role')) {
      const role = element.getAttribute('role').toLowerCase();
      if (allowedLandmarkSelectors.indexOf(role) >= 0) {
        return role;
      }
    } else {
      const tagName = element.tagName.toLowerCase();

      switch (tagName) {
        case 'aside':
          return 'complementary';

        case 'main':
          return 'main';

        case 'nav':
          return 'navigation';

        case 'header':
          if (isTopLevel(element)) {
            return 'banner';
          }
          break;

        case 'footer':
          if (isTopLevel(element)) {
            return 'contentinfo';
          }
          break;

        case 'section':
          // Sections need an accessible name for be considered a "region" landmark
          if (element.hasAttribute('aria-label') || element.hasAttribute('aria-labelledby')) {
            return 'region';
          }
          break;
      }
    }
    return '';
  }


  /**
   * @function queryDOMForSkipToId
   *
   * @desc Returns DOM node associated with the id, if id not found returns null
   *
   * @param {String}  targetId  - dom node element to attach button and menu
   * 
   * @returns (Object) @desc
   */
  function queryDOMForSkipToId (targetId) {
    function transverseDOMForSkipToId(startingNode) {
      var targetNode = null;
      for (let node = startingNode.firstChild; node !== null; node = node.nextSibling ) {
        if (node.nodeType === Node.ELEMENT_NODE) {
          if (node.getAttribute('data-skip-to-id') === targetId) {
            return node;
          }
          if (!isSkipableElement(node)) {
            // check for slotted content
            if (isSlotElement(node)) {
                // if no slotted elements, check for default slotted content
              const assignedNodes = node.assignedNodes().length ?
                                    node.assignedNodes() :
                                    node.assignedNodes({ flatten: true });
              for (let i = 0; i < assignedNodes.length; i += 1) {
                const assignedNode = assignedNodes[i];
                if (assignedNode.nodeType === Node.ELEMENT_NODE) {
                  if (assignedNode.getAttribute('data-skip-to-id') === targetId) {
                    return assignedNode;
                  }
                  targetNode = transverseDOMForSkipToId(assignedNode);                    
                  if (targetNode) {
                    return targetNode;
                  }
                }
              }
            } else {
              // check for custom elements
              if (isCustomElement(node)) {
                if (node.shadowRoot) {
                  targetNode = transverseDOMForSkipToId(node.shadowRoot);
                  if (targetNode) {
                    return targetNode;
                  }
                }
                else {
                  targetNode = transverseDOMForSkipToId(node);
                  if (targetNode) {
                    return targetNode;
                  }
                }
              } else {
                targetNode = transverseDOMForSkipToId(node);
                if (targetNode) {
                  return targetNode;
                }
              }
            }
          }
        } // end if
      } // end for
      return false;
    } // end function
    return transverseDOMForSkipToId(document.body);
  }

  /**
   * @function findVisibleElement
   *
   * @desc Returns the first visible descendant DOM node that matches a set of element tag names
   * 
   * @param {node}   startingNode  - dom node to start search for element
   * @param {Array}  tagNames      - Array of tag names
   * 
   * @returns (node} Returns first descendant element, if not found returns false
   */
  function findVisibleElement (startingNode, tagNames) {

    function transverseDOMForVisibleElement(startingNode, targetTagName) {
      var targetNode = null;
      for (let node = startingNode.firstChild; node !== null; node = node.nextSibling ) {
        if (node.nodeType === Node.ELEMENT_NODE) {

          if (!isSkipableElement(node)) {
            // check for slotted content
            if (isSlotElement(node)) {
                // if no slotted elements, check for default slotted content
              const assignedNodes = node.assignedNodes().length ?
                                    node.assignedNodes() :
                                    node.assignedNodes({ flatten: true });
              for (let i = 0; i < assignedNodes.length; i += 1) {
                const assignedNode = assignedNodes[i];
                if (assignedNode.nodeType === Node.ELEMENT_NODE) {
                  const tagName = assignedNode.tagName.toLowerCase();
                  if (tagName === targetTagName){
                    if (isVisible(assignedNode)) {
                      return assignedNode;
                    }
                  }
                  targetNode = transverseDOMForVisibleElement(assignedNode, targetTagName);  
                  if (targetNode) {
                    return targetNode;
                  }
                }
              }
            } else {
              // check for custom elements
              if (isCustomElement(node)) {
                if (node.shadowRoot) {
                  targetNode = transverseDOMForVisibleElement(node.shadowRoot, targetTagName);
                  if (targetNode) {
                    return targetNode;
                  }
                }
                else {
                  targetNode = transverseDOMForVisibleElement(node, targetTagName);
                  if (targetNode) {
                    return targetNode;
                  }
                }
              } else {
                const tagName = node.tagName.toLowerCase();
                if (tagName === targetTagName){
                  if (isVisible(node)) {
                    return node;
                  }
                }
                targetNode = transverseDOMForVisibleElement(node, targetTagName);
                if (targetNode) {
                  return targetNode;
                }
              }
            }
          }
        } // end if
      } // end for
      return false;
    } // end function
    let targetNode = false;

    // Go through the tag names one at a time
    for (let i = 0; i < tagNames.length; i += 1) {
      targetNode = transverseDOMForVisibleElement(startingNode, tagNames[i]);
      if (targetNode) {
        break;
      }
    }
    return targetNode ? targetNode : startingNode;
  }

  /*
   *   @function skipToElement
   *
   *   @desc Moves focus to the element identified by the memu item
   *
   *   @param {Object}  menutim  -  DOM element in the menu identifying the target element.
   */ 
  function skipToElement(menuitem) {

    let elem;

    const isLandmark = menuitem.classList.contains('landmark');
    const isSearch = menuitem.classList.contains('skip-to-search');
    const isNav = menuitem.classList.contains('skip-to-nav');

    elem = queryDOMForSkipToId(menuitem.getAttribute('data-id'));

    setItemFocus(elem, isLandmark, isSearch, isNav);

  }

  /*
   *   @function setItemFocus
   *
   *   @desc  Sets focus on the appropriate element
   *
   *   @param {Object}   elem        -  A target element
   *   @param {Boolean}  isLandmark  -  True if item is a landmark, otherwise false
   *   @param {Boolean}  isSearch    -  True if item is a search landmark, otherwise false
   *   @param {Boolean}  isNav       -  True if item is a navigation landmark, otherwise false
   */
  function setItemFocus(elem, isLandmark, isSearch, isNav) {

    let focusNode = false;
    let scrollNode = false;

    const searchSelectors = ['input', 'button', 'a'];
    const navigationSelectors = ['a', 'input', 'button'];
    const landmarkSelectors = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'section', 'article', 'p', 'li', 'a'];

    if (elem) {
      if (isSearch) {
        focusNode = findVisibleElement(elem, searchSelectors);
      }
      if (isNav) {
        focusNode = findVisibleElement(elem, navigationSelectors);
      }
      if (focusNode && isVisible(focusNode)) {
        if (focusNode.tabIndex >= 0) {
          focusNode.focus();
        } else {
          focusNode.tabIndex = 0;
          focusNode.focus();
          focusNode.tabIndex = -1;
        }
        focusNode.scrollIntoView({block: 'center'});
      }
      else {
        if (isLandmark) {
          scrollNode = findVisibleElement(elem, landmarkSelectors);
          if (scrollNode) {
            elem = scrollNode;
          }
        }
        if (elem.tabIndex >= 0) {
          elem.focus();
        } else {
          elem.tabIndex = 0;
          elem.focus();
          elem.tabIndex = -1;
        }
        elem.scrollIntoView({block: 'center'});
      }
    }


  }

  /*
   *   @function getHeadingTargets
   *
   *   @desc  Returns an array of heading tag names to include in menu
   *          NOTE: It uses "includes" method to maximimze compatibility with
   *          previous versions of SkipTo which used CSS selectors for 
   *          identifying targets.
   *
   *   @param {String}  targets  -  A space with the heading tags to inclucde
   *
   *   @returns {Array}  Array of heading element tag names to include in menu
   */ 
  function getHeadingTargets(targets) {
    let targetHeadings = [];
    ['h1','h2','h3','h4','h5','h6'].forEach( h => {
      if (targets.includes(h)) {
        targetHeadings.push(h);
      }
    });
    return targetHeadings;
  }

  /*
   *   @function isMain
   *
   *   @desc  Returns true if the element is a main landamrk
   *
   *   @param  {Object}  element  -  DOM element node
   *
   *   @returns {Boolean}  see @desc
   */ 
  function isMain (element) {
    const tagName = element.tagName.toLowerCase();
    const role = element.hasAttribute('role') ? element.getAttribute('role').toLowerCase() : '';
    if ((role === 'presentation') || (role === 'none')) {
      return false;
    }
    return (tagName === 'main') || (role === 'main');
  }

  /*
   *   @function queryDOMForLandmarksAndHeadings
   *
   *   @desc  Recursive function to return two arrays, one an array of the DOM element nodes for 
   *          landmarks and the other an array of DOM element ndoes for headings  
   *
   *   @param  {Array}   landamrkTargets  -  An array of strings representing landmark regions
   *   @param  {Array}   headingTargets  -  An array of strings representing headings
   *   @param  {String}  skiptoId        -  An array of strings representing headings
   *
   *   @returns {Array}  @see @desc
   */ 
  function queryDOMForLandmarksAndHeadings (landmarkTargets, headingTargets, skiptoId) {

    let headingInfo = [];
    let landmarkInfo = [];
    let targetLandmarks = getLandmarkTargets(landmarkTargets.toLowerCase());
    let targetHeadings  = getHeadingTargets(headingTargets.toLowerCase());
    let onlyInMain = headingTargets.includes('main') || headingTargets.includes('main-only');

    function transverseDOM(startingNode, doc, parentDoc=null, inMain = false) {

      function checkForLandmark(doc, node) {
        const landmark = checkForLandmarkRole(node);
        if (landmark && (node.id !== skiptoId)) {
          const accName = getAccessibleName(doc, node);
          node.setAttribute('data-skip-to-info', `landmark ${landmark}`);
          node.setAttribute('data-skip-to-acc-name', accName);

          if ((targetLandmarks.indexOf(landmark) >= 0) ) {
            landmarkInfo.push({
              node: node,
              name: accName
            });
          }
        }
      }

      function checkForHeading(doc, node, inMain) {
        const isHeadingRole = node.role ? node.role.toLowerCase() === 'heading' : false;
        const hasAriaLevel = parseInt(node.ariaLevel) > 0;
        const tagName = (isHeadingRole && hasAriaLevel) ?
                        `h${node.ariaLevel}` :
                        node.tagName.toLowerCase();
        const level = (isHeadingRole && hasAriaLevel) ?
                      node.ariaLevel :
                      headingTags.includes(tagName) ?
                      tagName.substring(1) :
                      '';

        if (headingTags.includes(tagName) ||
           (isHeadingRole && hasAriaLevel)) {
          const accName = getAccessibleName(doc, node, true);
          node.setAttribute('data-skip-to-info', `heading ${tagName}`);
          node.setAttribute('data-skip-to-acc-name', accName);
          if (targetHeadings.indexOf(tagName) >= 0) {
            if (!onlyInMain || inMain) {
              headingInfo.push({
                node: node,
                tagName: tagName,
                level: level,
                name: accName,
                inMain: inMain
              });
            }
          }
        }
      }

      for (let node = startingNode.firstChild; node !== null; node = node.nextSibling ) {
        if (node.nodeType === Node.ELEMENT_NODE) {

          debug$5.flag && debug$5.log(`[transverseDOM][node]: ${node.tagName} isSlot:${isSlotElement(node)} isCustom:${isCustomElement(node)}`);

          checkForLandmark(doc, node);
          checkForHeading(doc, node, inMain);
          inMain = isMain(node) || inMain;

          if (!isSkipableElement(node)) {
            // check for slotted content
            if (isSlotElement(node)) {
                // if no slotted elements, check for default slotted content
              const slotContent   = node.assignedNodes().length > 0;
              const assignedNodes = slotContent ?
                                    node.assignedNodes() :
                                    node.assignedNodes({ flatten: true });
              const nameDoc = slotContent ?
                              parentDoc :
                              doc;
              for (let i = 0; i < assignedNodes.length; i += 1) {
                const assignedNode = assignedNodes[i];
                if (assignedNode.nodeType === Node.ELEMENT_NODE) {
                  checkForLandmark(nameDoc, assignedNode);
                  checkForHeading(nameDoc, assignedNode, inMain);
                  if (slotContent) {
                    transverseDOM(assignedNode, parentDoc, null, inMain);
                  } else {
                    transverseDOM(assignedNode, doc, parentDoc, inMain);                  
                  }
                }
              }
            } else {
              // check for custom elements
              if (isCustomElement(node)) {
                if (node.shadowRoot) {
                  transverseDOM(node.shadowRoot, node.shadowRoot, doc, inMain);
                }
                else {
                  transverseDOM(node, doc, parentDoc, inMain);
                }
              } else {
                transverseDOM(node, doc, parentDoc, inMain);
              }
            }
          }
        } // end if
      } // end for
    } // end function

    transverseDOM(document.body, document);

    // If no elements found when onlyInMain is set, try 
    // to find any headings
    if ((headingInfo.length === 0) && onlyInMain) {
      onlyInMain = false;
      landmarkInfo = [];
      transverseDOM(document.body, document);
      if (headingInfo.length === 0) {
         console.warn(`[skipTo.js]: no headings found on page`);
      }
      else {
        console.warn(`[skipTo.js]: no headings found in main landmark, but ${headingInfo.length} found in page.`);
      }
    }

    if (landmarkInfo.length === 0) {
       console.warn(`[skipTo.js]: no landmarks found on page`);
    }

    return [landmarkInfo, headingInfo];
  }

  /*
   * @function getLandmarksAndHeadings
   *
   * @desc Returns two arrays of of DOM node elements with, one for landmark regions 
   *       the other for headings with additional information needed to create
   *       menuitems
   *
   * @param {Object} config  - Object with configuration information
   *
   * @return see @desc
   */

  function getLandmarksAndHeadings (config, skiptoId) {

    let landmarkTargets = config.landmarks;
    if (typeof landmarkTargets !== 'string') {
      console.warn(`[skipto.js]: Error in landmark configuration`);
      landmarkTargets = 'main search navigation';
    }

    let headingTargets = config.headings;
    // If targets undefined, use default settings
    if (typeof headingTargets !== 'string') {
      console.warn(`[skipto.js]: Error in heading configuration`);
      headingTargets = 'h1 h2';
    }

    const [landmarks, headings] = queryDOMForLandmarksAndHeadings(landmarkTargets, headingTargets, skiptoId);

    return [getLandmarks(config, landmarks), getHeadings(config, headings)];
  }

  /*
   * @function getHeadings
   *
   * @desc Returns an array of heading menu elements
   *
   * @param {Object} config  - Object with configuration information
   * @param {Object} headings - Array of dome node elements that are headings
   *
   * @returns see @desc
   */
  function getHeadings (config, headings) {
    let dataId;
    let headingElementsArr = [];

    for (let i = 0, len = headings.length; i < len; i += 1) {
      let heading = headings[i];

      let role = heading.node.getAttribute('role');
      if ((typeof role === 'string') &&
          ((role === 'presentation') || role === 'none')
         ) continue;
      if (isVisible(heading.node) &&
          isNotEmptyString(heading.name)) {
        if (heading.node.hasAttribute('data-skip-to-id')) {
          dataId = heading.node.getAttribute('data-skip-to-id');
        } else {
          dataId = getSkipToIdIndex();
          heading.node.setAttribute('data-skip-to-id', dataId);
        }
        const headingItem = {};
        headingItem.dataId = dataId.toString();
        headingItem.class = 'heading';
        headingItem.name = heading.name;
        headingItem.ariaLabel = headingItem.name + ', ';
        headingItem.ariaLabel += config.headingLevelLabel + ' ' + heading.level;
        headingItem.tagName = heading.tagName;
        headingItem.role = 'heading';
        headingItem.level = heading.level;
        headingItem.inMain = heading.inMain;
        headingElementsArr.push(headingItem);
        incSkipToIdIndex();
      }
    }
    return headingElementsArr;
  }

  /*
   * @function getLocalizedLandmarkName
   *
   * @desc Localizes a landmark name and adds accessible name if defined
   *
   * @param {Object} config  - Object with configuration information
   * @param {String} tagName - String with landamrk and/or tag names
   * @param {String} AccName - Accessible name for therlandmark, maybe an empty string
   *
   * @returns {String}  A localized string for a landmark name
   */
  function getLocalizedLandmarkName (config, tagName, accName) {
    let n;
    switch (tagName) {
      case 'aside':
        n = config.asideLabel;
        break;
      case 'footer':
        n = config.footerLabel;
        break;
      case 'form':
        n = config.formLabel;
        break;
      case 'header':
        n = config.headerLabel;
        break;
      case 'main':
        n = config.mainLabel;
        break;
      case 'nav':
        n = config.navLabel;
        break;
      case 'section':
      case 'region':
        n = config.regionLabel;
        break;
      case 'search':
        n = config.searchLabel;
        break;
        // When an ID is used as a selector, assume for main content
      default:
        n = tagName;
        break;
    }
    if (isNotEmptyString(accName)) {
      n += ': ' + accName;
    }
    return n;
  }

  /*
   * @function getLandmarkTargets
   *
   * @desc Analyzes a configuration string for landmark and tag names
   *       NOTE: This function is included to maximize compatibility
   *             with configuration strings that use CSS selectors
   *             in previous versions of SkipTo
   *
   * @param {String} targets - String with landmark and/or tag names
   *
   * @returns {Array}  A normalized array of landmark names based on target configuration
   */
  function getLandmarkTargets (targets) {
    let targetLandmarks = [];
    targets = targets.toLowerCase();
    if (targets.includes('main')) {
      targetLandmarks.push('main');
    }
    if (targets.includes('search')) {
      targetLandmarks.push('search');
    }
    if (targets.includes('nav') ||
        targets.includes('navigation')) {
      targetLandmarks.push('navigation');
    }
    if (targets.includes('complementary') || 
        targets.includes('aside')) {
      targetLandmarks.push('complementary');
    }
    if (targets.includes('banner') || 
        targets.includes('header')) {
      targetLandmarks.push('banner');
    }
    if (targets.includes('contentinfo') || 
        targets.includes('footer')) {
      targetLandmarks.push('contentinfo');
    }
    if (targets.includes('region') || 
        targets.includes('section')) {
      targetLandmarks.push('region');
    }
    return targetLandmarks;
  }

  /*
   * @function checkForName
   *
   * @desc  Removes landmark objects without an accessible name if array is longer
   *        than accessible name count constant
   *
   * @param {Array} landmarks - Array of landmark objects
   *
   * @returns {Array}  Array of landmark objects
   */
  function checkForName (landmarks) {

    let namedLandmarks = [];

    if (landmarks.length > REQUIRE_ACCESSIBLE_NAME_COUNT) {

      landmarks.forEach( (l) => {
        if (l.hasName) {
          namedLandmarks.push(l);
        }
      });
      return namedLandmarks;
    }

    return landmarks;
  }

  /*
   * @function getLandmarks
   *
   * @desc Returns an array of objects with information to build the 
   *       the landmarks menu, ordering in the array by the type of landmark
   *       region 
   *
   * @param {Object} config     - Object with configuration information
   * @param {Array}  landmarks  - Array of objects containing the DOM node and 
   *                              accessible name for landmarks
   *
   * @returns {Array}  see @desc
   */
  function getLandmarks(config, landmarks) {
    let allElements = [];
    let mainElements = [];
    let searchElements = [];
    let navElements = [];
    let asideElements = [];
    let footerElements = [];
    let headerElements = [];
    let regionElements = [];
    let otherElements = [];
    let dataId = '';
    for (let i = 0, len = landmarks.length; i < len; i += 1) {
      let landmark = landmarks[i];
      if (landmark.node.id === 'id-skip-to') {
         continue;
      }
      let role = landmark.node.getAttribute('role');
      let tagName = landmark.node.tagName.toLowerCase();
      if ((typeof role === 'string') &&
          ((role === 'presentation') || (role === 'none'))
         ) continue;
      if (isVisible(landmark.node)) {
        if (!role) role = tagName;
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
        }
        if (landmark.node.hasAttribute('aria-roledescription')) {
          tagName = landmark.node.getAttribute('aria-roledescription').trim().replace(' ', '-');
        }
        if (landmark.node.hasAttribute('data-skip-to-id')) {
          dataId = landmark.node.getAttribute('data-skip-to-id');
        } else {
          dataId =  getSkipToIdIndex();
          landmark.node.setAttribute('data-skip-to-id', dataId);
        }
        const landmarkItem = {};
        landmarkItem.dataId = dataId.toString();
        landmarkItem.class = 'landmark';
        landmarkItem.hasName = landmark.name.length > 0;
        landmarkItem.name = getLocalizedLandmarkName(config, tagName, landmark.name);
        landmarkItem.tagName = tagName;
        landmarkItem.nestingLevel = 0;
        incSkipToIdIndex();

        allElements.push(landmarkItem);

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
          case 'header':
            headerElements.push(landmarkItem);
            break;
          case 'section':
            // Regions must have accessible name to be included
            if (landmarkItem.hasName) {
              regionElements.push(landmarkItem);
            }
            break;
          case 'form':
            // Forms must have accessible name to be included
            if (landmarkItem.hasName) {
              otherElements.push(landmarkItem);
            }
            break;
          default:
            otherElements.push(landmarkItem);
            break;
        }
      }
    }
    if (config.landmarks.includes('doc-order')) {
      return allElements;
    }
  //  if (config.excludeHiddenHeadings) {

  //  }
    if (config.showLandmarksWithoutNames === 'false') {
      asideElements  = checkForName(asideElements);
      navElements    = checkForName(navElements);
      searchElements = checkForName(searchElements);
      headerElements = checkForName(headerElements);
      footerElements = checkForName(footerElements);

    }

    return [].concat(mainElements, searchElements, navElements, asideElements, regionElements, footerElements, headerElements, otherElements);
  }

  /* shortcuts.js */

  /* Constants */
  const debug$4 = new DebugLogging('shortcuts', false);
  debug$4.flag = false;


  /**
   * @function monitorKeyboardFocus
   *
   * @desc Removes highlighting when keyboard focus changes
   */
  function monitorKeyboardFocus () {
    document.addEventListener('focusin', () => {
      const skipToContentElem = document.querySelector(EXTENSION_ELEMENT_NAME) || document.querySelector(BOOKMARKLET_ELEMENT_NAME);
      if (skipToContentElem) {
        skipToContentElem.buttonSkipTo.removeHighlight();
      }
    });
  }

  /**
   * @function navigateContent
   *
   * @desc Returns DOM node associated with the id, if id not found returns null
   *
   * @param {String}  target         - Feature to navigate (e.g. heading, landmark)
   * @param {String}  direction      - 'next' or 'previous'
   * @param {boolean} useFirst       - if item not found use first
   * @param {boolean} nameRequired   - if true, item must have accessible name
   */

  function navigateContent (target, direction, msgHeadingLevel, useFirst=false, nameRequired=false) {

    let lastFocusElem = getFocusElement();
    let elem = lastFocusElem;
    let lastElem;
    let count = 0;

    // Note: The counter is used as a safety mechanism for any endless loops
    do {
      lastElem = elem;
      elem = queryDOMForSkipToNavigation(target, direction, elem, useFirst, nameRequired);
      if (elem) {
        elem.tabIndex = elem.tabIndex >= 0 ? elem.tabIndex : -1;
        elem.focus();
      }
      count += 1;
    }
    while (elem && (count < 100) && (lastElem !== elem) && (lastFocusElem === getFocusElement()));

    // Set highlight
    if (elem) {

      let info = elem.hasAttribute('data-skip-to-info') ?
                 elem.getAttribute('data-skip-to-info').replace('heading', '').replace('landmark', '').trim() :
                'unknown';

      if (elem.getAttribute('data-skip-to-info').includes('heading')) {
        info = msgHeadingLevel.replace('#', info.substring(1));
      }

      if (elem.hasAttribute('data-skip-to-acc-name')) {
        const name = elem.getAttribute('data-skip-to-acc-name').trim();
        if (name) {
          info += `: ${name}`;
        }
      }

      const skipToContentElem = document.querySelector(EXTENSION_ELEMENT_NAME) || document.querySelector(BOOKMARKLET_ELEMENT_NAME);
      if (skipToContentElem) {
        skipToContentElem.buttonSkipTo.highlight(elem, 'instant', info, true);  // force highlight
      }

    }

    return elem;
  }

  /**
   * @function queryDOMForSkipToNavigation
   *
   * @desc Returns DOM node associated with the id, if id not found returns null
   *
   * @param {String}  target       - Feature to navigate (e.g. heading, landmark)
   * @param {String}  direction    - 'next' or 'previous'
   * @param {Object}  elem         - Element the search needs to pass, if null used focused element
   * @param {boolean} useFirst     - if true, if item not found use first
   * @param {boolean} nameRequired - if true, accessible name is required to include in navigation
   *
   * @returns {Object} @desc
   */
  function queryDOMForSkipToNavigation (target, direction, elem, useFirst=false, nameRequired=false) {

    let lastNode = false;
    let firstNode = false;
    let passFound = false;

    const passElem = elem ? elem : getFocusElement();

    function transverseDOMForElement(startingNode) {

      function checkForTarget (node) {

        if (node.hasAttribute('data-skip-to-info') &&
            node.getAttribute('data-skip-to-info').includes(target) &&
            ( !nameRequired || (nameRequired &&
              node.hasAttribute('data-skip-to-acc-name') &&
              node.getAttribute('data-skip-to-acc-name').trim().length > 0))) {

          if (!firstNode &&
              isVisible(node)) {
            firstNode = node;
          }

          if ((node !== passElem) &&
              isVisible(node)) {
            lastNode = node;
          }

          if (passFound &&
             (direction === 'next') &&
              isVisible(node)) {
            return node;
          }
        }

        if (node === passElem) {
          passFound = true;
          if (direction === 'previous') {
            return lastNode;
          }
        }

        return false;
      }

      let targetNode = null;
      for (let node = startingNode.firstChild; node !== null; node = node.nextSibling ) {
        if (node.nodeType === Node.ELEMENT_NODE) {

          targetNode = checkForTarget(node);
          if (targetNode) {
            return targetNode;
          }

          if (!isSkipableElement(node)) {
            // check for slotted content
            if (isSlotElement(node)) {
                // if no slotted elements, check for default slotted content
              const assignedNodes = node.assignedNodes().length ?
                                    node.assignedNodes() :
                                    node.assignedNodes({ flatten: true });
              for (let i = 0; i < assignedNodes.length; i += 1) {
                const assignedNode = assignedNodes[i];
                if (assignedNode.nodeType === Node.ELEMENT_NODE) {

                  targetNode = checkForTarget(assignedNode);
                  if (targetNode) {
                    return targetNode;
                  }

                  targetNode = transverseDOMForElement(assignedNode);
                  if (targetNode) {
                    return targetNode;
                  }
                }
              }
            } else {
              // check for custom elements
              if (isCustomElement(node)) {
                if (node.shadowRoot) {
                  targetNode = transverseDOMForElement(node.shadowRoot);
                  if (targetNode) {
                    return targetNode;
                  }
                }
                else {
                  targetNode = transverseDOMForElement(node);
                  if (targetNode) {
                    return targetNode;
                  }
                }
              } else {
                targetNode = transverseDOMForElement(node);
                if (targetNode) {
                  return targetNode;
                }
              }
            }
          }
        } // end if
      } // end for
      return false;
    } // end function

    passFound = (passElem === document.body) ||
                (passElem.parentNode && (passElem.parentNode.id === SKIP_TO_ID));
    let node = transverseDOMForElement(document.body);

    debug$4.log(`[node]: ${node} [useFirst]: ${useFirst} [firstNode]: ${firstNode}`);

    if (!node && useFirst && firstNode) {
      node = firstNode;
    }

    return node;
  }

  /**
   * @function getFocusElement
   *
   * @desc Returns DOM element node that has focus, if no DOM node
   *       has focus returns null
   *
   * @returns {Object} @desc
   */
  function getFocusElement() {

    let elem = document.activeElement;

    while (elem.shadowRoot && elem.shadowRoot.activeElement) {
      elem = elem.shadowRoot.activeElement;
    }
    return elem;
  }

  /* keyboardHelper.js */

  /* Constants */
  const debug$3 = new DebugLogging('[kbdHelpers]', false);
  debug$3.flag = false;

  /*
   * @method isInteractiveElement
   *
   * @desc  Returns true if the element can use key presses, otherwise false
   *
   * @param  {object} elem - DOM node element
   *
   * @returns {Boolean}  see @desc
   */

  function elementTakesText (elem) {

    const enabledInputTypes = [
      'button',
      'checkbox',
      'color',
      'image',
      'radio',
      'range',
      'reset',
      'submit'
    ];

    const tagName = elem.tagName ? elem.tagName.toLowerCase() : '';
    const type =  tagName === 'input' ?
                  (elem.type ? elem.type.toLowerCase() : 'text') :
                  '';

    debug$3.flag && debug$3.log(`[elementTakesText][type]: ${type} (${enabledInputTypes.includes(type)})`);

    return (tagName === 'select') ||
           (tagName === 'textarea') ||
           ((tagName === 'input') &&
            !enabledInputTypes.includes(type)) ||
          inContentEditable(elem);
  }

  /*
   * @function inContentEditable
   *
   * @desc Returns false if node is not in a content editable element,
   *       otherwise true if it does
   *
   * @param  {Object}  elem - DOM node
   *
   * @returns {Boolean} see @desc
   */
  function inContentEditable (elem) {
    let n = elem;
    while (n.hasAttribute) {
      if (n.hasAttribute('contenteditable') &&
          (n.getAttribute('contenteditable').toLowerCase().trim() !== 'false')) {
        return true;
      }
      n = n.parentNode;
    }
    return false;
  }

  /*
   * @function noModifierPressed
   *
   * @desc Returns true if no modifier key is pressed, other false
   *
   * @param  {Object}  event - Event object
   *
   * @returns {Boolean} see @desc
   */

  function noModifierPressed (event) {
    return !event.altKey &&
          !event.ctrlKey &&
          !event.shiftKey &&
          !event.metaKey;
  }

  /*
   * @function onlyShiftPressed
   *
   * @desc Returns true if only the shift modifier key is pressed, other false
   *
   * @param  {Object}  event - Event object
   *
   * @returns {Boolean} see @desc
   */

  function onlyShiftPressed (event) {
    return !event.altKey &&
          !event.ctrlKey &&
          event.shiftKey &&
          !event.metaKey;
  }

  /*
   * @function onlyAltPressed
   *
   * @desc Returns true if only the alt modifier key is pressed, other false
   *
   * @param  {Object}  event - Event object
   *
   * @returns {Boolean} see @desc
   */

  function onlyAltPressed (event) {
    return event.altKey &&
          !event.ctrlKey &&
          !event.shiftKey &&
          !event.metaKey;
  }

  /*
   * @function onlyOptionPressed
   *
   * @desc Returns true if only the option modifier key is pressed, other false
   *
   * @param  {Object}  event - Event object
   *
   * @returns {Boolean} see @desc
   */

  function onlyOptionPressed (event) {
    return event.altKey &&
          !event.ctrlKey &&
          !event.shiftKey &&
          !event.metaKey;
  }

  /* skiptoMenuButton.js */


  /* Constants */
  const debug$2 = new DebugLogging('SkipToButton', false);
  debug$2.flag = false;

  const templateMenuButton = document.createElement('template');
  templateMenuButton.innerHTML = `
    <button id="${BUTTON_ID}"
            aria-haspopup="menu"
            aria-expanded= "false"
            aria-label="Skip To Content"
            aria-controls="id-skip-to-menu">
      <span class="skipto-text">Skip To Content (Alt+0)</span>
      <span class="skipto-medium">Skip To Content</span>
      <span class="skipto-small">SkipTo</span>
    </button>
    <div id="${MENU_ID}"
         role="menu"
         aria-label="Skip to Content"
         style="display: none;">
      <div id="${MENU_LANDMARK_GROUP_LABEL_ID}"
           role="separator"
           aria-label="Landmark Regions">
        Landmark Regions (nn)
      </div>
      <div id="${MENU_LANDMARK_GROUP_ID}"
           role="group"
           class="overflow"
           aria-labelledby="${MENU_LANDMARK_GROUP_LABEL_ID}" >
      </div>
      <div id="${MENU_HEADINGS_GROUP_LABEL_ID}"
           role="separator"
           aria-label="Headings">
        Headings (nn)
      </div>
      <div id="${MENU_HEADINGS_GROUP_ID}"
           role="group"
           class="overflow"
           aria-labelledby="${MENU_HEADINGS_GROUP_LABEL_ID}">
      </div>
      <div id="${MENU_SHORTCUTS_GROUP_LABEL_ID}"
           role="separator"
           class="shortcuts-disabled">
        Shortcuts: Disabled
      </div>
      <div id="${MENU_SHORTCUTS_GROUP_ID}"
           role="group"
           aria-labelledby="${MENU_SHORTCUTS_GROUP_LABEL_ID}"
           class="shortcuts-disabled">
      </div>
      <div role="separator"></div>
      <div id="${MENU_ABOUT_ID}"
           role="menuitem"
           data-about-info=""
           class="about skip-to-nav skip-to-nesting-level-0 last"
           tabindex="-1">
        <span class="label">About SkipTo.js</span>
      </div>
    </div>
`;


  /**
   * @class SkiptoMenuButton
   *
   * @desc Constructor for creating a button to open a menu of headings and landmarks on 
   *       a web page
   *
   * @param {Object}  skipToContentElem  -  The skip-to-content objecy
   * 
   * @returns {Object}  DOM element node that is the container for the button and the menu
   */
  class SkiptoMenuButton {

      constructor (skipToContentElem) {
        this.skipToContentElem = skipToContentElem;
        this.config     = skipToContentElem.config;

        this.containerNode = document.createElement('div');
        this.containerNode.className = 'container';
        skipToContentElem.shadowRoot.appendChild(this.containerNode);

        // check for 'nav' element, if not use 'div' element
        const ce = this.config.containerElement.toLowerCase().trim() === 'nav' ? 'nav' : 'div';

        this.menuButtonNode = document.createElement(ce);
        this.menuButtonNode.className = 'menu-button';
        this.menuButtonNode.id = SKIP_TO_ID;
        this.containerNode.appendChild(this.menuButtonNode);

        if (ce === 'nav') {
          this.menuButtonNode.setAttribute('aria-label', this.config.buttonLabel);
        }

        if (isNotEmptyString(this.config.customClass)) {
          this.menuButtonNode.classList.add(this.config.customClass);
        }
        this.setDisplayOption(this.menuButtonNode, this.config.displayOption);

        this.menuButtonNode.appendChild(templateMenuButton.content.cloneNode(true));

        this.linkNode = false;
        const testFlag = true;
        // If iOS add a link to open menu when clicked and hide button
        if ((this.config.displayOption.toLowerCase() === 'popup') && (isIOS() || testFlag)) {
          this.linkNode = document.createElement('a');
          this.linkNode.href = "#";
          // Position off screen
          this.linkNode.style = "position: absolute; top: -30em; left: -300em";
          this.linkNode.textContent = this.config.buttonLabel;
          // If there is a click event from VO, move focus to menu
          this.linkNode.addEventListener('click', this.handleIOSClick.bind(this));
          document.body.prepend(this.linkNode);
          // add class to hide button
          this.menuButtonNode.classList.add('ios');
        }

        // Setup button

        const [buttonVisibleLabel, buttonAriaLabel] = this.getBrowserSpecificShortcut(this.config);

        this.buttonNode = this.containerNode.querySelector('button');
        this.buttonNode.setAttribute('aria-label', buttonAriaLabel);
        this.buttonNode.addEventListener('keydown', this.handleButtonKeydown.bind(this));
        this.buttonNode.addEventListener('click', this.handleButtonClick.bind(this));

        this.textButtonNode = this.buttonNode.querySelector('span.skipto-text');
        this.textButtonNode.textContent = buttonVisibleLabel;

        this.smallButtonNode = this.buttonNode.querySelector('span.skipto-small');
        this.smallButtonNode.textContent = this.config.smallButtonLabel;

        this.mediumButtonNode = this.buttonNode.querySelector('span.skipto-medium');
        this.mediumButtonNode.textContent = this.config.buttonLabel;


        // Create menu container
        this.menuitemNodes = [];

        this.menuNode   = this.menuButtonNode.querySelector(`#${MENU_ID}`);
        this.menuNode.setAttribute('aria-label', this.config.menuLabel);

        this.landmarkGroupLabelNode = this.menuButtonNode.querySelector(`#${MENU_LANDMARK_GROUP_LABEL_ID}`);
        this.landmarkGroupLabelNode.textContent = this.addNumberToGroupLabel(this.config.landmarkGroupLabel);

        this.landmarkGroupNode = this.menuButtonNode.querySelector(`#${MENU_LANDMARK_GROUP_ID}`);

        this.headingGroupLabelNode = this.menuButtonNode.querySelector(`#${MENU_HEADINGS_GROUP_LABEL_ID}`);
        this.headingGroupLabelNode.textContent = this.addNumberToGroupLabel(this.config.headingGroupLabel);

        this.headingGroupNode = this.menuButtonNode.querySelector(`#${MENU_HEADINGS_GROUP_ID}`);

        this.shortcutsGroupLabelNode = this.menuButtonNode.querySelector(`#${MENU_SHORTCUTS_GROUP_LABEL_ID}`);
        if (this.config.shortcuts === 'enabled') {
          this.shortcutsGroupLabelNode.textContent = this.config.shortcutsGroupEnabledLabel;
        }
        else {
          this.shortcutsGroupLabelNode.textContent = this.config.shortcutsGroupDisabledLabel;
        }

        this.shortcutsGroupNode = this.menuButtonNode.querySelector(`#${MENU_SHORTCUTS_GROUP_ID}`);

        this.aboutNode      = this.menuButtonNode.querySelector(`#${MENU_ABOUT_ID}`);
        this.aboutLabelNode = this.menuButtonNode.querySelector(`#${MENU_ABOUT_ID} .label`);
        this.aboutLabelNode.textContent = this.config.aboutInfoLabel;

        if (this.config.aboutSupported !== 'true') {
          this.aboutNode.remove();
          this.aboutLabelNode = false;
        }

        // Information dialog
        this.infoDialog = new SkipToContentInfoDialog(this.containerNode);

        // Shortcut messages
        this.shortcutsMessage = new ShortcutsMessage(this.containerNode);

        // Highlight element

        this.highlightElement = new HighlightElement(this.containerNode);
        this.highlightElement.configureMessageSizes(this.config);

        this.menuButtonNode.addEventListener('focusin', this.handleFocusin.bind(this));
        this.menuButtonNode.addEventListener('focusout', this.handleFocusout.bind(this));
        this.menuButtonNode.addEventListener('pointerdown', this.handleContainerPointerdown.bind(this), true);
        document.documentElement.addEventListener('pointerdown', this.handleBodyPointerdown.bind(this), true);

        if (this.usesAltKey || this.usesOptionKey) {
          document.addEventListener(
            'keydown',
            this.handleDocumentKeydown.bind(this)
          );
        }

        this.focusMenuitem = null;
      }

      /*
       * @get scrollBehavior
       *
       * @desc Returns normalized value for the highlightTarget option
       */
      scrollBehavior () {
        let value = this.config.highlightTarget.trim().toLowerCase();

        if ('enabled smooth'.includes(value)) {
          return 'smooth';
        }

        if (value === 'instant') {
          return 'instant';
        }

        return '';
      }


      /*
       *   @method highlight
       *
       *   @desc  Highlights the element on the page when highlighting
       *          is enabled (NOTE: Highlight is enabled by default)
       *
       *   @param {Object}  elem            : DOM node of element to highlight
       *   @param {String}  scrollBehavior  : value of highlight target
       *   @param {String}  info            : Information about target
       *   @param {Boolean} force           : If true override isRduced
       */

      highlight(elem, scrollBehavior='instant', info='', force=false) {
        this.highlightElement.highlight(elem, scrollBehavior, info, force);
      }

      /*
       *   @method removeHighlight
       *
       *   @desc  Hides the highlight element on the page
       */
      removeHighlight() {
        this.highlightElement.removeHighlight();
      }

      /*
       * @method addNumberToGroupLabel
       *
       * @desc Updates group label with the number of items in group,
       *       The '#' character in the string is replaced with the number
       *       if number is not provided, just remove number
       *
       * @param  {String}  label  -  Label to include number,
       * @param  {Number}  num    -  Number to add to label
       *
       * @return {String}  see @desc
       */
      addNumberToGroupLabel(label, num=0) {
        if (num > 0) {
          return `${label} (${num})`;
        }
        return label;
      }

      /*
       * @method updateLabels
       *
       * @desc Updates labels, important for configuration changes in browser
       *       add-ons and extensions
       */
      updateLabels(config) {
        if (this.containerNode.hasAttribute('aria-label')) {
          this.containerNode.setAttribute('aria-label', config.buttonLabel);
        }

        const [buttonVisibleLabel, buttonAriaLabel] = this.getBrowserSpecificShortcut(config);
        this.buttonNode.setAttribute('aria-label', buttonAriaLabel);

        this.textButtonNode.textContent = buttonVisibleLabel;
        this.smallButtonNode.textContent = config.smallButtonLabel;
        this.mediumButtonNode.textContent = config.buttonLabel;

        this.menuNode.setAttribute('aria-label', config.menuLabel);
        this.landmarkGroupLabelNode.textContent = this.addNumberToGroupLabel(config.landmarkGroupLabel);
        this.headingGroupLabelNode.textContent = this.addNumberToGroupLabel(config.headingGroupLabel);

        this.highlightElement.configureMessageSizes(config);


      }

      /*
       * @method getBrowserSpecificShortcut
       *
       * @desc Identifies the operating system and updates labels for 
       *       shortcut key to use either the "alt" or the "option"
       *       label  
       *
       * @param {Object}  - SkipTp configure object
       *
       * @return {Array}  - An array of two strings used for the button label
       */
      getBrowserSpecificShortcut (config) {
        const platform =  navigator.platform.toLowerCase();
        const userAgent = navigator.userAgent.toLowerCase();

        const hasWin    = platform.indexOf('win') >= 0;
        const hasMac    = platform.indexOf('mac') >= 0;
        const hasLinux  = platform.indexOf('linux') >= 0 || platform.indexOf('bsd') >= 0;
        const hasAndroid = userAgent.indexOf('android') >= 0;

        this.usesAltKey = hasWin || (hasLinux && !hasAndroid);
        this.usesOptionKey = hasMac;

        let label = config.buttonLabel;
        let ariaLabel = config.buttonLabel;
        let buttonShortcut;

        // Check to make sure a shortcut key is defined
        if (config.altShortcut && config.optionShortcut) {
          if (this.usesAltKey || this.usesOptionKey) {
            buttonShortcut = config.buttonShortcut.replace(
              '$key',
              config.altShortcut
            );
          }
          if (this.usesAltKey) {
            buttonShortcut = buttonShortcut.replace(
              '$modifier',
              config.altLabel
            );
            label = label + buttonShortcut;
            ariaLabel = config.buttonAriaLabel.replace('$key', config.altShortcut);
            ariaLabel = ariaLabel.replace('$buttonLabel', config.buttonLabel);
            ariaLabel = ariaLabel.replace('$modifierLabel', config.altLabel);
            ariaLabel = ariaLabel.replace('$shortcutLabel', config.shortcutLabel);
          }

          if (this.usesOptionKey) {
            buttonShortcut = buttonShortcut.replace(
              '$modifier',
              config.optionLabel
            );
            label = label + buttonShortcut;
            ariaLabel = config.buttonAriaLabel.replace('$key', config.altShortcut);
            ariaLabel = ariaLabel.replace('$buttonLabel', config.buttonLabel);
            ariaLabel = ariaLabel.replace('$modifierLabel', config.optionLabel);
            ariaLabel = ariaLabel.replace('$shortcutLabel', config.shortcutLabel);
          }
        }
        return [label, ariaLabel];
      }

      /*
       * @method getFirstChar
       *
       * @desc Gets the first character in a menuitem to use as a shortcut key
       * 
       * @param  {Object}  menuitem  - DOM element node
       *
       * @returns {String} see @desc
       */
      getFirstChar(menuitem) {
        const label = menuitem.querySelector('.label');
        if (label && isNotEmptyString(label.textContent)) {
          return label.textContent.trim()[0].toLowerCase();
        }
        return '';
      }

      /*
       * @method getHeadingLevelFromAttribute
       *
       * @desc Returns the the heading level of the menu item
       * 
       * @param  {Object}  menuitem  - DOM element node
       *
       * @returns {String} see @desc
       */
      getHeadingLevelFromAttribute(menuitem) {
        if (menuitem.hasAttribute('data-level')) {
          return menuitem.getAttribute('data-level');
        }
        return '';
      }

      /*
       * @method updateKeyboardShortCuts
       *
       * @desc Updates the keyboard short cuts for the curent menu items
       */
      updateKeyboardShortCuts () {
        let mi;
        this.firstChars = [];
        this.headingLevels = [];

        for(let i = 0; i < this.menuitemNodes.length; i += 1) {
          mi = this.menuitemNodes[i];
          this.firstChars.push(this.getFirstChar(mi));
          this.headingLevels.push(this.getHeadingLevelFromAttribute(mi));
        }
      }

      /*
       * @method updateMenuitems
       *
       * @desc  Updates the menu information with the current menu items
       *        used for menu navigation commands and adds event handlers
       */
      updateMenuitems () {
        let menuitemNodes = this.menuNode.querySelectorAll('[role=menuitem');

        this.menuitemNodes = [];
        for(let i = 0; i < menuitemNodes.length; i += 1) {
          const menuitemNode = menuitemNodes[i];
          menuitemNode.addEventListener('keydown', this.handleMenuitemKeydown.bind(this));
          menuitemNode.addEventListener('click', this.handleMenuitemClick.bind(this));
          menuitemNode.addEventListener('pointerenter', this.handleMenuitemPointerenter.bind(this));
          menuitemNode.addEventListener('pointerleave', this.handleMenuitemPointerleave.bind(this));
          menuitemNode.addEventListener('pointerover', this.handleMenuitemPointerover.bind(this));
          this.menuitemNodes.push(menuitemNode);
        }

        this.firstMenuitem = this.menuitemNodes[0];
        this.lastMenuitem = this.menuitemNodes[this.menuitemNodes.length-1];
        this.lastMenuitem.classList.add('last');
        this.updateKeyboardShortCuts();
      }

      /*
       * @method renderMenuitemToGroup
       *
       * @desc Renders a menuitem using an information object about the menuitem
       *
       * @param  {Object}  groupNode  -  DOM element node for the menu group
       * @param  {Object}  mi         - object with menuitem information
       */
      renderMenuitemToGroup (groupNode, mi) {
        let tagNode, tagNodeChild, labelNode, nestingNode;

        let menuitemNode = document.createElement('div');
        menuitemNode.setAttribute('role', 'menuitem');
        menuitemNode.classList.add(mi.class);
        if (isNotEmptyString(mi.tagName)) {
          menuitemNode.classList.add('skip-to-' + mi.tagName.toLowerCase());
        }
        menuitemNode.setAttribute('data-id', mi.dataId);
        menuitemNode.tabIndex = -1;
        if (isNotEmptyString(mi.ariaLabel)) {
          menuitemNode.setAttribute('aria-label', mi.ariaLabel);
        }

        // add to group
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
          if (isNotEmptyString(mi.tagName)) {
            menuitemNode.classList.add('skip-to-' + mi.tagName);
          }
        }

        // add nesting level for landmarks
        if (mi.class.includes('landmark')) {
          menuitemNode.setAttribute('data-nesting', mi.nestingLevel);
          menuitemNode.classList.add('skip-to-nesting-level-' + mi.nestingLevel);

          if (mi.nestingLevel > 0 && (mi.nestingLevel > this.lastNestingLevel)) {
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
      }

      /*
       * @method renderMenuitemsToGroup
       *
       * @desc Renders either the landmark region or headings menu group
       * 
       * @param  {Object}  groupNode       -  DOM element node for the menu group
       * @param  {Array}   menuitems       -  Array of objects with menu item information
       * @param  {String}  msgNoItesmFound -  Message to render if there are no menu items
       */
      renderMenuitemsToGroup(groupNode, menuitems, msgNoItemsFound) {
        // remove all child nodes
        while (groupNode.firstChild) {
          groupNode.removeChild(groupNode.firstChild);
        }

        this.lastNestingLevel = 0;

        if (menuitems.length === 0) {
          const item = {};
          item.name = msgNoItemsFound;
          item.tagName = '';
          item.class = 'no-items';
          item.dataId = '';
          this.renderMenuitemToGroup(groupNode, item);
        }
        else {
          for (let i = 0; i < menuitems.length; i += 1) {
              this.renderMenuitemToGroup(groupNode, menuitems[i]);
          }
        }
      }

      /*
       * @method renderMenu
       *
       * @desc 
       */
      renderMenu(config, skipToId) {
        // remove landmark menu items
        while (this.landmarkGroupNode.lastElementChild) {
          this.landmarkGroupNode.removeChild(this.landmarkGroupNode.lastElementChild);
        }
        // remove heading menu items
        while (this.headingGroupNode.lastElementChild) {
          this.headingGroupNode.removeChild(this.headingGroupNode.lastElementChild);
        }

        // Create landmarks group
        const [landmarkElements, headingElements] = getLandmarksAndHeadings(config, skipToId);

        this.renderMenuitemsToGroup(this.landmarkGroupNode, landmarkElements, config.msgNoLandmarksFound);
        this.renderMenuitemsToGroup(this.headingGroupNode,  headingElements, config.msgNoHeadingsFound);
        this.renderMenuitemsToShortcutsGroup(this.shortcutsGroupLabelNode, this.shortcutsGroupNode);

        // Update list of menuitems
        this.updateMenuitems();

        this.landmarkGroupLabelNode.textContent = this.addNumberToGroupLabel(config.landmarkGroupLabel, landmarkElements.length);
        this.landmarkGroupLabelNode.setAttribute('aria-label', config.landmarkGroupLabel);

        if (config.headings.includes('main')) {
          this.headingGroupLabelNode.textContent = this.addNumberToGroupLabel(config.headingMainGroupLabel, headingElements.length);
          this.headingGroupLabelNode.setAttribute('aria-label', config.headingMainGroupLabel);
        }
        else {
          this.headingGroupLabelNode.textContent = this.addNumberToGroupLabel(config.headingGroupLabel, headingElements.length);
          this.headingGroupLabelNode.setAttribute('aria-label', config.headingGroupLabel);
        }
      }

      /*
       * @method renderMenuitemsToShortcutsGroup
       *
       * @desc Updates separator and menuitems related to page navigation
       *
       * @param  {Object}  groupLabelNode  -  DOM element node for the label for page navigation group
       * @param  {Object}  groupLabelNode  -  DOM element node for the page navigation group
       */
      renderMenuitemsToShortcutsGroup (groupLabelNode, groupNode) {

        // remove page navigation menu items
        while (groupNode.lastElementChild) {
          groupNode.removeChild(groupNode.lastElementChild);
        }

        if (this.config.shortcutsSupported === 'true') {
          groupNode.classList.remove('shortcuts-disabled');
          groupLabelNode.classList.remove('shortcuts-disabled');

          const shortcutsToggleNode = document.createElement('div');
          shortcutsToggleNode.setAttribute('role', 'menuitem');
          shortcutsToggleNode.className = 'shortcuts skip-to-nav skip-to-nesting-level-0';
          shortcutsToggleNode.setAttribute('tabindex', '-1');
          groupNode.appendChild(shortcutsToggleNode);

          const shortcutsToggleLabelNode = document.createElement('span');
          shortcutsToggleLabelNode.className = 'label';
          shortcutsToggleNode.appendChild(shortcutsToggleLabelNode);

          if (this.config.shortcuts === 'enabled') {
            groupLabelNode.textContent    = this.config.shortcutsGroupEnabledLabel;
            shortcutsToggleNode.setAttribute('data-shortcuts-toggle', 'disable');
            shortcutsToggleLabelNode.textContent = this.config.shortcutsToggleDisableLabel;
          }
          else {
            groupLabelNode.textContent = this.config.shortcutsGroupDisabledLabel;
            shortcutsToggleNode.setAttribute('data-shortcuts-toggle', 'enable');
            shortcutsToggleLabelNode.textContent = this.config.shortcutsToggleEnableLabel;
          }
          groupNode.appendChild(shortcutsToggleNode);


          const shortcutsInfoNode = document.createElement('div');
          shortcutsInfoNode.setAttribute('role', 'menuitem');
          shortcutsInfoNode.className = 'shortcuts skip-to-nav skip-to-nesting-level-0';
          shortcutsInfoNode.setAttribute('tabindex', '-1');
          shortcutsInfoNode.setAttribute('data-shortcuts-info', '');
          groupNode.appendChild(shortcutsInfoNode);

          const shortcutsInfoLabelNode = document.createElement('span');
          shortcutsInfoLabelNode.className = 'label';
          shortcutsInfoLabelNode.textContent = this.config.shortcutsInfoLabel;
          shortcutsInfoNode.appendChild(shortcutsInfoLabelNode);


        }
        else {
          groupNode.classList.add('shortcuts-disabled');
          groupLabelNode.classList.add('shortcuts-disabled');
        }
      }

  //
  // Menu scripting helper functions and event handlers
  //

      /*
       * @method setFocusToMenuitem
       *
       * @desc Moves focus to menu item
       *
       * @param {Object}  menuItem  - DOM element node used as a menu item
       */
      setFocusToMenuitem(menuitem) {
        if (menuitem) {
          this.removeHoverClass(menuitem);
          menuitem.classList.add('hover');
          menuitem.focus();
          this.skipToContentElem.setAttribute('focus', 'menu');
          this.focusMenuitem = menuitem;
          if (menuitem.hasAttribute('data-id')) {
            const elem = queryDOMForSkipToId(menuitem.getAttribute('data-id'));
            this.highlightElement.highlight(elem, this.scrollBehavior());
          }
          else {
            this.highlightElement.removeHighlight();
          }
        }
      }

      /*
       * @method setFocusToFirstMenuitem
       *
       * @desc Moves focus to first menu item
       */
      setFocusToFirstMenuitem() {
        this.setFocusToMenuitem(this.firstMenuitem);
      }

      /*
       * @method setFocusToLastMenuitem
       *
       * @desc Moves focus to last menu item
       */
      setFocusToLastMenuitem() {
        this.setFocusToMenuitem(this.lastMenuitem);
      }

      /*
       * @method setFocusToPreviousMenuitem
       *
       * @desc Moves focus to previous menu item
       *
       * @param {Object}  menuItem  - DOM element node 
       */
      setFocusToPreviousMenuitem(menuitem) {
        let newMenuitem, index;
        if (menuitem === this.firstMenuitem) {
          newMenuitem = this.lastMenuitem;
        } else {
          index = this.menuitemNodes.indexOf(menuitem);
          newMenuitem = this.menuitemNodes[index - 1];
        }
        this.setFocusToMenuitem(newMenuitem);
        return newMenuitem;
      }

      /*
       * @method setFocusToNextMenuitem
       *
       * @desc Moves focus to next menu item
       *
       * @param {Object}  menuItem  - DOM element node 
       */
      setFocusToNextMenuitem(menuitem) {
        let newMenuitem, index;
        if (menuitem === this.lastMenuitem) {
          newMenuitem = this.firstMenuitem;
        } else {
          index = this.menuitemNodes.indexOf(menuitem);
          newMenuitem = this.menuitemNodes[index + 1];
        }
        this.setFocusToMenuitem(newMenuitem);
        return newMenuitem;
      }

      /*
       * @method setFocusByFirstCharacter
       *
       * @desc Moves focus to next menu item based on shortcut key
       *
       * @param {Object}  menuItem  - Starting DOM element node 
       * @param {String}  char      - Shortcut key to identify the
       *                              next menu item  
       */
      setFocusByFirstCharacter(menuitem, char) {
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
      }

      /*
       * @method getIndexFirstChars
       *
       * @desc  
       *
       * @returns {Number} 
       */
      getIndexFirstChars(startIndex, char) {
        for (let i = startIndex; i < this.firstChars.length; i += 1) {
          if (char === this.firstChars[i]) {
            return i;
          }
        }
        return -1;
      }

      /*
       * @method openPopup
       *
       * @desc Opens the menu of landmark regions and headings
       */
      openPopup() {
        this.menuNode.setAttribute('aria-busy', 'true');
        // Compute height of menu to not exceed about 80% of screen height
        const h = (30 * window.innerHeight) / 100;
        this.landmarkGroupNode.style.maxHeight = h + 'px';
        this.headingGroupNode.style.maxHeight = h + 'px';
        this.renderMenu(this.config, this.skipToId);
        this.menuNode.style.display = 'block';

        // make sure menu is on screen and not clipped in the right edge of the window
        const buttonRect = this.buttonNode.getBoundingClientRect();
        const menuRect = this.menuNode.getBoundingClientRect();
        const diff = window.innerWidth - buttonRect.left - menuRect.width;
        if (diff < 0) {
          if (window.innerWidth < menuRect.width) {
            this.menuNode.style.left = '0px';
          }
        }

        this.menuNode.removeAttribute('aria-busy');
        this.buttonNode.setAttribute('aria-expanded', 'true');
        // use custom element attribute to set focus to the menu
        this.buttonNode.classList.add('menu');

        if (this.linkNode) {
          this.linkNode.style.display = 'none';
        }

      }

      /*
       * @method closePopup
       *
       * @desc Closes the memu of landmark regions and headings
       */
      closePopup(moveFocusToButton=false) {
        if (this.isOpen()) {
          this.buttonNode.setAttribute('aria-expanded', 'false');
          this.menuNode.style.display = 'none';
          this.highlightElement.removeHighlight();
          this.buttonNode.classList.remove('menu');
          if (moveFocusToButton) {
            if (this.linkNode) {
              this.linkNode.style.display = 'block';
              this.linkNode.focus();
            }
            else {
              this.buttonNode.focus();
            }
            this.skipToContentElem.setAttribute('focus', 'button');
          }
        }
      }

      /*
       * @method isOpen
       *
       * @desc Returns true if menu is open, otherwise false
       *
       * @returns {Boolean}  see @desc
       */
      isOpen() {
        return this.buttonNode.getAttribute('aria-expanded') === 'true';
      }

      /*
       * @method removeHoverClass
       *
       * @desc Removes hover class for menuitems
       */
      removeHoverClass(target=null) {
        this.menuitemNodes.forEach( node => {
          if (node !== target) {
            node.classList.remove('hover');
          }
        });
      }

      /*
       * @method getMenuitem
       *
       * @desc Returns menuitem dom node if pointer is over it
       *
       * @param {Number}   x: client x coordinator of pointer
       * @param {Number}   y: client y coordinator of pointer
       *
       * @return {object}  see @desc
       */
      getMenuitem(x, y) {
        for (let i = (this.menuitemNodes.length - 1); i >= 0; i -= 1) {
          const node = this.menuitemNodes[i];
          const rect = node.getBoundingClientRect();

          if ((rect.left <= x) &&
              (rect.right >= x) &&
              (rect.top <= y) &&
              (rect.bottom >= y)) {
                return node;
              }
        }
        return false;
      }

      /*
       * @method isOverButton
       *
       * @desc Returns true if pointer over button
       *
       * @param {Number}   x: client x coordinator of pointer
       * @param {Number}   y: client y coordinator of pointer
       *
       * @return {object}  see @desc
       */
      isOverButton(x, y) {
        const node = this.buttonNode;
        const rect = node.getBoundingClientRect();

        return (rect.left <= x) &&
               (rect.right >= x) &&
               (rect.top <= y) &&
               (rect.bottom >= y);
      }

      /*
       * @method isOverMenu
       *
       * @desc Returns true if pointer over the menu
       *
       * @param {Number}   x: client x coordinator of pointer
       * @param {Number}   y: client y coordinator of pointer
       *
       * @return {object}  see @desc
       */
      isOverMenu(x, y) {
        const node = this.menuNode;
        const rect = node.getBoundingClientRect();

        return (rect.left <= x) &&
               (rect.right >= x) &&
               (rect.top <= y) &&
               (rect.bottom >= y);
      }    

      /*
       * @method setDisplayOption
       *
       * @desc Set display option for button visibility wehn it does not
       *       have focus
       *
       * @param  {Object}  elem  - DOM element to update style
       * @param  {String}  value - String with configuration information
       */
      setDisplayOption(elem, value) {

        if (typeof value === 'string') {
          value = value.trim().toLowerCase();
          if (value.length && elem) {

            elem.classList.remove('static');
            elem.classList.remove('popup');
            elem.classList.remove('show-border');

            switch (value) {
              case 'static':
                elem.classList.add('static');
                break;

              case 'onfocus':  // Legacy option
              case 'popup':
                elem.classList.add('popup');
                break;

              case 'popup-border':
                elem.classList.add('popup');
                elem.classList.add('show-border');
                break;
            }
          }
        }
      }

      // Menu event handlers
      
      handleFocusin() {
        this.menuButtonNode.classList.add('focus');
        this.skipToContentElem.setAttribute('focus', 'button');
        if (this.linkNode) {
          this.linkNode.style.display = 'none';
        }
      }
      
      handleFocusout() {
        this.menuButtonNode.classList.remove('focus');
        this.skipToContentElem.setAttribute('focus', 'none');
        if (this.linkNode) {
          this.linkNode.style.display = 'block';
        }
      }
      
      handleButtonKeydown(event) {
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
            this.closePopup(true);
            flag = true;
            break;
          case 'Up':
          case 'ArrowUp':
            this.openPopup();
            this.setFocusToLastMenuitem();
            flag = true;
            break;
        }
        if (flag) {
          event.stopPropagation();
          event.preventDefault();
        }
      }

      handleButtonClick(event) {
        this.menuButtonNode.classList.add('focus');
        if (this.isOpen()) {
          this.closePopup(true);
        } else {
          this.openPopup();
          this.setFocusToFirstMenuitem();
        }
        event.stopPropagation();
        event.preventDefault();
      }

      handleDocumentKeydown (event) {

        this.shortcutsMessage.close();

        let flag = false;
        let elem;
        const focusElem = getFocusElement();

        if (!elementTakesText(focusElem)) {

          const altPressed = this.usesAltKey && onlyAltPressed(event);
          const optionPressed = this.usesOptionKey && onlyOptionPressed(event);

          if ((optionPressed && this.config.optionShortcut === event.key) ||
              (altPressed && this.config.altShortcut === event.key) ||
              ((optionPressed || altPressed) && (48 === event.keyCode))
          ) {
            this.openPopup();
            this.setFocusToFirstMenuitem();
            flag = true;
          }

          // Check for navigation keys
          if ((this.config.shortcuts === 'enabled') &&
              (onlyShiftPressed(event) || noModifierPressed(event))) {

            switch (event.key) {
              // ignore and space characters
              case ' ':
              case '':
                break;

              case this.config.shortcutRegionNext:
                elem = navigateContent('landmark', 'next', this.config.msgHeadingLevel);
                if (!elem) {
                  this.shortcutsMessage.open(this.config.msgNoMoreRegions);
                }
                flag = true;
                break;

              case this.config.shortcutRegionPrevious:
                elem = navigateContent('landmark', 'previous', this.config.msgHeadingLevel);
                if (!elem) {
                  this.shortcutsMessage.open(this.config.msgNoMoreRegions);
                }
                flag = true;
                break;

              case this.config.shortcutRegionComplementary:
                elem = navigateContent('complementary', 'next', this.config.msgHeadingLevel, true);
                if (!elem) {
                  this.shortcutsMessage.open(this.config.msgNoRegionsFound.replace('%r', 'complementary'));
                }
                flag = true;
                break;

              case this.config.shortcutRegionMain:
                elem = navigateContent('main', 'next', this.config.msgHeadingLevel, true);
                if (!elem) {
                  this.shortcutsMessage.open(this.config.msgNoRegionsFound.replace('%r', 'main'));
                }
                flag = true;
                break;

              case this.config.shortcutRegionNavigation:
                elem = navigateContent('navigation', 'next', this.config.msgHeadingLevel, true);
                if (!elem) {
                  this.shortcutsMessage.open(this.config.msgNoRegionsFound.replace('%r', 'navigation'));
                }
                flag = true;
                break;

              case this.config.shortcutHeadingNext:
                elem = navigateContent('heading', 'next', this.config.msgHeadingLevel, false, true);
                if (!elem) {
                  this.shortcutsMessage.open(this.config.msgNoMoreHeadings);
                }
                flag = true;
                break;

              case this.config.shortcutHeadingPrevious:
                elem = navigateContent('heading', 'previous', this.config.msgHeadingLevel, false, true);
                if (!elem) {
                  this.shortcutsMessage.open(this.config.msgNoMoreHeadings);
                }
                flag = true;
                break;

              case this.config.shortcutHeadingH1:
                elem = navigateContent('h1', 'next', this.config.msgHeadingLevel, true, true);
                if (!elem) {
                  this.shortcutsMessage.open(this.config.msgNoHeadingsLevelFound.replace('%h', '1'));
                }
                flag = true;
                break;

              case this.config.shortcutHeadingH2:
                elem = navigateContent('h2', 'next', this.config.msgHeadingLevel, true, true);
                if (!elem) {
                  this.shortcutsMessage.open(this.config.msgNoHeadingsLevelFound.replace('%h', '2'));
                }
                flag = true;
                break;

              case this.config.shortcutHeadingH3:
                elem = navigateContent('h3', 'next', this.config.msgHeadingLevel, true, true);
                if (!elem) {
                  this.shortcutsMessage.open(this.config.msgNoHeadingsLevelFound.replace('%h', '3'));
                }
                flag = true;
                break;

              case this.config.shortcutHeadingH4:
                elem = navigateContent('h4', 'next', this.config.msgHeadingLevel, true, true);
                if (!elem) {
                  this.shortcutsMessage.open(this.config.msgNoHeadingsLevelFound.replace('%h', '4'));
                }
                flag = true;
                break;

              case this.config.shortcutHeadingH5:
                elem = navigateContent('h5', 'next', this.config.msgHeadingLevel, true, true);
                if (!elem) {
                  this.shortcutsMessage.open(this.config.msgNoHeadingsLevelFound.replace('%h', '5'));
                }
                flag = true;
                break;

              case this.config.shortcutHeadingH6:
                elem = navigateContent('h6', 'next', this.config.msgHeadingLevel, true, true);
                if (!elem) {
                  this.shortcutsMessage.open(this.config.msgNoHeadingsLevelFound.replace('%h', '6'));
                }
                flag = true;
                break;
            }
          }

          if (flag) {
            event.stopPropagation();
            event.preventDefault();
          }
        }
      }    

      handleMenuitemAction(tgt) {
        if (tgt.hasAttribute('data-id')) {
          switch (tgt.getAttribute('data-id')) {
            case '':
              // this means there were no headings or landmarks in the list
              break;

            default:
              this.closePopup();
              skipToElement(tgt);
              break;
          }
        }

        if (tgt.hasAttribute('data-shortcuts-toggle')) {
          if (tgt.getAttribute('data-shortcuts-toggle') === 'enable') {
            this.config.shortcuts = 'enabled';
            this.skipToContentElem.setAttribute('shortcuts', 'enable');
          }
          else {
            this.config.shortcuts = 'disabled';
            this.skipToContentElem.setAttribute('shortcuts', 'disable');
          }
          this.closePopup();
        }

        if (tgt.hasAttribute('data-shortcuts-info')) {
          this.infoDialog.openDialog('shortcuts');
          this.closePopup();
        }

        if (tgt.hasAttribute('data-about-info')) {
          this.infoDialog.openDialog('skipto');
          this.closePopup();
        }

      }

      handleMenuitemKeydown(event) {
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
            this.closePopup(true);
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
              this.closePopup(true);
              flag = true;
              break;
            case 'Left':
            case 'ArrowLeft':
            case 'Up':
            case 'ArrowUp':
              this.setFocusToPreviousMenuitem(tgt);
              flag = true;
              break;
            case 'ArrowRight':
            case 'Right':
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
      }

      handleMenuitemClick(event) {
        this.handleMenuitemAction(event.currentTarget);
        event.stopPropagation();
        event.preventDefault();
      }

      handleMenuitemPointerenter(event) {
        let tgt = event.currentTarget;
        tgt.classList.add('hover');
        if (tgt.hasAttribute('data-id')) {
          const elem = queryDOMForSkipToId(tgt.getAttribute('data-id'));
          this.highlightElement.highlight(elem, this.scrollBehavior());
        }
        else {
          this.highlightElement.removeHighlight();
        }
        event.stopPropagation();
        event.preventDefault();
      }

     handleMenuitemPointerover(event) {
        let tgt = event.currentTarget;
        if (tgt.hasAttribute('data-id')) {
          const elem = queryDOMForSkipToId(tgt.getAttribute('data-id'));
          this.highlightElement.highlight(elem, this.scrollBehavior());
        }
        else {
          this.highlightElement.removeHighlight();
        }
        event.stopPropagation();
        event.preventDefault();
      }

      handleMenuitemPointerleave(event) {
        let tgt = event.currentTarget;
        tgt.classList.remove('hover');
        event.stopPropagation();
        event.preventDefault();
      }

      handleContainerPointerdown(event) {
        if (this.isOverButton(event.clientX, event.clientY)) {
          this.containerNode.releasePointerCapture(event.pointerId);
        }
        else {
          this.containerNode.setPointerCapture(event.pointerId);
          this.containerNode.addEventListener('pointermove', this.handleContainerPointermove.bind(this));
          this.containerNode.addEventListener('pointerup', this.handleContainerPointerup.bind(this));

          if (this.containerNode.contains(event.target)) {
            if (this.isOpen()) {
              if (!this.isOverMenu(event.clientX, event.clientY)) {
                this.closePopup(true);
              }
            }
            else {
              this.openPopup();          
              this.setFocusToFirstMenuitem();
            }

          }
        }

        event.stopPropagation();
        event.preventDefault();
      }

      handleContainerPointermove(event) {
        const mi = this.getMenuitem(event.clientX, event.clientY);
        if (mi) {
          this.removeHoverClass(mi);
          mi.classList.add('hover');
          if (mi.hasAttribute('data-id')) {
            const elem = queryDOMForSkipToId(mi.getAttribute('data-id'));
            this.highlightElement.highlight(elem, this.scrollBehavior());
          }
          else {
            this.highlightElement.removeHighlight();
          }
        }

        event.stopPropagation();
        event.preventDefault();
      }

      handleContainerPointerup(event) {

        this.containerNode.releasePointerCapture(event.pointerId);
        this.containerNode.removeEventListener('pointermove', this.handleContainerPointermove);
        this.containerNode.removeEventListener('pointerup', this.handleContainerPointerup);

        const mi = this.getMenuitem(event.clientX, event.clientY);
        const omb = this.isOverButton(event.clientX, event.clientY);

        if (mi) {
          this.handleMenuitemAction(mi);          
        }
        else {
          if (!omb) {
            if (this.isOpen()) {
              this.closePopup(true);
            }        
          }
        }

        event.stopPropagation();
        event.preventDefault();
      }

      handleIOSClick () {
        this.skipToContentElem.setAttribute('setfocus', 'menu');
      }

      handleBodyPointerdown(event) {
        if (!this.isOverButton(event.clientX, event.clientY) &&
            !this.isOverMenu(event.clientX, event.clientY)) {
          this.closePopup();
        }
      }
  }

  /* skiptoContent.js */

  /* constants */
  const debug$1 = new DebugLogging('skiptoContent', false);
  debug$1.flag = false;

  const defaultStyleOptions = colorThemes['default'];

  /* @class SkipToContent590
   *
   */

  class SkipToContent590 extends HTMLElement {

    constructor() {
      // Always call super first in constructor
      super();
      this.attachShadow({ mode: 'open' });
      this.version = "5.9.2";
      this.buttonSkipTo = false;
      this.initialized = false;

      // Default configuration values
      this.config = {
        // Feature switches
        enableHeadingLevelShortcuts: true,
        lightDarkSupported: 'false',

        // Content options

        showLandmarksWithoutNames: 'false',

        focusOption: 'none',  // used by extensions only

        // Customization of button and menu
        altShortcut: '0', // default shortcut key is the number zero
        optionShortcut: 'º', // default shortcut key character associated with option+0 on mac
        displayOption: '', // options: static, popup, fixed (default)
        // container element, use containerClass for custom styling
        containerElement: 'nav',
        containerRole: '',
        customClass: '',

        // Button labels and messages
        buttonLabel: 'Skip To Content',
        smallButtonLabel: 'SkipTo',
        altLabel: 'Alt',
        optionLabel: 'Option',
        shortcutLabel: 'shortcut',
        buttonShortcut: ' ($modifier+$key)',
        buttonAriaLabel: '$buttonLabel, $shortcutLabel $modifierLabel + $key',

        // Page navigation flag and keys
        shortcutsSupported: 'true', // options: true or false
        shortcuts: 'enabled',  // options: disabled and enabled
        shortcutHeadingNext: 'h',
        shortcutHeadingPrevious: 'H',
        shortcutHeadingH1: '1',
        shortcutHeadingH2: '2',
        shortcutHeadingH3: '3',
        shortcutHeadingH4: '4',
        shortcutHeadingH5: '5',
        shortcutHeadingH6: '6',

        shortcutRegionNext: 'r',
        shortcutRegionPrevious: 'R',
        shortcutRegionMain: 'm',
        shortcutRegionNavigation: 'n',
        shortcutRegionComplementary: 'c',

        shortcutsGroupEnabledLabel:  'Shortcuts: Enabled',
        shortcutsGroupDisabledLabel: 'Shortcuts: Disabled',
        shortcutsToggleEnableLabel:  'Enable shortcuts',
        shortcutsToggleDisableLabel: 'Disable shortcuts',
        shortcutsInfoLabel:          'Shortcut Information',

        aboutSupported: 'true',
        aboutInfoLabel: `About SkipTo.js`,
        aboutHappy: `Happy Skipping!`,
        aboutVersion: `Version ${this.version}`,
        aboutCopyright: 'BSD License, Copyright 2021-2025',
        aboutDesc: 'SkipTo.js is a free and open source utility to support the WCAG 2.4.1 Bypass Block requirement.  ',
        aboutPrivacyLabel: 'Privacy',
        aboutPrivacy: 'SkipTo.js does not collect or store any information about users or work with any other parties to collect or share user browsing information.',

        closeLabel: 'Close',
        moreInfoLabel: 'More Information',
        msgKey: 'Key',
        msgDescription: 'Description',

        msgElementHidden: 'Element is hidden',

        msgNextRegion:     'Next region',
        msgPreviousRegion: 'Previous region',
        msgRegionIsHidden: 'Region is hidden',

        msgNextHeading:     'Next heading',
        msgPreviousHeading: 'Previous heading',
        msgHeadingIsHidden: 'Heading is hidden',

        msgMainRegions: 'Main regions',
        msgNavigationRegions: 'Navigation regions',
        msgComplementaryRegions: 'Complementary regions',

        msgHeadingLevel: 'Level #',
        msgH1Headings: 'Level 1 headings',
        msgH2Headings: 'Level 2 headings',
        msgH3Headings: 'Level 3 headings',
        msgH4Headings: 'Level 4 headings',
        msgH5Headings: 'Level 5 headings',
        msgH6Headings: 'Level 6 headings',

        // Messages for navigation

        msgNoMoreRegions: 'No more regions',
        msgNoRegionsFound: 'No %r regions found',
        msgNoMoreHeadings: 'No more headings',
        msgNoHeadingsLevelFound: 'No level %h headings found',

        // Menu labels and messages
        menuLabel: 'Landmarks and Headings',
        landmarkGroupLabel: 'Landmark Regions',
        headingGroupLabel: 'Headings',
        headingMainGroupLabel: 'Headings in Main Region',
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

        // Selectors for landmark and headings sections
        landmarks: 'main search navigation complementary',
        headings: 'h1 h2',

        // Highlight options
        highlightTarget:      defaultStyleOptions.highlightTarget,
                              // options: 'instant' (default), 'smooth' and 'auto'
        highlightBorderSize:  defaultStyleOptions.highlightBorderSize,
                              // options: 'small' (default), 'medium', 'large', 'x-large'
        highlightBorderStyle: defaultStyleOptions.highlightBorderStyle,
                              // options: 'solid' (default), 'dotted', 'dashed'

        // Hidden heading when highlighting
        hiddenTextColor: '#000000',
        hiddenTextDarkColor: '#000000',
        hiddenBackgroundColor: '#ffcc00',
        hiddenBackgroundDarkColor: '#ffcc00',

        //Dialog styling
        dialogTextColor: '#000000',
        dialogTextDarkColor: '#ffffff',
        dialogBackgroundColor: '#ffffff',
        dialogBackgroundDarkColor: '#000000',
        dialogBackgroundTitleColor: '#eeeeee',
        dialogBackgroundTitleDarkColor: '#013c93',

        // Place holders for configuration
        colorTheme: '',
        fontFamily: '',
        fontSize: '',
        positionLeft: '',
        smallBreakPoint: '',
        mediumBreakPoint: '',
        menuTextColor: '',
        menuBackgroundColor: '',
        menuitemFocusTextColor: '',
        menuitemFocusBackgroundColor: '',
        focusBorderColor: '',
        buttonTextColor: '',
        buttonBackgroundColor: '',
        menuTextDarkColor: '',
        menuBackgroundDarkColor: '',
        menuitemFocusTextDarkColor: '',
        menuitemFocusBackgroundDarkColor: '',
        focusBorderDarkColor: '',
        buttonTextDarkColor: '',
        buttonBackgroundDarkColor: '',
        zIndex: '',
        zHighlight: ''
      };
    }

    static get observedAttributes() {
      return [
        ATTR_SKIP_TO_DATA,
        "setfocus",
        "type",
        "shortcuts",
        "about"
        ];
    }

    attributeChangedCallback(name, oldValue, newValue) {

      if (name === ATTR_SKIP_TO_DATA && newValue) {
        this.config = this.setupConfigFromDataAttribute(this.config, newValue);
        if (newValue.length > 48) {
          this.removeAttribute(ATTR_SKIP_TO_DATA);
        }
      }

      if (name === 'type') {
        if (newValue === 'extension') {
          this.config.shortcuts = 'enabled';
        }
      }

      if (name === 'shortcuts') {
        if (newValue.trim().toLowerCase() === 'enable') {
          this.config.shortcuts = 'enabled';
        }
        else {
          this.config.shortcuts = 'disabled';
        }
      }

      if (name === 'about') {
        if (newValue.trim().toLowerCase() === 'true') {
          this.config.aboutSupported = 'true';
        }
        else {
          this.config.aboutSupported = 'false';
        }
      }

      if (name === 'setfocus') {
        switch (newValue.trim().toLowerCase()) {

          case 'button':
            this.buttonSkipTo.closePopup();
            this.buttonSkipTo.buttonNode.focus();
            break;

          case 'menu':
            this.buttonSkipTo.openPopup();
            this.buttonSkipTo.setFocusToFirstMenuitem();
            break;

          default:
            this.buttonSkipTo.closePopup();
            document.body.focus();
            break;
        }
      }


    }

    /*
     * @method init
     *
     * @desc Initializes the skipto button and menu with default and user
     *       defined options
     *
     * @param  {object} globalConfig - Reference to configuration object
     *                                 can be undefined
     */
    init(globalConfig=false) {
      if (!this.initialized) {
        this.initialized = true;
        if (globalConfig) {
          this.config = this.setupConfigFromGlobal(this.config, globalConfig);
        }

        // Check for data-skipto attribute values for configuration
        const configElem = document.querySelector(`[${ATTR_SKIP_TO_DATA}]`);
        if (configElem) {
          const params = configElem.getAttribute(ATTR_SKIP_TO_DATA);
          this.config  = this.setupConfigFromDataAttribute(this.config, params);
        }

        // Add skipto style sheet to document
        this.buttonSkipTo = new SkiptoMenuButton(this);
        renderStyleElement(this.shadowRoot, this.config, globalConfig);

        // Add landmark and heading info to DOM elements for keyboard navigation
        // if using bookmarklet or extension
        if (!globalConfig) {
          getLandmarksAndHeadings(this.config, this.skipToId);
          monitorKeyboardFocus();
        }

      }
  //    this.setAttribute('focus', 'none');
    }

   /*
     * @method setupConfigFromGlobal
     *
     * @desc Get configuration information from author configuration to change
     *       default settings
     *
     * @param  {object}  config       - Javascript object with default configuration information
     * @param  {object}  globalConfig - Javascript object with configuration information oin a global variable
     */
    setupConfigFromGlobal(config, globalConfig) {
      let authorConfig = {};
      // Support version 4.1 configuration object structure
      // If found use it
      if ((typeof globalConfig.settings === 'object') &&
          (typeof globalConfig.settings.skipTo === 'object')) {
        authorConfig = globalConfig.settings.skipTo;
      }
      else {
        // Version 5.0 removes the requirement for the "settings" and "skipto" properties
        // to reduce the complexity of configuring skipto
        if (typeof globalConfig === 'object') {
          authorConfig = globalConfig;
        }
      }

      for (const name in authorConfig) {
        //overwrite values of our local config, based on the external config
        if ((typeof config[name] !== 'undefined') &&
           ((typeof authorConfig[name] === 'string') &&
            (authorConfig[name].length > 0 ) ||
           typeof authorConfig[name] === 'boolean')
          ) {
          config[name] = authorConfig[name];
        } else {
          console.warn('[SkipTo]: Unsupported or deprecated configuration option in global configuration object: ' + name);
        }
      }

      return config;
    }

    /*
     * @method setupConfigFromDataAttribute
     *
     * @desc Update configuration information from author configuration to change
     *       default settings
     *
     * @param  {Object}  config - Object with SkipTo.js configuration information
     * @param  {String}  params - String with configuration information
     */
    setupConfigFromDataAttribute(config, params) {
      let dataConfig = {};

      if (params) {
        const values = params.split(';');
        values.forEach( v => {
          const index = v.indexOf(':');
          let prop  = v.substring(0,index);
          let value = v.substring(index+1);
          if (prop) {
            prop = prop.trim();
          }
          if (value) {
            value = value.trim();
          }
          if (prop && value) {
            dataConfig[prop] = value;
          }
        });
      }

      for (const name in dataConfig) {
        //overwrite values of our local config, based on the external config
        if ((typeof config[name] !== 'undefined') &&
           ((typeof dataConfig[name] === 'string') &&
            (dataConfig[name].length > 0 ) ||
           typeof dataConfig[name] === 'boolean')
          ) {
          config[name] = dataConfig[name];
        } else {
          console.warn('[SkipTo]: Unsupported or deprecated configuration option in data-skipto attribute: ' + name);
        }
      }


      if (this.buttonSkipTo) {
        renderStyleElement(this.shadowRoot, config);
        this.buttonSkipTo.updateLabels(config);
        this.buttonSkipTo.setDisplayOption(config['displayOption']);
      }

      return config;
    }

    /*
     * @method supportShortcuts
     *
     * @desc  Set suuportShortcuts configuration property
     *
     * @param  {Boolean}  value - If true support keyboard shortcuts, otherwise disable
     */
    supportShortcuts(value) {
      if (value) {
        this.config.shortcutsSupported = 'true';
        this.config.shortcuts = 'enabled';
      }
      else {
        this.config.shortcutsSupported = 'false';
        this.config.shortcuts = 'disabled';
      }
    }

   /*
     *   @method highlight
     *
     *   @desc  Highlights the element on the page when highlighting
     *          is enabled (NOTE: Highlight is enabled by default)
     *
     *   @param {Object}  elem            : DOM node of element to highlight
     *   @param {String}  highlightTarget : value of highlight target
     *   @param {String}  info            : Information about target
     *   @param {Boolean} force           : If true override isRduced
     */

    highlight(elem, highlightTarget='instant', info='', force=false) {
      this.buttonSkipto.highlight(elem, highlightTarget, info, force);
    }

    /*
     *   @method removeHighlight
     *
     *   @desc  Hides the highlight element on the page
     */
    removeHighlight() {
      debug$1.log(`[removeHighlight]`);
      this.buttonSkipto.removeHighlight();

    }

  }

  /* skipto.js */

  /* constants */
  const debug = new DebugLogging('skipto', false);
  debug.flag = false;

  (function() {

    /*
    *  @function removeLegacySkipToJS
    *
    *  @desc Removes legacy and duplicate versions of SkipTo.js
    */
    function removeLegacySkipToJS() {

      function removeElementsWithId(id) {
        let node = document.getElementById(id);
        // do more than once in case of duplicates
        while (node) {
          console.warn(`[SkipTo.js]: Removing legacy 5.x component: ${id}`);
          node.remove ();
          node = document.getElementById(id);
        }
      }

      function removeElementsWithName(name) {
        let nodes = document.getElementsByTagName(name);
        // do more than once in case of duplicates
        for(let i = 0; i < nodes.length; i += 1) {
          const node = nodes[i];
          console.warn(`[SkipTo.js]: Removing legacy 5.x component: ${name}`);
          node.remove();
        }
      }

      // Remove 5.x legacy code
      removeElementsWithId('id-skip-to');
      removeElementsWithId('id-skip-to-css');
      removeElementsWithId('id-skip-to-highlight');

      removeElementsWithName('skip-to-shortcuts-message');

      // Remove 4.x
      const nodes = document.querySelectorAll('div.skip-to');
      debug.flag && debug.log(`[removeLegacySkipToJS]: ${nodes.length}`);
      for(let i = 0; i < nodes.length; i += 1) {
        nodes[i].remove();
        console.warn(`[SkipTo.js]: Removing legacy 4.x component`);
      }
    }

    /*
    *  @function removePageSkipTo
    *
    *  @desc Removes duplicate versions of SkipTo.js
    */
    function removePageSkipTo() {
      const nodes = document.querySelectorAll(PAGE_SCRIPT_ELEMENT_NAME);
      debug.flag && debug.log(`[removePageSkipTo]: ${nodes.length}`);
      for (let i = 0; i < nodes.length; i += 1) {
        nodes[i].remove();
        console.warn(`[SkipTo.js]: Removing ${nodes[i].tagName}`);
      }
    }

    /*
    *  @function removeBookmarkletSkipTo
    *
    *  @desc Removes duplicate versions of SkipTo.js
    */
    function removeBookmarkletSkipTo() {
      const nodes = document.querySelectorAll(BOOKMARKLET_ELEMENT_NAME);
      debug.flag && debug.log(`[removeBookmarkletSkipTo]: ${nodes.length}`);
      for (let i = 0; i < nodes.length; i += 1) {
        nodes[i].remove();
        console.warn(`[SkipTo.js]: Removing ${nodes[i].tagName}`);
      }
    }

    /*
    *. @function getSkipToContentElement
    *
    * @desc  Creates and add a skip-to-content element in the page
    *
    * @returns  Returns dom node of new element or false if the page
    *           has a legacy SkipTo.js
    */
    function getSkipToContentElement(type="pagescript") {

      removeLegacySkipToJS();

      const isExtensionLoaded   = document.querySelector(EXTENSION_ELEMENT_NAME);
      const isBookmarkletLoaded = document.querySelector(BOOKMARKLET_ELEMENT_NAME);
      const isPageLoaded        = document.querySelector(PAGE_SCRIPT_ELEMENT_NAME);

      let skipToContentElem = false;

      switch (type) {
        case 'bookmarklet':
          if (!isExtensionLoaded) {
            if (!isBookmarkletLoaded) {
              removePageSkipTo();
              window.customElements.define(BOOKMARKLET_ELEMENT_NAME, SkipToContent590);
              skipToContentElem = document.createElement(BOOKMARKLET_ELEMENT_NAME);
              skipToContentElem.setAttribute('version', skipToContentElem.version);
              skipToContentElem.setAttribute('type', type);
              // always attach SkipToContent element to body
              if (document.body) {
                document.body.insertBefore(skipToContentElem, document.body.firstElementChild);
              }
            }
          }
          break;

        case 'extension':
          if (!isExtensionLoaded) {
            removePageSkipTo();
            removeBookmarkletSkipTo();
            window.customElements.define(EXTENSION_ELEMENT_NAME, SkipToContent590);
            skipToContentElem = document.createElement(EXTENSION_ELEMENT_NAME);
            skipToContentElem.setAttribute('version', skipToContentElem.version);
            skipToContentElem.setAttribute('type', type);
            // always attach SkipToContent element to body
            if (document.body) {
              document.body.insertBefore(skipToContentElem, document.body.firstElementChild);
            }
          }
          break;

        default:
          if (!isPageLoaded && !isBookmarkletLoaded && !isExtensionLoaded) {
            window.customElements.define(PAGE_SCRIPT_ELEMENT_NAME, SkipToContent590);
            skipToContentElem = document.createElement(PAGE_SCRIPT_ELEMENT_NAME);
            skipToContentElem.setAttribute('version', skipToContentElem.version);
            skipToContentElem.setAttribute('type', type);
            // always attach SkipToContent element to body
            if (document.body) {
              document.body.insertBefore(skipToContentElem, document.body.firstElementChild);
            }
          }
          break;
      }
      return skipToContentElem;
    }

    // Check for SkipTo.js bookmarklet script, if it is initialize it immediately
    if (document.getElementById(SCRIPT_BOOKMARKLET_ID)) {
      debug.flag && debug.log(`[bookmarklet]`);
      const skipToContentBookmarkletElem = getSkipToContentElement('bookmarklet');
      if (skipToContentBookmarkletElem) {
        skipToContentBookmarkletElem.init();
        skipToContentBookmarkletElem.buttonSkipTo.openPopup();
        skipToContentBookmarkletElem.buttonSkipTo.setFocusToFirstMenuitem();
      }
    }
    else {
      // Check for SkipTo.js extension script, if it is initialize it immediately
      if (document.getElementById(SCRIPT_EXTENSION_ID)) {
        debug.flag && debug.log(`[extension]`);
        const skipToContentExtensionElem = getSkipToContentElement('extension');
        if (skipToContentExtensionElem) {
          skipToContentExtensionElem.init();
          window.addEventListener('load', function() {
            debug.flag && debug.log(`[onload][extension][elem]: ${skipToContentExtensionElem}`);
            removeLegacySkipToJS();
            removePageSkipTo();
          });
        }
      }
      else {
        // Initialize SkipTo.js menu button with onload event
        window.addEventListener('load', function() {
          debug.flag && debug.log(`[onload][script]`);
          const skipToContentPageElem = getSkipToContentElement();
          if (skipToContentPageElem) {
            skipToContentPageElem.supportShortcuts(false);
            debug.flag && debug.log(`[onload][script][elem]: ${skipToContentPageElem}`);
            const initInfo = window.SkipToConfig ? window.SkipToConfig : {};
            skipToContentPageElem.init(initInfo);
          }
        });
      }
    }
  })();

})();
