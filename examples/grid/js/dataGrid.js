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
      var rowCells = [];

      Array.prototype.forEach.call(
        row.querySelectorAll('th, td, [role="gridcell"]'),
        (function (cell) {
          var focusableSelector = '[tabindex]';

          if (cell.matches(focusableSelector)) {
            rowCells.push(cell);
          } else {
             var focusableCell = cell.querySelector(focusableSelector);

             if (focusableCell) {
               rowCells.push(focusableCell);
             }
          }
        }).bind(this)
      );

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

  // Disable navigation if focused on an input
  this.navigationDisabled = this.grid[row][col].matches('input');

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
  this.gridNode.removeEventListener('keydown', this.delegateButtonHandler.bind(this));
  this.gridNode.removeEventListener('click', this.focusClickedCell.bind(this));
  this.gridNode.removeEventListener('click', this.delegateButtonHandler.bind(this));
};

/**
 * @desc
 *  Register grid events
 */
aria.Grid.prototype.registerEvents = function () {
  this.clearEvents();

  this.gridNode.addEventListener('keydown', this.checkFocusChange.bind(this));
  this.gridNode.addEventListener('keydown', this.delegateButtonHandler.bind(this));
  this.gridNode.addEventListener('click', this.focusClickedCell.bind(this));
  this.gridNode.addEventListener('click', this.delegateButtonHandler.bind(this));

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
  var clickedGridCell = this.findClosest(event.target, '[tabindex]');

  for (var row = 0; row < this.grid.length; row++) {
    for (var col = 0; col < this.grid[row].length; col++) {
      if (this.grid[row][col] === clickedGridCell) {
        this.setFocusPointer(row, col);

        if (!clickedGridCell.matches('button[aria-haspopup]')) {
          // Don't focus if it's a menu button (focus should be set to menu)
          this.focusCell(row, col);
        }

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
aria.Grid.prototype.delegateButtonHandler = function (event) {
  var key = event.which || event.keyCode;
  var target = event.target;
  var isClickEvent = (event.type === 'click');

  if (!target) {
    return;
  }

  if (target.parentNode && target.parentNode.matches('th[aria-sort]') &&
      (isClickEvent || key === aria.KeyCode.SPACE || key === aria.KeyCode.RETURN)) {
        event.preventDefault();
        this.handleSort(target.parentNode);
      }

  if (target.matches('.editable-text, .edit-text-button') &&
      (isClickEvent || key === aria.KeyCode.RETURN)) {
        event.preventDefault();
        this.toggleEditMode(
          this.findClosest(target, '.editable-text'),
          true,
          true
        );
      }

  if (target.matches('.edit-text-input') &&
      (key === aria.KeyCode.RETURN || key === aria.KeyCode.ESC)) {
        event.preventDefault();
        this.toggleEditMode(
          this.findClosest(target, '.editable-text'),
          false,
          key === aria.KeyCode.RETURN
        );
      }
};

/**
 * @desc
 *  Toggles the mode of an editable cell between displaying the edit button
 *  and displaying the editable input.
 *
 * @param editCell
 *  Cell to toggle
 *
 * @param toggleOn
 *  Whether to show or hide edit input
 *
 * @param updateText
 *  Whether or not to update the button text with the input text
 */
aria.Grid.prototype.toggleEditMode = function (editCell, toggleOn, updateText) {
  var onClassName = toggleOn ? 'edit-text-input' : 'edit-text-button';
  var offClassName = toggleOn ? 'edit-text-button' : 'edit-text-input';
  var onNode = editCell.querySelector('.' + onClassName);
  var offNode = editCell.querySelector('.' + offClassName);

  if (toggleOn) {
    onNode.value = offNode.innerText;
  } else if (updateText) {
    onNode.innerText = offNode.value;
  }

  offNode.className = offClassName + ' ' + aria.CSSClass.HIDDEN;
  onNode.className = onClassName;
  offNode.setAttribute('tabindex', -1);
  onNode.setAttribute('tabindex', 0);
  onNode.focus();
  this.grid[this.focusedRow][this.focusedCol] = onNode;
  this.navigationDisabled = toggleOn;
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
    var row1Text = row1.children[columnIndex].innerText;
    var row2Text = row2.children[columnIndex].innerText;
    var row1Value = parseInt(row1Text.replace(/[^0-9\.]+/g,""));
    var row2Value = parseInt(row2Text.replace(/[^0-9\.]+/g,""));

    if (sortType === aria.SortType.ASCENDING) {
      return row1Value - row2Value;
    } else {
      return row2Value - row1Value;
    }
  };

  this.sortRows(comparator);
  this.setupFocusGrid();

  Array.prototype.forEach.call(
    this.gridNode.querySelectorAll('th[aria-sort]'),
    function (headerCell) {
      headerCell.setAttribute('aria-sort', aria.SortType.NONE);
    }
  );

  headerNode.setAttribute('aria-sort', sortType);
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
      cols[col].setAttribute('aria-rowindex', row + 1);
      cols[col].setAttribute('aria-colindex', col + 1);
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
  var reachedTop = false;

  if (startIndex < 0 || startIndex >= dataRows.length) {
    return;
  }

  for (var i = 0; i < dataRows.length; i++) {

    if ((scrollDown && i >= startIndex && i < startIndex + this.perPage) ||
        (!scrollDown && i <= startIndex && i > startIndex - this.perPage)) {
          dataRows[i].className = '';

          if (!reachedTop) {
            this.topIndex = i;
            reachedTop = true;
          }
        } else {
          dataRows[i].className = aria.CSSClass.HIDDEN;
        }

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

  if (!isShown && this.focusedCol === (columnIndex - 1)) {
    // If focus was set on the hidden column, shift focus to the left
    this.setFocusPointer(this.focusedRow, this.getNextVisibleCol(-1));
  }
};

/**
 * @desc
 *  Find the closest element matching the selector. Only checks parent and
 *  direct children.
 *
 * @param element
 *  Element to start searching from
 *
 * @param selector
 *  Index of the column to toggle
 */
aria.Grid.prototype.findClosest = function (element, selector) {
  if (element.matches(selector)) {
    return element;
  }

  if (element.parentNode.matches(selector)) {
    return element.parentNode;
  }

  return element.querySelector(selector);
};
