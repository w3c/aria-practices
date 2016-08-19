/**
 * TODO: Copyright and License stuff goes here
 */

/**
 * @namespace aria
 */
var aria = aria || {};

/**
 * @desc
 *  Key code constants
 */
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

/**
 * @desc
 *  Values for aria-sort
 */
aria.SortTypes = {
  ASCENDING: 'ascending',
  DESCENDING: 'descending',
  NONE: 'none',
};

/**
 * @desc
 *  CSS Class names
 */
aria.CSSClasses = {
  HIDDEN: 'hidden',
};

/**
 * @constructor
 *
 * @desc
 *  Grid object representing the state and interactions for a grid widget
 *
 *  Assumptions:
 *  All focusable cells initially have tabindex="-1"
 *  Produces a fully filled in mxn grid (with no holes)
 *
 * @param gridNode
 *  The DOM node pointing to the grid
 */
aria.Grid = function (gridNode) {
  this.navigationDisabled = false;
  this.gridNode = gridNode;
  this.paginationEnabled = this.gridNode.hasAttribute('data-per-page');

  this.setupFocusGrid();
  this.setFocusPointer(0, 0);

  if (this.paginationEnabled) {
    this.setupPagination();
  }

  this.registerEvents();
};

/**
 * @desc
 *  Creates a 2D array of the focusable cells in the grid.
 */
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

  if (this.paginationEnabled) {
    this.setupIndices();
  }
};

/**
 * @desc
 *  Gets the focusable elements in a row.
 *
 * @param row
 *  A pointer to the row DOM element
 *
 * @returns
 *  An array of the focusable elements found in the row. Each element is either
 *  a cell or a single focusable item within a cell
 */
aria.Grid.prototype.getFocusCells = function (row) {
  var rowCells = [];

  Array.prototype.forEach.call(
    row.querySelectorAll('th, td, [role="gridcell"]'),
    (function (cell) {
      if (this.isFocusable(cell)) {
        rowCells.push(cell);
      } else if (
        cell.children.length === 1 &&
        this.isFocusable(cell.children[0])
      ) {
        rowCells.push(cell.children[0]);
      }
    }).bind(this)
  );

  return rowCells;
};

/**
 * @desc
 *  Checks if the specified DOM element is focusable
 *
 * @param element
 *  DOM element to check
 */
aria.Grid.prototype.isFocusable = function (element) {
  return !isNaN(parseInt(element.getAttribute('tabindex')));
};

/**
 * @desc
 *  If possible, set focus pointer to the cell with the specified coordinates
 *
 * @param row
 *  The index of the cell's row
 *
 * @param col
 *  The index of the cell's column
 *
 * @returns
 *  Returns whether or not the focus could be set on the cell.
 */
aria.Grid.prototype.setFocusPointer = function (row, col) {
  if (!this.isValidCell(row, col)) {
    return false;
  }

  if (this.isHidden(row, col)) {
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

/**
 * @param row
 *  The index of the cell's row
 *
 * @param col
 *  The index of the cell's column
 *
 * @returns
 *  Returns whether or not the coordinates are within the grid's boundaries.
 */
aria.Grid.prototype.isValidCell = function (row, col) {
  return !isNaN(row) && !isNaN(col) &&
          row >= 0 && col >= 0 &&
          this.grid && this.grid.length &&
          row < this.grid.length && col < this.grid[row].length;
};

/**
 * @param row
 *  The index of the cell's row
 *
 * @param col
 *  The index of the cell's column
 *
 * @returns
 *  Returns whether or not the cell has been hidden.
 */
aria.Grid.prototype.isHidden = function (row, col) {
  return (this.grid[row][col].offsetParent === null);
};

/**
 * @desc
 *  Clean up grid events
 */
aria.Grid.prototype.clearEvents = function() {
  this.gridNode.removeEventListener('keydown', this.checkFocusChange.bind(this));
  this.gridNode.removeEventListener('keydown', this.checkPageChange.bind(this));
  this.gridNode.removeEventListener('click', this.checkSort.bind(this));
};

/**
 * @desc
 *  Register grid events
 */
aria.Grid.prototype.registerEvents = function () {
  this.clearEvents();

  this.gridNode.addEventListener('keydown', this.checkFocusChange.bind(this));
  this.gridNode.addEventListener('click', this.checkSort.bind(this));

  if (this.paginationEnabled) {
    this.gridNode.addEventListener('keydown', this.checkPageChange.bind(this));
  }
};

/**
 * @desc
 *  Focus on the cell in the specified row and column
 *
 * @param row
 *  The index of the cell's row
 *
 * @param col
 *  The index of the cell's column
 */
aria.Grid.prototype.focusCell = function (row, col) {
  if (this.setFocusPointer(row, col)) {
    this.grid[row][col].focus();
  }
};

/**
 * @desc
 *  Triggered on keydown. Checks if an arrow key was pressed, and (if possible)
 *  moves focus to the next valid cell in the direction of the arrow key.
 *
 * @param event
 *  Keydown event
 */
aria.Grid.prototype.checkFocusChange = function (event) {
  if (!event) {
    return;
  }

  var key = event.which || event.keyCode;
  var rowCaret = this.focusedRow;
  var colCaret = this.focusedCol;
  var currentNodeType = this.grid[rowCaret][colCaret].nodeName.toLowerCase();

  if (currentNodeType === 'input' || currentNodeType === 'select') {
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
      colCaret = this.getNextVisibleCol(-1);
      break;
    case aria.Keys.RIGHT:
      colCaret = this.getNextVisibleCol(1);
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

/**
 * @desc
 *  Triggered on click. Checks if user clicked on a header with aria-sort.
 *  If so, it sorts the column based on the aria-sort attribute.
 *
 * @param event
 *  Keydown event
 */
aria.Grid.prototype.checkSort = function (event) {
  if (event.target &&
      event.target.matches('[role="button"]') &&
      event.target.parentNode &&
      event.target.parentNode.matches('th[aria-sort]')) {
    this.handleSort(event.target.parentNode);
  }
};

/**
 * @desc
 *  Sorts the column below the header node, based on the aria-sort attribute.
 *  aria-sort="none" => aria-sort="ascending"
 *  aria-sort="ascending" => aria-sort="descending"
 *  All other headers with aria-sort are reset to "none"
 *
 *  Note: This implementation assumes that there is no pagination on the grid.
 *
 * @param headerNode
 *  Header DOM node
 */
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

/**
 * @desc
 *  Sorts the grid's rows according to the specified compareFn
 *
 * @param compareFn
 *  Comparison function to sort the rows
 */
aria.Grid.prototype.sortRows = function (compareFn) {
  var rows = this.gridNode.querySelectorAll('tr, [role="row"]');
  var rowWrapper = rows[0].parentNode;
  var dataRows = Array.prototype.slice.call(rows, 1);

  dataRows.sort(compareFn);

  dataRows.forEach((function (row) {
    rowWrapper.appendChild(row);
  }).bind(this));
};

/**
 * @desc
 *  Adds aria-rowindex and aria-colindex to the cells in the grid
 */
aria.Grid.prototype.setupIndices = function () {
  var rows = this.gridNode.querySelectorAll('tr');
  for (var row = 0; row < rows.length; row++) {
    var cols = rows[row].querySelectorAll('td, th');
    for (var col = 0; col < cols.length; col++) {
      cols[col].setAttribute('aria-rowindex', row);
      cols[col].setAttribute('aria-colindex', col);
    }
  }
};

/**
 * @desc
 *  Determines the per page attribute of the grid, and shows/hides rows
 *  accordingly.
 */
aria.Grid.prototype.setupPagination = function () {
  this.perPage = this.gridNode.getAttribute('data-per-page');
  this.showPage(1);
};

/**
 * @desc
 *  Check if page up or page down was pressed, and show the next page if so.
 *
 * @param event
 *  Keydown event
 */
aria.Grid.prototype.checkPageChange = function (event) {
  if (!event) {
    return;
  }

  var key = event.which || event.keyCode;

  if (key === aria.Keys.PAGE_UP || key === aria.Keys.PAGE_DOWN) {
    event.preventDefault();

    if (key === aria.Keys.PAGE_UP) {
      this.showPage(this.currentPage - 1);
    } else {
      this.showPage(this.currentPage + 1);
    }
  }
};

/**
 * @desc
 *  If a valid page is passed, show the cells for the corresponding page. Each
 *  page starts with the last row from the previous page.
 *
 * @param page
 *  Page (starting from 1) number to show
 */
aria.Grid.prototype.showPage = function (page) {
  var rows = this.gridNode.querySelectorAll('tr, [role="row"]');
  var dataRows = Array.prototype.slice.call(rows, 1);
  var startIndex = (page - 1) * (this.perPage - 1);
  var rowCount = 0;

  if (page > 0 && startIndex < dataRows.length) {
    for (var i = 0; i < dataRows.length; i++) {
      if (i >= startIndex && i < startIndex + 5) {
        dataRows[i].className = '';
        rowCount++;
      } else {
        dataRows[i].className = aria.CSSClasses.HIDDEN;
      }
    }

    this.focusCell(startIndex, this.focusedCol);
    this.gridNode.setAttribute('aria-rowcount', rowCount);
    this.currentPage = page;
  }
};

/**
 * @desc
 *  Get next visible column to the right or left (direction)
 *  of the focused cell
 *
 * @param direction
 *  Direction for where to check for cells. +1 to check to the right, -1 to
 *  check to the left
 *
 * @return
 *  Index of the next visible column in the specified direction. Returns -1 if
 *  no visible columns are found.
 */
aria.Grid.prototype.getNextVisibleCol = function (direction) {
  var row = this.focusedRow;
  var col = this.focusedCol + direction;

  while (this.isValidCell(row, col)) {
    if (!this.isHidden(row, col)) {
      return col;
    }
    col = col + direction;
  }

  return -1;
};

/**
 * @desc
 *  Show or hide the cells in the specified column
 *
 * @param columnIndex
 *  Index of the column to toggle
 *
 * @param isShown
 *  Whether or not to show the column
 */
aria.Grid.prototype.toggleColumn = function (columnIndex, isShown) {
  var cellSelector = '[aria-colindex="' + columnIndex + '"]';
  var columnCells = this.gridNode.querySelectorAll(cellSelector);
  var className = isShown ? '' : aria.CSSClasses.HIDDEN;

  Array.prototype.forEach.call(
    columnCells,
    function (cell) {
      cell.className = className;
    }
  );
};
