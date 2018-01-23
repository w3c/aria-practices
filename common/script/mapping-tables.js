//check for require() and respec context
if (typeof require !== "undefined") {
	/* globals $, require */
	require(["core/pubsubhub"], function(respecEvents) {
		mapTables(respecEvents);
	});
} else {
	$(document).ready(function() {
		mapTables(false);
	});
}

function mapTables(respecEvents) {

  "use strict";

	var mappingTableInfos = [];

	function viewAsSingleTable (mappingTableInfo) {
		mappingTableInfo.detailsContainer.hide();
		//add <summary> @id to ids array and remove @id from summary
		$('summary', mappingTableInfo.detailsContainer).each(function() {
			$(this).removeAttr('id');
		});
		mappingTableInfo.tableContainer.show();
		//add relevant @id to tr
		$('tbody tr',mappingTableInfo.tableContainer).each(function() {
			$(this).attr('id', mappingTableInfo.ids[$(this).index()]);
		});
	}

	function viewAsDetails (mappingTableInfo) {
		mappingTableInfo.tableContainer.hide();
		//add tr @id to ids array and remove @id from tr
		$('tbody tr', mappingTableInfo.tableContainer).each(function() {
			$(this).removeAttr('id');
		});
		mappingTableInfo.detailsContainer.show();
		//add relevant @id to summary
		$('summary', mappingTableInfo.detailsContainer).each(function() {
			$(this).attr('id', mappingTableInfo.ids[$('details', mappingTableInfo.detailsContainer).index($(this).parent())]);
		});
	}

  function mappingTables() {
		$('.table-container').each(function() {
			// object to store information about a mapping table.
			var tableInfo = {};
			mappingTableInfos.push (tableInfo);
			//store a reference to the container and hide it
			tableInfo.tableContainer = $(this).hide();
			//store a reference to the table
			tableInfo.table = $('table', tableInfo.tableContainer);
			//create a container div to hold all the details element and insert after table
			tableInfo.detailsContainer = $('<div class="details removeOnSave" id="' + tableInfo.table.attr('id') + '-details"></div>');
		  tableInfo.tableContainer.after(tableInfo.detailsContainer);
		  // array to store @id attributes for rows and summaries.
		  tableInfo.ids = [];

			//add switch to view as single table or details/summary
			var $viewSwitch = $('<button class="switch-view removeOnSave">' + mappingTableLabels.viewByTable + '</button>').on('click', function() {
				//array to store summary/tr @ids
				//if current view is details/summary
				if (tableInfo.detailsContainer.is(':visible')) {
					viewAsSingleTable (tableInfo);
					// toggle the $viewSwitch label from view-as-single-table to view-by-X
					$(this).text(mappingTableLabels.viewByLabels[tableInfo.table.attr('id')]);
				} else {
					viewAsDetails (tableInfo);
					// toggle the $viewSwitch label from view-by-X to view-as-single-table.
					$(this).text(mappingTableLabels.viewByTable);
				}
			});
			tableInfo.tableContainer.before($viewSwitch);
			//store the table's column headers in array colHeaders
			var colHeaders = [];
			$('thead th', tableInfo.table).each(function() {
				var colHead = $(this).html();
				colHeaders.push(colHead);
			});
			//remove first column header from array
			colHeaders.shift();
			//for each row in the table, create details/summary..
			$('tbody tr', tableInfo.table).each(function() {
				//store a reference to the row
				var $row = $(this),
				//store a reference to the row header for use in details' summary and table caption
				$caption = $('th', $row).html(),
				$summary = $caption.replace(/<a [^>]+>|<\/a>/g,'');
				//get the tr's @id
				var id = $row.attr('id');
				//store the row's @id
				tableInfo.ids.push(id);
				//remove the tr's @id since same id will be used in the relevant summary element
				$row.removeAttr('id');
				//store the row's cells in array rowCells
				var rowCells = [];
				//add row cells to array rowCells for use in the details' table
				$('td', $row).each(function() {
					rowCells.push($(this).html());
				});
				//clone colHeaders array for use in details table row headers
				var rowHeaders = colHeaders.slice(0);
				//if attributes mapping table...
				if (tableInfo.table.hasClass('attributes')) {
					//remove second column header from array
					rowHeaders.shift();
					//remove and store "HTML elements" cell from rowCells array for use in details' summary and table caption
					var relevantElsCaption = rowCells.shift(),
					relevantElsSummary = relevantElsCaption.replace(/<a [^>]+>|<\/a>/g,'');
				}
				//create content for each <details> element; add row header's content to summary
				var details = '<details class="map removeOnSave"><summary id="' + id + '">' + $summary;
				//if attributes mapping table, append relevant elements to summary
				if (tableInfo.table.hasClass('attributes')) {
					details += ' [' + relevantElsSummary + ']';
				}
				details += '</summary><table><caption>' + $caption;
				if (tableInfo.table.hasClass('attributes')) {
					details += ' [' + relevantElsCaption + ']';
				}
				details += '</caption><tbody>';
				//add table rows using appropriate header from detailsRowHead array and relevant value from rowCells array
				for(var i=0, len=rowCells.length; i < len; i++) {
					details += '<tr><th>' + rowHeaders[i] + '</th><td>' + rowCells[i] + '</td></tr>';
				}
				details += '</tbody></table></details>';
				//append the <details> element to the detailsContainer div
				tableInfo.detailsContainer.append(details);
			});
			//add 'expand/collapse all' functionality
			var $expandAllButton = $('<button class="expand removeOnSave">' + mappingTableLabels.expand + '</button>');
			var $collapseAllButton = $('<button disabled="disabled" class="collapse removeOnSave">' + mappingTableLabels.collapse + '</button>');
			tableInfo.detailsContainer.prepend($expandAllButton, $collapseAllButton);
			var expandCollapseDetails = function($detCont, action) {
				$detCont.find('details').each(function() {
					var $details = $(this), 
					$detailsSummary = $('summary', $details),
					$detailsNotSummary = $details.children(':not(summary)');
					if (action == 'collapse') {
						$details.removeClass('open').prop('open', false);
						$detailsSummary.attr('aria-expanded', false);
						$detailsNotSummary.hide();
					} else {
						$details.addClass('open').prop('open', true);
						$detailsSummary.attr('aria-expanded', true);
						$detailsNotSummary.show();
					}
				});
			};
			$expandAllButton.on('click', function() {
				expandCollapseDetails(tableInfo.detailsContainer, 'expand');
				$(this).attr('disabled', 'disabled');
				tableInfo.detailsContainer.find('button.collapse').removeAttr('disabled');
			});
			$collapseAllButton.on('click', function() {
				expandCollapseDetails(tableInfo.detailsContainer, 'collapse');
				$(this).attr('disabled', 'disabled');
				tableInfo.detailsContainer.find('button.expand').removeAttr('disabled');
			});
			//add collapsible table columns functionality
			var $showHideCols = $('<div class="show-hide-cols removeOnSave"><span>' + mappingTableLabels.showHideCols + '</span></div>');
			for(var i=0, len=colHeaders.length; i < len; i++) {
				var toggleLabel = colHeaders[i].replace(/<a [^<]+>|<\/a>/g,'').replace(/<sup>\[Note [0-9]+\]<\/sup>/g, '');
				var $showHideColButton = $('<button class="hide-col" aria-pressed="false" title="' + mappingTableLabels.hideToolTipText + '"><span class="action">' + mappingTableLabels.hideActionText + '</span> ' + toggleLabel + '</button>').on('click', function() {
					var index = $(this).index() + 1;
					if ($(this).attr('class') == 'hide-col') {
						$('tr>th:nth-child('+index+')', tableInfo.table).hide();
						$('tr>td:nth-child('+index+')', tableInfo.table).hide();
						$(this).attr({'class': 'show-col', 'aria-pressed': 'true', 'title': mappingTableLabels.showToolTipText});
						$('span', $(this)).text(mappingTableLabels.showActionText);
					} else {
						$('tr>th:nth-child('+index+')', tableInfo.table).show();
						$('tr>td:nth-child('+index+')', tableInfo.table).show();
						$(this).attr({'class': 'hide-col', 'aria-pressed': 'false', 'title': mappingTableLabels.hideToolTipText});
						$('span', $(this)).text(mappingTableLabels.hideActionText);
					}
				});
				$('span:not(.action)', $showHideColButton).remove();
				$showHideCols.append($showHideColButton);
			}
			tableInfo.tableContainer.prepend($showHideCols);
		});
		//call the jquery-details plugin
		var nativeDetailsSupport = $.fn.details.support;
		if (!nativeDetailsSupport) {
			$('html').addClass('no-details');
		}
		$('details').details();
		
		//Use jquery-details plugin event handlers on details open/close to set state of expand/collapse all buttons
		$('details').on({
			'open.details': function() {
				setExpandCollapseButtons($(this).parent());
			},
			'close.details': function() {
				setExpandCollapseButtons($(this).parent());
			}
		});
		var setExpandCollapseButtons = function($detCont) {
			var totalDetails = $detCont.find('details').length;
			var detailsOpen = $detCont.find('details.open, details[open]').length;
			//if, after the details is opened or closed...
			if (detailsOpen == totalDetails) {//all details are open, enable collapse all button and disable expand all button
				$detCont.find('button.collapse').removeAttr('disabled');
				$detCont.find('button.expand').attr('disabled', 'disabled');
			} else if (totalDetails > detailsOpen && detailsOpen > 0) {//some but not all details are open, enable collapse all button
				$detCont.find('button.collapse').removeAttr('disabled');
				$detCont.find('button.expand').removeAttr('disabled');
			} else {//no details are open, disable collapse all button and enable expand all button
				$detCont.find('button.collapse').attr('disabled', 'disabled');
				$detCont.find('button.expand').removeAttr('disabled');
			}
		}
		//if page URL links to frag id, reset location to frag id once details/summary view is set
		if(window.location.hash) {
			var hash = window.location.hash;
			window.location = hash;
			//if frag id is for a summary element, expand the parent details element
			if ($(hash).prop('tagName') == "SUMMARY") {
				expandReferredDetails(hash);
			}
		}

	  // Add a hook to expand referred details element when <a> whose @href is fragid of a <summary> is clicked.
	  $('a[href^="#"]').each(function() {
	  	var fragId = $(this).attr('href');
	  	if ($(fragId).prop('tagName') == "SUMMARY") {
	  		$(this).on('click', function() {  			
		  		expandReferredDetails(fragId);
		  	});
	  	}
	  });

	};

	function expandReferredDetails(summaryFragId)	{
		//if details element is not open, activate click on summary
		if (!$(summaryFragId).parent().prop('open')) {
			$(summaryFragId).click();
		}
	}

	if (respecEvents) {
		// Fix the scroll-to-fragID:
		// - if running with ReSpec, do not invoke the mapping tables script until
		//   ReSpec executes its own scroll-to-fragID.
		// - if running on a published document (no ReSpec), invoke the mapping tables
		//   script on document ready.
		respecEvents.sub ("start", function (details) {
			if (details === "core/location-hash") {
				mappingTables();
			}
		});
		// Subscribe to ReSpec "save" message to set the mapping tables to
		// view-as-single-table state.
		respecEvents.sub ("save", function (details) {
			mappingTableInfos.forEach (function (item) {
				viewAsSingleTable (item);
			});
		});
	} else {
		mappingTables();
	}
}
