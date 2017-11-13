/*
*   This content is licensed according to the W3C Software License at
*   https://www.w3.org/Consortium/Legal/2015/copyright-software-and-document
*/
var ComboboxList = function (domNode) {

  this.domNode  = domNode;
  this.listbox  = false;
  this.option   = false;

  this.hasFocus = false;
  this.hasHover = false;
  this.filter   = '';
  this.isNone = false;
  this.isList = false;
  this.isBoth = false;

  this.keyCode = Object.freeze({
    'BACKSPACE': 8,
    'TAB': 9,
    'RETURN': 13,
    'ESC': 27,
    'SPACE': 32,
    'PAGEUP': 33,
    'PAGEDOWN': 34,
    'END': 35,
    'HOME': 36,
    'LEFT': 37,
    'UP': 38,
    'RIGHT': 39,
    'DOWN': 40
  });
};

ComboboxList.prototype.init = function () {

  this.domNode.setAttribute('aria-haspopup', 'true');

  var autocomplete = this.domNode.getAttribute('aria-autocomplete');

  if (typeof autocomplete === 'string') {
    autocomplete = autocomplete.toLowerCase();
    this.isNone  = autocomplete === 'none';
    this.isList  = autocomplete === 'list';
    this.isBoth  = autocomplete === 'both';
  }
  else {
    // default value of autocomplete
    this.isNone = true;
  }

  this.domNode.addEventListener('keydown', this.handleKeydown.bind(this));
  this.domNode.addEventListener('keyup',   this.handleKeyup.bind(this));
  this.domNode.addEventListener('click',   this.handleClick.bind(this));
  this.domNode.addEventListener('focus',   this.handleFocus.bind(this));
  this.domNode.addEventListener('blur',    this.handleBlur.bind(this));

  // initialize pop up menus

  var listbox = document.getElementById(this.domNode.getAttribute('aria-owns'));

  if (listbox) {
    this.listbox = new Listbox(listbox, this);
    this.listbox.init();
  }

  // Open Button

  var button = this.domNode.nextElementSibling;

  if (button && button.tagName === 'BUTTON') {
    button.addEventListener('click',   this.handleButtonClick.bind(this));
  }

};

ComboboxList.prototype.setActiveDescendant = function (value) {
  this.domNode.setAttribute('aria-activedescendant', value);
};

ComboboxList.prototype.setValue = function (value) {
  this.filter = value;
  this.domNode.value = this.filter;
  this.domNode.setSelectionRange(this.filter.length,this.filter.length);
  if (this.isList || this.isBoth) {
    this.listbox.filterOptions(this.filter, this.option);
  }
};

ComboboxList.prototype.setOption = function (option, flag) {
  if (typeof flag !== 'boolean') {
    flag = false;
  }

  if (option) {
    this.option = option;
    this.listbox.setCurrentOptionStyle(this.option);
    this.setActiveDescendant(option.domNode.id);

    if (this.isBoth) {
      this.domNode.value = this.option.textContent;
      if (flag) {
        this.domNode.setSelectionRange(this.option.textContent.length,this.option.textContent.length);
      }
      else {
        this.domNode.setSelectionRange(this.filter.length,this.option.textContent.length);
      }
    }
  }
};

ComboboxList.prototype.setVisualFocusTextbox = function () {
  this.listbox.domNode.classList.remove('focus');
  this.listbox.hasFocus = false;
  this.domNode.classList.add('focus');
  this.hasFocus = true;
};

ComboboxList.prototype.setVisualFocusListbox = function () {
  this.domNode.classList.remove('focus');
  this.hasFocus = false;
  this.listbox.domNode.classList.add('focus');
  this.listbox.hasFocus = true;
};

ComboboxList.prototype.removeVisualFocusAll = function () {
  this.domNode.classList.remove('focus');
  this.hasFocus = false;
  this.listbox.domNode.classList.remove('focus');
  this.listbox.hasFocus = true;
  this.option = false;
};

/* Event Handlers */

ComboboxList.prototype.handleKeydown = function (event) {
  var tgt = event.currentTarget,
    flag = false,
    char = event.key,
    shiftKey = event.shiftKey,
    ctrlKey  = event.ctrlKey,
    altKey   = event.altKey;

  switch (event.keyCode) {

    case this.keyCode.RETURN:
      if (this.option) {
        this.setValue(this.option.textContent);
        this.listbox.close(true);
      }
      flag = true;
      break;

    case this.keyCode.DOWN:

      if (this.listbox.hasOptions()) {
        if (this.listbox.isOpen()) {
          this.setOption(this.listbox.getNextItem(this.option), true);
        }
        else {
          this.listbox.open();
          if (!altKey) {
            this.setOption(this.listbox.getFirstItem(), true);
          }
        }
        this.setVisualFocusListbox();
      }
      flag = true;
      break;

    case this.keyCode.UP:
      if (this.listbox.hasOptions()) {
        if (this.listbox.isOpen()) {
          this.setOption(this.listbox.getPreviousItem(this.option), true);
        }
        else {
          this.listbox.open();
          if (!altKey) {
            this.setOption(this.listbox.getLastItem(), true);
          }
        }
        this.setVisualFocusListbox();
      }
      flag = true;
      break;

    case this.keyCode.HOME:
    case this.keyCode.PAGEUP:
      if (this.listbox.hasOptions()) {
        if (this.listbox.isOpen()) {
          this.setOption(this.listbox.getFirstItem(), true);
          this.setVisualFocusListbox();
        }
      }
      flag = true;
      break;

    case this.keyCode.END:
    case this.keyCode.PAGEDOWN:
      if (this.listbox.hasOptions()) {
        if (this.listbox.isOpen()) {
          this.setOption(this.listbox.getLastItem(), true);
          this.setVisualFocusListbox();
        }
      }
      flag = true;
      break;

    case this.keyCode.ESC:
      if (this.listbox.isOpen()) {
        this.listbox.close(true);
      }
      this.setVisualFocusTextbox();
      this.setValue('');
      flag = true;
      break;

    case this.keyCode.TAB:
      if (this.listbox.isOpen()) {
        this.listbox.close(true);
      }

      if (this.isBoth && this.option) {
        this.setValue(this.option.textContent);
      }
      break;

    default:
      break;
  }

  if (flag) {
    event.stopPropagation();
    event.preventDefault();
  }

};

ComboboxList.prototype.handleKeyup = function (event) {
  var tgt = event.currentTarget,
    flag = false,
    option = false,
    char = event.key;

  function isPrintableCharacter (str) {
    return str.length === 1 && str.match(/\S/);
  }

  if (isPrintableCharacter(char)) {
    this.filter += char;
  }

  if (this.domNode.value.length < this.filter.length) {
    this.filter = this.domNode.value;
  }

  if (this.isList || this.isBoth) {
    option = this.listbox.filterOptions(this.filter, this.option);
    if (option) {
      this.listbox.open();
      this.option = option;
      this.setActiveDescendant(option.domNode.id);
    }
    else {
      this.listbox.close();
      this.option = false;
      this.setActiveDescendant('');
    }
    this.listbox.setCurrentOptionStyle(option);
  }
  else {
    if (this.domNode.value.length) {
      this.listbox.open();
    }
  }

  switch (event.keyCode) {

    case this.keyCode.BACKSPACE:
      this.setValue(this.domNode.value);
      this.option = false;
      this.setActiveDescendant('');
      this.setVisualFocusTextbox();
      flag = true;
      break;

    case this.keyCode.LEFT:
    case this.keyCode.RIGHT:
      if (this.isBoth) {
        this.filter = this.domNode.value;
      }
      this.option = false;
      this.setActiveDescendant('');
      this.setVisualFocusTextbox();
      flag = true;
      break;

    default:
      if (isPrintableCharacter(char)) {
        if (option) {
          this.setOption(option, false);
        }
        else {
          this.setValue(this.filter);
        }
        flag = true;
        this.setVisualFocusTextbox();
      }
      break;
  }

  if (flag) {
    event.stopPropagation();
    event.preventDefault();
  }

};

ComboboxList.prototype.handleClick = function (event) {
  if (this.listbox.isOpen()) {
    this.listbox.close(true);
  }
  else {
    this.listbox.open();
  }
};

ComboboxList.prototype.handleFocus = function (event) {
  this.setVisualFocusTextbox();
  this.listbox.setCurrentOptionStyle(null);
};

ComboboxList.prototype.handleBlur = function (event) {
  this.listbox.hasFocus = false;
  this.listbox.setCurrentOptionStyle(null);
  this.removeVisualFocusAll();
  setTimeout(this.listbox.close.bind(this.listbox, false), 300);

};

ComboboxList.prototype.handleButtonClick = function (event) {
  if (this.listbox.isOpen()) {
    this.listbox.close(true);
  }
  else {
    this.listbox.open();
  }
  this.domNode.focus();
  this.setVisualFocusTextbox();
};


// Initialize comboboxes

window.addEventListener('load', function () {

  var comboboxes = document.querySelectorAll('.combobox-list [role="combobox"]');

  for (var i = 0; i < comboboxes.length; i++) {
    var combobox = new ComboboxList(comboboxes[i]);
    combobox.init();
  }

});
