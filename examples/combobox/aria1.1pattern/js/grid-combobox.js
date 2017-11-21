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
 * @param grid
 *  The grid node to load results in
 * @param searchFn
 *  The search function. The function accepts a search string and returns an
 *  array of results.
 */
aria.GridCombobox = function (
  comboboxNode,
  input,
  grid,
  searchFn
) {
  this.combobox = comboboxNode;
  this.input = input;
  this.grid = grid;
  this.searchFn = searchFn;
  this.activeRowIndex = -1;
  this.activeColIndex = 0;
  this.rowsCount = 0;
  this.colsCount = 0;
  this.gridFocused = false;
  this.shown = false;
  this.selectionCol = 0;

  this.setupEvents();
};

aria.GridCombobox.prototype.setupEvents = function () {
  document.body.addEventListener('click', this.checkHide.bind(this));
  this.input.addEventListener('keyup', this.checkKey.bind(this));
  this.input.addEventListener('keydown', this.setActiveItem.bind(this));
  this.input.addEventListener('focus', this.checkShow.bind(this));
  this.grid.addEventListener('click', this.clickItem.bind(this));
};

aria.GridCombobox.prototype.checkKey = function (evt) {
  var key = evt.which || evt.keyCode;

  switch (key) {
    case aria.KeyCode.UP:
    case aria.KeyCode.DOWN:
    case aria.KeyCode.ESC:
    case aria.KeyCode.RETURN:
      evt.preventDefault();
      return;
    case aria.KeyCode.LEFT:
    case aria.KeyCode.RIGHT:
      if (this.gridFocused) {
        console.log('grid focused');
        evt.preventDefault();
        return;
      }
    default:
      this.updateResults();
  }
};

aria.GridCombobox.prototype.updateResults = function () {
  var searchString = this.input.value;
  var results = this.searchFn(searchString);

  this.hideResults();

  if (!searchString) {
    results = [];
  }

  if (results.length) {
    for (var row = 0; row < results.length; row++) {
      var resultRow = document.createElement('div');
      resultRow.className = 'result-row';
      resultRow.setAttribute('role', 'row');
      resultRow.setAttribute('id', 'result-row-' + row);
      for (var col = 0; col < results[row].length; col++) {
        var resultCell = document.createElement('div');
        resultCell.className = 'result-cell';
        resultCell.setAttribute('role', 'gridcell');
        resultCell.setAttribute('id', 'result-item-' + row + 'x' + col);
        resultCell.innerText = results[row][col];
        resultRow.appendChild(resultCell);
      }
      this.grid.appendChild(resultRow);
    }
    aria.Utils.removeClass(this.grid, 'hidden');
    this.combobox.setAttribute('aria-expanded', 'true');
    this.rowsCount = results.length;
    this.colsCount = results.length ? results[0].length : 0;
    this.shown = true;
  }
};

aria.GridCombobox.prototype.getRowIndex = function (key) {
  var activeRowIndex = this.activeRowIndex;

  switch (key) {
    case aria.KeyCode.UP:
    case aria.KeyCode.LEFT:
      if (activeRowIndex <= 0) {
        activeRowIndex = this.rowsCount - 1;
      }
      else {
        activeRowIndex--;
      }
      break;
    case aria.KeyCode.DOWN:
    case aria.KeyCode.RIGHT:
      if (activeRowIndex === -1 || activeRowIndex >= this.rowsCount - 1) {
        activeRowIndex = 0;
      }
      else {
        activeRowIndex++;
      }
  }

  return activeRowIndex;
};

aria.GridCombobox.prototype.setActiveItem = function (evt) {
  var key = evt.which || evt.keyCode;
  var activeRowIndex = this.activeRowIndex;
  var activeColIndex = this.activeColIndex;

  if (key === aria.KeyCode.ESC) {
    if (this.gridFocused) {
      this.gridFocused = false;
      this.removeFocusCell(this.activeRowIndex, this.activeColIndex);
      this.activeRowIndex = -1;
      this.activeColIndex = 0;
      this.input.setAttribute(
        'aria-activedescendant',
        ''
      );
    }
    else {
      this.hideResults();
      setTimeout((function () {
        // On Firefox, input does not get cleared here unless wrapped in
        // a setTimeout
        this.input.value = '';
      }).bind(this), 1);
    }
    return;
  }

  if (this.rowsCount < 1) {
    return;
  }

  var prevActive = this.getItemAt(activeRowIndex, this.selectionCol);
  var activeItem;

  switch (key) {
    case aria.KeyCode.UP:
      this.gridFocused = true;
      activeRowIndex = this.getRowIndex(key);
      evt.preventDefault();
      break;
    case aria.KeyCode.DOWN:
      this.gridFocused = true;
      activeRowIndex = this.getRowIndex(key);
      evt.preventDefault();
      break;
    case aria.KeyCode.LEFT:
      if (activeColIndex <= 0) {
        activeColIndex = this.colsCount - 1;
        activeRowIndex = this.getRowIndex(key);
      }
      else {
        activeColIndex--;
      }
      if (this.gridFocused) {
        evt.preventDefault();
      }
      break;
    case aria.KeyCode.RIGHT:
      if (activeColIndex === -1 || activeColIndex >= this.colsCount - 1) {
        activeColIndex = 0;
        activeRowIndex = this.getRowIndex(key);
      }
      else {
        activeColIndex++;
      }
      if (this.gridFocused) {
        evt.preventDefault();
      }
      break;
    case aria.KeyCode.RETURN:
      activeItem = this.getItemAt(activeRowIndex, this.selectionCol);
      this.selectItem(activeItem);
      this.gridFocused = false;
      return;
    case aria.KeyCode.TAB:
      this.hideResults();
      return;
    default:
      return;
  }

  if (prevActive) {
    this.removeFocusCell(this.activeRowIndex, this.activeColIndex);
    prevActive.setAttribute('aria-selected', 'false');
  }

  activeItem = this.getItemAt(activeRowIndex, activeColIndex);
  this.activeRowIndex = activeRowIndex;
  this.activeColIndex = activeColIndex;

  if (activeItem) {
    this.input.setAttribute(
      'aria-activedescendant',
      'result-item-' + activeRowIndex + 'x' + activeColIndex
    );
    this.focusCell(activeRowIndex, activeColIndex);
    var selectedItem = this.getItemAt(activeRowIndex, this.selectionCol);
    selectedItem.setAttribute('aria-selected', 'true');
  }
  else {
    this.input.setAttribute(
      'aria-activedescendant',
      ''
    );
  }
};

aria.GridCombobox.prototype.getItemAt = function (rowIndex, colIndex) {
  return document.getElementById('result-item-' + rowIndex + 'x' + colIndex);
};

aria.GridCombobox.prototype.clickItem = function (evt) {
  if (!evt.target) {
    return;
  }

  var row;
  if (evt.target.getAttribute('role') === 'row') {
    row = evt.target;
  }
  else if (evt.target.getAttribute('role') === 'gridcell') {
    row = evt.target.parentNode;
  }
  else {
    return;
  }

  var selectItem = row.querySelector('.result-cell');
  this.selectItem(selectItem);
};

aria.GridCombobox.prototype.selectItem = function (item) {
  if (item) {
    this.input.value = item.innerText;
    this.hideResults();
  }
};

aria.GridCombobox.prototype.checkShow = function (evt) {
  this.updateResults();
};

aria.GridCombobox.prototype.checkHide = function (evt) {
  if (evt.target === this.input || this.combobox.contains(evt.target)) {
    return;
  }
  this.hideResults();
};

aria.GridCombobox.prototype.hideResults = function () {
  this.gridFocused = false;
  this.shown = false;
  this.activeRowIndex = -1;
  this.activeColIndex = 0;
  this.grid.innerHTML = null;
  aria.Utils.addClass(this.grid, 'hidden');
  this.combobox.setAttribute('aria-expanded', 'false');
  this.rowsCount = 0;
  this.colsCount = 0;
  this.input.setAttribute(
    'aria-activedescendant',
    ''
  );
};

aria.GridCombobox.prototype.removeFocusCell = function (rowIndex, colIndex) {
  var row = document.getElementById('result-row-' + rowIndex);
  aria.Utils.removeClass(row, 'focused');
  var cell = this.getItemAt(rowIndex, colIndex);
  aria.Utils.removeClass(cell, 'focused-cell');
};

aria.GridCombobox.prototype.focusCell = function (rowIndex, colIndex) {
  var row = document.getElementById('result-row-' + rowIndex);
  aria.Utils.addClass(row, 'focused');
  var cell = this.getItemAt(rowIndex, colIndex);
  aria.Utils.addClass(cell, 'focused-cell');
};
