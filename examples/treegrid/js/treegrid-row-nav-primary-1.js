// TODO put aria-readme everywhere
function onReady (treegrid) {
  function initTabIndices () {
    // Make sure focusable elements are not in the tab order
    // They will be added back in for the active row
    setTabIndexOfFocusableElems(treegrid, -1);

    // Add tabindex="0" to first row, "-1" to other rows
    // We will use the roving tabindex method since aria-activedescendant
    // does not work in IE
    var rows = getAllRows();
    var index = rows.length;
    while (index--) {
      rows[index].tabIndex = index ? -1 : 0;
    }
  }

  function getAllRows () {
    var nodeList = treegrid.querySelectorAll('tbody > tr');
    return Array.prototype.slice.call(nodeList);
  }

  function getFocusableElems (root) {
    // textarea not supported as a cell widget as it's multiple lines
    // and needs up/down keys
    // These should all be descendants of a cell
    var nodeList = root.querySelectorAll('a,button,input,td>[tabindex]');
    return Array.prototype.slice.call(nodeList);
  }

  function setTabIndexOfFocusableElems (root, tabIndex) {
    var focusableElems = getFocusableElems(root);
    var index = focusableElems.length;
    while (index--) {
      focusableElems[index].tabIndex = tabIndex;
    }
  }

  function getAllNavigableRows () {
    var nodeList = treegrid.querySelectorAll('tbody > tr[tabindex]:not([aria-hidden="true"])');
    // Convert to array so that we can use array methods on it
    return Array.prototype.slice.call(nodeList);
  }

  function getNavigableCols (currentRow) {
    var nodeList = currentRow.getElementsByTagName('td');
    return Array.prototype.slice.call(nodeList);
  }

  function restrictIndex (index, numItems) {
    if (index < 0) {
      return 0;
    }
    return index >= numItems ? index - 1 : index;
  }

  function focus (elem) {
    elem.tabIndex = -1; // Ensure focusable
    elem.focus();
  }

  function focusCell (cell) {
    // Check for focusable child such as link or textbox
    // and use that if available
    var focusableChildren = getFocusableElems(cell);
    focus(focusableChildren[0] || cell);
  }

  // Restore tabIndex to what it should be when focus switches from
  // one treegrid item to another
  function onFocusIn (event) {
    var newTreeGridFocus =
      event.target !== window && treegrid.contains(event.target) && event.target;

    // The last row we considered focused
    var oldCurrentRow = enableTabbingInActiveRowDescendants.tabbingRow;
    if (oldCurrentRow) {
      enableTabbingInActiveRowDescendants(false, oldCurrentRow);
    }
    if (onFocusIn.prevTreeGridFocus
      && onFocusIn.prevTreeGridFocus.localName === 'td') {
      // Was focused on td, remove tabIndex so that it's not focused on click
      onFocusIn.prevTreeGridFocus.removeAttribute('tabindex');
    }

    if (newTreeGridFocus) {
      // Stayed in treegrid
      if (oldCurrentRow) {
        // There will be a different current row that will be
        // the tabbable one
        oldCurrentRow.tabIndex = -1;
      }

      // The new row
      var currentRow = getRowWithFocus();
      if (currentRow) {
        currentRow.tabIndex = 0;
        // Items within current row are also tabbable
        enableTabbingInActiveRowDescendants(true, currentRow);
      }
    }

    onFocusIn.prevTreeGridFocus = newTreeGridFocus;
  }

  // Set whether interactive elements within a row are tabbable
  function enableTabbingInActiveRowDescendants (isTabbingOn, row) {
    if (row) {
      setTabIndexOfFocusableElems(row, isTabbingOn ? 0 : -1);
      if (isTabbingOn) {
        enableTabbingInActiveRowDescendants.tabbingRow = row;
      }
      else {
        if (enableTabbingInActiveRowDescendants.tabbingRow === row) {
          enableTabbingInActiveRowDescendants.tabbingRow = null;
        }
      }
    }
  }

  // The row with focus is the row that either has focus or an element
  // inside of it has focus
  function getRowWithFocus () {
    var possibleRow = document.activeElement;
    if (treegrid.contains(possibleRow)) {
      while (possibleRow !== treegrid) {
        if (possibleRow.localName === 'tr') {
          return possibleRow;
        }
        possibleRow = possibleRow.parentElement;
      }
    }
  }

  function isRowFocused () {
    return getRowWithFocus() === document.activeElement;
  }

  // Note: contenteditable not currently supported
  function isEditableFocused () {
    var focusedElem = document.activeElement;
    return focusedElem.localName === 'input';
  }

  function getColWithFocus (currentRow) {
    if (currentRow) {
      var possibleCol = document.activeElement;
      if (currentRow.contains(possibleCol)) {
        while (possibleCol !== currentRow) {
          if (possibleCol.localName === 'td') {
            return possibleCol;
          }
          possibleCol = possibleCol.parentElement;
        }
      }
    }
  }

  function getLevel (row) {
    return row && parseInt(row.getAttribute('aria-level'));
  }

  // Move backwards (direction = -1) or forwards (direction = 1)
  // If we also need to move down/up a level, requireLevelChange = true
  // When
  function moveByRow (direction, requireLevelChange) {
    var currentRow = getRowWithFocus();
    var requiredLevel = requireLevelChange && currentRow
      && getLevel(currentRow) + direction;
    var rows = getAllNavigableRows();
    var numRows = rows.length;
    var rowIndex = currentRow ? rows.indexOf(currentRow) : -1;
    // When moving down a level, only allow moving to next row as the
    // first child will never be farther than that
    var maxDistance = requireLevelChange && direction === 1 ? 1 : NaN;

    // Move in direction until required level is found
    do {
      if (maxDistance-- === 0) {
        return; // Failed to find required level, return without focus change
      }
      rowIndex = restrictIndex(rowIndex + direction, numRows);
    }
    while (requiredLevel && requiredLevel !== getLevel(rows[rowIndex]));

    if (!focusSameColInDifferentRow(currentRow, rows[rowIndex])) {
      focus(rows[rowIndex]);
    }
  }

  function focusSameColInDifferentRow (fromRow, toRow) {

    var currentCol = getColWithFocus(fromRow);
    if (!currentCol) {
      return;
    }

    var fromCols = getNavigableCols(fromRow);
    var currentColIndex = fromCols.indexOf(currentCol);

    if (currentColIndex < 0) {
      return;
    }

    var toCols = getNavigableCols(toRow);
    // Focus the first focusable element inside the <td>
    focusCell(toCols[currentColIndex]);
    return true;
  }

  function moveToExtreme (direction) {
    var currentRow = getRowWithFocus();
    if (!currentRow) {
      return;
    }
    var currentCol = getColWithFocus(currentRow);
    if (currentCol) {
      moveToExtremeCol(direction, currentRow);
    }
    else {
      // Move to first/last row
      moveToExtremeRow(direction);
    }
  }

  function moveByCol (direction) {
    var currentRow = getRowWithFocus();
    if (!currentRow) {
      return;
    }
    var cols = getNavigableCols(currentRow);
    var numCols = cols.length;
    var currentCol = getColWithFocus(currentRow);
    var currentColIndex = cols.indexOf(currentCol);
    // First right arrow moves to first column
    var newColIndex = (currentCol || direction < 0) ? currentColIndex
      + direction : 0;
    // Moving past beginning focuses row
    if (newColIndex < 0) {
      focus(currentRow);
      return;
    }
    newColIndex = restrictIndex(newColIndex, numCols);
    focusCell(cols[newColIndex]);
  }

  function moveToExtremeCol (direction, currentRow) {
    // Move to first/last col
    var cols = getNavigableCols(currentRow);
    var desiredColIndex = direction < 0 ? 0 : cols.length - 1;
    focusCell(cols[desiredColIndex]);
  }

  function moveToExtremeRow (direction) {
    var rows = getAllNavigableRows();
    var newRow = rows[direction > 0 ? rows.length - 1 : 0];
    if (!focusSameColInDifferentRow(getRowWithFocus(), newRow)) {
      focus(newRow);
    }
  }

  function doPrimaryAction () {
    var currentRow = getRowWithFocus();
    if (!currentRow) {
      return;
    }

    // If row has focus, open message
    if (currentRow === document.activeElement) {
      alert('Message from ' + currentRow.children[2].innerText + ':\n\n'
        + currentRow.children[1].innerText);
      return;
    }

    // If first col has focused, toggle expand/collapse

    var cols = getNavigableCols(currentRow);
    var currentCol = getColWithFocus(currentRow);
    if (currentCol === cols[0] && currentRow.hasAttribute('aria-expanded')) {
      changeExpanded(currentRow.getAttribute('aria-expanded') === 'false');
    }
  }

  function changeExpanded (doExpand) {
    var currentRow = getRowWithFocus();
    if (!currentRow) {
      return;
    }
    var currentLevel = getLevel(currentRow);
    var rows = getAllRows();
    var currentRowIndex = rows.indexOf(currentRow);
    var didChange;
    var doExpandLevel = [];
    doExpandLevel[currentLevel + 1] = doExpand;

    while (++currentRowIndex < rows.length) {
      var nextRow = rows[currentRowIndex];
      var rowLevel = getLevel(nextRow);
      if (rowLevel <= currentLevel) {
        break; // Next row is not a level down from current row
      }
      // Only expand the next level if this level is expanded
      // and previous level is expanded
      doExpandLevel[rowLevel + 1] =
        doExpandLevel[rowLevel]
        && nextRow.getAttribute('aria-expanded') === 'true';
      var willHideRow = !doExpandLevel[rowLevel];
      var isRowHidden = nextRow.getAttribute('aria-hidden') === 'true';

      if (willHideRow !== isRowHidden) {
        nextRow.setAttribute('aria-hidden', willHideRow);
        didChange = true;
      }
    }
    if (didChange) {
      currentRow.setAttribute('aria-expanded', doExpand);
      return true;
    }
  }

  function onKeyDown (event) {
    var ENTER = 13;
    var UP = 38;
    var DOWN = 40;
    var LEFT = 37;
    var RIGHT = 39;
    var HOME = 36;
    var END = 35;
    var CTRL_HOME = -HOME;
    var CTRL_END = -END;

    var numModifiersPressed = event.ctrlKey + event.altKey + event.shiftKey
      + event.metaKey;

    var key = event.keyCode;

    if (numModifiersPressed === 1 && event.ctrlKey) {
      key = -key; // Treat as negative key value when ctrl pressed
    }
    else if (numModifiersPressed) {
      return;
    }

    switch (key) {
      case DOWN:
        moveByRow(1);
        break;
      case UP:
        moveByRow(-1);
        break;
      case LEFT:
        if (isEditableFocused()) {
          return;  // Leave key for editable area
        }
        if (isRowFocused()) {
          changeExpanded(false) || moveByRow(-1, true);
        }
        else {
          moveByCol(-1);
        }
        break;
      case RIGHT:
        if (isEditableFocused()) {
          return;  // Leave key for editable area
        }

        // If row: try to expand
        // If col or can't expand, move column to right
        if (!isRowFocused() || !changeExpanded(true)) {
          moveByCol(1);
        }
        break;
      case CTRL_HOME:
        moveToExtremeRow(-1);
        break;
      case HOME:
        if (isEditableFocused()) {
          return;  // Leave key for editable area
        }
        moveToExtreme(-1);
        break;
      case CTRL_END:
        moveToExtremeRow(1);
        break;
      case END:
        if (isEditableFocused()) {
          return;  // Leave key for editable area
        }
        moveToExtreme(1);
        break;
      case ENTER:
        doPrimaryAction();
        break;
      default:
        return;
    }

    // Important: don't use key for anything else, such as scrolling
    event.preventDefault();
  }

  initTabIndices();
  treegrid.addEventListener('keydown', onKeyDown);
  // Polyfill for focusin necessary for Firefox < 52
  window.addEventListener(window.onfocusin ? 'focusin' : 'focus',
    onFocusIn, true);
}

document.addEventListener('DOMContentLoaded', function () {
  onReady(document.getElementById('treegrid'));
});

