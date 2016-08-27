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
aria.KeyCode = {
  TAB: 9,
  RETURN: 13,
  ESC: 27,
  SPACE: 32,
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
aria.SortType = {
  ASCENDING: 'ascending',
  DESCENDING: 'descending',
  NONE: 'none',
};

/**
 * @desc
 *  CSS Class names
 */
aria.CSSClass = {
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
  this.topIndex = 0;

  this.setupFocusGrid();
  this.setFocusPointer(0, 0);

  if (this.paginationEnabled) {
    this.setupPagination();
  } else {
    this.perPage = this.grid.length;
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

  this.navigationDisabled = this.grid[row][col].matches('.edit-text-input');

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
  this.gridNode.removeEventListener('keydown', this.checkIfButton.bind(this));
  this.gridNode.removeEventListener('click', this.focusClickedCell.bind(this));
  this.gridNode.removeEventListener('click', this.checkIfButton.bind(this));
};

/**
 * @desc
 *  Register grid events
 */
aria.Grid.prototype.registerEvents = function () {
  this.clearEvents();

  this.gridNode.addEventListener('keydown', this.checkFocusChange.bind(this));
  this.gridNode.addEventListener('keydown', this.checkIfButton.bind(this));
  this.gridNode.addEventListener('click', this.focusClickedCell.bind(this));
  this.gridNode.addEventListener('click', this.checkIfButton.bind(this));

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
  if (!event || this.navigationDisabled) {
    return;
  }

  var key = event.which || event.keyCode;
  var rowCaret = this.focusedRow;
  var colCaret = this.focusedCol;

  switch (key) {
    case aria.KeyCode.UP:
      rowCaret -= 1;
      break;
    case aria.KeyCode.DOWN:
      rowCaret += 1;
      break;
    case aria.KeyCode.LEFT:
      colCaret = this.getNextVisibleCol(-1);
      break;
    case aria.KeyCode.RIGHT:
      colCaret = this.getNextVisibleCol(1);
      break;
    case aria.KeyCode.HOME:
      if (event.ctrlKey) {
        rowCaret = 0;
      }
      colCaret = 0;
      break;
    case aria.KeyCode.END:
      if (event.ctrlKey) {
        rowCaret = this.grid.length - 1;
      }
      colCaret = this.grid[this.focusedRow].length - 1;
      break;
    default:
      return;
  }

  if (rowCaret < this.topIndex) {
    this.showFromRow(rowCaret, true);
  }

  if (rowCaret >= this.topIndex + this.perPage) {
    this.showFromRow(rowCaret, false);
  }

  this.focusCell(rowCaret, colCaret);
  event.preventDefault();
};

/**
 * @desc
 *  Triggered on click. Finds the cell that was clicked on and focuses on it.
 *
 * @param event
 *  Keydown event
 */
aria.Grid.prototype.focusClickedCell = function (event) {
  var clickedGridCell = event.target.closest('[tabindex]');

  for (var row = 0; row < this.grid.length; row++) {
    for (var col = 0; col < this.grid[row].length; col++) {
      if (this.grid[row][col] === clickedGridCell) {
        this.focusCell(row, col);
        return;
      }
    }
  }
};

/**
 * @desc
 *  Triggered on click. Checks if user clicked on a header with aria-sort.
 *  If so, it sorts the column based on the aria-sort attribute.
 *
 * @param event
 *  Keydown event
 */
aria.Grid.prototype.checkIfButton = function (event) {
  var key = event.which || event.keyCode;
  var target = event.target;
  var buttonTriggered = (key === aria.KeyCode.SPACE || key === aria.KeyCode.RETURN);

  if (target && (event.type === 'click' || buttonTriggered)) {
    if (target.parentNode && target.parentNode.matches('th[aria-sort]')) {

      event.preventDefault();
      this.handleSort(target.parentNode);

    } else if (target.matches('.editable-text, .edit-text-button, .edit-text-input')) {
      event.preventDefault();
      this.toggleEditMode(target);
    }
  }
};

/**
 * @desc
 *  Toggles the mode of an editable cell between displaying the edit button
 *  and displaying the editable input.
 *
 * @param editNode
 *  Either the editable cell or the editable cell's input
 */
aria.Grid.prototype.toggleEditMode = function (editNode) {
  var wasInput = editNode.matches('.edit-text-input');
  var editCell = editNode.closest('.editable-text');
  var editButton, editInput;

  editButton = editCell.querySelector('.edit-text-button');
  editInput = editCell.querySelector('.edit-text-input');

  if (wasInput) {
    editButton.innerText = editInput.value;
    editButton.className = 'edit-text-button';
    editInput.className = 'edit-text-input hidden';
    editInput.setAttribute('tabindex', -1);
    editCell.setAttribute('tabindex', 0);
    editCell.focus();
    this.grid[this.focusedRow][this.focusedCol] = editCell;
  } else {
    editInput.value = editButton.innerText;
    editButton.className = 'edit-text-button hidden';
    editInput.className = 'edit-text-input';
    editCell.setAttribute('tabindex', -1);
    editInput.setAttribute('tabindex', 0);
    editInput.focus();
    this.grid[this.focusedRow][this.focusedCol] = editInput;
  }

  this.navigationDisabled = !wasInput;
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

  if (sortType === aria.SortType.ASCENDING) {
    sortType = aria.SortType.DESCENDING;
  } else {
    sortType = aria.SortType.ASCENDING;
  }

  var comparator = function (row1, row2) {
    var row1Value = row1.children[columnIndex].innerText;
    var row2Value = row2.children[columnIndex].innerText;

    if (row1Value < row2Value) {
      return (sortType === aria.SortType.ASCENDING) ? 1 : -1;
    }

    if (row1Value > row2Value) {
      return (sortType === aria.SortType.ASCENDING) ? -1 : 1;
    }

    return 0;
  };

  this.sortRows(comparator);
  this.setupFocusGrid();

  Array.prototype.forEach.call(
    this.gridNode.querySelectorAll('th[aria-sort]'),
    function (headerCell) {
      headerCell.setAttribute('aria-sort', aria.SortType.NONE);
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
  this.perPage = parseInt(this.gridNode.getAttribute('data-per-page'));
  this.showFromRow(0, true);
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
  var startIndex;

  if (key === aria.KeyCode.PAGE_UP || key === aria.KeyCode.PAGE_DOWN) {
    event.preventDefault();

    if (key === aria.KeyCode.PAGE_UP) {
      startIndex = Math.max(this.perPage - 1, this.topIndex);
      this.showFromRow(startIndex, false);
    } else {
      startIndex = this.topIndex + this.perPage - 1;
      this.showFromRow(startIndex, true);
    }

    this.focusCell(startIndex, this.focusedCol);
  }
};

/**
 * @desc
 *  Scroll the specified row into view in the specified direction
 *
 * @param startIndex
 *  Row index to use as the start index
 *
 * @param scrollDown
 *  Whether to scroll the new page above or below the row index
 */
aria.Grid.prototype.showFromRow = function (startIndex, scrollDown) {
  var rows = this.gridNode.querySelectorAll('tr, [role="row"]');
  var dataRows = Array.prototype.slice.call(rows, 1);
  var rowCount = 0;

  if (startIndex >= 0 && startIndex < dataRows.length) {

    for (var i = 0; i < dataRows.length; i++) {

      if ((scrollDown && i >= startIndex && i < startIndex + this.perPage) ||
          (!scrollDown && i <= startIndex && i > startIndex - this.perPage)) {
        dataRows[i].className = '';
        rowCount++;

        if (rowCount === 1) {
          this.topIndex = i;
        }
      } else {
        dataRows[i].className = aria.CSSClass.HIDDEN;
      }

    }

    this.gridNode.setAttribute('aria-rowcount', rowCount);
  }
};

/**
 * @desc
 *  Get next visible column to the right or left (direction) of the focused
 *  cell. Assumes a visible column exists in the direction.
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
  var className = isShown ? '' : aria.CSSClass.HIDDEN;

  Array.prototype.forEach.call(
    columnCells,
    function (cell) {
      cell.className = className;
    }
  );

  if (!isShown && this.focusedCol === columnIndex) {
    // If focus was set on the hidden column, shift focus to the left
    this.setFocusPointer(this.focusedRow, this.getNextVisibleCol(-1));
  }
};
