// check for require() and respec context
/* global require , mappingTables */

if (typeof require !== 'undefined') {
  require(['core/pubsubhub'], function (respecEvents) {
    mapTables(respecEvents);
  });
} else {
  if (document.readyState !== 'loading') {
    mapTables(false);
  } else {
    document.addEventListener('DOMContentLoaded', function () {
      mapTables(false);
    });
  }
}

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
  var i = 0;
  while ((el = el.previousElementSibling)) {
    i++;
  }
  return i;
}

var mappingTableInfos = [];

function viewAsSingleTable(mappingTableInfo) {
  hideElement(mappingTableInfo.detailsContainer);
  // add <summary> @id to ids array and remove @id from summary
  queryAll('summary', mappingTableInfo.detailsContainer).forEach(function (
    summary
  ) {
    summary.removeAttribute('id');
  });
  showElement(mappingTableInfo.tableContainer);

  // add relevant @id to tr
  queryAll('tbody tr', mappingTableInfo.tableContainer).forEach(function (
    tr
  ) {
    tr.id = mappingTableInfo.ids[getElementIndex(tr)];
  });
}

function viewAsDetails(mappingTableInfo) {
  hideElement(mappingTableInfo.tableContainer);
  // add tr @id to ids array and remove @id from tr
  queryAll('tbody tr', mappingTableInfo.tableContainer).forEach(function (
    tr
  ) {
    tr.removeAttribute('id');
  });
  showElement(mappingTableInfo.detailsContainer);
  // add relevant @id to summary
  queryAll('summary', mappingTableInfo.detailsContainer).forEach(function (
    summary
  ) {
    const details = mappingTableInfo.detailsContainer.querySelector(
      'details'
    );
    summary.id =
      mappingTableInfo.ids[
        // TODO: check that this works
        getElementIndex(details) - getElementIndex(summary.parentNode)
      ];
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
    tableInfo.detailsContainer.className = 'details removeOnSave';
    tableInfo.id = tableInfo.table.id + '-details';
    tableInfo.tableContainer.insertAdjacentElement(
      'afterend',
      tableInfo.detailsContainer
    );

    // array to store @id attributes for rows and summaries.
    tableInfo.ids = [];

    // add switch to view as single table or details/summary
    var viewSwitch = document.createElement('button');
    viewSwitch.className = 'switch-view removeOnSave';
    viewSwitch.innerHTML = mappingTableLabels.viewByTable;
    viewSwitch.addEventListener('click', function () {
      // array to store summary/tr @ids
      // if current view is details/summary
      if (tableInfo.detailsContainer.style.display !== 'none') {
        viewAsSingleTable(tableInfo);
        // toggle the viewSwitch label from view-as-single-table to view-by-X
        viewSwitch.innerHTML =
          mappingTableLabels.viewByLabels[tableInfo.table.id];
      } else {
        viewAsDetails(tableInfo);
        // toggle the viewSwitch label from view-by-X to view-as-single-table.
        viewSwitch.innerHTML = mappingTableLabels.viewByTable;
      }
    });

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
      // store the row's @id
      tableInfo.ids.push(id);
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
      details.className = 'map removeOnSave';

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
    expandAllButton.className = 'expand removeOnSave';
    expandAllButton.innerHTML = mappingTableLabels.expand;

    var collapseAllButton = document.createElement('button');
    collapseAllButton.disabled = true;
    collapseAllButton.className = 'collapse removeOnSave';
    collapseAllButton.innerHTML = mappingTableLabels.collapse;

    tableInfo.detailsContainer.insertBefore(
      collapseAllButton,
      tableInfo.detailsContainer.firstChild
    );
    tableInfo.detailsContainer.insertBefore(
      expandAllButton,
      tableInfo.detailsContainer.firstChild
    );

    var expandCollapseDetails = function (detCont, action) {
      queryAll('details', detCont).forEach(function (details) {
        details.open = action !== 'collapse'
      });
    };

    expandAllButton.addEventListener('click', function () {
      expandCollapseDetails(tableInfo.detailsContainer, 'expand');
      expandAllButton.disabled = true;
      tableInfo.detailsContainer
        .querySelector('button.collapse')
        .removeAttribute('disabled');
    });

    collapseAllButton.addEventListener('click', function () {
      expandCollapseDetails(tableInfo.detailsContainer, 'collapse');
      collapseAllButton.disabled = true;
      tableInfo.detailsContainer
        .querySelector('button.expand')
        .removeAttribute('disabled');
    });

    // add collapsible table columns functionality
    var showHideCols = document.createElement('div');
    showHideCols.className = 'show-hide-cols removeOnSave';
    showHideCols.innerHTML =
      '<span>' + mappingTableLabels.showHideCols + '</span>';

    for (var i = 0, len = colHeaders.length; i < len; i++) {
      (function (i) {
        var toggleLabel = colHeaders[i]
          .replace(/<a [^<]+>|<\/a>/g, '')
          .replace(/<sup>\[Note [0-9]+\]<\/sup>/g, '');

        var showHideColButton = document.createElement('button');
        showHideColButton.className = 'hide-col';
        showHideColButton.setAttribute('aria-pressed', false);
        showHideColButton.setAttribute(
          'title',
          mappingTableLabels.hideToolTipText
        );
        showHideColButton.innerHTML =
          '<span class="action">' +
          mappingTableLabels.hideActionText +
          '</span>' +
          toggleLabel;

        showHideColButton.addEventListener('click', function () {
          var index = getElementIndex(showHideColButton);
          var wasHidden = showHideColButton.className === 'hide-col';

          queryAll(
            'tr>th:nth-child(' + index + '), tr>td:nth-child(' + index + ')',
            tableInfo.table
          ).forEach(function (element) {
            if (wasHidden) {
              hideElement(element);
            } else {
              showElement(element);
            }
          });

          showHideColButton.className = wasHidden ? 'show-col' : 'hide-col';
          showHideColButton.setAttribute('aria-pressed', wasHidden);
          showHideColButton.setAttribute(
            'title',
            wasHidden
              ? mappingTableLabels.showToolTipText
              : mappingTableLabels.hideToolTipText
          );
          showHideColButton.querySelector('span').innerText = wasHidden
            ? mappingTableLabels.showActionText
            : mappingTableLabels.hideActionText;
        });
        queryAll('span', showHideColButton)
          .filter(function (span) {
            return !span.classList.contains('action');
          })
          .forEach(function (span) {
            span.parentNode.removeChild(span);
          });
        showHideCols.appendChild(showHideColButton);
      })(i)
    }

    tableInfo.tableContainer.insertBefore(
      showHideCols,
      tableInfo.tableContainer.firstChild
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

function mapTables(respecEvents) {
  var mappingTableInfos = [];

  function viewAsSingleTable(mappingTableInfo) {
    hideElement(mappingTableInfo.detailsContainer);
    // add <summary> @id to ids array and remove @id from summary
    queryAll('summary', mappingTableInfo.detailsContainer).forEach(function (
      summary
    ) {
      summary.removeAttribute('id');
    });
    showElement(mappingTableInfo.tableContainer);

    // add relevant @id to tr
    queryAll('tbody tr', mappingTableInfo.tableContainer).forEach(function (
      tr
    ) {
      tr.id = mappingTableInfo.ids[getElementIndex(tr)];
    });
  }

  function viewAsDetails(mappingTableInfo) {
    hideElement(mappingTableInfo.tableContainer);
    // add tr @id to ids array and remove @id from tr
    queryAll('tbody tr', mappingTableInfo.tableContainer).forEach(function (
      tr
    ) {
      tr.removeAttribute('id');
    });
    showElement(mappingTableInfo.detailsContainer);
    // add relevant @id to summary
    queryAll('summary', mappingTableInfo.detailsContainer).forEach(function (
      summary
    ) {
      const details = mappingTableInfo.detailsContainer.querySelector(
        'details'
      );
      summary.id =
        mappingTableInfo.ids[
          // TODO: check that this works
          getElementIndex(details) - getElementIndex(summary.parentNode)
        ];
    });
  }

  if (respecEvents) {
    // Fix the scroll-to-fragID:
    // - if running with ReSpec, do not invoke the mapping tables script until
    //   ReSpec executes its own scroll-to-fragID.
    // - if running on a published document (no ReSpec), invoke the mapping tables
    //   script on document ready.
    respecEvents.sub('start', function (details) {
      if (details === 'core/location-hash') {
        mappingTables();
      }
    });
    // Subscribe to ReSpec "save" message to set the mapping tables to
    // view-as-single-table state.
    respecEvents.sub('save', function (details) {
      mappingTableInfos.forEach(function (item) {
        viewAsSingleTable(item);
      });
    });
  } else {
    mappingTables();
  }
}
