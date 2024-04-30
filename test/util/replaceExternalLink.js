/**
 * Replace and href with an link -- typically use url fragment -- to test behavior related to link following
 *
 * @param {ExecutionContext} t - Test execution context
 * @param {string} newUrl - the url to replace the external url
 * @param {string} linkSelector - CSS selector string
 * @param {number} index - if the link selector returns a list, the index of the item to test
 * @returns {Promise} Resolves to array of elements
 */
module.exports = async function replaceExternalLinks(
  t,
  newUrl,
  linkSelector,
  index
) {
  await t.context.session.executeScript(
    function () {
      let [selector, index, newUrl] = arguments;
      document.querySelectorAll(selector)[index].href = newUrl;
    },
    linkSelector,
    index || 0,
    newUrl
  );
};
