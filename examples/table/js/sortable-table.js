/*
 *   This content is licensed according to the W3C Software License at
 *   https://www.w3.org/Consortium/Legal/2015/copyright-software-and-document
 *
 *   File:   sortable-table.js
 *
 *   Desc:   Adds sorting to a HTML data table that implements ARIA Authoring Practices
 */

'use strict';

class SortableTable {
  constructor(tableNode) {
    this.tableNode = tableNode;

    this.columnHeaders = tableNode.querySelectorAll('thead th');

    this.sortColumns = [];

    this.buttonLabelDescending = 'Sort %s column in descending order';
    this.buttonLabelAscending = 'Sort %s column in ascending order';

    for (var i = 0; i < this.columnHeaders.length; i++) {
      var ch = this.columnHeaders[i];
      var button = ch.querySelector('button');
      if (button) {
        var label = this.buttonLabelAscending.replace('%s', button.textContent);
        button.setAttribute('aria-label', label);
        this.sortColumns.push(i);
        button.setAttribute('data-column-index', i);
        button.addEventListener('click', this.handleClick.bind(this));
      }
    }
  }

  setColumnHeaderSort(columnIndex) {
    var label;

    if (typeof columnIndex === 'string') {
      columnIndex = parseInt(columnIndex);
    }

    for (var i = 0; i < this.columnHeaders.length; i++) {
      var ch = this.columnHeaders[i];
      var buttonNode = ch.querySelector('button');
      if (i === columnIndex) {
        var value = ch.getAttribute('aria-sort');
        if (value === 'descending') {
          ch.setAttribute('aria-sort', 'ascending');
          this.sortColumn(
            columnIndex,
            'ascending',
            ch.classList.contains('num')
          );
          label = this.buttonLabelAscending.replace(
            '%s',
            this.cleanTextContent(buttonNode)
          );
          buttonNode.setAttribute('aria-label', label);
        } else {
          ch.setAttribute('aria-sort', 'descending');
          this.sortColumn(
            columnIndex,
            'descending',
            ch.classList.contains('num')
          );
          label = this.buttonLabelAscending.replace(
            '%s',
            this.cleanTextContent(buttonNode)
          );
          buttonNode.setAttribute('aria-label', label);
        }
      } else {
        if (ch.hasAttribute('aria-sort') && buttonNode) {
          ch.removeAttribute('aria-sort');
          label = this.buttonLabelDescending.replace(
            '%s',
            this.cleanTextContent(buttonNode)
          );
          buttonNode.setAttribute('aria-label', label);
        }
      }
    }
  }

  cleanTextContent(node) {
    var text = node.textContent;
    text = text.replace(/[\n\r]+/g, '');
    text = text.trim();
    return text;
  }

  sortColumn(columnIndex, sortValue, isNumber) {
    if (typeof isNumber !== 'boolean') {
      isNumber = false;
    }

    var tbody = this.tableNode.querySelector('tbody');
    var rowNodes = [];
    var dataCells = [];

    var rowNode = tbody.firstElementChild;

    var index = 0;
    while (rowNode) {
      rowNodes.push(rowNode);
      var rowCells = rowNode.querySelectorAll('th, td');
      var dataCell = rowCells[columnIndex];

      var data = {};
      data.index = index;
      data.value = dataCell.textContent.toLowerCase().trim();
      if (isNumber) {
        data.value = parseFloat(data.value);
      }
      dataCells.push(data);
      rowNode = rowNode.nextElementSibling;
      index += 1;
    }

    dataCells.sort((a, b) => {
      if (sortValue === 'ascending') {
        if (a.value === b.value) {
          return 0;
        } else {
          if (isNumber) {
            return a.value - b.value;
          } else {
            return a.value < b.value ? -1 : 1;
          }
        }
      } else {
        if (a.value === b.value) {
          return 0;
        } else {
          if (isNumber) {
            return b.value - a.value;
          } else {
            return a.value > b.value ? -1 : 1;
          }
        }
      }
    });

    // remove rows
    while (tbody.firstChild) {
      tbody.removeChild(tbody.lastChild);
    }

    // add sorted rows
    for (var i = 0; i < dataCells.length; i += 1) {
      tbody.appendChild(rowNodes[dataCells[i].index]);
    }
  }

  /* EVENT HANDLERS */

  handleClick(event) {
    var tgt = event.currentTarget;
    this.setColumnHeaderSort(tgt.getAttribute('data-column-index'));
  }
}

// Initialize sortable table buttons
window.addEventListener('load', function () {
  var sortableTables = document.querySelectorAll('table.sortable');
  for (var i = 0; i < sortableTables.length; i++) {
    new SortableTable(sortableTables[i]);
  }
});
