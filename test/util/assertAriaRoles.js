'use strict';

const assert = require('assert');

/**
 * Confirm the specificed aria role is found on an expected number of elements
 * and an expected element type.
 *
 * @param {obj} t             - ava execution object
 * @param {String} exampleId  - the id of the element containing the example
 * @param {String} role       - an aria role
 * @param {String} roleCount  - the number of elements with role set for example
 * @param {String} elementTag - the element the role should be found on
 */

module.exports = async function assertAriaRoles (t, exampleId, role, roleCount, elementTag) {
  const elementSelector = '#' + exampleId + ' [role="' + role + '"]';

  const elements = await t.context.queryElements(t, elementSelector);

  assert.equal(
    elements.length,
    roleCount,
    roleCount + ' role="' + role + '" elements should be found by selector "' + elementSelector +
      '" in this example'
  );

  for (let element of elements) {
    assert.equal(
      await element.getTagName(),
      elementTag,
      'role="' + role + '" should be found on "' + elementTag + '" elements in this example'
    );
  }

  t.pass();
};
