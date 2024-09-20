'use strict';

/**
 * @namespace aria
 */

var aria = aria || {};

/* ---------------------------------------------------------------- */
/*                  ARIA Filter Namespace                           */
/* ---------------------------------------------------------------- */

aria.Filter = aria.Filter || {};

/**
 * Filters list items within a container based on a search term.
 *
 * @function
 * @memberof aria.Filter
 * @param {string} searchTerm - The term to filter the list items by.
 * @param {string} containerSelector - The CSS selector for the container holding the list items.
 * @param {string} className - The class name of the elements within each list item to be checked against the search term.
 * @param {string} noResultsElementId - The id of the element to show when no results are found.
 * @description
 * This function filters the list items within a specified container by comparing the text content
 * of elements with a given class name to the provided search term. List items that do not match
 * the search term will be hidden.
 */
aria.Filter.filterListItems = function (
  searchTerm,
  containerSelector,
  className,
  noResultsElementId
) {
  const container = document.querySelector(containerSelector);
  const listItems = container.getElementsByTagName('li');
  const filter = searchTerm.toUpperCase();
  let hasResults = false;
  Array.from(listItems).forEach((element) => {
    const isMatch = aria.Filter.applyFilterToElement(
      element,
      filter,
      className
    );
    if (isMatch) {
      hasResults = true;
    }
  });
  aria.Filter.updateVisibility(noResultsElementId, !hasResults);
};

/**
 * Updates the visibility of an element based on the search results.
 *
 * @function updateVisibility
 * @param {string} id - The id of the element to update.
 * @param {boolean} isVisible - True if the element should be visible, false otherwise.
 */
aria.Filter.updateVisibility = function (id, isVisible) {
  const el = document.getElementById(id);
  el.style.display = isVisible ? '' : 'none';
  el.setAttribute('aria-hidden', String(!isVisible));
};

/**
 * This function checks if the text content of the child element with the specified class name contains the filter term.
 * If the text content matches the filter, th
 *
 * @function applyFilterToElement
 * @param {HTMLElement} element - The element to which the visibility filter will be applied.
 * @param {string} filter - The text filter term, already converted to uppercase.
 * @param {string} className - The class name of the child element whose text content is checked against the filter.
 * @returns {boolean} True if the filter term is found in the text value, false otherwise.
 */
aria.Filter.applyFilterToElement = function (element, filter, className) {
  const targetElement = element.getElementsByClassName(className)[0];
  if (targetElement) {
    const textValue = targetElement.textContent || targetElement.innerText;
    const isMatch = aria.Filter.isTextMatch(textValue, filter);
    element.style.display = isMatch ? '' : 'none';
    return isMatch;
  }
  return false;
};

/**
 * Clears the input element and filters the list items based on the empty string.
 * Sets focus back to the input element.
 *
 * @param {HTMLElement} inputElement - The input element to clear.
 * @param {string} containerSelector - The CSS selector for the container holding the list items.
 * @param {string} className - The class name of the elements within each list item to be checked against the search term.
 * @param {string} noResultsElementId - The id of the element to show when no results are found.
 */
aria.Filter.clearInput = function (
  inputElement,
  containerSelector,
  className,
  noResultsElementId
) {
  inputElement.value = '';
  aria.Filter.filterListItems(
    '',
    containerSelector,
    className,
    noResultsElementId
  );
  inputElement.focus();
};

/**
 * Determines if the provided text value contains the filter term, ignoring case.
 *
 * @function isTextMatch
 * @param {string} textValue - The text to search within.
 * @param {string} filter - The term to search for, which should already be in uppercase.
 * @returns {boolean} True if the filter term is found in the text value, false otherwise.
 */
aria.Filter.isTextMatch = function (textValue, filter) {
  return textValue.toUpperCase().indexOf(filter) > -1;
};

/**
 * Handles the click event for a pattern results view button.
 *
 * @param {HTMLElement} selectedViewButton - The view button that was clicked.
 */
aria.Filter.onViewButtonClicked = function (selectedViewButton) {
  aria.Filter.deactivateAllViewButtons();
  aria.Filter.updateActiveViewButton(selectedViewButton);

  const newViewClassName = aria.Filter.getNewViewClassName(selectedViewButton);
  aria.Filter.setResultsViewClass(newViewClassName);
};

/**
 * Deactivates all view buttons by setting aria-pressed attribute and removing 'active' class
 */
aria.Filter.deactivateAllViewButtons = function () {
  const buttons = document.querySelectorAll('.view-toggle button');
  buttons.forEach((btn) => {
    btn.setAttribute('aria-pressed', 'false');
    btn.classList.remove('active');
  });
};

/**
 * Determines the new view class name based on the selected view button.
 *
 * @param {HTMLElement} selectedViewButton - The view button that was clicked.
 * @returns {string} The new view class name.
 */
aria.Filter.getNewViewClassName = function (selectedViewButton) {
  return selectedViewButton.id === 'listViewButton' ? 'list' : 'tiles';
};

/**
 * Updates the active view button by setting aria-pressed attribute and adding 'active' class
 *
 * @param {HTMLElement} selectedViewButton - The view button that was clicked.
 */
aria.Filter.updateActiveViewButton = function (selectedViewButton) {
  selectedViewButton.setAttribute('aria-pressed', 'true');
  selectedViewButton.classList.add('active');
};

/**
 * Sets the class name of the patterns result container to either 'list' or 'tiles' based on the selected view button
 *
 * @param {string} viewClass - The class name of the patterns result container.
 */
aria.Filter.setResultsViewClass = function (viewClass) {
  const patternsContainer = document.getElementById('patterns');
  patternsContainer.className = viewClass;
};
