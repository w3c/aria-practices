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
  shouldAutoSelect
) {
  this.combobox = comboboxNode;
  this.input = input;
  this.listbox = listbox;
  this.searchFn = searchFn;
  this.shouldAutoSelect = shouldAutoSelect;
  this.activeIndex = -1;
  this.resultsCount = 0;

  this.setupEvents();
};

aria.ListboxCombobox.prototype.setupEvents = function() {
  this.input.addEventListener('keyup', this.checkKey.bind(this));
  this.input.addEventListener('keydown', this.setActiveItem.bind(this));
  this.input.addEventListener('blur', this.hideListbox.bind(this));
  this.listbox.addEventListener('click', this.clickItem.bind(this));
};

aria.ListboxCombobox.prototype.checkKey = function(evt) {
  var key = evt.which || evt.keyCode;

  switch (key) {
    case aria.KeyCode.UP:
    case aria.KeyCode.DOWN:
    case aria.KeyCode.ESC:
    case aria.KeyCode.RETURN:
      evt.preventDefault();
      return;
    default:
      this.updateResults(evt);
  }
};

aria.ListboxCombobox.prototype.updateResults = function() {
  var searchString = this.input.value;
  var results = this.searchFn(searchString);

  this.listbox.innerHTML = null;
  this.activeIndex = -1;
  this.input.setAttribute(
    'aria-activedescendant',
    ''
  );

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
  } else {
    aria.Utils.addClass(this.listbox, 'hidden');
    this.combobox.setAttribute('aria-expanded', 'false');
    this.resultsCount = 0;
  }
};

aria.ListboxCombobox.prototype.setActiveItem = function(evt) {
  var key = evt.which || evt.keyCode;
  var activeIndex = this.activeIndex;

  if (key === aria.KeyCode.ESC) {
    this.hideListbox();
    this.input.value = '';
    return;
  }

  if (this.resultsCount < 1) {
    return;
  }

  var prevActive = this.getItemAt(activeIndex);
  var activeItem;

  switch (key) {
    case aria.KeyCode.UP:
      if (activeIndex <= 0) {
        activeIndex = this.resultsCount - 1;
      } else {
        activeIndex--;
      }
      break;
    case aria.KeyCode.DOWN:
      if (activeIndex === -1 || activeIndex >= this.resultsCount - 1) {
        activeIndex = 0;
      } else {
        activeIndex++;
      }
      break;
    case aria.KeyCode.RETURN:
      activeItem = this.getItemAt(activeIndex);
      this.selectItem(activeItem);
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
  } else {
    this.input.setAttribute(
      'aria-activedescendant',
      ''
    );
  }
};

aria.ListboxCombobox.prototype.getItemAt = function(index) {
  return document.getElementById('result-item-' + index);
};

aria.ListboxCombobox.prototype.clickItem = function(evt) {
  if (evt.target && evt.target.nodeName == 'LI') {
    console.log('selected item', evt.target)
    this.selectItem(evt.target);
  }
};

aria.ListboxCombobox.prototype.selectItem = function(item) {
  if (item) {
    this.input.value = item.innerText;
    this.listbox.innerHTML = null;
    this.activeIndex = -1;
    aria.Utils.addClass(this.listbox, 'hidden');
    this.combobox.setAttribute('aria-expanded', 'false');
    this.resultsCount = 0;
  }
};

aria.ListboxCombobox.prototype.hideListbox = function() {
  this.activeIndex = -1;
  this.listbox.innerHTML = null;
  aria.Utils.addClass(this.listbox, 'hidden');
  this.combobox.setAttribute('aria-expanded', 'false');
  this.resultsCount = 0;
  this.input.setAttribute(
    'aria-activedescendant',
    ''
  );
};
