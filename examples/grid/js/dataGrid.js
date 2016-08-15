/**
 * Rename this file to the name of the example, e.g., checkbox.js.
 */
var aria = aria || {};

aria.Keys = {
  TAB:        9,
  RETURN:    13,
  ESC:       27,
  PAGE_UP:   33,
  PAGE_DOWN: 34,
  END:       35,
  HOME:      36,
  LEFT:      37,
  UP:        38,
  RIGHT:     39,
  DOWN:      40,
};

aria.isFocusable = function (element) {
  return !isNaN(parseInt(element.getAttribute('tabindex')));
};

aria.Grid = function (gridNode) {
  this.BLUR_TIMEOUT = 20;
  this.BLURRED = -1;

  this.blurTimeout = null;
  this.focusedCol = this.BLURRED;
  this.focusedRow = this.BLURRED;
  this.gridNode = gridNode;
  this.lastFocusedTime = 0;

  this.setupGrid();
  this.registerEvents();
};

aria.Grid.prototype.setupGrid = function () {
  var grid = [];

  Array.prototype.forEach.call(
    this.gridNode.querySelectorAll('tr, [role="row"]'),
    function (row) {
      var rowCells = [];

      Array.prototype.forEach.call(
        row.querySelectorAll('th, td, [role="gridcell"]'),
        function (cell) {
          if (aria.isFocusable(cell)) {
            rowCells.push(cell);
          } else if (
            cell.children.length &&
            aria.isFocusable(cell.children[0])
          ) {
            // TODO: Ask what is the correct behavior here? Only if there's one element?
            rowCells.push(cell.children[0]);
          }
        }
      );

      if (rowCells.length) {
        grid.push(rowCells);
      }
    }
  );

  this.grid = grid;
};

aria.Grid.prototype.clearEvents = function() {
  this.gridNode.removeEventListener('blur', this.onBlur);
  this.gridNode.removeEventListener('focus', this.onFocus);
  this.gridNode.removeEventListener('keydown', this.onKeyDown);
};

aria.Grid.prototype.registerEvents = function () {
  this.clearEvents();

  this.gridNode.addEventListener('blur', this.onBlur.bind(this), true);
  this.gridNode.addEventListener('focus', this.onFocus.bind(this));
  this.gridNode.addEventListener('keydown', this.onKeyDown.bind(this));
};

aria.Grid.prototype.onFocus = function (event) {
  if (this.focusedRow === this.BLURRED || this.focusedCol === this.BLURRED) {
    this.focusCell(0, 0);
  } else {
    this.focusCell(this.focusedRow, this.focusedCol);
  }

  this.gridNode.setAttribute('tabindex', '-1');
};

aria.Grid.prototype.onBlur = function (event) {
  // Don't trigger reset if grid has been focused within BLUR_TIMEOUT
  if ((Date.now() - this.lastFocusedTime) > this.BLUR_TIMEOUT) {
    this.blurTimeout = setTimeout(
      this.reset.bind(this),
      this.BLUR_TIMEOUT
    );
  }
};

aria.Grid.prototype.reset = function () {
  this.gridNode.setAttribute('tabindex', '0');
};

aria.Grid.prototype.onKeyDown = function (event) {
  if (!event) {
    return;
  }

  var key = event.which || event.keyCode;
  var nextRow = this.focusedRow;
  var nextCol = this.focusedCol;

  switch (key) {
    case aria.Keys.UP:
      nextRow -= 1;
      break;
    case aria.Keys.DOWN:
      nextRow += 1;
      break;
    case aria.Keys.LEFT:
      nextCol -= 1;
      break;
    case aria.Keys.RIGHT:
      nextCol += 1;
      break;
    case aria.Keys.HOME:
      if (event.ctrlKey) {
        nextRow = 0;
      }
      nextCol = 0;
      break;
    case aria.Keys.END:
      if (event.ctrlKey) {
        nextRow = this.grid.length - 1;
      }
      nextCol = this.grid[this.focusedRow].length - 1;
      break;
    default:
      return;
  }

  this.focusCell(nextRow, nextCol);
  event.preventDefault();
};

aria.Grid.prototype.focusCell = function (row, col) {
  clearTimeout(this.blurTimeout);
  this.lastFocusedTime = Date.now();

  if (!this.isValidCell(row, col)) {
    return;
  }

  this.grid[row][col].focus();
  this.focusedRow = row;
  this.focusedCol = col;
};

aria.Grid.prototype.isValidCell = function (row, col) {
  return !isNaN(row) && !isNaN(col) &&
          row >= 0 && col >= 0 &&
          this.grid.length > row && this.grid[row].length > col;
};
