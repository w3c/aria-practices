const assert = require('assert');

/**
 * Confirm the roving tabindex has been initialized for a list of elements.
 *
 * @param {object} t                   - ava execution object
 * @param {string} elementsSelector - selector for elements which have roving tabindex
                                      by default, focus should be on the first item
 * @param {webdriver.Key} key       - which key to change roving focus between items
 */
module.exports = async function assertRovingTabindex(t, elementsSelector, key) {
  // tabindex='0' is expected on the first element
  let elements = await t.context.queryElements(t, elementsSelector);

  // test only one element has tabindex="0"
  for (let tabbableEl = 0; tabbableEl < elements.length; tabbableEl++) {
    for (let el = 0; el < elements.length; el++) {
      let tabindex = el === tabbableEl ? '0' : '-1';

      assert.equal(
        await elements[el].getAttribute('tabindex'),
        tabindex,
        'focus is on element ' +
          tabbableEl +
          ' of ' +
          elements.length +
          ' elements "' +
          elementsSelector +
          '", therefore tabindex on element ' +
          el +
          ' should be "' +
          tabindex
      );
    }

    // Send the tabindex="0" element the appropriate key to switch focus to the next element
    await elements[tabbableEl].sendKeys(key);
  }

  t.pass();
};
