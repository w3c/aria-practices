const { By } = require('selenium-webdriver');

/**
 * Return an array of elements by selector. Wraps Selenium's findElements, but with a failing text for empty queries
 *
 * @param {ExecutionContext} t - Test execution context
 * @param {string} selector - CSS selector string
 * @param {Element} message - Element to query within, defaulting to t.context.session
 * @returns {Promise} Resolves to array of elements
 */
module.exports = async function assertNoElements(t, selector, message) {
  // eslint-disable-next-line no-restricted-properties
  const elements = await t.context.session.findElements(By.css(selector));
  const errorMessage =
    message || 'Should return no results for CSS selector ' + selector;

  t.is(elements.length, 0, errorMessage);
};
