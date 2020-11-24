const { By } = require('selenium-webdriver');

/**
 * Return an array of elements by selector. Wraps Selenium's findElements, but with a failing text for empty queries
 *
 * @param {ExecutionContext} t - Test execution context
 * @param {String} selector - CSS selector string
 * @param {Element} context - Element to query within, defaulting to t.context.session
 * @param {Boolean} noTest - When true, allow empty results
 *
 * @returns {Promise} Resolves to array of elements
 */
module.exports = async function queryElements(t, selector, context, noTest) {
  if (typeof noTest !== 'boolean') {
    noTest = false;
  }
  context = context || t.context.session;
  // eslint-disable-next-line no-restricted-properties
  const result = await context.findElements(By.css(selector));
  if (!noTest && result.length === 0) {
    t.fail(`Element query returned no results: ${selector}`);
  }
  return result;
};
