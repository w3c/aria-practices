const assert = require('assert');

/**
 * Assert a given attribute does not exist on all elements selected by selector
 *
 * @param {object} t            - ava execution object
 * @param {string} selector  - elements to test
 * @param {string} attribute - attribute that should not exist
 */
module.exports = async function assertAttributeDNE(t, selector, attribute) {
  const numElements = (await t.context.queryElements(t, selector)).length;

  for (let index = 0; index < numElements; index++) {
    const attributeExists = await t.context.session.executeScript(
      function () {
        let [selector, index, attribute] = arguments;
        let elements = document.querySelectorAll(selector);
        return elements[index].hasAttribute(attribute);
      },
      selector,
      index,
      attribute
    );

    assert(
      !attributeExists,
      'Attribute "' +
        attribute +
        '" should not exist on element at index ' +
        index +
        ' of elements found by selector "' +
        selector +
        '"'
    );
  }

  t.pass();
};
