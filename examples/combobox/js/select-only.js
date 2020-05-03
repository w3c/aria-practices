const MenuActions = {
  Close: 0,
  CloseSelect: 1,
  First: 2,
  Last: 3,
  Next: 4,
  Open: 5,
  Previous: 6,
  Select: 7,
  Space: 8,
  Type: 9
}

/*
 * Helper functions
 */

// filter an array of options against an input string
// returns an array of options that begin with the filter string, case-independent
function filterOptions(options = [], filter, exclude = []) {
  return options.filter((option) => {
    const matches = option.toLowerCase().indexOf(filter.toLowerCase()) === 0;
    return matches && exclude.indexOf(option) < 0;
  });
}

// return a combobox action from a key press
function getActionFromKey(event, menuOpen) {
  const { key, altKey, ctrlKey, metaKey } = event;
  // handle opening when closed
  if (!menuOpen && (key === 'ArrowDown' || key === 'Enter' || key === ' ')) {
    return MenuActions.Open;
  }

  // handle keys when open
  if (key === 'ArrowDown') {
    return MenuActions.Next;
  }
  else if (key === 'ArrowUp') {
    return MenuActions.Previous;
  }
  else if (key === 'Home') {
    return MenuActions.First;
  }
  else if (key === 'End') {
    return MenuActions.Last;
  }
  else if (key === 'Escape') {
    return MenuActions.Close;
  }
  else if (key === 'Enter') {
    return MenuActions.CloseSelect;
  }
  else if (key === ' ') {
    return MenuActions.Space;
  }
  else if (key === 'Backspace' || key === 'Clear' || (key.length === 1 && !altKey && !ctrlKey && !metaKey)) {
    return MenuActions.Type;
  }
}
  
// get index of option that matches a string
// if the filter is multiple iterations of the same letter (e.g "aaa"),
// then return the nth match of the single letter
function getIndexByLetter(options, filter) {
  const firstMatch = filterOptions(options, filter)[0];
  const allSameLetter = (array) => array.every((letter) => letter === array[0]);
  
  if (firstMatch) {
    return options.indexOf(firstMatch);
  }
  else if (allSameLetter(filter.split(''))) {
    const matches = filterOptions(options, filter[0]);
    const matchIndex = (filter.length - 1) % matches.length;
    return options.indexOf(matches[matchIndex]);
  }
  else {
    return -1;
  }
}
  
// get updated option index
function getUpdatedIndex(current, max, action) {
  switch(action) {
    case MenuActions.First:
      return 0;
    case MenuActions.Last:
      return max;
    case MenuActions.Previous:
      return Math.max(0, current - 1);
    case MenuActions.Next:
      return Math.min(max, current + 1);
    default:
      return current;
  }
}
  
// check if an element is currently scrollable
function isScrollable(element) {
  return element && element.clientHeight < element.scrollHeight;
}

// ensure given child element is within the parent's visible scroll area
function maintainScrollVisibility(activeElement, scrollParent) {
  const { offsetHeight, offsetTop } = activeElement;
  const { offsetHeight: parentOffsetHeight, scrollTop } = scrollParent;

  const isAbove = offsetTop < scrollTop;
  const isBelow = (offsetTop + offsetHeight) > (scrollTop + parentOffsetHeight);

  if (isAbove) {
    scrollParent.scrollTo(0, offsetTop);
  }
  else if (isBelow) {
    scrollParent.scrollTo(0, offsetTop - parentOffsetHeight + offsetHeight);
  }
}

/*
 * Select Component
 */
const Select = function(el, options = []) {
  // element refs
  this.el = el;
  this.comboEl = el.querySelector('[role=combobox]');
  this.valueEl = this.comboEl.querySelector('span');
  this.listboxEl = el.querySelector('[role=listbox]');

  // data
  this.idBase = this.comboEl.id;
  this.options = options;

  // state
  this.activeIndex = 0;
  this.open = false;
  this.searchString = '';
  this.searchTimeout = null;
}

Select.prototype.init = function() {
  this.valueEl.innerHTML = this.options[0];

  this.comboEl.addEventListener('blur', this.onComboBlur.bind(this));
  this.comboEl.addEventListener('click', () => this.updateMenuState(true));
  this.comboEl.addEventListener('keydown', this.onComboKeyDown.bind(this));

  this.options.map((option, index) => {
    const optionEl = document.createElement('div');
    optionEl.setAttribute('role', 'option');
    optionEl.id = `${this.idBase}-${index}`;
    optionEl.className = index === 0 ? 'combo-option option-current' : 'combo-option';
    optionEl.setAttribute('aria-selected', `${index === 0}`);
    optionEl.innerText = option;

    optionEl.addEventListener('click', (event) => {
      event.stopPropagation();
      this.onOptionClick(index);
    });
    optionEl.addEventListener('mousedown', this.onOptionMouseDown.bind(this));

    this.listboxEl.appendChild(optionEl);
  });
}

Select.prototype.getSearchString = function(char) {
  if (typeof this.searchTimeout === 'number') {
    window.clearTimeout(this.searchTimeout);
  }
  
  this.searchTimeout = window.setTimeout(() => {
    this.searchString = '';
  }, 1000);
  
  this.searchString += char;
  return this.searchString;
}

Select.prototype.onComboKeyDown = function(event) {
  const { key } = event;
  const max = this.options.length - 1;

  const action = getActionFromKey(event, this.open);

  switch(action) {
      case MenuActions.Next:
      case MenuActions.Last:
      case MenuActions.First:
      case MenuActions.Previous:
        event.preventDefault();
        return this.onOptionChange(getUpdatedIndex(this.activeIndex, max, action));
      case MenuActions.CloseSelect:
      case MenuActions.Space:
        event.preventDefault();
        this.selectOption(this.activeIndex);
        // intentional fallthrough
      case MenuActions.Close:
        event.preventDefault();
        return this.updateMenuState(false);
      case MenuActions.Type:
        this.updateMenuState(true);
        var searchString = this.getSearchString(key);
        return this.onOptionChange(Math.max(0, getIndexByLetter(this.options, searchString)));
      case MenuActions.Open:
        event.preventDefault();
        return this.updateMenuState(true);
    }
}

Select.prototype.onComboBlur = function() {
  if (this.ignoreBlur) {
    this.ignoreBlur = false;
    return;
  }

  if (this.open) {
    this.selectOption(this.activeIndex);
    this.updateMenuState(false, false);
  }
}

Select.prototype.onOptionChange = function(index) {
  this.activeIndex = index;
  this.comboEl.setAttribute('aria-activedescendant', `${this.idBase}-${index}`);

  // update active style
  const options = this.el.querySelectorAll('[role=option]');
  [...options].forEach((optionEl) => {
    optionEl.classList.remove('option-current');
  });
  options[index].classList.add('option-current');

  if (isScrollable(this.listboxEl)) {
    maintainScrollVisibility(options[index], this.listboxEl);
  }
}

Select.prototype.onOptionClick = function(index) {
  this.onOptionChange(index);
  this.selectOption(index);
  this.updateMenuState(false);
}

Select.prototype.onOptionMouseDown = function() {
  this.ignoreBlur = true;
}

Select.prototype.selectOption = function(index) {
  const selected = this.options[index];
  this.valueEl.innerHTML = selected;
  this.activeIndex = index;

  // update aria-selected
  const options = this.el.querySelectorAll('[role=option]');
  [...options].forEach((optionEl) => {
    optionEl.setAttribute('aria-selected', 'false');
  });
  options[index].setAttribute('aria-selected', 'true');
}

Select.prototype.updateMenuState = function(open, callFocus = true) {
  this.open = open;

  this.comboEl.setAttribute('aria-expanded', `${open}`);
  open ? this.el.classList.add('open') : this.el.classList.remove('open');
  callFocus && this.comboEl.focus();
  
  // update activedescendant
  const activeID = open ? `${this.idBase}-${this.activeIndex}` : this.valueEl.id;
  this.comboEl.setAttribute('aria-activedescendant', activeID);
}

// init select
window.addEventListener('load', function () {
  const selectEl = document.querySelector('.js-select');
  const options = ['Apple', 'Banana', 'Blueberry', 'Boysenberry', 'Cherry', 'Durian', 'Eggplant', 'Fig', 'Grape', 'Guava', 'Huckleberry'];
  const selectComponent = new Select(selectEl, options);
  selectComponent.init();
});