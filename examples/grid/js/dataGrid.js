/**
 * Assumptions:
 * Produces a fully filled in mxn grid (with no holes)
 * All focusable cells have tabindex
 */
var aria = aria || {};

aria.Keys = {
  TAB: 9,
  RETURN: 13,
  ESC: 27,
  PAGE_UP: 33,
  PAGE_DOWN: 34,
  END: 35,
  HOME: 36,
  LEFT: 37,
  UP: 38,
  RIGHT: 39,
  DOWN: 40,
};

aria.SortTypes = {
  ASCENDING: 'ascending',
  DESCENDING: 'descending',
  NONE: 'none',
};

aria.isFocusable = function (element) {
  return !isNaN(parseInt(element.getAttribute('tabindex')));
};

aria.Grid = function (gridNode) {
  this.navigationDisabled = false;
  this.gridNode = gridNode;

  this.setupFocusGrid();
  this.setFocusPointer(0, 0);
  this.registerEvents();
};

aria.Grid.prototype.setupFocusGrid = function () {
  this.grid = [];

  Array.prototype.forEach.call(
    this.gridNode.querySelectorAll('tr, [role="row"]'),
    (function (row) {
      var rowCells = this.getFocusCells(row);

      if (rowCells.length) {
        this.grid.push(rowCells);
      }
    }).bind(this)
  );
};

aria.Grid.prototype.getFocusCells = function (row) {
  var rowCells = [];

  Array.prototype.forEach.call(
    row.querySelectorAll('th, td, [role="gridcell"]'),
    function (cell) {
      if (aria.isFocusable(cell)) {
        rowCells.push(cell);
      } else if (
        cell.children.length === 1 &&
        aria.isFocusable(cell.children[0])
      ) {
        rowCells.push(cell.children[0]);
      }
    }
  );

  return rowCells;
};

aria.Grid.prototype.setFocusPointer = function (row, col) {
  if (!this.isValidCell(row, col)) {
    return false;
  }

  if (!isNaN(this.focusedRow) && !isNaN(this.focusedCol)) {
    this.grid[this.focusedRow][this.focusedCol].setAttribute('tabindex', -1);
  }

  this.grid[row][col].setAttribute('tabindex', 0);
  this.focusedRow = row;
  this.focusedCol = col;

  return true;
};

aria.Grid.prototype.isValidCell = function (row, col) {
  return !isNaN(row) && !isNaN(col) &&
          row >= 0 && col >= 0 &&
          this.grid && this.grid.length &&
          this.grid.length > row && this.grid[row].length > col;
};

aria.Grid.prototype.clearEvents = function() {
  this.gridNode.removeEventListener('keydown', this.onKeyDown.bind(this));
  this.gridNode.removeEventListener('click', this.onClick.bind(this));
};

aria.Grid.prototype.registerEvents = function () {
  this.clearEvents();

  this.gridNode.addEventListener('keydown', this.onKeyDown.bind(this));
  this.gridNode.addEventListener('click', this.onClick.bind(this));
};

aria.Grid.prototype.focusCell = function (row, col) {
  if (this.setFocusPointer(row, col)) {
    this.grid[row][col].focus();
  }
};

aria.Grid.prototype.onKeyDown = function (event) {
  if (!event) {
    return;
  }

  var key = event.which || event.keyCode;
  var rowCaret = this.focusedRow;
  var colCaret = this.focusedCol;
  var currentNodeType = this.grid[rowCaret][colCaret].nodeName.toLowerCase();

  if (currentNodeType === 'input') {
    if (key === aria.Keys.RETURN) {
      this.navigationDisabled = !this.navigationDisabled;
      return;
    }

    if (this.navigationDisabled) {
      return;
    }
  }

  switch (key) {
    case aria.Keys.UP:
      rowCaret -= 1;
      break;
    case aria.Keys.DOWN:
      rowCaret += 1;
      break;
    case aria.Keys.LEFT:
      colCaret -= 1;
      break;
    case aria.Keys.RIGHT:
      colCaret += 1;
      break;
    case aria.Keys.HOME:
      if (event.ctrlKey) {
        rowCaret = 0;
      }
      colCaret = 0;
      break;
    case aria.Keys.END:
      if (event.ctrlKey) {
        rowCaret = this.grid.length - 1;
      }
      colCaret = this.grid[this.focusedRow].length - 1;
      break;
    default:
      return;
  }

  this.focusCell(rowCaret, colCaret);
  event.preventDefault();
};

aria.Grid.prototype.onClick = function (event) {
  if (event.target &&
      event.target.matches('[role="button"]') &&
      event.target.parentNode &&
      event.target.parentNode.matches('th[aria-sort]')) {
    this.handleSort(event.target.parentNode);
  }
};

aria.Grid.prototype.handleSort = function (headerNode) {
  var columnIndex = headerNode.cellIndex;
  var sortType = headerNode.getAttribute('aria-sort');

  if (sortType === aria.SortTypes.ASCENDING) {
    sortType = aria.SortTypes.DESCENDING;
  } else {
    sortType = aria.SortTypes.ASCENDING;
  }

  var comparator = function (row1, row2) {
    var row1Value = row1.children[columnIndex].innerText;
    var row2Value = row2.children[columnIndex].innerText;

    if (row1Value < row2Value) {
      return (sortType === aria.SortTypes.ASCENDING) ? 1 : -1;
    }

    if (row1Value > row2Value) {
      return (sortType === aria.SortTypes.ASCENDING) ? -1 : 1;
    }

    return 0;
  };

  this.sortRows(comparator);
  this.setupFocusGrid();

  Array.prototype.forEach.call(
    this.gridNode.querySelectorAll('th[aria-sort]'),
    function (headerCell) {
      headerCell.setAttribute('aria-sort', aria.SortTypes.NONE);
    }
  );

  event.target.parentNode.setAttribute('aria-sort', sortType);
};

aria.Grid.prototype.sortRows = function (compareFn) {
  var rows = this.gridNode.querySelectorAll('tr, [role="row"]');
  var rowWrapper = rows[0].parentNode;
  var dataRows = Array.prototype.slice.call(rows, 1);

  dataRows.sort(compareFn);

  dataRows.forEach((function (row) {
    rowWrapper.appendChild(row);
  }).bind(this));
};
