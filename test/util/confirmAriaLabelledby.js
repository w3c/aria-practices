'use strict';

const { By } = require('selenium-webdriver');

/**
 * Confirm the aria-labelledby element.
 * Contains 2 assertions.
 *
 * @param {obj} t                  - ava execution object
 * @param {String} exampleId       - the id of the container element within the label must exist
 * @param {String} elementSelector - the element with aria-labelledby set
 */

module.exports = async function confirmAriaLabelledby (t, exampleId, elementSelector) {
  let labelId = await t.context.session
    .findElement(By.css(elementSelector))
    .getAttribute('aria-labelledby');

  t.truthy(
    labelId,
    '"aria-labelledby" attribute should exist on: ' + elementSelector
  );

  let labelElement = await t.context.session
    .findElement(By.id(exampleId))
    .findElement(By.id(labelId));

  t.truthy(
    await labelElement.getText(),
    'Element with id "' + labelId + '" should contain label text in example: ' + exampleId
  );
};
