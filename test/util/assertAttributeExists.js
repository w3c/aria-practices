const assert = require('assert');

/**
 * Assert a given attribute does exist on all elements selected by selector
 *
 * @param {obj} t            - ava execution object
 * @param {String} selector  - elements to test
 * @param {String} attribute - attribute that should exist
 */
module.exports = async function assertAttributeExists(t, selector, attribute) {
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
      attributeExists,
      'Attribute "' +
        attribute +
        '" should exist on element at index ' +
        index +
        ' of elements found by selector "' +
        selector +
        '"'
    );
  }

  t.pass();
};
