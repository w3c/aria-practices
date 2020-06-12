'use strict';

const { By } = require('selenium-webdriver');
const assert = require('assert');

/**
 * Confirm the dot value value of an element in javascript (testing the IDL Interface)
 *
 * @param {obj} t                  - ava execution object
 * @param {String} elementSelector - a selector that returns one element
 * @param {String} attr            - the attribute to access by javascript dot notation
 * @param {String} value           - the value of the attribute
 */

module.exports = async function assertDotValue (t, elementSelector, attr, value) {

    let valueOfAttr = await t.context.session.executeScript(async function () {
      const [selector, attr, value] = arguments;
      let el = document.querySelector(selector);
      return el[attr];
    }, elementSelector, attr, value);

    assert.equal(
      valueOfAttr,
      value,
      'attribute `' + attr + '` with value `' + value + '` should be found on javascript node returned by: ' + elementSelector
    );

    t.pass();
};
