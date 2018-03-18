/*
*   This content is licensed according to the W3C Software License at
*   https://www.w3.org/Consortium/Legal/2015/copyright-software-and-document
*/
/**
 * @constructor
 *
 * @desc
 *  Combobox object representing the state and interactions for a combobox
 *  widget
 *
 * @param comboboxNode
 *  The DOM node pointing to the combobox
 * @param input
 *  The input node
 * @param listbox
 *  The listbox node to load results in
 * @param searchFn
 *  The search function. The function accepts a search string and returns an
 *  array of results.
 */
aria.ListboxCombobox = function (
  comboboxNode,
  input,
  listbox,
  searchFn,
  shouldAutoSelect,
  onShow,
  onHide
) {
  this.combobox = comboboxNode;
  this.input = input;
  this.listbox = listbox;
  this.searchFn = searchFn;
  this.shouldAutoSelect = shouldAutoSelect;
  this.onShow = onShow || function () {};
  this.onHide = onHide || function () {};
  this.activeIndex = -1;
  this.resultsCount = 0;
  this.shown = false;
  this.hasInlineAutocomplete =
    input.getAttribute('aria-autocomplete') === 'both';

  this.setupEvents();
};

aria.ListboxCombobox.prototype.setupEvents = function () {
  document.body.addEventListener('click', this.checkHide.bind(this));
  this.input.addEventListener('keyup', this.checkKey.bind(this));
  this.input.addEventListener('keydown', this.setActiveItem.bind(this));
  this.input.addEventListener('focus', this.checkShow.bind(this));
  this.input.addEventListener('blur', this.checkSelection.bind(this));
  this.listbox.addEventListener('click', this.clickItem.bind(this));
};

aria.ListboxCombobox.prototype.checkKey = function (evt) {
  var key = evt.which || evt.keyCode;

  switch (key) {
    case aria.KeyCode.UP:
    case aria.KeyCode.DOWN:
    case aria.KeyCode.ESC:
    case aria.KeyCode.RETURN:
      evt.preventDefault();
      return;
    default:
      this.updateResults(false);
  }

  if (this.hasInlineAutocomplete) {
    switch (key) {
      case aria.KeyCode.BACKSPACE:
        return;
      default:
        this.autocompleteItem();
    }
  }
};

aria.ListboxCombobox.prototype.updateResults = function (shouldShowAll) {
  var searchString = this.input.value;
  var results = this.searchFn(searchString);

  this.hideListbox();

  if (!shouldShowAll && !searchString) {
    results = [];
  }

  if (results.length) {
    for (var i = 0; i < results.length; i++) {
      var resultItem = document.createElement('li');
      resultItem.className = 'result';
      resultItem.setAttribute('role', 'option');
      resultItem.setAttribute('id', 'result-item-' + i);
      resultItem.innerText = results[i];
      if (this.shouldAutoSelect && i === 0) {
        resultItem.setAttribute('aria-selected', 'true');
        aria.Utils.addClass(resultItem, 'focused');
        this.activeIndex = 0;
      }
      this.listbox.appendChild(resultItem);
    }
    aria.Utils.removeClass(this.listbox, 'hidden');
    this.combobox.setAttribute('aria-expanded', 'true');
    this.resultsCount = results.length;
    this.shown = true;
    this.onShow();
  }
};

aria.ListboxCombobox.prototype.setActiveItem = function (evt) {
  var key = evt.which || evt.keyCode;
  var activeIndex = this.activeIndex;

  if (key === aria.KeyCode.ESC) {
    this.hideListbox();
    setTimeout((function () {
      // On Firefox, input does not get cleared here unless wrapped in
      // a setTimeout
      this.input.value = '';
    }).bind(this), 1);
    return;
  }

  if (this.resultsCount < 1) {
    if (this.hasInlineAutocomplete && (key === aria.KeyCode.DOWN || key === aria.KeyCode.UP)) {
      this.updateResults(true);
    }
    else {
      return;
    }
  }

  var prevActive = this.getItemAt(activeIndex);
  var activeItem;

  switch (key) {
    case aria.KeyCode.UP:
      if (activeIndex <= 0) {
        activeIndex = this.resultsCount - 1;
      }
      else {
        activeIndex--;
      }
      break;
    case aria.KeyCode.DOWN:
      if (activeIndex === -1 || activeIndex >= this.resultsCount - 1) {
        activeIndex = 0;
      }
      else {
        activeIndex++;
      }
      break;
    case aria.KeyCode.RETURN:
      activeItem = this.getItemAt(activeIndex);
      this.selectItem(activeItem);
      return;
    case aria.KeyCode.TAB:
      this.checkSelection();
      this.hideListbox();
      return;
    default:
      return;
  }

  evt.preventDefault();

  activeItem = this.getItemAt(activeIndex);
  this.activeIndex = activeIndex;

  if (prevActive) {
    aria.Utils.removeClass(prevActive, 'focused');
    prevActive.setAttribute('aria-selected', 'false');
  }

  if (activeItem) {
    this.input.setAttribute(
      'aria-activedescendant',
      'result-item-' + activeIndex
    );
    aria.Utils.addClass(activeItem, 'focused');
    activeItem.setAttribute('aria-selected', 'true');
    if (this.hasInlineAutocomplete) {
      this.input.value = activeItem.innerText;
    }
  }
  else {
    this.input.setAttribute(
      'aria-activedescendant',
      ''
    );
  }
};

aria.ListboxCombobox.prototype.getItemAt = function (index) {
  return document.getElementById('result-item-' + index);
};

aria.ListboxCombobox.prototype.clickItem = function (evt) {
  if (evt.target && evt.target.nodeName == 'LI') {
    this.selectItem(evt.target);
  }
};

aria.ListboxCombobox.prototype.selectItem = function (item) {
  if (item) {
    this.input.value = item.innerText;
    this.hideListbox();
  }
};

aria.ListboxCombobox.prototype.checkShow = function (evt) {
  this.updateResults(false);
};

aria.ListboxCombobox.prototype.checkHide = function (evt) {
  if (evt.target === this.input || this.combobox.contains(evt.target)) {
    return;
  }
  this.hideListbox();
};

aria.ListboxCombobox.prototype.hideListbox = function () {
  this.shown = false;
  this.activeIndex = -1;
  this.listbox.innerHTML = '';
  aria.Utils.addClass(this.listbox, 'hidden');
  this.combobox.setAttribute('aria-expanded', 'false');
  this.resultsCount = 0;
  this.input.setAttribute(
    'aria-activedescendant',
    ''
  );
  this.onHide();
};

aria.ListboxCombobox.prototype.checkSelection = function () {
  if (this.activeIndex < 0) {
    return;
  }
  var activeItem = this.getItemAt(this.activeIndex);
  this.selectItem(activeItem);
};

aria.ListboxCombobox.prototype.autocompleteItem = function () {
  var autocompletedItem = this.listbox.querySelector('.focused');
  var inputText = this.input.value;

  if (!autocompletedItem || !inputText) {
    return;
  }

  var autocomplete = autocompletedItem.innerText;
  if (inputText !== autocomplete) {
    this.input.value = autocomplete;
    this.input.setSelectionRange(inputText.length, autocomplete.length);
  }
};
