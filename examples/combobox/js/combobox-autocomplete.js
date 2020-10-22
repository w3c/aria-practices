/*
 *   This content is licensed according to the W3C Software License at
 *   https://www.w3.org/Consortium/Legal/2015/copyright-software-and-document
 */

'use strict';

var ComboboxAutocomplete = function (comboboxNode, buttonNode, listboxNode) {
  this.comboboxNode = comboboxNode;
  this.buttonNode = buttonNode;
  this.listboxNode = listboxNode;

  this.comboboxHasVisualFocus = false;
  this.listboxHasVisualFocus = false;

  this.hasHover = false;

  this.isNone = false;
  this.isList = false;
  this.isBoth = false;

  this.allOptions = [];

  this.option = null;
  this.firstOption = null;
  this.lastOption = null;

  this.filteredOptions = [];
  this.filter = '';
};

ComboboxAutocomplete.prototype.init = function () {
  var autocomplete = this.comboboxNode.getAttribute('aria-autocomplete');

  if (typeof autocomplete === 'string') {
    autocomplete = autocomplete.toLowerCase();
    this.isNone = autocomplete === 'none';
    this.isList = autocomplete === 'list';
    this.isBoth = autocomplete === 'both';
  } else {
    // default value of autocomplete
    this.isNone = true;
  }

  this.comboboxNode.addEventListener(
    'keydown',
    this.handleComboboxKeyDown.bind(this)
  );
  this.comboboxNode.addEventListener(
    'keyup',
    this.handleComboboxKeyUp.bind(this)
  );
  this.comboboxNode.addEventListener(
    'click',
    this.handleComboboxClick.bind(this)
  );
  this.comboboxNode.addEventListener(
    'focus',
    this.handleComboboxFocus.bind(this)
  );
  this.comboboxNode.addEventListener(
    'blur',
    this.handleComboboxBlur.bind(this)
  );

  // initialize pop up menu

  this.listboxNode.addEventListener(
    'mouseover',
    this.handleListboxMouseover.bind(this)
  );
  this.listboxNode.addEventListener(
    'mouseout',
    this.handleListboxMouseout.bind(this)
  );

  // Traverse the element children of domNode: configure each with
  // option role behavior and store reference in.options array.
  var nodes = this.listboxNode.getElementsByTagName('LI');

  for (var i = 0; i < nodes.length; i++) {
    var node = nodes[i];
    this.allOptions.push(node);

    node.addEventListener('click', this.handleOptionClick.bind(this));
    node.addEventListener('mouseover', this.handleOptionMouseover.bind(this));
    node.addEventListener('mouseout', this.handleOptionMouseout.bind(this));
  }

  this.filterOptions();

  // Open Button

  var button = this.comboboxNode.nextElementSibling;

  if (button && button.tagName === 'BUTTON') {
    button.addEventListener('click', this.handleButtonClick.bind(this));
  }
};

ComboboxAutocomplete.prototype.getLowercaseContent = function (node) {
  return node.textContent.toLowerCase();
};

ComboboxAutocomplete.prototype.setActiveDescendant = function (option) {
  if (option && this.listboxHasVisualFocus) {
    this.comboboxNode.setAttribute('aria-activedescendant', option.id);
  } else {
    this.comboboxNode.setAttribute('aria-activedescendant', '');
  }
};

ComboboxAutocomplete.prototype.setValue = function (value) {
  this.filter = value;
  this.comboboxNode.value = this.filter;
  this.comboboxNode.setSelectionRange(this.filter.length, this.filter.length);
  this.filterOptions();
};

ComboboxAutocomplete.prototype.setOption = function (option, flag) {
  if (typeof flag !== 'boolean') {
    flag = false;
  }

  if (option) {
    this.option = option;
    this.setCurrentOptionStyle(this.option);
    this.setActiveDescendant(this.option);

    if (this.isBoth) {
      this.comboboxNode.value = this.option.textContent;
      if (flag) {
        this.comboboxNode.setSelectionRange(
          this.option.textContent.length,
          this.option.textContent.length
        );
      } else {
        this.comboboxNode.setSelectionRange(
          this.filter.length,
          this.option.textContent.length
        );
      }
    }
  }
};

ComboboxAutocomplete.prototype.setVisualFocusCombobox = function () {
  this.listboxNode.classList.remove('focus');
  this.comboboxNode.parentNode.classList.add('focus'); // set the focus class to the parent for easier styling
  this.comboboxHasVisualFocus = true;
  this.listboxHasVisualFocus = false;
  this.setActiveDescendant(false);
};

ComboboxAutocomplete.prototype.setVisualFocusListbox = function () {
  this.comboboxNode.parentNode.classList.remove('focus');
  this.comboboxHasVisualFocus = false;
  this.listboxHasVisualFocus = true;
  this.listboxNode.classList.add('focus');
  this.setActiveDescendant(this.option);
};

ComboboxAutocomplete.prototype.removeVisualFocusAll = function () {
  this.comboboxNode.parentNode.classList.remove('focus');
  this.comboboxHasVisualFocus = false;
  this.listboxHasVisualFocus = false;
  this.listboxNode.classList.remove('focus');
  this.option = null;
  this.setActiveDescendant(false);
};

// ComboboxAutocomplete Events

ComboboxAutocomplete.prototype.filterOptions = function () {
  // do not filter any options if autocomplete is none
  if (this.isNone) {
    this.filter = '';
  }

  var option = null;
  var currentOption = this.option;
  var filter = this.filter.toLowerCase();

  this.filteredOptions = [];
  this.listboxNode.innerHTML = '';

  for (var i = 0; i < this.allOptions.length; i++) {
    option = this.allOptions[i];
    if (
      filter.length === 0 ||
      this.getLowercaseContent(option).indexOf(filter) === 0
    ) {
      this.filteredOptions.push(option);
      this.listboxNode.appendChild(option);
    }
  }

  // Use populated options array to initialize firstOption and lastOption.
  var numItems = this.filteredOptions.length;
  if (numItems > 0) {
    this.firstOption = this.filteredOptions[0];
    this.lastOption = this.filteredOptions[numItems - 1];

    if (currentOption && this.filteredOptions.indexOf(currentOption) >= 0) {
      option = currentOption;
    } else {
      option = this.firstOption;
    }
  } else {
    this.firstOption = null;
    option = null;
    this.lastOption = null;
  }

  return option;
};

ComboboxAutocomplete.prototype.setCurrentOptionStyle = function (option) {
  for (var i = 0; i < this.filteredOptions.length; i++) {
    var opt = this.filteredOptions[i];
    if (opt === option) {
      opt.setAttribute('aria-selected', 'true');
      if (
        this.listboxNode.scrollTop + this.listboxNode.offsetHeight <
        opt.offsetTop + opt.offsetHeight
      ) {
        this.listboxNode.scrollTop =
          opt.offsetTop + opt.offsetHeight - this.listboxNode.offsetHeight;
      } else if (this.listboxNode.scrollTop > opt.offsetTop + 2) {
        this.listboxNode.scrollTop = opt.offsetTop;
      }
    } else {
      opt.removeAttribute('aria-selected');
    }
  }
};

ComboboxAutocomplete.prototype.getPreviousOption = function (currentOption) {
  if (currentOption !== this.firstOption) {
    var index = this.filteredOptions.indexOf(currentOption);
    return this.filteredOptions[index - 1];
  }
  return this.lastOption;
};

ComboboxAutocomplete.prototype.getNextOption = function (currentOption) {
  if (currentOption !== this.lastOption) {
    var index = this.filteredOptions.indexOf(currentOption);
    return this.filteredOptions[index + 1];
  }
  return this.firstOption;
};

/* MENU DISPLAY METHODS */

ComboboxAutocomplete.prototype.doesOptionHaveFocus = function () {
  return this.combobocNode.getAttribute('aria-activedescendant') !== '';
};

ComboboxAutocomplete.prototype.isOpen = function () {
  return this.listboxNode.style.display === 'block';
};

ComboboxAutocomplete.prototype.isClosed = function () {
  return this.listboxNode.style.display !== 'block';
};

ComboboxAutocomplete.prototype.hasOptions = function () {
  return this.filteredOptions.length;
};

ComboboxAutocomplete.prototype.open = function () {
  this.listboxNode.style.display = 'block';
  this.comboboxNode.setAttribute('aria-expanded', 'true');
  this.buttonNode.setAttribute('aria-expanded', 'true');
};

ComboboxAutocomplete.prototype.close = function (force) {
  if (typeof force !== 'boolean') {
    force = false;
  }

  if (
    force ||
    (!this.comboboxHasVisualFocus &&
      !this.listboxHasVisualFocus &&
      !this.hasHover)
  ) {
    this.setCurrentOptionStyle(false);
    this.listboxNode.style.display = 'none';
    this.comboboxNode.setAttribute('aria-expanded', 'false');
    this.buttonNode.setAttribute('aria-expanded', 'false');
    this.setActiveDescendant(false);
  }
};

/* combobox Events */

ComboboxAutocomplete.prototype.handleComboboxKeyDown = function (event) {
  var flag = false,
    char = event.key,
    altKey = event.altKey;

  if (event.ctrlKey || event.shiftKey) {
    return;
  }

  switch (event.key) {
    case 'Enter':
      if (this.listboxHasVisualFocus) {
        this.setValue(this.option.textContent);
      }
      this.close(true);
      this.setVisualFocusCombobox();
      flag = true;
      break;

    case 'Down':
    case 'ArrowDown':
      if (this.filteredOptions.length > 0) {
        if (altKey) {
          this.open();
        } else {
          this.open();
          if (
            this.listboxHasVisualFocus ||
            (this.isBoth && this.filteredOptions.length > 1)
          ) {
            this.setOption(this.getNextOption(this.option), true);
            this.setVisualFocusListbox();
          } else {
            this.setOption(this.firstOption, true);
            this.setVisualFocusListbox();
          }
        }
      }
      flag = true;
      break;

    case 'Up':
    case 'ArrowUp':
      if (this.hasOptions()) {
        if (this.listboxHasVisualFocus) {
          this.setOption(this.getPreviousOption(this.option), true);
        } else {
          this.open();
          if (!altKey) {
            this.setOption(this.lastOption, true);
            this.setVisualFocusListbox();
          }
        }
      }
      flag = true;
      break;

    case 'Esc':
    case 'Escape':
      if (this.isOpen()) {
        this.close(true);
        this.filter = this.comboboxNode.value;
        this.filterOptions();
        this.setVisualFocusCombobox();
      } else {
        this.setValue('');
        this.comboboxNode.value = '';
      }
      this.option = null;
      flag = true;
      break;

    case 'Tab':
      this.close(true);
      if (this.listboxHasVisualFocus) {
        if (this.option) {
          this.setValue(this.option.textContent);
        }
      }
      break;

    case 'Home':
      this.comboboxNode.setSelectionRange(0, 0);
      flag = true;
      break;

    case 'End':
      var length = this.comboboxNode.value.length;
      this.comboboxNode.setSelectionRange(length, length);
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

ComboboxAutocomplete.prototype.isPrintableCharacter = function (str) {
  return str.length === 1 && str.match(/\S/);
};

ComboboxAutocomplete.prototype.handleComboboxKeyUp = function (event) {
  var flag = false,
    option = null,
    char = event.key;

  if (this.isPrintableCharacter(char)) {
    this.filter += char;
  }

  // this is for the case when a selection in the textbox has been deleted
  if (this.comboboxNode.value.length < this.filter.length) {
    this.filter = this.comboboxNode.value;
    this.option = null;
    this.filterOptions();
  }

  if (event.key === 'Escape' || event.key === 'Esc') {
    return;
  }

  switch (event.key) {
    case 'Backspace':
      this.setVisualFocusCombobox();
      this.setCurrentOptionStyle(false);
      this.filter = this.comboboxNode.value;
      this.option = null;
      this.filterOptions();
      flag = true;
      break;

    case 'Left':
    case 'ArrowLeft':
    case 'Right':
    case 'ArrowRight':
    case 'Home':
    case 'End':
      if (this.isBoth) {
        this.filter = this.comboboxNode.value;
      } else {
        this.option = null;
        this.setCurrentOptionStyle(false);
      }
      this.setVisualFocusCombobox();
      flag = true;
      break;

    default:
      if (this.isPrintableCharacter(char)) {
        this.setVisualFocusCombobox();
        this.setCurrentOptionStyle(false);
        flag = true;

        if (this.isList || this.isBoth) {
          option = this.filterOptions();
          if (option) {
            if (this.isClosed() && this.comboboxNode.value.length) {
              this.open();
            }

            if (
              this.getLowercaseContent(option).indexOf(
                this.comboboxNode.value.toLowerCase()
              ) === 0
            ) {
              this.option = option;
              if (this.isBoth || this.listboxHasVisualFocus) {
                this.setCurrentOptionStyle(option);
                if (this.isBoth) {
                  this.setOption(option);
                }
              }
            } else {
              this.option = null;
              this.setCurrentOptionStyle(false);
            }
          } else {
            this.close();
            this.option = null;
            this.setActiveDescendant(false);
          }
        } else if (this.comboboxNode.value.length) {
          this.open();
        }
      }

      break;
  }

  if (flag) {
    event.stopPropagation();
    event.preventDefault();
  }
};

ComboboxAutocomplete.prototype.handleComboboxClick = function (event) {
  if (this.isOpen()) {
    this.close(true);
  } else {
    this.open();
  }
};

ComboboxAutocomplete.prototype.handleComboboxFocus = function (event) {
  this.filter = this.comboboxNode.value;
  this.filterOptions();
  this.setVisualFocusCombobox();
  this.option = null;
  this.setCurrentOptionStyle(null);
};

ComboboxAutocomplete.prototype.handleComboboxBlur = function (event) {
  this.comboboxHasVisualFocus = false;
  this.setCurrentOptionStyle(null);
  this.removeVisualFocusAll();
  setTimeout(this.close.bind(this, false), 300);
};

ComboboxAutocomplete.prototype.handleButtonClick = function (event) {
  if (this.isOpen()) {
    this.close(true);
  } else {
    this.open();
  }
  this.comboboxNode.focus();
  this.setVisualFocusCombobox();
};

/* Listbox Events */

ComboboxAutocomplete.prototype.handleListboxMouseover = function (event) {
  this.hasHover = true;
};

ComboboxAutocomplete.prototype.handleListboxMouseout = function (event) {
  this.hasHover = false;
  setTimeout(this.close.bind(this, false), 300);
};

// Listbox Option Events

ComboboxAutocomplete.prototype.handleOptionClick = function (event) {
  this.comboboxNode.value = event.target.textContent;
  this.close(true);
};

ComboboxAutocomplete.prototype.handleOptionMouseover = function (event) {
  this.hasHover = true;
  this.open();
};

ComboboxAutocomplete.prototype.handleOptionMouseout = function (event) {
  this.hasHover = false;
  setTimeout(this.close.bind(this, false), 300);
};

// Initialize comboboxes

window.addEventListener('load', function () {
  var comboboxes = document.querySelectorAll('.combobox-list');

  for (var i = 0; i < comboboxes.length; i++) {
    var combobox = comboboxes[i];
    var comboboxNode = combobox.querySelector('input');
    var buttonNode = combobox.querySelector('button');
    var listboxNode = combobox.querySelector('[role="listbox"]');
    var cba = new ComboboxAutocomplete(comboboxNode, buttonNode, listboxNode);
    cba.init();
  }
});
