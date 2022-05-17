/* global mappingTables */

function hideElement(element) {
  element.style.display = 'none';
}

function showElement(element) {
  element.style.display = 'block';
}

function queryAll(selector, context) {
  context = context || document;
  return Array.prototype.slice.call(context.querySelectorAll(selector));
}

function getElementIndex(el) {
  var i = 1;
  while ((el = el.previousElementSibling)) {
    i++;
  }
  return i;
}

var mappingTableInfos = [];

function viewAsSingleTable(tableContainer, detailsContainer) {
  hideElement(detailsContainer);
  showElement(tableContainer);

  // Remove ids from summary
  queryAll('summary', detailsContainer).forEach(function (
    summary
  ) {
    summary.dataset['id'] = summary.id;
    summary.removeAttribute('id');
  });

  // Add ids to table
  queryAll('tbody tr', tableContainer).forEach(function (
    tr
  ) {
    tr.id = tr.dataset['id'];
    tr.removeAttribute('data-id');
  });
}

function viewAsDetails(tableContainer, detailsContainer) {
  hideElement(tableContainer);
  showElement(detailsContainer);

  // Remove ids from table
  queryAll('tbody tr', tableContainer).forEach(function (
    tr
  ) {
    tr.dataset['id'] = tr.id;
    tr.removeAttribute('id');
  });

  // Add ids to summary
  queryAll('summary', detailsContainer).forEach(function (
    summary
  ) {
    summary.id = summary.dataset['id'];
    summary.removeAttribute('data-id');
  });
}


function expandReferredDetails(summaryFragId) {
  // if details element is not open, activate click on summary
  if (!summaryFragId.parentNode.open) {
    summaryFragId.click();
  }
}

function mappingTables() {
  queryAll('.table-container').forEach(function (container) {

    // object to store information about a mapping table.
    var tableInfo = {};
    mappingTableInfos.push(tableInfo);

    // store a reference to the container and hide it
    tableInfo.tableContainer = container;
    hideElement(container);

    // store a reference to the table
    tableInfo.table = container.querySelector('table');

    // create a container div to hold all the details element and insert after table
    tableInfo.detailsContainer = document.createElement('div');
    tableInfo.detailsContainer.className = 'details';
    tableInfo.id = tableInfo.table.id + '-details';
    tableInfo.tableContainer.insertAdjacentElement(
      'afterend',
      tableInfo.detailsContainer
    );

    // add switch to view as single table or details/summary
    var viewSwitch = document.createElement('button');
    viewSwitch.className = 'switch-view';
    viewSwitch.innerHTML = mappingTableLabels.viewByTable;
    tableInfo.tableContainer.insertAdjacentElement('beforebegin', viewSwitch);

    // store the table's column headers in array colHeaders
    // TODO: figure out what browsers we have to support and replace this with Array#map if possible
    var colHeaders = [];
    queryAll('thead th', tableInfo.table).forEach(function (th) {
      colHeaders.push(th.innerHTML);
    });

    // remove first column header from array
    colHeaders.shift();
    // for each row in the table, create details/summary..

    queryAll('tbody tr', tableInfo.table).forEach(function (row) {
      var caption = row.querySelector('th').innerHTML;
      var summary = caption.replace(/<a [^>]+>|<\/a>/g, '');
      // get the tr's @id
      var id = row.id;
      row.dataset.id = id;

      // remove the tr's @id since same id will be used in the relevant summary element
      row.removeAttribute('id');
      // store the row's cells in array rowCells
      var rowCells = [];
      // add row cells to array rowCells for use in the details' table
      queryAll('td', row).forEach(function (cell) {
        rowCells.push(cell.innerHTML);
      });
      // clone colHeaders array for use in details table row headers
      var rowHeaders = colHeaders.slice(0);
      // if attributes mapping table...
      if (tableInfo.table.classList.contains('attributes')) {
        // remove second column header from array
        rowHeaders.shift();
        // remove and store "HTML elements" cell from rowCells array for use in details' summary and table caption
        var relevantElsCaption = rowCells.shift();
        var relevantElsSummary = relevantElsCaption.replace(
          /<a [^>]+>|<\/a>/g,
          ''
        );
      }

      // create content for each <details> element; add row header's content to summary
      var details = document.createElement('details');
      details.className = 'map';

      var detailsHTML = '<summary id="' + id + '">' + summary;

      // if attributes mapping table, append relevant elements to summary
      if (tableInfo.table.classList.contains('attributes')) {
        detailsHTML += ' [' + relevantElsSummary + ']';
      }

      detailsHTML += '</summary><table><caption>' + caption;

      if (tableInfo.table.classList.contains('attributes')) {
        detailsHTML += ' [' + relevantElsCaption + ']';
      }

      detailsHTML += '</caption><tbody>';

      // add table rows using appropriate header from detailsRowHead array and relevant value from rowCells array
      for (var i = 0, len = rowCells.length; i < len; i++) {
        detailsHTML +=
          '<tr><th>' +
          rowHeaders[i] +
          '</th><td>' +
          rowCells[i] +
          '</td></tr>';
      }
      detailsHTML += '</tbody></table></details>';
      details.innerHTML = detailsHTML;

      // append the <details> element to the detailsContainer div
      tableInfo.detailsContainer.appendChild(details);
    });

    // add 'expand/collapse all' functionality
    var expandAllButton = document.createElement('button');
    expandAllButton.className = 'expand';
    expandAllButton.innerHTML = mappingTableLabels.expand;

    var collapseAllButton = document.createElement('button');
    collapseAllButton.disabled = true;
    collapseAllButton.className = 'collapse';
    collapseAllButton.innerHTML = mappingTableLabels.collapse;

    tableInfo.detailsContainer.insertBefore(
      collapseAllButton,
      tableInfo.detailsContainer.firstChild
    );
    tableInfo.detailsContainer.insertBefore(
      expandAllButton,
      tableInfo.detailsContainer.firstChild
    );
  });

  // if page URL links to frag id, reset location to frag id once details/summary view is set
  if (window.location.hash) {
    var hash = window.location.hash;
    window.location = hash;
    var frag = document.querySelector(hash);
    // if frag id is for a summary element, expand the parent details element
    if (frag && frag.tagName === 'SUMMARY') {
      expandReferredDetails(hash);
    }
  }

  // Add a hook to expand referred details element when <a> whose @href is fragid of a <summary> is clicked.
  queryAll('a[href^="#"]').forEach(function (a) {
    var fragId = a.getAttribute('href');

    if (fragId.tagName === 'SUMMARY') {
      a.addEventListener('click', function () {
        expandReferredDetails(fragId);
      });
    }
  });
}

document.addEventListener("DOMContentLoaded", () => {

  document.querySelectorAll('button.switch-view').forEach(function (b){
    b.addEventListener('click', function () {
      tableContainer = b.parentElement.querySelector('.table-container');
      table = tableContainer.querySelector('table');
      detailsContainer = b.parentElement.querySelector('.details');

      if (detailsContainer.style.display !== 'none') {
        viewAsSingleTable(tableContainer, detailsContainer);
        // toggle the viewSwitch label from view-as-single-table to view-by-X
        b.innerHTML =
          mappingTableLabels.viewByLabels[table.id];
      } else {
        viewAsDetails(tableContainer, detailsContainer);
        // toggle the viewSwitch label from view-by-X to view-as-single-table.
        b.innerHTML = mappingTableLabels.viewByTable;
      }
    });
  });

  var expandCollapseDetails = function (detCont, action) {
    queryAll('details', detCont).forEach(function (details) {
      details.open = action !== 'collapse'
    });
  };

  document.querySelectorAll('button.expand').forEach(function (b){
    b.addEventListener('click', function () {
      detailsContainer = b.parentElement.querySelector('.details');
      expandCollapseDetails(detailsContainer, 'expand');
      b.disabled = true;
      b.parentElement
        .querySelector('button.collapse')
        .removeAttribute('disabled');
    });
  });

  document.querySelectorAll('button.collapse').forEach(function (b){
    b.addEventListener('click', function () {
      detailsContainer = b.parentElement.querySelector('.details');
      expandCollapseDetails(detailsContainer, 'collapse');
      b.disabled = true;
      b.parentElement
        .querySelector('button.expand')
        .removeAttribute('disabled');
    });
  });
});
