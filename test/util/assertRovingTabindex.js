'use strict';

const { By } = require('selenium-webdriver');
const assert = require('assert');

/**
 * Confirm the roving tabindex has been initialized for a list of elements.
 *
 * @param {obj} t                   - ava execution object
 * @param {String} elementsSelector - selector for elements which have roving tabindex
                                      by default, focus should be on the first item
 * @param {webdriver.Key} key       - which key to change roving focus between items
 */
module.exports = async function assertRovingTabindex (t, elementsSelector, key) {

  // tabindex='0' is expected on the first element
  let elements = await t.context.session.findElements(By.css(elementsSelector));

  assert.ok(
    elements.length,
    'CSS elector returned no results: ' + elementsSelector
  );

  // test only one element has tabindex="0"
  for (let tabableEl = 0; tabableEl < elements.length; tabableEl++) {
    for (let el = 0; el < elements.length; el++) {

      let tabindex = el === tabableEl ? '0' : '-1';

      assert.equal(
        await elements[el].getAttribute('tabindex'),
        tabindex,
        'focus is on element ' + tabableEl + ' of ' + elements.length + ' elements "' + elementsSelector +
          '", therefore tabindex on element ' + el + ' should be "' + tabindex
      );
    }

    // Send the tabindex="0" element the appropriate key to switch focus to the next element
    await elements[tabableEl].sendKeys(key);
  }

  t.pass();
};

