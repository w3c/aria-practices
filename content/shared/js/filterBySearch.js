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
 * @description
 * This function filters the list items within a specified container by comparing the text content
 * of elements with a given class name to the provided search term. List items that do not match
 * the search term will be hidden.
 */
aria.Filter.filterListItems = function (
  searchTerm,
  containerSelector,
  className
) {
  const container = document.querySelector(containerSelector);
  const listItems = container.getElementsByTagName('li');
  const filter = searchTerm.toUpperCase();
  Array.from(listItems).forEach((element) => {
    aria.Filter.applyFilterToElement(element, filter, className);
  });
};

/**
 * This function checks if the text content of the child element with the specified class name contains the filter term.
 * If the text content matches the filter, th
 *
 * @function applyFilterToElement
 * @param {HTMLElement} element - The element to which the visibility filter will be applied.
 * @param {string} filter - The text filter term, already converted to uppercase.
 * @param {string} className - The class name of the child element whose text content is checked against the filter.
 */
aria.Filter.applyFilterToElement = function (element, filter, className) {
  const targetElement = element.getElementsByClassName(className)[0];
  if (targetElement) {
    const textValue = targetElement.textContent || targetElement.innerText;
    element.style.display = aria.Filter.isTextMatch(textValue, filter)
      ? ''
      : 'none';
  }
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
