const { By } = require('selenium-webdriver');

/**
 * Return the first element found by selector. Wraps Selenium's findElement, but with a failing text for empty queries
 *
 * @param {ExecutionContext} t - Test execution context
 * @param {string} selector - CSS selector string
 * @param {Element} context - Element to query within, defaulting to t.context.session
 * @returns {Promise} Resolves to an element
 */
module.exports = async function queryElement(t, selector, context) {
  context = context || t.context.session;
  const result = await context.findElement(By.css(selector));
  if (!result) {
    t.fail(`Element query returned no result: ${selector}`);
  }
  return result;
};
