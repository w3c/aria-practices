/**
 * Confirm the continuous subset of elements are in tab order for a test page
 *
 * @param {object} t                   - ava execution object
 * @param {string} selector  - element selector string
 * @param {string} message          - optional assertion message
 */
module.exports = async function assertHasFocus(t, selector, message) {
  const hasFocus = t.context.session.wait(
    async function () {
      return t.context.session.executeScript(function () {
        selector = arguments[0];
        return document.activeElement === document.querySelector(selector);
      }, selector);
    },
    t.context.waitTime,
    'Timeout waiting for focus to land on element: ' + selector
  );

  message = message || `Element ${selector} should have focus`;
  t.true(await hasFocus, message);
};
