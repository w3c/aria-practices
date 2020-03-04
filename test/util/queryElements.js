/* eslint no-restricted-properties: 0 */

'use strict';

const { By } = require('selenium-webdriver');

/**
 * Return an array of elements by selector. Wraps Selenium's findElements, but with a failing text for empty queries
 *
 * @param {String} selector - CSS selector string
 * @param {Element} context - Element to query within, defaulting to t.context.session
 *
 * @returns {Promise} Resolves to array of elements
 */
module.exports = async function queryElements(t, selector, context) {
  context = context || t.context.session;
  const result = await context.findElements(By.css(selector));
  if (result.length === 0) {
    t.fail(`Element query returned no results: ${selector}`);
    return [];
  }
  else {
    return result;
  }
}
